#import caim.utils.Prototypes
#import caim.utils.NumberUtils

###*
@class ArrayUtils
@submodule caim.utils
@static
###
class ArrayUtils

	###*
	Removes an item from an array.
	@method removeItem
	@static
	@param {Array} p_array The array that contains the item that should be removed.
	@param {Object} p_item The item to be removed from the array.
	@param {Boolean} [p_clone=false] Apply and return changes to a cloned array.
	@return {Array} An array with the removed items.
	###
	@removeItem:(p_array, p_item, p_clone=false)->
		result = if p_clone then p_array.slice(0) else p_array
		for k,v in result
			if k is p_item then result.splice(v, 1)
		return result

	###*
	Removes an item by index from an array.
	@method removeItemByIndex
	@param {Number} p_index The index to be removed from the array.
	@param {Array} p_array The array that contains the item that should be removed.
	@param {Boolean} [p_clone=false] Apply and return changes to a cloned array.
	@return {Array} An array with the removed item.
	@static
	###
	@removeItemByIndex:(p_index, p_array, p_clone=false)->
		result = if p_clone then p_array.slice(0) else p_array
		result.splice(p_index, 1)
		return result

	###*
	Removes all strings duplicated from an array.
	@method removeDuplicateStrings
	@param {Array} p_array The array where the duplicates string should be removed.
	@return {Array} An array with the removed item.
	@static
	###
	@removeDuplicateStrings:(p_array)->
		return p_array.filter((el,pos,self)-> return self.indexOf(el) is pos )

	###*
	Finds element in array and returns boolean value
	@method hasItem
	@param {Object} p_value
	@param {Array} p_array The array to be used as reference.
	@return {Boolean} The resulting boolean.
	@static
	###
	@hasItem:(p_value, p_array)->
		return p_array.indexOf(p_value) > -1

	###*
	Returns a new merged array.
	@method merge
	@static
	@param {Array} p_arrayA The array to be used as reference A.
	@param {Array} p_arrayB The array to be used as reference B.
	@return {Array} Returns a new merged array.
	###
	@merge:(p_arrayA, p_arrayB)->
		i = 0
		j = 0
		result = []
		while (i < p_arrayA.length) || (j < p_arrayB.length)
			if i < p_arrayA.length
				result.push(p_arrayA[i])
				i++

			if j < p_arrayB.length
				result.push(p_arrayB[j])
				j++
		return result

	###*
	Returns a random index inside the range of the array.
	@method randomIndex
	@static
	@param {Array} p_array The array to be used as reference.
	@return {Number} A random number valid index.
	###
	@randomIndex:(p_array)->
		return NumberUtils.rangeRandom(0, p_array.length-1, true)

	###*
	Returns a random item within an array.
	@method randomItem
	@param {Array} p_array The array to be used as reference.
	@return {Object} The resulting object.
	@static
	###
	@randomItem:(p_array)->
		return p_array[ArrayUtils.randomIndex(p_array)]

	###*
	Shuffles the order of the items in an array.
	@method shuffle
	@static
	@param {Array} p_array The array to shuffled.
	@param {Boolean} [p_clone=false] Apply and return changes to a cloned array.
	@return {Array} The resulting object.
	###
	@shuffle:(p_array, p_clone=false)->
		result = if p_clone then p_array.slice(0) else p_array
		for item,i in result
			random = Math.floor(Math.random() * result.length)
			temp = result[i]
			result[i] = result[random]
			result[random] = temp
		return result

	###*
	Move some item to another position in an array.
	@method move
	@static
	@param {Array} p_array The array to Array.
	@param {Number} p_oldIndex The number to old index.
	@param {Number} p_newIndex The number to new index.
	@param {Boolean} [p_clone=false] Apply and return changes to a cloned array.
	@return {Array} The resulting object.
	###
	@move:(p_array, p_oldIndex, p_newIndex, p_clone=false)->
		result = if p_clone then p_array.slice(0) else p_array
		if p_newIndex >= result.length
			k = new_index - result.length
			while (k--) + 1
				result.push(undefined)
		result.splice(p_newIndex, 0, result.splice(p_oldIndex, 1)[0])
		return result
	
	###*
	Shuffles the order of the items from middle to end
	@method fromMiddleToEnd
	@static
	@param {Array} p_array The array to shuffled.
	@return {Array} The resulting object.
	###	
	@fromMiddleToEnd:(p_array) ->
		len = p_array.length
		midLen = Math.floor(len * 0.5)
		first = p_array.slice(midLen, len)
		last = p_array.slice(0, midLen).reverse()
		merged = @merge first, last
		return merged
	
	###*
	Shuffles the order of the items from end to middle
	@method fromEndToMiddle
	@static
	@param {Array} p_array The array to shuffled.
	@return {Array} The resulting object.
	###	
	@fromEndToMiddle:(p_array) ->
		return @fromMiddleToEnd(p_array).reverse()
	
	###*
	@method lastIndexOf
	@static
	@param {Array} p_array
	@param {Object} p_value
	@return {Number} The resulting index.
	###	
	@lastIndexOf:(p_array, p_value)->
		i = 0
		total = p_array.length
		index = -1
		while i != total
			if p_array[i] == p_value
				index = i
			i++
		return index
