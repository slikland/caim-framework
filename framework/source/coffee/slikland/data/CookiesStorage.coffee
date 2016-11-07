#import slikland.data.BaseStorage

class CookiesStorage extends BaseStorage

	constructor:()->
		@source = document.cookie

	@isEnable:()->
		try
			if navigator?.cookieEnabled?
				return navigator.cookieEnabled
			_instance = new CookiesStorage()
			_key = '__test'
			_instance.set(_key, '1')
			_value = _instance.get(_key)
			_instance.remove(_key)
			return _value is '1'
		catch e
			return false

	get:(p_key)->
		return null if !p_key?
		return decodeURIComponent(@source.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(p_key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null

	set:(p_key, p_value, p_end, p_path, p_domain, p_secure)->
		return false if !p_key? || /^(?:expires|max\-age|path|domain|secure)$/i.test(p_key)
		expires = ""
		if p_end
			switch p_end.constructor
				when Number
					expires = if p_end == Infinity then "; expires=Fri, 31 Dec 9999 23:59:59 GMT" else "; max-age=" + p_end
					break
				when String
					expires = "; expires=" + p_end
					break
				when Date
					expires = "; expires=" + p_end.toUTCString()
					break

		@source = document.cookie = encodeURIComponent(p_key) + "=" + encodeURIComponent(p_value) + expires + (if p_domain then "; domain=" + p_domain else "") + (if p_path then "; path=" + p_path else "") + (if p_secure then "; secure" else "")
		return true

	remove:(p_key, p_path, p_domain)->
		return false if !this.has(p_key)
		@source = document.cookie = encodeURIComponent(p_key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (if p_domain then "; domain=" + p_domain else "") + (if p_path then "; path=" + p_path else "")
		return true

	has:(p_key)->
		return false if !p_key?
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(p_key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(@source)

	keys:()->
		keys = @source.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/)
		keys[idx] = decodeURIComponent(keys[idx]) for v,idx in keys
		return keys
