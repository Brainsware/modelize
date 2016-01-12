describe 'JSON Data Handler', ->
  beforeAll ->
    @json = new JSONHandler()

  it 'has a load function', ->
    expect(typeof @json.load).toBe 'function'

  it 'has a save function', ->
    expect(typeof @json.save).toBe 'function'


describe 'Crypto Data Handler', ->
  beforeAll ->
    @crypto = CryptoHandler()
