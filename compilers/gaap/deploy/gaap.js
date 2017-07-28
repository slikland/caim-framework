#!/usr/bin/env node
(function(){var __bind=function(t,e){return function(){return t.apply(e,arguments)}},__hasProp={}.hasOwnProperty,__indexOf=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1},__extends=function(t,e){function i(){this.constructor=t}for(var s in e)__hasProp.call(e,s)&&Object.defineProperty(t,s,Object.getOwnPropertyDescriptor(e,s));return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},EventDispatcher;EventDispatcher=function(){function t(){this._triggerNative=__bind(this._triggerNative,this),this.trigger=__bind(this.trigger,this)}return t.prototype._events=null,t.prototype.on=function(t,e){return this._events||(this._events={}),this._events[t]||(this._events[t]=[]),__indexOf.call(this._events[t],e)>=0?void 0:this._events[t].unshift(e)},t.prototype.off=function(t,e){var i,s;if(null==t&&(t=null),null==e&&(e=null),!this._events)return void(this._events={});if(!t)return void this.offAll();if(i=this._events[t]){if(e){for(;(s=i.indexOf(e))>=0;)i.splice(s,1);return this._events[t]=i}return this._events[t].length=0}return t?void 0:this.offAll()},t.prototype.offAll=function(){return this._events={},!1},t.prototype.trigger=function(t,e,i){var s,n,r,o,a,l,h,p;if(null==e&&(e=null),null==i&&(i=null),Array.isArray(t))for(l=0,h=t.length;h>l;l++)s=t[l],this.trigger(t,e);else if(this._events||(this._events={}),n=this._events[t],n&&0!==n.length){if(i||(i=this),s={type:t,target:i,currentTarget:this},"object"==typeof e)for(o in e)a=e[o],s[o]||(s[o]=a);for(r=n.length,p=[];r-->0;)p.push("function"==typeof n[r]?n[r](s,e):void 0);return p}},t.prototype._triggerNative=function(t){var e,i,s;if(this._events||(this._events={}),e=this._events[t.type],e&&0!==e.length){for(i=e.length,t.targetClass=this,s=[];i-->0;)s.push("function"==typeof e[i]?e[i](t):void 0);return s}},t.prototype.hasEvent=function(t,e){var i;for(i in this._events)if(i===t&&this._events[i].indexOf(e)>-1)return!0;return!1},t}();var Watcher;Watcher=function(t){function e(){this._paths=[],this._pathWatcher={}}return __extends(e,t),e.CHANGED="watcherChanged",e.ADDED="watcherAdded",e.REMOVED="watcherRemoved",e.prototype.pathExists=function(t){return this._pathWatcher[t]?!0:!1},e.prototype.addPath=function(t,i){var s,n,r;return null==i&&(i=!1),t=path.resolve(t),this.pathExists(t)?this._pathWatcher[t]:(r=fs.watch(t,this._pathChange),r._parent=this,r._file=t,this._paths[this._paths.length]={file:t,watcher:r},this._pathWatcher[t]=r,i&&(n=fs.statSync(t),n.isDirectory())?(s=this._parsePaths(t),this.trigger(e.ADDED,s),s):r)},e.prototype.removeAll=function(){var t;for(t=this._paths.length;t-->0;)this._paths[t].watcher.close();return delete this._pathWatcher,this._paths.length=0,this._pathWatcher={}},e.prototype.removePath=function(t){var e,i,s;for(i=this._paths.length,e=t.replace(/(\W)/g,"\\$1"),e=new RegExp("^"+e,"g"),s=[];i-->0;)e.lastIndex=0,e.test(this._paths[i].file)?(this._paths[i].watcher.close(),this._paths.splice(i,1),this._pathWatcher[this._paths[i].file],s.push(delete this._pathWatcher[this._paths[i].file])):s.push(void 0);return s},e.prototype._parsePaths=function(t){var e,i,s,n,r,o;if(t=t.rtrim("/")+"/",o=fs.statSync(t),o.isDirectory()){for(i=fs.readdirSync(t),n=i.length,e=[];n-->0;)r=t+i[n],e.push(r),o=fs.statSync(r),!o.isSymbolicLink()&&o.isDirectory()&&(s=this._parsePaths(r),e=[].concat(s,e));return this.addPath(t),e}},e.prototype._pathChange=function(t,i){var s,n;return s=this._parent,i=path.resolve(this._file+"/"+i),fs.existsSync(i)?(s.trigger(e.CHANGED,i),n=fs.statSync(i),n.isDirectory()?s.addPath(i,!0):void 0):(s.removePath(i),s.trigger(e.REMOVED,i))},e}(EventDispatcher);var Log,__slice=[].slice;Log=function(){function t(){}return t.COLORS={black:0,red:1,green:2,yellow:3,blue:4,magenta:5,cyan:6,white:7},t.setStyle=function(t,e){var i;return null==t&&(t="white"),null==e&&(e=null),i=[],this.COLORS[t]||(t="white"),i.push("3"+this.COLORS[t]),e&&this.COLORS[e]&&i.push("4"+this.COLORS[e]),i.push("22m"),process.stdout.write("["+i.join(";"))},t.log=function(){return console.log(value)},t.print=function(){var t;return t=1<=arguments.length?__slice.call(arguments,0):[],process.stdout.write(t.join(" ")),process.stdout.write("[0m")},t.println=function(){var t;return t=1<=arguments.length?__slice.call(arguments,0):[],process.stdout.write(t.join(" ")),process.stdout.write("[0m\n")},t._test=function(e){return process.stdout.off("data",t._test),console.log("Received",e)},t}();var Notifier;Notifier=function(){function t(){}return t.notify=function(t,e){return null==e&&(e=""),exec("osascript -e 'display notification \""+e+'" with title "'+t+"\"'")},t}();var Versioner;Versioner=function(t){function e(t){this.nextVersion=__bind(this.nextVersion,this),this.readFile=__bind(this.readFile,this),this.notify=__bind(this.notify,this),i=t,this.readFile(t),e.__super__.constructor.apply(this,arguments)}var i,s,n,r;return __extends(e,t),r=!1,i=null,n=null,s=null,e.prototype.versionRegex=/(SL_PROJECT_VERSION):\d+\.\d+\.\d+/g,e.prototype.dateRegex=/(SL_PROJECT_DATE):[\d]+/g,e.prototype.notify=function(t,e){return null==e&&(e=null),Log.println(),null!=e&&Log.setStyle(e),Log.print(t),Log.println()},e.prototype.readFile=function(t){var e,i;if(this.hasFile()&&!this.running){try{this.running=!0,e=fs.readFileSync(t,"utf8")}catch(r){i=r,this.notify(i,"magenta")}return this.versionRegex.test(e)&&(n=String(e.match(this.versionRegex)),s=String(e.match(this.dateRegex))),this.running=!1}},e.prototype.nextVersion=function(t){var e,i,r,o,a,l;if(!n||this.running)return null;switch(this.running=!0,l=n.replace("SL_PROJECT_VERSION:",""),r=s.replace("SL_PROJECT_DATE:",""),a=l.split("."),o=parseInt(a[0]),i=parseInt(a[1]),e=parseInt(a[2]),t){case"release":o+=1,i=0,e=0,r=Date.now();break;case"build":i+=1,e=0,r=Date.now();break;case"bugfix":e+=1,r=Date.now()}return s="SL_PROJECT_DATE:"+r,n="SL_PROJECT_VERSION:"+o+"."+i+"."+e,this.notify("Current project version: "+o+"."+i+"."+e,"yellow"),this.running=!1,[n,s]},e.prototype.hasFile=function(){var t,e;try{if(this.running=!0,e=fs.statSync(i),null!=e&&e.isFile())return this.running=!1,!0}catch(s){t=s}return!1},e}(EventDispatcher);var StylusCompiler;StylusCompiler=function(){function t(){this._tasks=[],this._running=!1,this.ugly=!1}var e;return t.prototype.addTask=function(t,i){return this._tasks[this._tasks.length]=new e(t,i)},t.prototype.start=function(t){return null==t&&(t=[]),this._running?void 0:(this._sourcePaths=t,this._running=!0,this._runTasks())},t.prototype.stop=function(){return this._running?this._running=!1:void 0},t.prototype.reset=function(){return 1},t.prototype.update=function(){return this._running?this._runTasks():void 0},t.prototype.remove=function(){return this._runTasks()},t.prototype.runTasks=function(t){return null==t&&(t=!1),this._runTasks(null,t)},t.prototype._runTasks=function(t,e){var i,s,n;for(null==t&&(t=null),null==e&&(e=!1),e=e,this._initTime=(new Date).getTime(),Log.println(),s=this._tasks.length,i=0,n=[];s-->0;)i++,n.push(this._tasks[s].output(this._sourcePaths,e));return n},e=function(){function t(t,e){var i;this.name=t,this.data=e,this._compiled=__bind(this._compiled,this),this.usedFiles=[],this.bare=null!=(i=this.data.options)?i.bare:void 0,this.isNode=this.data.isNode,this.data.depends&&(this.depends=[].concat(this.data.depends))}return t.prototype.output=function(t,e){var i,s,n,r,o,a,l,h;for(null==e&&(e=!1),this._initTime=(new Date).getTime(),Log.setStyle("magenta"),Log.print("Compiling "+this.name),e&&(Log.setStyle("yellow"),Log.print(" minified")),Log.println(),a=path.resolve(this.data.output),i=path.dirname(a),r={paths:t,filename:path.basename(a)},e&&(r.compress=!0),fs.existsSync(i)||this._mkdir(i),s=-1,n=t.length,o=null,h=[];++s<n;){if(l=path.resolve(t[s]+this.data.src),fs.existsSync(l)){exec("vendors/stylus/bin/stylus --include-css -u ./vendors/nib -c -I "+t.join(":")+" "+l+" -o "+a,this._compiled);break}h.push(void 0)}return h},t.prototype._compiled=function(t,e,i){var s,n;return t?(Log.setStyle("red"),Log.print("Error compiling: "),Log.setStyle("cyan"),Log.println(this.name),void process.stdout.write(i)):(s=path.resolve(this.data.output),Log.setStyle("green"),Log.print("Saved to: "),Log.setStyle("magenta"),Log.println(this.data.output),n=(.001*((new Date).getTime()-this._initTime)).toFixed(3),Log.setStyle("cyan"),Log.println("In: "+n+"s"),Notifier.notify("Compiler","Stylus compilation completed!"))},t.prototype._mkdir=function(t){var e;return e=path.dirname(t),fs.existsSync(e)||this._mkdir(e),fs.mkdirSync(t)},t}(),t}();var LessCompiler;LessCompiler=function(){function t(){this._tasks=[],this._running=!1,this.ugly=!1}var e;return t.prototype.addTask=function(t,i){return this._tasks[this._tasks.length]=new e(t,i)},t.prototype.start=function(t){return null==t&&(t=[]),this._running?void 0:(this._sourcePaths=t,this._running=!0,this._runTasks())},t.prototype.stop=function(){return this._running?this._running=!1:void 0},t.prototype.reset=function(){return 1},t.prototype.update=function(){return this._running?this._runTasks():void 0},t.prototype.remove=function(){return this._runTasks()},t.prototype.runTasks=function(t){return null==t&&(t=!1),this._runTasks(null,t)},t.prototype._runTasks=function(t,e){var i,s,n;for(null==t&&(t=null),null==e&&(e=!1),e=e,this._initTime=(new Date).getTime(),Log.println(),s=this._tasks.length,i=0,n=[];s-->0;)i++,n.push(this._tasks[s].output(this._sourcePaths,e));return n},e=function(){function t(t,e){var i;this.name=t,this.data=e,this._compiled=__bind(this._compiled,this),this.usedFiles=[],this.bare=null!=(i=this.data.options)?i.bare:void 0,this.isNode=this.data.isNode,this.data.depends&&(this.depends=[].concat(this.data.depends))}return t.prototype.output=function(t,e){var i,s,n,r,o,a,l,h;for(null==e&&(e=!1),this._initTime=(new Date).getTime(),Log.setStyle("magenta"),Log.print("Compiling "+this.name),e&&(Log.setStyle("yellow"),Log.print(" minified")),Log.println(),a=path.resolve(this.data.output),i=path.dirname(a),r={paths:t,filename:path.basename(a)},e&&(r.compress=!0),fs.existsSync(i)||this._mkdir(i),s=-1,n=t.length,o=null,h=[];++s<n;){if(l=path.resolve(t[s]+this.data.src),fs.existsSync(l)){exec("vendors/less/bin/lessc -x --verbose --include-path="+t.join(":")+" "+l+" "+a,this._compiled);break}h.push(void 0)}return h},t.prototype._compiled=function(t,e,i){var s,n;return t?(Log.setStyle("red"),Log.print("Error compiling: "),Log.setStyle("cyan"),Log.println(this.name),void process.stdout.write(i)):(s=path.resolve(this.data.output),Log.setStyle("green"),Log.print("Saved to: "),Log.setStyle("magenta"),Log.println(this.data.output),n=(.001*((new Date).getTime()-this._initTime)).toFixed(3),Log.setStyle("cyan"),Log.println("In: "+n+"s"),Notifier.notify("Compiler","Less compilation completed!"))},t.prototype._mkdir=function(t){var e;return e=path.dirname(t),fs.existsSync(e)||this._mkdir(e),fs.mkdirSync(t)},t}(),t}();var JSCompiler;JSCompiler=function(){function t(){this._cache={},this._tasks=[],this._usedFiles=[],this._running=!1,this.ugly=!1}var e,i;return t.prototype.addTask=function(t,e){return this._tasks[this._tasks.length]=new i(t,e)},t.prototype.start=function(t){return null==t&&(t=[]),this._running?void 0:(this._sourcePaths=t,this._running=!0,this._runTasks())},t.prototype.stop=function(){return this._running?this._running=!1:void 0},t.prototype.reset=function(){return 1},t.prototype.update=function(t){return this._cache[t]?this._cache[t].update():this._cache[t]=new e(t),this._running?this._runTasks(t):void 0},t.prototype.remove=function(t){var e,i;for(t=[].concat(t),i=t.length;i-->0;)e=t[i],this._cache[e]&&(this._cache[e].dispose(),delete this._cache[e]);return this._runTasks()},t.prototype.runTasks=function(t){return null==t&&(t=!1),this._runTasks(null,t)},t.prototype._runTasks=function(t,e){var i,s,n,r;for(null==t&&(t=null),null==e&&(e=!1),e=e,this._initTime=(new Date).getTime(),this._updateTasks(),Log.println(),n=this._tasks.length,i=0;n-->0;)s=this._filterTask(this._tasks[n]),t?s.indexOf(t)>=0&&(i++,this._tasks[n].output(e)):(i++,this._tasks[n].output(e));return i>0?(r=(.001*((new Date).getTime()-this._initTime)).toFixed(3),Log.setStyle("cyan"),Log.println("In: "+r+"s"),Notifier.notify("Compiler","JS compilation completed!")):void 0},t.prototype._updateTasks=function(){var t,e;for(t=this._tasks.length,e=[];t-->0;)this._tasks[t].filtered=!1,this._tasks[t].usedBy={},e.push(this._tasks[t].update(this._cache,this._sourcePaths));return e},t.prototype._findTask=function(t){var e;for(e=this._tasks.length;e-->0;)if(this._tasks[e].name===t)return this._tasks[e];return null},t.prototype._filterTask=function(t){var e,i,s,n,r,o,a,l,h;if(t.filtered)return t.filteredFiles;if(i=t.usedFiles,t.depends)for(s=t.depends.length;s-->0;)if(l=this._findTask(t.depends[s]))for(h=this._filterTask(l),n=i.length;n-->0;)(r=i.indexOf(h[n]))>=0&&i.splice(r,1);for(t.filtered=!0,t.filteredFiles=i,s=-1,o=i.length,a="";++s<o;)e=this._cache[i[s]],e&&(a+=e.js+"\n");return t.bare||(a="(function() {\n"+a+"}).call(this);"),t.isNode&&(a="#!/usr/bin/env node\n"+a),t.rawSource=a,i},t.prototype.parseFile=function(){},t.prototype.fileChanged=function(){},i=function(){function t(t,e){var i;this.name=t,this.data=e,this.usedFiles=[],this.bare=null!=(i=this.data.options)?i.bare:void 0,this.isNode=this.data.isNode,this.data.depends&&(this.depends=[].concat(this.data.depends))}return t.prototype.update=function(t,e){var i,s,n,r,o;this.usedFiles.length=0,n=this.data.src,i=[],this.data.includes&&(i=i.concat([].concat(this.data.includes))),i.push(this.data.src);for(s in t)o=t[s],o.usedBy={};return r=this._parseFilesRecursive(t,e,i),this.usedFiles=this._removeDuplicates(r)},t.prototype.output=function(t){var e,i,s;return null==t&&(t=!1),i=null,Log.setStyle("magenta"),Log.print("Compiling "+this.name),t&&(Log.setStyle("yellow"),Log.print(" minified")),Log.println(),s=path.resolve(this.data.output),e=path.dirname(s),fs.existsSync(e)||this._mkdir(e),i=this.rawSource,t&&(i=uglify.minify(i,{fromString:!0,comments:!0}).code),fs.writeFileSync(s,i,{encoding:"utf-8"}),Log.setStyle("green"),Log.print("Saved to: "),Log.setStyle("magenta"),Log.println(this.data.output)},t.prototype._mkdir=function(t){var e;return e=path.dirname(t),fs.existsSync(e)||this._mkdir(e),fs.mkdirSync(t)},t.prototype._removeDuplicates=function(t){var e,i,s,n,r,o;for(o={},i=[],r=0,s=-1,n=t.length;++s<n;)e=t[s],o[e]||(o[e]=!0,i[r++]=e);return i},t.prototype._parseFilesRecursive=function(t,e,i){var s,n,r,o,a,l,h,p,u;for(p=[],s=[],u=[],i=[].concat(i),r=-1,a=i.length;++r<a;){for(o=-1,l=e.length,n=!1;++o<l;)if(h=path.resolve(e[o]+i[r]),t[h]){if(n=!0,t[h].usedBy[this.name]){u=[].concat(t[h].usedBy[this.name],u);break}u=[].concat(u,this._parseFilesRecursive(t,e,t[h].prepend,h)),u[u.length]=h,u=[].concat(u,this._parseFilesRecursive(t,e,t[h].append,h)),t[h].usedBy[this.name]=u;break}n||(Log.setStyle("red"),Log.print("Import not found: "),Log.setStyle("cyan"),Log.print(i[r]),Log.setStyle("red"),Log.print(" at "),Log.setStyle("cyan"),Log.println(h))}return u},t}(),e=function(){function t(t){if(this.file=t,this.prepend=[],this.append=[],!fs.existsSync(this.file))throw new Error("File not found: "+this.file);this.update()}return t.prototype.update=function(){var t;if(!fs.existsSync(this.file))throw new Error("File not found: "+this.file);this.content=fs.readFileSync(this.file,"utf8");try{return this.js=this.content,this.parseContent()}catch(e){return t=e,Log.setStyle("red"),Log.print("Error parsing "),Log.setStyle("cyan"),Log.println(this.file),Log.setStyle("magenta"),Log.println(t.message+"\nat line "+(t.location.first_line+1)),Notifier.notify("Error compiling",this.file)}},t.prototype.parseContent=function(){var t,e,i,s,n,r;for(i=/(?:#|\/\/)\s*(import|\@codekit-(prepend|append))\s+(['|"])?([^\s'"]+)(\2)?/g,n=t=0,this.prepend.length=0,this.append.length=0,r=[];s=i.exec(this.content);)e=s[4],"import"===s[1]&&(e=e),r.push("append"===s[2]?this.append[t++]=e:this.prepend[n++]=e);return r},t.prototype.dispose=function(){return this.prepend.length=0,this.append.length=0,delete this.content,delete this.js,delete this.prepend,delete this.append},t}(),t}();var CoffeeCompiler;CoffeeCompiler=function(){function t(){this._cache={},this._tasks=[],this._usedFiles=[],this._running=!1,this.ugly=!1}var e,i;return t._ADD_NAMESPACE_FN='function __addNamespace(scope, obj){for(k in obj){if(!scope){eval(k + " = {};");scope = eval("(function(){return \'+k+\';})();");__addNamespace(scope, obj[k])}else if(!scope[k]){scope[k] = {};__addNamespace(scope[k], obj[k])};}};',t._REWRITE_CS_FUNCTIONS={__bind:"function(fn, me){ return function(){ return fn.apply(me, arguments); }; }",__hasProp:"{}.hasOwnProperty",__indexOf:"[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }",__extends:"function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }"},t.prototype.addTask=function(t,e){return this._tasks[this._tasks.length]=new i(t,e)},t.prototype.start=function(t){return null==t&&(t=[]),this._running?void 0:(this._sourcePaths=t,this._running=!0,this._runTasks())},t.prototype.stop=function(){return this._running?this._running=!1:void 0},t.prototype.reset=function(){return 1},t.prototype.update=function(t){return this._cache[t]?this._cache[t].update():this._cache[t]=new e(t),this._running?this._runTasks(t):void 0},t.prototype.remove=function(t){var e,i;for(t=[].concat(t),i=t.length;i-->0;)e=t[i],this._cache[e]&&(this._cache[e].dispose(),delete this._cache[e]);return this._runTasks()},t.prototype.runTasks=function(t,e){return null==t&&(t=!1),null==e&&(e=null),this._runTasks(null,t,e)},t.prototype._runTasks=function(t,e,i){var s,n,r,o;for(null==t&&(t=null),null==e&&(e=!1),null==i&&(i=null),e=e,this._initTime=(new Date).getTime(),this._updateTasks(),Log.println(),r=this._tasks.length,s=0;r-->0;)n=this._filterTask(this._tasks[r]),t?n.indexOf(t)>=0&&(s++,this._tasks[r].output(e,i)):(s++,this._tasks[r].output(e,i));return s>0?(o=(.001*((new Date).getTime()-this._initTime)).toFixed(3),Log.setStyle("cyan"),Log.println("In: "+o+"s"),Notifier.notify("Compiler","Coffee compilation completed!")):void 0},t.prototype._updateTasks=function(){var t,e;for(t=this._tasks.length,e=[];t-->0;)this._tasks[t].filtered=!1,this._tasks[t].usedBy={},e.push(this._tasks[t].update(this._cache,this._sourcePaths));return e},t.prototype._findTask=function(t){var e;for(e=this._tasks.length;e-->0;)if(this._tasks[e].name===t)return this._tasks[e];return null},t.prototype._filterTask=function(t){var e,i,s,n,r,o,a,l,h,p,u;if(t.filtered)return t.filteredFiles;if(i=t.usedFiles,t.depends)for(n=t.depends.length;n-->0;)if(p=this._findTask(t.depends[n]))for(u=this._filterTask(p),r=u.length;r-->0;)(o=i.indexOf(u[r]))>=0&&i.splice(o,1);for(t.filtered=!0,t.filteredFiles=i,n=-1,a=i.length,l={},s=!1,h="";++n<a;)e=this._cache[i[n]],e&&(this._addNamespaces(e.namespaces,l)&&(s=!0),h+=e.js+"\n");return s&&(h=this.constructor._ADD_NAMESPACE_FN+"\n__addNamespace(this, "+JSON.stringify(l)+");\n"+h),h=this._rewriteCsFuncs(h),t.bare||(h="(function() {\n"+h+"}).call(this);"),t.rawSource=h,i},t.prototype._rewriteCsFuncs=function(t){var e,i,s,n,r,o;n=t,e=[],o=this.constructor._REWRITE_CS_FUNCTIONS;for(i in o)r=o[i],s=new RegExp("^\\s*"+i+"\\s*=.*?(,|;)\\s*$","gm"),n=n.replace(s,"$1"),e.push(i+"="+r);return n=n.replace(/^\s*,?(;)?\s*\n/gm,"$1"),n=n.replace(/,\s*\n\s*;/g,";\n"),e.length>0&&(n="var "+e.join(",\n")+";\n"+n),n},t.prototype._addNamespaces=function(t,e){var i,s,n,r,o,a,l;for(i=!1,r=0,a=t.length;a>r;r++)for(n=t[r],n=n.split("."),o=0,l=n.length;l>o;o++)s=n[o],e[s]||(e[s]={},i=!0),e=e[s];return i},t.prototype.parseFile=function(){},t.prototype.fileChanged=function(){},i=function(){function t(t,e){var i;this.name=t,this.data=e,this.usedFiles=[],this.bare=null!=(i=this.data.options)?i.bare:void 0,this.isNode=this.data.isNode,this.data.depends&&(this.depends=[].concat(this.data.depends))}return t.prototype.update=function(t,e){var i,s,n,r,o;this.usedFiles.length=0,n=this.data.src,i=[],this.data.includes&&(i=i.concat([].concat(this.data.includes))),i.push(this.data.src);for(s in t)o=t[s],o.usedBy={};return r=this._parseFilesRecursive(t,e,i),Main.verbose&&console.log(r.join("\n")),this.usedFiles=this._removeDuplicates(r)},t.prototype.output=function(t,e){var i,s,n,r,o,a;if(null==t&&(t=!1),null==e&&(e=null),n=null,Log.setStyle("magenta"),Log.print("Compiling "+this.name),t&&(Log.setStyle("yellow"),Log.print(" minified")),Log.println(),a=new Versioner(this.data.output),r=path.resolve(this.data.output),i=path.dirname(r),fs.existsSync(i)||this._mkdir(i),a.versionRegex.test(this.rawSource)&&(o=a.nextVersion(e)),o&&(this.rawSource=this.rawSource.replace(a.versionRegex,o[0]),this.rawSource=this.rawSource.replace(a.dateRegex,o[1])),n=this.rawSource,t)try{n=uglify.minify(n,{fromString:!0,comments:!0}).code}catch(l){s=l,console.log(s)}return this.isNode&&(n="#!/usr/bin/env node\n"+n),fs.writeFileSync(r,n,{encoding:"utf-8"}),Log.setStyle("green"),Log.print("Saved to: "),Log.setStyle("magenta"),Log.println(this.data.output)},t.prototype._mkdir=function(t){var e;return e=path.dirname(t),fs.existsSync(e)||this._mkdir(e),fs.mkdirSync(t)},t.prototype._removeDuplicates=function(t){var e,i,s,n,r,o;for(o={},i=[],r=0,s=-1,n=t.length;++s<n;)e=t[s],o[e]||(o[e]=!0,i[r++]=e);return i},t.prototype._parseFilesRecursive=function(t,e,i){var s,n,r,o,a,l,h,p,u,c,d,f,_,g,y,m;for(f=[],s=[],g=[],i=[].concat(i),m=[].concat(i),r=m.length;r-->0;)if(m[r].indexOf("*")>=0)for(_=m[r].replace(/\./g,"\\.").replace(/\*/g,".*?"),u=e.length,a=-1;++a<u;){c=path.resolve(e[a])+"/"+_,c=new RegExp(c,"ig"),d=[],l=0,n=!1;for(h in t)y=t[h],c.lastIndex=0,c.test(h)&&(n=!0,d[l++]=h);if(d.unshift(r,1),m.splice.apply(m,d),n)break}for(i=m,o=-1,p=i.length;++o<p;){for(a=-1,u=e.length,n=!1;++a<u;)if(c=i[o],/^\//.test(c)||(c=path.resolve(e[a]+c)),t[c]){if(n=!0,t[c].usedBy[this.name]){g=[].concat(t[c].usedBy[this.name],g);break}g=[].concat(g,this._parseFilesRecursive(t,e,t[c].prepend,c)),g[g.length]=c,g=[].concat(g,this._parseFilesRecursive(t,e,t[c].append,c)),t[c].usedBy[this.name]=g;break}n||(Log.setStyle("red"),Log.print("Import not found: "),Log.setStyle("cyan"),Log.print(i[o]))}return g},t}(),e=function(){function t(t){if(this.file=t,this._replaceInjection=__bind(this._replaceInjection,this),this.prepend=[],this.append=[],this.namespaces=[],this.isJS=!1,!fs.existsSync(this.file))throw new Error("File not found: "+this.file);this.update()}return t.prototype.update=function(){var t;if(!fs.existsSync(this.file))throw new Error("File not found: "+this.file);this.content=fs.readFileSync(this.file,"utf8");try{return this.content=this.content.replace(/^(\s*)(.*?)#\s*inject\s+(['|"])?([^\s'"]+)(\3)(.*?)$/gm,this._replaceInjection),this.parseContent(),this.js=/\.js$/gi.test(this.file)?this.content:coffee.compile(this.content,{bare:!0})}catch(e){return t=e,Log.setStyle("red"),Log.print("Error parsing "),Log.setStyle("cyan"),Log.println(this.file),Log.setStyle("magenta"),Log.println(t.message+"\nat line "+(t.location.first_line+1)),Notifier.notify("Error compiling",this.file)}},t.prototype.parseContent=function(){var t,e,i,s,n,r,o;for(i=/#\s*(import|\@codekit-(prepend|append)|namespace)\s+(['|"])?([^\s'"]+)(\2)?/g,o=t=0,this.prepend.length=0,this.append.length=0,this.namespaces.length=0;n=i.exec(this.content);)switch(e=n[4],n[1]){case"import":case"codekit":/\.js$/gi.test(e)||(e=e.replace(/\./g,"/")+".coffee"),"append"===n[2]?this.append[t++]=e:this.prepend[o++]=e;break;case"namespace":this.namespaces.push(e)}return(s=this.namespaces.length)>0?(r=this.namespaces[s-1],this.content=this.content.replace(/^(class\s+)([^\s]+)/gm,"$1"+r+".$2")):void 0},t.prototype._replaceInjection=function(){var t,e,i;return e=path.dirname(this.file)+"/"+arguments[4],t="",fs.existsSync(e)&&(i=fs.statSync(e),i.isFile()&&(t=fs.readFileSync(e,"utf8"))),t=t.replace(/^/gm,arguments[1]).replace(/^\s*/,"").replace(/\s*$/,""),t=arguments[1]+arguments[2]+t+arguments[6]},t.prototype.dispose=function(){return this.prepend.length=0,this.append.length=0,delete this.content,delete this.js,delete this.prepend,delete this.append},t}(),t}();var Main,coffee,exec,fs,path,uglify,yuidocs;String.prototype.ltrim=function(t){var e;return null==t&&(t=null),t||(t="\\s"),e=new RegExp("^"+t+"*"),e.global=!0,e.multiline=!0,this.replace(e,"")},String.prototype.rtrim=function(t){var e;return null==t&&(t=null),t||(t="\\s"),e=new RegExp(t+"*$"),e.global=!0,e.multiline=!0,this.replace(e,"")},String.prototype.trim=function(t){return null==t&&(t=null),this.ltrim(t).rtrim(t)},fs=require("fs"),path=require("path"),coffee=require("./vendors/coffee-script").CoffeeScript,uglify=require("./vendors/uglify-js"),yuidocs=require("./vendors/yuidocjs"),exec=require("child_process").exec,new(Main=function(){function Main(){this.__replaceDynamicValues=__bind(this.__replaceDynamicValues,this),this._ready=__bind(this._ready,this),this._buildFileChanged=__bind(this._buildFileChanged,this),this._buildDocsComplete=__bind(this._buildDocsComplete,this),this._compileDocs=__bind(this._compileDocs,this),this._buildDocs=__bind(this._buildDocs,this),this._onInput=__bind(this._onInput,this),this._fileRemoved=__bind(this._fileRemoved,this),this._fileChanged=__bind(this._fileChanged,this);var t,e,i,s;for(this.docs=!1,this.ugly=!1,this.verbose=!1,e=process.argv.splice(2),this._buildFile="build.coffee",i=0,s=e.length;s>i;i++){switch(t=e[i]){case"uglify":this.ugly=!0;break;case"--verbose":this.verbose=!0;break;case"docs":this.docs=!0}t.indexOf(".coffee")>=1&&(this._buildFile=t)}Main.verbose=this.verbose,this.coffeeCompiler=new CoffeeCompiler,this.coffeeCompiler.ugly=this.ugly,this.lessCompiler=new LessCompiler,this.lessCompiler.ugly=this.ugly,this.stylusCompiler=new StylusCompiler,this.stylusCompiler.ugly=this.ugly,this.jsCompiler=new JSCompiler,this.jsCompiler.ugly=this.ugly,this._watcher=new Watcher,this._watcher.on(Watcher.CHANGED,this._fileChanged),this._watcher.on(Watcher.ADDED,this._fileChanged),this._watcher.on(Watcher.REMOVED,this._fileRemoved),this._init()}return Main.prototype._fileChanged=function(t,e){var i,s,n,r,o;for(e=[].concat(e),o=[],s=0,n=e.length;n>s;s++)i=e[s],/\.coffee$/i.test(i)?o.push(this.coffeeCompiler.update(i)):/\.less$/i.test(i)?o.push(this.lessCompiler.update(i)):/\.styl$/i.test(i)?o.push(this.stylusCompiler.update(i)):/\.js$/i.test(i)?(null!=(r=this.coffeeCompiler)&&r.update(i),o.push(this.jsCompiler.update(i))):o.push(void 0);return o},Main.prototype._fileRemoved=function(t,e){return e=[].concat(e),this.coffeeCompiler.remove(e),this.lessCompiler.remove(e),this.stylusCompiler.remove(e),this.jsCompiler.remove(e)},Main.prototype._onInput=function(){var t;if(t=process.stdin.read()){if(t=t.toString().trim().toLowerCase(),0===t.length)return;switch(process.stdout.write("[T[J"),t){case"compile":return this.coffeeCompiler.runTasks(!1),this.lessCompiler.runTasks(!1),this.stylusCompiler.runTasks(!1),this.jsCompiler.runTasks(!1);case"uglify":return this.coffeeCompiler.runTasks(!0),this.lessCompiler.runTasks(!0),this.stylusCompiler.runTasks(!0),this.jsCompiler.runTasks(!0);case"docs":return this.docs=!0,this._buildDocs();case"deploy":case"minify":return Log.setStyle("yellow"),Log.println("This command has been deprecated, please use [bugfix || build || release] to compile with correct version.");case"bugfix":case"build":case"release":return this.coffeeCompiler.runTasks(!0,t),this.lessCompiler.runTasks(!0),this.stylusCompiler.runTasks(!0),this.jsCompiler.runTasks(!0);default:return Log.setStyle("yellow"),Log.print("No command "),Log.setStyle("cyan"),Log.print(t),Log.setStyle("yellow"),Log.println(" found")}}},Main.prototype._init=function(){return this._buildFileChanged(),process.stdin.on("readable",this._onInput),this._buildDocs()},Main.prototype._reset=function(){var t;return this.coffeeCompiler.stop(),this.coffeeCompiler.reset(),this.lessCompiler.stop(),this.lessCompiler.reset(),this.stylusCompiler.stop(),this.stylusCompiler.reset(),this.jsCompiler.stop(),this.jsCompiler.reset(),null!=(t=this._buildfileWatcher)?t.close():void 0},Main.prototype._buildDocs=function(){var t,e,i,s,n,r;if(this.docs&&(!this.docs||null!=(null!=(n=this.buildFile)?n.docs:void 0))&&null!=(null!=(r=this.buildFile)?r.docs:void 0)){if(Log.println(),Log.setStyle("magenta"),Log.print("Compiling Docs"),Log.println(),this.buildFile.docs.linkNatives=!0,this.buildFile.docs.attributesEmit=!1,this.buildFile.docs.selleck=!0,this.buildFile.docs.syntaxtype="coffee",null==(s=this.buildFile.docs).extension&&(s.extension=".coffee"),this.buildFile.docs.paths=this.buildFile.docs.source,this.buildFile.docs.outdir=this.buildFile.docs.options.output,e=yuidocs.Project.init(yuidocs.clone(this.buildFile.docs)),i=yuidocs.clone(e),i.paths&&i.paths.length&&i.paths.length>10&&(i.paths=[].concat(i.paths.slice(0,5),["<paths truncated>"],e.paths.slice(-5))),t=new yuidocs.YUIDoc(e).run(),null===t)throw new Error("Running YUIDoc returns null.");return e=yuidocs.Project.mix(t,e),clearTimeout(this.t),void 0!==e.parseOnly&&e.parseOnly?void 0:this._compileDocs(e,t)}},Main.prototype._compileDocs=function(t,e){var i;return i=new yuidocs.DocBuilder(t,e),i.compile(this._buildDocsComplete)},Main.prototype._buildDocsComplete=function(t){return Log.setStyle("cyan"),Log.println("In: "+t+"s"),Notifier.notify("Compiler","Docs compilation completed!")},Main.prototype._buildFileChanged=function(){return Log.setStyle("magenta"),Log.println("Preparing... please wait"),this._reset(),this._parseBuildFile(),this.coffeeCompiler.start(this.sourcePaths),this.lessCompiler.start(this.sourcePaths),this.stylusCompiler.start(this.sourcePaths),this.jsCompiler.start(this.sourcePaths),clearTimeout(this.tt),this.tt=setTimeout(this._ready,3e3)},Main.prototype._ready=function(){return clearTimeout(this.tt),Log.setStyle("green"),Log.println("Ready!"),Log.println("")},Main.prototype._parseBuildFile=function(){var buildFile,e;if(fs.existsSync(this._buildFile))try{buildFile=fs.readFileSync(this._buildFile,{encoding:"utf-8"}),buildFile="return {"+buildFile+"}",this.buildFile=eval(coffee.compile(buildFile))}catch(_error){e=_error,Log.setStyle("red"),Log.print("Error parsing "),Log.setStyle("cyan"),Log.println(this._buildFile),Log.setStyle("blue"),Log.println(e.message+"\nat line "+(e.location.first_line+1)),process.exit()}return this.buildFile?(this.buildFile=this._replaceDynamicValues(this.buildFile),this._buildfileWatcher=fs.watch(this._buildFile,this._buildFileChanged),this._parseTasks(),this.sourcePaths=[].concat(this.buildFile.sourcePaths),this._watchFolders()):(Log.setStyle("red"),Log.print("Could not load "+this._buildFile),void process.exit())},Main.prototype._replaceDynamicValues=function(t){return Main._tempObj=t,this._tempData=JSON.stringify(t),this._tempData=this._tempData.replace(/\{([^\{\}]+)\}/gim,this.__replaceDynamicValues),t=JSON.parse(this._tempData),delete Main._tempObj,delete this._tempData,t},Main.prototype.__replaceDynamicValues=function(t,e){var i,s,n,r;for(n=e.split("."),r=Main._tempObj,i=-1,s=n.length;++i<s&&(r=r[n[i]]););return r?(Main._tempObj=JSON.parse(JSON.stringify(Main._tempObj).replace(new RegExp(t.replace(/(\W)/g,"\\$1"),"g"),r)),r):t},Main.prototype._parseTasks=function(){var t,e,i,s,n;s=this.buildFile.tasks,n=[];for(t in s)i=s[t],e=i.src,n.push(/\.coffee$/i.test(e)?this.coffeeCompiler.addTask(t,i):/\.less$/i.test(e)?this.lessCompiler.addTask(t,i):/\.styl$/i.test(e)?this.stylusCompiler.addTask(t,i):/\.js$/i.test(e)?this.jsCompiler.addTask(t,i):void 0);return n},Main.prototype._resetWatchers=function(){var t;return null!=(t=this._watcher)?t.removeAll():void 0},Main.prototype._watchFolders=function(){var t,e,i,s,n,r;for(this._resetWatchers(),i=[].concat(this.buildFile.sourcePaths),t=0,r=[],s=0,n=i.length;n>s;s++)e=i[s],r.push(this._watcher.addPath(e,!0));
return r},Main}())}).call(this);