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

  it 'can add comments', ->
    expect(typeof @post.comments_add).toBe 'function'

    @post.comments_add
      title:  'Test Title'
      conent: 'Test Content'
