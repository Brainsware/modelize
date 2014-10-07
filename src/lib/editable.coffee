Editable = (self, property, change) ->
  editing_property = 'editing_' + property

  Observable self, property
  Observable self, editing_property, (self[property]() == '' || !self[property]()?)

  self[property].subscribe (new_value) =>
    r = change new_value, property

    unless r == true
      self[editing_property] false

  self['edit_' + property] = => self[editing_property] true

  return self

DelayedSave = (value, prop, delay = 250) ->
  clearTimeout(window.timeoutEditor)
  window.timeoutEditor = setTimeout(=>

    if (type == 'content')
      @article().content window.editor.serialize().post_content.value
    else if (type == 'title')
      @article().title window.title_editor.serialize().post_title.value
    else if (type == 'pretext')
      @article().pretext window.pretext_editor.serialize().post_pretext.value
    
  , delay)