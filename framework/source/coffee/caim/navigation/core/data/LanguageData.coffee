#import caim.event.EventDispatcher
#import caim.navigation.core.data.PathsData

class LanguageData extends EventDispatcher
	
	_data = null
	_current = undefined
	_default = undefined

	@getInstance:(p_data)=>
		@_instance ?= new @(p_data)
	
	constructor:(p_data)->
		@data = p_data
		super

	gotoLanguage:(p_iso)->
		parsedRoute = app.navigation.routeData.route.replace(/\{(.*?)\}/g, @_replaceRoute)
		window.location = app.root + @getLanguage(p_iso).sufix + parsedRoute

	_replaceRoute:(match0, match1)=>
		return app.navigation.routeData.parsed?[match1] || ''

	hasLanguage:(p_value, p_filter='iso')->
		result = false
		if typeof(p_value) == 'string' && typeof(p_filter) == 'string'
			for i in [0...@data.length]
				if @data[i][p_filter] == p_value
					result = true
					break
		return result

	getLanguage:(p_value)->
		result = null
		if typeof(p_value) == 'string'
			for i in [0...@data.length]
				if @data[i].iso == p_value
					result = @data[i]
					break
				else if @data[i].sufix == p_value
					result = @data[i]
					break
		return result

	@get data:(p_value)->
		return _data

	@set data:(p_value)->
		_data = p_value
		for k, v of p_value
			# ref: https://en.wikipedia.org/wiki/Language_localisation
			if !v.iso || v.iso && v.iso == "" then throw new Error('Please sets the "iso" object (ISO 639-1 standard) in languages object of config file.')
			if !v.sufix || v.sufix && v.sufix == "" then throw new Error('Please sets the "sufix" object in languages object of config file.')
			if !v['data-path'] || v['data-path'] && v['data-path'] == "" then throw new Error('Please sets the "data-path" object in languages object of config file.')
			if v.default? then @default = v
		if !@default
			p_value?[0].default = true
			@default = p_value?[0]
		false

	@get current:()->
		return _current

	@set current:(p_value)->
		if typeof(p_value) == 'string'
			for i in [0...@data.length]
				if @data[i].iso == p_value
					_current = @data[i]
					break
				else if @data[i].sufix == p_value
					_current = @data[i]
					break
			if !_current then throw new Error('The value '+p_value+' isnt a valid "iso" or "sufix".')
		false

	@get default:()->
		return _default
	
	@set default:(p_value)->
		_default = p_value
