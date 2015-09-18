Modelize
========

Modelize is a small model/data interface for REST APIs using KnockoutJS.

This is a super early release. There's still some basic usability stuff missing, but that'll come soon.

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
<!-- Modelize -->
<script src="/vendor/modelize/dist/modelize.min.js"></script>
```

Then define some models in coffeescript:

```coffee
# Post model with a simple 1:n relation for comments and two editable data fields
Post = Modelize
  api: 'posts'
  has_many:
    'comments':
      model: 'Comment'
  editable: [
    'title',
    'content' ]

# The corresponding comment model
Comment = Modelize
  api: 'posts'
  belongs_to:
    'post':
      model: 'Post'
      key:   'post_id'
  editable: [
    'content']
```

But basically the model can be as short as just this:

```coffee
Model = Modelize
  api: 'stuff'
```

Using your models:

```coffee
# Get all (published e.g.) posts and put them in the observable array @posts
Post.get { status: 'published' }, @posts
# You can also define custom methods for retrieval
Post.get { id: 1 }, (post) =>
  console.log post
```
