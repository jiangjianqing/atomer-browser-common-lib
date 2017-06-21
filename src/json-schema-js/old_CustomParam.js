/**
 * Created by ztxs on 16-3-17.
 */
/*
interface Keyword{
    name:string;
    valid(parent:SchemaItem,current:SchemaItem):boolean;
}

interface SchemaItem{
    type?:string;
    properties?:Object;
    required?:Array<string>;
    description?:string;
    default?:string|number;
    title?:string;
}

interface KeywordArray{
    [index:string]:Keyword;
}

interface ObjectStackItem{
    object:any;
    key:string;
}

interface Options{
    useDefault:boolean;
    useCoerce: boolean;
    checkRequired: boolean;
    removeAdditional: boolean;
}

interface Schema{
    $ref?:string;
    $schema?:string;
    id?:string;
    type?:string;
    format?:string;
    description?:string;
    default?:any;
    properties?:any;
    uicontrol?:any;
    enum?:any[];

    maximum?:number;
    exclusiveMaximum?:boolean;
    minimum?:number;
    exclusiveMinimum?:boolean;
    maxLength?:number;
    minLength?:number;
    pattern?:string;
}

export interface HtmlTemplateValue{
    htmlTemplate:string;
    value:any;
}
*/

var clone = require('../framework/lib/lang/clone');



var CustomParam = {


    keywords:["type","properties","required","description","default","title"],
    keywordSet:{},//通过接口定义数组





    /**
     * 取得模式的默认值
     * @param schema 具有默认值设置的Schema对象
     * @returns {any} 携带默认值的json对象
     */
    getDefaultInstance : function(schema){
        var schema_stack = [schema], errors = null, object_stack = [this.buildObjectStackItem(null,ROOT_KEY_NAME)];
        //let observable:Observable<string>=new Observable<string>();
        //observable.subscribe(observer);
        return this.generateDefaultValue(schema_stack,object_stack,observer);
    }
}