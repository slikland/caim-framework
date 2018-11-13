###*
Bunch of utilities methods for scroll control
@class ScrollUtils
@static
###
class ScrollUtils
	@const SCROLL_KEYS: {38: 1, 40: 1}

	###*
	@method disableScroll
	@static
	@param {HTMLElement} [targetElement=window]
	###
	@disableScroll:(targetElement = window)->
		return if @_disabled or !targetElement.addEventListener?
		targetElement.addEventListener('DOMMouseScroll', @_setPreventDefault, false)
		targetElement.addEventListener('onwheel', @_setPreventDefault, false)
		targetElement.addEventListener('mousewheel', @_setPreventDefault, false)
		targetElement.addEventListener('touchmove', @_setPreventDefault, false)
		window.addEventListener('keydown', @_setPreventScrollKeys, false)
		@_disabled = true
		undefined

	@enableScroll:(targetElement = window)->
		return if !@_disabled or !targetElement.removeEventListener?
		targetElement.removeEventListener('DOMMouseScroll', @_setPreventDefault, false)
		targetElement.removeEventListener('wheel', @_setPreventDefault, false)
		targetElement.removeEventListener('mousewheel', @_setPreventDefault, false)
		targetElement.removeEventListener('touchmove', @_setPreventDefault, false)
		window.removeEventListener('keydown', @_setPreventScrollKeys, false)
		@_disabled = false
		undefined

	@_setPreventDefault = (event)=>
		console.log(event)
		if event?
			event.preventDefault?()
			event.stopImmediatePropagation?()
			event.returnValue = false
			return false

	@_setPreventScrollKeys: (event)=>
		if event?.keyCode and @SCROLL_KEYS[event.keyCode]
			@_setPreventDefault(event)
			return false
