###*
@class MediaDOM
@extends BaseDOM
@submodule caim.media
###
class MediaDOM extends BaseDOM

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

	constructor: (p_src, p_startFrom=0, p_autoplay=false) ->
		if !p_src then throw new Error('The param p_src is null')
		@_type = if p_src.replace(/^.*\./i,'') == 'mp4' then 'video' else 'audio'
		super({element:@_type})

		@element.on 'contextmenu', @blockContextMenu
		@element.on 'durationchange', @ready
		
		@attr('src', p_src)
		@attr('preload', 'metadata')

		app.on App.WINDOW_ACTIVE, @windowActive
		app.on App.WINDOW_INACTIVE, @windowInactive

		@startFrom = p_startFrom
		@autoplay = p_autoplay

	blockContextMenu:(evt)=>
		evt.preventDefault()
		return false

	ready:(evt=null)=>
		@element.off 'durationchange', @ready

		@element.on 'seeking', @seekingStart
		@element.on 'seeked', @seekingComplete
		@element.on 'timeupdate', @running
		@element.on 'progress', @loading
		@element.on 'stalled', @error
		@element.on 'ended', @complete
		@element.on 'error', @error

		@seek = @startFrom
		if document.hasFocus() && @autoplay
			@play()

		@trigger(MediaDOM.CANSTART, {'duration':@duration})
		return false

	error:(evt=null)=>
		if @element.error?.message?
			@trigger(MediaDOM.ERROR, {'error':@element.error, 'message':@element.error.message})
		else if evt.message? && evt.code?
			@trigger(MediaDOM.ERROR, {'error':evt.code, 'message':evt.message})
		else
			@trigger(MediaDOM.ERROR)
		return false

	seekingStart:(evt=null)=>
		@trigger(MediaDOM.SEEKING_START, {'position':@seek})
		return false
	
	seekingComplete:(evt=null)=>
		@trigger(MediaDOM.SEEKING_COMPLETE, {'position':@seek})
		return false

	running:(evt=null)=>
		if @startFrom
			@seek = @startFrom
			@startFrom = null

		@trigger(MediaDOM.RUNNING, {'position':@seek, 'duration':@duration})
		return false

	loading:(evt=null)=>
		i = @element.buffered.length
		items = []
		while i--
			items.push {'start':@element.buffered.start(i), 'end':@element.buffered.end(i)}
		@trigger(MediaDOM.LOADING, {'buffer':items})
		return false

	complete:(evt=null)=>
		@trigger(MediaDOM.COMPLETE)
		return false

	windowInactive:(evt=null)=>
		if @hasPlayed
			@pause()
		return false

	windowActive:(evt=null)=>
		if @hasPlayed
			@resume()
		return false

	togglePlay:(evt=null)=>
		if !@isPaused
			@hasPlayed = false
			@pause()
		else
			@hasPlayed = true
			@resume()
		return false
	pause:(evt=null)=>
		if !@isPaused
			@element.pause()
			@trigger(MediaDOM.PAUSE)
		return false

	resume:(evt=null)=>
		if @isPaused
			@element.play()
			@trigger(MediaDOM.RESUME)
		return false

	play:(evt=null)=>
		if @isPaused
			@element.play()
			@hasPlayed = true
			@trigger(MediaDOM.PLAY)
		return false

	stop:(evt=null)=>
		if !@isPaused
			@element.pause()
		@element.currentTime = 0
		@hasPlayed = false
		@trigger(MediaDOM.STOP)
		return false

	@get type:->
		return @_type

	@get isPaused:->
		return @element.paused

	@get hasPlayed:->
		return @_hasPlayed
	@set hasPlayed:(p_value)->
		@_hasPlayed = p_value

	@get loop:->
		return @element.loop
	@set loop:(p_value)->
		@element.loop = p_value

	@get mute:->
		return @element.muted
	@set mute:(p_value)->
		@element.muted = p_value

	@get volume:->
		return @element.volume
	@set volume:(p_value)->
		if p_value > 1
			p_value = 1
		else if p_value < 0
			p_value = 0
		@element.volume = p_value

	@get duration:->
		return @element.duration

	@get seek:->
		return @element.currentTime
	@set seek:(p_value)->
		if p_value > @element.duration
			p_value = @element.duration
		else if p_value < 0
			p_value = 0
		@element.currentTime = p_value

	destroy:()=>
		@element.off 'contextmenu', @blockContextMenu
		@element.off 'durationchange', @ready
		@element.off 'seeking', @seekingStart
		@element.off 'seeked', @seekingComplete
		@element.off 'timeupdate', @running
		@element.off 'progress', @loading
		@element.off 'ended', @complete

		app.off App.WINDOW_ACTIVE, @windowActive
		app.off App.WINDOW_INACTIVE, @windowInactive
		
		@stop()
		super
