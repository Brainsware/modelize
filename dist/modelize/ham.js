var Ham;

Ham = function() {};

Ham.merge = function(a, b) {
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
  module.exports = Ham;
}

//# sourceMappingURL=ham.js.map
