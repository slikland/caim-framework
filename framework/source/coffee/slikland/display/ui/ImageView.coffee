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

	@const STYLE: ".image-view {position: relative;display: inline-block;width: 200px;height: 200px;overflow: hidden;margin: 0;}.image-view .image-loading {position: absolute;left: 0;right: 0;top: 50%;width: 40%;margin: 0 auto;transform: translateY(-50%) perspective(1px);max-width: 50px;max-height: 50px;opacity: 0;}.small_up .image-view .image-loading {max-width: 100px;max-height: 100px;}.image-view .image-loading:after {content: '';display: block;padding-bottom: 100%;}.image-view .image {position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;pointer-events: none;}.image-view img.image {max-height: 100%;max-width: 100%;}.image-view img.image.left {left: 0 !important;right: auto;}.image-view img.image.right {right: 0 !important;left: auto;}.image-view img.image.top {top: 0 !important;bottom: auto;}.image-view img.image.bottom {bottom: 0 !important;top: auto;}.image-view img.image.cover.wh, .image-view img.image.cover.sq {width: auto;height: 100%;min-width: 100%;max-width: none;max-height: 100%;}.image-view img.image.cover.hw {height: auto;width: 100%;min-height: 100%;max-height: none;max-width: 100%;}.image-view img.image.cover.center {left: 50%;transform: translateX(-50%) perspective(1px);}.image-view img.image.contain {max-height: 100%;max-width: 100%;}.image-view img.image.contain.wh, .image-view img.image.contain.sq {min-width: 100%;}.image-view img.image.contain.hw {min-height: 100%;}.image-view img.image.exact {width: 100%;height: 100%;}.image-view div.image {width: 100%;height: 100%;background-repeat: no-repeat;background-size: auto auto;}.image-view div.image.center {background-position: center center;}.image-view div.image.center.left {background-position: left center;}.image-view div.image.center.right {background-position: right center;}.image-view div.image.top {background-position: center top;}.image-view div.image.top.left {background-position: left top;}.image-view div.image.top.right {background-position: right top;}.image-view div.image.bottom {background-position: center bottom;}.image-view div.image.bottom.left {background-position: left bottom;}.image-view div.image.bottom.right {background-position: right bottom;}.image-view div.image.left {right: auto;}.image-view div.image.right {left: auto;}.image-view div.image.top {bottom: auto;}.image-view div.image.bottom {top: auto;}.image-view div.image.none {background-size: auto auto;}.image-view div.image.auto {background-size: auto auto !important;}.image-view div.image.exact {background-size: 100% 100% !important;}.image-view div.image.contain {background-size: contain !important;}.image-view div.image.cover {background-size: cover !important;}.image-view .loader {position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: 0 auto;opacity: 0.3;font-size: 10px;text-indent: -9999em;border-radius: 50%;border-top: 1.1em solid rgba(255,255,255,0.2);border-right: 1.1em solid rgba(255,255,255,0.2);border-bottom: 1.1em solid rgba(255,255,255,0.2);border-left: 1.1em solid #fff;transform: translateZ(0) translateY(-50%) perspective(1px);animation: loading 1.1s infinite linear;}@-moz-keyframes loading {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}@-webkit-keyframes loading {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}@-o-keyframes loading {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}@keyframes loading {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}"

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
					@_invalidateImage(_loaded.cloneNode())
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
						_image = item.tag?.cloneNode()
						@_invalidateImage(_image)
				})

	_didError:(event=null)=>
		TweenMax.to(@_loading.element, .3, {
			opacity: 0,
			ease: Quad.easeOut
		})
