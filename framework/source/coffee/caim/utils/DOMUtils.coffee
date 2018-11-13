###*
@class DOMUtils
@static
@submodule caim.utils
###
class DOMUtils
	
	###*
	@method addCSSClass
	@static
	@param {HTMLElement} el
	@param {String} className
	@return {HTMLElement}
	###
	@addCSSClass:(el, className)->
		if !(el instanceof Element)
			return
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return
		classNames = el.className.replace(/\s+/ig, ' ').split(' ')
		p = classNames.length
		i = className.length
		while i-- > 0
			if classNames.indexOf(className[i]) >= 0
				continue
			classNames[p++] = className[i]
		el.className = classNames.join(' ')
		return el

	###*
	@method removeCSSClass
	@static
	@param {HTMLElement} el
	@param {String} className
	@return {HTMLElement}
	###
	@removeCSSClass:(el, className)->
		if !(el instanceof Element)
			return
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return

		classNames = el.className.replace(/\s+/ig, ' ').split(' ')
		i = className.length
		while i-- > 0
			if (p = classNames.indexOf(className[i])) >= 0
				classNames.splice(p, 1)
		el.className = classNames.join(' ')
		return el

	###*
	@method hasCSSClass
	@static
	@param {HTMLElement} el
	@param {String} className
	@return {Boolean}
	###
	@hasCSSClass:(el, className)->
		if !(el instanceof Element)
			return

		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return

		classNames = el.className.replace(/\s+/ig, ' ').split(' ')
		i = className.length

		hasClass = true

		while i-- > 0
			hasClass &= (classNames.indexOf(className[i]) >= 0)
		return hasClass
	
	###*
	@method toggleCSSClass
	@static
	@param {HTMLElement} el
	@param {String} name
	@param {Boolean} [toggle=null]
	###
	@toggleCSSClass:(el, name, toggle = null)->
		if !el
			return
		has = @hasCSSClass(el, name)
		if toggle is null
			toggle = !has
		if toggle
			@addCSSClass(el, name)
		else
			@removeCSSClass(el, name)

	###*
	@method findParentQuerySelector
	@static
	@param {HTMLElement} target
	@param {String} selector
	@return {HTMLElement|Boolean}
	###
	@findParentQuerySelector:(target, selector)->
		if !target.parentNode || target.parentNode == target
			return false
		items = target.parentNode.querySelectorAll(selector)
		i = items.length
		while i-- > 0
			if items[i] == target
				return target
		return @findParentQuerySelector(target.parentNode, selector)

	###*
	@method removeAllChildren
	@static
	@param {HTMLElement} target
	###
	@removeAllChildren:(target)->
		while target.childNodes.length
			target.removeChild(target.firstChild)
		false
