#import slikland.navigation.types.DefaultNavigationController
#import slikland.core.navigation.NavigationContainer
#import slikland.utils.Resizer

#############################
# IMPORT VIEWS BELLOW 	#
#############################

#import project.views.UiComponents

class Main extends NavigationContainer

	_controller = new DefaultNavigationController()

	create:(evt=null)=>
		#

	@get controller:=>
		return _controller

return new Main()
