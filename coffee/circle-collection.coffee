$ = require 'jQuery'
Circle = require './circle.coffee'
Helpers = require './helpers.coffee'

class CircleCollection
	constructor: (elements = []) ->
		if typeof elements is "number"
			num = elements
			elements = []
			for i in [1..num]
				circle = Circle.create()
					.innerLabel i

				elements.push circle
		
		@elements = elements

	each: (fn) -> @elements.forEach fn
	size: -> @elements.length


	append: (circle) -> @add circle, @size()
	add: (circle, position) ->
		if circle instanceof Array
			pos = []
			for i, c of circle
				@add(c, position + i)
				pos.push (position + i)
			return pos
		else
			@elements.splice position, 0, circle
			return position

	remove: (what) ->
		if typeof what is 'number'
			pos = what
			el = @elements.splice pos, 1
		else
			pos = @elements.indexOf(what)
			el = @elements.splice pos, 1

		body = $('body')
		el = el[0]
		clone = el.clone()
		clone
			.removeClass 'notrans'
			.css
				position: 'absolute'
				top: el.offset().top + body.scrollTop()
				left: el.offset().left + body.scrollLeft()
				zIndex: 99
			.css Helpers.transform, 'none'
		setTimeout ->
			clone.addClass 'out'
			clone.on Helpers.animationEvent, ->
				clone.remove()

		body.prepend clone
		el.remove()
		pos

	removeLast: -> @remove (@elements.length - 1)
	removeFirst: -> @remove 0
			
	get: -> @elements
	reverse: -> @elements = @elements.reverse()

module.exports = CircleCollection