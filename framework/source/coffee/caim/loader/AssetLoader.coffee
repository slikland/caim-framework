#import caim.loader.PreloadFiles
#import caim.vendors.preloaderjs.CacheControllerPlugin
#import caim.vendors.preloaderjs.MediaPlugin
#import caim.navigation.core.data.PathsData

###*
@class AssetLoader
@extends EventDispatcher
@submodule caim.loader
###
class AssetLoader extends EventDispatcher

	@INITIALIZE: "initialize"

	@COMPLETE_ALL: "complete"
	@COMPLETE_FILE: "fileload"

	@PROGRESS_ALL: "progress"
	@PROGRESS_FILE: "fileprogress"

	@START_ALL: "loadstart"
	@START_FILE: "filestart"

	@ERROR: "error"
	@FILE_ERROR: "fileerror"

	_groups:null
	
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	###*
	@class AssetLoader
	@constructor
	@extends EventDispatcher
	###
	constructor:()->
		@_groups = {}

	loadGroup:(p_groupId, p_files)->
		group = @getGroup(p_groupId)
		group.loadManifest(p_files)
		return group

	getAllGroups:()->
		return @_groups

	getGroup:(p_groupId, p_concurrent=3, p_xhr=true)->
		group = @_groups[p_groupId]
		if !group
			group = new createjs.LoadQueue(p_xhr)
			
			group.installPlugin(createjs.CacheControllerPlugin)
			group.installPlugin(createjs.MediaPlugin)
			
			group.id = p_groupId
			
			@_groups[p_groupId] = group
			
			group.on(AssetLoader.ERROR, @_onError)
			group.on(AssetLoader.START_FILE, @_onStartFile)
			group.on(AssetLoader.FILE_ERROR, @_onFileError)
			group.on(AssetLoader.COMPLETE_FILE, @_fileLoad)
		group.setMaxConnections(p_concurrent)
		return group

	preferXHR:(p_groupId, p_value=true)->
		group = @getGroup(p_groupId).setPreferXHR = p_value
		return group

	_onStartFile:(evt)=>
		evt.item.loaded = false

	_onError:(e)=>
		e.currentTarget.off(AssetLoader.START_FILE, @_onStartFile)
		e.currentTarget.off(AssetLoader.ERROR, @_onError)
		e.currentTarget.off(AssetLoader.COMPLETE_FILE, @_fileLoad)
		msg = e.title
		if e?.data?.src?
			e.fileName = e.data.src
			msg += " "+e.data.src
		throw new Error(msg).stack
		false

	_onFileError:(e)=>
		e.currentTarget.off(AssetLoader.START_FILE, @_onStartFile)
		e.currentTarget.off(AssetLoader.FILE_ERROR, @_onFileError)
		e.currentTarget.off(AssetLoader.COMPLETE_FILE, @_fileLoad)
		console.log e
		throw new Error(e.title).stack
		false

	_fileLoad:(evt)=>
		evt.item.loaded = true
		evt.currentTarget.off(AssetLoader.ERROR, @_onError)
		evt.currentTarget.off(AssetLoader.FILE_ERROR, @_onFileError)
		# console.log e.item.src
		# evt.result.src = evt.item.src
		evt.item.result = evt.item.tag = evt.result
		if app?.config?.paths?
			paths = PathsData.getInstance(app.config.paths)
			
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
					if evt.item.id.search(/main/i) != -1
						# result = evt.item.result = eval(data)
						result = evt.item.result = data
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

		false

	getItem:(p_id, p_groupId=null)->
		if p_groupId
			return @_groups[p_groupId]?.getItem(p_id)
		
		for k, v of @_groups
			if i = v.getItem(p_id)
				return i

	getResult:(p_id, p_groupId=null)->
		result = null
		if p_groupId
			result = @_groups[p_groupId]?.getResult(p_id)
		
		for k, v of @_groups
			if i = v.getResult(p_id)
				result = i
		return result
