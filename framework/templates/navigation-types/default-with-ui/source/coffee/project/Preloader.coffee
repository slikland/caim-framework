#import slikland.core.navigation.NavigationLoader
#import project.views.PreloaderBlock

class Preloader extends NavigationLoader
	constructor:()->
		super(new PreloaderBlock())

app.on 'windowLoad', =>
	new Preloader()

