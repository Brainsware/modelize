var $, RESTConnector, object_merge,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

if (typeof require === 'function') {
  object_merge = require('./lib/utils');
  $ = require('jquery');
  window.jQuery = require('jquery');
  require('../vendor/jquery.rest/dist/1/jquery.rest.min.js');
}

RESTConnector = (function() {
  function RESTConnector(base, settings) {
    var default_settings;
    if (base == null) {
      base = '/api/';
    }
    if (settings == null) {
      settings = {};
    }
    this.init = bind(this.init, this);
    this.get = bind(this.get, this);
    default_settings = {
      stripTrailingSlash: true,
      methodOverride: true
    };
    settings = object_merge(settings, default_settings);
    this.connector = new $.RestClient(base, settings);
  }

  RESTConnector.prototype.get = function(base_uri) {
    return this.connector[base_uri];
  };

  RESTConnector.prototype.init = function(resource, sub_resources) {
    var data, name, results;
    if (sub_resources == null) {
      sub_resources = [];
    }
    if (this.connector[resource] == null) {
      this.connector.add(resource);
    }
    results = [];
    for (name in sub_resources) {
      data = sub_resources[name];
      if (!this.connector[resource][name + 's']) {
        results.push(this.connector[resource].add(name + 's'));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return RESTConnector;

})();

if (typeof module !== "undefined" && module !== null) {
  module.exports = RESTConnector;
}

//# sourceMappingURL=connector.js.map

var Computed, Container, DelayedSave, Editable, HashedSave, MappedObservable, Observable, ObservableArray, Observables, PureComputed, ko;

if (typeof require === 'function') {
  ko = require('knockout');
  Observables = require('./lib/observable');
  Observable = Observables.Observable;
  ObservableArray = Observables.ObservableArray;
  MappedObservable = Observables.MappedObservable;
  Computed = Observables.Computed;
  PureComputed = Observables.PureComputed;
  Editable = require('./lib/editable');
  DelayedSave = require('./lib/delayedsave');
  HashedSave = require('./lib/hashedsave');
}

Container = function(options) {
  var container;
  if (options == null) {
    options = {};
  }
  'use strict';
  container = function(self) {
    var fn, index, name, ref, ref1, ref2, ref3, ref4, ref5;
    if (self == null) {
      self = {};
    }
    Observable(self, '__updated');
    self["export"] = (function(_this) {
      return function() {
        var data, index, name, ref;
        data = {};
        if (options.editable != null) {
          ref = options.editable;
          for (index in ref) {
            name = ref[index];
            data[name] = self[name]();
          }
        }
        return data;
      };
    })(this);
    self.editables = function() {
      var editables;
      editables = [];
      if (options.editable != null) {
        editables = options.editable;
      }
      return editables;
    };
    if ((options.selectable != null) && options.selectable === true) {
      Selectable(self);
    }
    if (options.observable != null) {
      ref = options.observable;
      for (index in ref) {
        name = ref[index];
        Observable(self, name);
      }
    }
    if (options.editable != null) {
      ref1 = options.editable;
      for (index in ref1) {
        name = ref1[index];
        Editable(self, name, (function(_this) {
          return function() {
            return self.__updated(self["export"]());
          };
        })(this));
      }
    }
    if (options.computed != null) {
      ref2 = options.computed;
      for (name in ref2) {
        fn = ref2[name];
        Computed(self, name, fn);
      }
    }
    if (options.purecomputed != null) {
      ref3 = options.purecomputed;
      for (name in ref3) {
        fn = ref3[name];
        PureComputed(self, name, fn);
      }
    }
    if (options.functions != null) {
      ref4 = options.functions;
      for (name in ref4) {
        fn = ref4[name];
        self[name] = fn;
      }
    }
    if (options.subscriptions != null) {
      ref5 = options.subscriptions;
      for (name in ref5) {
        fn = ref5[name];
        if (!ko.isObservable(self[name])) {
          throw new Error('No observable to subscribe to found: ' + name);
        }
        self[name].subscribe(fn);
      }
    }
    return self;
  };
  return container;
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = Container;
}

//# sourceMappingURL=container.js.map

var CryptoHandler, SJCLUtils, ko,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

if (typeof require === 'function') {
  ko = require('knockout');
  SJCLUtils = require('../lib/sjcl');
}

CryptoHandler = (function() {
  function CryptoHandler(settings) {
    this.save = bind(this.save, this);
    this.load = bind(this.load, this);
    if (settings.key == null) {
      throw new Error('Please provide an encryption key to the crypto handler!');
    }
    this.key = settings.key;
    if (settings.salt != null) {
      this.salt = settings.salt;
    }
  }

  CryptoHandler.prototype.load = function(data) {
    var decrypted_data;
    decrypted_data = SJCLUtils.decryptData(this.key, data);
    return JSON.parse(decrypted_data);
  };

  CryptoHandler.prototype.save = function(data) {
    return SJCLUtils.encryptData(this.key, ko.toJSON(data));
  };

  return CryptoHandler;

})();

if (typeof module !== "undefined" && module !== null) {
  module.exports = CryptoHandler;
}

//# sourceMappingURL=crypto.js.map

var HashHandler,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

HashHandler = (function() {
  function HashHandler(settings) {
    this.save = bind(this.save, this);
    if (settings.salt == null) {
      throw new Error('Please provide a salting hash to the hash handler!');
    }
    this.salt = settings.salt;
  }

  HashHandler.prototype.save = function(data) {
    return SJCLUtils.getHash(data + this.salt);
  };

  return HashHandler;

})();

//# sourceMappingURL=hash.js.map

var JSONHandler;

JSONHandler = (function() {
  function JSONHandler() {}

  JSONHandler.prototype.load = function(data) {
    return JSON.parse(atob(data));
  };

  JSONHandler.prototype.save = function(data) {
    return btoa(ko.toJSON(data));
  };

  return JSONHandler;

})();

if (typeof module !== "undefined" && module !== null) {
  module.exports = JSONHandler;
}

//# sourceMappingURL=json.js.map

var Helpers;

Helpers = {
  relationship_fields: function(name, model, connector, options) {
    if (options == null) {
      options = {};
    }
    return [name + '_id', name + 's', name, window[model], connector, options];
  },
  single_get_fn: function(id_param, api_name, name, model, api, options) {
    if (options == null) {
      options = {};
    }
    return (function(_this) {
      return function(callbackOrObservable) {
        var callback;
        callback = function(data) {
          return _this[name](model(data));
        };
        if ((callbackOrObservable != null) && typeof callbackOrObservable['push'] === 'undefined') {
          if (typeof callbackOrObservable !== 'function') {
            throw new Error('model.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable);
          }
          callback = callbackOrObservable;
        }
        return model.get_one(_this[id_param](), callback);
      };
    })(this);
  },
  lazy_get_fn: function(id_param, api_name, name, model, api, options) {
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
  },
  lazy_single_get_fn: function(id_param, api_name, name, model, api, options) {
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
        return function(data) {};
      })(this);
      this[name](model(data));
    }
    return model.get_one(this[id_param](), callback);
  },
  get_fn: function(id_param, api_name, name, model, api, options) {
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
        if ((callbackOrObservable != null) && typeof callbackOrObservable['push'] === 'undefined') {
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
  },
  create_fn: function(id_param, api_name, name, model, api, options) {
    return (function(_this) {
      return function(params, callbackOrObservable) {
        var callback, m;
        if (params == null) {
          params = {};
        }
        callback = function(data) {
          var m;
          m = model(data);
          if (m.after_create != null) {
            m.after_create();
          }
          return _this[api_name].push(m);
        };
        if (callbackOrObservable != null) {
          callback = function(data) {
            var m;
            m = model(JSON.parse(JSON.stringify(data)));
            if (m.after_create != null) {
              m.after_create();
            }
            return callbackOrObservable(data);
          };
        }
        if (_this.id == null) {
          throw new Error('Empty ID. Save parent model first!');
        }
        m = model(params);
        if (m.before_create != null) {
          m.before_create();
        }
        params = m["export"](false, true);
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
  },
  destroy_fn: function(id_param, api_name, name, model, api, options) {
    return (function(_this) {
      return function(callback) {
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
  }
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = Helpers;
}

//# sourceMappingURL=helpers.js.map

var Containable, MappedObservable, Observable, ObservableArray, Observables, init_multi_container, init_single_container, ko;

if (typeof require === 'function') {
  ko = require('knockout');
  Observables = require('./observable');
  Observable = Observables.Observable;
  ObservableArray = Observables.ObservableArray;
  MappedObservable = Observables.MappedObservable;
}

Containable = function(self, options) {
  var container_fn, datahandler, field, first_class, name, ref, settings;
  ref = options.container;
  for (name in ref) {
    settings = ref[name];
    container_fn = window[name];
    if (settings.container != null) {
      container_fn = window[settings.container];
    }
    if ((settings.container != null) && typeof settings.container === 'function') {
      container_fn = settings.container;
    }
    if (typeof container_fn !== 'function') {
      throw new Error('No container "' + name + '" found.');
    }
    field = name.toLowerCase();
    if (settings.field != null) {
      field = settings.field;
    }
    if (typeof settings.datahandler !== 'object') {
      throw new Error('Invalid or no datahandler provided for: "' + name + '"', typeof settings.datahandler);
    }
    if (settings.datahandler != null) {
      datahandler = settings.datahandler;
    }
    first_class = false;
    if (settings.first_class != null) {
      first_class = settings.first_class;
    }
    if ((settings.type != null) && settings.type === 'multi') {
      init_multi_container(self, name, datahandler, container_fn, field, options);
    } else {
      init_single_container(self, name, datahandler, container_fn, field, first_class, options);
    }
  }
  return self;
};

init_single_container = function(self, name, datahandler, container_fn, field, first_class, options) {
  var data, editable, i, len, ref;
  data = {};
  if (self[field] != null) {
    data = datahandler.load(self[field]);
  }
  Observable(self, name, new container_fn(data));
  if (first_class === true) {
    ref = self[name]().editables();
    for (i = 0, len = ref.length; i < len; i++) {
      editable = ref[i];
      MappedObservable(self, editable, self[name](), self[editable]);
    }
  }
  self[name]().__updated.subscribe((function(_this) {
    return function(data) {
      var callback;
      callback = DelayedSave.apply(self, [options, self, datahandler]);
      return callback(data, field);
    };
  })(this));
  return self[name].subscribe((function(_this) {
    return function() {
      var callback;
      callback = DelayedSave.apply(self, [options, self, datahandler]);
      return callback(self[name](), field);
    };
  })(this));
};

init_multi_container = (function(_this) {
  return function(self, name, datahandler, container_fn, field, options) {
    var c, data, i, item, items, len;
    data = {};
    if (self[field] != null) {
      data = datahandler.load(self[field]);
    }
    items = [];
    if (data != null) {
      for (i = 0, len = data.length; i < len; i++) {
        item = data[i];
        c = new container_fn(item);
        items.push(c);
        c.__updated.subscribe(function() {
          var callback;
          callback = DelayedSave.apply(self, [options, self, datahandler]);
          return callback(self[name]().map(function(e) {
            return e["export"]();
          }), field);
        });
      }
    }
    ObservableArray(self, name, items);
    self[name + '_add'] = function(params, callback) {
      if (params == null) {
        params = {};
      }
      c = container_fn(params);
      if (c.after_create != null) {
        c.after_create();
      }
      if (c.before_create != null) {
        c.before_create();
      }
      if (callback != null) {
        callback(c);
      }
      params = c["export"](false, true);
      self[name].push(c);
      return c.__updated.subscribe(function() {
        callback = DelayedSave.apply(self, [options, self, datahandler]);
        return callback(self[name]().map(function(e) {
          return e["export"]();
        }), field);
      });
    };
    return self[name].subscribe(function() {
      var callback;
      callback = DelayedSave.apply(self, [options, self, datahandler]);
      return callback(self[name]().map(function(e) {
        return e["export"]();
      }), field);
    });
  };
})(this);

if (typeof module !== "undefined" && module !== null) {
  module.exports = Containable;
}

//# sourceMappingURL=containable.js.map

var DelayedSave;

DelayedSave = function(options, self, datahandler) {
  if (datahandler == null) {
    datahandler = null;
  }
  return (function(_this) {
    return function(value, prop, delay) {
      if (delay == null) {
        delay = 500;
      }
      if (self.id == null) {
        return;
      }
      if (options.save_delay != null) {
        delay = options.save_delay;
      }
      if (self[prop] && (self[prop].editing != null)) {
        self[prop].editing('pending');
      }
      if (window.timeoutEditor == null) {
        window.timeoutEditor = {};
      }
      if (window.timeoutEditor[options.api + self.id] == null) {
        window.timeoutEditor[options.api + self.id] = {};
      }
      clearTimeout(window.timeoutEditor[options.api + self.id][prop]);
      return window.timeoutEditor[options.api + self.id][prop] = setTimeout(function() {
        var edit_value, res;
        if (self[prop] && (self[prop].editing != null)) {
          self[prop].editing('success');
        }
        edit_value = {};
        edit_value[prop] = value;
        if (datahandler != null) {
          edit_value[prop] = datahandler.save(value);
        }
        res = self.update(edit_value);
        if (self.on_save_success != null) {
          res.done(self.on_save_success);
        }
        if (self.on_save_fail != null) {
          return res.fail(self.on_save_fail);
        }
      }, delay);
    };
  })(this);
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = DelayedSave;
}

//# sourceMappingURL=delayedsave.js.map

var Editable, Observable, Observables, ko;

if (typeof require === 'function') {
  ko = require('knockout');
  Observables = require('./observable');
  Observable = Observables.Observable;
}

Editable = function(self, property, callback) {
  Observable(self, property);
  self[property].extend({
    editable: ""
  });
  self[property].subscribe((function(_this) {
    return function(new_value) {
      var r;
      return r = callback(new_value, property);
    };
  })(this));
  return self;
};

ko.extenders.editable = function(target, options) {
  return target.editing = ko.observable('default');
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = Editable;
}

//# sourceMappingURL=editable.js.map

var HashedSave;

HashedSave = function(options, self) {
  return (function(_this) {
    return function(value, prop) {
      var edit_value, res;
      if (self.id != null) {
        if (self[prop] && (self[prop].editing != null)) {
          self[prop].editing('pending');
        }
        if (self.hash_salt != null) {
          value += self.hash_salt;
        } else {
          console.log('No salt for hash found. Intentional?');
        }
        edit_value = {};
        edit_value[prop] = SJCLUtils.getHash(value);
        res = self.update(edit_value);
        if (self.on_save_success != null) {
          res.done(self.on_save_success);
        }
        if (self.on_save_fail != null) {
          return res.fail(self.on_save_fail);
        }
      }
    };
  })(this);
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = HashedSave;
}

//# sourceMappingURL=hashedsave.js.map

var Computed, LazyObservable, LazyObservableArray, MappedObservable, Observable, ObservableArray, PureComputed, ko;

if (typeof require === 'function') {
  ko = require('knockout');
}

Observable = function(self, property, initial_value) {
  if (initial_value === void 0) {
    initial_value = self[property];
  }
  return self[property] = ko.observable(initial_value);
};

ObservableArray = function(self, property, initial_value) {
  if (initial_value === void 0) {
    initial_value = [];
  }
  self[property] = ko.observableArray(initial_value);
  self[property].select = function(fn) {
    return ko.utils.arrayFilter(self[property].call(), fn);
  };
  return self[property].map = function(fn) {
    return ko.utils.arrayMap(self[property].call(), fn);
  };
};

Computed = function(self, property, fn) {
  return self[property] = ko.computed(fn, self);
};

PureComputed = function(self, property, fn) {
  return self[property] = ko.pureComputed(fn, self);
};

MappedObservable = function(self, property, container, initial_value) {
  self[property] = ko.pureComputed({
    read: function() {
      return container[property]();
    },
    write: function(value) {
      return container[property](value);
    },
    deferEvaluation: true
  });
  if (initial_value != null) {
    return self[property](initial_value);
  }
};

LazyObservable = function(self, property, callback, params, init_value, make_array) {
  var _value;
  if (params == null) {
    params = [];
  }
  if (init_value == null) {
    init_value = null;
  }
  if (make_array == null) {
    make_array = false;
  }
  if (!make_array) {
    _value = ko.observable(init_value);
  } else {
    _value = ko.observableArray(init_value);
  }
  self[property] = ko.computed({
    read: function() {
      if (self[property].loaded() === false) {
        callback.apply(self, params);
      }
      return _value();
    },
    write: function(newValue) {
      self[property].loaded(true);
      return _value(newValue);
    },
    deferEvaluation: true
  });
  if (make_array === true) {
    self[property].remove = function(e) {
      return _value.remove(e);
    };
    self[property].push = function(e) {
      return _value.push(e);
    };
    self[property].splice = function(e, i, args) {
      return _value.splice(e, i, args);
    };
  }
  self[property].loaded = ko.observable(false);
  return self[property].refresh = function() {
    return self[property].loaded(false);
  };
};

LazyObservableArray = function(self, property, callback, params, init_value) {
  if (params == null) {
    params = [];
  }
  if (init_value == null) {
    init_value = null;
  }
  return LazyObservable(self, property, callback, params, init_value, true);
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = {
    Observable: Observable,
    ObservableArray: ObservableArray,
    Computed: Computed,
    PureComputed: PureComputed,
    LazyObservable: LazyObservable
  };
}

//# sourceMappingURL=observable.js.map

var Paginated;

Paginated = function(self, options) {
  if (!((self != null) && (options != null))) {
    throw new Error('Error: no object or options given');
  }
  if ('object' !== typeof self) {
    throw new Error('Error: first parameter is not an object');
  }
  if ('function' === typeof options) {
    options = {
      method: options
    };
  }
  if ('object' !== typeof options) {
    throw new Error('Invalid type for second parameter (' + typeof options + '), expected function or object');
  }
  options = object_merge(options, {
    per_page: 20,
    page: 0
  });
  if (options.page > 0) {
    options.page--;
  }
  if (!(typeof options.per_page === 'number' && options.per_page > 0)) {
    throw new Error('Invalid per_page value given');
  }
  if (options.method == null) {
    throw new Error('No reload method given');
  }
  return Paginated.add_paginated_methods(self, options);
};

Paginated.add_paginated_methods = function(self, options) {
  Observable(self, '__collection', options.collection);
  Observable(self, '__reload', options.method);
  Observable(self, '__page', options.page);
  Observable(self, 'per_page', options.per_page);
  Computed(self, 'page', (function(_this) {
    return function() {
      return self.__page() + 1;
    };
  })(this));
  Computed(self, 'count', (function(_this) {
    return function() {
      if (self.__collection() != null) {
        return self.__collection().count;
      }
      return 0;
    };
  })(this));
  Computed(self, 'pages', (function(_this) {
    return function() {
      var result;
      result = parseInt(parseFloat(self.count()) / parseFloat(self.__page()));
      if (parseFloat(self.count()) % self.__page() > 0) {
        result++;
      }
      return result;
    };
  })(this));
  self.first_page = (function(_this) {
    return function() {
      self.__page(0);
      return self.__collection(self.__reload());
    };
  })(this);
  self.last_page = (function(_this) {
    return function() {
      self.__page(self.count() - 1);
      return self.__collection(self.__reload());
    };
  })(this);
  self.previous_page = (function(_this) {
    return function() {
      if (!(self.page() > 0)) {
        return;
      }
      self.__page(self.page() - 1);
      return self.__collection(self.__reload());
    };
  })(this);
  return self.next_page = (function(_this) {
    return function() {
      if (!(self.page() + 1 < self.pages())) {
        return;
      }
      self.__page(self.page() + 1);
      return self.__collection(self.__reload());
    };
  })(this);
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = Paginated;
}

//# sourceMappingURL=paginated.js.map

var Helpers, Observable, ObservableArray, Observables, Relatable, object_merge,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

if (typeof require === 'function') {
  object_merge = require('./utils');
  Helpers = require('../helpers');
  Observables = require('./observable');
  Observable = Observables.Observable;
  ObservableArray = Observables.ObservableArray;
}

Relatable = function(self, options) {
  var data, fn, i, item, items, len, name, ref, ref1, ref2, ref3, relation_params, results;
  if (options.belongs_to != null) {
    if (options.has_one == null) {
      options.has_one = [];
    }
    options.has_one = object_merge(options.belongs_to, options.has_one);
  } else {
    options.belongs_to = [];
  }
  if (options.has_one != null) {
    ref = options.has_one;
    for (name in ref) {
      data = ref[name];
      object_merge(data, {
        model: name.capitalize()
      });
      relation_params = Helpers.relationship_fields(name, data.model, self.api(), options);
      fn = window[data.model];
      if ((data.model != null) && typeof data.model === 'function') {
        fn = data.model;
      }
      if (typeof fn !== 'function') {
        console.debug('Relation model for "' + name + '" not a function: ', fn);
        throw new Error('No model for has_one/belongs_to relation found');
      }
      if (typeof self[name + '_id'] !== 'function' && indexOf.call(options.belongs_to, name) < 0) {
        if (options.editable == null) {
          options.editable = [];
        }
        if (ref1 = name + '_id', indexOf.call(options.editable, ref1) < 0) {
          options.editable.push(name + '_id');
        }
      }
      if (self[name] != null) {
        Observable(self, name, new fn(self[name]));
      } else {
        Observable(self, name, new fn());
      }
      self[name + '_get'] = Helpers.single_get_fn.apply(self, relation_params);
    }
  }
  if (options.has_many != null) {
    ref2 = options.has_many;
    results = [];
    for (name in ref2) {
      data = ref2[name];
      object_merge(data, {
        model: name.capitalize()
      });
      relation_params = Helpers.relationship_fields(name, data.model, self.api(), options);
      if (self[name + 's'] != null) {
        fn = window[data.model];
        items = [];
        ref3 = self[name + 's'];
        for (i = 0, len = ref3.length; i < len; i++) {
          item = ref3[i];
          items.push(new fn(item));
        }
        ObservableArray(self, name + 's', items);
      } else {
        ObservableArray(self, name + 's', []);
      }
      self[name + '_get'] = Helpers.get_fn.apply(self, relation_params);
      self[name + '_add'] = Helpers.create_fn.apply(self, relation_params);
      results.push(self[name + '_destroy'] = Helpers.destroy_fn.apply(self, relation_params));
    }
    return results;
  }
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = Relatable;
}

//# sourceMappingURL=relatable.js.map

var Selectable, ko;

if (typeof require === 'function') {
  ko = require('knockout');
}

Selectable = function(self) {
  self.selected = ko.observable(false);
  self.select = (function(_this) {
    return function(item, element) {
      return self.selected(!self.selected());
    };
  })(this);
  return self;
};

//# sourceMappingURL=selectable.js.map

var SJCLUtils, sjcl;

if (typeof require === 'function') {
  sjcl = require('sjcl');
}

SJCLUtils = {
  generateKey: function(password, salt) {
    var hex, options;
    if (password === '') {
      throw new Error('Password for key generation empty!');
    }
    hex = sjcl.codec.hex.fromBits;
    if (salt == null) {
      salt = SJCLUtils.generateSalt();
    }
    options = {
      salt: salt,
      iter: 5000
    };
    options = sjcl.misc.cachedPbkdf2(password, options);
    return sjcl.codec.hex.fromBits(options.key);
  },
  generateSalt: function(length) {
    var rand;
    if (length == null) {
      length = 2;
    }
    rand = sjcl.random.randomWords(length);
    return sjcl.codec.hex.fromBits(rand);
  },
  encryptData: function(key, data, adata) {
    var options, options_ret;
    if (adata == null) {
      adata = '';
    }
    if (key === '') {
      throw new Error('Encryption key empty!');
    }
    options = {
      mode: 'gcm',
      iter: 5000,
      ts: 64,
      ks: 256,
      adata: adata
    };
    options_ret = {};
    return sjcl.encrypt(key, data, options, options_ret);
  },
  decryptData: function(key, data) {
    var options_ret;
    if (key === '') {
      throw new Error('Decryption key empty!');
    }
    options_ret = {};
    return sjcl.decrypt(key, data, {}, options_ret);
  },
  getHash: function(value) {
    var hash;
    if (value == null) {
      console.debug('Hash value empty');
      value = '';
    }
    hash = sjcl.hash.sha256.hash(value);
    return sjcl.codec.hex.fromBits(hash);
  }
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = SJCLUtils;
}

//# sourceMappingURL=sjcl.js.map

var Sortable;

Sortable = function(self) {
  self.move = (function(_this) {
    return function(to, callback) {
      return self.update({
        sort: to
      }, callback);
    };
  })(this);
  self.move_ui = (function(_this) {
    return function(element) {
      var item, to;
      item = element.item;
      to = element.targetIndex;
      return item.update({
        sort: to
      });
    };
  })(this);
  return self;
};

//# sourceMappingURL=sortable.js.map

var object_merge;

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

object_merge = function(a, b) {
  var i, j, key, len, len1, ref, ref1, result;
  result = {};
  ref = Object.keys(a);
  for (i = 0, len = ref.length; i < len; i++) {
    key = ref[i];
    result[key] = a[key];
  }
  ref1 = Object.keys(b);
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    key = ref1[j];
    if (a[key] == null) {
      result[key] = b[key];
    }
  }
  return result;
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = object_merge;
}

//# sourceMappingURL=utils.js.map

var Computed, Containable, DelayedSave, Editable, HashedSave, Modelize, Observable, Observables, PureComputed, Relatable, SJCLUtils, ko, object_merge,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

if (typeof require === 'function') {
  ko = require('knockout');
  object_merge = require('./lib/utils');
  Observables = require('./lib/observable');
  Observable = Observables.Observable;
  Computed = Observables.Computed;
  PureComputed = Observables.PureComputed;
  Relatable = require('./lib/relatable');
  Containable = require('./lib/containable');
  Editable = require('./lib/editable');
  DelayedSave = require('./lib/delayedsave');
  HashedSave = require('./lib/hashedsave');
  SJCLUtils = require('./lib/sjcl');
}

Modelize = function(options) {
  'use strict';
  var connector, model, sub_resources;
  if (options.connector == null) {
    throw new Error('No connector given for API URI: ' + options.api);
  }
  sub_resources = [];
  if (options.has_one != null) {
    sub_resources = object_merge(sub_resources, options.has_one);
  }
  if (options.has_many != null) {
    sub_resources = object_merge(sub_resources, options.has_many);
  }
  options.connector.init(options.api, sub_resources);
  connector = options.connector.get(options.api);
  model = function(self) {
    var fn, index, name, ref, ref1, ref2, ref3, ref4, ref5;
    if (self == null) {
      self = {};
    }
    self.api = function() {
      return connector;
    };
    if (options.hash_salt != null) {
      self.hash_salt = options.hash_salt;
    }
    if ((options.sortable != null) && options.sortable === true) {
      Sortable(self);
    }
    if ((options.selectable != null) && options.selectable === true) {
      Selectable(self);
    }
    if ((options.has_one != null) || (options.has_many != null) || (options.belongs_to != null)) {
      Relatable(self, options);
    }
    if (options.container != null) {
      Containable(self, options);
    }
    if (options.observable != null) {
      ref = options.observable;
      for (index in ref) {
        name = ref[index];
        Observable(self, name);
      }
    }
    if (options.editable != null) {
      ref1 = options.editable;
      for (index in ref1) {
        name = ref1[index];
        Editable(self, name, DelayedSave.apply(self, [options, self]));
      }
    }
    if (options.hashed_index != null) {
      ref2 = options.hashed_index;
      for (index in ref2) {
        name = ref2[index];
        Editable(self, name, HashedSave.apply(self, [options, self]));
      }
    }
    if (options.computed != null) {
      ref3 = options.computed;
      for (name in ref3) {
        fn = ref3[name];
        Computed(self, name, fn);
      }
    }
    if (options.purecomputed != null) {
      ref4 = options.purecomputed;
      for (name in ref4) {
        fn = ref4[name];
        PureComputed(self, name, fn);
      }
    }
    if (options.functions != null) {
      ref5 = options.functions;
      for (name in ref5) {
        fn = ref5[name];
        self[name] = fn;
      }
    }
    self.update = (function(_this) {
      return function(params, callback) {
        if (self.id == null) {
          throw new Error('Trying to update nonexisting model object');
        }
        return self.api().update(self.id, params).done(callback);
      };
    })(this);
    self.destroy = (function(_this) {
      return function(callback) {
        if (self.id == null) {
          throw new Error('Trying to delete nonexisting model object');
        }
        if (self.onDestroy != null) {
          self.onDestroy();
        }
        return self.api().destroy(self.id).done(callback);
      };
    })(this);
    self.create = (function(_this) {
      return function(callback) {
        return self.api().create(self["export"](false, true)).done(function(data) {
          self.id = data.id;
          if (callback != null) {
            return callback();
          }
        });
      };
    })(this);
    self["export"] = (function(_this) {
      return function(id, datahandler) {
        var data, field, has_data, ref6, ref7, ref8, settings;
        if (id == null) {
          id = false;
        }
        if (datahandler == null) {
          datahandler = false;
        }
        data = {};
        if (id === true) {
          data['id'] = self['id'];
        }
        if (options.editable != null) {
          ref6 = options.editable;
          for (index in ref6) {
            name = ref6[index];
            data[name] = self[name]();
          }
        }
        if (options.belongs_to != null) {
          ref7 = options.belongs_to;
          for (name in ref7) {
            has_data = ref7[name];
            data[name + '_id'] = self[name + '_id']();
          }
        }
        if (options.container != null) {
          ref8 = options.container;
          for (name in ref8) {
            settings = ref8[name];
            if (!Array.isArray(self[name]())) {
              data[name] = self[name]()["export"]();
            } else {
              data[name] = [];
              data[name] = self[name]().map(function(e) {
                return e["export"]();
              });
            }
            if (datahandler) {
              field = name.toLowerCase();
              if (settings.field != null) {
                field = settings.field;
              }
              if (settings.datahandler != null) {
                datahandler = settings.datahandler;
              }
              if (settings.datahandler == null) {
                datahandler = new JSONHandler();
              }
              data[field] = datahandler.save(data[name]);
              if (name !== field) {
                delete data[name];
              }
            }
          }
        }
        return data;
      };
    })(this);
    return self;
  };

  /*
   * These are the collection functions and are not bound to a specific object but to the model
   */
  model.get = function(params, callbackOrObservable) {
    var callback, param, salt;
    if (params == null) {
      params = {};
    }
    callback = function(data) {
      var i, len, m, results;
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        m = data[i];
        results.push(callbackOrObservable.push(model(m)));
      }
      return results;
    };
    if (typeof callbackOrObservable['push'] === 'undefined') {
      if (typeof callbackOrObservable !== 'function') {
        throw new Error('Collection.get 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable);
      }
      callback = callbackOrObservable;
    }
    if (typeof params !== 'object') {
      throw new Error('Passed params is not an object: ' + typeof params);
    }
    if ((options.hashed_index != null) && (params != null)) {
      salt = '';
      if (options.hash_salt != null) {
        salt = options.hash_salt;
      }
      for (param in params) {
        if (indexOf.call(options.hashed_index, param) >= 0) {
          params[param] = SJCLUtils.getHash(params[param] + salt);
        }
      }
    }
    if ((params != null) && (params.id != null)) {
      return connector.read(params.id, params).done(callback);
    } else {
      return connector.read(params).done(callback);
    }
  };
  model.get_one = function(id, callbackOrObservable) {
    var callback;
    callback = function(data) {
      return callbackOrObservable(model(data));
    };
    if (ko.isObservable(callbackOrObservable) === false) {
      if (typeof callbackOrObservable !== 'function') {
        throw new Error('Collection.get_one 2nd parameter needs to be either a function or an Observable.\nGiven: ' + callbackOrObservable);
      }
      callback = callbackOrObservable;
    }
    return model.get({
      id: id
    }, callback);
  };
  model.create = function(params, callbackOrObservable) {
    var callback, m;
    if (params == null) {
      params = {};
    }
    callback = function(data) {
      return callbackOrObservable.push(model(data));
    };
    if (typeof callbackOrObservable['push'] === 'undefined') {
      if (typeof callbackOrObservable !== 'function') {
        throw new Error('Collection.create 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable);
      }
      callback = (function(_this) {
        return function(data) {
          var m;
          m = model(JSON.parse(JSON.stringify(data)));
          if (m.after_create != null) {
            m.after_create();
          }
          return callbackOrObservable(data);
        };
      })(this);
    }
    m = model(params);
    if (m.before_create != null) {
      m.before_create();
    }
    params = m["export"](false, true);
    return connector.create(params).done(callback);
  };
  return model;
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = Modelize;
}

//# sourceMappingURL=model.js.map
