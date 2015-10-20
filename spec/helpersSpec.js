describe('RelationshipFn', function() {
  return it('returns an object', function() {
    var obj;
    obj = relationship_fields('test');
    return expect(typeof obj).toBe('object');
  });
});

describe('GetHelper', function() {
  beforeAll(function() {
    var connector, fields;
    connector = new Connector('/');
    connector.init('tests');
    fields = relationship_fields('test', null, connector);
    this.multi_get = get_fn.apply(self, fields);
    this.callback = {
      fn: function() {
        return true;
      }
    };
    return spyOn(this.callback, 'fn');
  });
  it('is a function', function() {
    return expect(typeof this.multi_get).toBe('function');
  });
  return it('returns nothing', function() {
    expect(this.multi_get({}, this.callback.fn)).toBe('');
    return expect(this.callback.fn).toHaveBeenCalled();
  });
});
