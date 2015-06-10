$ = require 'jquery'
Helpers = require './helpers'
Supports = require './supports'

class Circle
	@create: (triangle = true) ->
		c = new Circle triangle
		c.el.innerLabel = (label) -> c.innerLabel label
		c.el.outerLabel = (label, direction) -> c.outerLabel label, direction
		c.el.color = (color) -> c.color color
		c.el.link = (url) -> c.el.attr 'href', url
		c.el.unlink = -> c.el.removeAttr 'href'
		c.el.outerLabelEl = c.outerLabelEl
		c.el.innerLabelEl = c.innerLabelEl

		c.el.clickable = (fn) ->
			clickEvent = if Supports.touch then 'tap' else 'click'
			clickStart = if Supports.touch then 'touchstart' else 'mousedown'
			clickEnd = if Supports.touch then 'touchend' else 'mouseup'
			c.el.off clickEvent
			if fn is false
				c.el.removeClass 'clickable'
			else
				if (clickEvent is "tap") or true
					c.el.on clickStart, ->
						preTransform = c.el[0].style[Helpers.transform]
						preTransition = c.el[0].style[Helpers.transition]
						c.el[0].style[Helpers.transform] += ' scale(0.9)'
						c.el[0].style[Helpers.transition] += 'none'
						$(window).one clickEnd, ->
							c.el[0].style[Helpers.transform] = preTransform
							c.el[0].style[Helpers.transition] = preTransition

				c.innerLabelEl.on 'click', (e) -> fn.apply(c.el, [e])
				c.el.addClass 'clickable'
		c.el

	constructor: (@triangle = true) ->
		cir = $ '<a>'
			.addClass 'circle'

		if @triangle
			edge = $('<div>').addClass('edge')
			triangle = $ '<div>'
				.addClass 'triangle'
				.appendTo edge
			cir.append edge

		@outerLabelEl = $("<div>").addClass "outer-label"
		@innerLabelEl = $("<div>").addClass "inner-label"

		cir.append [ @outerLabelEl, @innerLabelEl ]

		@el = cir

	innerLabel: (label) ->
		@innerLabelEl.empty().append label
		@el

	outerLabel: (label, direction = 'auto') ->
		@direction = direction
		@el.direction = direction
		text = $("<div>").addClass("text").append label
		@outerLabelEl.empty().append text
		@el

	color: (color) ->
		@el.css 'background-color', color
		@el
			.find '.triangle'
			.css 'border-left-color', color
		@el

module.exports = Circle