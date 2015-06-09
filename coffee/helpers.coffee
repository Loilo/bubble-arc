module.exports =
	transform: do ->
		el = document.createElement('fakeelement')
		transforms = 
			'transform': 'transform'
			'OTransform': '-o-transform'
			'MozTransform': '-moz-transform'
			'WebkitTransform': '-webkit-transform'
			'msTransform': '-ms-transform'
		for t of transforms
			return transforms[t] if el.style[t]?
		return false

	transition: do ->
		el = document.createElement('fakeelement')
		transitions = 
			'transition': 'transition'
			'OTransition': '-o-transition'
			'MozTransition': '-moz-transition'
			'WebkitTransition': '-webkit-transition'
		for t of transitions
			return transitions[t] if el.style[t]?
		return false

	transitionEvent: do ->
		el = document.createElement('fakeelement')
		transitions = 
			'transition': 'transitionend'
			'OTransition': 'oTransitionEnd'
			'MozTransition': 'transitionend'
			'WebkitTransition': 'webkitTransitionEnd'
		for t of transitions
			return transitions[t] if el.style[t]?
		return false

	animationEvent: do ->
		el = document.createElement('fakeelement')
		animations = 
			'animation': 'animationend'
			'OAnimation': 'oAnimationEnd'
			'MozAnimation': 'animationend'
			'WebkitAnimation': 'webkitAnimationEnd'
		for t of animations
			return animations[t] if el.style[t]?
		return false

	arcFn: (deg, fn) ->
		accuracy = 10
		arc = deg * Math.PI / 180
		accHelper = Math.pow(10, accuracy)
		res = Math[fn](arc)
		res = Math.round(res * accHelper) / accHelper
		res
	
	sin: (deg) -> Helpers.arcFn deg, 'sin'
	cos: (deg) -> Helpers.arcFn deg, 'cos'
	
	deg2coords: (deg) ->
		y = Helpers.sin deg
		x = Helpers.cos deg
		return [x, y]
