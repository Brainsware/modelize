Responses =
  general:
    status: 200
    responseText: '{"id": 1}'
  generalMulti:
    status: 200
    responseText: '[{"id": 1}]'

describe 'Container', ->
  afterAll ->
    jasmine.Ajax.uninstall()
    jasmine.clock().uninstall()

  beforeAll ->
    jasmine.Ajax.install()
    jasmine.clock().install()

    PostData = Container
      editable: [
        'title',
        'content'
      ]

    Comment = Container
      editable: [
        'title',
        'content'
      ]
      observable: [
        'editing'
      ]

    co = new RESTConnector('/')

    Post = Modelize
      api: 'posts'
      save_delay: 0
      connector: co
      container:
        PostData:
          first_class: true
          datahandler: new JSONHandler()
          container:   PostData
        comments:
          type:        'multi'
          datahandler: new JSONHandler()
          container:   Comment

    @post = new Post()

  it 'has single container', ->
    expect(typeof @post.PostData).toBe 'function'

  it 'has first class objects from container', ->
    expect(typeof @post.title).toBe 'function'
    expect(typeof @post.content).toBe 'function'

    @post.title 'Post Title'
    @post.content 'Post Content'

  it 'can add comments', ->
    expect(typeof @post.comments_add).toBe 'function'

    @post.comments_add
      title:  'Test Title'
      content: 'Test Content'

    expect(@post.comments().length).toBe 1

  it 'exports containers', ->
    data = @post.export()

    expect(data).toEqual jasmine.objectContaining({ PostData: { title: 'Post Title', content: 'Post Content' } })
    expect(data).toEqual jasmine.objectContaining({ comments: [ {title: 'Test Title', content: 'Test Content'} ] })

  it 'exports all containers on create', ->
    @post.create()

    request = jasmine.Ajax.requests.mostRecent()

    expect(request.url).toBe '/posts'
    expect(request.method).toBe 'POST'

    datahandler = new JSONHandler()
    postdata = datahandler.load(request.data()['postdata'])
    comments = datahandler.load(request.data()['comments'])

    expect(postdata).toEqual jasmine.objectContaining({ title: 'Post Title', content: 'Post Content' })
    expect(comments).toEqual jasmine.objectContaining([ {title: 'Test Title', content: 'Test Content'} ])

    request.respondWith Responses.general

    expect(@post.id).toBe 1

  it 'saves the container on edit', ->
    @post.comments()[0].title 'New Title'

    jasmine.clock().tick 1

    request = jasmine.Ajax.requests.mostRecent()

    expect(request.url).toBe '/posts/1'
    expect(request.method).toBe 'POST'

    datahandler = new JSONHandler()
    comments = datahandler.load(request.data()['comments'])

    expect(comments).toEqual jasmine.objectContaining([ {title: 'New Title', content: 'Test Content'} ])
