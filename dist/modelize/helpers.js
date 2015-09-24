var create_fn, destroy_fn, get_fn, lazy_get_fn, lazy_single_get_fn, single_get_fn, update_fn;

get_fn = function(id_param, api_name, name, model, options) {
  return (function(_this) {
    return function(params, callbackOrObservable) {
      var callback;
      if (params == null) {
        params = {};
      }
      callback = function(data) {
        var m, res, _i, _len;
        res = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          m = data[_i];
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
      if (options.belongs_to != null) {
        return _this.api()[api_name].read(options.belongs_to, _this.id, params).done(callback);
      } else {
        return _this.api()[api_name].read(_this.id, params).done(callback);
      }
    };
  })(this);
};

single_get_fn = function(id_param, api_name, name, model, options) {
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
      return model.get(_this[id_param](), callback);
    };
  })(this);
};

lazy_get_fn = function(id_param, api_name, name, model, options) {
  var callback;
  if (typeof callback === "undefined" || callback === null) {
    callback = (function(_this) {
      return function(data) {
        var m, res, _i, _len;
        res = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          m = data[_i];
          res.push(model(m));
        }
        return _this[api_name](res);
      };
    })(this);
    return this.api()[api_name].read(this.id).done(callback);
  }
};

lazy_single_get_fn = function(id_param, api_name, name, model, options) {
  var callback;
  if (typeof this[id_param] !== 'function') {
    console.error('External key not an observable: ' + id_param);
    return false;
  }
  if (this[id_param]() == null) {
    console.error('Tried to access empty relation key: ' + id_param);
    return false;
  }
  if (typeof callback === "undefined" || callback === null) {
    callback = (function(_this) {
      return function(data) {
        return _this[name](model(data));
      };
    })(this);
  }
  return model.get(this[id_param](), callback);
};

create_fn = function(id_param, api_name, name, model, options) {
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
        console.error('Empty ID. Save parent model first!');
        return;
      }
      if (model.encrypted_container != null) {
        params = model.encrypt_container(params);
      }
      if (options.belongs_to.length > 0) {
        return _this.api()[api_name].create(options.belongs_to, _this.id, params).done(callback);
      } else {
        return _this.api()[api_name].create(_this.id, params).done(callback);
      }
    };
  })(this);
};

update_fn = function(id_param, api_name, name, model, options) {
  return (function(_this) {
    return function(id, params, callback) {
      if (_this.id == null) {
        console.error('Empty ID. Save parent model first!');
        return;
      }
      if (model.encrypted_container != null) {
        params = model.encrypt_container(params);
      }
      if (options.belongs_to != null) {
        _this.api()[api_name].update(options.belongs_to, _this.id, id, params).done(callback);
      } else {
        _this.api()[api_name].update(_this.id, id, params).done(callback);
      }
      if (_this.after_update != null) {
        return _this.after_update();
      }
    };
  })(this);
};

destroy_fn = function(id_param, api_name, name, model, options) {
  return (function(_this) {
    return function(id, callback) {
      if (callback == null) {
        callback = function(data) {
          return _this[api_name].remove(element);
        };
      }
      if (_this.id == null) {
        console.error('Empty ID. Save parent model first!');
        return;
      }
      if (options.belongs_to != null) {
        return _this.api()[api_name].destroy(options.belongs_to, _this.id, id).done(callback);
      } else {
        return _this.api()[api_name].destroy(_this.id, id).done(callback);
      }
    };
  })(this);
};

//# sourceMappingURL=helpers.js.map
