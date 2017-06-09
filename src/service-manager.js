/**
 * Created by jjq on 5/18/17.
 */
let services = {};
function ServiceManager(){

}

ServiceManager.prototype.get = function(serviceName){
    return services[serviceName];
};

ServiceManager.prototype.set = function(serviceName, service){
    services[serviceName] = service ;
};

module.exports = new ServiceManager();