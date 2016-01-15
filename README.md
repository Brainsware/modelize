![Travis Build](https://img.shields.io/travis/Brainsware/modelize/master.svg)  
![Bower Release](https://img.shields.io/bower/v/modelize.svg) ![Bower License](https://img.shields.io/bower/l/modelize.svg)

# Modelize

Modelize is a small model/data interface for REST APIs using KnockoutJS. It also integrates encryption functionality in combination with SJCL.


# Basic Usage

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
api_connector = new RESTConnector('/api/')
```

Then define some models in coffeescript:

```coffee
# Post model with a simple 1:n relation for comments and two editable data fields
Post = Modelize
  api: 'posts'
  connector: api_connector
  has_many:
    comment:
      model: 'Comment'
  editable: [
    'title',
    'content' ]

# The corresponding comment model
Comment = Modelize
  api: 'posts'
  connector: api_connector
  belongs_to:
    post:
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

# Docs

## Relations

### has_one and belongs_to relations

has_one relations add a ```relation_id``` field to the main model.

```coffee
relation()
```

```coffee
relation_get([parameters], [callbackOrObservable])
```

### has_many relations

```coffee
relations()
# For Example:
Post.comments()
```

has_many relation access is always extended with an 's'. So relation 'comment', turns to to 'comments'

```coffee
relation_get([parameters], [callbackOrObservable])
# For Example:
Post.comment_get()
# Or
Post.comment_get({ status: 'not_spam' })
```

```coffee
relation_add([parameters], [callbackOrObservable])
```

```coffee
relation_destroy([callback])
```

## Observable types

```coffee
editable
```

```coffee
functions
```

```coffee
observable
```

```coffee
computed
```

```coffee
purecomputed
```

## Predefined functions

```coffee
create(callback)
```

```coffee
update(params, callback)
```

```coffee
export([id])
```

## Containers

### Usage

```coffee
Post = Modelize
  container:
    MetaInformation: {}
```

### Definition
