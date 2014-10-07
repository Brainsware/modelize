var __slice = [].slice;

$.post_json = function() {
  var args, url;
  url = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (args.length === 0) {
    $.post(url, 'json');
  }
  if (args.length === 1) {
    $.post(url, args[0], 'json');
  }
  if (args.length === 2) {
    $.post(url, args[0], args[1], 'json');
  }
  if (args.length === 4) {
    return console.log(args);
  }
};

$.get_json = function() {
  var args, url;
  url = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (args.length === 0) {
    $.get(url, 'json');
  }
  if (args.length === 1) {
    $.get(url, args[0], 'json');
  }
  if (args.length === 2) {
    $.get(url, args[0], args[1], 'json');
  }
  if (args.length === 4) {
    return console.log(args);
  }
};

//# sourceMappingURL=json.js.map
