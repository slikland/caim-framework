#import slikland.display.ui.BaseDisplay

class VideoStartLoop extends BaseDisplay

	@const BASE_CLASSNAME: 'video-start-loop'

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			className: @BASE_CLASSNAME
			image: null
			start: null
			loop: null
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		super p_options
		@_started = false
		@createStart()

	componentLayout:()->
		@_image = new BaseDOM
			element: 'figure'
		super

	@get started:()->
		return @_started

	destroy:()->
		@_currentStartMedia?.element?.off "ended", @_didStartEnd
		@stop()
		super

	play:()->
		if @_currentStartMedia? and @_currentLoopMedia?
			@_currentStartMedia.element.on "ended", @_didStartEnd
			@_started = true
			@_setVideo(@_currentStartMedia)

	stop:()->
		@_currentStartMedia?.element?.pause()
		@_currentLoopMedia?.element?.pause()
		@_currentStartMedia?.destroy()
		@_currentLoopMedia?.destroy()
		@_started = false

	_setVideo:(p_video = null)=>
		if p_video?
			lastVideo = @_currentVideo
			@appendChild @_currentVideo = p_video
			@_currentVideo.element.play()
			if lastVideo?
				lastVideo.element?.pause()
				lastVideo.destroy()

	_didStartEnd:(event=null)=>
		@_setVideo(@_currentLoopMedia)

	_invalidate:()->
		super
		if app.detections.desktop
			if @_options.start? and @_options.loop?
				startVideo = @_getVideo(@_options.start)
				loopVideo = @_getVideo(@_options.loop)
				if @_currentStartMedia?.element isnt startVideo.element
					@_currentStartMedia = startVideo
					@stop() if @_started
				if @_currentLoopMedia?.element isnt loopVideo.element
					@_currentLoopMedia = loopVideo
					@stop() if @_started
		else if @_options.image?.src?
			@stop() if @_started
			if !@_image.image? or (@_options.image.tag? and @_image.image?.element isnt @_options.image.tag)
				@_image.image = new BaseDOM
					className: "#{@constructor.BASE_CLASSNAME}__image"
					element: @_options.image.tag || 'img'
				@_image.appendChild @_image.image
			@_image.image.element.src ?= @_options.image?.src
			@appendChildAt @_image, 0 if !@_image?.isAttached


	_getVideo:(p_source)->
		if p_source instanceof HTMLVideoElement
			return new BaseDOM {element: p_source}
		else if isPlainObject(p_source)
			return @_getVideo(p_source.tag || p_source.id)
		else if typeof p_source is 'string'
			return @_getVideo(app.loader.getResult(p_source))
		else
			throw new Error('Invalid <video> element')

