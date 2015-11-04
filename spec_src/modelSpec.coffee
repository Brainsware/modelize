Responses =
  general:
    status: 200
    responseText: '{"id": 1, "submodel_id": 1}'
  generalMulti:
    status: 200
    responseText: '[{"id": 1}]'

co = new Connector('/')

Model = Modelize
  api: 'tests'
  connector: co
  has_one:
    submodel:
      model: 'SubModel'
  has_many:
    multisubmodel:
      model: 'MultiSubModel'
  editable: [ 'fieldOne', 'fieldTwo' ]

SubModel = Modelize
  api: 'subtests'
  connector: co

MultiSubModel = Modelize
  api: 'multisubtests'
  connector: co
  belongs_to:
    tests:
      model: 'Model'

describe 'Public Model API', ->
  beforeAll ->
    jasmine.Ajax.install()

    @instance = new Model()

  it 'is a function', ->
    expect(typeof Model).toBe 'function'

  it 'gets and calls a function', ->
    Model.get {}, (data) ->
      expect(typeof data).toBe 'object'
      expect(data.id).toBe 1

    request = jasmine.Ajax.requests.mostRecent()

    expect(request.url).toBe '/tests'
    expect(request.method).toBe 'GET'
    expect(request.data()).toEqual {}

    request.respondWith Responses.general

  it 'gets and puts into an observable', ->
    ObservableArray @, 'test'
    spyOn @test, 'push'

    Model.get {}, @test

    request = jasmine.Ajax.requests.mostRecent()
    request.respondWith Responses.generalMulti

    expect(@test.push).toHaveBeenCalled()
    expect(@test.push).toHaveBeenCalledWith jasmine.objectContaining({ id: 1 })

  it 'creates and calls a function', ->
    Model.create {}, (data) ->
      expect(typeof data).toBe 'object'
      expect(data.id).toBe 1

    request = jasmine.Ajax.requests.mostRecent()

    expect(request.url).toBe '/tests'
    expect(request.method).toBe 'POST'
    expect(request.data()).toEqual {}

    request.respondWith Responses.general

  it 'creates and puts into an observable', ->
    ObservableArray @, 'test'
    spyOn @test, 'push'

    Model.create {}, @test

    request = jasmine.Ajax.requests.mostRecent()
    request.respondWith Responses.general

    expect(@test.push).toHaveBeenCalled()
    expect(@test.push).toHaveBeenCalledWith jasmine.objectContaining({ id: 1 })

  describe 'Instance functions', ->
    beforeAll ->
      Model.get_one 1, (data) =>
        @instance = new Model(data)

      request = jasmine.Ajax.requests.mostRecent()
      request.respondWith Responses.general

    it 'is an object', ->
      expect(typeof @instance).toBe 'object'

    it 'has an id', ->
      expect(@instance.id).toBe 1

    describe 'Relation functions', ->
      it 'has external keys', ->
        expect(@instance.submodel_id()).toBe 1

      it 'gets has_one relations', ->
        @instance.submodel_get {}, (data) ->
          expect(data).toEqual jasmine.objectContaining({ id: 1 })

        request = jasmine.Ajax.requests.mostRecent()
        request.respondWith Responses.general

      it 'gets has_many relations', ->
        spyOn @instance, 'multisubmodels'

        @instance.multisubmodel_get {}

        request = jasmine.Ajax.requests.mostRecent()
        request.respondWith Responses.generalMulti

        expect(@instance.multisubmodels).toHaveBeenCalled()
        #expect(@instance.multisubmodels).toHaveBeenCalledWith jasmine.objectContaining({ id: 1 })

      it 'creates has_many relations', ->
        spyOn @instance.multisubmodels, 'push'

        @instance.multisubmodel_add {}

        request = jasmine.Ajax.requests.mostRecent()
        request.respondWith Responses.generalMulti

        expect(@instance.multisubmodels.push).toHaveBeenCalled()
        #expect(@instance.multisubmodels.push).toHaveBeenCalledWith jasmine.objectContaining({ id: 1 })
