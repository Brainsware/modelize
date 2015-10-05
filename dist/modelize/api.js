var add_apis_to, api, api_key, api_user;

if (typeof api_user === "undefined" || api_user === null) {
  api_user = '';
}

if (typeof api_key === "undefined" || api_key === null) {
  api_key = '';
}

api = new $.RestClient('/api/', {
  stripTrailingSlash: true,
  methodOverride: true,
  username: api_user,
  password: api_key
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
