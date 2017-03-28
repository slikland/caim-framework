#import slikland.event.EventDispatcher

#import slikland.utils.ObjectUtils
#import slikland.utils.JSONUtils
#import slikland.loader.AssetLoader

#import slikland.navigation.core.data.LanguageData
#import slikland.navigation.core.data.PathsData
#import slikland.navigation.core.data.ParseConfig
#import slikland.navigation.core.data.ParseContent

###*
Base class to setup the configuration file and start loading of dependencies.
@class NavigationLoader
@extends EventDispatcher
###
class NavigationLoader extends EventDispatcher

	@const LANGUAGE_DATA_LOADED : "language_data_loaded"
	@const CONFIG_LOADED : "config_loaded"
	@const GROUP_ASSETS_LOADED : "group_assets_loaded"

	@const LOAD_START : "load_start"
	@const LOAD_PROGRESS : "load_progress"
	@const LOAD_COMPLETE : "load_complete"
	@const LOAD_FILE_COMPLETE : "load_file_complete"

	paths = null
	config = null
	lang = null
	totalContentsLoaded = null
	
	loaderStep = 0
	loaderRatio = 0
	loaderSteps = null
	currentStep = null

	###*
	@class NavigationLoader
	@constructor
	@param {String} p_configPath Path of the navigation configuration file.
	###
	constructor:(p_configPath)->
		if !p_configPath then throw new Error('The param p_configPath is null')

		queue = @loader.getGroup('config')
		queue.on(AssetLoader.COMPLETE_FILE, @configLoaded)
		queue.loadFile 
			id: 'config',
			cache: true,
			src: p_configPath
		false
	
	###*
	@method loader
	@return {AssetLoader}
	@protected
	###
	@get loader:()->
		return AssetLoader.getInstance()

	###*
	@method configLoaded
	@param {Event} evt
	@private
	###
	configLoaded:(evt)=>
		evt?.currentTarget?.off(AssetLoader.COMPLETE_FILE, @configLoaded)
		data = evt.result

		if data.languages?
			lang = LanguageData.getInstance()
			lang.data = data.languages

		if data.paths?
			@trigger(NavigationLoader.LANGUAGE_DATA_LOADED, {data:data, language:lang})
		else
			@selectLanguage(data)
		false 

	###*
	@method selectLanguage
	@param {Object} p_data
	@private
	###
	selectLanguage:(p_data)=>
		if lang?
			if lang.current?.path?
				current = lang.current.path
			else
				current = lang.default.path
	
		if p_data.paths?
			p_data.paths['language'] = current
			paths = PathsData.getInstance(p_data.paths)
			result = paths.translate(p_data)
		else
			result = p_data
		@parseConfig(result)

	###*
	@method parseConfig
	@param {Object} p_data
	@private
	###
	parseConfig:(p_data)=>
		config = new ParseConfig(p_data)
		@trigger(NavigationLoader.CONFIG_LOADED, {data:config.data})
		@loadContents()
		false 

	###*
	@method loadContents
	@private
	###
	loadContents:()=>
		totalContentsLoaded ?= 0
		contents = config.contents
		if contents.length > 0
			i = contents.length
			while i-- >0
				content = contents[i]
				if content.loadContent || content.loadContent == undefined
					queue = @loader.getGroup(content.group || content.id)
					queue.on(AssetLoader.COMPLETE_FILE, @contentLoaded)
					queue.loadFile(content, false)
					queue.load()
				else
					@contentLoaded(null)
		else
			@initialQueue()
		false

	###*
	@method contentLoaded
	@param {Event} evt
	@private
	###
	contentLoaded:(evt)=>
		evt?.currentTarget?.off(AssetLoader.COMPLETE_FILE, @contentLoaded)

		if evt?.item
			if config.views[evt.item.id]
				config.views[evt.item.id].content = paths.translate(evt.item.result)
			else if config.required[evt.item.group][evt.item.id]
				config.required[evt.item.group].content = paths.translate(evt.item.result)
				delete config.required[evt.item.group][evt.item.id]
		totalContentsLoaded++
		if totalContentsLoaded == config.contents.length then @initialQueue()

	###*
	@method initialQueue
	@private
	###
	initialQueue:()=>
		# console.log 'config:', config.data
		# console.log 'views:', config.views
		# console.log 'required:', config.required
		# console.log 'contents:', config.contents

		assets = []
		loaderSteps = []

		for k, v of config.views
			data = v.content
			if data?
				content = new ParseContent(data)
				assets[v.id] = content.initialAssets

		for id of config.required
			data = config.required[id].content
			if data?
				content = new ParseContent(data)
				if assets[id]
					assets[id].concat content.initialAssets
				else
					assets[id] = content.initialAssets

			for k, v of config.required[id]
				if v.src
					v.internal = false
					if v.src != config.required[id].content?.src
						if assets[id]
							assets[id].push v
						else
							assets[id] = []
							assets[id].push v

		total = ObjectUtils.count(assets)
		firstIndexes = loaderSteps.length
		for k, v of assets
			switch k
				when 'preloader', 'core', 'main'
					loaderSteps.splice(firstIndexes, 0, {id:k, data:v, ratio:(1/total)})
					firstIndexes++
				else
					loaderSteps.push {id:k, data:v, ratio:(1/total)}
		
		@trigger(NavigationLoader.LOAD_START)

		currentStep = loaderSteps[0]
		queue = @addLoader(currentStep.id)
		@addFiles(currentStep.data, queue)
		queue.load()
		false

	###*
	@method addLoader
	@param {String} p_id
	@return {createjs.LoadQueue}
	@private
	###
	addLoader:(p_id)->
		queue = @loader.getGroup(p_id)
		queue.on(AssetLoader.COMPLETE_FILE, @loadFileComplete)
		queue.on(AssetLoader.PROGRESS_ALL, @loadProgress)
		queue.on(AssetLoader.COMPLETE_ALL, @loadComplete)
		return queue

	###*
	@method removeLoader
	@param {createjs.LoadQueue} p_queue
	@return {createjs.LoadQueue}
	@private
	###
	removeLoader:(p_queue)->
		p_queue.off(AssetLoader.COMPLETE_FILE, @loadFileComplete)
		p_queue.off(AssetLoader.PROGRESS_ALL, @loadProgress)
		p_queue.off(AssetLoader.COMPLETE_ALL, @loadComplete)
		p_queue.destroy()
		return p_queue

	###*
	@method addFiles
	@param {createjs.LoadQueue} p_queue
	@param {Object} p_files
	@private
	###
	addFiles:(p_files, p_queue)->
		jsRE = /.*\.(js|css|svg)$/g
		for f in p_files
			f.loaded = false
			if f?.src?
				if !f.id? || f.id is undefined
					src = removeParam('noCache', f.src)
					src = removeParam('v', f.src)
					f.id = src

				if f.src.indexOf('.json') != -1
					f.src = f.src
				jsRE.lastIndex = 0
				if typeof f is 'string'
					if jsRE.test(f) then f = {src: f, type: 'text'}
				else if f.src && jsRE.test(f.src)
					f['type'] = 'text'
				p_queue.loadFile(f, false)
		false
	
	###*
	@method loadFileComplete
	@param {Event} evt
	@private
	###
	loadFileComplete:(evt)=>
		evt.item.loaded = true
		
		switch evt.item.ext
			when 'json'
				data = paths.translate(evt.result)
				if typeof(data) isnt 'string' then data = JSON.stringify(data)
				JSONUtils.removeComments(data)
				result = data
				result = evt.item.result = evt.item.tag = evt.result = JSON.parse(result)
			when 'js'
				data = evt.result
				data = data.replace(/^\/\/.*?(\n|$)/igm, '')
				if currentStep.id == 'main'
					main = result = evt.item.result = eval(data)
				else
					result = eval('(function (){' + data + '}).call(self)')
			when 'css'
				head = document.querySelector("head") || document.getElementsByTagName("head")[0]
				style = document.createElement('style')
				style.id = evt.item.id
				style.type = "text/css"
				head.appendChild(style)
				si = head.querySelectorAll('style').length
				try
					style.appendChild(document.createTextNode(evt.result))
				catch e
					if document.all
						document.styleSheets[si].cssText = evt.result
				result = style
			else
				result = evt.item
		
		contents = config.views[currentStep.id]?.content || config.required[currentStep.id]?.content
		if contents? && evt.item.internal!=false
			# @TODO 
			# Sets the result of the content file to BaseView classes
			# Praying for a good soul see this and fix this shit... =}
			eval('contents["' + evt.item.___path?.join('"]["') + '"] = result')
			#
			# evt.item.src = removeParam('noCache', evt.item.src)
			# evt.item.src = removeParam('v', evt.item.src)
		if main? then main.content = contents
		@trigger(NavigationLoader.LOAD_FILE_COMPLETE, {id:evt.item.id, group:currentStep.id, data:evt.item, result:result})
		false

	###*
	@method removeParam
	@param {String} p_param
	@param {String} p_url
	@private
	###
	removeParam=(p_param, p_url)->
		param = null
		params = []
		results = p_url.split('?')[0]
		query = if p_url.indexOf('?') != -1 then p_url.split('?')[1] else ''
		if query != ''
			params = query.split('&')
			i = params.length - 1
			while i >= 0
				param = params[i].split('=')[0]
				if param == p_param
					params.splice i, 1
				i -= 1
			if params.length > 0
				results = results + '?' + params.join('&')
		return results

	###*
	@method loadProgress
	@param {Event} evt
	@private
	###
	loadProgress:(evt)=>
		@trigger(NavigationLoader.LOAD_PROGRESS, {progress:((evt.loaded / evt.total) * currentStep.ratio + loaderRatio)})
		false

	###*
	@method loadComplete
	@param {Event} evt
	@private
	###
	loadComplete:(evt)=>
		if evt then @removeLoader(evt.currentTarget)

		step = loaderSteps[loaderStep]
		if step then @assetsLoaded(step.id)

		loaderRatio += step?.ratio
		loaderStep++
		
		if loaderStep >= loaderSteps.length
			@trigger(NavigationLoader.LOAD_COMPLETE)
		else
			currentStep = loaderSteps[loaderStep]
			queue = @addLoader(currentStep.id)
			@addFiles(currentStep.data, queue)
			if queue._loadQueue.length + queue._currentLoads.length is 0
				@loadComplete()
			else
				queue.load()
		false

	###*
	Called when the others groups is completely loaded.
	@method assetsLoaded 
	@param {String} p_id
	@private
	###
	assetsLoaded:(p_id)=>
		return if !p_id?
		@trigger(NavigationLoader.GROUP_ASSETS_LOADED, {id:p_id, data:@loader.getGroup(p_id)})

		false
