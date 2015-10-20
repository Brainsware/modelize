var create_fn, destroy_fn, get_fn, lazy_get_fn, lazy_single_get_fn, relationship_fields, single_get_fn, update_fn;

relationship_fields = function(name, model, connector, options) {
  if (options == null) {
    options = {};
  }
  return [name + '_id', name + 's', name, window[model], connector, options];
};

get_fn = function(id_param, api_name, name, model, connector, options) {
  if (options == null) {
    options = {};
  }
  return (function(_this) {
    return function(params, callbackOrObservable) {
      var api, callback;
      if (params == null) {
        params = {};
      }
      callback = function(data) {
        var i, len, m, res;
        res = [];
        for (i = 0, len = data.length; i < len; i++) {
          m = data[i];
          res.push(model(m));
        }
        return _this[api_name](res);
      };
      if (typeof callbackOrObservable['push'] === 'undefined') {
        if (typeof callbackOrObservable !== 'function') {
          console.error('Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:');
          console.error(callbackOrObservable);
        }
        callback = callbackOrObservable;
      }
      api = connector.get(api_name);
      if (api == null) {
        console.error('No Connector found for resource "' + api_name + '" found: ', api);
        return false;
      }
      if (options.belongs_to != null) {
        return api.read(options.belongs_to, _this.id, params).done(callback);
      } else {
        return api.read(_this.id, params).done(callback);
      }
    };
  })(this);
};

single_get_fn = function(id_param, api_name, name, model, connector, options) {
  if (options == null) {
    options = {};
  }
  return (function(_this) {
    return function(params, callbackOrObservable) {
      var callback;
      if (params == null) {
        params = {};
      }
      callback = function(data) {
        return _this[name](model(data));
      };

      /*if typeof callbackOrObservable == 'undefined' and typeof callbackOrObservable['push'] == 'undefined'
        if typeof callbackOrObservable != 'function'
          console.error 'Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:'
          console.error callbackOrObservable
      
        callback = callbackOrObservable
       */
      return model.get_one(_this[id_param](), callback);
    };
  })(this);
};

lazy_get_fn = function(id_param, api_name, name, model, connector, options) {
  var api, callback;
  if (typeof callback === "undefined" || callback === null) {
    callback = (function(_this) {
      return function(data) {
        var i, len, m, res;
        res = [];
        for (i = 0, len = data.length; i < len; i++) {
          m = data[i];
          res.push(model(m));
        }
        return _this[api_name](res);
      };
    })(this);
    api = connector.get(api_name);
    return api.read(this.id).done(callback);
  }
};

lazy_single_get_fn = function(id_param, api_name, name, model, connector, options) {
  var callback;
  if (typeof this[id_param] !== 'function') {
    console.error('External key not an observable: ' + id_param);
    return false;
  }
  if (this[id_param]() == null) {
    console.error('Tried to access empty relation key: ' + id_param);
    return false;
  }
  if (typeof this[id_param]() === 'function') {
    console.error('Circular referene? Quitting.');
    return false;
  }
  if (typeof callback === "undefined" || callback === null) {
    callback = (function(_this) {
      return function(data) {
        return _this[name](model(data));
      };
    })(this);
  }
  return model.get_one(this[id_param](), callback);
};

create_fn = function(id_param, api_name, name, model, connector, options) {
  return (function(_this) {
    return function(params, callback, instant) {
      var api;
      if (params == null) {
        params = {};
      }
      if (instant == null) {
        instant = false;
      }
      if (callback == null) {
        callback = function(data) {
          return _this[api_name].push(model(data));
        };
      }
      if (_this.id == null) {
        console.error('Empty ID. Save parent model first!');
        return;
      }
      if (model.encrypted_container != null) {
        params = model.encrypt_container(params);
      }
      api = connector.get(api_name);
      if (options.belongs_to.length > 0) {
        return api.create(options.belongs_to, _this.id, params).done(callback);
      } else {
        return api.create(_this.id, params).done(callback);
      }
    };
  })(this);
};

update_fn = function(id_param, api_name, name, model, connector, options) {
  return (function(_this) {
    return function(id, params, callback) {
      var api;
      if (_this.id == null) {
        console.error('Empty ID. Save parent model first!');
        return;
      }
      if (model.encrypted_container != null) {
        params = model.encrypt_container(params);
      }
      api = connector.get(api_name);
      if (options.belongs_to != null) {
        api.update(options.belongs_to, _this.id, id, params).done(callback);
      } else {
        api.update(_this.id, id, params).done(callback);
      }
      if (_this.after_update != null) {
        return _this.after_update();
      }
    };
  })(this);
};

destroy_fn = function(id_param, api_name, name, model, connector, options) {
  return (function(_this) {
    return function(id, callback) {
      var api;
      if (callback == null) {
        callback = function(data) {
          return _this[api_name].remove(element);
        };
      }
      if (_this.id == null) {
        console.error('Empty ID. Save parent model first!');
        return;
      }
      api = connector.get(api_name);
      if (options.belongs_to != null) {
        return api.destroy(options.belongs_to, _this.id, id).done(callback);
      } else {
        return api.destroy(_this.id, id).done(callback);
      }
    };
  })(this);
};

//# sourceMappingURL=helpers.js.map
