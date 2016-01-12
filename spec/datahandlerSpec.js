describe('JSON Data Handler', function() {
  beforeAll(function() {
    return this.json = new JSONHandler();
  });
  it('has a load function', function() {
    return expect(typeof this.json.load).toBe('function');
  });
  return it('has a save function', function() {
    return expect(typeof this.json.save).toBe('function');
  });
});

describe('Crypto Data Handler', function() {
  return beforeAll(function() {
    return this.crypto = CryptoHandler();
  });
});
