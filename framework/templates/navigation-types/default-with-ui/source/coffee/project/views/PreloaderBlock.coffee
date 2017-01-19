class PreloaderBlock extends BaseView

	constructor: (p_data=null, p_className=null) ->
		super p_data, 'preloader'

	@set progress:(p_value)->
		@text = Math.round(p_value*100)+"%"

	createStart:(evt=null)=>
		@css({
			'width': '100%'
			'height': '100%'
			'font-size': '5em'
			'text-align': 'center'
		})
		super

	hide:(evt=null)=>
		TweenMax.to(@element, 1, {
			delay: .5,
			opacity: 0,
			onComplete: =>
				super
		})

	destroy:(evt=null)=>
		TweenMax.killTweensOf(@element)
		super
