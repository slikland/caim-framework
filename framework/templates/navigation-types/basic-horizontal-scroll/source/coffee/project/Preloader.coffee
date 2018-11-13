#import caim.navigation.core.Caim
#import project.views.TemplatePreloaderView

class Preloader extends Caim
	constructor:()->
		super(new TemplatePreloaderView())
app.on 'windowLoad', =>
	new Preloader()
	
