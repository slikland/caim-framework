###*
@class ColorUtils
@static
@submodule caim.utils
###
class ColorUtils
	###*
	Darken/lighten a hexadecimal colors
	@method lightenOrDarken
	@static
	@param {String} p_hex The target hexadecimal color value to be darkened or lightened.
	@param {Number} p_amount This value must be between -1 and 1 (-1 more darken and 1 more lighten)
	@return {String} The hexadecimal value of result.
	###	
	@lightenOrDarken:(p_hex, p_amount)->
		# validate hex string
		color = p_hex.replace(/[^0-9a-f]/gi, '')
		if color.length < 6
			color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
		p_amount = p_amount or 0
		# convert to decimal and change amount
		shade = '#'
		c = undefined
		i = undefined
		black = 0
		white = 255
		i = 0
		while i < 3
			c = parseInt(color.substr(i * 2, 2), 16)
			c = Math.round(Math.min(Math.max(black, c + p_amount * white), white)).toString(16)
			shade += ('00' + c).substr(c.length)
			i++
		return shade

	###*
	Generate a random hexadecimal color
	@method randomHex
	@static
	@return {String} The hexadecimal value of result.
	###	
	@randomHex:()->
		return '#'+Math.floor(Math.random()*16777215).toString(16)

	###*
	Generate a random RGB color
	@method randomRGB
	@static
	@return {String} The RGB value of result on format rgb(r,g,b)
	###	
	@randomRGB:()->
		return ColorUtils.hexToRGB(ColorUtils.randomHex())

	###*
	Converts a Hexadecimal color value to integer value. 
	@method hexToInt
	@static
	@return {String} The result integer value
	###	
	@hexToInt:(p_hex)->
		p_hex = p_hex.substr(4, 2) + p_hex.substr(2, 2) + p_hex.substr(0, 2);
		return parseInt(p_hex, 16)
	
	###*
	Converts a RGB color value to integer value. 
	@method RGBToInt
	@static
	@return {String} The result integer value
	###	
	@RGBToInt:(p_r, p_g, p_b)->
		return ColorUtils.hexToInt(ColorUtils.RGBToHex(p_r, p_g, p_b))

	###*
	Converts a RGB color value to Hexadecimal value. 
	@method RGBToHex
	@static
	@return {String} The result Hexadecimal value
	###	
	@RGBToHex:(p_r, p_g, p_b)->
		hex = p_r << 16 | p_g << 8 | p_b
		return "#" + hex.toString(16)

	###*
	Converts a Hexadecimal color value to RGB value. 
	@method hexToRGB
	@static
	@return {String} The RGB value of result on format rgb(r,g,b)
	###	
	@hexToRGB:(p_hex) ->
		hex = 0
		if p_hex.charAt(0) == '#'
			if p_hex.length == 4
				p_hex = '#' + p_hex.charAt(1).repeat(2) + p_hex.charAt(2).repeat(2) + p_hex.charAt(3).repeat(2)
			hex = parseInt(p_hex.slice(1), 16)
		r = hex >> 16 & 0xFF
		g = hex >> 8 & 0xFF
		b = hex & 0xFF
		return 'rgb('+r+','+g+','+b+')'

	###*
	Converts a RGB color value to HSL value. 
	@method RGBToHSL
	@static
	@return {String} The HSL value of result on Array format [H, S, L]
	###	
	@RGBToHSL : (p_r, p_g, p_b) ->
		p_r /= 255
		p_g /= 255
		p_b /= 255

		max = Math.max(p_r, p_g, p_b)
		min = Math.min(p_r, p_g, p_b)

		d = max - min
		h = undefined

		if d == 0
			h = 0
		else if max == p_r
			h = (p_g - p_b) / d % 6
		else if max == p_g
			h = (p_b - p_r) / d + 2
		else if max == p_b
			h = (p_r - p_g) / d + 4
		l = (min + max) / 2
		s = if d == 0 then 0 else d / (1 - Math.abs(2 * l - 1))
		return [h * 60, s, l]


	###*
	Converts a HSL color value to RGB value. 
	@method HSLToRGB
	@static
	@return {String} The RGB value of result on format rgb(r,g,b)
	###	
	@HSLToRGB : (p_h, p_s, p_l) ->
		c = (1 - Math.abs(2 * p_l - 1)) * p_s
		hp = p_h / 60.0
		x = c * (1 - Math.abs(hp % 2 - 1))
		rgb = []

		if isNaN(p_h)
			rgb = [0, 0, 0]
		else if hp <= 1
			rgb = [c,x,0]
		else if hp <= 2
			rgb = [x, c, 0]
		else if hp <= 3
			rgb = [0, c, x]
		else if hp <= 4
			rgb = [0, x, c]
		else if hp <= 5
			rgb = [x, 0, c]
		else if hp <= 6
			rgb = [c, 0, x]
		m = p_l - (c * 0.5)
		return 'rgb(' + Math.round(255 * (rgb[0] + m)) + ',' + Math.round(255 * (rgb[1] + m)) + ',' + Math.round(255 * (rgb[2] + m)) + ')'

	###*
	Converts the RGB color space into YIQ, which takes into account the different impacts of its constituent parts. The equation returns white or black and it's also very easy to implement. ref:https://en.wikipedia.org/wiki/YIQ
	@method getContrastYIQ
	@static
	@return {String} The hex value of black or white
	###	
	@getContrastYIQ : (p_hex) ->
		r = parseInt(p_hex.substr(1, 1), 16)
		g = parseInt(p_hex.substr(2, 2), 16)
		b = parseInt(p_hex.substr(4, 2), 16)
		yiq = (r * 299 + g * 587 + b * 114) / 1000
		return if yiq >= 128 then '#000000' else '#ffffff'

	###*
	Invert a Hex color value
	@method invertHex
	@static
	@return {String} The opposite hex value 
	###	
	@invertColor : (p_hex) ->
		color = p_hex
		color = color.substring(1)
		color = parseInt(color, 16)
		color = 0xFFFFFF ^ color
		color = color.toString(16)
		color = ('000000' + color).slice(-6)
		color = '#' + color
		return color
