#import slikland.data.LocalStorage
#import slikland.data.CookiesStorage

class ClientData

	@STORAGES: [CookiesStorage, LocalStorage, BaseStorage]

	@getStorage:()=>
		@_storage ?= (()=>
			i = 0
			while i < @STORAGES.length
				classStorage = @STORAGES[i]
				if classStorage? and classStorage.isEnable()
					return new classStorage()
				i++
		)()
