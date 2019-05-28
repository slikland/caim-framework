class TemplateSubView extends BaseView
	# Change the default css class
	constructor: (p_data=null, p_className=null) ->
		super p_data, 'views'

	createStart:(evt=null)=>
		@wrapperTest = new BaseDOM('div')
		@appendChild(@wrapperTest)
		@wrapperTest.className = 'wrapperTest'
		@wrapperTest.id = 'wrapperTest'
		
		@background = new BaseDOM('div')
		@appendChild(@background)
		@background.className = 'background'
		@background.css({
			'opacity': 0
			'height': '100%'
			'background-color': '#'+Math.floor(Math.random()*16777215).toString(16)
		})
		@image = new BaseDOM({element:@loader.getResult('image')})
		@background.appendChild(@image)
		super
	
	render:(evt=null)=>
		@i ?= 0
		# console.log "render", @id, @i++
	
	pause:()=>
		clearInterval(@timeout)
		super

	resume:()=>
		clearInterval(@timeout)
		@timeout = setInterval(@render, 1000)
		super

	create:(evt=null)=>
		super

	createComplete:(evt=null)=>
		super

	showStart:(evt=null)=>
		super

	show:(evt=null)=>
		@resume()
		TweenMax.killTweensOf(@background.element)
		TweenMax.to(@background.element, .5, {
			css:
				opacity: 1, 
			onComplete: =>
				super
		})

	showComplete:(evt=null)=>
		super

	hideStart:(evt=null)=>
		super

	hide:(evt=null)=>
		TweenMax.killTweensOf(@background.element)
		TweenMax.to(@background.element, .3, {
			css:
				opacity: 0, 
			onComplete: =>
				super
		})

	hideComplete:(evt=null)=>
		super

	destroy:(evt=null)=>
		@image.destroy()
		@background.removeChild(@image)
		@image = null

		TweenMax.killTweensOf(@background.element)
		
		@background.destroy()
		@removeChild(@background)
		@background = null
		super
