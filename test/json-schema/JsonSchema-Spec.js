/**
 * Created by ztxs on 16-11-28.
 */
var JsonSchema = require('../../src').JsonSchema;
var fs = require('fs');
var userSchema = JSON.parse(fs.readFileSync(__dirname + '/resources/user-schema.json', 'utf8')); //使用替换机制,brfs

var assert = require('assert');
var should = require('chai').should(); //注意：使用should()后会污染js中对象的原型对象
var expect = require('chai').expect;


describe('Json Schema Test', () => {

    it('function incorrect test', done => {
        var jsonSchema = new JsonSchema();
        jsonSchema.addSchema('userSchema', userSchema);
        let ret = jsonSchema.validate({"name" : "1.1" , "getProperty" : "123"}, 'userSchema');
        console.log(ret);
        console.log(jsonSchema.getDefaultInstance('userSchema'));
        expect(ret.errors["getProperty"]["type"]).to.be.equal("function");
        done()
    });

    it('function correct test', done => {
        var jsonSchema = new JsonSchema();
        jsonSchema.addSchema('userSchema', userSchema);
        let ret = jsonSchema.validate({"name" : "1.1" , "getProperty" : function(){}}, 'userSchema');
        console.log(ret);
        console.log(jsonSchema.getDefaultInstance('userSchema'));
        expect(ret.valid).to.be.equal(true);
        done();
    });

});


