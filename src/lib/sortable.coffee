Sortable = (self) ->
  self.move = (to, callback) =>
    self.update { sort: to }, callback

  return self