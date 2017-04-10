var Responses;

Responses = {
  general: {
    status: 200,
    responseText: '{"id": 1}'
  },
  generalMulti: {
    status: 200,
    responseText: '[{"id": 1}]'
  }
};

describe('Container', function() {
  afterAll(function() {
    jasmine.Ajax.uninstall();
    return jasmine.clock().uninstall();
  });
  beforeAll(function() {
    var Comment, Post, PostData, co;
    jasmine.Ajax.install();
    jasmine.clock().install();
    PostData = Container({
      editable: ['title', 'content']
    });
    Comment = Container({
      editable: ['title', 'content'],
      observable: ['editing']
    });
    co = new RESTConnector('/');
    Post = Modelize({
      api: 'posts',
      save_delay: 0,
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
  it('has first class objects from container', function() {
    expect(typeof this.post.title).toBe('function');
    expect(typeof this.post.content).toBe('function');
    this.post.title('Post Title');
    return this.post.content('Post Content');
  });
  it('can add comments', function() {
    expect(typeof this.post.comments_add).toBe('function');
    this.post.comments_add({
      title: 'Test Title',
      content: 'Test Content'
    });
    return expect(this.post.comments().length).toBe(1);
  });
  it('exports containers', function() {
    var data;
    data = this.post["export"]();
    expect(data).toEqual(jasmine.objectContaining({
      PostData: {
        title: 'Post Title',
        content: 'Post Content'
      }
    }));
    return expect(data).toEqual(jasmine.objectContaining({
      comments: [
        {
          title: 'Test Title',
          content: 'Test Content'
        }
      ]
    }));
  });
  it('exports all containers on create', function() {
    var comments, datahandler, postdata, request;
    this.post.create();
    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe('/posts');
    expect(request.method).toBe('POST');
    datahandler = new JSONHandler();
    postdata = datahandler.load(request.data()['postdata']);
    comments = datahandler.load(request.data()['comments']);
    expect(postdata).toEqual(jasmine.objectContaining({
      title: 'Post Title',
      content: 'Post Content'
    }));
    expect(comments).toEqual(jasmine.objectContaining([
      {
        title: 'Test Title',
        content: 'Test Content'
      }
    ]));
    request.respondWith(Responses.general);
    return expect(this.post.id).toBe(1);
  });
  return it('saves the container on edit', function() {
    var comments, datahandler, request;
    this.post.comments()[0].title('New Title');
    jasmine.clock().tick(1);
    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe('/posts/1');
    expect(request.method).toBe('POST');
    datahandler = new JSONHandler();
    comments = datahandler.load(request.data()['comments']);
    return expect(comments).toEqual(jasmine.objectContaining([
      {
        title: 'New Title',
        content: 'Test Content'
      }
    ]));
  });
});
