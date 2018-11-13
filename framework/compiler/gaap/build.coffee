paths:
    root: '../../'
    source: '{paths.root}source/'
    coffee: '{paths.source}coffee/'
    
sourcePaths: []

docs:
    name: "Caim Framework"
    description: "Caim Framework"
    version: "3.3.3"
    url: "http://slikland.com/"
    logo: "http://slikland.com/media/images/logo_docs.png"
    source: "{paths.source}"
    options:
        paths: ["{paths.coffee}"]
        output: "../../docs"
