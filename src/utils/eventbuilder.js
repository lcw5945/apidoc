const EventBuild  =  function (that) {
    var registry = {};
    that.fire = function (type,data) {
        var array,
            func,
            handler,
            i;
        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            for (i = 0; i < array.length; i++) {
                handler = array[i];
                func = handler.method;
                if (typeof func === 'string') {
                    func = this[func];
                }
                func.apply(this, [{"data":data,"onData":handler.data,"event":event}]);
                if(handler.guid == 1){
                    this.off(type,func);
                }
            }
        }
        return this;
    };

    that.on = function (type, method, data,guid) {
        var handler = {
            method: method,
            data: data,
            guid:guid
        };
        if (registry.hasOwnProperty(type)) {
            registry[type].push(handler);
        } else {
            registry[type] = [handler];
        }
        return this;
    };

    that.off = function(type,method){
        var array,
            handler,
            i;
        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            if(method && array.length>0){
                for (i = 0; i < array.length; i++) {
                    handler = array[i];
                    if(handler.method==method)
                        array.splice(i,1);
                }
                registry[type] = array;
            }else{
                delete registry[type];
            }
        }
        return this;
    };

    that.one = function(type, method, data){
        this.on(type, method, data,1);
        return this;
    };

    that.has = function (type, method) {
        var array,
            handler,
            result,
            i;
        result = false;
        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            if(method && array.length>0){
                for (i = 0; i < array.length; i++) {
                    handler = array[i];
                    if(handler.method==method)
                        result = true;
                }
                registry[type] = array;
            }else{
                delete registry[type];
            }
        }
        return result;
    };

    that.stop = function (type) {
        if (registry.hasOwnProperty(type)) {
            delete registry[type];
        }
        return this;
    };
    return that;
};

export default EventBuild;