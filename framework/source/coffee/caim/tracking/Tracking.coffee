#import caim.tracking.GoogleAnalytics
#import caim.tracking.GTM

###*
@class Tracking
@extends EventDispatcher
@submodule caim.tracking
###
class Tracking extends EventDispatcher
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	_inited:false
	_data:null
	_ga:null
	_hasGA:null
	_lastPagePath:null

	# Initialize {Tracking}
	#
	# tag - {String} to tag from `_data`
	# data - {Object} to data
	init:(p_data)->
		return if !navigator.onLine
		
		@_data = p_data
		if @_inited then throw new Error('Tracking::track Tracking is already inited')
		@_inited = true

		@scope = @_data?['scope']
		@tags  = @_data?['tags']

		if @scope?['ga']?
			@_initGA()
		else if @scope?['gtm']
			@_initGTM()

		@_lastPagePath = null

		console.log 'Tracking::INITIALIZE'

	# Track
	#
	# tag - {String} to tag from `_data`
	# data - {Object} to data
	track:(p_tag, p_data=null)->
		return if !navigator.onLine or !@_inited or !@tags

		if @tags[p_tag] then p_tag = @tags[p_tag]
		else throw new Error('Tracking::track Tag not triggered, it is not registered in `_data`')

		if @_hasGA && p_tag.ga
			@_trackGA(p_tag.ga, p_data)
		else if @_hasGTM and p_tag.gtm
			@_trackGTM(p_tag.gtm, p_data)

	##############
	## PRIVATES ##
	##############
	_initGTM:()->
		if !@_inited then throw new Error('Tracking::track You must initialize Tracking class')
		if !@scope['gtm']?['id']? then throw new Error('Tracking::track The ID for GTM is null')
		@_gtm = new GTM(@scope['gtm']?['id'])
		@_hasGTM = @_gtm?
		

	# Initialize Google Analytics
	_initGA:()->
		if !@_inited then throw new Error('Tracking::track You must initialize Tracking class')
		if !@scope['ga']?['id']? then throw new Error('Tracking::track The ID for Google Analytics is null')
		@_hasGA = true
		@_ga = new GoogleAnalytics(@scope['ga']?['id'])

	# GA Tracking
	#
	# tag - {String} to tag from `_data`
	# data - {Object} to data
	_trackGA:(p_tag, p_data)->
		vals = ['category', 'action', 'label', 'value']
		params = []

		for v, i in vals
			if !p_tag[v]? then continue
			v = p_tag[v]
			# console.log("TRACKING", v)
			if v.replace?
				v = v.replace(/\{(.*?)\}/g, (val, m) ->
					if p_data?[m]? then return p_data[m]
					else return ''
				)
			params[i] = v

		switch p_tag.type
			when 'pageview'
				if params[1] != @_lastPagePath
					@_ga.pageview(params[1])
				@_lastPagePath = params[1]
			when 'event'
				@_ga.event.apply(@, params)
			# else 
			# 	throw new Error('Tracking::_trackGA There is a tag with no type (event / pageview)')

	# GTM Tracking
	#
	# tag - {String} to tag from `_data`
	# data - {Object} to data
	_trackGTM:(p_tag, p_data)->
		vals = @scope['gtm']['values'] || ['category', 'action', 'label', 'value']
		params = {}

		for v, i in vals
			if !p_tag[v]? then continue
			tagParam = p_tag[v]
			if tagParam.replace?
				while /\{.*?\}/.test(tagParam)
					tagParam = tagParam.replace(/\{([^\{\}]*?)\}/g, (val, m) ->
						if p_data?[m]? then return p_data[m]
						else return ''
					)
			params[v] = tagParam if tagParam? and !!tagParam.length

		@_gtm.track params
