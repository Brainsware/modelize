var Post, PostData, co;

PostData = Container({
  editable: ['title', 'content']
});

co = new RESTConnector('/');

Post = Modelize({
  api: 'posts',
  connector: co,
  container: {
    PostData: {}
  }
});

describe('Container', function() {
  beforeAll(function() {
    this.container_instance = new PostData();
    return this.post_instance = new Post();
  });
  return it('is a function', function() {
    return expect(typeof PostData).toBe('function');
  });
});
