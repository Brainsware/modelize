var DelayedSave, Editable;

Editable = function(self, property, change) {
  var editing_property;
  editing_property = 'editing_' + property;
  Observable(self, property);
  Observable(self, editing_property, self[property]() === '' || (self[property]() == null));
  self[property].subscribe((function(_this) {
    return function(new_value) {
      var r;
      r = change(new_value, property);
      if (r !== true) {
        return self[editing_property](false);
      }
    };
  })(this));
  self['edit_' + property] = (function(_this) {
    return function() {
      return self[editing_property](true);
    };
  })(this);
  return self;
};

DelayedSave = function(value, prop, delay) {
  if (delay == null) {
    delay = 250;
  }
  clearTimeout(window.timeoutEditor);
  return window.timeoutEditor = setTimeout((function(_this) {
    return function() {
      if (type === 'content') {
        return _this.article().content(window.editor.serialize().post_content.value);
      } else if (type === 'title') {
        return _this.article().title(window.title_editor.serialize().post_title.value);
      } else if (type === 'pretext') {
        return _this.article().pretext(window.pretext_editor.serialize().post_pretext.value);
      }
    };
  })(this), delay);
};

//# sourceMappingURL=editable.js.map
