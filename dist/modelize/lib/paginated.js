var Computed, Ham, Observable, Observables, Paginated;

if (typeof require !== "undefined" && require !== null) {
  Ham = require('../ham');
  Observables = require('../lib/observable');
  Observable = Observables.Observable;
  Computed = Observables.Computed;
}

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
  options = Ham.merge(options, {
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
