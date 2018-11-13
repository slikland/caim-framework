#import caim.utils.Prototypes
#import caim.event.EventDispatcher

#
# Helper for adding BaseDOM into any DOM element
#
# TODO: FIX IE8+
#

unless "findParents" of Node::
	Node::findParents = (query) ->
		if @parentNode? and @parentNode isnt document
			if @parentNode.matches(query)
				return @parentNode
			else
				return @parentNode.findParents(query)
		return null

unless "contains" of Node::
	Node::contains = (node)->
		for v in @childNodes
			if v == (node.element || node)
				return true
				break
		return false
else
	unless "__contains__" of Node::
		Node::__contains__ = Node::contains
		Node::contains = (node)->
			return @__contains__(node.element || node)

unless "__appendChild__" of Node::
	Node::__appendChild__ = Node::appendChild
	Node::appendChild = (node) ->
		el = node.element || node
		@__appendChild__(el) if el?
		if node instanceof BaseDOM
			node.parent = @__instance__ || @
		return node

unless "__removeChild__" of Node::
	Node::__removeChild__ = Node::removeChild
	Node::removeChild = (node) ->
		el = node.element || node
		@__removeChild__(el) if el?
		if node instanceof BaseDOM
			node.parent = null
		return node

unless "__replaceChild__" of Node::
	Node::__replaceChild__ = Node::replaceChild
	Node::replaceChild = (newNode, oldNode) ->
		el1 = newNode
		el2 = oldNode

		if newNode instanceof BaseDOM
			el1 = newNode.element
		if oldNode instanceof BaseDOM
			el2 = oldNode.element

		node = Node::__replaceChild__.call(@, el1, el2) if el1? and el2?

		if newNode instanceof BaseDOM
			newNode.parent = @__instance__ || @
		if oldNode instanceof BaseDOM
			oldNode.parent = null
		return node

#
# TODO: FIX IE8+
# Node.get({instance: ()-> return @__instance__})

# BaseDOM: SlikLand DOM
###*
Base DOM manipulation class
@class BaseDOM
###

class BaseDOM extends EventDispatcher

	@ADDED_TO_DOCUMENT: 'added_to_document'
	@REMOVED_FROM_DOCUMENT: 'removed_from_document'

	@isElement:(p_target)->
		return Element.isElement(p_target)

	#
	# Deprecated params: constructor:(element = 'div', className = null, namespace = null)->
	#
	constructor:(p_options...)->
		super
		#
		# Default params:
		#
		element = 'div'
		className = null
		namespace = null

		if typeof(p_options[0]) == 'string' || p_options[0] instanceof Element
			element = p_options[0]
		else
			i = p_options.length
			while i--
				option = p_options[i]
				if option.element? then element = option.element
				if option.className? then className = option.className
				if option.namespace? then namespace = option.namespace

		if typeof(element) == 'string'
			if namespace
				@_namespace = namespace
				@_element = document.createElementNS(@_namespace, element)
			else
				@_element = document.createElement(element)
		else
			@_element = element

		if @element.parentElement? and !@_parent?
			@parent = @element.parentElement.__instance__ || @element.parentElement

		if className
			@addClass(className)

		# if (MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver)?
		# 	@_observer = new MutationObserver(@_mutations)
		# 	@_observer.observe(@element, { childList: true, attributes: true })
		# else
		# 	@element.on 'DOMNodeInsertedIntoDocument', @_addedToDOM
		# 	@element.on 'DOMNodeRemovedFromDocument', @_removedFromDOM

		@element.__instance__ = @

	##------------------------------------------------------------------------------
	##
	##	GETTER / SETTER
	##
	##------------------------------------------------------------------------------

	##--------------------------------------
	##	Base element getter. Read-only
	##--------------------------------------
	@get element: ()->
		return @_element

	##--------------------------------------
	##	Base namespace getter. Read-only
	##--------------------------------------
	@get namespace: ()->
		return @_namespace

	##--------------------------------------
	##	Childnodes array
	##--------------------------------------
	@get childNodes:()->
		return @element.childNodes

	##--------------------------------------
	##	Instance bounds. Only getters.
	##	If changing size, use CSS.
	##--------------------------------------
	@get width:()->
		return @getBounds().width

	@get height:()->
		return @getBounds().height

	@get outerWidth:()->
		w = @width
		space = @numberStyle('margin-left') + @numberStyle('margin-right')
		return w + space

	@get outerHeight:()->
		h = @height
		space = @numberStyle('margin-top') + @numberStyle('margin-bottom')
		return h + space

	@get left:()->
		return @getBounds().left
	@get top:()->
		return @getBounds().top

	@get x:()->
		return @getBounds().left
	@get y:()->
		return @getBounds().top

	@get windowScroll:()->
		supportPageOffset = window.pageXOffset isnt undefined
		isCSS1Compat = ((document.compatMode || "") is "CSS1Compat")

		x = if supportPageOffset then window.pageXOffset else if isCSS1Compat then document.documentElement.scrollLeft else document.body.scrollLeft
		y = if supportPageOffset then window.pageYOffset else if isCSS1Compat then document.documentElement.scrollTop else document.body.scrollTop

		return {
			x: x
			y: y
		}

	@get scrollPosition:()->
		return {y:@element.offsetTop, x:@element.offsetLeft}

	@set scrollY:(p_value)->
		@element.scrollTop = p_value

	@get scrollY:()->
		return @element.scrollTop

	@set scrollX:(p_value)->
		@element.scrollLeft = p_value

	@get scrollX:()->
		return @element.scrollLeft

	@get attributes:()->
		return @element.attributes

	##--------------------------------------
	##	CSS Class Name
	##--------------------------------------
	@get className:()->
		return @element.className

	@set className:(value)->
		@element.className = value.trim()

	@get text:()->
		return @element.textContent

	@set text:(value)->
		@element.textContent = value

	##--------------------------------------
	##	InnerHTML
	##--------------------------------------
	@get html:()->
		return @element.innerHTML
	@set html:(value)->
		@element.innerHTML = value

	##--------------------------------------
	##	Parent instance. Can be HTMLElement
	##--------------------------------------
	@get parent: ()->
		return @_parent

	@set parent: (value = null)->
		if value?
			if !(value instanceof BaseDOM) && !(value instanceof Node)
				throw new Error('Parent instance is not either Node or BaseDOM')
			@_parent = value
		else
			@_parent = null
			@_observer?.disconnect()
			@_observer = null
			delete @_observer

	@get isAttached:(p_container = null)->
		if typeof (p_container?.contains) is 'function'
			return p_container.contains(@element)
		return document?.contains?(@element) || document?.body.contains?(@element)

	##--------------------------------------
	##	DOM Manipulation
	##--------------------------------------
	appendChild:(child)->
		@appendChildAt(child)

	appendChildAt:(child, index = -1)->
		el = child
		if child instanceof BaseDOM
			el = child.element
		if index == -1 || index >= @childNodes.length
			@element.appendChild(el)
		else
			@element.insertBefore(el, @childNodes[index])
		if child instanceof BaseDOM
			child.parent = @__instance__ || @
		return child

	replaceChild:(replaceElement, oldElement)->
		el1 = replaceElement
		el2 = oldElement
		if replaceElement instanceof BaseDOM
			el1 = replaceElement.element
		if oldElement instanceof BaseDOM
			el2 = oldElement.element
		@element.replaceChild el1, el2
		if replaceElement instanceof BaseDOM
			replaceElement.parent = @__instance__ || @
		if oldElement instanceof BaseDOM
			oldElement.parent = null
		return replaceElement

	remove:()->
		@parent?.removeChild?(@)

	removeChild:(child, destroy = false)->
		return if !child
		if child instanceof BaseDOM
			if !!destroy
				child.removeAll(true)
				child.destroy()
				return child
		if @contains(child)
			return @element.removeChild(child)

	removeChildAt:(index = -1)->
		if index < @childNodes.length
			return @removeChild(@childNodes[i])

	removeAll:(destroy = false)->
		childs = @childNodes
		i = childs.length
		while i-- > 0
			domInstance = childs[i].__instance__
			child = domInstance || childs[i]
			if child?
				@removeChild(child, !!domInstance and !!destroy)

	contains:(child)->
		return @element.contains(child.element || child)

	##--------------------------------------
	##	Check if the instance matches a query selector
	##--------------------------------------
	matches:(query)->
		return @element.matches(query)

	##--------------------------------------
	##	Find parent nodes for a matching query selector
	findParents:(query)->
		return @element.findParents(query)

	##--------------------------------------
	##	Query selector
	##	@onlyInstances: If return only BaseDOM instances
	##--------------------------------------
	find:(query, onlyInstances = false)->
		element = @element.querySelector(query)
		if onlyInstances
			return element?.__instance__
		else
			return element

	##--------------------------------------
	##	Query selector find all
	##	@onlyInstances: If return only BaseDOM instances
	##--------------------------------------
	findAll:(query, onlyInstances = false)->
		elements = @element.querySelectorAll(query)
		if onlyInstances
			els = []
			i = -1
			l = elements.length
			p = 0
			while ++i < l
				if elements[i].__instance__
					els[p++] = elements[i].__instance__
			elements = els
		return elements

	##--------------------------------------
	##	Set / Get element attribute
	##	Accepts object:
	##	@example:
	##	attr({id: 1, name: 2})
	##--------------------------------------

	removeAttr:(name, namespace = null)->
		if namespace is true
			namespace = @namespace

		methodArgs = [name]
		methodSuffix = "Attribute"
		if namespace?
			methodSuffix += "NS"
			methodArgs.unshift(namespace)

		if typeof(name) == 'string'
			return @element?["remove#{methodSuffix}"].apply(@element, methodArgs)
		else if Array.isArray(name)
			for key in name
				methodArgs.splice(-1, 1, key)
				@element?["remove#{methodSuffix}"].apply(@element, methodArgs)

	attr:(name, value = null, namespace = null)->
		if typeof(name) == 'string'
			return @_attr(name, value, namespace)
		else if typeof(name) == 'object'
			for k, v of name
				@_attr(k, v, namespace)

	_attr:(name, value = null, namespace = null)->
		if namespace is true
			namespace = @namespace

		methodArgs = [name, value]
		methodSuffix = "Attribute"
		if namespace?
			methodSuffix += "NS"
			methodArgs.unshift(namespace)

		if value?
			@element?["set#{methodSuffix}"].apply(@element, methodArgs)
		return @element?["get#{methodSuffix}"].apply(@element, methodArgs)

	##--------------------------------------
	##	Set / Get element CSS
	##	Accepts object:
	##	@example:
	##	css({color: 1, width: 2})
	##--------------------------------------
	_css:(name, value = null, p_number = false)->
		if value isnt null
			@element.style[name] = value
		return if p_number then @numberStyle(name) else @style(name)

	css:(name, value = null, p_number = false)->
		if typeof(name) == 'string'
			return @_css(name, value, p_number)
		else if typeof(name) == 'object'
			for k, v of name
				@_css(k, v, p_number)

	##--------------------------------------
	##	Get element ComputedStyle
	##	@example:
	##	style('minHeight')
	##--------------------------------------
	style:(styleProp = null, el = @element)->
		el = el.element if el instanceof BaseDOM
		source = null
		if window.getComputedStyle?
			source = window.getComputedStyle(el)
		else if el.currentStyle
			source = el.currentStyle
		else if document.defaultView and document.defaultView.getComputedStyle
			source = document.defaultView.getComputedStyle(el, null)
		else
			source = @element.style
		return if styleProp? then source[styleProp] else source

	numberStyle:(styleProp = null, el = @element)->
		if styleProp?
			return parseFloat(@style(styleProp, el) || '0')
		else
			source = @style(null, el)
		result = {}
		for k, v of source
			if isNaN(parseInt(k))
				result[k] = v
				if !isNaN(parseFloat(v))
					result[k] = parseFloat(v)
		return result

	##--------------------------------------
	##	CSS Class name manipulation
	##--------------------------------------
	addClass:(className)->
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if !Array.isArray(className)
			return

		if @element.classList?
			className = if !Array.isArray(className) then [className] else className
			className.forEach(action = (value)->
				@classList.add(value)
			, @element)
			action = null
			return @className

		classNames = @className.replace(/\s+/ig, ' ').split(' ')
		p = classNames.length
		i = className.length
		while i-- > 0
			if classNames.indexOf(className[i]) >= 0
				continue
			classNames[p++] = className[i]
		@className = classNames.join(' ')


	removeClass:(className)->
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if !Array.isArray(className)
			return

		if @element.classList?
			className = if !Array.isArray(className) then [className] else className
			className.forEach(action = (value)->
				@classList.remove(value)
			, @element)
			action = null
			return @className

		classNames = @className.replace(/\s+/ig, ' ').split(' ')
		i = className.length
		while i-- > 0
			if (p = classNames.indexOf(className[i])) >= 0
				classNames.splice(p, 1)
		@className = classNames.join(' ')

	toggleClass:(className, toggle = null)->
		if toggle isnt null
			if toggle
				@addClass(className)
			else
				@removeClass(className)
			return
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return
		i = className.length
		while i-- > 0
			if @hasClass(className[i])
				@removeClass(className[i])
			else
				@addClass(className[i])

	hasClass:(className)->
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return

		classNames = @className.replace(/\s+/ig, ' ').split(' ')
		i = className.length

		hasClass = true

		while i-- > 0
			hasClass &= (classNames.indexOf(className[i]) >= 0)
		return hasClass

	_mutations:(mutations)=>
		i = mutations.length
		while i--
			mutation = mutations[i]
			if mutation.type is 'childList'
				for node in mutation.removedNodes
					node.__instance__?._removedFromDOM({target:node})
				for node in mutation.addedNodes
					node.__instance__?._addedToDOM({target:node})
		undefined

	_addedToDOM:(evt)=>
		@trigger BaseDOM.ADDED_TO_DOCUMENT, @_parent
		@added?()

	_removedFromDOM:(evt)=>
		@trigger BaseDOM.REMOVED_FROM_DOCUMENT, @_parent
		@removed?()

	##--------------------------------------
	##	Get elements bounds as rectangle.
	##	{top, left, bottom, right, width, height}
	##--------------------------------------
	getBounds:(target = null)->
		boundsObj = {}
		bounds = @element.getBoundingClientRect()
		for k, v of bounds
			boundsObj[k] = v
		if target
			if (target instanceof BaseDOM)
				tbounds = target.getBounds()
			else if (target instanceof HTMLElement)
				tbounds = target.getBoundingClientRect()
		if tbounds
			boundsObj.top -= tbounds.top
			boundsObj.left -= tbounds.left
			boundsObj.bottom -= tbounds.top
			boundsObj.right -= tbounds.left
		boundsObj.width = boundsObj.right - boundsObj.left
		boundsObj.height = boundsObj.bottom - boundsObj.top

		return boundsObj

	destroy:()->
		@element.off 'DOMNodeInsertedIntoDocument', @_addedToDOM
		@element.off 'DOMNodeRemovedIntoDocument', @_removedFromDOM
		@off?()
		@removeAll?(true)
		@remove?()
		@_observer?.disconnect()
		@_observer = null
		@_namespace = null
		@_parent = null
		@_element.__instance__ = null
		delete @_observer
		delete @_namespace
		delete @_parent
		delete @_element.__instance__
		undefined
