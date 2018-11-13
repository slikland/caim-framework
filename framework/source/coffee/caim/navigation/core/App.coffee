#import caim.utils.Prototypes
#import caim.event.EventDispatcher
#
###*
_
@class App
@extends EventDispatcher
@submodule caim.navigation.core
###
class App extends EventDispatcher
	@project_version_raw : "SL_PROJECT_VERSION:0.0.0"
	@project_date_raw : "SL_PROJECT_DATE:0000000000000"

	@WINDOW_ACTIVE:"windowActive"
	@WINDOW_INACTIVE:"windowInactive"
	@NETWORK_UPDATE:'networkUpdate'
	
	# @TODO
	# IMPLEMENT THIS
	# 
	# FOR NOW IS HARDCODED !!!1!
	# 
	framework_version = "3.3.3"

	_root = null
	_loader = null
	_config = null
	_container = null
	_navigation = null
	_conditions = null
	_detections = null
	
	constructor:()->
		super
		@_checkWindowActivity()
		@_checkNetworkStatus()

	@get info:()->
		info = {}

		info.framework = {}
		info.framework.version = framework_version
		info.framework.lastUpdate = undefined

		info.contents = {}
		info.contents.version = undefined
		info.contents.lastUpdate = undefined

		info.project = {}
		info.project.version = (if App.project_version_raw == undefined || App.project_version_raw == 'undefined' then 'SL_PROJECT_VERSION:'+'Not versioned' else App.project_version_raw).replace('SL_PROJECT_VERSION:', '')
		info.project.lastUpdate = new Date(parseFloat((if App.project_date_raw == undefined || App.project_date_raw == 'undefined' then 'SL_PROJECT_DATE:'+'Not versioned' else App.project_date_raw).replace('SL_PROJECT_DATE:', '')))
		return info

	@set root:(p_value)->
		_root = p_value
	@get root:()->
		return _root

	@set loader:(p_value)->
		_loader = p_value
	@get loader:()->
		return _loader

	@set config:(p_value)->
		_config = p_value
	@get config:()->
		return _config
		
	@set container:(p_value)->
		_container = p_value
	@get container:()->
		return _container
		
	@set navigation:(p_value)->
		_navigation = p_value
	@get navigation:()->
		return _navigation

	@set conditions:(p_value)->
		_conditions = p_value
	@get conditions:()->
		return _conditions
	
	@set detections:(p_value)->
		_detections = p_value
	@get detections:()->
		return _detections

	@get online:()->
		return window?.navigator?.online

	@get windowHidden:()->
		prop = null
		if 'hidden' of document
			prop = document['hidden']
		else
			prefixes = ['webkit','moz','ms','o']
			i = 0
			while i < prefixes.length
				if prefixes[i] + 'Hidden' of document
					prop = document[prefixes[i] + 'Hidden']
					break
				i++
		return prop

	_checkWindowActivity:()->
		if @windowHidden
			document.addEventListener 'visibilitychange', @_windowVisibilityChange
		else if 'onfocusin' of document
			document.onfocusin = document.onfocusout = @_windowVisibilityChange
		else
			window.onpageshow = window.onpagehide = window.onfocus = window.onblur = @_windowVisibilityChange

	_windowVisibilityChange:(evt)=>
		switch evt.type
			when 'blur', 'pagehide'
				evtType = App.WINDOW_INACTIVE
			when 'focus', 'pageshow'
				evtType = App.WINDOW_ACTIVE
		@trigger(evtType)

	_checkNetworkStatus:()->
		window.addEventListener "online",  @_updateNetworkStatus
		window.addEventListener "offline", @_updateNetworkStatus

	_updateNetworkStatus:()=>
		@trigger App.NETWORK_UPDATE

if !app
	app = new App()

windowLoaded = =>
	if window.remove
		window.remove('load', windowLoaded)
	else if window.detachEvent
		window.detachEvent('onload', windowLoaded)
	else
		window.onload = null
	app.trigger('windowLoad')

if window.addEventListener
	window.addEventListener('load', windowLoaded)
else if window.attachEvent
	window.attachEvent('onload', windowLoaded)
else
	window.onload = windowLoaded


