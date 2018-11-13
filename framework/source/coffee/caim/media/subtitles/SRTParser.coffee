###*
@class SRTParser
@submodule caim.media.subtitles
###
class SRTParser

	@fromString:(p_string = null, p_milliseconds = false)->
		useMs = if p_milliseconds then true else false
		data = p_string.replace(/\r/g, '')
		regex = /(?:(\d+)\n)?(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3}).*?\n([\s\S]*?)(?:\n{2}|\n*$)/g
		items = []
		i = 0
		while item = regex.exec(data)
			items.push
				id: item[1]?.trim()
				startTime: if useMs then @_timeToMilliseconds(item[2].trim()) else item[2].trim()
				endTime: if useMs then @_timeToMilliseconds(item[3].trim()) else item[3].trim()
				text: item[4].trim()
			i += 4
		items

	@toString:(p_object = null)->
		if !p_object instanceof Array
			return ''
		response = ''
		i = 0
		while i < p_object.length
			s = p_object[i]
			if !isNaN(s.startTime) and !isNaN(s.endTime)
				s.startTime = @_millisecondsToTime(parseInt(s.startTime, 10))
				s.endTime = @_millisecondsToTime(parseInt(s.endTime, 10))
			response += s.id + '\u000d\n'
			response += s.startTime + ' --> ' + s.endTime + '\u000d\n'
			response += s.text.replace('\n', '\u000d\n') + '\u000d\n\u000d\n'
			i++
		response

	@_timeToMilliseconds:(p_value)=>
		regex = /(\d+):(\d{2}):(\d{2}),(\d{3})/
		parts = regex.exec(p_value)
		if parts == null
			return 0
		i = 1
		while i < 5
			parts[i] = parseInt(parts[i], 10)
			if isNaN(parts[i])
				parts[i] = 0
			i++
		parts[1] * 3600000 + parts[2] * 60000 + parts[3] * 1000 + parts[4]

	@_millisecondsToTime:(p_value)=>
		measures = [
			3600000
			60000
			1000
		]
		time = []
		for i of measures
			response = (p_value / measures[i] >> 0).toString()
			if response.length < 2
				response = '0' + response
			p_value %= measures[i]
			time.push response
		ms = p_value.toString()
		if ms.length < 3
			i = 0
			while i <= 3 - (ms.length)
				ms = '0' + ms
				i++
		time.join(':') + ',' + ms
