var Sortable;

Sortable = function(self) {
  self.move = (function(_this) {
    return function(to, callback) {
      return self.update({
        sort: to
      }, callback);
    };
  })(this);
  return self;
};

//# sourceMappingURL=sortable.js.map
