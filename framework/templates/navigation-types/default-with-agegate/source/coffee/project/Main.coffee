#import caim.navigation.types.DefaultNavigationController
#import caim.navigation.core.NavigationContainer

#############################
# IMPORT VIEWS BELLOW 	#
#############################

#import project.views.TemplateHomeView
#import project.views.TemplateSubView

class Main extends NavigationContainer
	
	_controller = new DefaultNavigationController()
	
	create:(evt=null)=>
		menu = new BaseDOM()
		menu.className = 'menu'
		@appendChildAt(menu, 0)
		
		app.navigation.on(Navigation.CHANGE_ROUTE, @change)

		for k, v of app.config.views
			@button = new BaseDOM()
			menu.appendChild(@button)
			@button.className = 'menu-button'
			@button.attr({'id':v.id})
			@button.text = v.id
			@button.element.on 'click', @click
		super

	change:(evt)->
		console.log evt.data

	click:(evt)->
		route = app.config.views[evt.srcElement.id].route
		app.navigation.gotoRoute(route, true)

	@get controller:=>
		return _controller

return new Main()
