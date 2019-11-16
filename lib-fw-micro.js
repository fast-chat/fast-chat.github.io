/*!
 * Ultra Fast Web Tecnology 
 * http://www.giper-troniks.com/
 * Version: 1.0.0
 *
 * Copyright 2018 Giper-Troniks.com
 */

function $ ( s )  {
	try{
		return document.querySelector(s);
	} catch (e) {
		var d = $$([]);
		d.innerHTML = s;
		if(d.children.length == 1) {
			return d.children[0];
		}
		return Array.from(d.children);
	}
}

function _$ ( s )  {
	return document.querySelectorAll(s);
}
function $$(n, isArray){
	n = n.dom || n;
	
	if(n instanceof Node) {
		if(n.onrender) n.onrender();
		return n;
	}
	function d(a){
		if(a instanceof Array){
			return "Array";
		}
		return typeof a;
	}
	if(d(n) == 'Array'){
		n = n.filter(function(a){ return a!=null; });
		var out = isArray? []: $div();
		
		for (var i = 0; i < n.length; i++) {
			if(isArray){
				out.push($$(n[i]))
			}else{
				out.add($$(n[i]))
			}
		}
		return out;
	}
	if(d(n) == 'object'){
		var out = [];
		for(var item in n) {
			
			if(item.indexOf('_') != -1){
				var ar = item.split('_'),
					obj = { tag: ar[0], className: ar[1], id: ar[2] },
					fn_tag = (obj.tag == "")? $div: window['$' + obj.tag], 
					el, elText, arrEvents = {}, arrAttributes = {};

				if(d(n[item]) == 'object'){ // search EVENTS
					// console.log(item, n[item])
					for(var evtItem in n[item]) {
						if(fn_tag()[evtItem] === null && typeof n[item][evtItem] === 'function'){
							arrEvents[evtItem] = n[item][evtItem];
							delete n[item][evtItem];
						}
						if(evtItem == 'attr') {
							arrAttributes = n[item][evtItem];
							delete n[item][evtItem];	
						}
						if(evtItem == 'text' && typeof n[item][evtItem] != "function") {
							//console.log(item, n[item],n[item][evtItem])
							elText = n[item][evtItem];
							delete n[item][evtItem];	
						}
						
					}
					// console.log('after: ', item, n[item])
				}

				if(obj.tag == 'input'){
					if(d(n[item]) == 'object') {
						el = fn_tag()
							.attr('placeholder', n[item].placeholder || '')
							.attr('value', n[item].text || '');
					}else{

						el = fn_tag().attr('placeholder', n[item]);
					}
					if(ar[3]){
						el.attr('type', ar[3])
					}
				}else if (obj.tag == 'img') {
					el = fn_tag().attr('src', n[item]);
					
				}else{
					if(obj.tag == 'select'){
						var _c = $$(n[item], true);
						if(d(_c) == "Array"){
							try{
								el = fn_tag(_c.map(function(a){return a[0];}));
							}catch(err){
								
								el = fn_tag(_c);
							}
						}else{
							el = fn_tag(_c);
						}
					}else{
						el = fn_tag($$(n[item], true));
					}
				}
				if(obj.id){
					el.attr(obj.tag == 'label'? 'for': 'id', obj.id);
				}
				if(obj.className) {
					el.addClass( obj.className );
				}       
				if(Object.keys(arrEvents).length > 0){
					el.events(arrEvents);
				}
				if(Object.keys(arrAttributes).length > 0){
					for(var key in arrAttributes){
						el.attr(key, arrAttributes[key]);
					}
				}
				if(elText) el.value = elText;
				el._name = item;
				out.push(el)
				
				
			//	out.push(el);
			}else{
				// TODO: use template if it is was define
				var el = $div($$(n[item])).addClass(item);
				el._name = item;
				try {
					// statements

					out.push($$[item] != null && item != 'name'? $$[item](n[item]) : el);
				} catch(e) {
					// statements
					console.error(item, "\n", $$[item], "\n", n[item], "\n", e);
				}
			}
		}

		return out.length == 1? out[0]: out;
	}
	return n+'';
}
var StorageRemout = window.location.href.indexOf("file:///") == -1? '/storage/': 'http://www.g6t.cz/storage/';

Object.defineProperty(window, '_storage', {
	get(){
		var n = $.loadjson(StorageRemout).data;
		return !!n[0]? n[0].data[0]: null;
	},
	set(val){
		$.loadjson(StorageRemout, [val]);
	}
});

(function(n){
	n.remove = function (){
		this.parentNode.removeChild(this);
	};
	n.replaceDOM = function ( DOMelementTo ){
		this.parentNode.insertBefore(DOMelementTo, this);
		this.parentNode.removeChild(this);
	};
	n.cls = function (child) {
		this.innerHTML = '';
		return this;
	};
	n.add = function (child) {
		var _child = child.dom || child;
		
		if (_child instanceof Node) {
			if(_child.onbeforerender) {
				_child.onbeforerender();
			}
			this.appendChild(_child);
			if(_child.onrender) {
				_child.onrender();
			}

			this[this.children.length] = _child;
			_child._name = _child._name || _child.className;
			this[_child._name] = _child;
		}else{
			if(typeof _child === 'string' || typeof _child === 'number' || typeof _child === 'boolean') {
				this.appendChild(document.createTextNode(_child+''));
				return;
			}
			var arrChild;
			for (var item in _child) {
				if(_child[item].dom && _child[item].dom instanceof Node){
					arrChild = _child[item].dom;
				} else {
					arrChild = _child[item];
				}
				if(arrChild instanceof Node){
					arrChild._name = arrChild._name || arrChild.className;
					this[this.children.length] = arrChild;
					this[arrChild._name] = arrChild;
					if(arrChild.onbeforerender) {
						arrChild.onbeforerender();
					}
					this.appendChild(arrChild);
					if(arrChild.onrender) {
						arrChild.onrender();
					}

				}else{
					this.appendChild(document.createTextNode(_child[item]));
				}
			}
		}

		return this;
	};
	
	n._name = null;

	//n.parent = n.parentElement;
	Object.defineProperty(n, 'parent', {
		get: function () {
			return this.parentElement;
		},
		set: function (val) {
			//throw 'ERROR';
		}
	})
	/*n.parent = function () {
		return this.parentElement;
	}*/

	n.events = function () {
		var arr = Array.from(arguments);
		for (var i = 0; i < arr.length; i++) {
			for(var item in arr[i]){
				this[item] = arr[i][item];
			}
		}
		return this;
	};
	n.eclick = function(fn){
		return this.events({onclick: fn});
	};
	n.addClass = function (className) {
		if(className && className != '') {
			var _list = className.split(' ');
			for (var i = 0; i < _list.length; i++) {
				this.classList.add(_list[i]);
			}
		}
		return this;
	};
	n.removeClass = function (className) {
		this.classList.remove(className);
		return this;
	};
	n.attr = function (attrName, value) {
		this.setAttribute(attrName, value);
		return this;
	}
	n.model = function(fn){
		var _f = function(){
			fn(this.value);
			//__el.value = pass.value;
		};
		this.events({
			onchange: _f,
			onkeydown: _f,
			onkeyup: _f
		});
		return this;
	}
	Object.defineProperty(n, 'value', {
		get(){
			return this.text();
		},
		set (val) {
			this.text(val);
		}
	});
	n.text = function (str) {
		if (this.tagName === 'INPUT') {
			if (str == null) {
				return this.value;
			} else {
				this.value = str;
				return this;
			}
		}else{
			if (str == null) {
				return this.innerHTML;
			} else {
				this.innerHTML = str;
				return this;
			}
		}
	};
	// n.__css
	n.css = function(val) {
		var oldCss = this.style.cssText.split(" ").join('').split(';').map(a=>a.split(':')).reduce((a,b)=>{
			if(b[0] != '') a[b[0]] = b[1];
			return a;
		}, {});

		oldCss = Object.assign(oldCss, val);

		this.attr('style', JSON.stringify(oldCss).split(/([A-Z]{1})/).map(function(a){ 
			return a===a.toUpperCase()? '-'+a.toLowerCase(): a
		}).join('').replace(/[\}\{\"]/g, '').replace(/[,]/g, '; ').replace(/[\|]{1}/g, ','));
		return this;
	}
	n.cssDel = function(val){
		var arr = val;
		if(typeof val === 'object') {
			arr = Object.keys(val);
		}
		var strCss = this.style.cssText;
		arr.map(item => {
			strCss = strCss.split(';').filter(a=>a.indexOf(item) == -1).join(';')

		});
		return this.attr('style', strCss);
	}

	n.cssClear = function(){
		return this.attr('style', '');
	}
	/*
	Object.defineProperty(n, 'css', {
		get() {
			return this._css;
		},
		set(val){
			this._css = val;
			this.attr('style', JSON.stringify(val).replace(/[\}\{\"]/g, '').replace(/[,]/g, '; '))
		}
	})
	*/
	n.toString = function() {
		return this.value;
	}
	n.onclick = function(evt) {
		console.log(this, this.tagName, evt)
	}

	/*n.id = function (id) {
		return this.attr('id', id);
	}*/
})(Node.prototype);

(function(){
	function div (config, tag, attr) {
		if (typeof config === 'string' || typeof config === 'number') {
			return div([document.createTextNode(config+'')], tag, attr);
		}

		var el = document.createElement(tag || 'div');

		if (attr && typeof attr === 'object') {
			for(var atr in attr){
				el.setAttribute(atr, attr[atr]);
			}
		}
		if (config instanceof Node) {
			el.appendChild(config)
		}else{
			for (var item in config) {
				if(config[item] instanceof Node){
					el[item] = config[item];
					el.appendChild(config[item])
				}
			}
		}
		return el;
	}
	var arrTags = ("a abbr acronym address applet area article aside audio b base" +
		" basefont bdi bdo big blockquote br button canvas caption center cite" +
		" code col colgroup command datalist dd del details dfn dir div dl dt em embed" +
		" fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6" +
		" head header hgroup hr html i iframe img input ins kbd keygen label legend li" +
		" link map mark menu meta meter nav noframes noscript object ol optgroup option" +
		" output p param pre progress q rp rt ruby s samp script section select small source" +
		" span strike strong style sub summary sup table tbody td textarea tfoot th" +
		" thead time title tr track tt u ul var video wbr").split(' ');
	for (var i = 0; i < arrTags.length; i++) {
		switch (arrTags[i]) {
			case "meta":
			case "link":
			case "script":
			case "img":
			case "iframe":
			case "input":
				window["$" + arrTags[i]] = (function(tag){
					return function(attr) {
						return div(null, tag, attr);
					}
				})(arrTags[i]);
				break;
			case "a":
				window["$" + arrTags[i]] = function(paramA, paramB) {
					var _a = document.createElement('a');
					//_a.innerHTML = paramA instanceof Node? paramA.outerHTML: paramA +"";
					if(paramA instanceof Node){
						_a.appendChild(paramA)
					}else {
						_a.innerHTML = paramA + "";
					}
					if(paramB){
						for(var item in paramB){
							_a[item] = paramB[item];
						}
					}
					return _a;
				}

				break;
			case "table":
				window["$" + arrTags[i]] = function(paramA, paramB) {
					if(!paramA) return $(null, 'table');
					var d = div(null, 'table'), tbody, tr, _head;
					
					if(paramA.caption) d.add($caption(paramA.caption))

					if(paramA.head) {
						_head = paramA.head;
						d.add($thead(tr = $tr()));
						for (var j = 0; j < paramA.head.length; j++) {
							tr.add($th(paramA.head[j]))	
						}
					}

					if(paramA.foot) {

						d.add($tfoot(tr = $tr()));
						for (var j = 0; j < paramA.foot.length; j++) {
							tr.add($td(paramA.foot[j]))	
						}
					}
					
					if(paramB) paramA = paramB;
					
					d.add(tbody = $tbody());
					
					for (var i = 0; i < paramA.length; i++) {
						d[i] = $tr();
						tbody.add(d[i]);
						for (var j = 0; j < paramA[i].length; j++) {
							d[i][j] = $td(paramA[i][j]);
							if(_head){
							d[i][j].attr('data-title', _head[j]+'')

							}
							d[i].add(d[i][j]);
						}
					}



					return d;
				}
				break;
			default:
				window["$" + arrTags[i]] = (function(tag){
					return function(content, attr) {
						return div(content, tag, attr);
					}
				})(arrTags[i])
				break;
		}
	}
	$table.from = function(arr) {
		return $table({
			head: Object.keys(arr[0])
		}, 
		arr.map(function(a) {
			return Object.values(a);
		}));
	}
})();


/* -- separator -- */
$.copyToClipboard = function(text, fn) {
	
    var textArea, copy;

    textArea = document.createElement('textArea');
    textArea.css({position: 'fixed'});
    textArea.value = text;
    document.body.appendChild(textArea);

    var range, selection;

    if (navigator.userAgent.match(/ipad|iphone/i)) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
    } else {
        textArea.select();
    }

    document.execCommand('copy');
    document.body.removeChild(textArea);

	if(fn) fn(text);
}





$.storage = function (obj, _var, target){
	function f(param, obj){
		return $.loadjson(StorageRemout+param, obj);
	}
	var __target = target;

	Object.defineProperty(obj, _var, {
		get(){
			return f(__target).data[0];
		},
		set(val){
			f(__target, [val]);
		}
	})
}
$.storage.search = function(search, strPassword, fn) {
	var acs = {"search": search};
	if(strPassword){
		acs["access-read"] = strPassword || "*";
	}
	if(fn){
		$.loadjson(StorageRemout, null, fn, acs);
		return;
	}
	return $.loadjson(StorageRemout, null, fn, acs).data;
}

$.storage.getItem = function(target, strPassword, fn) {
	var acs;
	var _out;
	if(strPassword){
		acs = { "access-read": strPassword || "*" };
	}
	if(fn){
		$.loadjson(StorageRemout+target, null, fn, acs);
		return;
	}
	_out = $.loadjson(StorageRemout+target, null, fn, acs).data;
	/*if(_out.length == 1){
		return _out[0].data[0]
	}*/
	return _out;
}
$.storage.delete = function(id, strPassword, fn) {
	var options = {
		id: id,
		delete: true
	};
	if(strPassword){
		options.write = strPassword;
	}
	if(fn) {	
		$.storage.setItem("", null, options, fn);
		return;
	}
	return $.storage.setItem("", null, options);
}
$.storage.setItem = function(target, obj, access, fn) {
	var _out = [obj];
	if(access) {
		_out = {
			access: {
				read: access.read || "*",
				write: access.write || "*"
			},
			data: [obj]
		};

		if(access.newWritePassword) {
			_out.access.newWritePassword = access.newWritePassword
		}
		if(access.insert) {
			_out.access.insert = access.insert
		}
		if(access.delete) {
			_out.access.delete = access.delete
		}
		if(access.id) {
			_out.access.id = access.id
		}
	}
	if(fn){
		$.loadjson(StorageRemout+target, _out, fn);
		return;
	}
	return $.loadjson(StorageRemout+target, _out, fn).data;
}

$.__loadAndCache = [];
$.loadAndCache = function(i, obj){
	
	var name = 'i' + i.hash(8);
	if(!$.__loadAndCache[name]) 
		$.__loadAndCache[name] = $.loadjson(i, obj);
	return $.__loadAndCache[name];
}
$.loadjson = function(src, obj, fn, header) {
	//if(window.origin === 'null') return {data: {error: true}};
	if(!$('head meta[http-equiv="Access-Control-Allow-Origin"]') ){
		$('head').add($meta({'http-equiv': 'Access-Control-Allow-Origin', content: '*'}));
	}

	var isSync = fn != null;

	var isPost = obj != null;
	var xhr = new XMLHttpRequest();
	
	if(isPost) { /* POST */
		// console.log("== POST ==")
		xhr.open('POST', src, isSync);
		if(header) {
			for( var hItem in header){
				// console.log(hItem + '', header[hItem] + '');
				xhr.setRequestHeader(hItem + '', header[hItem] + '');
			}
		}
		// xhr.withCredentials = true;
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(obj) );
	}else { /* GET */
		// console.log("== GET ==")
		// xhr.withCredentials = true;
		xhr.open('GET', src, isSync);
		if(header) {
			for( var hItem in header){
				// console.log(hItem + '', header[hItem] + '');
				xhr.setRequestHeader(hItem + '', header[hItem] + '');
			}
		}
		xhr.send();
	}

	if(isSync) {
		xhr.onreadystatechange = function(evt) {
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) {
				console.error(xhr.status + ': ' + xhr.statusText)
			}else{
				try {
					fn( {
						status: xhr.status,
						data: JSON.parse(xhr.responseText) 
					})
					
				} catch (e) {
					// console.error(e);
					fn( {
						status: xhr.status,
						data: xhr.responseText
					})
				}
			}
		}
	}else{
		// console.log("xhr.responseText = ", xhr.responseText);
		try {
			return {
				status: xhr.status,
				data: JSON.parse(xhr.responseText) 
			}
			
		} catch (e) {
			// console.error(e);
			return {
				status: xhr.status,
				data: xhr.responseText
			}
		}
	}
}
$.render = function(dom){
	document.body.add(dom);
};

function toggleFullScreen() {
	(function(e,d){
		if (!d.fullscreenElement &&    // alternative standard method
			!d.mozFullScreenElement && !d.webkitFullscreenElement) {	// current working methods
			if (e.requestFullscreen) {
				e.requestFullscreen();
			} else if (e.mozRequestFullScreen) {
				e.mozRequestFullScreen();
			} else if (e.webkitRequestFullscreen) {
				e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			return;
			if (d.cancelFullScreen) {
				d.cancelFullScreen();
			} else if (d.mozCancelFullScreen) {
				d.mozCancelFullScreen();
			} else if (d.webkitCancelFullScreen) {
				d.webkitCancelFullScreen();
			}
		}
	})(document.documentElement, document)
}

window.toggleFullScreen = toggleFullScreen;

String.prototype.hash = function(lenHash) {
	var str = this;
	lenHash = lenHash || 32;
	str = str || "";
	var ar = str.split('').map(function(a) {
		return a.charCodeAt(0)
	}), s2alength = ar.length || 1, i = ar.length ? ar.reduce(function(p, c) {
		return p + c
	}) : 1, s = "", A, B, k = 0, tan = Math.tan;
	while (s.length < lenHash) {
		A = ar[k++ % s2alength] || 0.5;
		B = ar[k++ % s2alength ^ lenHash] || 1.5 ^ lenHash;
		i = i + (A ^ B) % lenHash;
		// s += tan(i*B/A).toString(16).split('.')[1];
		s += tan(i * B / A).toString(16).split('.')[1].slice(0, 10);
	}
	return s.slice(0, lenHash);
}
Object.defineProperty(Object.prototype, 'setProperty',{
	get(){
		return function(name, config){
			Object.defineProperty(this, name, config);
		}
	},
	set(v){
		throw 'Error: setProperty can not be owerwrite';
	}
})
Object.defineProperty(Object.prototype, 'reduce', { 
	value: function(fn, obj) {
		for(var item in this){
			fn(this[item], item, this, obj || {});
		}
		return obj || {};
	}, 
	enumerable: false,
	writable: false
});

Object.defineProperty(Object.prototype, 'toUri', { 
	value: function(){
		return this.reduce(function (a,b,c,d) {
			return d.push(b+'='+a);
		}, []).join('&');
	}, 
	enumerable: false,
	writable: false
});
$.Object = {};
$.Object.reverse = function(a1){
	var a2 = {};
    Object.keys(a1).reverse().map(function (n) {
        a2[n] = a1[n];
        return n;
    });
	return a2;
}
/*Object.defineProperty(Object.prototype, 'reverse', { 
	value: function(){
		var a2 = {}, a1 = this;
	    Object.keys(a1).reverse().map(function (n) {
	        a2[n] = a1[n];
	        return n;
	    });
		return a2;
	}, 
	enumerable: false,
	writable: false
});
*/
setTimeout(function () {
	window.$body = $('body');
	console.group('loading')
	if(window.mainCalled == true) return;

	if(window['main'] && typeof window['main'] === 'function'){
		window['main']();
	}else{
		$.class('index.js')();
	}
	console.groupEnd();
}, 0);

/*  MULTILANGUAGE MODULE  */
function TRANSLATE () { }
(function(t) {
	var __events = [];

	t.fileConfig = '/lang/lang.json';

	var assineDomArray = []
	var lang = {};
	t.setFileConfig = function (fileName) {
		t.fileConfig = t.fileConfig || fileName;
		
		lang = $.loadAndCache(t.fileConfig).data;
		if(lang.error) return;
		// console.log('lang', lang);
	
		for(var _key in lang){
			if(_key === '___index') continue;
			(function(k) {
				// console.log('lang init:',k);

				if(window._ && !window._[k]) Object.defineProperty(window._, k, {
					get(){ return window._(k) }
				})
			})(_key);
		}
		t.currentLeng = lang.___index[0];
	}
	/* init lang */
	t.getLangText = function(index) {
		var subindex = index.split(":")[1];
		index = index.split(":")[0];
		if(!lang[index]){
			console.warn(`WARNING: lang[${t.currentLeng}]:{{${index}}} is not define`);
			return index;
		}
		if(lang[index] instanceof Array){
			return lang[index][lang.___index.indexOf(t.currentLeng)] || lang[index][0];
		}else if(lang[index] instanceof Object){
			var _langItem = lang[index][t.currentLeng] || lang[index]['en'] || `{{lang:${index}}}`;
			if(_langItem instanceof Object){
				if(!_langItem.linkToFile){
					throw `lang[${index}][${t.currentLeng}].linkToFile not define`;
				}else {
					var data = $.loadAndCache(_langItem.linkToFile).data;
					var o = data.split(/<lang:([A_Za-z0-9]+)\/>/ig).reduce(function (a,b,k,ar) {
						k % 2 || k < 1? null: a[ar[k-1]] = b;
						return a;
					},{});
					if(Object.keys(o).length == 0) {
						return data;
					}
					// console.log('subindex ==> ', subindex || Object.keys(o)[0])
					if(!o[subindex || Object.keys(o)[0]]){
						console.warn(`WARNING: lang[${t.currentLeng}]:{{${index}:${subindex}} is not define`);
					}
					return o[subindex || Object.keys(o)[0]] || `{{lang:${index}:${subindex}}}`;
				
				}
			}else{
				return _langItem;
			}
		}
	};
	t.init = () => {
		t.setFileConfig()
	}
	window._ = function (index) {
		var d = $span();
		d.langIndex = index;
		d.value = t.getLangText(index);
		assineDomArray.push(d);
		return d;
	};
	t.onchange = function (fn) {
		__events.push(fn);
	}
	t.setLang = function(strlang) {
		if(t.currentLeng == strlang) return;
		// console.log("TRANSLATE.setLang::", strlang)
		if(lang.___index && lang.___index.indexOf(strlang) == -1){
			strlang = lang.___index[0];
		}
		t.currentLeng = strlang;
		assineDomArray.map(function (d) {
			d.value = t.getLangText(d.langIndex);
			return d;
		})

		for (var i = 0; i < __events.length; i++) {
			__events[i](t.currentLeng)
		}
	}
	
})(TRANSLATE);

$.setCSS = function(obj) {
	function createCSSSelector(selector, style) {
		if (!document.styleSheets)
			return;
		if (document.getElementsByTagName('head').length == 0)
			return;

		var styleSheet, mediaType;

		if (document.styleSheets.length > 0) {
			for (var i = 0, l = document.styleSheets.length; i < l; i++) {
				if (document.styleSheets[i].disabled)
					continue;
				var media = document.styleSheets[i].media;
				mediaType = typeof media;

				if (mediaType === 'string') {
					if (media === '' || (media.indexOf('screen') !== -1)) {
						styleSheet = document.styleSheets[i];
					}
				} else if (mediaType == 'object') {
					if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
						styleSheet = document.styleSheets[i];
					}
				}

				if (typeof styleSheet !== 'undefined')
					break;
			}
		}

		if (typeof styleSheet === 'undefined') {
			var styleSheetElement = document.createElement('style');
			styleSheetElement.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

			for (i = 0; i < document.styleSheets.length; i++) {
				if (document.styleSheets[i].disabled) {
					continue;
				}
				styleSheet = document.styleSheets[i];
			}

			mediaType = typeof styleSheet.media;
		}

		if (mediaType === 'string') {
			for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
				if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
					//console.log('(mediaType === string) reset style a '+ i)
					styleSheet.rules[i].style.cssText = style;
					return;
				}
			}
			styleSheet.addRule(selector, style);
		} else if (mediaType === 'object') {
			// var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
			var styleSheetLength = 0;
			for (var i = 0; i < styleSheetLength; i++) {
				if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
					//console.log('(mediaType === object) reset style a '+ i)
					styleSheet.cssRules[i].style.cssText = style;
					return;
				}
			}
			styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
		}
	}
	function createClass(name,rules){
		var style;
		if(document.getElementsByTagName('style').length == 0){
			style = document.createElement('style');
			style.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(style);
		}else{
			style = document.getElementsByTagName('style')[0];
		}
		
		if(!(style.sheet||{}).insertRule) 
			(style.styleSheet || style.sheet).addRule(name, rules);
		else
			style.sheet.insertRule(name+" {"+rules+"}",(style.styleSheet || style.sheet).length);
	}
	var kk;
	obj = $.Object.reverse(obj);
	for (var i in obj) {
		if (!$.setCSS[i]) {
			$.setCSS[i] = '';
			for (var j in obj[i]) {
				kk = j.split(/([A-Z]{1})/).map(function(a){ 
					return a===a.toUpperCase()? '-'+a.toLowerCase(): a
				}).join('');
				if(typeof obj[i][j] == 'string'){
					$.setCSS[i] += kk + ': ' + obj[i][j] + ';';
				}else if( obj[i][j] instanceof Array){
					$.setCSS[i] += kk + ': ' + obj[i][j].map(function(a){ return kk + ": " + a +""}).join(';') + ';';
				}
			}
			
			try {
				createCSSSelector(i, $.setCSS[i])
			} catch (e) {
				createClass(i, $.setCSS[i])
			}
		}else{
			//console.warn('CSS Class a '+i+' already exist');
		}
	}
};
$.LCSS = function(cssObject){
	function toCSSObject(srcObject, nameItem, destObject){
		var out = {}, k = nameItem? nameItem+' ': '', n;
		destObject = destObject || {};
		for(var item in srcObject){
			if(typeof srcObject[item] === "string" || typeof srcObject[item] === "number"){
				out[item.split(/([A-Z]{1})/).map(function(a){ 
					return a===a.toUpperCase()? '-'+a.toLowerCase(): a
				}).join('')] = srcObject[item]+'';
			}else{
				n = (k+item)
					.replace(/\$\_/g, ', '+k+'.')
					.replace(/\_\$/g, ', '+k+'#')
					.replace(/\_\_/g, ' .')
					.replace(/\$\$/g, ' #')
					.replace(/\$/g, '#')
					.replace(/\_/g, '.')
					.replace(/[\s]?([A-Z]{1})/g, function (m, p) { 
						return ':' + p.toLowerCase();
					})
					.replace(/\s\&/g, '')
					;
				destObject[n] = toCSSObject(srcObject[item], k + item, destObject);
	        }
		};
		return nameItem? out: destObject;
	}
	//console.info('=== Less CSS GENERATE ===\n', toCSSObject(cssObject))
	$.setCSS(toCSSObject(cssObject));
}
$.LCSS.delete = function(selectorText){
	if($.setCSS[selectorText]){
		delete $.setCSS[selectorText];
		document.styleSheets[0].deleteRule(Array.from(document.styleSheets[0].cssRules).map((a,k)=>{
			if(a.selectorText == selectorText.replace(/(\w)(\:)(\w)/, (a,w1,b,w2)=> w1+'::'+w2)) return k;
			return -1;
		}).filter(a=> a!= -1)[0]);

	}
}
$.LCSS.update = function(selectorText, data){
	var oldCss = {};
	if($.setCSS[selectorText]){
		oldCss = $.setCSS[selectorText].split(";").map(a=>a.split(':')).reduce((a,b)=>{
			if(!b[1]) return a;
			a[b[0].replace(/-(\w)/g, (n,b) => b.toUpperCase())] = b[1].replace(/^\s/ig, '');
			return a;
		}, {});
		
		$.LCSS.delete(selectorText)

		for(var item in data) {
			oldCss[item] = data[item];
		}
		var out = {}
		out[selectorText] = oldCss;
		$.LCSS(out);
		return out;
	}
}
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}
/*
	({a:1}).push({b:2}).push({a:3})
	output: {a: 3, b: 2}
//*/
Object.defineProperty(Object.prototype, 'push', { 
	value: function(obj){
		return Object.assign(this, obj)
	}, 
	enumerable: false,
	writable: false
});
// $.css = i => null;

function defineLocalStorageItem(_this, itemName) {
	if(_this && _this[itemName] !== undefined) return ;
	// console.log(_this, itemName, defineLocalStorageItem.caller.name)
	Object.defineProperty(_this, itemName, {
		get(){
			try {
				return JSON.parse(localStorage.getItem(itemName))
			} catch(e) {
				return localStorage.getItem(itemName)
			}
			return 
		},
		set(val) {
			if(typeof val === 'object'){
				localStorage.setItem(itemName, JSON.stringify(val))
			}else{
				localStorage.setItem(itemName, val)
			}
		}
	})
}
window.defineLocalStorageItem = defineLocalStorageItem
/* -- not release -- */
$.init = i => {
	if(!$.__classes) $.__classes = {};
	var name = 'i' + i.hash(8);
	if(!$.__classes[name]){
		$.__classes[name] = Function(CodeConverter($.loadAndCache(i).data) || $.loadAndCache(i).data);
	}
	return $.__classes[name].call(window);
};
$.json = i => {
	if(!$.__classes) $.__classes = {};
	var name = 'i' + i.hash(8);
	if(!$.__classes[name]){
		$.__classes[name] = $.loadAndCache(i).data;
	}
	return $.__classes[name];
};
$.new = i => new $.class(i)();

$.class = i => {
	if(!$.__classes) $.__classes = {};
	var name = 'i' + i.hash(8);
	if(!$.__classes[name]){
		$.__classes[name] = Function('return ' + (CodeConverter($.loadAndCache(i).data) || $.loadAndCache(i).data))();
		// console.log('load ('+i+')');
	}
	return $.__classes[name];
};

Object.defineProperty(this, 'DEBUG', { get (){ return window.location.hash == "#debug"; } });

$.css = i => {
	if(!$.__classes) $.__classes = {};
	var name = 'i' + i.hash(8);
	if(!$.__classes[name]){
		$.__classes[name] = $.loadAndCache(i).data;
	}
	$("head").add($style($.__classes[name], { type: "text/css" }));
};
(function(_export){
	function __load (link, fn) {
		type = link.split(/[\.\/]/g)[link.split(/[\.\/]/g).length -1].split(/[#?]{1}/)[0];
		switch (type) {
			case "css":
				$('head').add($link({ href: link, rel:"stylesheet" }));
				fn(link)
				break;
			case "js":
				if(!!$('script[src="' + link + '"]')){
					$('script[src="' + link + '"]').addEventListener('load', function(e){
						fn(link);
					})
					return;
				}
				$('body').add($script({
					type: "text/javascript", src: link, async: false
				}).events({ onload: ( function(l){
					return function(e) { 
						return fn(l) 
					}
				})(link) }));
				break;
			default: throw new Error(link);
		}
	}
	
	function PPromise() {};

	function require() {
		window.mainCalled = true;
		// console.log("++++++++++++++++++++++++++++++");
		var _arr = (arguments[0] instanceof Array)? arguments[0]: Array.from(arguments);
		// console.log(_arr);
		PPromise.prototype.then = function(fn){
			if(_arr.length) {
				__load(_arr.shift(), function(result) {
					//console.log('loaded:', result);
					require.apply(this, _arr).then(fn);
				})	
			} else {
				//console.log('--done');
				fn();
			}
			return this;
		}
		return new PPromise();
	}
	function _import(){
		window.mainCalled = true;
		var _arr = (arguments[0] instanceof Array)? arguments[0]: Array.from(arguments);
		var ar = Array.from(_arr);
		if(!!window.main && typeof window.main == "function") {
			require(_arr).then(window.main);
		}else{
			require(_arr).then(function(data){ console.log("import:: ",ar) })
		}
	}
	_export._import = _import;
	_export.require = require;
})(window)
function SaveToFile (data, filename, type) {
	var file = new Blob([data], {type: type || 'application/octet-stream'});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.target = '(file)';
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

$.__build = function() {

	var _lib = $.loadjson('/js/lib-fw-micro.js').data;
	
	var s = $.__classes.reduce(function(a,b,c,d){
		// d.push ('"'+b + '" :' +a.toString())
		var spt;
		console.log({a:a,b:b});

		if(typeof a === 'string'){ // css style
			var nnn = a +''
			spt = '$("head").add($style("'+nnn.replace(/\\/g, '\\\\').replace(/[\t\n\r]+/g, '').replace(/\"/g, '\\"') +'", { type: "text/css" }))\n';
			console.log(spt)
			d.push ('"'+b + '" :' +spt);
			return;
		}
		if(typeof a != 'function'){ // json

			spt = JSON.stringify(a);
			d.push ('"'+b + '" :' +spt)
			return;
		}
		spt = CodeConverter($.__loadAndCache[b].data) || $.loadAndCache(i).data;

		console.log({spt:spt});
		
		if(spt.match(/^\(?function/g)==null && spt[0] != '('){
			spt = 'function(){\n'+spt+'\n}';
		}
		spt = spt.replace(/\$\.(css)\(\'([\/\w\.-_]*)\'\)/g, "");
		spt = spt.replace(/\$\.(class|init|json)\(\'([\/\w\.\-\_]*)\'\)/g, (a,p,q) => ('$.__classes.i'+q.hash(8)+(p == 'init'? '.call(window)': "")));
		console.log({after_spt:spt});
		d.push ('"'+b + '" :' +spt)
	}, []).join(',\n');
	var _pack = 'var classes = {\n'+s+'\n};\n';
	var out = _lib.split('/* -- not release -- */')[0].split('/* -- separator -- */').join(_pack/*+_main*/);
	
	out = out.replace(/\$\.\_\_classes/g, 'classes');

	var ntow = i => i.toString(32).toUpperCase().split('').map(a=>isNaN(a*1)?a: 'qazwsxedcf'[a]).join('');
	
	var t = 0;
	
	console.log($.__classes);

	out = out.replace(/\$\.(class)\(\'([\/\w\.-_]*)\'\)/g, (a,p,q) => ('classes.i'+q.hash(8)));
	Object.keys($.__classes).forEach(a=>{

		out = out.split(a+'').join(ntow(t)+'');
		console.log('Object.keys($.__classes)', a, ntow(t));
		t++;
	})
	// out = out.replace("$.class('/index.js')", "classes.q");
	
	SaveToFile(out, 'index.js');
}

// function CodeConverter(s){
// 	// import com.elements<Button, Input, Paragrph>;
// 	// => to
// 	// var Button=$.class(/com/elements/Button.js),Input=$.class(/com/elements/Input.js),Paragrph=$.class(/com/elements/Paragrph.js);
// 	s = s.replace(/import.*/g, function(a,b,c){
// 		return a.replace(/^import (.*)\<(.*)\>/g, (a,b,c)=> {
// 			return 'var '+c.replace(/\s+/g,'').split(',')
// 			.map(n=>n+" = $.class('/"+b.replace('.', '/')+'/'+n+".js')").join(',');
// 		})
// 	})

// 	/* */
	

// 	return s;
// }

function CodeConverter(s){
	if(typeof s !== 'string'){
		return s;
	}
	
	var es5 = s.replace(/import.*/g, function(a,b,c){
		return a.replace(/^import (.*)\<(.*)\>/g, (a,b,c)=> {
			return 'var '+c.replace(/\s+/g,'').split(',')
			.map(n=>n+" = $.class('/"+b.replace('.', '/')+'/'+n+".js')").join(',\n        ')+';';
		})
	})

	try {
		Function(es5)
		return es5;
	} catch(e) {
		// statements
	}

	// import com.elements<Button, Input, Paragrph>;
	// => to
	// var Button=$.class(/com/elements/Button.js),Input=$.class(/com/elements/Input.js),Paragrph=$.class(/com/elements/Paragrph.js);
	var imoprts = '';
	s = s.replace(/import.*/g, function(a,b,c){
		var params;
		imoprts += '\n'+ a.replace(/^import (.*)\<(.*)\>/g, (a,b,c)=> {
			params = c;
			return ''+c.replace(/\s+/g,'').split(',')
			.map(n=>n+" = $.class('/"+b.replace('.', '/')+'/'+n+".js')").join(',\n        ')+';';
		})
		return params? 'var '+params+';': '' ;
	})

	try {
		Function(s)
		return s;
	} catch(e) {
		// statements
	}

	/*
		class Test {}
		class Test extends ParentClass {}
		class Test extends ParentClass1,ParentClass2 {}
	 */

	 /*if constructor */
	 var constructorArguments;
	 s=s.replace(/\b(constructor)\s*\(([\s\w,]*)\)\s*?(?:\{)+((.|\n|\r)+?)(\}$)/gm, (a,g1,g2,g3) => {
	 	// console.log('constructor == ',[a,g1,g2,g3])
	 	constructorArguments = g2;
	 	return g3
	 })

	var _match = s.match(/\b((\w|\s)+)\s*\(([\s\w,]*)\)\s*?(?:\{)+((.|\n|\r)+?)(\}$)/gm); // , function(a,g1,g2,g3,g4){});
	if(_match) _match.map(a=> s = s.replace(a,''))
	// console.log('<_match>',_match);

	var baseClassName; // ClassName
	var extendsClassName;
	s = s.replace(/\b(class\s)?(\w+)\s?(extends\s+([\w,\s]+)\s?)?\{/gm, function(a,b,g1,c,g3){
		if(!baseClassName) baseClassName = g1;
		if(g1 == 'else') {
			return a;
		}
		var _s = 'function '+g1+'('+(constructorArguments||'')+'){';
			_s += imoprts + '\n\n';
		if(g3) {
			_s += '\n    '+ g3.replace(/\s+/g, '').split(',').map(a=>a+'.apply(this,arguments);').join('\n    ');
			extendsClassName = g3;
		}
		
		return _s;
	})

	/*
		parse Methods
	*/


	s += '\n\n';

	if(extendsClassName){
		s += 'setTimeout(function(){\n'+
			imoprts + '\n\n'+
			baseClassName+'.prototype = Object.assign('+baseClassName+'.prototype, '+
			extendsClassName.replace(/\s+/g, '').split(',').map(a=>a+'.prototype')+')\n'+
			baseClassName+'.prototype.constructor = '+baseClassName+';\n'+
			'},0);\n\n';
	}
	
	if(_match) _match.forEach(a=>{
		// console.group()
		var formatted = a.replace(/\b((\w|\s)+)\s*\(([\s\w,]*)\)\s*?(?:\{)+((.|\n|\r)+?)(\}$)/gm, function(a,g1,g2,g3,g4){
			// console.log('   > ', [a,g1,g2,g3,g4])
			/*public test */
			if(g1.split(/\s+/g).indexOf('public') != -1){
				return baseClassName+'.prototype.'+g1.split(/\s+/g).filter(a=>a!="").reverse()[0]+ ' = function('+g3+') {'+g4+'}';
			}else
			if(g1.split(/\s+/g).indexOf('static') != -1){
				return baseClassName+'.'+g1.split(/\s+/g).filter(a=>a!="").reverse()[0]+ ' = function('+g3+') {'+g4+'}';
			}else {
				return 'function '+g1.split(/\s+/g).filter(a=>a!="").reverse()[0]+' ('+g3+') {'+g4+'}';
			}

			return a;
		});

		// console.log('<foreach a>\n',formatted)
		s += formatted + '\n';
		// console.groupEnd()
	})
	s = s.replace(/(\s|\n|\r){2,}$/gm,'')
	if(baseClassName) s = '(function(){\n'+ s + '\nreturn '+baseClassName+';\n})()';
	try {
		Function(s);
		return s;
	} catch(e) {
		return null;
	}
	
}