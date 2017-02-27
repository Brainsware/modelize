describe 'Container', ->
  beforeAll ->
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

    co = new RESTConnector('/')

    Post = Modelize
      api: 'posts'
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

  it 'exports containers', ->
    data = @post.export()

    expect(data).toEqual jasmine.objectContaining({ PostData: { title: 'Post Title', content: 'Post Content' } })
    expect(data).toEqual jasmine.objectContaining({ comments: [ {title: 'Test Title', content: 'Test Content'} ] })
