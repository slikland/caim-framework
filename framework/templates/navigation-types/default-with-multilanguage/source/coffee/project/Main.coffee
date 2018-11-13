#import caim.navigation.types.DefaultNavigationController
#import caim.navigation.core.NavigationContainer
#import caim.navigation.core.data.LanguageData
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
		# console.log "valck"
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

		for k, v of app.config.languages
			@button = new BaseDOM()
			menu.appendChild(@button)
			@button.className = 'menu-button-language'
			@button.attr({'iso':v.iso})
			@button.text = v.iso
			@button.element.on 'click', @changeLanguage
		# re.on(Resizer.BREAKPOINT_CHANGE, @change)

		# console.log LanguageData.getInstance()

		# console.log "main content:", @content
		# console.log app.detections.os
		super

	changeLanguage:(evt)->
		app.languages.gotoLanguage(evt.srcElement.getAttribute('iso'))

	click:(evt)->
		route = app.config.views[evt.srcElement.id].route
		app.navigation.gotoRoute(route, true)
		# console.log route

	@get controller:=>
		return _controller

return new Main()
