$.post_json = (url, args...) ->
	$.post(url, 'json')                   if args.length == 0
	$.post(url, args[0], 'json')          if args.length == 1
	$.post(url, args[0], args[1], 'json') if args.length == 2

	console.log(args) if args.length == 4 # What?

$.get_json = (url, args...) ->
	$.get(url, 'json')                   if args.length == 0
	$.get(url, args[0], 'json')          if args.length == 1
	$.get(url, args[0], args[1], 'json') if args.length == 2

	console.log(args) if args.length == 4 # What?