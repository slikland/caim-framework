#import caim.media.subtitles.SRTParser

###*
@class VideoSubtitle
@extends BaseDOM
@submodule caim.media.video
###
class VideoSubtitle extends BaseDOM

	constructor:(p_subtitles = null)->
		@source = p_subtitles
		super {
			element: 'div'
		}
		@_caption = new BaseDOM
			element: 'span'
		@appendChild @_caption

	@get source:()->
		return @_source

	@set source:(p_value = null)->
		if typeof p_value is 'string'
			@_source = SRTParser.fromString(p_value, true)
		else if p_value instanceof Array
			@_source = p_value

	seek:(p_seek = 0)->
		return if !@_source? or @_caption.time? and p_seek >= @_caption.time.start and p_seek < @_caption.time.end
		length = @_source.length
		idx = 0
		while length--
			caption = @_source[idx]
			start = caption.startTime/1000
			end = caption.endTime/1000
			if p_seek >= start and p_seek < end
				@_caption.text = caption.text
				@_caption.time = {start:start, end:end}
				break
			else
				@_caption.text = ''
				@_caption.time = null
			idx++

