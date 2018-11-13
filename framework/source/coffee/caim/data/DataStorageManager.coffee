#import caim.data.IndexedDB
#import caim.data.CookiesManager

###*
@class DataStorageManager
@extends EventDispatcher
@submodule caim.data
###
class DataStorageManager extends EventDispatcher

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:(prefix = "SLK")->
		@_queue = []
		if app.detections.os != "ios" && !app.detections.standalone
			app.indexedDB = IndexedDB.getInstance(prefix)
			app.indexedDB.on IndexedDB.ON_CONNECTED, @_onIndexedDBConnected
		super
		
	set:(id, value, callback)=>
		if app.indexedDB
			if app.indexedDB.connected
				app.indexedDB.put id, value, callback
			else
				@_queue.push {type:"set", id:id, value:value, callback:callback}
		else
			CookiesManager.getInstance().set(id, value)
			callback?()

	get:(id, callback)=>
		if app.indexedDB
			if app.indexedDB.connected
				app.indexedDB.get id, callback
			else
				@_queue.push {type:"get", id:id, callback:callback}

		else
			callback?( CookiesManager.getInstance().get(id) )

	_onIndexedDBConnected:(event)=>
		for queue in @_queue
			if queue.type == "set"
				app.indexedDB.put queue.id, queue.value, queue.callback
			else if queue.type == "get"
				app.indexedDB.get queue.id, queue.callback

		@_queue = null
