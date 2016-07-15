#import slikland.core.navigation.NavigationLoader
#import project.views.TemplatePreloaderView

class Preloader extends NavigationLoader

	preloaderView = null

	constructor:()->
		preloaderView = new TemplatePreloaderView()
		super(preloaderView)

	# Callback of preloader assets complete (on required object on config.json) 
	preloaderAssetsLoaded:(evt=null)=>
		@attachAgeGate()
		false

	# Override this method to stop default rotine of NavigationLoader
	hidePreloderView:(evt=null)=>
		if @ageGate? && @answer?
			@destroyAgeGate()

		if @loaded && @answer?
			super

	attachAgeGate:(evt=null)=>
		@ageGate = new BaseDOM('div')
		@ageGate.className = 'age-gate'
		@ageGate.css({
			'width': '100%'
			'height': '100%'
			'background-image': 'url("http://dummyimage.com/666x666&text=Age+gate+dummy+image")'
			'background-color': '#'+Math.floor(Math.random()*16777215).toString(16)
		})
		document.body.appendChild(@ageGate.element)

		@buttons = new BaseDOM('div')
		@buttons.css({
			'text-align': 'center'
		})
		@ageGate.appendChild(@buttons.element)

		@buttonYes = new BaseDOM('button')
		@buttonYes.text = "YES"
		@buttons.appendChild(@buttonYes)
		@buttonYes.element.onclick = @clickYes
		@buttonYes.css({
			'font-size': '2em'
			'text-align': 'center'
		})

		@buttonNo = new BaseDOM('button')
		@buttonNo.text = "NO"
		@buttons.appendChild(@buttonNo)
		@buttonNo.element.onclick = @clickNo
		@buttonNo.css({
			'font-size': '2em'
			'text-align': 'center'
		})
	
	clickYes:(evt=null)=>
		@answer = true
		@hidePreloderView(evt)

	clickNo:(evt=null)=>
		@answer = false
		console.log "Say no no no..."

	destroyAgeGate:(evt=null)=>
		@buttonYes.onclick = null
		@buttonYes.destroy()
		@buttons.removeChild(@buttonYes)
		@buttonYes = null

		@buttonNo.onclick = null
		@buttonNo.destroy()
		@buttons.removeChild(@buttonNo)
		@buttonNo = null

		@buttons.destroy()
		@ageGate.removeChild(@buttons)
		@buttons = null

		@ageGate.removeAll()
		@ageGate.destroy()
		document.body.removeChild(@ageGate.element)
		@ageGate = null
		
app.on 'windowLoad', =>
	new Preloader()
	
