ko.observableArray.fn.pushAll = (items) ->
  if(!(itsems instanceof Array))
    return this.peek().length
  this.valueWillMutate()
  ko.utils.arrayPushAll(this.peek(), items)
  this.valueHasMutated()
  return this.peek().length

ko.bindingHandlers.currency =
  symbol: ko.observable '€'
  update: (element, valueAccessor, allBindingsAccessor) ->
    return ko.bindingHandlers.text.update element, ->
      value = +(ko.utils.unwrapObservable(valueAccessor()) || 0)
      symbol = ko.utils.unwrapObservable( unless allBindingsAccessor().symbol == undefined then allBindingsAccessor().symbol else ko.bindingHandlers.currency.symbol )
      
      return symbol + " " + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

ko.bindingHandlers.date =
  format: ko.observable 'DD.MM.YYYY'
  update: (element, valueAccessor, allBindingsAccessor) ->
    return ko.bindingHandlers.text.update element, ->
      value = ko.utils.unwrapObservable(valueAccessor()) || '0000-00-00'
      format = ko.utils.unwrapObservable( unless allBindingsAccessor().format == undefined then allBindingsAccessor().format else ko.bindingHandlers.date.format )
      
      return moment(value, 'YYYY-M-D').format(format)

ko.bindingHandlers.href =
  update: (element, valueAccessor) ->
    ko.bindingHandlers.attr.update element, ->
      { href: valueAccessor() }

ko.bindingHandlers.src =
  update: (element, valueAccessor) ->
    ko.bindingHandlers.attr.update element, ->
      { src: valueAccessor() }

ko.bindingHandlers.hidden =
  update: (element, valueAccessor) ->
    value = ko.utils.unwrapObservable(valueAccessor())
    ko.bindingHandlers.visible.update element, ->
      return !value;

ko.bindingHandlers.allowEdit =
  update: (element, valueAccessor) ->
    if !valueAccessor()
      element.disabled = true;
      element.readOnly = true;

      $(':input', element).attr('readOnly', 'readOnly')