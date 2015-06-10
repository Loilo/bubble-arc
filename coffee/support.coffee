Helpers = require './helpers.coffee'

module.exports =
	transition: Helpers.transition isnt false
	transform: Helpers.transform isnt false
	touch: 'ontouchstart' in document.documentElement