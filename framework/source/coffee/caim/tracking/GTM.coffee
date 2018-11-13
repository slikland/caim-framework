###*
@class GTM
@submodule caim.tracking
###
class GTM

	constructor:(p_id)->
		`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',p_id);`
		noscript = document.createElement('noscript')
		noscript.innerHTML = "<iframe src='https://www.googletagmanager.com/ns.html?id=#{p_id}' height='0' width='0' style='display:none;visibility:hidden'></iframe>"
		document.body.appendChild noscript

	# Track
	track:(p_params)->
		window.dataLayer?.push p_params
