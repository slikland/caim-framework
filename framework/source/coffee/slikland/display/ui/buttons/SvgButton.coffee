#import slikland.display.ui.svg.SvgBundle

class SvgButton extends Button

	@const DEFAULT_OPTIONS: ObjectUtils.merge({
		lineHeight: 1.2
		}, @DEFAULT_OPTIONS)

	constructor:(p_options = {})->
		super p_options

	@get labelText:()->
		return @_labelText

	_layoutButton:()->
		@_label = new Svg
			className: "#{@_options.labelClassName.trim()}"
			attrs:
				width: 0
				height: "#{@_options.lineHeight}em"
		@appendChild @_label
		@_labelText = new Svg.Text
			attrs:
				dy:'1em'
		@_label.appendChild @_labelText
		Resizer.getInstance().on Resizer.RESIZE, @_resize = @_invalidateLayout.bind(@)

	_invalidateLayout:()->
		# Adds Label
		@_labelText.text = @_options.label

		if isPlainObject(@_options.text)
			@_labelText.option('attrs', @_options.text.attrs)

		if @_options.label?
			@_label.appendChild @_labelText if !@_labelText?.isAttached
		else if @_label.isAttached
			@_label.removeChild @_labelText

		window.requestAnimationFrame ()=>
			setImmediate ()=>
				_box = @_labelText.element.getBBox()
				baseFontSize = parseInt(@style('font-size'))
				textFontSize = @_options.lineHeight * parseInt(@_labelText.style('font-size'))
				@_options.lineHeight
				@_label.option('attrs', {
						width: _box.width/baseFontSize+'em'
						height: textFontSize/baseFontSize+'em'
					})

	destroy:()->
		Resizer.getInstance().off Resizer.RESIZE, @_resize
		@_labelText?.destroy()
		super


