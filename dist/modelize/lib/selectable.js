var Selectable;

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
