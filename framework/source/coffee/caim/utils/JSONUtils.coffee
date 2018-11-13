###*
@class JSONUtils
@static
@submodule caim.utils
###
class JSONUtils

	###*
	@method parseJSON
	@static
	@param {JSON|Object} json
	@return {JSON}
	###
	@parseJSON:(json)=>
		stringfied = false
		if typeof(json) == 'string'
			stringfied = true
			json = @replaceMultiline(json)
		json = @removeComments(json)
		if stringfied
			json = JSON.parse(json)
		return json

	###*
	@method replaceMultiline
	@static
	@param {JSON|Object} json
	@return {JSON}
	###
	@replaceMultiline:(json)->
		if typeof(json) != 'string'
			return json
		json = json.replace(/^(\s*.*?""")(?:[\s\t]*\n)?([\t\s]*)(\S[\s\S]*)\n?[\s]*(""")/igm, @_replaceMultilinePart)
		json = json.replace(/^(\s*.*?)"""([\s\S]*?)"""/igm, @_replaceEmptyMultiline)
		return json

	###*
	@method _replaceMultilinePart
	@static
	@private
	@param {String} match
	@param {String} prefix
	@param {String} spaces
	@param {String} value
	@param {String} suffix
	@return {String}
	###
	@_replaceMultilinePart:(match, prefix, spaces, value, suffix)->
		re = new RegExp(spaces + '?([^\n]*)', 'g')
		value = value.replace(re, '$1')
		return prefix + value + suffix
	###*
	@method _replaceEmptyMultiline
	@static
	@private
	@param {String} match
	@param {String} prefix
	@param {String} value
	@return {String}
	###
	@_replaceEmptyMultiline:(match, prefix, value)->
		value = value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
		return prefix + '"' + value + '"'

	###*
	@method removeComments
	@static
	@param {JSON|Object} json
	@return {JSON}
	###
	@removeComments:(json)->
		stringfied = true
		if typeof(json) != 'string'
			stringfied = false
			json = JSON.stringify(json)
		json = json.replace(/(^|\s)(\/\/.*$)|(\/\*(.|\s)*?\*\/?)/igm, '')

		if stringfied
			return json
		else
			return JSON.parse(json)

	###*
	@method filterObject
	@static
	@param {JSON|Object|Array} data
	@param {String} name
	@param {String} [type = null] The typeof of object
	@param {Boolean} [ignore = null]
	@param {Boolean} [getParent = false]
	@param {Array} [p_currentPath = []]
	@return {JSON|Object|Array}
	###
	@filterObject:(data, name, type = null, ignore = null, getParent = false, p_currentPath = [])->
		resp = []
		name = [].concat(name)

		if ignore
			ignore = [].concat(ignore)
		for k, v of data
			objectPath = [].concat(p_currentPath, k)
			if ignore
				if ignore.indexOf(k) >= 0
					continue
			if name.indexOf(k) >= 0
				add = true
				if type
					if typeof(v) != type
						add = false
				if add
					if getParent
						if resp.indexOf(data) < 0
							data.___path = objectPath.splice(0, objectPath.length - 1)
							resp.push(data)
					else
						v.___path = objectPath
						resp.push(v)
			if typeof(v) == 'array' || typeof(v) == 'object'
				resp = [].concat(resp, @filterObject(v, name, type, ignore, getParent, objectPath))
		return resp
