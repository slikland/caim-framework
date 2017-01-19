class ObjectUtils

	# Public: Return the length of a {Object} item.
	#
	# item - The {Object} object to count.
	#
	# Returns
	#     The resulting {Number} object.
	@count:(p_item)->
		result = 0
		for key of p_item
			result++
			# key = null
		return result

	# Public: Return a {Array} of a {Object} item.
	#
	# source -  The {Object} object.
	#
	# Returns
	#   The resulting {Array}.
	@toArray:(p_source)->
		result = []
		result.push(p_source[k]) for k,v of p_source
		return result

	@merge:(a, b, debug = false)->
		if isPlainObject(a) && isPlainObject(b)
			for k of b
				if !a.hasOwnProperty(k)
					a[k] = ObjectUtils.clone(b[k])
				else
					a[k] = ObjectUtils.merge(a[k], b[k])
		return a

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

	@hasSameKey:(p_a, p_b)->
		return if Object.getOwnPropertyNames(p_a)[0] == Object.getOwnPropertyNames(p_b)[0] then true else false

	@isEqual:(p_a, p_b)->
		return JSON.stringify(p_a) == JSON.stringify(p_b)

	# Public: Return a mapped {Array} of a {Array} item.
	#
	# source -  The {Array} object.
	#
	# Returns
	#   The resulting {Array}.
	#
	# Example
	#	ObjectUtils.parseLinkedArray([['id', 'name'], [0, 'name1'], [1, 'name2']])
	#	// [{id: 0, 'name': 'name1'}, {id: 1, 'name': 'name2'}]
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

	@getClassName:(p_source)->
		if typeof p_source is 'undefined'
			return 'undefined'
		if p_source is null
			return 'null'
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

# Feature: isPlainObject
`!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.isPlainObject=e()}}(function(){return function e(t,r,n){function o(f,u){if(!r[f]){if(!t[f]){var c="function"==typeof require&&require;if(!u&&c)return c(f,!0);if(i)return i(f,!0);var p=new Error("Cannot find module '"+f+"'");throw p.code="MODULE_NOT_FOUND",p}var s=r[f]={exports:{}};t[f][0].call(s.exports,function(e){var r=t[f][1][e];return o(r?r:e)},s,s.exports,e,t,r,n)}return r[f].exports}for(var i="function"==typeof require&&require,f=0;f<n.length;f++)o(n[f]);return o}({1:[function(e,t,r){"use strict";function n(e){return o(e)===!0&&"[object Object]"===Object.prototype.toString.call(e)}var o=e("isobject");t.exports=function(e){var t,r;return n(e)===!1?!1:(t=e.constructor,"function"!=typeof t?!1:(r=t.prototype,n(r)===!1?!1:r.hasOwnProperty("isPrototypeOf")===!1?!1:!0))}},{isobject:2}],2:[function(e,t,r){"use strict";t.exports=function(e){return null!=e&&"object"==typeof e&&!Array.isArray(e)}},{}]},{},[1])(1)});`
