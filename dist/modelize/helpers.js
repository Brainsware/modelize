var create_fn, destroy_fn, get_fn, lazy_get_fn, lazy_single_get_fn, update_fn;

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
          console.log('Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:');
          console.log(callbackOrObservable);
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
  if (this[id_param]() == null) {
    console.log('Tried to access empty relation key: ' + id_param);
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
    return function(params, callback) {
      if (params == null) {
        params = {};
      }
      if (callback == null) {
        callback = function(data) {
          return _this[api_name].push(model(data));
        };
      }
      if (options.belongs_to != null) {
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
      if (options.belongs_to != null) {
        return _this.api()[api_name].update(options.belongs_to, _this.id, id, params).done(callback);
      } else {
        return _this.api()[api_name].update(_this.id, id, params).done(callback);
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
      if (options.belongs_to != null) {
        return _this.api()[api_name].destroy(options.belongs_to, _this.id, id).done(callback);
      } else {
        return _this.api()[api_name].destroy(_this.id, id).done(callback);
      }
    };
  })(this);
};

//# sourceMappingURL=helpers.js.map
