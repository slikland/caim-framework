#import slikland.display.BaseDOM
#import slikland.loader.AssetLoader
#import slikland.utils.ObjectUtils
#import slikland.utils.StringUtils
#import slikland.utils.Resizer
#import slikland.core.loader.ConditionsValidation

class ImageView extends BaseComponent

	@const LOADING: 'imageview-loading'
	@const LOADED: 'imageview-loaded'
	@const START: 'imageview-start'
	@const INIT: 'imageview-init'

	@const BASE_CLASSNAME: 'image-view'

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
		className: @BASE_CLASSNAME
		element: 'figure'
		render:							'img'							# img|background|svg
		fit: 								'origin' 					# none|auto|exact|cover|contain|origin
		position:						'center'					# center|top|left|right|bottom or combined |center top left|right top|
		img: {
			attrs: {
				draggable: false
				alt: ''
				title: ''
			}
		}
	}, @DEFAULT_OPTIONS)

	@const FIT_PARAMS: 'none auto exact cover contain origin'


	constructor:(p_options = {})->
		@_loaded = false
		@_created = false
		@_src = null
		@_imageElement = null
		@_currentGroup = null
		@_loader = app.loader || AssetLoader.getInstance()
		@_groupId = "#{@constructor.BASE_CLASSNAME}_#{StringUtils.random()}"

		@_loaderGroup = @_loader.getGroup(@_groupId)
		@_loaderGroup.addEventListener(AssetLoader.COMPLETE_ALL, @_didLoad)
		@_loaderGroup.addEventListener(AssetLoader.ERROR, @_didError)
		@_loaderGroup.addEventListener(AssetLoader.PROGRESS_ALL, @_didProgress)
		@_loaderGroup.addEventListener(AssetLoader.FILE_ERROR, @_didError)

		if p_options.label? and !p_options.alt?
			p_options.alt = p_options.label

		if p_options.alt?
			p_options.img ?= {}
			p_options.img.attrs ?= {}
			p_options.img.attrs.alt = p_options.alt
			delete p_options.alt

		if p_options.title?
			p_options.img ?= {}
			p_options.img.attrs ?= {}
			p_options.img.attrs.title = p_options.title
			delete p_options.title

		super p_options

		@create()

	# Getters and Setters
	#------------------------------------
	@get data:()->
		return @_options

	@get loaded:()->
		return @_loaderGroup?.loaded || false

	@get loading:()->
		_progress = @progress
		return _progress > 0 and _progress < 1

	@get progress:()->
		return @_loaderGroup?.progress || 0

	@get src:()->
		return @_src

	@set src:(p_src=null)->
		if p_src?

			_newSrc = p_src

			if Array.isArray(p_src.src) or Array.isArray(p_src.id)
				_sources = if Array.isArray(p_src.id) then p_src.id else p_src.src
				_resultConditionals = @_checkConditionals(_sources)
				_newSrc = _resultConditionals
				_newSrc.src = _newSrc.file if _newSrc.file?

			if typeof _newSrc is 'object'
				_loaded = _newSrc.tag if _newSrc.tag instanceof HTMLElement
				if !Array.isArray(_newSrc.id) and _newSrc.id?
					_id = _newSrc.id
				else
					_id = _newSrc.src
				_newSrc = _newSrc.tag?.src || _newSrc.src

			if typeof _newSrc is 'string'
				_id = _newSrc
				if !_newSrc? or _newSrc.length <= 0
					return

			return if @_src? and _newSrc is @_src

			@_originalSource = p_src

			@_src = _newSrc
			_loaded = _loaded || @_loader.getItem(_id)?.tag
			_file = { id:_id, src:@_src }

			if _loaded?
				@trigger ImageView.START, _file
				setTimeout ()=>
					@_invalidateImage(_loaded.cloneNode(true))
			else
				if @_loaderGroup.progress > 0
					@_loaderGroup.close()
				setTimeout ()=>
					if @_loaderGroup? and @_loading?
						if @_loading.element
							@appendChild @_loading if !@_loading.isAttached
							TweenMax.to(@_loading.element, .5, {
								opacity: 1,
								ease: Quad.easeOut
							})
						@_loaderGroup.loadFile(_file)
						@trigger ImageView.START, _file
		else
			@_src = null
			@_imageElement?.destroy()
			@_imageElement = new BaseDOM
				className: 'image'
			@appendChild @_imageElement

	@get image:()->
		return @_imageElement

	destroy:()->
		@_created = @_loaded = false
		@_loaderGroup?.close()
		@_loaderGroup?.removeEventListener(AssetLoader.COMPLETE_ALL, @_didLoad)
		@_loaderGroup?.removeEventListener(AssetLoader.PROGRESS_ALL, @_didProgress)
		@_loaderGroup?.removeEventListener(AssetLoader.ERROR, @_didError)
		@_loaderGroup?.removeEventListener(AssetLoader.FILE_ERROR, @_didError)
		@_loaderGroup?.destroy()
		@_loadingIcon?.destroy()
		@_loading?.destroy()
		@_imageElement?.destroy()
		Resizer.getInstance().off Resizer.RESIZE, @_throttledResize
		Resizer.getInstance().off Resizer.BREAKPOINT_CHANGE, @_breakpointChanges
		@_options = @_src = @_originalSource = @_loaderGroup = null
		delete @_options
		delete @_src
		delete @_originalSource
		delete @_loaderGroup
		super

	# Public
	#------------------------------------------

	componentLayout:()->
		@_loading = new BaseDOM
			element: 'div'
			className: 'image-loading'
		@appendChild @_loading

		@_loadingIcon = new BaseDOM
			element: 'div'
			className: 'loader'
		@_loading.appendChild @_loadingIcon

		@_imageElement = new BaseDOM
			className: 'image'
		@appendChild @_imageElement

		@trigger ImageView.INIT
		@_throttledResize = FunctionUtils.throttle(@_resize, 50)
		Resizer.getInstance().on Resizer.RESIZE, @_throttledResize
		Resizer.getInstance().on Resizer.BREAKPOINT_CHANGE, @_breakpointChanges

	# Private
	#------------------------------------------
	_invalidate:()->
		super

		@src = @_options.src if @_options.src

		@_options.fit = @constructor.DEFAULT_OPTIONS.fit if @constructor.FIT_PARAMS.indexOf(@_options.fit.replace(/\s/gi, '$').split('$')[0]) is -1

		@_invalidateImage()

	_invalidateImage:(image=null)->
		return if !@_loaded and !@_created
		_fit = @_options.fit
		_render = @_options.render

		if image? and image instanceof HTMLElement
			_newImage = true

			@_originalSize = {
				width: image.width
				height: image.height
			}

			if image.width is 0 or image.height is 0
				@_imageElement.appendChild image
				image.onload = ()=>
					image.onload = null
					@_invalidateImage(image)
					@trigger ImageView.LOADED, {item:{tag:image}}
				return
			else
				setTimeout ()=>
					@trigger ImageView.LOADED, {item:{tag:image}}

			if @_imageElement?
				@_imageElement.html = ''
				@_imageElement.destroy()
				delete @_imageElement

			@_imageElement = new BaseDOM
				className: 'image'
			@appendChildAt @_imageElement, 1

			if _render is 'background'
				@_imageElement.css('background-image', "url(#{image.getAttribute('src')})")
			else
				_image = new BaseDOM
					element: image
				@replaceChild(_image, @_imageElement)
				@_imageElement = _image

		@_imageElement.attr('class', "image #{@_options.fit} #{@_options.position}")

		_imgOptions = @_options?.img
		if _imgOptions.attrs?
			@_imageElement.attr _imgOptions.attrs, null, _imgOptions.namespace
		if _imgOptions.style?
			@_imageElement.css _imgOptions.style

		@_imageElement.element.removeAttribute('width')
		@_imageElement.element.removeAttribute('height')
		@_invalidateRatio()

		if _newImage
			TweenMax.set @_imageElement.element, {opacity: 0}
			TweenMax.to(@_imageElement.element, .5, {
				opacity: 1,
				ease: Quad.easeOut
			})

	_invalidateRatio:(sourceImage=null)->
		if @_originalSize? and @_imageElement?
			_fit = @_options.fit
			_originalRatio = @_originalSize.width / @_originalSize.height
			_containerRatio = @width / @height
			@_imageElement.removeClass('sq')
			@_imageElement.removeClass('wh')
			@_imageElement.removeClass('hw')
			@_imageElement.addClass('sq') if Math.floor(@_originalSize.width) is Math.floor(@_originalSize.height)
			if _fit is 'contain'
				@_imageElement.addClass('wh') if @_originalSize.width > @_originalSize.height
				@_imageElement.addClass('hw') if @_originalSize.height > @_originalSize.width
			else
				@_imageElement.addClass('wh') if _originalRatio > _containerRatio
				@_imageElement.addClass('hw') if _originalRatio < _containerRatio
			if _fit is 'origin'
				@css
					width: @_originalSize.width + 'px'
					height: @_originalSize.height + 'px'

	_checkConditionals:(p_src)->
		validations = ConditionsValidation.getInstance();
		for item in p_src
			if item.condition?
				console.log item.condition, validations.test(item.condition)
				return item if validations.test(item.condition)
				continue
			else
				return item
		return null

	_resize:()=>
		return if !@_loaded and !@_created
		@_invalidateRatio()

	_breakpointChanges:(event=null)=>
		@src = @_originalSource if @_originalSource?

	_didProgress:(event=null)=>
		@trigger ImageView.LOADING, event

	_didLoad:(event=null)=>
		item = @_loaderGroup.getItem(@src)
		if item?
			if @_loading?.element?
				TweenMax.to(@_loading.element, .2, {
					opacity: 0,
					ease: Quad.easeOut,
					onComplete: ()=>
						@removeChild @_loading if @_loading.isAttached
						_image = item.tag.cloneNode(true)
						@_invalidateImage(_image)
				})

	_didError:(event=null)=>
		TweenMax.to(@_loading.element, .3, {
			opacity: 0,
			ease: Quad.easeOut
		})
