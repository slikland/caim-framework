#import slikland.event.EventDispatcher

class BaseMediaPlayer extends EventDispatcher

	@PLAY: 'onPlayMediaPlayer'
	@PAUSE: 'onPauseMediaPlayer'
	@STOP: 'onStopMediaPlayer'
	@PROGRESS: 'onProgressMediaPlayer'

	@ENDED: 'onVideoEnded'
	@PLAYING: 'onVideoPlaying'
	@PAUSED: 'onVideoPaused'
	@BUFFERING: 'onVideoBuffering'
	@PROGRESS: 'onVideoProgress'
	@CUED: 'onVideoCued'
	@VOLUME_CHANGED: 'onVolumeChanged'

	contructor:()->
		#call parent
		super

		#params
		@_isPlaying = false

	# Getters and Setters
	#------------------------------------------
	@get isPlaying:()->
		return @_isPlaying

	@set isPlaying:(value)->
		@_isPlaying = value

	@get duration:()->
		# console.log 'you must override'
		return 0

	@get currentTime:()->
		# console.log 'you must override'
		return 0

	@get volume:()->
		# console.log 'you must override'
		return 0

	@set volume:(value)->
		# console.log 'you must override'

	# Public
	#------------------------------------------
	setVideo:(video)->
		# console.log 'now playing', video

	play:()->
		@_isPlaying = true
		@trigger BaseMediaPlayer.PLAY

	pause:()->
		@_isPlaying = false
		@trigger BaseMediaPlayer.PAUSE

	stop:()->
		@pause()
		@seek 0
		@trigger BaseMediaPlayer.STOP

	seek:(time)->
		# console.log 'seek to', time

	volume:(value)->
		# console.log 'volume to', value

	destroy:()=>
		@stop()

