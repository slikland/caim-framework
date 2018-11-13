#import caim.navigation.core.data.ParseData

#import caim.utils.StringUtils

class ParseConfig extends ParseData
	
	_views = null
	_contents = null
	_required = null
	
	constructor:(p_data)->
		super(p_data)
		_contents ?= []
		_views ?= @_setViews()
		_required ?= @_setRequired()

	@get views:()->
		return _views
		
	@get contents:()->
		return _contents
		
	@get required:()->
		return _required
		
	###*
	@method _setViews
	@return {Object}
	@private
	###
	_setViews:()->
		results = []
		for k, v of @data.views
			v.class = StringUtils.toCamelCase(v.class)
			if v.content
				props = @getProperties(v.content)
				v.content = @getPath(v.content)
				if props?
					for p, pv of props
						v[p] = pv
				_contents.push @_contentGroup(v)
			results[v.id] = v

		for k, v of @data.views
			if v.parentView == v.id then throw new Error('The parent view cannot be herself')
			if results[v.parentView]? && v.parentView != v.id
				if !results[v.parentView].subviews then results[v.parentView].subviews = {}
				if v.loadContent == undefined
					v.loadContent = if results[v.parentView].loadContent? then results[v.parentView].loadContent else true
				else
					v.loadContent = v.loadContent
				results[v.parentView].subviews[v.id] = v
		@data.views = results
		return results
	
	###*
	@method _setRequired
	@return {Object}
	@private
	###
	_setRequired:()->
		results = []
		for id of @data.required
			group = []
			for k, v of @data.required[id]
				v.group = id
				if v.src
					props = @getProperties(v.src)
					v.src = @getPath(v.src)
					if props?
						for p, pv of props
							v[p] = pv
				if v.content
					props = @getProperties(v.content)
					v.content = @getPath(v.content)
					if props?
						for p, pv of props
							v[p] = pv
					_contents.push @_contentGroup(v)
				if !v.id? || v.id is undefined
					src = v.src || v.content
					v.id = @removeParam('noCache', @getPath(src))
					v.id = @removeParam('v', @getPath(src))
				group[v.id] = v
			results[id] = group
		@data.required = results
		return results

	###*
	@method removeParam
	@param {String} p_param
	@param {String} p_url
	@private
	###
	removeParam:(p_param, p_url)->
		param = null
		params = []
		results = p_url.split?('?')[0]
		query = if p_url.indexOf('?') != -1 then p_url.split('?')[1] else ''
		if query != ''
			params = query.split('&')
			i = params.length - 1
			while i >= 0
				param = params[i].split('=')[0]
				if param == p_param
					params.splice i, 1
				i -= 1
			if params.length > 0
				results = results + '?' + params.join('&')
		return results

	###*
	@method _contentGroup
	@param {Object} p_data
	@return {Array}
	@private
	###
	_contentGroup:(p_data)->
		result = {}
		if p_data.id then result.id = p_data.id
		if p_data.group then result.group = p_data.group
		result.src = @getPath(p_data.content)
		result.cache = if p_data.cache || p_data.cache == undefined then true else false
		result.loadContent = if p_data.loadContent || p_data.loadContent == undefined then true else false
		return result
