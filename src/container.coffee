# The container main function
# Returns a container object
# A container is a minimal subset of the modelize functionality
#
# @param [Object] options The main configuration object for container
#
Container = (options) ->
  'use strict'

  # Provide the constructor function for the container object.
  # Enriches the optionally provided object with container functions.
  #
  # @param [Object] self prepopulated data object
  #
  container = (self = {}) ->
    # Stores updated information for external retrieval and subscription
    Observable self, '__updated'

    # For external access for first_class containers
    self.editables = options.editable

    # Include selectable functions
    if options.selectable? && options.selectable == true
      Selectable self

    # Set observable fields
    #
    if options.observable?
      for index, name of options.observable
        Observable self, name

    # Set editable fields
    #
    if options.editable?
      for index, name of options.editable
        Editable self, name, => self.__updated(self.export())

    # Set computed fields
    #
    if options.computed?
      for name, fn of options.computed
        Computed self, name, fn
    if options.purecomputed?
      for name, fn of options.purecomputed
        PureComputed self, name, fn

    # Add user defined functions
    #
    if options.functions?
      for name, fn of options.functions
        self[name] = fn

    # Export all model data as an array
    #
    self.export = () =>
      data = {}

      if options.editable?
        for index, name of options.editable
          data[name] = self[name]()

      return data

    return self

  return container

module.exports = Container if module?
