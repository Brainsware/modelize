describe 'Connector', ->
  beforeAll ->
    @connector = new Connector('/')
    @connector.init 'tests'

  it 'is an object', ->
    expect(typeof @connector).toBe 'object'

  it 'has test resource', ->
    expect(typeof @connector.get('tests')).toBe 'object'