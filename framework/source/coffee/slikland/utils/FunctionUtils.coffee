
class FunctionUtils

  @debounce:(fn, delay)->
    timer = null
    ->
      context = this
      args = arguments
      clearTimeout timer
      timer = setTimeout((->
        fn.apply context, args
        return
      ), delay)
      return

  @throttle:(fn, threshhold = 250, scope)->
    last = undefined
    deferTimer = undefined
    ->
      context = scope or @
      now = +new Date
      args = arguments
      if last and now < last + threshhold
        # hold on to it
        clearTimeout deferTimer
        deferTimer = setTimeout((->
          last = now
          fn.apply context, args
          return
        ), threshhold)
      else
        last = now
        fn.apply context, args
      return