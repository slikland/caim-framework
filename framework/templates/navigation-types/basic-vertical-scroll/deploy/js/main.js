(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
/**
ViewsData Class
@class ViewsData
@extends EventDispatcher
@final
 */
var ViewsData;
ViewsData = (function(_super) {
  __extends(ViewsData, _super);
  /**
  	Triggered after parsing data of view. 
  	@event VIEW_CREATED
  	@static
   */
  ViewsData.VIEW_CREATED = 'view_created';
  /**
  	Triggered after parsing data of all views of config file. 
  	@event ALL_VIEWS_CREATED
  	@static
   */
  ViewsData.ALL_VIEWS_CREATED = 'all_views_created';
  /**
  	@class ViewsData
  	@constructor
  	@param {Object} p_data
   */
  function ViewsData(p_data) {
    if (p_data == null) {
      throw new Error('The param p_data is null');
    }
    this._data = [];
    this._views = p_data.views;
    ViewsData.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method getData
  	@param {String} p_id
  	@return {Object}
   */
  ViewsData.prototype.getData = function(p_id) {
    if (this._views[p_id] == null) {
      throw new Error('The view with id "' + p_id + '" does not exists in config file');
    }
    return this._views[p_id];
  };
  /**
  	@method get
  	@param {String} p_id
  	@return {Object}
   */
  ViewsData.prototype.get = function(p_id) {
    if (this._data[p_id] != null) {
      return this._data[p_id];
    } else {
      return null;
    }
  };
  /**
  	@method set
  	@param {String} p_view
   */
  ViewsData.prototype.set = function(p_view) {
    if (!this.get(p_view.id)) {
      this._data[p_view.id] = p_view;
    }
    return false;
  };
  /**
  	@method createAll
   */
  ViewsData.prototype.createAll = function() {
    var id;
    for (id in this._views) {
      this.create(id);
    }
    this.trigger(ViewsData.ALL_VIEWS_CREATED, {
      views: this._data
    });
    return false;
  };
  /**
  	@method create
  	@param {String} p_id
  	@return {Object}
   */
  ViewsData.prototype.create = function(p_id) {
    var data, k, klass, subview, v, view, _base, _ref;
    if (this.get(p_id) != null) {
      view = this.get(p_id);
    } else {
      data = this.getData(p_id);
      if (typeof data["class"] === 'string') {
        klass = eval(data["class"]);
        view = new klass(data, data.id + '-view');
        data["class"] = view;
      } else {
        view = data["class"];
      }
    }
    if (view.parentView == null) {
      view.type = 'view';
      view.parentView = app.container;
      if ((_base = app.container).subviews == null) {
        _base.subviews = {};
      }
      app.container.subviews[view.id] = view;
    } else {
      if (typeof view.parentView === 'string') {
        view.parentView = this.get(view.parentView);
      }
    }
    if (view.subviews != null) {
      _ref = view.subviews;
      for (k in _ref) {
        v = _ref[k];
        subview = this.create(v.id);
        subview.type = 'subview';
        subview.parentView = view;
        view.subviews[v.id] = subview;
      }
    }
    this.set(view);
    this.trigger(ViewsData.VIEW_CREATED, {
      view: view
    });
    return view;
  };
  /**
  	@method remove
  	@param {String} p_id
   */
  ViewsData.prototype.remove = function(p_id) {
    this._data[p_id] = null;
    delete this._data[p_id];
    return false;
  };
  /**
  	@method normalize
  	@param {String} p_id
  	@return {String}
   */
  ViewsData.prototype.normalize = function(p_id) {
    var view;
    view = this._views[p_id];
    if ((view != null ? view.parentView : void 0) != null) {
      return this.normalize(view.parentView);
    } else {
      return view != null ? view.id : void 0;
    }
  };
  return ViewsData;
})(EventDispatcher);
/**
BaseNavigationController is a base class for any type of navigation controller.<br>
Please do not instantiate this class. Use the extended classes.
@class BaseNavigationController
@extends EventDispatcher
@submodule caim.navigation.core
 */
var BaseNavigationController;
BaseNavigationController = (function(_super) {
  __extends(BaseNavigationController, _super);
  /**
  	@event CHANGE
  	@static
   */
  BaseNavigationController.CHANGE = 'base_navigation_controller_change';
  /**
  	@event CHANGE_VIEW
  	@static
   */
  BaseNavigationController.CHANGE_VIEW = 'base_navigation_controller_change_view';
  /**
  	@event CHANGE_SUBVIEW
  	@static
   */
  BaseNavigationController.CHANGE_SUBVIEW = 'base_navigation_controller_change_subview';
  /**
  	@class BaseNavigationController
  	@constructor
   */
  function BaseNavigationController() {
    this._removeFromWrapper = __bind(this._removeFromWrapper, this);
    this._appendToWrapper = __bind(this._appendToWrapper, this);
    this.change = __bind(this.change, this);
    BaseNavigationController.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method setup
  	@param {Object} p_data
  	@protected
   */
  BaseNavigationController.prototype.setup = function(p_data) {
    var _ref, _ref1;
    this._views = new ViewsData(p_data);
    if (((_ref = app.navigation) != null ? _ref.instantiateViews : void 0) || ((_ref1 = app.navigation) != null ? _ref1.instantiateViews : void 0) === void 0) {
      this._views.createAll();
    }
    return false;
  };
  /**
  	@method start
  	@param {String} [p_id=null]
   */
  BaseNavigationController.prototype.start = function(p_id) {
    var view, _ref;
    if (p_id == null) {
      p_id = null;
    }
    if (this._started) {
      throw new Error('The instance of BaseNavigationController already started');
    }
    this._started = true;
    if (((_ref = app.config.navigation) != null ? _ref.defaultView : void 0) == null) {
      throw new Error('The property "defaultView" in config file is null or undefined.');
    }
    if (!p_id) {
      view = app.config.navigation.defaultView;
    } else {
      view = p_id;
    }
    this.goto(view);
    return false;
  };
  /**
  	@method goto
  	@param {String} p_id
   */
  BaseNavigationController.prototype.goto = function(p_id) {
    if (!this._started) {
      throw new Error('The instance of BaseNavigationController is not started');
    }
    this.change(p_id);
    return false;
  };
  /**
  	__This getter must be overridden with a type of navigation controller it will be a extended.__<br>
  	Returns the type of navigation controller.
  	@attribute type
  	@type {String}
  	@readOnly
   */
  BaseNavigationController.get({
    type: function() {
      throw new Error('Override the visibleViews getter in ' + this.constructor.type + ' class');
    }
  });
  /**
  	__This getter must be overridden with a current visible views of navigation controller it will be a extended.__<br>
  	Returns the current visible views in DOM.
  	@attribute visibleViews
  	@type {Array}
  	@readOnly
   */
  BaseNavigationController.get({
    visibleViews: function() {
      throw new Error('Override the visibleViews getter in ' + this.constructor.name + ' class');
    }
  });
  /**
  	__This getter must be overridden with a current view of navigation controller it will be a extended.__<br>
  	Returns the current view.
  	@attribute currentView
  	@type {BaseView}
  	@readOnly
   */
  BaseNavigationController.get({
    currentView: function() {
      throw new Error('Override the currentView getter in ' + this.constructor.name + ' class');
    }
  });
  /**
  	__This getter must be overridden with a previous view of navigation controller it will be a extended.__<br>
  	Returns the previous view.
  	@attribute previousView
  	@type {BaseView}
  	@readOnly
   */
  BaseNavigationController.get({
    previousView: function() {
      throw new Error('Override the previousView getter in ' + this.constructor.name + ' class');
    }
  });
  /**
  	__This getter must be overridden with a data object of navigation controller it will be a extended.__<br>
  	Returns the data.
  	@attribute data
  	@type {Object}
  	@readOnly
   */
  BaseNavigationController.get({
    data: function() {
      throw new Error('Override the data getter in ' + this.constructor.name + ' class');
    }
  });
  /**
  	__This getter must be overridden with a change method of navigation controller it will be a extended.__<br>
  	This method trigger the event {{#crossLink "BaseNavigationController/CHANGE_VIEW:event"}}{{/crossLink}} after complete.
  	@method data
  	@param {String} p_id
  	@protected
   */
  BaseNavigationController.prototype.change = function(p_id) {
    MetaController.getInstance().change(this.currentView.meta);
    this.trigger(BaseNavigationController.CHANGE_VIEW, {
      data: this.data
    });
    return false;
  };
  /**
  	@method _appendToWrapper
  	@param {BaseView} p_view
  	@private
   */
  BaseNavigationController.prototype._appendToWrapper = function(p_view) {
    var wrapper;
    wrapper = p_view.parentView;
    if (p_view.parentView.subviewsWrapper != null) {
      if (p_view.attachToParentWrapper == null) {
        wrapper = p_view.parentView.subviewsWrapper;
      } else {
        wrapper = p_view.parentView.find(p_view.attachToParentWrapper);
      }
    }
    if (wrapper == null) {
      throw new Error('The instance of wrapper is not attached on the parent view');
    } else {
      wrapper.appendChild(p_view);
    }
    return false;
  };
  /**
  	@method _removeFromWrapper
  	@param {BaseView} p_view
  	@private
   */
  BaseNavigationController.prototype._removeFromWrapper = function(p_view) {
    var err, wrapper;
    wrapper = (p_view != null ? p_view.parent : void 0) || (p_view != null ? p_view.parentView : void 0);
    try {
      if (wrapper != null) {
        wrapper.removeChild(p_view);
      }
    } catch (_error) {
      err = _error;
      console.log(err.stack);
    }
    return false;
  };
  return BaseNavigationController;
})(EventDispatcher);
/**
@class ScrollNavigationController
@extends BaseNavigationController
@submodule caim.navigation.types
 */
var ScrollNavigationController;
ScrollNavigationController = (function(_super) {
  var viewScrollPercent;
  __extends(ScrollNavigationController, _super);
  ScrollNavigationController.SCROLL = 'navigation_controller_scroll';
  viewScrollPercent = 0;
  function ScrollNavigationController() {
    this._onAutoKill = __bind(this._onAutoKill, this);
    this._onCompleteAutoScroll = __bind(this._onCompleteAutoScroll, this);
    this._onStartAutoScroll = __bind(this._onStartAutoScroll, this);
    this._scrollToView = __bind(this._scrollToView, this);
    this._hide = __bind(this._hide, this);
    this._show = __bind(this._show, this);
    this._snapping = __bind(this._snapping, this);
    this._isVisible = __bind(this._isVisible, this);
    this._onScroll = __bind(this._onScroll, this);
    this.change = __bind(this.change, this);
    ScrollNavigationController.__super__.constructor.apply(this, arguments);
  }
  ScrollNavigationController.get({
    type: function() {
      return 'scroll';
    }
  });
  ScrollNavigationController.get({
    visibleViews: function() {
      return this._visibleViews;
    }
  });
  ScrollNavigationController.get({
    currentView: function() {
      return this._currentView;
    }
  });
  ScrollNavigationController.get({
    previousView: function() {
      return this._previousView;
    }
  });
  ScrollNavigationController.get({
    data: function() {
      return {
        currentView: this.currentView,
        previousView: this.previousView,
        visibleViews: this._visibleViews
      };
    }
  });
  ScrollNavigationController.prototype.start = function(p_id) {
    var k, v, view, _base, _ref, _ref1;
    if (p_id == null) {
      p_id = null;
    }
    if (app.config.navigation.options != null) {
      this._options = app.config.navigation.options;
    } else {
      throw new Error('The options object in config.json file must be created to use this navigation type, see a example in source code.');
      /*
      			"navigation":{
      				"type":"scroll",
      				"options":{
      					"orientation":"vertical",
      					"scrollToTime":0,
      					"pauseInvisibleViews":true,
      					"percentToShow":0.5,
      					"snap":{
      						"delay":0
      					}
      				}
      			}
       */
    }
    this._visibleViews = this._visibleViews || [];
    this._autoScrolling = false;
    this._orientation = (this._options.orientation != null) && (this._options.orientation === 'vertical' || this._options.orientation === 'horizontal') ? this._options.orientation : 'vertical';
    this._snapDelay = (((_ref = this._options.snap) != null ? _ref.delay : void 0) != null) && this._options.snap.delay > 0 ? this._options.snap.delay : 0;
    this._scrollToTime = this._options.scrollToTime >= 0 ? this._options.scrollToTime : .5;
    this._percentToShow = this._options.percentToShow >= 0 || this._options.percentToShow <= 1 ? this._options.percentToShow : .5;
    this._pauseInvisibleViews = this._options.pauseInvisibleViews != null ? this._options.pauseInvisibleViews : true;
    _ref1 = app.config.views;
    for (k in _ref1) {
      v = _ref1[k];
      view = this._views.create(k);
      if ((_base = view.data).snap == null) {
        _base.snap = true;
      }
      this._appendToWrapper(view);
      view.createStart();
    }
    window.addEventListener("scroll", this._onScroll);
    this._onScroll(null);
    return ScrollNavigationController.__super__.start.call(this, p_id);
  };
  ScrollNavigationController.prototype.change = function(p_id) {
    var _ref;
    if (((_ref = this._currentView) != null ? _ref.id : void 0) === p_id) {
      return;
    }
    if (this._currentView != null) {
      this._previousView = this._currentView;
    }
    this._currentView = this._views.create(p_id);
    return this._scrollToView(p_id);
  };
  ScrollNavigationController.prototype._onScroll = function(evt) {
    var currentView, index, k, v, view, viewBounds, viewOffset, _ref, _ref1;
    this._visibleViews = this._visibleViews || [];
    currentView = null;
    _ref = app.config.views;
    for (k in _ref) {
      v = _ref[k];
      view = this._views.create(k);
      if (this._orientation === 'vertical') {
        viewOffset = view.height + view.element.offsetTop;
      } else {
        viewOffset = view.width + view.element.offsetLeft;
      }
      viewBounds = viewOffset - this.scrollValue;
      if (this._isVisible(view)) {
        if (this._visibleViews.indexOf(view) < 0) {
          this._visibleViews.push(view);
        }
      } else {
        index = this._visibleViews.indexOf(view);
        if (index >= 0) {
          ArrayUtils.removeItemByIndex(index, this._visibleViews);
        }
      }
      if (viewBounds > (this.windowValue * this._percentToShow) && currentView === null) {
        currentView = view;
        this._snapping(view);
        if (((_ref1 = this._currentView) != null ? _ref1.id : void 0) === view.id) {
          continue;
        }
        if (this._currentView != null) {
          this._previousView = this._currentView;
        }
        this._currentView = this._views.create(view.id);
        this._show(view);
      } else {
        this._hide(view);
      }
    }
    return this.trigger(ScrollNavigationController.SCROLL, {
      percent: this.scrollPercent,
      value: this.scrollValue
    });
  };
  ScrollNavigationController.prototype._isVisible = function(p_view) {
    var elementBottom, elementLeft, elementRight, elementTop;
    if (this._orientation === 'vertical') {
      elementTop = p_view.element.offsetTop;
      elementBottom = elementTop + p_view.height;
      return (this.scrollValue + window.innerHeight) > elementTop && this.scrollValue + window.innerHeight < (elementBottom + window.innerHeight);
    } else {
      elementLeft = p_view.element.offsetLeft;
      elementRight = elementLeft + p_view.width;
      return (this.scrollValue + window.innerWidth) > elementLeft && this.scrollValue + window.innerWidth < (elementRight + window.innerWidth);
    }
  };
  ScrollNavigationController.prototype._snapping = function(p_view) {
    if (!this._autoScrolling && this._snapDelay > 0) {
      TweenMax.killDelayedCallsTo(this._scrollToView);
      if (p_view.data.snap || p_view.snap) {
        return TweenMax.delayedCall(this._snapDelay, this._scrollToView, [p_view.id]);
      }
    }
  };
  ScrollNavigationController.prototype._show = function(p_view) {
    this.trigger(BaseNavigationController.CHANGE_VIEW, {
      data: this.data
    });
    if (!p_view.showed) {
      return p_view.showStart();
    } else {
      if (this._pauseInvisibleViews) {
        return p_view.resume();
      }
    }
  };
  ScrollNavigationController.prototype._hide = function(p_view) {
    if (!this._isVisible(p_view)) {
      if (this._pauseInvisibleViews) {
        p_view.pause();
      }
    }
    if (p_view.id !== this._currentView.id) {
      if (p_view.showed) {
        return p_view.hideStart();
      }
    }
  };
  ScrollNavigationController.prototype._scrollToView = function(p_id) {
    var orientation, view;
    view = this._views.create(p_id);
    TweenMax.killDelayedCallsTo(this._scrollToView);
    TweenMax.killTweensOf(window);
    if (this._orientation === 'vertical') {
      orientation = {
        y: view.element.offsetTop,
        onAutoKill: this._onAutoKill
      };
    } else {
      orientation = {
        x: view.element.offsetLeft,
        onAutoKill: this._onAutoKill
      };
    }
    return TweenMax.to(window, this._scrollToTime, {
      scrollTo: orientation,
      ease: Quad.easeOut,
      onStart: this._onStartAutoScroll,
      onComplete: this._onCompleteAutoScroll,
      onCompleteParams: [view]
    });
  };
  ScrollNavigationController.prototype._onStartAutoScroll = function() {
    return this._autoScrolling = true;
  };
  ScrollNavigationController.prototype._onCompleteAutoScroll = function(p_view) {
    this._autoScrolling = false;
    return this._show(p_view);
  };
  ScrollNavigationController.prototype._onAutoKill = function(evt) {
    return this._autoScrolling = false;
  };
  ScrollNavigationController.get({
    scrollPercent: function() {
      var body, doc;
      body = document.body;
      doc = document.documentElement;
      if (this._orientation === 'vertical') {
        return (doc.scrollTop + body.scrollTop) / (doc.scrollHeight - doc.clientHeight);
      } else {
        return (doc.scrollLeft + body.scrollLeft) / (doc.scrollWidth - doc.clientWidth);
      }
    }
  });
  ScrollNavigationController.get({
    scrollValue: function() {
      var body, doc;
      body = document.body;
      doc = document.documentElement;
      if (this._orientation === 'vertical') {
        if (typeof pageYOffset !== 'undefined') {
          return pageYOffset;
        } else {
          doc = doc.clientHeight ? doc : body;
          return doc.scrollTop;
        }
      } else {
        if (typeof pageXOffset !== 'undefined') {
          return pageXOffset;
        } else {
          doc = doc.clientWidth ? doc : body;
          return doc.scrollLeft;
        }
      }
    }
  });
  ScrollNavigationController.get({
    windowValue: function() {
      if (this._orientation === 'vertical') {
        return window.innerHeight;
      } else {
        return window.innerWidth;
      }
    }
  });
  return ScrollNavigationController;
})(BaseNavigationController);
/**
@class NavigationRouter
@extends EventDispatcher
@final
 */
var NavigationRouter;
NavigationRouter = (function(_super) {
  __extends(NavigationRouter, _super);
  /**
  	@event CHANGE
  	@static
   */
  NavigationRouter.CHANGE = 'route_path_change';
  /**
  	@event CHANGE_ROUTE
  	@static
   */
  NavigationRouter.CHANGE_ROUTE = 'route_match';
  /**
  	@class NavigationRouter
  	@constructor
   */
  function NavigationRouter() {
    this._onPathChange = __bind(this._onPathChange, this);
    this._routes = [];
    this._numRoutes = 0;
    this._trigger = true;
    NavigationRouter.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method setup
  	@param {String} [p_rootPath = null] Use root path if not set in base tag
  	@param {Boolean} [p_forceHashBang = false] Force hash bang for old browsers
  	@return {NavigationRouter}
   */
  NavigationRouter.prototype.setup = function(p_rootPath, p_forceHashBang) {
    var base, err, path, _ref;
    if (p_rootPath == null) {
      p_rootPath = null;
    }
    if (p_forceHashBang == null) {
      p_forceHashBang = false;
    }
    if (!p_rootPath) {
      p_rootPath = window.location.href;
      try {
        base = document.getElementsByTagName('base');
        if (base.length > 0) {
          base = base[0];
          p_rootPath = base.getAttribute('href');
        }
      } catch (_error) {
        err = _error;
        console.log(err.stack);
      }
    }
    this._rootPath = p_rootPath.replace(/^(.*?)\/*$/, '$1/');
    this._rawPath = '';
    if (p_forceHashBang) {
      this._usePushState = false;
    } else {
      this._usePushState = (typeof window !== "undefined" && window !== null ? (_ref = window.history) != null ? _ref.pushState : void 0 : void 0) != null;
    }
    if (this._usePushState) {
      if (this._rootPath !== window.location.href) {
        path = this._getPath();
        this.goto(path, false);
      }
      if (window.addEventListener) {
        window.addEventListener('popstate', this._onPathChange);
      } else {
        window.attachEvent("onpopstate", this._onPathChange);
      }
    } else {
      if (this._rootPath !== window.location.href) {
        path = this._getPath();
        window.location = this._rootPath + '#!/' + path;
      }
      if (window.addEventListener) {
        window.addEventListener('hashchange', this._onPathChange);
      } else {
        window.attachEvent("onhashchange", this._onPathChange);
      }
    }
    this._onPathChange();
    return this;
  };
  /**
  	@method _getPath
  	@return {String}
  	@private
   */
  NavigationRouter.prototype._getPath = function() {
    var rawPath;
    rawPath = window.location.href.replace(/\/*$/g, '');
    if (rawPath.indexOf(this._rootPath.replace(/\/*$/g, '')) === 0) {
      rawPath = rawPath.substr(this._rootPath.length);
    }
    rawPath = rawPath.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    return rawPath;
  };
  /**
  	@method _parsePath
  	@param {String} p_rawPath
  	@return {Object}
  	@private
   */
  NavigationRouter.prototype._parsePath = function(p_rawPath) {
    var params, path, pathParts;
    pathParts = /^(?:#?!?\/*)([^?]*\??.*?)$/.exec(p_rawPath);
    path = pathParts[1];
    params = this._parseParams(pathParts[1]);
    return {
      rawPath: p_rawPath,
      path: path,
      params: params
    };
  };
  /**
  	@method _parseParams
  	@param {String} p_path
  	@return {Object}
  	@private
   */
  NavigationRouter.prototype._parseParams = function(p_path) {
    var c, o, pRE, params;
    params = {};
    if (p_path) {
      pRE = /([^?=&]+)=(([^&]*))?/g;
      c = 0;
      while (o = pRE.exec(p_path)) {
        params[o[1]] = o[2];
      }
    }
    return params;
  };
  /**
  	@method _onPathChange
  	@param {Event} [evt = null]
  	@private
   */
  NavigationRouter.prototype._onPathChange = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._currentPath = this._getPath();
    if (this._trigger) {
      this._triggerPath(this._currentPath);
    }
    this._trigger = true;
    if (this._replaceData) {
      this.goto(this._replaceData[0], false);
      this._replaceData = null;
    } else {
      this.trigger(NavigationRouter.CHANGE, this._parsePath(this._currentPath));
    }
    return false;
  };
  /**
  	@method _triggerPath
  	@param {String} p_path
  	@private
   */
  NavigationRouter.prototype._triggerPath = function(p_path) {
    var i, pathData, route, routeData, routes, _ref;
    pathData = this._parsePath(p_path);
    _ref = this._checkRoutes(pathData.path), routes = _ref[0], routeData = _ref[1];
    if (routes) {
      i = routes.length;
      while (i-- > 0) {
        route = routes[i];
        this.trigger(NavigationRouter.CHANGE_ROUTE, {
          route: route.route,
          routeData: routeData,
          path: p_path,
          pathData: pathData,
          data: route.data
        });
      }
    }
    return false;
  };
  /**
  	@method getCurrentPath
  	@return {String}
   */
  NavigationRouter.prototype.getCurrentPath = function() {
    return this._currentPath;
  };
  /**
  	@method getParsedPath
  	@return {Object}
   */
  NavigationRouter.prototype.getParsedPath = function() {
    return this._parsePath(this._currentPath);
  };
  /**
  	@method goto
  	@param {String} p_path
  	@param {Boolean} [p_trigger = true]
   */
  NavigationRouter.prototype.goto = function(p_path, p_trigger) {
    if (p_trigger == null) {
      p_trigger = true;
    }
    p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    if (p_path === this._currentPath) {
      return;
    }
    this._currentPath = p_path;
    this._trigger = p_trigger;
    if (this._usePushState) {
      history.pushState({}, p_path, this._rootPath + p_path);
      if (this._trigger) {
        this._onPathChange();
      }
      this._trigger = true;
    } else {
      window.location.hash = '!' + '/' + p_path;
    }
    return false;
  };
  /**
  	@method replace
  	@param {String} p_path
  	@param {Boolean} [p_trigger = false]
   */
  NavigationRouter.prototype.replace = function(p_path, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    if (p_path !== this._currentPath) {
      this._currentPath = p_path;
      if (this._usePushState) {
        history.replaceState({}, p_path, this._rootPath + p_path);
      } else {
        this._trigger = false;
        history.back();
        this._replaceData = [p_path];
      }
    }
    if (p_trigger) {
      this.triggerPath(p_path);
    }
    return false;
  };
  /**
  	@method triggerPath
  	@param {String} p_path
   */
  NavigationRouter.prototype.triggerPath = function(p_path) {
    this._triggerPath(p_path);
    return false;
  };
  /**
  	@method triggerCurrentPath
  	@param {String} p_path
   */
  NavigationRouter.prototype.triggerCurrentPath = function() {
    this._triggerPath(this._getPath());
    return false;
  };
  /**
  	Add a route
  	@method addRoute
  	@param {String} p_route
  	@param {Object} [p_data = null]
   */
  NavigationRouter.prototype.addRoute = function(p_route, p_data, p_options) {
    var err, i, labels, o, p, r, routeRE, strictParams, strictTralingSlash;
    if (p_data == null) {
      p_data = null;
    }
    if (p_options == null) {
      p_options = {
        strict: false
      };
    }
    if (typeof p_route !== 'string') {
      i = p_route.length;
      while (i-- > 0) {
        this.addRoute(p_route[i], p_data);
      }
    }
    r = /\{(.*?)\}/g;
    labels = [];
    p = 0;
    while (o = r.exec(p_route)) {
      labels[p++] = o[1];
    }
    r = p_route;
    if (r === '*') {
      r = '.*';
    }
    try {
      r = r.replace(/(.*?)\/*$/, '$1');
      strictTralingSlash = '(\/)?';
      strictParams = '(?:\\?.*)?';
      if (!!p_options.strict) {
        strictTralingSlash = '';
        strictParams = '';
      }
      if (r === '') {
        routeRE = new RegExp("(?:" + r.replace(/\{.*?\}/g, "(.+?)") + (")" + strictParams + "$"), 'g');
      } else {
        routeRE = new RegExp("(?:" + r.replace(/\{.*?\}/g, "(.+?)") + ("" + strictTralingSlash + ")" + strictParams + "$"), 'g');
      }
    } catch (_error) {
      err = _error;
      console.log(err.stack);
      return;
    }
    this._routes[this._numRoutes++] = {
      data: p_data,
      route: p_route,
      routeRE: routeRE,
      labels: labels,
      numLabels: labels.length,
      numSlashes: p_route.split('/').length
    };
    this._routes.sort(this._sortRoutes);
    return false;
  };
  /**
  	Remove a route
  	@method removeRoute
  	@param {String} p_route
   */
  NavigationRouter.prototype.removeRoute = function(p_route) {
    var i, route;
    i = this._numRoutes;
    while (i-- > 0) {
      route = this._routes[i];
      if (route.route === p_route) {
        this._routes.splice(i, 1);
      }
    }
    this._numRoutes = this._routes.length;
    return false;
  };
  /**
  	Remove all routes
  	@method removeAllRoutes
   */
  NavigationRouter.prototype.removeAllRoutes = function() {
    this._routes.length = 0;
    return this._numRoutes = this._routes.length;
  };
  /**
  	@method _checkRoutes
  	@param {String} p_path
  	@private
  	@return {Array}
   */
  NavigationRouter.prototype._checkRoutes = function(p_path) {
    var data, foundRoute, i, j, label, o, re, route, routes, routesIndex, v, _i, _len, _ref;
    i = this._numRoutes;
    foundRoute = null;
    data = null;
    routes = [];
    routesIndex = 0;
    p_path = '/' + p_path;
    while (i-- > 0) {
      route = this._routes[i];
      if (foundRoute) {
        if (route.route === foundRoute) {
          routes[routesIndex++] = route;
        } else {
          break;
        }
      }
      re = route.routeRE;
      re.lastIndex = 0;
      if (!(o = re.exec(p_path))) {
        continue;
      }
      data = {};
      routes[routesIndex++] = route;
      foundRoute = route.route;
      _ref = route.labels;
      for (j = _i = 0, _len = _ref.length; _i < _len; j = ++_i) {
        label = _ref[j];
        v = o[j + 1];
        data[label] = v;
      }
    }
    return [routes, data];
  };
  /**
  	@method _sortRoutes
  	@param {String} p_a
  	@param {String} p_b
  	@private
  	@return {Number}
   */
  NavigationRouter.prototype._sortRoutes = function(p_a, p_b) {
    if (p_a.numLabels < p_b.numLabels) {
      return -1;
    }
    if (p_a.numLabels > p_b.numLabels) {
      return 1;
    }
    if (p_a.numSlashes < p_b.numSlashes) {
      return -1;
    }
    if (p_a.numSlashes > p_b.numSlashes) {
      return 1;
    }
    if (p_a.route === p_b.route) {
      return 0;
    }
    if (p_a.route < p_b.route) {
      return -1;
    }
    if (p_a.route > p_b.route) {
      return 1;
    }
    return 0;
  };
  NavigationRouter.prototype._getParams = function() {
    var decoded, k, params, pathData, v;
    pathData = this._parsePath(this._currentPath);
    params = pathData['params'];
    for (k in params) {
      v = params[k];
      v = decodeURIComponent(v);
      try {
        decoded = JSON.parse(v);
        if (typeof decoded !== 'string') {
          v = decoded;
        }
      } catch (_error) {}
      params[k] = v;
    }
    return params;
  };
  NavigationRouter.prototype._setParams = function(params) {
    var k, pArr, path, pathData, v;
    pathData = this._parsePath(this._currentPath);
    pArr = [];
    for (k in params) {
      v = params[k];
      try {
        if (typeof v !== 'string') {
          v = JSON.stringify(v);
        }
      } catch (_error) {}
      pArr.push(k + '=' + encodeURIComponent(v));
      params[k] = v;
    }
    path = pathData.path;
    if (pArr.length > 0) {
      path = path + '?' + pArr.join('&');
    }
    return this.replace(path);
  };
  NavigationRouter.prototype.getParam = function(name) {
    var params;
    params = this._getParams();
    return params[name];
  };
  NavigationRouter.prototype.setParam = function(name, value) {
    var params;
    params = this._getParams();
    params[name] = value;
    return this._setParams(params);
  };
  NavigationRouter.prototype.removeParam = function(name) {
    var params;
    params = this._getParams();
    params[name] = null;
    delete params[name];
    return this._setParams(params);
  };
  return NavigationRouter;
})(EventDispatcher);
/**
Navigation Class
The instance of this class can be accessed by `app.navigation` wrapper
@class Navigation
@extends EventDispatcher
@final
 */
var Navigation;
Navigation = (function(_super) {
  var _controller, _router;
  __extends(Navigation, _super);
  /**
  	@event CHANGE_ROUTE
  	@static
   */
  Navigation.CHANGE_ROUTE = 'navigation_change_route';
  /**
  	@event CHANGE_VIEW
  	@static
   */
  Navigation.CHANGE_VIEW = 'navigation_change_view';
  /**
  	@event CHANGE_INTERNAL_VIEW
  	@static
   */
  Navigation.CHANGE_INTERNAL_VIEW = 'navigation_change_internal_view';
  _controller = null;
  _router = null;
  /**
  	@class Navigation
  	@constructor
  	@param {BaseNavigationController} p_controller
   */
  function Navigation(p_controller) {
    if (p_controller == null) {
      p_controller = null;
    }
    this._change = __bind(this._change, this);
    this._changeRoute = __bind(this._changeRoute, this);
    this._changeView = __bind(this._changeView, this);
    this.getRouteByView = __bind(this.getRouteByView, this);
    this.getViewByRoute = __bind(this.getViewByRoute, this);
    this.gotoView = __bind(this.gotoView, this);
    this.gotoDefault = __bind(this.gotoDefault, this);
    this.replaceRoute = __bind(this.replaceRoute, this);
    this.gotoRoute = __bind(this.gotoRoute, this);
    this.setRoute = __bind(this.setRoute, this);
    this.goto = __bind(this.goto, this);
    this.start = __bind(this.start, this);
    this.setup = __bind(this.setup, this);
    if (!(p_controller instanceof BaseNavigationController)) {
      throw new Error('The instance of ' + p_controller + ' class is not either BaseNavigationController class');
    }
    _controller = p_controller;
    _router = new NavigationRouter();
    app.navigation = this;
    Navigation.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method setup
  	@param {Object} p_data
   */
  Navigation.prototype.setup = function(p_data) {
    var k, v, _ref, _ref1, _ref2, _ref3;
    _controller.on(BaseNavigationController.CHANGE, this._change);
    _controller.on(BaseNavigationController.CHANGE_VIEW, this._changeView);
    _controller.setup(p_data);
    _router.on(NavigationRouter.CHANGE, this._change);
    _router.on(NavigationRouter.CHANGE_ROUTE, this._changeRoute);
    _router.setup(app.root, (_ref = app.config.navigation) != null ? _ref.forceHashBang : void 0);
    _ref1 = p_data.views;
    for (k in _ref1) {
      v = _ref1[k];
      if (v.route != null) {
        _router.addRoute(v.route, null, {
          strict: !!v.strictRoute || false
        });
      }
    }
    if (((_ref2 = app.config.navigation) != null ? _ref2.autoStart : void 0) || ((_ref3 = app.config.navigation) != null ? _ref3.autoStart : void 0) === void 0) {
      this.start();
    }
    return false;
  };
  /**
  	@method start
  	@param {Event} [evt=null]
   */
  Navigation.prototype.start = function(evt) {
    var current, languages, parts, pathData, route, routes, viewID;
    if (evt == null) {
      evt = null;
    }
    viewID = null;
    pathData = _router._parsePath(_router.getCurrentPath());
    routes = _router._checkRoutes(pathData.path)[0];
    if (routes.length > 0) {
      current = routes[0].route;
      viewID = this.getViewByRoute(current);
    } else {
      viewID = null;
    }
    if (app.languages) {
      languages = app.languages;
      if (languages["default"] && viewID) {
        parts = this.routeData.raw.split('/');
        if (!languages.hasLanguage(parts[0], 'sufix')) {
          if (app.config.views[viewID].route) {
            route = app.config.views[viewID].route;
          } else {
            route = '/';
          }
          this.replaceRoute(route);
        }
      }
    }
    _controller.start(viewID);
    return false;
  };
  /**
  	Returns the visible views in DOM
  	@property visibleViews
  	@type {Array}
  	@readOnly
   */
  Navigation.get({
    visibleViews: function() {
      return this._visibleViews || _controller.visibleViews;
    }
  });
  /**
  	Returns the current view
  	@property currentView
  	@type {BaseView}
  	@readOnly
   */
  Navigation.get({
    currentView: function() {
      return this._currentView || _controller.currentView;
    }
  });
  /**
  	Returns the previous view
  	@property previousView
  	@type {BaseView}
  	@readOnly
   */
  Navigation.get({
    previousView: function() {
      return this._previousView || _controller.previousView;
    }
  });
  /**
  	Returns the route data
  	@property routeData
  	@type {Object}
  	@readOnly
   */
  Navigation.get({
    routeData: function() {
      var pathData, results, routeData, _ref, _ref1;
      pathData = _router._parsePath(_router.getCurrentPath());
      routeData = _router._checkRoutes(pathData.path);
      results = {};
      if (routeData != null) {
        results['raw'] = pathData.rawPath;
        results['params'] = pathData.params;
        if (app.languages) {
          results['language-iso'] = app.languages.current.iso;
          results['language-sufix'] = app.languages.current.sufix;
        }
        results['route'] = (_ref = routeData[0]) != null ? (_ref1 = _ref[0]) != null ? _ref1.route : void 0 : void 0;
        results['parsed'] = routeData[1];
      }
      return results;
    }
  });
  /**
  	Returns the instance of router controller
  	@property router
  	@type {NavigationRouter}
  	@readOnly
   */
  Navigation.get({
    router: function() {
      return _router;
    }
  });
  /**
  	Returns the instance of navigation controller
  	@property navigation
  	@type {BaseNavigationController}
  	@readOnly
   */
  Navigation.get({
    controller: function() {
      return _controller;
    }
  });
  /**
  	@method goto
  	@param {String|Object} p_value
  	@deprecated Uses the {{#crossLink "Navigation/gotoRoute:method"}}{{/crossLink}} or {{#crossLink "Navigation/gotoView:method"}}{{/crossLink}}
   */
  Navigation.prototype.goto = function(p_value, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    throw new Error('This method is already deprecated.');
    return false;
  };
  /**
  	@method setRoute
  	@param {String} p_value
  	@param {Boolean} [p_trigger=false]
   */
  Navigation.prototype.setRoute = function(p_value, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    this.gotoRoute(p_value, p_trigger);
    return false;
  };
  /**
  	@method gotoRoute
  	@param {String} p_value
  	@param {Boolean} [p_trigger=false]
   */
  Navigation.prototype.gotoRoute = function(p_value, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    if (p_value == null) {
      return;
    }
    if (p_value.indexOf('/') === 0) {
      if (app.languages) {
        _router.goto('/' + app.languages.current.sufix + p_value, p_trigger);
      } else {
        _router.goto(p_value, p_trigger);
      }
    } else {
      throw new Error('The value "' + p_value + '" is not a valid format to route ("/example")');
    }
    return false;
  };
  /**
  	@method replaceRoute
  	@param {String} p_value
  	@param {Boolean} [p_trigger=false]
   */
  Navigation.prototype.replaceRoute = function(p_value, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    if (p_value == null) {
      return;
    }
    if (p_value.indexOf('/') === 0) {
      if (app.languages) {
        _router.replace('/' + app.languages.current.sufix + p_value, p_trigger);
      } else {
        _router.replace(p_value, p_trigger);
      }
    } else {
      throw new Error('The value "' + p_value + '" is not a valid format to route ("/example")');
    }
    return false;
  };
  /**
  	@method gotoDefault
   */
  Navigation.prototype.gotoDefault = function(p_trigger, p_replace) {
    var view, _ref;
    if (p_trigger == null) {
      p_trigger = false;
    }
    if (p_replace == null) {
      p_replace = null;
    }
    if (((_ref = app.config.navigation) != null ? _ref.defaultView : void 0) != null) {
      view = app.config.navigation.defaultView;
      if (app.config.views[view].route) {
        this.gotoRoute(this.getRouteByView(view), p_trigger);
      } else {
        this.gotoView(view, p_replace, p_trigger);
      }
    }
    return false;
  };
  /**
  	@method gotoView
  	@param {String} p_value
   */
  Navigation.prototype.gotoView = function(p_value, p_replace, p_trigger) {
    if (p_replace == null) {
      p_replace = null;
    }
    if (p_trigger == null) {
      p_trigger = false;
    }
    if (p_value.indexOf('/') === 0) {
      throw new Error('The value "' + p_value + '" is not a valid format to viewID ("areaID")');
    } else {
      _controller.goto(p_value);
      if (p_replace != null) {
        this.replaceRoute(p_replace, p_trigger);
      }
    }
    return false;
  };
  /**
  	@method getViewByRoute
  	@param {String} p_value
  	@return {String}
  	@default null
   */
  Navigation.prototype.getViewByRoute = function(p_value) {
    var k, view, _ref;
    _ref = app.config.views;
    for (k in _ref) {
      view = _ref[k];
      if ((view.route != null) && view.route === p_value) {
        return view.id;
      }
    }
    return null;
  };
  /**
  	@method getRouteByView
  	@param {String} p_value
  	@return {String}
  	@default null
   */
  Navigation.prototype.getRouteByView = function(p_value) {
    var k, view, _ref;
    _ref = app.config.views;
    for (k in _ref) {
      view = _ref[k];
      if ((view.route != null) && view.id === p_value) {
        return view.route;
      }
    }
    return null;
  };
  /**
  	@method _changeView
  	@param {Event} [evt=null]
  	@private
   */
  Navigation.prototype._changeView = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._currentView = evt.data.currentView;
    this._previousView = evt.data.previousView;
    this._visibleViews = evt.data.visibleViews;
    this._currentView.routeData = this.routeData;
    this.trigger(Navigation.CHANGE_VIEW, {
      data: evt.data
    });
    return false;
  };
  /**
  	@method _changeRoute
  	@param {Event} [evt=null]
  	@private
   */
  Navigation.prototype._changeRoute = function(evt) {
    var data;
    if (evt == null) {
      evt = null;
    }
    data = this.routeData;
    if (data.route != null) {
      this.gotoView(this.getViewByRoute(data.route));
    }
    this.trigger(Navigation.CHANGE_ROUTE, {
      data: data
    });
    return false;
  };
  /**
  	@method _change
  	@param {Event} [evt=null]
  	@private
   */
  Navigation.prototype._change = function(evt) {
    if (evt == null) {
      evt = null;
    }
    switch (evt.type) {
      case BaseNavigationController.CHANGE:
        this.trigger(Navigation.CHANGE_INTERNAL_VIEW, {
          view: evt.view,
          transition: evt.transition
        });
        break;
      case NavigationRouter.CHANGE:
        this.trigger(Navigation.CHANGE, {
          data: this.routeData
        });
    }
    return false;
  };
  return Navigation;
})(EventDispatcher);
/**
NavigationContainer Class
@class NavigationContainer
@extends BaseView
 */
var NavigationContainer;
NavigationContainer = (function(_super) {
  __extends(NavigationContainer, _super);
  /**
  	@class NavigationContainer
  	@param {String} [p_CSSClassName='nav-container']
  	@param {String} [p_element=null] HTMLElement type
  	@constructor
   */
  function NavigationContainer(p_CSSClassName, p_element) {
    if (p_CSSClassName == null) {
      p_CSSClassName = 'nav-container';
    }
    if (p_element == null) {
      p_element = null;
    }
    this.setupNavigation = __bind(this.setupNavigation, this);
    NavigationContainer.__super__.constructor.call(this, null, p_CSSClassName, p_element);
    this._id = 'main';
  }
  /**
  	@method setupNavigation
  	@param {Object} p_data
   */
  NavigationContainer.prototype.setupNavigation = function(p_data) {
    this._navigation = new Navigation(this.controller);
    this._navigation.setup(p_data);
    return false;
  };
  /**
  	Returns the current instance of {{#crossLink "Navigation"}}{{/crossLink}}
  	@attribute navigation
  	@type {Navigation}
  	@readOnly
   */
  NavigationContainer.get({
    navigation: function() {
      return this._navigation;
    }
  });
  /**
  	__This getter must be overridden with a instance of {{#crossLink "BaseNavigationController"}}{{/crossLink}}.__<br>
  	Returns the current navigation controller instance.
  	@attribute controller
  	@type {BaseNavigationController}
  	@readOnly
   */
  NavigationContainer.get({
    controller: function() {
      throw new Error('Override this method with a instance of BaseNavigationController.');
    }
  });
  return NavigationContainer;
})(BaseView);
var TemplateHomeView;
TemplateHomeView = (function(_super) {
  __extends(TemplateHomeView, _super);
  function TemplateHomeView(p_data, p_className) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_className == null) {
      p_className = null;
    }
    this.destroy = __bind(this.destroy, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    TemplateHomeView.__super__.constructor.call(this, p_data, 'home');
  }
  TemplateHomeView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.background = new BaseDOM('div');
    this.appendChild(this.background);
    this.background.className = 'background';
    this.background.css({
      'opacity': 0,
      'height': '100%',
      'background-color': '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
    this.image = new BaseDOM({
      element: this.loader.getResult('image')
    });
    this.background.appendChild(this.image);
    return TemplateHomeView.__super__.createStart.apply(this, arguments);
  };
  TemplateHomeView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.create.apply(this, arguments);
  };
  TemplateHomeView.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.createComplete.apply(this, arguments);
  };
  TemplateHomeView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.showStart.apply(this, arguments);
  };
  TemplateHomeView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.background.element, 1, {
      css: {
        opacity: 1
      },
      onComplete: (function(_this) {
        return function() {
          return TemplateHomeView.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };
  TemplateHomeView.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.showComplete.apply(this, arguments);
  };
  TemplateHomeView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.hideStart.apply(this, arguments);
  };
  TemplateHomeView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.background.element, .5, {
      opacity: 0,
      onComplete: (function(_this) {
        return function() {
          return TemplateHomeView.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };
  TemplateHomeView.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.hideComplete.apply(this, arguments);
  };
  TemplateHomeView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.image.destroy();
    this.background.removeChild(this.image);
    this.image = null;
    TweenMax.killTweensOf(this.background.element);
    this.background.destroy();
    this.removeChild(this.background);
    this.background = null;
    return TemplateHomeView.__super__.destroy.apply(this, arguments);
  };
  return TemplateHomeView;
})(BaseView);
var TemplateSubView;
TemplateSubView = (function(_super) {
  __extends(TemplateSubView, _super);
  function TemplateSubView(p_data, p_className) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_className == null) {
      p_className = null;
    }
    this.destroy = __bind(this.destroy, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.resume = __bind(this.resume, this);
    this.pause = __bind(this.pause, this);
    this.render = __bind(this.render, this);
    this.createStart = __bind(this.createStart, this);
    TemplateSubView.__super__.constructor.call(this, p_data, 'views');
  }
  TemplateSubView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.wrapperTest = new BaseDOM('div');
    this.appendChild(this.wrapperTest);
    this.wrapperTest.className = 'wrapperTest';
    this.wrapperTest.id = 'wrapperTest';
    this.background = new BaseDOM('div');
    this.appendChild(this.background);
    this.background.className = 'background';
    this.background.css({
      'opacity': 0,
      'height': '100%',
      'background-color': '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
    this.image = new BaseDOM({
      element: this.loader.getResult('image')
    });
    this.background.appendChild(this.image);
    return TemplateSubView.__super__.createStart.apply(this, arguments);
  };
  TemplateSubView.prototype.render = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return this.i != null ? this.i : this.i = 0;
  };
  TemplateSubView.prototype.pause = function() {
    clearInterval(this.timeout);
    return TemplateSubView.__super__.pause.apply(this, arguments);
  };
  TemplateSubView.prototype.resume = function() {
    clearInterval(this.timeout);
    this.timeout = setInterval(this.render, 1000);
    return TemplateSubView.__super__.resume.apply(this, arguments);
  };
  TemplateSubView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.create.apply(this, arguments);
  };
  TemplateSubView.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.createComplete.apply(this, arguments);
  };
  TemplateSubView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.showStart.apply(this, arguments);
  };
  TemplateSubView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.resume();
    TweenMax.killTweensOf(this.background.element);
    return TweenMax.to(this.background.element, .5, {
      css: {
        opacity: 1
      },
      onComplete: (function(_this) {
        return function() {
          return TemplateSubView.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };
  TemplateSubView.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.showComplete.apply(this, arguments);
  };
  TemplateSubView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.hideStart.apply(this, arguments);
  };
  TemplateSubView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.killTweensOf(this.background.element);
    return TweenMax.to(this.background.element, .3, {
      css: {
        opacity: 0
      },
      onComplete: (function(_this) {
        return function() {
          return TemplateSubView.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };
  TemplateSubView.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.hideComplete.apply(this, arguments);
  };
  TemplateSubView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.image.destroy();
    this.background.removeChild(this.image);
    this.image = null;
    TweenMax.killTweensOf(this.background.element);
    this.background.destroy();
    this.removeChild(this.background);
    this.background = null;
    return TemplateSubView.__super__.destroy.apply(this, arguments);
  };
  return TemplateSubView;
})(BaseView);
var Main;
Main = (function(_super) {
  var time, _controller;
  __extends(Main, _super);
  function Main() {
    this.click = __bind(this.click, this);
    this.scroll = __bind(this.scroll, this);
    this.changeNav = __bind(this.changeNav, this);
    this.removeListener = __bind(this.removeListener, this);
    this.addListener = __bind(this.addListener, this);
    this.create = __bind(this.create, this);
    return Main.__super__.constructor.apply(this, arguments);
  }
  time = 0;
  _controller = new ScrollNavigationController();
  Main.prototype.create = function(evt) {
    var k, menu, v, _ref;
    if (evt == null) {
      evt = null;
    }
    menu = new BaseDOM();
    this.appendChildAt(menu, 0);
    menu.className = 'menu';
    _ref = app.config.views;
    for (k in _ref) {
      v = _ref[k];
      this.button = new BaseDOM();
      menu.appendChild(this.button);
      this.button.className = 'menu-button';
      this.button.attr({
        'id': v.id
      });
      this.button.text = v.id;
      this.button.element.on('click', this.click);
    }
    this.bar = new BaseDOM();
    menu.appendChildAt(this.bar, 0);
    this.bar.className = 'bar';
    this.bar.css({
      width: "0%"
    });
    _controller.on(ScrollNavigationController.SCROLL, this.scroll);
    time = app.config.navigation.options.scrollToTime * 1000;
    this.timeout = setTimeout(this.addListener, time);
    return Main.__super__.create.apply(this, arguments);
  };
  Main.prototype.addListener = function() {
    return app.navigation.on(Navigation.CHANGE_VIEW, this.changeNav);
  };
  Main.prototype.removeListener = function() {
    return app.navigation.off(Navigation.CHANGE_VIEW, this.changeNav);
  };
  Main.prototype.changeNav = function(evt) {
    var route;
    route = evt.data.currentView.route;
    return app.navigation.gotoRoute(route, false);
  };
  Main.prototype.scroll = function(evt) {
    return this.bar.css({
      width: String((evt.percent * 100) + "%")
    });
  };
  Main.prototype.click = function(evt) {
    var route;
    this.removeListener();
    route = app.config.views[evt.srcElement.id].route;
    app.navigation.gotoRoute(route, true);
    clearTimeout(this.timeout);
    return this.timeout = setTimeout(this.addListener, time);
  };
  Main.get({
    controller: function() {
      return _controller;
    }
  });
  return Main;
})(NavigationContainer);
return new Main();
}).call(this);