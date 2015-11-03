Modelize
========

Modelize is a small model/data interface for REST APIs using KnockoutJS. It also integrates encryption functionality in combination with SJCL.


Basic Usage
========

Page setup first, include all required scripts:

```html
<!-- jQuery -->
<script src="/vendor/jquery/dist/jquery.min.js"></script>
<!-- jQuery rest -->
<script src="/vendor/jquery.rest/dist/1/jquery.rest.min.js"></script>
<!-- Knockout -->
<script src="/vendor/knockoutjs/dist/knockout.js"></script>
<!-- SJCL (optional) -->
<script src="/vendor/sjcl/sjcl.js"></script>
<!-- Modelize -->
<script src="/vendor/modelize/dist/modelize.min.js"></script>
```

Setup a connector:

```coffee
api_connector = new Connector('/api/', 'jquery.rest')
```

Then define some models in coffeescript:

```coffee
# Post model with a simple 1:n relation for comments and two editable data fields
Post = Modelize
  api: 'posts'
  connector: api_connector
  has_many:
    'comments':
      model: 'Comment'
  editable: [
    'title',
    'content' ]

# The corresponding comment model
Comment = Modelize
  api: 'posts'
  connector: api_connector
  belongs_to:
    'post':
      model: 'Post'
  editable: [
    'content']
```

But basically the model can be as short as just this:

```coffee
Model = Modelize
  api: 'stuff'
  connector: api_connector
```

Using your models:

```coffee
# Get all (published e.g.) posts and put them in the observable array @posts
Post.get { status: 'published' }, @posts
# You can also define custom methods for retrieval
Post.get { id: 1 }, (post) =>
  console.log post
```

