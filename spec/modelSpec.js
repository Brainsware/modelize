var Author, Comment, Post, Responses, co;

Responses = {
  general: {
    status: 200,
    responseText: '{"id": 1, "author_id": 1}'
  },
  generalMulti: {
    status: 200,
    responseText: '[{"id": 1}]'
  }
};

co = new RESTConnector('/');

Post = Modelize({
  api: 'posts',
  connector: co,
  has_one: {
    author: {
      model: 'Author'
    }
  },
  has_many: {
    comment: {
      model: 'Comment'
    }
  },
  editable: ['title', 'content'],
  hash_salt: 'generated_salt_1234',
  hashed_index: ['year']
});

Author = Modelize({
  api: 'authors',
  connector: co
});

Comment = Modelize({
  api: 'comments',
  connector: co,
  belongs_to: {
    posts: {
      model: 'Post'
    }
  }
});

describe('Public Model API', function() {
  beforeAll(function() {
    jasmine.Ajax.install();
    return this.instance = new Post();
  });
  it('is a function', function() {
    return expect(typeof Post).toBe('function');
  });
  it('gets and calls a function', function() {
    var request;
    Post.get({}, function(data) {
      expect(typeof data).toBe('object');
      return expect(data.id).toBe(1);
    });
    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe('/posts');
    expect(request.method).toBe('GET');
    expect(request.data()).toEqual({});
    return request.respondWith(Responses.general);
  });
  it('gets and puts into an observable', function() {
    var request;
    ObservableArray(this, 'posts');
    spyOn(this.posts, 'push');
    Post.get({}, this.posts);
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(Responses.generalMulti);
    expect(this.posts.push).toHaveBeenCalled();
    return expect(this.posts.push).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 1
    }));
  });
  it('gets with hashed indexes', function() {
    var request;
    Post.get({
      year: 2016
    }, function(data) {});
    request = jasmine.Ajax.requests.mostRecent();
    return expect(request.url).toBe('/posts?year=6298c87611a8f30f101413c74275e426623681c63cf7a5c415543ad496ee5c40');
  });
  it('creates and calls a function', function() {
    var request;
    Post.create({}, function(data) {
      expect(typeof data).toBe('object');
      return expect(data.id).toBe(1);
    });
    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe('/posts');
    expect(request.method).toBe('POST');
    expect(request.data()).toEqual({});
    return request.respondWith(Responses.general);
  });
  it('creates and puts into an observable', function() {
    var request;
    ObservableArray(this, 'test');
    spyOn(this.test, 'push');
    Post.create({}, this.test);
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(Responses.general);
    expect(this.test.push).toHaveBeenCalled();
    return expect(this.test.push).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 1
    }));
  });
  return describe('Instance functions', function() {
    beforeAll(function() {
      var request;
      Post.get_one(1, (function(_this) {
        return function(data) {
          return _this.instance = new Post(data);
        };
      })(this));
      request = jasmine.Ajax.requests.mostRecent();
      return request.respondWith(Responses.general);
    });
    it('is an object', function() {
      return expect(typeof this.instance).toBe('object');
    });
    it('has an id', function() {
      return expect(this.instance.id).toBe(1);
    });
    return describe('Relation functions', function() {
      it('has external keys', function() {
        return expect(this.instance.author_id()).toBe(1);
      });
      it('gets has_one relations', function() {
        var request;
        this.instance.author_get(function(data) {
          return expect(data).toEqual(jasmine.objectContaining({
            id: 1
          }));
        });
        request = jasmine.Ajax.requests.mostRecent();
        return request.respondWith(Responses.general);
      });
      it('gets has_many relations', function() {
        var request;
        spyOn(this.instance, 'comments');
        this.instance.comment_get({});
        request = jasmine.Ajax.requests.mostRecent();
        request.respondWith(Responses.generalMulti);
        return expect(this.instance.comments).toHaveBeenCalled();
      });
      it('creates has_many relations', function() {
        var request;
        spyOn(this.instance.comments, 'push');
        this.instance.comment_add({});
        request = jasmine.Ajax.requests.mostRecent();
        request.respondWith(Responses.generalMulti);
        return expect(this.instance.comments.push).toHaveBeenCalled();
      });
      return it('exports external keys', function() {
        var data;
        data = this.instance["export"]();
        return expect(data).toEqual(jasmine.objectContaining({
          author_id: 1
        }));
      });
    });
  });
});
