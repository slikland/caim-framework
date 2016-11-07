#import slikland.data.BaseStorage

class LocalStorage extends BaseStorage

	constructor:()->
		@source = window?.localStorage
		throw new Error('Storage:: window.localStorage not available') if !@source?

	@isEnable:()->
		try
			_instance = new LocalStorage()
			_key = '__test'
			_instance.set(_key, '1')
			_value = _instance.get(_key)
			_instance.remove(_key)
			return _value is '1'
		catch e
			return false

	get:(p_key)->
		return null if !p_key?
		return @source?.getItem(p_key)

	set:(p_key, p_value)->
		return false if !p_key?
		@source?.setItem(p_key, p_value)
		return true

	remove:(p_key, p_path, p_domain)->
		return false if !this.has(p_key)
		@source?.removeItem(p_key)
		return true

	has:(p_key)->
		return false if !@get(p_key)?
		return true

	keys:()->
		keys = []
		_len = localStorage.length
		_index = 0
		while _index++ < _len
			keys.push @source?.key(_index)
		return keys
