#import slikland.display.ui.BaseComponent
#import slikland.utils.URLUtils
#import slikland.utils.ObjectUtils

class Button extends BaseComponent

	@const BUTTON_CLICK: 			'button-click'
	@const BUTTON_OVER: 			'button-over'
	@const BUTTON_OUT: 				'button-out'
	@const BUTTON_DOWN: 			'button-down'
	@const BUTTON_UP: 				'button-up'

	@const BASE_CLASSNAME: 		'button'

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			className: @BASE_CLASSNAME
			element: 'a'
			label: null
			labelClassName: 'label'
			selected: false
			attrs: {
				href: null
				target: null
			}
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		super p_options

		#params
		@_selected = @_options.selected
		@create()

	# Getters and Setters
	#------------------------------------

	@get text:()->
		return @_options.label

	@set text:(p_value)->
		@option('label', p_value)

	@get label:()->
		return @_label

	@get href:()->
		return @_options.attrs?.href

	@set href:(p_value = null)->
		@option('attrs', { href: p_value })

	@get target:()->
		return @_options.attrs?.target

	@set target:(p_value = null)->
		@option('attrs', { target: p_value })

	@get selected:()->
		return @_options.selected

	# Public
	#------------------------------------
	componentLayout:()->
		@element.on 'click', @click
		if !app.detections.touch
			@element.on 'mouseenter', @over
			@element.on 'mouseleave', @out
			@element.on 'mousedown', @down
			@element.on 'mouseup', @up
		@_layoutButton()

	_layoutButton:()->
		@_label = new BaseDOM
			element: 'span'
			className: "#{@_options.labelClassName.trim()}"

	_invalidate:()->
		_href = @_options.attrs?.href
		# Adds href and checks url strategy
		if _href?
			if _href.indexOf('@') is 0
				_targetView = _href.substr(1)
				_viewConfig = app.config.views[_targetView]
				if _viewConfig?.dialog
					_href = "?#{_viewConfig.route}"
				else
					_href = _viewConfig?.route || "#{_targetView}"
			if _href.indexOf('://') is -1 && _href.indexOf('{root}') is -1
				if _href.indexOf('/') is 0
					_href = _href.substr(1)
				_href = '{root}' + _href
			_href = _href.replace('{root}', app.root)
			@_options.attrs?.href = _href

		super

		@_selected = @_options.selected

		@_invalidateLayout()

	_invalidateLayout:()->
		# Adds Label
		@_label.html = @_options.label

		if @_options.label?
			@appendChild @_label if !@_label?.isAttached
		else if @_label.isAttached
			@removeChild @_label

	click:(e = {})=>
		if @_selected
			e.preventDefault?()
			return

		#trigger event
		@trigger Button.BUTTON_CLICK, e

		#default action
		link = @element.getAttribute('href')
		target = @element.getAttribute('target')

		if link? and !e.metaKey and target != '_blank' and target != '_self' and URLUtils.sameHost(link, app.root) and !e.defaultPrevented
			e.preventDefault?()

			route = link?.replace(app.root, '')
			return if !app.navigation.routeData

			routeData = app.navigation.routeData
			targetParams = URLUtils.parseParams(route.replace(/(.*\?)?/gi, ''))
			mergeParams = ObjectUtils.merge(targetParams, routeData.params)
			for k,v of mergeParams
				if v is ''
					delete mergeParams[k]

			if route[0] is '?'
				route = routeData.raw.replace(/\/?\?.*/gi, '') + route

			r = ''
			for k,v of mergeParams
				r += k + '=' + v + '&'
			if r isnt ''
				r = '?' + r
			else
				route = route.replace(/\?.*/gi, '')

			app.navigation.setRoute('/' + route + r, true)

	over:(e)=>
		@trigger Button.BUTTON_OVER

	out:(e)=>
		@trigger Button.BUTTON_OUT

	down:(e)=>
		@trigger Button.BUTTON_DOWN

	up:(e)=>
		@trigger Button.BUTTON_UP

	select:()->
		@over()
		@option('selected', true)

	deselect:()->
		@option('selected', false)
		@out()

	destroy:()->
		@option('selected', false)
		@element.off 'click', @click
		@element.off 'mouseenter', @over
		@element.off 'mouseleave', @out
		@element.off 'mousedown', @down
		@element.off 'mouseup', @up
		@_label?.destroy()
		super


