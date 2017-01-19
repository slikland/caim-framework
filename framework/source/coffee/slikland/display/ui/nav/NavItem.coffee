#import slikland.display.ui.BaseComponent

class NavItem extends BaseComponent

	@const CLICK: 'navitem-click'
	@const OVER: 'navitem-over'
	@const OUT: 'navitem-out'

	@const BASE_CLASSNAME: 'nav-list__item'

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
		className: @BASE_CLASSNAME
		element: 'li'
		text: null
		button: {
			element: 'a'
			className: ''
			attrs: {
				href: null
			}
		}
	}, @DEFAULT_OPTIONS)

	constructor:(p_options = null)->
		@_selected = false
		super p_options
		@create()

	# Public
	#------------------------------------------

	@set text:(p_text='')->
		@option('text', p_text)

	@get text:()->
		return @_options.text

	@get button:()->
		return @_button

	componentLayout:()->
		@_options.button ?= {}
		@_options.button._className = @_options.button.className
		@_options.button.className = "#{@constructor.BASE_CLASSNAME}-button #{@_options.button._className}"
		@_button = new Button @_options.button
		@appendChild @_button

		@_button.on Button.BUTTON_CLICK, @click
		if app.detections.desktop
			@_button.on Button.BUTTON_OVER, @over
			@_button.on Button.BUTTON_OUT, @out

	select:()=>
		@over()
		@_selected = true

	deselect:()=>
		@_selected = false
		@out()

	destroy:()->
		@_button?.off()
		@_button?.destroy()
		super

	# Private
	#------------------------------------------

	_invalidate:()->
		super
		@_invalidateButton()

	_invalidateButton:()->
		@_button?.option?('label', @_options.text)

	click:(event=null)=>
		@trigger @constructor.CLICK, event

	over:(event=null)=>
		@trigger @constructor.OVER, event

	out:(event=null)=>
		@trigger @constructor.OUT, event
