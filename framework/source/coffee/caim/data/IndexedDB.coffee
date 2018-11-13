###*
@class IndexedDB
@extends EventDispatcher
@submodule caim.data
###
class IndexedDB extends EventDispatcher

	@ON_CONNECTED:"onConnected"
	@ON_SUCCESS:"onSuccess"

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:(prefix)->
		@_prefix = prefix
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

		request = window.indexedDB.open(@_prefix+"DB", 3)

		request.onsuccess = @_onConnected
		request.onupgradeneeded = @_onUpgradeNeeded
		super

	put:(id, value, callback = null)=>
		@_tx = @_DB.transaction(@_prefix+'Store', 'readwrite')
		@_store = @_tx.objectStore(@_prefix+'Store')

		request = @_store.put({id:id, value:value})
		request.callback = callback
		request.onsuccess = @_onPut

	get:(id, callback = null)=>
		@_tx = @_DB.transaction(@_prefix+'Store', 'readwrite')
		@_store = @_tx.objectStore(@_prefix+'Store')

		request = @_store.get(id)
		request.callback = callback
		request.onsuccess = @_onGet

	_onConnected:(event)=>
		@_connected = true
		@_DB = event.target.result
		@_tx = @_DB.transaction(@_prefix+'Store', 'readwrite')
		@_store = @_tx.objectStore(@_prefix+'Store')

		if @_callbackConnect
			@_callbackConnect()

		@trigger IndexedDB.ON_CONNECTED

	_onUpgradeNeeded:(event)=>
		@_DB = event.target.result
		@_store = @_DB.createObjectStore(@_prefix+'Store', keyPath: 'id')
		return
	
	_onPut:()=>
		if event.target.callback
			event.target.callback()

		@trigger IndexedDB.ON_SUCCESS

	_onGet:(event)=>
		if event.target.callback
			
			result = event.target.result
			
			if !result
				result = {value:null}
			
			event.target.callback(result.value)

	@get connected:()->
		return @_connected

	@set callback:(value)->
		@_callbackConnect = value
