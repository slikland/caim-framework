#import caim.event.EventDispatcher

#import caim.navigation.core.App
#import caim.debug.Debug
#import caim.utils.Prototypes

#import caim.utils.Detections

#import caim.loader.AssetLoader
#import caim.navigation.core.data.ConditionsValidation
#import caim.navigation.display.BaseView

#import caim.navigation.core.NavigationLoader

###*
Base class to setup the navigation and start loading of dependencies.

@class Caim
@module caim
@extends EventDispatcher
###
class Caim extends EventDispatcher
	
	_mainView = null
	_preloaderView = null

	wrapper = null
	
	###*
	@class Caim
	@constructor
	@param {BaseView} p_preloaderView The view of the first loading, it's called by the method {{#crossLink "Caim/createPreloaderView:method"}}{{/crossLink}} and attached on container when the preloader assets is completely loaded.
	@param {String} [p_configPath = "data/config.json"] Path of the navigation configuration file.
	@param {HTMLElement} [p_wrapper = null] Custom container to attach the navigation.
	###
	constructor:(p_preloaderView, p_configPath="data/config.json", p_wrapper=null)->
		if !(p_preloaderView instanceof BaseView)
			throw new Error('The param p_preloaderView is null or the instance of param p_preloaderView is not either BaseView class')
		else
			_preloaderView = p_preloaderView

		wrapper = if !(p_wrapper)? then document.body else p_wrapper
		if !wrapper.__instance__?
			new BaseDOM({element:wrapper})

		app.root = document.querySelector("base")?.href || document.getElementsByTagName("base")[0]?.href
		app.loader = AssetLoader.getInstance()
		app.detections = Detections.getInstance()

		loader = new NavigationLoader(if app.root? then app.root+p_configPath else p_configPath)
		loader.on(NavigationLoader.PREPARSER_DATA, @preParserState)
		loader.on(NavigationLoader.CONFIG_LOADED, @configLoaded)
		loader.on(NavigationLoader.GROUP_ASSETS_LOADED, @groupLoaded)

		loader.on(NavigationLoader.LOAD_START, @createPreloaderView)
		loader.on(NavigationLoader.LOAD_PROGRESS, @progress)
		loader.on(NavigationLoader.LOAD_COMPLETE, @hidePreloderView)
		super

	###*
	@method preParserState
	@param {Event} evt
	@param {Object} data
	@private
	###
	preParserState:(evt, data)=>
		evt?.currentTarget?.off?(NavigationLoader.PREPARSER_DATA, @preParserState)
		@preParser?(data)
		false

	###*
	@method configLoaded
	@param {Event} evt
	@private
	###
	configLoaded:(evt)=>
		evt?.currentTarget?.off?(NavigationLoader.CONFIG_LOADED, @configLoaded)
		app.config = evt.data
		app.conditions = if app.config.conditions? then ConditionsValidation.getInstance(app.config.conditions) else null
		app.languages = if app.config.languages? then LanguageData.getInstance() else null
		false

	###*
	@method progress
	@param {Event} evt
	@private
	###
	progress:(evt)=>
		_preloaderView?.progress = evt.progress
		false

	###*
	@method groupLoaded
	@param {Event} evt
	@private
	###
	groupLoaded:(evt)=>
		switch evt.id
			when 'core'
				@coreAssetsLoaded()
				break
			when 'main'
				for k, v of app.config.required.main
					if v.ext is 'js'
						_mainView = app.config.required.main[v.id].result = eval(app.config.required.main[v.id].result)
						if app.config.required.main.content
							_mainView.content = window.main['content']
							delete window.main['content']
				delete window.main
				@mainAssetsLoaded()
				break
			when 'preloader'
				@preloaderAssetsLoaded()
				# @createPreloaderView()
				break
		false

	###*
	@method createPreloaderView
	@param {Event} [evt=null]
	@protected
	###
	createPreloaderView:()=>
		wrapper.appendChild(_preloaderView.element)
		_preloaderView.on(BaseView.CREATE_COMPLETE, @showPreloaderView)
		_preloaderView.createStart()
		false
		
	###*
	@method showPreloaderView
	@param {Event} [evt=null]
	@protected
	###
	showPreloaderView:(evt=null)=>
		_preloaderView.off(BaseView.CREATE_COMPLETE, @showPreloaderView)
		_preloaderView.showStart()
		false

	###*
	@method hidePreloderView
	@param {Event} [evt=null]
	@protected
	###
	hidePreloderView:(evt=null)=>
		_preloaderView.on(BaseView.HIDE_COMPLETE, @destroyPreloderView)
		_preloaderView.progress = 1
		_preloaderView.hideStart()
		false

	###*
	@method destroyPreloderView
	@param {Event} [evt=null]
	@protected
	###
	destroyPreloderView:(evt=null)=>
		hiddenFonts = document.getElementById('hiddenFonts')
		hiddenFonts?.parentNode?.removeChild(hiddenFonts)

		_preloaderView.off(BaseView.HIDE_COMPLETE, @destroyPreloderView)
		_preloaderView.on(BaseView.DESTROY_COMPLETE, @_createMainView)
		_preloaderView.destroy()
		false

	###*
	@method _createMainView
	@private
	###
	_createMainView:()=>
		_preloaderView.off(BaseView.DESTROY_COMPLETE, @_createMainView)
		wrapper.removeChild(_preloaderView.element)
		_preloaderView = null

		if !(_mainView instanceof BaseView) then throw new Error('The instance of Main class is not either BaseView class')

		app.container = _mainView
		wrapper.appendChild(_mainView.element)

		_mainView.on(BaseView.CREATE_COMPLETE, @_showMainView)
		if app.config.navigation?.startBefore || app.config.navigation?.startBefore is undefined
			_mainView.setupNavigation(app.config)
			_mainView.createStart()
		else
			_mainView.createStart()
			_mainView.setupNavigation(app.config)

		false
	
	###*
	@method _showMainView
	@param {Event} [evt=null]
	@private
	###
	_showMainView:(evt=null)=>
		_mainView.off(BaseView.CREATE_COMPLETE, @_showMainView)
		_mainView.showStart()
		false

	###*
	Called only when the core assets is completely loaded.
	@method coreAssetsLoaded
	@param {Event} [evt=null]
	@protected
	###
	coreAssetsLoaded:(evt=null)=>
		false

	###*
	Called only when the preloader assets is completely loaded.
	@method preloaderAssetsLoaded
	@param {Event} [evt=null]
	@protected
	###
	preloaderAssetsLoaded:(evt=null)=>
		if app.config.required?.preloader?.content? && _preloaderView?
			_preloaderView.content = app.config.required.preloader.content
		false

	###*
	Called only when the main assets is completely loaded.
	@method mainAssetsLoaded
	@param {Event} [evt=null]
	@protected
	###
	mainAssetsLoaded:(evt=null)=>
		false

	preParser:(p_data)=>
		false
