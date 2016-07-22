describe('Container', function() {
  beforeAll(function() {
    var Comment, Post, PostData, co;
    PostData = Container({
      editable: ['title', 'content']
    });
    Comment = Container({
      editable: ['title', 'content']
    });
    co = new RESTConnector('/');
    Post = Modelize({
      api: 'posts',
      connector: co,
      container: {
        PostData: {
          first_class: true,
          datahandler: new JSONHandler(),
          container: PostData
        },
        comments: {
          type: 'multi',
          datahandler: new JSONHandler(),
          container: Comment
        }
      }
    });
    return this.post = new Post();
  });
  it('has single container', function() {
    return expect(typeof this.post.PostData).toBe('function');
  });
  return it('can add comments', function() {
    expect(typeof this.post.comments_add).toBe('function');
    return this.post.comments_add({
      title: 'Test Title',
      conent: 'Test Content'
    });
  });
});
