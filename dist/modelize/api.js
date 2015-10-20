var add_apis_to, api;

api = new $.RestClient('/api/', {
  stripTrailingSlash: true,
  methodOverride: true
});

add_apis_to = function(sub_apis, main_api) {
  var data, name, results;
  results = [];
  for (name in sub_apis) {
    data = sub_apis[name];
    if (!api[main_api][name + 's']) {
      results.push(api[main_api].add(name + 's'));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

//# sourceMappingURL=api.js.map
