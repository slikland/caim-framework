###*
@class ResizeUtils
@static
@submodule caim.utils
###
class ResizeUtils

	###*
	@method fitTo
	@static
	@param {HTMLElement} itemEl
	@param {HTMLElement} parentEl
	@param {Boolean} [cover=true]
	@param {Boolean} [noScale=true]
	@param {Boolean} [apply=true]
	@param {String} [force=null] Valid values: 'width' or 'height'
	@return {Object} A object with a format {x:0, y:0, width:0, height:0, scale:0}
	###	
	@fitTo:(itemEl, parentEl, cover=true, noScale=true, apply=true, force=null)->
		#normalize values
		item = ResizeUtils.parseValues(itemEl)
		parent = ResizeUtils.parseValues(parentEl || itemEl.parentNode || itemEl.element.parentNode)
		propX = parent.width / item.width
		propY = parent.height / item.height
		width = 0
		height = 0
		scale = 1
		type = if cover then propX > propY else propX < propY

		if force == 'width'
			type = true
		else if force == 'height'
			type = false

		if type
			width = parent.width
			height = item.height * propX
			scale = propX
		else
			height = parent.height
			width = item.width * propY
			scale = propY

		result = 
			x: (parent.width - width) / 2
			y: (parent.height - height) / 2
			width: width
			height: height
			scale: scale

		#avoid scale
		if noScale
			delete result.scale

		#apply if neccesary
		if apply
			if itemEl instanceof BaseDOM
				TweenMax.set itemEl.element, result
			else
				TweenMax.set itemEl, result

		#return result
		return result

	###*
	@method parseValues
	@static
	@param {HTMLElement|HTMLImageElement} element
	@return {Object}
	###	
	@parseValues:(element)->
		data = {}
		element = element.element || element
		if element instanceof HTMLImageElement
			data.width = element.naturalWidth
			data.height = element.naturalHeight
		else
			data.width = element.width || element.offsetWidth
			data.height = element.height || element.offsetHeight
		return data
