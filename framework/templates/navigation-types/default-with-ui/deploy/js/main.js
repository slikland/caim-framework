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
      klass = eval(data["class"]);
      view = new klass(data, data.id + '-view');
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
var DefaultNavigationController;
DefaultNavigationController = (function(_super) {
  __extends(DefaultNavigationController, _super);
  DefaultNavigationController.HIDE_ALL_SUBVIEWS = 'navigation_controller_hide_all_subviews';
  DefaultNavigationController.SHOW_ALL_SUBVIEWS = 'navigation_controller_show_all_subviews';
  function DefaultNavigationController() {
    this._destroyComplete = __bind(this._destroyComplete, this);
    this._hideNext = __bind(this._hideNext, this);
    this._hideComplete = __bind(this._hideComplete, this);
    this._hide = __bind(this._hide, this);
    this._hideAllCallback = __bind(this._hideAllCallback, this);
    this._showNext = __bind(this._showNext, this);
    this._showComplete = __bind(this._showComplete, this);
    this._show = __bind(this._show, this);
    this._create = __bind(this._create, this);
    this.change = __bind(this.change, this);
    DefaultNavigationController.__super__.constructor.apply(this, arguments);
  }
  DefaultNavigationController.get({
    type: function() {
      return 'default';
    }
  });
  DefaultNavigationController.get({
    visibleViews: function() {
      return [this._currentView];
    }
  });
  DefaultNavigationController.get({
    currentView: function() {
      return this._currentView;
    }
  });
  DefaultNavigationController.get({
    previousView: function() {
      return this._previousView;
    }
  });
  DefaultNavigationController.get({
    data: function() {
      return {
        currentView: this.currentView,
        previousView: this.previousView,
        visibleViews: this.visiblesViews
      };
    }
  });
  DefaultNavigationController.prototype.change = function(p_id) {
    var _ref;
    if (((_ref = this._currentView) != null ? _ref.id : void 0) === p_id) {
      return;
    }
    if (this._currentView != null) {
      this._previousView = this._currentView;
      this._currentView = this._views.create(p_id);
      if (this._currentView.parentPath.indexOf(this._previousView.id) !== -1) {
        this.indexView = this._currentView.parentPath.indexOf(this._previousView.id) + 1;
        this.maxIndexView = this._currentView.parentPath.length - 1;
        this._create();
      } else if (this._previousView.parentPath.indexOf(p_id) !== -1) {
        this.indexView = 0;
        this.maxIndexView = (this._previousView.parentPath.length - 1) - (this._previousView.parentPath.indexOf(p_id) + 1);
        this._hide();
      } else if (this._currentView.parentPath.indexOf(this._previousView.parentView.id) !== -1) {
        this.indexView = 0;
        this.maxIndexView = this._currentView.parentPath.indexOf(this._previousView.parentView.id);
        this.on(DefaultNavigationController.HIDE_ALL_SUBVIEWS, this._hideAllCallback);
        this._hide();
      } else if (this._previousView.parentPath.indexOf(this._currentView.parentView.id) !== -1) {
        this.indexView = 0;
        this.maxIndexView = (this._previousView.parentPath.length - 1) - (this._previousView.parentPath.indexOf(this._currentView.parentView.id) + 1);
        this.on(DefaultNavigationController.HIDE_ALL_SUBVIEWS, this._hideAllCallback);
        this._hide();
      } else {
        this.indexView = 0;
        this.maxIndexView = this._previousView.parentPath.length - 1;
        this.on(DefaultNavigationController.HIDE_ALL_SUBVIEWS, this._hideAllCallback);
        this._hide();
      }
    } else {
      this._currentView = this._views.create(p_id);
      this.indexView = 0;
      this.maxIndexView = this._currentView.parentPath.length - 1;
      this._create();
    }
    return DefaultNavigationController.__super__.change.apply(this, arguments);
  };
  DefaultNavigationController.prototype._create = function(evt) {
    var view, _ref;
    if (evt == null) {
      evt = null;
    }
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        if (typeof _ref.off === "function") {
          _ref.off(evt != null ? evt.type : void 0, this._create);
        }
      }
    }
    view = this._views.create(this._currentView.parentPath[this.indexView]);
    this._appendToWrapper(view);
    if (!view.created) {
      view.on(BaseView.CREATE_COMPLETE, this._show);
      view.createStart();
    } else {
      this._show(view);
    }
    return false;
  };
  DefaultNavigationController.prototype._show = function(evt) {
    var view;
    if (evt == null) {
      evt = null;
    }
    view = evt.currentTarget == null ? evt : evt.currentTarget;
    view.off(BaseView.CREATE_COMPLETE, this._show);
    if (!view.showed) {
      view.on(BaseView.SHOW_COMPLETE, this._showComplete);
      view.showStart();
    } else {
      this._showComplete(view);
    }
    return false;
  };
  DefaultNavigationController.prototype._showComplete = function(evt) {
    var view;
    if (evt == null) {
      evt = null;
    }
    view = evt.currentTarget == null ? evt : evt.currentTarget;
    view.off(BaseView.SHOW_COMPLETE, this._showComplete);
    this._showNext(view);
    return false;
  };
  DefaultNavigationController.prototype._showNext = function(p_view) {
    if (this.indexView < this.maxIndexView) {
      this.indexView++;
      this._create();
    } else {
      this.trigger(DefaultNavigationController.SHOW_ALL_SUBVIEWS);
    }
    this.trigger(BaseNavigationController.CHANGE, {
      view: p_view,
      transition: 'show'
    });
    return false;
  };
  DefaultNavigationController.prototype._hideAllCallback = function(evt) {
    var _ref;
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        if (typeof _ref.off === "function") {
          _ref.off(evt != null ? evt.type : void 0, this._hideAllCallback);
        }
      }
    }
    this.indexView = 0;
    this.maxIndexView = this._currentView.parentPath.length - 1;
    this._create();
    return false;
  };
  DefaultNavigationController.prototype._hide = function(evt) {
    var view, _ref;
    if (evt == null) {
      evt = null;
    }
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        if (typeof _ref.off === "function") {
          _ref.off(evt != null ? evt.type : void 0, this._hide);
        }
      }
    }
    view = this._views.create(this._previousView.reverseParentPath[this.indexView]);
    view.on(BaseView.HIDE_COMPLETE, this._hideComplete);
    view.hideStart();
    return false;
  };
  DefaultNavigationController.prototype._hideComplete = function(evt) {
    var view;
    if (evt == null) {
      evt = null;
    }
    view = evt.currentTarget;
    view.off(BaseView.HIDE_COMPLETE, this._hideComplete);
    if (view.destroyable) {
      view.on(BaseView.DESTROY_COMPLETE, this._destroyComplete);
      view.destroy();
    } else {
      this._removeFromWrapper(view);
      this._hideNext(view);
    }
    return false;
  };
  DefaultNavigationController.prototype._hideNext = function(p_view) {
    if (this.indexView < this.maxIndexView) {
      this.indexView++;
      this._hide();
    } else {
      this.trigger(DefaultNavigationController.HIDE_ALL_SUBVIEWS);
    }
    this.trigger(BaseNavigationController.CHANGE, {
      view: p_view,
      transition: 'hide'
    });
    return false;
  };
  DefaultNavigationController.prototype._destroyComplete = function(evt) {
    var view;
    view = evt.currentTarget;
    view.off(BaseView.DESTROY_COMPLETE, this._destroyComplete);
    this._removeFromWrapper(view);
    this._views.remove(view.id);
    this._hideNext(view);
    return false;
  };
  return DefaultNavigationController;
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
    var hasSlash, rawPath;
    rawPath = window.location.href;
    hasSlash = rawPath.substr(rawPath.length - 1, rawPath.length) === '/';
    if (hasSlash) {
      rawPath = rawPath.substr(0, rawPath.length - 1);
    }
    if (rawPath.indexOf(this._rootPath) === 0) {
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
    pathParts = /^(?:#?!?\/*)([^?]*)\??(.*?)$/.exec(p_rawPath);
    path = pathParts[1];
    params = this._parseParams(pathParts[2]);
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
      pRE = /&?([^=&]+)=?([^=&]*)/g;
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
  NavigationRouter.prototype.addRoute = function(p_route, p_data) {
    var err, i, labels, o, p, r, routeRE;
    if (p_data == null) {
      p_data = null;
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
      routeRE = new RegExp('(?:' + r.replace(/\{.*?\}/g, '(.+?)') + '$)', 'g');
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
  return NavigationRouter;
})(EventDispatcher);
/**
Navigation Class
The instance of this class can be accessed by `app.navigation` wrapper
@class Navigation
@extends EventDispatcher
@uses NavigationRouter
@uses BaseNavigationController
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
    _controller.on(BaseNavigationController.CHANGE_VIEW, this._change);
    _controller.setup(p_data);
    _router.on(NavigationRouter.CHANGE, this._change);
    _router.on(NavigationRouter.CHANGE_ROUTE, this._change);
    _router.setup(app.root, (_ref = app.config.navigation) != null ? _ref.forceHashBang : void 0);
    _ref1 = p_data.views;
    for (k in _ref1) {
      v = _ref1[k];
      if (v.route != null) {
        _router.addRoute(v.route);
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
    var current, pathData, routes, viewID;
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
    _controller.start(viewID);
    return false;
  };
  /**
  	Returns the visible views in DOM
  	@attribute visibleViews
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
  	@attribute currentView
  	@type {BaseView}
  	@readOnly
   */
  Navigation.get({
    currentView: function() {
      var view;
      view = this._currentView || _controller.currentView;
      view.routeData = this.routeData;
      return view;
    }
  });
  /**
  	Returns the previous view
  	@attribute previousView
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
  	@attribute routeData
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
        results.raw = pathData.rawPath;
        results.params = pathData.params;
        results.route = (_ref = routeData[0]) != null ? (_ref1 = _ref[0]) != null ? _ref1.route : void 0 : void 0;
        results.parsed = routeData[1];
      }
      return results;
    }
  });
  /**
  	Returns the instance of router controller
  	@attribute router
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
  	@attribute navigation
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
  Navigation.prototype.goto = function(p_value) {
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
      _router.goto(p_value, p_trigger);
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
      _router.replace(p_value, p_trigger);
    } else {
      throw new Error('The value "' + p_value + '" is not a valid format to route ("/example")');
    }
    return false;
  };
  /**
  	@method gotoDefault
   */
  Navigation.prototype.gotoDefault = function(p_trigger) {
    var view, _ref;
    if (p_trigger == null) {
      p_trigger = false;
    }
    if (((_ref = app.config.navigation) != null ? _ref.defaultView : void 0) != null) {
      view = app.config.navigation.defaultView;
      this.gotoRoute(this.getRouteByView(view), p_trigger);
    }
    return false;
  };
  /**
  	@method gotoView
  	@param {String} p_value
   */
  Navigation.prototype.gotoView = function(p_value) {
    if (p_value.indexOf('/') === 0) {
      throw new Error('The value "' + p_value + '" is not a valid format to viewID ("areaID")');
    } else {
      _controller.goto(p_value);
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
  	@method _change
  	@param {Event} [evt=null]
  	@private
   */
  Navigation.prototype._change = function(evt) {
    if (evt == null) {
      evt = null;
    }
    switch (evt.type) {
      case BaseNavigationController.CHANGE_VIEW:
        this._currentView = evt.data.currentView;
        this._previousView = evt.data.previousView;
        this._visibleViews = evt.data.visibleViews;
        return this.trigger(Navigation.CHANGE_VIEW, {
          data: evt.data
        });
      case BaseNavigationController.CHANGE:
        return this.trigger(Navigation.CHANGE_INTERNAL_VIEW, {
          view: evt.view,
          transition: evt.transition
        });
      case NavigationRouter.CHANGE_ROUTE:
        this.trigger(Navigation.CHANGE_ROUTE, {
          data: this.routeData
        });
        if (this.routeData.route != null) {
          return this.gotoView(this.getViewByRoute(this.routeData.route));
        }
    }
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
  	@constructor
   */
  function NavigationContainer() {
    this.setupNavigation = __bind(this.setupNavigation, this);
    NavigationContainer.__super__.constructor.call(this, null, 'nav-container');
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
var Resizer;
Resizer = (function(_super) {
  var _body, _bounds;
  __extends(Resizer, _super);
  Resizer.RESIZE = 'resize_resizer';
  Resizer.ORIENTATION_CHANGE = 'orientation_change_resizer';
  Resizer.BREAKPOINT_CHANGE = 'breakpoint_changed_resizer';
  _bounds = null;
  _body = null;
  Resizer.getInstance = function(p_start) {
    if (p_start == null) {
      p_start = true;
    }
    return Resizer._instance != null ? Resizer._instance : Resizer._instance = new Resizer(p_start);
  };
  function Resizer(p_start) {
    if (p_start == null) {
      p_start = true;
    }
    this.change = __bind(this.change, this);
    this.stop = __bind(this.stop, this);
    this.start = __bind(this.start, this);
    _body = document.querySelector("body");
    _bounds = {
      "top": 0,
      "bottom": 0,
      "left": 0,
      "right": 0
    };
    if (p_start != null) {
      this.start();
    }
  }
  Resizer.get({
    width: function() {
      return window.innerWidth;
    }
  });
  Resizer.get({
    height: function() {
      return window.innerHeight;
    }
  });
  Resizer.get({
    orientation: function() {
      if (window.innerWidth > window.innerHeight) {
        return 'landscape';
      } else {
        return 'portrait';
      }
    }
  });
  Resizer.get({
    bounds: function() {
      return _bounds;
    }
  });
  Resizer.set({
    bounds: function(p_value) {
      return _bounds = p_value;
    }
  });
  Resizer.prototype.start = function() {
    window.addEventListener('resize', this.change);
    window.addEventListener('orientationchange', this.change);
    return this.change();
  };
  Resizer.prototype.stop = function() {
    window.removeEventListener('resize', this.change);
    return window.removeEventListener('orientationchange', this.change);
  };
  Resizer.prototype.change = function(evt) {
    var k, v, _data, _ref, _ref1, _results;
    if (evt != null) {
      evt.preventDefault();
    }
    if (evt != null) {
      evt.stopImmediatePropagation();
    }
    _data = {
      "width": this.width,
      "height": this.height,
      "bounds": this.bounds,
      "orientation": this.orientation
    };
    if ((evt != null ? evt.type : void 0) === "resize") {
      this.trigger(Resizer.RESIZE, _data);
    }
    if ((evt != null ? evt.type : void 0) === "orientationchange") {
      this.trigger(Resizer.ORIENTATION_CHANGE, _data);
    }
    if (app.conditions != null) {
      _ref = app.conditions.list;
      for (k in _ref) {
        v = _ref[k];
        if ((v['size'] != null) || (v['orientation'] != null)) {
          if (app.conditions.test(k)) {
            if (!this.hasClass(k)) {
              this.addClass(k);
            }
          } else {
            if (this.hasClass(k)) {
              this.removeClass(k);
            }
          }
        }
      }
      _ref1 = app.conditions.list;
      _results = [];
      for (k in _ref1) {
        v = _ref1[k];
        if ((v['size'] != null) || (v['orientation'] != null)) {
          if (app.conditions.test(k)) {
            _data['breakpoint'] = {
              key: k,
              values: v
            };
            if (this.latestKey !== k) {
              this.latestKey = k;
              this.trigger(Resizer.BREAKPOINT_CHANGE, _data);
            }
            break;
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };
  Resizer.prototype.addClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = _body.className.replace(/\s+/ig, ' ').split(' ');
    p = classNames.length;
    i = className.length;
    while (i-- > 0) {
      if (classNames.indexOf(className[i]) >= 0) {
        continue;
      }
      classNames[p++] = className[i];
    }
    _body.className = classNames.join(' ');
    return false;
  };
  Resizer.prototype.removeClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = _body.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    while (i-- > 0) {
      if ((p = classNames.indexOf(className[i])) >= 0) {
        classNames.splice(p, 1);
      }
    }
    _body.className = classNames.join(' ');
    return false;
  };
  Resizer.prototype.hasClass = function(className) {
    var classNames, hasClass, i;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = _body.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    hasClass = true;
    while (i-- > 0) {
      hasClass &= classNames.indexOf(className[i]) >= 0;
    }
    return hasClass;
  };
  return Resizer;
})(EventDispatcher);
var FunctionUtils;
FunctionUtils = (function() {
  function FunctionUtils() {}
  FunctionUtils.debounce = function(fn, delay) {
    var timer;
    timer = null;
    return function() {
      var args, context;
      context = this;
      args = arguments;
      clearTimeout(timer);
      timer = setTimeout((function() {
        fn.apply(context, args);
      }), delay);
    };
  };
  FunctionUtils.throttle = function(fn, threshhold, scope) {
    var deferTimer, last;
    if (threshhold == null) {
      threshhold = 250;
    }
    last = void 0;
    deferTimer = void 0;
    return function() {
      var args, context, now;
      context = scope || this;
      now = +(new Date);
      args = arguments;
      if (last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout((function() {
          last = now;
          fn.apply(context, args);
        }), threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  };
  return FunctionUtils;
})();
var BaseComponent;
BaseComponent = (function(_super) {
  __extends(BaseComponent, _super);
  BaseComponent["const"]({
    BASE_CLASSNAME: 'component'
  });
  BaseComponent["const"]({
    DEFAULT_OPTIONS: {
      className: BaseComponent.BASE_CLASSNAME,
      element: 'div',
      attrs: {
        id: null
      }
    }
  });
  BaseComponent["const"]({
    INVALIDATE_OPTIONS: 'invalidate-options'
  });
  BaseComponent["const"]({
    CREATE: 'create'
  });
  BaseComponent["const"]({
    ADDED: 'added'
  });
  BaseComponent["const"]({
    REMOVED: 'removed'
  });
  BaseComponent["const"]({
    STYLE: null
  });
  function BaseComponent(p_options) {
    var k, name, v, _i, _len, _ref;
    if (p_options == null) {
      p_options = {};
    }
    this._immediateInvalidate = __bind(this._immediateInvalidate, this);
    this._applyStyle();
    this._options = ObjectUtils.merge({}, this.constructor.DEFAULT_OPTIONS);
    if (p_options instanceof Element) {
      p_options = {
        element: p_options
      };
    }
    if (p_options.element instanceof Element) {
      _ref = Array.prototype.slice.call(p_options.element.attributes);
      for (k = _i = 0, _len = _ref.length; _i < _len; k = ++_i) {
        v = _ref[k];
        name = v.localName || k;
        this.attr(name, v.nodeValue.toString());
      }
    }
    BaseComponent.__super__.constructor.call(this, {
      element: p_options.element || this._options.element,
      className: p_options.className || this._options.className,
      namespace: p_options.namespace || this._options.namespace
    });
    delete p_options.element;
    this.setOptions(p_options);
  }
  BaseComponent.get({
    options: function() {
      return this._options;
    }
  });
  BaseComponent.set({
    options: function(p_options) {
      if (p_options == null) {
        p_options = null;
      }
      return this.setOptions(p_options);
    }
  });
  BaseComponent.get({
    parent: function() {
      return this._parent;
    }
  });
  BaseComponent.set({
    parent: function(value) {
      var _lastParent;
      if (value == null) {
        value = null;
      }
      if (value != null) {
        if (!(value instanceof BaseDOM) && !(value instanceof Node)) {
          throw new Error('Parent instance is not either Node or BaseDOM');
        }
        _lastParent = this._parent;
        this._parent = value;
        if (_lastParent == null) {
          return this._added();
        }
      } else if (this.isAttached) {
        this._parent = null;
        if (_lastParent != null) {
          this._removed();
        }
        return _lastParent = null;
      }
    }
  });
  BaseComponent.prototype.option = function(p_name, p_value) {
    var _defaultValue, _lastValue;
    if (p_value == null) {
      p_value = null;
    }
    if (typeof p_name === 'string') {
      _defaultValue = this.constructor.DEFAULT_OPTIONS[p_name];
      _lastValue = this._options[p_name];
      if (p_value != null) {
        this._options[p_name] = p_value;
        if ((this._options[p_name] == null) && (_defaultValue != null)) {
          this._options[p_name] = _defaultValue;
        }
        if (_lastValue !== this._options[p_name]) {
          return this._invalidateOptions(p_name);
        }
      } else {
        return this._options[p_name];
      }
    } else if (typeof p_name === 'object') {
      return this.setOptions(p_name);
    }
  };
  BaseComponent.prototype.createStart = function() {};
  BaseComponent.prototype.create = function() {
    if (this._created) {
      return;
    }
    this._created = true;
    this.componentLayout();
    this.createComplete();
    if ((this.parent != null) && !this._ready) {
      this._ready = true;
      return this.componentReady();
    }
  };
  BaseComponent.prototype.componentLayout = function() {};
  BaseComponent.prototype.componentAdded = function() {};
  BaseComponent.prototype.componentRemoved = function() {};
  BaseComponent.prototype.componentReady = function() {};
  BaseComponent.prototype.createComplete = function() {
    this._invalidateOptions();
    return this.trigger(this.constructor.CREATE);
  };
  BaseComponent.prototype.setOptions = function(p_options) {
    if (p_options == null) {
      p_options = null;
    }
    if (p_options != null) {
      p_options = ObjectUtils.merge(p_options, ObjectUtils.merge(this._options || {}, this.constructor.DEFAULT_OPTIONS, false));
      this._options = p_options;
      return this._invalidateOptions();
    }
  };
  BaseComponent.prototype._invalidateOptions = function(property) {
    if (property == null) {
      property = null;
    }
    if (!this._created) {
      return;
    }
    return this._immediateInvalidate(property);
  };
  BaseComponent.prototype._immediateInvalidate = function(property) {
    if (property == null) {
      property = null;
    }
    this._invalidate(property);
    return this.trigger(this.constructor.INVALIDATE_OPTIONS, {
      property: property,
      options: this._options
    });
  };
  BaseComponent.prototype._invalidate = function() {
    if (this._options.attrs != null) {
      this.attr(this._options.attrs);
    }
    if (this._options.style != null) {
      return this.css(this._options.style);
    }
  };
  BaseComponent.prototype._added = function() {
    this.trigger(this.constructor.ADDED, this);
    this.componentAdded();
    if (this._created && !this._ready) {
      this._ready = true;
      return this.componentReady();
    }
  };
  BaseComponent.prototype._removed = function() {
    this.componentRemoved();
    return this.trigger(this.constructor.REMOVED, this);
  };
  BaseComponent.prototype._applyStyle = function() {
    var currentStyle, e, head, si, style, styleId;
    if ((this.constructor.STYLE != null) && this.constructor.STYLE.replace(/\s+/g) !== '') {
      styleId = "" + this.constructor.BASE_CLASSNAME + "-styles";
      head = document.querySelector("head") || document.getElementsByTagName("head")[0];
      currentStyle = head.querySelector("#" + styleId);
      if (currentStyle == null) {
        style = document.createElement('style');
        style.id = "" + this.constructor.BASE_CLASSNAME + "-styles";
        style.type = "text/css";
        head.appendChild(style);
        try {
          return style.appendChild(document.createTextNode(this.constructor.STYLE));
        } catch (_error) {
          e = _error;
          if (document.all) {
            si = head.querySelectorAll('style').length;
            return document.styleSheets[si].cssText = this.constructor.STYLE;
          }
        }
      }
    }
  };
  BaseComponent.prototype.destroy = function() {
    this._created = this._ready = false;
    this._options = null;
    if (typeof this.removeAll === "function") {
      this.removeAll();
    }
    return BaseComponent.__super__.destroy.apply(this, arguments);
  };
  return BaseComponent;
})(BaseDOM);
var Svg,
  __slice = [].slice;
Svg = (function(_super) {
  __extends(Svg, _super);
  Svg["const"]({
    SVG_NS: 'http://www.w3.org/2000/svg'
  });
  Svg["const"]({
    XLINK_NS: 'http://www.w3.org/1999/xlink'
  });
  Svg["const"]({
    BASE_CLASSNAME: 'svg-graph'
  });
  Svg["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      className: Svg.BASE_CLASSNAME,
      element: 'svg',
      attrs: {
        width: 100,
        height: 100
      },
      autoViewBox: false
    }, Svg.DEFAULT_OPTIONS)
  });
  Svg["const"]({
    SVG_URL_ATTRS: ['fill|url', 'mask|url', 'clip-path|url', 'filter|url', 'xlink\\:href|#']
  });
  function Svg(p_options) {
    var _ref;
    if (p_options == null) {
      p_options = {};
    }
    this._didChangeRoute = __bind(this._didChangeRoute, this);
    this._filtersStack = [];
    if (p_options instanceof Element) {
      p_options = {
        element: p_options
      };
    }
    p_options.namespace = this.constructor.SVG_NS;
    Svg.__super__.constructor.call(this, p_options);
    this._hash = "" + this.options.className + "_" + (StringUtils.random());
    if (!((_ref = this.element) != null ? typeof _ref.querySelector === "function" ? _ref.querySelector('defs') : void 0 : void 0)) {
      this._defs = new BaseDOM({
        element: 'defs',
        namespace: this.constructor.SVG_NS
      });
      this.appendChildAt(this._defs, 0);
    } else {
      this._defs = new BaseDOM({
        element: this.element.querySelector('defs')
      });
    }
    if (typeof app !== "undefined" && app !== null) {
      app.navigation.on(Navigation.CHANGE_ROUTE, this._didChangeRoute);
    }
    this.create();
  }
  Svg.set({
    width: function(p_value) {
      return this.option('attrs', {
        width: p_value
      });
    }
  });
  Svg.set({
    height: function(p_value) {
      return this.option('attrs', {
        height: p_value
      });
    }
  });
  Svg.get({
    width: function() {
      return this.element.clientWidth;
    }
  });
  Svg.get({
    width: function() {
      return this.element.clientHeight;
    }
  });
  Svg.get({
    defs: function() {
      return this._defs;
    }
  });
  Svg.get({
    filters: function() {
      return this._filtersStack;
    }
  });
  Svg.get({
    className: function() {
      var _ref, _ref1;
      if (((_ref = this.element.className) != null ? _ref.baseVal : void 0) != null) {
        return (_ref1 = this.element.className) != null ? _ref1.baseVal : void 0;
      } else {
        return this.element.className;
      }
    }
  });
  Svg.set({
    className: function(value) {
      var _ref;
      return (_ref = this.element.className) != null ? _ref.baseVal = value.trim() : void 0;
    }
  });
  Svg.fromAsset = function(p_options, instance) {
    var newEl, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _resource, _svgElement;
    if (p_options == null) {
      p_options = {};
    }
    if (instance == null) {
      instance = true;
    }
    if (((_ref = p_options.icon) != null ? _ref.id : void 0) != null) {
      p_options.svg = p_options.icon.id;
      delete p_options.icon.id;
      delete p_options.icon;
    }
    if (p_options.svg != null) {
      _svgElement = null;
      if (p_options.svg instanceof SVGElement) {
        _svgElement = p_options.svg.cloneNode(true);
      } else {
        _resource = null;
        if ((_ref1 = app.container) != null ? (_ref2 = _ref1.content) != null ? (_ref3 = _ref2.assets) != null ? (_ref4 = _ref3.icons) != null ? _ref4[p_options.svg] : void 0 : void 0 : void 0 : void 0) {
          _resource = app.container.content.assets.icons[p_options.svg];
        } else {
          _resource = {
            svg: app.loader.getItem(p_options.svg)
          };
        }
        newEl = document.createElement('div');
        newEl.innerHTML = _resource != null ? (_ref5 = _resource.svg) != null ? _ref5.tag : void 0 : void 0;
        _svgElement = (_ref6 = newEl.querySelector('svg')) != null ? typeof _ref6.cloneNode === "function" ? _ref6.cloneNode(true) : void 0 : void 0;
        newEl.innerHTML = '';
      }
      if (_svgElement instanceof SVGElement) {
        if (!!instance) {
          p_options.element = _svgElement;
          return new Svg(p_options);
        } else {
          return _svgElement;
        }
      }
    }
    return null;
  };
  Svg.getUrlRef = function(p_url, cssFormat) {
    var _url;
    if (p_url == null) {
      p_url = '';
    }
    if (cssFormat == null) {
      cssFormat = false;
    }
    _url = "" + window.location.href + "#" + p_url;
    if (cssFormat === true) {
      _url = "url(" + _url + ")";
    }
    return _url;
  };
  Svg.createUse = function(id, p_options) {
    if (p_options == null) {
      p_options = {};
    }
    if (id != null) {
      p_options.element = 'use';
      if (p_options.attrs == null) {
        p_options.attrs = {};
      }
      p_options.attrs['xlink:href'] = this.getUrlRef(id);
      return new Svg.Asset(p_options);
    }
  };
  Svg.prototype.addFilter = function() {
    var filter, filterPrimitive, p_filterOptions, p_filters, _i, _len;
    p_filterOptions = arguments[0], p_filters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (p_filterOptions == null) {
      p_filterOptions = {};
    }
    filter = new Svg.Filters.Filter(p_filterOptions);
    this._defs.appendChild(filter);
    for (_i = 0, _len = p_filters.length; _i < _len; _i++) {
      filterPrimitive = p_filters[_i];
      if (filterPrimitive instanceof Svg.Filters.FilterPrimitive) {
        filter.appendChild(filterPrimitive);
      }
    }
    this._filtersStack.push(filter);
    this._invalidateFilters();
    return filter;
  };
  Svg.prototype.removeFilter = function(p_ref) {
    var _index;
    _index = -1;
    if (typeof p_ref === 'number') {
      _index = p_ref;
    } else {
      _index = this._filtersStack.indexOf(p_ref);
    }
    if (_index !== -1) {
      this._filtersStack.splice(_index, 1);
    }
    return this._invalidateFilters();
  };
  Svg.prototype.destroy = function() {
    var filter, _i, _len, _ref;
    if (typeof app !== "undefined" && app !== null) {
      app.navigation.off(Navigation.CHANGE_ROUTE, this._didChangeRoute);
    }
    this._defs.removeAll(true);
    this._defs.destroy();
    _ref = this._filtersStack;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      filter = _ref[_i];
      filter.removeAll(true);
    }
    this.removeAll(true);
    return Svg.__super__.destroy.apply(this, arguments);
  };
  Svg.prototype._invalidate = function() {
    var k, v, _ref, _ref1, _ref2;
    if (this._options == null) {
      return;
    }
    if (this._options.attrs != null) {
      _ref = this._options.attrs;
      for (k in _ref) {
        v = _ref[k];
        this.attr(k, v);
      }
    }
    if (this._options.style != null) {
      this.css(this._options.style);
    }
    if (this.attr('viewBox') === null && this._options.autoViewBox) {
      return this.attr('viewBox', "0 0 " + ((_ref1 = this._options.attrs) != null ? _ref1.width : void 0) + " " + ((_ref2 = this._options.attrs) != null ? _ref2.height : void 0));
    }
  };
  Svg.prototype._invalidateFilters = function() {};
  Svg.prototype._didChangeRoute = function(event) {
    var attrName, attrValue, i, item, items, params, value, _i, _len, _ref, _results, _searchString;
    if (event == null) {
      event = null;
    }
    if (app.detections.name.toLowerCase().indexOf('Internet Explorer') === -1) {
      _searchString = '';
      _ref = this.constructor.SVG_URL_ATTRS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        params = value.split('|');
        _searchString += "" + (_searchString !== '' ? ', ' : '') + "[" + params[0] + "*=\'" + params[1] + "\']";
      }
      items = this.element.querySelectorAll(_searchString);
      i = items.length;
      _results = [];
      while (i-- > 0) {
        item = items[i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = this.constructor.SVG_URL_ATTRS;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            value = _ref1[_j];
            attrName = value.split('|')[0];
            attrValue = item.getAttribute(attrName);
            if (attrValue != null) {
              attrValue = attrValue.replace(/(url\().*?(\#)/g, '$1' + window.location.href + '$2');
              _results1.push(item.setAttribute(attrName, attrValue));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    }
  };
  return Svg;
})(BaseComponent);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;
Svg.Asset = (function(_super) {
  __extends(Asset, _super);
  Asset["const"]({
    DEFAULT_OPTIONS: {
      element: null,
      className: null,
      attrs: {
        id: null
      }
    }
  });
  function Asset(p_options) {
    var k, name, v, _i, _len, _ref;
    if (p_options == null) {
      p_options = {};
    }
    this._immediateInvalidate = __bind(this._immediateInvalidate, this);
    if (p_options.element instanceof Element) {
      _ref = Array.prototype.slice.call(p_options.element.attributes);
      for (k = _i = 0, _len = _ref.length; _i < _len; k = ++_i) {
        v = _ref[k];
        name = v.localName || k;
        this.attr(name, v.nodeValue.toString());
      }
    }
    this._options = ObjectUtils.merge({}, this.constructor.DEFAULT_OPTIONS);
    Asset.__super__.constructor.call(this, {
      element: p_options.element || 'symbol',
      className: p_options.className || this._options.className,
      namespace: Svg.SVG_NS
    });
    delete p_options.element;
    this.setOptions(p_options);
  }
  Asset.get({
    className: function() {
      var _ref, _ref1;
      if (((_ref = this.element.className) != null ? _ref.baseVal : void 0) != null) {
        return (_ref1 = this.element.className) != null ? _ref1.baseVal : void 0;
      } else {
        return this.element.className;
      }
    }
  });
  Asset.set({
    className: function(value) {
      var _ref;
      return (_ref = this.element.className) != null ? _ref.baseVal = value.trim() : void 0;
    }
  });
  Asset.get({
    options: function() {
      return this._options;
    }
  });
  Asset.set({
    options: function(p_options) {
      if (p_options == null) {
        p_options = null;
      }
      return this.setOptions(p_options);
    }
  });
  Asset.get({
    width: function() {
      return this.element.clientWidth;
    }
  });
  Asset.set({
    width: function(p_value) {
      return this.option('attrs', {
        width: parseInt(p_value)
      });
    }
  });
  Asset.get({
    height: function() {
      return this.element.clientHeight;
    }
  });
  Asset.set({
    height: function(p_value) {
      return this.option('attrs', {
        height: parseInt(p_value)
      });
    }
  });
  Asset.get({
    root: function() {
      var target, _ref;
      if (this._root instanceof Svg) {
        return this._root;
      }
      if (this._parent != null) {
        target = (_ref = this.findParents('svg')) != null ? _ref.__instance__ : void 0;
        if (target instanceof Svg) {
          return this._root = target;
        }
      }
    }
  });
  Asset.get({
    parent: function() {
      return this._parent;
    }
  });
  Asset.set({
    parent: function(value) {
      var _lastParent;
      if (value != null) {
        if (!(value instanceof BaseDOM) && !(value instanceof Node)) {
          throw new Error('Parent instance is not either Node or BaseDOM');
        }
        _lastParent = this._parent;
        this._parent = value;
        if (_lastParent == null) {
          return this._added();
        }
      } else {
        this._parent = null;
        if (_lastParent != null) {
          this._removed();
        }
        return _lastParent = null;
      }
    }
  });
  Asset.prototype.use = function(p_options) {
    var _ref, _ref1;
    if (p_options == null) {
      p_options = {};
    }
    if (((_ref = this._options.attrs) != null ? _ref.id : void 0) == null) {
      this.option('attrs', {
        id: StringUtils.random()
      });
    }
    return Svg.createUse((_ref1 = this._options.attrs) != null ? _ref1.id : void 0, p_options);
  };
  Asset.prototype.mask = function(p_svgElement, p_maskOptions) {
    var _ref, _ref1, _ref2, _ref3;
    if (p_svgElement == null) {
      p_svgElement = null;
    }
    if (p_maskOptions == null) {
      p_maskOptions = {};
    }
    if (p_svgElement instanceof Svg.Asset) {
      if (((_ref = this._options.attrs) != null ? _ref.id : void 0) == null) {
        this.option('attrs', {
          id: StringUtils.random()
        });
      }
      if (!!this._currentMask) {
        this._currentMask.appendChild(p_svgElement);
      } else {
        if (p_maskOptions.attrs == null) {
          p_maskOptions.attrs = {};
        }
        p_maskOptions.attrs.id = "mask_" + ((_ref1 = this._options.attrs) != null ? _ref1.id : void 0);
        this._currentMask = new Svg.Mask(p_maskOptions);
        this._currentMask.appendChild(p_svgElement);
        if ((_ref2 = this.root) != null) {
          _ref2.defs.appendChild(this._currentMask);
        }
        this.option('attrs', {
          mask: Svg.getUrlRef((_ref3 = p_maskOptions.attrs) != null ? _ref3.id : void 0, true)
        });
      }
      return this._currentMask;
    } else if ((p_svgElement == null) && !!this._currentMask) {
      this.option('attrs', {
        mask: null
      });
      this._currentMask.destroy();
    }
    return this._currentMask;
  };
  Asset.prototype.filter = function() {
    var p_filterOptions, p_filters, primitive, _base, _filter, _i, _len, _ref, _ref1, _ref2, _ref3;
    p_filterOptions = arguments[0], p_filters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (p_filterOptions == null) {
      p_filterOptions = {};
    }
    if (p_filterOptions != null) {
      if (((_ref = this._options.attrs) != null ? _ref.id : void 0) == null) {
        this.option('attrs', {
          id: StringUtils.random()
        });
      }
      if (!!this._currentFilter) {
        if ((p_filters != null ? p_filters.length : void 0) > 0) {
          this._currentFilter.removeAll();
          for (_i = 0, _len = p_filters.length; _i < _len; _i++) {
            primitive = p_filters[_i];
            if (primitive instanceof Svg.Filters.FilterPrimitive) {
              this._currentFilter.appendChild(primitive);
            }
          }
        }
      } else {
        if (p_filterOptions.attrs == null) {
          p_filterOptions.attrs = {};
        }
        if ((_base = p_filterOptions.attrs).id == null) {
          _base.id = "filter_" + ((_ref1 = this._options.attrs) != null ? _ref1.id : void 0);
        }
        _filter = (_ref2 = this.root) != null ? _ref2.find("#" + p_filterOptions.attrs.id) : void 0;
        if (_filter != null) {
          if (!_filter.__instance__) {
            this._currentFilter = new Svg.Filters.Filter({
              element: _filter
            });
          } else {
            this._currentFilter = _filter.__instance__;
          }
        }
        if (this._currentFilter instanceof Svg.Filters.Filter) {
          delete p_filterOptions.attrs.id;
          this._currentFilter.setOptions(p_filterOptions);
        } else {
          this._currentFilter = this.root.addFilter.apply(this.root, [p_filterOptions].concat(p_filters));
        }
        this.option('attrs', {
          filter: Svg.getUrlRef((_ref3 = p_filterOptions.attrs) != null ? _ref3.id : void 0, true)
        });
      }
      return this._currentFilter;
    } else if ((p_filterOptions == null) && !!this._currentFilter) {
      this.option('attrs', {
        filter: null
      });
      this._currentFilter.destroy();
    }
    return this._currentFilter;
  };
  Asset.prototype.clipPath = function(p_svgElement, p_clipOptions) {
    var _ref, _ref1, _ref2, _ref3;
    if (p_svgElement == null) {
      p_svgElement = null;
    }
    if (p_clipOptions == null) {
      p_clipOptions = {};
    }
    if (p_svgElement instanceof Svg.Asset) {
      if (((_ref = this._options.attrs) != null ? _ref.id : void 0) == null) {
        this.option('attrs', {
          id: StringUtils.random()
        });
      }
      if (!!this._currentClipPath) {
        this._currentClipPath.appendChild(p_svgElement);
      } else {
        if (p_clipOptions.attrs == null) {
          p_clipOptions.attrs = {};
        }
        p_clipOptions.attrs.id = "clipPath_" + ((_ref1 = this._options.attrs) != null ? _ref1.id : void 0);
        this._currentClipPath = new Svg.ClipPath(p_clipOptions);
        this._currentClipPath.appendChild(p_svgElement);
        if ((_ref2 = this.root) != null) {
          _ref2.defs.appendChild(this._currentClipPath);
        }
        this.option('attrs', {
          'clip-path': Svg.getUrlRef((_ref3 = p_clipOptions.attrs) != null ? _ref3.id : void 0, true)
        });
      }
      return this._currentClipPath;
    } else if ((p_svgElement == null) && !!this._currentClipPath) {
      this.option('attrs', {
        'clip-path': null
      });
      this._currentClipPath.destroy();
    }
    return this._currentClipPath;
  };
  Asset.prototype.option = function(p_name, p_value) {
    var _defaultValue, _lastValue;
    if (p_value == null) {
      p_value = null;
    }
    if (typeof p_name === 'string') {
      _defaultValue = this.constructor.DEFAULT_OPTIONS[p_name];
      _lastValue = this._options[p_name];
      this._options[p_name] = p_value;
      if ((this._options[p_name] == null) && (_defaultValue != null)) {
        this._options[p_name] = _defaultValue;
      }
      if (_lastValue !== this._options[p_name]) {
        this._invalidateOptions(p_name);
      }
      return this._options[p_name];
    } else if (typeof p_name === 'object') {
      return this.setOptions(p_name);
    }
  };
  Asset.prototype.setOptions = function(p_options) {
    if (p_options == null) {
      p_options = null;
    }
    if (p_options != null) {
      p_options = ObjectUtils.merge(p_options, ObjectUtils.merge(this._options || {}, this.constructor.DEFAULT_OPTIONS));
      this._options = p_options;
      return this._invalidateOptions();
    }
  };
  Asset.prototype._invalidateOptions = function(property) {
    if (property == null) {
      property = null;
    }
    return this._immediateInvalidate(property);
  };
  Asset.prototype._immediateInvalidate = function(property) {
    if (property == null) {
      property = null;
    }
    this._invalidate(property);
    return this.trigger(Svg.INVALIDATE_OPTIONS, {
      property: property,
      options: this._options
    });
  };
  Asset.prototype._invalidate = function() {
    var k, v, _ref;
    if (this._options.attrs != null) {
      _ref = this._options.attrs;
      for (k in _ref) {
        v = _ref[k];
        this.attr(k, v, k.indexOf('xlink') !== -1 ? Svg.XLINK_NS : null);
      }
    }
    if (this._options.style != null) {
      return this.css(this._options.style);
    }
  };
  Asset.prototype._added = function() {
    var _ref, _ref1;
    if ((this._currentMask != null) && !((_ref = this._currentMask) != null ? _ref.isAttached : void 0)) {
      this.root.defs.appendChild(this._currentMask);
    }
    if ((this._currentClipPath != null) && !((_ref1 = this._currentClipPath) != null ? _ref1.isAttached : void 0)) {
      return this.root.defs.appendChild(this._currentClipPath);
    }
  };
  Asset.prototype._removed = function() {};
  Asset.prototype.destroy = function() {
    this.options = null;
    return Asset.__super__.destroy.apply(this, arguments);
  };
  return Asset;
})(BaseDOM);
Svg.Group = (function(_super) {
  __extends(Group, _super);
  function Group(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    if (p_options instanceof Element) {
      p_options = {
        element: p_options
      };
    }
    if (!(p_options.element instanceof Element)) {
      p_options.element = 'g';
    }
    Group.__super__.constructor.call(this, p_options);
  }
  return Group;
})(Svg.Asset);
Svg.Symbol = (function(_super) {
  __extends(Symbol, _super);
  Symbol["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        preserveAspectRatio: 'none'
      }
    }, Symbol.DEFAULT_OPTIONS)
  });
  function Symbol(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'symbol';
    Symbol.__super__.constructor.call(this, p_options);
  }
  return Symbol;
})(Svg.Asset);
Svg.Mask = (function(_super) {
  __extends(Mask, _super);
  Mask["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        maskUnits: 'userSpaceOnUse',
        maskContentUnits: 'userSpaceOnUse',
        width: null,
        height: null
      }
    }, Mask.DEFAULT_OPTIONS)
  });
  function Mask(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    if (p_options instanceof Element) {
      p_options = {
        element: p_options
      };
    }
    if (!(p_options.element instanceof Element)) {
      p_options.element = 'mask';
    }
    Mask.__super__.constructor.call(this, p_options);
  }
  return Mask;
})(Svg.Asset);
Svg.Pattern = (function(_super) {
  __extends(Pattern, _super);
  Pattern["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        patternUnits: 'objectBoundingBox',
        patternContentUnits: 'objectBoundingBox',
        patternTransform: null,
        preserveAspectRatio: 'none'
      }
    }, Pattern.DEFAULT_OPTIONS)
  });
  function Pattern(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'pattern';
    Pattern.__super__.constructor.call(this, p_options);
  }
  return Pattern;
})(Svg.Asset);
Svg.Circle = (function(_super) {
  __extends(Circle, _super);
  Circle["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        patternUnits: 'objectBoundingBox',
        patternContentUnits: 'objectBoundingBox',
        patternTransform: null,
        preserveAspectRatio: 'none'
      }
    }, Circle.DEFAULT_OPTIONS)
  });
  function Circle(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'pattern';
    Circle.__super__.constructor.call(this, p_options);
  }
  return Circle;
})(Svg.Asset);
Svg.Rect = (function(_super) {
  __extends(Rect, _super);
  Rect["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        rx: null,
        ry: null
      }
    }, Rect.DEFAULT_OPTIONS)
  });
  function Rect(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'rect';
    Rect.__super__.constructor.call(this, p_options);
  }
  return Rect;
})(Svg.Asset);
Svg.Circle = (function(_super) {
  __extends(Circle, _super);
  Circle["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        cx: 0,
        cy: 0,
        r: null
      }
    }, Circle.DEFAULT_OPTIONS)
  });
  function Circle(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'circle';
    Circle.__super__.constructor.call(this, p_options);
  }
  return Circle;
})(Svg.Asset);
Svg.Ellipse = (function(_super) {
  __extends(Ellipse, _super);
  Ellipse["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        cx: 0,
        cy: 0,
        rx: null,
        ry: null
      }
    }, Ellipse.DEFAULT_OPTIONS)
  });
  function Ellipse(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'ellipse';
    Ellipse.__super__.constructor.call(this, p_options);
  }
  return Ellipse;
})(Svg.Asset);
Svg.Line = (function(_super) {
  __extends(Line, _super);
  Line["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0
      }
    }, Line.DEFAULT_OPTIONS)
  });
  function Line(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'line';
    Line.__super__.constructor.call(this, p_options);
  }
  return Line;
})(Svg.Asset);
Svg.Path = (function(_super) {
  __extends(Path, _super);
  Path["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        d: null
      }
    }, Path.DEFAULT_OPTIONS)
  });
  function Path(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    if (p_options instanceof Element) {
      p_options = {
        element: p_options
      };
    }
    if (!(p_options.element instanceof Element)) {
      p_options.element = 'path';
    }
    Path.__super__.constructor.call(this, p_options);
  }
  Path.circle = function(cx, cy, radius, options) {
    var d;
    if (cx == null) {
      cx = 0;
    }
    if (cy == null) {
      cy = 0;
    }
    if (radius == null) {
      radius = 50;
    }
    if (options == null) {
      options = {};
    }
    d = ("M " + cx + " " + cy) + ("m " + (-radius) + ", 0") + ("a " + radius + "," + radius + " 0 1,0 " + (radius * 2) + ",0") + ("a " + radius + "," + radius + " 0 1,0 " + (-(radius * 2)) + ",0");
    if (options.attrs == null) {
      options.attrs = {};
    }
    options.attrs.d = d;
    this._path = new Svg.Path(options);
    return this._path;
  };
  Path.rect = function(x, y, width, height, radius, options) {
    var d;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (width == null) {
      width = 100;
    }
    if (height == null) {
      height = 50;
    }
    if (radius == null) {
      radius = 0;
    }
    if (options == null) {
      options = {};
    }
    radius = Math.min(radius, height / 2);
    d = ("M " + (x + radius) + "," + y) + ("h " + (width - 2 * radius)) + ("a " + radius + "," + radius + " 0 0 1 " + radius + "," + radius) + ("v " + (height - 2 * radius)) + ("a " + radius + "," + radius + " 0 0 1 " + (-radius) + "," + radius) + ("h " + (2 * radius - width)) + ("a " + radius + "," + radius + " 0 0 1 " + (-radius) + "," + (-radius)) + ("v " + (2 * radius - height)) + ("a " + radius + "," + radius + " 0 0 1 " + radius + "," + (-radius)) + "z";
    if (options.attrs == null) {
      options.attrs = {};
    }
    options.attrs.d = d;
    this._path = new Svg.Path(options);
    return this._path;
  };
  return Path;
})(Svg.Asset);
Svg.ClipPath = (function(_super) {
  __extends(ClipPath, _super);
  ClipPath["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        clipPathUnits: 'userSpaceOnUse'
      }
    }, ClipPath.DEFAULT_OPTIONS)
  });
  function ClipPath(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'clipPath';
    ClipPath.__super__.constructor.call(this, p_options);
  }
  return ClipPath;
})(Svg.Asset);
Svg.TextPath = (function(_super) {
  __extends(TextPath, _super);
  TextPath["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        startOffset: null,
        method: null,
        spacing: null
      }
    }, TextPath.DEFAULT_OPTIONS)
  });
  function TextPath(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'textPath';
    TextPath.__super__.constructor.call(this, p_options);
  }
  return TextPath;
})(Svg.Asset);
Svg.Text = (function(_super) {
  __extends(Text, _super);
  Text["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      text: '',
      attrs: {
        dx: null,
        dy: null
      },
      tspan: {
        attrs: {
          dx: null,
          dy: null
        }
      }
    }, Text.DEFAULT_OPTIONS)
  });
  function Text(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    if (p_options.element !== 'tspan') {
      p_options.element = 'text';
    }
    Text.__super__.constructor.call(this, p_options);
  }
  Text.get({
    text: function() {
      return this._options.text;
    }
  });
  Text.set({
    text: function(p_value) {
      return this.option('text', p_value);
    }
  });
  Text.prototype.tref = function(p_options) {
    var _ref, _ref1;
    if (p_options == null) {
      p_options = {};
    }
    if (((_ref = this._options.attrs) != null ? _ref.id : void 0) == null) {
      this.option('attrs', {
        id: StringUtils.random()
      });
    }
    return Svg.createTref((_ref1 = this._options.attrs) != null ? _ref1.id : void 0, p_options);
  };
  Text.prototype._invalidate = function() {
    var index, value, _i, _len, _ref, _ref1, _ref2, _results;
    Text.__super__._invalidate.apply(this, arguments);
    if (typeof ((_ref = this._options) != null ? _ref.text : void 0) === 'string' && ((_ref1 = this._options) != null ? _ref1.text : void 0) !== this.element.textContent) {
      return this.element.textContent = this._options.text;
    } else if (Array.isArray(this._options.text)) {
      this.removeAll(true);
      _ref2 = this._options.text;
      _results = [];
      for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
        value = _ref2[index];
        if (typeof value === 'string') {
          _results.push(this.appendSpan(ObjectUtils.merge({
            text: value
          }, this._options.tspan)));
        } else {
          _results.push(this.appendSpan(ObjectUtils.merge(ObjectUtils.merge({}, this._options.tspan), value)));
        }
      }
      return _results;
    }
  };
  Text.prototype.appendSpan = function(p_options) {
    var _span;
    if (p_options == null) {
      p_options = {
        text: ''
      };
    }
    _span = new Svg.Text.Span(p_options);
    this.appendChild(_span);
    return _span;
  };
  return Text;
})(Svg.Asset);
Svg.Text.Span = (function(_super) {
  __extends(Span, _super);
  function Span(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'tspan';
    Span.__super__.constructor.call(this, p_options);
  }
  return Span;
})(Svg.Text);
Svg.Image = (function(_super) {
  __extends(Image, _super);
  Image["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        preserveAspectRatio: 'none',
        width: 100,
        height: 100,
        'xlink:actuate': null,
        'xlink:arcrole': null,
        'xlink:href': null,
        'xlink:role': null,
        'xlink:show': null,
        'xlink:title': null,
        'xlink:type': null
      }
    }, Image.DEFAULT_OPTIONS)
  });
  function Image(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'image';
    Image.__super__.constructor.call(this, p_options);
  }
  return Image;
})(Svg.Asset);
Svg.Filters = {};
Svg.Filters.Filter = (function(_super) {
  __extends(Filter, _super);
  function Filter(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'filter';
    Filter.__super__.constructor.call(this, p_options);
  }
  return Filter;
})(Svg.Asset);
Svg.Filters.FilterPrimitive = (function(_super) {
  __extends(FilterPrimitive, _super);
  FilterPrimitive["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        width: null,
        height: null,
        x: null,
        y: null,
        result: null
      }
    }, FilterPrimitive.DEFAULT_OPTIONS)
  });
  function FilterPrimitive(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    if (p_options.element == null) {
      p_options.element = 'fePrimitive';
    }
    FilterPrimitive.__super__.constructor.call(this, p_options);
  }
  return FilterPrimitive;
})(Svg.Asset);
Svg.Filters.GaussianBlur = (function(_super) {
  __extends(GaussianBlur, _super);
  GaussianBlur["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null,
        stdDeviation: null,
        edgeMode: 'duplicate'
      }
    }, GaussianBlur.DEFAULT_OPTIONS)
  });
  function GaussianBlur(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feGaussianBlur';
    GaussianBlur.__super__.constructor.call(this, p_options);
  }
  return GaussianBlur;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.Blend = (function(_super) {
  __extends(Blend, _super);
  Blend["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null,
        in2: null,
        mode: 'normal'
      }
    }, Blend.DEFAULT_OPTIONS)
  });
  function Blend(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feBlend';
    Blend.__super__.constructor.call(this, p_options);
  }
  return Blend;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.ColorMatrix = (function(_super) {
  __extends(ColorMatrix, _super);
  ColorMatrix["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null,
        type: 'matrix',
        values: null
      }
    }, ColorMatrix.DEFAULT_OPTIONS)
  });
  function ColorMatrix(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feColorMatrix';
    ColorMatrix.__super__.constructor.call(this, p_options);
  }
  return ColorMatrix;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.ComponentTransfer = (function(_super) {
  __extends(ComponentTransfer, _super);
  ComponentTransfer["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null
      }
    }, ComponentTransfer.DEFAULT_OPTIONS)
  });
  function ComponentTransfer(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feComponentTransfer';
    ComponentTransfer.__super__.constructor.call(this, p_options);
  }
  return ComponentTransfer;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.FuncA = (function(_super) {
  __extends(FuncA, _super);
  FuncA["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        type: null,
        tableValues: null,
        slope: null,
        intercept: null,
        amplitude: null,
        exponent: null,
        offset: null
      }
    }, FuncA.DEFAULT_OPTIONS)
  });
  function FuncA(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feFuncA';
    FuncA.__super__.constructor.call(this, p_options);
  }
  return FuncA;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.FuncB = (function(_super) {
  __extends(FuncB, _super);
  function FuncB(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feFuncB';
    FuncB.__super__.constructor.call(this, p_options);
  }
  return FuncB;
})(Svg.Filters.FuncA);
Svg.Filters.FuncG = (function(_super) {
  __extends(FuncG, _super);
  function FuncG(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feFuncG';
    FuncG.__super__.constructor.call(this, p_options);
  }
  return FuncG;
})(Svg.Filters.FuncA);
Svg.Filters.FuncR = (function(_super) {
  __extends(FuncR, _super);
  function FuncR(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feFuncR';
    FuncR.__super__.constructor.call(this, p_options);
  }
  return FuncR;
})(Svg.Filters.FuncA);
Svg.Filters.Flood = (function(_super) {
  __extends(Flood, _super);
  Flood["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        'flood-color': null,
        'flood-opacity': null
      }
    }, Flood.DEFAULT_OPTIONS)
  });
  function Flood(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feFlood';
    Flood.__super__.constructor.call(this, p_options);
  }
  return Flood;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.ConvolveMatrix = (function(_super) {
  __extends(ConvolveMatrix, _super);
  ConvolveMatrix["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null,
        order: null,
        kernelMatrix: null,
        divisor: null,
        bias: null,
        targetX: null,
        targetY: null,
        edgeMode: 'duplicate',
        kernelUnitLength: null,
        preserveAlpha: 'false'
      }
    }, ConvolveMatrix.DEFAULT_OPTIONS)
  });
  function ConvolveMatrix(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feConvolveMatrix';
    ConvolveMatrix.__super__.constructor.call(this, p_options);
  }
  return ConvolveMatrix;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.DiffuseLighting = (function(_super) {
  __extends(DiffuseLighting, _super);
  DiffuseLighting["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null,
        surfaceScale: null,
        diffuseConstant: null,
        kernelUnitLength: null
      }
    }, DiffuseLighting.DEFAULT_OPTIONS)
  });
  function DiffuseLighting(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feDiffuseLighting';
    DiffuseLighting.__super__.constructor.call(this, p_options);
  }
  return DiffuseLighting;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.Offset = (function(_super) {
  __extends(Offset, _super);
  Offset["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null,
        dx: null,
        dy: null
      }
    }, Offset.DEFAULT_OPTIONS)
  });
  function Offset(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feOffset';
    Offset.__super__.constructor.call(this, p_options);
  }
  return Offset;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.Turbulence = (function(_super) {
  __extends(Turbulence, _super);
  Turbulence["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        baseFrequency: null,
        numOctaves: null,
        seed: null,
        stitchTiles: 'noStitch',
        type: 'turbulence'
      }
    }, Turbulence.DEFAULT_OPTIONS)
  });
  function Turbulence(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feTurbulence';
    Turbulence.__super__.constructor.call(this, p_options);
  }
  return Turbulence;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.DisplacementMap = (function(_super) {
  __extends(DisplacementMap, _super);
  DisplacementMap["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null,
        in2: null,
        scale: null,
        xChannelSelector: 'A',
        yChannelSelector: 'A'
      }
    }, DisplacementMap.DEFAULT_OPTIONS)
  });
  function DisplacementMap(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feDisplacementMap';
    DisplacementMap.__super__.constructor.call(this, p_options);
  }
  return DisplacementMap;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.Tile = (function(_super) {
  __extends(Tile, _super);
  Tile["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null
      }
    }, Tile.DEFAULT_OPTIONS)
  });
  function Tile(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feTile';
    Tile.__super__.constructor.call(this, p_options);
  }
  return Tile;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.SpecularLighting = (function(_super) {
  __extends(SpecularLighting, _super);
  SpecularLighting["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null,
        surfaceScale: null,
        specularConstant: null,
        specularExponent: null,
        kernelUnitLength: null
      }
    }, SpecularLighting.DEFAULT_OPTIONS)
  });
  function SpecularLighting(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feSpecularLighting';
    SpecularLighting.__super__.constructor.call(this, p_options);
  }
  return SpecularLighting;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.PointLight = (function(_super) {
  __extends(PointLight, _super);
  PointLight["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        x: null,
        y: null,
        z: null
      }
    }, PointLight.DEFAULT_OPTIONS)
  });
  function PointLight(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'fePointLight';
    PointLight.__super__.constructor.call(this, p_options);
  }
  return PointLight;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.SpotLight = (function(_super) {
  __extends(SpotLight, _super);
  SpotLight["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        x: null,
        y: null,
        z: null,
        pointsAtX: null,
        pointsAtY: null,
        pointsAtZ: null,
        specularExponent: null,
        limitingConeAngle: null
      }
    }, SpotLight.DEFAULT_OPTIONS)
  });
  function SpotLight(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feSpotLight';
    SpotLight.__super__.constructor.call(this, p_options);
  }
  return SpotLight;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.Merge = (function(_super) {
  __extends(Merge, _super);
  function Merge(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feMerge';
    Merge.__super__.constructor.call(this, p_options);
  }
  return Merge;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.MergeNode = (function(_super) {
  __extends(MergeNode, _super);
  MergeNode["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null
      }
    }, MergeNode.DEFAULT_OPTIONS)
  });
  function MergeNode(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feMergeNode';
    MergeNode.__super__.constructor.call(this, p_options);
  }
  return MergeNode;
})(Svg.Filters.FilterPrimitive);
Svg.Filters.Composite = (function(_super) {
  __extends(Composite, _super);
  Composite["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      attrs: {
        "in": null,
        in2: null,
        operator: 'over',
        k1: null,
        k2: null,
        k3: null,
        k4: null
      }
    }, Composite.DEFAULT_OPTIONS)
  });
  function Composite(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    p_options.element = 'feComposite';
    Composite.__super__.constructor.call(this, p_options);
  }
  return Composite;
})(Svg.Filters.FilterPrimitive);
var GridPacker;
GridPacker = (function() {
  function GridPacker() {}
  GridPacker.prototype.fit = function(blocks, w, h) {
    var block, len, n, node;
    if (w == null) {
      w = null;
    }
    if (h == null) {
      h = null;
    }
    n = void 0;
    node = void 0;
    block = void 0;
    len = blocks.length;
    this._autoGrowRight = w === null;
    this._autoGrowDown = h === null;
    w = w || (len > 0 ? blocks[0].w : 0);
    h = h || (len > 0 ? blocks[0].h : 0);
    this.z = 0;
    this.root = {
      x: 0,
      y: 0,
      w: w,
      h: h
    };
    n = 0;
    while (n < len) {
      block = blocks[n];
      if (node = this.findNode(this.root, block.w, block.h, this.root.type, block.type)) {
        block.fit = this.splitNode(node, block.w, block.h);
      } else if (this._autoGrowRight || this._autoGrowDown) {
        block.fit = this.growNode(block.w, block.h);
      }
      n++;
    }
  };
  GridPacker.prototype.findNode = function(root, w, h, baseType, type) {
    if (baseType == null) {
      baseType = null;
    }
    if (type == null) {
      type = null;
    }
    if (root.used) {
      return this.findNode(root.right, w, h, root.type, type) || this.findNode(root.down, w, h, root.type, type);
    } else if (w <= root.w && h <= root.h) {
      root.z = this.z++;
      root.type = type;
      return root;
    } else {
      return null;
    }
  };
  GridPacker.prototype.splitNode = function(node, w, h) {
    var _downH, _downW, _rightH;
    node.used = true;
    _rightH = this._fixValue(Math.max(h, node.h));
    _downH = this._fixValue(node.h - h);
    _downW = _rightH > _downH ? this._fixValue(w) : this._fixValue(node.w);
    node.down = {
      x: node.x,
      y: node.y + h,
      w: _downW,
      h: _downH,
      z: 'D#' + node.z
    };
    node.right = {
      x: node.x + w,
      y: node.y,
      w: this._fixValue(node.w - w),
      h: _rightH,
      z: 'R#' + node.z
    };
    return node;
  };
  GridPacker.prototype._fixValue = function(value) {
    if (Number(value).toFixed() === '0') {
      return 0;
    } else {
      return value;
    }
  };
  GridPacker.prototype.growNode = function(w, h) {
    if (this._autoGrowDown) {
      return this.growDown(w, h);
    } else if (this._autoGrowRight) {
      return this.growRight(w, h);
    } else {
      return null;
    }
  };
  GridPacker.prototype.growDown = function(w, h) {
    var node;
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w,
      h: this.root.h + h,
      down: {
        x: 0,
        y: this.root.h,
        w: this.root.w,
        h: h
      },
      right: this.root
    };
    if (node = this.findNode(this.root, w, h)) {
      return this.splitNode(node, w, h);
    } else {
      return null;
    }
  };
  GridPacker.prototype.growRight = function(w, h) {
    var node;
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w + w,
      h: this.root.h,
      down: this.root,
      right: {
        x: this.root.w,
        y: 0,
        w: w,
        h: this.root.h
      }
    };
    if (node = this.findNode(this.root, w, h)) {
      return this.splitNode(node, w, h);
    } else {
      return null;
    }
  };
  return GridPacker;
})();
var GridFrame;
GridFrame = (function(_super) {
  __extends(GridFrame, _super);
  GridFrame["const"]({
    DEFAULT_SIZE: {
      col: 1,
      row: 1
    }
  });
  GridFrame["const"]({
    DEFAULT_INDEX: -1
  });
  GridFrame["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      className: GridFrame.BASE_CLASSNAME,
      size: GridFrame.DEFAULT_SIZE,
      index: GridFrame.DEFAULT_INDEX
    }, GridFrame.DEFAULT_OPTIONS)
  });
  function GridFrame(p_options) {
    if (p_options == null) {
      p_options = {};
    }
    this._ready = __bind(this._ready, this);
    GridFrame.__super__.constructor.call(this, p_options);
    this._showed = false;
    this._view = null;
    this._size = this.DEFAULT_SIZE;
    this._index = this.DEFAULT_INDEX;
    this.create();
  }
  GridFrame.get({
    showed: function() {
      var _ref;
      return (_ref = this._view) != null ? _ref.showed : void 0;
    }
  });
  GridFrame.get({
    index: function() {
      return this._index;
    }
  });
  GridFrame.set({
    index: function(p_index) {
      if (p_index == null) {
        p_index = -1;
      }
      return this.option('index', p_index);
    }
  });
  GridFrame.set({
    size: function(p_size) {
      if (p_size == null) {
        p_size = null;
      }
      if (p_size != null) {
        return this.option('size', p_size);
      }
    }
  });
  GridFrame.get({
    size: function() {
      return this._size;
    }
  });
  GridFrame.get({
    weight: function() {
      if (this._size != null) {
        return this._size.row * this._size.col;
      } else {
        return 0;
      }
    }
  });
  GridFrame.get({
    priority: function() {
      return this.option('priority');
    }
  });
  GridFrame.get({
    view: function() {
      return this._view;
    }
  });
  GridFrame.prototype.componentLayout = function() {
    this._wrapper = new BaseDOM({
      className: "" + this._options.className + "-wrapper"
    });
    return this.appendChild(this._wrapper);
  };
  GridFrame.prototype.show = function(p_delay) {
    var _ref;
    if (p_delay == null) {
      p_delay = 0;
    }
    return (_ref = this._view) != null ? typeof _ref.showStart === "function" ? _ref.showStart(p_delay) : void 0 : void 0;
  };
  GridFrame.prototype.align = function(left, top, p_index) {
    var delay;
    if (p_index == null) {
      p_index = null;
    }
    if (p_index != null) {
      this._index = p_index;
    }
    delay = this._index * .05;
    return TweenMax.to(this.element, .3, {
      left: left,
      top: top,
      ease: Quart.easeInOut
    });
  };
  GridFrame.prototype.invalidateSize = function(maxColumns) {
    var _originSize, _ref, _ref1;
    if (maxColumns == null) {
      maxColumns = null;
    }
    if (maxColumns != null) {
      _originSize = (_ref = this._options) != null ? _ref.size : void 0;
      if (((_ref1 = this.size) != null ? _ref1.col : void 0) > maxColumns) {
        return this.size = {
          row: Math.round(maxColumns / (this.size.col / this.size.row)),
          col: maxColumns
        };
      } else if ((_originSize != null) && _originSize.col <= maxColumns) {
        return this.size = _originSize;
      }
    }
  };
  GridFrame.prototype.setView = function(p_view) {
    var _base;
    if (p_view == null) {
      p_view = null;
    }
    if ((p_view != null) && p_view instanceof BaseDOM) {
      this.clearView();
      this._view = p_view;
      this._wrapper.appendChild(this._view);
      if (typeof (_base = this._view).create === "function") {
        _base.create();
      }
      return this._view.frame = this;
    }
  };
  GridFrame.prototype.clearView = function() {
    var _ref;
    if ((_ref = this.view) != null) {
      if (typeof _ref.destroy === "function") {
        _ref.destroy();
      }
    }
    delete this._view;
    return this._view = null;
  };
  GridFrame.prototype.requestLoad = function() {
    var _ref;
    return (_ref = this._view) != null ? _ref.requestLoad() : void 0;
  };
  GridFrame.prototype.destroy = function() {
    this.clearView();
    return GridFrame.__super__.destroy.apply(this, arguments);
  };
  GridFrame.prototype._invalidate = function() {
    GridFrame.__super__._invalidate.apply(this, arguments);
    if (this._options.size != null) {
      this._size = this._options.size;
    }
    this._index = this._options.index;
    return this.css({
      zIndex: this._index,
      width: "" + (parseInt(this._size.col)) + "em",
      height: "" + (parseInt(this._size.row)) + "em"
    });
  };
  GridFrame.prototype._ready = function(event) {
    if (event == null) {
      event = null;
    }
  };
  return GridFrame;
})(BaseComponent);
var Grid;
Grid = (function(_super) {
  __extends(Grid, _super);
  Grid["const"]({
    DEFAULT_MAX_COLUMNS: 10
  });
  Grid["const"]({
    DEFAULT_MIN_COLUMNS: 2
  });
  Grid["const"]({
    DEFAULT_FLEX_COLUMNS: {
      min: 320,
      max: 1440
    }
  });
  Grid["const"]({
    GRIDFRAME_CREATE: 'grid_gridframe_create'
  });
  Grid["const"]({
    GRIDFRAME_DESTROY: 'grid_gridframe_destroy'
  });
  Grid["const"]({
    GRIDFRAME_SHOW: 'grid_gridframe_show'
  });
  Grid["const"]({
    GRIDFRAME_HIDE: 'grid_gridframe_hide'
  });
  Grid["const"]({
    BASE_CLASSNAME: 'grid'
  });
  Grid["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      className: Grid.BASE_CLASSNAME,
      flexColumns: Grid.DEFAULT_FLEX_COLUMNS,
      maxColumns: Grid.DEFAULT_MAX_COLUMNS,
      minColumns: Grid.DEFAULT_MIN_COLUMNS
    }, Grid.DEFAULT_OPTIONS)
  });
  function Grid(p_options, childClassName) {
    if (p_options == null) {
      p_options = {};
    }
    if (childClassName == null) {
      childClassName = GridFrame.BASE_CLASSNAME;
    }
    this._didScroll = __bind(this._didScroll, this);
    this._resize = __bind(this._resize, this);
    this.layout = __bind(this.layout, this);
    this.reset = __bind(this.reset, this);
    this._childClassName = childClassName;
    this._childs = [];
    this._fillerBlocks = [];
    this._dataItems = [];
    this._fillerItems = [];
    this._initialized = false;
    this._drawReady = false;
    this._firstRender = false;
    p_options.element = 'section';
    Grid.__super__.constructor.call(this, p_options);
    this._resize = FunctionUtils.throttle(this._resize, 200);
  }
  Grid.get({
    maxColumns: function() {
      return this._maxColumns;
    }
  });
  Grid.set({
    maxColumns: function(p_value) {
      return this.option('maxColumns', p_value);
    }
  });
  Grid.get({
    minColumns: function() {
      return this._minColumns;
    }
  });
  Grid.set({
    minColumns: function(p_value) {
      return this.option('minColumns', p_value);
    }
  });
  Grid.get({
    currentColumns: function() {
      return this._currentColumns;
    }
  });
  Grid.get({
    growMode: function() {
      if (!this._growMode) {
        this._growMode = this._checkGrowMode(this);
        if (this._growMode.width === 'auto' && this._growMode.height === 'auto') {
          this.css('width', '100%');
          this._growMode = this._checkGrowMode(this);
        } else {
          if (!this._originWHRatio) {
            this._originWHRatio = this._wrapper.width / this._wrapper.height * 100;
          }
          if (!this._originHWRatio) {
            this._originHWRatio = this._wrapper.height / this._wrapper.width * 100;
          }
        }
        if (this._growMode.width === true && this._growMode.height === true) {
          this.css('height', this.height + 'px');
          this._growMode = this._checkGrowMode(this);
        }
      }
      return this._growMode;
    }
  });
  Grid.get({
    filler: function() {
      return this._fillerItems;
    }
  });
  Grid.set({
    filler: function(p_filler) {
      var fillerData, item, k, _blocks, _copyItems, _i, _itemData, _len, _ref, _results;
      if (p_filler == null) {
        p_filler = [];
      }
      if (p_filler !== this._fillerItems) {
        this._fillerItems = p_filler;
        _copyItems = ArrayUtils.shuffle(this._fillerItems);
        _blocks = this._fillerBlocks.length;
        _ref = this._fillerBlocks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _itemData = null;
          for (k in _copyItems) {
            fillerData = _copyItems[k];
            if (item.size.row === fillerData.size.row && item.size.col === fillerData.size.col) {
              _itemData = _copyItems.splice(k, 1)[0];
              _copyItems.push(_itemData);
              break;
            }
          }
          if (_itemData != null) {
            item.data = _itemData;
            _results.push(this.trigger(Grid.GRIDFRAME_CREATE, {
              frame: item
            }));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    }
  });
  Grid.get({
    items: function() {
      return this._dataItems;
    }
  });
  Grid.set({
    items: function(p_items) {
      var findIndex, item, removeIndex, removedItem, _frame, _length;
      if (p_items == null) {
        p_items = [];
      }
      if (p_items !== this._dataItems) {
        _length = this._dataItems.length;
        while (_length-- > 0) {
          item = this._dataItems[_length];
          if (item != null) {
            findIndex = p_items.indexOf(item);
            if (findIndex !== -1) {
              p_items.splice(findIndex, 1);
            } else {
              removeIndex = this._dataItems.indexOf(item);
              removedItem = this._dataItems.splice(removeIndex, 1)[0];
              delete removedItem.view;
              removedItem.view = null;
              _frame = this._childs.splice(removeIndex, 1)[0];
              if (_frame != null) {
                if (typeof _frame.destroy === "function") {
                  _frame.destroy();
                }
                this.trigger(Grid.GRIDFRAME_DESTROY, {
                  frame: _frame
                });
              }
            }
          }
        }
        Array.prototype.push.apply(this._dataItems, p_items);
        this._drawReady = false;
        return this.layout();
      }
    }
  });
  Grid.get({
    children: function() {
      return this.findAll(this._childClassName);
    }
  });
  Grid.get({
    scrollTop: function() {
      var B, D;
      if (typeof pageYOffset !== 'undefined') {
        return pageYOffset;
      } else {
        B = document.body;
        D = document.documentElement;
        D = D.clientHeight ? D : B;
        return D.scrollTop;
      }
    }
  });
  Grid.prototype.componentLayout = function() {
    this._wrapper = new BaseDOM({
      className: "" + this._options.className + "-wrapper"
    });
    this.appendChild(this._wrapper);
    this._packer = new GridPacker();
    return this._initialized = true;
  };
  Grid.prototype.createComplete = function() {
    this._resize();
    Resizer.getInstance().on(Resizer.RESIZE, this._resize);
    window.addEventListener('scroll', this._didScroll);
    this._invalidateOptions();
    return this.trigger(this.constructor.CREATE);
  };
  Grid.prototype.destroy = function() {
    var _ref;
    Resizer.getInstance().off(Resizer.RESIZE, this._resize);
    this.reset();
    this._initialized = false;
    this._firstRender = false;
    if ((_ref = this._wrapper) != null) {
      _ref.destroy();
    }
    delete this._packer;
    this._packer = null;
    return Grid.__super__.destroy.apply(this, arguments);
  };
  Grid.prototype._invalidate = function() {
    var _ref, _ref1;
    Grid.__super__._invalidate.apply(this, arguments);
    this._maxColumns = this._options.maxColumns || Grid.DEFAULT_MAX_COLUMNS;
    this._minColumns = this._options.minColumns || Grid.DEFAULT_MIN_COLUMNS;
    this._currentColumns = this._maxColumns;
    this._flexMin = ((_ref = this._options.flexColumns) != null ? _ref.min : void 0) || Grid.DEFAULT_FLEX_COLUMNS.min;
    this._flexMax = ((_ref1 = this._options.flexColumns) != null ? _ref1.max : void 0) || Grid.DEFAULT_FLEX_COLUMNS.max;
    this._updateColumns();
    return this.items = this._options.items || [];
  };
  Grid.prototype.reset = function() {
    var k, v, _item, _ref;
    clearTimeout(this._timeoutRequestFrame);
    _ref = this._childs;
    for (k in _ref) {
      v = _ref[k];
      if (typeof v.destroy === "function") {
        v.destroy();
      }
      _item = this._dataItems[k];
      delete _item.view;
      _item = null;
    }
    this._childs.length = 0;
    this._dataItems.length = 0;
    this._resetFillers();
    return this._drawReady = false;
  };
  Grid.prototype.layout = function() {
    if (!this._initialized || !this._options) {
      return;
    }
    return this._redraw();
  };
  Grid.prototype._updateColumns = function() {
    var _preferredCol;
    if (this._autoWidth || this._autoHeight) {
      _preferredCol = Math.floor(NumberUtils.toPercent(window.innerWidth, this._flexMin, this._flexMax) / 100 * this._maxColumns);
      if (_preferredCol % 2 !== 0) {
        if (_preferredCol > this._maxColumns / 2) {
          _preferredCol--;
        } else {
          _preferredCol++;
        }
      }
      _preferredCol = Math.max(this._minColumns, Math.min(_preferredCol, this._maxColumns));
      if (_preferredCol !== this._currentColumns) {
        this._currentColumns = _preferredCol;
        return true;
      }
    }
    return false;
  };
  Grid.prototype._redraw = function() {
    var cellSize, _areaRatio, _cellSizeForRatio;
    this._relWidth = this.growMode.width === true;
    this._relHeight = this.growMode.height === true;
    this._autoWidth = this.growMode.width === 'auto';
    this._autoHeight = this.growMode.height === 'auto';
    this._wRatio = this._wrapper.width / window.innerWidth * 100;
    this._hRatio = this._wrapper.height / window.innerHeight * 100;
    cellSize = this._getCellSize();
    if (!this._drawReady) {
      this._createChildren(cellSize);
    }
    _cellSizeForRatio = cellSize + (1 / (this._currentColumns / 2));
    _areaRatio = void 0;
    switch (true) {
      case this._relHeight && this._relWidth:
        _areaRatio = "" + (_cellSizeForRatio / Math.max(window.innerWidth, window.innerHeight) * 100) + "vmax";
        break;
      case this._relWidth && this._autoHeight:
        _areaRatio = "" + (_cellSizeForRatio / window.innerWidth * 100) + "vw";
        break;
      case this._relHeight && this._autoWidth:
        _areaRatio = "" + (_cellSizeForRatio / window.innerHeight * 100) + "vh";
        break;
      default:
        _areaRatio = "" + _cellSizeForRatio + "px";
    }
    this._wrapper.css({
      fontSize: _areaRatio
    });
    this._updateChildren(cellSize);
    this._drawReady = true;
    return this._firstRender = true;
  };
  Grid.prototype._createChildren = function(cellSize) {
    var data, frame, k, _maxPriority, _ref, _results, _stack;
    _stack = [];
    _maxPriority = -1;
    _ref = this._dataItems;
    _results = [];
    for (k in _ref) {
      data = _ref[k];
      if (data.view == null) {
        frame = new GridFrame(data, this._childClassName);
        frame.addClass("block-" + k);
        data.view = frame;
        this._childs.push(frame);
        this._wrapper.appendChild(frame);
        frame.css({
          position: 'absolute'
        });
        _results.push(this.trigger(Grid.GRIDFRAME_CREATE, {
          frame: frame
        }));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  Grid.prototype._updateChildren = function(cellSize) {
    var blocks, frame, _length;
    blocks = [];
    this._resetFillers();
    _length = this._childs.length;
    while (_length-- > 0) {
      frame = this._childs[_length];
      frame.invalidateSize(this.currentColumns);
      if ((this.currentColumns != null) && this.currentColumns === this._minColumns) {
        frame.size = {
          row: this._minColumns,
          col: this._minColumns
        };
      }
      blocks.unshift({
        w: cellSize * frame.size.col,
        h: cellSize * frame.size.row,
        frame: frame,
        type: frame.data.type
      });
    }
    if (!isNaN(cellSize)) {
      return this._gridPacker(blocks, cellSize);
    }
  };
  Grid.prototype._resetFillers = function() {
    var frame, _fillers;
    _fillers = this._fillerBlocks.length;
    while (_fillers--) {
      frame = this._fillerBlocks[_fillers];
      if (typeof frame.destroy === "function") {
        frame.destroy();
      }
      this.trigger(Grid.GRIDFRAME_DESTROY, {
        frame: frame
      });
    }
    return this._fillerBlocks.length = 0;
  };
  Grid.prototype._checkViewport = function() {
    var delay, frame, scrollBottom, viewArea, viewInBounds, _i, _len, _ref, _results;
    if (this._all != null) {
      delay = 0;
      scrollBottom = this.scrollTop + window.innerHeight;
      _ref = this._all;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        frame = _ref[_i];
        viewInBounds = frame.getBounds();
        viewArea = Math.min(window.innerHeight, viewInBounds.bottom) - Math.max(0, viewInBounds.top);
        if (((viewArea / frame.element.offsetHeight > .55) || (viewInBounds.bottom < window.innerHeight)) && !frame.showed) {
          frame.show(delay * .15);
          _results.push(delay++);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };
  Grid.prototype._resize = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this._updateColumns()) {
      return this.layout();
    }
  };
  Grid.prototype._getCellSize = function() {
    var _factor, _height, _size, _width;
    _size = 0;
    _factor = 1;
    if (!this._autoWidth && !this._autoHeight) {
      if (this._hRatio < this._wRatio) {
        _factor = this._hRatio / 100;
      }
      if (this._wRatio < this._hRatio) {
        _factor = this._wRatio / 100;
      }
    }
    _width = this._wrapper.width;
    _height = this._wrapper.height;
    if (this._autoHeight) {
      _size = _width / (this.currentColumns * _factor);
    } else if (this._autoWidth) {
      _size = _height / (this.currentColumns * _factor);
    } else {
      _size = Math.min(_width, _height) / (this.currentColumns * _factor);
    }
    return _size;
  };
  Grid.prototype._gridPacker = function(blocks, cellSize) {
    var cell, k, n, newBlocks, o, _coords, _height, _index, _types, _width;
    blocks.sort((function(_this) {
      return function(a, b) {
        if (Math.max(a.frame.size.col) > Math.max(a.frame.size.col)) {
          return 1;
        } else {
          return -1;
        }
      };
    })(this));
    _types = {};
    blocks.forEach((function(_this) {
      return function(item, index, array) {
        if (_types[item.type] == null) {
          _types[item.type] = [];
        }
        return _types[item.type].push(item);
      };
    })(this));
    n = 0;
    newBlocks = [];
    while (n < blocks.length) {
      for (k in _types) {
        o = _types[k];
        if (o.length) {
          newBlocks.push(o.shift());
          n++;
        }
      }
    }
    blocks = newBlocks;
    blocks = ArrayUtils.fromEndToMiddle(blocks);
    this._packer.fit(blocks, !this._autoWidth ? this._wrapper.width : void 0, !this._autoHeight && !(this._relHeight && !this._relWidth && !this._autoWidth) ? this._wrapper.height : void 0);
    this._root = this._packer.root;
    if (this._autoHeight) {
      _height = 'auto';
      if (this._relWidth) {
        _height = "" + (this._root.h / this._root.w * this._wRatio) + "vw";
      } else {
        _height = "" + this._root.h + "px";
      }
      this.css({
        height: _height
      });
    } else if (this._relWidth && !this._relHeight) {
      _height = "" + (this._root.h / this._wrapper.width * this._wRatio) + "vw";
      this.css({
        height: _height
      });
    } else if (this._autoWidth) {
      _width = 'auto';
      if (this._relHeight) {
        _width = "" + (this._root.w / this._root.h * this._hRatio) + "vh";
      } else {
        _width = "" + this._root.w + "px";
      }
      this.css({
        width: _width
      });
    }
    this._fillingCount = blocks.length;
    this._fillingBlockNodes = [];
    for (k in blocks) {
      cell = blocks[k];
      if (cell.fit) {
        _coords = this._getCoords(cell.fit);
        _index = parseInt(k);
        if (!cell.frame.showed) {
          cell.frame.css({
            left: _coords.left,
            top: _coords.top
          });
        }
        cell.frame.align(_coords.left, _coords.top);
        this._fillingGrid(cell, cellSize);
      }
    }
    return setTimeout((function(_this) {
      return function() {
        _this._all = [].concat(_this._childs, _this._fillerBlocks);
        _this._all.sort(function(a, b) {
          if (a.element.offsetTop < b.element.offsetTop) {
            return -1;
          } else if (a.element.offsetTop > b.element.offsetTop) {
            return 1;
          } else if (a.element.offsetLeft < b.element.offsetLeft) {
            return -1;
          } else {
            return 1;
          }
          return 0;
        });
        return _this._timeoutRequestFrame = setTimeout(function() {
          var frame, _ref, _request;
          _ref = _this._all;
          for (k in _ref) {
            frame = _ref[k];
            frame.index = parseInt(k);
            _request = function() {
              return arguments.callee.frame.requestLoad();
            };
            _request.frame = frame;
            if (!_this._firstRequest) {
              setTimeout(_request, frame.index * 175);
            } else {
              setTimeout(_request);
            }
          }
          _this._firstRequest = true;
          return _this._checkViewport();
        }, 375);
      };
    })(this));
  };
  Grid.prototype._fillingGrid = function(cell, baseCellSize) {
    var spaceSize;
    if (!cell.fit.down.used && cell.fit.down.w * cell.fit.down.h > 0) {
      spaceSize = {
        col: Math.round(cell.fit.down.w / baseCellSize),
        row: Math.round(cell.fit.down.h / baseCellSize),
        fit: cell.fit.down
      };
      this._newSpaceFoundOne(spaceSize, cell, baseCellSize);
    }
    if (!cell.fit.right.used && cell.fit.right.w * cell.fit.right.h > 0) {
      spaceSize = {
        col: Math.round(cell.fit.right.w / baseCellSize),
        row: Math.round(cell.fit.right.h / baseCellSize),
        fit: cell.fit.right
      };
      return this._newSpaceFoundOne(spaceSize, cell, baseCellSize);
    }
  };
  Grid.prototype._getCoords = function(fitBlock) {
    var _left, _top;
    _left = 0;
    _top = 0;
    if (this._autoWidth || (this._relHeight && !this._relWidth)) {
      _left = "" + (fitBlock.x / this._root.w * 100) + "%";
    } else if (this._relWidth && this._relHeight) {
      _left = "" + (fitBlock.x / Math.max(this._root.h, this._root.w) * 100) + "vmax";
    } else if (this._relWidth) {
      _left = "" + (fitBlock.x / this._root.w * this._wRatio) + "vw";
    } else if (this._relHeight) {
      _left = "" + (fitBlock.x / this._root.h * this._hRatio) + "vh";
    }
    if (this._autoHeight || (this._relWidth && !this._relHeight)) {
      _top = "" + (fitBlock.y / this._root.h * 100) + "%";
    } else if (this._relHeight && this._relWidth) {
      _top = "" + (fitBlock.y / Math.max(this._root.h, this._root.w) * 100) + "vmax";
    } else if (this._relHeight) {
      _top = "" + (fitBlock.y / this._root.h * this._hRatio) + "vh";
    } else if (this._relWidth) {
      _top = "" + (fitBlock.y / this._root.w * this._wRatio) + "vw";
    }
    return {
      left: _left,
      top: _top
    };
  };
  Grid.prototype._newSpaceFoundOne = function(spaceSize, cell, baseCellSize) {
    var h, i, maxCells, maxCols, maxStep, newBlock, size, step, w, _i, _results;
    if (spaceSize == null) {
      spaceSize = null;
    }
    if (cell == null) {
      cell = null;
    }
    spaceSize.fit.originX = spaceSize.fit.x;
    spaceSize.fit.originY = spaceSize.fit.x;
    if ((spaceSize != null) && (cell != null)) {
      step = 2;
      maxCells = Math.round((spaceSize.col / step) * (spaceSize.row / step));
      maxCols = spaceSize.col - step;
      _results = [];
      for (i = _i = 0; 0 <= maxCells ? _i < maxCells : _i > maxCells; i = 0 <= maxCells ? ++_i : --_i) {
        size = {
          col: step,
          row: step
        };
        h = size.row * baseCellSize;
        w = size.col * baseCellSize;
        newBlock = {
          data: {
            size: size
          },
          fit: {
            x: spaceSize.fit.x,
            y: spaceSize.fit.y,
            w: w,
            h: h
          }
        };
        if (maxCols === 0) {
          spaceSize.fit.y += h;
          spaceSize.fit.x = spaceSize.fit.originX;
          maxStep = spaceSize.col - step;
        } else {
          spaceSize.fit.x += w;
        }
        maxCols -= step;
        _results.push(this._createFillBlock(newBlock, cell));
      }
      return _results;
    }
  };
  Grid.prototype._newSpaceFound = function(spaceSize, cell, baseCellSize) {
    var h, i, maxCells, maxStep, maxValue, newBlock, size, step, w, _i, _results;
    if (spaceSize == null) {
      spaceSize = null;
    }
    if (cell == null) {
      cell = null;
    }
    if ((spaceSize != null) && (cell != null)) {
      maxValue = Math.max(spaceSize.row, spaceSize.col);
      maxCells = Math.round(Math.max(spaceSize.row, spaceSize.col) / 2);
      step = 2;
      maxStep = maxValue;
      _results = [];
      for (i = _i = 0; 0 <= maxCells ? _i < maxCells : _i > maxCells; i = 0 <= maxCells ? ++_i : --_i) {
        if (spaceSize.row > spaceSize.col) {
          size = {
            col: spaceSize.col,
            row: Math.min(step, maxStep)
          };
          h = size.row * baseCellSize;
          w = size.col * baseCellSize;
          newBlock = {
            data: {
              size: size
            },
            fit: {
              x: spaceSize.fit.x,
              y: spaceSize.fit.y,
              w: w,
              h: h
            }
          };
          spaceSize.fit.y += h;
        } else {
          size = {
            col: Math.min(step, maxStep),
            row: spaceSize.row
          };
          h = size.row * baseCellSize;
          w = size.col * baseCellSize;
          newBlock = {
            data: {
              size: size
            },
            fit: {
              x: spaceSize.fit.x,
              y: spaceSize.fit.y,
              w: w,
              h: h
            }
          };
          spaceSize.fit.x += w;
        }
        maxStep -= step;
        _results.push(this._createFillBlock(newBlock, cell));
      }
      return _results;
    }
  };
  Grid.prototype._createFillBlock = function(block, cell) {
    var fillerData, frame, k, updatedData, _coords, _copyItems, _itemData;
    if (block.fit && this._root) {
      this._fillingCount++;
      updatedData = false;
      if (Array.isArray(this._fillerItems) && this._fillerItems.length > 0 && (block.data.type == null)) {
        _itemData = null;
        _copyItems = ArrayUtils.shuffle(this._fillerItems);
        for (k in _copyItems) {
          fillerData = _copyItems[k];
          if (block.data.size.row === fillerData.size.row && block.data.size.col === fillerData.size.col) {
            _itemData = _copyItems.splice(k, 1)[0];
            _copyItems.push(_itemData);
            break;
          }
        }
        if (_itemData != null) {
          block.data = _itemData;
          updatedData = true;
        }
      }
      frame = new GridFrame(block.data, this._childClassName);
      frame.addClass('fill-block');
      frame.css({
        position: 'absolute',
        zIndex: this._fillingCount
      });
      this._wrapper.appendChild(frame);
      this._fillerBlocks.push(frame);
      this.trigger(Grid.GRIDFRAME_CREATE, {
        frame: frame,
        fillBlock: block
      });
      _coords = this._getCoords(block.fit);
      block.frame = frame;
      block.w = cell.w;
      block.h = cell.h;
      frame._block = block;
      frame.css({
        top: _coords.top,
        left: _coords.left
      });
      return this._fillingBlockNodes.push(block);
    }
  };
  Grid.prototype._didScroll = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return this._checkViewport();
  };
  Grid.prototype._checkGrowMode = function(el) {
    var _rH, _rW;
    if (el == null) {
      el = null;
    }
    if (el == null) {
      return null;
    }
    _rW = this._isARelativeProp('width', el);
    _rH = this._isARelativeProp('height', el);
    return {
      width: _rW,
      height: _rH
    };
  };
  Grid.prototype._isARelativeProp = function(styleProp, el) {
    var m, match, re, _found, _i, _len, _matches, _relMetrics, _style;
    if (el == null) {
      el = null;
    }
    _matches = this._getMatchesCss(el);
    _found = false;
    _relMetrics = ['vh', 'vw', 'vmin', 'vmax', '%'];
    _style = el.css(styleProp);
    if (_style.length > 0) {
      if (_style === 'auto') {
        return _style;
      }
      re = new RegExp("(([\\d]{1,})+([\\w,\\%]{1,2})|auto)", "i");
      m = void 0;
      if ((m = re.exec(_style)) !== null) {
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
        if (m[0] === 'auto') {
          return 'auto';
        }
        _found = _relMetrics.indexOf(m[3]) > -1;
      }
    } else {
      for (_i = 0, _len = _matches.length; _i < _len; _i++) {
        match = _matches[_i];
        re = new RegExp("" + styleProp + "\:\\s?(([\\d]{1,})+([\\w,\\%]{1,2})|auto)", "i");
        m = void 0;
        if ((m = re.exec(match)) !== null) {
          if (m.index === re.lastIndex) {
            re.lastIndex++;
          }
          if (m[1] === 'auto') {
            return 'auto';
          }
          _found = _relMetrics.indexOf(m[3]) > -1;
          if (_found) {
            break;
          }
        }
      }
    }
    return _found;
  };
  Grid.prototype._getMatchesCss = function(el) {
    var i, o, r, rules, sheets, _matches, _selector;
    if (el == null) {
      el = null;
    }
    if (!el) {
      return null;
    }
    sheets = document.styleSheets;
    o = [];
    for (i in sheets) {
      rules = sheets[i].rules || sheets[i].cssRules;
      for (r in rules) {
        _selector = rules[r].selectorText;
        if ((_selector != null) && _selector.indexOf('*::') === -1) {
          _matches = el.matches(_selector);
        }
        if (!!_matches) {
          o.push(rules[r].cssText);
        }
      }
    }
    return o;
  };
  return Grid;
})(BaseComponent);
var ImageView;
ImageView = (function(_super) {
  __extends(ImageView, _super);
  ImageView["const"]({
    LOADING: 'imageview-loading'
  });
  ImageView["const"]({
    LOADED: 'imageview-loaded'
  });
  ImageView["const"]({
    START: 'imageview-start'
  });
  ImageView["const"]({
    INIT: 'imageview-init'
  });
  ImageView["const"]({
    BASE_CLASSNAME: 'image-view'
  });
  ImageView["const"]({
    DEFAULT_OPTIONS: ObjectUtils.merge({
      className: ImageView.BASE_CLASSNAME,
      element: 'figure',
      render: 'img',
      fit: 'origin',
      position: 'center',
      img: {
        attrs: {
          draggable: false,
          alt: '',
          title: ''
        }
      }
    }, ImageView.DEFAULT_OPTIONS)
  });
  ImageView["const"]({
    FIT_PARAMS: 'none auto exact cover contain origin'
  });
  ImageView["const"]({
    STYLE: ".image-view {position: relative;display: inline-block;width: 200px;height: 200px;overflow: hidden;margin: 0;}.image-view .image-loading {position: absolute;left: 0;right: 0;top: 50%;width: 40%;margin: 0 auto;transform: translateY(-50%) perspective(1px);max-width: 50px;max-height: 50px;opacity: 0;}.small_up .image-view .image-loading {max-width: 100px;max-height: 100px;}.image-view .image-loading:after {content: '';display: block;padding-bottom: 100%;}.image-view .image {position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;pointer-events: none;}.image-view img.image {max-height: 100%;max-width: 100%;}.image-view img.image.left {left: 0 !important;right: auto;}.image-view img.image.right {right: 0 !important;left: auto;}.image-view img.image.top {top: 0 !important;bottom: auto;}.image-view img.image.bottom {bottom: 0 !important;top: auto;}.image-view img.image.cover.wh, .image-view img.image.cover.sq {width: auto;height: 100%;min-width: 100%;max-width: none;max-height: 100%;}.image-view img.image.cover.hw {height: auto;width: 100%;min-height: 100%;max-height: none;max-width: 100%;}.image-view img.image.cover.center {left: 50%;transform: translateX(-50%) perspective(1px);}.image-view img.image.contain {max-height: 100%;max-width: 100%;}.image-view img.image.contain.wh, .image-view img.image.contain.sq {min-width: 100%;}.image-view img.image.contain.hw {min-height: 100%;}.image-view img.image.exact {width: 100%;height: 100%;}.image-view div.image {width: 100%;height: 100%;background-repeat: no-repeat;background-size: auto auto;}.image-view div.image.center {background-position: center center;}.image-view div.image.center.left {background-position: left center;}.image-view div.image.center.right {background-position: right center;}.image-view div.image.top {background-position: center top;}.image-view div.image.top.left {background-position: left top;}.image-view div.image.top.right {background-position: right top;}.image-view div.image.bottom {background-position: center bottom;}.image-view div.image.bottom.left {background-position: left bottom;}.image-view div.image.bottom.right {background-position: right bottom;}.image-view div.image.left {right: auto;}.image-view div.image.right {left: auto;}.image-view div.image.top {bottom: auto;}.image-view div.image.bottom {top: auto;}.image-view div.image.none {background-size: auto auto;}.image-view div.image.auto {background-size: auto auto !important;}.image-view div.image.exact {background-size: 100% 100% !important;}.image-view div.image.contain {background-size: contain !important;}.image-view div.image.cover {background-size: cover !important;}.image-view .loader {position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: 0 auto;opacity: 0.3;font-size: 10px;text-indent: -9999em;border-radius: 50%;border-top: 1.1em solid rgba(255,255,255,0.2);border-right: 1.1em solid rgba(255,255,255,0.2);border-bottom: 1.1em solid rgba(255,255,255,0.2);border-left: 1.1em solid #fff;transform: translateZ(0) translateY(-50%) perspective(1px);animation: loading 1.1s infinite linear;}@-moz-keyframes loading {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}@-webkit-keyframes loading {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}@-o-keyframes loading {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}@keyframes loading {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}"
  });
  function ImageView(p_options) {
    var _base, _base1;
    if (p_options == null) {
      p_options = {};
    }
    this._didError = __bind(this._didError, this);
    this._didLoad = __bind(this._didLoad, this);
    this._didProgress = __bind(this._didProgress, this);
    this._breakpointChanges = __bind(this._breakpointChanges, this);
    this._resize = __bind(this._resize, this);
    this._loaded = false;
    this._created = false;
    this._src = null;
    this._imageElement = null;
    this._currentGroup = null;
    this._loader = app.loader || AssetLoader.getInstance();
    this._groupId = "" + this.constructor.BASE_CLASSNAME + "_" + (StringUtils.random());
    this._loaderGroup = this._loader.getGroup(this._groupId);
    this._loaderGroup.addEventListener(AssetLoader.COMPLETE_ALL, this._didLoad);
    this._loaderGroup.addEventListener(AssetLoader.ERROR, this._didError);
    this._loaderGroup.addEventListener(AssetLoader.PROGRESS_ALL, this._didProgress);
    this._loaderGroup.addEventListener(AssetLoader.FILE_ERROR, this._didError);
    if ((p_options.label != null) && (p_options.alt == null)) {
      p_options.alt = p_options.label;
    }
    if (p_options.alt != null) {
      if (p_options.img == null) {
        p_options.img = {};
      }
      if ((_base = p_options.img).attrs == null) {
        _base.attrs = {};
      }
      p_options.img.attrs.alt = p_options.alt;
      delete p_options.alt;
    }
    if (p_options.title != null) {
      if (p_options.img == null) {
        p_options.img = {};
      }
      if ((_base1 = p_options.img).attrs == null) {
        _base1.attrs = {};
      }
      p_options.img.attrs.title = p_options.title;
      delete p_options.title;
    }
    ImageView.__super__.constructor.call(this, p_options);
    this.create();
  }
  ImageView.get({
    data: function() {
      return this._options;
    }
  });
  ImageView.get({
    loaded: function() {
      var _ref;
      return ((_ref = this._loaderGroup) != null ? _ref.loaded : void 0) || false;
    }
  });
  ImageView.get({
    loading: function() {
      var _progress;
      _progress = this.progress;
      return _progress > 0 && _progress < 1;
    }
  });
  ImageView.get({
    progress: function() {
      var _ref;
      return ((_ref = this._loaderGroup) != null ? _ref.progress : void 0) || 0;
    }
  });
  ImageView.get({
    src: function() {
      return this._src;
    }
  });
  ImageView.set({
    src: function(p_src) {
      var _file, _id, _loaded, _newSrc, _ref, _ref1, _ref2, _resultConditionals, _sources;
      if (p_src == null) {
        p_src = null;
      }
      if (p_src != null) {
        _newSrc = p_src;
        if (Array.isArray(p_src.src) || Array.isArray(p_src.id)) {
          _sources = Array.isArray(p_src.id) ? p_src.id : p_src.src;
          _resultConditionals = this._checkConditionals(_sources);
          _newSrc = _resultConditionals;
          if (_newSrc.file != null) {
            _newSrc.src = _newSrc.file;
          }
        }
        if (typeof _newSrc === 'object') {
          if (_newSrc.tag instanceof HTMLElement) {
            _loaded = _newSrc.tag;
          }
          if (!Array.isArray(_newSrc.id) && (_newSrc.id != null)) {
            _id = _newSrc.id;
          } else {
            _id = _newSrc.src;
          }
          _newSrc = ((_ref = _newSrc.tag) != null ? _ref.src : void 0) || _newSrc.src;
        }
        if (typeof _newSrc === 'string') {
          _id = _newSrc;
          if ((_newSrc == null) || _newSrc.length <= 0) {
            return;
          }
        }
        if ((this._src != null) && _newSrc === this._src) {
          return;
        }
        this._originalSource = p_src;
        this._src = _newSrc;
        _loaded = _loaded || ((_ref1 = this._loader.getItem(_id)) != null ? _ref1.tag : void 0);
        _file = {
          id: _id,
          src: this._src
        };
        if (_loaded != null) {
          this.trigger(ImageView.START, _file);
          return setTimeout((function(_this) {
            return function() {
              return _this._invalidateImage(_loaded.cloneNode(true));
            };
          })(this));
        } else {
          if (this._loaderGroup.progress > 0) {
            this._loaderGroup.close();
          }
          return setTimeout((function(_this) {
            return function() {
              if ((_this._loaderGroup != null) && (_this._loading != null)) {
                if (_this._loading.element) {
                  if (!_this._loading.isAttached) {
                    _this.appendChild(_this._loading);
                  }
                  TweenMax.to(_this._loading.element, .5, {
                    opacity: 1,
                    ease: Quad.easeOut
                  });
                }
                _this._loaderGroup.loadFile(_file);
                return _this.trigger(ImageView.START, _file);
              }
            };
          })(this));
        }
      } else {
        this._src = null;
        if ((_ref2 = this._imageElement) != null) {
          _ref2.destroy();
        }
        this._imageElement = new BaseDOM({
          className: 'image'
        });
        return this.appendChild(this._imageElement);
      }
    }
  });
  ImageView.get({
    image: function() {
      return this._imageElement;
    }
  });
  ImageView.prototype.destroy = function() {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    this._created = this._loaded = false;
    if ((_ref = this._loaderGroup) != null) {
      _ref.close();
    }
    if ((_ref1 = this._loaderGroup) != null) {
      _ref1.removeEventListener(AssetLoader.COMPLETE_ALL, this._didLoad);
    }
    if ((_ref2 = this._loaderGroup) != null) {
      _ref2.removeEventListener(AssetLoader.PROGRESS_ALL, this._didProgress);
    }
    if ((_ref3 = this._loaderGroup) != null) {
      _ref3.removeEventListener(AssetLoader.ERROR, this._didError);
    }
    if ((_ref4 = this._loaderGroup) != null) {
      _ref4.removeEventListener(AssetLoader.FILE_ERROR, this._didError);
    }
    if ((_ref5 = this._loaderGroup) != null) {
      _ref5.destroy();
    }
    if ((_ref6 = this._loadingIcon) != null) {
      _ref6.destroy();
    }
    if ((_ref7 = this._loading) != null) {
      _ref7.destroy();
    }
    if ((_ref8 = this._imageElement) != null) {
      _ref8.destroy();
    }
    Resizer.getInstance().off(Resizer.RESIZE, this._throttledResize);
    Resizer.getInstance().off(Resizer.BREAKPOINT_CHANGE, this._breakpointChanges);
    this._options = this._src = this._originalSource = this._loaderGroup = null;
    delete this._options;
    delete this._src;
    delete this._originalSource;
    delete this._loaderGroup;
    return ImageView.__super__.destroy.apply(this, arguments);
  };
  ImageView.prototype.componentLayout = function() {
    this._loading = new BaseDOM({
      element: 'div',
      className: 'image-loading'
    });
    this.appendChild(this._loading);
    this._loadingIcon = new BaseDOM({
      element: 'div',
      className: 'loader'
    });
    this._loading.appendChild(this._loadingIcon);
    this._imageElement = new BaseDOM({
      className: 'image'
    });
    this.appendChild(this._imageElement);
    this.trigger(ImageView.INIT);
    this._throttledResize = FunctionUtils.throttle(this._resize, 50);
    Resizer.getInstance().on(Resizer.RESIZE, this._throttledResize);
    return Resizer.getInstance().on(Resizer.BREAKPOINT_CHANGE, this._breakpointChanges);
  };
  ImageView.prototype._invalidate = function() {
    ImageView.__super__._invalidate.apply(this, arguments);
    if (this._options.src) {
      this.src = this._options.src;
    }
    if (this.constructor.FIT_PARAMS.indexOf(this._options.fit.replace(/\s/gi, '$').split('$')[0]) === -1) {
      this._options.fit = this.constructor.DEFAULT_OPTIONS.fit;
    }
    return this._invalidateImage();
  };
  ImageView.prototype._invalidateImage = function(image) {
    var _fit, _image, _imgOptions, _newImage, _ref, _render;
    if (image == null) {
      image = null;
    }
    if (!this._loaded && !this._created) {
      return;
    }
    _fit = this._options.fit;
    _render = this._options.render;
    if ((image != null) && image instanceof HTMLElement) {
      _newImage = true;
      this._originalSize = {
        width: image.width,
        height: image.height
      };
      if (image.width === 0 || image.height === 0) {
        this._imageElement.appendChild(image);
        image.onload = (function(_this) {
          return function() {
            image.onload = null;
            return _this._invalidateImage(image);
          };
        })(this);
        return;
      } else {
        setTimeout((function(_this) {
          return function() {
            if (_this._loading.isAttached) {
              _this.removeChild(_this._loading);
            }
            return _this.trigger(ImageView.LOADED, {
              item: {
                tag: image
              }
            });
          };
        })(this));
      }
      if (this._imageElement != null) {
        this._imageElement.html = '';
        this._imageElement.destroy();
        delete this._imageElement;
      }
      this._imageElement = new BaseDOM({
        className: 'image'
      });
      this.appendChildAt(this._imageElement, 1);
      if (_render === 'background') {
        this._imageElement.css('background-image', "url(" + (image.getAttribute('src')) + ")");
      } else {
        _image = new BaseDOM({
          element: image
        });
        this.replaceChild(_image, this._imageElement);
        this._imageElement = _image;
      }
    }
    this._imageElement.attr('class', "image " + this._options.fit + " " + this._options.position);
    _imgOptions = (_ref = this._options) != null ? _ref.img : void 0;
    if (_imgOptions.attrs != null) {
      this._imageElement.attr(_imgOptions.attrs, null, _imgOptions.namespace);
    }
    if (_imgOptions.style != null) {
      this._imageElement.css(_imgOptions.style);
    }
    this._imageElement.element.removeAttribute('width');
    this._imageElement.element.removeAttribute('height');
    this._invalidateRatio();
    if (_newImage) {
      TweenMax.set(this._imageElement.element, {
        opacity: 0
      });
      return TweenMax.to(this._imageElement.element, .5, {
        opacity: 1,
        ease: Quad.easeOut
      });
    }
  };
  ImageView.prototype._invalidateRatio = function(sourceImage) {
    var _containerRatio, _fit, _originalRatio;
    if (sourceImage == null) {
      sourceImage = null;
    }
    if ((this._originalSize != null) && (this._imageElement != null)) {
      _fit = this._options.fit;
      _originalRatio = this._originalSize.width / this._originalSize.height;
      _containerRatio = this.width / this.height;
      this._imageElement.removeClass('sq');
      this._imageElement.removeClass('wh');
      this._imageElement.removeClass('hw');
      if (Math.floor(this._originalSize.width) === Math.floor(this._originalSize.height)) {
        this._imageElement.addClass('sq');
      }
      if (_fit === 'contain') {
        if (this._originalSize.width > this._originalSize.height) {
          this._imageElement.addClass('wh');
        }
        if (this._originalSize.height > this._originalSize.width) {
          this._imageElement.addClass('hw');
        }
      } else {
        if (_originalRatio > _containerRatio) {
          this._imageElement.addClass('wh');
        }
        if (_originalRatio < _containerRatio) {
          this._imageElement.addClass('hw');
        }
      }
      if (_fit === 'origin') {
        return this.css({
          width: this._originalSize.width + 'px',
          height: this._originalSize.height + 'px'
        });
      }
    }
  };
  ImageView.prototype._checkConditionals = function(p_src) {
    var item, validations, _i, _len;
    validations = ConditionsValidation.getInstance();
    for (_i = 0, _len = p_src.length; _i < _len; _i++) {
      item = p_src[_i];
      if (item.condition != null) {
        if (validations.test(item.condition)) {
          return item;
        }
        continue;
      } else {
        return item;
      }
    }
    return null;
  };
  ImageView.prototype._resize = function() {
    if (!this._loaded && !this._created) {
      return;
    }
    return this._invalidateRatio();
  };
  ImageView.prototype._breakpointChanges = function(event) {
    if (event == null) {
      event = null;
    }
    if (this._originalSource != null) {
      return this.src = this._originalSource;
    }
  };
  ImageView.prototype._didProgress = function(event) {
    if (event == null) {
      event = null;
    }
    return this.trigger(ImageView.LOADING, event);
  };
  ImageView.prototype._didLoad = function(event) {
    var item, _ref;
    if (event == null) {
      event = null;
    }
    item = this._loaderGroup.getItem(this.src);
    if (item != null) {
      if (((_ref = this._loading) != null ? _ref.element : void 0) != null) {
        return TweenMax.to(this._loading.element, .2, {
          opacity: 0,
          ease: Quad.easeOut,
          onComplete: (function(_this) {
            return function() {
              var _image;
              _image = item.tag.cloneNode(true);
              return _this._invalidateImage(_image);
            };
          })(this)
        });
      }
    }
  };
  ImageView.prototype._didError = function(event) {
    if (event == null) {
      event = null;
    }
    return TweenMax.to(this._loading.element, .3, {
      opacity: 0,
      ease: Quad.easeOut
    });
  };
  return ImageView;
})(BaseComponent);
var UiComponents;
UiComponents = (function(_super) {
  __extends(UiComponents, _super);
  function UiComponents(p_data, p_className) {
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
    UiComponents.__super__.constructor.call(this, p_data, 'section');
  }
  UiComponents.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._background = new BaseDOM({
      className: 'background'
    });
    this._background.css({
      'opacity': 0,
      'height': '100%',
      'background-color': '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
    return UiComponents.__super__.createStart.apply(this, arguments);
  };
  UiComponents.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return UiComponents.__super__.create.apply(this, arguments);
  };
  UiComponents.prototype.createComplete = function(evt) {
    var sampleImage, _image, _image2, _rect, _ref, _testEl, _testEl2, _text;
    if (evt == null) {
      evt = null;
    }
    sampleImage = this.content.logo;
    _testEl = new BaseDOM({
      className: 'el1'
    });
    this.appendChild(_testEl);
    _testEl2 = new BaseDOM({
      className: 'el2'
    });
    this.replaceChild(_testEl2, _testEl);
    _image = new ImageView({
      src: sampleImage,
      fit: 'contain'
    });
    this.appendChild(_image);
    _image2 = new ImageView({
      src: sampleImage,
      fit: 'cover',
      position: 'center top',
      style: {
        width: '100px',
        height: '50px'
      }
    });
    this.appendChild(_image2);
    this._svg = new Svg({
      className: 'teste',
      attrs: {
        width: 200,
        height: 200
      }
    });
    this.appendChild(this._svg);
    _text = new Svg.Text({
      text: 'novidade',
      attrs: {
        x: '10',
        y: '1em',
        'font-family': 'Times New Roman'
      }
    });
    _text.text = ['agora ', 'v', 'a', 'i', '!'];
    _image = new Svg.Image({
      attrs: {
        'xlink:href': ((_ref = sampleImage.tag) != null ? _ref.src : void 0) || sampleImage.src,
        x: '50%'
      }
    });
    _rect = new Svg.Rect({
      attrs: {
        x: '50%',
        y: '0',
        width: '100',
        height: '100'
      }
    });
    _image.clipPath(_rect);
    this._svg.appendChild(_image);
    this._svg.appendChild(_text);
    this._filter = _text.filter({
      attrs: {
        id: 'blur'
      }
    }, new Svg.Filters.GaussianBlur({
      attrs: {
        "in": 'SourceGraphic',
        stdDeviation: '1'
      }
    }));
    this._filterImage = _image.filter({
      attrs: {
        id: 'imageFilter'
      }
    }, new Svg.Filters.Turbulence({
      attrs: {
        result: 'turbulence',
        baseFrequency: '0.05',
        numOctaves: '2'
      }
    }), new Svg.Filters.DisplacementMap({
      attrs: {
        "in": 'SourceGraphic',
        in2: 'turbulence',
        scale: '50',
        xChannelSelector: 'R',
        yChannelSelector: 'A'
      }
    }));
    return UiComponents.__super__.createComplete.apply(this, arguments);
  };
  UiComponents.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return UiComponents.__super__.showStart.apply(this, arguments);
  };
  UiComponents.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this._background.element, 1, {
      opacity: 1,
      onComplete: (function(_this) {
        return function() {
          return UiComponents.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };
  UiComponents.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return UiComponents.__super__.showComplete.apply(this, arguments);
  };
  UiComponents.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return UiComponents.__super__.hideStart.apply(this, arguments);
  };
  UiComponents.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this._background.element, .5, {
      opacity: 0,
      onComplete: (function(_this) {
        return function() {
          return UiComponents.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };
  UiComponents.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return UiComponents.__super__.hideComplete.apply(this, arguments);
  };
  UiComponents.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.killTweensOf(this._background.element);
    this._svg.destroy();
    this._svg = null;
    this._background.destroy();
    this._background = null;
    return UiComponents.__super__.destroy.apply(this, arguments);
  };
  return UiComponents;
})(BaseView);
var Main;
Main = (function(_super) {
  var _controller;
  __extends(Main, _super);
  function Main() {
    this.create = __bind(this.create, this);
    return Main.__super__.constructor.apply(this, arguments);
  }
  _controller = new DefaultNavigationController();
  Main.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
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