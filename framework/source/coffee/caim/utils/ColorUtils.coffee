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
