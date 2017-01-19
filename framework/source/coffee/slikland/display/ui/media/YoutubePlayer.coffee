#import slikland.display.BaseDOM
#import slikland.display.ui.media.BaseMediaPlayer

class YoutubePlayer extends BaseMediaPlayer

	@URL_MATCH: /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/g

	@URL_TEST: /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/

	constructor:(wrapper, options, callback)->
		#call parent
		super()

		#params
		@_wrapper = wrapper

		@_container = new BaseDOM
			element: 'div'
			className: 'youtube-player'

		@_wrapper.appendChild @_container.element

		@_options = options
		@_callback = callback
		@_currentVideoId = ''
		@_isReady = false
		@_progressTimer = false
		@_progressEnable = false
		@_lastVolume = 0
		@_defaults =
			width: '100%'
			height: '100%'
			playerVars:
				html5: 1
				theme: 'light'
				rel: 0
				showinfo: 0
				autoplay: 1
			events: {}

		#listeners
		if options.videoId?
			@_currentVideoId = options.videoId
			@_defaults.videoId = options.videoId

		@_defaults.events.onReady = @_playerReady
		@_defaults.events.onStateChange = @_playerStateChange

		#create player
		@_player = new YT.Player(@_container.element, @_defaults)

	@get player:()->
		return @_player

	@get element:()->
		return @_container.element

	# Override EventDispatcher
	#------------------------------------------
	on:(p_event, p_handler, p_useCapture=false)->
		super
		if p_event == BaseMediaPlayer.PROGRESS
			@_progressEnable = true
			if @_progressTimer then @_startVideoProgress()

	# Override BaseVideoPlayer
	#------------------------------------------
	setVideo:(media, cover = null)->
		YoutubePlayer.URL_MATCH.lastIndex = 0

		@_matched = false

		while (m = YoutubePlayer.URL_MATCH.exec(media)) != null
			if m.index == YoutubePlayer.URL_MATCH.lastIndex
				YoutubePlayer.URL_MATCH.lastIndex++
			@_currentVideoId = m[1]
			@_matched = true

		@_currentVideoId = media if !@_matched

		@_player.cueVideoById @_currentVideoId
		@_player.setPlaybackQuality('highres') #set to maximum quality

	stopVideo:()->
		@_player.pauseVideo()
		@_player.seekTo(0)
		@_player.stopVideo()

	play: ()=>
		@_player.playVideo()
		super

	pause: ()=>
		@_player.pauseVideo()
		super

	getCover:(p_cover=null, size = 'max')->
		return p_cover if p_cover?
		if size is 'max'
			return "//img.youtube.com/vi/#{@_currentVideoId}/maxresdefault.jpg"
		else
			return "//img.youtube.com/vi/#{@_currentVideoId}/#{size}.jpg"

	# Private
	#------------------------------------------
	_playerReady:(event)=>
		@_isReady = true
		@_container.destroy() if @_container?
		@_container = new BaseDOM
			element: event.target.a
		if typeof @_callback is 'function'
			setTimeout ()=>
				@_callback?(@)
			, 100

	_playerStateChange:(e)=>
		switch e.data
			when YT.PlayerState.ENDED
				@isPlaying = false
				@_stopVideoProgress()
				@trigger(BaseMediaPlayer.ENDED)
				break
			when YT.PlayerState.PLAYING
				@isPlaying = true
				@_startVideoProgress()
				@trigger(BaseMediaPlayer.PLAYING)
				break
			when YT.PlayerState.PAUSED
				@isPlaying = false
				@_stopVideoProgress()
				@trigger(BaseMediaPlayer.PAUSED)
				break
			when YT.PlayerState.BUFFERING
				@trigger(BaseMediaPlayer.BUFFERING)
				break
			when YT.PlayerState.CUED
				@trigger(BaseMediaPlayer.CUED)
				break

	_stopVideoProgress:()->
		if @_progressTimer
			clearInterval(@_progressTimer)
			@_progressTimer = false

	_startVideoProgress:()->
		#avoid duplicate
		@_stopVideoProgress()

		#get video length
		duration = @_player.getDuration()

		#avoid progress when disabled
		if @_progressEnable
			@_progressTimer = setInterval =>
					time = @_player.getCurrentTime()
					@trigger(BaseMediaPlayer.PROGRESS, time / duration)
				,100
		else
			@_progressTimer = true

	destroy:=>
		super
		@_player?.destroy()
		@removeAll(true)
