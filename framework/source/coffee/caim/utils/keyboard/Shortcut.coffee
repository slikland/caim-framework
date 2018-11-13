#namespace caim.utils.keyboard
###*
@class Shortcut
@submodule caim.utils.keyboard
###
class Shortcut

	###*
	@property MODIFIERS
	@type Array
	@static
	@default ['alt', 'ctrl', 'meta', 'shift']
	###
	@const MODIFIERS: ['alt', 'ctrl', 'meta', 'shift']

	###*
	@property MODIFIER_CODES
	@type Array
	@static
	@default [16, 18, 17, 91]
	###
	@const MODIFIER_CODES: [16, 18, 17, 91]

	###*
	@class Shortcut
	@constructor
	@param {HTMLElement} [target=null]
	###
	constructor:(target = null)->
		if !target
			target = window
		@_target = target

		@_shortcuts = []

		@_target.addEventListener('keydown', @_keyDown)
		@_target.addEventListener('keyup', @_keyUp)

	###*
	@method destroy
	###
	destroy:()->
		@_target?.removeEventListener('keydown', @_keyDown)
		@_target?.removeEventListener('keyup', @_keyUp)
		@_shortcuts.length = 0
		delete @_shortcuts
		delete @_target
		false
	###*
	@method _keyDown
	@private
	@param {e} Event
	###
	_keyDown:(e)=>
		keyCode = e.keyCode
		key = ''
		if !(keyCode in @constructor.MODIFIER_CODES)
			key = String.fromCharCode(keyCode).toLowerCase()
		modifiers = []
		for k in @constructor.MODIFIERS
			if e[k + 'Key']
				modifiers.push(k)
		modifiers.sort()
		shortcut = '[' + modifiers.join('][') + ']' + key
		items = @_findShortcut(shortcut)
		for item in items
			item.callback?()
			if item.preventDefault
				e.preventDefault()
		false

	###*
	@method _normalizeShortcut
	@private
	@param {String} shortcut
	@return {Array}
	###
	_normalizeShortcut:(shortcut)->
		shortcut = shortcut.toLowerCase()
		modRE = /\[(.*?)\]/g
		modifiers = []
		while (o = modRE.exec(shortcut))
			mod = o[1]
			if mod == 'cmd'
				mod = 'meta'
			if mod in @constructor.MODIFIERS
				modifiers.push(mod)
		shortcut = shortcut.replace(/\[.*?\]/g, '').split('')
		shortcut.sort()
		modifiers.sort()
		return '[' + modifiers.join('][') + ']' + shortcut.join('')

	###*
	@method _findShortcut
	@private
	@param {String} shortcut
	@return {Array}
	###
	_findShortcut:(shortcut)->
		found = []
		i = @_shortcuts.length
		while i-- > 0
			if @_shortcuts[i].normalized == shortcut
				found.push(@_shortcuts[i])
		return found

	###*
	@method addShortcut
	@param {String} shortcut
	@param {Function} callback
	@param {Boolean} [preventDefault=true]
	###
	addShortcut:(shortcut, callback, preventDefault = true)->
		normalized = @_normalizeShortcut(shortcut)
		i = @_shortcuts.length
		while i-- > 0
			if @_shortcuts[i].normalized == normalized && @_shortcuts[i].callback == callback
				return
		@_shortcuts.push({normalized: normalized, shortcut: shortcut, callback: callback, preventDefault: preventDefault})
		false

	###*
	@method removeShortcut
	@param {String} shortcut
	@param {Function} callback
	###
	removeShortcut:(shortcut, callback)->
		normalized = @_normalizeShortcut(shortcut)
		i = @_shortcuts.length
		while i-- > 0
			if @_shortcuts[i].normalized == normalized
				if !callback || (callback && @_shortcuts[i].callback == callback)
					@_shortcuts.splice(i, 1)
		false
