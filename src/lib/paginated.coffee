# Paginated is an "interface" for JSON collection objects.
# It keeps track of the current page and decides when to wrap.
#
# Given an object (self), it adds the following methods:
#   * page          - get the current page (1 based)
#   * pages         - get the number of pages
#   * count         - get the number of items in the collection, this is just a proxy method (see options)
#   * first_page    - set index to show the first page
#   * last_page     - set index to show the last page
#   * next_page     - set index to show the next, or first page if showing the last page
#   * previous_page - set index to show the previous page, or last page if showing the first page
#
# Options:
#   * method   - mandatory   - must return a JSON collection object
#   * page     - optional    - page (1 based) to load initially, default 0
#   * per_page - optional    - how many items to load per page, default 20

#if typeof require == 'function'
#  Observables = require './observable'
#  Observable  = Observables.Observable
#  Computed    = Observables.Computed

Paginated = (self, options) ->
  throw new Error 'Error: no object or options given' unless self? && options?
  throw new Error 'Error: first parameter is not an object' unless 'object' == typeof self

  # For convenience, if options is only a function, build an object holding the given function
  options = { method: options } if 'function' == typeof options

  # Fail early if given options is not an object!
  unless 'object' == typeof options
    throw new Error 'Invalid type for second parameter (' + typeof options + '), expected function or object'

  # set some default values in the options if not present
  options = object_merge options,
    per_page: 20
    page: 0

  options.page-- if options.page > 0

  unless typeof options.per_page == 'number' && options.per_page > 0
    throw new Error 'Invalid per_page value given'

  # NOTE: without a given retrieve method, we cannot do *anything*.
  throw new Error 'No reload method given' unless options.method?

  Paginated.add_paginated_methods self, options

Paginated.add_paginated_methods = (self, options) ->
  Observable self, '__collection', options.collection  # currently loaded collection, JSON object (see options)
  Observable self, '__reload',     options.method      # __reload(page), must return a JSON object (see options)
  Observable self, '__page',       options.page        # internal index, 0 based

  Observable self, 'per_page',     options.per_page    # items loaded per page

  # 0,1,2,.. => 1,2,3,... for display purposes
  Computed   self, 'page',   => self.__page() + 1          # currently displayed page (1 based)
  Computed   self, 'count',  =>                            # proxy method to the count element of the stored collection
    return self.__collection().count if self.__collection()?
    0

  # Get total number of pages
  Computed   self, 'pages',  =>
    result = parseInt(parseFloat(self.count()) / parseFloat(self.__page()))

    result++ if parseFloat(self.count()) % self.__page() > 0
    result

  # Set index to the show the first page (and reload)
  self.first_page = =>
    self.__page 0

    self.__collection self.__reload()

  self.last_page = =>
    self.__page (self.count() - 1)

    self.__collection self.__reload()

  self.previous_page = =>
    return unless self.page() > 0

    self.__page (self.page() - 1)

    self.__collection self.__reload()

  self.next_page = =>
    return unless self.page() + 1 < self.pages()

    self.__page (self.page() + 1)

    self.__collection self.__reload()

module.exports = Paginated if module?
