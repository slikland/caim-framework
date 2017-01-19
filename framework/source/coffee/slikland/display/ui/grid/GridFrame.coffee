#import slikland.display.ui.BaseComponent

class GridFrame extends BaseComponent

	@const BASE_CLASSNAME: 'grid-frame'

	@const DEFAULT_SIZE:
		col: 1
		row: 1

	@const DEFAULT_INDEX: -1

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			className: @BASE_CLASSNAME
			size: @DEFAULT_SIZE
			index: @DEFAULT_INDEX
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		super p_options

		@_showed = false
		@_view = null
		@_size = @DEFAULT_SIZE
		@_index = @DEFAULT_INDEX

		@create()

	@get showed:()->
		return @_view?.showed

	@get index:()->
		return @_index

	@set index:(p_index=-1)->
		@option('index', p_index)

	@set size:(p_size = null)->
		@option('size', p_size) if p_size?

	@get size:()->
		return @_size

	@get weight:()->
		if @_size?
			return @_size.row * @_size.col
		else
			return 0

	@get priority:()->
		return @option('priority')

	@get view:()->
		return @_view

	componentLayout:()->
		@_wrapper = new BaseDOM({className:"#{@_options.className}-wrapper"})
		@appendChild(@_wrapper)

	show:(p_delay=0)->
		@_view?.showStart?(p_delay)

	align:(left, top, p_index=null)->
		@_index = p_index if p_index?
		delay = @_index * .05
		TweenMax.to @element, .3, {left:left, top:top, ease:Quart.easeInOut}

	invalidateSize:(maxColumns = null)->
		if maxColumns?
			_originSize = @_options?.size
			if @size?.col > maxColumns
				@size =
					row: Math.round(maxColumns / (@size.col / @size.row))
					col: maxColumns
			else if _originSize? and _originSize.col <= maxColumns
				@size = _originSize

	setView:(p_view=null)->
		if p_view? and p_view instanceof BaseDOM
			@clearView()
			@_view = p_view
			@_wrapper.appendChild @_view
			@_view.create?()
			@_view.frame = @

	clearView:()->
		@view?.destroy?()
		delete @_view
		@_view = null

	requestLoad:()->
		@_view?.requestLoad?()

	destroy:()->
		@clearView()
		super

	_invalidate:()->
		super

		if @_options.size?
			@_size = @_options.size

		@_index = @_options.index
		@css
			zIndex: @_index
			width: "#{parseInt(@_size.col)}em"
			height: "#{parseInt(@_size.row)}em"

	_ready:(event=null)=>
		#

