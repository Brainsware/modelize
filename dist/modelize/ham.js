var Ham;

Ham = function() {};

Ham.merge = function(a, b) {
  var key, result, _i, _j, _len, _len1, _ref, _ref1;
  result = {};
  _ref = Object.keys(a);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    result[key] = a[key];
  }
  _ref1 = Object.keys(b);
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    key = _ref1[_j];
    if (a[key] == null) {
      result[key] = b[key];
    }
  }
  return result;
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = Ham;
}

//# sourceMappingURL=ham.js.map
