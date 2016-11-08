(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
/**
EventDispatcher class for handling and triggering events.
@class EventDispatcher
 */
var EventDispatcher;
if (!EventDispatcher) {
  EventDispatcher = (function() {
    function EventDispatcher() {
      this._triggerStacked = __bind(this._triggerStacked, this);
      this.trigger = __bind(this.trigger, this);
    }
    EventDispatcher.prototype._events = null;
    /**
    		Add a event listener.
    		@method on
    		@param {String} event Event name.
    		@param {function} handler A callback function to handle the event.<br>
    		The callback function can receive 1 or 2 parameters. The first parameter is the event data itself and the second parameter is the custom data of the triggering event.
    		@example
    			function someEventHandler(e, data)
    			{
    				console.log(e); // Returns event data with it's type and target/currentTarget set to the scope
    				console.log(data); // If the triggering event has any custom data
    			}
    			var ed = new EventDispatcher()
    			ed.on('someEvent', someEventHandler);
     */
    EventDispatcher.prototype.on = function(p_event, p_handler) {
      if (!this._events) {
        this._events = {};
      }
      if (!this._events[p_event]) {
        this._events[p_event] = [];
      }
      if (!(__indexOf.call(this._events[p_event], p_handler) >= 0)) {
        return this._events[p_event].unshift(p_handler);
      }
    };
    /**
    		Remove an event listener.
    		**BEWARE**
    		> Calling this method without a handler will remove all listeners attached to this event.
    		> If calling without the event name, will remove all listeners attached to this instance.
    		@method off
    		@param {String} [event=null] Event name.
    		@param {function} [handler=null]
    		A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
     */
    EventDispatcher.prototype.off = function(p_event, p_handler) {
      var events, i;
      if (p_event == null) {
        p_event = null;
      }
      if (p_handler == null) {
        p_handler = null;
      }
      if (!this._events) {
        this._events = {};
        return;
      }
      if ((p_event != null) && Boolean(this._events[p_event])) {
        events = this._events[p_event];
        if (!p_handler) {
          return this._events[p_event].length = 0;
        } else {
          while ((i = events.indexOf(p_handler)) >= 0) {
            events.splice(i, 1);
          }
          return this._events[p_event] = events;
        }
      } else {
        return this._events = {};
      }
    };
    /**
    		Triggers an event.
    		@method trigger
    		@param {String} event Event name.
    		@param {object} [data=null] Custom event data.
    		@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.
    		@example
    			var ed = new EventDispatcher()
    			// Will just trigger the event
    			ed.trigger('someEvent'); 
    			// Will trigger the event with the object which can be retrieved by the second
    			// parameter of the handler function.
    			ed.trigger('someEvent', {someData: true}); 
    			// Will set the event target to window. On the handler's first parameter
    			//`event.target` will be window, and event.currentTarget will be the `ev` instance.
    			ed.trigger('someEvent', {someData: true}, window);
     */
    EventDispatcher.prototype.trigger = function(evt, data, target, sourceEvent) {
      var e, events, i, k, v, _i, _len, _results;
      if (data == null) {
        data = null;
      }
      if (target == null) {
        target = null;
      }
      if (sourceEvent == null) {
        sourceEvent = null;
      }
      if (Array.isArray(evt)) {
        for (_i = 0, _len = evt.length; _i < _len; _i++) {
          e = evt[_i];
          this.trigger(evt, data);
        }
        return;
      }
      if (!this._events) {
        this._events = {};
      }
      events = this._events[evt];
      if (!events || events.length === 0) {
        return;
      }
      if (!target) {
        target = this;
      }
      e = {
        type: evt,
        target: target,
        currentTarget: this,
        originalEvent: sourceEvent
      };
      if (sourceEvent != null) {
        e.preventDefault = function() {
          return typeof sourceEvent.preventDefault === "function" ? sourceEvent.preventDefault() : void 0;
        };
        e.stopPropagation = function() {
          return typeof sourceEvent.stopPropagation === "function" ? sourceEvent.stopPropagation() : void 0;
        };
      }
      if (typeof data === 'object') {
        for (k in data) {
          v = data[k];
          if (!e[k]) {
            e[k] = v;
          }
        }
      }
      i = events.length;
      _results = [];
      while (i-- > 0) {
        _results.push(typeof events[i] === "function" ? events[i](e, data) : void 0);
      }
      return _results;
    };
    /**
    		Check if a event handler is already set.
    		@method hasEvent
    		@param {String} event Event name.
    		@param {function} [handler=null] A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
    		@return {Boolean}
     */
    EventDispatcher.prototype.hasEvent = function(p_event, p_handler) {
      var event;
      if (!this._events) {
        this._events = {};
        return;
      }
      for (event in this._events) {
        if (event === p_event) {
          if (this._events[event].indexOf(p_handler) > -1) {
            return true;
          }
        }
      }
      return false;
    };
    /**
    		Triggers an event after the current code block has finished processing.
    		This is useful for stacking up events that needs to be triggered at the end of the function but it's validating beforehand.
    		@method stackTrigger
    		@param {String} event Event name.
    		@param {object} [data=null] Custom event data.
    		@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.
    		@example
    			var ed = new EventDispatcher()
    			var someObject = {a: true, b: false, c: true};
    			ed.on('isA', function(){console.log('Is A!');});
    			ed.on('isB', function(){console.log('Is B!');});
    			ed.on('isC', function(){console.log('Is C!');});
    			function test()
    			{
    				console.log("Init test()");
    				if(someObject.a) ed.stackTrigger('isA');
    				if(someObject.b) ed.stackTrigger('isB');
    				if(someObject.c) ed.stackTrigger('isC');
    				console.log("End test()");
    			}
    			// This will result in:
    			// log: 'Init test()'
    			// log: 'End test()'
    			// log: 'isA'
    			// log: 'isC'
     */
    EventDispatcher.prototype.stackTrigger = function(evt, data, target) {
      if (data == null) {
        data = null;
      }
      if (target == null) {
        target = null;
      }
      if (!this._stackTriggerer) {
        this._stackTriggerer = [];
      }
      this._stackTriggerer.push([evt, data, target]);
      clearTimeout(this._stackTriggerTimeout);
      return this._stackTriggerTimeout = setTimeout(this._triggerStacked, 0);
    };
    EventDispatcher.prototype._triggerStacked = function() {
      var i, l;
      l = this._stackTriggerer.length;
      i = -1;
      while (++i < l) {
        this.trigger.apply(this, this._stackTriggerer[i]);
      }
      return this._stackTriggerer.length = 0;
    };
    return EventDispatcher;
  })();
}
var App, app, windowLoaded;
App = (function(_super) {
  __extends(App, _super);
  App.project_version_raw = "SL_PROJECT_VERSION:0.0.0";
  App.project_date_raw = "SL_PROJECT_DATE:0000000000000";
  App.FRAMEWORK_VERSION = "2.2.15";
  function App() {
    App.__super__.constructor.apply(this, arguments);
  }
  App.prototype.getInfo = function() {
    var info;
    info = {};
    info.versionRaw = App.project_version_raw === void 0 || App.project_version_raw === 'undefined' ? 'SL_PROJECT_VERSION:' + 'Not versioned' : App.project_version_raw;
    info.version = info.versionRaw.replace('SL_PROJECT_VERSION:', '');
    info.lastUpdateRaw = App.project_date_raw === void 0 || App.project_date_raw === 'undefined' ? 'SL_PROJECT_DATE:' + 'Not versioned' : App.project_date_raw;
    info.lastUpdate = new Date(parseFloat(info.lastUpdateRaw.replace('SL_PROJECT_DATE:', '')));
    return info;
    return this._checkWindowActivity();
  };
  App.prototype._checkWindowActivity = function() {
    var _ref, _ref1, _ref2, _ref3;
    this._hidden = 'hidden';
    if (_ref = this._hidden, __indexOf.call(document, _ref) >= 0) {
      document.addEventListener('visibilitychange', this._windowVisibilityChange);
    } else if (_ref1 = (this._hidden = 'mozHidden'), __indexOf.call(document, _ref1) >= 0) {
      document.addEventListener('mozvisibilitychange', this._windowVisibilityChange);
    } else if (_ref2 = (this._hidden = 'webkitHidden'), __indexOf.call(document, _ref2) >= 0) {
      document.addEventListener('webkitvisibilitychange', this._windowVisibilityChange);
    } else if (_ref3 = (this._hidden = 'msHidden'), __indexOf.call(document, _ref3) >= 0) {
      document.addEventListener('msvisibilitychange', this._windowVisibilityChange);
    } else if (__indexOf.call(document, 'onfocusin') >= 0) {
      document.onfocusin = document.onfocusout = this._windowVisibilityChange;
    } else {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this._windowVisibilityChange;
    }
    if (document[this._hidden] !== void 0) {
      return this._windowVisibilityChange.call(window, {
        type: document[this._hidden] ? 'blur' : 'focus'
      });
    }
  };
  App.prototype._windowVisibilityChange = function(evt) {
    var err, eventType, evtMap, h, hidden, newEvent, v, _ref;
    v = 'visible';
    h = 'hidden';
    evtMap = {
      focus: false,
      focusin: false,
      pageshow: false,
      blur: true,
      focusout: true,
      pagehide: true
    };
    evt = evt || window.event;
    if (_ref = evt.type, __indexOf.call(evtMap, _ref) >= 0) {
      hidden = evtMap[evt.type];
    } else {
      hidden = document[this._hidden];
    }
    eventType = hidden ? 'windowInactive' : 'windowActive';
    try {
      return this.dispatchEvent(new Event(eventType));
    } catch (_error) {
      err = _error;
      newEvent = document.createEvent('Event');
      newEvent.initEvent(eventType, true, true);
      return this.dispatchEvent(newEvent);
    }
  };
  return App;
})(EventDispatcher);
if (!app) {
  app = new App();
}
windowLoaded = (function(_this) {
  return function() {
    if (window.remove) {
      window.remove('load', windowLoaded);
    } else if (window.detachEvent) {
      window.detachEvent('onload', windowLoaded);
    } else {
      window.onload = null;
    }
    return app.trigger('windowLoad');
  };
})(this);
if (window.addEventListener) {
  window.addEventListener('load', windowLoaded);
} else if (window.attachEvent) {
  window.attachEvent('onload', windowLoaded);
} else {
  window.onload = windowLoaded;
}
/**
Debug Class
@class Debug
@static
@final
 */
var Debug,
  __slice = [].slice;
Debug = (function() {
  function Debug() {}
  Debug.debug = false;
  Debug.light = 0x48b224;
  Debug.dark = 0x2c035d;
  /**
  	@method init
  	@static
   */
  Debug.init = function() {
    var c, err, re, t, _ref;
    Debug._console = window.console;
    try {
      Debug._log = Function.prototype.bind.call((_ref = Debug._console) != null ? _ref.log : void 0, Debug._console);
    } catch (_error) {
      err = _error;
    }
    if (window.Debug == null) {
      window.Debug = Debug;
    }
    if (!Debug.check()) {
      eval('window[Math.random()]()');
    }
    re = new RegExp(/debug=(1|true)/i);
    Debug.debug = re.test(window.location.search);
    re = new RegExp(/debug=(0|false)/i);
    if (!Debug.debug && !re.test(window.location.search)) {
      re = new RegExp(/([\.|\/]local\.|localhost|127\.0\.0\.1|192\.\d+\.\d+\.\d+|dev\.s\d+\.slikland\.)/i);
      Debug.debug = re.test(window.location.href);
    }
    if (!Debug.debug || !window.console) {
      window.console = {
        assert: function() {},
        clear: function() {},
        count: function() {},
        debug: function() {},
        dir: function() {},
        dirxml: function() {},
        error: function() {},
        exception: function() {},
        group: function() {},
        groupCollapsed: function() {},
        groupEnd: function() {},
        info: function() {},
        log: function() {},
        profile: function() {},
        profileEnd: function() {},
        table: function() {},
        time: function() {},
        timeEnd: function() {},
        timeStamp: function() {},
        trace: function() {},
        warn: function() {}
      };
    } else {
      t = '====================';
      t += '\n';
      t += '   DEBUG MODE ON';
      t += '\n';
      t += '--------------------';
      t += '\n';
      t += 'Framework';
      t += '\n';
      t += 'Version: ' + App.FRAMEWORK_VERSION;
      t += '\n';
      t += '--------------------';
      t += '\n';
      t += 'Project';
      t += '\n';
      t += 'Version: ' + app.getInfo().version;
      t += '\n';
      t += 'Last update: ' + app.getInfo().lastUpdate;
      t += '\n';
      t += '====================';
      c = 'color: #' + Math.floor(Math.random() * 16777215).toString(16);
      console.log('%c' + t, c);
    }
    return false;
  };
  /**
  	@method check
  	@param {String} [value = null]
  	@return {String}
  	@static
   */
  Debug.check = function(value) {
    var c, col, o, sign;
    if (value == null) {
      value = null;
    }
    o = '';
    c = '';
    col = this.light;
    while (col > 0) {
      c = String.fromCharCode(col & 0xFF) + c;
      col >>= 8;
    }
    o += btoa(c);
    c = '';
    col = this.dark;
    while (col > 0) {
      c = String.fromCharCode(col & 0xFF) + c;
      col >>= 8;
    }
    o += btoa(c);
    sign = o.toLowerCase();
    if (value) {
      return sign === value.toLowerCase();
    } else {
      return sign.charAt(0) === 's' && sign.charAt(1) === 'l';
    }
  };
  /**
  	@method log
  	@static
   */
  Debug.log = function() {
    if (Debug._log != null) {
      return typeof Debug._log === "function" ? Debug._log.apply(Debug, arguments) : void 0;
    } else {
      try {
        return console.log.apply(console, arguments);
      } catch (_error) {}
    }
  };
  /**
  	@method logTime
  	@param {Array} args...
  	@static
   */
  Debug.logTime = function() {
    var args, s, st, style, t, v;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    t = new Date().getTime();
    if (!this.itm) {
      this.itm = this.ctm = t;
    }
    st = t - this.ctm;
    v = st.toString();
    while (v.length < 6) {
      v = ' ' + v;
    }
    s = v + '|';
    v = (this.ctm - this.itm).toString();
    while (v.length < 6) {
      v = ' ' + v;
    }
    s = s + v;
    s = ['%c' + s + ':'];
    style = 'font-weight: bold;';
    if (st > 100) {
      style += 'color: red;';
    } else if (st > 50) {
      style += 'color: orange;';
    }
    s.push(style);
    Debug.log.apply(this, [].concat(s, args));
    return this.ctm = t;
  };
  return Debug;
})();
if (!window.atob) {
  window.atob = function(value) {
    var b0, b1, b2, c0, c1, c2, c3, cs, i, l, ret;
    cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    l = value.length;
    i = 0;
    ret = '';
    while (i < l) {
      c0 = value.charAt(i);
      c1 = value.charAt(i + 1);
      c2 = value.charAt(i + 2);
      c3 = value.charAt(i + 3);
      c0 = cs.indexOf(c0);
      c1 = cs.indexOf(c1);
      c2 = cs.indexOf(c2);
      c3 = cs.indexOf(c3);
      if (c2 < 0) {
        c2 = 0;
      }
      if (c3 < 0) {
        c3 = 0;
      }
      b0 = (c0 << 2 & 0xFF) | c1 >> 4;
      b1 = (c1 << 4 & 0xFF) | c2 >> 2;
      b2 = (c2 << 6 & 0xFF) | c3 & 0x3F;
      ret += String.fromCharCode(b0);
      ret += String.fromCharCode(b1);
      ret += String.fromCharCode(b2);
      i += 4;
    }
    return ret;
  };
  window.btoa = function(value) {
    var b0, b1, b2, c0, c1, c2, c3, cs, i, l, ret;
    cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    l = value.length;
    i = 0;
    ret = '';
    while (i < l) {
      b0 = value.charCodeAt(i + 0) & 0xFF;
      b1 = value.charCodeAt(i + 1) & 0xFF;
      b2 = value.charCodeAt(i + 2) & 0xFF;
      c0 = b0 >> 2 & 0x3F;
      c1 = (b0 << 4 | b1 >> 4) & 0x3F;
      c2 = (b1 << 2 | b2 >> 6) & 0x3F;
      c3 = b2 & 0x3F;
      ret += cs.charAt(c0) + cs.charAt(c1) + cs.charAt(c2) + cs.charAt(c3);
      i += 3;
    }
    i = l % 3;
    l = ret.length;
    if (i === 1) {
      ret = ret.substr(0, l - 2) + "==";
    } else if (i === 2) {
      ret = ret.substr(0, l - 1) + "=";
    }
    return ret;
  };
}
window.Debug = Debug;
Debug.init();
/**
This is actually not a Class. It's a bunch of helper methods adding prototype methods to native classes.
@class Prototypes
 */
var isIE, __scopeIE8;
isIE = function() {
  var nav;
  nav = navigator.userAgent.toLowerCase();
  if (nav.indexOf('msie') !== -1) {
    return parseInt(nav.split('msie')[1]);
  } else {
    return false;
  }
};
if (isIE() === 8) {
  __scopeIE8 = document.createElement("IE8_" + Math.random());
}
/**
This method is a decorator to create constant variable to a class.  
A extending class cannot override this constant either can't be reassigned.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @const
@example
	class A
		\@const PI: 3.14
	console.log(A.PI) // 3.14
	class B extends A
		\@const PI: 3.14159 // Will throw error
	console.log(B.PI) // Already thrown error before, but will be 3.14
 */
Function.prototype["const"] = function(p_prop) {
  var name, o, value, __scope;
  __scope = __scopeIE8 ? __scopeIE8 : this;
  for (name in p_prop) {
    value = p_prop[name];
    o = {};
    o.get = function() {
      return value;
    };
    o.set = function() {
      throw new Error("Can't set const " + name);
    };
    o.configurable = true;
    o.enumerable = true;
    Object.defineProperty(__scope, name, o);
  }
  return null;
};
/**
EXPERIMENTAL
This method is a decorator to protect a property of a class instance removing the property name from enumerable list.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @protectProperties
@example
	class A
		\@protectProperties ["_a", "_b"]
		constructor:()->
			@_a = 1
	console.log(new A()) // Will not list _a either _b as enumerable
 */
Function.prototype.protectProperties = function(p_props) {
  var name, o, __scope, _base, _i, _len;
  console.warn('@protectProperties is an experimental feature. Use with caution.');
  p_props = [].concat(p_props);
  if ((_base = this.prototype)['___'] == null) {
    _base['___'] = {};
  }
  __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  for (_i = 0, _len = p_props.length; _i < _len; _i++) {
    name = p_props[_i];
    o = {};
    o['get'] = function() {
      return this.___[name];
    };
    o['set'] = function(value) {
      return this.___[name] = value;
    };
    o.enumerable = false;
    Object.defineProperty(__scope, name, o);
  }
  return null;
};
/**
Getter decorator for a class instance.  
With this decorator you're able to assign a getter method to a variable.  
Also for a special case, you can assign a scope to the getter so you can create static getter to a class.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @get
@example
	// Instance getter
	class A
		\@get test:()->
			return 'Hello world!'
	a = new A()
	console.log(a.test) // Hello world!
	// Static getter
	class A
		\@get \@, TEST:()->
			return 'Hello world!'
	console.log(A.TEST) // Hello world!
 */
Function.prototype.get = function(scope, p_prop) {
  var enumerable, getter, name, __scope;
  enumerable = false;
  if (!p_prop) {
    p_prop = scope;
    __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  } else {
    enumerable = true;
    __scope = scope;
  }
  for (name in p_prop) {
    getter = p_prop[name];
    Object.defineProperty(__scope, name, {
      get: getter,
      configurable: true,
      enumerable: enumerable
    });
  }
  return null;
};
/**
Setter decorator for a class instance.  
With this decorator you're able to assign a setter method to a variable.  
Also for a special case, you can assign a scope to the setter so you can create static setter to a class.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @set
@example
	// Instance getter / stter
	class A
		\@get test:()->
			return \@_test
		\@set test:(value)->
			\@_test = value
	a = new A()
	a.test = 'Hello setter'
	console.log(a.test) // Hello setter
	// Static getter / setter
	class A
		\@get \@, TEST:()->
			return @_TEST
		\@set \@, TEST:(value)->
			\@_TEST = value
	A.TEST = 'Hello setter'
	console.log(A.TEST) // Hello setter
 */
Function.prototype.set = function(scope, p_prop) {
  var enumerable, name, setter, __scope;
  enumerable = false;
  if (!p_prop) {
    p_prop = scope;
    __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  } else {
    enumerable = true;
    __scope = scope;
  }
  for (name in p_prop) {
    setter = p_prop[name];
    Object.defineProperty(__scope, name, {
      set: setter,
      configurable: true,
      enumerable: enumerable
    });
  }
  return null;
};
if (!("bind" in Function.prototype)) {
  Function.prototype.bind = function(owner) {
    var args, that;
    that = this;
    if (arguments_.length <= 1) {
      return function() {
        return that.apply(owner, arguments_);
      };
    } else {
      args = Array.prototype.slice.call(arguments_, 1);
      return function() {
        return that.apply(owner, (arguments_.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments_))));
      };
    }
  };
}
if (!("trim" in String.prototype)) {
  String.prototype.trim = function(char) {
    if (char == null) {
      char = null;
    }
    return this.ltrim(char).rtrim(char);
  };
}
String.prototype.ltrim = function(char) {
  var re;
  if (char == null) {
    char = null;
  }
  if (!char) {
    char = '\\s';
  }
  re = new RegExp('^' + char + '*');
  re.global = true;
  re.multiline = true;
  return this.replace(re, '');
};
String.prototype.rtrim = function(char) {
  var re;
  if (char == null) {
    char = null;
  }
  if (!char) {
    char = '\\s';
  }
  re = new RegExp(char + '*$');
  re.global = true;
  re.multiline = true;
  return this.replace(re, '');
};
String.prototype.padLeft = function(length, char) {
  var text;
  if (char == null) {
    char = ' ';
  }
  if (char.length === 0) {
    char = ' ';
  }
  text = this;
  while (text.length < length) {
    text = char + text;
  }
  return text;
};
String.prototype.padRight = function(length, char) {
  var text;
  if (char == null) {
    char = ' ';
  }
  if (char.length === 0) {
    char = ' ';
  }
  text = this;
  while (text.length < length) {
    text += char;
  }
  return text;
};
if (!("isArray" in Array.prototype)) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
if (!("indexOf" in Array.prototype)) {
  Array.prototype.indexOf = function(find, i) {
    var n;
    if (i === void 0) {
      i = 0;
    }
    if (i < 0) {
      i += this.length;
    }
    if (i < 0) {
      i = 0;
    }
    n = this.length;
    while (i < n) {
      if (i in this && this[i] === find) {
        return i;
      }
      i++;
    }
    return -1;
  };
}
if (!("lastIndexOf" in Array.prototype)) {
  Array.prototype.lastIndexOf = function(find, i) {
    if (i === void 0) {
      i = this.length - 1;
    }
    if (i < 0) {
      i += this.length;
    }
    if (i > this.length - 1) {
      i = this.length - 1;
    }
    i++;
    while (i-- > 0) {
      if (i in this && this[i] === find) {
        return i;
      }
    }
    return -1;
  };
}
if (!("forEach" in Array.prototype)) {
  Array.prototype.forEach = function(action, that) {
    var i, n, _results;
    i = 0;
    n = this.length;
    _results = [];
    while (i < n) {
      if (i in this) {
        action.call(that, this[i], i, this);
      }
      _results.push(i++);
    }
    return _results;
  };
}
if (!("map" in Array.prototype)) {
  Array.prototype.map = function(mapper, that) {
    var i, n, other;
    other = new Array(this.length);
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this) {
        other[i] = mapper.call(that, this[i], i, this);
      }
      i++;
    }
    return other;
  };
}
if (!("filter" in Array.prototype)) {
  Array.prototype.filter = function(filter, that) {
    var i, n, other, v;
    other = [];
    v = void 0;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && filter.call(that, v = this[i], i, this)) {
        other.push(v);
      }
      i++;
    }
    return other;
  };
}
if (!("every" in Array.prototype)) {
  Array.prototype.every = function(tester, that) {
    var i, n;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && !tester.call(that, this[i], i, this)) {
        return false;
      }
      i++;
    }
    return true;
  };
}
if (!("some" in Array.prototype)) {
  Array.prototype.some = function(tester, that) {
    var i, n;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && tester.call(that, this[i], i, this)) {
        return true;
      }
      i++;
    }
    return false;
  };
}
Node.prototype.on = Node.prototype.addEventListener;
Node.prototype.off = Node.prototype.removeEventListener;
if (navigator.mediaDevices == null) {
  navigator.mediaDevices = {};
}
navigator.getUserMedia = navigator.mediaDevices.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
var NumberUtils;
NumberUtils = (function() {
  function NumberUtils() {}
  NumberUtils.isEven = function(p_value) {
    if (p_value % 2 === 0) {
      return true;
    } else {
      return false;
    }
  };
  NumberUtils.isZero = function(p_value) {
    return Math.abs(p_value) < 0.00001;
  };
  NumberUtils.toPercent = function(p_value, p_min, p_max) {
    return ((p_value - p_min) / (p_max - p_min)) * 100;
  };
  NumberUtils.percentToValue = function(p_percent, p_min, p_max) {
    return ((p_max - p_min) * p_percent) + p_min;
  };
  NumberUtils.getBytesAsMegabytes = function(p_bytes) {
    return (Math.floor((p_bytes / 1024 / 1024) * 100) / 100) + " MB";
  };
  NumberUtils.bytesTo = function(p_bytes) {
    if (p_bytes >= 1000000000) {
      return (p_bytes / 1000000000).toFixed(2) + ' GB';
    } else if (p_bytes >= 1000000) {
      return (p_bytes / 1000000).toFixed(2) + ' MB';
    } else if (p_bytes >= 1000) {
      return (p_bytes / 1000).toFixed(2) + ' KB';
    } else if (p_bytes > 1) {
      return p_bytes + ' bytes';
    } else if (p_bytes === 1) {
      return p_bytes + ' byte';
    } else {
      return '0 byte';
    }
  };
  NumberUtils.rangeRandom = function(p_low, p_high, p_rounded) {
    if (p_rounded == null) {
      p_rounded = false;
    }
    if (!p_rounded) {
      return (Math.random() * (p_high - p_low)) + p_low;
    } else {
      return Math.round(Math.round(Math.random() * (p_high - p_low)) + p_low);
    }
  };
  NumberUtils.distanceBetweenCoordinates = function(p_from, p_to, p_units) {
    var a, c, dLatitude, dLongitude, radius;
    if (p_units == null) {
      p_units = "km";
    }
    radius;
    switch (p_units) {
      case "km":
        radius = 6371;
        break;
      case "meters":
        radius = 6378000;
        break;
      case "feet":
        radius = 20925525;
        break;
      case "miles":
        radius = 3963;
    }
    dLatitude = (p_to.x - p_from.x) * Math.PI / 180;
    dLongitude = (p_to.y - p_from.y) * Math.PI / 180;
    a = Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) + Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(p_from.x * Math.PI / 180) * Math.cos(p_to.x * Math.PI / 180);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
  };
  return NumberUtils;
})();
/**
Bunch of utilities methods for Array
@class ArrayUtils
@static
 */
var ArrayUtils;
ArrayUtils = (function() {
  function ArrayUtils() {}
  ArrayUtils.removeItem = function(p_array, p_item, p_clone) {
    var k, result, v, _i, _len;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (v = _i = 0, _len = result.length; _i < _len; v = ++_i) {
      k = result[v];
      if (k === p_item) {
        result.splice(v, 1);
      }
    }
    return result;
  };
  ArrayUtils.removeItemByIndex = function(p_index, p_array, p_clone) {
    var result;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    result.splice(p_index, 1);
    return result;
  };
  ArrayUtils.removeDuplicateStrings = function(p_array, p_clone) {
    if (p_clone == null) {
      p_clone = false;
    }
    return p_array.filter(function(el, pos, self) {
      return self.indexOf(el) === pos;
    });
  };
  ArrayUtils.hasItem = function(p_value, p_array) {
    return p_array.indexOf(p_value) > -1;
  };
  ArrayUtils.merge = function(p_arrayA, p_arrayB) {
    var i, j, result;
    i = 0;
    j = 0;
    result = [];
    while ((i < p_arrayA.length) || (j < p_arrayB.length)) {
      if (i < p_arrayA.length) {
        result.push(p_arrayA[i]);
        i++;
      }
      if (j < p_arrayB.length) {
        result.push(p_arrayB[j]);
        j++;
      }
    }
    return result;
  };
  ArrayUtils.randomIndex = function(p_array) {
    return NumberUtils.rangeRandom(0, p_array.length - 1, true);
  };
  ArrayUtils.randomItem = function(p_array) {
    return p_array[ArrayUtils.randomIndex(p_array)];
  };
  ArrayUtils.shuffle = function(p_array, p_clone) {
    var i, item, random, result, temp, _i, _len;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (i = _i = 0, _len = result.length; _i < _len; i = ++_i) {
      item = result[i];
      random = Math.floor(Math.random() * result.length);
      temp = result[i];
      result[i] = result[random];
      result[random] = temp;
    }
    return result;
  };
  ArrayUtils.move = function(p_array, p_oldIndex, p_newIndex, p_clone) {
    var k, result;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    if (p_newIndex >= result.length) {
      k = new_index - result.length;
      while ((k--) + 1) {
        result.push(void 0);
      }
    }
    result.splice(p_newIndex, 0, result.splice(p_oldIndex, 1)[0]);
    return result;
  };
  ArrayUtils.fromMiddleToEnd = function(p_array) {
    var first, last, len, merged, midLen;
    len = p_array.length;
    midLen = Math.floor(len * 0.5);
    first = p_array.slice(midLen, len);
    last = p_array.slice(0, midLen).reverse();
    merged = this.merge(first, last);
    return merged;
  };
  ArrayUtils.fromEndToMiddle = function(p_array) {
    return this.fromMiddleToEnd(p_array).reverse();
  };
  ArrayUtils.lastIndexOf = function(p_array, p_value) {
    var i, index, total;
    i = 0;
    total = p_array.length;
    index = -1;
    while (i !== total) {
      if (p_array[i] === p_value) {
        index = i;
      }
      i++;
    }
    return index;
  };
  return ArrayUtils;
})();
var ObjectUtils;
ObjectUtils = (function() {
  function ObjectUtils() {}
  ObjectUtils.count = function(p_item) {
    var key, result;
    result = 0;
    for (key in p_item) {
      result++;
    }
    return result;
  };
  ObjectUtils.toArray = function(p_source) {
    var k, result, v;
    result = [];
    for (k in p_source) {
      v = p_source[k];
      result.push(p_source[k]);
    }
    return result;
  };
  ObjectUtils.merge = function(a, b) {
    var k;
    if (isPlainObject(a) && isPlainObject(b)) {
      for (k in b) {
        if (!a.hasOwnProperty(k)) {
          a[k] = b[k];
        } else {
          a[k] = ObjectUtils.merge(a[k], b[k]);
        }
      }
    }
    return a;
  };
  ObjectUtils.clone = function(p_target) {
    var copy, err, i, k, len, v;
    try {
      if (!p_target || typeof p_target !== 'object') {
        return p_target;
      }
      copy = null;
      if (p_target instanceof Array) {
        copy = [];
        i = 0;
        len = p_target.length;
        while (i < len) {
          copy[i] = this.clone(p_target[i]);
          i++;
        }
        return copy;
      }
      if (p_target instanceof Object) {
        copy = {};
        for (k in p_target) {
          v = p_target[k];
          if (v !== 'object') {
            copy[k] = v;
          } else {
            copy[k] = this.clone(v);
          }
        }
        return copy;
      }
    } catch (_error) {
      err = _error;
      return JSON.parse(JSON.stringify(p_target));
    }
  };
  ObjectUtils.hasSameKey = function(p_a, p_b) {
    if (Object.getOwnPropertyNames(p_a)[0] === Object.getOwnPropertyNames(p_b)[0]) {
      return true;
    } else {
      return false;
    }
  };
  ObjectUtils.isEqual = function(p_a, p_b) {
    return JSON.stringify(p_a) === JSON.stringify(p_b);
  };
  ObjectUtils.parseLinkedArray = function(p_source) {
    var i, item, j, names, numNames, o, ret;
    if (!p_source || (p_source && p_source.length < 1)) {
      return [];
    }
    i = p_source.length;
    names = p_source[0];
    numNames = names.length;
    ret = [];
    while (i-- > 1) {
      o = {};
      j = numNames;
      item = p_source[i];
      while (j-- > 0) {
        o[names[j]] = item[j];
      }
      ret[i - 1] = o;
    }
    return ret;
  };
  return ObjectUtils;
})();
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.isPlainObject=e()}}(function(){return function e(t,r,n){function o(f,u){if(!r[f]){if(!t[f]){var c="function"==typeof require&&require;if(!u&&c)return c(f,!0);if(i)return i(f,!0);var p=new Error("Cannot find module '"+f+"'");throw p.code="MODULE_NOT_FOUND",p}var s=r[f]={exports:{}};t[f][0].call(s.exports,function(e){var r=t[f][1][e];return o(r?r:e)},s,s.exports,e,t,r,n)}return r[f].exports}for(var i="function"==typeof require&&require,f=0;f<n.length;f++)o(n[f]);return o}({1:[function(e,t,r){"use strict";function n(e){return o(e)===!0&&"[object Object]"===Object.prototype.toString.call(e)}var o=e("isobject");t.exports=function(e){var t,r;return n(e)===!1?!1:(t=e.constructor,"function"!=typeof t?!1:(r=t.prototype,n(r)===!1?!1:r.hasOwnProperty("isPrototypeOf")===!1?!1:!0))}},{isobject:2}],2:[function(e,t,r){"use strict";t.exports=function(e){return null!=e&&"object"==typeof e&&!Array.isArray(e)}},{}]},{},[1])(1)});;
/**
Bunch of utilities methods for String
@class StringUtils
@static
 */
var StringUtils,
  __slice = [].slice;
StringUtils = (function() {
  function StringUtils() {}
  /**
  	Check in a search in the string and returns whether it contains the sentence.
  	@method hasString
  	@static
  	@param {String} p_string The variable to validate.
  	@param {String} p_search The value to search in variable.
  	@return {Boolean}
   */
  StringUtils.hasString = function(p_string, p_search) {
    if (p_string.split(p_search).length !== 1) {
      return true;
    } else {
      return false;
    }
  };
  /**
  	A basic method of replace a sentence in a String.
  	@method replace
  	@static
  	@param {String} p_string The variable to replace.
  	@param {String} p_from - The string to search in variable.
  	@param {String} p_to - The value to replace.
  	@return {String}
   */
  StringUtils.replace = function(p_string, p_from, p_to) {
    return p_string.split(p_from).join(p_to);
  };
  /**
  	A method to revert a content of a String.
  	@method reverse
  	@static
  	@param {String} p_string The variable to reverse.
  	@return {String}
   */
  StringUtils.reverse = function(p_string) {
    if (!p_string) {
      return "";
    }
    return p_string.split("").reverse().join("");
  };
  /**
  	A method to convert the string to camel case
  	@method toCamelCase
  	@static
  	@param {String} p_string - The value to camellcase.
  	@return {String}
   */
  StringUtils.toCamelCase = function(p_string) {
    var re;
    re = p_string.replace(/([\+\-_ ][a-z])/g, function($1) {
      return $1.toUpperCase().replace(/[\+\-_ ]/, "");
    });
    return re.charAt(0).toUpperCase() + re.slice(1);
  };
  /**
  	A method to remove the white spaces in a String.
  	@method removeWhiteSpace
  	@static
  	@param {String} p_string - The value to remove the white spaces.
  	@return {String}
   */
  StringUtils.removeWhiteSpace = function(p_string) {
    if (!p_string) {
      return "";
    }
    return this.trim(p_string).replace(/\s+/g, "");
  };
  /**
  	A method to remove HTML tags in a String.
  	@method removeHTMLTag
  	@static
  	@param {String} p_string - The value to remove the HTML tags.
  	@return {String}
   */
  StringUtils.removeHTMLTag = function(p_string) {
    return p_string.replace(/<.*?>/g, "");
  };
  /**
  	A method to remove special characters in a String.
  	@method removeSpecialChars
  	@static
  	@param {String} p_string The value to remove the special characters.
  	@return {String}
   */
  StringUtils.removeSpecialChars = function(p_string) {
    return p_string.replace(/[^a-zA-Z 0-9]+/g, '');
  };
  /**
  	A method to convert a numeric string to brazillian CPF format. (XXX.XXX.XXX-XX)
  	@method convertToCPF
  	@static
  	@param {String} p_string - The value to format.
  	@return {String}
   */
  StringUtils.convertToCPF = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 9) {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1' + "." + "$2" + "." + "$3" + "-" + "$4");
    } else if (p_string.length > 6) {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1' + "." + "$2" + "." + "$3");
    } else if (p_string.length > 3) {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1' + "." + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1');
    }
    return p_string;
  };
  /**
  	A method to convert a numeric string to brazillian CEP format. (XXXXX-XXX)
  	@method convertToCEP
  	@static
  	@param {String} p_string - The value to format.
  	@return {String}
   */
  StringUtils.convertToCEP = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 5) {
      p_string = p_string.replace(/(\d{0,5})(\d{0,3})/, '$1' + "-" + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,5})(\d{0,3})/, '$1');
    }
    return p_string;
  };
  /**
  	A method to convert a numeric string to date format. (XX/XX/XXXX)
  	@method convertToDate
  	@static
  	@param {String} p_string - The value to format.
  	@return {String}
   */
  StringUtils.convertToDate = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 4) {
      p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, '$1' + "/" + "$2" + "/" + "$3");
    } else if (p_string.length > 2) {
      p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, '$1' + "/" + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, '$1');
    }
    return p_string;
  };
  /**
  	A method to check if the String is empty.
  	@method isEmpty
  	@static
  	@param {String} p_string - The value to remove the white spaces.
  	@return {Bollean}
   */
  StringUtils.isEmpty = function(p_string) {
    if (!p_string || p_string === "") {
      return true;
    } else {
      return false;
    }
  };
  /**
  	A method to capitalize case the String
  	@method toCapitalizeCase
  	@static
  	@param {String} p_string - The value to capitalize case.
  	@return {String}
   */
  StringUtils.toCapitalizeCase = function(p_string) {
    var str;
    str = this.trimLeft(p_string);
    return str.replace(/(^\w)/, this._upperCase);
  };
  /**
  	A method to convert milisecounds (Number) in a String on time format.
  	@method toTimeFormat
  	@static
  	@param {Number} p_miliseconds - The number in milisecounds.
  	@param {Bollean} p_decimal - Value if is a decimal format.
  	@return {String}
   */
  StringUtils.toTimeFormat = function(p_miliseconds, p_decimal) {
    var minutes, seconds;
    if (p_decimal == null) {
      p_decimal = true;
    }
    minutes = Math.floor(p_miliseconds / 60);
    seconds = Math.floor(p_miliseconds % 60);
    return String(p_decimal ? this.addDecimalZero(minutes) + ":" + this.addDecimalZero(seconds) : minutes + ":" + seconds);
  };
  /**
  	A method to add a zero before if the p_value is smaller that 10 and bigger that -1.
  	@method addDecimalZero
  	@static
  	@param {Number} p_value
  	@return {String}
   */
  StringUtils.addDecimalZero = function(p_value) {
    if (p_value < 10) {
      return "0" + p_value;
    }
    return String(p_value);
  };
  /**
  	A method to abbreviate a String.
  	@method abbreviate
  	@static
  	@param {String} p_string The text to abbreviate.
  	@param {Number} p_max_length the length to text.
  	@param {String} p_indicator - The value of the end String.
  	@param {String} p_split - The value to before p_indicator and after text.
  	@return {String}
   */
  StringUtils.abbreviate = function(p_string, p_max_length, p_indicator, p_split) {
    var badChars, charCount, n, pieces, result;
    if (p_max_length == null) {
      p_max_length = 50;
    }
    if (p_indicator == null) {
      p_indicator = '...';
    }
    if (p_split == null) {
      p_split = ' ';
    }
    if (!p_string) {
      return "";
    }
    if (p_string.length < p_max_length) {
      return p_string;
    }
    result = '';
    n = 0;
    pieces = p_string.split(p_split);
    charCount = pieces[n].length;
    while (charCount < p_max_length && n < pieces.length) {
      result += pieces[n] + p_split;
      charCount += pieces[++n].length + p_split.length;
    }
    if (n < pieces.length) {
      badChars = ['-', '—', ',', '.', ' ', ':', '?', '!', '', "\n", ' ', String.fromCharCode(10), String.fromCharCode(13)];
      while (badChars.indexOf(result.charAt(result.length - 1)) !== -1) {
        result = result.slice(0, -1);
      }
      result = this.trim(result) + p_indicator;
    }
    if (n === 0) {
      result = p_string.slice(0, p_max_length) + p_indicator;
    }
    return result;
  };
  /**
  	A method to convert a String to Boolean (yes | true | 1 | no | false | 0).
  	@method toBoolean
  	@static
  	@param {String} p_string The value to converting.
  	@return {Boolean}
   */
  StringUtils.toBoolean = function(p_string) {
    var t;
    t = ['yes', 'true', '1', 1, true];
    if (p_string && ArrayUtils.hasItem(p_string, t)) {
      return true;
    }
    return false;
  };
  /**
  	A method to returns a random String with the specified length.
  	@method random
  	@static
  	@param {Number} p_length The length of the random.
  	@return {String}
   */
  StringUtils.random = function(p_length) {
    var i, s, _i;
    if (p_length == null) {
      p_length = 10;
    }
    s = "";
    for (i = _i = p_length; p_length <= 1 ? _i <= 1 : _i >= 1; i = p_length <= 1 ? ++_i : --_i) {
      s += String.fromCharCode(65 + Math.floor(Math.random() * 25));
    }
    return s;
  };
  /**
  	Trim
  	@method trim
  	@static
  	@param {String} p_str
  	@param {String} p_char
  	@return {String}
   */
  StringUtils.trim = function(p_str, p_char) {
    if (p_str === null) {
      return "";
    }
    return this.trimRight(this.trimLeft(p_str, p_char), p_char);
  };
  /**
  	Trim Right
  	@method trimRight
  	@static
  	@param {String} p_str
  	@param {String} p_char
  	@return {String}
   */
  StringUtils.trimRight = function(p_str, p_char) {
    var re;
    if (!p_str) {
      return "";
    }
    re = new RegExp(p_char + '*$');
    re.global = true;
    re.multiline = true;
    return p_str.replace(re, '');
  };
  /**
  	Trim left
  	@method trimLeft
  	@static
  	@param {String} p_str
  	@param {String} p_char
  	@return {String}
   */
  StringUtils.trimLeft = function(p_str, p_char) {
    var re;
    if (!p_str) {
      return "";
    }
    re = new RegExp('^' + p_char + '*');
    re.global = true;
    re.multiline = true;
    return p_str.replace(re, '');
  };
  /**
  	Replace special characters
  	@method replaceSpecialCharacters
  	@static
  	@param {String} p_string
  	@return {String}
   */
  StringUtils.replaceSpecialCharacters = function(p_string) {
    var char, pattern;
    if (!this.substitionDict) {
      this._initDict();
    }
    for (char in this.substitionDict) {
      console.log(char);
      pattern = new RegExp(char, "g");
      p_string = p_string.replace(pattern, this.substitionDict[char]);
    }
    return p_string;
  };
  /**
  	Set strings uppercase
  	@method _upperCase
  	@private
  	@param {String} p_char
  	@param {Object} args
  	@return {String}
   */
  StringUtils._upperCase = function() {
    var args, p_char;
    p_char = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return p_char.toUpperCase();
  };
  /**
  	List of space character
  	@property substitionDict
  	@type {Array}
  	@private
  	@return {String}
   */
  StringUtils.substitionDict = null;
  /**
  	Create list of space character
  	@property _initDict
  	@private
  	@type {Array}
  	@return {Array}
   */
  StringUtils._initDict = function() {
    var char, _results;
    this.substitionDict = [];
    this.substitionDict["ã"] = "a";
    this.substitionDict["á"] = "a";
    this.substitionDict["â"] = "a";
    this.substitionDict["ä"] = "a";
    this.substitionDict["à"] = "a";
    this.substitionDict["é"] = "e";
    this.substitionDict["ê"] = "e";
    this.substitionDict["ë"] = "e";
    this.substitionDict["è"] = "e";
    this.substitionDict["í"] = "i";
    this.substitionDict["î"] = "i";
    this.substitionDict["ï"] = "i";
    this.substitionDict["ì"] = "i";
    this.substitionDict["õ"] = "o";
    this.substitionDict["ó"] = "o";
    this.substitionDict["ô"] = "o";
    this.substitionDict["ö"] = "o";
    this.substitionDict["ò"] = "o";
    this.substitionDict["ú"] = "u";
    this.substitionDict["û"] = "u";
    this.substitionDict["ü"] = "u";
    this.substitionDict["ù"] = "u";
    this.substitionDict["ç"] = "c";
    this.substitionDict["ñ"] = "n";
    _results = [];
    for (char in this.substitionDict) {
      _results.push(this.substitionDict[char.toUpperCase()] = String(this.substitionDict[char]).toUpperCase());
    }
    return _results;
  };
  return StringUtils;
})();
var JSONUtils;
JSONUtils = (function() {
  function JSONUtils() {}
  JSONUtils.parseJSON = function(json) {
    var stringfied;
    stringfied = false;
    if (typeof json === 'string') {
      stringfied = true;
      json = JSONUtils.replaceMultiline(json);
    }
    json = JSONUtils.removeComments(json);
    if (stringfied) {
      json = JSON.parse(json);
    }
    return json;
  };
  JSONUtils.replaceMultiline = function(json) {
    if (typeof json !== 'string') {
      return json;
    }
    json = json.replace(/^(\s*.*?""")(?:[\s\t]*\n)?([\t\s]*)(\S[\s\S]*)\n?[\s]*(""")/igm, this._replaceMultilinePart);
    json = json.replace(/^(\s*.*?)"""([\s\S]*?)"""/igm, this._replaceEmptyMultiline);
    return json;
  };
  JSONUtils._replaceMultilinePart = function(match, prefix, spaces, value, suffix) {
    var re;
    re = new RegExp(spaces + '?([^\n]*)', 'g');
    value = value.replace(re, '$1');
    return prefix + value + suffix;
  };
  JSONUtils._replaceEmptyMultiline = function(match, prefix, value) {
    value = value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
    return prefix + '"' + value + '"';
  };
  JSONUtils.removeComments = function(json) {
    var stringfied;
    stringfied = true;
    if (typeof json !== 'string') {
      stringfied = false;
      json = JSON.stringify(json);
    }
    json = json.replace(/(^|\s)(\/\/.*$)|(\/\*(.|\s)*?\*\/?)/igm, '');
    if (stringfied) {
      return json;
    } else {
      return JSON.parse(json);
    }
  };
  JSONUtils.filterObject = function(data, name, type, ignore, getParent) {
    var add, k, resp, v;
    if (type == null) {
      type = null;
    }
    if (ignore == null) {
      ignore = null;
    }
    if (getParent == null) {
      getParent = false;
    }
    resp = [];
    name = [].concat(name);
    if (ignore) {
      ignore = [].concat(ignore);
    }
    for (k in data) {
      v = data[k];
      if (ignore) {
        if (ignore.indexOf(k) >= 0) {
          continue;
        }
      }
      if (name.indexOf(k) >= 0) {
        add = true;
        if (type) {
          if (typeof v !== type) {
            add = false;
          }
        }
        if (add) {
          if (getParent) {
            if (resp.indexOf(data) < 0) {
              resp.push(data);
            }
          } else {
            resp.push(v);
          }
        }
      }
      if (typeof v === 'array' || typeof v === 'object') {
        resp = [].concat(resp, this.filterObject(v, name, type, ignore, getParent));
      }
    }
    return resp;
  };
  return JSONUtils;
})();
/**
Detections Class
@class Detections
@extends Class
 */
var Detections;
Detections = (function() {
  var getFirstMatch, testCanvas, testWebGL;
  Detections.prototype.matches = [
    {
      name: 'Opera',
      nick: /opera/i,
      test: /opera|opr/i,
      version: /(?:opera|opr)[\s\/](\d+(\.\d+)*)/i
    }, {
      name: 'Windows Phone',
      nick: /WindowsPhone/i,
      test: /windows phone/i,
      version: /iemobile\/(\d+(\.\d+)*)/i
    }, {
      name: 'Edge',
      nick: /edge|edgehtml/i,
      test: /edge|msapphost|edgehtml/i,
      version: /(?:edge|edgehtml)\/(\d+(\.\d+)*)/i
    }, {
      name: 'Internet Explorer',
      nick: /explorer|internetexplorer|ie/i,
      test: /msie|trident/i,
      version: /(?:msie |rv:)(\d+(\.\d+)*)/i
    }, {
      name: 'Chrome',
      nick: /Chrome/i,
      test: /chrome|crios|crmo/i,
      version: /(?:chrome|crios|crmo)\/(\d+(\.\d+)*)/i
    }, {
      name: 'iPod',
      nick: /iPod/i,
      test: /ipod/i
    }, {
      name: 'iPhone',
      nick: /iPhone/i,
      test: /iphone/i
    }, {
      name: 'iPad',
      nick: /iPad/i,
      test: /ipad/i
    }, {
      name: 'FirefoxOS',
      nick: /FirefoxOS|ffos/i,
      test: /\((mobile|tablet);[^\)]*rv:[\d\.]+\)firefox|iceweasel/i,
      version: /(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i
    }, {
      name: 'Firefox',
      nick: /Firefox|ff/i,
      test: /firefox|iceweasel/i,
      version: /(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i
    }, {
      name: 'Android',
      nick: /Android/i,
      test: /android/i
    }, {
      name: 'BlackBerry',
      nick: /BlackBerry/i,
      test: /(blackberry)|(\bbb)|(rim\stablet)\d+/i,
      version: /blackberry[\d]+\/(\d+(\.\d+)?)/i
    }, {
      name: 'WebOS',
      nick: /WebOS/i,
      test: /(web|hpw)os/i,
      version: /w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i
    }, {
      name: 'Safari',
      nick: /safari/i,
      test: /safari/i
    }
  ];
  Detections.getInstance = function() {
    return Detections._instance != null ? Detections._instance : Detections._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Detections, arguments, function(){});
  };
  function Detections() {
    var k, v, _ref;
    this.matched = null;
    this.ua = (typeof navigator !== "undefined" && navigator !== null ? navigator.userAgent : void 0) || '';
    this.platform = this.os = (typeof navigator !== "undefined" && navigator !== null ? navigator.platform : void 0) || '';
    this.version = getFirstMatch(/version\/(\d+(\.\d+)*)/i, this.ua);
    this.getBrowser();
    this.versionArr = this.version == null ? [] : this.version.split('.');
    _ref = this.versionArr;
    for (k in _ref) {
      v = _ref[k];
      this.versionArr[k] = Number(v);
    }
    this.orientation = (typeof window !== "undefined" && window !== null ? window.innerWidth : void 0) > (typeof window !== "undefined" && window !== null ? window.innerHeight : void 0) ? 'landscape' : 'portrait';
    this.touch = (__indexOf.call(window, 'ontouchstart') >= 0) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    this.tablet = /(ipad.*|tablet(?!\s+pc).*|(android.*?chrome((?!mobi).)*))$/i.test(this.ua);
    this.mobile = !this.tablet && Boolean(getFirstMatch(/(ipod|iphone|ipad)/i, this.ua) || /[^-]mobi/i.test(this.ua));
    this.desktop = !this.mobile && !this.tablet;
    this.canvas = testCanvas();
    this.webgl = testWebGL();
  }
  Detections.prototype.test = function(value) {
    var i, l, m, result, v, _i, _ref;
    if (!this.matched) {
      return 0;
    }
    if (!(m = value.match(/(?:(?:(\D.*?)(?:\s|$))?(\D.*?)(?:\s|$))?(?:([\d\.]+))?/))) {
      return 0;
    }
    result = 0;
    if (m[1]) {
      if (new RegExp(m[1], 'i').test(this.os)) {
        result = 1;
      } else {
        return 0;
      }
    }
    if (m[2]) {
      if ((_ref = this.matched.nick) != null ? _ref.test(m[2]) : void 0) {
        result = 1;
      } else {
        return 0;
      }
    }
    if (m[3]) {
      v = m[3].split('.');
      l = v.length;
      if (l > this.versionArr.length) {
        l = this.versionArr.length;
      }
      for (i = _i = 0; 0 <= l ? _i <= l : _i >= l; i = 0 <= l ? ++_i : --_i) {
        if (this.versionArr[i] > v[i]) {
          return 2;
        } else if (this.versionArr[i] < v[i]) {
          return -1;
        }
      }
    }
    return result;
  };
  Detections.prototype.getBrowser = function() {
    var m, _i, _len, _ref;
    _ref = this.matches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      m = _ref[_i];
      if (m.test.test(this.ua)) {
        this.name = m.name;
        this.version = this.version || getFirstMatch(m.version, this.ua);
        this.matched = m;
        break;
      }
    }
    return [this.name, this.version];
  };
  testWebGL = function() {
    var err;
    try {
      return !!window.WebGLRenderingContext && Boolean(document.createElement("canvas").getContext('webgl')) || Boolean(document.createElement("canvas").getContext('experimental-webgl'));
    } catch (_error) {
      err = _error;
      return false;
    }
  };
  testCanvas = function() {
    var err;
    try {
      return !!window.CanvasRenderingContext2D && Boolean(document.createElement("canvas").getContext('2d'));
    } catch (_error) {
      err = _error;
      return false;
    }
  };
  getFirstMatch = function(re, val) {
    var m;
    m = val.match(re);
    return (m && m.length > 1 && m[1]) || null;
  };
  return Detections;
})();
/**
It's a simple wrapper to PreloadJS.
See more info on <a href="http://www.createjs.com/docs/preloadjs/" target="_blank" class="crosslink">PreloadJS Docs</a>
@class PreloadFiles
 */
 this.createjs=this.createjs||{},function(){"use strict";var a=createjs.PreloadJS=createjs.PreloadJS||{};a.version="0.6.1",a.buildDate="Thu, 21 May 2015 16:17:37 GMT"}(),this.createjs=this.createjs||{},createjs.extend=function(a,b){"use strict";function c(){this.constructor=a}return c.prototype=b.prototype,a.prototype=new c},this.createjs=this.createjs||{},createjs.promote=function(a,b){"use strict";var c=a.prototype,d=Object.getPrototypeOf&&Object.getPrototypeOf(c)||c.__proto__;if(d){c[(b+="_")+"constructor"]=d.constructor;for(var e in d)c.hasOwnProperty(e)&&"function"==typeof d[e]&&(c[b+e]=d[e])}return a},this.createjs=this.createjs||{},createjs.indexOf=function(a,b){"use strict";for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1},this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},function(){"use strict";function BrowserDetect(){throw"BrowserDetect cannot be instantiated"}var a=BrowserDetect.agent=window.navigator.userAgent;BrowserDetect.isWindowPhone=a.indexOf("IEMobile")>-1||a.indexOf("Windows Phone")>-1,BrowserDetect.isFirefox=a.indexOf("Firefox")>-1,BrowserDetect.isOpera=null!=window.opera,BrowserDetect.isChrome=a.indexOf("Chrome")>-1,BrowserDetect.isIOS=(a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1)&&!BrowserDetect.isWindowPhone,BrowserDetect.isAndroid=a.indexOf("Android")>-1&&!BrowserDetect.isWindowPhone,BrowserDetect.isBlackberry=a.indexOf("Blackberry")>-1,createjs.BrowserDetect=BrowserDetect}(),this.createjs=this.createjs||{},function(){"use strict";function Event(a,b,c){this.type=a,this.target=null,this.currentTarget=null,this.eventPhase=0,this.bubbles=!!b,this.cancelable=!!c,this.timeStamp=(new Date).getTime(),this.defaultPrevented=!1,this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.removed=!1}var a=Event.prototype;a.preventDefault=function(){this.defaultPrevented=this.cancelable&&!0},a.stopPropagation=function(){this.propagationStopped=!0},a.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},a.remove=function(){this.removed=!0},a.clone=function(){return new Event(this.type,this.bubbles,this.cancelable)},a.set=function(a){for(var b in a)this[b]=a[b];return this},a.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=Event}(),this.createjs=this.createjs||{},function(){"use strict";function ErrorEvent(a,b,c){this.Event_constructor("error"),this.title=a,this.message=b,this.data=c}var a=createjs.extend(ErrorEvent,createjs.Event);a.clone=function(){return new createjs.ErrorEvent(this.title,this.message,this.data)},createjs.ErrorEvent=createjs.promote(ErrorEvent,"Event")}(),this.createjs=this.createjs||{},function(){"use strict";function EventDispatcher(){this._listeners=null,this._captureListeners=null}var a=EventDispatcher.prototype;EventDispatcher.initialize=function(b){b.addEventListener=a.addEventListener,b.on=a.on,b.removeEventListener=b.off=a.removeEventListener,b.removeAllEventListeners=a.removeAllEventListeners,b.hasEventListener=a.hasEventListener,b.dispatchEvent=a.dispatchEvent,b._dispatchEvent=a._dispatchEvent,b.willTrigger=a.willTrigger},a.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},a.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},a.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},a.off=a.removeEventListener,a.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},a.dispatchEvent=function(a){if("string"==typeof a){var b=this._listeners;if(!b||!b[a])return!1;a=new createjs.Event(a)}else a.target&&a.clone&&(a=a.clone());try{a.target=this}catch(c){}if(a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},a.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},a.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},a.toString=function(){return"[EventDispatcher]"},a._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;try{a.currentTarget=this}catch(f){}try{a.eventPhase=b}catch(f){}a.removed=!1,e=e.slice();for(var g=0;c>g&&!a.immediatePropagationStopped;g++){var h=e[g];h.handleEvent?h.handleEvent(a):h(a),a.removed&&(this.off(a.type,h,1==b),a.removed=!1)}}},createjs.EventDispatcher=EventDispatcher}(),this.createjs=this.createjs||{},function(){"use strict";function ProgressEvent(a,b){this.Event_constructor("progress"),this.loaded=a,this.total=null==b?1:b,this.progress=0==b?0:this.loaded/this.total}var a=createjs.extend(ProgressEvent,createjs.Event);a.clone=function(){return new createjs.ProgressEvent(this.loaded,this.total)},createjs.ProgressEvent=createjs.promote(ProgressEvent,"Event")}(window),function(){function a(b,d){function f(a){if(f[a]!==q)return f[a];var b;if("bug-string-char-index"==a)b="a"!="a"[0];else if("json"==a)b=f("json-stringify")&&f("json-parse");else{var c,e='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==a){var i=d.stringify,k="function"==typeof i&&t;if(k){(c=function(){return 1}).toJSON=c;try{k="0"===i(0)&&"0"===i(new g)&&'""'==i(new h)&&i(s)===q&&i(q)===q&&i()===q&&"1"===i(c)&&"[1]"==i([c])&&"[null]"==i([q])&&"null"==i(null)&&"[null,null,null]"==i([q,s,null])&&i({a:[c,!0,!1,null,"\x00\b\n\f\r  "]})==e&&"1"===i(null,c)&&"[\n 1,\n 2\n]"==i([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==i(new j(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==i(new j(864e13))&&'"-000001-01-01T00:00:00.000Z"'==i(new j(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==i(new j(-1))}catch(l){k=!1}}b=k}if("json-parse"==a){var m=d.parse;if("function"==typeof m)try{if(0===m("0")&&!m(!1)){c=m(e);var n=5==c.a.length&&1===c.a[0];if(n){try{n=!m('" "')}catch(l){}if(n)try{n=1!==m("01")}catch(l){}if(n)try{n=1!==m("1.")}catch(l){}}}}catch(l){n=!1}b=n}}return f[a]=!!b}b||(b=e.Object()),d||(d=e.Object());var g=b.Number||e.Number,h=b.String||e.String,i=b.Object||e.Object,j=b.Date||e.Date,k=b.SyntaxError||e.SyntaxError,l=b.TypeError||e.TypeError,m=b.Math||e.Math,n=b.JSON||e.JSON;"object"==typeof n&&n&&(d.stringify=n.stringify,d.parse=n.parse);var o,p,q,r=i.prototype,s=r.toString,t=new j(-0xc782b5b800cec);try{t=-109252==t.getUTCFullYear()&&0===t.getUTCMonth()&&1===t.getUTCDate()&&10==t.getUTCHours()&&37==t.getUTCMinutes()&&6==t.getUTCSeconds()&&708==t.getUTCMilliseconds()}catch(u){}if(!f("json")){var v="[object Function]",w="[object Date]",x="[object Number]",y="[object String]",z="[object Array]",A="[object Boolean]",B=f("bug-string-char-index");if(!t)var C=m.floor,D=[0,31,59,90,120,151,181,212,243,273,304,334],E=function(a,b){return D[b]+365*(a-1970)+C((a-1969+(b=+(b>1)))/4)-C((a-1901+b)/100)+C((a-1601+b)/400)};if((o=r.hasOwnProperty)||(o=function(a){var b,c={};return(c.__proto__=null,c.__proto__={toString:1},c).toString!=s?o=function(a){var b=this.__proto__,c=a in(this.__proto__=null,this);return this.__proto__=b,c}:(b=c.constructor,o=function(a){var c=(this.constructor||b).prototype;return a in this&&!(a in c&&this[a]===c[a])}),c=null,o.call(this,a)}),p=function(a,b){var d,e,f,g=0;(d=function(){this.valueOf=0}).prototype.valueOf=0,e=new d;for(f in e)o.call(e,f)&&g++;return d=e=null,g?p=2==g?function(a,b){var c,d={},e=s.call(a)==v;for(c in a)e&&"prototype"==c||o.call(d,c)||!(d[c]=1)||!o.call(a,c)||b(c)}:function(a,b){var c,d,e=s.call(a)==v;for(c in a)e&&"prototype"==c||!o.call(a,c)||(d="constructor"===c)||b(c);(d||o.call(a,c="constructor"))&&b(c)}:(e=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],p=function(a,b){var d,f,g=s.call(a)==v,h=!g&&"function"!=typeof a.constructor&&c[typeof a.hasOwnProperty]&&a.hasOwnProperty||o;for(d in a)g&&"prototype"==d||!h.call(a,d)||b(d);for(f=e.length;d=e[--f];h.call(a,d)&&b(d));}),p(a,b)},!f("json-stringify")){var F={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},G="000000",H=function(a,b){return(G+(b||0)).slice(-a)},I="\\u00",J=function(a){for(var b='"',c=0,d=a.length,e=!B||d>10,f=e&&(B?a.split(""):a);d>c;c++){var g=a.charCodeAt(c);switch(g){case 8:case 9:case 10:case 12:case 13:case 34:case 92:b+=F[g];break;default:if(32>g){b+=I+H(2,g.toString(16));break}b+=e?f[c]:a.charAt(c)}}return b+'"'},K=function(a,b,c,d,e,f,g){var h,i,j,k,m,n,r,t,u,v,B,D,F,G,I,L;try{h=b[a]}catch(M){}if("object"==typeof h&&h)if(i=s.call(h),i!=w||o.call(h,"toJSON"))"function"==typeof h.toJSON&&(i!=x&&i!=y&&i!=z||o.call(h,"toJSON"))&&(h=h.toJSON(a));else if(h>-1/0&&1/0>h){if(E){for(m=C(h/864e5),j=C(m/365.2425)+1970-1;E(j+1,0)<=m;j++);for(k=C((m-E(j,0))/30.42);E(j,k+1)<=m;k++);m=1+m-E(j,k),n=(h%864e5+864e5)%864e5,r=C(n/36e5)%24,t=C(n/6e4)%60,u=C(n/1e3)%60,v=n%1e3}else j=h.getUTCFullYear(),k=h.getUTCMonth(),m=h.getUTCDate(),r=h.getUTCHours(),t=h.getUTCMinutes(),u=h.getUTCSeconds(),v=h.getUTCMilliseconds();h=(0>=j||j>=1e4?(0>j?"-":"+")+H(6,0>j?-j:j):H(4,j))+"-"+H(2,k+1)+"-"+H(2,m)+"T"+H(2,r)+":"+H(2,t)+":"+H(2,u)+"."+H(3,v)+"Z"}else h=null;if(c&&(h=c.call(b,a,h)),null===h)return"null";if(i=s.call(h),i==A)return""+h;if(i==x)return h>-1/0&&1/0>h?""+h:"null";if(i==y)return J(""+h);if("object"==typeof h){for(G=g.length;G--;)if(g[G]===h)throw l();if(g.push(h),B=[],I=f,f+=e,i==z){for(F=0,G=h.length;G>F;F++)D=K(F,h,c,d,e,f,g),B.push(D===q?"null":D);L=B.length?e?"[\n"+f+B.join(",\n"+f)+"\n"+I+"]":"["+B.join(",")+"]":"[]"}else p(d||h,function(a){var b=K(a,h,c,d,e,f,g);b!==q&&B.push(J(a)+":"+(e?" ":"")+b)}),L=B.length?e?"{\n"+f+B.join(",\n"+f)+"\n"+I+"}":"{"+B.join(",")+"}":"{}";return g.pop(),L}};d.stringify=function(a,b,d){var e,f,g,h;if(c[typeof b]&&b)if((h=s.call(b))==v)f=b;else if(h==z){g={};for(var i,j=0,k=b.length;k>j;i=b[j++],h=s.call(i),(h==y||h==x)&&(g[i]=1));}if(d)if((h=s.call(d))==x){if((d-=d%1)>0)for(e="",d>10&&(d=10);e.length<d;e+=" ");}else h==y&&(e=d.length<=10?d:d.slice(0,10));return K("",(i={},i[""]=a,i),f,g,e,"",[])}}if(!f("json-parse")){var L,M,N=h.fromCharCode,O={92:"\\",34:'"',47:"/",98:"\b",116:" ",110:"\n",102:"\f",114:"\r"},P=function(){throw L=M=null,k()},Q=function(){for(var a,b,c,d,e,f=M,g=f.length;g>L;)switch(e=f.charCodeAt(L)){case 9:case 10:case 13:case 32:L++;break;case 123:case 125:case 91:case 93:case 58:case 44:return a=B?f.charAt(L):f[L],L++,a;case 34:for(a="@",L++;g>L;)if(e=f.charCodeAt(L),32>e)P();else if(92==e)switch(e=f.charCodeAt(++L)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:a+=O[e],L++;break;case 117:for(b=++L,c=L+4;c>L;L++)e=f.charCodeAt(L),e>=48&&57>=e||e>=97&&102>=e||e>=65&&70>=e||P();a+=N("0x"+f.slice(b,L));break;default:P()}else{if(34==e)break;for(e=f.charCodeAt(L),b=L;e>=32&&92!=e&&34!=e;)e=f.charCodeAt(++L);a+=f.slice(b,L)}if(34==f.charCodeAt(L))return L++,a;P();default:if(b=L,45==e&&(d=!0,e=f.charCodeAt(++L)),e>=48&&57>=e){for(48==e&&(e=f.charCodeAt(L+1),e>=48&&57>=e)&&P(),d=!1;g>L&&(e=f.charCodeAt(L),e>=48&&57>=e);L++);if(46==f.charCodeAt(L)){for(c=++L;g>c&&(e=f.charCodeAt(c),e>=48&&57>=e);c++);c==L&&P(),L=c}if(e=f.charCodeAt(L),101==e||69==e){for(e=f.charCodeAt(++L),(43==e||45==e)&&L++,c=L;g>c&&(e=f.charCodeAt(c),e>=48&&57>=e);c++);c==L&&P(),L=c}return+f.slice(b,L)}if(d&&P(),"true"==f.slice(L,L+4))return L+=4,!0;if("false"==f.slice(L,L+5))return L+=5,!1;if("null"==f.slice(L,L+4))return L+=4,null;P()}return"$"},R=function(a){var b,c;if("$"==a&&P(),"string"==typeof a){if("@"==(B?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(b=[];a=Q(),"]"!=a;c||(c=!0))c&&(","==a?(a=Q(),"]"==a&&P()):P()),","==a&&P(),b.push(R(a));return b}if("{"==a){for(b={};a=Q(),"}"!=a;c||(c=!0))c&&(","==a?(a=Q(),"}"==a&&P()):P()),(","==a||"string"!=typeof a||"@"!=(B?a.charAt(0):a[0])||":"!=Q())&&P(),b[a.slice(1)]=R(Q());return b}P()}return a},S=function(a,b,c){var d=T(a,b,c);d===q?delete a[b]:a[b]=d},T=function(a,b,c){var d,e=a[b];if("object"==typeof e&&e)if(s.call(e)==z)for(d=e.length;d--;)S(e,d,c);else p(e,function(a){S(e,a,c)});return c.call(a,b,e)};d.parse=function(a,b){var c,d;return L=0,M=""+a,c=R(Q()),"$"!=Q()&&P(),L=M=null,b&&s.call(b)==v?T((d={},d[""]=c,d),"",b):c}}}return d.runInContext=a,d}var b="function"==typeof define&&define.amd,c={"function":!0,object:!0},d=c[typeof exports]&&exports&&!exports.nodeType&&exports,e=c[typeof window]&&window||this,f=d&&c[typeof module]&&module&&!module.nodeType&&"object"==typeof global&&global;if(!f||f.global!==f&&f.window!==f&&f.self!==f||(e=f),d&&!b)a(e,d);else{var g=e.JSON,h=e.JSON3,i=!1,j=a(e,e.JSON3={noConflict:function(){return i||(i=!0,e.JSON=g,e.JSON3=h,g=h=null),j}});e.JSON={parse:j.parse,stringify:j.stringify}}b&&define(function(){return j})}.call(this),function(){var a={};a.appendToHead=function(b){a.getHead().appendChild(b)},a.getHead=function(){return document.head||document.getElementsByTagName("head")[0]},a.getBody=function(){return document.body||document.getElementsByTagName("body")[0]},createjs.DomUtils=a}(),function(){var a={};a.parseXML=function(a,b){var c=null;try{if(window.DOMParser){var d=new DOMParser;c=d.parseFromString(a,b)}}catch(e){}if(!c)try{c=new ActiveXObject("Microsoft.XMLDOM"),c.async=!1,c.loadXML(a)}catch(e){c=null}return c},a.parseJSON=function(a){if(null==a)return null;try{return JSON.parse(a)}catch(b){throw b}},createjs.DataUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function LoadItem(){this.src=null,this.type=null,this.id=null,this.maintainOrder=!1,this.callback=null,this.data=null,this.method=createjs.LoadItem.GET,this.values=null,this.headers=null,this.withCredentials=!1,this.mimeType=null,this.crossOrigin=null,this.loadTimeout=b.LOAD_TIMEOUT_DEFAULT}var a=LoadItem.prototype={},b=LoadItem;b.LOAD_TIMEOUT_DEFAULT=8e3,b.create=function(a){if("string"==typeof a){var c=new LoadItem;return c.src=a,c}if(a instanceof b)return a;if(a instanceof Object&&a.src)return null==a.loadTimeout&&(a.loadTimeout=b.LOAD_TIMEOUT_DEFAULT),a;throw new Error("Type not recognized.")},a.set=function(a){for(var b in a)this[b]=a[b];return this},createjs.LoadItem=b}(),function(){var a={};a.ABSOLUTE_PATT=/^(?:\w+:)?\/{2}/i,a.RELATIVE_PATT=/^[./]*?\//i,a.EXTENSION_PATT=/\/?[^/]+\.(\w{1,5})$/i,a.parseURI=function(b){var c={absolute:!1,relative:!1};if(null==b)return c;var d=b.indexOf("?");d>-1&&(b=b.substr(0,d));var e;return a.ABSOLUTE_PATT.test(b)?c.absolute=!0:a.RELATIVE_PATT.test(b)&&(c.relative=!0),(e=b.match(a.EXTENSION_PATT))&&(c.extension=e[1].toLowerCase()),c},a.formatQueryString=function(a,b){if(null==a)throw new Error("You must specify data.");var c=[];for(var d in a)c.push(d+"="+escape(a[d]));return b&&(c=c.concat(b)),c.join("&")},a.buildPath=function(a,b){if(null==b)return a;var c=[],d=a.indexOf("?");if(-1!=d){var e=a.slice(d+1);c=c.concat(e.split("&"))}return-1!=d?a.slice(0,d)+"?"+this._formatQueryString(b,c):a+"?"+this._formatQueryString(b,c)},a.isCrossDomain=function(a){var b=document.createElement("a");b.href=a.src;var c=document.createElement("a");c.href=location.href;var d=""!=b.hostname&&(b.port!=c.port||b.protocol!=c.protocol||b.hostname!=c.hostname);return d},a.isLocal=function(a){var b=document.createElement("a");return b.href=a.src,""==b.hostname&&"file:"==b.protocol},a.isBinary=function(a){switch(a){case createjs.AbstractLoader.IMAGE:case createjs.AbstractLoader.BINARY:return!0;default:return!1}},a.isImageTag=function(a){return a instanceof HTMLImageElement},a.isAudioTag=function(a){return window.HTMLAudioElement?a instanceof HTMLAudioElement:!1},a.isVideoTag=function(a){return window.HTMLVideoElement?a instanceof HTMLVideoElement:!1},a.isText=function(a){switch(a){case createjs.AbstractLoader.TEXT:case createjs.AbstractLoader.JSON:case createjs.AbstractLoader.MANIFEST:case createjs.AbstractLoader.XML:case createjs.AbstractLoader.CSS:case createjs.AbstractLoader.SVG:case createjs.AbstractLoader.JAVASCRIPT:case createjs.AbstractLoader.SPRITESHEET:return!0;default:return!1}},a.getTypeByExtension=function(a){if(null==a)return createjs.AbstractLoader.TEXT;switch(a.toLowerCase()){case"jpeg":case"jpg":case"gif":case"png":case"webp":case"bmp":return createjs.AbstractLoader.IMAGE;case"ogg":case"mp3":case"webm":return createjs.AbstractLoader.SOUND;case"mp4":case"webm":case"ts":return createjs.AbstractLoader.VIDEO;case"json":return createjs.AbstractLoader.JSON;case"xml":return createjs.AbstractLoader.XML;case"css":return createjs.AbstractLoader.CSS;case"js":return createjs.AbstractLoader.JAVASCRIPT;case"svg":return createjs.AbstractLoader.SVG;default:return createjs.AbstractLoader.TEXT}},createjs.RequestUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function AbstractLoader(a,b,c){this.EventDispatcher_constructor(),this.loaded=!1,this.canceled=!1,this.progress=0,this.type=c,this.resultFormatter=null,this._item=a?createjs.LoadItem.create(a):null,this._preferXHR=b,this._result=null,this._rawResult=null,this._loadedItems=null,this._tagSrcAttribute=null,this._tag=null}var a=createjs.extend(AbstractLoader,createjs.EventDispatcher),b=AbstractLoader;b.POST="POST",b.GET="GET",b.BINARY="binary",b.CSS="css",b.IMAGE="image",b.JAVASCRIPT="javascript",b.JSON="json",b.JSONP="jsonp",b.MANIFEST="manifest",b.SOUND="sound",b.VIDEO="video",b.SPRITESHEET="spritesheet",b.SVG="svg",b.TEXT="text",b.XML="xml",a.getItem=function(){return this._item},a.getResult=function(a){return a?this._rawResult:this._result},a.getTag=function(){return this._tag},a.setTag=function(a){this._tag=a},a.load=function(){this._createRequest(),this._request.on("complete",this,this),this._request.on("progress",this,this),this._request.on("loadStart",this,this),this._request.on("abort",this,this),this._request.on("timeout",this,this),this._request.on("error",this,this);var a=new createjs.Event("initialize");a.loader=this._request,this.dispatchEvent(a),this._request.load()},a.cancel=function(){this.canceled=!0,this.destroy()},a.destroy=function(){this._request&&(this._request.removeAllEventListeners(),this._request.destroy()),this._request=null,this._item=null,this._rawResult=null,this._result=null,this._loadItems=null,this.removeAllEventListeners()},a.getLoadedItems=function(){return this._loadedItems},a._createRequest=function(){this._request=this._preferXHR?new createjs.XHRRequest(this._item):new createjs.TagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},a._createTag=function(){return null},a._sendLoadStart=function(){this._isCanceled()||this.dispatchEvent("loadstart")},a._sendProgress=function(a){if(!this._isCanceled()){var b=null;"number"==typeof a?(this.progress=a,b=new createjs.ProgressEvent(this.progress)):(b=a,this.progress=a.loaded/a.total,b.progress=this.progress,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0)),this.hasEventListener("progress")&&this.dispatchEvent(b)}},a._sendComplete=function(){if(!this._isCanceled()){this.loaded=!0;var a=new createjs.Event("complete");a.rawResult=this._rawResult,null!=this._result&&(a.result=this._result),this.dispatchEvent(a)}},a._sendError=function(a){!this._isCanceled()&&this.hasEventListener("error")&&(null==a&&(a=new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")),this.dispatchEvent(a))},a._isCanceled=function(){return null==window.createjs||this.canceled?!0:!1},a.resultFormatter=null,a.handleEvent=function(a){switch(a.type){case"complete":this._rawResult=a.target._response;var b=this.resultFormatter&&this.resultFormatter(this),c=this;b instanceof Function?b(function(a){c._result=a,c._sendComplete()}):(this._result=b||this._rawResult,this._sendComplete());break;case"progress":this._sendProgress(a);break;case"error":this._sendError(a);break;case"loadstart":this._sendLoadStart();break;case"abort":case"timeout":this._isCanceled()||this.dispatchEvent(a.type)}},a.buildPath=function(a,b){return createjs.RequestUtils.buildPath(a,b)},a.toString=function(){return"[PreloadJS AbstractLoader]"},createjs.AbstractLoader=createjs.promote(AbstractLoader,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function AbstractMediaLoader(a,b,c){this.AbstractLoader_constructor(a,b,c),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src"}var a=createjs.extend(AbstractMediaLoader,createjs.AbstractLoader);a.load=function(){this._tag||(this._tag=this._createTag(this._item.src)),this._tag.preload="auto",this._tag.load(),this.AbstractLoader_load()},a._createTag=function(){},a._createRequest=function(){this._request=this._preferXHR?new createjs.XHRRequest(this._item):new createjs.MediaTagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},a._formatResult=function(a){return this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.onstalled=null,this._preferXHR&&(a.getTag().src=a.getResult(!0)),a.getTag()},createjs.AbstractMediaLoader=createjs.promote(AbstractMediaLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";var AbstractRequest=function(a){this._item=a},a=createjs.extend(AbstractRequest,createjs.EventDispatcher);a.load=function(){},a.destroy=function(){},a.cancel=function(){},createjs.AbstractRequest=createjs.promote(AbstractRequest,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function TagRequest(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this),this._addedToDOM=!1,this._startTagVisibility=null}var a=createjs.extend(TagRequest,createjs.AbstractRequest);a.load=function(){this._tag.onload=createjs.proxy(this._handleTagComplete,this),this._tag.onreadystatechange=createjs.proxy(this._handleReadyStateChange,this),this._tag.onerror=createjs.proxy(this._handleError,this);var a=new createjs.Event("initialize");a.loader=this._tag,this.dispatchEvent(a),this._hideTag(),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout),this._tag[this._tagSrcAttribute]=this._item.src,null==this._tag.parentNode&&(window.document.body.appendChild(this._tag),this._addedToDOM=!0)},a.destroy=function(){this._clean(),this._tag=null,this.AbstractRequest_destroy()},a._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;("loaded"==a.readyState||"complete"==a.readyState)&&this._handleTagComplete()},a._handleError=function(){this._clean(),this.dispatchEvent("error")},a._handleTagComplete=function(){this._rawResult=this._tag,this._result=this.resultFormatter&&this.resultFormatter(this)||this._rawResult,this._clean(),this._showTag(),this.dispatchEvent("complete")},a._handleTimeout=function(){this._clean(),this.dispatchEvent(new createjs.Event("timeout"))},a._clean=function(){this._tag.onload=null,this._tag.onreadystatechange=null,this._tag.onerror=null,this._addedToDOM&&null!=this._tag.parentNode&&this._tag.parentNode.removeChild(this._tag),clearTimeout(this._loadTimeout)},a._hideTag=function(){this._startTagVisibility=this._tag.style.visibility,this._tag.style.visibility="hidden"},a._showTag=function(){this._tag.style.visibility=this._startTagVisibility},a._handleStalled=function(){},createjs.TagRequest=createjs.promote(TagRequest,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function MediaTagRequest(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this)}var a=createjs.extend(MediaTagRequest,createjs.TagRequest);a.load=function(){var a=createjs.proxy(this._handleStalled,this);this._stalledCallback=a;var b=createjs.proxy(this._handleProgress,this);this._handleProgress=b,this._tag.addEventListener("stalled",a),this._tag.addEventListener("progress",b),this._tag.addEventListener&&this._tag.addEventListener("canplaythrough",this._loadedHandler,!1),this.TagRequest_load()},a._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;("loaded"==a.readyState||"complete"==a.readyState)&&this._handleTagComplete()},a._handleStalled=function(){},a._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},a._clean=function(){this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.removeEventListener("stalled",this._stalledCallback),this._tag.removeEventListener("progress",this._progressCallback),this.TagRequest__clean()},createjs.MediaTagRequest=createjs.promote(MediaTagRequest,"TagRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function XHRRequest(a){this.AbstractRequest_constructor(a),this._request=null,this._loadTimeout=null,this._xhrLevel=1,this._response=null,this._rawResponse=null,this._canceled=!1,this._handleLoadStartProxy=createjs.proxy(this._handleLoadStart,this),this._handleProgressProxy=createjs.proxy(this._handleProgress,this),this._handleAbortProxy=createjs.proxy(this._handleAbort,this),this._handleErrorProxy=createjs.proxy(this._handleError,this),this._handleTimeoutProxy=createjs.proxy(this._handleTimeout,this),this._handleLoadProxy=createjs.proxy(this._handleLoad,this),this._handleReadyStateChangeProxy=createjs.proxy(this._handleReadyStateChange,this),!this._createXHR(a)}var a=createjs.extend(XHRRequest,createjs.AbstractRequest);XHRRequest.ACTIVEX_VERSIONS=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],a.getResult=function(a){return a&&this._rawResponse?this._rawResponse:this._response},a.cancel=function(){this.canceled=!0,this._clean(),this._request.abort()},a.load=function(){if(null==this._request)return void this._handleError();null!=this._request.addEventListener?(this._request.addEventListener("loadstart",this._handleLoadStartProxy,!1),this._request.addEventListener("progress",this._handleProgressProxy,!1),this._request.addEventListener("abort",this._handleAbortProxy,!1),this._request.addEventListener("error",this._handleErrorProxy,!1),this._request.addEventListener("timeout",this._handleTimeoutProxy,!1),this._request.addEventListener("load",this._handleLoadProxy,!1),this._request.addEventListener("readystatechange",this._handleReadyStateChangeProxy,!1)):(this._request.onloadstart=this._handleLoadStartProxy,this._request.onprogress=this._handleProgressProxy,this._request.onabort=this._handleAbortProxy,this._request.onerror=this._handleErrorProxy,this._request.ontimeout=this._handleTimeoutProxy,this._request.onload=this._handleLoadProxy,this._request.onreadystatechange=this._handleReadyStateChangeProxy),1==this._xhrLevel&&(this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout));try{this._item.values&&this._item.method!=createjs.AbstractLoader.GET?this._item.method==createjs.AbstractLoader.POST&&this._request.send(createjs.RequestUtils.formatQueryString(this._item.values)):this._request.send()}catch(a){this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND",null,a))}},a.setResponseType=function(a){"blob"===a&&(a=window.URL?"blob":"arraybuffer",this._responseType=a),this._request.responseType=a},a.getAllResponseHeaders=function(){return this._request.getAllResponseHeaders instanceof Function?this._request.getAllResponseHeaders():null},a.getResponseHeader=function(a){return this._request.getResponseHeader instanceof Function?this._request.getResponseHeader(a):null},a._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},a._handleLoadStart=function(){clearTimeout(this._loadTimeout),this.dispatchEvent("loadstart")},a._handleAbort=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED",null,a))},a._handleError=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent(a.message))},a._handleReadyStateChange=function(){4==this._request.readyState&&this._handleLoad()},a._handleLoad=function(){if(!this.loaded){this.loaded=!0;var a=this._checkError();if(a)return void this._handleError(a);if(this._response=this._getResponse(),"arraybuffer"===this._responseType)try{this._response=new Blob([this._response])}catch(b){if(window.BlobBuilder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,"TypeError"===b.name&&window.BlobBuilder){var c=new BlobBuilder;c.append(this._response),this._response=c.getBlob()}}this._clean(),this.dispatchEvent(new createjs.Event("complete"))}},a._handleTimeout=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT",null,a))},a._checkError=function(){var a=parseInt(this._request.status);switch(a){case 404:case 0:return new Error(a)}return null},a._getResponse=function(){if(null!=this._response)return this._response;if(null!=this._request.response)return this._request.response;try{if(null!=this._request.responseText)return this._request.responseText}catch(a){}try{if(null!=this._request.responseXML)return this._request.responseXML}catch(a){}return null},a._createXHR=function(a){var b=createjs.RequestUtils.isCrossDomain(a),c={},d=null;if(window.XMLHttpRequest)d=new XMLHttpRequest,b&&void 0===d.withCredentials&&window.XDomainRequest&&(d=new XDomainRequest);else{for(var e=0,f=s.ACTIVEX_VERSIONS.length;f>e;e++){var g=s.ACTIVEX_VERSIONS[e];try{d=new ActiveXObject(g);break}catch(h){}}if(null==d)return!1}null==a.mimeType&&createjs.RequestUtils.isText(a.type)&&(a.mimeType="text/plain; charset=utf-8"),a.mimeType&&d.overrideMimeType&&d.overrideMimeType(a.mimeType),this._xhrLevel="string"==typeof d.responseType?2:1;var i=null;if(i=a.method==createjs.AbstractLoader.GET?createjs.RequestUtils.buildPath(a.src,a.values):a.src,d.open(a.method||createjs.AbstractLoader.GET,i,!0),b&&d instanceof XMLHttpRequest&&1==this._xhrLevel&&(c.Origin=location.origin),a.values&&a.method==createjs.AbstractLoader.POST&&(c["Content-Type"]="application/x-www-form-urlencoded"),b||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest"),a.headers)for(var j in a.headers)c[j]=a.headers[j];for(j in c)d.setRequestHeader(j,c[j]);return d instanceof XMLHttpRequest&&void 0!==a.withCredentials&&(d.withCredentials=a.withCredentials),this._request=d,!0},a._clean=function(){clearTimeout(this._loadTimeout),null!=this._request.removeEventListener?(this._request.removeEventListener("loadstart",this._handleLoadStartProxy),this._request.removeEventListener("progress",this._handleProgressProxy),this._request.removeEventListener("abort",this._handleAbortProxy),this._request.removeEventListener("error",this._handleErrorProxy),this._request.removeEventListener("timeout",this._handleTimeoutProxy),this._request.removeEventListener("load",this._handleLoadProxy),this._request.removeEventListener("readystatechange",this._handleReadyStateChangeProxy)):(this._request.onloadstart=null,this._request.onprogress=null,this._request.onabort=null,this._request.onerror=null,this._request.ontimeout=null,this._request.onload=null,this._request.onreadystatechange=null)},a.toString=function(){return"[PreloadJS XHRRequest]"},createjs.XHRRequest=createjs.promote(XHRRequest,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function LoadQueue(a,b,c){this.AbstractLoader_constructor(),this._plugins=[],this._typeCallbacks={},this._extensionCallbacks={},this.next=null,this.maintainScriptOrder=!0,this.stopOnError=!1,this._maxConnections=1,this._availableLoaders=[createjs.ImageLoader,createjs.JavaScriptLoader,createjs.CSSLoader,createjs.JSONLoader,createjs.JSONPLoader,createjs.SoundLoader,createjs.ManifestLoader,createjs.SpriteSheetLoader,createjs.XMLLoader,createjs.SVGLoader,createjs.BinaryLoader,createjs.VideoLoader,createjs.TextLoader],this._defaultLoaderLength=this._availableLoaders.length,this.init(a,b,c);}var a=createjs.extend(LoadQueue,createjs.AbstractLoader),b=LoadQueue;a.init=function(a,b,c){this.useXHR=!0,this.preferXHR=!0,this._preferXHR=!0,this.setPreferXHR(a),this._paused=!1,this._basePath=b,this._crossOrigin=c,this._loadStartWasDispatched=!1,this._currentlyLoadingScript=null,this._currentLoads=[],this._loadQueue=[],this._loadQueueBackup=[],this._loadItemsById={},this._loadItemsBySrc={},this._loadedResults={},this._loadedRawResults={},this._numItems=0,this._numItemsLoaded=0,this._scriptOrder=[],this._loadedScripts=[],this._lastProgress=0/0},b.loadTimeout=8e3,b.LOAD_TIMEOUT=0,b.BINARY=createjs.AbstractLoader.BINARY,b.CSS=createjs.AbstractLoader.CSS,b.IMAGE=createjs.AbstractLoader.IMAGE,b.JAVASCRIPT=createjs.AbstractLoader.JAVASCRIPT,b.JSON=createjs.AbstractLoader.JSON,b.JSONP=createjs.AbstractLoader.JSONP,b.MANIFEST=createjs.AbstractLoader.MANIFEST,b.SOUND=createjs.AbstractLoader.SOUND,b.VIDEO=createjs.AbstractLoader.VIDEO,b.SVG=createjs.AbstractLoader.SVG,b.TEXT=createjs.AbstractLoader.TEXT,b.XML=createjs.AbstractLoader.XML,b.POST=createjs.AbstractLoader.POST,b.GET=createjs.AbstractLoader.GET,a.registerLoader=function(a){if(!a||!a.canLoadItem)throw new Error("loader is of an incorrect type.");if(-1!=this._availableLoaders.indexOf(a))throw new Error("loader already exists.");this._availableLoaders.unshift(a)},a.unregisterLoader=function(a){var b=this._availableLoaders.indexOf(a);-1!=b&&b<this._defaultLoaderLength-1&&this._availableLoaders.splice(b,1)},a.setUseXHR=function(a){return this.setPreferXHR(a)},a.setPreferXHR=function(a){return this.preferXHR=0!=a&&null!=window.XMLHttpRequest,this.preferXHR},a.removeAll=function(){this.remove()},a.remove=function(a){var b=null;if(!a||a instanceof Array){if(a)b=a;else if(arguments.length>0)return}else b=[a];var c=!1;if(b){for(;b.length;){var d=b.pop(),e=this.getResult(d);for(f=this._loadQueue.length-1;f>=0;f--)if(g=this._loadQueue[f].getItem(),g.id==d||g.src==d){this._loadQueue.splice(f,1)[0].cancel();break}for(f=this._loadQueueBackup.length-1;f>=0;f--)if(g=this._loadQueueBackup[f].getItem(),g.id==d||g.src==d){this._loadQueueBackup.splice(f,1)[0].cancel();break}if(e)this._disposeItem(this.getItem(d));else for(var f=this._currentLoads.length-1;f>=0;f--){var g=this._currentLoads[f].getItem();if(g.id==d||g.src==d){this._currentLoads.splice(f,1)[0].cancel(),c=!0;break}}}c&&this._loadNext()}else{this.close();for(var h in this._loadItemsById)this._disposeItem(this._loadItemsById[h]);this.init(this.preferXHR,this._basePath)}},a.reset=function(){this.close();for(var a in this._loadItemsById)this._disposeItem(this._loadItemsById[a]);for(var b=[],c=0,d=this._loadQueueBackup.length;d>c;c++)b.push(this._loadQueueBackup[c].getItem());this.loadManifest(b,!1)},a.installPlugin=function(a){if(null!=a&&null!=a.getPreloadHandlers){this._plugins.push(a);var b=a.getPreloadHandlers();if(b.scope=a,null!=b.types)for(var c=0,d=b.types.length;d>c;c++)this._typeCallbacks[b.types[c]]=b;if(null!=b.extensions)for(c=0,d=b.extensions.length;d>c;c++)this._extensionCallbacks[b.extensions[c]]=b}},a.setMaxConnections=function(a){this._maxConnections=a,!this._paused&&this._loadQueue.length>0&&this._loadNext()},a.loadFile=function(a,b,c){if(null==a){var d=new createjs.ErrorEvent("PRELOAD_NO_FILE");return void this._sendError(d)}this._addItem(a,null,c),this.setPaused(b!==!1?!1:!0)},a.loadManifest=function(a,c,d){var e=null,f=null;if(a instanceof Array){if(0==a.length){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_EMPTY");return void this._sendError(g)}e=a}else if("string"==typeof a)e=[{src:a,type:b.MANIFEST}];else{if("object"!=typeof a){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_NULL");return void this._sendError(g)}if(void 0!==a.src){if(null==a.type)a.type=b.MANIFEST;else if(a.type!=b.MANIFEST){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_TYPE");this._sendError(g)}e=[a]}else void 0!==a.manifest&&(e=a.manifest,f=a.path)}for(var h=0,i=e.length;i>h;h++)this._addItem(e[h],f,d);this.setPaused(c!==!1?!1:!0)},a.load=function(){this.setPaused(!1)},a.getItem=function(a){return this._loadItemsById[a]||this._loadItemsBySrc[a]},a.getResult=function(a,b){var c=this._loadItemsById[a]||this._loadItemsBySrc[a];if(null==c)return null;var d=c.id;return b&&this._loadedRawResults[d]?this._loadedRawResults[d]:this._loadedResults[d]},a.getItems=function(a){var b=[];for(var c in this._loadItemsById){var d=this._loadItemsById[c],e=this.getResult(c);(a!==!0||null!=e)&&b.push({item:d,result:e,rawResult:this.getResult(c,!0)})}return b},a.setPaused=function(a){this._paused=a,this._paused||this._loadNext()},a.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();this._scriptOrder.length=0,this._loadedScripts.length=0,this.loadStartWasDispatched=!1,this._itemCount=0,this._lastProgress=0/0},a._addItem=function(a,b,c){var d=this._createLoadItem(a,b,c);if(null!=d){var e=this._createLoader(d);null!=e&&("plugins"in e&&(e.plugins=this._plugins),d._loader=e,this._loadQueue.push(e),this._loadQueueBackup.push(e),this._numItems++,this._updateProgress(),(this.maintainScriptOrder&&d.type==createjs.LoadQueue.JAVASCRIPT||d.maintainOrder===!0)&&(this._scriptOrder.push(d),this._loadedScripts.push(null)))}},a._createLoadItem=function(a,b,c){var d=createjs.LoadItem.create(a);if(null==d)return null;var e="",f=c||this._basePath;if(d.src instanceof Object){if(!d.type)return null;if(b){e=b;var g=createjs.RequestUtils.parseURI(b);null==f||g.absolute||g.relative||(e=f+e)}else null!=f&&(e=f)}else{var h=createjs.RequestUtils.parseURI(d.src);h.extension&&(d.ext=h.extension),null==d.type&&(d.type=createjs.RequestUtils.getTypeByExtension(d.ext));var i=d.src;if(!h.absolute&&!h.relative)if(b){e=b;var g=createjs.RequestUtils.parseURI(b);i=b+i,null==f||g.absolute||g.relative||(e=f+e)}else null!=f&&(e=f);d.src=e+d.src}d.path=e,(void 0===d.id||null===d.id||""===d.id)&&(d.id=i);var j=this._typeCallbacks[d.type]||this._extensionCallbacks[d.ext];if(j){var k=j.callback.call(j.scope,d,this);if(k===!1)return null;k===!0||null!=k&&(d._loader=k),h=createjs.RequestUtils.parseURI(d.src),null!=h.extension&&(d.ext=h.extension)}return this._loadItemsById[d.id]=d,this._loadItemsBySrc[d.src]=d,null==d.crossOrigin&&(d.crossOrigin=this._crossOrigin),d},a._createLoader=function(a){if(null!=a._loader)return a._loader;for(var b=this.preferXHR,c=0;c<this._availableLoaders.length;c++){var d=this._availableLoaders[c];if(d&&d.canLoadItem(a))return new d(a,b)}return null},a._loadNext=function(){if(!this._paused){this._loadStartWasDispatched||(this._sendLoadStart(),this._loadStartWasDispatched=!0),this._numItems==this._numItemsLoaded?(this.loaded=!0,this._sendComplete(),this.next&&this.next.load&&this.next.load()):this.loaded=!1;for(var a=0;a<this._loadQueue.length&&!(this._currentLoads.length>=this._maxConnections);a++){var b=this._loadQueue[a];this._canStartLoad(b)&&(this._loadQueue.splice(a,1),a--,this._loadItem(b))}}},a._loadItem=function(a){a.on("fileload",this._handleFileLoad,this),a.on("progress",this._handleProgress,this),a.on("complete",this._handleFileComplete,this),a.on("error",this._handleError,this),a.on("fileerror",this._handleFileError,this),this._currentLoads.push(a),this._sendFileStart(a.getItem()),a.load()},a._handleFileLoad=function(a){a.target=null,this.dispatchEvent(a)},a._handleFileError=function(a){var b=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,a.item);this._sendError(b)},a._handleError=function(a){var b=a.target;this._numItemsLoaded++,this._finishOrderedItem(b,!0),this._updateProgress();var c=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,b.getItem());this._sendError(c),this.stopOnError?this.setPaused(!0):(this._removeLoadItem(b),this._cleanLoadItem(b),this._loadNext())},a._handleFileComplete=function(a){var b=a.target,c=b.getItem(),d=b.getResult();this._loadedResults[c.id]=d;var e=b.getResult(!0);null!=e&&e!==d&&(this._loadedRawResults[c.id]=e),this._saveLoadedItems(b),this._removeLoadItem(b),this._finishOrderedItem(b)||this._processFinishedLoad(c,b),this._cleanLoadItem(b)},a._saveLoadedItems=function(a){var b=a.getLoadedItems();if(null!==b)for(var c=0;c<b.length;c++){var d=b[c].item;this._loadItemsBySrc[d.src]=d,this._loadItemsById[d.id]=d,this._loadedResults[d.id]=b[c].result,this._loadedRawResults[d.id]=b[c].rawResult}},a._finishOrderedItem=function(a,b){var c=a.getItem();if(this.maintainScriptOrder&&c.type==createjs.LoadQueue.JAVASCRIPT||c.maintainOrder){a instanceof createjs.JavaScriptLoader&&(this._currentlyLoadingScript=!1);var d=createjs.indexOf(this._scriptOrder,c);return-1==d?!1:(this._loadedScripts[d]=b===!0?!0:c,this._checkScriptLoadOrder(),!0)}return!1},a._checkScriptLoadOrder=function(){for(var a=this._loadedScripts.length,b=0;a>b;b++){var c=this._loadedScripts[b];if(null===c)break;if(c!==!0){var d=this._loadedResults[c.id];c.type==createjs.LoadQueue.JAVASCRIPT&&createjs.DomUtils.appendToHead(d);var e=c._loader;this._processFinishedLoad(c,e),this._loadedScripts[b]=!0}}},a._processFinishedLoad=function(a,b){this._numItemsLoaded++,this.maintainScriptOrder||a.type!=createjs.LoadQueue.JAVASCRIPT||createjs.DomUtils.appendToHead(a.result),this._updateProgress(),this._sendFileComplete(a,b),this._loadNext()},a._canStartLoad=function(a){if(!this.maintainScriptOrder||a.preferXHR)return!0;var b=a.getItem();if(b.type!=createjs.LoadQueue.JAVASCRIPT)return!0;if(this._currentlyLoadingScript)return!1;for(var c=this._scriptOrder.indexOf(b),d=0;c>d;){var e=this._loadedScripts[d];if(null==e)return!1;d++}return this._currentlyLoadingScript=!0,!0},a._removeLoadItem=function(a){for(var b=this._currentLoads.length,c=0;b>c;c++)if(this._currentLoads[c]==a){this._currentLoads.splice(c,1);break}},a._cleanLoadItem=function(a){var b=a.getItem();b&&delete b._loader},a._handleProgress=function(a){var b=a.target;this._sendFileProgress(b.getItem(),b.progress),this._updateProgress()},a._updateProgress=function(){var a=this._numItemsLoaded/this._numItems,b=this._numItems-this._numItemsLoaded;if(b>0){for(var c=0,d=0,e=this._currentLoads.length;e>d;d++)c+=this._currentLoads[d].progress;a+=c/b*(b/this._numItems)}this._lastProgress!=a&&(this._sendProgress(a),this._lastProgress=a)},a._disposeItem=function(a){delete this._loadedResults[a.id],delete this._loadedRawResults[a.id],delete this._loadItemsById[a.id],delete this._loadItemsBySrc[a.src]},a._sendFileProgress=function(a,b){if(!this._isCanceled()&&!this._paused&&this.hasEventListener("fileprogress")){var c=new createjs.Event("fileprogress");c.progress=b,c.loaded=b,c.total=1,c.item=a,this.dispatchEvent(c)}},a._sendFileComplete=function(a,b){if(!this._isCanceled()&&!this._paused){var c=new createjs.Event("fileload");c.loader=b,c.item=a,c.result=this._loadedResults[a.id],c.rawResult=this._loadedRawResults[a.id],a.completeHandler&&a.completeHandler(c),this.hasEventListener("fileload")&&this.dispatchEvent(c)}},a._sendFileStart=function(a){var b=new createjs.Event("filestart");b.item=a,this.hasEventListener("filestart")&&this.dispatchEvent(b)},a.toString=function(){return"[PreloadJS LoadQueue]"},createjs.LoadQueue=createjs.promote(LoadQueue,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function TextLoader(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.TEXT)}var a=(createjs.extend(TextLoader,createjs.AbstractLoader),TextLoader);a.canLoadItem=function(a){return a.type==createjs.AbstractLoader.TEXT},createjs.TextLoader=createjs.promote(TextLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function BinaryLoader(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.BINARY),this.on("initialize",this._updateXHR,this)}var a=createjs.extend(BinaryLoader,createjs.AbstractLoader),b=BinaryLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.BINARY},a._updateXHR=function(a){a.loader.setResponseType("arraybuffer")},createjs.BinaryLoader=createjs.promote(BinaryLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function CSSLoader(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.CSS),this.resultFormatter=this._formatResult,this._tagSrcAttribute="href",this._tag=document.createElement(b?"style":"link"),this._tag.rel="stylesheet",this._tag.type="text/css"}var a=createjs.extend(CSSLoader,createjs.AbstractLoader),b=CSSLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.CSS},a._formatResult=function(a){if(this._preferXHR){var b=a.getTag();if(b.styleSheet)b.styleSheet.cssText=a.getResult(!0);else{var c=document.createTextNode(a.getResult(!0));b.appendChild(c)}}else b=this._tag;return createjs.DomUtils.appendToHead(b),b},createjs.CSSLoader=createjs.promote(CSSLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function ImageLoader(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.IMAGE),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",createjs.RequestUtils.isImageTag(a)?this._tag=a:createjs.RequestUtils.isImageTag(a.src)?this._tag=a.src:createjs.RequestUtils.isImageTag(a.tag)&&(this._tag=a.tag),null!=this._tag?this._preferXHR=!1:this._tag=document.createElement("img"),this.on("initialize",this._updateXHR,this)}var a=createjs.extend(ImageLoader,createjs.AbstractLoader),b=ImageLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.IMAGE},a.load=function(){if(""!=this._tag.src&&this._tag.complete)return void this._sendComplete();var a=this._item.crossOrigin;1==a&&(a="Anonymous"),null==a||createjs.RequestUtils.isLocal(this._item.src)||(this._tag.crossOrigin=a),this.AbstractLoader_load()},a._updateXHR=function(a){a.loader.mimeType="text/plain; charset=x-user-defined-binary",a.loader.setResponseType&&a.loader.setResponseType("blob")},a._formatResult=function(a){var b=this;return function(c){var d=b._tag,e=window.URL||window.webkitURL;if(b._preferXHR)if(e){var f=e.createObjectURL(a.getResult(!0));d.src=f,d.onload=function(){e.revokeObjectURL(b.src)}}else d.src=a.getItem().src;else;d.complete?c(d):d.onload=function(){c(this)}}},createjs.ImageLoader=createjs.promote(ImageLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function JavaScriptLoader(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.JAVASCRIPT),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",this.setTag(document.createElement("script"))}var a=createjs.extend(JavaScriptLoader,createjs.AbstractLoader),b=JavaScriptLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JAVASCRIPT},a._formatResult=function(a){var b=a.getTag();return this._preferXHR&&(b.text=a.getResult(!0)),b},createjs.JavaScriptLoader=createjs.promote(JavaScriptLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function JSONLoader(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.JSON),this.resultFormatter=this._formatResult}var a=createjs.extend(JSONLoader,createjs.AbstractLoader),b=JSONLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSON&&!a._loadAsJSONP},a._formatResult=function(a){var b=null;try{b=createjs.DataUtils.parseJSON(a.getResult(!0))}catch(c){var d=new createjs.ErrorEvent("JSON_FORMAT",null,c);return this._sendError(d),c}return b},createjs.JSONLoader=createjs.promote(JSONLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function JSONPLoader(a){this.AbstractLoader_constructor(a,!1,createjs.AbstractLoader.JSONP),this.setTag(document.createElement("script")),this.getTag().type="text/javascript"}var a=createjs.extend(JSONPLoader,createjs.AbstractLoader),b=JSONPLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSONP||a._loadAsJSONP},a.cancel=function(){this.AbstractLoader_cancel(),this._dispose()},a.load=function(){if(null==this._item.callback)throw new Error("callback is required for loading JSONP requests.");if(null!=window[this._item.callback])throw new Error("JSONP callback '"+this._item.callback+"' already exists on window. You need to specify a different callback or re-name the current one.");window[this._item.callback]=createjs.proxy(this._handleLoad,this),window.document.body.appendChild(this._tag),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout),this._tag.src=this._item.src},a._handleLoad=function(a){this._result=this._rawResult=a,this._sendComplete(),this._dispose()},a._handleTimeout=function(){this._dispose(),this.dispatchEvent(new createjs.ErrorEvent("timeout"))},a._dispose=function(){window.document.body.removeChild(this._tag),delete window[this._item.callback],clearTimeout(this._loadTimeout)},createjs.JSONPLoader=createjs.promote(JSONPLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function ManifestLoader(a){this.AbstractLoader_constructor(a,null,createjs.AbstractLoader.MANIFEST),this.plugins=null,this._manifestQueue=null}var a=createjs.extend(ManifestLoader,createjs.AbstractLoader),b=ManifestLoader;b.MANIFEST_PROGRESS=.25,b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.MANIFEST},a.load=function(){this.AbstractLoader_load()},a._createRequest=function(){var a=this._item.callback;this._request=null!=a?new createjs.JSONPLoader(this._item):new createjs.JSONLoader(this._item)},a.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(b.MANIFEST_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=b.MANIFEST_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},a.destroy=function(){this.AbstractLoader_destroy(),this._manifestQueue.close()},a._loadManifest=function(a){if(a&&a.manifest){var b=this._manifestQueue=new createjs.LoadQueue;b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("complete",this._handleManifestComplete,this,!0),b.on("error",this._handleManifestError,this,!0);for(var c=0,d=this.plugins.length;d>c;c++)b.installPlugin(this.plugins[c]);b.loadManifest(a)}else this._sendComplete()},a._handleManifestFileLoad=function(a){a.target=null,this.dispatchEvent(a)},a._handleManifestComplete=function(){this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},a._handleManifestProgress=function(a){this.progress=a.progress*(1-b.MANIFEST_PROGRESS)+b.MANIFEST_PROGRESS,this._sendProgress(this.progress)},a._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.ManifestLoader=createjs.promote(ManifestLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function SoundLoader(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.SOUND),createjs.RequestUtils.isAudioTag(a)?this._tag=a:createjs.RequestUtils.isAudioTag(a.src)?this._tag=a:createjs.RequestUtils.isAudioTag(a.tag)&&(this._tag=createjs.RequestUtils.isAudioTag(a)?a:a.src),null!=this._tag&&(this._preferXHR=!1)}var a=createjs.extend(SoundLoader,createjs.AbstractMediaLoader),b=SoundLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SOUND},a._createTag=function(a){var b=document.createElement("audio");return b.autoplay=!1,b.preload="none",b.src=a,b},createjs.SoundLoader=createjs.promote(SoundLoader,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function VideoLoader(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.VIDEO),createjs.RequestUtils.isVideoTag(a)||createjs.RequestUtils.isVideoTag(a.src)?(this.setTag(createjs.RequestUtils.isVideoTag(a)?a:a.src),this._preferXHR=!1):this.setTag(this._createTag())}var a=createjs.extend(VideoLoader,createjs.AbstractMediaLoader),b=VideoLoader;a._createTag=function(){return document.createElement("video")},b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.VIDEO},createjs.VideoLoader=createjs.promote(VideoLoader,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function SpriteSheetLoader(a){this.AbstractLoader_constructor(a,null,createjs.AbstractLoader.SPRITESHEET),this._manifestQueue=null}var a=createjs.extend(SpriteSheetLoader,createjs.AbstractLoader),b=SpriteSheetLoader;b.SPRITESHEET_PROGRESS=.25,b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SPRITESHEET},a.destroy=function(){this.AbstractLoader_destroy,this._manifestQueue.close()},a._createRequest=function(){var a=this._item.callback;this._request=null!=a&&a instanceof Function?new createjs.JSONPLoader(this._item):new createjs.JSONLoader(this._item)},a.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(b.SPRITESHEET_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=b.SPRITESHEET_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},a._loadManifest=function(a){if(a&&a.images){var b=this._manifestQueue=new createjs.LoadQueue;b.on("complete",this._handleManifestComplete,this,!0),b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("error",this._handleManifestError,this,!0),b.loadManifest(a.images)}},a._handleManifestFileLoad=function(a){var b=a.result;if(null!=b){var c=this.getResult().images,d=c.indexOf(a.item.src);c[d]=b}},a._handleManifestComplete=function(){this._result=new createjs.SpriteSheet(this._result),this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},a._handleManifestProgress=function(a){this.progress=a.progress*(1-b.SPRITESHEET_PROGRESS)+b.SPRITESHEET_PROGRESS,this._sendProgress(this.progress)},a._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.SpriteSheetLoader=createjs.promote(SpriteSheetLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function SVGLoader(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.SVG),this.resultFormatter=this._formatResult,this._tagSrcAttribute="data",b?this.setTag(document.createElement("svg")):(this.setTag(document.createElement("object")),this.getTag().type="image/svg+xml")}var a=createjs.extend(SVGLoader,createjs.AbstractLoader),b=SVGLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SVG},a._formatResult=function(a){var b=createjs.DataUtils.parseXML(a.getResult(!0),"text/xml"),c=a.getTag();return!this._preferXHR&&document.body.contains(c)&&document.body.removeChild(c),null!=b.documentElement?(c.appendChild(b.documentElement),c.style.visibility="visible",c):b},createjs.SVGLoader=createjs.promote(SVGLoader,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function XMLLoader(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.XML),this.resultFormatter=this._formatResult}var a=createjs.extend(XMLLoader,createjs.AbstractLoader),b=XMLLoader;b.canLoadItem=function(a){return a.type==createjs.AbstractLoader.XML},a._formatResult=function(a){return createjs.DataUtils.parseXML(a.getResult(!0),"text/xml")},createjs.XMLLoader=createjs.promote(XMLLoader,"AbstractLoader")}();;
createjs.EventDispatcher.prototype.___on = createjs.EventDispatcher.prototype.on;
createjs.EventDispatcher.prototype.on = function() {
  if (arguments.length === 2) {
    return this.addEventListener.apply(this, arguments);
  } else {
    return this.___on.apply(this, arguments);
  }
};
(function() {
  'use strict';
  var CacheControllerPlugin, s;
  CacheControllerPlugin = function() {};
  s = CacheControllerPlugin;
  s.getPreloadHandlers = function() {
    return {
      callback: s.preloadHandler,
      types: ["binary", "image", "javascript", "json", "jsonp", "sound", "video", "svg", "text", "xml"]
    };
  };
  s.preloadHandler = function(p_loadItem, p_queue) {
    var cache, cv, parentView, ts, view, views, _ref;
    views = typeof app !== "undefined" && app !== null ? (_ref = app.config) != null ? _ref.views : void 0 : void 0;
    view = views != null ? views[p_queue.id] : void 0;
    parentView = views != null ? views[view != null ? view.parentView : void 0] : void 0;
    cv = false;
    if (p_loadItem.cache != null) {
      if (p_loadItem.cache === false) {
        cv = true;
      }
    } else if ((view != null ? view.cache : void 0) != null) {
      if ((view != null ? view.cache : void 0) === false) {
        cv = true;
      }
    } else if ((parentView != null ? parentView.cache : void 0) != null) {
      if ((parentView != null ? parentView.cache : void 0) === false) {
        cv = true;
      }
    }
    if (p_loadItem.src.indexOf("?v=") === -1) {
      ts = new Date().getTime();
      cache = cv ? "?v=" + app.getInfo().version + "&noCache=" + ts : "?v=" + app.getInfo().version;
      p_loadItem.src += cache;
    }
    return true;
  };
  createjs.CacheControllerPlugin = CacheControllerPlugin;
})();
this.createjs = this.createjs || {};
(function() {
  var MediaRequest, p, s;
  MediaRequest = function(loadItem, tag, srcAttribute) {
    this.fullBuffer = loadItem.fullBuffer;
    this.AbstractRequest_constructor(loadItem);
    this._tag = tag;
    this._tagSrcAttribute = srcAttribute;
    this._complete = createjs.proxy(this._handleTagComplete, this);
  };
  'use strict';
  p = createjs.extend(MediaRequest, createjs.TagRequest);
  s = MediaRequest;
  p.load = function() {
    var _error, _progress, _stalled, _timeout;
    _progress = createjs.proxy(this._handleProgress, this);
    this._handleProgress = _progress;
    _stalled = createjs.proxy(this._handleStalled, this);
    this._handleStalled = _stalled;
    _error = createjs.proxy(this._handleError, this);
    this._handleError = _error;
    _timeout = createjs.proxy(this._handleTimeout, this);
    this._handleTimeout = _timeout;
    this.____timer = setInterval(_progress, 10);
    if (this._tag.addEventListener) {
      this._tag.addEventListener('progress', _progress);
      this._tag.addEventListener('stalled', _stalled);
      this._tag.addEventListener('error', _error);
    } else {
      this._tag.onprogress = _progress;
      this._tag.onstalled = _stalled;
      this._tag.onerror = _error;
    }
    if (this.fullBuffer || this.fullBuffer === void 0) {
      if (this._tag.addEventListener) {
        this._tag.addEventListener('ended', this._complete, false);
        this._tag.addEventListener('complete', this._complete, false);
      } else {
        this._tag.onended = this._tag.oncomplete = this._complete;
      }
    } else {
      if (this._tag.addEventListener) {
        this._tag.addEventListener('canplaythrough', this._complete, false);
      } else {
        this._tag.oncanplaythrough = this._complete;
      }
    }
    this.TagRequest_load();
  };
  p._handleTimeout = function() {};
  p._handleStalled = function() {};
  p._handleError = function(evt) {
    var err;
    try {
      console.log(evt.data);
      throw new Error(evt.title);
    } catch (_error) {
      err = _error;
      return console.log(err.stack);
    }
  };
  p._handleProgress = function() {
    var err, loaded, total;
    try {
      loaded = this._tag.buffered.end(this._tag.buffered.length - 1);
      total = this._tag.duration;
      this._tag.currentTime = loaded;
      this.dispatchEvent(new createjs.ProgressEvent(loaded, total));
    } catch (_error) {
      err = _error;
    }
    if (Math.round(loaded) >= Math.round(total)) {
      this._complete();
    }
  };
  p.destroy = function() {
    this.TagRequest_destroy();
  };
  p._handleTagComplete = function() {
    this.TagRequest__handleTagComplete();
  };
  p._clean = function() {
    var err, loaded, total, _ref;
    try {
      loaded = this._tag.buffered.end(this._tag.buffered.length - 1);
      total = this._tag.duration;
    } catch (_error) {
      err = _error;
    }
    if (Math.round(loaded) >= Math.round(total)) {
      clearInterval(this.____timer);
      this.____timer = null;
      if (this._tag.removeEventListener) {
        this._tag.removeEventListener('progress', this._handleProgress);
        this._tag.removeEventListener('stalled', this._handleStalled);
        this._tag.removeEventListener('error', this._handleError);
        this._tag.removeEventListener('ended', this._complete);
        this._tag.removeEventListener('complete', this._complete);
        this._tag.removeEventListener('canplaythrough', this._complete);
      } else {
        this._tag.onended = null;
        this._tag.oncanplaythrough = null;
        this._tag.onprogress = null;
        this._tag.onstalled = null;
        this._tag.onerror = null;
      }
      if ((_ref = this._tag) != null) {
        _ref.currentTime = 0.0001;
      }
      this.TagRequest__clean();
    }
  };
  createjs.MediaRequest = createjs.promote(MediaRequest, 'TagRequest');
})();
this.createjs = this.createjs || {};
(function() {
  var TagMediaLoader, p;
  TagMediaLoader = function(loadItem, preferXHR, type) {
    this.AbstractLoader_constructor(loadItem, preferXHR, type);
    this.resultFormatter = this._formatResult;
    this._tagSrcAttribute = 'src';
  };
  'use strict';
  p = createjs.extend(TagMediaLoader, createjs.AbstractLoader);
  p.load = function() {
    if (!this._tag) {
      this._tag = this._createTag(this._item.src);
    }
    this._tag.preload = 'auto';
    this._tag.load();
    this.AbstractLoader_load();
  };
  p._createTag = function() {};
  p._createRequest = function() {
    this._request = new createjs.MediaRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
  };
  p._formatResult = function(loader) {
    this._tag.removeEventListener && this._tag.removeEventListener('complete', this._loadedHandler);
    this._tag.removeEventListener && this._tag.removeEventListener('canplaythrough', this._loadedHandler);
    this._tag.onstalled = null;
    if (this._preferXHR) {
      loader.getTag().src = loader.getResult(true);
    }
    return loader.getTag();
  };
  createjs.TagMediaLoader = createjs.promote(TagMediaLoader, 'AbstractLoader');
})();
this.createjs = this.createjs || {};
(function() {
  var MediaLoader, p, s;
  MediaLoader = function(loadItem, preferXHR) {
    this.___item = loadItem;
    if (loadItem.type === "video") {
      this.TagMediaLoader_constructor(loadItem, preferXHR, createjs.AbstractLoader.VIDEO);
      if (createjs.RequestUtils.isVideoTag(loadItem) || createjs.RequestUtils.isVideoTag(loadItem.src)) {
        this.setTag(createjs.RequestUtils.isVideoTag(loadItem) ? loadItem : loadItem.src);
        this._preferXHR = false;
      } else {
        this.setTag(this._createTag());
      }
    } else {
      this.TagMediaLoader_constructor(loadItem, preferXHR, createjs.AbstractLoader.SOUND);
      if (createjs.RequestUtils.isAudioTag(loadItem)) {
        this._tag = loadItem;
      } else if (createjs.RequestUtils.isAudioTag(loadItem.src)) {
        this._tag = loadItem;
      } else if (createjs.RequestUtils.isAudioTag(loadItem.tag)) {
        this._tag = createjs.RequestUtils.isAudioTag(loadItem) ? loadItem : loadItem.src;
      }
      if (this._tag !== null) {
        this._preferXHR = false;
      }
    }
  };
  'use strict';
  s = MediaLoader;
  p = createjs.extend(MediaLoader, createjs.TagMediaLoader);
  p._createTag = function(src) {
    var tag;
    if (this.___item.type === 'video') {
      tag = document.createElement('video');
      tag.type = "video/mp4";
      tag.preload = 'auto';
    } else {
      tag = document.createElement('audio');
      tag.type = "audio/mpeg";
      tag.preload = 'none';
      tag.src = src;
    }
    if (this.___item.id != null) {
      tag.id = this.___item.id;
    }
    if (!this.___item.autoplay || this.___item.autoplay === void 0) {
      tag.autoplay = false;
    } else {
      tag.autoplay = this.___item.autoplay;
    }
    if (!this.___item.loop || this.___item.loop === void 0) {
      tag.loop = false;
    } else {
      tag.loop = this.___item.loop;
    }
    if (!this.___item.volume || this.___item.volume === void 0) {
      tag.volume = 1;
    } else {
      tag.volume = this.___item.volume;
    }
    return tag;
  };
  s.canLoadItem = function(item) {
    if (this.___item.type === 'video') {
      return item.type === createjs.AbstractLoader.VIDEO;
    } else {
      return item.type === createjs.AbstractLoader.SOUND;
    }
  };
  createjs.MediaLoader = createjs.promote(MediaLoader, 'TagMediaLoader');
})();
(function() {
  'use strict';
  var MediaPlugin, s;
  MediaPlugin = function() {};
  s = MediaPlugin;
  s.getPreloadHandlers = function() {
    return {
      callback: MediaPlugin.handlers,
      types: ['sound', 'video'],
      extensions: ['mp3', 'mp4']
    };
  };
  s.handlers = function(p_loadItem, p_queue) {
    var loader;
    loader = new createjs.MediaLoader(p_loadItem, false);
    return loader;
  };
  createjs.MediaPlugin = MediaPlugin;
})();
var AssetLoader;
AssetLoader = (function(_super) {
  __extends(AssetLoader, _super);
  AssetLoader.INITIALIZE = "initialize";
  AssetLoader.COMPLETE_ALL = "complete";
  AssetLoader.COMPLETE_FILE = "fileload";
  AssetLoader.PROGRESS_ALL = "progress";
  AssetLoader.PROGRESS_FILE = "fileprogress";
  AssetLoader.START_ALL = "loadstart";
  AssetLoader.START_FILE = "filestart";
  AssetLoader.ERROR = "error";
  AssetLoader.FILE_ERROR = "fileerror";
  AssetLoader.getInstance = function() {
    return AssetLoader._instance != null ? AssetLoader._instance : AssetLoader._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(AssetLoader, arguments, function(){});
  };
  AssetLoader.prototype._groups = null;
  function AssetLoader() {
    this._fileLoad = __bind(this._fileLoad, this);
    this._onFileError = __bind(this._onFileError, this);
    this._onError = __bind(this._onError, this);
    this._groups = {};
  }
  AssetLoader.prototype.loadGroup = function(p_groupId, p_files) {
    var group;
    group = this.getGroup(p_groupId);
    group.loadManifest(p_files);
    return group;
  };
  AssetLoader.prototype.getGroup = function(p_groupId, p_concurrent, p_xhr) {
    var group;
    if (p_concurrent == null) {
      p_concurrent = 3;
    }
    if (p_xhr == null) {
      p_xhr = true;
    }
    group = this._groups[p_groupId];
    if (!group) {
      group = new createjs.LoadQueue(p_xhr);
      group.installPlugin(createjs.MediaPlugin);
      group.id = p_groupId;
      this._groups[p_groupId] = group;
      group.addEventListener(AssetLoader.COMPLETE_FILE, this._fileLoad);
      group.addEventListener(AssetLoader.ERROR, this._onError);
      group.addEventListener(AssetLoader.FILE_ERROR, this._onFileError);
    }
    group.setMaxConnections(p_concurrent);
    return group;
  };
  AssetLoader.prototype.preferXHR = function(p_groupId, p_value) {
    var group;
    if (p_value == null) {
      p_value = true;
    }
    group = this.getGroup(p_groupId).setPreferXHR = p_value;
    return group;
  };
  AssetLoader.prototype._onError = function(e) {
    e.currentTarget.removeEventListener(AssetLoader.ERROR, this._onError);
    e.currentTarget.removeEventListener(AssetLoader.COMPLETE_FILE, this._fileLoad);
    console.log(e);
    throw new Error(e.title).stack;
    return false;
  };
  AssetLoader.prototype._onFileError = function(e) {
    e.currentTarget.removeEventListener(AssetLoader.FILE_ERROR, this._onFileError);
    e.currentTarget.removeEventListener(AssetLoader.COMPLETE_FILE, this._fileLoad);
    console.log(e);
    throw new Error(e.title).stack;
    return false;
  };
  AssetLoader.prototype._fileLoad = function(e) {
    e.currentTarget.removeEventListener(AssetLoader.COMPLETE_FILE, this._fileLoad);
    e.currentTarget.removeEventListener(AssetLoader.ERROR, this._onError);
    e.currentTarget.removeEventListener(AssetLoader.FILE_ERROR, this._onFileError);
    e.item.tag = e.result;
    return false;
  };
  AssetLoader.prototype.getItem = function(p_id, p_groupId) {
    var i, k, v, _ref, _ref1;
    if (p_groupId == null) {
      p_groupId = null;
    }
    if (p_groupId) {
      return (_ref = this._groups[p_groupId]) != null ? _ref.getItem(p_id) : void 0;
    }
    _ref1 = this._groups;
    for (k in _ref1) {
      v = _ref1[k];
      if (i = v.getItem(p_id)) {
        return i;
      }
    }
  };
  AssetLoader.prototype.getResult = function(p_id, p_groupId) {
    var i, k, result, v, _ref, _ref1;
    if (p_groupId == null) {
      p_groupId = null;
    }
    result = null;
    if (p_groupId) {
      result = (_ref = this._groups[p_groupId]) != null ? _ref.getResult(p_id) : void 0;
    }
    _ref1 = this._groups;
    for (k in _ref1) {
      v = _ref1[k];
      if (i = v.getResult(p_id)) {
        result = i;
      }
    }
    return result;
  };
  AssetLoader.addFiles = function(p_files, p_queue) {
    var f, jsRE, mp4RE, obj, _i, _len;
    jsRE = /.*\.(js|css|svg)$/g;
    mp4RE = /.*\.(mp4)$/g;
    for (_i = 0, _len = p_files.length; _i < _len; _i++) {
      f = p_files[_i];
      obj = {
        id: '',
        src: ''
      };
      jsRE.lastIndex = 0;
      obj.id = f.id || 'item';
      obj.src = f.src;
      if (mp4RE.test(obj.src)) {
        obj['type'] = 'video';
      }
      if (f.src && jsRE.test(f.src)) {
        obj['type'] = 'text';
      }
      if (obj.src) {
        p_queue.loadFile(obj, false);
      }
    }
    if (p_files.length > 0) {
      p_queue.load();
    }
    return false;
  };
  return AssetLoader;
})(EventDispatcher);
/**
Singleton ConditionsValidation class
@class ConditionsValidation
 */
var ConditionsValidation,
  __slice = [].slice;
ConditionsValidation = (function() {
  var _detections, _list;
  _list = null;
  _detections = null;
  ConditionsValidation.getInstance = function(p_data) {
    return ConditionsValidation._instance != null ? ConditionsValidation._instance : ConditionsValidation._instance = new ConditionsValidation(p_data);
  };
  /**
  	@class ConditionsValidation
  	@constructor
  	@param {Object} p_data
   */
  function ConditionsValidation(p_data) {
    this.validate = __bind(this.validate, this);
    _detections = app.detections;
    _list = ObjectUtils.clone(p_data);
  }
  /**
  	Add object condition in internal list.
  	@method add
  	@param {Object} p_obj
  	@return {Boolean}
   */
  ConditionsValidation.prototype.add = function(p_obj) {
    var k, v;
    if (ObjectUtils.hasSameKey(p_obj, _list) || ObjectUtils.isEqual(p_obj, _list)) {
      throw new Error('The object ' + JSON.stringify(p_obj) + ' already exists in validations list.');
    }
    for (k in p_obj) {
      v = p_obj[k];
      _list[k] = v;
    }
    return true;
  };
  /**
  	Returns the internal list of registered conditions.
  	@attribute list
  	@type {Object}
  	@readOnly
   */
  ConditionsValidation.get({
    list: function() {
      return _list;
    }
  });
  /**
  	Returns the object condition of internal list.
  	@method get
  	@param {String} p_keyID
  	@return {Object}
   */
  ConditionsValidation.prototype.get = function(p_keyID) {
    if (this.has(p_keyID)) {
      return _list[p_keyID];
    } else {
      throw new Error("The key " + p_keyID + " does not exists in validations list.");
    }
  };
  /**
  	Checks the conditions already added in internal list.
  	@method has
  	@param {String} p_keyID
  	@return {Boolean}
   */
  ConditionsValidation.prototype.has = function(p_keyID) {
    if (_list[p_keyID]) {
      return true;
    } else {
      return false;
    }
  };
  /**
  	Removes the object condition of internal list.
  	@method remove
  	@param {String} p_keyID
  	@return {Boolean}
   */
  ConditionsValidation.prototype.remove = function(p_keyID) {
    if (_list[p_keyID]) {
      delete _list[p_keyID];
      return true;
    } else {
      throw new Error("The key " + p_keyID + " does not exists in validations list.");
    }
    return false;
  };
  /**
  	This method accepts the ID of a condition object or a group of ID with a <a href="//developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators" target="_blank" class="crosslink">default operators</a>, to returns if only one condition is a valid condition or a group with a sum of conditions are valid.
  	@method test
  	@param {String} p_args The ID of a condition or a group with a sum of conditions.
  	@return {Boolean}
  	@example
  	```
  	//Example of conditions list in config file
  	...
  	"conditions": {
  		"small": {
  			"browser":{
  				"mobile": true
  			},
  			"size": {
  				"min-width":300
  			}
  		},
  		"medium": {
  			"browser":{
  				"tablet": true
  			},
  			"orientation":"landscape",
  			"size": {
  				"min-width":992
  			}
  		},
  		"large": {
  			"browser":{
  				"desktop": true
  			},
  			"size": {
  				"min-width":1200
  			}
  		},
  		"xtra_large": {
  			"size": {
  				"min-width":1500
  			}
  		},
  		"full": {
  			"size": {
  				"min-width":1910
  			}
  		}
  	}
  	...
  	//Example condition with operators in some content file
  	...
  	"src":[
  		{
  			"condition":"xtra_large && full",
  			"file":"file.json"
  		},
  		{
  			"condition":"medium || xtra_large",
  			"file":"file.json"
  		},
  		{
  			"condition":"small < medium",
  			"file":"file.json"
  		},
  		{
  			"condition":"(small > medium) || medium",
  			"file":"file.json"
  		}
  	]
  	//Example single condition in some content file
  	...
  	"src":[
  		{
  			"condition":"default",
  			"file":"{base}data/home.json"
  		}
  	]
  	...
  	```
   */
  ConditionsValidation.prototype.test = function(p_args) {
    var parsed, validate;
    parsed = p_args.replace(new RegExp(/[a-zA-Z0-9-_]+/g), "validate('$&')");
    validate = this.validate;
    return eval('(function(){return (' + parsed + ');})();');
  };
  ConditionsValidation.prototype.validate = function(p_keyID) {
    var a, err, i, k, key, match, matchSize, r, result, total, v, value, _i, _ref, _ref1;
    result = [];
    _ref = this.get(p_keyID);
    for (k in _ref) {
      v = _ref[k];
      switch (k) {
        case "size":
          matchSize = true;
          for (key in v) {
            value = v[key];
            switch (key) {
              case "max-width":
                if (window.innerWidth > value) {
                  matchSize = false;
                  break;
                }
                break;
              case "min-width":
                if (window.innerWidth < value) {
                  matchSize = false;
                  break;
                }
                break;
              case "max-height":
                if (window.innerHeight > value) {
                  matchSize = false;
                  break;
                }
                break;
              case "min-height":
                if (window.innerHeight < value) {
                  matchSize = false;
                  break;
                }
            }
          }
          result.push(matchSize);
          break;
        case "browser":
          for (key in v) {
            value = v[key];
            switch (key) {
              case "ua":
                result.push(new RegExp(value).test(_detections.ua));
                break;
              case "version":
                a = value.match(/\d+/g);
                total = a.length;
                if (total > _detections.versionArr.length) {
                  total = _detections.versionArr.length;
                }
                for (i = _i = 0; 0 <= total ? _i <= total : _i >= total; i = 0 <= total ? ++_i : --_i) {
                  if (a[i] === void 0) {
                    continue;
                  }
                  match = 0;
                  if (a[i] > _detections.versionArr[i]) {
                    match = 1;
                    break;
                  } else if (a[i] < _detections.versionArr[i]) {
                    match = -1;
                    break;
                  }
                }
                r = ((_ref1 = value.match(/[<>=]+/g)) != null ? _ref1[0] : void 0) || '==';
                if (r.lengh === 0) {
                  r = '==';
                }
                result.push(eval('0' + r + 'match'));
                break;
              default:
                try {
                  if (_detections[key] != null) {
                    result.push(value === _detections[key]);
                  }
                } catch (_error) {
                  err = _error;
                }
            }
          }
          break;
        case "domain":
          result.push(v.toLowerCase() === window.location.hostname.toLowerCase());
          break;
        case "platform":
          result.push(v.toLowerCase() === _detections.platform.toLowerCase());
      }
    }
    if (result.indexOf(false) === -1) {
      return true;
    } else {
      return false;
    }
  };
  ConditionsValidation.prototype.customTest = function() {
    var p_args, p_callback;
    p_callback = arguments[0], p_args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return p_callback.call(void 0, p_args);
  };
  return ConditionsValidation;
})();
/**
@class MetaController
@extends EventDispatcher
@final
 */
var MetaController;
MetaController = (function(_super) {
  __extends(MetaController, _super);
  /**
  	Runtime controls some meta tags of current view.<br>
  	For add/edit these tags or values, put the meta object in content file, like explained below:
  	@class MetaController
  	@constructor
  	@example
  	```
  	"meta":
  	{
  		"title": "Default Template - title",
  		"description":"description",
  		"webAppCapable":"true",
  		"color":"#ff00ff",
  		"manifest":"{base}data/manifest.json",
  		"favicon":"{images}icons/favicon-default.ico",
  		"icons":[
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"57x57",
  				"href":"{images}icons/apple-touch-icon-57x57.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"60x60",
  				"href":"{images}icons/apple-touch-icon-60x60.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"72x72",
  				"href":"{images}icons/apple-touch-icon-72x72.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"76x76",
  				"href":"{images}icons/apple-touch-icon-76x76.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"114x114",
  				"href":"{images}icons/apple-touch-icon-114x114.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"120x120",
  				"href":"{images}icons/apple-touch-icon-120x120.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"144x144",
  				"href":"{images}icons/apple-touch-icon-144x144.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"152x152",
  				"href":"{images}icons/apple-touch-icon-152x152.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"180x180",
  				"href":"{images}icons/apple-touch-icon-180x180.png"
  			},
  			{
  				"rel":"icon",
  				"href":"{images}icons/favicon-16x16.png", 
  				"sizes":"16x16"
  			},
  			{
  				"rel":"icon",
  				"href":"{images}icons/favicon-32x32.png", 
  				"sizes":"32x32"
  			},
  			{
  				"rel":"icon",
  				"href":"{images}icons/favicon-96x96.png", 
  				"sizes":"96x96"
  			},
  			{
  				"rel":"icon",
  				"href":"{images}icons/android-chrome-192x192.png", 
  				"sizes":"192x192"
  			}
  		]
  	}
  	```
   */
  function MetaController() {
    MetaController.__super__.constructor.apply(this, arguments);
  }
  MetaController.getInstance = function() {
    return MetaController._instance != null ? MetaController._instance : MetaController._instance = new MetaController();
  };
  /**
  	@method change
  	@param {Object} p_data
   */
  MetaController.prototype.change = function(p_data) {
    var e, k, v;
    if (p_data != null) {
      for (k in p_data) {
        v = p_data[k];
        try {
          this[k] = v;
        } catch (_error) {
          e = _error;
        }
      }
    }
    return false;
  };
  /**
  	@method applyMeta
  	@param {String} p_name
  	@param {String} p_value
  	@protected
   */
  MetaController.prototype.applyMeta = function(p_name, p_value) {
    var meta;
    if (p_value != null) {
      if (document.querySelector('meta[name=' + p_name + ']') != null) {
        document.querySelector('meta[name=' + p_name + ']').content = p_value;
      } else {
        meta = document.createElement('meta');
        meta.name = p_name;
        meta.content = p_value;
        this.head.appendChild(meta);
      }
    }
    return false;
  };
  /**
  	@method applyLink
  	@param {String} p_rel
  	@param {String} p_value
  	@protected
   */
  MetaController.prototype.applyLink = function(p_rel, p_href, p_others) {
    var k, link, v;
    if (p_others == null) {
      p_others = null;
    }
    link = document.createElement('link');
    link.rel = p_rel;
    link.href = p_href;
    if ((p_others != null) && typeof p_others === "object") {
      for (k in p_others) {
        v = p_others[k];
        link[k] = v;
      }
    }
    this.head.appendChild(link);
    return false;
  };
  /**
  	@attribute head
  	@type {HTMLElement}
  	@readOnly
   */
  MetaController.get({
    head: function() {
      return document.head || document.getElementsByTagName('head')[0];
    }
  });
  /**
  	@attribute viewport
  	@type {String}
   */
  MetaController.set({
    viewport: function(p_value) {
      return this.applyMeta('viewport', p_value);
    }
  });
  /**
  	@attribute title
  	@type {String}
   */
  MetaController.set({
    title: function(p_value) {
      if (p_value != null) {
        document.title = p_value;
        return this.applyMeta('apple-mobile-web-app-title', p_value);
      }
    }
  });
  /**
  	@attribute description
  	@type {String}
   */
  MetaController.set({
    description: function(p_value) {
      return this.applyMeta('description', p_value);
    }
  });
  /**
  	@attribute favicon
  	@type {String}
   */
  MetaController.set({
    favicon: function(p_value) {
      if (this._favicon == null) {
        this._favicon = p_value;
        this.applyLink('icon', p_value, {
          "type": "image/x-icon"
        });
      }
      return false;
    }
  });
  /**
  	@attribute icons
  	@type {String}
   */
  MetaController.set({
    icons: function(p_value) {
      var k, v;
      for (k in p_value) {
        v = p_value[k];
        this.applyLink(v['rel'], v['href'], {
          "sizes": v["sizes"]
        });
      }
      return false;
    }
  });
  /**
  	*Only for iOS
  	@attribute splash
  	@type {String}
   */
  MetaController.set({
    splash: function(p_value) {
      this.applyLink('apple-touch-startup-image', p_value);
      return false;
    }
  });
  /**
  	@attribute webAppCapable
  	@type {String}
   */
  MetaController.set({
    webAppCapable: function(p_value) {
      var value;
      value = p_value === true || p_value === "true" ? 'yes' : 'no';
      this.applyMeta('mobile-web-app-capable', value);
      this.applyMeta('apple-mobile-web-app-capable', value);
      return false;
    }
  });
  /**
  	@attribute color
  	@type {String}
   */
  MetaController.set({
    color: function(p_color) {
      this.webAppCapable = true;
      this.applyMeta('theme-color', p_color);
      this.applyMeta('msapplication-navbutton-color', p_color);
      this.applyMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
      return false;
    }
  });
  /**
  	*Only for Android
  	@attribute manifest
  	@type {String}
  	@example
  	```
  	{
  	  "lang": "en",
  	  "scope": "/scope/",	  
  	  "name": "Web Application Manifest Sample",
  	  "short_name": "Application",
  	  "display": "standalone",
  	  "orientation": "landscape",
  	  "start_url": "index.html",
  	  "theme_color": "aliceblue",
  	  "background_color": "blue",
  	  "icons": [
  	    {
  	      "src": "launcher-icon-0-75x.png",
  	      "sizes": "36x36",
  	      "type": "image/png",
  	      "density": 0.75
  	    },
  	    {
  	      "src": "launcher-icon-1x.png",
  	      "sizes": "48x48",
  	      "type": "image/png",
  	      "density": 1.0
  	    },
  	    {
  	      "src": "launcher-icon-1-5x.png",
  	      "sizes": "72x72",
  	      "type": "image/png",
  	      "density": 1.5
  	    },
  	    {
  	      "src": "launcher-icon-2x.png",
  	      "sizes": "96x96",
  	      "type": "image/png",
  	      "density": 2.0
  	    },
  	    {
  	      "src": "launcher-icon-3x.png",
  	      "sizes": "144x144",
  	      "type": "image/png",
  	      "density": 3.0
  	    },
  	    {
  	      "src": "launcher-icon-4x.png",
  	      "sizes": "192x192",
  	      "type": "image/png",
  	      "density": 4.0
  	    }
  	  ]
  	}	
  	```
   */
  MetaController.set({
    manifest: function(p_value) {
      this.applyLink('manifest', p_value);
      return false;
    }
  });
  return MetaController;
})(EventDispatcher);
var BaseDOM,
  __slice = [].slice;
Node.prototype.__appendChild__ = Node.prototype.appendChild;
Node.prototype.appendChild = function(node) {
  var el;
  el = node;
  if (node instanceof BaseDOM) {
    el = node.element;
  }
  Node.prototype.__appendChild__.call(this, el);
  if (node instanceof BaseDOM) {
    return node.parent = this;
  }
};
Node.prototype.__removeChild__ = Node.prototype.removeChild;
Node.prototype.removeChild = function(node) {
  var el;
  el = node;
  if (node instanceof BaseDOM) {
    el = node.element;
  }
  Node.prototype.__removeChild__.call(this, el);
  if (node instanceof BaseDOM) {
    return node.parent = null;
  }
};
Node.prototype.__replaceChild__ = Node.prototype.replaceChild;
Node.prototype.replaceChild = function(newNode, oldNode) {
  var el1, el2;
  el1 = newNode;
  el2 = oldNode;
  if (newNode instanceof BaseDOM) {
    el1 = newNode.element;
  }
  if (oldNode instanceof BaseDOM) {
    el2 = oldNode.element;
  }
  Node.prototype.__replaceChild__.call(this, el1, el2);
  if (newNode instanceof BaseDOM) {
    newNode.parent = this;
  }
  if (oldNode instanceof BaseDOM) {
    return oldNode.parent = null;
  }
};
Element.prototype.matches = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;
Node.prototype.findParents = function(query) {
  if (this.parentNode != null) {
    if (this.parentNode.matches(query)) {
      return this.parentNode;
    } else {
      return this.parentNode.findParents(query);
    }
  }
  return null;
};
/**
Base DOM manipulation class
@class BaseDOM
 */
BaseDOM = (function(_super) {
  __extends(BaseDOM, _super);
  function BaseDOM() {
    var className, element, i, namespace, option, p_options;
    p_options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    BaseDOM.__super__.constructor.apply(this, arguments);
    element = 'div';
    className = null;
    namespace = null;
    if (typeof p_options[0] === 'string' || p_options[0] instanceof HTMLElement) {
      element = p_options[0];
    } else {
      i = p_options.length;
      while (i--) {
        option = p_options[i];
        if (option.element != null) {
          element = option.element;
        }
        if (option.className != null) {
          className = option.className;
        }
        if (option.namespace != null) {
          namespace = option.namespace;
        }
      }
    }
    if (typeof element === 'string') {
      if (namespace) {
        this._namespace = namespace;
        this._element = document.createElementNS(this._namespace, element);
      } else {
        this._element = document.createElement(element);
      }
    } else if (element instanceof HTMLElement) {
      this._element = element;
    }
    if (className) {
      this.addClass(className);
    }
    this._element.__instance__ = this;
  }
  BaseDOM.get({
    element: function() {
      return this._element;
    }
  });
  BaseDOM.get({
    namespace: function() {
      return this._namespace;
    }
  });
  BaseDOM.get({
    childNodes: function() {
      return this.element.childNodes;
    }
  });
  BaseDOM.get({
    width: function() {
      return this.getBounds().width;
    }
  });
  BaseDOM.get({
    height: function() {
      return this.getBounds().height;
    }
  });
  BaseDOM.get({
    left: function() {
      return this.getBounds().left;
    }
  });
  BaseDOM.get({
    top: function() {
      return this.getBounds().top;
    }
  });
  BaseDOM.get({
    x: function() {
      return this.getBounds().left;
    }
  });
  BaseDOM.get({
    y: function() {
      return this.getBounds().top;
    }
  });
  BaseDOM.get({
    parent: function() {
      return this._parent;
    }
  });
  BaseDOM.set({
    parent: function(value) {
      if (value == null) {
        value = null;
      }
      if (value != null) {
        if (!(value instanceof BaseDOM) && !(value instanceof Node)) {
          throw new Error('Parent instance is not either Node or BaseDOM');
        }
        return this._parent = value;
      } else {
        return this._parent = null;
      }
    }
  });
  BaseDOM.get({
    className: function() {
      return this.element.className;
    }
  });
  BaseDOM.set({
    className: function(value) {
      return this.element.className = value.trim();
    }
  });
  BaseDOM.get({
    text: function() {
      return this.html;
    }
  });
  BaseDOM.set({
    text: function(value) {
      return this.html = value;
    }
  });
  BaseDOM.get({
    html: function() {
      return this.element.innerHTML;
    }
  });
  BaseDOM.set({
    html: function(value) {
      return this.element.innerHTML = value;
    }
  });
  BaseDOM.get({
    isAttached: function() {
      return (typeof document.contains === "function" ? document.contains(this.element) : void 0) || document.body.contains(this.element);
    }
  });
  BaseDOM.get({
    attributes: function() {
      return this.element.attributes;
    }
  });
  BaseDOM.prototype.appendChild = function(child) {
    return this.appendChildAt(child);
  };
  BaseDOM.prototype.appendChildAt = function(child, index) {
    var el;
    if (index == null) {
      index = -1;
    }
    el = child;
    if (child instanceof BaseDOM) {
      el = child.element;
    }
    if (index === -1 || index >= this.childNodes.length) {
      this.element.appendChild(el);
    } else {
      this.element.insertBefore(el, this.childNodes[index]);
    }
    if (child instanceof BaseDOM) {
      child.parent = this;
    }
    return child;
  };
  BaseDOM.prototype.replaceChild = function(replaceElement, oldElement) {
    var el1, el2;
    el1 = replaceElement;
    el2 = oldElement;
    if (replaceElement instanceof BaseDOM) {
      el1 = replaceElement.element;
    }
    if (oldElement instanceof BaseDOM) {
      el2 = oldElement.element;
    }
    this.element.replaceChild(el1, el2);
    if (replaceElement instanceof BaseDOM) {
      replaceElement.parent = this;
    }
    if (oldElement instanceof BaseDOM) {
      oldElement.parent = null;
    }
    return replaceElement;
  };
  BaseDOM.prototype.remove = function() {
    var _ref;
    return (_ref = this.parent) != null ? typeof _ref.removeChild === "function" ? _ref.removeChild(this) : void 0 : void 0;
  };
  BaseDOM.prototype.removeChild = function(child, destroy) {
    var el;
    if (destroy == null) {
      destroy = false;
    }
    el = child;
    if (child instanceof BaseDOM) {
      if (!!destroy) {
        child.removeAll(true);
        child.destroy();
        return child;
      } else {
        el = child.element;
      }
    }
    try {
      return this.element.removeChild(el);
    } catch (_error) {}
  };
  BaseDOM.prototype.removeChildAt = function(index) {
    if (index == null) {
      index = -1;
    }
    if (index < this.childNodes.length) {
      return this.removeChild(this.childNodes[i]);
    }
  };
  BaseDOM.prototype.removeAll = function(destroy) {
    var childs, domInstance, i, _results;
    if (destroy == null) {
      destroy = false;
    }
    childs = this.childNodes;
    i = childs.length;
    _results = [];
    while (i-- > 0) {
      domInstance = childs[i].__instance__;
      _results.push(this.removeChild(domInstance || childs[i], !!domInstance));
    }
    return _results;
  };
  BaseDOM.prototype.matches = function(query) {
    return this.element.matches(query);
  };
  BaseDOM.prototype.findParents = function(query) {
    return this.element.findParents(query);
  };
  BaseDOM.prototype.find = function(query, onlyInstances) {
    var element;
    if (onlyInstances == null) {
      onlyInstances = false;
    }
    element = this.element.querySelector(query);
    if (onlyInstances) {
      return element != null ? element.__instance__ : void 0;
    } else {
      return element;
    }
  };
  BaseDOM.prototype.findAll = function(query, onlyInstances) {
    var elements, els, i, l, p;
    if (onlyInstances == null) {
      onlyInstances = false;
    }
    elements = this.element.querySelectorAll(query);
    if (onlyInstances) {
      els = [];
      i = -1;
      l = elements.length;
      p = 0;
      while (++i < l) {
        if (elements[i].__instance__) {
          els[p++] = elements[i].__instance__;
        }
      }
      elements = els;
    }
    return elements;
  };
  BaseDOM.prototype.attr = function(name, value, namespace) {
    var k, v, _results;
    if (value == null) {
      value = 'nonenonenone';
    }
    if (namespace == null) {
      namespace = null;
    }
    if (typeof name === 'string') {
      return this._attr(name, value, namespace);
    } else if (typeof name === 'object') {
      _results = [];
      for (k in name) {
        v = name[k];
        _results.push(this._attr(k, v, namespace));
      }
      return _results;
    }
  };
  BaseDOM.prototype._attr = function(name, value, namespace) {
    if (value == null) {
      value = 'nonenonenone';
    }
    if (namespace == null) {
      namespace = null;
    }
    if (namespace === true) {
      namespace = this.namespace;
    }
    if (value !== 'nonenonenone') {
      if (this.namespace != null) {
        if (value != null) {
          this.element.setAttributeNS(namespace, name, value);
        } else {
          this.element.removeAttributeNS(namespace, name, value);
        }
      } else {
        if (value != null) {
          this.element.setAttribute(name, value);
        } else {
          this.element.removeAttribute(name, value);
        }
      }
    }
    if (this.namespace != null) {
      return this.element.getAttributeNS(namespace, name);
    } else {
      return this.element.getAttribute(name);
    }
  };
  BaseDOM.prototype._css = function(name, value) {
    if (value == null) {
      value = null;
    }
    if (value !== null) {
      this.element.style[name] = value;
    }
    return this.element.style[name];
  };
  BaseDOM.prototype.css = function(name, value) {
    var k, v, _results;
    if (value == null) {
      value = null;
    }
    if (typeof name === 'string') {
      return this._css(name, value);
    } else if (typeof name === 'object') {
      _results = [];
      for (k in name) {
        v = name[k];
        _results.push(this._css(k, v));
      }
      return _results;
    }
  };
  BaseDOM.prototype.style = function(styleProp, el) {
    if (el == null) {
      el = this.element;
    }
    if (el instanceof BaseDOM) {
      el = el.element;
    }
    if (window.getComputedStyle != null) {
      return window.getComputedStyle(el)[styleProp];
    } else if (el.currentStyle) {
      return el.currentStyle[styleProp];
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
      return document.defaultView.getComputedStyle(el, null)[styleProp];
    } else {
      return this.css(styleProp);
    }
  };
  BaseDOM.prototype.addClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    p = classNames.length;
    i = className.length;
    while (i-- > 0) {
      if (classNames.indexOf(className[i]) >= 0) {
        continue;
      }
      classNames[p++] = className[i];
    }
    return this.className = classNames.join(' ');
  };
  BaseDOM.prototype.removeClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    while (i-- > 0) {
      if ((p = classNames.indexOf(className[i])) >= 0) {
        classNames.splice(p, 1);
      }
    }
    return this.className = classNames.join(' ');
  };
  BaseDOM.prototype.toggleClass = function(className, toggle) {
    var i, _results;
    if (toggle == null) {
      toggle = null;
    }
    if (toggle !== null) {
      if (toggle) {
        this.addClass(className);
      } else {
        this.removeClass(className);
      }
      return;
    }
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    i = className.length;
    _results = [];
    while (i-- > 0) {
      if (this.hasClass(className[i])) {
        _results.push(this.removeClass(className[i]));
      } else {
        _results.push(this.addClass(className[i]));
      }
    }
    return _results;
  };
  BaseDOM.prototype.hasClass = function(className) {
    var classNames, hasClass, i;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    hasClass = true;
    while (i-- > 0) {
      hasClass &= classNames.indexOf(className[i]) >= 0;
    }
    return hasClass;
  };
  BaseDOM.prototype.getBounds = function(target) {
    var bounds, boundsObj, k, tbounds, v;
    if (target == null) {
      target = null;
    }
    boundsObj = {};
    bounds = this.element.getBoundingClientRect();
    for (k in bounds) {
      v = bounds[k];
      boundsObj[k] = v;
    }
    if (target) {
      if (target instanceof BaseDOM) {
        tbounds = target.getBounds();
      } else if (target instanceof HTMLElement) {
        tbounds = target.getBoundingClientRect();
      }
    }
    if (tbounds) {
      boundsObj.top -= tbounds.top;
      boundsObj.left -= tbounds.left;
      boundsObj.bottom -= tbounds.top;
      boundsObj.right -= tbounds.left;
    }
    boundsObj.width = boundsObj.right - boundsObj.left;
    boundsObj.height = boundsObj.bottom - boundsObj.top;
    return boundsObj;
  };
  BaseDOM.prototype.destroy = function() {
    if (typeof this.off === "function") {
      this.off();
    }
    return typeof this.remove === "function" ? this.remove() : void 0;
  };
  return BaseDOM;
})(EventDispatcher);
/**
Base View
@class BaseView
@extends BaseDOM
@uses MetaController
 */
var BaseView;
BaseView = (function(_super) {
  var _meta;
  __extends(BaseView, _super);
  /**
  	Triggered before the create routine view starts. Triggered when {{#crossLink "BaseView/createStart:method"}}{{/crossLink}} is called.
  	@event CREATE_START
  	@static
   */
  BaseView.CREATE_START = 'create_start';
  /**
  	Triggered when the create routine view starts. Triggered when {{#crossLink "BaseView/create:method"}}{{/crossLink}} is called.
  	@event CREATE
  	@static
   */
  BaseView.CREATE = 'create';
  /**
  	Triggered when the create routine view is finished. Triggered when {{#crossLink "BaseView/createComplete:method"}}{{/crossLink}} is called.
  	@event CREATE_COMPLETE
  	@static
   */
  BaseView.CREATE_COMPLETE = 'create_complete';
  /**
  	Triggered before the showing routine view starts. Triggered when {{#crossLink "BaseView/showStart:method"}}{{/crossLink}} is called.
  	@event SHOW_START
  	@static
   */
  BaseView.SHOW_START = 'show_start';
  /**
  	Triggered when the showing routine view starts. Triggered when {{#crossLink "BaseView/show:method"}}{{/crossLink}} is called.
  	@event SHOW
  	@static
   */
  BaseView.SHOW = 'show';
  /**
  	Triggered when the showing routine view is finished. Triggered when {{#crossLink "BaseView/showComplete:method"}}{{/crossLink}} is called.
  	@event SHOW_COMPLETE
  	@static
   */
  BaseView.SHOW_COMPLETE = 'show_complete';
  /**
  	Triggered before the hiding routine view starts. Triggered when {{#crossLink "BaseView/hideStart:method"}}{{/crossLink}} is called.
  	@event HIDE_START
  	@static
   */
  BaseView.HIDE_START = 'hide_start';
  /**
  	Triggered when the hiding routine view starts. Triggered when {{#crossLink "BaseView/hide:method"}}{{/crossLink}} is called.
  	@event HIDE
  	@static
   */
  BaseView.HIDE = 'hide';
  /**
  	Triggered when the hiding routine view is finished. Triggered when {{#crossLink "BaseView/hideComplete:method"}}{{/crossLink}} is called.
  	@event HIDE_COMPLETE
  	@static
   */
  BaseView.HIDE_COMPLETE = 'hide_complete';
  /**
  	Triggered when the destroy routine view starts. Triggered when {{#crossLink "BaseView/destroy:method"}}{{/crossLink}} is called.
  	@event DESTROY
  	@static
   */
  BaseView.DESTROY = 'destroy';
  /**
  	Triggered when the destroy routine view is finished. Triggered when {{#crossLink "BaseView/destroyComplete:method"}}{{/crossLink}} is called.
  	@event DESTROY_COMPLETE
  	@static
   */
  BaseView.DESTROY_COMPLETE = 'destroy_complete';
  /**
  	Triggered when the view pauses. Usually when {{#crossLink "BaseView/pause:method"}}{{/crossLink}} is called.
  	@event PAUSE
  	@static
   */
  BaseView.PAUSE = 'pause';
  /**
  	Triggered when the view resumes. Usually when {{#crossLink "BaseView/resume:method"}}{{/crossLink}} is called.
  	@event RESUME
  	@static
   */
  BaseView.RESUME = 'resume';
  /**
  	@class BaseView
  	@constructor	
  	@param {Object} [p_data=null] 
  	Data object sets the default and/or custom values of properties of view for navigation controller.<br>
  	If this object it's not null, some default properties are not required explained below:
  	Default Key|Type|Required
  	-|-|-
  	id|{{#crossLink "String"}}{{/crossLink}}|__Yes__
  	class|{{#crossLink "String"}}{{/crossLink}}|__Yes__
  	route|{{#crossLink "String"}}{{/crossLink}} / {{#crossLink "RegExp"}}{{/crossLink}}|__No__
  	content|{{#crossLink "String"}}{{/crossLink}} / {{#crossLink "JSON"}}{{/crossLink}}|__No__
  	cache|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
  	parentView|{{#crossLink "String"}}{{/crossLink}}|__No__
  	destroyable|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
  	loadContent|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
  	snap *(only for scroll navigation type)*|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
  	subviewsWrapper|<a href="//developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors" target="_blank" class="crosslink">Selectors</a>|__No__
  	attachToParentWrapper|<a href="//developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors" target="_blank" class="crosslink">Selectors</a>|__No__
  	@example
  	```
  	{
  		"id":"home",
  		"class":"template-home-view", //the valid formats are "ClassName", "class-name", "class name" or "class_name"
  		"route":"/", //valid formats are String or RegExp
  		"content":"data/home.json",
  		"cache":true,
  		"parentView":"someViewID", //the unique ID of parent view
  		"destroyable":true,
  		"loadContent":true,
  		"snap":true, //only for scroll navigation type
  		"subviewsWrapper":"CSSSelector", //like #ID or .className etc
  		"attachToParentWrapper":"CSSSelector" //like #ID or .className etc
  	}
  	```
  	@param {String} [p_CSSClassName=null]
   */
  _meta = null;
  function BaseView(p_data, p_CSSClassName) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_CSSClassName == null) {
      p_CSSClassName = null;
    }
    this.destroyComplete = __bind(this.destroyComplete, this);
    this.destroy = __bind(this.destroy, this);
    this.resume = __bind(this.resume, this);
    this.pause = __bind(this.pause, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    this.getReverseParentList = __bind(this.getReverseParentList, this);
    this._created = false;
    this._showed = false;
    this.data = p_data ? p_data : {};
    this.id = this._data.id != null ? this._data.id : void 0;
    this.content = this._data.content != null ? this._data.content : void 0;
    this.route = this._data.route != null ? this._data.route : void 0;
    this.routeData = !this._routeData ? null : void 0;
    this.parentView = this._data.parentView != null ? this._data.parentView : void 0;
    this.subviews = this._data.subviews != null ? this._data.subviews : void 0;
    this.destroyable = this._data.destroyable != null ? this._data.destroyable : void 0;
    _meta = MetaController.getInstance();
    BaseView.__super__.constructor.call(this, {
      element: 'div',
      className: p_CSSClassName
    });
  }
  /**
  	Returns the loader queue of this specific view.
  	@attribute loader
  	@type {createjs.LoadQueue}
  	@default null
  	@readOnly
   */
  BaseView.get({
    loader: function() {
      var _ref;
      if (this._id != null) {
        return typeof app !== "undefined" && app !== null ? (_ref = app.loader) != null ? _ref.getGroup(this._id) : void 0 : void 0;
      } else {
        return null;
      }
    }
  });
  /**
  	Returns true if the view was created.
  	@attribute created
  	@type {Boolean}
  	@default false
  	@protected
  	@readOnly
   */
  BaseView.get({
    created: function() {
      return this._created;
    }
  });
  /**
  	Returns true if the view was shown.
  	@attribute showed
  	@type {Boolean}
  	@default false
  	@protected
  	@readOnly
   */
  BaseView.get({
    showed: function() {
      return this._showed;
    }
  });
  /**
  	Sets/gets a clone of data object with default and/or custom values of properties of view.
  	@attribute data
  	@type {Object}
  	@default {}
   */
  BaseView.get({
    data: function() {
      return this._data;
    }
  });
  BaseView.set({
    data: function(p_value) {
      return this._data = ObjectUtils.clone(p_value);
    }
  });
  /**
  	Sets/gets the unique ID of view.
  	@attribute id
  	@type {String}
  	@default null
   */
  BaseView.get({
    id: function() {
      return this._id;
    }
  });
  BaseView.set({
    id: function(p_value) {
      return this._id = p_value;
    }
  });
  /**
  	Sets/gets the unique ID of view.
  	@attribute content
  	@type {String|Object|JSON}
  	@default null
   */
  BaseView.get({
    content: function() {
      return this._content;
    }
  });
  BaseView.set({
    content: function(p_value) {
      return this._content = p_value;
    }
  });
  /**
  	Sets/gets the route of view.
  	@attribute route
  	@type {String|RegExp}
  	@default null
   */
  BaseView.get({
    route: function() {
      return this._route;
    }
  });
  BaseView.set({
    route: function(p_value) {
      return this._route = p_value;
    }
  });
  /**
  	Sets/gets the actual route data.
  	@attribute routeData
  	@type {Object}
  	@protected
  	@default null
   */
  BaseView.get({
    routeData: function() {
      return this._routeData;
    }
  });
  BaseView.set({
    routeData: function(p_value) {
      return this._routeData = p_value;
    }
  });
  /**
  	Sets/gets the parent view of this view.
  	@attribute parentView
  	@type {BaseView}
  	@default null
   */
  BaseView.get({
    parentView: function() {
      return this._parentView;
    }
  });
  BaseView.set({
    parentView: function(p_value) {
      return this._parentView = p_value;
    }
  });
  /**
  	Sets/gets a array of {{#crossLink "BaseView"}}{{/crossLink}} instances of subviews of this view.
  	@attribute subviews
  	@type {Array}
  	@default null
   */
  BaseView.get({
    subviews: function() {
      return this._subviews;
    }
  });
  BaseView.set({
    subviews: function(p_value) {
      return this._subviews = p_value;
    }
  });
  /**
  	Sets/gets if this views is destroyable.
  	@attribute destroyable
  	@type {Boolean}
  	@default false
   */
  BaseView.get({
    destroyable: function() {
      return this._destroyable;
    }
  });
  BaseView.set({
    destroyable: function(p_value) {
      return this._destroyable = p_value;
    }
  });
  /**
  	Sets/gets the type is a 'view' or a 'sub-view'.
  	@attribute type
  	@type {String}
  	@protected
  	@default null
   */
  BaseView.get({
    type: function() {
      return this._type;
    }
  });
  BaseView.set({
    type: function(p_value) {
      return this._type = p_value;
    }
  });
  /**
  	Returns the meta object of his content.
  	@attribute meta
  	@type {Object}
  	@default null
  	@readOnly
   */
  BaseView.get({
    meta: function() {
      var _ref, _ref1;
      if (((_ref = this._content) != null ? _ref.meta : void 0) != null) {
        return (_ref1 = this._content) != null ? _ref1.meta : void 0;
      }
    }
  });
  /**
  	Sets/gets the loading progress of this view.
  	@attribute progress
  	@type {Number}
  	@protected
   */
  BaseView.get({
    progress: function() {
      if (this._progress != null) {
        return this._progress;
      } else {
        return this.loader.progress;
      }
    }
  });
  BaseView.set({
    progress: function(p_value) {
      return this._progress = p_value;
    }
  });
  /**
  	Returns the reverse path of his parent view.
  	@attribute reverseParentPath
  	@type {Array}
  	@protected
  	@readOnly
   */
  BaseView.get({
    reverseParentPath: function() {
      this.getReverseParentList(this);
      return this._parentPath.reverse();
    }
  });
  /**
  	Returns the path of his parent view.
  	@attribute parentPath
  	@type {Array}
  	@protected
  	@readOnly
   */
  BaseView.get({
    parentPath: function() {
      this.getReverseParentList(this);
      return this._parentPath;
    }
  });
  /**
  	Returns the wrapper container for the sub-views of this view.
  	@attribute subviewsWrapper
  	@type {HTMLElement}
  	@default null
  	@readOnly
   */
  BaseView.get({
    subviewsWrapper: function() {
      var _ref;
      if (((_ref = this._data) != null ? _ref.subviewsWrapper : void 0) != null) {
        return this.find(this._data.subviewsWrapper);
      }
    }
  });
  /**
  	Returns the CSS Selector of the wrapper container for attach this view.
  	@attribute attachToParentWrapper
  	@type {String}
  	@default null
  	@readOnly
   */
  BaseView.get({
    attachToParentWrapper: function() {
      var _ref;
      if (((_ref = this._data) != null ? _ref.attachToParentWrapper : void 0) != null) {
        return this._data.attachToParentWrapper;
      }
    }
  });
  /**
  	Returns a reverse list of the parent path of this view.
  	@method getReverseParentList
  	@param {Object|JSON} [p_subview=null]
  	@private
  	@readOnly
   */
  BaseView.prototype.getReverseParentList = function(p_subview) {
    if (p_subview == null) {
      p_subview = null;
    }
    this._parentPath = [];
    if ((p_subview != null ? p_subview.parentView : void 0) != null) {
      this.getReverseParentList(p_subview.parentView);
      this._parentPath.push(p_subview.id);
    }
    return false;
  };
  /**
  	Usually starts before the creation routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/create:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/CREATE_START:event"}}{{/crossLink}} after complete.
  	@method createStart
  	@param {Event} [evt=null]
   */
  BaseView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.CREATE_START, this);
    this.create();
    return false;
  };
  /**
  	Usually starts when the creation routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/createComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/CREATE:event"}}{{/crossLink}} after complete.
  	@method create
  	@param {Event} [evt=null]
   */
  BaseView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.CREATE, this);
    this.createComplete();
    return false;
  };
  /**
  	Usually starts when finished the creation routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/CREATE_COMPLETE:event"}}{{/crossLink}} after complete the routine.
  	@method createComplete
  	@param {Event} [evt=null]
   */
  BaseView.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._created = true;
    this.trigger(BaseView.CREATE_COMPLETE, this);
    return false;
  };
  /**
  	Usually starts before the showing routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/show:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/SHOW_START:event"}}{{/crossLink}} after complete.
  	@method showStart
  	@param {Event} [evt=null]
   */
  BaseView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.SHOW_START, this);
    _meta.change(this.meta);
    this.show();
    return false;
  };
  /**
  	Usually starts when the showing routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/showComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/SHOW:event"}}{{/crossLink}} after complete.
  	@method show
  	@param {Event} [evt=null]
   */
  BaseView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.SHOW, this);
    this.showComplete();
    return false;
  };
  /**
  	Usually when finished the showing routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/SHOW_COMPLETE:event"}}{{/crossLink}} after complete the routine.
  	@method showComplete
  	@param {Event} [evt=null]
   */
  BaseView.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._showed = true;
    this.trigger(BaseView.SHOW_COMPLETE, this);
    return false;
  };
  /**
  	Usually starts before the hiding routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/hide:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/HIDE_START:event"}}{{/crossLink}} after complete.
  	@method hideStart
  	@param {Event} [evt=null]
   */
  BaseView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.HIDE_START, this);
    this.hide();
    return false;
  };
  /**
  	Usually starts when the hiding routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/hideComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/HIDE:event"}}{{/crossLink}} after complete.
  	@method hide
  	@param {Event} [evt=null]
   */
  BaseView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._showed = false;
    this.trigger(BaseView.HIDE, this);
    this.hideComplete();
    return false;
  };
  /**
  	Usually when finished the hiding routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/HIDE_COMPLETE:event"}}{{/crossLink}} after complete the routine.
  	@method hideComplete
  	@param {Event} [evt=null]
   */
  BaseView.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.HIDE_COMPLETE, this);
    return false;
  };
  /**
  	Usually used to pauses animations or something else in looping in view.
  	Trigger the event {{#crossLink "BaseView/PAUSE:event"}}{{/crossLink}} after complete.
  	@method pause
   */
  BaseView.prototype.pause = function() {
    this.trigger(BaseView.PAUSE, this);
    return false;
  };
  /**
  	Usually used to resumes animations or something else in view.
  	Trigger the event {{#crossLink "BaseView/RESUME:event"}}{{/crossLink}} after complete.
  	@method pause
   */
  BaseView.prototype.resume = function() {
    this.trigger(BaseView.RESUME, this);
    return false;
  };
  /**
  	Usually starts when the destroying routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/destroyComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/DESTROY:event"}}{{/crossLink}} after complete.
  	@method destroy
  	@param {Event} [evt=null]
   */
  BaseView.prototype.destroy = function(evt) {
    var _ref;
    if (evt == null) {
      evt = null;
    }
    this._created = false;
    this.removeAll();
    if ((_ref = this._parentPath) != null) {
      _ref.length = 0;
    }
    this._parentPath = null;
    this._routeData = null;
    this._data = null;
    this.trigger(BaseView.DESTROY, this);
    this.destroyComplete();
    return false;
  };
  /**
  	Usually when finished the destroying routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/DESTROY_COMPLETE:event"}}{{/crossLink}} after complete the routine.
  	@method destroyComplete
  	@param {Event} [evt=null]
   */
  BaseView.prototype.destroyComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.DESTROY_COMPLETE, this);
    this.off();
    return false;
  };
  return BaseView;
})(BaseDOM);
/**
Base class to setup the navigation and start loading of dependencies.
@class NavigationLoader
@extends EventDispatcher
 */
var NavigationLoader;
NavigationLoader = (function(_super) {
  var head, wrapper, _contentLoaded, _contentLoaders, _mainView, _preloaderView;
  __extends(NavigationLoader, _super);
  head = null;
  wrapper = null;
  _mainView = null;
  _preloaderView = null;
  _contentLoaders = null;
  _contentLoaded = null;
  app.root = null;
  app.loader = null;
  app.config = {};
  app.container = {};
  app.navigation = {};
  app.conditions = null;
  app.detections = null;
  /**
  	@class NavigationLoader
  	@constructor
  	@param {BaseView} p_preloaderView The view of the first loading, it's called by the method {{#crossLink "NavigationLoader/createPreloaderView:method"}}{{/crossLink}} and attached on container when the preloader assets is completely loaded.
  	@param {String} [p_configPath = "data/config.json"] Path of the navigation configuration file.
  	@param {HTMLElement} [p_wrapper = null] Custom container to attach the navigation.
   */
  function NavigationLoader(p_preloaderView, p_configPath, p_wrapper) {
    var _ref, _ref1;
    if (p_configPath == null) {
      p_configPath = "data/config.json";
    }
    if (p_wrapper == null) {
      p_wrapper = null;
    }
    this.mainAssetsLoaded = __bind(this.mainAssetsLoaded, this);
    this.preloaderAssetsLoaded = __bind(this.preloaderAssetsLoaded, this);
    this.coreAssetsLoaded = __bind(this.coreAssetsLoaded, this);
    this._showMainView = __bind(this._showMainView, this);
    this._createMainView = __bind(this._createMainView, this);
    this.destroyPreloderView = __bind(this.destroyPreloderView, this);
    this.hidePreloderView = __bind(this.hidePreloderView, this);
    this.showPreloaderView = __bind(this.showPreloaderView, this);
    this.createPreloaderView = __bind(this.createPreloaderView, this);
    this._loadComplete = __bind(this._loadComplete, this);
    this._loadProgress = __bind(this._loadProgress, this);
    this._loadFileComplete = __bind(this._loadFileComplete, this);
    this._parseContentFiles = __bind(this._parseContentFiles, this);
    this._createLoadQueue = __bind(this._createLoadQueue, this);
    this._contentsLoaded = __bind(this._contentsLoaded, this);
    this._prepareConfigFile = __bind(this._prepareConfigFile, this);
    wrapper = p_wrapper == null ? document.body : p_wrapper;
    if (p_configPath == null) {
      throw new Error('The param p_configPath is null');
    }
    if (!(p_preloaderView instanceof BaseView)) {
      throw new Error('The param p_preloaderView is null or the instance of param p_preloaderView is not either BaseView class');
    } else {
      _preloaderView = p_preloaderView;
    }
    head = document.querySelector("head") || document.getElementsByTagName("head")[0];
    app.root = ((_ref = document.querySelector("base")) != null ? _ref.href : void 0) || ((_ref1 = document.getElementsByTagName("base")[0]) != null ? _ref1.href : void 0);
    app.loader = this.loader = AssetLoader.getInstance();
    app.detections = Detections.getInstance();
    this.loaded = false;
    this.queue = this.loader.getGroup('config');
    this.queue.on(AssetLoader.COMPLETE_FILE, this._prepareConfigFile);
    this.queue.loadFile({
      id: 'config',
      cache: false,
      src: (app.root != null ? app.root + p_configPath : p_configPath)
    });
    false;
  }
  /**
  	@method _prepareConfigFile
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype._prepareConfigFile = function(evt) {
    var k, queue, v;
    this.queue.off(AssetLoader.COMPLETE_FILE, this._prepareConfigFile);
    _contentLoaders = this._parseConfigFile(evt.result);
    if (_contentLoaders.length > 0) {
      for (k in _contentLoaders) {
        v = _contentLoaders[k];
        queue = this.loader.getGroup(v.queue);
        queue.on(AssetLoader.COMPLETE_FILE, this._contentsLoaded);
        queue.loadFile(v, false);
        queue.load();
      }
    } else {
      this._createLoadQueue();
    }
    return false;
  };
  /**
  	@method _contentsLoaded
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype._contentsLoaded = function(evt) {
    var _ref, _ref1;
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        _ref.off(AssetLoader.COMPLETE_FILE, this._contentsLoaded);
      }
    }
    if (_contentLoaded == null) {
      _contentLoaded = {};
    }
    if (this._totalContentsLoaded == null) {
      this._totalContentsLoaded = 0;
    }
    _contentLoaded[Object.getOwnPropertyNames(evt != null ? (_ref1 = evt.currentTarget) != null ? _ref1._loadedResults : void 0 : void 0)[0]] = evt.result;
    this._totalContentsLoaded++;
    if (this._totalContentsLoaded === _contentLoaders.length) {
      return this._createLoadQueue();
    }
  };
  /**
  	@method _createLoadQueue
  	@private
   */
  NavigationLoader.prototype._createLoadQueue = function() {
    var firstIndexes, k, queues, total, v;
    this.loaderSteps = [
      {
        ratio: 0,
        id: 'config'
      }
    ];
    this.loaderStep = 0;
    this.loaderRatio = 0;
    this.currentStep = this.loaderSteps[0];
    if (this._totalContentsLoaded > 0) {
      this._parseContentFiles(app.config.views, _contentLoaded);
    }
    queues = app.config.required;
    total = ObjectUtils.count(queues);
    firstIndexes = this.loaderSteps.length;
    for (k in queues) {
      v = queues[k];
      switch (k) {
        case 'preloader':
        case 'core':
        case 'main':
          this.loaderSteps.splice(firstIndexes, 0, {
            id: k,
            data: v,
            ratio: 1 / total
          });
          firstIndexes++;
          break;
        default:
          this.loaderSteps.push({
            id: k,
            data: v,
            ratio: 1 / total
          });
      }
    }
    this.queue = this._createLoader(this.currentStep.id);
    if (this._totalContentsLoaded > 0) {
      this.queue.load();
    }
    return false;
  };
  /**
  	@method _parseContentFiles
  	@param {Array} p_views
  	@param {Object} p_data
  	@private
   */
  NavigationLoader.prototype._parseContentFiles = function(p_views, p_data) {
    var cloneSrc, filtered, i, index, k, node, obj, results, v, _i, _j, _ref, _ref1, _ref2;
    for (node in app.config.required) {
      _ref = app.config.required[node];
      for (k in _ref) {
        v = _ref[k];
        if (typeof (v != null ? v.content : void 0) === 'string') {
          v.content = p_data[v.content];
          v.content = this._normalizePaths(v.content, app.config.paths);
          results = JSONUtils.filterObject(v.content, 'src', null, null, true);
          filtered = [];
          for (index in results) {
            obj = results[index];
            if (obj.loadWithView === true || obj.loadWithView === void 0) {
              if ((obj.id == null) || obj.id === void 0) {
                obj.id = obj.src;
              }
              if (typeof obj.src !== 'object' && obj.src !== '{}') {
                filtered.push(obj);
              } else {
                cloneSrc = ObjectUtils.clone(obj.src);
                for (i = _i = 0, _ref1 = cloneSrc.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
                  if (cloneSrc[i].condition != null) {
                    if (app.conditions.test(cloneSrc[i].condition)) {
                      if (cloneSrc[i].file != null) {
                        obj.src = cloneSrc[i].file;
                        filtered.push(obj);
                      }
                      break;
                    }
                  } else {
                    if (cloneSrc[i].file != null) {
                      obj.src = cloneSrc[i].file;
                      filtered.push(obj);
                      break;
                    }
                  }
                }
              }
            }
          }
          app.config.required[node] = ArrayUtils.merge(app.config.required[node], filtered);
        }
      }
    }
    for (k in p_views) {
      v = p_views[k];
      if (p_data[v.content]) {
        v.content = p_data[v.content];
        v.content = this._normalizePaths(v.content, app.config.paths);
        if (typeof v.content === 'object') {
          results = JSONUtils.filterObject(v.content, 'src', null, null, true);
          filtered = [];
          for (index in results) {
            obj = results[index];
            if (obj.loadWithView === true || obj.loadWithView === void 0) {
              if ((obj.id == null) || obj.id === void 0) {
                obj.id = obj.src;
              }
              if (typeof obj.src !== 'object' && obj.src !== '{}') {
                filtered.push(obj);
              } else {
                cloneSrc = ObjectUtils.clone(obj.src);
                for (i = _j = 0, _ref2 = cloneSrc.length; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
                  if (cloneSrc[i].condition != null) {
                    if (app.conditions.test(cloneSrc[i].condition)) {
                      if (cloneSrc[i].file != null) {
                        obj.src = cloneSrc[i].file;
                        filtered.push(obj);
                      }
                      break;
                    }
                  } else {
                    if (cloneSrc[i].file != null) {
                      obj.src = cloneSrc[i].file;
                      filtered.push(obj);
                      break;
                    }
                  }
                }
              }
            }
          }
          if (!app.config.required[v.id]) {
            app.config.required[v.id] = [];
            app.config.required[v.id] = filtered;
          } else {
            app.config.required[node] = ArrayUtils.merge(app.config.required[node], filtered);
          }
        }
      }
      if (v.subviews) {
        this._parseContentFiles(v.subviews, p_data);
      }
    }
    return false;
  };
  /**
  	@method _parseConfigFile
  	@param {Object} p_data
  	@private
  	@return {Object}
   */
  NavigationLoader.prototype._parseConfigFile = function(p_data) {
    var data, i, id, k, temp, v, _i, _j, _ref, _ref1, _ref2, _ref3, _ref4;
    p_data.paths = this._normalizeConfigPaths(p_data.paths);
    p_data = this._normalizePaths(p_data, p_data.paths);
    data = [];
    temp = [];
    if (p_data.conditions == null) {
      p_data.conditions = {};
    }
    app.conditions || (app.conditions = ConditionsValidation.getInstance(p_data.conditions));
    _ref = p_data.views;
    for (k in _ref) {
      v = _ref[k];
      v["class"] = StringUtils.toCamelCase(v["class"]);
      temp[v.id] = v;
      if ((v.loadContent || v.loadContent === void 0) && v.content) {
        if (typeof v.content !== 'object' && v.content !== '{}') {
          data.push({
            'id': v.content,
            'src': v.content,
            'queue': v.id,
            'cache': v.cache
          });
        } else {
          for (i = _i = 0, _ref1 = v.content.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            if (v.content[i].condition != null) {
              if (app.conditions.test(v.content[i].condition)) {
                if (v.content[i].file != null) {
                  data.push({
                    'id': v.content[i].file,
                    'src': v.content[i].file,
                    'queue': v.id,
                    'cache': v.cache
                  });
                }
                break;
              }
            } else {
              if (v.content[i].file != null) {
                data.push({
                  'id': v.content[i].file,
                  'src': v.content[i].file,
                  'queue': v.id,
                  'cache': v.cache
                });
                break;
              }
            }
          }
        }
      }
    }
    _ref2 = p_data.views;
    for (k in _ref2) {
      v = _ref2[k];
      if (v.parentView === v.id) {
        throw new Error('The parent view cannot be herself');
      }
      if ((temp[v.parentView] != null) && v.parentView !== v.id) {
        if (!temp[v.parentView].subviews) {
          temp[v.parentView].subviews = {};
        }
        if (v.loadContent === void 0) {
          if (temp[v.parentView].loadContent != null) {
            v.loadContent = temp[v.parentView].loadContent;
          } else {
            v.loadContent = true;
          }
        } else {
          v.loadContent = v.loadContent;
        }
        temp[v.parentView].subviews[v.id] = v;
      }
    }
    for (id in p_data.required) {
      _ref3 = p_data.required[id];
      for (k in _ref3) {
        v = _ref3[k];
        if (v.content) {
          if (typeof v.content !== 'object' && v.content !== '{}') {
            if (!v.id || v.id === void 0) {
              v.id = v.content;
            }
            data.push({
              'id': v.content,
              'src': v.content,
              'queue': id,
              'cache': v.cache
            });
          } else {
            for (i = _j = 0, _ref4 = v.content.length; 0 <= _ref4 ? _j < _ref4 : _j > _ref4; i = 0 <= _ref4 ? ++_j : --_j) {
              if (v.content[i].condition != null) {
                if (app.conditions.test(v.content[i].condition)) {
                  if (v.content[i].file != null) {
                    data.push({
                      'id': v.content[i].file,
                      'src': v.content[i].file,
                      'queue': id,
                      'cache': v.cache
                    });
                  }
                  break;
                }
              } else {
                if (v.content[i].file != null) {
                  data.push({
                    'id': v.content[i].file,
                    'src': v.content[i].file,
                    'queue': id,
                    'cache': v.cache
                  });
                  break;
                }
              }
            }
          }
        }
      }
    }
    p_data.views = temp;
    app.config = p_data;
    return data;
  };
  /**
  	@method _createLoader
  	@param {String} p_id
  	@private
  	@return {createjs.LoadQueue}
   */
  NavigationLoader.prototype._createLoader = function(p_id) {
    var queue;
    queue = this.loader.getGroup(p_id);
    queue.on(AssetLoader.COMPLETE_FILE, this._loadFileComplete);
    queue.on(AssetLoader.PROGRESS_ALL, this._loadProgress);
    queue.on(AssetLoader.COMPLETE_ALL, this._loadComplete);
    return queue;
  };
  /**
  	@method _removeLoader
  	@param {Object} p_queue
  	@private
  	@return {createjs.LoadQueue}
   */
  NavigationLoader.prototype._removeLoader = function(p_queue) {
    p_queue.removeAllEventListeners(AssetLoader.COMPLETE_FILE);
    p_queue.removeAllEventListeners(AssetLoader.PROGRESS_ALL);
    p_queue.removeAllEventListeners(AssetLoader.COMPLETE_ALL);
    p_queue.destroy();
    return p_queue;
  };
  /**
  	@method _addFiles
  	@param {Object} p_files
  	@private
   */
  NavigationLoader.prototype._addFiles = function(p_files) {
    var f, jsRE, _i, _len;
    jsRE = /.*\.(js|css|svg)$/g;
    for (_i = 0, _len = p_files.length; _i < _len; _i++) {
      f = p_files[_i];
      if ((f != null ? f.src : void 0) != null) {
        if ((f.id == null) || f.id === void 0) {
          f.id = f.src;
        }
        if (f.src.indexOf('.json') !== -1) {
          f.src = f.src;
        }
        jsRE.lastIndex = 0;
        if (typeof f === 'string') {
          if (jsRE.test(f)) {
            f = {
              src: f,
              type: 'text'
            };
          }
        } else if (f.src && jsRE.test(f.src)) {
          f['type'] = 'text';
        }
        this.queue.loadFile(f, false);
      }
    }
    if (p_files.length > 0) {
      this.queue.load();
    }
    return false;
  };
  /**
  	@method _normalizeConfigPaths
  	@param {Object} p_paths
  	@private
   */
  NavigationLoader.prototype._normalizeConfigPaths = function(p_paths) {
    var o, p_pathsStr, val;
    p_pathsStr = JSON.stringify(p_paths);
    while ((o = /\{([^\"\{\}]+)\}/.exec(p_pathsStr))) {
      val = p_paths[o[1]];
      if (!val) {
        val = '';
      }
      p_pathsStr = p_pathsStr.replace(new RegExp('\{' + o[1] + '\}', 'ig'), val);
      p_paths = JSON.parse(p_pathsStr);
    }
    return p_paths;
  };
  /**
  	@method _normalizePaths
  	@param {Object} p_data
  	@param {Object} p_paths
  	@return {Object}
  	@private
   */
  NavigationLoader.prototype._normalizePaths = function(p_data, p_paths) {
    var k, v;
    for (k in p_paths) {
      v = p_paths[k];
      p_data = JSON.stringify(p_data);
      p_data = p_data.replace(new RegExp('\{' + k + '\}', 'ig'), v);
      p_data = JSON.parse(p_data);
    }
    return p_data;
  };
  /**
  	@method _loadFileComplete
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype._loadFileComplete = function(evt) {
    var data, e, result, si, style;
    switch (evt.item.ext) {
      case 'json':
        data = evt.result;
        data = JSONUtils.removeComments(evt.result);
        data = this._normalizePaths(data, app.config.paths);
        if (typeof data !== 'string') {
          data = JSON.stringify(data);
        }
        break;
      case 'js':
        data = evt.result;
        data = data.replace(/^\/\/.*?(\n|$)/igm, '');
        if (this.currentStep.id === 'main') {
          result = eval(data);
          _mainView = result;
          _mainView.id = 'main';
        } else {
          eval('(function (){' + data + '}).call(self)');
        }
        break;
      case 'css':
        data = evt.result;
        style = document.createElement('style');
        style.id = evt.item.id;
        style.type = "text/css";
        head.appendChild(style);
        si = head.querySelectorAll('style').length;
        try {
          style.appendChild(document.createTextNode(data));
        } catch (_error) {
          e = _error;
          if (document.all) {
            document.styleSheets[si].cssText = data;
          }
        }
        break;
      default:
        result = evt.target.getResult(evt.item.id || evt.item.src);
        if (result instanceof Element) {
          evt.item.tag = result;
        }
    }
    return false;
  };
  /**
  	@method _loadProgress
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype._loadProgress = function(evt) {
    if (_preloaderView != null) {
      _preloaderView.progress = (evt.loaded / evt.total) * this.currentStep.ratio + this.loaderRatio;
    }
    return false;
  };
  /**
  	@method _loadComplete
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype._loadComplete = function(evt) {
    var k, step, v, view, _ref;
    this._removeLoader(this.queue);
    step = this.loaderSteps[this.loaderStep];
    if (step) {
      switch (step.id) {
        case 'core':
          this.coreAssetsLoaded();
          break;
        case 'main':
          view = _mainView;
          view.id = step.id;
          this.mainAssetsLoaded();
          break;
        case 'preloader':
          view = _preloaderView;
          view.id = step.id;
          this.preloaderAssetsLoaded();
          this.createPreloaderView();
          break;
      }
      _ref = app.config.required[step.id];
      for (k in _ref) {
        v = _ref[k];
        if ((v != null ? v.content : void 0) != null) {
          view.content = v.content;
          break;
        }
      }
    }
    this.loaderRatio += step.ratio;
    this.loaderStep++;
    if (this.loaderStep >= this.loaderSteps.length) {
      this.loaded = true;
      return this.hidePreloderView();
    }
    this.currentStep = this.loaderSteps[this.loaderStep];
    this.queue = this._createLoader(this.currentStep.id);
    this._addFiles(this.currentStep.data);
    if (this.queue._loadQueue.length + this.queue._currentLoads.length === 0) {
      this._loadComplete();
    }
    return false;
  };
  /**
  	@method createPreloaderView
  	@param {Event} [evt=null]
  	@protected
   */
  NavigationLoader.prototype.createPreloaderView = function(evt) {
    if (evt == null) {
      evt = null;
    }
    wrapper.appendChild(_preloaderView.element);
    _preloaderView.on(BaseView.CREATE_COMPLETE, this.showPreloaderView);
    _preloaderView.createStart();
    return false;
  };
  /**
  	@method showPreloaderView
  	@param {Event} [evt=null]
  	@protected
   */
  NavigationLoader.prototype.showPreloaderView = function(evt) {
    if (evt == null) {
      evt = null;
    }
    _preloaderView.off(BaseView.CREATE_COMPLETE, this.showPreloaderView);
    _preloaderView.showStart();
    return false;
  };
  /**
  	@method hidePreloderView
  	@param {Event} [evt=null]
  	@protected
   */
  NavigationLoader.prototype.hidePreloderView = function(evt) {
    if (evt == null) {
      evt = null;
    }
    _preloaderView.on(BaseView.HIDE_COMPLETE, this.destroyPreloderView);
    _preloaderView.progress = 1;
    _preloaderView.hideStart();
    return false;
  };
  /**
  	@method destroyPreloderView
  	@param {Event} [evt=null]
  	@protected
   */
  NavigationLoader.prototype.destroyPreloderView = function(evt) {
    var hiddenFonts, _ref;
    if (evt == null) {
      evt = null;
    }
    hiddenFonts = document.getElementById('hiddenFonts');
    if (hiddenFonts != null) {
      if ((_ref = hiddenFonts.parentNode) != null) {
        _ref.removeChild(hiddenFonts);
      }
    }
    _preloaderView.off(BaseView.HIDE_COMPLETE, this.destroyPreloderView);
    _preloaderView.on(BaseView.DESTROY_COMPLETE, this._createMainView);
    _preloaderView.destroy();
    this._removeLoader(this.queue);
    return false;
  };
  /**
  	@method _createMainView
  	@private
   */
  NavigationLoader.prototype._createMainView = function() {
    var _ref, _ref1;
    _preloaderView.off(BaseView.DESTROY_COMPLETE, this._createMainView);
    wrapper.removeChild(_preloaderView.element);
    _preloaderView = null;
    if (!(_mainView instanceof BaseView)) {
      throw new Error('The instance of Main class is not either BaseView class');
    }
    app.container = _mainView;
    wrapper.appendChild(_mainView.element);
    _mainView.on(BaseView.CREATE_COMPLETE, this._showMainView);
    if (((_ref = app.config.navigation) != null ? _ref.startBefore : void 0) || ((_ref1 = app.config.navigation) != null ? _ref1.startBefore : void 0) === void 0) {
      _mainView.setupNavigation(app.config);
      _mainView.createStart();
    } else {
      _mainView.createStart();
      _mainView.setupNavigation(app.config);
    }
    return false;
  };
  /**
  	@method _showMainView
  	@param {Event} [evt=null]
  	@private
   */
  NavigationLoader.prototype._showMainView = function(evt) {
    if (evt == null) {
      evt = null;
    }
    _mainView.off(BaseView.CREATE_COMPLETE, this._showMainView);
    _mainView.showStart();
    return false;
  };
  /**
  	Called only when the core assets is completely loaded.
  	@method coreAssetsLoaded
  	@param {Event} [evt=null]
   */
  NavigationLoader.prototype.coreAssetsLoaded = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return false;
  };
  /**
  	Called only when the preloader assets is completely loaded.
  	@method preloaderAssetsLoaded
  	@param {Event} [evt=null]
   */
  NavigationLoader.prototype.preloaderAssetsLoaded = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return false;
  };
  /**
  	Called only when the main assets is completely loaded.
  	@method mainAssetsLoaded
  	@param {Event} [evt=null]
   */
  NavigationLoader.prototype.mainAssetsLoaded = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return false;
  };
  return NavigationLoader;
})(EventDispatcher);
var PreloaderBlock;
PreloaderBlock = (function(_super) {
  __extends(PreloaderBlock, _super);
  function PreloaderBlock(p_data, p_className) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_className == null) {
      p_className = null;
    }
    this.destroy = __bind(this.destroy, this);
    this.hide = __bind(this.hide, this);
    this.createStart = __bind(this.createStart, this);
    PreloaderBlock.__super__.constructor.call(this, p_data, 'preloader');
  }
  PreloaderBlock.set({
    progress: function(p_value) {
      return this.text = Math.round(p_value * 100) + "%";
    }
  });
  PreloaderBlock.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.css({
      'width': '100%',
      'height': '100%',
      'font-size': '5em',
      'text-align': 'center',
      'background-color': '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
    return PreloaderBlock.__super__.createStart.apply(this, arguments);
  };
  PreloaderBlock.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.element, 1, {
      delay: .5,
      opacity: 0,
      onComplete: (function(_this) {
        return function() {
          return PreloaderBlock.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };
  PreloaderBlock.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.killTweensOf(this.element);
    return PreloaderBlock.__super__.destroy.apply(this, arguments);
  };
  return PreloaderBlock;
})(BaseView);
var Preloader;
Preloader = (function(_super) {
  __extends(Preloader, _super);
  function Preloader() {
    Preloader.__super__.constructor.call(this, new PreloaderBlock());
  }
  return Preloader;
})(NavigationLoader);
app.on('windowLoad', (function(_this) {
  return function() {
    return new Preloader();
  };
})(this));
}).call(this);