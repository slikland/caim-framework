#import caim.utils.Prototypes
 
###*
@class URLUtils
@static
@submodule caim.utils
###
class URLUtils

	###*
	@method compare
	@static
	@param {String} a URL A
	@param {String} b URL B
	@param {String} [base=app?.root || ''] Base URL
	@return {Boolean}
	###	
	@compare:(a, b, base = app?.root || '')->
		base = base.replace(/^\/|\/$|https?:\/\//gi, '')
		regBase = new RegExp(base + '\/?')
		a = a.replace(regBase, '').replace(/https?:\/+|\([^)]*\)\?|^\/+|\/+$/gi, '')
		b = b.replace(regBase, '').replace(/https?:\/+|\([^)]*\)\?|^\/+|\/+$/gi, '')
		return a == b

	###*
	@method sameHost
	@static
	@param {String} a URL A
	@param {String} b URL B
	@return {Boolean}
	###	
	@sameHost:(a, b)->
		a = a.replace(/https?:\/\//gi, '')
		b = b.replace(/https?:\/\//gi, '')
		return b.indexOf(a) > -1 || a.indexOf(b) > -1

	###*
	@method removeQueryParameter
	@static
	@param {String} url
	@param {String} parameter
	@return {String} Cleanup URL
	###	
	@removeQueryParameter:(url, parameter)->
		#prefer to use l.search if you have a location/link object
		urlparts = url.split('?')
		if urlparts.length >= 2
			prefix = encodeURIComponent(parameter) + '='
			pars = urlparts[1].split(/[&;]/g)
			#reverse iteration as may be destructive
			i = pars.length
			while i-- > 0
				#idiom for string.startsWith
				if pars[i].lastIndexOf(prefix, 0) != -1
					pars.splice i, 1
			url = urlparts[0] + (if pars.length > 0 then '?' + pars.join('&') else '')
		else
			url
		return url

	###*
	@method parseParams
	@static
	@param {String} [p_path='']
	@return {Object} Parsed object of params
	###	
	@parseParams:(p_path = '')->
		return null if typeof p_path isnt 'string'
		params = {}
		if p_path
			pRE = /&?([^=&]+)=?([^=&]*)/g
			c = 0
			while o = pRE.exec(p_path)
				params[o[1]] = o[2]
		return params

	###*
	@method parseSerialize
	@static
	@param {Object} obj
	@param {String} prefix
	@return {String}
	###	
	@parseSerialize:(obj, prefix)->
		str = []
		for p of obj
			if obj.hasOwnProperty(p)
				k = if prefix then prefix + '[' + p + ']' else p
				v = obj[p]
				str.push if v != null and typeof v is 'object' then serialize(v, k) else encodeURIComponent(k) + '=' + encodeURIComponent(v)
		str.join '&'
		return str	
