###*
@class SunUtils
@submodule caim.utils
###
class SunUtils

	###*
	@method getInstance
	@static
	@return {SunUtils} 
	###
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	###*
	@class SunUtils
	@constructor
	###
	constructor:()->
		@_location = null
		@_waitingLocation = false
		@_zenith = 90.83333333333333
		@_sunsetQueue = []

	###*
	@method getTimeToNextSunset
	@param {Function} callback
	@return {Number|Boolean}
	###
	getTimeToNextSunset:(callback)->
		#add to queue
		@_sunsetQueue.push callback if callback
		
		#waiting location
		return if @_waitingLocation

		#request location
		if !@_location?
			@_waitingLocation = true
			GeolocationUtils.getInstance().getLocation(@_showLocation)
			return
		
		#calc sunset
		goldenHour = @_calcSunsetOf()
		current = @_getCurrentTime()
		
		#if sunset has passed, calc tomorrow`s sunset
		if current > goldenHour
			rightNow = new Date()
			rightNow.setDate(rightNow.getDate() + 1)
			goldenHour = @_calcSunsetOf(rightNow) + (24 * 3600)
			
		#take the diff
		result = goldenHour - current

		#show result
		for callback, i in @_sunsetQueue
			@_sunsetQueue.splice(i, 1)
			callback?(result)

		return result

	###*
	@method COS
	@param {Number} deg
	@protected
	@return {Number}
	###
	COS:(deg)->
		rad = Math.PI * deg / 180
		return Math.cos(rad)

	###*
	@method SIN
	@param {Number} deg
	@protected
	@return {Number}
	###
	SIN:(deg)->
		rad = Math.PI * deg / 180
		return Math.sin(rad)

	###*
	@method TAN
	@param {Number} deg
	@protected
	@return {Number}
	###
	TAN:(deg)->
		rad = Math.PI * deg / 180
		return Math.tan(rad)

	###*
	@method ACOS
	@param {Number} cos
	@protected
	@return {Number}
	###
	ACOS:(cos)->
		return Math.acos(cos) * 180 / Math.PI

	###*
	@method ASIN
	@param {Number} cos
	@protected
	@return {Number}
	###
	ASIN:(sin)->
		return Math.asin(sin) * 180 / Math.PI

	###*
	@method ATAN
	@param {Number} tan
	@protected
	@return {Number}
	###
	ATAN:(tan)->
		return Math.atan(tan) * 180 / Math.PI

	###*
	@method _showLocation
	@param {Object} location A object likes {coords:{"latitude":0, "longitude":0}}
	@param {Function} callback
	@private
	###
	_showLocation:(location, callback)=>
		@_location = location
		if @_location
			@_waitingLocation = false
			@getTimeToNextSunset() if @_sunsetQueue.length > 0
		else
			for callback,i in @_sunsetQueue
				@_sunsetQueue.splice(i, 1)
				callback(false)
		false

	###*
	@method _getCurrentTime
	@private
	@return {Number}
	###
	_getCurrentTime:()->
		now = new Date()
		return (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds()

	###*
	@method _calcSunsetOf
	@param {Date} now
	@private
	@return {Number}
	###
	_calcSunsetOf:(now)->
		result = false
		now ?= new Date()
		day = now.getDate()
		month = now.getMonth() + 1
		year = now.getYear()
		latitude = @_location.coords.latitude
		longitude = @_location.coords.longitude

		#1.first calculate the day of the year
		n1 = Math.floor(275 * month / 9)
		n2 = Math.floor((month + 9) / 12)
		n3 = (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3))
		n = n1 - (n2 * n3) + day - 30

		#2.convert the longitude to hour value and calculate an approximate time
		lngHour = longitude / 15
		t = n + ((18 - lngHour) / 24)

		#3.calculate the Sun's mean anomaly
		m = (0.9856 * t) - 3.289

		#4.calculate the Sun's true longitude
		l = m + (1.916 * @SIN(m)) + (0.020 * @SIN(2 * m) + 282.634)
		l = ((l % 360) + 360) % 360
		
		#5a.calculate the Sun's right ascension
		ra = @ATAN(0.91764 * @TAN(l))

		#5b.right ascension value needs to be in the same quadrant as L
		lQuadrant  = (Math.floor(l / 90)) * 90
		raQuadrant = (Math.floor(ra / 90)) * 90
		ra = ra + (lQuadrant - raQuadrant)

		#5c.right ascension value needs to be converted into hours
		ra = ra / 15

		#6.calculate the Sun's declination
		sinDec = 0.39782 * @SIN(l)
		cosDec = @COS(@ASIN(sinDec))

		#7a.calculate the Sun's local hour angle
		cosH = (@COS(@_zenith) - (sinDec * @SIN(latitude))) / (cosDec * @COS(latitude))

		#the sun will not set
		return false if cosH < -1

		#7b.finish calculating H and convert into hours
		h = @ACOS(cosH)
		h = h / 15

		#8.calculate local mean time of rising/setting
		t = h + ra - (0.06571 * t) - 6.622

		#9.adjust back to UTC
		ut = t - lngHour
		ut = (((ut % 24) + 24) % 24) * 3600
		
		#10.convert UT value to local time zone of latitude/longitude
		return ut - (now.getTimezoneOffset() * 60)
