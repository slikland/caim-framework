###*
@class ShareUtils
@static
@submodule caim.utils
###
class ShareUtils

	###*
	@method twitter
	@static
	@param {String} p_text
	@param {String} [p_url=null]
	@param {String} [p_hashtags=null] separated by commas like 'digital,web,programming'
	@param {Boolean} [p_trigger=false]
	@return {String}
	###
	@twitter:(p_text, p_url=null, p_hashtags=null, p_trigger=false)->
		url = 'https://twitter.com/intent/tweet?'
		if p_text    then url += '&text=' + encodeURI(p_text)
		if p_hashtags then url += '&hashtags=' + encodeURI(p_hashtags)
		if p_url     then url += '&url=' + encodeURI(p_url)
		if p_trigger then ShareUtils.open(url)
		return url

	###*
	@method facebook
	@static
	@param {String} p_url
	@param {Boolean} [p_trigger=false]
	@return {String}
	###
	@facebook:(p_url, p_trigger=false)->
		url = 'https://www.facebook.com/sharer/sharer.php?u=' + p_url
		if p_trigger then ShareUtils.open(url)
		return url

	###*
	@method googleplus
	@static
	@param {String} p_url
	@param {Boolean} [p_trigger=false]
	@return {String}
	###
	@googleplus:(p_url, p_trigger=false)->
		url = 'https://plus.google.com/share?url=' + encodeURI(p_url)
		if p_trigger then ShareUtils.open(url)
		return url

	###*
	@method linkedin
	@static
	@param {String} p_url
	@param {String} [p_title=null]
	@param {String} [p_summary=null]
	@param {String} [p_source=null]
	@param {Boolean} [p_trigger=false]
	@return {String}
	###
	@linkedin:(p_url, p_title=null, p_summary=null,p_source=null, p_trigger=false)->
		url = 'https://www.linkedin.com/shareArticle?mini=true'
		params = []
		if p_url     then params.push('url=' + encodeURI(p_url))
		if p_title   then params.push('title=' + encodeURI(p_title))
		if p_summary then params.push('summary=' + encodeURI(p_summary))
		if p_source  then params.push('url=' + encodeURI(p_source))
		url += params.join('&')
		if p_trigger then ShareUtils.open(url)
		return url

	###*
	@method pinterest
	@static
	@param {String} p_url
	@param {String} [p_media=null]
	@param {String} [p_description=null]
	@param {Boolean} [p_trigger=false]
	@return {String}
	###
	@pinterest:(p_url, p_media=null, p_description=null, p_trigger=false)->
		url = 'http://www.pinterest.com/pin/create/button/?'
		params = []
		if p_url         then params.push('url=' + encodeURI(p_url))
		if p_media       then params.push('media=' + encodeURI(p_media))
		if p_description then params.push('description=' + encodeURI(p_description))
		url += params.join('&')
		if p_trigger then ShareUtils.open(url)
		return url

	###*
	@method email
	@static
	@param {String} p_email
	@param {String} [p_subject=null]
	@param {String} [p_body=null]
	@param {Boolean} [p_trigger=false]
	@return {String}
	###
	@email:(p_email, p_subject=null, p_body=null, p_trigger=false)->
		url = 'mailto:?'+p_email
		params = []
		if p_subject then params.push('subject=' + encodeURI(p_subject))
		if p_body    then params.push('body=' + encodeURI(p_body))
		url += params.join('&')
		if p_trigger
			ShareUtils.open(url, '_blank')
		return url

	###*
	@method open
	@static
	@param {String} p_url
	@param {String} [p_name=""]
	@param {String} [p_style="width=640,height=480"]
	@return {String}
	###
	@open:(p_url, p_name='', p_style='width=640,height=480')->
		window.open(p_url,p_name,p_style)

	###*
	@method _location
	@static
	@private
	@param {String} p_url
	###
	@_location:(p_url)->
		window.location.href = p_url
