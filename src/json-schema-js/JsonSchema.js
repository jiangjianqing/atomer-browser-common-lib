/**
 * Created by ztxs on 16-11-28.
 */
'use strict';

var clone = require('../utils').lang.clone,
    createFieldType = require('./lib/createFieldType'),
    createFieldFormat = require('./lib/createFieldFormat'),
    createFieldDefaultValue = require('./lib/createFieldDefaultValue'),
    createHandled = require('./lib/createHandled'),
    createFieldValidate = require('./lib/createFieldValidate');

//定义堆栈最上层堆栈的key
const ROOT_KEY_NAME = '__root__';

function JsonSchema() {

    this.ROOT_KEY_NAME = ROOT_KEY_NAME;
    this.fieldType = createFieldType();
    this.fieldFormat = createFieldFormat();
    this.fieldValidate = createFieldValidate();
    this.fieldDefaultValue = createFieldDefaultValue();//根据字段类型获取默认值
    this.handled = createHandled();//设定不需要处理的prop名称

    //默认操作
    this.defaultOptions = {
        useDefault: false,
        useCoerce: false,
        checkRequired: true,
        removeAdditional: false
    };

    this.schema = {};
    this.coerceType = {}; //只有当前 schema 的 "type" = "string" 才会使用

}

JsonSchema.prototype.normalizeID = function(id) {
    return id.indexOf("://") === -1 ? id : id.split("#")[0];
};

JsonSchema.prototype.addType = function(name, func) {
    this.fieldType[name] = func;
};

JsonSchema.prototype.addTypeCoercion = function(type, func) {
    this.coerceType[type] = func;
};

JsonSchema.prototype.addCheck = function(name, func) {
    this.fieldValidate[name] = func;
};

JsonSchema.prototype.addFormat = function(name, func) {
    this.fieldFormat[name] = func;
};

JsonSchema.prototype.addSchema = function(name,schema){
    if(!schema && name){
        schema = name;
        name = undefined;
    }
    if(schema.hasOwnProperty("id") && typeof schema.id === "string" && schema.id !== name){
        if(schema.id.charAt(0) === "/"){
            throw new Error("schema id\'s starting with / are invalid.")
        }
        this.schema[this.normalizeID(schema.id)] = schema;
    }else if(!name){
        throw new Error("schema needs either a name or id attribute.");
    }
    if(name){
        this.schema[this.normalizeID(name)] = schema;
    }
};

/**
 *解析当前的uri并获取需要的schema堆栈（需要支持3种分布式定义：definitions、扩展信息管理、http）
 * @param {Array} schema_stack - 当前schema_stack
 * @param {string}  uri -（比如 $ref中指向的路径，json pointer）
 * @returns {any} schema堆栈，null代表失败
 */
JsonSchema.prototype.resolveURI = function(schema_stack, uri) {
    let name = uri;//name默认等于uri

    let hash_idx = uri.indexOf('#');//json reference

    if (hash_idx !== 0) {
        if (hash_idx > 0) {
            name = uri.substr(0, hash_idx);//name可能是http地址
            uri = uri.substr(hash_idx + 1);//获取#后面的内容
        } else {
            uri = '';//将uri清空，可以防止后续对uri的分割处理
        }
        //let http_idx = name.indexOf('http://');//是否指向http schema，这里需要访问扩展信息管理服务

        if (!this.schema.hasOwnProperty(name)) { //如果当前还没有绑定name指定的schema
            if (schema_stack && schema_stack[0].id === name){ //如果schema_stack最底层的id与uri的name部分相同（处理还不完善）
                schema_stack = [schema_stack[0]];  //设置schema_stack[0]作为栈底
            }else{
                return null;//没有找到合适的schema用于处理，这里需要考虑异常处理
            }
        } else{
            schema_stack = [this.schema[name]]; //设置为name指向的schema作为栈底
        }
    } else {//格式如： #/abc/def
        if (!schema_stack){
            return null;
        }
        uri = uri.substr(1); //去除第一个#，获取#后面的内容
    }

    if (uri === ''){ //如果是# 则指向栈底（一般为root元素的id指向的schema）
        return [schema_stack[0]];
    }
    if (uri.charAt(0) === '/') { //格式为/abc/def
        uri = uri.substr(1);
        let curschema = schema_stack[0];//指向栈底
        let components = uri.split('/');// [abc,def]
        while (components.length > 0) {
            if (!curschema.hasOwnProperty(components[0])){// 如果curschema没有找到指定属性，如找不到abc，则返回null
                return null;
            }
            curschema = curschema[components[0]]; //更改curschema指向curschema["abc"]
            schema_stack.push(curschema);//更新堆栈
            components.shift();//移除components[0]
        }
        return schema_stack;
    } else{ // 这里表示格式存在错误，必须形如：#/abc/def这样
        return null;
    }
};

JsonSchema.prototype.resolveObjectRef = function(object_stack, uri) {
    var components, object, last_frame = object_stack.length - 1, skip_frames, frame, m = /^(\d+)/.exec(uri);

    if (m) {
        uri = uri.substr(m[0].length);
        skip_frames = parseInt(m[1], 10);
        if (skip_frames < 0 || skip_frames > last_frame)
            return null;
        frame = object_stack[last_frame - skip_frames];
        if (uri === '#')
            return frame.key;
    } else
        frame = object_stack[0];

    object = frame.object[frame.key];

    if (uri === '')
        return object;

    if (uri.charAt(0) === '/') {
        uri = uri.substr(1);
        components = uri.split('/');
        while (components.length > 0) {
            components[0] = components[0].replace(/~1/g, '/').replace(/~0/g, '~');
            if (!object.hasOwnProperty(components[0]))
                return null;
            object = object[components[0]];
            components.shift();
        }
        return object;
    } else
        return null;
};

/**
 *主要方法，对object用指定的schema进行校验
 * @param {Object} object - instance / json data
 * @param {string|Object} schema - schema's name
 * @param {Object} options - control options
 * @returns {any} - validate state
 */
JsonSchema.prototype.validate = function(object, schema, options) {
    let schema_stack , object_stack = [this.buildObjectStackItem(object,ROOT_KEY_NAME)];

    if (typeof schema === 'string') {//schemaName指向当前已经通过addSchema添加的schema
        schema_stack = this.resolveURI(null, schema);
        if (!schema_stack)
            throw new Error(' could not find schema \'' + schema + '\'.');
    }else if(typeof schema === 'object'){//schemaName直接输入了schema
        schema_stack = [schema];
    }

    if (!options) {
        options = Object.assign({},this.defaultOptions);
    } else {
        for (let p in this.defaultOptions){
            if (this.defaultOptions.hasOwnProperty(p) && !options.hasOwnProperty(p))
                options[p] = this.defaultOptions[p];
        }
    }

    let errors = this.checkValidity(schema_stack, object_stack, options);

    if (errors){
        return {
            "valid": false,
            "errors": errors.hasOwnProperty('schema') ? errors.schema : errors
        }
    }
    return {
        "valid": true,
        "errors": []
    }
};

/**
 *json-schema validate的主体函数
 * @param {Array} schema_stack - schema堆栈
 * @param {Array} object_stack - instance堆栈
 * @param {Object} options - 验证选项
 * @returns {any} 错误信息，null表示验证成功
 */
JsonSchema.prototype.checkValidity = function(schema_stack, object_stack, options){
    let objerrs = {};//保存错误信息
    let sl = schema_stack.length - 1,ol = object_stack.length - 1;
    let schema = schema_stack[sl],object = object_stack[ol].object;//schema当前解析使用
    let name = object_stack[ol].key,prop = object[name];//name是当前对象的存储名，prop指向当前处理的对象
    let hasProp = false;//是否拥有properties属性
    let hasPatternProp = false;//是否拥有patternProperties属性
    let malformed = false;//校验是否通过的标志

    //如果出现$ref，则生成新的schema_stack，并重新处理
    if(schema.hasOwnProperty("$ref")){
        schema_stack = this.resolveURI(schema_stack,schema.$ref);
        if(!schema_stack){
            return { "$ref" : schema.$ref };
        }else{
            return this.checkValidity(schema_stack,object_stack,options);
        }
    }

    if(schema.hasOwnProperty("type")){
        if(typeof schema.type === "string"){
            //如果设定了coerce，则代替其值
            if (options.useCoerce && this.coerceType.hasOwnProperty(schema.type)){
                prop = object[name] = this.coerceType[schema.type](prop);//将当前处理对象的name属性进行数据替换
            }
            //如果fieldType校验失败，则返回错误信息
            if(!this.fieldType[schema.type](prop)){
                return {'type': schema.type};
            }
        }else{//deprecated : 这里假定type为array,效果与anyOf相同，后面准备将该段代码删除
            malformed = true;
            for(let i = 0,len = schema.type.length;i < len && malformed;i++){
                if(this.fieldType[schema.type[i]](prop)){
                    malformed = false;
                }
            }
            if(malformed){
                return {'type': schema.type};
            }
        }
    }

    if (!Array.isArray(prop)) { //如果不是数组，则当对象处理
        var props = [];//当prop是一个对象的时候，props记录当前prop拥有的所有属性
        objerrs = {};
        for (let p in prop){//这里生成props
            if (prop.hasOwnProperty(p))
                props.push(p);
        }

        //检查required中描述的属性是否都已经存在
        if (options.checkRequired && schema.required) {
            for (let i = 0, len = schema.required.length; i < len; i++)
                if (!prop.hasOwnProperty(schema.required[i])) {
                    objerrs[schema.required[i]] = {'required': true};
                    malformed = true;
                }
        }

        hasProp = schema.hasOwnProperty('properties');
        hasPatternProp = schema.hasOwnProperty('patternProperties');
        if (hasProp || hasPatternProp) {
            let i = props.length;
            while (i--) {
                let matched = false;
                if (hasProp && schema.properties.hasOwnProperty(props[i])) {
                    matched = true;
                    let objerr = this.checkValidity(schema_stack.concat(schema.properties[props[i]]), object_stack.concat({object: prop, key: props[i]}), options);
                    if (objerr !== null) {
                        objerrs[props[i]] = objerr;
                        malformed = true;
                    }
                }
                if (hasPatternProp) {
                    for (let p in schema.patternProperties)
                        if (schema.patternProperties.hasOwnProperty(p) && props[i].match(p)) {
                            matched = true;
                            let objerr = this.checkValidity(schema_stack.concat(schema.patternProperties[p]), object_stack.concat({object: prop, key: props[i]}), options);
                            if (objerr !== null) {
                                objerrs[props[i]] = objerr;
                                malformed = true;
                            }
                        }
                }
                if (matched)
                    props.splice(i, 1);
            }
        }
        //到这里特别注意：props中还留有properties中不存在的属性

        //如果prop没有被赋值，则将其赋予默认值
        if (options.useDefault && hasProp && !malformed) {
            for (let p in schema.properties)
                if (schema.properties.hasOwnProperty(p) && !prop.hasOwnProperty(p) && schema.properties[p].hasOwnProperty('default'))
                    prop[p] = clone(schema.properties[p]['default']);
        }
        //移除多余属性
        if (options.removeAdditional && hasProp && schema.additionalProperties !== true && typeof schema.additionalProperties !== 'object') {
            for (let i = 0, len = props.length; i < len; i++)
                delete prop[props[i]];
        } else {//正常处理流程
            if (schema.hasOwnProperty('additionalProperties')) {
                //如果additionalProperties是boolean型
                if (typeof schema.additionalProperties === 'boolean') {
                    //additionalProperties==false则不允许出现额外的属性
                    if (!schema.additionalProperties) {
                        for (let i = 0, len = props.length; i < len; i++) {
                            objerrs[props[i]] = {'additional': true};
                            malformed = true;
                        }
                    }
                } else {
                    //递归遍历所有额外的属性
                    for (let i = 0, len = props.length; i < len; i++) {
                        let objerr = this.checkValidity(schema_stack.concat(schema.additionalProperties), object_stack.concat({object: prop, key: props[i]}), options);
                        if (objerr !== null) {
                            objerrs[props[i]] = objerr;
                            malformed = true;
                        }
                    }
                }
            }
        }
        if (malformed){
            return {'schema': objerrs};
        }
    } else {//如果prop是一个数组
        if (schema.hasOwnProperty('items')) {
            if (Array.isArray(schema.items)) {//如果items是个数组，则表示在其中声明了对应数组每个元素的schema
                let count = schema.items.length;
                for (let i = 0, len = count; i < len; i++) {
                    let objerr = this.checkValidity(schema_stack.concat(schema.items[i]), object_stack.concat({object: prop, key: i}), options);
                    if (objerr !== null) {
                        objerrs[i] = objerr;
                        malformed = true;
                    }
                }
                if (prop.length > count && schema.hasOwnProperty('additionalItems')) {
                    if (typeof schema.additionalItems === 'boolean') {
                        if (!schema.additionalItems)
                            return {'additionalItems': true};
                    } else {//这里假设schema.additionalItems是一个对象，不像schema.items可以是个数组
                        for (let i = count, len = prop.length; i < len; i++) {
                            let objerr = this.checkValidity(schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
                            if (objerr !== null) {
                                objerrs[i] = objerr;
                                malformed = true;
                            }
                        }
                    }
                }
            } else {//如果items属性不是一个数组,则表示其为一个schema对象
                for (let i = 0, len = prop.length; i < len; i++) {
                    let objerr = this.checkValidity(schema_stack.concat(schema.items), object_stack.concat({object: prop, key: i}), options);
                    if (objerr !== null) {
                        objerrs[i] = objerr;
                        malformed = true;
                    }
                }
            }
        } else if (schema.hasOwnProperty('additionalItems')) {//if (!schema.hasOwnProperty('items')) ...
            if (typeof schema.additionalItems !== 'boolean') {
                for (let i = 0, len = prop.length; i < len; i++) {
                    let objerr = this.checkValidity(schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
                    if (objerr !== null) {
                        objerrs[i] = objerr;
                        malformed = true;
                    }
                }
            }
        }
        if (malformed)
            return {'schema': objerrs};
    }

    //如果没有类型问题，就会对其值进行验证。没有在handled中标记为已处理的部分都会进行格式验证
    for(let v in schema){
        if(schema.hasOwnProperty(v) && !this.handled.hasOwnProperty(v)){//如果该属性需要单独处理（format字段和校验字段）

            if(v === "format"){//属于格式化字段
                if(this.fieldFormat.hasOwnProperty(schema[v]) && !this.fieldFormat[schema[v]](prop,schema,object_stack,options)){
                    objerrs[v] = true;
                    malformed = true;
                }
            }else{//属于校验字段
                console.log("validate：对[ " + v + " ]字段进行校验");//这里用来观察是否有不需要处理的内容出现
                //如果v是包含$data字段的对象，则获取data的值并用来校验
                if(this.fieldValidate.hasOwnProperty(v) && !this.fieldValidate[v](prop, schema[v].hasOwnProperty('$data') ? this.resolveObjectRef(object_stack, schema[v].$data) : schema[v], schema, object_stack, options)){
                    objerrs[v] = true;
                    malformed = true;
                }
            }
        }
    }

    return malformed ? objerrs : null;
};

JsonSchema.prototype.buildObjectStackItem = function(object,name){
    let tempObj = {
        "object": {},
        "key": name
    };
    tempObj.object[name] = object;
    return tempObj;
};

JsonSchema.addPlugin = function(plugin){
    Object.keys(plugin).forEach(function(key){
        JsonSchema.prototype[key] = plugin[key];
    })
};

module.exports = JsonSchema;