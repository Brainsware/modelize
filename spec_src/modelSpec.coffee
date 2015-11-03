Responses =
  general:
    status: 200
    responseText: '{"id": "1"}'
  generalMulti:
    status: 200
    responseText: '[{"id": "1"}]'

describe 'Model', ->
  beforeAll ->
    jasmine.Ajax.install()

    @connector = new Connector('/')

    @Model = Modelize
      api: 'tests'
      connector: @connector

    @instance = new @Model()

  it 'is a function', ->
    expect(typeof @Model).toBe 'function'

  it 'gets and calls a function', ->
    @Model.get {}, (data) ->
      expect(typeof data).toBe 'object'
      expect(data.id).toBe '1'

    request = jasmine.Ajax.requests.mostRecent()

    expect(request.url).toBe '/tests'
    expect(request.method).toBe 'GET'
    expect(request.data()).toEqual {}

    request.respondWith Responses.general

  it 'gets and puts into an observable', ->
    ObservableArray @, 'test'
    spyOn @test, 'push'

    @Model.get {}, @test

    request = jasmine.Ajax.requests.mostRecent()
    request.respondWith Responses.generalMulti

    expect(@test.push).toHaveBeenCalled()
    expect(@test.push).toHaveBeenCalledWith jasmine.objectContaining({ id: '1' })

  it 'creates and calls a function', ->
    @Model.create {}, (data) ->
      expect(typeof data).toBe 'object'
      expect(data.id).toBe '1'

    request = jasmine.Ajax.requests.mostRecent()

    expect(request.url).toBe '/tests'
    expect(request.method).toBe 'POST'
    expect(request.data()).toEqual {}

    request.respondWith Responses.general

  it 'creates and puts into an observable', ->
    ObservableArray @, 'test'
    spyOn @test, 'push'

    @Model.create {}, @test

    request = jasmine.Ajax.requests.mostRecent()
    request.respondWith Responses.general

    expect(@test.push).toHaveBeenCalled()
    expect(@test.push).toHaveBeenCalledWith jasmine.objectContaining({ id: '1' })

  describe 'Instance', ->
    it 'is an object', ->
      expect(typeof @instance).toBe 'object'
