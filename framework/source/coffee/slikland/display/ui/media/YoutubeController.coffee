#import slikland.display.ui.media.YoutubePlayer

class YoutubeController extends EventDispatcher

	@COMPLETE: 'onYoutubeComplete'

	@getInstance:()=>
		@instance ?= new @(arguments...)

	@initialize:()=>
		# Prepares and Load the Youtube API
		`(function (isMobile) {
			if(!isMobile) {
				var tag = document.createElement('script');
				tag.src = "//www.youtube.com/iframe_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			}
		}(app.detections.mobile));`
		@getInstance()

	constructor:()->
		super

		#params
		@_isReady = false
		@_players = []
		@_queueCreate = []

		#wait youtube ready
		@on YoutubeController.COMPLETE, @_createPlayersQueue

		#check if is ready
		listener = setInterval ()=>
			if typeof YT is 'object' and YT.loaded
				@_isReady = true
				@trigger YoutubeController.COMPLETE
				clearInterval listener
		, 100

	# Public
	#------------------------------------------
	createPlayer: (wrapper, options, callback)->
		player = false
		if !@_isReady
			@_queueCreate.push
				w: wrapper
				o: options
				c: callback
		else
			player = @_createPlayer wrapper, options, callback
		return player

	pauseAll:()->
		player.pause() for player in @_players

	stopAll:()->
		player.stop() for player in @_players

	getCover:(id, size = 'max')->
		if size is 'max'
			return "//img.youtube.com/vi/#{id}/maxresdefault.jpg"
		else
			return "//img.youtube.com/vi/#{id}/#{size}.jpg"

	# Private
	#------------------------------------------
	_createPlayer:(wrapper, options = {}, callback)->
		try
			_p = new YoutubePlayer(wrapper, options, callback)
		catch err
			throw err
		@_players.push
			wrapper: wrapper
			player: _p
		return _p

	_createPlayersQueue:(event=null)=>
		event?.target.off YoutubeController.COMPLETE
		# Creates the Queued Instances
		while @_queueCreate.length > 0
			item = @_queueCreate.shift()
			@_createPlayer(item.w, item.o, item.c)
