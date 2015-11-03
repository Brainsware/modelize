var Responses;

Responses = {
  general: {
    status: 200,
    responseText: '{"id": "1"}'
  },
  generalMulti: {
    status: 200,
    responseText: '[{"id": "1"}]'
  }
};

describe('Model', function() {
  beforeAll(function() {
    jasmine.Ajax.install();
    this.connector = new Connector('/');
    this.Model = Modelize({
      api: 'tests',
      connector: this.connector
    });
    return this.instance = new this.Model();
  });
  it('is a function', function() {
    return expect(typeof this.Model).toBe('function');
  });
  it('gets and calls a function', function() {
    var request;
    this.Model.get({}, function(data) {
      expect(typeof data).toBe('object');
      return expect(data.id).toBe('1');
    });
    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe('/tests');
    expect(request.method).toBe('GET');
    expect(request.data()).toEqual({});
    return request.respondWith(Responses.general);
  });
  it('gets and puts into an observable', function() {
    var request;
    ObservableArray(this, 'test');
    spyOn(this.test, 'push');
    this.Model.get({}, this.test);
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(Responses.generalMulti);
    expect(this.test.push).toHaveBeenCalled();
    return expect(this.test.push).toHaveBeenCalledWith(jasmine.objectContaining({
      id: '1'
    }));
  });
  it('creates and calls a function', function() {
    var request;
    this.Model.create({}, function(data) {
      expect(typeof data).toBe('object');
      return expect(data.id).toBe('1');
    });
    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe('/tests');
    expect(request.method).toBe('POST');
    expect(request.data()).toEqual({});
    return request.respondWith(Responses.general);
  });
  it('creates and puts into an observable', function() {
    var request;
    ObservableArray(this, 'test');
    spyOn(this.test, 'push');
    this.Model.create({}, this.test);
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(Responses.general);
    expect(this.test.push).toHaveBeenCalled();
    return expect(this.test.push).toHaveBeenCalledWith(jasmine.objectContaining({
      id: '1'
    }));
  });
  return describe('Instance', function() {
    return it('is an object', function() {
      return expect(typeof this.instance).toBe('object');
    });
  });
});
