###*
Detections Class
@class Detections
@extends Class
###
class Detections
	matches: [
		{name: 'Opera', nick: /opera/i, test: /opera|opr/i, version: /(?:opera|opr)[\s\/](\d+(\.\d+)*)/i},
		{name: 'Windows Phone', nick: /WindowsPhone/i, test: /windows phone/i, version: /iemobile\/(\d+(\.\d+)*)/i},
		{name: 'Edge', nick: /edge|edgehtml/i, test: /edge|msapphost|edgehtml/i, version: /(?:edge|edgehtml)\/(\d+(\.\d+)*)/i},
		{name: 'Internet Explorer', nick: /explorer|internetexplorer|ie/i, test: /msie|trident/i, version: /(?:msie |rv:)(\d+(\.\d+)*)/i},
		{name: 'Chrome', nick: /Chrome/i, test: /chrome|crios|crmo/i, version: /(?:chrome|crios|crmo)\/(\d+(\.\d+)*)/i},
		{name: 'iPod', nick: /iPod/i, test: /ipod/i},
		{name: 'iPhone', nick: /iPhone/i, test: /iphone/i},
		{name: 'iPad', nick: /iPad/i, test: /ipad/i},
		{name: 'FirefoxOS', nick: /FirefoxOS|ffos/i, test: /\((mobile|tablet);[^\)]*rv:[\d\.]+\)firefox|iceweasel/i, version: /(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i},
		{name: 'Firefox', nick: /Firefox|ff/i, test: /firefox|iceweasel/i, version: /(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i},
		{name: 'Android', nick: /Android/i, test: /android/i},
		{name: 'BlackBerry', nick: /BlackBerry/i, test: /(blackberry)|(\bbb)|(rim\stablet)\d+/i, version: /blackberry[\d]+\/(\d+(\.\d+)?)/i},
		{name: 'WebOS', nick: /WebOS/i, test: /(web|hpw)os/i, version: /w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i},
		{name: 'Safari', nick: /safari/i, test: /safari/i},
	]

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->
		@matched = null
		@ua = navigator?.userAgent || ''
		@platform = navigator?.platform || ''
		@version = getFirstMatch(/version\/(\d+(\.\d+)*)/i, @ua)
		@vibrate = (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate)
		@standalone = window?.navigator.standalone || window?.matchMedia('(display-mode: standalone)').matches
		@retina = @testRetinaDisplay()
		
		@getBrowser()
		@versionArr = if !@version? then [] else @version.split('.')
		for k, v of @versionArr
			@versionArr[k] = Number(v)
		
		@touch = Boolean('ontouchstart' of window) || Boolean(navigator.maxTouchPoints > 0) || Boolean(navigator.msMaxTouchPoints > 0)
		@tablet = /(ipad.*|tablet(?!\s+pc).*|(android.*?chrome((?!mobi).)*))$/i.test(@ua)
		@mobile = !@tablet && Boolean(getFirstMatch(/(ipod|iphone|ipad)/i, @ua) || /[^-]mobi/i.test(@ua))
		@desktop = !@mobile && !@tablet

		@os = getOS()
		@cache = @serviceWorker = ('serviceWorker' of navigator)
		@canvas = testCanvas()
		@webgl = testWebGL()

		versionToCheck = 10
		validVersion = false
		if @version
			validVersion = @versionArr[0] >= versionToCheck
		else
			if o = /\(iP(?:hone|ad|od).*? OS (\d+)_(\d+)/i.exec(@ua)
				validVersion = Number(o[1]) >= versionToCheck
		@iosInlineVideo = (@os == "ios" && validVersion)

	@get orientation:->
		ratio = screen.width/screen.height
		if window.innerWidth > window.innerHeight and ratio > 1.3 then 'landscape' else 'portrait'
		
	test:(value)->
		if !@matched
			return 0
		
		if !(m = value.match(/(?:(?:(\D.*?)(?:\s|$))?(\D.*?)(?:\s|$))?(?:([\d\.]+))?/))
			return 0
		result = 0
		if m[1]
			if new RegExp(m[1], 'i').test(@os)
				result = 1
			else
				return 0
		if m[2]
			if @matched.nick?.test(m[2])
				result = 1
			else
				return 0
		if m[3]
			v = m[3].split('.')
			l = v.length
			if l > @versionArr.length
				l = @versionArr.length
			for i in [0..l]
				if @versionArr[i] > v[i]
					return 2
				else if @versionArr[i] < v[i]
					return -1
		return result

	getFirstMatch=(re, val)->
		m = val.match(re)
		return (m && m.length > 1 && m[1]) || null

	getBrowser:()->
		for m in @matches
			if m.test.test(@ua)
				@name = m.name
				@version = @version || getFirstMatch(m.version, @ua)
				@matched = m
				break
		return [@name, @version]
		
	getOS=()->
		result = undefined
		
		switch navigator?.platform.toLowerCase()
			when 'iphone', 'ipod', 'ipad', 'iphone simulator', 'ipod simulator', 'ipad simulator', 'Pike v7.6 release 92', 'Pike v7.8 release 517'
				result = 'ios'
			when 'macintosh', 'macintel', 'macppc', 'mac68k'
				result = 'osx'
			when 'android'
				result = 'android'
			when 'os/2', 'wince', 'pocket pc', 'windows'
				result = 'windows'
			when 'blackberry'
				result = 'blackberry'

		if (/linux armv+(\d{1}l)/i.test(navigator?.platform))
			result = 'android'
		else if (/linux+\s?.*?$/im.test(navigator?.platform))
			result = 'linux'
		else if (/win\d{2}/i.test(navigator?.platform))
			result = 'windows'
		return result

	testRetinaDisplay:()=>
		if window?.matchMedia
			mq = window.matchMedia('only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)')
			return mq and mq.matches or window?.devicePixelRatio > 1
		return false

	testWebGL=()->
		try
			return !!window.WebGLRenderingContext && Boolean(document.createElement("canvas").getContext('webgl')) || Boolean(document.createElement("canvas").getContext('experimental-webgl'))
		catch err
			return false

	testCanvas=()->
		try
			return !!window.CanvasRenderingContext2D && Boolean(document.createElement("canvas").getContext('2d'))
		catch err
			return false
