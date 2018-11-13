###*
@class VideoCanvas
@extends BaseDOM
@submodule caim.media.video
###
class VideoCanvas extends BaseDOM

	@const PAUSE:'pause'
	@const RESUME:'resume'
	@const STOP:'stop'
	@const PLAY:'play'
	
	@const CANSTART:'canstart'
	@const RUNNING:'running'
	@const LOADING:'loading'
	@const SEEKING_START:'seekingstart'
	@const SEEKING_COMPLETE:'seekingcomplete'
	@const COMPLETE:'complete'
	@const ERROR:'error'

	constructor: (p_srcVideo, p_startFrom=0, p_autoplay=false, p_srcAudio=null) ->
		if !p_srcVideo then throw new Error('The param p_srcVideo is null')
		super()

		if app.detections.os == 'ios'
			p_srcAudio = if !p_srcAudio then p_srcVideo else p_srcAudio
			@audio = new BaseDOM({'element':'audio'})
			@audio.element.on 'durationchange', @ready
			@audio.element.on 'contextmenu', @blockContextMenu
			@audio.attr('src', p_srcAudio)

		@video = new BaseDOM({'element':'video'})
		@canvas = new BaseDOM({'element':'canvas'})
		@appendChild(@canvas)

		@context = @canvas.element.getContext('2d')

		@video.element.on 'durationchange', @ready
		@video.element.on 'contextmenu', @blockContextMenu
		
		@video.attr('src', p_srcVideo)
		@video.attr('preload', 'metadata')

		app.on App.WINDOW_ACTIVE, @windowActive
		app.on App.WINDOW_INACTIVE, @windowInactive

		@autoplay = p_autoplay
		@startFrom = p_startFrom

	blockContextMenu:(evt)=>
		evt.preventDefault()
		return false

	ready:(evt=null)=>
		evt.currentTarget.off 'durationchange', @ready
		if @audio
			return if !@audio.element.duration || @audio.element.duration == NaN || !@video.element.duration || @video.element.duration == NaN

		@canvas.attr('width', @video.element.videoWidth)
		@canvas.attr('height', @video.element.videoHeight)

		if @audio
			@audio.element.on 'seeking', @seekingStart
			@audio.element.on 'seeked', @seekingComplete
			@audio.element.on 'timeupdate', @running
			@audio.element.on 'progress', @loading
			@audio.element.on 'stalled', @error
			@audio.element.on 'ended', @complete
			@audio.element.on 'error', @error
		else
			@video.element.on 'seeking', @seekingStart
			@video.element.on 'seeked', @seekingComplete
			@video.element.on 'timeupdate', @running
			@video.element.on 'progress', @loading
			@video.element.on 'stalled', @error
			@video.element.on 'ended', @complete
			@video.element.on 'error', @error

		@seek = @startFrom
		if document.hasFocus() && @autoplay
			@play()
		@trigger(VideoCanvas.CANSTART, {'duration':@duration})
		return false

	error:(evt=null)=>
		if (@audio && @audio?.element?.error?.message?) || @video?.element?.error?.message?
			@trigger(MediaMobile.ERROR, {'error':@audio.element.error || @video.element.error, 'message':@audio.element.error.message || @video.element.error.message})
		else if evt.message? && evt.code?
			@trigger(VideoCanvas.ERROR, {'error':evt.code, 'message':evt.message})
		else
			@trigger(VideoCanvas.ERROR)
		return false

	seekingStart:(evt=null)=>
		@trigger(VideoCanvas.SEEKING_START, {'position':@seek})
		return false
	
	seekingComplete:(evt=null)=>
		@trigger(VideoCanvas.SEEKING_COMPLETE, {'position':@seek})
		return false

	running:(evt=null)=>
		if @startFrom
			@seek = @startFrom
			@startFrom = null
		
		if @audio
			@video.element.currentTime = @audio.element.currentTime
			@draw(false)
		@trigger(VideoCanvas.RUNNING, {'position':@seek, 'duration':@duration})
		return false

	loading:(evt=null)=>
		i = @video.element.buffered.length
		items = []
		while i--
			items.push {'start':@video.element.buffered.start(i), 'end':@video.element.buffered.end(i)}
		@trigger(VideoCanvas.LOADING, {'buffer':items})
		return false

	complete:(evt=null)=>
		@trigger(VideoCanvas.COMPLETE)
		return false

	togglePlay:(evt=null)=>
		if !@isPaused
			@hasPlayed = false
			@pause()
		else
			@hasPlayed = true
			@resume()
		return false

	windowInactive:(evt=null)=>
		if @hasPlayed
			@pause()
		return false

	windowActive:(evt=null)=>
		if @hasPlayed
			@resume()
		return false

	pause:(evt=null)=>
		if !@isPaused
			if @audio
				@audio.element.pause()
			else
				@video.element.pause()
				@stopRender()
			@trigger(VideoCanvas.PAUSE)
		return false

	resume:(evt=null)=>
		if @isPaused
			if @audio
				@audio.element.play()
			else
				@video.element.play()
				@startRender()
			@trigger(VideoCanvas.RESUME)
		return false

	play:(evt=null)=>
		if @isPaused
			if @audio
				@audio.element.play()
			else
				@video.element.play()
				@startRender()
			@hasPlayed = true
			@trigger(VideoCanvas.PLAY)
		return false

	stop:(evt=null)=>
		if !@isPaused
			if @audio
				@audio.element.pause()
			else
				@video.element.pause()
		if @audio
			@audio.element.currentTime = 0
		else
			@video.element.currentTime = 0
			@stopRender()
		@hasPlayed = false
		@trigger(VideoCanvas.STOP)
		return false

	@get isPaused:->
		return if @audio then @audio.element.paused else @video.element.paused

	@get hasPlayed:->
		return @_hasPlayed
	@set hasPlayed:(p_value)->
		@_hasPlayed = p_value

	@get loop:->
		return if @audio then @audio.element.loop else @video.element.loop
	@set loop:(p_value)->
		if @audio
			@audio.element.loop = p_value
		else
			@video.element.loop = p_value

	@get mute:->
		return if @audio then @audio.element.muted else @video.element.muted
	@set mute:(p_value)->
		if @audio
			@audio.element.muted = p_value
		else
			@video.element.muted = p_value

	@get volume:->
		return if @audio then @audio.element.volume else @video.element.volume
	@set volume:(p_value)->
		if p_value > 1
			p_value = 1
		else if p_value < 0
			p_value = 0
		@video.element.volume = p_value

	@get duration:->
		return @video.element.duration

	@get seek:->
		return @video.element.currentTime
	@set seek:(p_value)->
		if p_value > @video.element.duration
			p_value = @video.element.duration
		else if p_value < 0
			p_value = 0
		
		if @audio
			@audio.element.currentTime = p_value
		else
			@video.element.currentTime = p_value

		@draw(false)

	@get frameImage:()->
		return @canvas.element.toDataURL()

	@get naturalWidth:()->
		return @canvas.element.width

	@get naturalHeight:()->
		return @canvas.element.height

	startRender:(evt=null)=>
		@renderID = window.requestAnimationFrame(@draw)

	stopRender:(evt=null)=>
		window.cancelAnimationFrame(@renderID)

	draw:(p_render=true)=>
		@context.clearRect(0, 0, @video.element.videoWidth, @video.element.videoHeight)
		@context.drawImage(@video.element, 0, 0)
		if p_render
			@renderID = window.requestAnimationFrame(@draw)

	destroy:()=>
		@stop()

		@video.element.off 'contextmenu', @blockContextMenu
		@video.element.off 'durationchange', @ready
		@video.element.off 'seeking', @seekingStart
		@video.element.off 'seeked', @seekingComplete
		@video.element.off 'timeupdate', @running
		@video.element.off 'progress', @loading
		@video.element.off 'ended', @complete

		app.off App.WINDOW_ACTIVE, @windowActive
		app.off App.WINDOW_INACTIVE, @windowInactive

		if @audio
			@video.element.off 'contextmenu', @blockContextMenu
			@video.element.off 'durationchange', @ready
			@video.element.off 'seeking', @seekingStart
			@video.element.off 'seeked', @seekingComplete
			@video.element.off 'timeupdate', @running
			@video.element.off 'progress', @loading
			@video.element.off 'ended', @complete

			@audio.destroy()
			@audio = null

		@video.destroy()
		@video = null

		@canvas.destroy()
		@removeChild(@canvas)
		@canvas = null
		super
