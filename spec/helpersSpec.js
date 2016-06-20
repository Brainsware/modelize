describe('RelationshipFn', function() {
  return it('returns an object', function() {
    var obj;
    obj = Helpers.relationship_fields('test');
    return expect(typeof obj).toBe('object');
  });
});

describe('GetHelper', function() {
  beforeAll(function() {
    var connector, fields;
    connector = new RESTConnector('/');
    connector.init('tests');
    fields = Helpers.relationship_fields('test', null, connector);
    this.multi_get = Helpers.get_fn.apply(self, fields);
    this.callback = {
      fn: function() {
        return true;
      }
    };
    return spyOn(this.callback, 'fn');
  });
  return it('is a function', function() {
    return expect(typeof this.multi_get).toBe('function');
  });
});
