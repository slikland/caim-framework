#import caim.event.EventDispatcher

class PathsData extends EventDispatcher
	
	_data = null

	@getInstance:(p_value)=>
		@_instance ?= new @(p_value)
	
	constructor:(p_value)->
		@data ?= p_value
		super

	@get data:()->
		return _data

	@set data:(p_value)->
		_data = @_parseData(p_value)

	###*
	@method translate
	@param {Object} p_source
	@return {String}
	###
	translate:(p_source)=>
		return @_parseVars(p_source)
	
	###*
	@static
	@method translate
	@param {Object} p_value
	@param {Object} p_collection
	@return {String}
	###
	@translate:(p_value, p_collection)=>
		return @_parseVars(p_value, @_parseData(p_collection))
	
	###*
	@method _parseData
	@param {Object} p_vars
	@return {Object}
	@private
	###
	_parseData:(p_vars)=>
		if window.paths?
			for k, v of window.paths
				p_vars[k] = v
		p_varsStr = JSON.stringify(p_vars)
		while (o = /\{([^\"\{\}]+)\}/.exec(p_varsStr))
			val = p_vars[o[1]]
			if !val then val = ''
			p_varsStr = p_varsStr.replace(new RegExp('\{'+o[1]+'\}', 'ig'), val)
			p_vars = JSON.parse(p_varsStr)
		return p_vars

	###*
	@method _parseVars
	@param {Object} p_data
	@param {Object} p_vars
	@return {String}
	@private
	###
	_parseVars:(p_vars)=>
		for k, v of _data
			p_vars = JSON.stringify(p_vars)
			p_vars = p_vars.replace(new RegExp('\{'+k+'\}', 'ig'), v)
			p_vars = JSON.parse(p_vars)
		return p_vars
	
