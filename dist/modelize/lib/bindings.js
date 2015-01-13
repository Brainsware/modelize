ko.observableArray.fn.pushAll = function(items) {
  if (!(itsems instanceof Array)) {
    return this.peek().length;
  }
  this.valueWillMutate();
  ko.utils.arrayPushAll(this.peek(), items);
  this.valueHasMutated();
  return this.peek().length;
};

ko.bindingHandlers.currency = {
  symbol: ko.observable('€'),
  update: function(element, valueAccessor, allBindingsAccessor) {
    return ko.bindingHandlers.text.update(element, function() {
      var symbol, value;
      value = +(ko.utils.unwrapObservable(valueAccessor()) || 0);
      symbol = ko.utils.unwrapObservable(allBindingsAccessor().symbol !== void 0 ? allBindingsAccessor().symbol : ko.bindingHandlers.currency.symbol);
      return symbol + " " + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    });
  }
};

ko.bindingHandlers.date = {
  format: ko.observable('DD.MM.YYYY'),
  update: function(element, valueAccessor, allBindingsAccessor) {
    return ko.bindingHandlers.text.update(element, function() {
      var format, value;
      value = ko.utils.unwrapObservable(valueAccessor()) || '0000-00-00';
      format = ko.utils.unwrapObservable(allBindingsAccessor().format !== void 0 ? allBindingsAccessor().format : ko.bindingHandlers.date.format);
      return moment(value, 'YYYY-M-D').format(format);
    });
  }
};

ko.bindingHandlers.href = {
  update: function(element, valueAccessor) {
    return ko.bindingHandlers.attr.update(element, function() {
      return {
        href: valueAccessor()
      };
    });
  }
};

ko.bindingHandlers.src = {
  update: function(element, valueAccessor) {
    return ko.bindingHandlers.attr.update(element, function() {
      return {
        src: valueAccessor()
      };
    });
  }
};

ko.bindingHandlers.hidden = {
  update: function(element, valueAccessor) {
    var value;
    value = ko.utils.unwrapObservable(valueAccessor());
    return ko.bindingHandlers.visible.update(element, function() {
      return !value;
    });
  }
};

ko.bindingHandlers.allowEdit = {
  update: function(element, valueAccessor) {
    if (!valueAccessor()) {
      element.disabled = true;
      element.readOnly = true;
      return $(':input', element).attr('readOnly', true);
    } else {
      element.disabled = false;
      element.readOnly = false;
      return $(':input', element).attr('readOnly', false);
    }
  }
};

//# sourceMappingURL=bindings.js.map
