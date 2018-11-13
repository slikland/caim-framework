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
@class DefaultNavigationController
@extends BaseNavigationController
@submodule caim.navigation.types
 */
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
    params = this._parseParams(pathParts[1] || pathParts[2]);
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
    console.log(this._getParams());
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
        routeRE = new RegExp("^(?:\/)?" + strictParams + "$", 'g');
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
/**
@class DOMUtils
@static
@submodule caim.utils
 */
var DOMUtils;
DOMUtils = (function() {
  function DOMUtils() {}
  /**
  	@method addCSSClass
  	@static
  	@param {HTMLElement} el
  	@param {String} className
  	@return {HTMLElement}
   */
  DOMUtils.addCSSClass = function(el, className) {
    var classNames, i, p;
    if (!(el instanceof Element)) {
      return;
    }
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = el.className.replace(/\s+/ig, ' ').split(' ');
    p = classNames.length;
    i = className.length;
    while (i-- > 0) {
      if (classNames.indexOf(className[i]) >= 0) {
        continue;
      }
      classNames[p++] = className[i];
    }
    el.className = classNames.join(' ');
    return el;
  };
  /**
  	@method removeCSSClass
  	@static
  	@param {HTMLElement} el
  	@param {String} className
  	@return {HTMLElement}
   */
  DOMUtils.removeCSSClass = function(el, className) {
    var classNames, i, p;
    if (!(el instanceof Element)) {
      return;
    }
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = el.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    while (i-- > 0) {
      if ((p = classNames.indexOf(className[i])) >= 0) {
        classNames.splice(p, 1);
      }
    }
    el.className = classNames.join(' ');
    return el;
  };
  /**
  	@method hasCSSClass
  	@static
  	@param {HTMLElement} el
  	@param {String} className
  	@return {Boolean}
   */
  DOMUtils.hasCSSClass = function(el, className) {
    var classNames, hasClass, i;
    if (!(el instanceof Element)) {
      return;
    }
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = el.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    hasClass = true;
    while (i-- > 0) {
      hasClass &= classNames.indexOf(className[i]) >= 0;
    }
    return hasClass;
  };
  /**
  	@method toggleCSSClass
  	@static
  	@param {HTMLElement} el
  	@param {String} name
  	@param {Boolean} [toggle=null]
   */
  DOMUtils.toggleCSSClass = function(el, name, toggle) {
    var has;
    if (toggle == null) {
      toggle = null;
    }
    if (!el) {
      return;
    }
    has = this.hasCSSClass(el, name);
    if (toggle === null) {
      toggle = !has;
    }
    if (toggle) {
      return this.addCSSClass(el, name);
    } else {
      return this.removeCSSClass(el, name);
    }
  };
  /**
  	@method findParentQuerySelector
  	@static
  	@param {HTMLElement} target
  	@param {String} selector
  	@return {HTMLElement|Boolean}
   */
  DOMUtils.findParentQuerySelector = function(target, selector) {
    var i, items;
    if (!target.parentNode || target.parentNode === target) {
      return false;
    }
    items = target.parentNode.querySelectorAll(selector);
    i = items.length;
    while (i-- > 0) {
      if (items[i] === target) {
        return target;
      }
    }
    return this.findParentQuerySelector(target.parentNode, selector);
  };
  /**
  	@method removeAllChildren
  	@static
  	@param {HTMLElement} target
   */
  DOMUtils.removeAllChildren = function(target) {
    while (target.childNodes.length) {
      target.removeChild(target.firstChild);
    }
    return false;
  };
  return DOMUtils;
})();
/**
@class Resizer
@extends EventDispatcher
@submodule caim.utils
 */
var Resizer;
Resizer = (function(_super) {
  var _body, _bounds;
  __extends(Resizer, _super);
  /**
  	@event RESIZE
  	@static
   */
  Resizer.RESIZE = 'resize_resizer';
  /**
  	@event ORIENTATION_CHANGE
  	@static
   */
  Resizer.ORIENTATION_CHANGE = 'orientation_change_resizer';
  /**
  	@event BREAKPOINT_CHANGE
  	@static
   */
  Resizer.BREAKPOINT_CHANGE = 'breakpoint_changed_resizer';
  _bounds = null;
  _body = null;
  /**
  	@method getInstance
  	@static
  	@param {Boolean} [p_start=false]
  	@return {Resizer}
   */
  Resizer.getInstance = function(p_start) {
    if (p_start == null) {
      p_start = true;
    }
    return Resizer._instance != null ? Resizer._instance : Resizer._instance = new Resizer(p_start);
  };
  /**
  	@class Resizer
  	@constructor
  	@param {Boolean} [p_start=true]
  	@extends EventDispatcher
   */
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
    this._currentOrientation = this.orientation;
    if (p_start != null) {
      this.start();
    }
    Resizer.__super__.constructor.apply(this, arguments);
  }
  /**
  	@property width
  	@type {Number}
  	@readOnly
   */
  Resizer.get({
    width: function() {
      return window.innerWidth;
    }
  });
  /**
  	@property height
  	@type {Number}
  	@readOnly
   */
  Resizer.get({
    height: function() {
      return window.innerHeight;
    }
  });
  /**
  	@property orientation
  	@type {String} 'landscape' or 'portrait'
  	@readOnly
   */
  Resizer.get({
    orientation: function() {
      var ratio;
      ratio = screen.width / screen.height;
      if (window.innerWidth > window.innerHeight && ratio > 1.3) {
        return 'landscape';
      } else {
        return 'portrait';
      }
    }
  });
  /**
  	Gets/Sets bounds
  	@property bounds
  	@type {Object} The object like {"top":0, "bottom":0, "left":0, "right":0}
   */
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
  /**
  	@method start
   */
  Resizer.prototype.start = function() {
    window.addEventListener('resize', this.change);
    window.addEventListener('orientationchange', this.change);
    this.change(null, true);
    return false;
  };
  /**
  	@method stop
   */
  Resizer.prototype.stop = function() {
    window.removeEventListener('resize', this.change);
    window.removeEventListener('orientationchange', this.change);
    return false;
  };
  /**
  	@method change
  	@param {Event} evt
  	@param {Boolean} [allKinds=false]
   */
  Resizer.prototype.change = function(evt, allKinds) {
    var k, v, _data, _ref, _ref1;
    if (allKinds == null) {
      allKinds = false;
    }
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
    if (this._currentOrientation !== this.orientation) {
      this.trigger(Resizer.ORIENTATION_CHANGE, _data);
      this._currentOrientation = this.orientation;
    }
    if (app.conditions != null) {
      _ref = app.conditions.list;
      for (k in _ref) {
        v = _ref[k];
        if ((v['size'] != null) || (v['orientation'] != null) || !!allKinds) {
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
      for (k in _ref1) {
        v = _ref1[k];
        if ((v['size'] != null) || (v['orientation'] != null) || !!allKinds) {
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
          }
        }
      }
    }
    return false;
  };
  /**
  	@method addClass
  	@param {String} className
  	@return {HTMLElement}
   */
  Resizer.prototype.addClass = function(className) {
    return DOMUtils.addCSSClass(_body, className);
  };
  /**
  	@method removeClass
  	@param {String} className
  	@return {HTMLElement}
   */
  Resizer.prototype.removeClass = function(className) {
    return DOMUtils.removeCSSClass(_body, className);
  };
  /**
  	@method hasClass
  	@param {String} className
  	@return {Boolean}
   */
  Resizer.prototype.hasClass = function(className) {
    return DOMUtils.hasCSSClass(_body, className);
  };
  return Resizer;
})(EventDispatcher);
/**
@class ColorUtils
@static
@submodule caim.utils
 */
var ColorUtils;
ColorUtils = (function() {
  function ColorUtils() {}
  /**
  	Darken/lighten a hexadecimal colors
  	@method lightenOrDarken
  	@static
  	@param {String} p_hex The target hexadecimal color value to be darkened or lightened.
  	@param {Number} p_amount This value must be between -1 and 1 (-1 more darken and 1 more lighten)
  	@return {String} The hexadecimal value of result.
   */
  ColorUtils.lightenOrDarken = function(p_hex, p_amount) {
    var black, c, color, i, shade, white;
    color = p_hex.replace(/[^0-9a-f]/gi, '');
    if (color.length < 6) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    p_amount = p_amount || 0;
    shade = '#';
    c = void 0;
    i = void 0;
    black = 0;
    white = 255;
    i = 0;
    while (i < 3) {
      c = parseInt(color.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(black, c + p_amount * white), white)).toString(16);
      shade += ('00' + c).substr(c.length);
      i++;
    }
    return shade;
  };
  /**
  	Generate a random hexadecimal color
  	@method randomHex
  	@static
  	@return {String} The hexadecimal value of result.
   */
  ColorUtils.randomHex = function() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };
  /**
  	Generate a random RGB color
  	@method randomRGB
  	@static
  	@return {String} The RGB value of result on format rgb(r,g,b)
   */
  ColorUtils.randomRGB = function() {
    return ColorUtils.hexToRGB(ColorUtils.randomHex());
  };
  /**
  	Converts a Hexadecimal color value to integer value. 
  	@method hexToInt
  	@static
  	@return {String} The result integer value
   */
  ColorUtils.hexToInt = function(p_hex) {
    p_hex = p_hex.substr(4, 2) + p_hex.substr(2, 2) + p_hex.substr(0, 2);
    return parseInt(p_hex, 16);
  };
  /**
  	Converts a RGB color value to integer value. 
  	@method RGBToInt
  	@static
  	@return {String} The result integer value
   */
  ColorUtils.RGBToInt = function(p_r, p_g, p_b) {
    return ColorUtils.hexToInt(ColorUtils.RGBToHex(p_r, p_g, p_b));
  };
  /**
  	Converts a RGB color value to Hexadecimal value. 
  	@method RGBToHex
  	@static
  	@return {String} The result Hexadecimal value
   */
  ColorUtils.RGBToHex = function(p_r, p_g, p_b) {
    var hex;
    hex = p_r << 16 | p_g << 8 | p_b;
    return "#" + hex.toString(16);
  };
  /**
  	Converts a Hexadecimal color value to RGB value. 
  	@method hexToRGB
  	@static
  	@return {String} The RGB value of result on format rgb(r,g,b)
   */
  ColorUtils.hexToRGB = function(p_hex) {
    var b, g, hex, r;
    hex = 0;
    if (p_hex.charAt(0) === '#') {
      if (p_hex.length === 4) {
        p_hex = '#' + p_hex.charAt(1).repeat(2) + p_hex.charAt(2).repeat(2) + p_hex.charAt(3).repeat(2);
      }
      hex = parseInt(p_hex.slice(1), 16);
    }
    r = hex >> 16 & 0xFF;
    g = hex >> 8 & 0xFF;
    b = hex & 0xFF;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  };
  return ColorUtils;
})();
/**
@class FunctionUtils
@static
@submodule caim.utils
 */
var FunctionUtils;
FunctionUtils = (function() {
  function FunctionUtils() {}
  /**
  @method debounce
  @static
  @param {Function} fn
  @param {Number} delay
  @return {Function}
   */
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
  /**
  @method throttle
  @static
  @param {Function} fn
  @param {Number} [threshhold=250]
  @param {Function} [scope=null]
  @return {Function}
   */
  FunctionUtils.throttle = function(fn, threshhold, scope) {
    var deferTimer, last;
    if (threshhold == null) {
      threshhold = 250;
    }
    if (scope == null) {
      scope = null;
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
/**
@class MediaDOM
@extends BaseDOM
@submodule caim.media
 */
var MediaDOM;
MediaDOM = (function(_super) {
  __extends(MediaDOM, _super);
  MediaDOM["const"]({
    PAUSE: 'pause'
  });
  MediaDOM["const"]({
    RESUME: 'resume'
  });
  MediaDOM["const"]({
    STOP: 'stop'
  });
  MediaDOM["const"]({
    PLAY: 'play'
  });
  MediaDOM["const"]({
    CANSTART: 'canstart'
  });
  MediaDOM["const"]({
    RUNNING: 'running'
  });
  MediaDOM["const"]({
    LOADING: 'loading'
  });
  MediaDOM["const"]({
    SEEKING_START: 'seekingstart'
  });
  MediaDOM["const"]({
    SEEKING_COMPLETE: 'seekingcomplete'
  });
  MediaDOM["const"]({
    COMPLETE: 'complete'
  });
  MediaDOM["const"]({
    ERROR: 'error'
  });
  function MediaDOM(p_src, p_startFrom, p_autoplay) {
    if (p_startFrom == null) {
      p_startFrom = 0;
    }
    if (p_autoplay == null) {
      p_autoplay = false;
    }
    this.destroy = __bind(this.destroy, this);
    this.stop = __bind(this.stop, this);
    this.play = __bind(this.play, this);
    this.resume = __bind(this.resume, this);
    this.pause = __bind(this.pause, this);
    this.togglePlay = __bind(this.togglePlay, this);
    this.windowActive = __bind(this.windowActive, this);
    this.windowInactive = __bind(this.windowInactive, this);
    this.complete = __bind(this.complete, this);
    this.loading = __bind(this.loading, this);
    this.running = __bind(this.running, this);
    this.seekingComplete = __bind(this.seekingComplete, this);
    this.seekingStart = __bind(this.seekingStart, this);
    this.error = __bind(this.error, this);
    this.ready = __bind(this.ready, this);
    this.blockContextMenu = __bind(this.blockContextMenu, this);
    if (!p_src) {
      throw new Error('The param p_src is null');
    }
    this._type = p_src.replace(/^.*\./i, '') === 'mp4' ? 'video' : 'audio';
    MediaDOM.__super__.constructor.call(this, {
      element: this._type
    });
    this.element.on('contextmenu', this.blockContextMenu);
    this.element.on('durationchange', this.ready);
    this.attr('src', p_src);
    this.attr('preload', 'metadata');
    app.on(App.WINDOW_ACTIVE, this.windowActive);
    app.on(App.WINDOW_INACTIVE, this.windowInactive);
    this.startFrom = p_startFrom;
    this.autoplay = p_autoplay;
  }
  MediaDOM.prototype.blockContextMenu = function(evt) {
    evt.preventDefault();
    return false;
  };
  MediaDOM.prototype.ready = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.element.off('durationchange', this.ready);
    this.element.on('seeking', this.seekingStart);
    this.element.on('seeked', this.seekingComplete);
    this.element.on('timeupdate', this.running);
    this.element.on('progress', this.loading);
    this.element.on('stalled', this.error);
    this.element.on('ended', this.complete);
    this.element.on('error', this.error);
    this.seek = this.startFrom;
    if (document.hasFocus() && this.autoplay) {
      this.play();
    }
    this.trigger(MediaDOM.CANSTART, {
      'duration': this.duration
    });
    return false;
  };
  MediaDOM.prototype.error = function(evt) {
    var _ref;
    if (evt == null) {
      evt = null;
    }
    if (((_ref = this.element.error) != null ? _ref.message : void 0) != null) {
      this.trigger(MediaDOM.ERROR, {
        'error': this.element.error,
        'message': this.element.error.message
      });
    } else if ((evt.message != null) && (evt.code != null)) {
      this.trigger(MediaDOM.ERROR, {
        'error': evt.code,
        'message': evt.message
      });
    } else {
      this.trigger(MediaDOM.ERROR);
    }
    return false;
  };
  MediaDOM.prototype.seekingStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(MediaDOM.SEEKING_START, {
      'position': this.seek
    });
    return false;
  };
  MediaDOM.prototype.seekingComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(MediaDOM.SEEKING_COMPLETE, {
      'position': this.seek
    });
    return false;
  };
  MediaDOM.prototype.running = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.startFrom) {
      this.seek = this.startFrom;
      this.startFrom = null;
    }
    this.trigger(MediaDOM.RUNNING, {
      'position': this.seek,
      'duration': this.duration
    });
    return false;
  };
  MediaDOM.prototype.loading = function(evt) {
    var i, items;
    if (evt == null) {
      evt = null;
    }
    i = this.element.buffered.length;
    items = [];
    while (i--) {
      items.push({
        'start': this.element.buffered.start(i),
        'end': this.element.buffered.end(i)
      });
    }
    this.trigger(MediaDOM.LOADING, {
      'buffer': items
    });
    return false;
  };
  MediaDOM.prototype.complete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(MediaDOM.COMPLETE);
    return false;
  };
  MediaDOM.prototype.windowInactive = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.hasPlayed) {
      this.pause();
    }
    return false;
  };
  MediaDOM.prototype.windowActive = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.hasPlayed) {
      this.resume();
    }
    return false;
  };
  MediaDOM.prototype.togglePlay = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (!this.isPaused) {
      this.hasPlayed = false;
      this.pause();
    } else {
      this.hasPlayed = true;
      this.resume();
    }
    return false;
  };
  MediaDOM.prototype.pause = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (!this.isPaused) {
      this.element.pause();
      this.trigger(MediaDOM.PAUSE);
    }
    return false;
  };
  MediaDOM.prototype.resume = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.isPaused) {
      this.element.play();
      this.trigger(MediaDOM.RESUME);
    }
    return false;
  };
  MediaDOM.prototype.play = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.isPaused) {
      this.element.play();
      this.hasPlayed = true;
      this.trigger(MediaDOM.PLAY);
    }
    return false;
  };
  MediaDOM.prototype.stop = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (!this.isPaused) {
      this.element.pause();
    }
    this.element.currentTime = 0;
    this.hasPlayed = false;
    this.trigger(MediaDOM.STOP);
    return false;
  };
  MediaDOM.get({
    type: function() {
      return this._type;
    }
  });
  MediaDOM.get({
    isPaused: function() {
      return this.element.paused;
    }
  });
  MediaDOM.get({
    hasPlayed: function() {
      return this._hasPlayed;
    }
  });
  MediaDOM.set({
    hasPlayed: function(p_value) {
      return this._hasPlayed = p_value;
    }
  });
  MediaDOM.get({
    loop: function() {
      return this.element.loop;
    }
  });
  MediaDOM.set({
    loop: function(p_value) {
      return this.element.loop = p_value;
    }
  });
  MediaDOM.get({
    mute: function() {
      return this.element.muted;
    }
  });
  MediaDOM.set({
    mute: function(p_value) {
      return this.element.muted = p_value;
    }
  });
  MediaDOM.get({
    volume: function() {
      return this.element.volume;
    }
  });
  MediaDOM.set({
    volume: function(p_value) {
      if (p_value > 1) {
        p_value = 1;
      } else if (p_value < 0) {
        p_value = 0;
      }
      return this.element.volume = p_value;
    }
  });
  MediaDOM.get({
    duration: function() {
      return this.element.duration;
    }
  });
  MediaDOM.get({
    seek: function() {
      return this.element.currentTime;
    }
  });
  MediaDOM.set({
    seek: function(p_value) {
      if (p_value > this.element.duration) {
        p_value = this.element.duration;
      } else if (p_value < 0) {
        p_value = 0;
      }
      return this.element.currentTime = p_value;
    }
  });
  MediaDOM.prototype.destroy = function() {
    this.element.off('contextmenu', this.blockContextMenu);
    this.element.off('durationchange', this.ready);
    this.element.off('seeking', this.seekingStart);
    this.element.off('seeked', this.seekingComplete);
    this.element.off('timeupdate', this.running);
    this.element.off('progress', this.loading);
    this.element.off('ended', this.complete);
    app.off(App.WINDOW_ACTIVE, this.windowActive);
    app.off(App.WINDOW_INACTIVE, this.windowInactive);
    this.stop();
    return MediaDOM.__super__.destroy.apply(this, arguments);
  };
  return MediaDOM;
})(BaseDOM);
/**
@class VideoCanvas
@extends BaseDOM
@submodule caim.media.video
 */
var VideoCanvas;
VideoCanvas = (function(_super) {
  __extends(VideoCanvas, _super);
  VideoCanvas["const"]({
    PAUSE: 'pause'
  });
  VideoCanvas["const"]({
    RESUME: 'resume'
  });
  VideoCanvas["const"]({
    STOP: 'stop'
  });
  VideoCanvas["const"]({
    PLAY: 'play'
  });
  VideoCanvas["const"]({
    CANSTART: 'canstart'
  });
  VideoCanvas["const"]({
    RUNNING: 'running'
  });
  VideoCanvas["const"]({
    LOADING: 'loading'
  });
  VideoCanvas["const"]({
    SEEKING_START: 'seekingstart'
  });
  VideoCanvas["const"]({
    SEEKING_COMPLETE: 'seekingcomplete'
  });
  VideoCanvas["const"]({
    COMPLETE: 'complete'
  });
  VideoCanvas["const"]({
    ERROR: 'error'
  });
  function VideoCanvas(p_srcVideo, p_startFrom, p_autoplay, p_srcAudio) {
    if (p_startFrom == null) {
      p_startFrom = 0;
    }
    if (p_autoplay == null) {
      p_autoplay = false;
    }
    if (p_srcAudio == null) {
      p_srcAudio = null;
    }
    this.destroy = __bind(this.destroy, this);
    this.draw = __bind(this.draw, this);
    this.stopRender = __bind(this.stopRender, this);
    this.startRender = __bind(this.startRender, this);
    this.stop = __bind(this.stop, this);
    this.play = __bind(this.play, this);
    this.resume = __bind(this.resume, this);
    this.pause = __bind(this.pause, this);
    this.windowActive = __bind(this.windowActive, this);
    this.windowInactive = __bind(this.windowInactive, this);
    this.togglePlay = __bind(this.togglePlay, this);
    this.complete = __bind(this.complete, this);
    this.loading = __bind(this.loading, this);
    this.running = __bind(this.running, this);
    this.seekingComplete = __bind(this.seekingComplete, this);
    this.seekingStart = __bind(this.seekingStart, this);
    this.error = __bind(this.error, this);
    this.ready = __bind(this.ready, this);
    this.blockContextMenu = __bind(this.blockContextMenu, this);
    if (!p_srcVideo) {
      throw new Error('The param p_srcVideo is null');
    }
    VideoCanvas.__super__.constructor.call(this);
    if (app.detections.os === 'ios') {
      p_srcAudio = !p_srcAudio ? p_srcVideo : p_srcAudio;
      this.audio = new BaseDOM({
        'element': 'audio'
      });
      this.audio.element.on('durationchange', this.ready);
      this.audio.element.on('contextmenu', this.blockContextMenu);
      this.audio.attr('src', p_srcAudio);
    }
    this.video = new BaseDOM({
      'element': 'video'
    });
    this.canvas = new BaseDOM({
      'element': 'canvas'
    });
    this.appendChild(this.canvas);
    this.context = this.canvas.element.getContext('2d');
    this.video.element.on('durationchange', this.ready);
    this.video.element.on('contextmenu', this.blockContextMenu);
    this.video.attr('src', p_srcVideo);
    this.video.attr('preload', 'metadata');
    app.on(App.WINDOW_ACTIVE, this.windowActive);
    app.on(App.WINDOW_INACTIVE, this.windowInactive);
    this.autoplay = p_autoplay;
    this.startFrom = p_startFrom;
  }
  VideoCanvas.prototype.blockContextMenu = function(evt) {
    evt.preventDefault();
    return false;
  };
  VideoCanvas.prototype.ready = function(evt) {
    if (evt == null) {
      evt = null;
    }
    evt.currentTarget.off('durationchange', this.ready);
    if (this.audio) {
      if (!this.audio.element.duration || this.audio.element.duration === NaN || !this.video.element.duration || this.video.element.duration === NaN) {
        return;
      }
    }
    this.canvas.attr('width', this.video.element.videoWidth);
    this.canvas.attr('height', this.video.element.videoHeight);
    if (this.audio) {
      this.audio.element.on('seeking', this.seekingStart);
      this.audio.element.on('seeked', this.seekingComplete);
      this.audio.element.on('timeupdate', this.running);
      this.audio.element.on('progress', this.loading);
      this.audio.element.on('stalled', this.error);
      this.audio.element.on('ended', this.complete);
      this.audio.element.on('error', this.error);
    } else {
      this.video.element.on('seeking', this.seekingStart);
      this.video.element.on('seeked', this.seekingComplete);
      this.video.element.on('timeupdate', this.running);
      this.video.element.on('progress', this.loading);
      this.video.element.on('stalled', this.error);
      this.video.element.on('ended', this.complete);
      this.video.element.on('error', this.error);
    }
    this.seek = this.startFrom;
    if (document.hasFocus() && this.autoplay) {
      this.play();
    }
    this.trigger(VideoCanvas.CANSTART, {
      'duration': this.duration
    });
    return false;
  };
  VideoCanvas.prototype.error = function(evt) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    if (evt == null) {
      evt = null;
    }
    if ((this.audio && (((_ref = this.audio) != null ? (_ref1 = _ref.element) != null ? (_ref2 = _ref1.error) != null ? _ref2.message : void 0 : void 0 : void 0) != null)) || (((_ref3 = this.video) != null ? (_ref4 = _ref3.element) != null ? (_ref5 = _ref4.error) != null ? _ref5.message : void 0 : void 0 : void 0) != null)) {
      this.trigger(MediaMobile.ERROR, {
        'error': this.audio.element.error || this.video.element.error,
        'message': this.audio.element.error.message || this.video.element.error.message
      });
    } else if ((evt.message != null) && (evt.code != null)) {
      this.trigger(VideoCanvas.ERROR, {
        'error': evt.code,
        'message': evt.message
      });
    } else {
      this.trigger(VideoCanvas.ERROR);
    }
    return false;
  };
  VideoCanvas.prototype.seekingStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(VideoCanvas.SEEKING_START, {
      'position': this.seek
    });
    return false;
  };
  VideoCanvas.prototype.seekingComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(VideoCanvas.SEEKING_COMPLETE, {
      'position': this.seek
    });
    return false;
  };
  VideoCanvas.prototype.running = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.startFrom) {
      this.seek = this.startFrom;
      this.startFrom = null;
    }
    if (this.audio) {
      this.video.element.currentTime = this.audio.element.currentTime;
      this.draw(false);
    }
    this.trigger(VideoCanvas.RUNNING, {
      'position': this.seek,
      'duration': this.duration
    });
    return false;
  };
  VideoCanvas.prototype.loading = function(evt) {
    var i, items;
    if (evt == null) {
      evt = null;
    }
    i = this.video.element.buffered.length;
    items = [];
    while (i--) {
      items.push({
        'start': this.video.element.buffered.start(i),
        'end': this.video.element.buffered.end(i)
      });
    }
    this.trigger(VideoCanvas.LOADING, {
      'buffer': items
    });
    return false;
  };
  VideoCanvas.prototype.complete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(VideoCanvas.COMPLETE);
    return false;
  };
  VideoCanvas.prototype.togglePlay = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (!this.isPaused) {
      this.hasPlayed = false;
      this.pause();
    } else {
      this.hasPlayed = true;
      this.resume();
    }
    return false;
  };
  VideoCanvas.prototype.windowInactive = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.hasPlayed) {
      this.pause();
    }
    return false;
  };
  VideoCanvas.prototype.windowActive = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.hasPlayed) {
      this.resume();
    }
    return false;
  };
  VideoCanvas.prototype.pause = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (!this.isPaused) {
      if (this.audio) {
        this.audio.element.pause();
      } else {
        this.video.element.pause();
        this.stopRender();
      }
      this.trigger(VideoCanvas.PAUSE);
    }
    return false;
  };
  VideoCanvas.prototype.resume = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.isPaused) {
      if (this.audio) {
        this.audio.element.play();
      } else {
        this.video.element.play();
        this.startRender();
      }
      this.trigger(VideoCanvas.RESUME);
    }
    return false;
  };
  VideoCanvas.prototype.play = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.isPaused) {
      if (this.audio) {
        this.audio.element.play();
      } else {
        this.video.element.play();
        this.startRender();
      }
      this.hasPlayed = true;
      this.trigger(VideoCanvas.PLAY);
    }
    return false;
  };
  VideoCanvas.prototype.stop = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (!this.isPaused) {
      if (this.audio) {
        this.audio.element.pause();
      } else {
        this.video.element.pause();
      }
    }
    if (this.audio) {
      this.audio.element.currentTime = 0;
    } else {
      this.video.element.currentTime = 0;
      this.stopRender();
    }
    this.hasPlayed = false;
    this.trigger(VideoCanvas.STOP);
    return false;
  };
  VideoCanvas.get({
    isPaused: function() {
      if (this.audio) {
        return this.audio.element.paused;
      } else {
        return this.video.element.paused;
      }
    }
  });
  VideoCanvas.get({
    hasPlayed: function() {
      return this._hasPlayed;
    }
  });
  VideoCanvas.set({
    hasPlayed: function(p_value) {
      return this._hasPlayed = p_value;
    }
  });
  VideoCanvas.get({
    loop: function() {
      if (this.audio) {
        return this.audio.element.loop;
      } else {
        return this.video.element.loop;
      }
    }
  });
  VideoCanvas.set({
    loop: function(p_value) {
      if (this.audio) {
        return this.audio.element.loop = p_value;
      } else {
        return this.video.element.loop = p_value;
      }
    }
  });
  VideoCanvas.get({
    mute: function() {
      if (this.audio) {
        return this.audio.element.muted;
      } else {
        return this.video.element.muted;
      }
    }
  });
  VideoCanvas.set({
    mute: function(p_value) {
      if (this.audio) {
        return this.audio.element.muted = p_value;
      } else {
        return this.video.element.muted = p_value;
      }
    }
  });
  VideoCanvas.get({
    volume: function() {
      if (this.audio) {
        return this.audio.element.volume;
      } else {
        return this.video.element.volume;
      }
    }
  });
  VideoCanvas.set({
    volume: function(p_value) {
      if (p_value > 1) {
        p_value = 1;
      } else if (p_value < 0) {
        p_value = 0;
      }
      return this.video.element.volume = p_value;
    }
  });
  VideoCanvas.get({
    duration: function() {
      return this.video.element.duration;
    }
  });
  VideoCanvas.get({
    seek: function() {
      return this.video.element.currentTime;
    }
  });
  VideoCanvas.set({
    seek: function(p_value) {
      if (p_value > this.video.element.duration) {
        p_value = this.video.element.duration;
      } else if (p_value < 0) {
        p_value = 0;
      }
      if (this.audio) {
        this.audio.element.currentTime = p_value;
      } else {
        this.video.element.currentTime = p_value;
      }
      return this.draw(false);
    }
  });
  VideoCanvas.get({
    frameImage: function() {
      return this.canvas.element.toDataURL();
    }
  });
  VideoCanvas.get({
    naturalWidth: function() {
      return this.canvas.element.width;
    }
  });
  VideoCanvas.get({
    naturalHeight: function() {
      return this.canvas.element.height;
    }
  });
  VideoCanvas.prototype.startRender = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return this.renderID = window.requestAnimationFrame(this.draw);
  };
  VideoCanvas.prototype.stopRender = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return window.cancelAnimationFrame(this.renderID);
  };
  VideoCanvas.prototype.draw = function(p_render) {
    if (p_render == null) {
      p_render = true;
    }
    this.context.clearRect(0, 0, this.video.element.videoWidth, this.video.element.videoHeight);
    this.context.drawImage(this.video.element, 0, 0);
    if (p_render) {
      return this.renderID = window.requestAnimationFrame(this.draw);
    }
  };
  VideoCanvas.prototype.destroy = function() {
    this.stop();
    this.video.element.off('contextmenu', this.blockContextMenu);
    this.video.element.off('durationchange', this.ready);
    this.video.element.off('seeking', this.seekingStart);
    this.video.element.off('seeked', this.seekingComplete);
    this.video.element.off('timeupdate', this.running);
    this.video.element.off('progress', this.loading);
    this.video.element.off('ended', this.complete);
    app.off(App.WINDOW_ACTIVE, this.windowActive);
    app.off(App.WINDOW_INACTIVE, this.windowInactive);
    if (this.audio) {
      this.video.element.off('contextmenu', this.blockContextMenu);
      this.video.element.off('durationchange', this.ready);
      this.video.element.off('seeking', this.seekingStart);
      this.video.element.off('seeked', this.seekingComplete);
      this.video.element.off('timeupdate', this.running);
      this.video.element.off('progress', this.loading);
      this.video.element.off('ended', this.complete);
      this.audio.destroy();
      this.audio = null;
    }
    this.video.destroy();
    this.video = null;
    this.canvas.destroy();
    this.removeChild(this.canvas);
    this.canvas = null;
    return VideoCanvas.__super__.destroy.apply(this, arguments);
  };
  return VideoCanvas;
})(BaseDOM);
/**
@class SRTParser
@submodule caim.media.subtitles
 */
var SRTParser;
SRTParser = (function() {
  function SRTParser() {}
  SRTParser.fromString = function(p_string, p_milliseconds) {
    var data, i, item, items, regex, useMs, _ref;
    if (p_string == null) {
      p_string = null;
    }
    if (p_milliseconds == null) {
      p_milliseconds = false;
    }
    useMs = p_milliseconds ? true : false;
    data = p_string.replace(/\r/g, '');
    regex = /(?:(\d+)\n)?(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3}).*?\n([\s\S]*?)(?:\n{2}|\n*$)/g;
    items = [];
    i = 0;
    while (item = regex.exec(data)) {
      items.push({
        id: (_ref = item[1]) != null ? _ref.trim() : void 0,
        startTime: useMs ? this._timeToMilliseconds(item[2].trim()) : item[2].trim(),
        endTime: useMs ? this._timeToMilliseconds(item[3].trim()) : item[3].trim(),
        text: item[4].trim()
      });
      i += 4;
    }
    return items;
  };
  SRTParser.toString = function(p_object) {
    var i, response, s;
    if (p_object == null) {
      p_object = null;
    }
    if (!p_object instanceof Array) {
      return '';
    }
    response = '';
    i = 0;
    while (i < p_object.length) {
      s = p_object[i];
      if (!isNaN(s.startTime) && !isNaN(s.endTime)) {
        s.startTime = this._millisecondsToTime(parseInt(s.startTime, 10));
        s.endTime = this._millisecondsToTime(parseInt(s.endTime, 10));
      }
      response += s.id + '\u000d\n';
      response += s.startTime + ' --> ' + s.endTime + '\u000d\n';
      response += s.text.replace('\n', '\u000d\n') + '\u000d\n\u000d\n';
      i++;
    }
    return response;
  };
  SRTParser._timeToMilliseconds = function(p_value) {
    var i, parts, regex;
    regex = /(\d+):(\d{2}):(\d{2}),(\d{3})/;
    parts = regex.exec(p_value);
    if (parts === null) {
      return 0;
    }
    i = 1;
    while (i < 5) {
      parts[i] = parseInt(parts[i], 10);
      if (isNaN(parts[i])) {
        parts[i] = 0;
      }
      i++;
    }
    return parts[1] * 3600000 + parts[2] * 60000 + parts[3] * 1000 + parts[4];
  };
  SRTParser._millisecondsToTime = function(p_value) {
    var i, measures, ms, response, time;
    measures = [3600000, 60000, 1000];
    time = [];
    for (i in measures) {
      response = (p_value / measures[i] >> 0).toString();
      if (response.length < 2) {
        response = '0' + response;
      }
      p_value %= measures[i];
      time.push(response);
    }
    ms = p_value.toString();
    if (ms.length < 3) {
      i = 0;
      while (i <= 3 - ms.length) {
        ms = '0' + ms;
        i++;
      }
    }
    return time.join(':') + ',' + ms;
  };
  return SRTParser;
})();
/**
@class VideoSubtitle
@extends BaseDOM
@submodule caim.media.video
 */
var VideoSubtitle;
VideoSubtitle = (function(_super) {
  __extends(VideoSubtitle, _super);
  function VideoSubtitle(p_subtitles) {
    if (p_subtitles == null) {
      p_subtitles = null;
    }
    this.source = p_subtitles;
    VideoSubtitle.__super__.constructor.call(this, {
      element: 'div'
    });
    this._caption = new BaseDOM({
      element: 'span'
    });
    this.appendChild(this._caption);
  }
  VideoSubtitle.get({
    source: function() {
      return this._source;
    }
  });
  VideoSubtitle.set({
    source: function(p_value) {
      if (p_value == null) {
        p_value = null;
      }
      if (typeof p_value === 'string') {
        return this._source = SRTParser.fromString(p_value, true);
      } else if (p_value instanceof Array) {
        return this._source = p_value;
      }
    }
  });
  VideoSubtitle.prototype.seek = function(p_seek) {
    var caption, end, idx, length, start, _results;
    if (p_seek == null) {
      p_seek = 0;
    }
    if ((this._source == null) || (this._caption.time != null) && p_seek >= this._caption.time.start && p_seek < this._caption.time.end) {
      return;
    }
    length = this._source.length;
    idx = 0;
    _results = [];
    while (length--) {
      caption = this._source[idx];
      start = caption.startTime / 1000;
      end = caption.endTime / 1000;
      if (p_seek >= start && p_seek < end) {
        this._caption.text = caption.text;
        this._caption.time = {
          start: start,
          end: end
        };
        break;
      } else {
        this._caption.text = '';
        this._caption.time = null;
      }
      _results.push(idx++);
    }
    return _results;
  };
  return VideoSubtitle;
})(BaseDOM);
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
    this.test = __bind(this.test, this);
    this.click = __bind(this.click, this);
    this.createStart = __bind(this.createStart, this);
    TemplateHomeView.__super__.constructor.call(this, p_data, 'views');
  }
  TemplateHomeView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.background = new BaseDOM('div');
    this.image = new BaseDOM({
      element: this.content.image.tag
    });
    this.background.appendChild(this.image);
    this.background.className = 'background';
    this.background.css({
      'height': '100%',
      'background-color': '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
    this.appendChild(this.background);
    this.background.element.on('click', this.click);
    return TemplateHomeView.__super__.createStart.apply(this, arguments);
  };
  TemplateHomeView.prototype.click = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.video = new VideoCanvas(this.content.video.src, 0, true);
    this.video.on(VideoCanvas.RUNNING, this.test);
    this.background.appendChild(this.video);
    this.sub = new VideoSubtitle(this.content.subtitle.result);
    return this.background.appendChild(this.sub);
  };
  TemplateHomeView.prototype.test = function(evt) {
    var _ref;
    if (evt == null) {
      evt = null;
    }
    return (_ref = this.sub) != null ? _ref.seek(evt.position) : void 0;
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
    return TemplateHomeView.__super__.show.apply(this, arguments);
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
    return TemplateHomeView.__super__.hide.apply(this, arguments);
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
    this.createStart = __bind(this.createStart, this);
    TemplateSubView.__super__.constructor.call(this, p_data, 'views');
  }
  TemplateSubView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.background = new BaseDOM('div');
    this.appendChild(this.background);
    this.background.className = 'background';
    this.background.css({
      'height': '100%',
      'background-color': '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
    this.image = new BaseDOM({
      element: this.loader.getResult(this.content.image.src)
    });
    this.background.appendChild(this.image);
    return TemplateSubView.__super__.createStart.apply(this, arguments);
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
    return TemplateSubView.__super__.show.apply(this, arguments);
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
    return TemplateSubView.__super__.hide.apply(this, arguments);
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
    this.background.destroy();
    this.removeChild(this.background);
    this.background = null;
    return TemplateSubView.__super__.destroy.apply(this, arguments);
  };
  return TemplateSubView;
})(BaseView);
var Main;
Main = (function(_super) {
  var re, _controller;
  __extends(Main, _super);
  function Main() {
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    return Main.__super__.constructor.apply(this, arguments);
  }
  _controller = new DefaultNavigationController();
  re = Resizer.getInstance();
  Main.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Main.__super__.createStart.apply(this, arguments);
  };
  Main.prototype.create = function(evt) {
    var k, menu, v, _ref;
    if (evt == null) {
      evt = null;
    }
    console.log("Valck");
    menu = new BaseDOM();
    menu.className = 'menu';
    this.appendChildAt(menu, 0);
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
    return Main.__super__.create.apply(this, arguments);
  };
  Main.prototype.change = function(evt) {
    var v;
    console.log(evt);
    v = app.navigation.previousView;
    return console.log(v != null ? v.id : void 0, v != null ? v.routeData : void 0);
  };
  Main.prototype.click = function(evt) {
    var route;
    route = app.config.views[evt.srcElement.id].route;
    return app.navigation.gotoRoute(route, true);
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