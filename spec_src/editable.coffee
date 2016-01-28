describe 'Editable', ->
  beforeAll ->
    @obj = {}

    @callback =
      fn: (data) -> return data

    spyOn @callback, 'fn'

    Editable @obj, 'test_property', @callback.fn

  it 'extends object with editable', ->
    expect(ko.isObservable(@obj.test_property)).toBe true
    expect(ko.isObservable(@obj.test_property.editing)).toBe true

  it 'executes callback on change', ->
    @obj.test_property 'test_value'
    expect(@callback.fn).toHaveBeenCalled()
