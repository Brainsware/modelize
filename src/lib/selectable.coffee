Selectable = (self) ->
  self.selected = ko.observable false

  self.select = (item, element) => self.selected !self.selected()

  return self
