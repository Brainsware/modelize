var Model, MultiSubModel, Responses, SubModel, co;

Responses = {
  general: {
    status: 200,
    responseText: '{"id": 1, "submodel_id": 1}'
  },
  generalMulti: {
    status: 200,
    responseText: '[{"id": 1}]'
  }
};

co = new Connector('/');

Model = Modelize({
  api: 'tests',
  connector: co,
  has_one: {
    submodel: {
      model: 'SubModel'
    }
  },
  has_many: {
    multisubmodel: {
      model: 'MultiSubModel'
    }
  },
  editable: ['fieldOne', 'fieldTwo']
});

SubModel = Modelize({
  api: 'subtests',
  connector: co
});

MultiSubModel = Modelize({
  api: 'multisubtests',
  connector: co,
  belongs_to: {
    tests: {
      model: 'Model'
    }
  }
});

describe('Model', function() {
  beforeAll(function() {
    jasmine.Ajax.install();
    return this.instance = new Model();
  });
  it('is a function', function() {
    return expect(typeof Model).toBe('function');
  });
  it('gets and calls a function', function() {
    var request;
    Model.get({}, function(data) {
      expect(typeof data).toBe('object');
      return expect(data.id).toBe(1);
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
    Model.get({}, this.test);
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(Responses.generalMulti);
    expect(this.test.push).toHaveBeenCalled();
    return expect(this.test.push).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 1
    }));
  });
  it('creates and calls a function', function() {
    var request;
    Model.create({}, function(data) {
      expect(typeof data).toBe('object');
      return expect(data.id).toBe(1);
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
    Model.create({}, this.test);
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(Responses.general);
    expect(this.test.push).toHaveBeenCalled();
    return expect(this.test.push).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 1
    }));
  });
  return describe('Instance functions', function() {
    beforeAll(function() {
      var request;
      Model.get_one(1, (function(_this) {
        return function(data) {
          return _this.instance = new Model(data);
        };
      })(this));
      request = jasmine.Ajax.requests.mostRecent();
      return request.respondWith(Responses.general);
    });
    it('is an object', function() {
      return expect(typeof this.instance).toBe('object');
    });
    it('has an id', function() {
      return expect(this.instance.id).toBe(1);
    });
    return it('has external keys', function() {
      return expect(this.instance.submodel_id()).toBe(1);
    });
  });
});
