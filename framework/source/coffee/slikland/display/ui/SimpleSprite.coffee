#import slikland.display.BaseDOM
#import slikland.anim.SpriteSheetAnimation

class SimpleSprite extends BaseComponent

	@const PLAY:	'play-sprite'
	@const PAUSE:	'pause-sprite'
	@const STOP:	'stop-sprite'

	@const PLAY_COMPLETE:	'play-sprite-complete'

	@const BASE_CLASSNAME: 'simple-sprite'

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
		className: @BASE_CLASSNAME
		element: 'figure'
		sprite: null
		labels: null
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		super p_options
		@create()

	componentLayout:()->
		@_animation = new SpriteSheetAnimation null, 24
		@_animation.on SpriteSheetAnimation.COMPLETE, @_playComplete
		@_image
		super

	createComplete:()->
		TweenMax.set @_animation.element, {autoAlpha:0}
		super

	destroy:()->
		@_animation.off SpriteSheetAnimation.COMPLETE, @_playComplete
		super

	addLabel:(name, start, end = null)->
		@_animation.addLabel(name, start, end)

	play:(playData = null)=>
		if @_animation.parent
			TweenMax.to @_animation.element, .4, {autoAlpha:1}
			@_animation.play(playData)
			@trigger @constructor.PLAY

	pause:()=>
		if @_animation.parent
			@_animation.pause()
			@trigger @constructor.PAUSE

	pause:()=>
		if @_animation.parent
			@trigger @constructor.STOP

	_playComplete:()=>
		@trigger @constructor.PLAY_COMPLETE

	_invalidate:()->
		super
		if isPlainObject(@_options.sprite)
			sprite = @_options.sprite
			if (typeof sprite.json?.src is 'string' and sprite.json?.src?) and !sprite.json.tag
				sprite.json.tag = app.loader.getResult(sprite.json.id)
			if sprite.json.tag?
				@_animation.data = sprite
				@appendChild @_animation if !@_animation.isAttached
				if Array.isArray(sprite.labels)
					for label in sprite.labels
						@addLabel(label.name, label.start, label.end)
			else if typeof sprite.image?.src is 'string' and sprite.image?.src?
				if !@_image? or (sprite.image.tag? and @_image?.element isnt sprite.image.tag)
					@_image = new BaseDOM
						className: "#{@constructor.BASE_CLASSNAME}__icon-image"
						element: sprite.image.tag?.cloneNode(true) || 'img'
				if @_image?
					@_image?.element.src ?= sprite.image?.src
					@appendChild @_image if !@_image?.isAttached



