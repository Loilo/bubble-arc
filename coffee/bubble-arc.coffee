$ = require 'jquery'
Helpers = require './helpers.coffee'
Supports = require './support.coffee'
Circle = require './circle.coffee'
CircleCollection = require './circle-collection.coffee'

class BubbleArc
	@helpers: Helpers
	@supports: Supports

	defaults: (obj1, obj2) ->
		for prop, val of obj2
			obj1[prop] = val unless obj1[prop]?
		obj1

	animations: (state) ->
		if state?
			prom = $.Deferred()
			@animation = state
			setTimeout -> prom.resolve()
			prom
		else
			@animation and Supports.transition


	getOption: (key) -> @options[key]
	setOption: (key, value) ->
		@options[key] = value
		@
	setOptions: (obj) ->
		@setOption key, value for key, value of obj
		@

	constructor: (options = {}) ->
		@options = @defaults options,
			classes: ''
			radius: [6, 'em']
			degrees: 360
			fillLast: false 
			align: 'center' # or: first, last
			offset: 90      # offset from right

		@el = $('<div>').addClass @options.classes
		@circles = new CircleCollection
		@animations on
		#@el.append @circles.get()
		#@arrangeAll()

	setCollection: (coll, hide = true) ->
		promise = $.Deferred()

		@circles = coll

		@el.children('.circle').remove()
		@el.append @circles.get()

		promise2 = $.Deferred()
		if hide
			promises = []
			@circles.each (circle) ->
				circle.addClass 'notrans'
				circle.addClass 'collapsed'
				prom2 = $.Deferred()
				promises.push prom2
				setTimeout ->
					circle.removeClass 'notrans'
					prom2.resolve()

			$.when(promises...).then =>
				@arrangeAll().then -> promise2.resolve()

		else
			@arrangeAll().then -> promise2.resolve()

		promise2.then -> promise.resolve()
		promise

	dom: -> @el

	pause: (ms) ->
		promise = $.Deferred()
		setTimeout ->
			promise.resolve()
		, ms
		promise

	splitArc: (amount = @size()) ->
		calcAmount = if @options.fillLast then amount - 1 else amount
	
		degs = []
		angleDeg = @options.degrees
		if calcAmount isnt 0
			distanceDeg = angleDeg / calcAmount
		else
			distanceDeg = 0
	
		additionalOffsets =
			first: 0
			center: calcAmount / 2
			last: calcAmount

		for i in [1..amount]
			degs.push (
				(i - 1) * distanceDeg\ 
				+ @options.offset\
				- additionalOffsets[@options.align] * distanceDeg
			)

		degs

	arrange: (circle, angle, radius, unit = 'px') ->
		promise = $.Deferred()
		if not Supports.transform
			promise.resolve()
			return promise

		[x, y] = Helpers.deg2coords angle

		circle.addClass 'notrans' if @animations() is off

		circle.outerLabelEl.removeClass('top bottom left right')

		if circle.direction is "auto"
			if Math.abs(x) > Math.abs(y)
				if x > 0
					circle.outerLabelEl.addClass "right"
				else
					circle.outerLabelEl.addClass "left"
			else
				if y > 0
					circle.outerLabelEl.addClass "bottom"
				else
					circle.outerLabelEl.addClass "top"
		else
			if circle.direction is "vertical"
				if y > 0
					circle.outerLabelEl.addClass "bottom"
				else
					circle.outerLabelEl.addClass "top"
			else
				if x > 0
					circle.outerLabelEl.addClass "right"
				else
					circle.outerLabelEl.addClass "left"


		pre = circle[0].style[Helpers.transform]

		circle.css Helpers.transform, """
			translateX(#{x * radius}#{unit}) \
			translateY(#{y * radius}#{unit})
		"""
		circle.find('.edge').css(
			Helpers.transform,
			"rotate(#{angle + 180}deg)"
		)

		setTimeout =>
			if @animations()
				if (pre is circle[0].style[Helpers.transform]) or not pre? or (pre.length is 0)
					circle.removeClass 'notrans'
					promise.resolve()
				else
					circle.on Helpers.transitionEvent, ->
						circle.removeClass 'notrans'
						promise.resolve()
			else
				circle.removeClass 'notrans'
				promise.resolve()

		promise

	arrangeAll: (radius = @options.radius[0], unit = @options.radius[1]) ->
		angles = @splitArc()
		promiseAll = $.Deferred()
		promises = []

		@circles.each (circle, i) =>
			promises.push @arrange(circle, angles[i], radius, unit)

		$.when(promises...).then -> promiseAll.resolve()
		promiseAll


	collapse: ->
		instant = not @animations()
		promise = $.Deferred()

		allPromises = []

		@circles.each (circle, i) ->
			promiseLoop = $.Deferred()
			allPromises.push promiseLoop

			pre = circle[0].style[Helpers.transform]

			circle.addClass 'notrans' if instant

			setTimeout ->
				circle.removeClass 'expanding'
				if Supports.transition
					if pre is circle.css(Helpers.transform) or instant
						circle
							.addClass 'collapsed'
						promiseLoop.resolve()
					else
						circle.addClass 'collapsed'
						circle.on Helpers.transitionEvent, ->
							promiseLoop.resolve()
				else
					circle.addClass 'collapsed'
					promiseLoop.resolve()

				setTimeout ->
					circle.removeClass 'notrans'


		$.when(allPromises...).then -> promise.resolve()
		promise


	expand: ->
		instant = not @animations()
		promise = $.Deferred()

		allPromises = []

		@circles.each (circle, i) ->
			promiseLoop = $.Deferred()
			allPromises.push promiseLoop

			pre = circle[0].style[Helpers.transform]

			circle.addClass 'notrans' if instant

			setTimeout ->
				if Supports.transition
					if pre is circle[0].style[Helpers.transform] or instant
						circle
							.removeClass 'collapsed'
							.addClass 'expanding'
						promiseLoop.resolve()
					else
						circle
							.addClass 'expanding'
							.removeClass 'collapsed'
							.on Helpers.transitionEvent, ->
								promiseLoop.resolve()
				else
					circle.removeClass 'collapsed'
					promiseLoop.resolve()

				setTimeout ->
					circle.removeClass 'notrans'


		$.when(allPromises...).then -> promise.resolve()
		promise


	size: -> @circles.size()
	add: (circles, position) ->
		pos = @circles.add circles, position
		pos = [pos] unless pos instanceof Array
		pos.forEach (el, k) =>
			@circles.get()[k].addClass "in"
			@el.append @circles.get()[k]
		@arrangeAll()

	remove: (what) ->
		@circles.remove what
		@arrangeAll()
	removeFirst: ->
		@circles.removeFirst()
		@arrangeAll()
	removeLast: ->
		@circles.removeLast()
		@arrangeAll()
	reverse: ->
		@circles.reverse()
		@arrangeAll()

module.exports = BubbleArc