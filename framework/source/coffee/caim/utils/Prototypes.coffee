## This is actually not a Class. It's a bunch of helper methods adding prototype methods to native classes.
##--------------------------------------
##	Getter / Setter
##	@example
##	class A
##		constructor:()->
##			@_a = 1
##		@get a:()->
##			return @_a
##		@set a:(value)->
##			return @_a = value
##--------------------------------------
# TODO: Fix/Add override
#
isIE = ->
	nav = navigator.userAgent.toLowerCase()
	return if (nav.indexOf('msie') != -1) then parseInt(nav.split('msie')[1]) else false

if isIE() == 8
	__scopeIE8 = document.createElement("IE8_" + Math.random())

###*
This method is a decorator to create constant variable to a class.
A extending class cannot override this constant either can't be reassigned.

* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.

@method @const
@example
	class A
		\@const PI: 3.14
	console.log(A.PI) // 3.14
	class B extends A
		\@const PI: 3.14159 // Will throw error
	console.log(B.PI) // Already thrown error before, but will be 3.14
###
Function::const = (p_prop) ->
	__scope = if __scopeIE8 then __scopeIE8 else @
	for name, value of p_prop
		o = {}
		o.get = () ->
			return value
		o.set = () ->
			throw new Error("Can't set const " + name)
		o.configurable = true
		o.enumerable = true
		Object.defineProperty __scope, name, o
	null

###*
EXPERIMENTAL
This method is a decorator to protect a property of a class instance removing the property name from enumerable list.

* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.

@method @protectProperties
@beta 
@example
	class A
		\@protectProperties ["_a", "_b"]
		constructor:()->
			\@_a = 1
	console.log(new A()) // Will not list _a either _b as enumerable
###
Function::protectProperties = (p_props) ->
	console.warn('@protectProperties is an experimental feature. Use with caution.')
	p_props = [].concat(p_props)
	@::['___'] ?= {}
	__scope = if __scopeIE8 then __scopeIE8 else @::
	for name in p_props
		o = {}
		o['get'] = ()->
			return @___[name]
		o['set'] = (value)->
			@___[name] = value
		o.enumerable = false
		# o.writable = false
		Object.defineProperty __scope, name, o
	null


###*
Getter decorator for a class instance.
With this decorator you're able to assign a getter method to a variable.

Also for a special case, you can assign a scope to the getter so you can create static getter to a class.

* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.

@method @get
@example

	// Instance getter
	class A
		\@get test:()->
			return 'Hello world!'
	a = new A()
	console.log(a.test) // Hello world!

	// Static getter
	class A
		\@get \@, TEST:()->
			return 'Hello world!'
	console.log(A.TEST) // Hello world!
###
Function::get = (scope, p_prop) ->
	enumerable = false
	if !p_prop
		p_prop = scope
		__scope = if __scopeIE8 then __scopeIE8 else @::
	else
		enumerable = true
		if scope is 'static'
			scope = @
		__scope = scope
	for name, getter of p_prop
		Object.defineProperty __scope, name, get: getter, configurable: true, enumerable: enumerable
	null

###*
Setter decorator for a class instance.
With this decorator you're able to assign a setter method to a variable.

Also for a special case, you can assign a scope to the setter so you can create static setter to a class.

* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.

@method @set
@example

	// Instance getter / stter
	class A
		\@get test:()->
			return \@_test
		\@set test:(value)->
			\@_test = value
	a = new A()
	a.test = 'Hello setter'
	console.log(a.test) // Hello setter

	// Static getter / setter
	class A
		\@get \@, TEST:()->
			return @_TEST
		\@set \@, TEST:(value)->
			\@_TEST = value
	A.TEST = 'Hello setter'
	console.log(A.TEST) // Hello setter
###

Function::set = (scope, p_prop) ->
	enumerable = false
	if !p_prop
		p_prop = scope
		__scope = if __scopeIE8 then __scopeIE8 else @::
	else
		enumerable = true
		if scope is 'static'
			scope = @
		__scope = scope
	for name, setter of p_prop
		Object.defineProperty __scope, name, set: setter, configurable: true, enumerable: enumerable
	null

##------------------------------------------------------------------------------
##
##	FUNCTION PROTOTYPE
##
##------------------------------------------------------------------------------
#
# Add ECMA262-5 method binding if not supported natively
#

window.isCallable = Function.isCallable = (fn) ->
	typeof fn == 'function' or Object::toString.call(fn) == '[object Function]'

unless "bind" of Function::
	Function::bind = (owner) ->
		that = this
		if arguments_.length <= 1
			->
				that.apply owner, arguments_
		else
			args = Array::slice.call(arguments_, 1)
			->
				that.apply owner, (if arguments_.length is 0 then args else args.concat(Array::slice.call(arguments_)))


Number.MaxSafeInteger = 2 ** 53 - 1
Number.toInteger = (value) ->
	number = Number(value)
	if isNaN(number)
		return 0
	if number == 0 or !isFinite(number)
		return number
	(if number > 0 then 1 else -1) * Math.floor(Math.abs(number))

Number.toLength = (value) ->
	len = @toInteger(value)
	Math.min Math.max(len, 0), Number.MaxSafeInteger

##------------------------------------------------------------------------------
##
##	STRING PROTOTYPE
##
##------------------------------------------------------------------------------
#
# Add ECMA262-5 string trim if not supported natively
#

String::url = ()->
	a = document.createElement('a')
	a.href = @
	origin = a.hostname
	if a.protocol.length > 0
		origin = a.protocol + '//' + a.hostname
	if a.port.length > 0
		origin = "#{origin}:#{a.port}"
	{host, hostname, pathname, port, protocol, search, hash} = a
	a = null
	return {origin, host, hostname, pathname, port, protocol, search, hash}

String::trim=(char = null)->
	return @ltrim(char).rtrim(char)

String::ltrim=(char = null)->
	if !char
		char = '\\s'
	re = new RegExp('^' + char + '*')
	re.global = true
	re.multiline = true
	return @replace(re, '')
String::rtrim=(char = null)->
	if !char
		char = '\\s'
	re = new RegExp(char + '*$')
	re.global = true
	re.multiline = true
	return @replace(re, '')

String::padLeft = (length, char = ' ') ->
	if char.length == 0
		char = ' '
	text = @
	while text.length < length
		text = char + text
	return text

String::padRight = (length, char = ' ') ->
	if char.length == 0
		char = ' '
	text = @
	while text.length < length
		text += char
	return text

##------------------------------------------------------------------------------
##
##	ARRAY PROTOTYPE
##
##------------------------------------------------------------------------------
#
# Add ECMA262-5 Array methods if not supported natively
#

unless "isArray" of Array::
	Array.isArray = (arg) ->
		Object::toString.call(arg) == '[object Array]'
window.isArray = Array.isArray

unless "of" of Array::
	Array.of = ()->
		return Array::slice.call(arguments)

unless "from" of Array::
	Array.from = (arrayLike) ->
		# 1. Let C be the this value.
		C = this
		# 2. Let items be ToObject(arrayLike).
		items = Object(arrayLike)
		# 3. ReturnIfAbrupt(items).
		if arrayLike == null
			throw new TypeError('Array.from requires an array-like object - not null or undefined')
		# 4. If mapfn is undefined, then let mapping be false.
		mapFn = if arguments.length > 1 then arguments[1] else undefined
		T = undefined
		if typeof mapFn != 'undefined'
			# 5. else
			# 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
			if !Function.isCallable(mapFn)
				throw new TypeError('Array.from: when provided, the second argument must be a function')
			# 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if arguments.length > 2
				T = arguments[2]
		# 10. Let lenValue be Get(items, "length").
		# 11. Let len be ToLength(lenValue).
		len = Number.toLength(items.length)
		# 13. If IsConstructor(C) is true, then
		# 13. a. Let A be the result of calling the [[Construct]] internal method
		# of C with an argument list containing the single item len.
		# 14. a. Else, Let A be ArrayCreate(len).
		A = if Function.isCallable(C) then Object(new C(len)) else new Array(len)
		# 16. Let k be 0.
		k = 0
		# 17. Repeat, while k < len… (also steps a - h)
		kValue = undefined
		while k < len
			kValue = items[k]
			if mapFn
				A[k] = if typeof T == 'undefined' then mapFn(kValue, k) else mapFn.call(T, kValue, k)
			else
				A[k] = kValue
			k += 1
		# 18. Let putStatus be Put(A, "length", len, true).
		A.length = len
		# 20. Return A.
		A

unless "indexOf" of Array::
	Array::indexOf = (find, i) -> #opt
		i = 0  if i is undefined
		i += @length  if i < 0
		i = 0  if i < 0
		n = @length

		while i < n
			return i  if i of @ and @[i] is find
			i++
		-1
unless "lastIndexOf" of Array::
	Array::lastIndexOf = (find, i) -> #opt
		i = @length - 1  if i is undefined
		i += @length  if i < 0
		i = @length - 1  if i > @length - 1
		i++ # i++ because from-argument is sadly inclusive
		while i-- > 0
			return i  if i of @ and @[i] is find
		-1
unless "forEach" of Array::
	Array::forEach = (action, that) -> #opt
		i = 0
		n = @length

		while i < n
			action.call that, @[i], i, @  if i of @
			i++
unless "map" of Array::
	Array::map = (mapper, that) -> #opt
		other = new Array(@length)
		i = 0
		n = @length

		while i < n
			other[i] = mapper.call(that, @[i], i, @)  if i of @
			i++
		other
unless "filter" of Array::
	Array::filter = (filter, that) -> #opt
		other = []
		v = undefined
		i = 0
		n = @length

		while i < n
			other.push v  if i of @ and filter.call(that, v = @[i], i, @)
			i++
		other
unless "every" of Array::
	Array::every = (tester, that) -> #opt
		i = 0
		n = @length

		while i < n
			return false  if i of @ and not tester.call(that, @[i], i, @)
			i++
		true
unless "some" of Array::
	Array::some = (tester, that) -> #opt
		i = 0
		n = @length

		while i < n
			return true  if i of @ and tester.call(that, @[i], i, @)
			i++
		false

##------------------------------------------------------------------------------
#
# OBJECT PROTOTYPES
#

window.isPlainObject = Object.isObject = (obj)->
 	return obj!=null && typeof(obj) is "object" && Object.getPrototypeOf(obj) is Object.prototype

unless "is" of Object
	Object.is = (x, y) ->
		# SameValue algorithm
		if x == y
			# Steps 1-5, 7-10
			# Steps 6.b-6.e: +0 != -0
			x != 0 or 1 / x == 1 / y
		else
			# Step 6.a: NaN == NaN
			x != x and y != y

unless "assign" of Object
	# Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty Object, 'assign',
		value: (target, varArgs) ->
			# .length of function is 2
			'use strict'
			if target == null
				# TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object')
			to = Object(target)
			index = 1
			while index < arguments.length
				nextSource = arguments[index]
				if nextSource != null
					# Skip over if undefined or null
					for nextKey of nextSource
						# Avoid bugs when hasOwnProperty is shadowed
						if Object::hasOwnProperty.call(nextSource, nextKey)
							to[nextKey] = nextSource[nextKey]
				index++
			to
		writable: true
		configurable: true

##------------------------------------------------------------------------------
#
# ADDED IE9+ SUPPORT
# TODO: FIX IE8
#
Node::on = Node::addEventListener
Node::off = Node::removeEventListener

Element::matches ?= Element::matches || Element::webkitMatchesSelector || Element::mozMatchesSelector || Element::msMatchesSelector || Element::oMatchesSelector

Element::isElement = (p_target)->
	if typeof HTMLElement is 'object'
		return p_target instanceof HTMLElement or p_target instanceof BaseDOM
	else
		return typeof p_target is 'object' && p_target?.nodeType is 1 && typeof p_target?.nodeName is 'string'

##------------------------------------------------------------------------------
#
# rAF, Date.now, window.performance
#
do ->
	w = window
	for vendor in ['ms', 'moz', 'webkit', 'o']
		break if w.requestAnimationFrame
		w.requestAnimationFrame = w["#{vendor}RequestAnimationFrame"]
		w.cancelAnimationFrame = (w["#{vendor}CancelAnimationFrame"] or
								  w["#{vendor}CancelRequestAnimationFrame"])

	if !('performance' of window)
		window.performance = {}

	if !Date.now
		Date.now = () => new Date().getTime()

	if !('now' of window.performance)
		nowOffset = Date.now()

		if performance.timing && performance.timing.navigationStart
			nowOffset = performance.timing.navigationStart

		window.performance.now = () => Date.now() - nowOffset

	# deal with the case where rAF is built in but cAF is not.
	if w.requestAnimationFrame
		return if w.cancelAnimationFrame
		browserRaf = w.requestAnimationFrame
		canceled = {}
		w.requestAnimationFrame = (callback) ->
			id = browserRaf (time) ->
				if id of canceled then delete canceled[id]
				else callback time
		w.cancelAnimationFrame = (id) -> canceled[id] = true

	# handle legacy browsers which don’t implement rAF
	else
		lastTime = 0
		w.requestAnimationFrame = (callback) ->
			currTime = Date.now()
			timeToCall = Math.max(0, 16 - (currTime - lastTime))
			id = window.setTimeout(()->
				callback(currTime + timeToCall)
			, timeToCall)

			lastTime = currTime + timeToCall
			return id

		w.cancelAnimationFrame = (id) -> clearTimeout id

##------------------------------------------------------------------------------
#
# CACHES POLYFILL BECAUSE IT IS NOT ADDED TO NATIVE YET!
#
if Cache?
	unless "add" of Cache::
		Cache::add = (request) ->
			@addAll [ request ]

	unless "addAll" of Cache::
		Cache::addAll = (requests) ->
			cache = @

		# Since DOMExceptions are not constructable:
		NetworkError = (message) ->
			@name = 'NetworkError'
			@code = 19
			@message = message
			return

		NetworkError:: = Object.create Error::
		Promise.resolve().then(->
			if arguments.length < 1 then throw new TypeError
			# Simulate sequence<(Request or USVString)> binding:
			sequence = []
			requests = requests.map((request) ->
				if request instanceof Request
					request
				else
					String request
					# may throw TypeError
			)
			Promise.all requests.map((request) ->
				if typeof request == 'string'
					request = new Request(request)
				scheme = new URL(request.url).protocol
				if scheme != 'http:' and scheme != 'https:'
					throw new NetworkError('Invalid scheme')
				fetch request.clone()
			)
		).then((responses) ->
			# TODO: check that requests don't overwrite one another
			# (don't think this is possible to polyfill due to opaque responses)
			Promise.all responses.map((response, i) ->
				cache.put requests[i], response
			)
		).then ->
			return undefined

if CacheStorage?
	unless "match" of CacheStorage::
		# This is probably vulnerable to race conditions (removing caches etc)
		CacheStorage::match = (request, opts) ->
			caches = @
			@keys().then (cacheNames) ->
				match = undefined
				cacheNames.reduce ((chain, cacheName) ->
				chain.then ->
					match or caches.open(cacheName).then((cache) ->
						cache.match request, opts
						).then((response) ->
							match = response
							match
						)
				), Promise.resolve()

##------------------------------------------------------------------------------
#
# ADDED OLDER BROWSERS SUPPORT
#
navigator.mediaDevices ?= {}
navigator.getUserMedia = navigator.mediaDevices.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia