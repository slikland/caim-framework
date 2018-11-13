###*
@class MathUtils
@static
@submodule caim.utils
###
class MathUtils

	###*
	@method quadraticBezier
	@static
	@param {Object} p_0 A point object like {"x":0,"y":0}
	@param {Object} p_1 A point object like {"x":0,"y":0}
	@param {Object} p_2 A point object like {"x":0,"y":0}
	@param {Number} t 
	@param {Object} pFinal
	@return {Object} Result point like {"x":0,"y":0}
	###
	@quadraticBezier:(p0, p1, p2, t, pFinal)->
		pFinal = pFinal || {}
		pFinal.x = Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x
		pFinal.y = Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y
		return pFinal
		
	###*
	@method cubicBezier
	@static
	@param {Object} p_0 A point object like {"x":0,"y":0}
	@param {Object} p_1 A point object like {"x":0,"y":0}
	@param {Object} p_2 A point object like {"x":0,"y":0}
	@param {Object} p_3 A point object like {"x":0,"y":0}
	@param {Number} t 
	@param {Object} pFinal
	@return {Object} Result point like {"x":0,"y":0}
	###
	@cubicBezier:(p0, p1, p2, p3, t, pFinal)->
		pFinal = pFinal || {}
		pFinal.x = Math.pow(1 - t, 3) * p0.x + Math.pow(1 - t, 2) * 3 * t * p1.x + (1 - t) * 3 * t * t * p2.x + t * t * t * p3.x
		pFinal.y = Math.pow(1 - t, 3) * p0.y + Math.pow(1 - t, 2) * 3 * t * p1.y + (1 - t) * 3 * t * t * p2.y + t * t * t * p3.y
		return pFinal

	###*
	Getting the distance between two geographical points.
	@method distanceBetweenCoordinates
	@static
	@param {Object} p_from From coordinates (point object like {"x":0,"y":0})
	@param {Object} p_high To coordinates (point object like {"x":0,"y":0})
	@param {String} [p_units="km"] Mean radius of Earth in string the valid values are "km", "meters", "feet" and "miles"
	@return {Number} The resulting the coordinates
	###
	@distanceBetweenCoordinates:(p_from, p_to, p_units = "km")->
		radius = 0
		switch p_units
			when "km"
				radius = 6371
			when "meters"
				radius = 6378000
			when "feet"
				radius = 20925525
			when "miles"
				radius = 3963

		dLatitude  = (p_to.x - p_from.x) * Math.PI / 180
		dLongitude  = (p_to.y - p_from.y) * Math.PI / 180

		a  = Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) + Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(p_from.x * Math.PI / 180) * Math.cos(p_to.x * Math.PI / 180)
		c  = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

		return radius * c

	###*
	@method getShortRotation
	@static
	@param {Number} p_start
	@param {Number} p_end
	@param {Boolean} [p_useRadians=false]
	@return {Number}
	###
	@getShortRotation:(p_start, p_end, p_useRadians = false)->
		cap = if p_useRadians then Math.PI * 2 else 360
		diff = (p_end - p_start) % cap;
		if (diff isnt diff % (cap / 2))
			diff = (diff < 0) ? diff + cap : diff - cap
		return p_start + diff

	###*
	Returns the value in radians of a degress number.
	@method degreesToRadians
	@static
	@param {Number} p_value
	@return {Number}
	###
	@degreesToRadians:(p_value)->
		return (2 * Math.PI * p_value) / 360

	###*
	Returns the value in degress of a number.
	@method toDegrees
	@static
	@param {Number} p_value
	@return {Number}
	###
	@toDegrees:(p_value)->
		return p_value * 180 / Math.PI

	###*
	Returns the value in radians of a number.
	@method toRadians
	@static
	@param {Number} p_value
	@return {Number}
	###
	@toRadians:(p_value)->
		return p_value / 180 * Math.PI

