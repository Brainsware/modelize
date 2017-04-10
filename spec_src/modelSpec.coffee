Responses =
  general:
    status: 200
    responseText: '{"id": 1, "author_id": 1}'
  generalMulti:
    status: 200
    responseText: '[{"id": 1}]'

co = new RESTConnector('/')

Post = Modelize
  api: 'posts'
  connector: co
  has_one:
    author:
      model: 'Author'
  has_many:
    comment:
      model: 'Comment'
  editable: [ 'title', 'content' ]
  hash_salt: 'generated_salt_1234'
  hashed_index: [ 'year' ]

# Single Submodel
Author = Modelize
  api: 'authors'
  connector: co

# Multi Submodel
Comment = Modelize
  api: 'comments'
  connector: co
  belongs_to:
    posts:
      model: 'Post'

describe 'Public Model API', ->
  afterAll ->
    jasmine.Ajax.uninstall()
    
  beforeAll ->
    jasmine.Ajax.install()

    @instance = new Post()

  it 'is a function', ->
    expect(typeof Post).toBe 'function'

  it 'gets and calls a function', ->
    Post.get {}, (data) ->
      expect(typeof data).toBe 'object'
      expect(data.id).toBe 1

    request = jasmine.Ajax.requests.mostRecent()

    expect(request.url).toBe '/posts'
    expect(request.method).toBe 'GET'
    expect(request.data()).toEqual {}

    request.respondWith Responses.general

  it 'gets and puts into an observable', ->
    ObservableArray @, 'posts'
    spyOn @posts, 'push'

    Post.get {}, @posts

    request = jasmine.Ajax.requests.mostRecent()
    request.respondWith Responses.generalMulti

    expect(@posts.push).toHaveBeenCalled()
    expect(@posts.push).toHaveBeenCalledWith jasmine.objectContaining({ id: 1 })

  it 'gets with hashed indexes', ->
    Post.get { year: 2016 }, (data) ->

    request = jasmine.Ajax.requests.mostRecent()

    expect(request.url).toBe '/posts?year=6298c87611a8f30f101413c74275e426623681c63cf7a5c415543ad496ee5c40'

  it 'creates and calls a function', ->
    Post.create {}, (data) ->
      expect(typeof data).toBe 'object'
      expect(data.id).toBe 1

    request = jasmine.Ajax.requests.mostRecent()

    expect(request.url).toBe '/posts'
    expect(request.method).toBe 'POST'
    expect(request.data()).toEqual {}

    request.respondWith Responses.general

  it 'creates and puts into an observable', ->
    ObservableArray @, 'test'
    spyOn @test, 'push'

    Post.create {}, @test

    request = jasmine.Ajax.requests.mostRecent()
    request.respondWith Responses.general

    expect(@test.push).toHaveBeenCalled()
    expect(@test.push).toHaveBeenCalledWith jasmine.objectContaining({ id: 1 })

  describe 'Instance functions', ->
    beforeAll ->
      Post.get_one 1, (data) =>
        @instance = new Post(data)

      request = jasmine.Ajax.requests.mostRecent()
      request.respondWith Responses.general

    it 'is an object', ->
      expect(typeof @instance).toBe 'object'

    it 'has an id', ->
      expect(@instance.id).toBe 1

    describe 'Relation functions', ->
      it 'has external keys', ->
        expect(@instance.author_id()).toBe 1

      it 'gets has_one relations', ->
        @instance.author_get (data) ->
          expect(data).toEqual jasmine.objectContaining({ id: 1 })

        request = jasmine.Ajax.requests.mostRecent()
        request.respondWith Responses.general

      it 'gets has_many relations', ->
        spyOn @instance, 'comments'

        @instance.comment_get {}

        request = jasmine.Ajax.requests.mostRecent()
        request.respondWith Responses.generalMulti

        expect(@instance.comments).toHaveBeenCalled()
        #expect(@instance.comments).toHaveBeenCalledWith jasmine.objectContaining({ id: 1 })

      it 'creates has_many relations', ->
        spyOn @instance.comments, 'push'

        @instance.comment_add {}

        request = jasmine.Ajax.requests.mostRecent()
        request.respondWith Responses.generalMulti

        expect(@instance.comments.push).toHaveBeenCalled()
        #expect(@instance.comments.push).toHaveBeenCalledWith jasmine.objectContaining({ id: 1 })

      it 'exports external keys', ->
        data = @instance.export()

        expect(data).toEqual jasmine.objectContaining({ author_id: 1 })
