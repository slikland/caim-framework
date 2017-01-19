#import slikland.display.ui.nav.NavItem
#import slikland.display.ui.buttons.SvgButton

class SvgNavItem extends NavItem

	constructor:(p_options = null)->
		super p_options

	componentLayout:()->
		@_options.button ?= {}
		@_options.button._className = @_options.button.className
		@_options.button.className = "#{@constructor.BASE_CLASSNAME}-button #{@_options.button._className}"
		@_button = new SvgButton @_options.button
		@appendChild @_button

		@_button.on Button.BUTTON_CLICK, @click
		if app.detections.desktop
			@_button.on Button.BUTTON_OVER, @over
			@_button.on Button.BUTTON_OUT, @out
