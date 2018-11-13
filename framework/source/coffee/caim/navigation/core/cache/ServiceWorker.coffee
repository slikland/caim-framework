class ServiceWorker
	@CACHE_VERSION : "0.0.0"
	
	constructor:(@self)->
		# @self.addEventListener('install', @install)
		@self.addEventListener('message', @messages)
		@self.addEventListener('fetch', @fetch)
		@self.addEventListener('activate', @activate)
		@self.skipWaiting()

	messages:(evt)=>
		if evt.data.version?
			ServiceWorker.CACHE_VERSION = evt.data.version
			console.log("Version from controller:", evt.data.version)

	error:(err)=>
		console.log err

	install:(evt)=>
		evt.waitUntil(
			caches.open(ServiceWorker.CACHE_VERSION)
			.then(@cacheFiles)
			.catch(@error)
		)

	cacheFiles:(evt)=>
		return evt.addAll(@_staticAssets)
		.then(()=>
			# console.log 'Resources have been cached'
			@self.skipWaiting()
		)

	fetch:(evt)=>
		if evt.request.method isnt 'GET'
			console.log 'fetch evt ignored.', evt.request.method, evt.request.url
			return
		evt.respondWith(
			caches.match(evt.request)
			.then((response)=>
				if response
					# console.log 'Found in cache:', response.url
					return response
				# console.log 'No response found in cache. About to fetch from network...'
				fetchRequest = evt.request.clone()
				cacheRequest = evt.request.clone()
				return fetch(fetchRequest).then((response)=>
					# console.log 'From network is:', response.url
					if !response || response.status != 200 || response.type != "basic"
						return response

					responseToCache = response.clone()
					caches
					.open(ServiceWorker.CACHE_VERSION)
					.then((cache)=>
						cacheSaveRequest = evt.request.clone()
						cache.put(cacheSaveRequest, responseToCache)
					)
					return response
				)
				.catch((err)=>
					return caches.match(cacheRequest)
				)
			)
			.catch(@error)
		)

	activate:(evt)=>
		evt.waitUntil(
			caches.keys()
			.then((cacheNames)=>
				return Promise.all(
					cacheNames.filter((cacheName)=>
						if cacheName isnt ServiceWorker.CACHE_VERSION
							return true 
					).map((cacheName)=>
						console.log 'Delete cached files of version:', cacheName
						return caches.delete(cacheName)
					)
				)
			)
			.catch(@error)
			@self.clients.claim()
		)

new ServiceWorker(@)
