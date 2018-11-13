# import caim.utils.Prototypes

###*
@class AnimationTicker
@submodule caim.anim
@static
###
class AnimationTicker
	@_callbacks = []

	###*
	Class to controll animation. It calls a callback method every requestAnimation frame.<br>
	In case of Internet Explorer 9, it uses a setTimeout with 16 ms.
	@method _init
	@private
	@static
	###
	@_init:()->
		@_update()

	###*
	Add a callback method that will be called every requestAnimation.
	@method add
	@static
	@param {function} callback
	Callback function to be called on every browser update.<br>
	The callback method will be called passing a `data` parameter which will contain the `data` passed in this method and the `frame` number if the `fps` value is set in the `data`.<br>
	If the callback function already exists, it'll only update the `data`.
	@param {Object} [data={}] All values in this object are optional.
	```
	{
		"fps": 0 // Number. Frame rate to update.
		"initFrame": 0 // Number. Use value when adding a animation that doesn't start at frame 0. Ex: starting a animation from a middle.
		"delay": 0 // Number. Delay in seconds to start triggering the callback.
	}
	```
	###
	@add:(callback, data = {})->
		if !callback
			throw new Error('callback is not defined.')
		@remove(callback)
		data.initTime = @_currentTime
		if data.fps
			if !data.initFrame
				data.initFrame = 0
			data.fpms = data.fps * 0.001
			data.frame ?= data.initFrame
		data.delay ?= 0
		data.delayMs = data.delay * 1000
		callbackData = {func: callback, data: data}
		callbackData.func(data)
		@_callbacks.push(callbackData)

	###*
	Remove a callback method added by {{#crossLink "AnimationTicker/add:method"}}{{/crossLink}}
	@method remove
	@static
	@param {function} callback Callback function to be removed.
	###
	@remove:(callback)->
		i = @_callbacks.length
		while i-- > 0
			if @_callbacks[i].func == callback
				@_callbacks.splice(i, 1)
	###*
	@method _update
	@private
	@param {Array} items
	###
	@_update:(items = null)=>
		if !Array.isArray(items)
			items = @_callbacks
		t = Date.now()
		window.requestAnimationFrame(@_update)
		l = items.length
		i = -1
		while ++i < l
			item = items[i]
			if !item?
				continue
			data = item.data
			dt = t - data.initTime - data.delayMs
			if dt <= 0
				continue
			data.time = dt
			if data.fps?
				f = (dt * data.fpms + data.initFrame) >> 0
				if f == data.frame
					continue
				data.frame = f
			items[i]?.func?(data)
		@_currentTime = t

	@_init()

###*
_
@class _
@module caim
###
class _
	
	
