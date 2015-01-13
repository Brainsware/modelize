var Computed, ComputedArray, LazyObservable, LazyObservableArray, Observable, ObservableArray, PureComputed, ko;

if (typeof require !== "undefined" && require !== null) {
  ko = require('../../../knockout/build/output/knockout-latest.debug');
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

ComputedArray = function(self, property, fn) {
  var actual_property, property_fn;
  actual_property = '_actual_' + property;
  property_fn = '_' + property;
  ObservableArray(self, actual_property);
  self[property_fn] = (function(_this) {
    return function() {
      self[actual_property](fn());
      return self[actual_property]();
    };
  })(this);
  return self[property] = ko.computed(self[property_fn]);
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
    return result.loaded(false);
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
    ComputedArray: ComputedArray,
    LazyObservable: LazyObservable
  };
}

//# sourceMappingURL=observable.js.map
