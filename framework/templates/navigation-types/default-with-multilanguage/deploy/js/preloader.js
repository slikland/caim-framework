(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
var NetworkError, isIE, __scopeIE8, _base;
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
@beta 
@example
	class A
		\@protectProperties ["_a", "_b"]
		constructor:()->
			\@_a = 1
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
    if (scope === 'static') {
      scope = this;
    }
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
    if (scope === 'static') {
      scope = this;
    }
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
window.isCallable = Function.isCallable = function(fn) {
  return typeof fn === 'function' || Object.prototype.toString.call(fn) === '[object Function]';
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
Number.MaxSafeInteger = Math.pow(2, 53) - 1;
Number.toInteger = function(value) {
  var number;
  number = Number(value);
  if (isNaN(number)) {
    return 0;
  }
  if (number === 0 || !isFinite(number)) {
    return number;
  }
  return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
};
Number.toLength = function(value) {
  var len;
  len = this.toInteger(value);
  return Math.min(Math.max(len, 0), Number.MaxSafeInteger);
};
String.prototype.url = function() {
  var a, hash, host, hostname, origin, pathname, port, protocol, search;
  a = document.createElement('a');
  a.href = this;
  origin = a.hostname;
  if (a.protocol.length > 0) {
    origin = a.protocol + '//' + a.hostname;
  }
  if (a.port.length > 0) {
    origin = "" + origin + ":" + a.port;
  }
  host = a.host, hostname = a.hostname, pathname = a.pathname, port = a.port, protocol = a.protocol, search = a.search, hash = a.hash;
  a = null;
  return {
    origin: origin,
    host: host,
    hostname: hostname,
    pathname: pathname,
    port: port,
    protocol: protocol,
    search: search,
    hash: hash
  };
};
String.prototype.trim = function(char) {
  if (char == null) {
    char = null;
  }
  return this.ltrim(char).rtrim(char);
};
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
window.isArray = Array.isArray;
if (!("of" in Array.prototype)) {
  Array.of = function() {
    return Array.prototype.slice.call(arguments);
  };
}
if (!("from" in Array.prototype)) {
  Array.from = function(arrayLike) {
    var A, C, T, items, k, kValue, len, mapFn;
    C = this;
    items = Object(arrayLike);
    if (arrayLike === null) {
      throw new TypeError('Array.from requires an array-like object - not null or undefined');
    }
    mapFn = arguments.length > 1 ? arguments[1] : void 0;
    T = void 0;
    if (typeof mapFn !== 'undefined') {
      if (!Function.isCallable(mapFn)) {
        throw new TypeError('Array.from: when provided, the second argument must be a function');
      }
      if (arguments.length > 2) {
        T = arguments[2];
      }
    }
    len = Number.toLength(items.length);
    A = Function.isCallable(C) ? Object(new C(len)) : new Array(len);
    k = 0;
    kValue = void 0;
    while (k < len) {
      kValue = items[k];
      if (mapFn) {
        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
      } else {
        A[k] = kValue;
      }
      k += 1;
    }
    A.length = len;
    return A;
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
window.isPlainObject = Object.isObject = function(obj) {
  return obj !== null && typeof obj === "object" && Object.getPrototypeOf(obj) === Object.prototype;
};
if (!("is" in Object)) {
  Object.is = function(x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  };
}
if (!("assign" in Object)) {
  Object.defineProperty(Object, 'assign', {
    value: function(target, varArgs) {
      'use strict';
      var index, nextKey, nextSource, to;
      if (target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      to = Object(target);
      index = 1;
      while (index < arguments.length) {
        nextSource = arguments[index];
        if (nextSource !== null) {
          for (nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
        index++;
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
Node.prototype.on = Node.prototype.addEventListener;
Node.prototype.off = Node.prototype.removeEventListener;
if ((_base = Element.prototype).matches == null) {
  _base.matches = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;
}
Element.prototype.isElement = function(p_target) {
  if (typeof HTMLElement === 'object') {
    return p_target instanceof HTMLElement || p_target instanceof BaseDOM;
  } else {
    return typeof p_target === 'object' && (p_target != null ? p_target.nodeType : void 0) === 1 && typeof (p_target != null ? p_target.nodeName : void 0) === 'string';
  }
};
(function() {
  var browserRaf, canceled, lastTime, nowOffset, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    vendor = _ref[_i];
    if (w.requestAnimationFrame) {
      break;
    }
    w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
    w.cancelAnimationFrame = w["" + vendor + "CancelAnimationFrame"] || w["" + vendor + "CancelRequestAnimationFrame"];
  }
  if (!('performance' in window)) {
    window.performance = {};
  }
  if (!Date.now) {
    Date.now = (function(_this) {
      return function() {
        return new Date().getTime();
      };
    })(this);
  }
  if (!('now' in window.performance)) {
    nowOffset = Date.now();
    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart;
    }
    window.performance.now = (function(_this) {
      return function() {
        return Date.now() - nowOffset;
      };
    })(this);
  }
  if (w.requestAnimationFrame) {
    if (w.cancelAnimationFrame) {
      return;
    }
    browserRaf = w.requestAnimationFrame;
    canceled = {};
    w.requestAnimationFrame = function(callback) {
      var id;
      return id = browserRaf(function(time) {
        if (id in canceled) {
          return delete canceled[id];
        } else {
          return callback(time);
        }
      });
    };
    return w.cancelAnimationFrame = function(id) {
      return canceled[id] = true;
    };
  } else {
    lastTime = 0;
    w.requestAnimationFrame = function(callback) {
      var currTime, id, timeToCall;
      currTime = Date.now();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout(function() {
        return callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
    return w.cancelAnimationFrame = function(id) {
      return clearTimeout(id);
    };
  }
})();
if (typeof Cache !== "undefined" && Cache !== null) {
  if (!("add" in Cache.prototype)) {
    Cache.prototype.add = function(request) {
      return this.addAll([request]);
    };
  }
  if (!("addAll" in Cache.prototype)) {
    Cache.prototype.addAll = function(requests) {
      var cache;
      return cache = this;
    };
    NetworkError = function(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    };
    NetworkError.prototype = Object.create(Error.prototype);
    Promise.resolve().then(function() {
      var requests, sequence;
      if (arguments.length < 1) {
        throw new TypeError;
      }
      sequence = [];
      requests = requests.map(function(request) {
        if (request instanceof Request) {
          return request;
        } else {
          return String(request);
        }
      });
      return Promise.all(requests.map(function(request) {
        var scheme;
        if (typeof request === 'string') {
          request = new Request(request);
        }
        scheme = new URL(request.url).protocol;
        if (scheme !== 'http:' && scheme !== 'https:') {
          throw new NetworkError('Invalid scheme');
        }
        return fetch(request.clone());
      }));
    }).then(function(responses) {
      return Promise.all(responses.map(function(response, i) {
        return cache.put(requests[i], response);
      }));
    }).then(function() {
      return void 0;
    });
  }
}
if (typeof CacheStorage !== "undefined" && CacheStorage !== null) {
  if (!("match" in CacheStorage.prototype)) {
    CacheStorage.prototype.match = function(request, opts) {
      var caches;
      caches = this;
      return this.keys().then(function(cacheNames) {
        var match;
        match = void 0;
        return cacheNames.reduce((function(chain, cacheName) {}, chain.then(function() {
          return match || caches.open(cacheName).then(function(cache) {
            return cache.match(request, opts);
          }).then(function(response) {
            match = response;
            return match;
          });
        })), Promise.resolve());
      });
    };
  }
}
if (navigator.mediaDevices == null) {
  navigator.mediaDevices = {};
}
navigator.getUserMedia = navigator.mediaDevices.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
/**
@class EventDispatcher
@submodule caim.event
 */
var EventDispatcher;
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
    var e, events, i, k, v, _i, _len;
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
    if (sourceEvent instanceof Event || sourceEvent instanceof CustomEvent) {
      if (data == null) {
        data = {};
      }
      data.sourceEvent = sourceEvent;
    }
    e = {
      type: evt,
      target: target,
      currentTarget: this,
      defaultPrevented: false,
      sourceEvent: sourceEvent || (data != null ? data.sourceEvent : void 0)
    };
    e.preventDefault = function() {
      var _ref;
      this.defaultPrevented = true;
      return (_ref = this.sourceEvent) != null ? typeof _ref.preventDefault === "function" ? _ref.preventDefault() : void 0 : void 0;
    };
    e.stopPropagation = function() {
      return sourceEvent != null ? typeof sourceEvent.stopPropagation === "function" ? sourceEvent.stopPropagation() : void 0 : void 0;
    };
    e.stopImmediatePropagation = function() {
      return sourceEvent != null ? typeof sourceEvent.stopImmediatePropagation === "function" ? sourceEvent.stopImmediatePropagation() : void 0 : void 0;
    };
    if (typeof data === 'object') {
      for (k in data) {
        v = data[k];
        if (!e[k]) {
          e[k] = v;
        }
      }
    }
    i = events.length;
    while (i-- > 0) {
      if (typeof events[i] === "function") {
        events[i](e, data);
      }
    }
    return e;
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
/**
_
@class App
@extends EventDispatcher
@submodule caim.navigation.core
 */
var App, app, windowLoaded;
App = (function(_super) {
  var framework_version, _conditions, _config, _container, _detections, _loader, _navigation, _root;
  __extends(App, _super);
  App.project_version_raw = "SL_PROJECT_VERSION:1.1.1";
  App.project_date_raw = "SL_PROJECT_DATE:1489513136190";
  App.WINDOW_ACTIVE = "windowActive";
  App.WINDOW_INACTIVE = "windowInactive";
  App.NETWORK_UPDATE = 'networkUpdate';
  framework_version = "3.3.3";
  _root = null;
  _loader = null;
  _config = null;
  _container = null;
  _navigation = null;
  _conditions = null;
  _detections = null;
  function App() {
    this._updateNetworkStatus = __bind(this._updateNetworkStatus, this);
    this._windowVisibilityChange = __bind(this._windowVisibilityChange, this);
    App.__super__.constructor.apply(this, arguments);
    this._checkWindowActivity();
    this._checkNetworkStatus();
  }
  App.get({
    info: function() {
      var info;
      info = {};
      info.framework = {};
      info.framework.version = framework_version;
      info.framework.lastUpdate = void 0;
      info.contents = {};
      info.contents.version = void 0;
      info.contents.lastUpdate = void 0;
      info.project = {};
      info.project.version = (App.project_version_raw === void 0 || App.project_version_raw === 'undefined' ? 'SL_PROJECT_VERSION:' + 'Not versioned' : App.project_version_raw).replace('SL_PROJECT_VERSION:', '');
      info.project.lastUpdate = new Date(parseFloat((App.project_date_raw === void 0 || App.project_date_raw === 'undefined' ? 'SL_PROJECT_DATE:' + 'Not versioned' : App.project_date_raw).replace('SL_PROJECT_DATE:', '')));
      return info;
    }
  });
  App.set({
    root: function(p_value) {
      return _root = p_value;
    }
  });
  App.get({
    root: function() {
      return _root;
    }
  });
  App.set({
    loader: function(p_value) {
      return _loader = p_value;
    }
  });
  App.get({
    loader: function() {
      return _loader;
    }
  });
  App.set({
    config: function(p_value) {
      return _config = p_value;
    }
  });
  App.get({
    config: function() {
      return _config;
    }
  });
  App.set({
    container: function(p_value) {
      return _container = p_value;
    }
  });
  App.get({
    container: function() {
      return _container;
    }
  });
  App.set({
    navigation: function(p_value) {
      return _navigation = p_value;
    }
  });
  App.get({
    navigation: function() {
      return _navigation;
    }
  });
  App.set({
    conditions: function(p_value) {
      return _conditions = p_value;
    }
  });
  App.get({
    conditions: function() {
      return _conditions;
    }
  });
  App.set({
    detections: function(p_value) {
      return _detections = p_value;
    }
  });
  App.get({
    detections: function() {
      return _detections;
    }
  });
  App.get({
    online: function() {
      var _ref;
      return typeof window !== "undefined" && window !== null ? (_ref = window.navigator) != null ? _ref.online : void 0 : void 0;
    }
  });
  App.get({
    windowHidden: function() {
      var i, prefixes, prop;
      prop = null;
      if ('hidden' in document) {
        prop = document['hidden'];
      } else {
        prefixes = ['webkit', 'moz', 'ms', 'o'];
        i = 0;
        while (i < prefixes.length) {
          if (prefixes[i] + 'Hidden' in document) {
            prop = document[prefixes[i] + 'Hidden'];
            break;
          }
          i++;
        }
      }
      return prop;
    }
  });
  App.prototype._checkWindowActivity = function() {
    if (this.windowHidden) {
      return document.addEventListener('visibilitychange', this._windowVisibilityChange);
    } else if ('onfocusin' in document) {
      return document.onfocusin = document.onfocusout = this._windowVisibilityChange;
    } else {
      return window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this._windowVisibilityChange;
    }
  };
  App.prototype._windowVisibilityChange = function(evt) {
    var evtType;
    switch (evt.type) {
      case 'blur':
      case 'pagehide':
        evtType = App.WINDOW_INACTIVE;
        break;
      case 'focus':
      case 'pageshow':
        evtType = App.WINDOW_ACTIVE;
    }
    return this.trigger(evtType);
  };
  App.prototype._checkNetworkStatus = function() {
    window.addEventListener("online", this._updateNetworkStatus);
    return window.addEventListener("offline", this._updateNetworkStatus);
  };
  App.prototype._updateNetworkStatus = function() {
    return this.trigger(App.NETWORK_UPDATE);
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
@class Debug
@static
@submodule caim.debug
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
      re = new RegExp(/([\.|\/]local\.|localhost|127\.0\.0\.1|192\.\d+\.\d+\.\d+|dev\.s\d+\.caim\.)/i);
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
      t += 'Caim Framework';
      t += '\n';
      t += 'Version: ' + app.info.framework.version;
      t += '\n';
      t += '--------------------';
      t += '\n';
      t += 'Project';
      t += '\n';
      t += 'Version: ' + app.info.project.version;
      t += '\n';
      t += 'Last update: ' + app.info.project.lastUpdate;
      t += '\n';
      t += '--------------------';
      t += '\n';
      if (app.info.contents.version != null) {
        t += 'Cache Contents Enabled';
        t += '\n';
        t += 'Version: ' + app.info.contents.version;
        t += '\n';
      } else {
        t += 'Cache Contents Disabled';
        t += '\n';
      }
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
@class Detections
@submodule caim.utils
 */
var Detections;
Detections = (function() {
  var getFirstMatch, getOS, testCanvas, testWebGL;
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
  /**
  	@method getInstance
  	@static
  	@return {Detections}
   */
  Detections.getInstance = function() {
    return Detections._instance != null ? Detections._instance : Detections._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Detections, arguments, function(){});
  };
  /**
  	@class Detections
  	@constructor
   */
  function Detections() {
    this.testRetinaDisplay = __bind(this.testRetinaDisplay, this);
    var k, o, v, validVersion, versionToCheck, _ref;
    this.matched = null;
    /**
    		@property ua
    		@type {String}
    		@readOnly
     */
    this.ua = (typeof navigator !== "undefined" && navigator !== null ? navigator.userAgent : void 0) || '';
    /**
    		@property platform
    		@type {String}
    		@readOnly
     */
    this.platform = (typeof navigator !== "undefined" && navigator !== null ? navigator.platform : void 0) || '';
    /**
    		@property version
    		@type {String}
    		@readOnly
     */
    this.version = getFirstMatch(/version\/(\d+(\.\d+)*)/i, this.ua);
    /**
    		@property vibrate
    		@type {Boolean}
    		@readOnly
     */
    this.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    /**
    		@property standalone
    		@type {Boolean}
    		@readOnly
     */
    this.standalone = (typeof window !== "undefined" && window !== null ? window.navigator.standalone : void 0) || (typeof window !== "undefined" && window !== null ? window.matchMedia('(display-mode: standalone)').matches : void 0);
    /**
    		@property retina
    		@type {Boolean}
    		@readOnly
     */
    this.retina = this.testRetinaDisplay();
    this.getBrowser();
    /**
    		@property versionArr
    		@type {Array}
    		@readOnly
     */
    this.versionArr = this.version == null ? [] : this.version.split('.');
    _ref = this.versionArr;
    for (k in _ref) {
      v = _ref[k];
      this.versionArr[k] = Number(v);
    }
    /**
    		@property touch
    		@type {Boolean}
    		@readOnly
     */
    this.touch = Boolean('ontouchstart' in window) || Boolean(navigator.maxTouchPoints > 0) || Boolean(navigator.msMaxTouchPoints > 0);
    /**
    		@property tablet
    		@type {Boolean}
    		@readOnly
     */
    this.tablet = /(ipad.*|tablet(?!\s+pc).*|(android.*?chrome((?!mobi).)*))$/i.test(this.ua);
    /**
    		@property mobile
    		@type {Boolean}
    		@readOnly
     */
    this.mobile = !this.tablet && Boolean(getFirstMatch(/(ipod|iphone|ipad)/i, this.ua) || /[^-]mobi/i.test(this.ua));
    /**
    		@property desktop
    		@type {Boolean}
    		@readOnly
     */
    this.desktop = !this.mobile && !this.tablet;
    /**
    		@property os
    		@type {Boolean}
    		@readOnly
     */
    this.os = getOS();
    /**
    		@property cache
    		@type {Boolean}
    		@readOnly
     */
    this.cache = this.serviceWorker = 'serviceWorker' in navigator;
    /**
    		@property canvas
    		@type {Boolean}
    		@readOnly
     */
    this.canvas = testCanvas();
    /**
    		@property webgl
    		@type {Boolean}
    		@readOnly
     */
    this.webgl = testWebGL();
    versionToCheck = 10;
    validVersion = false;
    if (this.version) {
      validVersion = this.versionArr[0] >= versionToCheck;
    } else {
      if (o = /\(iP(?:hone|ad|od).*? OS (\d+)_(\d+)/i.exec(this.ua)) {
        validVersion = Number(o[1]) >= versionToCheck;
      }
    }
    /**
    		@property iosInlineVideo
    		@type {Boolean}
    		@readOnly
     */
    this.iosInlineVideo = this.os === "ios" && validVersion;
  }
  /**
  	@property orientation
  	@type {String} 'landscape' or 'portrait'
  	@readOnly
   */
  Detections.get({
    orientation: function() {
      var ratio;
      ratio = (typeof screen !== "undefined" && screen !== null ? screen.width : void 0) / (typeof screen !== "undefined" && screen !== null ? screen.height : void 0);
      if ((typeof window !== "undefined" && window !== null ? window.innerWidth : void 0) > (typeof window !== "undefined" && window !== null ? window.innerHeight : void 0) && ratio > 1.3) {
        return 'landscape';
      } else {
        return 'portrait';
      }
    }
  });
  /**
  	@method test
  	@param {String} value
  	@return {Number} 
  	@protected
   */
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
  /**
  	@method getFirstMatch
  	@param {RegExp} re 
  	@param {Number} val 
  	@return {Boolean} 
  	@private
   */
  getFirstMatch = function(re, val) {
    var m;
    m = val.match(re);
    return (m && m.length > 1 && m[1]) || null;
  };
  /**
  	@method getBrowser
  	@return {Array} The result in array is a string like ["name", "version"]
  	@protected
   */
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
  /**
  	@method getOS
  	@return {String} The result values are 'ios', 'osx', 'android', 'windows' and 'blackberry'
  	@default undefined
  	@protected
   */
  getOS = function() {
    var result;
    result = void 0;
    switch (typeof navigator !== "undefined" && navigator !== null ? navigator.platform.toLowerCase() : void 0) {
      case 'iphone':
      case 'ipod':
      case 'ipad':
      case 'iphone simulator':
      case 'ipod simulator':
      case 'ipad simulator':
      case 'Pike v7.6 release 92':
      case 'Pike v7.8 release 517':
        result = 'ios';
        break;
      case 'macintosh':
      case 'macintel':
      case 'macppc':
      case 'mac68k':
        result = 'osx';
        break;
      case 'android':
        result = 'android';
        break;
      case 'os/2':
      case 'wince':
      case 'pocket pc':
      case 'windows':
        result = 'windows';
        break;
      case 'blackberry':
        result = 'blackberry';
    }
    if (/linux armv+(\d{1}l)/i.test(typeof navigator !== "undefined" && navigator !== null ? navigator.platform : void 0)) {
      result = 'android';
    } else if (/linux+\s?.*?$/im.test(typeof navigator !== "undefined" && navigator !== null ? navigator.platform : void 0)) {
      result = 'linux';
    } else if (/win\d{2}/i.test(typeof navigator !== "undefined" && navigator !== null ? navigator.platform : void 0)) {
      result = 'windows';
    }
    return result;
  };
  /**
  	@method testRetinaDisplay
  	@return {Boolean} 
  	@private
   */
  Detections.prototype.testRetinaDisplay = function() {
    var mq;
    if (typeof window !== "undefined" && window !== null ? window.matchMedia : void 0) {
      mq = window.matchMedia('only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)');
      return mq && mq.matches || (typeof window !== "undefined" && window !== null ? window.devicePixelRatio : void 0) > 1;
    }
    return false;
  };
  /**
  	@method testWebGL
  	@return {Boolean} 
  	@private
   */
  testWebGL = function() {
    var err;
    try {
      return !!window.WebGLRenderingContext && Boolean(document.createElement("canvas").getContext('webgl')) || Boolean(document.createElement("canvas").getContext('experimental-webgl'));
    } catch (_error) {
      err = _error;
      return false;
    }
  };
  /**
  	@method testCanvas
  	@return {Boolean} 
  	@private
   */
  testCanvas = function() {
    var err;
    try {
      return !!window.CanvasRenderingContext2D && Boolean(document.createElement("canvas").getContext('2d'));
    } catch (_error) {
      err = _error;
      return false;
    }
  };
  return Detections;
})();
/**
@class PreloadFiles
@submodule caim.loader
 */
/*
It's a simple wrapper to PreloadJS.
WARNING!1!!
The preloadJS was modified to not use revokeObjectURL.
Beware when overwriting this class.
See more info on <a href="http://www.createjs.com/docs/preloadjs/" target="_blank" class="crosslink">PreloadJS Docs</a>
 */
this.createjs=this.createjs||{},function(){"use strict";var a=createjs.PreloadJS=createjs.PreloadJS||{};a.version="0.6.2",a.buildDate="Thu, 26 Nov 2015 20:44:31 GMT"}(),this.createjs=this.createjs||{},createjs.extend=function(a,b){"use strict";function c(){this.constructor=a}return c.prototype=b.prototype,a.prototype=new c},this.createjs=this.createjs||{},createjs.promote=function(a,b){"use strict";var c=a.prototype,d=Object.getPrototypeOf&&Object.getPrototypeOf(c)||c.__proto__;if(d){c[(b+="_")+"constructor"]=d.constructor;for(var e in d)c.hasOwnProperty(e)&&"function"==typeof d[e]&&(c[b+e]=d[e])}return a},this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},createjs.indexOf=function(a,b){"use strict";for(var c=0,d=a.length;c<d;c++)if(b===a[c])return c;return-1},this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.type=a,this.target=null,this.currentTarget=null,this.eventPhase=0,this.bubbles=!!b,this.cancelable=!!c,this.timeStamp=(new Date).getTime(),this.defaultPrevented=!1,this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.removed=!1}var b=a.prototype;b.preventDefault=function(){this.defaultPrevented=this.cancelable&&!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.set=function(a){for(var b in a)this[b]=a[b];return this},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.Event_constructor("error"),this.title=a,this.message=b,this.data=c}var b=createjs.extend(a,createjs.Event);b.clone=function(){return new createjs.ErrorEvent(this.title,this.message,this.data)},createjs.ErrorEvent=createjs.promote(a,"Event")}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._listeners=null,this._captureListeners=null}var b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;f<g;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b,c){if("string"==typeof a){var d=this._listeners;if(!(b||d&&d[a]))return!0;a=new createjs.Event(a,b,c)}else a.target&&a.clone&&(a=a.clone());try{a.target=this}catch(a){}if(a.bubbles&&this.parent){for(var e=this,f=[e];e.parent;)f.push(e=e.parent);var g,h=f.length;for(g=h-1;g>=0&&!a.propagationStopped;g--)f[g]._dispatchEvent(a,1+(0==g));for(g=1;g<h&&!a.propagationStopped;g++)f[g]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return!a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;try{a.currentTarget=this}catch(a){}try{a.eventPhase=b}catch(a){}a.removed=!1,e=e.slice();for(var f=0;f<c&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(a){"use strict";function b(a,b){this.Event_constructor("progress"),this.loaded=a,this.total=null==b?1:b,this.progress=0==b?0:this.loaded/this.total}var c=createjs.extend(b,createjs.Event);c.clone=function(){return new createjs.ProgressEvent(this.loaded,this.total)},createjs.ProgressEvent=createjs.promote(b,"Event")}(window),function(){function f(a,c){function t(a){if(t[a]!==r)return t[a];var b;if("bug-string-char-index"==a)b="a"!="a"[0];else if("json"==a)b=t("json-stringify")&&t("json-parse");else{var d,f='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==a){var h=c.stringify,j="function"==typeof h&&s;if(j){(d=function(){return 1}).toJSON=d;try{j="0"===h(0)&&"0"===h(new e)&&'""'==h(new g)&&h(o)===r&&h(r)===r&&h()===r&&"1"===h(d)&&"[1]"==h([d])&&"[null]"==h([r])&&"null"==h(null)&&"[null,null,null]"==h([r,o,null])&&h({a:[d,!0,!1,null,"\0\b\n\f\r\t"]})==f&&"1"===h(null,d)&&"[\n 1,\n 2\n]"==h([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==h(new i(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==h(new i(864e13))&&'"-000001-01-01T00:00:00.000Z"'==h(new i(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==h(new i(-1))}catch(a){j=!1}}b=j}if("json-parse"==a){var k=c.parse;if("function"==typeof k)try{if(0===k("0")&&!k(!1)){d=k(f);var l=5==d.a.length&&1===d.a[0];if(l){try{l=!k('"\t"')}catch(a){}if(l)try{l=1!==k("01")}catch(a){}if(l)try{l=1!==k("1.")}catch(a){}}}}catch(a){l=!1}b=l}}return t[a]=!!b}a||(a=d.Object()),c||(c=d.Object());var e=a.Number||d.Number,g=a.String||d.String,h=a.Object||d.Object,i=a.Date||d.Date,j=a.SyntaxError||d.SyntaxError,k=a.TypeError||d.TypeError,l=a.Math||d.Math,m=a.JSON||d.JSON;"object"==typeof m&&m&&(c.stringify=m.stringify,c.parse=m.parse);var p,q,r,n=h.prototype,o=n.toString,s=new i(-0xc782b5b800cec);try{s=s.getUTCFullYear()==-109252&&0===s.getUTCMonth()&&1===s.getUTCDate()&&10==s.getUTCHours()&&37==s.getUTCMinutes()&&6==s.getUTCSeconds()&&708==s.getUTCMilliseconds()}catch(a){}if(!t("json")){var u="[object Function]",v="[object Date]",w="[object Number]",x="[object String]",y="[object Array]",z="[object Boolean]",A=t("bug-string-char-index");if(!s)var B=l.floor,C=[0,31,59,90,120,151,181,212,243,273,304,334],D=function(a,b){return C[b]+365*(a-1970)+B((a-1969+(b=+(b>1)))/4)-B((a-1901+b)/100)+B((a-1601+b)/400)};if((p=n.hasOwnProperty)||(p=function(a){var c,b={};return(b.__proto__=null,b.__proto__={toString:1},b).toString!=o?p=function(a){var b=this.__proto__,c=a in(this.__proto__=null,this);return this.__proto__=b,c}:(c=b.constructor,p=function(a){var b=(this.constructor||c).prototype;return a in this&&!(a in b&&this[a]===b[a])}),b=null,p.call(this,a)}),q=function(a,c){var e,f,g,d=0;(e=function(){this.valueOf=0}).prototype.valueOf=0,f=new e;for(g in f)p.call(f,g)&&d++;return e=f=null,d?q=2==d?function(a,b){var e,c={},d=o.call(a)==u;for(e in a)d&&"prototype"==e||p.call(c,e)||!(c[e]=1)||!p.call(a,e)||b(e)}:function(a,b){var d,e,c=o.call(a)==u;for(d in a)c&&"prototype"==d||!p.call(a,d)||(e="constructor"===d)||b(d);(e||p.call(a,d="constructor"))&&b(d)}:(f=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],q=function(a,c){var e,g,d=o.call(a)==u,h=!d&&"function"!=typeof a.constructor&&b[typeof a.hasOwnProperty]&&a.hasOwnProperty||p;for(e in a)d&&"prototype"==e||!h.call(a,e)||c(e);for(g=f.length;e=f[--g];h.call(a,e)&&c(e));}),q(a,c)},!t("json-stringify")){var E={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},F="000000",G=function(a,b){return(F+(b||0)).slice(-a)},H="\\u00",I=function(a){for(var b='"',c=0,d=a.length,e=!A||d>10,f=e&&(A?a.split(""):a);c<d;c++){var g=a.charCodeAt(c);switch(g){case 8:case 9:case 10:case 12:case 13:case 34:case 92:b+=E[g];break;default:if(g<32){b+=H+G(2,g.toString(16));break}b+=e?f[c]:a.charAt(c)}}return b+'"'},J=function(a,b,c,d,e,f,g){var h,i,j,l,m,n,s,t,u,A,C,E,F,H,K,L;try{h=b[a]}catch(a){}if("object"==typeof h&&h)if(i=o.call(h),i!=v||p.call(h,"toJSON"))"function"==typeof h.toJSON&&(i!=w&&i!=x&&i!=y||p.call(h,"toJSON"))&&(h=h.toJSON(a));else if(h>-1/0&&h<1/0){if(D){for(m=B(h/864e5),j=B(m/365.2425)+1970-1;D(j+1,0)<=m;j++);for(l=B((m-D(j,0))/30.42);D(j,l+1)<=m;l++);m=1+m-D(j,l),n=(h%864e5+864e5)%864e5,s=B(n/36e5)%24,t=B(n/6e4)%60,u=B(n/1e3)%60,A=n%1e3}else j=h.getUTCFullYear(),l=h.getUTCMonth(),m=h.getUTCDate(),s=h.getUTCHours(),t=h.getUTCMinutes(),u=h.getUTCSeconds(),A=h.getUTCMilliseconds();h=(j<=0||j>=1e4?(j<0?"-":"+")+G(6,j<0?-j:j):G(4,j))+"-"+G(2,l+1)+"-"+G(2,m)+"T"+G(2,s)+":"+G(2,t)+":"+G(2,u)+"."+G(3,A)+"Z"}else h=null;if(c&&(h=c.call(b,a,h)),null===h)return"null";if(i=o.call(h),i==z)return""+h;if(i==w)return h>-1/0&&h<1/0?""+h:"null";if(i==x)return I(""+h);if("object"==typeof h){for(H=g.length;H--;)if(g[H]===h)throw k();if(g.push(h),C=[],K=f,f+=e,i==y){for(F=0,H=h.length;F<H;F++)E=J(F,h,c,d,e,f,g),C.push(E===r?"null":E);L=C.length?e?"[\n"+f+C.join(",\n"+f)+"\n"+K+"]":"["+C.join(",")+"]":"[]"}else q(d||h,function(a){var b=J(a,h,c,d,e,f,g);b!==r&&C.push(I(a)+":"+(e?" ":"")+b)}),L=C.length?e?"{\n"+f+C.join(",\n"+f)+"\n"+K+"}":"{"+C.join(",")+"}":"{}";return g.pop(),L}};c.stringify=function(a,c,d){var e,f,g,h;if(b[typeof c]&&c)if((h=o.call(c))==u)f=c;else if(h==y){g={};for(var k,i=0,j=c.length;i<j;k=c[i++],h=o.call(k),(h==x||h==w)&&(g[k]=1));}if(d)if((h=o.call(d))==w){if((d-=d%1)>0)for(e="",d>10&&(d=10);e.length<d;e+=" ");}else h==x&&(e=d.length<=10?d:d.slice(0,10));return J("",(k={},k[""]=a,k),f,g,e,"",[])}}if(!t("json-parse")){var M,N,K=g.fromCharCode,L={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"},O=function(){throw M=N=null,j()},P=function(){for(var c,d,e,f,g,a=N,b=a.length;M<b;)switch(g=a.charCodeAt(M)){case 9:case 10:case 13:case 32:M++;break;case 123:case 125:case 91:case 93:case 58:case 44:return c=A?a.charAt(M):a[M],M++,c;case 34:for(c="@",M++;M<b;)if(g=a.charCodeAt(M),g<32)O();else if(92==g)switch(g=a.charCodeAt(++M)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:c+=L[g],M++;break;case 117:for(d=++M,e=M+4;M<e;M++)g=a.charCodeAt(M),g>=48&&g<=57||g>=97&&g<=102||g>=65&&g<=70||O();c+=K("0x"+a.slice(d,M));break;default:O()}else{if(34==g)break;for(g=a.charCodeAt(M),d=M;g>=32&&92!=g&&34!=g;)g=a.charCodeAt(++M);c+=a.slice(d,M)}if(34==a.charCodeAt(M))return M++,c;O();default:if(d=M,45==g&&(f=!0,g=a.charCodeAt(++M)),g>=48&&g<=57){for(48==g&&(g=a.charCodeAt(M+1),g>=48&&g<=57)&&O(),f=!1;M<b&&(g=a.charCodeAt(M),g>=48&&g<=57);M++);if(46==a.charCodeAt(M)){for(e=++M;e<b&&(g=a.charCodeAt(e),g>=48&&g<=57);e++);e==M&&O(),M=e}if(g=a.charCodeAt(M),101==g||69==g){for(g=a.charCodeAt(++M),43!=g&&45!=g||M++,e=M;e<b&&(g=a.charCodeAt(e),g>=48&&g<=57);e++);e==M&&O(),M=e}return+a.slice(d,M)}if(f&&O(),"true"==a.slice(M,M+4))return M+=4,!0;if("false"==a.slice(M,M+5))return M+=5,!1;if("null"==a.slice(M,M+4))return M+=4,null;O()}return"$"},Q=function(a){var b,c;if("$"==a&&O(),"string"==typeof a){if("@"==(A?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(b=[];a=P(),"]"!=a;c||(c=!0))c&&(","==a?(a=P(),"]"==a&&O()):O()),","==a&&O(),b.push(Q(a));return b}if("{"==a){for(b={};a=P(),"}"!=a;c||(c=!0))c&&(","==a?(a=P(),"}"==a&&O()):O()),","!=a&&"string"==typeof a&&"@"==(A?a.charAt(0):a[0])&&":"==P()||O(),b[a.slice(1)]=Q(P());return b}O()}return a},R=function(a,b,c){var d=S(a,b,c);d===r?delete a[b]:a[b]=d},S=function(a,b,c){var e,d=a[b];if("object"==typeof d&&d)if(o.call(d)==y)for(e=d.length;e--;)R(d,e,c);else q(d,function(a){R(d,a,c)});return c.call(a,b,d)};c.parse=function(a,b){var c,d;return M=0,N=""+a,c=Q(P()),"$"!=P()&&O(),M=N=null,b&&o.call(b)==u?S((d={},d[""]=c,d),"",b):c}}}return c.runInContext=f,c}var a="function"==typeof define&&define.amd,b={function:!0,object:!0},c=b[typeof exports]&&exports&&!exports.nodeType&&exports,d=b[typeof window]&&window||this,e=c&&b[typeof module]&&module&&!module.nodeType&&"object"==typeof global&&global;if(!e||e.global!==e&&e.window!==e&&e.self!==e||(d=e),c&&!a)f(d,c);else{var g=d.JSON,h=d.JSON3,i=!1,j=f(d,d.JSON3={noConflict:function(){return i||(i=!0,d.JSON=g,d.JSON3=h,g=h=null),j}});d.JSON={parse:j.parse,stringify:j.stringify}}a&&define(function(){return j})}.call(this),function(){var a={};a.appendToHead=function(b){a.getHead().appendChild(b)},a.getHead=function(){return document.head||document.getElementsByTagName("head")[0]},a.getBody=function(){return document.body||document.getElementsByTagName("body")[0]},createjs.DomUtils=a}(),function(){var a={};a.parseXML=function(a,b){var c=null;try{if(window.DOMParser){var d=new DOMParser;c=d.parseFromString(a,b)}}catch(a){}if(!c)try{c=new ActiveXObject("Microsoft.XMLDOM"),c.async=!1,c.loadXML(a)}catch(a){c=null}return c},a.parseJSON=function(a){if(null==a)return null;try{return JSON.parse(a)}catch(a){throw a}},createjs.DataUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this.src=null,this.type=null,this.id=null,this.maintainOrder=!1,this.callback=null,this.data=null,this.method=createjs.LoadItem.GET,this.values=null,this.headers=null,this.withCredentials=!1,this.mimeType=null,this.crossOrigin=null,this.loadTimeout=c.LOAD_TIMEOUT_DEFAULT}var b=a.prototype={},c=a;c.LOAD_TIMEOUT_DEFAULT=8e3,c.create=function(b){if("string"==typeof b){var d=new a;return d.src=b,d}if(b instanceof c)return b;if(b instanceof Object&&b.src)return null==b.loadTimeout&&(b.loadTimeout=c.LOAD_TIMEOUT_DEFAULT),b;throw new Error("Type not recognized.")},b.set=function(a){for(var b in a)this[b]=a[b];return this},createjs.LoadItem=c}(),function(){var a={};a.ABSOLUTE_PATT=/^(?:\w+:)?\/{2}/i,a.RELATIVE_PATT=/^[.\/]*?\//i,a.EXTENSION_PATT=/\/?[^\/]+\.(\w{1,5})$/i,a.parseURI=function(b){var c={absolute:!1,relative:!1};if(null==b)return c;var d=b.indexOf("?");d>-1&&(b=b.substr(0,d));var e;return a.ABSOLUTE_PATT.test(b)?c.absolute=!0:a.RELATIVE_PATT.test(b)&&(c.relative=!0),(e=b.match(a.EXTENSION_PATT))&&(c.extension=e[1].toLowerCase()),c},a.formatQueryString=function(a,b){if(null==a)throw new Error("You must specify data.");var c=[];for(var d in a)c.push(d+"="+escape(a[d]));return b&&(c=c.concat(b)),c.join("&")},a.buildPath=function(a,b){if(null==b)return a;var c=[],d=a.indexOf("?");if(d!=-1){var e=a.slice(d+1);c=c.concat(e.split("&"))}return d!=-1?a.slice(0,d)+"?"+this.formatQueryString(b,c):a+"?"+this.formatQueryString(b,c)},a.isCrossDomain=function(a){var b=document.createElement("a");b.href=a.src;var c=document.createElement("a");c.href=location.href;var d=""!=b.hostname&&(b.port!=c.port||b.protocol!=c.protocol||b.hostname!=c.hostname);return d},a.isLocal=function(a){var b=document.createElement("a");return b.href=a.src,""==b.hostname&&"file:"==b.protocol},a.isBinary=function(a){switch(a){case createjs.AbstractLoader.IMAGE:case createjs.AbstractLoader.BINARY:return!0;default:return!1}},a.isImageTag=function(a){return a instanceof HTMLImageElement},a.isAudioTag=function(a){return!!window.HTMLAudioElement&&a instanceof HTMLAudioElement},a.isVideoTag=function(a){return!!window.HTMLVideoElement&&a instanceof HTMLVideoElement},a.isText=function(a){switch(a){case createjs.AbstractLoader.TEXT:case createjs.AbstractLoader.JSON:case createjs.AbstractLoader.MANIFEST:case createjs.AbstractLoader.XML:case createjs.AbstractLoader.CSS:case createjs.AbstractLoader.SVG:case createjs.AbstractLoader.JAVASCRIPT:case createjs.AbstractLoader.SPRITESHEET:return!0;default:return!1}},a.getTypeByExtension=function(a){if(null==a)return createjs.AbstractLoader.TEXT;switch(a.toLowerCase()){case"jpeg":case"jpg":case"gif":case"png":case"webp":case"bmp":return createjs.AbstractLoader.IMAGE;case"ogg":case"mp3":case"webm":return createjs.AbstractLoader.SOUND;case"mp4":case"webm":case"ts":return createjs.AbstractLoader.VIDEO;case"json":return createjs.AbstractLoader.JSON;case"xml":return createjs.AbstractLoader.XML;case"css":return createjs.AbstractLoader.CSS;case"js":return createjs.AbstractLoader.JAVASCRIPT;case"svg":return createjs.AbstractLoader.SVG;default:return createjs.AbstractLoader.TEXT}},createjs.RequestUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.EventDispatcher_constructor(),this.loaded=!1,this.canceled=!1,this.progress=0,this.type=c,this.resultFormatter=null,a?this._item=createjs.LoadItem.create(a):this._item=null,this._preferXHR=b,this._result=null,this._rawResult=null,this._loadedItems=null,this._tagSrcAttribute=null,this._tag=null}var b=createjs.extend(a,createjs.EventDispatcher),c=a;c.POST="POST",c.GET="GET",c.BINARY="binary",c.CSS="css",c.IMAGE="image",c.JAVASCRIPT="javascript",c.JSON="json",c.JSONP="jsonp",c.MANIFEST="manifest",c.SOUND="sound",c.VIDEO="video",c.SPRITESHEET="spritesheet",c.SVG="svg",c.TEXT="text",c.XML="xml",b.getItem=function(){return this._item},b.getResult=function(a){return a?this._rawResult:this._result},b.getTag=function(){return this._tag},b.setTag=function(a){this._tag=a},b.load=function(){this._createRequest(),this._request.on("complete",this,this),this._request.on("progress",this,this),this._request.on("loadStart",this,this),this._request.on("abort",this,this),this._request.on("timeout",this,this),this._request.on("error",this,this);var a=new createjs.Event("initialize");a.loader=this._request,this.dispatchEvent(a),this._request.load()},b.cancel=function(){this.canceled=!0,this.destroy()},b.destroy=function(){this._request&&(this._request.removeAllEventListeners(),this._request.destroy()),this._request=null,this._item=null,this._rawResult=null,this._result=null,this._loadItems=null,this.removeAllEventListeners()},b.getLoadedItems=function(){return this._loadedItems},b._createRequest=function(){this._preferXHR?this._request=new createjs.XHRRequest(this._item):this._request=new createjs.TagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},b._createTag=function(a){return null},b._sendLoadStart=function(){this._isCanceled()||this.dispatchEvent("loadstart")},b._sendProgress=function(a){if(!this._isCanceled()){var b=null;"number"==typeof a?(this.progress=a,b=new createjs.ProgressEvent(this.progress)):(b=a,this.progress=a.loaded/a.total,b.progress=this.progress,(isNaN(this.progress)||this.progress==1/0)&&(this.progress=0)),this.hasEventListener("progress")&&this.dispatchEvent(b)}},b._sendComplete=function(){if(!this._isCanceled()){this.loaded=!0;var a=new createjs.Event("complete");a.rawResult=this._rawResult,null!=this._result&&(a.result=this._result),this.dispatchEvent(a)}},b._sendError=function(a){!this._isCanceled()&&this.hasEventListener("error")&&(null==a&&(a=new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")),this.dispatchEvent(a))},b._isCanceled=function(){return!(null!=window.createjs&&!this.canceled)},b.resultFormatter=null,b.handleEvent=function(a){switch(a.type){case"complete":this._rawResult=a.target._response;var b=this.resultFormatter&&this.resultFormatter(this);b instanceof Function?b.call(this,createjs.proxy(this._resultFormatSuccess,this),createjs.proxy(this._resultFormatFailed,this)):(this._result=b||this._rawResult,this._sendComplete());break;case"progress":this._sendProgress(a);break;case"error":this._sendError(a);break;case"loadstart":this._sendLoadStart();break;case"abort":case"timeout":this._isCanceled()||this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_"+a.type.toUpperCase()+"_ERROR"))}},b._resultFormatSuccess=function(a){this._result=a,this._sendComplete()},b._resultFormatFailed=function(a){this._sendError(a)},b.buildPath=function(a,b){return createjs.RequestUtils.buildPath(a,b)},b.toString=function(){return"[PreloadJS AbstractLoader]"},createjs.AbstractLoader=createjs.promote(a,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractLoader_constructor(a,b,c),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",this.on("initialize",this._updateXHR,this)}var b=createjs.extend(a,createjs.AbstractLoader);b.load=function(){this._tag||(this._tag=this._createTag(this._item.src)),this._tag.preload="auto",this._tag.load(),this.AbstractLoader_load()},b._createTag=function(){},b._createRequest=function(){this._preferXHR?this._request=new createjs.XHRRequest(this._item):this._request=new createjs.MediaTagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},b._updateXHR=function(a){a.loader.setResponseType&&a.loader.setResponseType("blob")},b._formatResult=function(a){if(this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.onstalled=null,this._preferXHR){var b=window.URL||window.webkitURL,c=a.getResult(!0);a.getTag().src=b.createObjectURL(c)}return a.getTag()},createjs.AbstractMediaLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this._item=a},b=createjs.extend(a,createjs.EventDispatcher);b.load=function(){},b.destroy=function(){},b.cancel=function(){},createjs.AbstractRequest=createjs.promote(a,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this),this._addedToDOM=!1,this._startTagVisibility=null}var b=createjs.extend(a,createjs.AbstractRequest);b.load=function(){this._tag.onload=createjs.proxy(this._handleTagComplete,this),this._tag.onreadystatechange=createjs.proxy(this._handleReadyStateChange,this),this._tag.onerror=createjs.proxy(this._handleError,this);var a=new createjs.Event("initialize");a.loader=this._tag,this.dispatchEvent(a),this._hideTag(),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout),this._tag[this._tagSrcAttribute]=this._item.src,null==this._tag.parentNode&&(window.document.body.appendChild(this._tag),this._addedToDOM=!0)},b.destroy=function(){this._clean(),this._tag=null,this.AbstractRequest_destroy()},b._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;"loaded"!=a.readyState&&"complete"!=a.readyState||this._handleTagComplete()},b._handleError=function(){this._clean(),this.dispatchEvent("error")},b._handleTagComplete=function(){this._rawResult=this._tag,this._result=this.resultFormatter&&this.resultFormatter(this)||this._rawResult,this._clean(),this._showTag(),this.dispatchEvent("complete")},b._handleTimeout=function(){this._clean(),this.dispatchEvent(new createjs.Event("timeout"))},b._clean=function(){this._tag.onload=null,this._tag.onreadystatechange=null,this._tag.onerror=null,this._addedToDOM&&null!=this._tag.parentNode&&this._tag.parentNode.removeChild(this._tag),clearTimeout(this._loadTimeout)},b._hideTag=function(){this._startTagVisibility=this._tag.style.visibility,this._tag.style.visibility="hidden"},b._showTag=function(){this._tag.style.visibility=this._startTagVisibility},b._handleStalled=function(){},createjs.TagRequest=createjs.promote(a,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this)}var b=createjs.extend(a,createjs.TagRequest);b.load=function(){var a=createjs.proxy(this._handleStalled,this);this._stalledCallback=a;var b=createjs.proxy(this._handleProgress,this);this._handleProgress=b,this._tag.addEventListener("stalled",a),this._tag.addEventListener("progress",b),this._tag.addEventListener&&this._tag.addEventListener("canplaythrough",this._loadedHandler,!1),this.TagRequest_load()},b._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;"loaded"!=a.readyState&&"complete"!=a.readyState||this._handleTagComplete()},b._handleStalled=function(){},b._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},b._clean=function(){this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.removeEventListener("stalled",this._stalledCallback),this._tag.removeEventListener("progress",this._progressCallback),this.TagRequest__clean()},createjs.MediaTagRequest=createjs.promote(a,"TagRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractRequest_constructor(a),this._request=null,this._loadTimeout=null,this._xhrLevel=1,this._response=null,this._rawResponse=null,this._canceled=!1,this._handleLoadStartProxy=createjs.proxy(this._handleLoadStart,this),this._handleProgressProxy=createjs.proxy(this._handleProgress,this),this._handleAbortProxy=createjs.proxy(this._handleAbort,this),this._handleErrorProxy=createjs.proxy(this._handleError,this),this._handleTimeoutProxy=createjs.proxy(this._handleTimeout,this),this._handleLoadProxy=createjs.proxy(this._handleLoad,this),this._handleReadyStateChangeProxy=createjs.proxy(this._handleReadyStateChange,this),!this._createXHR(a)}var b=createjs.extend(a,createjs.AbstractRequest);a.ACTIVEX_VERSIONS=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],b.getResult=function(a){return a&&this._rawResponse?this._rawResponse:this._response},b.cancel=function(){this.canceled=!0,this._clean(),this._request.abort()},b.load=function(){if(null==this._request)return void this._handleError();null!=this._request.addEventListener?(this._request.addEventListener("loadstart",this._handleLoadStartProxy,!1),this._request.addEventListener("progress",this._handleProgressProxy,!1),this._request.addEventListener("abort",this._handleAbortProxy,!1),this._request.addEventListener("error",this._handleErrorProxy,!1),this._request.addEventListener("timeout",this._handleTimeoutProxy,!1),this._request.addEventListener("load",this._handleLoadProxy,!1),this._request.addEventListener("readystatechange",this._handleReadyStateChangeProxy,!1)):(this._request.onloadstart=this._handleLoadStartProxy,this._request.onprogress=this._handleProgressProxy,this._request.onabort=this._handleAbortProxy,this._request.onerror=this._handleErrorProxy,this._request.ontimeout=this._handleTimeoutProxy,this._request.onload=this._handleLoadProxy,this._request.onreadystatechange=this._handleReadyStateChangeProxy),1==this._xhrLevel&&(this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout));try{this._item.values&&this._item.method!=createjs.AbstractLoader.GET?this._item.method==createjs.AbstractLoader.POST&&this._request.send(createjs.RequestUtils.formatQueryString(this._item.values)):this._request.send()}catch(a){this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND",null,a))}},b.setResponseType=function(a){"blob"===a&&(a=window.URL?"blob":"arraybuffer",this._responseType=a),this._request.responseType=a},b.getAllResponseHeaders=function(){return this._request.getAllResponseHeaders instanceof Function?this._request.getAllResponseHeaders():null},b.getResponseHeader=function(a){return this._request.getResponseHeader instanceof Function?this._request.getResponseHeader(a):null},b._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},b._handleLoadStart=function(a){clearTimeout(this._loadTimeout),this.dispatchEvent("loadstart")},b._handleAbort=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED",null,a))},b._handleError=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent(a.message))},b._handleReadyStateChange=function(a){4==this._request.readyState&&this._handleLoad()},b._handleLoad=function(a){if(!this.loaded){this.loaded=!0;var b=this._checkError();if(b)return void this._handleError(b);if(this._response=this._getResponse(),"arraybuffer"===this._responseType)try{this._response=new Blob([this._response])}catch(a){if(window.BlobBuilder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,"TypeError"===a.name&&window.BlobBuilder){var c=new BlobBuilder;c.append(this._response),this._response=c.getBlob()}}this._clean(),this.dispatchEvent(new createjs.Event("complete"))}},b._handleTimeout=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT",null,a))},b._checkError=function(){var a=parseInt(this._request.status);switch(a){case 404:case 0:return new Error(a)}return null},b._getResponse=function(){if(null!=this._response)return this._response;if(null!=this._request.response)return this._request.response;try{if(null!=this._request.responseText)return this._request.responseText}catch(a){}try{if(null!=this._request.responseXML)return this._request.responseXML}catch(a){}return null},b._createXHR=function(a){var b=createjs.RequestUtils.isCrossDomain(a),c={},d=null;if(window.XMLHttpRequest)d=new XMLHttpRequest,b&&void 0===d.withCredentials&&window.XDomainRequest&&(d=new XDomainRequest);else{for(var e=0,f=s.ACTIVEX_VERSIONS.length;e<f;e++){var g=s.ACTIVEX_VERSIONS[e];try{d=new ActiveXObject(g);break}catch(a){}}if(null==d)return!1}null==a.mimeType&&createjs.RequestUtils.isText(a.type)&&(a.mimeType="text/plain; charset=utf-8"),a.mimeType&&d.overrideMimeType&&d.overrideMimeType(a.mimeType),this._xhrLevel="string"==typeof d.responseType?2:1;var h=null;if(h=a.method==createjs.AbstractLoader.GET?createjs.RequestUtils.buildPath(a.src,a.values):a.src,d.open(a.method||createjs.AbstractLoader.GET,h,!0),b&&d instanceof XMLHttpRequest&&1==this._xhrLevel&&(c.Origin=location.origin),a.values&&a.method==createjs.AbstractLoader.POST&&(c["Content-Type"]="application/x-www-form-urlencoded"),b||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest"),a.headers)for(var i in a.headers)c[i]=a.headers[i];for(i in c)d.setRequestHeader(i,c[i]);return d instanceof XMLHttpRequest&&void 0!==a.withCredentials&&(d.withCredentials=a.withCredentials),this._request=d,!0},b._clean=function(){clearTimeout(this._loadTimeout),null!=this._request.removeEventListener?(this._request.removeEventListener("loadstart",this._handleLoadStartProxy),this._request.removeEventListener("progress",this._handleProgressProxy),this._request.removeEventListener("abort",this._handleAbortProxy),this._request.removeEventListener("error",this._handleErrorProxy),this._request.removeEventListener("timeout",this._handleTimeoutProxy),this._request.removeEventListener("load",this._handleLoadProxy),this._request.removeEventListener("readystatechange",this._handleReadyStateChangeProxy)):(this._request.onloadstart=null,this._request.onprogress=null,this._request.onabort=null,this._request.onerror=null,this._request.ontimeout=null,this._request.onload=null,this._request.onreadystatechange=null)},b.toString=function(){return"[PreloadJS XHRRequest]"},createjs.XHRRequest=createjs.promote(a,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractLoader_constructor(),this._plugins=[],this._typeCallbacks={},this._extensionCallbacks={},this.next=null,this.maintainScriptOrder=!0,this.stopOnError=!1,this._maxConnections=1,this._availableLoaders=[createjs.ImageLoader,createjs.JavaScriptLoader,createjs.CSSLoader,createjs.JSONLoader,createjs.JSONPLoader,createjs.SoundLoader,createjs.ManifestLoader,createjs.SpriteSheetLoader,createjs.XMLLoader,createjs.SVGLoader,createjs.BinaryLoader,createjs.VideoLoader,createjs.TextLoader],this._defaultLoaderLength=this._availableLoaders.length,this.init(a,b,c)}var b=createjs.extend(a,createjs.AbstractLoader),c=a;b.init=function(a,b,c){this.useXHR=!0,this.preferXHR=!0,this._preferXHR=!0,this.setPreferXHR(a),this._paused=!1,this._basePath=b,this._crossOrigin=c,this._loadStartWasDispatched=!1,this._currentlyLoadingScript=null,this._currentLoads=[],this._loadQueue=[],this._loadQueueBackup=[],this._loadItemsById={},this._loadItemsBySrc={},this._loadedResults={},this._loadedRawResults={},this._numItems=0,this._numItemsLoaded=0,this._scriptOrder=[],this._loadedScripts=[],this._lastProgress=NaN},c.loadTimeout=8e3,c.LOAD_TIMEOUT=0,c.BINARY=createjs.AbstractLoader.BINARY,c.CSS=createjs.AbstractLoader.CSS,c.IMAGE=createjs.AbstractLoader.IMAGE,c.JAVASCRIPT=createjs.AbstractLoader.JAVASCRIPT,c.JSON=createjs.AbstractLoader.JSON,c.JSONP=createjs.AbstractLoader.JSONP,c.MANIFEST=createjs.AbstractLoader.MANIFEST,c.SOUND=createjs.AbstractLoader.SOUND,c.VIDEO=createjs.AbstractLoader.VIDEO,c.SVG=createjs.AbstractLoader.SVG,c.TEXT=createjs.AbstractLoader.TEXT,c.XML=createjs.AbstractLoader.XML,c.POST=createjs.AbstractLoader.POST,c.GET=createjs.AbstractLoader.GET,b.registerLoader=function(a){if(!a||!a.canLoadItem)throw new Error("loader is of an incorrect type.");if(this._availableLoaders.indexOf(a)!=-1)throw new Error("loader already exists.");this._availableLoaders.unshift(a)},b.unregisterLoader=function(a){var b=this._availableLoaders.indexOf(a);b!=-1&&b<this._defaultLoaderLength-1&&this._availableLoaders.splice(b,1)},b.setUseXHR=function(a){return this.setPreferXHR(a)},b.setPreferXHR=function(a){return this.preferXHR=0!=a&&null!=window.XMLHttpRequest,this.preferXHR},b.removeAll=function(){this.remove()},b.remove=function(a){var b=null;if(a&&!Array.isArray(a))b=[a];else if(a)b=a;else if(arguments.length>0)return;var c=!1;if(b){for(;b.length;){var e=b.pop(),f=this.getResult(e);for(g=this._loadQueue.length-1;g>=0;g--)if(h=this._loadQueue[g].getItem(),h.id==e||h.src==e){this._loadQueue.splice(g,1)[0].cancel();break}for(g=this._loadQueueBackup.length-1;g>=0;g--)if(h=this._loadQueueBackup[g].getItem(),h.id==e||h.src==e){this._loadQueueBackup.splice(g,1)[0].cancel();break}if(f)this._disposeItem(this.getItem(e));else for(var g=this._currentLoads.length-1;g>=0;g--){var h=this._currentLoads[g].getItem();if(h.id==e||h.src==e){this._currentLoads.splice(g,1)[0].cancel(),c=!0;break}}}c&&this._loadNext()}else{this.close();for(var d in this._loadItemsById)this._disposeItem(this._loadItemsById[d]);this.init(this.preferXHR,this._basePath)}},b.reset=function(){this.close();for(var a in this._loadItemsById)this._disposeItem(this._loadItemsById[a]);for(var b=[],c=0,d=this._loadQueueBackup.length;c<d;c++)b.push(this._loadQueueBackup[c].getItem());this.loadManifest(b,!1)},b.installPlugin=function(a){if(null!=a&&null!=a.getPreloadHandlers){this._plugins.push(a);var b=a.getPreloadHandlers();if(b.scope=a,null!=b.types)for(var c=0,d=b.types.length;c<d;c++)this._typeCallbacks[b.types[c]]=b;if(null!=b.extensions)for(c=0,d=b.extensions.length;c<d;c++)this._extensionCallbacks[b.extensions[c]]=b}},b.setMaxConnections=function(a){this._maxConnections=a,!this._paused&&this._loadQueue.length>0&&this._loadNext()},b.loadFile=function(a,b,c){if(null==a){var d=new createjs.ErrorEvent("PRELOAD_NO_FILE");return void this._sendError(d)}this._addItem(a,null,c),b!==!1?this.setPaused(!1):this.setPaused(!0)},b.loadManifest=function(a,b,d){var e=null,f=null;if(Array.isArray(a)){if(0==a.length){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_EMPTY");return void this._sendError(g)}e=a}else if("string"==typeof a)e=[{src:a,type:c.MANIFEST}];else{if("object"!=typeof a){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_NULL");return void this._sendError(g)}if(void 0!==a.src){if(null==a.type)a.type=c.MANIFEST;else if(a.type!=c.MANIFEST){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_TYPE");this._sendError(g)}e=[a]}else void 0!==a.manifest&&(e=a.manifest,f=a.path)}for(var h=0,i=e.length;h<i;h++)this._addItem(e[h],f,d);b!==!1?this.setPaused(!1):this.setPaused(!0)},b.load=function(){this.setPaused(!1)},b.getItem=function(a){return this._loadItemsById[a]||this._loadItemsBySrc[a]},b.getResult=function(a,b){var c=this._loadItemsById[a]||this._loadItemsBySrc[a];if(null==c)return null;var d=c.id;return b&&this._loadedRawResults[d]?this._loadedRawResults[d]:this._loadedResults[d]},b.getItems=function(a){var b=[];for(var c in this._loadItemsById){var d=this._loadItemsById[c],e=this.getResult(c);a===!0&&null==e||b.push({item:d,result:e,rawResult:this.getResult(c,!0)})}return b},b.setPaused=function(a){this._paused=a,this._paused||this._loadNext()},b.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();this._scriptOrder.length=0,this._loadedScripts.length=0,this.loadStartWasDispatched=!1,this._itemCount=0,this._lastProgress=NaN},b._addItem=function(a,b,c){var d=this._createLoadItem(a,b,c);if(null!=d){var e=this._createLoader(d);null!=e&&("plugins"in e&&(e.plugins=this._plugins),d._loader=e,this._loadQueue.push(e),this._loadQueueBackup.push(e),this._numItems++,this._updateProgress(),(this.maintainScriptOrder&&d.type==createjs.LoadQueue.JAVASCRIPT||d.maintainOrder===!0)&&(this._scriptOrder.push(d),this._loadedScripts.push(null)))}},b._createLoadItem=function(a,b,c){var d=createjs.LoadItem.create(a);if(null==d)return null;var e="",f=c||this._basePath;if(d.src instanceof Object){if(!d.type)return null;if(b){e=b;var g=createjs.RequestUtils.parseURI(b);null==f||g.absolute||g.relative||(e=f+e)}else null!=f&&(e=f)}else{var h=createjs.RequestUtils.parseURI(d.src);h.extension&&(d.ext=h.extension),null==d.type&&(d.type=createjs.RequestUtils.getTypeByExtension(d.ext));var i=d.src;if(!h.absolute&&!h.relative)if(b){e=b;var g=createjs.RequestUtils.parseURI(b);i=b+i,null==f||g.absolute||g.relative||(e=f+e)}else null!=f&&(e=f);d.src=e+d.src}d.path=e,void 0!==d.id&&null!==d.id&&""!==d.id||(d.id=i);var j=this._typeCallbacks[d.type]||this._extensionCallbacks[d.ext];if(j){var k=j.callback.call(j.scope,d,this);if(k===!1)return null;k===!0||null!=k&&(d._loader=k),h=createjs.RequestUtils.parseURI(d.src),null!=h.extension&&(d.ext=h.extension)}return this._loadItemsById[d.id]=d,this._loadItemsBySrc[d.src]=d,null==d.crossOrigin&&(d.crossOrigin=this._crossOrigin),d},b._createLoader=function(a){if(null!=a._loader)return a._loader;for(var b=this.preferXHR,c=0;c<this._availableLoaders.length;c++){var d=this._availableLoaders[c];if(d&&d.canLoadItem(a))return new d(a,b)}return null},b._loadNext=function(){if(!this._paused){this._loadStartWasDispatched||(this._sendLoadStart(),this._loadStartWasDispatched=!0),this._numItems==this._numItemsLoaded?(this.loaded=!0,this._sendComplete(),this.next&&this.next.load&&this.next.load()):this.loaded=!1;for(var a=0;a<this._loadQueue.length&&!(this._currentLoads.length>=this._maxConnections);a++){var b=this._loadQueue[a];this._canStartLoad(b)&&(this._loadQueue.splice(a,1),a--,this._loadItem(b))}}},b._loadItem=function(a){a.on("fileload",this._handleFileLoad,this),a.on("progress",this._handleProgress,this),a.on("complete",this._handleFileComplete,this),a.on("error",this._handleError,this),a.on("fileerror",this._handleFileError,this),this._currentLoads.push(a),this._sendFileStart(a.getItem()),a.load()},b._handleFileLoad=function(a){a.target=null,this.dispatchEvent(a)},b._handleFileError=function(a){var b=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,a.item);this._sendError(b)},b._handleError=function(a){var b=a.target;this._numItemsLoaded++,this._finishOrderedItem(b,!0),this._updateProgress();var c=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,b.getItem());this._sendError(c),this.stopOnError?this.setPaused(!0):(this._removeLoadItem(b),this._cleanLoadItem(b),this._loadNext())},b._handleFileComplete=function(a){var b=a.target,c=b.getItem(),d=b.getResult();this._loadedResults[c.id]=d;var e=b.getResult(!0);null!=e&&e!==d&&(this._loadedRawResults[c.id]=e),this._saveLoadedItems(b),this._removeLoadItem(b),this._finishOrderedItem(b)||this._processFinishedLoad(c,b),this._cleanLoadItem(b)},b._saveLoadedItems=function(a){var b=a.getLoadedItems();if(null!==b)for(var c=0;c<b.length;c++){var d=b[c].item;this._loadItemsBySrc[d.src]=d,this._loadItemsById[d.id]=d,this._loadedResults[d.id]=b[c].result,this._loadedRawResults[d.id]=b[c].rawResult}},b._finishOrderedItem=function(a,b){var c=a.getItem();if(this.maintainScriptOrder&&c.type==createjs.LoadQueue.JAVASCRIPT||c.maintainOrder){a instanceof createjs.JavaScriptLoader&&(this._currentlyLoadingScript=!1);var d=createjs.indexOf(this._scriptOrder,c);return d!=-1&&(this._loadedScripts[d]=b===!0||c,this._checkScriptLoadOrder(),!0)}return!1},b._checkScriptLoadOrder=function(){for(var a=this._loadedScripts.length,b=0;b<a;b++){var c=this._loadedScripts[b];if(null===c)break;if(c!==!0){var d=this._loadedResults[c.id];c.type==createjs.LoadQueue.JAVASCRIPT&&createjs.DomUtils.appendToHead(d);var e=c._loader;this._processFinishedLoad(c,e),this._loadedScripts[b]=!0}}},b._processFinishedLoad=function(a,b){if(this._numItemsLoaded++,!this.maintainScriptOrder&&a.type==createjs.LoadQueue.JAVASCRIPT){var c=b.getTag();createjs.DomUtils.appendToHead(c)}this._updateProgress(),this._sendFileComplete(a,b),this._loadNext()},b._canStartLoad=function(a){if(!this.maintainScriptOrder||a.preferXHR)return!0;var b=a.getItem();if(b.type!=createjs.LoadQueue.JAVASCRIPT)return!0;if(this._currentlyLoadingScript)return!1;for(var c=this._scriptOrder.indexOf(b),d=0;d<c;){var e=this._loadedScripts[d];if(null==e)return!1;d++}return this._currentlyLoadingScript=!0,!0},b._removeLoadItem=function(a){for(var b=this._currentLoads.length,c=0;c<b;c++)if(this._currentLoads[c]==a){this._currentLoads.splice(c,1);break}},b._cleanLoadItem=function(a){var b=a.getItem();b&&delete b._loader},b._handleProgress=function(a){var b=a.target;this._sendFileProgress(b.getItem(),b.progress),this._updateProgress()},b._updateProgress=function(){var a=this._numItemsLoaded/this._numItems,b=this._numItems-this._numItemsLoaded;if(b>0){for(var c=0,d=0,e=this._currentLoads.length;d<e;d++)c+=this._currentLoads[d].progress;a+=c/b*(b/this._numItems)}this._lastProgress!=a&&(this._sendProgress(a),this._lastProgress=a)},b._disposeItem=function(a){delete this._loadedResults[a.id],delete this._loadedRawResults[a.id],delete this._loadItemsById[a.id],delete this._loadItemsBySrc[a.src]},b._sendFileProgress=function(a,b){if(!this._isCanceled()&&!this._paused&&this.hasEventListener("fileprogress")){var c=new createjs.Event("fileprogress");c.progress=b,c.loaded=b,c.total=1,c.item=a,this.dispatchEvent(c)}},b._sendFileComplete=function(a,b){if(!this._isCanceled()&&!this._paused){var c=new createjs.Event("fileload");c.loader=b,c.item=a,c.result=this._loadedResults[a.id],c.rawResult=this._loadedRawResults[a.id],a.completeHandler&&a.completeHandler(c),this.hasEventListener("fileload")&&this.dispatchEvent(c)}},b._sendFileStart=function(a){var b=new createjs.Event("filestart");b.item=a,this.hasEventListener("filestart")&&this.dispatchEvent(b)},b.toString=function(){return"[PreloadJS LoadQueue]"},createjs.LoadQueue=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.TEXT)}var c=(createjs.extend(a,createjs.AbstractLoader),a);c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.TEXT},createjs.TextLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.BINARY),this.on("initialize",this._updateXHR,this)}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.BINARY},b._updateXHR=function(a){a.loader.setResponseType("arraybuffer")},createjs.BinaryLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.CSS),this.resultFormatter=this._formatResult,this._tagSrcAttribute="href",b?this._tag=document.createElement("style"):this._tag=document.createElement("link"),this._tag.rel="stylesheet",this._tag.type="text/css"}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.CSS},b._formatResult=function(a){if(this._preferXHR){var b=a.getTag();if(b.styleSheet)b.styleSheet.cssText=a.getResult(!0);else{var c=document.createTextNode(a.getResult(!0));b.appendChild(c)}}else b=this._tag;return createjs.DomUtils.appendToHead(b),b},createjs.CSSLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.IMAGE),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",createjs.RequestUtils.isImageTag(a)?this._tag=a:createjs.RequestUtils.isImageTag(a.src)?this._tag=a.src:createjs.RequestUtils.isImageTag(a.tag)&&(this._tag=a.tag),null!=this._tag?this._preferXHR=!1:this._tag=document.createElement("img"),this.on("initialize",this._updateXHR,this)}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.IMAGE},b.load=function(){if(""!=this._tag.src&&this._tag.complete)return void this._sendComplete();var a=this._item.crossOrigin;1==a&&(a="Anonymous"),null==a||createjs.RequestUtils.isLocal(this._item.src)||(this._tag.crossOrigin=a),this.AbstractLoader_load()},b._updateXHR=function(a){a.loader.mimeType="text/plain; charset=x-user-defined-binary",a.loader.setResponseType&&a.loader.setResponseType("blob")},b._formatResult=function(a){return this._formatImage},b._formatImage=function(a,b){var c=this._tag,d=window.URL||window.webkitURL;if(this._preferXHR)if(d){var e=d.createObjectURL(this.getResult(!0));c.src=e,c.addEventListener("load",this._cleanUpURL,!1),c.addEventListener("error",this._cleanUpURL,!1)}else c.src=this._item.src;else;c.complete?a(c):(c.onload=createjs.proxy(function(){a(this._tag)},this),c.onerror=createjs.proxy(function(){b(_this._tag)},this))},b._cleanUpURL=function(a){},createjs.ImageLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.JAVASCRIPT),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",this.setTag(document.createElement("script"))}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JAVASCRIPT},b._formatResult=function(a){var b=a.getTag();return this._preferXHR&&(b.text=a.getResult(!0)),b},createjs.JavaScriptLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.JSON),this.resultFormatter=this._formatResult}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSON},b._formatResult=function(a){var b=null;try{b=createjs.DataUtils.parseJSON(a.getResult(!0))}catch(a){var c=new createjs.ErrorEvent("JSON_FORMAT",null,a);return this._sendError(c),a}return b},createjs.JSONLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!1,createjs.AbstractLoader.JSONP),this.setTag(document.createElement("script")),this.getTag().type="text/javascript"}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSONP},b.cancel=function(){this.AbstractLoader_cancel(),this._dispose()},b.load=function(){if(null==this._item.callback)throw new Error("callback is required for loading JSONP requests.");if(null!=window[this._item.callback])throw new Error("JSONP callback '"+this._item.callback+"' already exists on window. You need to specify a different callback or re-name the current one.");window[this._item.callback]=createjs.proxy(this._handleLoad,this),window.document.body.appendChild(this._tag),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout),this._tag.src=this._item.src},b._handleLoad=function(a){this._result=this._rawResult=a,this._sendComplete(),this._dispose()},b._handleTimeout=function(){this._dispose(),this.dispatchEvent(new createjs.ErrorEvent("timeout"))},b._dispose=function(){window.document.body.removeChild(this._tag),delete window[this._item.callback],clearTimeout(this._loadTimeout)},createjs.JSONPLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,null,createjs.AbstractLoader.MANIFEST),this.plugins=null,this._manifestQueue=null}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.MANIFEST_PROGRESS=.25,c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.MANIFEST},b.load=function(){this.AbstractLoader_load()},b._createRequest=function(){var a=this._item.callback;null!=a?this._request=new createjs.JSONPLoader(this._item):this._request=new createjs.JSONLoader(this._item)},b.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(c.MANIFEST_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=c.MANIFEST_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||this.progress==1/0)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},b.destroy=function(){this.AbstractLoader_destroy(),this._manifestQueue.close()},b._loadManifest=function(a){if(a&&a.manifest){var b=this._manifestQueue=new createjs.LoadQueue;b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("complete",this._handleManifestComplete,this,!0),b.on("error",this._handleManifestError,this,!0);for(var c=0,d=this.plugins.length;c<d;c++)b.installPlugin(this.plugins[c]);b.loadManifest(a)}else this._sendComplete()},b._handleManifestFileLoad=function(a){a.target=null,this.dispatchEvent(a)},b._handleManifestComplete=function(a){this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},b._handleManifestProgress=function(a){this.progress=a.progress*(1-c.MANIFEST_PROGRESS)+c.MANIFEST_PROGRESS,this._sendProgress(this.progress)},b._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.ManifestLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.SOUND),createjs.RequestUtils.isAudioTag(a)?this._tag=a:createjs.RequestUtils.isAudioTag(a.src)?this._tag=a:createjs.RequestUtils.isAudioTag(a.tag)&&(this._tag=createjs.RequestUtils.isAudioTag(a)?a:a.src),null!=this._tag&&(this._preferXHR=!1)}var b=createjs.extend(a,createjs.AbstractMediaLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SOUND},b._createTag=function(a){var b=document.createElement("audio");return b.autoplay=!1,b.preload="none",b.src=a,b},createjs.SoundLoader=createjs.promote(a,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.VIDEO),createjs.RequestUtils.isVideoTag(a)||createjs.RequestUtils.isVideoTag(a.src)?(this.setTag(createjs.RequestUtils.isVideoTag(a)?a:a.src),this._preferXHR=!1):this.setTag(this._createTag())}var b=createjs.extend(a,createjs.AbstractMediaLoader),c=a;b._createTag=function(){return document.createElement("video")},c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.VIDEO},createjs.VideoLoader=createjs.promote(a,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.SPRITESHEET),this._manifestQueue=null}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.SPRITESHEET_PROGRESS=.25,c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SPRITESHEET},b.destroy=function(){this.AbstractLoader_destroy,this._manifestQueue.close()},b._createRequest=function(){var a=this._item.callback;null!=a?this._request=new createjs.JSONPLoader(this._item):this._request=new createjs.JSONLoader(this._item)},b.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(c.SPRITESHEET_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=c.SPRITESHEET_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||this.progress==1/0)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},b._loadManifest=function(a){if(a&&a.images){var b=this._manifestQueue=new createjs.LoadQueue(this._preferXHR,this._item.path,this._item.crossOrigin);b.on("complete",this._handleManifestComplete,this,!0),b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("error",this._handleManifestError,this,!0),b.loadManifest(a.images)}},b._handleManifestFileLoad=function(a){var b=a.result;if(null!=b){var c=this.getResult().images,d=c.indexOf(a.item.src);c[d]=b}},b._handleManifestComplete=function(a){this._result=new createjs.SpriteSheet(this._result),this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},b._handleManifestProgress=function(a){this.progress=a.progress*(1-c.SPRITESHEET_PROGRESS)+c.SPRITESHEET_PROGRESS,this._sendProgress(this.progress)},b._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.SpriteSheetLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.SVG),this.resultFormatter=this._formatResult,this._tagSrcAttribute="data",b?this.setTag(document.createElement("svg")):(this.setTag(document.createElement("object")),this.getTag().type="image/svg+xml")}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SVG},b._formatResult=function(a){var b=createjs.DataUtils.parseXML(a.getResult(!0),"text/xml"),c=a.getTag();return!this._preferXHR&&document.body.contains(c)&&document.body.removeChild(c),null!=b.documentElement?(c.appendChild(b.documentElement),c.style.visibility="visible",c):b},createjs.SVGLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.XML),this.resultFormatter=this._formatResult}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.XML},b._formatResult=function(a){return createjs.DataUtils.parseXML(a.getResult(!0),"text/xml")},createjs.XMLLoader=createjs.promote(a,"AbstractLoader")}();;
createjs.EventDispatcher.prototype.___on = createjs.EventDispatcher.prototype.on;
createjs.EventDispatcher.prototype.on = function() {
  if (arguments.length === 2) {
    return this.addEventListener.apply(this, arguments);
  } else {
    return this.___on.apply(this, arguments);
  }
};
/**
@class NumberUtils
@static
@submodule caim.utils
 */
var NumberUtils;
NumberUtils = (function() {
  function NumberUtils() {}
  /**
  	Checks whether the number is an odd number.
  	@method isOdd
  	@static
  	@param {Number} p_value The number to check.
  	@return {Boolean} The resulting boolean object.
   */
  NumberUtils.isOdd = function(p_value) {
    if (Math.abs(p_value % 2) === 1) {
      return true;
    } else {
      return false;
    }
  };
  /**
  	Checks whether the number is an even number.
  	@method isEven
  	@static
  	@param {Number} p_value The number to check.
  	@return {Boolean} The resulting boolean object.
   */
  NumberUtils.isEven = function(p_value) {
    if (p_value % 2 === 0) {
      return true;
    } else {
      return false;
    }
  };
  /**
  	Checks whether the number is zero.
  	@method isZero
  	@static
  	@param {Number} p_value The number to check.
  	@return {Boolean} The resulting boolean object.
   */
  NumberUtils.isZero = function(p_value) {
    return Math.abs(p_value) < 0.00001;
  };
  /**
  	Returns the value in percent of a {Number}.
  	@method toPercent
  	@static
  	@param {Number} p_value The number to check.
  	@param {Number} p_min The number of lower limit.
  	@param {Number} p_max The number of higher limit.
  	@return {Number} The resulting number object.
   */
  NumberUtils.toPercent = function(p_value, p_min, p_max) {
    return ((p_value - p_min) / (p_max - p_min)) * 100;
  };
  /**
  	Returns the value in Number of a {percent}.
  	@method percentToValue
  	@static
  	@param {Number} p_percent The number in percent to check.
  	@param {Number} p_min The number of lower limit.
  	@param {Number} p_max The number of higher limit.
  	@return {Number} The resulting number object.
   */
  NumberUtils.percentToValue = function(p_percent, p_min, p_max) {
    return ((p_max - p_min) * p_percent) + p_min;
  };
  /**
  	Returns bytes to formatted MB's string.
  	@method getBytesAsMegabytes
  	@static
  	@param {Number} p_bytes
  	@return {String} Results in MB's
   */
  NumberUtils.getBytesAsMegabytes = function(p_bytes) {
    return (Math.floor((p_bytes / 1024 / 1024) * 100) / 100) + " MB";
  };
  /**
  	Returns bytes to formatted byte, KB's, MB's or GB's string.
  	@method bytesTo
  	@static
  	@param {Number} p_bytes
  	@return {String} Results in byte, KB's, MB's or GB's
   */
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
  /**
  	Generates a random number between two numbers.
  	@method rangeRandom
  	@static
  	@param {Number} p_low The number of lower limit of range.
  	@param {Number} p_high The number of higher limit of range.
  	@param {Boolean} [p_rounded=false] The boolean that defines if the random number will be rounded or not.
  	@return {Number}
   */
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
  return NumberUtils;
})();
/**
@class ArrayUtils
@submodule caim.utils
@static
 */
var ArrayUtils;
ArrayUtils = (function() {
  function ArrayUtils() {}
  /**
  	Removes an item from an array.
  	@method removeItem
  	@static
  	@param {Array} p_array The array that contains the item that should be removed.
  	@param {Object} p_item The item to be removed from the array.
  	@param {Boolean} [p_clone=false] Apply and return changes to a cloned array.
  	@return {Array} An array with the removed items.
   */
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
  /**
  	Removes an item by index from an array.
  	@method removeItemByIndex
  	@param {Number} p_index The index to be removed from the array.
  	@param {Array} p_array The array that contains the item that should be removed.
  	@param {Boolean} [p_clone=false] Apply and return changes to a cloned array.
  	@return {Array} An array with the removed item.
  	@static
   */
  ArrayUtils.removeItemByIndex = function(p_index, p_array, p_clone) {
    var result;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    result.splice(p_index, 1);
    return result;
  };
  /**
  	Removes all strings duplicated from an array.
  	@method removeDuplicateStrings
  	@param {Array} p_array The array where the duplicates string should be removed.
  	@return {Array} An array with the removed item.
  	@static
   */
  ArrayUtils.removeDuplicateStrings = function(p_array) {
    return p_array.filter(function(el, pos, self) {
      return self.indexOf(el) === pos;
    });
  };
  /**
  	Finds element in array and returns boolean value
  	@method hasItem
  	@param {Object} p_value
  	@param {Array} p_array The array to be used as reference.
  	@return {Boolean} The resulting boolean.
  	@static
   */
  ArrayUtils.hasItem = function(p_value, p_array) {
    return p_array.indexOf(p_value) > -1;
  };
  /**
  	Returns a new merged array.
  	@method merge
  	@static
  	@param {Array} p_arrayA The array to be used as reference A.
  	@param {Array} p_arrayB The array to be used as reference B.
  	@return {Array} Returns a new merged array.
   */
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
  /**
  	Returns a random index inside the range of the array.
  	@method randomIndex
  	@static
  	@param {Array} p_array The array to be used as reference.
  	@return {Number} A random number valid index.
   */
  ArrayUtils.randomIndex = function(p_array) {
    return NumberUtils.rangeRandom(0, p_array.length - 1, true);
  };
  /**
  	Returns a random item within an array.
  	@method randomItem
  	@param {Array} p_array The array to be used as reference.
  	@return {Object} The resulting object.
  	@static
   */
  ArrayUtils.randomItem = function(p_array) {
    return p_array[ArrayUtils.randomIndex(p_array)];
  };
  /**
  	Shuffles the order of the items in an array.
  	@method shuffle
  	@static
  	@param {Array} p_array The array to shuffled.
  	@param {Boolean} [p_clone=false] Apply and return changes to a cloned array.
  	@return {Array} The resulting object.
   */
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
  /**
  	Move some item to another position in an array.
  	@method move
  	@static
  	@param {Array} p_array The array to Array.
  	@param {Number} p_oldIndex The number to old index.
  	@param {Number} p_newIndex The number to new index.
  	@param {Boolean} [p_clone=false] Apply and return changes to a cloned array.
  	@return {Array} The resulting object.
   */
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
  /**
  	Shuffles the order of the items from middle to end
  	@method fromMiddleToEnd
  	@static
  	@param {Array} p_array The array to shuffled.
  	@return {Array} The resulting object.
   */
  ArrayUtils.fromMiddleToEnd = function(p_array) {
    var first, last, len, merged, midLen;
    len = p_array.length;
    midLen = Math.floor(len * 0.5);
    first = p_array.slice(midLen, len);
    last = p_array.slice(0, midLen).reverse();
    merged = this.merge(first, last);
    return merged;
  };
  /**
  	Shuffles the order of the items from end to middle
  	@method fromEndToMiddle
  	@static
  	@param {Array} p_array The array to shuffled.
  	@return {Array} The resulting object.
   */
  ArrayUtils.fromEndToMiddle = function(p_array) {
    return this.fromMiddleToEnd(p_array).reverse();
  };
  /**
  	@method lastIndexOf
  	@static
  	@param {Array} p_array
  	@param {Object} p_value
  	@return {Number} The resulting index.
   */
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
/**
@class StringUtils
@static
@submodule caim.utils
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
  StringUtils.toCamelCase = function(p_string, p_cssType) {
    var re;
    if (p_cssType == null) {
      p_cssType = false;
    }
    re = p_string.replace(/([\+\-_ ][a-z])/g, function($1) {
      return $1.toUpperCase().replace(/[\+\-_ ]/, "");
    });
    if (p_cssType) {
      return re;
    } else {
      return re.charAt(0).toUpperCase() + re.slice(1);
    }
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
  	A method to convert milisecounds (Number) to a String on time format.
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
  	A method to convert a String time format to secounds (Number).
  	@method fromTimeFormat
  	@static
  	@param {String} p_timeformat - The String time format
  	@return {Number}
   */
  StringUtils.fromTimeFormat = function(p_timeformat) {
    var a, result;
    a = p_timeformat.split(':');
    if (a.length > 2) {
      result = Number((a[0] * 3600) + Number(a[1]) * 60 + Number(a[2]));
    } else {
      result = Number(a[0]) * 60 + Number(a[1]);
    }
    return result;
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
      cache = cv ? "?v=" + app.info.project.version + "&noCache=" + ts : "?v=" + app.info.project.version;
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
      tag.preload = 'auto';
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
      callback: s.handlers,
      types: ['sound', 'video'],
      extensions: ['mp3', 'mp4']
    };
  };
  s.handlers = function(p_loadItem, p_queue) {
    var cache, cv, loader, parentView, ts, view, views, _ref;
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
      cache = cv ? "?v=" + app.info.project.version + "&noCache=" + ts : "?v=" + app.info.project.version;
      p_loadItem.src += cache;
    }
    loader = new createjs.MediaLoader(p_loadItem, false);
    return loader;
  };
  createjs.MediaPlugin = MediaPlugin;
})();
var PathsData;
PathsData = (function(_super) {
  var _data;
  __extends(PathsData, _super);
  _data = null;
  PathsData.getInstance = function(p_value) {
    return PathsData._instance != null ? PathsData._instance : PathsData._instance = new PathsData(p_value);
  };
  function PathsData(p_value) {
    this._parseVars = __bind(this._parseVars, this);
    this._parseData = __bind(this._parseData, this);
    this.translate = __bind(this.translate, this);
    if (this.data == null) {
      this.data = p_value;
    }
    PathsData.__super__.constructor.apply(this, arguments);
  }
  PathsData.get({
    data: function() {
      return _data;
    }
  });
  PathsData.set({
    data: function(p_value) {
      return _data = this._parseData(p_value);
    }
  });
  /**
  	@method translate
  	@param {Object} p_source
  	@return {String}
   */
  PathsData.prototype.translate = function(p_source) {
    return this._parseVars(p_source);
  };
  /**
  	@static
  	@method translate
  	@param {Object} p_value
  	@param {Object} p_collection
  	@return {String}
   */
  PathsData.translate = function(p_value, p_collection) {
    return PathsData._parseVars(p_value, PathsData._parseData(p_collection));
  };
  /**
  	@method _parseData
  	@param {Object} p_vars
  	@return {Object}
  	@private
   */
  PathsData.prototype._parseData = function(p_vars) {
    var k, o, p_varsStr, v, val, _ref;
    if (window.paths != null) {
      _ref = window.paths;
      for (k in _ref) {
        v = _ref[k];
        p_vars[k] = v;
      }
    }
    p_varsStr = JSON.stringify(p_vars);
    while ((o = /\{([^\"\{\}]+)\}/.exec(p_varsStr))) {
      val = p_vars[o[1]];
      if (!val) {
        val = '';
      }
      p_varsStr = p_varsStr.replace(new RegExp('\{' + o[1] + '\}', 'ig'), val);
      p_vars = JSON.parse(p_varsStr);
    }
    return p_vars;
  };
  /**
  	@method _parseVars
  	@param {Object} p_data
  	@param {Object} p_vars
  	@return {String}
  	@private
   */
  PathsData.prototype._parseVars = function(p_vars) {
    var k, v;
    for (k in _data) {
      v = _data[k];
      p_vars = JSON.stringify(p_vars);
      p_vars = p_vars.replace(new RegExp('\{' + k + '\}', 'ig'), v);
      p_vars = JSON.parse(p_vars);
    }
    return p_vars;
  };
  return PathsData;
})(EventDispatcher);
/**
@class AssetLoader
@extends EventDispatcher
@submodule caim.loader
 */
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
  AssetLoader.prototype._groups = null;
  AssetLoader.getInstance = function() {
    return AssetLoader._instance != null ? AssetLoader._instance : AssetLoader._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(AssetLoader, arguments, function(){});
  };
  /**
  	@class AssetLoader
  	@constructor
  	@extends EventDispatcher
   */
  function AssetLoader() {
    this._fileLoad = __bind(this._fileLoad, this);
    this._onFileError = __bind(this._onFileError, this);
    this._onError = __bind(this._onError, this);
    this._onStartFile = __bind(this._onStartFile, this);
    this._groups = {};
  }
  AssetLoader.prototype.loadGroup = function(p_groupId, p_files) {
    var group;
    group = this.getGroup(p_groupId);
    group.loadManifest(p_files);
    return group;
  };
  AssetLoader.prototype.getAllGroups = function() {
    return this._groups;
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
      group.installPlugin(createjs.CacheControllerPlugin);
      group.installPlugin(createjs.MediaPlugin);
      group.id = p_groupId;
      this._groups[p_groupId] = group;
      group.on(AssetLoader.ERROR, this._onError);
      group.on(AssetLoader.START_FILE, this._onStartFile);
      group.on(AssetLoader.FILE_ERROR, this._onFileError);
      group.on(AssetLoader.COMPLETE_FILE, this._fileLoad);
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
  AssetLoader.prototype._onStartFile = function(evt) {
    return evt.item.loaded = false;
  };
  AssetLoader.prototype._onError = function(e) {
    var msg, _ref;
    e.currentTarget.off(AssetLoader.START_FILE, this._onStartFile);
    e.currentTarget.off(AssetLoader.ERROR, this._onError);
    e.currentTarget.off(AssetLoader.COMPLETE_FILE, this._fileLoad);
    msg = e.title;
    if ((e != null ? (_ref = e.data) != null ? _ref.src : void 0 : void 0) != null) {
      e.fileName = e.data.src;
      msg += " " + e.data.src;
    }
    throw new Error(msg).stack;
    return false;
  };
  AssetLoader.prototype._onFileError = function(e) {
    e.currentTarget.off(AssetLoader.START_FILE, this._onStartFile);
    e.currentTarget.off(AssetLoader.FILE_ERROR, this._onFileError);
    e.currentTarget.off(AssetLoader.COMPLETE_FILE, this._fileLoad);
    console.log(e);
    throw new Error(e.title).stack;
    return false;
  };
  AssetLoader.prototype._fileLoad = function(evt) {
    var data, e, head, paths, result, si, style, _ref;
    evt.item.loaded = true;
    evt.currentTarget.off(AssetLoader.ERROR, this._onError);
    evt.currentTarget.off(AssetLoader.FILE_ERROR, this._onFileError);
    evt.item.result = evt.item.tag = evt.result;
    if ((typeof app !== "undefined" && app !== null ? (_ref = app.config) != null ? _ref.paths : void 0 : void 0) != null) {
      paths = PathsData.getInstance(app.config.paths);
      switch (evt.item.ext) {
        case 'json':
          data = paths.translate(evt.result);
          if (typeof data !== 'string') {
            data = JSON.stringify(data);
          }
          JSONUtils.removeComments(data);
          result = data;
          result = evt.item.result = evt.item.tag = evt.result = JSON.parse(result);
          break;
        case 'js':
          data = evt.result;
          data = data.replace(/^\/\/.*?(\n|$)/igm, '');
          if (evt.item.id.search(/main/i) !== -1) {
            result = evt.item.result = data;
          } else {
            result = eval('(function (){' + data + '}).call(self)');
          }
          break;
        case 'css':
          head = document.querySelector("head") || document.getElementsByTagName("head")[0];
          style = document.createElement('style');
          style.id = evt.item.id;
          style.type = "text/css";
          head.appendChild(style);
          si = head.querySelectorAll('style').length;
          try {
            style.appendChild(document.createTextNode(evt.result));
          } catch (_error) {
            e = _error;
            if (document.all) {
              document.styleSheets[si].cssText = evt.result;
            }
          }
          result = style;
          break;
        default:
          result = evt.item;
      }
    }
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
  return AssetLoader;
})(EventDispatcher);
/**
@class ObjectUtils
@static
@submodule caim.utils
 */
var ObjectUtils;
ObjectUtils = (function() {
  function ObjectUtils() {}
  /**
  	Return the length of a item.
  	@method count
  	@static
  	@param {Object} p_item object to count.
  	@return {Number}
   */
  ObjectUtils.count = function(p_item) {
    var err, key, result;
    result = 0;
    try {
      result = Object.keys(p_item).length;
    } catch (_error) {
      err = _error;
      for (key in p_item) {
        result++;
      }
    }
    return result;
  };
  /**
  	Return a array of a object item.
  	@method toArray
  	@static
  	@param {Object} p_source
  	@return {Array}
   */
  ObjectUtils.toArray = function(p_source) {
    var k, result, v;
    result = [];
    for (k in p_source) {
      v = p_source[k];
      result.push(p_source[k]);
    }
    return result;
  };
  /**
  	Returns a new merged object.
  	@method merge
  	@static
  	@param {Object} a The object to be used as reference A.
  	@param {Object} b The object to be used as reference B.
  	@return {Object} Returns a new merged object.
   */
  ObjectUtils.merge = function(a, b) {
    var k;
    if (Object.isObject(a) && Object.isObject(b)) {
      for (k in b) {
        if (!a.hasOwnProperty(k)) {
          if (Object.isObject(b[k])) {
            a[k] = ObjectUtils.clone(b[k]);
          } else {
            a[k] = b[k];
          }
        } else {
          a[k] = ObjectUtils.merge(a[k], b[k]);
        }
      }
    }
    return a;
  };
  /**
  	Returns a new cloned object.
  	@method clone
  	@static
  	@param {Object} p_target The object to be cloned.
  	@return {Object} Returns a new cloned object.
   */
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
  /**
  	Replace the value of a object
  	@method replaceValue
  	@static
  	@param {Object} p_obj
  	@param {Object} p_value
  	@param {Object} p_newvalue
  	@param {Boolean} [p_clone=true]
  	@return {Object} Returns the object with a new value.
   */
  ObjectUtils.replaceValue = function(p_obj, p_value, p_newvalue, p_clone) {
    var k, resp, v;
    if (p_clone == null) {
      p_clone = true;
    }
    resp = [];
    for (k in p_obj) {
      v = p_obj[k];
      if (v === p_value) {
        p_obj[k] = p_newvalue;
        resp.push(p_obj);
      }
      if (typeof v === 'object') {
        resp = [].concat(resp, ObjectUtils.replaceValue(v, p_value, p_newvalue, p_clone));
      }
    }
    return resp;
  };
  /**
  	@method hasSameKey
  	@static
  	@param {Object} p_a
  	@param {Object} p_b
  	@return {Boolean}
   */
  ObjectUtils.hasSameKey = function(p_a, p_b) {
    if (Object.getOwnPropertyNames(p_a)[0] === Object.getOwnPropertyNames(p_b)[0]) {
      return true;
    } else {
      return false;
    }
  };
  /**
  	@method isEqual
  	@static
  	@param {Object} p_a
  	@param {Object} p_b
  	@return {Boolean}
   */
  ObjectUtils.isEqual = function(p_a, p_b) {
    return JSON.stringify(p_a) === JSON.stringify(p_b);
  };
  /**
  	Return a mapped object of a array item.
  	@method parseLinkedArray
  	@static
  	@param {Array} p_source The array object
  	@return {Object} 
  	@example
  	```
  	ObjectUtils.parseLinkedArray([['id', 'name'], [0, 'name1'], [1, 'name2']])
  	Output://[{id: 0, 'name': 'name1'}, {id: 1, 'name': 'name2'}]
  	```
   */
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
  /**
  	@method getClassName
  	@static
  	@param {Object} p_source
  	@return {String}
   */
  ObjectUtils.getClassName = function(p_source) {
    var description, matches;
    if (typeof p_source === 'undefined') {
      return 'undefined';
    }
    if (p_source === null) {
      return 'null';
    }
    if (typeof p_source === 'function') {
      return p_source.name || 'undefined';
    }
    if (p_source.constructor != null) {
      if (p_source.constructor.name != null) {
        return p_source.constructor.name;
      } else {
        description = p_source.constructor.toString();
        if (description[0] === '[') {
          matches = description.match(/\[\w+\s*(\w+)\]/);
        } else {
          matches = description.match(/function\s*(\w+)/);
        }
        if ((matches != null) && matches.length === 2) {
          return matches[1];
        }
      }
    }
    return 'undefined';
  };
  return ObjectUtils;
})();
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
    _detections = Detections.getInstance();
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
  	@property list
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
var BaseDOM,
  __slice = [].slice;
if (!("findParents" in Node.prototype)) {
  Node.prototype.findParents = function(query) {
    if ((this.parentNode != null) && this.parentNode !== document) {
      if (this.parentNode.matches(query)) {
        return this.parentNode;
      } else {
        return this.parentNode.findParents(query);
      }
    }
    return null;
  };
}
if (!("contains" in Node.prototype)) {
  Node.prototype.contains = function(node) {
    var v, _i, _len, _ref;
    _ref = this.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      if (v === (node.element || node)) {
        return true;
        break;
      }
    }
    return false;
  };
} else {
  if (!("__contains__" in Node.prototype)) {
    Node.prototype.__contains__ = Node.prototype.contains;
    Node.prototype.contains = function(node) {
      return this.__contains__(node.element || node);
    };
  }
}
if (!("__appendChild__" in Node.prototype)) {
  Node.prototype.__appendChild__ = Node.prototype.appendChild;
  Node.prototype.appendChild = function(node) {
    var el;
    el = node.element || node;
    if (el != null) {
      this.__appendChild__(el);
    }
    if (node instanceof BaseDOM) {
      node.parent = this.__instance__ || this;
    }
    return node;
  };
}
if (!("__removeChild__" in Node.prototype)) {
  Node.prototype.__removeChild__ = Node.prototype.removeChild;
  Node.prototype.removeChild = function(node) {
    var el;
    el = node.element || node;
    if (el != null) {
      this.__removeChild__(el);
    }
    if (node instanceof BaseDOM) {
      node.parent = null;
    }
    return node;
  };
}
if (!("__replaceChild__" in Node.prototype)) {
  Node.prototype.__replaceChild__ = Node.prototype.replaceChild;
  Node.prototype.replaceChild = function(newNode, oldNode) {
    var el1, el2, node;
    el1 = newNode;
    el2 = oldNode;
    if (newNode instanceof BaseDOM) {
      el1 = newNode.element;
    }
    if (oldNode instanceof BaseDOM) {
      el2 = oldNode.element;
    }
    if ((el1 != null) && (el2 != null)) {
      node = Node.prototype.__replaceChild__.call(this, el1, el2);
    }
    if (newNode instanceof BaseDOM) {
      newNode.parent = this.__instance__ || this;
    }
    if (oldNode instanceof BaseDOM) {
      oldNode.parent = null;
    }
    return node;
  };
}
/**
Base DOM manipulation class
@class BaseDOM
 */
BaseDOM = (function(_super) {
  __extends(BaseDOM, _super);
  BaseDOM.ADDED_TO_DOCUMENT = 'added_to_document';
  BaseDOM.REMOVED_FROM_DOCUMENT = 'removed_from_document';
  BaseDOM.isElement = function(p_target) {
    return Element.isElement(p_target);
  };
  function BaseDOM() {
    var className, element, i, namespace, option, p_options;
    p_options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this._removedFromDOM = __bind(this._removedFromDOM, this);
    this._addedToDOM = __bind(this._addedToDOM, this);
    this._mutations = __bind(this._mutations, this);
    BaseDOM.__super__.constructor.apply(this, arguments);
    element = 'div';
    className = null;
    namespace = null;
    if (typeof p_options[0] === 'string' || p_options[0] instanceof Element) {
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
    } else {
      this._element = element;
    }
    if ((this.element.parentElement != null) && (this._parent == null)) {
      this.parent = this.element.parentElement.__instance__ || this.element.parentElement;
    }
    if (className) {
      this.addClass(className);
    }
    this.element.__instance__ = this;
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
    outerWidth: function() {
      var space, w;
      w = this.width;
      space = this.numberStyle('margin-left') + this.numberStyle('margin-right');
      return w + space;
    }
  });
  BaseDOM.get({
    outerHeight: function() {
      var h, space;
      h = this.height;
      space = this.numberStyle('margin-top') + this.numberStyle('margin-bottom');
      return h + space;
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
    windowScroll: function() {
      var isCSS1Compat, supportPageOffset, x, y;
      supportPageOffset = window.pageXOffset !== void 0;
      isCSS1Compat = (document.compatMode || "") === "CSS1Compat";
      x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
      y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
      return {
        x: x,
        y: y
      };
    }
  });
  BaseDOM.get({
    scrollPosition: function() {
      return {
        y: this.element.offsetTop,
        x: this.element.offsetLeft
      };
    }
  });
  BaseDOM.set({
    scrollY: function(p_value) {
      return this.element.scrollTop = p_value;
    }
  });
  BaseDOM.get({
    scrollY: function() {
      return this.element.scrollTop;
    }
  });
  BaseDOM.set({
    scrollX: function(p_value) {
      return this.element.scrollLeft = p_value;
    }
  });
  BaseDOM.get({
    scrollX: function() {
      return this.element.scrollLeft;
    }
  });
  BaseDOM.get({
    attributes: function() {
      return this.element.attributes;
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
      return this.element.textContent;
    }
  });
  BaseDOM.set({
    text: function(value) {
      return this.element.textContent = value;
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
    parent: function() {
      return this._parent;
    }
  });
  BaseDOM.set({
    parent: function(value) {
      var _ref;
      if (value == null) {
        value = null;
      }
      if (value != null) {
        if (!(value instanceof BaseDOM) && !(value instanceof Node)) {
          throw new Error('Parent instance is not either Node or BaseDOM');
        }
        return this._parent = value;
      } else {
        this._parent = null;
        if ((_ref = this._observer) != null) {
          _ref.disconnect();
        }
        this._observer = null;
        return delete this._observer;
      }
    }
  });
  BaseDOM.get({
    isAttached: function(p_container) {
      var _base;
      if (p_container == null) {
        p_container = null;
      }
      if (typeof (p_container != null ? p_container.contains : void 0) === 'function') {
        return p_container.contains(this.element);
      }
      return (typeof document !== "undefined" && document !== null ? typeof document.contains === "function" ? document.contains(this.element) : void 0 : void 0) || (typeof document !== "undefined" && document !== null ? typeof (_base = document.body).contains === "function" ? _base.contains(this.element) : void 0 : void 0);
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
      child.parent = this.__instance__ || this;
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
      replaceElement.parent = this.__instance__ || this;
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
    if (destroy == null) {
      destroy = false;
    }
    if (!child) {
      return;
    }
    if (child instanceof BaseDOM) {
      if (!!destroy) {
        child.removeAll(true);
        child.destroy();
        return child;
      }
    }
    if (this.contains(child)) {
      return this.element.removeChild(child);
    }
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
    var child, childs, domInstance, i, _results;
    if (destroy == null) {
      destroy = false;
    }
    childs = this.childNodes;
    i = childs.length;
    _results = [];
    while (i-- > 0) {
      domInstance = childs[i].__instance__;
      child = domInstance || childs[i];
      if (child != null) {
        _results.push(this.removeChild(child, !!domInstance && !!destroy));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  BaseDOM.prototype.contains = function(child) {
    return this.element.contains(child.element || child);
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
  BaseDOM.prototype.removeAttr = function(name, namespace) {
    var key, methodArgs, methodSuffix, _i, _len, _ref, _ref1, _results;
    if (namespace == null) {
      namespace = null;
    }
    if (namespace === true) {
      namespace = this.namespace;
    }
    methodArgs = [name];
    methodSuffix = "Attribute";
    if (namespace != null) {
      methodSuffix += "NS";
      methodArgs.unshift(namespace);
    }
    if (typeof name === 'string') {
      return (_ref = this.element) != null ? _ref["remove" + methodSuffix].apply(this.element, methodArgs) : void 0;
    } else if (Array.isArray(name)) {
      _results = [];
      for (_i = 0, _len = name.length; _i < _len; _i++) {
        key = name[_i];
        methodArgs.splice(-1, 1, key);
        _results.push((_ref1 = this.element) != null ? _ref1["remove" + methodSuffix].apply(this.element, methodArgs) : void 0);
      }
      return _results;
    }
  };
  BaseDOM.prototype.attr = function(name, value, namespace) {
    var k, v, _results;
    if (value == null) {
      value = null;
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
    var methodArgs, methodSuffix, _ref, _ref1;
    if (value == null) {
      value = null;
    }
    if (namespace == null) {
      namespace = null;
    }
    if (namespace === true) {
      namespace = this.namespace;
    }
    methodArgs = [name, value];
    methodSuffix = "Attribute";
    if (namespace != null) {
      methodSuffix += "NS";
      methodArgs.unshift(namespace);
    }
    if (value != null) {
      if ((_ref = this.element) != null) {
        _ref["set" + methodSuffix].apply(this.element, methodArgs);
      }
    }
    return (_ref1 = this.element) != null ? _ref1["get" + methodSuffix].apply(this.element, methodArgs) : void 0;
  };
  BaseDOM.prototype._css = function(name, value, p_number) {
    if (value == null) {
      value = null;
    }
    if (p_number == null) {
      p_number = false;
    }
    if (value !== null) {
      this.element.style[name] = value;
    }
    if (p_number) {
      return this.numberStyle(name);
    } else {
      return this.style(name);
    }
  };
  BaseDOM.prototype.css = function(name, value, p_number) {
    var k, v, _results;
    if (value == null) {
      value = null;
    }
    if (p_number == null) {
      p_number = false;
    }
    if (typeof name === 'string') {
      return this._css(name, value, p_number);
    } else if (typeof name === 'object') {
      _results = [];
      for (k in name) {
        v = name[k];
        _results.push(this._css(k, v, p_number));
      }
      return _results;
    }
  };
  BaseDOM.prototype.style = function(styleProp, el) {
    var source;
    if (styleProp == null) {
      styleProp = null;
    }
    if (el == null) {
      el = this.element;
    }
    if (el instanceof BaseDOM) {
      el = el.element;
    }
    source = null;
    if (window.getComputedStyle != null) {
      source = window.getComputedStyle(el);
    } else if (el.currentStyle) {
      source = el.currentStyle;
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
      source = document.defaultView.getComputedStyle(el, null);
    } else {
      source = this.element.style;
    }
    if (styleProp != null) {
      return source[styleProp];
    } else {
      return source;
    }
  };
  BaseDOM.prototype.numberStyle = function(styleProp, el) {
    var k, result, source, v;
    if (styleProp == null) {
      styleProp = null;
    }
    if (el == null) {
      el = this.element;
    }
    if (styleProp != null) {
      return parseFloat(this.style(styleProp, el) || '0');
    } else {
      source = this.style(null, el);
    }
    result = {};
    for (k in source) {
      v = source[k];
      if (isNaN(parseInt(k))) {
        result[k] = v;
        if (!isNaN(parseFloat(v))) {
          result[k] = parseFloat(v);
        }
      }
    }
    return result;
  };
  BaseDOM.prototype.addClass = function(className) {
    var action, classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (!Array.isArray(className)) {
      return;
    }
    if (this.element.classList != null) {
      className = !Array.isArray(className) ? [className] : className;
      className.forEach(action = function(value) {
        return this.classList.add(value);
      }, this.element);
      action = null;
      return this.className;
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
    var action, classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (!Array.isArray(className)) {
      return;
    }
    if (this.element.classList != null) {
      className = !Array.isArray(className) ? [className] : className;
      className.forEach(action = function(value) {
        return this.classList.remove(value);
      }, this.element);
      action = null;
      return this.className;
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
  BaseDOM.prototype._mutations = function(mutations) {
    var i, mutation, node, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
    i = mutations.length;
    while (i--) {
      mutation = mutations[i];
      if (mutation.type === 'childList') {
        _ref = mutation.removedNodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          if ((_ref1 = node.__instance__) != null) {
            _ref1._removedFromDOM({
              target: node
            });
          }
        }
        _ref2 = mutation.addedNodes;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          node = _ref2[_j];
          if ((_ref3 = node.__instance__) != null) {
            _ref3._addedToDOM({
              target: node
            });
          }
        }
      }
    }
    return void 0;
  };
  BaseDOM.prototype._addedToDOM = function(evt) {
    this.trigger(BaseDOM.ADDED_TO_DOCUMENT, this._parent);
    return typeof this.added === "function" ? this.added() : void 0;
  };
  BaseDOM.prototype._removedFromDOM = function(evt) {
    this.trigger(BaseDOM.REMOVED_FROM_DOCUMENT, this._parent);
    return typeof this.removed === "function" ? this.removed() : void 0;
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
    var _ref;
    this.element.off('DOMNodeInsertedIntoDocument', this._addedToDOM);
    this.element.off('DOMNodeRemovedIntoDocument', this._removedFromDOM);
    if (typeof this.off === "function") {
      this.off();
    }
    if (typeof this.removeAll === "function") {
      this.removeAll(true);
    }
    if (typeof this.remove === "function") {
      this.remove();
    }
    if ((_ref = this._observer) != null) {
      _ref.disconnect();
    }
    this._observer = null;
    this._namespace = null;
    this._parent = null;
    this._element.__instance__ = null;
    delete this._observer;
    delete this._namespace;
    delete this._parent;
    delete this._element.__instance__;
    return void 0;
  };
  return BaseDOM;
})(EventDispatcher);
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
  	@property head
  	@type {HTMLElement}
  	@readOnly
   */
  MetaController.get({
    head: function() {
      return document.head || document.getElementsByTagName('head')[0];
    }
  });
  /**
  	@property viewport
  	@type {String}
   */
  MetaController.set({
    viewport: function(p_value) {
      return this.applyMeta('viewport', p_value);
    }
  });
  /**
  	@property title
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
  	@property description
  	@type {String}
   */
  MetaController.set({
    description: function(p_value) {
      return this.applyMeta('description', p_value);
    }
  });
  /**
  	@property favicon
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
  	@property icons
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
  	@property splash
  	@type {String}
   */
  MetaController.set({
    splash: function(p_value) {
      this.applyLink('apple-touch-startup-image', p_value);
      return false;
    }
  });
  /**
  	@property webAppCapable
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
  	@property color
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
  	@property manifest
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
/**
@class BaseView
@extends BaseDOM
@submodule caim.navigation.display
 */
var BaseView;
BaseView = (function(_super) {
  /**
  	Triggered before the create routine view starts. Triggered when {{#crossLink "BaseView/createStart:method"}}{{/crossLink}} is called.
  	@event CREATE_START
  	@static
   */
  var _meta;
  __extends(BaseView, _super);
  BaseView["const"]({
    CREATE_START: 'create_start'
  });
  /**
  	Triggered when the create routine view starts. Triggered when {{#crossLink "BaseView/create:method"}}{{/crossLink}} is called.
  	@event CREATE
  	@static
   */
  BaseView["const"]({
    CREATE: 'create'
  });
  /**
  	Triggered when the create routine view is finished. Triggered when {{#crossLink "BaseView/createComplete:method"}}{{/crossLink}} is called.
  	@event CREATE_COMPLETE
  	@static
   */
  BaseView["const"]({
    CREATE_COMPLETE: 'create_complete'
  });
  /**
  	Triggered before the showing routine view starts. Triggered when {{#crossLink "BaseView/showStart:method"}}{{/crossLink}} is called.
  	@event SHOW_START
  	@static
   */
  BaseView["const"]({
    SHOW_START: 'show_start'
  });
  /**
  	Triggered when the showing routine view starts. Triggered when {{#crossLink "BaseView/show:method"}}{{/crossLink}} is called.
  	@event SHOW
  	@static
   */
  BaseView["const"]({
    SHOW: 'show'
  });
  /**
  	Triggered when the showing routine view is finished. Triggered when {{#crossLink "BaseView/showComplete:method"}}{{/crossLink}} is called.
  	@event SHOW_COMPLETE
  	@static
   */
  BaseView["const"]({
    SHOW_COMPLETE: 'show_complete'
  });
  /**
  	Triggered before the hiding routine view starts. Triggered when {{#crossLink "BaseView/hideStart:method"}}{{/crossLink}} is called.
  	@event HIDE_START
  	@static
   */
  BaseView["const"]({
    HIDE_START: 'hide_start'
  });
  /**
  	Triggered when the hiding routine view starts. Triggered when {{#crossLink "BaseView/hide:method"}}{{/crossLink}} is called.
  	@event HIDE
  	@static
   */
  BaseView["const"]({
    HIDE: 'hide'
  });
  /**
  	Triggered when the hiding routine view is finished. Triggered when {{#crossLink "BaseView/hideComplete:method"}}{{/crossLink}} is called.
  	@event HIDE_COMPLETE
  	@static
   */
  BaseView["const"]({
    HIDE_COMPLETE: 'hide_complete'
  });
  /**
  	Triggered when the destroy routine view starts. Triggered when {{#crossLink "BaseView/destroy:method"}}{{/crossLink}} is called.
  	@event DESTROY
  	@static
   */
  BaseView["const"]({
    DESTROY: 'destroy'
  });
  /**
  	Triggered when the destroy routine view is finished. Triggered when {{#crossLink "BaseView/destroyComplete:method"}}{{/crossLink}} is called.
  	@event DESTROY_COMPLETE
  	@static
   */
  BaseView["const"]({
    DESTROY_COMPLETE: 'destroy_complete'
  });
  /**
  	Triggered when the view pauses. Usually when {{#crossLink "BaseView/pause:method"}}{{/crossLink}} is called.
  	@event PAUSE
  	@static
   */
  BaseView["const"]({
    PAUSE: 'pause'
  });
  /**
  	Triggered when the view resumes. Usually when {{#crossLink "BaseView/resume:method"}}{{/crossLink}} is called.
  	@event RESUME
  	@static
   */
  BaseView["const"]({
    RESUME: 'resume'
  });
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
  	@param {String} [p_element='div'] HTMLElement type
   */
  _meta = null;
  function BaseView(p_data, p_CSSClassName, p_element) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_CSSClassName == null) {
      p_CSSClassName = null;
    }
    if (p_element == null) {
      p_element = 'div';
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
      element: p_element,
      className: p_CSSClassName
    });
  }
  /**
  	Returns the loader queue of this specific view.
  	@property loader
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
  	@property created
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
  	@property showed
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
  	@property data
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
      return this._data = p_value;
    }
  });
  /**
  	Sets/gets the unique ID of view.
  	@property id
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
  	Sets/gets the content of view.
  	@property content
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
  	@property route
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
  	@property routeData
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
      return this._routeData = ObjectUtils.clone(p_value);
    }
  });
  /**
  	Sets/gets the parent view of this view.
  	@property parentView
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
  	@property subviews
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
  	@property destroyable
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
  	@property type
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
  	@property meta
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
  	@property progress
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
  	@property reverseParentPath
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
  	@property parentPath
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
  	@property subviewsWrapper
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
  	@property attachToParentWrapper
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
@class JSONUtils
@static
@submodule caim.utils
 */
var JSONUtils;
JSONUtils = (function() {
  function JSONUtils() {}
  /**
  	@method parseJSON
  	@static
  	@param {JSON|Object} json
  	@return {JSON}
   */
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
  /**
  	@method replaceMultiline
  	@static
  	@param {JSON|Object} json
  	@return {JSON}
   */
  JSONUtils.replaceMultiline = function(json) {
    if (typeof json !== 'string') {
      return json;
    }
    json = json.replace(/^(\s*.*?""")(?:[\s\t]*\n)?([\t\s]*)(\S[\s\S]*)\n?[\s]*(""")/igm, this._replaceMultilinePart);
    json = json.replace(/^(\s*.*?)"""([\s\S]*?)"""/igm, this._replaceEmptyMultiline);
    return json;
  };
  /**
  	@method _replaceMultilinePart
  	@static
  	@private
  	@param {String} match
  	@param {String} prefix
  	@param {String} spaces
  	@param {String} value
  	@param {String} suffix
  	@return {String}
   */
  JSONUtils._replaceMultilinePart = function(match, prefix, spaces, value, suffix) {
    var re;
    re = new RegExp(spaces + '?([^\n]*)', 'g');
    value = value.replace(re, '$1');
    return prefix + value + suffix;
  };
  /**
  	@method _replaceEmptyMultiline
  	@static
  	@private
  	@param {String} match
  	@param {String} prefix
  	@param {String} value
  	@return {String}
   */
  JSONUtils._replaceEmptyMultiline = function(match, prefix, value) {
    value = value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
    return prefix + '"' + value + '"';
  };
  /**
  	@method removeComments
  	@static
  	@param {JSON|Object} json
  	@return {JSON}
   */
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
  /**
  	@method filterObject
  	@static
  	@param {JSON|Object|Array} data
  	@param {String} name
  	@param {String} [type = null] The typeof of object
  	@param {Boolean} [ignore = null]
  	@param {Boolean} [getParent = false]
  	@param {Array} [p_currentPath = []]
  	@return {JSON|Object|Array}
   */
  JSONUtils.filterObject = function(data, name, type, ignore, getParent, p_currentPath) {
    var add, k, objectPath, resp, v;
    if (type == null) {
      type = null;
    }
    if (ignore == null) {
      ignore = null;
    }
    if (getParent == null) {
      getParent = false;
    }
    if (p_currentPath == null) {
      p_currentPath = [];
    }
    resp = [];
    name = [].concat(name);
    if (ignore) {
      ignore = [].concat(ignore);
    }
    for (k in data) {
      v = data[k];
      objectPath = [].concat(p_currentPath, k);
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
              data.___path = objectPath.splice(0, objectPath.length - 1);
              resp.push(data);
            }
          } else {
            v.___path = objectPath;
            resp.push(v);
          }
        }
      }
      if (typeof v === 'array' || typeof v === 'object') {
        resp = [].concat(resp, this.filterObject(v, name, type, ignore, getParent, objectPath));
      }
    }
    return resp;
  };
  return JSONUtils;
})();
var LanguageData;
LanguageData = (function(_super) {
  var _current, _data, _default;
  __extends(LanguageData, _super);
  _data = null;
  _current = void 0;
  _default = void 0;
  LanguageData.getInstance = function(p_data) {
    return LanguageData._instance != null ? LanguageData._instance : LanguageData._instance = new LanguageData(p_data);
  };
  function LanguageData(p_data) {
    this._replaceRoute = __bind(this._replaceRoute, this);
    this.data = p_data;
    LanguageData.__super__.constructor.apply(this, arguments);
  }
  LanguageData.prototype.gotoLanguage = function(p_iso) {
    var parsedRoute;
    parsedRoute = app.navigation.routeData.route.replace(/\{(.*?)\}/g, this._replaceRoute);
    return window.location = app.root + this.getLanguage(p_iso).sufix + parsedRoute;
  };
  LanguageData.prototype._replaceRoute = function(match0, match1) {
    var _ref;
    return ((_ref = app.navigation.routeData.parsed) != null ? _ref[match1] : void 0) || '';
  };
  LanguageData.prototype.hasLanguage = function(p_value, p_filter) {
    var i, result, _i, _ref;
    if (p_filter == null) {
      p_filter = 'iso';
    }
    result = false;
    if (typeof p_value === 'string' && typeof p_filter === 'string') {
      for (i = _i = 0, _ref = this.data.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.data[i][p_filter] === p_value) {
          result = true;
          break;
        }
      }
    }
    return result;
  };
  LanguageData.prototype.getLanguage = function(p_value) {
    var i, result, _i, _ref;
    result = null;
    if (typeof p_value === 'string') {
      for (i = _i = 0, _ref = this.data.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.data[i].iso === p_value) {
          result = this.data[i];
          break;
        } else if (this.data[i].sufix === p_value) {
          result = this.data[i];
          break;
        }
      }
    }
    return result;
  };
  LanguageData.get({
    data: function(p_value) {
      return _data;
    }
  });
  LanguageData.set({
    data: function(p_value) {
      var k, v;
      _data = p_value;
      for (k in p_value) {
        v = p_value[k];
        if (!v.iso || v.iso && v.iso === "") {
          throw new Error('Please sets the "iso" object (ISO 639-1 standard) in languages object of config file.');
        }
        if (!v.sufix || v.sufix && v.sufix === "") {
          throw new Error('Please sets the "sufix" object in languages object of config file.');
        }
        if (!v['data-path'] || v['data-path'] && v['data-path'] === "") {
          throw new Error('Please sets the "data-path" object in languages object of config file.');
        }
        if (v["default"] != null) {
          this["default"] = v;
        }
      }
      if (!this["default"]) {
        if (p_value != null) {
          p_value[0]["default"] = true;
        }
        this["default"] = p_value != null ? p_value[0] : void 0;
      }
      return false;
    }
  });
  LanguageData.get({
    current: function() {
      return _current;
    }
  });
  LanguageData.set({
    current: function(p_value) {
      var i, _i, _ref;
      if (typeof p_value === 'string') {
        for (i = _i = 0, _ref = this.data.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (this.data[i].iso === p_value) {
            _current = this.data[i];
            break;
          } else if (this.data[i].sufix === p_value) {
            _current = this.data[i];
            break;
          }
        }
        if (!_current) {
          throw new Error('The value ' + p_value + ' isnt a valid "iso" or "sufix".');
        }
      }
      return false;
    }
  });
  LanguageData.get({
    "default": function() {
      return _default;
    }
  });
  LanguageData.set({
    "default": function(p_value) {
      return _default = p_value;
    }
  });
  return LanguageData;
})(EventDispatcher);
var ParseData;
ParseData = (function(_super) {
  var _conditions;
  __extends(ParseData, _super);
  _conditions = null;
  function ParseData(p_data) {
    this._data = p_data;
    if (_conditions == null) {
      _conditions = ConditionsValidation.getInstance(this._data.conditions);
    }
    ParseData.__super__.constructor.apply(this, arguments);
  }
  ParseData.get({
    data: function() {
      return this._data;
    }
  });
  ParseData.set({
    data: function(p_value) {
      return this._data = p_value;
    }
  });
  /**
  	@method getPath
  	@param {Object} p_obj
  	@return {String}
  	@static
   */
  ParseData.getPath = function(p_obj) {
    var clone, i, _i, _ref;
    if (p_obj == null) {
      throw new Error('The param p_obj cannot be null');
    }
    if (typeof p_obj === 'object') {
      clone = ObjectUtils.clone(p_obj);
      for (i = _i = 0, _ref = clone.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (clone[i].condition != null) {
          if (_conditions != null ? typeof _conditions.test === "function" ? _conditions.test(clone[i].condition) : void 0 : void 0) {
            if (clone[i].file != null) {
              return clone[i].file;
            }
            break;
          } else {
            continue;
          }
        } else {
          if (clone[i].file != null) {
            return clone[i].file;
            break;
          }
        }
      }
    }
    return p_obj;
  };
  /**
  	@method getProperties
  	@param {Object} p_obj
  	@return {String}
  	@static
   */
  ParseData.getProperties = function(p_obj) {
    var clone, foundItem, i, prop, result, value, _i, _ref;
    if (p_obj == null) {
      throw new Error('The param p_obj cannot be null');
    }
    result = {};
    if (typeof p_obj === 'object') {
      clone = ObjectUtils.clone(p_obj);
      foundItem = null;
      for (i = _i = 0, _ref = clone.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (clone[i].condition != null) {
          if (_conditions != null ? typeof _conditions.test === "function" ? _conditions.test(clone[i].condition) : void 0 : void 0) {
            foundItem = clone[i];
          }
        } else if (!foundItem) {
          foundItem = clone[i];
        }
      }
    }
    for (prop in foundItem) {
      value = foundItem[prop];
      if (prop !== 'condition' && prop !== 'file') {
        result[prop] = value;
      }
    }
    return result;
  };
  /**
  	@method getProperties
  	@param {Object} p_obj
  	@return {String}
  	@protected
   */
  ParseData.prototype.getProperties = function(p_obj) {
    return ParseData.getProperties(p_obj);
  };
  /**
  	@method getPath
  	@param {Object} p_obj
  	@return {String}
  	@protected
   */
  ParseData.prototype.getPath = function(p_obj) {
    return ParseData.getPath(p_obj);
  };
  return ParseData;
})(EventDispatcher);
var ParseConfig;
ParseConfig = (function(_super) {
  var _contents, _required, _views;
  __extends(ParseConfig, _super);
  _views = null;
  _contents = null;
  _required = null;
  function ParseConfig(p_data) {
    ParseConfig.__super__.constructor.call(this, p_data);
    if (_contents == null) {
      _contents = [];
    }
    if (_views == null) {
      _views = this._setViews();
    }
    if (_required == null) {
      _required = this._setRequired();
    }
  }
  ParseConfig.get({
    views: function() {
      return _views;
    }
  });
  ParseConfig.get({
    contents: function() {
      return _contents;
    }
  });
  ParseConfig.get({
    required: function() {
      return _required;
    }
  });
  /**
  	@method _setViews
  	@return {Object}
  	@private
   */
  ParseConfig.prototype._setViews = function() {
    var k, p, props, pv, results, v, _ref, _ref1;
    results = [];
    _ref = this.data.views;
    for (k in _ref) {
      v = _ref[k];
      v["class"] = StringUtils.toCamelCase(v["class"]);
      if (v.content) {
        props = this.getProperties(v.content);
        v.content = this.getPath(v.content);
        if (props != null) {
          for (p in props) {
            pv = props[p];
            v[p] = pv;
          }
        }
        _contents.push(this._contentGroup(v));
      }
      results[v.id] = v;
    }
    _ref1 = this.data.views;
    for (k in _ref1) {
      v = _ref1[k];
      if (v.parentView === v.id) {
        throw new Error('The parent view cannot be herself');
      }
      if ((results[v.parentView] != null) && v.parentView !== v.id) {
        if (!results[v.parentView].subviews) {
          results[v.parentView].subviews = {};
        }
        if (v.loadContent === void 0) {
          v.loadContent = results[v.parentView].loadContent != null ? results[v.parentView].loadContent : true;
        } else {
          v.loadContent = v.loadContent;
        }
        results[v.parentView].subviews[v.id] = v;
      }
    }
    this.data.views = results;
    return results;
  };
  /**
  	@method _setRequired
  	@return {Object}
  	@private
   */
  ParseConfig.prototype._setRequired = function() {
    var group, id, k, p, props, pv, results, src, v, _ref;
    results = [];
    for (id in this.data.required) {
      group = [];
      _ref = this.data.required[id];
      for (k in _ref) {
        v = _ref[k];
        v.group = id;
        if (v.src) {
          props = this.getProperties(v.src);
          v.src = this.getPath(v.src);
          if (props != null) {
            for (p in props) {
              pv = props[p];
              v[p] = pv;
            }
          }
        }
        if (v.content) {
          props = this.getProperties(v.content);
          v.content = this.getPath(v.content);
          if (props != null) {
            for (p in props) {
              pv = props[p];
              v[p] = pv;
            }
          }
          _contents.push(this._contentGroup(v));
        }
        if ((v.id == null) || v.id === void 0) {
          src = v.src || v.content;
          v.id = this.removeParam('noCache', this.getPath(src));
          v.id = this.removeParam('v', this.getPath(src));
        }
        group[v.id] = v;
      }
      results[id] = group;
    }
    this.data.required = results;
    return results;
  };
  /**
  	@method removeParam
  	@param {String} p_param
  	@param {String} p_url
  	@private
   */
  ParseConfig.prototype.removeParam = function(p_param, p_url) {
    var i, param, params, query, results;
    param = null;
    params = [];
    results = typeof p_url.split === "function" ? p_url.split('?')[0] : void 0;
    query = p_url.indexOf('?') !== -1 ? p_url.split('?')[1] : '';
    if (query !== '') {
      params = query.split('&');
      i = params.length - 1;
      while (i >= 0) {
        param = params[i].split('=')[0];
        if (param === p_param) {
          params.splice(i, 1);
        }
        i -= 1;
      }
      if (params.length > 0) {
        results = results + '?' + params.join('&');
      }
    }
    return results;
  };
  /**
  	@method _contentGroup
  	@param {Object} p_data
  	@return {Array}
  	@private
   */
  ParseConfig.prototype._contentGroup = function(p_data) {
    var result;
    result = {};
    if (p_data.id) {
      result.id = p_data.id;
    }
    if (p_data.group) {
      result.group = p_data.group;
    }
    result.src = this.getPath(p_data.content);
    result.cache = p_data.cache || p_data.cache === void 0 ? true : false;
    result.loadContent = p_data.loadContent || p_data.loadContent === void 0 ? true : false;
    return result;
  };
  return ParseConfig;
})(ParseData);
var ParseContent;
ParseContent = (function(_super) {
  __extends(ParseContent, _super);
  function ParseContent(p_data) {
    ParseContent.__super__.constructor.call(this, p_data);
    this._validatePaths(this.data);
    this._getContents();
  }
  ParseContent.get({
    initialAssets: function() {
      return this._primary;
    }
  });
  ParseContent.get({
    standByAssets: function() {
      return this._standBy;
    }
  });
  /**
  	@method _getContents
  	@return {Object}
  	@private
   */
  ParseContent.prototype._getContents = function() {
    var assets, k, paths, v;
    if (this._primary == null) {
      this._primary = [];
    }
    if (this._standBy == null) {
      this._standBy = [];
    }
    paths = PathsData.getInstance();
    assets = JSONUtils.filterObject(paths.translate(this.data), 'src', null, null, true);
    for (k in assets) {
      v = assets[k];
      if (v.loadWithView || v.loadWithView === void 0) {
        if (this.data.src !== v.src) {
          this._primary.push(v);
        }
      } else if (v.loadWithView === false) {
        this._standBy.push(v);
      }
    }
    return false;
  };
  /**
  	@method _validatePaths
  	@param {Object} p_data
  	@protected
   */
  ParseContent.prototype._validatePaths = function(p_data) {
    var k, p, props, pv, v, _results;
    _results = [];
    for (k in p_data) {
      v = p_data[k];
      if (k === 'src') {
        props = this.getProperties(p_data[k]);
        p_data[k] = this.getPath(p_data[k]);
        if (props != null) {
          for (p in props) {
            pv = props[p];
            p_data[p] = pv;
          }
        }
      }
      if (typeof p_data[k] === 'object' || typeof p_data[k] === 'array') {
        _results.push(this._validatePaths(p_data[k]));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  return ParseContent;
})(ParseData);
/**
Base class to setup the configuration file and start loading of dependencies.
@class NavigationLoader
@extends EventDispatcher
 */
var NavigationLoader;
NavigationLoader = (function(_super) {
  var config, currentStep, lang, loaderRatio, loaderStep, loaderSteps, paths, removeParam, totalContentsLoaded;
  __extends(NavigationLoader, _super);
  NavigationLoader["const"]({
    PREPARSER_DATA: "pre_parser_data"
  });
  NavigationLoader["const"]({
    LANGUAGE_DATA_LOADED: "language_data_loaded"
  });
  NavigationLoader["const"]({
    CONFIG_LOADED: "config_loaded"
  });
  NavigationLoader["const"]({
    GROUP_ASSETS_LOADED: "group_assets_loaded"
  });
  NavigationLoader["const"]({
    LOAD_START: "load_start"
  });
  NavigationLoader["const"]({
    LOAD_PROGRESS: "load_progress"
  });
  NavigationLoader["const"]({
    LOAD_COMPLETE: "load_complete"
  });
  NavigationLoader["const"]({
    LOAD_FILE_COMPLETE: "load_file_complete"
  });
  paths = null;
  config = null;
  lang = null;
  totalContentsLoaded = null;
  loaderStep = 0;
  loaderRatio = 0;
  loaderSteps = null;
  currentStep = null;
  /**
  	@class NavigationLoader
  	@constructor
  	@param {String} p_configPath Path of the navigation configuration file.
   */
  function NavigationLoader(p_configPath) {
    this.assetsLoaded = __bind(this.assetsLoaded, this);
    this.loadComplete = __bind(this.loadComplete, this);
    this.loadProgress = __bind(this.loadProgress, this);
    this.loadFileComplete = __bind(this.loadFileComplete, this);
    this.initialQueue = __bind(this.initialQueue, this);
    this.contentLoaded = __bind(this.contentLoaded, this);
    this.loadContents = __bind(this.loadContents, this);
    this.parseConfig = __bind(this.parseConfig, this);
    this.selectLanguage = __bind(this.selectLanguage, this);
    this.configLoaded = __bind(this.configLoaded, this);
    var queue;
    if (!p_configPath) {
      throw new Error('The param p_configPath is null');
    }
    queue = this.loader.getGroup('config');
    queue.on(AssetLoader.COMPLETE_FILE, this.configLoaded);
    queue.loadFile({
      id: 'config',
      cache: true,
      src: p_configPath
    });
    false;
  }
  /**
  	@method loader
  	@return {AssetLoader}
  	@protected
   */
  NavigationLoader.get({
    loader: function() {
      return AssetLoader.getInstance();
    }
  });
  /**
  	@method loaded
  	@return {Boolean}
  	@protected
   */
  NavigationLoader.get({
    loaded: function() {
      return this._loaded;
    }
  });
  /**
  	@method configLoaded
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.configLoaded = function(evt) {
    var data, _ref;
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        _ref.off(AssetLoader.COMPLETE_FILE, this.configLoaded);
      }
    }
    data = evt.result;
    if (data.languages != null) {
      this.selectLanguage(data);
    } else {
      this.parseConfig(data);
    }
    return false;
  };
  /**
  	@method selectLanguage
  	@param {Object} p_data
  	@private
   */
  NavigationLoader.prototype.selectLanguage = function(p_data) {
    var i, languages, part, parts, selected;
    languages = LanguageData.getInstance(p_data.languages);
    parts = document.location.href.split('/');
    i = parts.length;
    while (i--) {
      part = parts[i];
      if (languages.hasLanguage(part, 'sufix')) {
        selected = part;
        break;
      }
    }
    languages.current = selected || languages["default"].iso;
    if (!p_data.paths) {
      p_data['paths'] = {};
    }
    p_data.paths['language-data'] = languages.current['data-path'];
    this.parseConfig(p_data);
    return false;
  };
  /**
  	@method parseConfig
  	@param {Object} p_data
  	@private
   */
  NavigationLoader.prototype.parseConfig = function(p_data) {
    this.trigger(NavigationLoader.PREPARSER_DATA, p_data);
    paths = PathsData.getInstance(p_data.paths);
    p_data = paths.translate(p_data);
    config = new ParseConfig(p_data);
    this.trigger(NavigationLoader.CONFIG_LOADED, {
      data: config.data
    });
    this.loadContents();
    return false;
  };
  /**
  	@method loadContents
  	@private
   */
  NavigationLoader.prototype.loadContents = function() {
    var content, contents, i, queue;
    if (totalContentsLoaded == null) {
      totalContentsLoaded = 0;
    }
    contents = config.contents;
    if (contents.length > 0) {
      i = contents.length;
      while (i-- > 0) {
        content = contents[i];
        if (content.loadContent || content.loadContent === void 0) {
          queue = this.loader.getGroup(content.group || content.id);
          queue.on(AssetLoader.COMPLETE_FILE, this.contentLoaded);
          queue.loadFile(content, false);
          queue.load();
        } else {
          this.contentLoaded(null);
        }
      }
    } else {
      this.initialQueue();
    }
    return false;
  };
  /**
  	@method contentLoaded
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.contentLoaded = function(evt) {
    var _ref;
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        _ref.off(AssetLoader.COMPLETE_FILE, this.contentLoaded);
      }
    }
    if (evt != null ? evt.item : void 0) {
      if (config.views[evt.item.id]) {
        config.views[evt.item.id].content = paths.translate(evt.item.result);
      } else if (config.required[evt.item.group][evt.item.id]) {
        config.required[evt.item.group].content = paths.translate(evt.item.result);
        delete config.required[evt.item.group][evt.item.id];
      }
    }
    totalContentsLoaded++;
    if (totalContentsLoaded === config.contents.length) {
      return this.initialQueue();
    }
  };
  /**
  	@method initialQueue
  	@private
   */
  NavigationLoader.prototype.initialQueue = function() {
    var assets, content, data, firstIndexes, id, k, queue, total, v, _ref, _ref1, _ref2;
    assets = [];
    loaderSteps = [];
    _ref = config.views;
    for (k in _ref) {
      v = _ref[k];
      data = v.content;
      if (data != null) {
        content = new ParseContent(data);
        assets[v.id] = content.initialAssets;
      }
    }
    for (id in config.required) {
      data = config.required[id].content;
      if (data != null) {
        content = new ParseContent(data);
        if (assets[id]) {
          assets[id].concat(content.initialAssets);
        } else {
          assets[id] = content.initialAssets;
        }
      }
      _ref1 = config.required[id];
      for (k in _ref1) {
        v = _ref1[k];
        if (v.src) {
          v.internal = false;
          if (v.src !== ((_ref2 = config.required[id].content) != null ? _ref2.src : void 0)) {
            if (assets[id]) {
              assets[id].push(v);
            } else {
              assets[id] = [];
              assets[id].push(v);
            }
          }
        }
      }
    }
    total = ObjectUtils.count(assets);
    firstIndexes = loaderSteps.length;
    for (k in assets) {
      v = assets[k];
      switch (k) {
        case 'preloader':
        case 'core':
        case 'main':
          loaderSteps.splice(firstIndexes, 0, {
            id: k,
            data: v,
            ratio: 1 / total
          });
          firstIndexes++;
          break;
        default:
          loaderSteps.push({
            id: k,
            data: v,
            ratio: 1 / total
          });
      }
    }
    this.trigger(NavigationLoader.LOAD_START);
    currentStep = loaderSteps[0];
    queue = this.addLoader(currentStep.id);
    this.addFiles(currentStep.data, queue);
    queue.load();
    return false;
  };
  /**
  	@method addLoader
  	@param {String} p_id
  	@return {createjs.LoadQueue}
  	@private
   */
  NavigationLoader.prototype.addLoader = function(p_id) {
    var queue;
    queue = this.loader.getGroup(p_id);
    queue.on(AssetLoader.COMPLETE_FILE, this.loadFileComplete);
    queue.on(AssetLoader.PROGRESS_ALL, this.loadProgress);
    queue.on(AssetLoader.COMPLETE_ALL, this.loadComplete);
    return queue;
  };
  /**
  	@method removeLoader
  	@param {createjs.LoadQueue} p_queue
  	@return {createjs.LoadQueue}
  	@private
   */
  NavigationLoader.prototype.removeLoader = function(p_queue) {
    p_queue.off(AssetLoader.COMPLETE_FILE, this.loadFileComplete);
    p_queue.off(AssetLoader.PROGRESS_ALL, this.loadProgress);
    p_queue.off(AssetLoader.COMPLETE_ALL, this.loadComplete);
    p_queue.destroy();
    return p_queue;
  };
  /**
  	@method addFiles
  	@param {createjs.LoadQueue} p_queue
  	@param {Object} p_files
  	@private
   */
  NavigationLoader.prototype.addFiles = function(p_files, p_queue) {
    var f, jsRE, src, _i, _len;
    jsRE = /.*\.(js|css|svg)$/g;
    for (_i = 0, _len = p_files.length; _i < _len; _i++) {
      f = p_files[_i];
      f.loaded = false;
      if ((f != null ? f.src : void 0) != null) {
        if ((f.id == null) || f.id === void 0) {
          src = removeParam('noCache', f.src);
          src = removeParam('v', f.src);
          f.id = src;
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
        p_queue.loadFile(f, false);
      }
    }
    return false;
  };
  /**
  	@method loadFileComplete
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.loadFileComplete = function(evt) {
    var contents, result, _ref, _ref1, _ref2;
    evt.item.loaded = true;
    result = evt.item;
    contents = ((_ref = config.views[currentStep.id]) != null ? _ref.content : void 0) || ((_ref1 = config.required[currentStep.id]) != null ? _ref1.content : void 0);
    if (window.main == null) {
      window.main = {};
    }
    if (contents != null) {
      eval('contents["' + ((_ref2 = evt.item.___path) != null ? _ref2.join('"]["') : void 0) + '"] = result');
      if (currentStep.id === 'main') {
        window.main['content'] = contents;
      }
    }
    this.trigger(NavigationLoader.LOAD_FILE_COMPLETE, {
      id: evt.item.id,
      group: currentStep.id,
      data: evt.item,
      result: result
    });
    return false;
  };
  /**
  	@method removeParam
  	@param {String} p_param
  	@param {String} p_url
  	@private
   */
  removeParam = function(p_param, p_url) {
    var i, param, params, query, results;
    param = null;
    params = [];
    if (typeof p_url === 'string') {
      results = typeof p_url.split === "function" ? p_url.split('?')[0] : void 0;
      query = p_url.indexOf('?') !== -1 ? p_url.split('?')[1] : '';
      if (query !== '') {
        params = query.split('&');
        i = params.length - 1;
        while (i >= 0) {
          param = params[i].split('=')[0];
          if (param === p_param) {
            params.splice(i, 1);
          }
          i -= 1;
        }
        if (params.length > 0) {
          results = results + '?' + params.join('&');
        }
      }
    }
    return results;
  };
  /**
  	@method loadProgress
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.loadProgress = function(evt) {
    this.trigger(NavigationLoader.LOAD_PROGRESS, {
      progress: (evt.loaded / evt.total) * currentStep.ratio + loaderRatio
    });
    return false;
  };
  /**
  	@method loadComplete
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.loadComplete = function(evt) {
    var queue, step;
    if (evt) {
      this.removeLoader(evt.currentTarget);
    }
    step = loaderSteps[loaderStep];
    if (step) {
      this.assetsLoaded(step.id);
    }
    loaderRatio += step != null ? step.ratio : void 0;
    loaderStep++;
    if (loaderStep >= loaderSteps.length) {
      this.trigger(NavigationLoader.LOAD_COMPLETE);
      this._loaded = true;
    } else {
      currentStep = loaderSteps[loaderStep];
      queue = this.addLoader(currentStep.id);
      this.addFiles(currentStep.data, queue);
      if (queue._loadQueue.length + queue._currentLoads.length === 0) {
        this.loadComplete();
      } else {
        queue.load();
      }
    }
    return false;
  };
  /**
  	Called when the others groups is completely loaded.
  	@method assetsLoaded 
  	@param {String} p_id
  	@private
   */
  NavigationLoader.prototype.assetsLoaded = function(p_id) {
    if (p_id == null) {
      return;
    }
    this.trigger(NavigationLoader.GROUP_ASSETS_LOADED, {
      id: p_id,
      data: this.loader.getGroup(p_id)
    });
    return false;
  };
  return NavigationLoader;
})(EventDispatcher);
/**
Base class to setup the navigation and start loading of dependencies.
@class Caim
@module caim
@extends EventDispatcher
 */
var Caim;
Caim = (function(_super) {
  var wrapper, _mainView, _preloaderView;
  __extends(Caim, _super);
  _mainView = null;
  _preloaderView = null;
  wrapper = null;
  /**
  	@class Caim
  	@constructor
  	@param {BaseView} p_preloaderView The view of the first loading, it's called by the method {{#crossLink "Caim/createPreloaderView:method"}}{{/crossLink}} and attached on container when the preloader assets is completely loaded.
  	@param {String} [p_configPath = "data/config.json"] Path of the navigation configuration file.
  	@param {HTMLElement} [p_wrapper = null] Custom container to attach the navigation.
   */
  function Caim(p_preloaderView, p_configPath, p_wrapper) {
    var loader, _ref, _ref1;
    if (p_configPath == null) {
      p_configPath = "data/config.json";
    }
    if (p_wrapper == null) {
      p_wrapper = null;
    }
    this.preParser = __bind(this.preParser, this);
    this.mainAssetsLoaded = __bind(this.mainAssetsLoaded, this);
    this.preloaderAssetsLoaded = __bind(this.preloaderAssetsLoaded, this);
    this.coreAssetsLoaded = __bind(this.coreAssetsLoaded, this);
    this._showMainView = __bind(this._showMainView, this);
    this._createMainView = __bind(this._createMainView, this);
    this.destroyPreloderView = __bind(this.destroyPreloderView, this);
    this.hidePreloderView = __bind(this.hidePreloderView, this);
    this.showPreloaderView = __bind(this.showPreloaderView, this);
    this.createPreloaderView = __bind(this.createPreloaderView, this);
    this.groupLoaded = __bind(this.groupLoaded, this);
    this.progress = __bind(this.progress, this);
    this.configLoaded = __bind(this.configLoaded, this);
    this.preParserState = __bind(this.preParserState, this);
    if (!(p_preloaderView instanceof BaseView)) {
      throw new Error('The param p_preloaderView is null or the instance of param p_preloaderView is not either BaseView class');
    } else {
      _preloaderView = p_preloaderView;
    }
    wrapper = p_wrapper == null ? document.body : p_wrapper;
    if (wrapper.__instance__ == null) {
      new BaseDOM({
        element: wrapper
      });
    }
    app.root = ((_ref = document.querySelector("base")) != null ? _ref.href : void 0) || ((_ref1 = document.getElementsByTagName("base")[0]) != null ? _ref1.href : void 0);
    app.loader = AssetLoader.getInstance();
    app.detections = Detections.getInstance();
    loader = new NavigationLoader(app.root != null ? app.root + p_configPath : p_configPath);
    loader.on(NavigationLoader.PREPARSER_DATA, this.preParserState);
    loader.on(NavigationLoader.CONFIG_LOADED, this.configLoaded);
    loader.on(NavigationLoader.GROUP_ASSETS_LOADED, this.groupLoaded);
    loader.on(NavigationLoader.LOAD_START, this.createPreloaderView);
    loader.on(NavigationLoader.LOAD_PROGRESS, this.progress);
    loader.on(NavigationLoader.LOAD_COMPLETE, this.hidePreloderView);
    Caim.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method preParserState
  	@param {Event} evt
  	@param {Object} data
  	@private
   */
  Caim.prototype.preParserState = function(evt, data) {
    var _ref;
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        if (typeof _ref.off === "function") {
          _ref.off(NavigationLoader.PREPARSER_DATA, this.preParserState);
        }
      }
    }
    if (typeof this.preParser === "function") {
      this.preParser(data);
    }
    return false;
  };
  /**
  	@method configLoaded
  	@param {Event} evt
  	@private
   */
  Caim.prototype.configLoaded = function(evt) {
    var _ref;
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        if (typeof _ref.off === "function") {
          _ref.off(NavigationLoader.CONFIG_LOADED, this.configLoaded);
        }
      }
    }
    app.config = evt.data;
    app.conditions = app.config.conditions != null ? ConditionsValidation.getInstance(app.config.conditions) : null;
    app.languages = app.config.languages != null ? LanguageData.getInstance() : null;
    return false;
  };
  /**
  	@method progress
  	@param {Event} evt
  	@private
   */
  Caim.prototype.progress = function(evt) {
    if (_preloaderView != null) {
      _preloaderView.progress = evt.progress;
    }
    return false;
  };
  /**
  	@method groupLoaded
  	@param {Event} evt
  	@private
   */
  Caim.prototype.groupLoaded = function(evt) {
    var k, v, _ref;
    switch (evt.id) {
      case 'core':
        this.coreAssetsLoaded();
        break;
      case 'main':
        _ref = app.config.required.main;
        for (k in _ref) {
          v = _ref[k];
          if (v.ext === 'js') {
            _mainView = app.config.required.main[v.id].result = eval(app.config.required.main[v.id].result);
            if (app.config.required.main.content) {
              _mainView.content = window.main['content'];
              delete window.main['content'];
            }
          }
        }
        delete window.main;
        this.mainAssetsLoaded();
        break;
      case 'preloader':
        this.preloaderAssetsLoaded();
        this.createPreloaderView();
        break;
    }
    return false;
  };
  /**
  	@method createPreloaderView
  	@param {Event} [evt=null]
  	@protected
   */
  Caim.prototype.createPreloaderView = function() {
    var _ref;
    if (((_ref = app.config.required.preloader) != null ? _ref.content : void 0) != null) {
      _preloaderView.content = app.config.required.preloader.content;
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
  Caim.prototype.showPreloaderView = function(evt) {
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
  Caim.prototype.hidePreloderView = function(evt) {
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
  Caim.prototype.destroyPreloderView = function(evt) {
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
    return false;
  };
  /**
  	@method _createMainView
  	@private
   */
  Caim.prototype._createMainView = function() {
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
  Caim.prototype._showMainView = function(evt) {
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
  	@protected
   */
  Caim.prototype.coreAssetsLoaded = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return false;
  };
  /**
  	Called only when the preloader assets is completely loaded.
  	@method preloaderAssetsLoaded
  	@param {Event} [evt=null]
  	@protected
   */
  Caim.prototype.preloaderAssetsLoaded = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return false;
  };
  /**
  	Called only when the main assets is completely loaded.
  	@method mainAssetsLoaded
  	@param {Event} [evt=null]
  	@protected
   */
  Caim.prototype.mainAssetsLoaded = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return false;
  };
  Caim.prototype.preParser = function(p_data) {
    return false;
  };
  return Caim;
})(EventDispatcher);
var TemplatePreloaderView;
TemplatePreloaderView = (function(_super) {
  __extends(TemplatePreloaderView, _super);
  function TemplatePreloaderView(p_data, p_className) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_className == null) {
      p_className = null;
    }
    this.destroy = __bind(this.destroy, this);
    this.hide = __bind(this.hide, this);
    this.createStart = __bind(this.createStart, this);
    TemplatePreloaderView.__super__.constructor.call(this, p_data, 'preloaderCustonCSS');
  }
  TemplatePreloaderView.set({
    progress: function(p_value) {
      if (this.content != null) {
        return this.text = this.content.label + " " + Math.round(p_value * 100) + "%";
      } else {
        return this.text = Math.round(p_value * 100) + "%";
      }
    }
  });
  TemplatePreloaderView.prototype.createStart = function(evt) {
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
    return TemplatePreloaderView.__super__.createStart.apply(this, arguments);
  };
  TemplatePreloaderView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.element, 1, {
      delay: .5,
      opacity: 0,
      onComplete: (function(_this) {
        return function() {
          return TemplatePreloaderView.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };
  TemplatePreloaderView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.killTweensOf(this.element);
    return TemplatePreloaderView.__super__.destroy.apply(this, arguments);
  };
  return TemplatePreloaderView;
})(BaseView);
var Preloader;
Preloader = (function(_super) {
  __extends(Preloader, _super);
  function Preloader() {
    Preloader.__super__.constructor.call(this, new TemplatePreloaderView());
  }
  return Preloader;
})(Caim);
app.on('windowLoad', (function(_this) {
  return function() {
    return new Preloader();
  };
})(this));
}).call(this);