#Abstract Storage

class BaseStorage

	constructor:()->
		@source = {}

	@isEnable:()->
		return true

	get:(p_key)->
		return null if !key?
		return @source[key]

	set:(p_key, p_value)->
		return false if !p_key?
		@source[p_key] = p_value

	remove:(p_key)->
		return false if !this.has(p_key)
		@source[p_key] = null
		delete @source[p_key]
		return true

	has:(p_key)->
		return false if !p_key?
		return true if !!@source[p_key]

	keys:()->
		keys = []
		for k, value of @source
			keys.push k
		return keys
