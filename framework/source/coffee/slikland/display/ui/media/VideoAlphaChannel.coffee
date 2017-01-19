#import slikland.anim.AnimationTicker

class VideoAlphaChannel extends BaseComponent

	@const BASE_CLASSNAME: 'video-alpha'

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
			className: @BASE_CLASSNAME
			orientation: 'v'
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		p_options.element = 'canvas'
		super p_options
		@_playing = false
		@create()

	@get context:()->
		return @_context

	@get paused:()->
		return @_video?.element.paused

	@get loop:()->
		return @_video?.element.loop

	@get ended:()->
		return @_video?.element.ended

	@get buffered:()->
		return @_video?.element.buffered

	@get currentTime:()->
		return @_video?.element.currentTime

	@get duration:()->
		return @_video?.element.duration

	@get defaultMuted:()->
		return @_video?.element.defaultMuted

	@get defaultPlaybackRate:()->
		return @_video?.element.defaultPlaybackRate

	componentLayout:()->
		@_buffer = new BaseDOM
			element: 'canvas'
		@_bufferContext = @_buffer.element.getContext('2d')
		@_context = @element.getContext('2d')

	play:()->
		if @_playing
			return
		@_playing = true
		@_video.element.play()

	pause:()->
		@_playing = false
		@_video.element.pause()

	stop:()->
		@seek(0)
		@pause()

	seek:(time = 0)->
		@_video.element.currentTime = time
		setTimeout ()=>
			@_render() if @isAttached
		, 1000/16

	destroy:()->
		@seek(0)
		@pause()
		@_clearVideo()
		@_buffer.destroy()
		super

	_invalidate:()->
		@_clearVideo()
		@_video = @_getVideo(@_options.video)
		@_video.css
			position: 'absolute'
			top: '-10000px'
		if app.detections.name.toLowerCase() is 'safari'
			@_video.css
				display: 'none'
		if !@_video.isAttached
			document.body.appendChild @_video

		@_video.element.on "pause", @_didVideoPause
		@_video.element.on "playing", @_didVideoPlaying
		@_video.element.on "ended", @_didVideoEnd

		@_verticalMode = @_options.orientation is 'v'

		@_options.attrs ?= {}
		vWidth = parseInt(@_options.attrs.width || (if @_verticalMode then @_video.element.videoWidth else @_video.element.videoWidth / 2))
		vHeight = parseInt(@_options.attrs.height || (if @_verticalMode then @_video.element.videoHeight / 2 else @_video.element.videoHeight))
		@_options.attrs.width = vWidth
		@_options.attrs.height = vHeight

		@_buffer.attr
			width: if @_verticalMode then vWidth else vWidth * 2
			height: if @_verticalMode then vHeight * 2 else vHeight
		super

	_render:()=>
		@_bufferContext.drawImage(@_video.element, 0, 0)
		imageData = @_bufferContext.getImageData(0, 0, @width, @height)

		if @_verticalMode
			alphaData = @_bufferContext.getImageData(0, @height, @width, @height)
		else
			alphaData = @_bufferContext.getImageData(@width, 0, @width, @height)

		i = imageData.data.length
		while i > 0
			i -= 4
			imageData.data[i + 3] = alphaData.data[i]

		@_context.clearRect(0, 0, @width, @height)
		@_context.drawImage(@_video.element, 0, 0)
		@_context.putImageData(imageData, 0, 0)

		@_videoRenderer = window.requestAnimationFrame(@_render) if @_playing

	_startRender:()->
		if !@_videoRenderer?
			@_videoRenderer = window.requestAnimationFrame(@_render)

	_stopRender:()->
		window.cancelAnimationFrame @_videoRenderer
		delete @_videoRenderer

	_clearVideo:()->
		if @_video?
			document.body.removeChild @_video
			@_video.element.off "ended", @_didVideoEnd
			@_video.element.off "pause", @_didVideoPause
			@_video.element.off "playing", @_didVideoPlaying
			@_playing = false
			@_stopRender()

	_getVideo:(p_source)->
		if p_source instanceof HTMLVideoElement
			return new BaseDOM {element: p_source}
		else if isPlainObject(p_source)
			return @_getVideo(p_source.tag || p_source.id)
		else if typeof p_source is 'string'
			return @_getVideo(app.loader.getResult(p_source))
		else
			throw new Error('Invalid <video> element')

	_didVideoPlaying:(event)=>
		@_startRender()

	_didVideoPause:(event)=>
		@_stopRender()

	_didVideoEnd:(event)=>
		if !@_video.element.loop
			@_stopRender()

