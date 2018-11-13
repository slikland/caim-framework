###*
@class MovieTrackingParser
@submodule caim.media.tracking
###
class MovieTrackingParser

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	MovieTrackingParser::trackingKey = {"Units Per Second":"framesPerSecond", "Source Width":"width", "Source Height":"height", "Position":"position", "Scale":"scale", "Rotation":"rotation", "Frame":"frame", "X pixels":"x", "Y pixels":"y"}

	constructor:()->
		@_trackingData = {}

	_parseBlock: (block)->
		blockItems = undefined
		finalObject = {}
		switch true
			when block[0].indexOf('Motion Trackers') isnt -1
				blockItems = [
					'frame'
					'x'
					'y'
				]
				finalObject.name = /(?:Point \#)(\d)/gi.exec(block[0])[1]
			else
				return null
		itemData = undefined
		itemDataAe = []
		j = 2
		bl = block.length
		while j < bl
			itemData = block[j].replace(/\t|\n/g, ' ').replace(' ', '').split(' ')
			if itemData[itemData.length - 1] == ''
				itemData.pop()
			ji = 0
			while ji < itemData.length
				itemDataAe[itemDataAe.length] = {}
				jii = 0
				while jii < blockItems.length
					itemDataAe[itemDataAe.length - 1][blockItems[jii]] = itemData[ji + jii]
					jii++
				ji += 4
			j++
		finalObject.items = itemDataAe
		finalObject

	parse:(p_string)->
		if p_string.length
			data = p_string.split('\n\n')
			try
				generalData = data[1].split('\u0009')
				i = 1
				gl = generalData.length
				while i < gl
					if @trackingKey[generalData[i]]
						@_trackingData[@trackingKey[generalData[i]]] = generalData[i + 1].replace(/\n/g, '')
					i += 2
				@_trackingData.data = []
				parserResult = undefined
				j = 2
				pl = data.length
				while j < pl
					parserResult = @_parseBlock(data[j].split('\n'))
					if parserResult
						@_trackingData.data.push parserResult
					j++
				return @_trackingData
			catch e
				throw new Error('MovieTrackingParser Error!')
		return

	@parse:(p_string)->
		return MovieTrackingParser.getInstance().parse(p_string)
