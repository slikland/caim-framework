#import caim.event.EventDispatcher

class ServiceWorkerController extends EventDispatcher
	@const INSTALLING : "serviceworker_controller_installing"
	@const INSTALLED : "serviceworker_controller_installed"
	@const ACTIVE : "serviceworker_controller_active"
	@const CHANGE : "serviceworker_controller_change"
	@const ERROR : "serviceworker_controller_error"

	# Example in config file
	# 
	# "cacheContents":{
	# 	"src":"{base}js/sw.js",
	# 	"scope":"./"
	# }
	# 
	constructor:()->
		cache = app.config.cacheContents
		src = if cache?.src? then cache?.src else null
		if src?
			navigator.serviceWorker
			.register(src, {scope:if cache?.scope? then cache?.scope else './'})
			.then(@registered)
			.catch(@error)
		super

	messages:(evt)=>
		console.log("From worker:", evt.data)

	registered:(evt)=>
		if evt.installing
			serviceWorker = evt.installing
			@trigger(ServiceWorkerController.INSTALLING, {data:serviceWorker})
		else if evt.waiting
			serviceWorker = evt.waiting
			@trigger(ServiceWorkerController.INSTALLED, {data:serviceWorker})
		else if evt.active
			serviceWorker = evt.active
			@trigger(ServiceWorkerController.ACTIVE, {data:serviceWorker})

		if serviceWorker && !@loaded
			@loaded = true
			serviceWorker.addEventListener('message', @messages)
			serviceWorker.addEventListener('statechange', @change)
			
			serviceWorker.postMessage = (serviceWorker.webkitPostMessage || serviceWorker.postMessage)
			serviceWorker.postMessage({'version':app.info.contents.version})

	change:(evt)=>
		@trigger(ServiceWorkerController.CHANGE, {data:evt})

	error:(err)=>
		console.log 'ServiceWorkerController registration failed: ', err
		@trigger(ServiceWorkerController.ERROR, {data:err})
