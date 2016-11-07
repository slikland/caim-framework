#import slikland.display.ui.BaseComponent

class NavItem extends BaseComponent

	@const CLICK: 'navitem-click'
	@const OVER: 'navitem-over'
	@const OUT: 'navitem-out'

	@const BASE_CLASSNAME: 'nav-item'

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
		className: @BASE_CLASSNAME
		element: 'li'
		text: null
		button: {
			element: 'button'
			className: ''
			attrs: {
				href: null
			}
		}
	}, @DEFAULT_OPTIONS)

	constructor:(p_options = null)->
		@_selected = false
		super p_options

	# Public
	#------------------------------------------

	@set text:(p_text='')->
		@option('text', p_text)

	@get text:()->
		return @_options.text

	componentLayout:()->

		@_button = new BaseDOM
			element: @_options.button.element
			className: "#{@_options.button.className} #{@constructor.BASE_CLASSNAME}-button"
		@_button.attr @_options.button.attrs
		@appendChild @_button

		@_button.element.on 'click', @click
		if app.detections.desktop
			@_button.element.on 'mouseenter', @over
			@_button.element.on 'mouseleave', @out

	select:()=>
		@over()
		@_selected = true

	deselect:()=>
		@_selected = false
		@out()

	destroy:()->
		@_button?.element.off 'click', @click
		@_button?.element.off 'mouseenter', @over
		@_button?.element.off 'mouseleave', @out
		@_button?.destroy()
		super

	# Private
	#------------------------------------------

	_invalidate:()->
		super
		@_invalidateButton()

	_invalidateButton:()->
		@_button?.html = @_options.text

	click:(event=null)=>
		@trigger @constructor.CLICK, event

	over:(event=null)=>
		@trigger @constructor.OVER, event

	out:(event=null)=>
		@trigger @constructor.OUT, event
