#import caim.navigation.core.data.PathsData
#import caim.navigation.core.data.ParseData

#import caim.utils.JSONUtils

class ParseContent extends ParseData
	
	constructor:(p_data)->
		super(p_data)
		@_validatePaths(@data)
		@_getContents()
	
	@get initialAssets:()->
		return @_primary
		
	# @TODO
	# Implements background loading in navigation
	@get standByAssets:()->
		return @_standBy
		
	###*
	@method _getContents
	@return {Object}
	@private
	###
	_getContents:()->
		@_primary ?= []
		@_standBy ?= []
		
		paths = PathsData.getInstance()
		assets = JSONUtils.filterObject(paths.translate(@data), 'src', null, null, true)
		for k, v of assets
			if v.loadWithView || v.loadWithView == undefined
				if @data.src != v.src
					@_primary.push v
			else if v.loadWithView == false
				@_standBy.push v
		false

	###*
	@method _validatePaths
	@param {Object} p_data
	@protected
	###
	_validatePaths:(p_data)->
		for k, v of p_data
			if k == 'src'
				props = @getProperties(p_data[k])
				p_data[k] = @getPath(p_data[k])
				if props?
					for p, pv of props
						p_data[p] = pv
			if typeof(p_data[k]) == 'object' || typeof(p_data[k]) == 'array'
				@_validatePaths(p_data[k])
