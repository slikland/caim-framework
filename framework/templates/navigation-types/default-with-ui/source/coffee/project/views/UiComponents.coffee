#import slikland.display.ui.svg.SvgBundle
#import slikland.display.ui.grid.Grid
#import slikland.display.ui.ImageView

class UiComponents extends BaseView

	constructor: (p_data=null, p_className=null) ->
		super p_data, 'section'

	createStart:(evt=null)=>
		@_background = new BaseDOM
			className: 'background'
		@_background.css({
			position: 'absolute'
			left: '0'
			right: '0'
			top: '0'
			bottom: '0'
			opacity: '0'
			height: '100%'
			'z-index': 0
			'background-color': '#5050ad'
		})
		@appendChild @_background
		super

	create:(evt=null)=>
		@bottleImage = @content.bottle
		@gridData = @content.grid

		@_grid = new Grid
		@appendChild @_grid
		super

	createComplete:(evt=null)=>
		@_grid.on Grid.GRIDFRAME_CREATE, @_didFrameCreate
		@_grid.on Grid.GRIDFRAME_DESTROY, @_didFrameDestroy

		@_grid.sourceData = { items: @gridData }

		# @_svg = new Svg
		# 	className: 'product'
		# 	attrs:
		# 		width: '100%'
		# 		height: '100%'
		# 	style:
		# 		position: 'relative'
		# 		'z-index': 1
		# @appendChild @_svg

		# @_title = new Svg.Text {
		# 	attrs:{
		# 		fill: 'white'
		# 		'text-anchor': 'middle'
		# 		'font-size': '5em'
		# 		'font-family': 'Techno'
		# 	}
		# }

		# @_arc = Svg.Path.arc(0, 100, 250, 200, 90, -90)
		# @_title.textPath @_arc, 
		# 	text: 'Garrafa 300ml'
		# 	attrs:
		# 		startOffset: '50%'

		# @_image = new Svg.Image {
		# 	attrs:
		# 		'xlink:href': bottle.tag?.src || bottle.src
		# 		'font-size': '70vh'
		# 		x: '50%'
		# 		y: '5%'
		# 		width: '0.3535353535em'
		# 		height: '1em'
		# 	style:
		# 		transform: 'translateX(-50%)'
		# }

		# @_svg.appendChild @_image
		# @_svg.appendChild @_title

		# @_filter = _text.filter({attrs:{id:'blur'}}, new Svg.Filters.GaussianBlur({attrs:{in:'SourceGraphic', stdDeviation:'1'}}))

		# @_filterImage = _image.filter({attrs:{id:'imageFilter'}}, new Svg.Filters.Turbulence({
		# 		attrs: {
		# 			result: 'turbulence'
		# 			baseFrequency: '0.05'
		# 			numOctaves: '2'
		# 		}
		# 	}), new Svg.Filters.DisplacementMap({
		# 		attrs: {
		# 			in: 'SourceGraphic'
		# 			in2: 'turbulence'
		# 			scale: '50'
		# 			xChannelSelector: 'R'
		# 			yChannelSelector: 'A'
		# 		}
		# 	}))
		super

	showStart:(evt=null)=>
		super

	show:(evt=null)=>
		TweenMax.to(@_background.element, 1, {
			opacity: 1,
			onComplete: =>
				super
		})

	showComplete:(evt=null)=>
		super

	hideStart:(evt=null)=>
		super

	hide:(evt=null)=>
		TweenMax.to(@_background.element, .5, {
			opacity: 0,
			onComplete: =>
				super
		})

	hideComplete:(evt=null)=>
		super

	destroy:(evt=null)=>
		TweenMax.killTweensOf [@_background?.element]
		@_svg?.destroy()
		delete @_svg
		@_svg = null
		@_background?.destroy()
		delete @_background
		@_background = null
		super

	_didFrameCreate:(event=null)=>
		frame = event.frame
		if frame?
			view = new BaseDOM
			view.css
				'background-color': '#'+'0123456789abcdef'.split('').map(function(v,i,a){ return i>5 ? null : a[Math.floor(Math.random()*16)] }).join('')
				width:'100%'
				height:'100%'
			frame.setView view

	_didFrameDestroy:(event=null)=>
		frame = event.frame
