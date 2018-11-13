#import caim.navigation.types.DefaultNavigationController
#import caim.navigation.core.NavigationContainer
#import caim.utils.Resizer

#############################
# IMPORT VIEWS BELLOW 	#
#############################

#import project.views.TemplateHomeView
#import project.views.TemplateSubView

class Main extends NavigationContainer
	_controller = new DefaultNavigationController()
	re = Resizer.getInstance()
	create:(evt=null)=>
		menu = new BaseDOM()
		menu.className = 'menu'
		@appendChildAt(menu, 0)
		
		# app.navigation.on(Navigation.CHANGE_ROUTE, @change)

		for k, v of app.config.views
			@button = new BaseDOM()
			menu.appendChild(@button)
			@button.className = 'menu-button'
			@button.attr({'id':v.id})
			@button.text = v.id
			@button.element.on 'click', @click
		re.on(Resizer.BREAKPOINT_CHANGE, @change)
		super

	change:(evt)->
		console.log evt

	click:(evt)->
		if evt.srcElement.id == "sub2"
			route = "/sub-view-02/test-dynamic-route"
		else
			route = app.config.views[evt.srcElement.id].route
		app.navigation.gotoRoute(route, true)

	@get controller:=>
		return _controller

return new Main()
