#import slikland.display.BaseDOM
#import slikland.utils.FunctionUtils
#import slikland.utils.StringUtils

class BaseComponent extends BaseDOM

	@const BASE_CLASSNAME: 'component'

	@const DEFAULT_OPTIONS: {
		className: @BASE_CLASSNAME
		element: 'div'
		attrs: {
			id: null
		}
	}

	#Events Constants
	@const INVALIDATE_OPTIONS: 'invalidate-options'
	@const CREATE: 'create'
	@const ADDED: 'added'
	@const REMOVED: 'removed'

	@const STYLE: null

	constructor:(p_options = {})->

		@_applyStyle()

		@_options = ObjectUtils.merge({}, @constructor.DEFAULT_OPTIONS)

		if p_options instanceof Element
			p_options = { element: p_options }

		if p_options.element instanceof Element
			for v, k in Array::slice.call(p_options.element.attributes)
				name = v.localName || k
				@attr name, v.nodeValue.toString()

		super({element: p_options.element || @_options.element, className: p_options.className || @_options.className, namespace: p_options.namespace || @_options.namespace})

		delete p_options.element

		@setOptions(p_options)

	# Getters and Setters
	#------------------------------------
	@get options:()->
		return @_options

	@set options:(p_options = null)->
		@setOptions(p_options)

	@get parent: ()->
		return @_parent

	@set parent: (value = null)->
		if value?
			if !(value instanceof BaseDOM) && !(value instanceof Node)
				throw new Error('Parent instance is not either Node or BaseDOM')
			@_parent = value
			@_added()
		else if @isAttached
			@_parent = null
			@_removed()

	option:(p_name, p_value = null)->
		if typeof p_name is 'string'
			_defaultValue = @constructor.DEFAULT_OPTIONS[p_name]
			_lastValue = @_options[p_name]
			if p_value?
				@_options[p_name] = p_value
				if !@_options[p_name]? and _defaultValue?
					@_options[p_name] = _defaultValue
				@_invalidateOptions(p_name) if _lastValue isnt @_options[p_name]
			else
				return @_options[p_name]
		else if typeof p_name is 'object'
			@setOptions(p_name)

	# Public
	#------------------------------------
	createStart:()->

	create:()->
		return if @_created
		@_created = true
		@componentLayout()
		@createComplete()
		if @parent? and !@_ready
			@_ready = true
			@componentReady()

	componentLayout:()->
		#

	componentAdded:()->
		#

	componentRemoved:()->
		#

	componentReady:()->
		#

	createComplete:()->
		@_invalidateOptions()
		@trigger(@constructor.CREATE)

	setOptions:(p_options=null)->
		if p_options?

			p_options = ObjectUtils.merge(p_options, ObjectUtils.merge(@_options || {}, @constructor.DEFAULT_OPTIONS, false))

			# Updates and save current options data
			@_options = p_options

			@_invalidateOptions()

	_invalidateOptions:(property = null)->
		return if !@_created
		@_immediateInvalidate(property)

	_immediateInvalidate:(property = null)=>
		@_invalidate(property)
		@trigger(@constructor.INVALIDATE_OPTIONS, {property:property, options:@_options})

	_invalidate:()->
		if @_options.attrs?
			@attr @_options.attrs
		if @_options.style?
			@css @_options.style

	_added:()->
		@trigger(@constructor.ADDED, @)
		@componentAdded()
		if @_created and !@_ready
			@_ready = true
			@componentReady()

	_removed:()->
		@componentRemoved()
		@trigger(@constructor.REMOVED, @)

	_applyStyle:()->
		if @constructor.STYLE? and @constructor.STYLE.replace(/\s+/g) isnt  ''
			styleId = "#{@constructor.BASE_CLASSNAME}-styles"
			head = document.querySelector("head") || document.getElementsByTagName("head")[0]
			currentStyle = head.querySelector("##{styleId}")
			if !currentStyle?
				style = document.createElement('style')
				style.id = "#{@constructor.BASE_CLASSNAME}-styles"
				style.type = "text/css"
				head.appendChild(style)
				try
					style.appendChild(document.createTextNode(@constructor.STYLE))
				catch e
					if document.all
						si = head.querySelectorAll('style').length
						document.styleSheets[si].cssText = @constructor.STYLE

	destroy:()->
		@_created = @_ready = false
		@_options = null
		@removeAll?()
		super
