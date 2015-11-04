var create_fn, destroy_fn, get_fn, lazy_get_fn, lazy_single_get_fn, relationship_fields, single_get_fn, update_fn;

relationship_fields = function(name, model, connector, options) {
  if (options == null) {
    options = {};
  }
  return [name + '_id', name + 's', name, window[model], connector, options];
};

get_fn = function(id_param, api_name, name, model, api, options) {
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
          throw new Error('model.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable);
        }
        callback = callbackOrObservable;
      }
      if (api == null) {
        throw new Error('No Connector found for resource "' + api_name + '" found: ', api);
      }
      if ((options.belongs_to != null) && options.belongs_to.length > 0) {
        return api[api_name].read(options.belongs_to, _this.id, params).done(callback);
      } else {
        return api[api_name].read(_this.id, params).done(callback);
      }
    };
  })(this);
};

single_get_fn = function(id_param, api_name, name, model, api, options) {
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
      if (typeof callbackOrObservable['push'] === 'undefined') {
        if (typeof callbackOrObservable !== 'function') {
          throw new Error('model.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable);
        }
        callback = callbackOrObservable;
      }
      return model.get_one(_this[id_param](), callback);
    };
  })(this);
};

lazy_get_fn = function(id_param, api_name, name, model, api, options) {
  var callback;
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
    return api[api_name].read(this.id).done(callback);
  }
};

lazy_single_get_fn = function(id_param, api_name, name, model, api, options) {
  var callback;
  if (typeof this[id_param] !== 'function') {
    throw new Error('External key not an observable: ' + id_param);
  }
  if (this[id_param]() == null) {
    throw new Error('Tried to access empty relation key: ' + id_param);
  }
  if (typeof this[id_param]() === 'function') {
    throw new Error('Circular referene? Quitting.');
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

create_fn = function(id_param, api_name, name, model, api, options) {
  return (function(_this) {
    return function(params, callback, instant) {
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
        throw new Error('Empty ID. Save parent model first!');
      }
      if (model.encrypted_container != null) {
        params = model.encrypt_container(params);
      }
      if (api == null) {
        throw new Error('No Connector found for resource "' + api_name + '" found: ', api);
      }
      if (options.belongs_to.length > 0) {
        return api[api_name].create(options.belongs_to, _this.id, params).done(callback);
      } else {
        return api[api_name].create(_this.id, params).done(callback);
      }
    };
  })(this);
};

update_fn = function(id_param, api_name, name, model, api, options) {
  return (function(_this) {
    return function(id, params, callback) {
      if (_this.id == null) {
        throw new Error('Empty ID. Save parent model first!');
      }
      if (model.encrypted_container != null) {
        params = model.encrypt_container(params);
      }
      if (options.belongs_to != null) {
        api[api_name].update(options.belongs_to, _this.id, id, params).done(callback);
      } else {
        api[api_name].update(_this.id, id, params).done(callback);
      }
      if (_this.after_update != null) {
        return _this.after_update();
      }
    };
  })(this);
};

destroy_fn = function(id_param, api_name, name, model, api, options) {
  return (function(_this) {
    return function(id, callback) {
      if (callback == null) {
        callback = function(data) {
          return _this[api_name].remove(element);
        };
      }
      if (_this.id == null) {
        throw new Error('Empty ID. Save parent model first!');
      }
      api = connector.get(api_name);
      if (options.belongs_to != null) {
        return api[api_name].destroy(options.belongs_to, _this.id, id).done(callback);
      } else {
        return api[api_name].destroy(_this.id, id).done(callback);
      }
    };
  })(this);
};

//# sourceMappingURL=helpers.js.map
