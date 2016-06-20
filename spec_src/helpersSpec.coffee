describe 'RelationshipFn', ->
  it 'returns an object', ->
    obj = Helpers.relationship_fields('test')

    expect(typeof obj).toBe 'object'

describe 'GetHelper', ->
  beforeAll ->
    connector = new RESTConnector('/')
    connector.init 'tests'

    fields = Helpers.relationship_fields('test', null, connector)

    @multi_get = Helpers.get_fn.apply self, fields

    @callback =
      fn: -> return true

    spyOn @callback, 'fn'

  it 'is a function', ->
    expect(typeof @multi_get).toBe 'function'
