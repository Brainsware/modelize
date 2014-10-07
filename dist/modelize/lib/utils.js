var Sorted;

Sorted = function(array, fn) {
  if (fn == null) {
    fn = function(a, b) {
      var a_name, b_name;
      a_name = a.name().toLowerCase();
      b_name = b.name().toLowerCase();
      if (a_name < b_name) {
        return -1;
      }
      if (a_name > b_name) {
        return 1;
      }
      return 0;
    };
  }
  return array.sort(fn);
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

//# sourceMappingURL=utils.js.map
