describe 'RelationshipFn', ->
  it 'returns an object', ->
    obj = relationship_fields('test')

    expect(typeof obj).toBe 'object'

describe 'GetHelper', ->
  beforeAll ->
    connector = new RESTConnector('/')
    connector.init 'tests'

    fields = relationship_fields('test', null, connector)

    @multi_get = get_fn.apply self, fields

    @callback =
      fn: -> return true

    spyOn @callback, 'fn'

  it 'is a function', ->
    expect(typeof @multi_get).toBe 'function'
