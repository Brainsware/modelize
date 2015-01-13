Sortable = (self) ->
  self.move = (to, callback) =>
    self.update { sort: to }, callback

  self.move_ui = (element) =>
    item = element.item
    to  = element.targetIndex

    item.update sort: to

  return self