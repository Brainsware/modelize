Modelize
========

Modelize is a small and simple model/data interface for REST APIs using KnockoutJS.

This is a super early and very unstable release.

Usage
========

Here an example model definition in coffeescript:

```
# Post model with a simple 1:n relation for comments and two editable data fields
Post = Modelize
  api: 'posts'
  has_many:
    'comments':
      model: 'Comment'
  editable: [
    'title',
    'content']

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

```
Model = Modelize
  api: 'stuff'
```

Documentation
============

TBD.
