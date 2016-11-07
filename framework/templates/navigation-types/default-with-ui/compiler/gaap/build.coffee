framework:
	root: '../../../../../'
	source: '{framework.root}source/'
	coffee: '{framework.source}coffee/'
	
project:
	root: '../../'
	deploy: '{project.root}deploy/'
	source: '{project.root}source/'
	coffee: '{project.source}coffee/'
	stylus: '{project.source}stylus/'
	vendors: '{project.source}vendors/'
	
sourcePaths: [
	'{framework.coffee}'
	'{project.coffee}'
	'{project.stylus}'
	'{project.vendors}'
]

tasks:
	preloaderJS:
		src: 'project/Preloader.coffee'
		output: '{project.deploy}js/preloader.js'
	
	mainJS:
		src: 'project/Main.coffee'
		output: '{project.deploy}js/main.js'
		depends: 'preloaderJS'
		
	vendors:
		src: 'imports.js'
		output: '{project.deploy}js/vendors.js'
		
	preloaderCSS:
		src: 'preloader.styl'
		output: '{project.deploy}css/preloader.css'
	
	mainCSS:
		src: 'main.styl'
		output: '{project.deploy}css/main.css'
	
	fontsCSS:
		src: 'fonts.styl'
		output: '{project.deploy}css/fonts.css'
