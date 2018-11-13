#import caim.utils.StringUtils

do ->
	'use strict'

	CacheControllerPlugin = ->

	s = CacheControllerPlugin

	s.getPreloadHandlers = () ->
		return {callback: s.preloadHandler, types: ["binary", "image", "javascript", "json", "jsonp", "sound", "video", "svg", "text", "xml"]}

	s.preloadHandler = (p_loadItem, p_queue) ->
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
		 
		return true
	createjs.CacheControllerPlugin = CacheControllerPlugin
	return
