#import caim.navigation.types.DefaultNavigationController
#import caim.navigation.core.NavigationContainer
#import caim.navigation.core.data.LanguageData
#import caim.utils.Resizer
#import caim.utils.ColorUtils
#import caim.utils.FunctionUtils

#############################
# IMPORT VIEWS BELLOW 	#
#############################

#import project.views.TemplateHomeView
#import project.views.TemplateSubView

class Main extends NavigationContainer
	_controller = new DefaultNavigationController()
	re = Resizer.getInstance()

	createStart:(evt=null)=>
		# app.navigation?.on(Navigation.CHANGE_INTERNAL_VIEW, @change)
		# app.navigation?.on(Navigation.CHANGE_ROUTE, @change)
		# app.navigation?.on(Navigation.CHANGE_VIEW, @change)
		super

	create:(evt=null)=>
		# console.log @content, "Main"
		console.log "Valck"

		menu = new BaseDOM()
		menu.className = 'menu'
		@appendChildAt(menu, 0)
		
		
		for k, v of app.config.views
			@button = new BaseDOM()
			menu.appendChild(@button)
			@button.className = 'menu-button'
			@button.attr({'id':v.id})
			@button.text = v.id
			@button.element.on 'click', @click
		# re.on(Resizer.BREAKPOINT_CHANGE, @change)

		# console.log LanguageData.getInstance()

		# console.log ColorUtils.hexToRGB('#ffffff')
		# console.log ColorUtils.RGBToHex(255, 255, 255)
		# console.log ColorUtils.randomRGB()
		# console.log ColorUtils.randomHex()
		# console.log ColorUtils.lightenOrDarken('#000', 1)
		# console.log ColorUtils.lightenOrDarken('#000', .9)
		# console.log ColorUtils.lightenOrDarken('#000', .8)
		# console.log ColorUtils.lightenOrDarken('#000', .7)
		# console.log ColorUtils.lightenOrDarken('#000', .6)
		# console.log ColorUtils.lightenOrDarken('#000', .5)
		# console.log ColorUtils.lightenOrDarken('#000', .4)
		# console.log ColorUtils.lightenOrDarken('#000', .3)
		# console.log ColorUtils.lightenOrDarken('#000', .2)
		# console.log ColorUtils.lightenOrDarken('#000', .1)
		# console.log '-----'
		# console.log ColorUtils.lightenOrDarken('#000', 0)
		# console.log '-----'
		# console.log ColorUtils.lightenOrDarken('#000', -.1)
		# console.log ColorUtils.lightenOrDarken('#000', -.2)
		# console.log ColorUtils.lightenOrDarken('#000', -.3)
		# console.log ColorUtils.lightenOrDarken('#000', -.4)
		# console.log ColorUtils.lightenOrDarken('#000', -.5)
		# console.log ColorUtils.lightenOrDarken('#000', -.6)
		# console.log ColorUtils.lightenOrDarken('#000', -.7)
		# console.log ColorUtils.lightenOrDarken('#000', -.8)
		# console.log ColorUtils.lightenOrDarken('#000', -.9)
		# console.log ColorUtils.lightenOrDarken('#000', -1)
		# console.log "main content:", @content
		# console.log app.detections.os
		super

	change:(evt)->
		console.log evt
		v = app.navigation.previousView
		console.log v?.id, v?.routeData

	click:(evt)->
		route = app.config.views[evt.srcElement.id].route
		app.navigation.gotoRoute(route, true)
		# console.log route

	@get controller:=>
		return _controller

return new Main()
