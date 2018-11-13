###*
@class CookiesManager
@extends EventDispatcher
@submodule caim.data
###
class CookiesManager

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->


	lsValidate:()->
		if localStorage
			return true
		
		return false

	set:(id, value)=>
		if @lsValidate then lsSupport = true
		try
			if typeof value != 'undefined' and value != null
				if typeof value == 'object'
					value = JSON.stringify(value)
				if lsSupport
					localStorage.setItem(id, value)
				else
					@_createCookie(id, value, 30)
		catch e
			false

	get:(id)=>
		if @lsValidate then lsSupport = true

		try
			if typeof value == 'undefined'
				if lsSupport
					data = localStorage.getItem(id)
				else
					data = @_readCookie(id)
			
				data = JSON.parse(data)
		catch e
			data = data

		return data

	remove:(id)=>
		if @lsValidate then lsSupport = true
		if lsSupport
			localStorage.removeItem(id)
		else
			@_createCookie(id, '', -1)

	_createCookie:(id, value, exp)=>
		date = new Date()
		date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000))
		expires = '; expires=' + date.toGMTString();
		document.cookie = id + '=' + value + expires + '; path=/'

	_readCookie:(id)=>
		name = id + '='
		ca = document.cookie.split(';')
		i = 0
		max = ca.length
		while i < max
			c = ca[i]
			while c.charAt(0) == ' '
				c = c.substring(1, c.length)
			if c.indexOf(name) == 0
				return c.substring(name.length, c.length)
			i++
		return null
