#import caim.media.MediaDOM
#import caim.media.video.VideoCanvas
#import caim.media.video.VideoSubtitle

class TemplateHomeView extends BaseView
	# Change the default css class
	constructor: (p_data=null, p_className=null) ->
		super p_data, 'views'

	createStart:(evt=null)=>
		@background = new BaseDOM('div')
		
		# console.log @content.test666.deep.deep1.deep2.deep3.deep4
		# console.log @content.image, @loader.getResult(@content.image.src)

		@image = new BaseDOM({element:@content.image.tag})
		@background.appendChild(@image)

		@background.className = 'background'
		@background.css({
			# 'opacity': 0
			'height': '100%'
			'background-color': '#'+Math.floor(Math.random()*16777215).toString(16)
		})
		@appendChild(@background)

		@background.element.on 'click', @click
		super
	
	click:(evt=null)=>
		@video = new VideoCanvas(@content.video.src, 0, true)
		# @video = new MediaDOM(@content.video.src, 0, true)
		@video.on VideoCanvas.RUNNING, @test
		@background.appendChild(@video)

		@sub = new VideoSubtitle(@content.subtitle.result)
		@background.appendChild @sub


	test:(evt=null)=>
		@sub?.seek(evt.position)

	create:(evt=null)=>
		super

	createComplete:(evt=null)=>
		super

	showStart:(evt=null)=>
		super

	show:(evt=null)=>
		# TweenMax.to(@background.element, .3, {
		# 	css:
		# 		opacity: 1, 
		# 	onComplete: =>
		# 		super
		# })
		super

	showComplete:(evt=null)=>
		super

	hideStart:(evt=null)=>
		super

	hide:(evt=null)=>
		# TweenMax.to(@background.element, .3, {
		# 	opacity: 0, 
		# 	onComplete: =>
		# 		super
		# })
		super

	hideComplete:(evt=null)=>
		super

	destroy:(evt=null)=>
		@image.destroy()
		@background.removeChild(@image)
		@image = null

		# TweenMax.killTweensOf(@background.element)
		@background.destroy()
		@removeChild(@background)
		@background = null
		super
