#import caim.event.EventDispatcher

#import caim.utils.ObjectUtils

class ParseData extends EventDispatcher
	
	_conditions = null
	
	constructor:(p_data)->
		@_data = p_data
		_conditions ?= ConditionsValidation.getInstance(@_data.conditions)
		super

	@get data:()->
		return @_data

	@set data:(p_value)->
		@_data = p_value
		
	###*
	@method getPath
	@param {Object} p_obj
	@return {String}
	@static
	###
	@getPath:(p_obj)->
		if !p_obj? then throw new Error('The param p_obj cannot be null')
		if typeof(p_obj) == 'object'
			clone = ObjectUtils.clone(p_obj)
			for i in [0...clone.length]
				# console.log  "<<< ", clone[i].condition
				if clone[i].condition?
					if _conditions?.test?(clone[i].condition)
						if clone[i].file?
							return clone[i].file
						break
					else
						# return null
						# break
						continue
				else
					if clone[i].file?
						return clone[i].file
						break
		return p_obj
		
	###*
	@method getProperties
	@param {Object} p_obj
	@return {String}
	@static
	###
	@getProperties:(p_obj)->
		if !p_obj? then throw new Error('The param p_obj cannot be null')
		result = {}
		if typeof(p_obj) == 'object'
			clone = ObjectUtils.clone(p_obj)
			foundItem = null
			for i in [0...clone.length]
				if clone[i].condition?
					if _conditions?.test?(clone[i].condition)
						foundItem = clone[i]
				else if !foundItem
					foundItem = clone[i]
		for prop, value of foundItem
			if prop != 'condition' && prop != 'file'
				result[prop] = value

		return result

	###*
	@method getProperties
	@param {Object} p_obj
	@return {String}
	@protected
	###
	getProperties:(p_obj)->
		return ParseData.getProperties(p_obj)

	###*
	@method getPath
	@param {Object} p_obj
	@return {String}
	@protected
	###
	getPath:(p_obj)->
		return ParseData.getPath(p_obj)
