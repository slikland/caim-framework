#import slikland.core.navigation.NavigationLoader
#import slikland.utils.Resizer
#
#import project.views.PreloaderView

class Preloader extends NavigationLoader
	constructor:()->
		super (new PreloaderView())

app.on 'windowLoad', =>
	new Preloader()
	
