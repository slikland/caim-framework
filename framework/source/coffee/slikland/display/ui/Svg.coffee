#import slikland.utils.StringUtils
#import slikland.display.BaseDOM
#import slikland.display.ui.BaseComponent

class Svg extends BaseComponent

	@const SVG_NS: 'http://www.w3.org/2000/svg'
	@const XLINK_NS: 'http://www.w3.org/1999/xlink'

	@const BASE_CLASSNAME: 'svg-graph'

	@const DEFAULT_OPTIONS:
		className: @BASE_CLASSNAME
		element: 'svg'
		attrs: {
			width: 100
			height: 100
		}
		autoViewBox: false

	@const SVG_URL_ATTRS: ['fill|url', 'mask|url', 'clip-path|url', 'filter|url', 'xlink\\:href|#']

	constructor:(p_options = {})->

		@_filtersStack = []

		if p_options instanceof Element
			p_options = { element: p_options }

		p_options.namespace = @constructor.SVG_NS
		super p_options

		@_hash = "#{@options.className}_#{StringUtils.random()}"

		if !@element?.querySelector?('defs')
			# Pre-layout
			@_defs = new BaseDOM
				element: 'defs'
				namespace: @constructor.SVG_NS
			@appendChildAt @_defs, 0

			# @_filters = new BaseDOM
			#   element: 'filter'
			#   namespace: @constructor.SVG_NS
			# @_filters.attr('id', @_hash)
			# @_defs.appendChild @_filters
		else
			@_defs = new BaseDOM
				element: @element.querySelector('defs')

		app?.navigation.on Navigation.CHANGE_ROUTE, @_didChangeRoute

		@create()

	@set width:(p_value)->
		@option('attrs', {width: p_value})

	@set height:(p_value)->
		@option('attrs', {height: p_value})

	@get width:()->
		return @element.clientWidth

	@get width:()->
		return @element.clientHeight

	@get defs:()->
		return @_defs

	@get filters:()->
		return @_filtersStack

	@get className:()->
		return if @element.className?.baseVal? then @element.className?.baseVal else @element.className

	@set className:(value)->
		@element.className?.baseVal = value.trim()

	@fromAsset:(p_options = {}, instance = true)->
		if p_options.icon?.id?
			p_options.svg = p_options.icon.id
			delete p_options.icon.id
			delete p_options.icon

		if p_options.svg?
			_svgElement = null

			if p_options.svg instanceof SVGElement
				_svgElement = p_options.svg.cloneNode(true)
			else
				_resource = null
				if app.container?.content?.assets?.icons?[p_options.svg]
					_resource = app.container.content.assets.icons[p_options.svg]
				else
					_resource = {svg: app.loader.getItem(p_options.svg) }

				newEl = document.createElement('div')
				newEl.innerHTML = _resource?.svg?.tag
				_svgElement = newEl.querySelector('svg')?.cloneNode?(true)
				newEl.innerHTML = ''

			if _svgElement instanceof SVGElement
				if !!instance
					p_options.element = _svgElement
					return new Svg p_options
				else
					return _svgElement
		null

	@getUrlRef:(p_url = '', cssFormat = false)->
		_url = "#{window.location.href}##{p_url}"
		if cssFormat is true
			_url = "url(#{_url})"
		return _url

	@createUse:(id, p_options={})->
		if id?
			p_options.element = 'use'
			p_options.attrs ?= {}
			p_options.attrs['xlink:href'] = @getUrlRef(id)
			return new Svg.Asset p_options

	addFilter:(p_filterOptions={}, p_filters...)->
		filter = new Svg.Filters.Filter(p_filterOptions)
		@_defs.appendChild filter
		for filterPrimitive in p_filters
			if filterPrimitive instanceof Svg.Filters.FilterPrimitive
				filter.appendChild filterPrimitive
		@_filtersStack.push(filter)
		@_invalidateFilters()
		return filter

	removeFilter:(p_ref)->
		_index = -1
		if typeof p_ref is 'number'
			_index = p_ref
		else
			_index = @_filtersStack.indexOf(p_ref)
		if _index isnt -1
			@_filtersStack.splice(_index, 1)
		@_invalidateFilters()

	destroy:()->
		app?.navigation.off Navigation.CHANGE_ROUTE, @_didChangeRoute
		@_defs.removeAll(true)
		@_defs.destroy()
		for filter in @_filtersStack
			filter.removeAll(true)
		@removeAll(true)
		super

	_invalidate:()->
		return if !@_options?
		if @_options.attrs?
			for k, v of @_options.attrs
				@attr k, v
		if @_options.style?
			@css @_options.style
		if @attr('viewBox') is null and @_options.autoViewBox
			@attr('viewBox', "0 0 #{@_options.attrs?.width} #{@_options.attrs?.height}")

	_invalidateFilters:()->
		#

	_didChangeRoute:(event=null)=>
		# UPDATE SVG-FILTER URLS (FIREFOX AND CHROME:v:53.*) #
		if app.detections.name.toLowerCase().indexOf('Internet Explorer') is -1
			_searchString = ''
			for value in @constructor.SVG_URL_ATTRS
				params = value.split('|')
				_searchString += "#{if _searchString isnt '' then ', ' else ''}[#{params[0]}*=\'#{params[1]}\']"

			items = @element.querySelectorAll(_searchString)
			i = items.length
			while i-- > 0
				item = items[i]
				for value in @constructor.SVG_URL_ATTRS
					attrName = value.split('|')[0]
					attrValue = item.getAttribute(attrName)
					if attrValue?
						attrValue = attrValue.replace(/(url\().*?(\#)/g, '$1' + window.location.href + '$2')
						item.setAttribute(attrName, attrValue)
