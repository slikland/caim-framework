#import slikland.utils.ObjectUtils
#import slikland.utils.StringUtils
#import slikland.display.ui.Svg

class Svg.Asset extends BaseDOM

	@const DEFAULT_OPTIONS: {
		element: null
		className: null
		attrs: {
			id: null
		}
	}

	constructor:(p_options={})->

		if p_options.element instanceof Element
			for v, k in Array::slice.call(p_options.element.attributes)
				name = v.localName || k
				@attr name, v.nodeValue.toString()

		@_options = ObjectUtils.merge({}, @constructor.DEFAULT_OPTIONS)

		super({element: p_options.element || 'symbol', className: p_options.className || @_options.className, namespace: Svg.SVG_NS})

		delete p_options.element

		@setOptions(p_options)

	# Getters and Setters
	#------------------------------------
	@get className:()->
		return if @element.className?.baseVal? then @element.className?.baseVal else @element.className

	@set className:(value)->
		@element.className?.baseVal = value.trim()

	@get options:()->
		return @_options

	@set options:(p_options = null)->
		@setOptions(p_options)

	@get width:()->
		return @element.clientWidth

	@set width:(p_value)->
		@option('attrs', {width:parseInt(p_value)})

	@get height:()->
		return @element.clientHeight

	@set height:(p_value)->
		@option('attrs', {height:parseInt(p_value)})

	@get root:()->
		return @_root if @_root instanceof Svg
		if @_parent?
			target = @findParents('svg')?.__instance__
			@_root = target if target instanceof Svg

	@set parent: (value)->
		_lastParent = @_parent
		if value?
			if !(value instanceof BaseDOM) && !(value instanceof Node)
				throw new Error('Parent instance is not either Node or BaseDOM')
			@_parent = value
			@_added() if !_lastParent?
		else if !@isAttached
			@_parent = null
			@_removed() if _lastParent isnt null

	use:(p_options = {})->
		if !@_options.attrs?.id?
			@option('attrs', {id:StringUtils.random()})
		return Svg.createUse(@_options.attrs?.id, p_options)

	mask:(p_svgElement = null, p_maskOptions = {})->
		if p_svgElement instanceof Svg.Asset

			if !@_options.attrs?.id?
				@option('attrs', {id:StringUtils.random()})

			if !!@_currentMask
				@_currentMask.appendChild p_svgElement
			else
				p_maskOptions.attrs ?= {}
				p_maskOptions.attrs.id = "mask_#{@_options.attrs?.id}"
				@_currentMask = new Svg.Mask p_maskOptions
				@_currentMask.appendChild p_svgElement
				@root?.defs.appendChild @_currentMask
				@option('attrs', {mask:Svg.getUrlRef(p_maskOptions.attrs?.id, true)})
			return @_currentMask
		else if !p_svgElement? and !!@_currentMask
			@option('attrs', {mask:null})
			@_currentMask.destroy()

		return @_currentMask

	filter:(p_filterOptions = {}, p_filters...)->
		if p_filterOptions?

			if !@_options.attrs?.id?
				@option('attrs', {id:StringUtils.random()})

			console.log 'id', p_filterOptions

			if !!@_currentFilter
				if p_filters?.length > 0
					@_currentFilter.removeAll()
					for primitive in p_filters
						if primitive instanceof Svg.Filters.FilterPrimitive
							@_currentFilter.appendChild primitive
			else
				p_filterOptions.attrs ?= {}
				p_filterOptions.attrs.id ?= "filter_#{@_options.attrs?.id}"

				_filter = @root?.find("##{p_filterOptions.attrs.id}")
				if _filter?
					if !_filter.__instance__
						@_currentFilter = new Svg.Filters.Filter
							element: _filter
					else
						@_currentFilter = _filter.__instance__

				if @_currentFilter instanceof Svg.Filters.Filter
					delete p_filterOptions.attrs.id
					@_currentFilter.setOptions(p_filterOptions)
				else
					@_currentFilter = @root.addFilter.apply(@root, [p_filterOptions].concat(p_filters))

				@option('attrs', {filter:Svg.getUrlRef(p_filterOptions.attrs?.id, true)})
			return @_currentFilter

		else if !p_filterOptions? and !!@_currentFilter
			@option('attrs', {filter:null})
			@_currentFilter.destroy()

		return @_currentFilter

	clipPath:(p_svgElement = null, p_clipOptions = {})->
		if p_svgElement instanceof Svg.Asset

			if !@_options.attrs?.id?
				@option('attrs', {id:StringUtils.random()})

			if !!@_currentClipPath
				@_currentClipPath.appendChild p_svgElement
			else
				p_clipOptions.attrs ?= {}
				p_clipOptions.attrs.id = "clipPath_#{@_options.attrs?.id}"
				@_currentClipPath = new Svg.ClipPath p_clipOptions
				@_currentClipPath.appendChild p_svgElement
				@root?.defs.appendChild @_currentClipPath
				@option('attrs', {'clip-path':Svg.getUrlRef(p_clipOptions.attrs?.id, true)})
			return @_currentClipPath
		else if !p_svgElement? and !!@_currentClipPath
			@option('attrs', {'clip-path':null})
			@_currentClipPath.destroy()

		return @_currentClipPath

	option:(p_name, p_value = null)->
		if typeof p_name is 'string'
			_defaultValue = @constructor.DEFAULT_OPTIONS[p_name]
			_lastValue = @_options[p_name]
			@_options[p_name] = p_value
			if !@_options[p_name]? and _defaultValue?
				@_options[p_name] = _defaultValue
			@_invalidateOptions(p_name) if _lastValue isnt @_options[p_name]
			return @_options[p_name]
		else if typeof p_name is 'object'
			@setOptions(p_name)

	setOptions:(p_options = null)->
		if p_options?

			p_options = ObjectUtils.merge(p_options, ObjectUtils.merge(@_options || {}, @constructor.DEFAULT_OPTIONS))

			# Updates and save current options data
			@_options = p_options

			@_invalidateOptions()

	_invalidateOptions:(property = null)->
		@_immediateInvalidate(property)

	_immediateInvalidate:(property = null)=>
		@_invalidate(property)
		@trigger(@constructor.INVALIDATE_OPTIONS, {property:property, options:@_options})

	_invalidate:()->
		if @_options.attrs?
			for k, v of @_options.attrs
				@attr k, v, if k.indexOf('xlink') isnt -1 then Svg.XLINK_NS else null
		if @_options.style?
			@css @_options.style

	_added:()->
		if @_currentMask? and !@_currentMask?.isAttached
			@root.defs.appendChild @_currentMask
		if @_currentClipPath? and !@_currentClipPath?.isAttached
			@root.defs.appendChild @_currentClipPath

	_removed:()->
		#

	destroy:()->
		@options = null
		super

#------------------------------------

class Svg.Group extends Svg.Asset

	constructor:(p_options = {})->
		if p_options instanceof Element
			p_options = {element: p_options}

		p_options.element = 'g' if !(p_options.element instanceof Element)
		super p_options

#------------------------------------

class Svg.Symbol extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				preserveAspectRatio: 'none'
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'symbol'
		super p_options

#------------------------------------

class Svg.Mask extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				maskUnits: 'userSpaceOnUse'
				maskContentUnits: 'userSpaceOnUse'
				width: null
				height: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		if p_options instanceof Element
			p_options = {element: p_options}

		p_options.element = 'mask' if !(p_options.element instanceof Element)
		super p_options

#------------------------------------

class Svg.Pattern extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				patternUnits: 'objectBoundingBox'
				patternContentUnits: 'objectBoundingBox'
				patternTransform: null
				preserveAspectRatio: 'none'
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'pattern'
		super p_options

#------------------------------------

class Svg.Circle extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				patternUnits: 'objectBoundingBox'
				patternContentUnits: 'objectBoundingBox'
				patternTransform: null
				preserveAspectRatio: 'none'
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'pattern'
		super p_options

#------------------------------------

class Svg.Rect extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				rx: null
				ry: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'rect'
		super p_options

#------------------------------------

class Svg.Circle extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				cx: 0
				cy: 0
				r: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'circle'
		super p_options

#------------------------------------

class Svg.Ellipse extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				cx: 0
				cy: 0
				rx: null
				ry: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'ellipse'
		super p_options

#------------------------------------

class Svg.Line extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				x1: 0
				x2: 0
				y1: 0
				y2: 0
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'line'
		super p_options

#------------------------------------

class Svg.Path extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				d: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->

		if p_options instanceof Element
			p_options = {element: p_options}

		p_options.element = 'path' if !(p_options.element instanceof Element)
		super p_options

	@circle:(cx=0, cy=0, radius=50, options={})->
		d = "M #{cx} #{cy}" +
				"m #{-radius}, 0" +
				"a #{radius},#{radius} 0 1,0 #{(radius * 2)},0" +
				"a #{radius},#{radius} 0 1,0 #{-(radius * 2)},0"
		options.attrs = {
			d: d
		}
		@_path = new Svg.Path options
		return @_path

	@rect:(x=0, y=0, width=100, height=50, radius=0, options={})->
		radius = Math.min(radius,height/2)
		d = "M #{(x + radius)},#{y}" +
				"h #{(width - 2 * radius)}" +
				"a #{radius},#{radius} 0 0 1 #{radius},#{radius}" +
				"v #{(height - 2 * radius)}" +
				"a #{radius},#{radius} 0 0 1 #{-radius},#{radius}" +
				"h #{(2 * radius - width)}" +
				"a #{radius},#{radius} 0 0 1 #{-radius},#{-radius}" +
				"v #{(2 * radius - height)}" +
				"a #{radius},#{radius} 0 0 1 #{radius},#{-radius}" +
				"z"
		options.attrs = {
			d: d
		}
		@_path = new Svg.Path options
		return @_path

#------------------------------------

class Svg.ClipPath extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				clipPathUnits: 'userSpaceOnUse'
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'clipPath'
		super p_options

#------------------------------------

class Svg.TextPath extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				startOffset: null
				method: null
				spacing: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'textPath'
		super p_options

#------------------------------------

class Svg.Text extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			text: ''
			attrs: {
				dx: null
				dy: null
			}
			tspan: {
				attrs: {
					dx: null
					dy: null
				}
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'text' if p_options.element isnt 'tspan'
		super p_options

	@get text:()->
		return @_options.text

	@set text:(p_value)->
		@option('text', p_value)

	tref:(p_options = {})->
		if !@_options.attrs?.id?
			@option('attrs', {id:StringUtils.random()})
		return Svg.createTref(@_options.attrs?.id, p_options)

	_invalidate:()->
		super
		if typeof @_options?.text is 'string' and @_options?.text isnt @element.textContent
			@element.textContent = @_options.text
		else if Array.isArray(@_options.text)
			@element.innerHTML = ''
			for value, index in @_options.text
				if typeof value is 'string'
					@appendSpan ObjectUtils.merge({text:value}, @_options.tspan)
				else
					@appendSpan ObjectUtils.merge(ObjectUtils.merge({}, @_options.tspan), value)

	appendSpan:(p_options = {text:''})->
		_span = new Svg.Text.Span p_options
		@appendChild _span
		return _span

#------------------------------------

class Svg.Text.Span extends Svg.Text

	constructor:(p_options = {})->
		p_options.element = 'tspan'
		super p_options

#------------------------------------

class Svg.Image extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				preserveAspectRatio: 'none'
				width: 100
				height: 100
				'xlink:actuate': null
				'xlink:arcrole': null
				'xlink:href': null
				'xlink:role': null
				'xlink:show': null
				'xlink:title': null
				'xlink:type': null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'image'
		super p_options

#------------------------------------

Svg.Filters = {}

class Svg.Filters.Filter extends Svg.Asset

	constructor:(p_options = {})->
		p_options.element = 'filter'
		super p_options

class Svg.Filters.FilterPrimitive extends Svg.Asset

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				width: null
				height: null
				x: null
				y: null
				result: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element ?= 'fePrimitive'
		super p_options

class Svg.Filters.GaussianBlur extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
				stdDeviation: null
				edgeMode: 'duplicate'
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feGaussianBlur'
		super p_options

class Svg.Filters.Blend extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
				in2: null
				mode: 'normal'
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feBlend'
		super p_options

class Svg.Filters.ColorMatrix extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
				type: 'matrix'
				values: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feColorMatrix'
		super p_options

class Svg.Filters.ComponentTransfer extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feComponentTransfer'
		super p_options

class Svg.Filters.FuncA extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				type: null
				tableValues: null
				slope: null
				intercept: null
				amplitude: null
				exponent: null
				offset: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feFuncA'
		super p_options

class Svg.Filters.FuncB extends Svg.Filters.FuncA

	constructor:(p_options = {})->
		p_options.element = 'feFuncB'
		super p_options

class Svg.Filters.FuncG extends Svg.Filters.FuncA

	constructor:(p_options = {})->
		p_options.element = 'feFuncG'
		super p_options

class Svg.Filters.FuncR extends Svg.Filters.FuncA

	constructor:(p_options = {})->
		p_options.element = 'feFuncR'
		super p_options

class Svg.Filters.Flood extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				'flood-color': null
				'flood-opacity': null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feFlood'
		super p_options

class Svg.Filters.ConvolveMatrix extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
				order: null
				kernelMatrix: null
				divisor: null
				bias: null
				targetX: null
				targetY: null
				edgeMode: 'duplicate'
				kernelUnitLength: null
				preserveAlpha: 'false'
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feConvolveMatrix'
		super p_options

class Svg.Filters.DiffuseLighting extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
				surfaceScale: null
				diffuseConstant: null
				kernelUnitLength: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feDiffuseLighting'
		super p_options

class Svg.Filters.Offset extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
				dx: null
				dy: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feOffset'
		super p_options

class Svg.Filters.Turbulence extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				baseFrequency: null
				numOctaves: null
				seed: null
				stitchTiles: 'noStitch'
				type: 'turbulence'
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feTurbulence'
		super p_options

class Svg.Filters.DisplacementMap extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
				in2: null
				scale: null
				xChannelSelector: 'A'
				yChannelSelector: 'A'
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feDisplacementMap'
		super p_options

class Svg.Filters.Tile extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feTile'
		super p_options

class Svg.Filters.SpecularLighting extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
				surfaceScale: null
				specularConstant: null
				specularExponent: null
				kernelUnitLength: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feSpecularLighting'
		super p_options

class Svg.Filters.PointLight extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				x: null
				y: null
				z: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'fePointLight'
		super p_options

class Svg.Filters.SpotLight extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				x: null
				y: null
				z: null
				pointsAtX: null
				pointsAtY: null
				pointsAtZ: null
				specularExponent: null
				limitingConeAngle: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feSpotLight'
		super p_options

class Svg.Filters.Merge extends Svg.Filters.FilterPrimitive

	constructor:(p_options = {})->
		p_options.element = 'feMerge'
		super p_options

class Svg.Filters.MergeNode extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feMergeNode'
		super p_options

class Svg.Filters.Composite extends Svg.Filters.FilterPrimitive

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			attrs: {
				in: null
				in2: null
				operator: 'over'
				k1: null
				k2: null
				k3: null
				k4: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'feComposite'
		super p_options
