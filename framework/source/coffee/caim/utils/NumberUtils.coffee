###*
@class NumberUtils
@static
@submodule caim.utils
###
class NumberUtils

	###*
	Checks whether the number is an odd number.
	@method isOdd
	@static
	@param {Number} p_value The number to check.
	@return {Boolean} The resulting boolean object.
	###
	@isOdd:(p_value)->
		return if Math.abs(p_value % 2) == 1 then true else false

	###*
	Checks whether the number is an even number.
	@method isEven
	@static
	@param {Number} p_value The number to check.
	@return {Boolean} The resulting boolean object.
	###
	@isEven:(p_value)->
		return if p_value%2==0 then true else false

	###*
	Checks whether the number is zero.
	@method isZero
	@static
	@param {Number} p_value The number to check.
	@return {Boolean} The resulting boolean object.
	###
	@isZero:(p_value)->
		return Math.abs(p_value) < 0.00001

	###*
	Returns the value in percent of a {Number}.
	@method toPercent
	@static
	@param {Number} p_value The number to check.
	@param {Number} p_min The number of lower limit.
	@param {Number} p_max The number of higher limit.
	@return {Number} The resulting number object.
	###
	@toPercent:(p_value, p_min, p_max)->
		return ((p_value - p_min) / (p_max - p_min)) * 100

	###*
	Returns the value in Number of a {percent}.
	@method percentToValue
	@static
	@param {Number} p_percent The number in percent to check.
	@param {Number} p_min The number of lower limit.
	@param {Number} p_max The number of higher limit.
	@return {Number} The resulting number object.
	###
	@percentToValue:(p_percent, p_min, p_max)->
		return ((p_max - p_min) * p_percent) + p_min

	###*
	Returns bytes to formatted MB's string.
	@method getBytesAsMegabytes
	@static
	@param {Number} p_bytes
	@return {String} Results in MB's
	###
	@getBytesAsMegabytes:(p_bytes)->
		return (Math.floor(((p_bytes / 1024 / 1024) * 100)) / 100)+" MB"

	###*
	Returns bytes to formatted byte, KB's, MB's or GB's string.
	@method bytesTo
	@static
	@param {Number} p_bytes
	@return {String} Results in byte, KB's, MB's or GB's
	###
	@bytesTo:(p_bytes)->
		if      p_bytes >= 1000000000 then return (p_bytes/1000000000).toFixed(2)+' GB'
		else if p_bytes >= 1000000    then return (p_bytes/1000000).toFixed(2)+' MB'
		else if p_bytes >= 1000       then return (p_bytes/1000).toFixed(2)+' KB'
		else if p_bytes > 1           then return p_bytes+' bytes'
		else if p_bytes == 1          then return p_bytes+' byte'
		else                          return '0 byte'

	###*
	Generates a random number between two numbers.
	@method rangeRandom
	@static
	@param {Number} p_low The number of lower limit of range.
	@param {Number} p_high The number of higher limit of range.
	@param {Boolean} [p_rounded=false] The boolean that defines if the random number will be rounded or not.
	@return {Number}
	###
	@rangeRandom:(p_low, p_high, p_rounded=false)->
		return if !p_rounded then (Math.random() * (p_high - p_low)) + p_low else Math.round(Math.round(Math.random() * (p_high - p_low)) + p_low)

