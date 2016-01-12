PostData = Container
  editable: [
    'title',
    'content'
  ]

co = new RESTConnector('/')

Post = Modelize
  api: 'posts'
  connector: co
  container:
    PostData: {}

describe 'Container', ->
  beforeAll ->
    @container_instance = new PostData()
    @post_instance = new Post()

  it 'is a function', ->
    expect(typeof PostData).toBe 'function'
