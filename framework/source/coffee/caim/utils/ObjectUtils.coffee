###*
@class ObjectUtils
@static
@submodule caim.utils
###
class ObjectUtils

	###*
	Return the length of a item.
	@method count
	@static
	@param {Object} p_item object to count.
	@return {Number}
	###	
	@count:(p_item)->
		result = 0
		try
			result = Object.keys(p_item).length
		catch err
			for key of p_item
				result++
		return result

	###*
	Return a array of a object item.
	@method toArray
	@static
	@param {Object} p_source
	@return {Array}
	###	
	@toArray:(p_source)->
		result = []
		result.push(p_source[k]) for k,v of p_source
		return result

	###*
	Returns a new merged object.
	@method merge
	@static
	@param {Object} a The object to be used as reference A.
	@param {Object} b The object to be used as reference B.
	@return {Object} Returns a new merged object.
	###
	@merge:(a, b)->
		if Object.isObject(a) && Object.isObject(b)
			for k of b
				if !a.hasOwnProperty(k)
					if Object.isObject(b[k])
						a[k] = ObjectUtils.clone(b[k])
					else
						a[k] = b[k]
				else
					a[k] = ObjectUtils.merge(a[k], b[k])
		return a

	###*
	Returns a new cloned object.
	@method clone
	@static
	@param {Object} p_target The object to be cloned.
	@return {Object} Returns a new cloned object.
	###
	@clone:(p_target)->
		try
			if !p_target or typeof p_target isnt 'object'
				return p_target

			copy = null
			if p_target instanceof Array
				copy = []
				i = 0
				len = p_target.length
				while i < len
					copy[i] = @clone(p_target[i])
					i++
				return copy

			if p_target instanceof Object
				copy = {}
				for k, v of p_target
					if v isnt 'object'
						copy[k] = v
					else
						copy[k] = @clone(v)
				return copy

		catch err
			return JSON.parse(JSON.stringify(p_target))

	###*
	Replace the value of a object
	@method replaceValue
	@static
	@param {Object} p_obj
	@param {Object} p_value
	@param {Object} p_newvalue
	@param {Boolean} [p_clone=true]
	@return {Object} Returns the object with a new value.
	###
	@replaceValue:(p_obj, p_value, p_newvalue, p_clone=true)->
		resp = []
		# p_obj = if p_clone then ObjectUtils.clone(p_obj) else p_obj
		for k, v of p_obj
			if v == p_value
				p_obj[k] = p_newvalue
				resp.push p_obj
			if typeof(v) == 'object'
				resp = [].concat resp, ObjectUtils.replaceValue(v, p_value, p_newvalue, p_clone)
		return resp
		
	###*
	@method hasSameKey
	@static
	@param {Object} p_a
	@param {Object} p_b
	@return {Boolean} 
	###
	@hasSameKey:(p_a, p_b)->
		return if Object.getOwnPropertyNames(p_a)[0] == Object.getOwnPropertyNames(p_b)[0] then true else false

	###*
	@method isEqual
	@static
	@param {Object} p_a
	@param {Object} p_b
	@return {Boolean} 
	###
	@isEqual:(p_a, p_b)->
		return JSON.stringify(p_a) == JSON.stringify(p_b)

	###*
	Return a mapped object of a array item.
	@method parseLinkedArray
	@static
	@param {Array} p_source The array object
	@return {Object} 
	@example
	```
	ObjectUtils.parseLinkedArray([['id', 'name'], [0, 'name1'], [1, 'name2']])
	Output://[{id: 0, 'name': 'name1'}, {id: 1, 'name': 'name2'}]

	```
	###
	@parseLinkedArray:(p_source)->
		if !p_source or (p_source and p_source.length < 1)
			return []
		i = p_source.length
		names = p_source[0]
		numNames = names.length
		ret = []
		while i-- > 1
			o = {}
			j = numNames
			item = p_source[i]
			while j-- > 0
				o[names[j]] = item[j]
			ret[i - 1] = o
		return ret
	
	###*
	@method getClassName
	@static
	@param {Object} p_source
	@return {String} 
	###
	@getClassName:(p_source)->
		if typeof p_source is 'undefined'
			return 'undefined'
		if p_source is null
			return 'null'
		if typeof p_source is 'function'
			return p_source.name || 'undefined'
		if p_source.constructor?
			if p_source.constructor.name?
				return p_source.constructor.name
			else
				description = p_source.constructor.toString()
				if description[0] is '['
					matches = description.match(/\[\w+\s*(\w+)\]/)
				else
					matches = description.match(/function\s*(\w+)/)
				if matches? && matches.length is 2
					return matches[1]
		return 'undefined'
