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
			'opacity': 0
			'height': '100%'
			'background-color': '#'+Math.floor(Math.random()*16777215).toString(16)
		})
		super

	create:(evt=null)=>
		# @_grid = new Grid
		# @appendChild @_grid
		super

	createComplete:(evt=null)=>
		sampleImage = @content.logo

		_testEl = new BaseDOM
			className : 'el1'
		@appendChild _testEl

		_testEl2 = new BaseDOM
			className : 'el2'
		# @appendChild _testEl2
		@replaceChild _testEl2, _testEl

		_image = new ImageView
			src: sampleImage
			fit: 'contain'
		@appendChild _image

		_image2 = new ImageView
			src: sampleImage
			fit: 'cover'
			position: 'center top'
			style:
				width: '100px'
				height: '50px'
		@appendChild _image2

		@_svg = new Svg
			className: 'teste'
			attrs:
				width: 200
				height: 200
		@appendChild @_svg

		_text = new Svg.Text {
			text:'novidade',
			attrs:{
				x:'10'
				y:'1em',
				'font-family':'Times New Roman'
			}
		}
		_text.text = ['agora ', 'v', 'a', 'i', '!']

		_image = new Svg.Image {
			attrs: {
				'xlink:href': sampleImage.tag?.src || sampleImage.src
				x: '50%'
			}
		}

		_rect = new Svg.Rect({ attrs: { x: '50%', y:'0', width:'100', height:'100'} })
		_image.clipPath(_rect)

		@_svg.appendChild _image
		@_svg.appendChild _text

		@_filter = _text.filter({attrs:{id:'blur'}}, new Svg.Filters.GaussianBlur({attrs:{in:'SourceGraphic', stdDeviation:'1'}}))

		@_filterImage = _image.filter({attrs:{id:'imageFilter'}}, new Svg.Filters.Turbulence({
				attrs: {
					result: 'turbulence'
					baseFrequency: '0.05'
					numOctaves: '2'
				}
			}), new Svg.Filters.DisplacementMap({
				attrs: {
					in: 'SourceGraphic'
					in2: 'turbulence'
					scale: '50'
					xChannelSelector: 'R'
					yChannelSelector: 'A'
				}
			}))
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
		TweenMax.killTweensOf(@_background.element)
		@_svg.destroy()
		@_svg = null
		@_background.destroy()
		@_background = null
		super
