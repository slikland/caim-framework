###*
@class GeolocationDetection
@submodule caim.utils
###
class GeolocationDetection extends EventDispatcher

	###*
	@event COMPLETE
	@static
	###
	@const COMPLETE: 'geolocation_complete'
	
	###*
	@event ERROR
	@static
	###
	@const ERROR: 'geolocation_error'

	###*
	@property isSearching
	@type Boolean
	@default false
	@protected
	###
	isSearching: false

	###*
	@method getInstance
	@static
	@return {GeolocationDetection} 
	###
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	###*
	@class GeolocationDetection
	@constructor
	@extends EventDispatcher
	###
	constructor:()->
		super
		
	###*
	@method fetchPosition
	###
	fetchPosition: ()->
		#avoid searching twice
		if @isSearching then return

		#check 
		if navigator.geolocation
			@isSearching = true
			navigator.geolocation.getCurrentPosition(@_success, @_error)
		else
			@_error('Geolocation is not supported for this Browser/OS version yet.')
		false

	###*
	@property position
	@type Object
	@return {Object}
	@readOnly
	###
	@get position:()->
		return @_position

	###*
	@method _success
	@param {Object} position
	@private
	###
	_success:(position)=>
		@_position = position
		@isSearching = false
		@trigger(Geolocation.COMPLETE, position)
		false
		
	###*
	@method _error
	@param {Object} error
	@private
	###
	_error:(error)=>
		@isSearching = false
		@trigger(Geolocation.ERROR, error)
		false
