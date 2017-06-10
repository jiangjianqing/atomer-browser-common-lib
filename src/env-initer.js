/**
 * Created by cz_jjq on 17-6-10.
 */

function EnvIniter(){
  	// 定义共享环境
	this.shareEnvCallbacks = [function(){

	}];

	//定义独立环境
	this.envCallbacks = {
	  'development' : [function(){}],
	  'production' : [function(){}]
	}
}

EnvIniter.prototype.configureProduction = function(callback){

  this.envCallbacks['production'].push(callback);

};

EnvIniter.prototype.configureDevelopment = function(callback){

  this.envCallbacks['development'].push(callback);

};

EnvIniter.prototype.configure = function(envName, callback){
  if (typeof envName === "function"){
    callback = envName;
    envName = undefined;
	this.shareEnvCallbacks.push(callback);
    return;
  }

  this.envCallbacks[envName].push(callback);

};

//init 一定要最后调用，其会根据环境类型执行所有的初始化
EnvIniter.prototype.init = function(envName, callback){
  if(!callback || typeof callback !== "function"){
	callback = function(err){
	  if (err){
	    console.error(err);
	  }
	};
  }
  this.shareEnvCallbacks.forEach(function(envCb){
	envCb();
  });

  if (!this.envCallbacks[envName]){
	callback(new Error(`EnvIniter :  env not exist : ${envName}`));
    return;
  }

  this.envCallbacks[envName].forEach(function(envCb){
	envCb();
  });
  callback();//表示正常处理结束
};

module.exports = EnvIniter;
