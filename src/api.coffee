api_user = '' unless api_user?
api_key = '' unless api_key?

api = new $.RestClient '/api/',
    stripTrailingSlash: true
    methodOverride:     true
    username:           api_user
    password:           api_key

add_apis_to = (sub_apis, main_api) ->
  for name, data of sub_apis
    api[main_api].add name + 's' unless api[main_api][name + 's']