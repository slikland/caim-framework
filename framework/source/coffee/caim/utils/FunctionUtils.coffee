###*
@class FunctionUtils
@static
@submodule caim.utils
###
class FunctionUtils

  ###*
  @method debounce
  @static
  @param {Function} fn
  @param {Number} delay
  @return {Function}
  ### 
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

  ###*
  @method throttle
  @static
  @param {Function} fn
  @param {Number} [threshhold=250]
  @param {Function} [scope=null]
  @return {Function}
  ### 
  @throttle:(fn, threshhold = 250, scope=null)->
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
