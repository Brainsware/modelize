describe('Editable', function() {
  beforeAll(function() {
    this.obj = {};
    this.callback = {
      fn: function(data) {
        return data;
      }
    };
    spyOn(this.callback, 'fn');
    return Editable(this.obj, 'test_property', this.callback.fn);
  });
  it('extends object with editable', function() {
    expect(ko.isObservable(this.obj.test_property)).toBe(true);
    return expect(ko.isObservable(this.obj.test_property.editing)).toBe(true);
  });
  return it('executes callback on change', function() {
    this.obj.test_property('test_value');
    return expect(this.callback.fn).toHaveBeenCalled();
  });
});
