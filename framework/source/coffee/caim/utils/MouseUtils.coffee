###*
@class MouseUtils
@static
@submodule caim.utils
###
class MouseUtils
	###*
	@method getMousePos
	@static
	@param {Event} e
	@param {Boolean} [global=true]
	@return {Array} A array with a format [x, y]
	###	
	@getMousePos:(e, global = true)->
		x = e.pageX || e.clientX
		y = e.pageY || e.clientY
		if global
			x += document.body.scrollLeft + document.documentElement.scrollLeft
			y += document.body.scrollTop + document.documentElement.scrollTop
		return [x, y]

	###*
	@method toGlobal
	@static
	@param {Number} x
	@param {Number} y
	@return {Array} A array with a format [x, y]
	###	
	@toGlobal:(x, y)->
		x += document.body.scrollLeft + document.documentElement.scrollLeft
		y += document.body.scrollTop + document.documentElement.scrollTop
		return [x, y]
