#import slikland.display.ui.BaseComponent
#import slikland.display.ui.grid.GridPacker
#import slikland.display.ui.grid.GridFrame
#import slikland.utils.Resizer
#import slikland.utils.ArrayUtils
#import slikland.utils.FunctionUtils

class Grid extends BaseComponent

	@const DEFAULT_MAX_COLUMNS: 	10
	@const DEFAULT_MIN_COLUMNS: 	2
	@const DEFAULT_FLEX_COLUMNS:
		min: 320
		max: 1440

	@const GRIDFRAME_CREATE: 	'grid_gridframe_create'
	@const GRIDFRAME_DESTROY: 'grid_gridframe_destroy'
	@const GRIDFRAME_SHOW: 		'grid_gridframe_show'
	@const GRIDFRAME_HIDE: 		'grid_gridframe_hide'

	@const BASE_CLASSNAME: 'grid'

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			className: @BASE_CLASSNAME
			flexColumns: @DEFAULT_FLEX_COLUMNS
			maxColumns: @DEFAULT_MAX_COLUMNS
			minColumns: @DEFAULT_MIN_COLUMNS
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {}, childClassName=GridFrame.BASE_CLASSNAME)->
		@_childClassName = childClassName
		@_childs = []
		@_fillerBlocks = []
		@_dataItems = []
		@_fillerItems = []
		@_initialized = false
		@_drawReady = false
		@_firstRender = false

		p_options.element = 'section'
		super(p_options)

		@_resize = FunctionUtils.throttle(@_resize, 200)

	#
	# Getters, Setters
	#--------------------------------

	@get maxColumns:()->
		return @_maxColumns

	@set maxColumns:(p_value)->
		@option('maxColumns', p_value)

	@get minColumns:()->
		return @_minColumns

	@set minColumns:(p_value)->
		@option('minColumns', p_value)

	@get currentColumns:()->
		return @_currentColumns

	@get growMode:()->
		if !@_growMode
			@_growMode = @_checkGrowMode(@)
			if @_growMode.width is 'auto' && @_growMode.height is 'auto'
				@css('width', '100%')
				@_growMode = @_checkGrowMode(@)
			else
					@_originWHRatio = @_wrapper.width / @_wrapper.height * 100 if !@_originWHRatio
					@_originHWRatio = @_wrapper.height / @_wrapper.width * 100 if !@_originHWRatio
				if @_growMode.width is true && @_growMode.height is true
					@css('height', @height+'px')
					@_growMode = @_checkGrowMode(@)
		return @_growMode

	#
	# {
	#   items:[
	#     Item:{
	#       type:     class GridFrame Type
	#       size:     { row:Number, col:Number }
	#       content:  GridFrame Content Data
	#     }
	#   ])
	#   flexColumns:  { min:Number(ViewportSize), max:(ViewportSize) } # Responsible for update the columns by the viewport's current size
	#   maxColumns:Number
	#   minColumns:Number
	# }

	@get filler:()->
		return @_fillerItems

	@set filler:(p_filler=[])->
		if p_filler isnt @_fillerItems
			@_fillerItems = p_filler
			_copyItems = ArrayUtils.shuffle(@_fillerItems)
			_blocks = @_fillerBlocks.length
			for item in @_fillerBlocks
				_itemData = null
				for k, fillerData of _copyItems
					if item.size.row is fillerData.size.row and item.size.col is fillerData.size.col
						_itemData = _copyItems.splice(k, 1)[0]
						_copyItems.push(_itemData)
						break
				if _itemData?
					item.data = _itemData
					@trigger Grid.GRIDFRAME_CREATE, {frame: item}


	@get items:()->
		return @_dataItems

	@set items:(p_items=[])->
		if p_items isnt @_dataItems
			_length = @_dataItems.length
			while _length-- > 0
				item = @_dataItems[_length]
				if item?
					findIndex = p_items.indexOf(item)
					if findIndex isnt -1
						p_items.splice(findIndex, 1)
					else
						removeIndex = @_dataItems.indexOf(item)
						removedItem = @_dataItems.splice(removeIndex, 1)[0]
						delete removedItem.view
						removedItem.view = null
						_frame = @_childs.splice(removeIndex, 1)[0]
						if _frame?
							_frame.destroy?()
							@trigger Grid.GRIDFRAME_DESTROY, {frame:_frame}

			Array.prototype.push.apply(@_dataItems, p_items)

			@_drawReady = false
			@layout()


	@get children:()->
		return @findAll(@_childClassName)

	@get scrollTop:->
		if typeof pageYOffset != 'undefined'
			return pageYOffset
		else
			B = document.body
			D = document.documentElement
			D = if D.clientHeight then D else B
			return D.scrollTop

	#
	# Flow Methods
	#--------------------------------

	componentLayout:()->
		@_wrapper = new BaseDOM({className:"#{@_options.className}-wrapper"})
		@appendChild(@_wrapper)
		@_packer = new GridPacker()
		@_initialized = true

	createComplete:()->
		@_resize()
		Resizer.getInstance().on Resizer.RESIZE, @_resize
		window.addEventListener 'scroll', @_didScroll

		@_invalidateOptions()
		@trigger(@constructor.CREATE)

	destroy:()->
		Resizer.getInstance().off Resizer.RESIZE, @_resize
		@reset()
		@_initialized = false
		@_firstRender = false
		@_wrapper?.destroy()
		delete @_packer
		@_packer = null
		super

	_invalidate:()->
		super

		@_maxColumns = @_options.maxColumns || Grid.DEFAULT_MAX_COLUMNS
		@_minColumns = @_options.minColumns || Grid.DEFAULT_MIN_COLUMNS
		@_currentColumns = @_maxColumns

		@_flexMin = @_options.flexColumns?.min || Grid.DEFAULT_FLEX_COLUMNS.min
		@_flexMax = @_options.flexColumns?.max || Grid.DEFAULT_FLEX_COLUMNS.max

		@_updateColumns()
		@items = @_options.items || []


	#
	# Layout Methods
	#--------------------------------

	## Reset, Empty
	reset:()=>
		clearTimeout @_timeoutRequestFrame
		for k, v of @_childs
			v.destroy?()
			_item = @_dataItems[k]
			delete _item.view
			_item = null
		@_childs.length = 0
		@_dataItems.length = 0
		@_resetFillers()
		@_drawReady = false

	## Layout the grid
	layout:()=>
		return if !@_initialized or !@_options
		@_redraw()

	## Checks the grid width and apply if necessary a collumns max value
	_updateColumns:()->
		if @_autoWidth or @_autoHeight
			_preferredCol = Math.floor(NumberUtils.toPercent(window.innerWidth, @_flexMin, @_flexMax)/100 * @_maxColumns)
			if _preferredCol % 2 isnt 0
				if _preferredCol > @_maxColumns / 2
					_preferredCol--
				else
					_preferredCol++
			_preferredCol = Math.max(@_minColumns, Math.min(_preferredCol, @_maxColumns))
			if _preferredCol isnt @_currentColumns
				@_currentColumns = _preferredCol
				return true
		return false

	## Redraw, creates or updates the grid frames, and 'base size' of the whole grid
	_redraw:()->
		@_relWidth = @growMode.width is true
		@_relHeight = @growMode.height is true
		@_autoWidth = @growMode.width is 'auto'
		@_autoHeight = @growMode.height is 'auto'

		@_wRatio = @_wrapper.width / window.innerWidth * 100
		@_hRatio = @_wrapper.height / window.innerHeight * 100

		cellSize = @_getCellSize()

		@_createChildren(cellSize) if !@_drawReady

		_cellSizeForRatio = cellSize + (1 / (@_currentColumns/2))

		_areaRatio = undefined
		switch true
			when @_relHeight && @_relWidth then _areaRatio = "#{(_cellSizeForRatio / Math.max(window.innerWidth, window.innerHeight) * 100)}vmax"
			when @_relWidth && @_autoHeight then _areaRatio = "#{(_cellSizeForRatio / window.innerWidth * 100)}vw"
			when @_relHeight && @_autoWidth then _areaRatio = "#{(_cellSizeForRatio / window.innerHeight * 100)}vh"
			else
				_areaRatio = "#{(_cellSizeForRatio)}px"

		@_wrapper.css
			# fontSize: "#{(100 / @currentColumns)}vw" # Full Window Only
			# fontSize: "#{(@_wrapper.width / @currentColumns)}px" # Needs call @layout on every Window resize
			fontSize: _areaRatio # Better solution, needs call @layout for responsivity changes only
		@_updateChildren(cellSize)
		@_drawReady = true
		@_firstRender = true

	## Create the children (GridFrame instances) and apply the priority logic
	_createChildren:(cellSize)->
		_stack = []
		_maxPriority = -1

		for k, data of @_dataItems
			if !data.view?
				frame = new GridFrame(data, @_childClassName)
				frame.addClass("block-#{k}")
				data.view = frame

				@_childs.push frame
				@_wrapper.appendChild frame

				# randomState = Math.floor(Math.random() * 2)

				# spaceX = frame.width * 1.5
				# spaceY = frame.height * 1.5

				# console.log 'create-children', frame.className

				frame.css
					position: 'absolute'
					# left: (if randomState is 0 then window.innerWidth + spaceX else -spaceX) + 'px'
					# top: (if randomState is 1 then window.innerHeight + spaceY else -spaceY) + 'px'
				@trigger Grid.GRIDFRAME_CREATE, {frame: frame}

	## Update children items and invalidate their sizes to respect the new current max columns
	_updateChildren:(cellSize)->
		blocks = []

		# Remove the filler blocks to relayout with a new ones if necessary
		# TODO: try to reuse if necessary some of then if necessary in the next step
		@_resetFillers()

		_length = @_childs.length
		while _length-- > 0
			frame = @_childs[_length]
			frame.invalidateSize(@currentColumns)
			if @currentColumns? and @currentColumns is @_minColumns
				frame.size =
					row: @_minColumns
					col: @_minColumns
			blocks.unshift({w: cellSize * frame.size.col, h: cellSize * frame.size.row, frame:frame, type:frame.data.type })

		if !isNaN(cellSize)
			@_gridPacker(blocks, cellSize)

	_resetFillers:()->
		_fillers = @_fillerBlocks.length
		while (_fillers--)
			frame = @_fillerBlocks[_fillers]
			frame.destroy?()
			@trigger Grid.GRIDFRAME_DESTROY, {frame: frame}
		@_fillerBlocks.length = 0

	_checkViewport:()->
		if @_all?
			delay = 0
			scrollBottom = @scrollTop + window.innerHeight
			for frame in @_all
				viewInBounds = frame.getBounds()
				viewArea = Math.min(window.innerHeight, viewInBounds.bottom) - Math.max(0, viewInBounds.top)
				if ((viewArea / frame.element.offsetHeight > .55) or (viewInBounds.bottom < window.innerHeight)) and !frame.showed
					frame.show(delay * .15)
					delay++

	## Resize, checks the viewport to update the columns if needed
	_resize:(evt=null)=>
			@layout() if @_updateColumns()

	_getCellSize:()->
		_size = 0
		_factor = 1
		if !@_autoWidth && !@_autoHeight
			_factor = @_hRatio/100 if (@_hRatio < @_wRatio)
			_factor = @_wRatio/100 if (@_wRatio < @_hRatio)

		_width = @_wrapper.width
		# _diffWidth = Math.ceil((((_width / @_currentColumns) % 1) * @_currentColumns))
		# _width += _diffWidth
		_height = @_wrapper.height

		if @_autoHeight
			_size = _width / (@currentColumns * _factor)
		else if @_autoWidth
			_size = _height / (@currentColumns * _factor)
		else
			_size = Math.min(_width, _height) / (@currentColumns * _factor)

		return _size # - (_diffWidth)/@currentColumns

	_gridPacker:(blocks, cellSize)->

		# GridPacker state
		# blocks.sort (a, b)=>
		# 	return if a.frame.weight > b.frame.weight then -1 else 1

		# blocks.sort (a, b)=>
		# 	return if a.frame.data.type isnt b.frame.data.type then -1 else 1

		# blocks.sort (a, b)=>
		# 	return if Math.max(a.frame.size.row, a.frame.size.col) > Math.max(b.frame.size.row, b.frame.size.col) then -1 else 1
		# blocks = ArrayUtils.shuffle(blocks)
		# blocks = ArrayUtils.fromMiddleToEnd(blocks)

		blocks.sort (a, b)=>
			return if Math.max(a.frame.size.col) > Math.max(a.frame.size.col) then 1 else -1

		_types = {}
		blocks.forEach (item, index, array)=>
			_types[item.type] = [] if !_types[item.type]?
			_types[item.type].push item

		n = 0
		newBlocks = []
		while n < blocks.length
			for k, o of _types
				if o.length
					newBlocks.push (o.shift())
					n++

		blocks = newBlocks
		blocks = ArrayUtils.fromEndToMiddle(blocks)

		# blocks.sort (a, b)=>
		# 	return if Math.max(a.frame.size.row, a.frame.size.col) > Math.max(b.frame.size.row, b.frame.size.col) then -1 else 1

		# oneSide = blocks.splice(Math.floor(blocks.length/2))
		# blocks = ArrayUtils.merge(blocks, oneSide)

		@_packer.fit(blocks, @_wrapper.width if !@_autoWidth, @_wrapper.height if !@_autoHeight and !(@_relHeight && !@_relWidth && !@_autoWidth))
		@_root =  @_packer.root

		if @_autoHeight
			_height = 'auto'
			if @_relWidth
				_height = "#{ @_root.h / @_root.w * (@_wRatio) }vw"
			else
				_height = "#{ @_root.h }px"
			@css
				height: _height
		else if @_relWidth and !@_relHeight
			_height = "#{ @_root.h / @_wrapper.width * (@_wRatio) }vw"
			@css
				height: _height

		else if @_autoWidth
			_width = 'auto'
			if @_relHeight
				_width = "#{ @_root.w / @_root.h * (@_hRatio) }vh"
			else
				_width = "#{ @_root.w }px"
			@css
				width: _width

		# if (@_relHeight && !@_relWidth)
		#   @_wrapper.css
		#     height: "#{ @_root.h }px"
		# else if (@_relWidth && !@_relHeight)
		#   @_wrapper.css
		#     width: "#{ @_root.w }px"

		@_fillingCount = blocks.length
		@_fillingBlockNodes = []

		for k, cell of blocks
			if cell.fit
				_coords = @_getCoords(cell.fit)
				_index = parseInt(k)

				if !cell.frame.showed
					cell.frame.css
						left: _coords.left
						top: _coords.top

				cell.frame.align _coords.left, _coords.top

				@_fillingGrid(cell, cellSize)

		setTimeout ()=>

			@_all = [].concat(@_childs, @_fillerBlocks)

			@_all.sort (a, b)=>
				if a.element.offsetTop < b.element.offsetTop
					return -1
				else if a.element.offsetTop > b.element.offsetTop
					return 1
				else if a.element.offsetLeft < b.element.offsetLeft
					return -1
				else
					return 1
				return 0

			@_timeoutRequestFrame = setTimeout ()=>
				for k, frame of @_all
					frame.index = parseInt(k)
					_request = ()=>
						arguments.callee.frame.requestLoad()
					_request.frame = frame
					if !@_firstRequest
						setTimeout _request, frame.index * 175
					else
						setTimeout _request
				@_firstRequest = true
				@_checkViewport()
			, 375

	_fillingGrid:(cell, baseCellSize)->

		if !cell.fit.down.used && cell.fit.down.w * cell.fit.down.h > 0
			spaceSize =
				col: Math.round(cell.fit.down.w / baseCellSize)
				row: Math.round(cell.fit.down.h / baseCellSize)
				fit: cell.fit.down
			@_newSpaceFoundOne(spaceSize, cell, baseCellSize)

		if !cell.fit.right.used && cell.fit.right.w * cell.fit.right.h > 0
			spaceSize =
				col: Math.round(cell.fit.right.w / baseCellSize)
				row: Math.round(cell.fit.right.h / baseCellSize)
				fit: cell.fit.right
			@_newSpaceFoundOne(spaceSize, cell, baseCellSize)

	_getCoords:(fitBlock)->
		_left = 0
		_top = 0

		# if @_relWidth
		#   _left = "#{ fitBlock.x / @_root.w * (@_wRatio) }vw"

		# if @_autoHeight
		#   _top = "#{ fitBlock.y / @_root.h * 100 }%"

		if @_autoWidth || (@_relHeight && !@_relWidth)
			_left = "#{ fitBlock.x / @_root.w * 100 }%"
		else if @_relWidth && @_relHeight
			_left = "#{ fitBlock.x / Math.max(@_root.h, @_root.w) * 100 }vmax"
		else if @_relWidth
			_left = "#{ fitBlock.x / @_root.w * (@_wRatio) }vw"
		else if @_relHeight
			_left = "#{ fitBlock.x / @_root.h * (@_hRatio) }vh"

		if @_autoHeight || (@_relWidth && !@_relHeight)
			_top = "#{ fitBlock.y / @_root.h * 100 }%"
		else if @_relHeight && @_relWidth
			_top = "#{ fitBlock.y / Math.max(@_root.h, @_root.w) * 100 }vmax"
		else if @_relHeight
			_top = "#{ fitBlock.y / @_root.h * (@_hRatio) }vh"
		else if @_relWidth
			_top = "#{ fitBlock.y / @_root.w * (@_wRatio) }vw"

		return {
			left: _left,
			top: _top
		}

	_newSpaceFoundOne:(spaceSize=null, cell=null, baseCellSize)->

		spaceSize.fit.originX = spaceSize.fit.x
		spaceSize.fit.originY = spaceSize.fit.x

		if spaceSize? and cell?
			step = 2
			maxCells = Math.round((spaceSize.col / step) * (spaceSize.row / step))
			maxCols = spaceSize.col-step
			for i in [0...maxCells]
				size = {col:step, row:step}
				h = size.row * baseCellSize
				w = size.col * baseCellSize
				newBlock =
					data: { size: size }
					fit: {x: spaceSize.fit.x, y: spaceSize.fit.y, w: w, h: h }

				if maxCols is 0
					spaceSize.fit.y += h
					spaceSize.fit.x = spaceSize.fit.originX
					maxStep = spaceSize.col-step
				else
					spaceSize.fit.x += w

				maxCols -= step

				@_createFillBlock(newBlock, cell)

	_newSpaceFound:(spaceSize=null, cell=null, baseCellSize)->

		if spaceSize? and cell?
			maxValue = Math.max(spaceSize.row, spaceSize.col)
			maxCells = Math.round(Math.max(spaceSize.row, spaceSize.col) / 2)
			step = 2
			maxStep = maxValue

			for i in [0...maxCells]
				if spaceSize.row > spaceSize.col
					size = {col:spaceSize.col, row:Math.min(step, maxStep)}

					h = size.row * baseCellSize
					w = size.col * baseCellSize

					newBlock =
						data: { size: size }
						fit: {x: spaceSize.fit.x, y: spaceSize.fit.y, w: w, h: h }
					spaceSize.fit.y += h

				else
					size = {col:Math.min(step, maxStep), row:spaceSize.row}

					h = size.row * baseCellSize
					w = size.col * baseCellSize

					newBlock =
						data: { size: size }
						fit: {x: spaceSize.fit.x , y: spaceSize.fit.y, w: w, h: h }
					spaceSize.fit.x += w

				maxStep -= step

				@_createFillBlock(newBlock, cell)


	_createFillBlock:(block, cell)->
		if block.fit && @_root
			@_fillingCount++

			updatedData = false

			if Array.isArray(@_fillerItems) and @_fillerItems.length > 0 and !block.data.type?
				_itemData = null
				_copyItems = ArrayUtils.shuffle(@_fillerItems)
				for k, fillerData of _copyItems
					if block.data.size.row is fillerData.size.row and block.data.size.col is fillerData.size.col
						_itemData = _copyItems.splice(k, 1)[0]
						_copyItems.push(_itemData)
						break
				if _itemData?
					block.data = _itemData
					updatedData = true

			frame = new GridFrame(block.data, @_childClassName)
			frame.addClass('fill-block')

			frame.css
				position: 'absolute'
				zIndex: @_fillingCount

			@_wrapper.appendChild frame
			@_fillerBlocks.push frame
			@trigger Grid.GRIDFRAME_CREATE, {frame: frame, fillBlock:block}

			_coords = @_getCoords(block.fit)

			block.frame = frame
			block.w = cell.w
			block.h = cell.h

			frame._block = block

			frame.css
				top: _coords.top
				left: _coords.left

			@_fillingBlockNodes.push block

	_didScroll:(evt=null)=>
		@_checkViewport()

	#
	# Helpers
	#--------------------------------

	_checkGrowMode:(el=null)->
		return null if !el?
		_rW = @_isARelativeProp('width', el)
		_rH = @_isARelativeProp('height', el)
		return {
			width: _rW
			height: _rH
		}

	_isARelativeProp:(styleProp, el=null)->
		_matches = @_getMatchesCss(el)
		_found = false
		_relMetrics = ['vh','vw','vmin','vmax','%'];

		_style = el.css(styleProp)

		if _style.length > 0
			return _style if _style is 'auto'
			re = new RegExp("(([\\d]{1,})+([\\w,\\%]{1,2})|auto)", "i")
			m = undefined
			if (m = re.exec(_style)) != null
				if m.index == re.lastIndex
					re.lastIndex++
				return 'auto' if m[0] is 'auto'
				_found = _relMetrics.indexOf(m[3]) > -1
		else
			for match in _matches
				re = new RegExp("#{styleProp}\:\\s?(([\\d]{1,})+([\\w,\\%]{1,2})|auto)", "i")
				m = undefined
				if (m = re.exec(match)) != null
					if m.index == re.lastIndex
						re.lastIndex++
					return 'auto' if m[1] is 'auto'
					_found = _relMetrics.indexOf(m[3]) > -1
					break if _found
		return _found


	_getMatchesCss:(el=null) ->
		return null if !el
		sheets = document.styleSheets
		o = []
		for i of sheets
			rules = sheets[i].rules or sheets[i].cssRules
			for r of rules
				_selector = rules[r].selectorText
				_matches = el.matches(_selector) if _selector? and _selector.indexOf('*::') is -1
				if !!_matches
					o.push rules[r].cssText
		return o
