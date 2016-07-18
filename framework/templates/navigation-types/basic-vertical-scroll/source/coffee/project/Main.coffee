#import slikland.navigation.types.ScrollNavigationController
#import slikland.core.navigation.NavigationContainer

#######################
# IMPORT VIEWS BELLOW #
#######################

#import project.views.TemplateHomeView
#import project.views.TemplateSubView

class Main extends NavigationContainer
	time = 0
	_controller = new ScrollNavigationController()

	create:(evt=null)=>
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
		
		@bar = new BaseDOM()
		@bar.className = 'bar'
		menu.appendChildAt(@bar, 0)
		_controller.on(ScrollNavigationController.SCROLL, @scroll)

		# Workaround of timeout to come back the listener to listen only change on the previous/current view
		time = app.config.navigation.options.scrollToTime*1000
		@timeout = setTimeout(@addListener, time)
		super

	addListener:()=>
		app.navigation.on(Navigation.CHANGE_VIEW, @changeNav)

	removeListener:()=>
		app.navigation.off(Navigation.CHANGE_VIEW, @changeNav)

	changeNav:(evt)=>
		route = evt.data.currentView.route
		app.navigation.gotoRoute(route, false)

	scroll:(evt)=>
		@bar.css({
			width:String((evt.percent*100)+"%")
		})

	click:(evt)=>
		@removeListener()

		route = app.config.views[evt.srcElement.id].route
		app.navigation.gotoRoute(route, true)

		clearTimeout(@timeout)
		@timeout = setTimeout(@addListener, time)

	@get controller:=>
		return _controller

return new Main()
