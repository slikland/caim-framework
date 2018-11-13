#import caim.event.EventDispatcher
#import caim.navigation.core.NavigationRouter

###*
Navigation Class
The instance of this class can be accessed by `app.navigation` wrapper
@class Navigation
@extends EventDispatcher
@final
###
class Navigation extends EventDispatcher

	###*
	@event CHANGE_ROUTE
	@static
	###
	@CHANGE_ROUTE : 'navigation_change_route'
	###*
	@event CHANGE_VIEW
	@static
	###
	@CHANGE_VIEW : 'navigation_change_view'
	###*
	@event CHANGE_INTERNAL_VIEW
	@static
	###
	@CHANGE_INTERNAL_VIEW : 'navigation_change_internal_view'

	_controller = null
	_router = null

	###*
	@class Navigation
	@constructor
	@param {BaseNavigationController} p_controller
	###
	constructor: (p_controller = null) ->

		if !(p_controller instanceof BaseNavigationController) then throw new Error('The instance of '+p_controller+' class is not either BaseNavigationController class')
		_controller = p_controller

		_router = new NavigationRouter()
		
		app.navigation = @
		super

	###*
	@method setup
	@param {Object} p_data
	###
	setup:(p_data)=>
		_controller.on(BaseNavigationController.CHANGE, @_change)
		_controller.on(BaseNavigationController.CHANGE_VIEW, @_changeView)
		_controller.setup(p_data)

		_router.on(NavigationRouter.CHANGE, @_change)
		_router.on(NavigationRouter.CHANGE_ROUTE, @_changeRoute)
		_router.setup(app.root, app.config.navigation?.forceHashBang)
		
		for k, v of p_data.views
			if v.route? then _router.addRoute(v.route, null, {strict: !!v.strictRoute || false})

		if app.config.navigation?.autoStart || app.config.navigation?.autoStart is undefined
			@start()
		false

	###*
	@method start
	@param {Event} [evt=null]
	###
	start:(evt=null)=>
		viewID = null
		pathData = _router._parsePath(_router.getCurrentPath())
		routes = _router._checkRoutes(pathData.path)[0]
		if routes.length > 0
			current = routes[0].route
			viewID =  @getViewByRoute(current)
		else
			viewID = null
		
		if app.languages
			languages = app.languages
			if languages.default && viewID
				parts = @routeData.raw.split('/')
				if !languages.hasLanguage(parts[0], 'sufix')
					if app.config.views[viewID].route
						route = app.config.views[viewID].route
					else
						route = '/'
					@replaceRoute(route)

		_controller.start(viewID)
		false
	
	###*
	Returns the visible views in DOM
	@property visibleViews
	@type {Array}
	@readOnly
	###
	@get visibleViews:->
		return @_visibleViews || _controller.visibleViews

	###*
	Returns the current view
	@property currentView
	@type {BaseView}
	@readOnly
	###
	@get currentView:->
		return @_currentView || _controller.currentView

	###*
	Returns the previous view
	@property previousView
	@type {BaseView}
	@readOnly
	###
	@get previousView:->
		return @_previousView || _controller.previousView

	###*
	Returns the route data
	@property routeData
	@type {Object}
	@readOnly
	###
	@get routeData:()->
		pathData = _router._parsePath(_router.getCurrentPath())
		routeData =  _router._checkRoutes(pathData.path)
		# console.log _router._checkRoutes(pathData.path)
		results = {}
		if routeData?
			results['raw'] = pathData.rawPath
			results['params'] = pathData.params
			if app.languages
				results['language-iso'] = app.languages.current.iso
				results['language-sufix'] = app.languages.current.sufix
			results['route'] = routeData[0]?[0]?.route
			results['parsed'] = routeData[1]
		return results

	###*
	Returns the instance of router controller
	@property router
	@type {NavigationRouter}
	@readOnly
	###
	@get router:()->
		return _router
	
	###*
	Returns the instance of navigation controller
	@property navigation
	@type {BaseNavigationController}
	@readOnly
	###
	@get controller:()->
		return _controller
	
	###*
	@method goto
	@param {String|Object} p_value
	@deprecated Uses the {{#crossLink "Navigation/gotoRoute:method"}}{{/crossLink}} or {{#crossLink "Navigation/gotoView:method"}}{{/crossLink}}
	###
	goto:(p_value, p_trigger=false)=>
		throw new Error('This method is already deprecated.')
		false

	###*
	@method setRoute
	@param {String} p_value
	@param {Boolean} [p_trigger=false]
	###
	setRoute:(p_value, p_trigger=false)=>
		@gotoRoute(p_value, p_trigger)
		false

	###*
	@method gotoRoute
	@param {String} p_value
	@param {Boolean} [p_trigger=false]
	###
	gotoRoute:(p_value, p_trigger=false)=>
		return if !p_value?
		if p_value.indexOf('/') == 0
			if app.languages
				_router.goto('/'+app.languages.current.sufix+p_value, p_trigger)
			else
				_router.goto(p_value, p_trigger)
		else
			throw new Error('The value "'+p_value+'" is not a valid format to route ("/example")')
		false

	###*
	@method replaceRoute
	@param {String} p_value
	@param {Boolean} [p_trigger=false]
	###
	replaceRoute:(p_value, p_trigger=false)=>
		return if !p_value?
		if p_value.indexOf('/') == 0
			if app.languages
				_router.replace('/'+app.languages.current.sufix+p_value, p_trigger)
			else
				_router.replace(p_value, p_trigger)
		else
			throw new Error('The value "'+p_value+'" is not a valid format to route ("/example")')
		false
	
	###*
	@method gotoDefault
	###
	gotoDefault:(p_trigger=false, p_replace=null)=>
		if app.config.navigation?.defaultView?
			view = app.config.navigation.defaultView
			if app.config.views[view].route
				@gotoRoute(@getRouteByView(view), p_trigger)
			else
				@gotoView(view, p_replace, p_trigger)
		false

	###*
	@method gotoView
	@param {String} p_value
	###
	gotoView:(p_value, p_replace=null, p_trigger=false)=>
		if p_value.indexOf('/') == 0
			throw new Error('The value "'+p_value+'" is not a valid format to viewID ("areaID")')
		else
			_controller.goto(p_value)
			if p_replace?
				@replaceRoute(p_replace, p_trigger)
		false

	###*
	@method getViewByRoute
	@param {String} p_value
	@return {String}
	@default null
	###
	getViewByRoute:(p_value)=>
		for k, view of app.config.views
			if view.route? && view.route is p_value
				return view.id
		return null

	###*
	@method getRouteByView
	@param {String} p_value
	@return {String}
	@default null
	###
	getRouteByView:(p_value)=>
		for k, view of app.config.views
			if view.route? && view.id is p_value
				return view.route
		return null

	###*
	@method _changeView
	@param {Event} [evt=null]
	@private
	###
	_changeView:(evt=null)=>
		@_currentView = evt.data.currentView
		@_previousView = evt.data.previousView
		@_visibleViews = evt.data.visibleViews
		@_currentView.routeData = @routeData
		
		@trigger(Navigation.CHANGE_VIEW, {data:evt.data})
		false

	###*
	@method _changeRoute
	@param {Event} [evt=null]
	@private
	###
	_changeRoute:(evt=null)=>
		data = @routeData
		if data.route? then @gotoView(@getViewByRoute(data.route))
		@trigger(Navigation.CHANGE_ROUTE, {data:data})
		false


	###*
	@method _change
	@param {Event} [evt=null]
	@private
	###
	_change:(evt=null)=>
		# TODO: @setRoute(@getRouteByView(@_currentView.id))
		switch evt.type
			when BaseNavigationController.CHANGE
				@trigger(Navigation.CHANGE_INTERNAL_VIEW, {view:evt.view, transition:evt.transition})
			
			when NavigationRouter.CHANGE
				@trigger(Navigation.CHANGE, {data:@routeData})
		false
