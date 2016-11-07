
class GridPacker

	fit: (blocks, w=null,h=null) ->
		n = undefined
		node = undefined
		block = undefined
		len = blocks.length
		@_autoGrowRight = w is null
		@_autoGrowDown = h is null
		w = w || if len > 0 then blocks[0].w else 0
		h = h || if len > 0 then blocks[0].h else 0
		@z = 0
		@root =
			x: 0
			y: 0
			w: w
			h: h
		n = 0
		while n < len
			block = blocks[n]
			if node = @findNode(@root, block.w, block.h, @root.type, block.type)
				block.fit = @splitNode(node, block.w, block.h)
			else if @_autoGrowRight or @_autoGrowDown
				block.fit = @growNode(block.w, block.h)
			n++
		return

	findNode: (root, w, h, baseType=null, type=null) ->
		if root.used
			@findNode(root.right, w, h, root.type, type) or @findNode(root.down, w, h, root.type, type)
		else if w <= root.w and h <= root.h #and (baseType is null or baseType isnt type)
			root.z = @z++
			root.type = type
			root
		else
			null

	splitNode: (node, w, h) ->
		node.used = true
		_rightH = @_fixValue(Math.max(h, node.h))
		_downH = @_fixValue(node.h - h)
		_downW = if _rightH > _downH then @_fixValue(w) else @_fixValue(node.w)
		node.down =
			x: node.x
			y: node.y + h
			w: _downW
			h: _downH
			z: 'D#' + node.z
		# console.log 'node-split', node.down.z, node.down
		node.right =
			x: node.x + w
			y: node.y
			w: @_fixValue(node.w - w)
			h: _rightH
			z: 'R#' + node.z
		node

	_fixValue:(value)->
		return if Number(value).toFixed() is '0' then 0 else value

	growNode: (w, h) ->
		# canGrowDown = w <= @root.w
		# canGrowRight = h <= @root.h

		# shouldGrowRight = @_autoGrowRight or (canGrowRight and @root.h >= @root.w + w)
		# shouldGrowDown = @_autoGrowDown or (canGrowDown and @root.w >= @root.h + h)

		if @_autoGrowDown
			@growDown w, h
		else if @_autoGrowRight
			@growRight w, h
		else
			null

	growDown: (w, h) ->
		@root =
			used: true
			x: 0
			y: 0
			w: @root.w
			h: @root.h + h
			down:
				x: 0
				y: @root.h
				w: @root.w
				h: h
			right: @root
		if node = @findNode(@root, w, h)
			@splitNode node, w, h
		else
			null

	growRight: (w, h) ->
		@root =
			used: true
			x: 0
			y: 0
			w: @root.w + w
			h: @root.h
			down: @root
			right:
				x: @root.w
				y: 0
				w: w
				h: @root.h
		if node = @findNode(@root, w, h)
			@splitNode node, w, h
		else
			null
