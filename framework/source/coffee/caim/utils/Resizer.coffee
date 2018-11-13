#import caim.event.EventDispatcher
#import caim.utils.DOMUtils

###*
@class Resizer
@extends EventDispatcher
@submodule caim.utils
###
class Resizer extends EventDispatcher

	###*
	@event RESIZE
	@static
	###
	@RESIZE: 'resize_resizer'

	###*
	@event ORIENTATION_CHANGE
	@static
	###
	@ORIENTATION_CHANGE: 'orientation_change_resizer'

	###*
	@event BREAKPOINT_CHANGE
	@static
	###
	@BREAKPOINT_CHANGE: 'breakpoint_changed_resizer'

	_bounds = null
	_body = null

	###*
	@method getInstance
	@static
	@param {Boolean} [p_start=false]
	@return {Resizer} 
	###
	@getInstance:(p_start=true)=>
		@_instance ?= new @(p_start)

	###*
	@class Resizer
	@constructor
	@param {Boolean} [p_start=true]
	@extends EventDispatcher
	###
	constructor:(p_start=true)->
		_body = document.querySelector("body")
		_bounds = {"top":0, "bottom":0, "left":0, "right":0}
		@_currentOrientation = @orientation
		if p_start? then @start()
		super

	###*
	@property width
	@type {Number}
	@readOnly
	###
	@get width:->
		return window.innerWidth

	###*
	@property height
	@type {Number}
	@readOnly
	###
	@get height:->
		return window.innerHeight

	###*
	@property orientation
	@type {String} 'landscape' or 'portrait'
	@readOnly
	###
	@get orientation:->
		ratio = screen.width/screen.height
		return if window.innerWidth > window.innerHeight and ratio > 1.3 then 'landscape' else 'portrait'

	###*
	Gets/Sets bounds
	@property bounds
	@type {Object} The object like {"top":0, "bottom":0, "left":0, "right":0}
	###
	@get bounds:->
		return _bounds
	@set bounds:(p_value)->
		_bounds = p_value

	###*
	@method start
	###
	start:()=>
		window.addEventListener 'resize', @change
		window.addEventListener 'orientationchange', @change
		@change(null, true)
		false

	###*
	@method stop
	###
	stop:()=>
		window.removeEventListener 'resize', @change
		window.removeEventListener 'orientationchange', @change
		false

	###*
	@method change
	@param {Event} evt
	@param {Boolean} [allKinds=false]
	###
	change:(evt, allKinds = false)=>
		evt?.preventDefault()
		evt?.stopImmediatePropagation()
		
		_data = {
			"width": @width,
			"height": @height,
			"bounds": @bounds,
			"orientation": @orientation
		}

		if evt?.type == "resize" then @trigger Resizer.RESIZE, _data
		if @_currentOrientation != @orientation
			@trigger Resizer.ORIENTATION_CHANGE, _data
			@_currentOrientation = @orientation
		if app.conditions?
			for k, v of app.conditions.list
				if v['size']? || v['orientation']? || !!allKinds
					if app.conditions.test(k)
						if !@hasClass(k) then @addClass(k)
					else
						if @hasClass(k) then @removeClass(k)

			for k, v of app.conditions.list
				if v['size']? || v['orientation']? || !!allKinds
					if app.conditions.test(k)
						_data['breakpoint'] = {key:k, values:v}
						if @latestKey != k
							@latestKey = k
							@trigger Resizer.BREAKPOINT_CHANGE, _data
						break
		false
				
	###*
	@method addClass
	@param {String} className
	@return {HTMLElement}
	###
	addClass:(className)->
		return DOMUtils.addCSSClass(_body, className)

	###*
	@method removeClass
	@param {String} className
	@return {HTMLElement}
	###
	removeClass:(className)->
		return DOMUtils.removeCSSClass(_body, className)

	###*
	@method hasClass
	@param {String} className
	@return {Boolean}
	###
	hasClass:(className)->
		return DOMUtils.hasCSSClass(_body, className)
