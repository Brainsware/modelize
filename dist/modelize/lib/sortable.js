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
