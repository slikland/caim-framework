###*
@class SplitTextUtils
@static
@submodule caim.utils
###
class SplitTextUtils
	###*
	Split texts to chars for animations
	@method splitHTMLChars
	@param {HTMLElement} target
	@param {Object} [opt={}]
	@param {String} [className='split-chunk']
	@return {Array}
	###
	@splitHTMLChars:(target, opt = {}, className = 'split-chunk')->
		return @_splitHTML(target, className, opt, @_replaceChars)

	###*
	Split texts to words for animations
	@method splitHTMLWords
	@param {HTMLElement} target
	@param {Object} [opt={}]
	@param {String} [className='split-chunk']
	@return {Array}
	###
	@splitHTMLWords:(target, opt = {}, className = 'split-chunk')->
		return @_splitHTML(target, className, opt, @_replaceWords)

	###*
	Split texts to lines for animations
	@method splitHTMLLines
	@param {HTMLElement} target
	@param {Object} [opt={}]
	@param {String} [className='split-chunk']
	@return {Array}
	###
	@splitHTMLLines:(target, opt = {}, className = 'split-chunk')->
		words = @_splitHTML(target, className, opt, @_replaceWords)
		l = words.length
		i = -1
		lastTop = 0
		lines = []
		line = []
		parents = []
		while ++i < l
			word = words[i]
			word.className = ''
			b = word.getBoundingClientRect()
			if lastTop < b.top
				if line.length > 0
					lines.push(line)
					line = []
				lastTop = b.top
			parent = @_findParentsUntil(word, target)
			if !(parent in parents)
				line.push(parent)
		if line.length > 0
			lines.push(line)
		spans = []
		for line in lines
			span = document.createElement('span')
			span.className = className
			line[0].parentNode.insertBefore(span, line[0])
			for word in line
				span.appendChild(word)
				span.appendChild(document.createTextNode(' '))
			spans.push(span)
		return spans
	
	###*
	@method _findParentsUntil
	@param {HTMLElement} target
	@param {HTMLElement} parent
	@private
	@return {HTMLElement}
	###	
	@_findParentsUntil:(target, parent)->
		if target.parentNode == parent
			return target
		else if target.parentNode == document.body || !target.parentNode
			return target
		else
			return @_findParentsUntil(target.parentNode, parent)

	###*
	@method _splitHTML
	@param {HTMLElement} target
	@param {String} className
	@param {Object} opt
	@param {String} type
	@private
	@return {Array}
	###	
	@_splitHTML:(target, className, opt, type)->
		if target instanceof BaseDOM
			target = target.element

		html = target.innerHTML
		@_currentClassName = className
		replacedHTML = html.replace(/([^\<\>]*)?(\<[^\>]*\>)?/ig, type)

		target.innerHTML = replacedHTML
		items = target.querySelectorAll('.' + className)
		rItems = []
		i = items.length
		while i-- > 0
			rItems[i] = items[i]
		return rItems

		# return new SplitText(target.querySelectorAll('.' + className), opt)

	###*
	@method _replaceChars
	@param {String} match
	@param {String} text
	@param {String} tag
	@private
	@return {String}
	###	
	@_replaceChars:(match, text, tag)=>
		ret = ''
		if text
			ret = text.replace(/(.)/g, '<span class="'+@_currentClassName+'">$1</span>')
			ret = ret.replace(/(> <)/g, ">&nbsp;<")
			ret = "<div class='split-word'>" + ret
			ret = @_replaceAll(ret,'<span class="' + @_currentClassName + '">&nbsp;</span>', "</div>"+'<span class="' + @_currentClassName + '">&nbsp;</span>'+"<div class='split-word'>")
			ret = ret + "</div>"
		if tag
			ret += tag
		return ret

	###*
	@method _replaceWords
	@param {String} match
	@param {String} text
	@param {String} tag
	@private
	@return {String}
	###	
	@_replaceWords:(match, text, tag)=>
		ret = ''
		if text
			ret = text.replace(/([^\s]+)/g, '<span class="'+@_currentClassName+'">$1</span>')
		if tag
			ret += tag
		return ret

	###*
	@method _replaceAll
	@param {String} target
	@param {RegExp} search
	@param {String} replacement
	@private
	@return {String}
	###	
	@_replaceAll:(target, search, replacement)=>
		return target.replace(new RegExp(search, 'g'), replacement)
