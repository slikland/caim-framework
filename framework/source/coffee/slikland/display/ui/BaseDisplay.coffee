#import slikland.display.ui.BaseComponent
#import slikland.display.BaseDOM

class BaseDisplay extends BaseComponent

	#Events Constants
	@const SHOW_START: 'show-start'
	@const SHOW: 'show'
	@const SHOW_COMPLETE: 'show-complete'
	@const HIDE_START: 'hide-start'
	@const HIDE: 'hide'
	@const HIDE_COMPLETE: 'hide-complete'

	constructor:(p_options = {})->
		super p_options

	createStart:()->
		@create()

	showStart:(evt=null)=>
		@trigger(BaseDisplay.SHOW_START, @)
		@show()
		false

	show:(evt=null)=>
		@trigger(BaseDisplay.SHOW, @)
		@showComplete()
		false

	showComplete:(evt=null)=>
		@_showed = true
		@trigger(BaseDisplay.SHOW_COMPLETE, @)
		false

	hideStart:(evt=null)=>
		@trigger(BaseDisplay.HIDE_START, @)
		@hide()
		false

	hide:(evt=null)=>
		@_showed = false
		@trigger(BaseDisplay.HIDE, @)
		@hideComplete()
		false

	hideComplete:(evt=null)=>
		@trigger(BaseDisplay.HIDE_COMPLETE, @)
		false
