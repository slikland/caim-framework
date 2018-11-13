#import caim.vendors.preloaderjs.MediaRequest
#import caim.vendors.preloaderjs.TagMediaLoader
#import caim.vendors.preloaderjs.MediaLoader

do ->
	'use strict'

	MediaPlugin = ->

	s = MediaPlugin

	s.getPreloadHandlers = () ->
		return {callback: s.handlers, types: ['sound', 'video'], extensions: ['mp3', 'mp4']}

	s.handlers = (p_loadItem, p_queue) ->
		views = app?.config?.views
		view = views?[p_queue.id]
		parentView = views?[view?.parentView]
		
		cv = false

		if p_loadItem.cache?
			#  sets cache by item
			if p_loadItem.cache == false
				cv = true
		else if view?.cache?
			#  sets cache by view
			if view?.cache == false
				cv = true
		else if parentView?.cache?
			#  sets cache by parent
			#  When don't sets the cache value in config file the view and all your assets inherits of his parent
			if parentView?.cache == false
				cv = true
		
		if p_loadItem.src.indexOf("?v=") == -1
			ts = new Date().getTime()
			cache = if cv then "?v="+app.info.project.version+"&noCache="+ts else "?v="+app.info.project.version
			p_loadItem.src += cache	
				
		loader = new createjs.MediaLoader(p_loadItem, false)
		return loader

	createjs.MediaPlugin = MediaPlugin
	return
