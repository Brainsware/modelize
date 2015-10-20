describe('Connector', function() {
  beforeAll(function() {
    this.connector = new Connector('/');
    return this.connector.init('tests');
  });
  it('is an object', function() {
    return expect(typeof this.connector).toBe('object');
  });
  return it('has test resource', function() {
    return expect(typeof this.connector.get('tests')).toBe('object');
  });
});
