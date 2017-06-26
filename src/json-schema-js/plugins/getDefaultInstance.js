/**
 * Created by jjq on 6/26/17.
 */

const TEMP_REF_PROP_NAME = '$tempRefProp$';
let clone = require('../../utils').lang.clone;

let generateDefaultValue =  function(schema_stack, object_stack){
    let sl = schema_stack.length - 1,ol = object_stack.length - 1;
    let schema = schema_stack[sl],object = object_stack[ol].object;
    let name = object_stack[ol].key,prop = null;//prop指向当前处理的对象，其实返回时才需要使用
    let uicontrol = schema["uicontrol"];//获取uicontrol信息,dont care any type
    let parentSchema = null;
    if(sl > 0){//如果不是堆栈底部，则获取父级schema
        parentSchema = schema_stack[sl - 1];
    }

    if(object){//如果对象存在（第一次迭代时一定为null）

    }

    if(schema.hasOwnProperty("type")){

        if(typeof schema.type === "string"){

            if(this.fieldDefaultValue.hasOwnProperty(schema.type)){
                prop = this.fieldDefaultValue[schema.type](schema);
                object_stack.push(this.buildObjectStackItem(prop,name));
            }else{
                throw new Error("fieldDefaultValue中 Type=" + schema.type + "没有设定DefaultValue处理");
            }
            //observer.next({"parentSchema":parentSchema,"currentSchema":{"name":name,"schema":schema}});

            if (schema.type === "object" && schema.properties && typeof schema.properties === "object"){
                for(let v in schema.properties){

                    let new_schema_stack = clone(schema_stack);
                    //如果出现$ref，则生成新的schema_stack，并重新处理
                    if(schema.properties[v].hasOwnProperty("$ref")){
                        new_schema_stack = this.resolveURI(new_schema_stack,schema.properties[v].$ref);
                    }else{
                        new_schema_stack.push(schema.properties[v]);
                    }
                    /*start 开始处理parent与current的对应关系，初始化TEMP_REF_PROP_NAME*/
                    let new_schema = new_schema_stack[new_schema_stack.length - 1];
                    if(schema.properties[v].hasOwnProperty("$ref")){
                        new_schema[TEMP_REF_PROP_NAME] = v;
                    }

                    let parentName = null;
                    if(schema[TEMP_REF_PROP_NAME]){
                        parentName = schema[TEMP_REF_PROP_NAME];
                    }
                    //observer.next({"parentSchema":{"name":parentName,"uicontrol":parentSchema?parentSchema["uicontrol"]:null,"schema":parentSchema},"currentSchema":{"name":v,"uicontrol":new_schema["uicontrol"],"schema":new_schema}});

                    //生成默认值只需要建schema_stack，并不需要用object_stack
                    //let new_object_stack:ObjectStackItem[]=clone(object_stack);
                    //new_object_stack.push(this.buildObjectStackItem());
                    prop[v] = this.generateDefaultValue(new_schema_stack,object_stack);

                    /*end 完成TEMP_REF_PROP_NAME 的处理，进行清理工作*/
                    if(new_schema[TEMP_REF_PROP_NAME]){
                        delete new_schema[TEMP_REF_PROP_NAME];
                    }
                }
            }
        }else if(Array.isArray(schema.type)){//如果type是数组，则只能使用default字段的值，否则报错
            prop = this.fieldDefaultValue["array"](schema);
            object_stack.push(prop);
        }
        else{
            throw new Error("fieldDefaultValue中 Type=" + schema.type + "没有合适的方法进行处理，仅支持string和array");
        }
    }else{
        throw new Error(JSON.stringify(schema) + "缺少 type字段");
    }
    //console.log(object_stack);

    return prop;
};

let getDefaultInstance = function(schema){
    let object_stack = [this.buildObjectStackItem(null)];
    let schema_stack;
    if (typeof schema === "string" ){
        schema_stack = [this.schema[schema]];
    }else{
        schema_stack = [schema]
    }

    //let observable:Observable<string>=new Observable<string>();
    //observable.subscribe(observer);
    return this.generateDefaultValue(schema_stack,object_stack);
};

module.exports = {
    "getDefaultInstance" : getDefaultInstance,
    "generateDefaultValue" : generateDefaultValue
};