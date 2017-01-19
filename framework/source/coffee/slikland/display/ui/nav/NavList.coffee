#import slikland.display.BaseDOM
#import slikland.display.ui.BaseComponent
#import slikland.utils.ObjectUtils
#import slikland.display.ui.nav.NavItem

class NavList extends BaseComponent

	@const CHANGE: 'navlist-change'
	@const ITEM_OVER: 'navlist-item-over'
	@const ITEM_OUT: 'navlist-item-out'
	@const ITEM_CLICK: 'navlist-item-click'

	@const BASE_CLASSNAME: 'nav-list'

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			className: @BASE_CLASSNAME
			element: 'nav'
			value: null
			selected: -1
			item: {}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = null)->
		@_selected = @constructor.DEFAULT_OPTIONS.selected
		@_data = []
		@_items = []
		@_delegate = @constructor.defaultDelegate

		super p_options

		@create()

	@defaultDelegate:(p_item, p_index, p_array)->
		return new NavItem p_item

	# Getters and Setters
	#------------------------------------

	@get container:()->
		return @_wrapper

	@get currentIndex:()->
		return @_selected

	@get selected:()->
		return @_data?[@_selected]

	@get data:()->
		return @_data

	@set data:(p_value)->
		@option('data', p_value)

	@get itemDelegate:()->
		return @_delegate

	@set itemDelegate:(p_method=null)->
		if typeof p_method is 'function'
			@_delegate = p_method
			true
		false

	destroy:()->
		@_clear()
		@_wrapper?.destroy()
		@_created = false
		@_selected = -1
		@_data = null
		@_items?.length = 0
		super

	_applyData:(p_data=null)=>
		if p_data? and Array.isArray(p_data) and p_data isnt @_data
			@_selected = -1
			@_data = @_options.data = p_data
			@_render()
		else
			@_clear()

	# Public
	#------------------------------------------
	componentLayout:()->
		@_wrapper = new BaseDOM
			element: 'ul'
			className: "#{@constructor.BASE_CLASSNAME}__container"
		@appendChild @_wrapper

	select:(p_index = 0, p_trigger=false)->
		_items = @data
		if p_index <= _items.length-1 and @_selected isnt p_index
			_lastIndex = @_selected
			@_selected = p_index
			@_items[_lastIndex]?.deselect()
			@_items[@_selected]?.select()
			if p_trigger
				@trigger(@constructor.CHANGE, {current: @currentIndex, selected:@selected, last:_lastIndex})

	# Private
	#------------------------------------------
	_invalidate:()->
		super
		@_applyData(@_options.data) if @_options.data?
		for item in @_items
			item.option('item', @_options.item)
		if @_options.selected isnt @constructor.DEFAULT_OPTIONS and @_options.selected isnt @_selected
			setTimeout ()=>
				@select( @_options.selected >>> 0 , true)

	_render:()->
		return if !@_created

		@_clear()

		for index, value of @data
			_index = parseInt(index)
			_value = ObjectUtils.merge(value, @_options.item)
			_item = @itemDelegate(_value, _index, @data)
			if _item? and _item instanceof NavItem
				_item.on NavItem.CLICK, @_didItemClick
				_item.on NavItem.OVER, @_didItemOver
				_item.on NavItem.OUT, @_didItemOut
				_item.index = _index
				_item.value = value.value if value.value?
				@_wrapper.appendChild _item
				@_items.push _item

	_clear:()->
		while @_items.length > 0
			item = @_items.shift()
			item.off NavItem.CLICK, @_didItemClick
			item.off NavItem.OVER, @_didItemOver
			item.off NavItem.OUT, @_didItemOut
			item.destroy()
			delete item.index
			delete item.value

	_didItemOver:(event=null)=>
		@trigger(@constructor.ITEM_OVER, event)

	_didItemOut:(event=null)=>
		@trigger(@constructor.ITEM_OUT, event)

	_didItemClick:(event=null, sourceEvent=null)=>
		@trigger(@constructor.ITEM_CLICK, event)
		@select(event.currentTarget.index, true)
