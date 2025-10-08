// timing start
const _pageLoadingStartAt = +new Date;
var _jsLoadingStartAt = +new Date;

// offline detection
const IS_OFFLINE = (document.location.protocol == 'file:');

// iframe detection
const IS_IFRAME = (window.top !== window.self);

// clear any GET params from URL
var CLEARED_LOCATION_SEARCH = ! IS_OFFLINE && ! IS_IFRAME && location.search,
	CLEARED_GET_PARAMS = CLEARED_LOCATION_SEARCH && {};
if (CLEARED_LOCATION_SEARCH) (function() {
	var pairs = CLEARED_LOCATION_SEARCH.substr(1).split('&'), pair;

	while (pair = pairs.pop()) {
		pair = pair.split('=');
		CLEARED_GET_PARAMS[ decodeURIComponent(pair[0]) ] = decodeURIComponent(pair[1]);
	}
	history.replaceState(null, null, location.href.replace(CLEARED_LOCATION_SEARCH, ''));
})();

/** App config
 */
const CONFIG = {
	get: function(path, ctx) {
		ctx = ctx || this;
		path = (path || '').split('.');
		for (; ctx && path.length; ctx = ctx[ path.shift() ]);
		return ctx;
	},
	defaultFigure: {
		// form
		base           : 'Icosahedron', // Octohedron
		detail         : 3,
		subdivClass    : 'I', //'III_1,2',
		M              : 0,
		N              : 0,
		subdivMethod   : 'Kruschke', // 'Chords',
		symmetry       : 'Pentad',
		fullerenType   : 'none', //'inscribed',

		// cutting; format: by height - 0.12345 or by faces - 3/8
		partialMode    : 'faces', // 'height'
		partial        : '7/12', //'5/8', //'1/4',
		partialHeight  : .777,

		alignTheBase : false,

		// connection type
		connType       : 'GoodKarma', //'Semicone',
		  pipeD        : '108',
		  clockwise    : true,

		// metrics
		radius         : '2.20',

		beamsWidth     : '120',
		beamsThickness : '40',

		// deprecated
		clothier: {
			width: 2100,
			height: 12000
		}
	},
	view: {
		modeCover: {
			opacity: (over, removed) => {
				return removed ? .03 : (over ? .95 : .90);
			}
		},
		modeTent: {
			present: true || !! CLEARED_GET_PARAMS["tent"]
		},
		drawings: {
			face: {
				cols: 2
			}
		},
		wysiwyg: {
			// use form.showEthalon({ true|false }) as semaphor
			ethalon: false
		}
	}
};

/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * $LastChangedDate: 2007-06-20 16:24:37 -0500 (Wed, 20 Jun 2007) $
 * $Rev: 2124 $
 *
 * Version: 2.2
 */

(function($) {
	
$.fn.extend({
	
	/**
	 * Apply the mousewheel event to the elements in the jQuery object.
	 * The handler function should be prepared to take the event object
	 * and a param called 'delta'. The 'delta' param is a number
	 * either > 0 or < 0. > 0 = up and < 0 = down.
	 *
	 * The pageX, pageY, clientX and clientY event properties
	 * are fixed in Firefox.
	 *
	 * @example $("p").mousewheel(function(event, delta){
	 *   if (delta > 0)
	 *     // do something on mousewheel scroll up
	 *   else if (delta < 0)
	 *     //do something on mousewheel scroll down
	 * });
	 *
	 * @name mousewheel
	 * @type jQuery
	 * @param Function handler A function to call when onmousewheel fires. Should take two params: event and delta.
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	mousewheel: function(f) {
		if (!f.guid) f.guid = $.event.guid++;
		if (!$.event._mwCache) $.event._mwCache = [];
		
		return this.each( function() {
			if (this._mwHandlers) return this._mwHandlers.push(f);
			else this._mwHandlers = [];
			
			this._mwHandlers.push(f);
			
			var s = this;
			
			this._mwHandler = function(e) {
				e = $.event.fix(e || window.event);
				$.extend(e, this._mwCursorPos || {});
				var delta = 0, returnValue = true;
				
				if (e.wheelDelta)  delta = e.wheelDelta/120;
				if (e.detail)      delta = -e.detail/3;
				if (window.opera)  delta = -e.wheelDelta;
				
				for (var i=0; i<s._mwHandlers.length; i++)
					if (s._mwHandlers[i])
						if ( s._mwHandlers[i].call(s, e, delta) === false ) {
							returnValue = false;
							e.preventDefault();
							e.stopPropagation();
						}
				
				return returnValue;
			};
			
			if ($.browser.mozilla && !this._mwFixCursorPos) {
				// fix pageX, pageY, clientX and clientY for mozilla
				this._mwFixCursorPos = function(e) {
					this._mwCursorPos = {
						pageX: e.pageX,
						pageY: e.pageY,
						clientX: e.clientX,
						clientY: e.clientY
					};
				};
				$(this).bind('mousemove', this._mwFixCursorPos);
			}
			
			if (this.addEventListener)
				if ($.browser.mozilla) this.addEventListener('DOMMouseScroll', this._mwHandler, false);
				else                   this.addEventListener('mousewheel',     this._mwHandler, false);
			else
				this.onmousewheel = this._mwHandler;
			
			$.event._mwCache.push( $(this) );
		});
	},
	
	/**
	 * This method removes one or all applied mousewheel events from the elements.
	 * You can remove a single handler function by passing it as the first param.
	 * If you do not pass anything, it will remove all handlers.
	 *
	 * @name unmousewheel
	 * @param Function handler The handler function to remove from the mousewheel event.
	 * @type jQuery
	 * @cat Plugins/Mousewheel
	 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
	 */
	unmousewheel: function(f) {
		return this.each( function() {
			if ( f && this._mwHandlers ) {
				for (var i=0; i<this._mwHandlers.length; i++)
					if (this._mwHandlers[i] && this._mwHandlers[i].guid == f.guid)
						delete this._mwHandlers[i];
			} else {
				if ($.browser.mozilla && !this._mwFixCursorPos)
					$(this).unbind('mousemove', this._mwFixCursorPos);
					
				if (this.addEventListener)
					if ($.browser.mozilla) this.removeEventListener('DOMMouseScroll', this._mwHandler, false);
					else                   this.removeEventListener('mousewheel',     this._mwHandler, false);
				else
					this.onmousewheel = null;
					
				this._mwHandlers = this._mwHandler = this._mwFixCursorPos = this._mwCursorPos = null;
			}
		});
	}
});

// clean-up
$(window)
	.one('unload', function() {
		var els = $.event._mwCache || [];
		for (var i=0; i<els.length; i++)
			els[i].unmousewheel();
	});
	
})(jQuery);

			/* tracker */
			Tracker = function() {
	// detect local session
	var isLocal = (location.protocol === 'file:');

	// save logs on unload calc window
	$(window).on('unload', function() {
		trackerData["endAt"] = +new Date;

		$.ajax({
			type: 'POST',
			url: '//acidome.com/lab/calc/logs/track.php',
			data: trackerData,
			async: false
		});
	});

	// tracker data
	// key with value equals [empty array] will not be transfered
	var trackerData = {
			// identify
			client:
				isLocal ? [] : // undefined client (we can't to recognize local client)
				cookie('client', rand, 'expires=Fri, 09 Apr 2038 15:04:40 GMT;'),
			session:
				cookie('session', isLocal ? 'local' : rand),
			page:
				rand(),

			// geo info
			geo: '',

			// usage history
			initial: {},
			flow: [],

			iframe: IS_IFRAME,

			// relative timing started here
			startAt: +new Date,

			// start url
			url: isLocal ?
				document.location.href.replace(/^[^#]*[\/\\](.*)$/, '$1') : // get no local path to file (privacy issue)
				document.location.href,

			// referrer to this domain, including one redirect
			referrer: function() {
				var ref = decodeURIComponent( cookie('strong-redirect-referrer') );
				if (ref) {
					// remove temporary cookie
					document.cookie = 'strong-redirect-referrer=; expires=' + (new Date).toUTCString();
					return ref;
				}
				// simple referrer
				return document.referrer || []
			}()
		},
		timings = {};

	return {
		push: push,
		extend: function(data) {
			_.extend(trackerData, data);
		},
		time: function(key) {
			timings[key] = +new Date;
		},
		timeEnd: function(key, started) {
			trackerData[key] = (+new Date) - (started || timings[key]);
			console.log(key + ' at: ' + trackerData[key] + 'ms');
		},
		updateGeo: function(providerName, data) {
			var geo = trackerData["geo"] = trackerData["geo"] || { provided: [] };

			var hasReceived = _.reduce(data, function(hasReceived, value, key) {
				if (value && !geo[key]) {
					geo[key] = (value + '')
						// remove text artefacts
						.replace(/\\(['"\\])/g, '$1');
					return true;
				}
				return hasReceived;
			}, false);

			if (hasReceived) {
				trackerData["geo"].provided.push(providerName);
			}

			return geo;
		}
	};


	// push log
	function push(type, data, extra) {
		if (typeof data == 'object') {
			// map boolean values to string (else will be wrong mapped to string in POST body)
			data = _.reduce(data, function(memo, value, key) {
				memo[key] = (typeof value == 'boolean') ? value ? '1' : '' : value;
				return memo;
			}, {});
		}

		// detect first push for this key
		if (! trackerData.initial.hasOwnProperty(type)) {
			trackerData.initial[type] = _.extend({
				time: time(),
				data: data
			}, extra);
		} else {
			trackerData.flow.push(
				_.extend({
					type: type,
					time: time(),
					data: data
				}, extra)
			);
		}
	}

	// relative time from started
	function time() {
		return +new Date - trackerData.startAt;
	}

	// helpers
	function cookie(key, defaults, extra) {
		// get
		var value = (document.cookie.split(key)[1] || '=;').replace(/^=([^;]*);.*$/, '$1');

		if (!value && defaults) {
			// set & save
			value = extracted(defaults);
			document.cookie = key + "=" + value + ';' + extracted(extra || '');
		}

		return value;

		function extracted(defaults) {
			return (typeof defaults == 'function') ? defaults() : defaults;
		}
	}

	function rand() {
		return random(1e+9, 1e+12).toString(36).toUpperCase();

		function random(min, max) {
			if (max == null) {
				max = min;
				min = 0;
			}
			return min + Math.floor(Math.random() * (max - min + 1));
		}
	}
}();



// geo info request
$(function() {
	var GEO_STORAGE = 'acidome.geo',
		GEO_EXPIRES = 'acidome.geo-expires',
		providerCache = (provider) => {
			const cache = (data) => {
					if (data) {
						localStorage.setItem(GEO_STORAGE, JSON.stringify(data));
						localStorage.setItem(GEO_EXPIRES, JSON.stringify(+new Date + provider.EXPIRES));
					}
					else {
						var expires = JSON.parse( localStorage.getItem(GEO_EXPIRES) );
						
						if (expires && expires > +new Date) {
							return JSON.parse( localStorage.getItem(GEO_STORAGE) );
						}
						else {
							localStorage.removeItem(GEO_EXPIRES);
							localStorage.removeItem(GEO_STORAGE);
						}
					}
				};
			
			return cache;
		},
		providers = [/* offline from 14.01.2015 {
			name: 'freegeoip.net',
			request: '//freegeoip.net/json/?callback=__geoDataReceiver',
			access: function(data) {
				if (typeof data !== 'object')
					return {};

				// ignore ip, in order to privacy
				return {
					countryCode: data.country_code,
					country: data.country_name,
					regionCode: data.region_code,
					region: data.region_name,
					city: data.city,
					lat: data.latitude,
					long: data.longitude
				};
			}
		},*/
		/* payment required from 14.01.2015 {
			name: 'maxmind.com',
			request: '//j.maxmind.com/app/geoip.js',
			access: function() {
				if (typeof geoip_country_code != 'function')
					return {};

				return {
					countryCode: geoip_country_code(),
					country: geoip_country_name(),
					regionCode: geoip_region(),
					region: geoip_region_name(),
					city: geoip_city(),
					lat: geoip_latitude(),
					long: geoip_longitude()
				};
			}
		}, {
			name: 'telize.com',
			request: '//www.telize.com/geoip?callback=__geoDataReceiver',
			access: function(data) {
				if (typeof data !== 'object')
					return {};

				// ignore ip, in order to privacy
				return {
					continentCode: data.continent_code,
					countryCode: data.country_code,
					country: data.country_name,
					regionCode: data.region_code,
					region: data.region,
					city: data.city,
					lat: data.latitude,
					long: data.longitude
				};
		},*/ {
			EXPIRES: 4 * 3600 * 1000, //ms
			name: 'ipinfo.io',
			request: '//ipinfo.io?callback=__geoDataReceiver',
			access: function(data) {
				if (typeof data !== 'object')
					return {};

				// ignore ip, in order to privacy
				return {
					continentCode: null,
					countryCode: data.country,
					country: data.country,
					regionCode: data.region,
					region: data.region,
					city: data.city,
					lat: data.loc.split(',')[ 0 ],
					long: data.loc.split(',')[ 1 ]
				};
			}
		}],
		requiredKeys = ['countryCode', 'city'];

	if (!IS_OFFLINE) {
		nextProvider();
	}

	function nextProvider() {
		var provider = providers.pop(), // right-to-left
			cache = providerCache(provider);

		if (! provider) return;
		
		if (cache()) {
			console.log('* geo from cache', cache());
			return cache();
		}
		
		window.__geoDataReceiver = function(data) {
			var geo = Tracker.updateGeo(provider.name, provider.access(data)),
				isFullFilled = _.any(requiredKeys, function(key) {
					return !!geo[key];
				});

			delete window.__geoDataReceiver;

			if (isFullFilled) {
				// save to cache
				cache(geo);
				
				// geo provided
				$(document).trigger('geo-complete', geo);
			}
			else  {
				// try to run more, after script's onload called
				_.defer(nextProvider);
			}
		};

		if (provider.request) {
			var script = $('<script>')[0];
			script.type = 'text/javascript';
			script.async = true;
			script.src = provider.request;
			script.onload = function() {
				if (window.__geoDataReceiver) {
					// error happens OR receiver-function was not called in JSONP response code
					// handle provider.access() this
					window.__geoDataReceiver();
				}
			};
			script.onerror = nextProvider;
			document.body.appendChild(script);
		}
		else {
			// without-request method used O_O
			window.__geoDataReceiver();
		}
	}
});

			
				if (! _.isEmpty(CLEARED_GET_PARAMS)) {
					// initial
					Tracker.push("GET", CLEARED_GET_PARAMS);
				}
			
			
			/* calc basic */
			// Универсальная функция наследования
Function.prototype.inherits = function(superClass) {
	var Inheritance = function(){};
	Inheritance.prototype = superClass.prototype;
	this.prototype = new Inheritance();
	this.prototype.constructor = this;
	this.superClass = superClass;
	// доступ к родительскому классу из инстанса
	this.prototype.superClass = superClass.prototype;
	return this;
}

// переопределение свойств/методов
Function.prototype.override = function(proto) {
	for (var k in proto)
		this.prototype[k] = proto[k];
	return this;
}

// статические свойства/методы
Function.prototype.statics = function(proto) {
	for (var k in proto)
		this[k] = proto[k];
	return this;
}

			/*
 * Palette is the js class.
 *
 * Legalize Cannabis Licence
 */

Palette = function(hex){
	this.rgb = Palette.hex2rgb(hex);
}
.override({
	hl: function(inc) {
		this.rgb ||
			console.log('!this.rgb');
		this.rgb[0] += inc;
		this.rgb[1] += inc;
		this.rgb[2] += inc;
		return this;
	},
	color: function(){
		return Palette.rgb(this.rgb[0], this.rgb[1],this.rgb[2]);
	}
});

Palette.HEX = '0123456789ABCDEF';

Palette.hex2 = function(i){
	i = i < 0 ? 0 : i;
	i = i > 255 ? 255: i;
	var l = i % 16, h = (i - l) / 16;
	return '' + Palette.HEX[h] + Palette.HEX[l];
};

Palette.hex2int = function(hex){
	if (hex.length > 1)
		return Palette.hex2int(hex.substr(0, hex.length - 1)) * 16 + Palette.hex2int(hex.substr(hex.length - 1))
	for (var i = Palette.HEX.indexOf(hex.toUpperCase()); i >= 0;)
		return i;
	return console.log('Palette.hex2int(): unknown', hex);
};

Palette.hex2rgb = function(hex){
	var result = /^#?(\w\w?)(\w\w?)(\w\w?)$/.exec(hex);
	if (result)
		return [ Palette.hex2int(result[1]), Palette.hex2int(result[2]), Palette.hex2int(result[3]) ];
	return console.log('Palette.hex2rgb(): unknown', hex);
};

Palette.rgb = function(r, g, b){
	return '#' + Palette.hex2(r) + Palette.hex2(g) + Palette.hex2(b);
};



Palette.collections = {
	vertex: [],
	line: 
		['#CC2222', '#CCCC22', '#22CC22']
		//["#B72E33", "#FEBE1E", '#A9CE38']
		.concat([
			"#058361",
			"#272C5B",
			"#A72465",
			"#F2801F",
			"#95B6E1",
			"#00617E",
			"#8B4588"
		]),
	face: []
};

(function(){
	var cube = function(dim, fn){
		var shifting = [], pos,
			collection = [];
		for (var steps = [], i = 0; i < dim; i++) {
			steps.push(255 - Math.floor((255 / dim) * i));
			i % 2 && shifting.push(i);
		}
		for (i = 0; i < dim; i++)
			i % 2 || shifting.push(i);
		for (var k = 0; k < steps.length; k++){
			var b = steps[shifting[k]];
			for (var j = 0; j < steps.length; j++){
				var g = steps[shifting[j]];
				for (i = 0; i < steps.length; i++){
					var r = steps[shifting[i]];
					fn(r, g, b, shifting[i], shifting[j], shifting[k], pos++);
				}
			}
		}
	}

	Palette._colors = [];
	var steps = 10;
	cube(steps, function(r, g, b, i, j, k, pos){
		if ((i + j + k) % 2 == 0 && (i + j + k) > 2 && (i + j + k) < steps * 3 - 2) {
			var rgb = Palette.rgb(r, g, b);
			Palette._colors.push(rgb);
			// collections
			var mod = (i + j + k) / 2;
			//mod = 
			if (mod % 3 == 2)
				Palette.collections.vertex.push(rgb);
			else if(mod % 2)
				Palette.collections.face.push(rgb);
			else
				Palette.collections.line.push(rgb);

		}
	});
})();

0&&$(function(){
	$.each(Palette.collections, function(key, colors){
		$(colors.length).prependTo('body');
		$(colors).each(function(){
			$('<span style="background-color:'+this+'">&nbsp;&nbsp;'+key+'&nbsp;&nbsp;</span> &nbsp; ').prependTo('body');
		});
		$('<br>').prependTo('body');
	});
});

			//##############################################################################
// File: 
//		metrics.js
// Dependencies:
//		utils.js
// Description:
//		Defines a Vector object for position, distance and dimensions in 3D, a
//		Rectangle object for neatly packaging position and dimensions together and
//		several utility functions for working with dimensions and/or positions of
//		DOM objects, the document, the window and the viewport.
//##############################################################################
// (c)2005-2006 Jeff Lau
//##############################################################################

function Metrics() {
};

// Heron triangle area
Metrics.triangleHeronArea = (a, b, c) => {
	const p = (a + b + c) / 2;
	return Math.sqrt(p * (p - a) * (p - b) * (p - c));
};

//##############################################################################

Vector =
Metrics.Vector = function(x, y, z) {
	if (y === undefined && z === undefined && x === 0) {
		return new Vector();
	}
	this.x = isNaN(x) ? 0 : x.valueOf();
	this.y = isNaN(y) ? 0 : y.valueOf();
	this.z = isNaN(z) ? 0 : z.valueOf();
};

Vector.prototype.copy = function(p) {
	this.x = p.x;
	this.y = p.y;
	this.z = p.z;
	return this;
};

	Metrics.Vector.prototype.clone = function() {
		return new Metrics.Vector(this.x, this.y, this.z);
	};
	
	Metrics.Vector.prototype.equals = function(to) {
		return
			Math.abs(this.x - to.x) +
			Math.abs(this.y - to.y) +
			Math.abs(this.z - to.z) < .000001;
	}
	

	Metrics.Vector.prototype.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;

		return this;
	};
	
	Metrics.Vector.add = function(vector1, vector2) {
		return new Metrics.Vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
	};
	
	Metrics.Vector.prototype.subtract = function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		this.z -= vector.z;

		return this;
	};
	
	Metrics.Vector.subtract = function(vector1, vector2) {
		return new Metrics.Vector(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
	};
	
	Metrics.Vector.prototype.scale = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	};
	
	Metrics.Vector.scale = function(vector, scalar) {
		return new Metrics.Vector(vector.x * scalar, vector.y * scalar, vector.z * scalar);
	};
	
	Metrics.Vector.prototype.length = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	};

	Metrics.Vector.prototype.isZero = function() {
		return Vector.dotProduct(this, this) < 1e-20;
	};

	Metrics.Vector.prototype.normalize = function() {
		var length = this.x * this.x + this.y * this.y + this.z * this.z;
		
		//if (length && Math.abs(length - 1) > 0.01) {
			length = Math.sqrt(length);
			this.x /= length;
			this.y /= length;
			this.z /= length;
		//}
		return this;
	};
	
	Metrics.Vector.normalize = function(vector) {
		return (new Metrics.Vector(vector.x, vector.y, vector.z)).normalize();
	};
	
	Metrics.Vector.dotProduct = function(vector1, vector2) {
		return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
	};

	Metrics.Vector.crossProduct = function(vector1, vector2) {
		return new Metrics.Vector(
			vector1.y * vector2.z - vector1.z * vector2.y,
			vector1.z * vector2.x - vector1.x * vector2.z,
			vector1.x * vector2.y - vector1.y * vector2.x
		);
	};
	
	// проекция вектора1 на вектор2, вдоль вектора2
	Metrics.Vector.project = function(vector1, vector2) {
		var square2 = Metrics.Vector.dotProduct(vector2, vector2);
		
		if (square2) {
			return Metrics.Vector.scale(vector2, Metrics.Vector.dotProduct(vector1, vector2) / square2);
		}
		
		return new Metrics.Vector();
	};
	
	Metrics.Vector.component = function(vector1, vector2) {
		return Metrics.Vector.dotProduct(vector1, Metrics.Vector.normalize(vector2));
	};
	
	Metrics.Vector.perpendicular = function(vector1, vector2) {
		return Metrics.Vector.subtract(vector1, Metrics.Vector.project(vector1, vector2));
	};

	Metrics.Vector.rotate = function(vector, angle, axis) {
		var cosAngle = Math.cos(angle);
		var sinAngle = Math.sin(angle);
		
		switch (axis) {
			case "x":
				return new Metrics.Vector(
					vector.x,
					vector.y * cosAngle + vector.z * sinAngle,
					vector.z * cosAngle - vector.y * sinAngle
				);
			case "y":
				return new Metrics.Vector(
					vector.x * cosAngle + vector.z * sinAngle,
					vector.y,
					vector.z * cosAngle - vector.x * sinAngle
				);
			default:
				return new Metrics.Vector(
					vector.x * cosAngle + vector.y * sinAngle,
					vector.y * cosAngle - vector.x * sinAngle,
					vector.z
				);
		}
	};

	Metrics.Vector.prototype.toString = function() {
		return "(" + (this._enum ? 'enum:' + this._enum + ', ' : '' ) + this.x + ", " + this.y + ", " + this.z + ")";
	};
	
	Metrics.Vector.prototype.cosWith = function(B) {
		var a2 = this.x * this.x + this.y * this.y + this.z * this.z;
		var b2 = B.x * B.x + B.y * B.y + B.z * B.z;
		var c = this.clone().subtract(B);
		var c2 = c.x * c.x + c.y * c.y + c.z * c.z;
		var cos = (a2 + b2 - c2) / Math.sqrt(4 * a2 * b2);
		return Math.abs(cos + 1) > 1e-9 ? Math.abs(cos - 1) > 1e-9 ? cos : 1 : -1;
	}
	
	Metrics.Vector.prototype.angleWith = function(B, precision) {
		var angle = Math.acos(this.cosWith(B));
		return precision ? Math.round(angle * 180 / Math.PI / precision) * precision : angle;
	}
	
	Metrics.Vector.angle = function(A, B, C, precision) {
		return C ? A.clone().subtract(B).angleWith(C.clone().subtract(B), precision) :
			A.angleWith(B, precision);
	}
	
	Metrics.Vector.distance = function(A, B, precision){
		var d = A.clone().subtract(B).length();
		return precision ? Math.round(d / precision) * precision : d;
	}
	
	Metrics.Vector.prototype.distance = function(B, precision){
		return Metrics.Vector.distance(this, B, precision);
	}
	
	Vector.prototype.carousel = function() {
		var t = this.x;
		this.x = this.y;
		this.y = this.z;
		this.z = t;
		return this;
	}

//############################################################################## plane

Plane =
Metrics.Plane = function(A, B, C, D) {
	if (arguments.length == 2) {
		Plane.apply(this, [A.x, A.y, A.z, B || 0]);
		return;
	}
	if (typeof D != 'number') {
		Plane.apply(this, [A, B, C, 0]);
		this.D = - this.result(D);
		return;
	}
	this.A = A;
	this.B = B;
	this.C = C;
	this.D = D;
}
Plane.prototype = {
	normal: function() {
		return new Vector(this.A, this.B, this.C);
	},
	
	normalize: function() {
		var length = Math.sqrt(this.A*this.A + this.B*this.B + this.C*this.C);
		this.A /= length;
		this.B /= length;
		this.C /= length;
		this.D /= length;
		return this;
	},
	
	result: function(p) {
		return this.A * p.x + this.B * p.y + this.C * p.z + this.D;
	},
	
	clone: function() {
		return new Plane(this.A, this.B, this.C, this.D);
	},
	
	revert: function() {
		this.A = -this.A;
		this.B = -this.B;
		this.C = -this.C;
		this.D = -this.D;
		return this;
	},

	crossWithRay: function(point, vector) {
		return point.clone().add(
			vector.clone().scale(
				- (Vector.dotProduct(this.normal(), point) + this.D) / Vector.dotProduct(this.normal(), vector)
			)
		);
	},
	
	_add: function(p) {
		this.A += p.A;
		this.B += p.B;
		this.C += p.C;
		this.D += p.D;
		return this;
	}
};

Plane.average = function(
	p1, p2,
	acute, // true/false = разбивать острый/тупой угол
	impossibleResult  // вернется если результат не определен
){
	if (arguments.length < 3) {
		return [
			Plane.average(p1, p2, false),
			Plane.average(p1, p2, true)
		];
	}
	p1 = p1.clone().normalize();
	p2 = p2.clone().normalize();
	var cos = p1.normal().cosWith(p2.normal());
	// cos > 0 => сумма нормалей внутри тупого угла => сумма нормальных плоскостей внутри острого
	var revert = cos > 0 ^ acute;
	var ret = p1._add(revert ? p2.revert() : p2).normalize();
	if (isNaN(ret.A) || isNaN(ret.B) || isNaN(ret.C) || isNaN(ret.D))
		ret = (arguments.length == 4) ? typeof(impossibleResult) == 'function' ? impossibleResult() : impossibleResult : 
			console.warn('Plane.average(): impossible');
	return ret;
}

//############################################################################## not linear solutions

Solutions = {
	planesCross: function(p0, p1, p2){
		var A = [p0.A, p1.A, p2.A];
		var B = [p0.B, p1.B, p2.B];
		var C = [p0.C, p1.C, p2.C];
		var D = [p0.D, p1.D, p2.D];
		
		return new Vector(
			-h3(B, C, D) / h3(B, C, A),
			-h3(C, A, D) / h3(C, A, B),
			-h3(A, B, D) / h3(A, B, C)
		);
		
		function h3(A, B, C){
			return 0 +
				C[0] * (A[2] * B[1] - A[1] * B[2]) +
				C[1] * (A[0] * B[2] - A[2] * B[0]) +
				C[2] * (A[1] * B[0] - A[0] * B[1]);
		}
	},
	twoPlanesAndSphere: function(plane0, plane1/*, radius, center*/) {
		//center = center || Vector(0);
		//radius = radius || 1;
		
		// simple case with both planes intersect center sphere
		if (0 === plane0.D && 0 === plane1.D) {
			const result0 = Vector.crossProduct(plane0.normal(), plane1.normal()).normalize();
			
			return [result0, Vector.scale(result0, -1)];
		}
		
		/**
		 * вычел 1) из 2, 3) получается такая система: 
		 * 5) Px*A + Py*B + Pz*C = Pd
		 * 6) Qx*A + Qy*B + Qz*C = Qd
		 * +4)  A*A +  B*B +  C*C = 1
		 */
		var P = plane0.normal(), //.subtract(center),
		    Pd = -plane0.D;
		var Q = plane1.normal(), //.subtract(center),
		    Qd = -plane1.D;
		// крутанем
		var mapi = 0, value = 0;
		for (var i = 0; i < 3; i++){
			P.carousel();
			Q.carousel();
			//mapi++;
			/**
			 * 5 =>    7) A = (Pd - Py*B - Pz*C) / Px
			 * 6 =>    8) A = (Qd - Qy*B - Qz*C) / Qx
			 * 7,8 =>  9) (Pd - Py*B - Pz*C) * Qx = (Qd - Qy*B - Qz*C) * Px
			 * 9 =>   10) (Qy*Px - Py*Qx)*B + (Qz*Px - Pz*Qx)*C = Qd*Px - Pd*Qx
			 * 5,6 => 11) (Qx*Py - Px*Qy)*A + (Qz*Py - Pz*Qy)*C = Qd*Py - Pd*Qy
			 * => переход к новым буквам
			 */
			var _Ry = Q.y*P.x - P.y*Q.x, _Rz = Q.z*P.x - P.z*Q.x, _Rd = Qd*P.x - Pd*Q.x;
			var _Sx = Q.x*P.y - P.x*Q.y, _Sz = Q.z*P.y - P.z*Q.y, _Sd = Qd*P.y - Pd*Q.y;
			
			var val = Math.min(Math.abs(_Ry), Math.abs(_Sx));
			
			if (val > value) {
				var Ry = _Ry, Rz = _Rz, Rd = _Rd;
				var Sx = _Sx, Sz = _Sz, Sd = _Sd;
				mapi = i+1;
				value = val;
			};
		}
		for (var i = 0; i < mapi; i++){
			P.carousel();
			Q.carousel();
		}

		if (value < 1e-4)
			console.log('twoPlanesAndSphere(): error');
		
		for (var i = 0; i < mapi; i++){
			P.carousel();
			Q.carousel();
		}
		
		/**
		 * 12)        Ry*B + Rz*C = Rd
		 * 13) Sx*A +      + Sz*C = Sd
		 * +4)  A*A +  B*B +  C*C = 1
		 */
		var Ry2 = Ry*Ry, Sx2 = Sx*Sx, Ry2Sx2 = Sx2*Ry2;
		var Sz2 = Sz*Sz, Rz2 = Rz*Rz;
		/**
		 * 12 =>    14) B = (Rd - Rz*C) / Ry
		 * 13 =>    15) A = (Sd - Sz*C) / Sx
		 * 12,13,4=>16) Ry2*(Sd - Sz*C)^2 + Sx2*(Rd - Rz*C)^2 + Ry2Sx2*C^2 = Ry2Sx2
		 * 16 => 17) (Ry2*Sz2 + Sx2*Rz2 + Ry2Sx2)*C^2 - 2*(Ry2*Sd*Sz + Sx2*Rd*Rz)*C + (Ry2*Sd^2 + Sx2*Rd^2 - Ry2Sx2) = 0
		 */
		var a = Ry2*Sz2 + Sx2*Rz2 + Ry2Sx2, b = -2*(Ry2*Sd*Sz + Sx2*Rd*Rz), c = Ry2*Sd*Sd + Sx2*Rd*Rd - Ry2Sx2;
		var d = b*b/4 - a*c;
		
		if (d < -1e-16)
			return [];
		else if (d < 1e-16)
			d = 0;
		
		d = Math.sqrt(d);
		//console.log(d);
		var sols = d ? [(-b/2 - d)/a, (-b/2 + d)/a] : [(-b/2)/a];
		
		if (sols.length != 2)
			console.log('sols.length=' + sols.length);
		
		//console.log([(-b/2 - d)/a, (-b/2 + d)/a]);
		// var lineNormal = Vector.crossProduct(
				// pp[0].subtract(pp[0].center || Vector(0)),
				// pp[1].subtract(pp[1].center || Vector(0)));
		for (var i = 0; i < sols.length; i++) {
			var C = sols[i],
			    A = (Sd - Sz*C) / Sx, // 15)
				B = (Rd - Rz*C) / Ry, // 14)
				n = new Vector(A, B, C);
			// debug
			n.mapi = mapi;
			n.sols = sols;
			// крутим обратно (через вперед)))
			for(var j = mapi; j < 3; j++) {
				n.carousel();
			}
			sols[i] = n;
		}
		return sols;
	}
};

//##############################################################################

Orientation =
Metrics.Orientation = function() {
	this.right = new Metrics.Vector(1, 0, 0);
	this.up = new Metrics.Vector(0, 1, 0);
	this.forward = new Metrics.Vector(0, 0, 1);
};

//using("Metrics.Orientation");

	Metrics.Orientation.prototype.clone = function() {
		var clone = new Metrics.Orientation();
		clone.right = this.right.clone();
		clone.up = this.up.clone();
		clone.forward = this.forward.clone();
		return clone;
	}
	
	Metrics.Orientation.prototype.translateVector = function(v) {
		var
			x = this.right.x * v.x + this.up.x * v.y + this.forward.x * v.z,
			y = this.right.y * v.x + this.up.y * v.y + this.forward.y * v.z,
			z = this.right.z * v.x + this.up.z * v.y + this.forward.z * v.z;
		if (isNaN(x) || isNaN(y) || isNaN(z))
			//alert('Orientation'+this+'.translateVector('+v+'): NaN result ('+x+','+y+','+z+')');
			//alert('x = '+this.right.x+' * '+v.x+' + '+this.up.x+' * '+v.y+' + '+this.forward.x+' * '+v.z);
			//alert('v='+v+', v.x='+v.x+' , v.y='+v.y+' , v.z='+v.z);
			{
				var rep=[];
				for (var i in v)
					rep[rep.length] = i;
				error.error.error.error
			}
		
		return new Metrics.Vector(
			//this.right.x	 * v.x + this.right.y	 * v.y + this.right.z	 * v.z,
			//this.up.x			* v.x + this.up.y			* v.y + this.up.z			* v.z,
			//this.forward.x * v.x + this.forward.y * v.y + this.forward.z * v.z
			x, y, z
		);
	};

	Metrics.Orientation.prototype.rotate = function(angle, axis) {
		this.right = Metrics.Vector.rotate(this.right, angle, axis).normalize();
		this.up = Metrics.Vector.rotate(this.up, angle, axis).normalize();
		this.forward = Metrics.Vector.rotate(this.forward, angle, axis).normalize();
		return this;
	};

	Metrics.Orientation.prototype.rotateFrom = function(vector1, vector2) {
		vector1 = vector1.normalize();
		vector2 = vector2.normalize();
		axis = Vector.crossProduct(vector1, vector2);
		var l12 = Vector.subtract(vector1, vector2).length();
		if (l12 < 0.0001) return false;
		axis.normalize();
		
		var alpha = (Math.PI - Math.atan2(axis.y, axis.z)); // -patched
		axis = Vector.rotate(axis, alpha, 'x');
		var betta = (Math.PI - Math.atan2(axis.x, axis.z));
		var gamma = Math.acos((2 - l12*l12)/2);
		
		this.rotate(alpha, 'x');
		this.rotate(betta, 'y');
		this.rotate(gamma/1.4142, 'z');
		this.rotate(-betta, 'y');
		this.rotate(-alpha, 'x');
		
		return true;
	};
	
	Metrics.Orientation.prototype.toString = function() {
		return "(" + this.right + ", " + this.up + ", " + this.forward + ")";
	};
//##############################################################################

Quat =
Metrics.Quat = function(w, x, y, z) {
	if (arguments.length == 4) {
		this.w = w;
		this.x = x;
		this.y = y;
		this.z = z;
	} else {
		this.w = 1;
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
};

//using("Metrics.Quat");

	Metrics.Quat.prototype.clone = function() {
		return new Metrics.Quat(this.w, this.x, this.y, this.z);
	};

	Metrics.Quat.prototype.normalize = function() {
		var length = this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
		
		if (Math.abs(length - 1) > 0.001) {
			length = Math.sqrt(length);
			
			this.w /= length;
			this.x /= length;
			this.y /= length;
			this.z /= length;
		}
	};

	Metrics.Quat.prototype.translateVector = function(v) {
		var xx = 2 * this.x * this.x;
		var yy = 2 * this.y * this.y;
		var zz = 2 * this.z * this.z;

		var xw = 2 * this.x * this.w;
		var xy = 2 * this.x * this.y;
		var xz = 2 * this.x * this.z;

		var yw = 2 * this.y * this.w;
		var yz = 2 * this.y * this.z;
		
		var zw = 2 * this.z * this.w;

		return new Metrics.Vector(
			v.x * (1 - yy - zz) + v.y * (xy + zw)		 + v.z * (xz - yw),
			v.x * (xy - zw)		 + v.y * (1 - xx - zz) + v.z * (yz + xw),
			v.x * (xz + yw)		 + v.y * (yz - xw)		 + v.z * (1 - xx - yy)
		);
	};

	Metrics.Quat.multiply = function(q1, q2) {
		var result = new Quat(
			q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
			q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
			q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
			q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w
		);
		
		result.normalize();
		
		return result;
	};

	Metrics.Quat.fromAxisRotation = function(axisVector, angle) {
		var sinAngle = Math.sin(angle / 2);

		return new Metrics.Quat(
			Math.cos(angle / 2),
			axisVector.x * sinAngle,
			axisVector.y * sinAngle,
			axisVector.z * sinAngle
		);
	};

	Metrics.Quat.rotate = function(quat, axisVector, angle) {
		return Metrics.Quat.multiply(Metrics.Quat.fromAxisRotation(axisVector, angle), quat);
	};

//##############################################################################

Rectangle =
Metrics.Rectangle = function(pos, dims) {
	this.pos = pos.clone();
	this.dims = dims.clone();
};

//using("Metrics.Rectangle");

	Metrics.Rectangle.prototype.clone = function() {
		return new Metrics.Rectangle(this.pos, this.dims);
	};

	Metrics.Rectangle.prototype.getPos = function() {
		return this.pos.clone();
	};

	Metrics.Rectangle.prototype.getDims = function() {
		return this.dims.clone();
	};

	Metrics.Rectangle.prototype.getTopLeft = function() {
		return this.pos.clone();
	};

	Metrics.Rectangle.prototype.getTopRight = function() {
		return new Metrics.Vector(this.pos.x + this.dims.x - 1, this.pos.y);
	};

	Metrics.Rectangle.prototype.getBottomLeft = function() {
		return new Metrics.Vector(this.pos.x, this.pos.y + this.dims.y - 1);
	};

	Metrics.Rectangle.prototype.getBottomRight = function() {
		return new Metrics.Vector(this.pos.x + this.dims.x - 1, this.pos.y + this.dims.y - 1);
	};

	Metrics.Rectangle.prototype.overlaps = function(rect) {
		return (this.pos.x + this.dims.x > rect.pos.x) &&
					 (this.pos.y + this.dims.y > rect.pos.y) &&
					 (rect.pos.x + rect.dims.x > this.pos.x) &&
					 (rect.pos.y + rect.dims.y > this.pos.y);
	};

	Metrics.Rectangle.prototype.containsPoint = function(point) {
		return point.x >= this.pos.x && point.x + this.pos.x < this.dims.x &&
					 point.y >= this.pos.y && point.y + this.pos.y < this.dims.y;
	};
	
	Metrics.Rectangle.prototype.containsRect = function(rect) {
		return rect.pos.x >= this.pos.x && rect.pos.x + rect.dims.x <= this.pos.x + this.dims.x &&
					 rect.pos.y >= this.pos.y && rect.pos.y + rect.dims.y <= this.pos.y + this.dims.y;
	};
	
	Metrics.Rectangle.prototype.clipPoint = function(point) {
		var result = point.clone();
		
		if (result.x < this.pos.x) {
			result.x = this.pos.x;
		} else if (result.x >= this.pos.x + this.dims.x) {
			result.x = this.pos.x + this.dims.x - 1;
		}
	
		if (result.y < this.pos.y) {
			result.y = this.pos.y;
		} else if (result.y >= this.pos.y + this.dims.y) {
			result.y = this.pos.y + this.dims.y - 1;
		}
		
		return result;
	};
	
	Metrics.Rectangle.prototype.clipRect = function(rect) {
		var x = Math.max(this.pos.x, rect.pos.x);
		var y = Math.max(this.pos.y, rect.pos.y);
		
		var w = Math.min(this.pos.x + this.dims.x, rect.pos.x + rect.dims.x) - x;
		var h = Math.min(this.pos.y + this.dims.y, rect.pos.y + rect.dims.y) - y;
		
		if (w > 0 && h > 0) {
			return new Rectangle(new Vector(x, y), new Vector(w, h));
		} else {
			return null;
		}
	};

	Metrics.Rectangle.prototype.toString = function() {
		return this.pos + ", " + this.dims;
	};

//##############################################################################

Metrics.getViewportWidth = function(win) {
	win = win || self;

	if (win.innerWidth) {
		// all except IE
		return win.innerWidth;
	}

	if (win.document.documentElement && win.document.documentElement.clientWidth) {
		// IE6 strict
		return Math.min(win.document.documentElement.clientWidth, win.document.body.clientWidth);
	}
	
	// other IE
	return win.document.body.clientWidth;
};

Metrics.getViewportHeight = function(win) {
	win = win || self;

	if (win.innerHeight) {
		// all except IE
		return win.innerHeight;
	}

	if (win.document.documentElement && win.document.documentElement.clientHeight) {
		// IE6 strict
		return Math.min(win.document.documentElement.clientHeight, win.document.body.clientHeight);
	}
	
	// other IE
	return win.document.body.clientHeight;
};

Metrics.getViewportDims = function(win) {
	win = win || self;
	var width, height;

	if (win.innerWidth) {
		width = win.innerWidth;
		height = win.innerHeight;
	} else if (win.document.documentElement && win.document.documentElement.clientWidth) {
		// IE6 strict
		if (win.document.documentElement.clientWidth < win.document.body.clientWidth) {
			width = win.document.documentElement.clientWidth;
			height = win.document.documentElement.clientHeight;
		} else {
			width = win.document.body.clientWidth;
			height = win.document.body.clientHeight;
		}
	} else {
		// other IE
		width = win.document.body.clientWidth;
		height = win.document.body.clientHeight;
	}
	
	return new Metrics.Vector(width, height);
};

Metrics.getViewportTop = function(win) {
	win = win || self;

	if (win.pageYOffset !== undefined) {
		return win.pageYOffset;
	}
	
	if (win.document.documentElement && win.document.documentElement.scrollTop) {
		return win.document.documentElement.scrollTop;
	}
	
	return win.document.body.scrollTop;
};

Metrics.getViewportLeft = function(win) {
	win = win || self;

	if (win.pageXOffset !== undefined) {
		return win.pageXOffset;
	}
	
	if (win.document.documentElement && win.document.documentElement.scrollLeft) {
		return win.document.documentElement.scrollLeft;
	}
	
	return win.document.body.scrollLeft;
};

Metrics.getViewportPos = function(win) {
	win = win || self;
	var x, y;

	if (win.pageYOffset !== undefined) {
		x = win.pageXOffset;
		y = win.pageYOffset;
	} else if (win.document.documentElement && win.document.documentElement.scrollTop) {
		x = win.document.documentElement.scrollLeft;
		y = win.document.documentElement.scrollTop;
	} else {
		x = win.document.body.scrollLeft;
		y = win.document.body.scrollTop;
	}
	
	return new Metrics.Vector(x, y);
};

Metrics.getViewportRect = function(win) {
	return new Metrics.Rectangle(Metrics.getViewportPos(win), Metrics.getViewportDims(win));
};

Metrics.getDocumentWidth = function(win) {
	win = win || self;
	
	return Math.max(win.document.body.scrollWidth, win.document.offsetWidth);
};

Metrics.getDocumentHeight = function(win) {
	win = win || self;
	
	return Math.max(win.document.body.scrollHeight, win.document.offsetHeight);
};

Metrics.getDocumentDims = function(win) {
	win = win || self;
	var width, height;
	
	if (win.document.body.scrollHeight > win.document.body.offsetHeight) {
		width = win.document.body.scrollWidth;
		height = win.document.body.scrollHeight;
	} else {
		width = win.document.body.offsetWidth;
		height = win.document.body.offsetHeight;
	}
	
	return new Metrics.Vector(width, height);
};

Metrics.getWidth = function(node) {
	if (node.offsetWidth !== undefined) {
		return node.offsetWidth;
	} else if (node.clientWidth !== undefined) {
		return node.clientWidth;
	} else if (node.width !== undefined) {
		return node.width;
	} else {
		throw "Metrics.getWidth doesn't work in this browser";
	}
};

Metrics.getHeight = function(node) {
	if (node.offsetHeight !== undefined) {
		return node.offsetHeight;
	} else if (node.clientHeight !== undefined) {
		return node.clientHeight;
	} else if (node.height !== undefined) {
		return node.height;
	} else {
		throw "Metrics.getHeight doesn't work in this browser";
	}
};

Metrics.getDims = function(node) {
	var width, height;
	
	if (node.offsetWidth !== undefined) {
		width = node.offsetWidth;
		height = node.offsetHeight;
	} else if (node.clientWidth !== undefined) {
		width = node.clientWidth;
		height = node.clientHeight;
	} else if (node.width !== undefined) {
		width = node.width;
		height = node.height;
	} else {
		throw "Metrics.getDims doesn't work in this browser";
	}
	
	return new Metrics.Vector(width, height);
};

Metrics.setDims = function(node, dims) {
	node.style.width = dims.x + "px";
	node.style.height = dims.y + "px";
	
	var adjustment = Vector.subtract(dims, Metrics.getDims(node));
	
	if (!adjustment.isZero()) {
		dims = Vector.add(dims, adjustment);

		node.style.width = dims.x + "px";
		node.style.height = dims.y + "px";
	}
};

Metrics.getInnerWidth = function(node) {
	if (node.clientWidth !== undefined) {
		return node.clientWidth;
	} else if (node.width !== undefined) {
		return node.width;
	} else {
		throw "Metrics.getInnerWidth doesn't work in this browser";
	}
};

Metrics.getInnerHeight = function(node) {
	if (node.clientHeight !== undefined) {
		return node.clientHeight;
	} else if (node.height !== undefined) {
		return node.height;
	} else {
		throw "Metrics.getInnerHeight doesn't work in this browser";
	}
};

Metrics.getInnerDims = function(node) {
	var width, height;
	
	if (node.clientWidth !== undefined) {
		width = node.clientWidth;
		height = node.clientHeight;
	} else if (node.width !== undefined) {
		width = node.width;
		height = node.height;
	} else {
		throw "Metrics.getInnerDims doesn't work in this browser";
	}
	
	return new Metrics.Vector(width, height);
};

Metrics.getOffsetLeft = function(node) {
	return node.offsetLeft;
};

Metrics.getOffsetTop = function(node) {
	return node.offsetTop;
};

Metrics.getOffsetPos = function(node) {
	return new Metrics.Vector(node.offsetLeft, node.offsetTop);
};

Metrics.getOffsetRect = function(node) {
	return new Metrics.Rectangle(Metrics.getOffsetPos(node), Metrics.getDims(node));
};

Metrics.setOffsetPos = function(node, pos) {
	node.style.left = pos.x + "px";
	node.style.top = pos.y + "px";
};

Metrics.setOffsetRect = function(node, rect) {
	Metrics.setOffsetPos(node, rect.pos);
	Metrics.setDims(node, rect.dims);
};

Metrics.getLeft = function(node) {
	var x = 0;
	
	do {
		x += node.offsetLeft;
		node = node.offsetParent;
	} while (node);
	
	return x;
};

Metrics.getTop = function(node) {
	var y = 0;
	
	do {
		y += node.offsetTop;
		node = node.offsetParent;
	} while (node);
	
	return y;
};

Metrics.getPos = function(node) {
	var x = 0;
	var y = 0;
	
	do {
		x += node.offsetLeft;
		y += node.offsetTop;
		node = node.offsetParent;
	} while (node);
	
	return new Metrics.Vector(x, y);
};

Metrics.getRect = function(node) {
	return new Metrics.Rectangle(Metrics.getPos(node), Metrics.getDims(node));
};

Metrics.setPos = function(node, pos) {
	if (node.offsetParent) {
		var offsetPos = Vector.subtract(pos, Metrics.getPos(node.offsetParent));
		Metrics.setOffsetPos(node, offsetPos);
	} else {
		Metrics.setOffsetPos(node, pos);
	}
};

Metrics.setRect = function(node, rect) {
	Metrics.setPos(node, rect.pos);
	Metrics.setDims(node, rect.dims);
};


			/**
 * Figure is an object with properties:
 *   .$points  $([points])
 *   .type     string
 *
 * Vertex, Line, Face and Polygon definition.
 * 
 * @author   popitch@yandex.ru
 */

Figure.DEBUG = false && (location.protocol === 'file:');
Figure.__enum = 0;

function Figure(params) {
	// self as origin
	this.origin = this;

	// origin may be updated here
	$.extend(this, params);
	
	// базовые точки
	this.$points = $(params.$points || params.points ||
		console.log('Figure(): points not present'));
	this.$points.length > 0 ||
		console.log('Figure(): wrong count of points');
	
	if (Figure.DEBUG && this.type && this.$points.length < {vertex: 1, line: 2, face: 3}[this.type]) {
		console.warn(this.type, 'with', this, 'points');
		debugger;
	}
	
	// тип
	this.type = this.type ||
		(this.$points.length < 4 ?
			[null, 'vertex', 'line', 'face'][this.$points.length] : 'polygon');

	this.removed = false;

	this._enum = Figure.__enum++;
	
	this.CuttingLine = _.memoize(this.CuttingLine);
}

Figure.prototype = {
	// поворот точек фигуры вокруг оси
	rotate: function(angle, axis) {
		this.$points.each(function(){
			var v = Vector.rotate(this, angle, axis);
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
		});
		return this;
	},
	
	// возвращает массив примитивов
	primitives: function() {
		return $([this]);
	},
	
	// testing relationship
	testRelationship: function() {
		const figure = this;
		
		// members
		_.each(figure.$primitives, member => {
			// super
			_.each(member.$super, ($supers, supersType) => {
				_.each($supers, supr => {
					_.contains(supr.$sub[member.type], member)
						|| console.error(member, '-> super', supersType, supr, 'has no sub rel');
				});
			});
			
			// sub
			_.each(member.$sub, ($subs, subsType) => {
				_.each($subs, sub => {
					_.contains(sub.$super[member.type], member)
						|| console.error(member, '-> sub', subsType, sub, 'has no super rel');
				});
			});
			
			// test vertex count
			const minPoints = { vertex: 1, line: 2, face: 3 }[member.type];
			
			member.$points.length >= minPoints
				|| console.error(member.$points.length, 'point by', member.type);
			
			member.type === 'vertex' || member.$sub.vertex.length === member.$points.length
				|| console.error('sub vertex', member.$sub.vertex.length, '!==', member.$points.length, 'points');
			
			member.type !== 'face' || member.$sub.vertex.length === member.$sub.line.length
				|| console.error('sub vertex', member.$sub.vertex.length, '!==', member.$sub.line.length, 'sub lines');
			
			member.type === 'face' || member.$super.face.length > 0
				|| console.error(member.type, 'has no super face');
			
			member.type !== 'vertex' || member.$super.line.length >= 2
				|| console.error(member.type, '< 2 super line');
		});
		
		figure.subs('vertex').length === figure.$points.length
			|| console.error('figure points and vertices count must be equals');
		
		_.unique(_.pluck(figure.$points, '_enum')).length === figure.$points.length
			|| console.error('figure points _enum must be unique',
				_.chain(figure.$points).groupBy('_enum').values().filter(a => a.length > 1).flatten().groupBy('_enum').value()
			);
		
		// Euler
		/*
		const Euler = _.countBy(figure.$primitives, 'type');
		
		if (Euler.face + Euler.vertex - Euler.line !== 2) {
			console.warn('Euler test failed with', Euler);
		}
		*/
	},
	
	// @safe (with control relationships)
	// removing primitive
	safeRemoveMember: function(member, removeSuper, debug) {
		const figure = this;
		
		// super
		_.each(member.$super, ($supers, supersType) => {
			_.each($supers, supr => {
				if (false !== removeSuper) {
					figure.safeRemoveMember(supr, removeSuper, false);
				} else {
					// clean sub only
					supr.$sub = _.mapObject(supr.$sub, $subs => {
						return $subs.not([ member ]);
					});
				}
			});
		});
		
		// sub
		_.each(member.$sub, ($subs, subsType) => {
			const removingSubs = [];
			
			_.each($subs, sub => {
				const subSuperByMemberType = sub.$super[member.type]
						= sub.$super[member.type].not([ member ]);
				
				if (0 === subSuperByMemberType.length) {
					removingSubs.push(sub);
				}
			});
			
			_.each(removingSubs, sub => {
				figure.safeRemoveMember(sub, false, false);
			});
		});
		
		// point
		if (member.type === 'vertex') {
			figure.$points = figure.$points.not(member.$points);
		}
		
		Figure.DEBUG && false !== debug
			&& console.warn('* safe remove', member.type, 'with', JSON.stringify(
				_.chain({ "super": member.$super, "sub": member.$sub })
					.mapObject(collect => {
						return _.mapObject(collect, 'length');
					})
			));
		
		this.$primitives = this.$primitives.not([ member ]);
		
		Figure.DEBUG && false !== debug
			&& this.testRelationship();
	},
	
	// @safe (with control relationships)
	// replace line and both line's super faces with new face
	safeRemoveFaceLine: function(line) {
		var linePoints = line.$points.get(),
			lineFaces = line.$super.face.get(),
			newFacePoints;
		
		if (! _.contains(this.$primitives, line)) {
			console.error('line is outbound of figure right now');
		}
		
		_.each(lineFaces, (face, faceIndex) => {
			let facePoints = face.$points.get(),
				anyLinePointIndex = _.findIndex(facePoints, _.contains.bind(_, linePoints));
			
			// roll to any line point placing in begin
			facePoints = facePoints.slice(anyLinePointIndex)
				.concat(facePoints.slice(0, anyLinePointIndex));
			
			let isLastPointFromLine = ! _.contains(linePoints, facePoints[1]);
			
			if (faceIndex === 0) {
				newFacePoints = isLastPointFromLine ? facePoints
					: facePoints.slice(1).concat( facePoints.slice(0, 1) );
			}
			else {
				newFacePoints = newFacePoints.concat(
					isLastPointFromLine ? facePoints.slice(1, -1) : facePoints.slice(2)
				);
			}
		});
		
		if (newFacePoints.length !== _.unique(newFacePoints).length) {
			console.error('not unique face points');
		}
		
		// new face
		const newFace = new Figure({
			type: 'face',
			points: newFacePoints,
			$super: {},
			$sub: {
				line: $(
					_.chain(lineFaces)
						.map(face => face.$sub.line.get())
						.flatten()
						.difference([ line ])
						.value()
				),
				vertex: $(
					_.chain(lineFaces)
						.map(face => face.$sub.vertex.get())
						.flatten()
						.unique()
						.sortBy(function(vertex) {
							return _.indexOf(newFacePoints, vertex.$points[0]);
						})
						.value()
				),
			},
			live: _.any(lineFaces, 'live')
		});
		
		// set convex protos
		newFace.protoConvexFaces = newFace.isFaceConvex() ? [ newFace ] :
				lineFaces.flatMap(face => face.protoConvexFaces || [ face ]);
		
		// test assertions
		if (newFacePoints.length !== newFace.$sub.vertex.length) {
			console.error('vertices and points has different size');
		}
		if (newFacePoints.length !== newFace.$sub.line.length) {
			console.error('lines and points has different size');
		}
		
		// add new face
		this.$primitives.push(newFace);
		
		// add back rels to newFace
		_.chain(newFace.$sub).invoke('get').flatten().each(sub => {
			sub.$super.face.push(newFace);
		});
		
		// safe remove line
		this.safeRemoveMember(line);
		
		Figure.DEBUG && this.testRelationship();
	},
	
	// is polygon convex?
	isFaceConvex: function() {
		const face = this,
			points = face.$points.get();
		
		face.type === 'face' || console.error('isFaceConvex(<not face>)');
		
		var prevPoint = _.last(points);
		const normals = 
			_.map(points, (point, index) => {
				const nextPoint = points[index + 1] || points[0],
					prevSide = Vector.subtract(point, prevPoint),
					side = Vector.subtract(nextPoint, point);
				
				prevPoint = point;
				
				return Vector.crossProduct(prevSide, side);
			})
			.filter(normal => normal.length() > 1e-9);
		
		// all normals look in the same direction
		const isConvex = _.every(_.tail(normals), normal => Vector.dotProduct(normal, normals[0]) > -1e-9);
		
		//console.log(isConvex);
		
		return isConvex;
	},
	
	// @safe (with control relationships)
	// @return error string | sew line Figure
	// removing not needed middle point (vertex) of line
	safeRemoveLineMiddleVertex: function(vertex) {
		const vertexLines = vertex.$super.line,
			vertexSuperFaces = vertex.$super.face;
		
		if (vertexLines.length !== 2) {
			return 'expected 2 super lines, found ' + vertexLines.length;
		}
		
		const vertexPoint = vertex.$points[0];
		
		// test point is middle of two others
		var otherPoints = [],
			dirs = _.map(vertexLines, line => {
				var otherPoint = line.$points[ line.$points[0] === vertexPoint ? 1 : 0 ];
				otherPoints.push(otherPoint);
				return Vector.subtract(otherPoint, vertexPoint);
			}),
			angle = dirs[1].angleWith(dirs[0]);
		
		// point's middle-position detector
		if (Math.abs(angle - Math.PI) < 1e-5) {
			// remove vertex (and both super lines)
			figure.safeRemoveMember(vertex, false, false); // no debug
			figure.safeRemoveMember(vertexLines[0], false, false); 
			figure.safeRemoveMember(vertexLines[1], false, false);
			
			// add new line
			const sewLine = new Figure({
				type: 'line',
				points: otherPoints,
				$super: {
					face: $(vertexSuperFaces)
				},
				$sub: {
					vertex: $(
						_.chain(vertexLines)
							.map(l => l.$sub.vertex.get())
							.flatten()
							.difference([ vertex ])
							.sortBy(function(vertex) {
								return _.indexOf(otherPoints, vertex.$points[0]);
							})
							.value()
					)
				},
				live: true,
				reversible: true
			});
			
			// add back rels to sewLine
			_.each(sewLine.$sub.vertex, sub => {
				sub.$super.line.push(sewLine);
			});
			_.each(sewLine.$super.face, supr => {
				supr.$sub.line.push(sewLine);
				supr.$points = supr.$points.not([ vertexPoint ]);
			});
			
			figure.$primitives.push(sewLine);
		
			Figure.DEBUG
				&& this.testRelationship();
			
			return sewLine; // good
		}
		else {
			return "can't to sew this vertex lines";
		}
	},
	
	/**
	 * Устанавливает отношения (вложенность) примитивов фигуры
	 * @return this
	 */
	relations: function() {
		var $primitives = this.$primitives;
		
		// sub & super
		_.each($primitives, prim => {
			const a = prim.$points;
			
			prim.$sub = {vertex: $([]), line: $([])};
			
			prim.$subsets = $primitives.map(function(pi){
				const b = this.$points;
				
				if (b.length < a.length) {
					for (var i = 0, length = b.length; i < length; i++)
						if (-1 == $.inArray(b[i], a)) {
							return null;
						}
					
					if (!prim.$sub[this.type]) {
						console.warn('!prim.$sub[this.type]');
						return;
					}
					
					prim.$sub[this.type].push(this);
					return this;
				}
				
				return null;
			});
			
			prim.$supersets = $([]);
			prim.$super = {line: $([]), face: $([])};
		});
		
		_.each($primitives, prim => {
			prim.$subsets.each(function(){
				this.$supersets.push(prim);
				this.$super[prim.type].push(prim);
			});
		});
		
		// figure subsets, supersets of root
		this.$subsets = $primitives;
		this.$supersets = null;
		
		// set face vertices to point's order
		this.subs('face').each(function() {
			var face = this;
			
			face.$sub.vertex = $(
				_.sortBy(face.$sub.vertex, function(vertex) {
					return _.indexOf(face.$points, vertex.$points[0]);
				})
			);
		});
		
		// selvage detection
		this.detectSelvage(); // why here?
		
		return this;
	},
	
	// selvage detection
	detectSelvage: function(advAttr) {
		this.$primitives.each(function(){
			this.selvage = false;
		});

		this.$primitives.each(function() {
			if (this.type == 'line' && this.origin === this)
				this.selvage = (1 === this.origin.$super.face.length);
				
				if (this.selvage) {
					this.$subsets.each(function() {
						this.selvage = true;
						
						if (advAttr){
							this[advAttr] = true;
						}
					});
					
					if (advAttr){
						this[advAttr] = true;
					}
				}
		});
		
		return this;
	},
	
	/**
	 * Деление фейсов фигуры (равные хорды)
	 * @return this
	 */
	splitFaces: function(N) {
		N = N || 2;
		var figure = this;
		
		var points = {};
		figure.$points.each(function(i){
			points[this._enum = this._enum || i] = this;
		});
		var $faces = $([]);
		function addFace(a, b, c) {
			$faces.push(new Figure({
				type: 'face',
				$points: $([a, b, c]).map(function(){return points[this]})
			}));
			addLine(a, b);
			addLine(b, c);
			addLine(c, a);
		}
		var lines = {};
		function addLine(a, b) {
			var uniq = [a, b].sort().join('-');
			lines[uniq] = lines[uniq] || new Figure({
				type: 'line',
				$points: $([a, b]).map(function(){return points[this]})
			});
		}
					
		var verts = {}, $splitted = $([]);
		figure.$primitives.each(function(i){
			if (this.type == 'face') {
				var face = this;
				var f = _.pluck(face.$points, '_enum');
				var mini = f.slice(0).sort(function(a,b){return a-b})[0];
				while (f[0] != mini) f.push(f.shift());
				var ai = f[0], bi = f[1], ci = f[2];
				var up = [ai];
				for (var n = 1; n <= N; n++) {
					var lu = [ai, bi, n].join('-'),
						li = verts[lu] || (verts[lu] =
							figure.splitFaces_middlePointEnum(ai, bi, n/N, points));
					var ru = [ai, ci, n].join('-'),
						ri = verts[ru] || (verts[ru] =
							figure.splitFaces_middlePointEnum(ai, ci, n/N, points));
					var down = [], i;
					for (i = 0; i <= n; i++) {
						var mu = (li < ri)? ''+li+'-'+ri+'-'+i : ''+ri+'-'+li+'-'+(n - i);
						var mi = verts[mu]? verts[mu] : (verts[mu] =
							figure.splitFaces_middlePointEnum(li, ri, i/n, points));
						down.push(mi);
					}
					addFace(up[0], down[0], down[1]);
					for (i = 1; i < up.length; i++) {
						addFace(up[i], up[i-1], down[i]);
						addFace(up[i], down[i], down[i+1]);
					}
					up = down;
				}
				$splitted.push(face);
			}
		});
		
		// заливаем новую форму
		figure.$primitives = $faces;
		figure.$points.each(function(){
			figure.$primitives.push(new Figure({
				type: 'vertex',
				points: [this],
				center: this.center
			}));
		});
		for (var i in lines) {
			figure.$primitives.push(lines[i]);
		}
		
		// добавляем преобразование к названию фигуры
		this.type += '.' + 'v(' + N + ')';
		
		return this;
	},
	
	splitFaces_middlePointEnum: function(ai, bi, q, enum2point) {
		if (q == 0) return ai;
		if (q == 1) return bi;
		var a = enum2point[ai], b = enum2point[bi];
		// определение центра кривизны
		var center, selvage = a.center && (center = b.center);
		center = selvage ? center : new Vector();
		/*selvage || (center.radius = 1);*/
		var point = Vector.add(
				Vector.subtract(a, center).scale(1 - q),
				Vector.subtract(b, center).scale(q)
			).normalize()./*scale(center.radius).*/add(center);
		selvage && (point.center = center);
		point._enum = this.$points.length;
		this.$points.push(point);
		enum2point[point._enum] = point;
		return point._enum;
	},
	
	/**
	 * срез фигуры по координате
	 * @return this
	 */
	sliceByAxis: function(axis, partial, filtrate) {
		if (partial == '1' || partial == '1/1') {
			_.each(this.$primitives, function(p) {
				p.live = true;
			});
			return this;
		}
		
		var threshold = 1 - 2 * eval(partial);

		this.$points.each(function() {
			this._remain = 0;
		});

		this.$primitives.each(function() {
			var $pp = this.$points, centroid = 0;

			if ($pp.length >= 3) {
				$.map($pp, function(p) {
					centroid += p[axis];
				});
				centroid /= $pp.length;
				if (Math.abs(centroid - threshold) > 1e-6 && centroid > threshold) {
					$.map($pp, function(p) {
						p._remain = 1;
					});
				}
			}
		});

		this.$primitives = this.$primitives.map(function() {
			var saved = 0;
			this.$points.each(function() {
				saved += this._remain || 0;
			});
			this.live = (saved == this.$points.length);
			return (filtrate === false) || this.live ? this : null;
		});

		this.$points = this.$points.map(function() {
			var live = (filtrate === false) || this._remain;
			delete this._remain;
			return live ? this : null
		});
		this.points = this.$points.get();

		return this;
	},
	
	/**
	 * срез фигуры по остающейся доле фейсов в результате
	 */
	sliceByFraction: function(startVertex, fraction, filtrate){
		if (fraction == '1' || fraction == '1/1') {
			_.each(this.$primitives, function(p) {
				p.live = true;
			});
			return this;
		}
		
		fraction = eval(fraction);
		
		var $all = this.$primitives;
		var facesTotal = this.subs('face').length;
		var $wave = startVertex.$super.face;
		
		for (var faces = 0; faces / facesTotal < fraction; ) {
			$wave.each(function(){
				$(this).add(this.$sub.line).add(this.$sub.vertex).each(function(){
					this.live = true;
				});
				this.$sub.line.each(function(){
					this.$super.face.each(function(){
						this._ready = true;
					});
					this.$points.each(function(){
						this.live = true;
					});
				});
				faces++;
			});
			$wave = $all.filter(function(){
				return this._ready && !this.live;
			});
		}

		// live if live origin
		$all.each(function() {
			this.live = this.origin.live;
			delete this._ready;
		});

		if (filtrate !== false) {
			this.$primitives = $all.filter(function(){
				return this.live;
			});

			this.$points = this.$points.filter(function(){
				var leave = this.live;
				delete this.live;
				return leave;
			});
			this.points = this.$points.get();
		}
		
		return this;
	},
	
	/**
	 * Making a (inscribed) fulleren
	 */
	fulleren: function(){
		var pointsBeforeLength = this.$points.length;
		var fig = this,
			newVertexByLine = {},
			fullerPrimitives = [],
			nil = Vector(0);
		
		function divideLine(near, far, line){/*
			var vertex;

			if (!near.H) {
				near.H = _.reduce(near.$super.line, function(H, line) {
					var l = Vector.distance(line.$points[0], line.$points[1]);
					line.H = l * l / 2;
					return H + line.H;
				}, 0);
				near.H = near.H / near.$super.line.length; *//*Math.pow(near.H, 1 / near.$super.line.length);*//*
			}
			var q = near.H / line.H / 3; // 1/3;

			var mid = near.$points[0].clone().scale(1 - q).add(far.$points[0].clone().scale(q));
			//mid.scale(1 / mid.length()).add(line.center);*/
			var Near = near, vertex;
			near = near.$points[0].clone().subtract(near.center);
			far = far.$points[0].clone().subtract(far.center);

			//var alfa = near.angleWith(far);
			var q = 1/3;//0.5 - Math.tan(alfa / 6) * ( 0.5 / Math.tan(alfa / 2) );
			var mid = Vector.add(near.scale(1 - q), far.scale(q));
			mid.scale(1 / mid.length()).add(line.center);
			
			mid.center = line.center;
			mid.selvage = line.selvage;
			mid.sliced = line.sliced;
			
			// вершины рождаются здесь
			mid._enum = fig.$points.length - pointsBeforeLength;
			fig.$points.push(mid);
			fullerPrimitives.push(vertex = new Figure({
				type: 'vertex',
				points: [mid],
				center: near.center || nil,
				selvage: near.selvage,
				sliced: near.sliced
			}));
			return vertex;
		}
		
		// вершины образуются из ребер, по две на каждое
		fig.$primitives.each(function(){
			if (this.type === 'line') {
				var le = this._enum, vv = this.$sub.vertex;
				var vA = divideLine(vv[0], vv[1], this);
				var vB = divideLine(vv[1], vv[0], this);
				newVertexByLine[le] = [vA, vB];
				
				// ребра-остатки (середина базовых), половина всех ребер
				fullerPrimitives.push(new Figure({
					type: 'line',
					points: [vA.$points[0], vB.$points[0]],
					center: this.center,
					selvage: this.selvage,
					sliced: this.sliced/*,
					baseLineLength: Math.round(Vector.distance(vv[0].$points[0], vv[1].$points[0]) * 1e-6)*/
				}));
			}
		});
		
		// ищет в фейсе новые вершины, образованные от заданных, возвращает в том же порядке
		function getNewPoints(p0, p1, face){
			var ret;
			face.$sub.line.each(function(){
				var vv = this.$sub.vertex;
				var nvv = newVertexByLine[this._enum];
				ret = ret ||
					( vv[0].$points[0] == p0 && vv[1].$points[0] == p1 && nvv ) ||
					( vv[0].$points[0] == p1 && vv[1].$points[0] == p0 && [nvv[1], nvv[0]] );
			});
			return [ ret[0].$points[0], ret[1].$points[0] ];
		}
		
		// для вершинных фейсов
		var newVertexesByVertex = {};
		
		// грани и половина ребер
		fig.$primitives.each(function(){
			if (this.type == 'face'){
				var face = this;
				var p0 = face.$points[1], p1 = face.$points[2];
				var v6 = [];
				face.$points.each(function(){
					var p2 = this;
					/*var baseLine = face.$sub.line.filter(function() {
							return (this.$points[0] === p0 && this.$points[1] === p2) ||
								(this.$points[1] === p0 && this.$points[0] === p2);
						})[ 0 ];*/
					
					// точки нового фейса-остатка
					var nvv01 = getNewPoints(p0, p1, face);
					v6.push(nvv01[0]);
					v6.push(nvv01[1]);
					
					// ребра-скосы (образованные срезанием вершины), половина всех ребер
					var nvv12 = getNewPoints(p1, p2, face);
					fullerPrimitives.push(new Figure({
						type: 'line',
						points: [nvv01[1], nvv12[0]]/*,
						baseLineLength: Math.round(Vector.distance(baseLine.$points[0], baseLine.$points[1]) * 1e+6)*/
					}));
					
					// для вершинных фейсов
					newVertexesByVertex[p1._enum] = newVertexesByVertex[p1._enum] || {};
					newVertexesByVertex[p1._enum][p2._enum] = {
						point: nvv12[0],
						next: p0._enum
					};
					
					p0 = p1;
					p1 = p2;
				});
				
				if (v6.length != 6)
					console.log('v6.length != 6');
				
				// фейсы-остатки (середина фейсов-предшественников), столько же сколько было фейсов
				fullerPrimitives.push(new Figure({
					type: 'face',
					points: v6
				}));
			}
		});
		
		// фейсы-скосы (при вершинах, кроме крайних пока)
		fig.$primitives.each(function(){
			if (this.type == 'vertex' && !this.selvage){
				var aster = newVertexesByVertex[this.$points[0]._enum],
					c = 0;
				for (var i in aster) c++;
				if (c >= 5) {
					var last = i, pp = [];
					do {
						pp.push(aster[i].point);
						i = aster[i].next;
					} while (i != last);
					
					if (pp.length < 5)
						console.log('face points.length < 5');
					
					// фейсы-скосы (при вершинах), столько же сколько было вершин
					fullerPrimitives.push(new Figure({
						type: 'face',
						points: pp
					}));
				}
			}
		});
		
		this.$primitives = $(fullerPrimitives);
		this.$points = $( [].slice.call(this.$points, pointsBeforeLength) );

		/*Figure.equalizeLineGroups(
			_.groupBy(_.where(this.$primitives, { type: 'line' }), 'baseLineLength')
		);*/
		
		return this;
	},

	/**
	 * @required prepareUnify() before
	 */
	outerFulleren: function() {
		var prevVertexes = this.subs('vertex'),
			prevFaces = this.subs('face'),
			nextLines = {},
			center = new Vector; // todo: remove center from project

		const nextVertexes = _.map(prevFaces, function(face, faceIndex) {
			face.newPoint = Solutions.planesCross.apply(this,
				_.map(face.$points, function(point) {
					return new Plane(point, point);
				})
			);
			var nextVertex = new Figure({
				type: 'vertex',
				points: [face.newPoint],
				center: center
			});

			face.newPoint._enum = faceIndex; // faceIndex === future point index    //nextVertex._enum;

			return nextVertex;
		});

		var nextFaces = _.map(prevVertexes, function(vertex) {
			var points = _.compact(_.map(vertex.$scheme, function(mem) {
				return mem.isFace && mem.source.newPoint;
			}));

			var prevPoint = _.last(points);
			_.each(points, function(point) {
				var lineIndex = [point._enum, prevPoint._enum].sort().join();
				nextLines[lineIndex] = nextLines[lineIndex] ||
					new Figure({
						type: 'line',
						points: [prevPoint, point]
					});
				prevPoint = point;
			});

			return new Figure({
				type: 'face',
				points: points,
				//_protoPoint: vertex.$points[0]
			});
		});

		this.$primitives = $( nextFaces.concat(_.values(nextLines)).concat(nextVertexes) );
		this.$points = $( _.pluck(_.pluck(nextVertexes, '$points'), '0') );

		return this;
	},
	
	// adv relations
	prepareUnify: function() {
		// order line/face/line/face/.. around vertex
		this.subs('vertex').each(function(){
			var vertex = this;
			var point = vertex.$points[0];
			var chain = [];
			
			// список звеньев цепочки, с указанием остальных составляющих звено точек
			vertex.$supersets.each(function(i){
				var pp = this.$points.get();
				var pos = $.inArray(point, pp);
				var others = pp.slice(pos + 1).concat( pp.slice(0, pos) );
				var isFace = (others.length > 1);
				chain[i] = {
					i: i,
					source: this,
					others: others,
					isFace: isFace
				};
				if (isFace)
					chain[i].faceAngle = Vector.angle(others[0], point, others[others.length - 1]);
				else {// line
					chain[i].length = point.distance(others[0]);
					if (chain[i].length < 1e-6)
						console.log('rib length is nil');
				}
			});
			var iLost = undefined, countNext = 0, countLost = 0;
			
			// каждому звену прописывается индекс следующего
			vertex.$supersets.each(function(i){
				var iOthers = chain[i].others;
				var iFace = iOthers.length > 1;
				
				var found = vertex.$supersets.map(function(j){
					var jOthers = chain[j].others;
					return (jOthers.length > 1 ^ iOthers.length > 1) ? (
						iOthers[iOthers.length - 1] === jOthers[0] ? ++countNext && j : null
					) : null;
				});
				
				if (found.length > 1)
					console.log('gt one next chain nodes this');
				
				var h = found[0];
				if (h !== undefined) {
					chain[i]._next = h;
				} else {
					iLost = i;
					++countLost;
				}
			});
			
			// asserts
			if (countNext > vertex.$supersets.length)
				console.log(countNext + ' countNext > vertex.$supersets.length');
			if ((countNext == vertex.$supersets.length) == vertex.selvage)
				console.log('(countNext == vertex.$supersets.length) == vertex.selvage');
			if ((countNext == vertex.$supersets.length - 1) != vertex.selvage)
				console.log('(countNext == vertex.$supersets.length - 1) != vertex.selvage');
			if (countNext < vertex.$supersets.length - 1)
				console.log('countNext < vertex.$supersets.length - 1');
			
			if (countLost > 1)
				console.log({countLost: countLost, countNext: countNext, chain: chain});
			(iLost !== undefined) === vertex.selvage ||
				console.log('selvage is not salve: ' + iLost + ', ' + countLost);
			(iLost !== undefined) === (countLost == 1) ||
				console.log('selvage is not salve2: ' + iLost + ', ' + countLost);
			
			// break the chain
			var sortChains = [];
			$(chain).each(function(i){
				var start = this, curr = this;
				for (sortChains[i] = [];
					curr && sortChains[i].push(curr) && ! _.contains(sortChains[i], curr = chain[curr._next]);
				);
			});
			sortChains.sort(function(a, b){
				if (b.length - a.length)
					return b.length - a.length;
				for (var i = 0, l = a.length, d; i < l; i++) {
					d = (b[i].faceAngle - a[i].faceAngle) || (b[i].length - a[i].length);
					if (Math.abs(d) > 1e-3)
						return d;
				}
				return 0;
			});
			
			// сохраняем упорядоченный, выбранный список надмножеств
			vertex.$scheme = $(sortChains[0]);
		});
		
		// для линий: вершины, дополняющие соседние фейсы
		this.subs('line').each(function(){
			var line = this;
			line.$vertexes = line.$sub.vertex;
			line.$adjoinVertexes = $([]);
			line.$adjoinPoints = $([]);
			line.$super.face.each(function(){
				this.$sub.vertex.each(function(){
					if (-1 == $.inArray(this, line.$vertexes))
						line.$adjoinVertexes.push(this);
						line.$adjoinPoints.push(this.$points[0]);
				});
			});
			
			// для линий: для каждой вершины список линий соседних к линии-сабжу
			line.$nearLinesByVertex = $([]);
			line.$vertexes.each(function(){
				var vertex = this,
					point = this.$points[0],
					cont = $([]);
				vertex.$super.line.each(function(){
					if (this === line) return;
					if (this.$points[0] === point && -1 != $.inArray(this.$points[1], line.$adjoinPoints))
						cont.push(this);
					if (this.$points[1] === point && -1 != $.inArray(this.$points[0], line.$adjoinPoints))
						cont.push(this);
				});
				line.$nearLinesByVertex.push(cont);
			});
			
			if (line.$nearLinesByVertex.length != 2)
				console.log('line.$nearLinesByVertex.length != 2');
			else {
				if (-1 == $.inArray(line.$nearLinesByVertex[0].length, [1, 2]))
					console.log('line.$nearLinesByVertex.length[0].length: ' + line.$nearLinesByVertex[0].length);
				if (-1 == $.inArray(line.$nearLinesByVertex[1].length, [1, 2]))
					console.log('line.$nearLinesByVertex.length[1].length: ' + line.$nearLinesByVertex[1].length);
			}
		});
		
		// фейсам выстроим sub- отрезки и вершины по-порядку
		this.subs('face').each(function(){
			const face = this,
				facePoints = face.$points.get();
			/*
			var $vv = this.$sub.vertex;
			var mid = new Vector;
			$vv.each(function(){ mid.add(this.$points[0]); });
			mid.scale(1 / $vv.length);
			
			function orderedVertexes(line){
				var $vv = line.$sub.vertex;
				var dir = Vector.crossProduct(
						Vector.subtract($vv[0].$points[0], mid),
						Vector.subtract($vv[1].$points[0], mid)
					);
				return Vector.dotProduct(dir, mid) > 0 ? $vv : $([$vv[1], $vv[0]]);
			}
			
			var order = {}, i;
			this.$sub.line.each(function(){
				var vv = orderedVertexes(this);
				order[vv[0]._enum] = {
					line: this,
					vv: vv,
					next: i = vv[1]._enum
				};
			});
			
			var vertexes = [];
			var lines = [];
			
			try {
				for (var end = i, j = 0;
					order[i] &&
					lines.push(order[i].line) &&
					vertexes.push(order[i].vv[0]) &&
					order[i].next != end;
				i = order[i].next, j++) {
					if (j > 99) {
						throw ['endless order', order];
					}
				}
				
				if (! order[i]) {
					throw ['breaked with no order[by i]', i, 'order', order];
				}
				
				face.$sub.line = $(lines);
				face.$sub.vertex = $(vertexes);
			} catch(e) {
				console.warn.apply(console,
					this._hasUnifyError = _.flatten(['prepareUnify()', e, 'face', face._enum, face])
				);
			*/
			
				// then... order by face points
				face.$sub.vertex = $(
					_.sortBy(face.$sub.vertex.get(), vertex => facePoints.indexOf(vertex.$points[0]))
				);
				face.$sub.line = $(
					_.sortBy(face.$sub.line.get(), line => {
						const pointIndex = line.$points.get().map(point => facePoints.indexOf(point)).sort();
						
						if (pointIndex[0] === 0 && pointIndex[1] === facePoints.length - 1) {
							return pointIndex[1];
						}
						else if (pointIndex[0] + 1 === pointIndex[1]) {
							return pointIndex[0];
						}
						else {
							//throw ['wrong points order with line', line, 'by face', face];
							console.error('wrong points order with line', line, 'by face', face);
						}
					})
				);
				/*
				console.log(
					'e.g.', face.$sub.line.get().map(line => line.$sub.vertex.get().map(v => v.$points[0]._enum).join())
				);
			/*
			}
			*/
		});
		
		return this;
	},
	
	// pseudo-self-remove the member
	remove: function(){
		if (this.removed) return [];

		var removed = [this];

		this.removed = true;

		this.$supersets.each(function(){
			removed = removed.concat(this.remove());
		});
		this.$subsets.each(function(){
			var superPresent = this.$supersets.filter(function(){
					return !this.removed;
				});
			if (!superPresent.length)
				removed = removed.concat(this.remove());
		});

		return removed;
	},
	
	// restore pseudo-removed member
	restore: function(){
		if (!this.removed) return [];

		var restored = [this];

		this.removed = false;

		this.$subsets.each(function(){
			restored = restored.concat(this.restore());
		});

		return restored;
	},

    separate: function() {
        if (this.type !== 'line') {
            console.error('line expected');
        }

        this.separator = true;

        return [this];
    },

	connect: function() {
        if (this.type !== 'line') {
            console.error('line expected');
        }

        this.separator = false;

        return [this];
	},

	subs: function(type) {
		return type ? this.$subsets.filter(function(){
			return this.type === type;
		}) : this.$subsets;
	},
	
	supers: function(type) {
		return type? this.$supersets.filter(function(){
			return this.type === type;
		}) : this.$supersets;
	},

	/**
	 * Приземление кромки фигуры
	 */
	groundSliced: function(axis){
		var points = $.map(this.$primitives, function(p) {
				if (p.type !== 'vertex' || !p.live)
					return null;

				return _.some(p.$supersets, function(s) {return !s.live }) ? p.$points[0] : null;
			});
		
		var aval = false;

		// find minimal-absolute value by axis
		_.each(points, function(p) {
			aval = aval && Math.abs(aval) < Math.abs(p[axis]) ? aval : p[axis];
		});
		
		_.each(points, function(p) {
			if (Math.abs(p[axis] - aval) > 1e-6){
				p[axis] = aval;
				var len = p.length(), q = Math.sqrt( (1 - aval*aval) / (len*len - aval*aval) );
				
				if (axis != 'x') p.x *= q;
				if (axis != 'y') p.y *= q;
				if (axis != 'z') p.z *= q;
			}
		});
	},
	
	/**
	 * Унификация примитивов, поиск одинаковых
	 * @return Object stat
	 *
	 * $todo insert product eacher
	 */
	unify: function() {
		var result = {total: {}, count:{}};

		// для некоторых соединений, перед унификацией "крайних" узлов
		// требуется аккумулятор для накопление инфы об остальных узлах
		var accum = {};
		
		// сначала те, что не на краю,
		// и в порядке: коннекторы, ребра, грани
		var hashOrder = _.where(this.$primitives, { removed: false });

		_.each(['vertex', 'line', 'face'], function(type){
			var stat = {};
			
			var ordered = 
					$.map(hashOrder, function(f) {
						return f.type == type && f.live ? f : null;
					})
					.sort(function(a, b){
						if (a.selvage != b.selvage)
							return (a.selvage ? 1 : 0) - (b.selvage ? 1 : 0);
						if (a.type == 'vertex')
							return a.$points[0].y - b.$points[0].y;
						return 0;
					});

			$(ordered).each(function(i) {
				if (! this.unifier) {
					if (this.product) {
						/* mixed connector types mode support, eg. Piped + Cone
						 * if main failed => use <product>.alterProduct() instead
						 */
						try {
							// try direct unify()
							this.unifier = this.product.unify(accum);
						}
						catch(e) {
							console.log(e);
						
							if (this.product.alterProduct) {
								this.product = this.product.alterProduct();
								// try one more
								this.unifier = this.product.unify(accum);
							} else {
								this.unifier = '<Uncaught: ' + e + '>';
							}
						}
					}
					else {
						this.unifier = '<Empty product O_o>';
					}
				}
			
				var unifier = this.unifier.replace(/\(\d+\)/g, '');
				stat[unifier] = stat[unifier] || [];
				stat[unifier].push(this);
			});

			// сортировка коллекции по убыванию кол-ва элементов данного типа
			var keys = [];
			$.each(stat, function(key, cont){
				keys.push({key: key, cont: cont});
			});

			// сортировка
			keys.sort(function(a, b){
				// по убыванию кол-ва элементов данного типа
				if (b.cont.length != a.cont.length)
					return (b.cont.length - a.cont.length);

				// line: compare lengths
				if (type == 'line') {
					var diff = b.cont[0].product.maxLength() - a.cont[0].product.maxLength();
					if (diff) return diff;
				}

				// сравнение строк-унификаторов
				if (a.key !== b.key) {
					return ([a.key, b.key].sort()[0] === a.key) ? 1 : -1;
				}

				console.warn('Undefined sort order detected');
			});
			
			result[type] = {};
			result.total[type] = 0;
			result.count[type] = 0;
			$.each(keys, function(order){
				var index = Product.index(this.cont[0].type, order);
				result[type][index] = {
					count: this.cont.length,
					unifier: this.key,
					index: index,
					order: order,
					collect: this.cont
				};
				$(this.cont).each(function(){
					this.index = index;
					this.order = order;
					//this.groups = result[type];
				});
				result.total[type] += this.cont.length;
				result.count[type]++;
			});
		});

		// вычисление максимальной длины ребра
		var maxOuter = 0, minOuter = Infinity, minInner = null;
		$.each(result.line, function(index, stat){
			var outer = stat.collect[0].product.maxLength();
			var inner = stat.collect[0].product.minLength();
			maxOuter = outer > maxOuter ? outer : maxOuter;
			minOuter = outer < minOuter ? outer : minOuter;
			minInner = inner < minInner || minInner===null ? inner : minInner;
		});
		$.each(result.line, function(index, stat){
			stat.collect[0].product.maxOuterLength = maxOuter;
			stat.collect[0].product.minOuterLength = minOuter;
			stat.collect[0].product.minInnerLength = minInner;
		});
		
		return this.stat = result;
	},
	
	visible: function(){
		if (this.type == 'polygon' || this.type == 'face') {
			var $p = this.$points.map(function(){ return this.plane });
			return 0 <
				$p[1].x * $p[2].y - $p[1].y * $p[2].x + 
				$p[2].x * $p[0].y - $p[2].y * $p[0].x + 
				$p[0].x * $p[1].y - $p[0].y * $p[1].x;
		}
		return true;
	},
	
	prepareVisibility: function(){
		this.$primitives.each(function(){
			this.isVisible = false;
		});
		this.$primitives.each(function(){
			if (this.type == 'face') {
				if (this.isVisible = this.visible()){
					this.$subsets.each(function(){
						this.isVisible = true;
					});
				}
			}
		});
	}
}

// делает точки окружности равноудаленными с соседями (точки в начале должны быть в одной плоскости)
Figure.pointsEquidistant = function($points, center, radius) {
	// приведение точек к окружности
	function circle(){
		$points.each(function(){
			this.subtract(center);
			this.scale(radius / this.length());
			this.add(center);
		});
	}
	
	// соседи
	var $near = [];
	$points.each(function(i){
		var point = this, arr, $dist = [];
		$near[i] = (
			(arr = $points.get()
			.sort(function(a, b){
				return a.distance(point) - b.distance(point);
			}))
			.slice(1, 3)
		);
	});
	
	// итерируем пока не понравится результат
	function aberration(){
		return $points.map(function(i){
			return Math.abs( $near[i][0].distance(this) - $near[i][1].distance(this) );
		}).get().sort(function(a, b){
			return a - b;
		}).pop();
	}
	do {
		// уводим точки в сторону более удаленного соседа
		var $dirs = $points.map(function(i){
			return $near[i][0].clone().subtract(this).add($near[i][1]).subtract(this);
		});
		$points.each(function(i){
			this.add(
				$dirs[i].scale(1/5)
			);
		});
		circle();
	} while (aberration() > 1e-15);
}

/**
 * @constructor Container
 */
Figure.Container = function(params){
	params = params || {};
	var $points = params.points ? $(params.points) : $params.points || $([]);
	var $figures = params.figures ? $(params.figures) : $params.figures || $([]);
	var $primitives = $([]);
	$figures.each(function(i){
		$primitives = $.merge($primitives, this.primitives());
		//this.source = params.source || console.log('Figure.Container: !source');
	});
	// parent::construct()
	Figure.apply(this, [$.extend({
		type: 'container',
		$points: $points,
		$figures: $figures,
		$primitives: $.unique($primitives)
	}, params)]);
}
.inherits(Figure);

/**
 * @constructor Octohedron
 */
Figure.Octohedron = function(params) {
	var center = Vector(0);

	// defaults
	params = $.extend(
		{
			symmetry: 'Pentad'
		},
		params || {}
	);

	// вершины
	var points = [
			[-1, 0, 0], [1, 0, 0], 
			[0, -1, 0], [0, 1, 0], 
			[0, 0, -1], [0, 0, 1]
		],
		primitives = [];

	for (var i = 0; i < points.length; i++) {
		points[i] = $.extend(new Vector(points[i][0], points[i][1], points[i][2]), {
			_enum: i,
			pptPoint: true
		});
		
		// вершина
		primitives.push(new Figure({
			type: 'vertex',
			points: [points[i]],
			center: center
		}));
	}

	// грани & ребра
	var faces = _.invoke([
			[0,5,3], [0,3,4], [0,4,2], [0,2,5],
			[1,3,5], [1,4,3], [1,2,4], [1,5,2]
		], 'reverse'), // reverse-fix for common with Icosa vertices order
		
		snakeTail = {0:1, 1:2, 2:0};
	
	for (var i = 0; i < faces.length; i++) {
		var f = faces[i];
		// грань
		primitives.push(new Figure({
			type: 'face',
			points: [ points[f[0]], points[f[1]], points[f[2]] ]
		}));

		for (var m in snakeTail) {
			var n = snakeTail[m];

			if (f[m] < f[n]) {
				// ребро
				primitives.push(new Figure({
					type: 'line',
					points: [ points[f[m]], points[f[n]] ]
				}));
			}
		}
	}
	
	// parent::construct()
	Figure.apply(this, [$.extend({
		type: 'Octohedron',
		$points: $(points),
		$primitives: $(primitives)
	}, params)]);

	// orientate figure for given rotational symmetry around given axis
	switch (params.symmetry) {
		case 'Pentad':
			break;

		case 'Cross':
			this.rotate(Math.PI / 4, {y:'x', z:'y', x:'z'}[params.axis]);
			break;

		case 'Triad':
			var beta = new Vector(1, 1, 1).angleWith(new Vector(1, 0, 0));

			this.rotate(Math.PI / 4, 'y');
			this.rotate(- beta, 'x');
			//this.rotate(Math.asin( 2 / ( Math.sqrt(3) + Math.sqrt(15) ) ), {y:'z', z:'x', x:'y'}[params.axis]);
			break;
	}
}
.inherits(Figure)
.override({
	primitives: function() {
		return this.$primitives;
	}
});

/**
 * @constructor Icosahedron
 */
Figure.Icosahedron = function(params){
	var center = Vector(0);

	// defaults
	params = $.extend(
		{
			symmetry: 'Pentad'
		},
		params || {}
	);

	// золотой ключик
	var a = 4 / Math.sqrt( 2 * (5 + Math.sqrt(5)) ) / 2,
		b = Math.sqrt(1 - a*a),
		primitives = [];

	// вершины
	var points = [
			[-a, 0.0, b], [a, 0.0, b], [-a, 0.0, -b], [a, 0.0, -b],
			[0.0, b, a], [0.0, b, -a], [0.0, -b, a], [0.0, -b, -a],
			[b, a, 0.0], [-b, a, 0.0], [b, -a, 0.0], [-b, -a, 0.0]
		];

	for (var i = 0; i < points.length; i++) {
		points[i] = $.extend(new Vector(points[i][0], points[i][1], points[i][2]), {
			_enum: i,
			pptPoint: true
		});
		
		// вершина
		primitives.push(new Figure({
			type: 'vertex',
			points: [points[i]],
			center: center
		}));
	}

	// грани & ребра
	var faces = [
		[0,4,1], [0,9,4], [9,5,4], [4,5,8], [4,8,1],
		[8,10,1], [8,3,10],[5,3,8], [5,2,3], [2,7,3],
		[7,10,3], [7,6,10], [7,11,6], [11,0,6], [0,1,6],
		[6,1,10], [9,0,11], [9,11,2], [9,2,5], [7,2,11]
	], snakeTail = {0:1, 1:2, 2:0};
	for (var i = 0; i < faces.length; i++) {
		var f = faces[i];
		// грань
		primitives.push(new Figure({
			type: 'face',
			points: [ points[f[0]], points[f[1]], points[f[2]] ]
		}));
		for (var m in snakeTail) {
			var n = snakeTail[m];
			if (f[m] < f[n]) {
				// ребро
				primitives.push(new Figure({
					type: 'line',
					points: [ points[f[m]], points[f[n]] ]
				}));
			}
		}
	}
	// parent::construct()
	Figure.apply(this, [$.extend({
		type: 'Icosahedron',
		$points: $(points),
		$primitives: $(primitives)
	}, params)]);

	// orientate figure for given rotational symmetry around given axis
	switch (params.symmetry) {
		case 'Pentad':
			this.rotate(Math.atan(a/b), {y:'x', z:'y', x:'z'}[params.axis]);
			break;

		case 'Cross':
			break;

		case 'Triad':
			this.rotate(Math.asin( 2 / ( Math.sqrt(3) + Math.sqrt(15) ) ), {y:'z', z:'x', x:'y'}[params.axis]);
			break;
	}
}
.inherits(Figure)
.override({
	primitives: function() {
		return this.$primitives;
	}
});

/**
 * @constructor https://en.wikipedia.org/wiki/Tetrakis_hexahedron
 */
Figure.TetrakisHexahedron = function(params) {
	Figure.Octohedron.call(this, params);

	this.relations();

	var base = this;
	var points = this.$points;
		primitives = this.subs('vertex');

	_.each(this.subs('face'), function(f) {
		var p = _.reduce(f.$points, Vector.add, new Vector).normalize();
		p._enum = points.length;
		points.push(p);
		primitives.push(new Figure({ points: [p] }));
		f._dodCenter = p;
	});

	_.each(this.subs('face'), function(f) {
		var C = f._dodCenter;
		var lines = f.subs('line');

		var B = f.$points[2];
		_.each(f.$points, function(A) {
			var line = _.filter(lines, function(l) {
					var pair = l.$points;
					return (pair[0] === A && pair[1] === B) || (pair[1] === A && pair[0] === B);
				})[0];
			var anotherFace = _.difference(line.supers('face'), [f])[0];

			addFace([C, anotherFace._dodCenter, A])
			B = A;
		});
	});

	this.$points = $(this.points = points);
	this.$primitives = $(primitives);

	this.type = 'TetrakisHexahedron';

	function addFace(tri) {
		primitives.push(new Figure({ points: tri }));
		for (var i = 0, j = 2; i < 3; j = i++) {
			var A = tri[j], B = tri[i];
			if (A._enum < B._enum) {
				// ребро
				primitives.push(new Figure({ points: [A, B] }));
			}
		}
	}
}
.inherits(Figure);

/**
 * @constructor https://en.wikipedia.org/wiki/Pentakis_dodecahedron
 */
Figure.PentakisDodecahedron = function(params) {
	Figure.Icosahedron.call(this, params);

	this.relations();

	var base = this;
	var points = this.$points;
		primitives = this.subs('vertex');

	_.each(this.subs('face'), function(f) {
		var p = _.reduce(f.$points, Vector.add, new Vector).normalize();
		
		p._enum = points.length;
		points.push(p);
		
		primitives.push(new Figure({ points: [p] }));
		f._dodCenter = p;
	});

	_.each(this.subs('face'), function(f) {
		var C = f._dodCenter;
		var lines = f.subs('line');

		var B = f.$points[2];
		_.each(f.$points, function(A) {
			var line = _.filter(lines, function(l) {
					var pair = l.$points;
					return (pair[0] === A && pair[1] === B) || (pair[1] === A && pair[0] === B);
				})[0];
			var anotherFace = _.difference(line.supers('face'), [f])[0];

			addFace([C, anotherFace._dodCenter, A])
			B = A;
		});
	});

	this.$points = $(this.points = points);
	this.$primitives = $(primitives);

	this.type = 'PentakisDodecahedron';

	function addFace(tri) {
		primitives.push(new Figure({ points: tri }));
		for (var i = 0, j = 2; i < 3; j = i++) {
			var A = tri[j], B = tri[i];
			if (A._enum < B._enum) {
				// ребро
				primitives.push(new Figure({ points: [A, B] }));
			}
		}
	}
}
.inherits(Figure);

			/**
 * Абстракция изделия, необходимого для постройки кислосферы.
 *
 * @author   popitch@yandex.ru
 */

Product = function(params) {
	$.extend(this, params);
	this.cache = {};
}
.override({
	// точность вычислений
	//PRECISION: 10000,
	//round: function(value) {
	//	return Math.round(value * this.PRECISION) / this.PRECISION;
	//},
	
	// @return string that defines the product
	unify: function(){
		console.log(['abstract method unify()', this]);
	},
	
	// @return figure that defines the product
	model: function(){
		//console.log(['abstract method model()', this]); //alcohol yad
		// default null model
		return null;
	},

	// draw product scheme on canvas
	//plot: function(canvas){},
	
	// product meter
	meter: function(){
		return {};
	}
})
.statics({
	characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
	index: function(type, order) {
		if (type == 'line')
			return (order >= 26 ? Product.index(type, Math.floor(order / 26) - 1) : '') + Product.characters[order % 26];
		else
			return order + 1;
	},
	
	selectChain: function(chain, nodeAttrScalar, cyclic, bilateral){
		chain = $(chain).get();
		
		function breaked(i){
			var sample = chain.slice(i).concat(chain.slice(0, i));
			
			var arr = sample.slice();
			var forward = [], el, i = 0;
			do {
				if (el = arr.shift()) {
					forward.push({
						forward: true,
						sequence: forward,
						i: i++,
						node: el
					});
				}
			} while (el && !el.terminate);
			forward[0].node.dontStart ||
				list.push(forward);
			
			if (!bilateral){
				arr = sample.slice();
				var reversed = [];
				i = 0;
				do {
					if (el = arr.pop()){
						reversed.push({
							forward: false,
							sequence: reversed,
							i: i++,
							node: el
						});
					}
				} while (el && !el.terminate);
				reversed[0].node.dontStart ||
					list.push(reversed);
			}
		};
		
		var list = [];
		cyclic ? $(chain).each(breaked) : breaked(0);
		
		function zeroDetector(v){
			return (Math.abs(v) < 1e-5) ? 0 : v;
		}
		
		var cmp;
		switch (typeof nodeAttrScalar){
			case 'string':
				cmp = function(a, b){
					return zeroDetector(b.node[nodeAttrScalar] - a.node[nodeAttrScalar]);
				};
				break;
			case 'function':
				cmp = function(a, b){
					return zeroDetector(
						nodeAttrScalar.call(b.node, b.i, b.sequence, b.forward) -
						nodeAttrScalar.call(a.node, a.i, a.sequence, a.forward));
				};
				break;
			default:
				console.log('Product.selectChain(): wrong comparator')
		}
		
		// caching sequences of actual values
		$.map(list, function(seq) {
			seq.used = $.map(seq, function(a) {
				return a.node.sortIgnore ? null : a;
			});
		});
		
		// get sorted first
		// TODO: use one-cicle algorithm to search
		var selected = list.sort(function(A, B){
			if (B.used.length - A.used.length)
				return (B.used.length - A.used.length);
				
			for (
				var i = 0, res = 0;
				i < A.used.length && !( res = cmp(A.used[i], B.used[i]) );
				i++
			);
			
			return res;
		})[0];
		
		return $(selected).map(function() {
			this.node.forward = this.forward;
			return this.node;
		}).get();
	},

	// number unifiers
	ANGLE_PRECISION: 0.1, // degrees
	LENGTH_PRECISION: 0.001, // m (to 1 mm)

	angleUnify: function(angle){
		angle = angle * 180 / Math.PI;
		return Math.round(angle / Product.ANGLE_PRECISION);
	},

	lengthUnify: function(length){
		return Math.round(length / Product.LENGTH_PRECISION);
	}
});
			/**
 * Определение продукта многоугольник
 * 
 * @author   popitch [at yandex.ru]
 */

Product.Polygon = function(){
	Product.apply(this, arguments);
	// expected
	this.face || console.log('face not specified');
}
.inherits(Product)
.override({

	/** отдает вершины продуктового полигона
	 *  в сложном случае (например, Joint) вершины не совпадают с вершинами базовой фигуры, задающей форму купола
	 */
	realPoints: function(){
		var face = this.face;

		return this.cache.$reals = this.cache.$reals ||
			face.$sub.vertex.map(function(){
				var vertex = this,
					point = vertex.$points[0];

				var planes = $.map(face.bindedLines || face.$sub.line, function(line) {
						line = line.origin;
						return (line.$points[0] === point || line.$points[1] === point) ?
							line.product.getPlane() : null;
					});

				var sols = $( Solutions.twoPlanesAndSphere(planes[0], planes[1]) ).each(function(){
						this._offset = this.distance(point);
					});

				sols.length == 2 ||
					console.log('polygon unify(): sols.length=' + sols.length);
				
				var result = sols[0]._offset < sols[1]._offset ? sols[0] : sols[1];

				// ~
				result.scale( point.length() );

				result.vertex = vertex;
				vertex.real = result;
				return result;
			});
	},
	
	realCenter: function() {
		if (this.cache.realCenter)
			return this.cache.realCenter;
		var center = new Vector, $points = this.realPoints();
		$.map($points, function(p) {
			center.add(p);
		});
		return this.cache.realCenter = center.scale(1 / $points.length);
	}
});

Product.Polygon.Simple = function(face, params){
	// parent()
	Product.Polygon.apply(this, [$.extend({
		type: 'Polygon',
		title: 'Многоугольник',
		bilateral: false,
		face: face
	}, params || {})]);
}
.inherits(Product.Polygon)
.override({
	unify: function(accum) {
		const product = this,
			face = product.face,
			$reals = product.realPoints();

		if (face._protoPoint) {
			var center// = face._protoPoint; // with him wrong unification! O_o
		} else {
			center = new Vector;
			$reals.each(function(){
				center.add(this);
			});
			center.scale( 1 / $reals.length );
		}
		
		// product normal
		product.normal = Vector.crossProduct(
			Vector.subtract($reals[0], center),
			Vector.subtract($reals[1], center)
		);
		if (Vector.dotProduct(product.normal, $reals[0]) < 0)
			product.normal.scale(-1);
		
		var prevRealPoint = $reals[$reals.length - 1],
			prevVertex = product.face.$sub.vertex[$reals.length - 1],
			chain = [];
		
		var angleSum = 0;
		
		product.maxR = 0;
		
		$reals.each(function(/*vertexIter*/) {
			var realPoint = this,
				vertex = realPoint.vertex, //product.face.$sub.vertex[ vertexIter ];
				vertexPoint = vertex.$points[0],
				prevVertexPoint = prevVertex.$points[0];
		
			// vertex raduis
			var R = prevRealPoint.distance(center) * product.R;
			chain.push({
				value: R,
				vertex: prevVertex,
				center: center,
				mark: 'R',
				cuttingMatter: prevVertex._cuttingPoint && 'Cutting' && null // disable deprecated! face.cuttingLine
			});
			
			var line = _.findWhere(product.face.bindedLines || product.face.$sub.line, {
					origin: vertex.$super.line.map(function(){
						return this.$vertexes[0] === prevVertex ||
							   this.$vertexes[1] === prevVertex ? this : null;
					})[ 0 ]
				}),
				lineCuttingMatter = line._cuttingMatters &&
					line._cuttingMatters[
						line.$points[0] === vertex.$points[0] ? 1 : 0
					];
			
			// side angle
			var prevAngle = Vector.subtract(realPoint, center).angleWith(Vector.subtract(prevRealPoint, center));
			chain.push({
				dontStart: true,
				value: prevAngle,
				mark: 'A',
				cuttingMatter: lineCuttingMatter && null // disable deprecated! face.cuttingLine
			});
			
			// test
			angleSum += prevAngle;
			
			// max R
			product.maxR = Math.max(product.maxR, R);
			
			// side length
			chain.push({
				sortIgnore: true,
				dontStart: true,
				vertex: vertex,
				value: realPoint.distance(prevRealPoint) * product.R,
				line: line,
				mark: 'L'
			});

			if (! line) {
				console.warn('binded line not found');
			}
			
			prevVertex = vertex;
			prevRealPoint = realPoint;
		});
		
		// assert: polygon on plane
		if (Math.abs(angleSum - 2 * Math.PI) > 1e-3){
			console.log('Polygon.unify(): sum of polygon angles is not equal full circle (' + angleSum + ' != 2*PI)');
		}
		
		// select chain
		product.chain = Product.selectChain(
			chain,
			function(i, all, forward) {
				var adv = this.cuttingMatter && null; // disable deprecated! face.cuttingLine
				
				return this.value //* 1e+3 + // disable deprecated! face.cuttingLine
					//(isNaN(adv) ? (adv ? 1 : 0) : (forward ? adv : 1 - adv))
			},
			true,
			product.bilateral
		);
		
		return $.map(product.chain, node => {
			if (node.mark == 'L') return null;
			
			var adv = node.cuttingMatter && null; // disable deprecated! face.cuttingLine
			
			return node.mark + 
				(adv ? '[' + (isNaN(adv) ? adv : Math.round((node.forward ? adv : 1 - adv) * 1000)) + ']' : '') + 
				Product.lengthUnify(node.value); // 1/1000 of meter/radian precision
		}).join('-');
	},

	model: function(onExport) {
		if (!onExport)
			return // console.error(this, 'on export only');

		if (this.face.protoConvexFaces) {
			return this.face.protoConvexFaces.flatMap(face => [ face.$points.get().reverse() ]);
		}
		
		var face = this.face.$points.get();

		// todo: resolve std orientation
		var reverted = face.reverse();
		
		// one reverted face
		return [reverted];
	},
	
	plot: function(canvas){
		var product = this;
		var R = this.maxR;
		var plotter = new Plotter(canvas, {
				width: 2 * R,
				height: 2 * R,
				margin: 20, // px
				resize: true,
				offset: {x: R, y: R}
			});
		//plotter.circle({x: 0, y: 0}, R, ['gray']);
		
		// plotter point by angle & R
		function pos(a, r) {
			return {
				x: r * Math.cos(a),
				y: r * Math.sin(a)
			};
		}
		
		function middle(A, B, ratio) {
			return {
				x: A.x * (1 - ratio) + B.x * ratio,
				y: A.y * (1 - ratio) + B.y * ratio
			};
		}
		
		var cuttingBegin;
		function cuttingPoint(p) {
			if (cuttingBegin) {
				plotter.line(cuttingBegin, p, 'dashed');
				cuttingBegin = null;
			}
			else {
				cuttingBegin = p;
			}
		}
		
		var center = {x: 0, y: 0};
		
		// draw polygon
		var a = Math.PI / 2, prev = {};
		
		// previous (last) segment data
		for (var i = 1; i <= 3; i++) {
			var match = this.chain[this.chain.length - i];
			prev[match.mark] = match.line || match.value;
					
			// cutting
			if (match.mark === 'R' && match.cuttingMatter) {
				cuttingPoint(pos(a, match.value));
			}
			else if (match.mark === 'A' && match.cuttingMatter) {
				prev.lineCuttingMatter = match.forward ? match.cuttingMatter : 1 - match.cuttingMatter;
			}
		}
		// set last plotter-point as previous
		prev.point = pos(a - prev.A, prev.R);
		
		$(this.chain).each(function(){
			switch(this.mark){
				case 'L':
					prev.L = this.line;
					break;
					
				case 'A':
					a += this.value;
					
					// cutting
					if (this.cuttingMatter) {
						prev.lineCuttingMatter = this.forward ? this.cuttingMatter : 1 - this.cuttingMatter;
					}
					
					break;
					
				case 'R':
					var point = pos(a, this.value);
					var worldPoints = $.map(prev.L.origin.$sub.vertex, v => v.$points[0]);
					
					// cutting
					if (prev.lineCuttingMatter) {
						cuttingPoint(
							middle(prev.point, point, prev.lineCuttingMatter)
						);
						prev.lineCuttingMatter = null;
					}
					
					if (this.cuttingMatter) {
						cuttingPoint(point);
					}
					
					// side
					var length = Product.lengthUnify( plotter.distance(point, prev.point) );
					var basedOnLineNormal = worldPoints[1] && Vector.crossProduct(worldPoints[0], worldPoints[1]);
					var segmentNormal = worldPoints[1] && Vector.crossProduct(
							Vector.subtract(worldPoints[0], product.realCenter()),
							Vector.subtract(worldPoints[1], product.realCenter())
						);
					
					var byLineAngle = basedOnLineNormal && Math.round( segmentNormal.angleWith(basedOnLineNormal) * 1800 / Math.PI ) / 10;
					// basedOnLineNormal orientation unknown
					byLineAngle = (byLineAngle > 90) ? 180 - byLineAngle : byLineAngle;
					
					plotter.line(prev.point, point, {
						strokeStyle: "black",
						lineWidth: 3,
						strokeStyle: (productPalette.line[prev.L.order] || { css: '#000' }).css
					});
					plotter.textByLine(
						length +
							(prev.L.index ? ' (' + prev.L.index + ')' : '') +
							(byLineAngle ? ' ∟' + byLineAngle + '°' : ''),
						point, 
						prev.point, {
							fontSize: 1.2,
							fillStyle: (productPalette.line[prev.L.order] || { css: '#000' }).css
						}
					);
					
					// R
					plotter.line(center, point, 'division');
					plotter.textByLine(Product.lengthUnify(plotter.distance(point, center)),
							point, center, { fontSize: 1 });
					
					// vertex label
					var vertex = this.vertex;
					setTimeout(function(){
						plotter.vertexLabel(vertex.index, point, vertex.$super.line.length);
					});
					
					prev.point = point;
					break;
			}
		});
	},
	
	meter: function(){
		const product = this,
			R = product.R, R2 = R * R,
			meter = {},
			points = product.face.$points.get(),
			sides = points.map((p, i) => p.distance(points[i + 1] || points[0]));
		
		meter[__('Polygons')] = {};
		
		meter[__('Polygons')][__('Coverage area, m2')] =
			R2 * sides.slice(1, -1).reduce((sum, side, i) => {
				const A = points[i + 1], B = points[i + 2];
				
				return sum + Metrics.triangleHeronArea(side, points[0].distance(A), points[0].distance(B));
			}, 0);
		
		meter[__('Polygons')][__('Sum of perimeters, m')] =
			R * _.reduce(sides, (S, P) => S + P, 0);
		
		return meter;
	}
});

			/**
 * Определение продукта треугольник
 * 
 * @author   popitch [at yandex.ru]
 */

Product.Triangle = {};

Product.Triangle.Simple = function(face, params){
	// parent()
	Product.Polygon.Simple.call(this, face, $.extend({
		type: 'Triangle',
		title: 'Треугольник'
	}, params || {}));
}
.inherits(Product.Polygon.Simple)
.override({
	unify: function() {
		var product = this;
		var unifier = Product.Polygon.Simple.prototype.unify.call(this, 'without radius, brother');

		/* stats */
		var $reals = this.realPoints();
		
		// длины сторон a, b, c
		var abc = this.abc = new Array(3);
		var lines = this.lines = new Array(3);
		// для углов
		var abcEdges = this.abcEdges = new Array(3);
		var n = Vector.crossProduct(
				$reals[0].clone().subtract($reals[1]),
				$reals[2].clone().subtract($reals[1])
			);
		$reals.each(function(i){
			var A = this, B = $reals[(i + 1) % 3];
			abc[(i + 2) % 3] = product.R * A.distance(B);
			lines[(i + 2) % 3] = _.find(product.face.bindedLines || product.face.$sub.line, function(line) {
				var vv = line.origin.$sub.vertex;
				return 0 ||
					(vv[0] == A.vertex && vv[1] == B.vertex) ||
					(vv[1] == A.vertex && vv[0] == B.vertex);
			});
			// угол между плоскостью треугольника и смотрящей в центр
			var r = A.vertex.points[0].clone().add(B.vertex.points[0]).scale(.5);
			abcEdges[(i + 2) % 3] = Math.asin(Math.abs(r.cosWith(n)));
		});

		// Формула Герона позволяет вычислить площадь треугольника (S) по его сторонам
		this.p = (abc[0] + abc[1] + abc[2]) / 2;
		this.S = Metrics.triangleHeronArea(abc[0], abc[1], abc[2]);

		// углы
		this.angles = new Array(3);
		for (var a = 0; a < 3; a++) {
			var b = (a + 1) % 3, c = (a + 2) % 3;
			product.angles[a] = Math.acos( (abc[b]*abc[b] + abc[c]*abc[c] - abc[a]*abc[a]) / (2 * abc[b] * abc[c]) );
		}

		// S = abc/4R
		this.triR = abc[0] * abc[1] * abc[2] / (4 * this.S);
		/* end for stats */
		
		return unifier;
	},

	model: function(onExport) {
		if (!onExport)
			return // console.error(this, 'on export only');

		var face = this.face.$points.get();

		// todo: resolve std orientation
		face = face.reverse();//[face[2], face[1], face[0]];

		// one reverted face
		return [face];
	},

	plot: function(canvas) {
		var product = this;

		new Plotter.Triangle(canvas, {
			$points: this.realPoints(),
			$vertexes: product.face.$sub.vertex,
			$lines: this.lines,
			R: this.R,
			angles: this.angles,
			radiuses: [this.triR, this.triR, this.triR],
			abcEdges: this.abcEdges,
			textZoom: 2
		})
		.triangle()
		.vertexes();
	},
	
	meter: function(){
		var meter = {};

		meter[__('Coverage area, m2')] = this.S;
		meter[__('Triangles')] = {};
		meter[__('Triangles')]['range:' + __('Min. height, mm')] = Product.lengthUnify(
			_.min([
				2 * this.S / this.abc[0],
				2 * this.S / this.abc[1],
				2 * this.S / this.abc[2]
			])
		);
		meter[__('Triangles')]['range:' + __('Max. side, mm')] = Product.lengthUnify(
			_.max(this.abc)
		);

		return meter;
	}
});

			/**
 * Определение продукта коннекторов
 * 
 * @author   popitch [at yandex.ru]
 */

Product.Connector = function() {
	Product.apply(this, arguments);
	// expected
	this.vertex || console.log('vertex not specified');
	this.point || console.log('point not specified');
}
.inherits(Product)
.override({
	// расстояние от вершины коннектора до плоскости ребра (средняя его плоскость)
	ribPlaneOffset: function(line){
		return console.log('Product.Connector.ribPlaneOffset() abstract called', this) & 0;
	},
	
	// ребро, в которое упирается заданное ребро
	ribWall: function(line){
		return null;
	},
	
	// расстояние от вершины коннектора до плоскости стены (в которую ребро упирается)
	ribWallOffset: function(line){
		return 0;
	},
	
	// вектор от текущей точки вдоль line
	toOtherTail: function(line){
		var OTHER = (line.$points[0] != this.point) ? (line.$points[1] != this.point) ?
				console.log('Product.Connector.toOtherTail: wrong line') : 0 : 1;
		return line.$points[OTHER].clone().subtract(this.point);
	},
	
	otherVertex: function(line){
		var vertex = this.vertex;
		return line.$vertexes.map(function(){
			return this !== vertex ? this : null;
		})[0];
	},
	
	// вектор к центру от тукущей точки
	toCenter: function(){
		return this.point.center ?
			Vector.subtract(this.point.center, this.point) :
			(new Vector).subtract(this.point);
	},
	
	// угол к радиусу в тукущей точке
	angleByRaduis: function(line){
		return this.toOtherTail(line).angleWith(this.toCenter());
	},

	// коллекция ребер данного фейса
	linesByFace: function(face){
		var point = this.vertex.$points[0];
		return face.$sub.line.map(function(){
			return this.$points[0] === point || this.$points[1] === point ? this : null;
		});
	},
	
	afterTailsGiven: function(tail, i, line){
		return tail;
	},

	unify: function(){
		var product = this;
		
		// подготовка схемы
		this.vertex.$scheme.each(function(){
			if (this.isFace) {
				/**
				 * @todo брать не угол реал-фейса, а угол к остальным вершинам
				 */
				var reals = this.source.product.realPoints().get();
				var i = this.source.$sub.vertex.index(product.vertex);
				this.faceAngle = Vector.angle(reals[(i - 1 + reals.length) % reals.length], reals[i], reals[(i + 1) % reals.length]);
			} else {
				this.radiusAngle = product.angleByRaduis(this.source);
			}
		});

		// прокрутим цепочку и выберем единственный вариант
		if (!this.vertex.selvage) {
			var chain = this.vertex.$scheme.get();
			var sortChains = [];
			$(chain).each(function(i){
				sortChains.push( chain.slice(i).concat(chain.slice(0, i)) );
			});
			sortChains.sort(function(a, b){
				for (var i = 0, l = a.length, d; i < l; i++) {
					d = (b[i].faceAngle || b[i].radiusAngle) - (a[i].faceAngle || a[i].radiusAngle);
					if (-1e-6 > d || d > 1e-6)
						return d;
				}
				return 0;
			});
			this.vertex.$scheme = $(sortChains[0]);
		}

		// цепочка уголов ребра_к_радиусу - треугольника ...
		// префикс "ground " означает что это край
		return (this.vertex.selvage ? 'Ground ' : '') +
			this.vertex.$scheme.map(function(){
				return this.isFace ?
					'F' + Product.angleUnify(this.faceAngle) :
					'R' + Product.angleUnify(this.radiusAngle);
			}).get().join(' ');
	},
	
	meter: function() {
		var p = this.vertex.$points[0];
		var meter = {};

		if ('height' === form.state.partialMode) {
			const height = 2 * form.state.partialHeight;
			
			meter['max:' + __('Height from base, m')] = height * this.R;
			
			try {
				var radius = Math.sin(Math.acos(1 - height)) * this.R;
				
				meter['range:' + __('Base radius, m')] = radius;
				
				meter['max:' + __('Base circle area, m2')] = radius * radius * Math.PI;
			} catch(e){};
		}
		else {
			meter['swing:' + __('Height from base, m')] = p.y * this.R;
			
			if (this.vertex.selvage)
				meter['range:' + __('Base radius, m')] = Math.sqrt(p.x * p.x + p.z * p.z) * this.R;
		}
		
		return meter;
	}
});

/**
 * Joint connector https://popitch1.livejournal.com/1840.html
 */
Product.Connector.Joint = function(vertex, params) {
	Product.Connector.apply(this, [$.extend({
		type: 'Joint',
		vertex: vertex,
		point: vertex.$points[0],
		whirlAsClock: '1'
	}, params || {})]);
}
.inherits(Product.Connector)
.override({
	ribPlaneOffset: function(line){
		if (line.sliced || this.vertex.sliced)
			return  0;
		return (this.whirlAsClock != 0 ? 1 : -1) * line.product.thickness / 2; // @todo any product
	},

	// ребро, в которое упирается заданное ребро
	ribWall: function(line){
		var vertexIndex = $.inArray(this.vertex, line.$vertexes);
		
		vertexIndex >= 0 ||
			console.log('its not my line', this);
		
		var $nearLines = line.$nearLinesByVertex[vertexIndex];
		var nearSlicedLines = $nearLines.filter(function(){ return this.sliced });
		return nearSlicedLines[0];
	},
	
	// оконцовщик хвоста ребра
	getTail: function(line){
		var vertex = this.vertex,
			point = vertex.$points[0],
			plane = line.product.getPlane(), // @todo
			outer;
		
		var vertexIter = (line.origin.$vertexes[0] == vertex) ? 0 : 1;
		
		// todo: copypasted from Rib.getTails() by refactor getTail mechanism
		
		var anotherPoint = line.origin.$sub.vertex.filter(function(){ return this !== vertex })[0].$points[0];
		var center = line.origin.center || vertex.center || Vector(0);
		
		var result = plane.result(point);
		if (Math.abs(result) > 1e-6) {
			// базовая плоскость смещена (Joint + GoodKarma, Semicone)
			var $nearLines = line.origin.$nearLinesByVertex[vertexIter];
			var wall;
			$nearLines.each(function(){
				var otherVertex = this.$sub.vertex.filter(function(){ return this !== vertex })[0];
				var otherPoint = otherVertex.$points[0];
				var otherResult = plane.result(otherPoint);
				if (otherResult * result < 0) {
					wall && console.log('too many walls for one tail');
					// по другую сторону от плоскости ребра, значит сюда уперлись
					wall = {
						plane: this.product.getPlane().clone(),
						line: this
					};
					// ориентируем плоскость стены относительно незадействованной здесь вершины лайна
					if (wall.plane.result(anotherPoint) < 0)
						wall.plane.revert();
				}
			});
			
			if (!wall)
				console.log(['Product.Rib::model(): no wall', this]);
			
			// двигаем стену в сторону сабжевого ребра, учитывая толщину ребра
			wall.plane.D -= wall.line.product.thickness / 2;


			var sols = Solutions.twoPlanesAndSphere(plane, wall.plane);
			
			sols.length == 2 ||
				console.log(['Product.Rib::model(): not two solutions', this]);

			outer = sols[0].distance(point) < sols[1].distance(point) ? sols[0] : sols[1];

			// refactor candidate
			//outer = Solutions.planesCross(line.product.getOuterPlane(), plane, wallPlane);

			// for points placed out of sphere (outer Fulleren)
			// ~
			outer.scale( point.length() );
			
			return {
				// точка внешней поверхности
				outer: outer,
				center: center,
				wall: wall.plane,
				vertex: vertex
			};
		}
		// смещения нет

		if (!line.sliced) {
			wallLine = vertex.product.ribWall(line);

			// ребро не на краю
			if (wallLine) {
				// есть ребро, в которое упирается данное (Joint)
				var wall = {
						plane: wallLine.product.getPlane().clone(),
						line: wallLine
					};
				
				// ориентируем плоскость стены относительно незадействованной здесь вершины лайна
				if (wall.plane.result(anotherPoint) < 0)
					wall.plane.revert();
				
				// двигаем стену в сторону сабжевого ребра, учитывая толщину ребра
				wall.plane.D -= wall.line.product.thickness / 2;
			}
			else {
				console.error('This code branch must no usage');

				// нет ребра в которое упирается данное (Piped)
				center = vertex.center || line.center || center;
				var lineVector = Vector.subtract(point, anotherPoint);
				var pointVector = Vector.subtract(point, center);
				var sideVector = Vector.crossProduct(lineVector, pointVector);
				var wallNormal = Vector.crossProduct(sideVector, pointVector).normalize();
				var wall = {
						plane: new Plane(wallNormal, point)
					};
			}

			// двигаем стену на радиус трубы
			var offset = vertex.product.ribWallOffset(line);
			if (offset) {
				wall.plane.D += ( wall.plane.result(anotherPoint) > 0 ? -offset : offset );
			}


			var sols = Solutions.twoPlanesAndSphere(plane, wall.plane);
			
			sols.length == 2 ||
				console.log(['Product.Rib->getTails()', 'not 2 solutions', this]);

			outer = sols[0].distance(point) < sols[1].distance(point) ? sols[0] : sols[1];

			// for points placed out of sphere (outer Fulleren)
			// ~
			outer.scale( point.length() );
			
			return {
				// точка внешней поверхности
				outer: outer,
				center: center,
				wall: wall.plane,
				vertex: vertex
			};
		}

		// В НОВОЙ ВЕРСИИ СЮДА НЕ ПОПАДАЕМ
		console.error('// В НОВОЙ ВЕРСИИ СЮДА НЕ ПОПАДАЕМ');
	},
	
	unify: function(){
		return 'Joint ' + Product.Connector.prototype.unify.apply(this);
	}
});


// Труба (расположена вдоль радиуса) с лучами для крепления ребер, классика для любителей сварки и стыков металл+дерево
Product.Connector.Piped = function(vertex, params) {
	Product.Connector.apply(this, [$.extend({
		type: 'Piped',
		vertex: vertex,
		point: vertex.$points[0],
		bilateral: false
	}, params || {})]);
	
	// габариты приводим к долям радиуса, а получаем в неких единицах измерения
	this.Dpipe *= (this.measure || 1) / this.R;
}
.inherits(Product.Connector)
.override({
	ribPlaneOffset: function(line){
		return 0;
	},

	// расстояние от вершины коннектора до плоскости стены (в которую ребро упирается)
	ribWallOffset: function(line){
		return this.Dpipe / 2;
	},
	
	// оконцовщик хвоста ребра
	getTail: function(line){
		// take origin line figure
		line = line.origin;

		// cache
		this.cache.pipedTail = this.cache.pipedTail || {};
		if (this.cache.pipedTail[line._enum])	
			return this.cache.pipedTail[line._enum];
		
		var vertex = this.vertex, point = vertex.$points[0];
		var plane = line.product.getPlane();
		
		var vertexIter = line.$vertexes[0] == vertex ? 0 : 1;
		var anotherPoint = line.$vertexes[1 - vertexIter].$points[0];
		var center = line.center || vertex.center || Vector(0);
		
		if (!line.sliced) {
			// ребро не на краю
			center = vertex.center || line.center || center;
			var lineVector = Vector.subtract(point, anotherPoint);
			var pointVector = Vector.subtract(point, center);
			var sideVector = Vector.crossProduct(lineVector, pointVector);
			var wallNormal = Vector.crossProduct(sideVector, pointVector).normalize();
			var wall = {
					plane: new Plane(wallNormal, point)
				};
			
			// двигаем стену на радиус трубы
			var offset = vertex.product.ribWallOffset(line);
			wall.plane.D += ( wall.plane.result(anotherPoint) > 0 ? -offset : offset );
			
			return this.cache.pipedTail[line._enum] = {
				// точка внешней поверхности
				outer: Solutions.planesCross(line.product.getOuterPlane(), plane, wall.plane),
				center: center,
				wall: wall.plane,
				vertex: vertex
			};
		}
		
		// ребро целиком на краю (Piped, Joint)
		line.sliced ||
			console.log(['Product.Rib->getTails()', 'fail']);
		
		var $anotherSelvageLines = vertex.$super.line.filter(function(){ return this.selvage && this !== line });
		
		if ($anotherSelvageLines.length != 1)
			console.log(['Product.Rib->getTails()', 'not 1 anotherSelvageLines: ', $anotherSelvageLines]);
		
		var linePlane = line.product.getPlane(),
			line2Plane = $anotherSelvageLines[0].product.getPlane();
		
		Vector.dotProduct(linePlane.normal(), line2Plane.normal()) < 0 &&
			line2Plane.revert();
		
		var outer = point,
			offset = this.ribWallOffset(line);
		
		center = vertex.center || line.center || center;
		var lineVector = Vector.subtract(point, anotherPoint);
		var pointVector = Vector.subtract(point, center);
		var sideVector = Vector.crossProduct(lineVector, pointVector);
		var wallNormal = Vector.crossProduct(sideVector, pointVector).normalize();
		var wallPlane = new Plane(wallNormal, point);
			
				
		// двигаем стену на радиус трубы
		if (offset) {
			wallPlane.D += ( wallPlane.result(anotherPoint) > 0 ? -offset : offset );
			
			outer = Solutions.planesCross(line.product.getOuterPlane(), plane, wallPlane);
		}
		
		return this.cache.pipedTail[line._enum] = {
			outer: outer,
			wall: wallPlane,
			center: center,
			vertex: vertex
		};
	},
	
	unify: function(){
		var product = this;
		
		// проекция ребер на основание радиус-вектора вершины
		var prev, pinAngleSum = 0;
		var radius = Vector.subtract(this.vertex.$points[0], this.vertex.center);
		
		this.$hedgehog = this.vertex.$scheme.map(function(){
			if (this.source.type == 'line') {
				var vector = product.toOtherTail(this.source);
				
				return prev = {
					vector: vector,
					source: this.source,
					pin: Vector.subtract(vector, Vector.project(vector, radius)),
					terminate: this.selvage
					//product: product
				};
			}
			return null;
		});
		
		// углы
		this.$hedgehog.each(function(){
			var angle = ( Vector.add(prev.pin, this.pin).length() < 1e-9 ) ? Math.PI : prev.pin.angleWith(this.pin);
			
			if (Vector.dotProduct(Vector.crossProduct(this.pin, prev.pin), radius) < 0)
				angle = Math.PI * 2 - angle;
			
			pinAngleSum += (
				prev.forwardAngle = this.backAngle = angle
			);
			
			prev = this;
		});
		
		// total control
		if (Math.abs(pinAngleSum - Math.PI*2) > 1e-7)
			console.log('Piped.unify(): pin angles sum is not full circle ' + pinAngleSum);
		
		// sort & select
		this.$hedgehog = $(
			Product.selectChain(
				this.$hedgehog,
				function(i, arr, forward){
					return forward ? this.backAngle : this.forwardAngle;
				},
				true,
				product.bilateral
			)
		);
		
		return this.$hedgehog.map(
			function(){
				return Product.angleUnify(this.forward ? this.backAngle : this.forwardAngle);
			}
		).get().join('-');
	},

	// draw product scheme on canvas
	// @param DomElement canvas
	// @param Object plotter options
	plot: function(canvas, opts){
		var product = this;
		var C = {x: 1, y: 1};
		var plotter = new Plotter(canvas, $.extend(opts, {
				width: 2,
				height: 2,
				margin: 20, // px
				resize: true,
				R: this.R,
				textZoom: 2
			}))
			.circle(C, .8, ['solid', 'fillWhite']);
		
		var angle = 0, prev;//Math.PI;
		this.$hedgehog.each(function(){
			prev = angle;
			angle += this.forward ? this.backAngle : this.forwardAngle;
			
			var A = {x: 1 + Math.cos(angle), y: 1 + Math.sin(angle)};
			
			// line
			plotter.line(C, A, 'bbb');
			
			// index
			plotter.textByLine(this.source.index, C, A, {q: .9, sup: true});
			
			// degree
			var mid = (prev + angle) / 2;
			var degree = Math.round(1800 * (angle - prev) / Math.PI) / 10 + '°';
			plotter.text(
				{x: 1 + .38 * Math.cos(mid), y: 1 + .38 * Math.sin(mid)},
				degree
			);
		});
	}
});

// helper for Cone
function AngleSet(){}
AngleSet.prototype = {
	add: function(angle, weight){
		// sense a near value
		for (var a in this)
			if (this.hasOwnProperty(a))
				angle = Math.abs(a - angle) > 1e-6 ? angle : a;
		// increment
		this[angle] = (this[angle] || 0) + weight;
		return angle;
	},
	merge: function(set, maxus){
		for (var a in set)
			if (set.hasOwnProperty(a)){
				this.add(a, set[a]);
				maxus = Math.max(maxus, this[a]);
			}
		return maxus;
	}
};

/**
 * Корабль, карандаш, конус... ибо шишка
 */
Product.Connector.Cone = function(vertex, params) {
	Product.Connector.apply(this, [$.extend({
		type: 'Cone',
		vertex: vertex,
		point: vertex.$points[0],
		bilateral: false
	}, params || {})]);
	
	this.alterProduct = function() {
		return new Product.Connector.Piped(vertex, params);
	};
}
.inherits(Product.Connector.Piped)
.override({
	ribPlaneOffset: function(line){
		return 0;
	},

	// расстояние от вершины коннектора до плоскости стены (в которую ребро упирается)
	ribWallOffset: function(line){
		return 0;
	},
		
	// ключ аккумулятора
	/*
	pinAccumKey: function(pin, finaly){
		var back = pin.forward ? pin.backAngle : pin.forwardAngle;
		var forward = pin.forward ? pin.forwardAngle : pin.backAngle;
		var pp = pin.source.$points;
		var length = Product.lengthUnify( pp[0].distance(pp[1]) * this.R );
		var suffix;
		
		if (!finaly){
			var otherProduct = this.otherVertex(pin.source).product;
			
			if (otherProduct === this)
				console.log('otherProduct === this product');
			
			// prepare other hedgehog
			if (!otherProduct.$hedgehog)
				Product.Connector.Piped.prototype.unify.call(otherProduct);
			
			var otherHedgehog = otherProduct.$hedgehog;
			var otherPin = otherHedgehog.map(function(){
				return this.source === pin.source ? this : null;
			})[0];
			suffix = otherProduct.pinAccumKey(otherPin, true);
		}
		
		return (back >= Math.PI ? 'none' : Product.angleUnify(back)) + ' ' + length + ' ' + 
			(forward >= Math.PI ? 'none' : Product.angleUnify(forward)) + (suffix ? ' => ' + suffix : '');
	},
	*/
	
	unify: function(accum){
		if (this.cache.coneUnifier)
			return this.cache.coneUnifier;
		
		var product = this;
		var unifier = Product.Connector.Piped.prototype.unify.apply(this, arguments);
		
		//accum = accum || {};
		accum.cone = accum.cone || {};
		
		function mirrorKey(key){
			//key = key.replace(/(\S+) (\S+) (\S+)$/g, '$3 $2 $1');
			key = key.replace(/^(\S+) (\S+) (\S+)/g, '$3 $2 $1');
			return key;
		}
			
		if (!this.vertex.selvage) {
			// решение зацикленной системы линейных уравнений
			if (this.$hedgehog.length % 2){
				// единственно, если лучей нечетное кол-во
				this.$hedgehog.each(function(){
					this.coneAngle = 0;
				});
				this.$hedgehog.each(function(i){
					var subj = this;
					product.$hedgehog.each(function(j){
						var pin = product.$hedgehog[ (i + j) % product.$hedgehog.length ];
						subj.coneAngle += ( j % 2 ? -1 : 1 ) * pin[ pin.forward ? 'forwardAngle' : 'backAngle' ];
						// assertion
						if (isNaN(subj.coneAngle))
							console.log('isNaN(subj.coneAngle)');
					});
				});
				this.$hedgehog.each(function(i){
					if (this.coneAngle < 0)
						console.log('<0');
					this.coneAngle = Math.abs(this.coneAngle / 2);
					// assertion
					if (isNaN(this.coneAngle))
						console.log('isNaN(this.coneAngle)');
				});
			}
			else {
				// при четном кол-ве сходящихся лучей (ребер)
				var sum = [0, 0];
				this.$hedgehog.each(function(i){
					sum[i % 2] += this.forwardAngle;
				});
				if (Math.abs(sum[0] - sum[1]) < 1e-6 && Math.abs(sum[0] - Math.PI) < 1e-6){
					// если сумма углов через один равна Пи, то беск. кол-во решений
					// выбираем лучшее...
					var alfa = 0;
					var mins = [9, 9];
					this.$hedgehog.each(function(i){
						this.coneAngle = alfa;
						mins[i % 2] = Math.min(mins[i % 2], alfa);
						var forwardAngle = this.forward ? this.forwardAngle : this.backAngle;
						alfa = forwardAngle - alfa;
						// assertion
						if (isNaN(alfa))
							console.log('isNaN(alfa)');
					});
					var mid = (mins[0] + mins[1]) / 2;
					this.$hedgehog.each(function(i){
						this.coneAngle += mid - mins[i % 2];
						// assertion
						if (isNaN(this.coneAngle))
							console.log('isNaN(this.coneAngle)');
					});
				}
				else {
					// иначе решений нет
					//console.warn('Cone.unify(): zero solution');
					
					throw 'Cone.unify(): zero solution';
				}
			}
			
			// аккумуляция значений вычисленых coneAngle для различных соседних углов лучу (ребру)
			/*
			this.$hedgehog.each(function(i){
				var angle = this.coneAngle;
				
				var key = product.pinAccumKey(this);
				accum.cone[key] = accum.cone[key] || new AngleSet;
				accum.cone[key].add(angle, 1000);
				var revLeft = mirrorKey(key);
				accum.cone[revLeft] = accum.cone[revLeft] || new AngleSet;
				accum.cone[revLeft].add(angle, 1);
			});
			*/
			
			//console.log('direct', this.$hedgehog.map(function(){ return this.coneAngle }))
		}
		else{
			console.error('accum depricated call');
			throw 'accum depricated call';
			/*
			
			// край фигуры
			// попытка вытащить из аккумулятора
			var found, foundMaxus;
			this.$hedgehog.each(function(i){
				var curr = this;
				var key = product.pinAccumKey(curr);
				var keySense = new RegExp(
						key
						.replace(/none/g, '(?:\\d+|none)')
						.replace(/(\d+)/g, '(?:$1|none)')
					);
				
				var angle, maxus = 0;
				var angleSols = new AngleSet;
				for (var k in accum.cone)
					if (keySense.test(k))
						maxus = angleSols.merge(accum.cone[k], maxus);
				
				var solus = 0;
				for (var a in angleSols){
					if (angleSols[a] == maxus){
						solus++;
						angle = a;
					}
				}
				
				if (solus == 1 && (!found || maxus > foundMaxus)){
					curr.coneAngle = parseFloat(angle);
					
					// registration
					//accum.cone[key] = accum.cone[key] || new AngleSet;
					//accum.cone[key].add(angle, 1000);
					//var left = mirrorKey(key);
					//accum.cone[left] = accum.cone[left] || new AngleSet;
					//accum.cone[left].add(angle, 1);

					//console.log('add solution for key', key, 'with solutions set', angleSols)
					
					// assertion
					if (isNaN(curr.coneAngle))
						console.log('isNaN(curr.coneAngle)');
					
					// order founded
					found = i;
					foundMaxus = maxus;
					//return false;
				}
				else{
					//console.log('Cone.unify():', solus, 'solutions for ', key, angleSols, 'by', accum.cone);
				}
			});
			
			if (found !== undefined){
				var length = this.$hedgehog.length;
				
				//if (length == 2)
					//console.log('found', found, 'length', length);
				
				for (var incr = 1, back = 0; incr >= -1; incr -= 2, back = 1){
					var i = found;
					var curr = this.$hedgehog[i];
					while((i = (i + incr + length) % length) != found) {
						var prev = curr;
						curr = this.$hedgehog[i];
						
						var sum = back ?
							(prev.forward ? prev.backAngle : prev.forwardAngle) :
							(prev.forward ? prev.forwardAngle : prev.backAngle);
						
						// hardcode for situation when non-fuller must be breaked (PI * 4 / 5 gt 2.5)
						if (sum > 2.5){
							//console.log('cones sum > 2.5, sum is', sum);
							break;
						}
						
						curr.coneAngle = (sum > Math.PI ? Math.PI * 2 - sum : sum) - prev.coneAngle;
						
						if (curr.source.selvage && prev.source.selvage)
							break;
					}
				}
			}
			else{
				var keys = this.$hedgehog.map(function(i){ return product.pinAccumKey(this) });
				var lens = $.map(keys, function(key){ return key.replace(/^\S+ (\d+).*$/, '$1') });
				var acc = {};
				$.each(accum.cone, function(key, as){
					for (var i = 0, l = lens.length; i < l; i++)
						if (key.split(lens[i]).length > 1)
							acc[key] = as;
				});
				console.log('Cone angle for keys', keys, 'not found in accum', acc);
			}
			*/
		}
		
		// control shot
		if (this.$hedgehog.filter(function(){ return isNaN(this.coneAngle) }).length)
			console.log('Cone-' + unifier, 'cone without angle detected', this.$hedgehog);
		if (this.$hedgehog.filter(function(){ return this.coneAngle > Math.PI / 2 }).length)
			console.log('Cone-' + unifier, 'cone with angle gt PI/2', this.$hedgehog);
		
		return this.cache.coneUnifier =
			'Cone-' + unifier;
	},
	
	// оконцовщик ребра
	getTail: function(line){
		// take origin line figure
		line = line.origin;

		$.inArray(this.vertex, line.$vertexes) >= 0 || console.log('its not my line', this);
		
		var tail = Product.Connector.Piped.prototype.getTail.apply(this, arguments);
		
		this.unify();
		var vertex = this.vertex, product = this,
			pinIndex, pinCount = this.$hedgehog.length;
		
		this.$hedgehog.each(function(i){
			if (this.source == line){
				pinIndex = i;
				tail.coneAngle = this.coneAngle;
				tail.coneSide = (i != 0) ? (i != pinCount - 1) ? 'both' : 'left' : 'right';
				return false;
			}
		});
		
		//var $nearLines = line.$nearLinesByVertex[vertexIndex];
		
		return tail;
	},
	
	plot: function(canvas, opts){
		Product.Connector.Piped.prototype.plot.apply(this, arguments);
		
		var plotter = new Plotter(canvas, $.extend(opts, {
				width: 2,
				height: 2,
				margin: 20, // px
				R: this.R,
				textZoom: 2
			}));
		
		var angle = 0;
		this.$hedgehog.each(function(){
			angle += this.forward ? this.backAngle : this.forwardAngle;
			
			// degree
			var degree = Math.round(1800 * this.coneAngle / Math.PI) / 10;
			plotter.text(
				{x: 1 + .618 * Math.cos(angle), y: 1 + .618 * Math.sin(angle)},
				degree * 2 + '°'
			);
		});
	}
});

/**
 * Пол-шишки тоже шишка
 * - это просто нос, полуконус дальше будет
 */
Product.Connector.Nose = function(vertex, params) {
	Product.Connector.apply(this, [$.extend({
		type: 'Nose',
		vertex: vertex,
		point: vertex.$points[0],
		//bilateral: true,
		whirlAsClock: 0
	}, params || {})]);
	// type cast
	this.whirlAsClock = (1 == this.whirlAsClock);
	// no pipe
	this.Dpipe = 0;
}
.inherits(Product.Connector.Piped)
.override({
	afterTailsGiven: function(tail, i, line){
		var product = this;
		var wall = this.$hedgehog.map(function(){
			if (this.source === line)
				return null;
			//if (!this.pin || !tail.backDir)
			//	console.error('must to be');
			if (this.pin.cosWith(tail.backDir) > 0) // angle must be < 90 degrees
				return null;
			var is = Vector.dotProduct(
					Vector.crossProduct(this.pin, tail.backDir),
					product.point // strangen center not found
				) > 0;
			if (is ^ !product.whirlAsClock)
				return null;
			return product.getTail(this.source).wall;
		})[0];
		
		if (wall){
			//var oi = Vector.subtract(tail.inner, tail.outer);
			//tail.walker0clone = tail.walker0clone || tail.walkers[0].clone();
			//var revert = Vector.dotProduct(Vector.crossProduct(tail.walker0clone, oi), tail.backDir) < 0 ? 0 : 1;
			var pp = [], 
				dd = $.map(tail.walkers, function(w, j){
					pp[j] = Vector.add(product.point, w);
					return wall.result(pp[j]) //Math.abs( wall.result(pp[j]) );
				}),
				index = (dd[0] > dd[1]) ? 0 : 1,
				p = pp[index],
				d = dd[index],
				walker = tail.walkers[index];
			
			// wall.result(p + X * tail.backDir) = 0
			var td = wall.result(Vector.add(p, tail.backDir));
			var X = d / (d - td);
			
			tail.walkers[index].add(Vector.scale(tail.backDir, X));
		}
		return tail;
	}
});


/**
 * GoodKarma
 */
Product.Connector.GoodKarma = function(vertex, params) {
	Product.Connector.apply(this, [$.extend({
		type: 'GoodKarma',
		vertex: vertex,
		point: vertex.$points[0],
		whirlAsClock: 0
	}, params || {})]);
	// type cast
	this.whirlAsClock = (1 == this.whirlAsClock);
	// no pipe
	this.Dpipe = 0;
}
.statics({
	lineSeparatelyForFaces: true
})
.inherits(Product.Connector.Joint)
.override({
	ribPlaneOffset: function(line){
		return  0;
	},

	// ребро, в которое упирается заданное ребро
//	ribWall: function(line) {
//		var product = this;
//
//		return _.filter(figure.$primitives, function(p) {
//			return 1
//				&& p.bindedFace === line.bindedFace
//				&& p !== line
//				&& _.indexOf(p.origin.$vertexes, product.vertex) > -1;
//		})[0];
//	},

	// оконцовщик хвоста ребра
	getTail: function(line){
		var vertex = this.vertex,
			point = vertex.$points[0],
			secondVertex = line.origin.$vertexes[ line.origin.$vertexes[0] === vertex ? 1 : 0 ],
			secondPoint = secondVertex.$points[0],

			plane = line.product.getPlane(true),
			planeNormal = plane.normal();

		var wallLine = _.find(line.bindedFace.bindedLines, function(any) {
				return 1
					&& any !== line
					&& _.contains(any.origin.$vertexes, vertex);
			}),
			wallPlane = wallLine.product.getPlane(true).clone().normalize(),

			thirdVertex = wallLine.origin.$vertexes[ wallLine.origin.$vertexes[0] === vertex ? 1 : 0 ],
			thirdPoint = thirdVertex.$points[0];

		// ориентируем плоскость стены относительно незадействованной здесь вершины лайна
		if (wallPlane.result(secondPoint) < 0)
			wallPlane.revert();

		// двигаем стену в сторону сабжевого ребра, учитывая толщину ребра
		wallPlane.D += (
			this.whirlAsClock ^
			(Vector.dotProduct(
				Vector.crossProduct(
					secondPoint.clone().subtract(point),
					thirdPoint.clone().subtract(point)
				),
				point
			) > 0)
		? -1 : 1) * wallLine.product.thickness / 2;

		var outer = plane.crossWithRay(
				wallPlane.crossWithRay(
					point,
					secondPoint.clone().subtract(point)
				),
				Vector.crossProduct( line.product.getOuterPlane().normal(), wallPlane.normal() )
			);

		return {
			// точка внешней поверхности
			outer: outer,
			center: Vector(0),
			wall: wallPlane,
			vertex: vertex
		};
	},

	unify: function(){
		return 'GoodKarma ' + Product.Connector.prototype.unify.apply(this);
	}
});



/**
 * Semicone
 */
Product.Connector.Semicone = function(vertex, params) {
	Product.Connector.apply(this, [$.extend({
		type: 'Semicone',
		vertex: vertex,
		point: vertex.$points[0]
	}, params || {})]);
	// no pipe ?
	//this.Dpipe = 0;
}
.statics({
	lineSeparatelyForFaces: true
})
.inherits(Product.Connector.Joint)
.override({
	ribPlaneOffset: function(line){
		return  0;
	},

	// оконцовщик хвоста ребра
	getTail: function(line){
		var vertex = this.vertex,
			point = vertex.$points[0],
			secondVertex = line.origin.$vertexes[ line.origin.$vertexes[0] === vertex ? 1 : 0 ],
			secondPoint = secondVertex.$points[0],

			plane = line.product.getPlane(true),
			planeNormal = plane.normal(),

			thirdVertex = _.difference(line.bindedFace.$sub.vertex.get(), [vertex, secondVertex])[ 0 ],
			thirdPoint = thirdVertex.$points[0],

			wallPlane = new Plane(
				Vector.crossProduct(
					// bisectrix
					Vector.add(
						Vector.subtract(secondPoint, point).normalize(),
						Vector.subtract(thirdPoint, point).normalize()
					),
					// radius vector
					point
				),
				point
			).normalize();

		// ориентируем плоскость стены относительно незадействованной здесь вершины лайна
//		if (wallPlane.result(secondPoint) < 0)
//			wallPlane.revert();

		var outer = plane.crossWithRay(
				wallPlane.crossWithRay(
					point,
					secondPoint.clone().subtract(point)
				),
				Vector.crossProduct( line.product.getOuterPlane().normal(), wallPlane.normal() )
			);

		return {
			// точка внешней поверхности
			outer: outer,
			center: Vector(0),
			wall: wallPlane,
			vertex: vertex
		};
	},

	unify: function(){
		return 'Semicone ' + Product.Connector.prototype.unify.apply(this);
	}
});

			/**
 * Определение продукта "ребро"
 * 
 * @author   popitch [at yandex.ru]
 */

Product.Rib = function() {
	Product.apply(this, arguments);

	// expected
	this.line || console.log('no line specified');

	// init plane cache
	this.cache.plane = {};
}
.inherits(Product)
.override({
	// отдает плоскость, рассекающую ребро пополам и проходящую через центры радиусов вершин
	getPlane: function(useBindedFace) {
		if (this.cache.plane[useBindedFace])
			return this.cache.plane[useBindedFace];

		var line = this.line,
			vv = line.origin.$subsets.get(),
		    pp = [ vv[0].$points[0], vv[1].$points[0] ],
		    center = line.origin.center || pp[0].center || Vector(0);// ? pp[1].center ? pp[0].center.equals(pp[1].center) ? pp[0].center :
		/**
		 * 1) A*cx + B*cy + C*cz + D = 0
		 * 2) A*x0 + B*y0 + C*z0 + D = d0
		 * 3) A*x1 + B*y1 + C*z1 + D = -d1
		 * 4) A*A  + B*B  + C*C      = 1
		 */
		// если line на краю, либо данный конец на краю, то смещение 0
		var d0 =  vv[0].product.ribPlaneOffset(line),
			d1 = -vv[1].product.ribPlaneOffset(line);
		var sols = Solutions.twoPlanesAndSphere(
				new Plane(Vector.subtract(pp[0], center), -d0),
				new Plane(Vector.subtract(pp[1], center), -d1)
			);
		sols.length ||
			console.log('no plane no cry');

		var lineNormal = Vector.crossProduct(Vector.subtract(pp[0], center), Vector.subtract(pp[1], center));

		for (var i = 0; i < sols.length; i++) {
			var n = sols[i],
				D = -Vector.dotProduct(n, center); // 1) D
			var pl = sols[i] = new Plane(n, D);
			pl.sign = n.cosWith(lineNormal) > 0 ? 1 : -1;
			
			// debug
			pl.reflect = vv[i].reflection;
			pl.mapi = n.mapi;
			pl.solutions = n.solutions;
			
			/** tests
			 * 1) A*cx + B*cy + C*cz + D = 0
			 * 2) A*x0 + B*y0 + C*z0 + D = d0
			 * 3) A*x1 + B*y1 + C*z1 + D = -d1
			 */
			var testc = pl.A*center.x + pl.B*center.y + pl.C*center.z + pl.D;
			var test0 = pl.A*pp[0].x + pl.B*pp[0].y + pl.C*pp[0].z + pl.D;
			var test1 = pl.A*pp[1].x + pl.B*pp[1].y + pl.C*pp[1].z + pl.D;
			if (testc != 0)
				console.warn('!' + testc);
			if (Math.abs(d0 - test0) > 1e-6)
				console.warn('d0:' + d0 + ' != ' + test0);
			if (Math.abs(d1 - test1) > 1e-6)
				console.warn('d1:' + d1 + ' != ' + test1);
		}
		
		if (sols.length == 2 && sols[0].sign == sols[1].sign)
			console.log({ sols: sols, lineNormal: lineNormal });
		
		// выбор решения
		var plane = ( sols.length == 2 ? sols[0].sign == 1 ? sols[0] : sols[1] : sols[0] ).normalize();

		// Good Karma's (+Semicone) workaround
		if (useBindedFace === true && line.bindedFace) {
			// move plane to side of binded face
			var testPoint = _.filter(line.bindedFace.$sub.vertex, function(vertex) {
					return !_.contains(line.origin.$vertexes, vertex);
				})[0].$points[0];
			plane.D += (plane.result(testPoint) < 0 ? 1 : -1) * this.thickness / 2;
		}

		return this.cache.plane[useBindedFace] = plane;
	},
	
	// отдает конфигурацию оконцовок
	/*final*/ getTails: function(){
		var line = this.line;

		if (this.cache.tails)
			return this.cache.tails;

		// 1. get tails separately
		var tails = line.origin.$vertexes.map(function() {
				var vertex = this,
					tail = vertex.product.getTail(line);

				tail.product = vertex.product;
				return tail;
			});

		// 2. common calculator
		tails = this.afterGetTails(tails);

		// 3. separate again
		tails = tails.map(function(i){
			if (!this.iwas){
				this.product.afterTailsGiven(this, i, line);
				this.iwas = 1;
			}
			return this;
		});

		return this.cache.tails = tails;
	},
	
	afterGetTails: function(tails){
		return tails;
	},
	
	getOuterPlane: function(){
		// !! допущения:
		// 1. both centers is (0,0,0)

		var A = this.line.$points[0], a = A.length(),
		    B = this.line.$points[1], b = B.length(),
			AB = B.clone().subtract(A).normalize();
		//var doubleSquare = Vector.crossProduct(A, B);

		var comp = Vector.dotProduct(A, AB);
		var P = AB.scale(-comp).add(A);

		return new Plane(P, P);
	},

	// максимальная длина продукта,
	maxLength: function(){}
});

/**
 * Брус
 * @param Figure line
 * @param {} params
 */
Product.Rib.Beam = function(params) {
	Product.Rib.apply(this, [
		$.extend({
			type: 'Beam',
			title: 'Брус',
			width: 0,     // ширина бруса (в радиусах) - параллельна радиусу
			thickness: 0, // толщина
			R: 0          // радиус сферы должен быть известен!
		}, params || {})
	]);
	
	// габариты приводим к долям радиуса, а получаем в неких единицах измерения
	this.width *= (this.measure || 1) / this.R;
	this.thickness *= (this.measure || 1) / this.R;
}
.inherits(Product.Rib)
.override({
	afterGetTails: function(tails) {
		var product = this;
		var outerPlane = this.getOuterPlane();
		var plane = this.getPlane(true);

		return tails.each(function(i){
			var dir = Vector.subtract(tails[1-i].outer, this.outer);
			
			// save for given
			this.backDir = dir.clone();
			
			// .outer принадлежат срединной плоскости (ориентирующей продукт)
			// .inner считаем
			var vect = Vector.crossProduct(plane.normal(), this.wall.normal());
			vect.scale(
				Vector.dotProduct(Vector.subtract(this.outer, this.center), vect) > 0 ? -1 : 1
			);
			var cos = vect.cosWith(dir),
				sin = Math.sqrt(1 - cos*cos);
			vect.normalize().scale(product.width / sin);
			this.inner = Vector.add(this.outer, vect);
			
			// для определения отреза требуются вектора отклонения вершин от этой плоскости к бокам бруса
			this.walkers = [ Vector.crossProduct(this.wall.normal(), outerPlane.normal()) ];
			this.walkers[0].normalize();
			this.walkers[0].scale(0.5 * product.thickness / plane.normal().cosWith(this.walkers[0]));
			this.walkers[1] = this.walkers[0].clone().scale(-1);
			
			if (this.coneAngle){
				// Cone this
				dir.normalize().scale( product.thickness / 2 / Math.tan(this.coneAngle) / sin );
				this.walkers[0].add(dir);
				this.walkers[1].add(dir);
			}
		});
	},
	
	unify: function(){
		var product = this;
		var tails = this.getTails();

		var unifiers = tails.map(function(i){
			var tail = this;
			var dir = Vector.subtract(tails[1-i].outer, this.outer).normalize();
			var hOI = Vector.subtract(this.inner, this.outer).scale(.5);
			this.middle = Vector.add(tail.outer, hOI);

			var direct = Vector.dotProduct(Vector.crossProduct(this.walkers[0], hOI), dir) > 0;

			// [left, right] bevels
			this.bevelSides = [
				Vector.component(this.walkers[ direct ? 0 : 1 ], dir),
				Vector.component(this.walkers[ direct ? 1 : 0 ], dir)
			];

			// если меньше градуса отклонение, то считаем что его нет
			for (var j = 0; j < 2; j++){
				if (Math.abs(this.bevelSides[j] * 50) < product.thickness / 2)
					this.bevelSides[j] = 0;
			}

			// left = right = 0
			this.bevelZero = !this.bevelSides[0] && !this.bevelSides[1];
			// left + right = 0
			this.bevelStraight = Math.abs(this.bevelSides[0] + this.bevelSides[1]) < 1e-6;
			// left = right
			this.bevelsEquals = Math.abs(this.bevelSides[0] - this.bevelSides[1]) < 1e-6;
			// else
			this.bevelChaos = !this.bevelZero && !this.bevelStraight && !this.bevelsEquals;

			// inner bevel (outer bevel = 0)
			this.bevelInner = Vector.component(hOI, dir);

			var PI2 = Math.PI / 2;
			var inner = Math.atan2(this.bevelInner, product.width / 2);
			var left = Math.atan2(this.bevelSides[0], product.thickness / 2);
			var right = Math.atan2(this.bevelSides[1], product.thickness / 2);

			return ( !Math.round(inner*500) ? 'T' : (inner < PI2 ? 'A' : 'B') + Product.angleUnify(inner < PI2 ? PI2 - inner : inner - PI2) ) +
				(this.bevelZero ?
					'Piped' :
				(this.bevelStraight ?
					'Joint/GoodKarma/Semicone' + (left > 0 ? 'L' : 'R') + Product.angleUnify(left > 0 ? left : -left) :
				(this.coneAngle ?
					'Cone' + Product.angleUnify(this.coneAngle)
				: // Nose only
					(Math.round(left*500) ? '-L' + Product.angleUnify(left) + dihedralMark(left, inner) : '') + 
					(Math.round(right*500) ? '-R' + Product.angleUnify(right) + dihedralMark(right, inner) : '')
				))) +
				'(' + tail.vertex.index + ')';

			function dihedralMark(side, inner){
				var normalOuter = new Vector(0, 0, 1);
				var byOuter = new Vector(Math.sin(side), Math.cos(side), 0);
				var toInner = new Vector(Math.sin(inner), 0, Math.cos(inner));
				var normalCut = Vector.crossProduct(toInner, byOuter);
				var dihedral = normalCut.angleWith(normalOuter);
				var mark = Product.angleUnify(PI2 - dihedral);
				return mark == 0 ? '' : '-I' + mark;
			}
		});
		unifiers.sort();

		// for calc min/max
		this.midLength = tails[0].middle.distance(tails[1].middle);

		return 'Length' + Product.lengthUnify(this.maxLength() * product.R) +
						' ' + unifiers.get().join(' ');
	},
	
	maxLength: function(){
		var maxLength = this.midLength;
		this.getTails().each(function(){
			if (_.contains(['Joint', 'GoodKarma', 'Semicone'], this.vertex.product.type))
				maxLength += Math.abs(this.bevelSides[0]);
			//if (this.bevelInner < 0)
				maxLength += Math.abs(this.bevelInner);
		});
		return maxLength;
	},

	minLength: function(){
		var minLength = this.midLength;
		this.getTails().each(function(){
			if (_.contains(['Joint', 'GoodKarma', 'Semicone'], this.vertex.product.type))
				minLength -= Math.abs(this.bevelSides[0]);
			//if (this.bevelInner > 0)
				minLength -= Math.abs(this.bevelInner);
		});
		return minLength;
	},

	model: function(onExport){
		var product = this;
		var tails = this.getTails();
		
		var pp = [];
		$([tails[0].outer, tails[0].inner, tails[1].inner, tails[1].outer]).each(function(i){
			var tail = tails[i >> 1];
			
			if (isNaN(tail.walkers[0].x) || isNaN(tail.inner.x) || isNaN(tail.outer.x))
				console.log('isNaN(tail.walker.x) || isNaN(tail.inner.x) || isNaN(tail.outer.x)');
			
			pp.push(this.clone().add(tail.walkers[0]));
			pp.push(this.clone());
			pp.push(this.clone().add(tail.walkers[1]));
		});
		
		var faces = [
			[ pp[1], pp[0], pp[3], pp[4] ], // one tail sides
			[ pp[2], pp[1], pp[4], pp[5] ],
			[ pp[10], pp[11], pp[8], pp[7] ], // second tail sides
			[ pp[9], pp[10], pp[7], pp[6] ],
			[ pp[4], pp[3], pp[6], pp[7], pp[8], pp[5]], // inner face
			[ pp[0], pp[9], pp[6], pp[3] ], // side
			[ pp[2], pp[5], pp[8], pp[11] ], // side
			[ pp[1], pp[2], pp[11], pp[10], pp[9], pp[0] ], // outer face
		];
		
		// model on export
		if (onExport){
			return faces;
		}
		
		var cont = new Figure.Container({
				figures: $([
						faces.pop() // outer only
					]).map(function(){
						// ориентация полигона
						var polypp = this, outerp;
						
						$(pp).each(function(){
								if (-1 == $.inArray(this, polypp))
									outerp = this;
							});
						
						var normal = Vector.crossProduct(
								Vector.subtract(polypp[1], polypp[0]),
								Vector.subtract(polypp[2], polypp[0]));
						if (Vector.dotProduct(Vector.subtract(outerp, polypp[0]), normal) < 0){
							var reverted = [], p;
							while (p = polypp.shift())
								reverted.push(p);
							polypp = reverted;
						}
						
						return new Figure({
							type: 'polygon',
							points: polypp
						});
					}),
				points: pp,
				source: this.line
			});
		cont.$primitives.each(function(){
			this.figure = product.line.figure;
		});
		return cont;
	},

	// draw product scheme on canvas
	// @param DomElement canvas
	// @param Object options  plotter options
	plot: function(canvas, options){
		var product = this;
		var tails = this.getTails();
		var sizeOfTail = _.map(tails, function(tail) {
				return 2 * _.max(_.map(tail.bevelSides, Math.abs)) + Math.abs(tail.bevelInner);
			}),
			xGaps = [];

		var margin = 20, // px
			milkRight = 20, // px
			xyRatio = ( $(canvas).width() - 2 * margin - milkRight ) / ( $(canvas).height() - 2 * margin ),
			maxLength = product.maxLength(),
			maxVisibleLength = xyRatio * product.thickness,
			gapVisibleWidth = product.thickness / 4;

		if (product._xGaps) {
			xGaps = product._xGaps;
		}
		else
		if (maxLength > maxVisibleLength) {
			var productDelta = product.maxOuterLength - product.minOuterLength;

			if (productDelta) {
				var visibleProductLength = maxVisibleLength * (.6 + .4 * (maxLength - product.minOuterLength) / productDelta),
					gapDelta = maxLength - visibleProductLength;
			} else {
				var gapDelta = maxLength - maxVisibleLength;
			}

			var gapStart = sizeOfTail[0] + (maxLength - sizeOfTail[0] - sizeOfTail[1]) / 2 - gapDelta / 2;

			if (gapStart > sizeOfTail[0]) {
				xGaps.push({
					x: gapStart,
					from: gapDelta + gapVisibleWidth,
					to: gapVisibleWidth
				});
			} else {
				gapDelta = maxLength - sizeOfTail[0] - sizeOfTail[1];
				xGaps.push({
					x: sizeOfTail[0],
					from: gapDelta + gapVisibleWidth,
					to: gapVisibleWidth
				});
			}

			//console.log(product.line.index, maxVisibleLength, maxLength, xGaps[0])

			// store for single gaps style for both side- and front- scheme views
			product._xGaps = xGaps;
		}

        options = options || {};

		if (options.sideView) {
			// rotate tails to swap
			_.each(tails, function(tail) {
				var bi = tail.__bevelInner = tail.bevelInner,
					bs = (tail.__bevelSides = tail.bevelSides)[0];

                tail.bevelInner = Math.abs(bs);
                tail.bevelSides = Math.sign(bs) > 0 ? [-bi, bi] : [bi, -bi];
			});

            var plotter = new Plotter.Beam(canvas, $.extend(options, {
					depth: this.thickness,
					width: this.maxOuterLength,
					length: this.maxLength(),
					height: this.width, // ширина доски (бруса)
					margin: margin,
					milkRight: milkRight,
					resize: false,
					R: this.R,
					xGaps:  xGaps,
					textZoom: 2,
					fixOutXProportion: true
				}))
                .ydivision(0, 'left', 'top')
                .ydivision(this.width, 'left', 'bottom')
                .start(this, tails[0])
                .tail(tails[0], false, 'left', this)
                .offset({ x: this.midLength })
                .tail(tails[1], true, 'right', this)
                .end();

            // return tails from swap
            _.each(tails, function(tail) {
                tail.bevelInner = tail.__bevelInner;
				tail.bevelSides = tail.__bevelSides;
            });

			return;
		}

		var plotter = new Plotter.Beam(canvas, $.extend(options, {
				depth: this.width,
				width: this.maxOuterLength,
				length: this.maxLength(),
				height: this.thickness, // толщина доски (бруса) рисуется в высоту
				margin: margin,
				milkRight: milkRight,
				resize: false,
				R: this.R,
				xGaps:  xGaps,
				textZoom: 2,
				fixOutXProportion: true
			}))
			.ydivision(0, 'left', 'top')
			.ydivision(this.thickness, 'left', 'bottom')
			.start(this, tails[0])
			.tail(tails[0], false, 'left', this)
			.offset({ x: this.midLength })
			.tail(tails[1], true, 'right', this)
			.end();
		
		// side angles of face
		var line = this.line;
		var byLineNormal = Vector.crossProduct( tails[0].vertex.$points[0], tails[1].vertex.$points[0] );
		
		$.each(line.origin.$super.face, function(i, face){
			if (line.bindedFace && line.bindedFace !== face) return;

			var a = Product.angleUnify( face.product.normal.angleWith(byLineNormal) ) / 10;
			a = (a > 90) ? 180 - a : a; // figure is convex
			var outer = face.$points.not(line.$points)[0];

			var y = (outer.cosWith(byLineNormal) <= 0) ? product.thickness : 0;

			plotter.textByLine(
				'∟' + a + '°',
				{y: y, x: 0},
				{y: y, x: xGaps[0] ? xGaps[0].x + product.thickness * 3 : product.thickness * 5},
				{
					otherSide: !y
				}
			);
		});
	},
	
	materialName: function(){
		return __('Beams') + ' ' +
			Math.round(this.width * this.R / .001) + 'x' + 
			Math.round(this.thickness * this.R / .001)  + __('mm');
	},
	
	meter: function(){
		const mat = this.materialName(),
			meter = {};
		
		// площадь основания (допущение: срез был по оси Y)
		if (1 === this.line.origin.$super.face.length){
			const facePoints = this.line.origin.$super.face[0].$points.get();
			var pp = this.line.$points.get();
			
			// orient line's pp as in his face
			const ppIndex = pp.map(p => facePoints.indexOf(p));
			if ((ppIndex[0] + 1) % facePoints.length !== ppIndex[1]) {
				pp = pp.reverse();
			}
			
			//pp = pp.map(p => (p = p.clone(), p.y = 0, p));
			
			// partial area
			meter[__('Base area, m2')] = (pp[0].x * pp[1].z - pp[1].x * pp[0].z) / 2 * this.R * this.R;
		}
		
		meter[mat] = {};
		meter[mat][__('Total length of beams, m')] = this.maxLength() * this.R;
		meter[mat][__('Total volume of beams, m3')] = this.midLength * this.width * this.thickness * this.R * this.R * this.R;
		meter[mat]['range:' + __('Beam length, mm')] = Product.lengthUnify(this.maxLength() * this.R);
		//meter[mat]['max:' + __('Max. beam length, mm')] = Product.lengthUnify( this.maxLength() * this.R );
		
		// угол сопряжения граней
		var $faces = this.line.origin.$super.face;
		var $normals = $faces.length == 2 ? $faces.map(function(){
				return Vector.crossProduct(
					Vector.subtract(this.$points[0], this.$points[1]),
					Vector.subtract(this.$points[2], this.$points[1])
				);
			}) : false;
		var edgel = $normals ? $normals[0].angleWith($normals[1]) : false;
		if (edgel) {
			meter[mat]['range:' + __('Angle between faces, °')] = 180 - 180 * edgel / Math.PI;
		}
		
		return meter;
	}
});

			/**
 * Доска для чертежей
 */

Plotter = function(canvas, opts){
	var plotter = this;
	
	// canvas
	this._$canvas = $(canvas);
	this._context = this._$canvas[0].getContext('2d');
	this._width = this._$canvas.width() - (opts.milkRight || 0);
	this._height = this._$canvas.height();

	// canvas style
	this._context.lineCap = 'round',
	this._context.lineJoin = 'bevel',
	this._context.miterLimit = 10;
	this._context.globalAlpha = .9;

	// styles
	this._styles = {
		solid: {
			strokeStyle: "black",
			lineWidth: 2
		},
		backside: {
			strokeStyle: "gray",
			lineWidth: 2
		},
		division: {
			strokeStyle: "rgba(141,141,141,.5)",
			lineWidth: 1
		},
		white: {
			strokeStyle: "white",
			lineWidth: 2
		},
		fillWhite: {
			fillStyle: 'white'
		}
	};

	this._dashedLine = false;
	this._dashedStep = 5;
	
	this._currentStyle = {
		line: {},
		point: {}
	};

	// props & defaults
	$.extend(this, opts);

	// text zooming
	this.textZoom = this.textZoom || 1;

	this.R = opts.R || 1;
	this.margin = opts.margin || 16; // px

	// input frame (data)
	this._frameIn = {
		l: 0,
		t: 0,
		w: opts.width || console.log('Plotter: no width'),
		h: opts.height || console.log('Plotter: no height')
	};

	// output frame (canvas)
	this._frameOut = {
		l: this.margin,
		t: this.margin,
		w: this._width - 2 * this.margin,
		h: this._height - 2 * this.margin
	};

	// plot current offset
	this._offset = {
		x: opts.offset && opts.offset.x || 0,
		y: opts.offset && opts.offset.x || 0
	};

	// gaps on x
	this.xGaps = opts.xGaps || [];
	this.xGapDelta = 0;
	$(this.xGaps).each(function(){
		plotter.xGapDelta += this.to - this.from;
	});
	this._frameIn.w += this.xGapDelta;

	// пропорции
	if (opts.fixOutXProportion) {
		this._frameOut.w = this._frameOut.h * (this._frameIn.w / this._frameIn.h);
	} else {
		this._frameOut.h = this._frameOut.w * (this._frameIn.h / this._frameIn.w);
	}

	// resize
	if (opts.resize) {
		var of = this._offset;
		this._offset = {x: 0, y: 0};
		this.resizeCanvasHeightByInputProportion();
		this._offset = of;
	}

	// ratio
	this.ratio = {
		x: this._frameOut.w / this._frameIn.w,
		y: this._frameOut.h / this._frameIn.h
	};
	this.ratio.l = Math.sqrt( this.ratio.x * this.ratio.y );
}
.override({
	resizeCanvasHeightByInputProportion: function(){
		var height = this._plane({x:0, y:this._frameIn.h}, {y: this.margin}).y;
		this._frameOut.h = height - 2 * this.margin;
		this._$canvas[0].height = height;
	},

	_setStyle: function(subj, style){
		if (style instanceof Array) {
			for (var i = 0; i < style.length; i++) {
				this._setStyle(subj, style[i]);
			}
			return;
		}
		var values = typeof style == 'object' ? style : this._styles[style] || {};
		for (var k in values) {
			this._context[k] = values[k];
		}
		if (subj == 'line'){
			this._dashedLine = (style == 'backside' || style == 'dashed');
		}
	},

	_plane: function(p, offset){
		var plotter = this;
		var xGapDelta = 0;
		$(this.xGaps).each(function(){
			if (plotter._offset.x + p.x > this.x + this.from)
				xGapDelta += this.to - this.from;
		});
		return {
			x: Math.round(
				this._frameOut.l +
				((this._offset.x + p.x + xGapDelta) - this._frameIn.l) * this._frameOut.w / this._frameIn.w +
				(offset && offset.x || 0)
			),
			y: Math.round(
				this._frameOut.t +
				((this._offset.y + p.y) - this._frameIn.t) * this._frameOut.h / this._frameIn.h +
				(offset && offset.y || 0)
			)
		};
	},

	_moveTo: function(p){
		this._context.moveTo(p.x + .5, p.y + .5);
	},

	_lineTo: function(p){
		this._context.lineTo(p.x + .5, p.y + .5);
	},

	offset: function(o){
		if (!o) return this._offset;
		this._offset.x += o.x || 0;
		this._offset.y += o.y || 0;
		return this;
	},

	line: function(p1, p2, style, outputXY){
		var ctx = this._context;
		ctx.save();
		this._setStyle('line', style);
		ctx.beginPath();

		if (this._dashedLine) {
			var s = outputXY ? p1 : this._plane(p1);
			var f = outputXY ? p2 : this._plane(p2);
			var length = Math.sqrt( (s.x - f.x) * (s.x - f.x) + (s.y - f.y) * (s.y - f.y) );
			var step = this._dashedStep;
			var v = { x: (f.x - s.x) * step / length, y: (f.y - s.y) * step / length };
			var p = { x: s.x + v.x / 2, y: s.y + v.y / 2 };
			for (var i = 0, l = 0; l < length; i++) {
				this[ (i % 2) ? '_lineTo' : '_moveTo' ](p);
				l += step;
				p.x += l < length-1 ? v.x : v.x / 2;
				p.y += l < length-1 ? v.y : v.y / 2;
			}
		} else {
			this._moveTo( outputXY ? p1 : this._plane(p1) );
			this._lineTo( outputXY ? p2 : this._plane(p2) );
		}

		ctx.closePath();
		ctx.stroke();
		ctx.restore();
		return this;
	},

	circle: function(pos, r, style){
		pos = this._plane(pos);
		r *= this.ratio.l;

		var ctx = this._context;
		ctx.save();
		this._setStyle('circle', style);

		ctx.beginPath();
		ctx.arc(pos.x, pos.y, r, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		ctx.restore();
		return this;
	},

	text: function(pos, text, opts){
		opts = $.extend({
			planePos: true,
			fillStyle: 'black',
			strokeStyle: 'black'
		}, opts || {});
		pos = opts.planePos ? this._plane(pos) : pos;

		var ctx = this._context;
		ctx.save();
		ctx.textBaseline = opts.valign || 'middle';
		ctx.textAlign = opts.align || 'center';
		ctx.font = (opts.fontSize || 0.5) * this.textZoom + "em monospace, Optimer, verdana";
		ctx.fillStyle = opts.fillStyle;
		ctx.strokeStyle = opts.strokeStyle;
		ctx.strokeWidth = 2;
		ctx.translate(pos.x, pos.y);
		ctx.rotate(opts.rotate || 0);
		ctx.fillText(text, 0, 0);
		ctx.restore();
		return this;
	},

	textByLine: function(text, A, B, opts) {
		if (text === undefined) {
			//debugger;
		}

		opts = opts || {};
		var pos = this.average(A, B, opts.q || 1/2),
		    length = Math.sqrt( (A.x - B.x)*(A.x - B.x) + (A.y - B.y)*(A.y - B.y) ),
			normal = {x: (A.y - B.y) / length, y: (B.x - A.x) / length };
		var rev = (opts.sup && normal.y) ^ opts.otherSide > 0 ? -1 : 1;
		pos.x += rev * normal.x * 10 / this.ratio.x;
		pos.y += rev * normal.y * 10 / this.ratio.y;
		var angle = Math.atan2(A.y - B.y, A.x - B.x);
		this.text(pos, text, $.extend({
			rotate: angle < Math.PI/2 ? angle > -Math.PI/2 ? angle : angle + Math.PI : angle - Math.PI,
			fontSize: 0.6
		}, opts));
	},

	vertical: function(x, style){
		this.line(
			this._plane({x:x, y:0}, {y: -this.margin}),
			this._plane({x:x, y:this._frameIn.h}, {y: this.margin}),
			style,
			true // dont plane again
		);
		return this;
	},

	xdivision: function(x, align, valign, anchor){
		this.vertical(x, 'division');

		// division
		var floatDiv = (x + this._offset.x) * this.R / 0.001;
		
		// rounding
		var div = Math.round(
				(typeof anchor != 'undefined') ? anchor + Math.round(floatDiv - anchor) : floatDiv
			);
		
		var pos = this._plane({
				x: x,
				y: (valign == 'top') ? 0 : this._frameIn.h
			},{
				y: (valign == 'top') ? -this.margin : this.margin
			});
		
		//this.text(pos, div, {valign: valign, align: align});
		var ctx = this._context;
		ctx.textBaseline = valign;
		ctx.textAlign = align;
		ctx.font = "14px monospace, Optimer, verdana";//(0.5) * this.textZoom + "em Optimer, verdana";
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		ctx.strokeWidth = 2;
		ctx.fillText(div, pos.x, pos.y);
		return floatDiv;
	},

	horizontal: function(y, style){
		this.line(
			this._plane(
				{ x: 0, y: y },
				{ x: -this.margin }
			),
			this._plane(
				{ x: this._frameIn.xmax || this._frameIn.w, y: y },
				{ x: this.margin }
			),
			style,
			true // dont plane coordinates again
		);
		// gaps on x
		var plotter = this;
		setTimeout(function(){
			$(plotter.xGaps).each(function(){
				plotter.line(
					{x: this.x, y:y},
					{x: this.x + this.from+0.00001, y:y},
					['white', 'dashed']
				);
			});
		}, 1);
		return this;
	},

	ydivision: function(y, align, valign){
		this.horizontal(y, 'division');

		// division
		var div = Math.round( (y + this._offset.y) * this.R / 0.001 );
		var pos = this._plane({
				x: (align == 'left') ? 0 : this._frameIn.w,
				y: y
			},{
				x: (align == 'left') ? -this.margin : this.margin
			});
		var ctx = this._context;
		ctx.textBaseline = valign;
		ctx.textAlign = align;
		ctx.font = "14px monospace, Optimer, verdana"; //(0.5) * this.textZoom + "em Optimer, verdana";
		ctx.fillStyle = "black";
		this._context.fillText(div, pos.x, pos.y);
		return this;
	},

	vertexLabel: function(index, pos, ribs) {
		var rayCount = _.filter(ribs, function(rib) {
				return rib === rib.origin;
			}).length;

		pos = this._plane(pos);

		// sun-connector
		var ctx = this._context, r = 12;
		ctx.strokeStyle = "#ccc";
		ctx.strokeWidth = 1;
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, r, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		// rays
		rayCount = rayCount || 6;
		for (var i = 0.3; i < rayCount; i++) {
			var offset = {
				x: r * Math.cos(i * 2 * Math.PI / rayCount),
				y: r * Math.sin(i * 2 * Math.PI / rayCount)
			};
			ctx.beginPath();
			ctx.moveTo(pos.x + offset.x, pos.y + offset.y);
			ctx.lineTo(pos.x + 2 * offset.x, pos.y + 2 * offset.y);
			ctx.closePath();
			ctx.stroke();
		}

		// index
		ctx.fillStyle = "#000";
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.textWeight = 'bold';
		ctx.font = "12px monospace, Optimer, verdana";
		ctx.fillText(index || 'n/a', pos.x, pos.y);
	},
	
	planeAngle: function(A, B, C, style){
		style = $.extend({
			strokeStyle: 'gray',
			fillStyle: 'black'
		}, style);
	
		var AB = this.distance(A, B);
		var BC = this.distance(B, C);
		var CA = this.distance(C, A);
		var angle = Math.acos( (AB*AB + BC*BC - CA*CA) / (2 * AB * BC) );
			angle = Math.round(angle * 180 * 5 / Math.PI) / 5;
		
		var Ar = Math.atan2(A.y - B.y, A.x - B.x);
		var Cr = Math.atan2(C.y - B.y, C.x - B.x);
		var R = 62;
		
		A = this._plane(A);
		B = this._plane(B);
		C = this._plane(C);
		
		var ctx = this._context;
		ctx.save();
		this._setStyle('circle', style);

		ctx.beginPath();
		ctx.arc(B.x, B.y, R, Ar, Cr, true);
		ctx.stroke();
		ctx.restore();
		
		// degrees
		var bstx = (Ar + Cr) / 2 + ( Math.abs(Ar - Cr) > Math.PI ? Math.PI : 0 );
		//bstx += bstx > Math.PI + 1e-5 ? -Math.PI : 0;
		if (angle) {
			this.text(
				{
					x: B.x + (R + 10) * Math.cos(bstx),
					y: B.y + (R + 10) * Math.sin(bstx)
				},
				angle + '°',
				_.extend({
					rotate: bstx + Math.PI / 2 + (bstx > 0 ? Math.PI : 0),
					planePos: false,
					fontSize: 0.6
				}, style)
			);
		}
		return this;
	},

	average: function(a, b, q){
		q = (q === undefined) ? .5 : q;
		return {
			x: a.x * (1 - q) + b.x * q,
			y: a.y * (1 - q) + b.y * q
		};
	},
	
	distance: function(A, B){
		return Math.sqrt( (A.x - B.x)*(A.x - B.x) + (A.y - B.y)*(A.y - B.y) );
	}
});

/**
 * Чертеж отрезов бруса
 */

Plotter.Beam = function(canvas, opts){
	Plotter.apply(this, arguments);

	this._frameIn.xmax = opts.length || opts.width;
}
.inherits(Plotter)
.override({
	start: function(product, tail){
		this._offset = {
			x: tail.coneAngle ? Math.abs(tail.bevelInner) :
				Math.max(
					Math.abs(tail.bevelInner + (!tail.bevelChaos && tail.bevelSides[0])),
					Math.abs(tail.bevelInner + (!tail.bevelChaos && tail.bevelSides[1]))),
			y: 0
		};

		this._left = [null, null];
		this._right = [null, null];

		return this;
	},

	tail: function(tail, turnMe, whichSide/*nothing*/, product){
		var TURN = turnMe ? -1 : 1;
		var outerLink, innerLink;
		
		var outerCenter = { x: -TURN * tail.bevelInner, y:  this._frameIn.h / 2 },
			innerCenter = { x:  TURN * tail.bevelInner, y:  this._frameIn.h / 2 };
		
		if (tail.bevelZero || tail.bevelsEquals || tail.bevelChaos){
			outerLink = this.xdivision(outerCenter.x, turnMe ? 'left' : 'right', 'top');
			innerLink = this.xdivision(innerCenter.x, turnMe ? 'right' : 'left', 'bottom');
		}
		
		var outerBevels = [];
		
		for (var i = 0; i < 2; i++){
			var TOP = (turnMe ^ i) ? 1 : 0;
			var outerBevel = { x: outerCenter.x + TURN * tail.bevelSides[i], y: TOP ? 0 : this._frameIn.h },
				innerBevel = { x: innerCenter.x + TURN * tail.bevelSides[i], y: TOP ? 0 : this._frameIn.h };
			
			outerBevels.push(outerBevel);
			
			if (!tail.bevelZero && tail.bevelsEquals && i || tail.bevelChaos){
				outerLink = this.xdivision(outerBevel.x, turnMe ? 'left' : 'right', 'top', outerLink);
				innerLink = this.xdivision(innerBevel.x, turnMe ? 'right' : 'left', 'bottom', innerLink);
			}
			if (tail.bevelStraight && !tail.bevelsEquals){
				outerLink = this.xdivision(outerBevel.x, turnMe ? 'left' : 'right', TOP ? 'top' : 'bottom', outerLink);
				innerLink = this.xdivision(innerBevel.x, turnMe ? 'right' : 'left', TOP ? 'top' : 'bottom', innerLink);
			}
			
			//var style = (whichSide == 'middle') || (whichSide == 'right' ^ outerCenter.x < innerCenter.x) ? 'backside' : 'solid';
			this.line(outerCenter, outerBevel, 'solid');
			this.line(innerCenter, innerBevel, ((innerCenter.x > outerCenter.x) ^ turnMe) ? 'dashed' : 'solid');
			
			function accum(accum, val, method){
				return accum == null ? val : Math[method](accum, val);
			}
			this._left[TOP] = accum(this._left[TOP], this._offset.x + outerBevel.x, 'min');
			this._right[TOP] = accum(this._left[TOP], this._offset.x + outerBevel.x, 'max');
		
			// angle between outer plane and plane to cut
			if (
				(tail.bevelZero && !i) || // Piped (once)
				(!tail.bevelStraight && !i) || // Cone (once)
				(!tail.bevelZero && tail.bevelStraight && (turnMe ^ outerBevel.x > outerCenter.x)) // side what near to rub center (Joint, GoodKarma, Semicone)
			) {
				var byOuter = new Vector(outerBevel.x - outerCenter.x, outerBevel.y - outerCenter.y, 0);
				var toInner = new Vector(innerCenter.x - outerCenter.x, innerCenter.y - outerCenter.y, this.depth);

				var normalCut = Vector.crossProduct(byOuter, toInner).scale(i ? 1 : -1),
					normalOuter = new Vector(0, 0, this.depth),
					normalSide = new Vector(0, 1, 0);

				var angleToOuter = Math.round(
						normalOuter.angleWith(normalCut)
					/ Math.PI * 1800) / 10,

					angleToSide = Math.round(
						normalSide.angleWith(normalCut)
					/ Math.PI * 1800) / 10;

				var pp = i ? [outerBevel, outerCenter] : [outerCenter, outerBevel];

				this.textByLine(
					'∟' +
						angleToOuter +
					'°',
					pp[0], pp[1],
					{
						q: turnMe ? 0.382 : 0.618,
						fillStyle: 'blue'
					}
				);
			}
			else if (
				tail.bevelStraight && // side what far from rib center (Joint, GoodKarma)
				(!tail.bevelZero || i) // <exclude> Piped (once)
			) {
				// angle on a outer plane
				var planeAngle = [outerCenter, outerBevel, { x: outerBevel.x, y: outerCenter.y }];

				if (turnMe ^ i ^ outerBevel.x > outerCenter.x)
					planeAngle.reverse();

				this.planeAngle.apply(this,  planeAngle.concat([{ fillStyle: 'red', strokeStyle: 'gray' }]));
			}
		}
		
		if (!tail.bevelZero && tail.bevelsEquals || tail.bevelChaos){
			this.line(innerCenter, outerCenter, 'dashed');
		}
		
		// label
		this.vertexLabel(tail.vertex.index, outerCenter, tail.vertex.$super.line);
		
		// angle on outer plane (Cone)
		if (!tail.bevelStraight){
			var planeAngle = [outerBevels[0], outerCenter, outerBevels[1]];

			if (!tail.bevelChaos ^ tail.bevelsEquals)
				planeAngle = planeAngle.reverse();

			this.planeAngle.apply(this,  planeAngle.concat([{ fillStyle: 'red', strokeStyle: 'gray' }]));
		}
		
		return this;
	},

	end: function(){
		this._offset = {x:0, y:0};
		this.line({ x: this._left[1], y: 0 }, { x: this._right[1], y: 0 }, 'solid');
		this.line({ x: this._left[0], y: this._frameIn.h }, { x: this._right[0], y: this._frameIn.h }, 'solid');
		return this;
	}
});

/**
 * Чертеж треугольника
 */

Plotter.Triangle = function(canvas, opts){
	var plotter = this;

	var angles = this.angles = opts.angles;
	var radiuses = this.radiuses = opts.radiuses;
	this.maxR = Math.max.apply(null, radiuses);
	this.$lines = opts.$lines;

	// вершины A, B, C
	var ABC = this.ABC = [];
	a = -Math.PI / 2;
	for (var i = 0; i < 3; i++) {
		ABC[i] = {
			x: radiuses[i] * Math.cos(a),
			y: radiuses[i] * Math.sin(a)
		}
		a -= 2 * angles[(i + 2) % 3];
	}
	
	// основания высот от вершин на чертеже Ah, Bh, Ch
	var ABCh = this.ABCh = [];
	for (var a = 0; a < 3; a++) {
		var b = (a + 1) % 3, c = (a + 2) % 3;
		ABCh[a] =
			Vector.project(
				Vector.subtract(ABC[a], ABC[c]),
				Vector.subtract(ABC[b], ABC[c])
			).add(ABC[c]);
	}

	// размер полотна
	opts = $.extend({
		width: 2 * this.maxR,
		height: 2 * this.maxR,
		margin: 20, // px
		resize: true,
		offset: {x: this.maxR, y: this.maxR}
	}, opts);

	// parent::constructor()
	Plotter.apply(this, [canvas, opts]);
}
.inherits(Plotter)
.override({
	outerCircle: function(){
		return this.circle({x: 0, y: 0}, this.maxR, ['gray', 'fillWhite']);
	},
	
	triangle: function(){
		for (var i = 0; i < 3; i++) {
			var A = this.ABC[i], B = this.ABC[(i + 1) % 3], C = this.ABC[(i + 2) % 3];
			var Ah = this.ABCh[i];
			this.line(B, C, {
				strokeStyle: productPalette.line[this.$lines[i].order].css,
				lineWidth: 3
			});
			this.line(A, Ah, {
				strokeStyle: '#bbb'
			});
		}
		for (var i = 0; i < 3; i++) {
			var A = this.ABC[i], B = this.ABC[(i + 1) % 3], C = this.ABC[(i + 2) % 3];
			var Ah = this.ABCh[i];
			
			this.textByLine(Product.lengthUnify(this.distance(B, Ah)), B, Ah, { q:.38 });
			this.textByLine(Product.lengthUnify(this.distance(Ah, C)), Ah, C, { q:.62 });
			
			var edge = Math.round(this.abcEdges[i] * 180 * 10 / Math.PI) / 10;
			this.textByLine(this.$lines[i].index + '  ∟' + edge + '°', B, C, {
				fontSize: 0.9,
				fillStyle: productPalette.line[this.$lines[i].order].css
			});
			
			this.textByLine(Product.lengthUnify(this.distance(A, Ah)), A, Ah, { q:.9 });
		}
		return this;
	},
	
	heights: function(){
		
	},

	vertexes: function(){
		var plotter = this;
		$(this.ABC).each(function(i){
			// todo: странная проблема разной направленности массивов angles и $vertexes, хотя источник у них один..
			// подогнал в ручную сверяя со схемой
			var n = 2 - i;
			plotter.vertexLabel(plotter.$vertexes[n].index, this, plotter.$vertexes[n].$super.line)
		});
	}
});
			/**
 * Накопитель значений и их статистика
 *
 * var meter = new Meter;
 *
 * meter.push( [ groupKey ], { key: value, .. } );
 *
 */

Meter = function(){
	this.values = {};
}
.override({
	// push()
	push: function(map, context) {
		if (typeof map == 'string') {
			var h = {}, args = [].slice.call(arguments, 0);
			h[args[0]] = args[1];
			args[1] = h;
			return this.push.apply(this, args.slice(1));
		}

		context = context || this.values;
		for (var k in map){
			var matchFn = /^(\w+):(.*)$/.exec(k),
				fn = ( matchFn && this.operators[matchFn[1]] ) ? matchFn[1] : 'default';
			
			if (fn == 'default' && typeof(map[k]) == 'object'){
				context[k] = context[k] || {};
				this.push(map[k], context[k]);
			}
			else{
				context[k] = this.operators[fn](context[k], map[k]);
			}
		}
	},
	
	operators: {
		default: function(accum, value) { // sum
			return (accum || (isNaN(value) ? '' : 0)) + value;
		},
		
		min: function(accum, value) {
			return (accum == undefined) ? value : Math.min(accum, value);
		},
		
		max: function(accum, value) {
			return (accum == undefined) ? value : Math.max(accum, value);
		},
		
		swing: function(accum, value) {
			return {
				min: (accum && accum.min != undefined) ? Math.min(accum.min, value) : value,
				max: (accum && accum.max != undefined) ? Math.max(accum.max, value) : value
			};
		},
		
		range: function(accum, value) {
			return {
				min: (accum && accum.min != undefined) ? Math.min(accum.min, value) : value,
				max: (accum && accum.max != undefined) ? Math.max(accum.max, value) : value
			};
		}
	},
	
	reporters: {
		swing: function(value) {
			return (value.max || 0) - (value.min || 0);
		},
		
		range: function(value) {
			return (value.max - value.min < 1e-6) ? value.min : [value.min, '-', value.max];
		}
	},
	
	reportText: function(context, indent, report){
		indent = indent || '';
		context = context || this.values;
		report = report || [];
		
		var objects = [];
		
		for (var k in context) {
			var matchFn = /^(\w+):(.*)$/.exec(k), 
				key = k, value = context[k];
			
			if (matchFn) {
				if (this.reporters[matchFn[1]])
					value = this.reporters[matchFn[1]](value);
				key = matchFn[2];
			}
			
			if (typeof value == 'object' && !(value instanceof Array)){
				objects.push({
					key: '\n' + indent + key.bold(),
					val: false 
				});
				this.reportText(value, indent + '    ', objects);
			}
			else {
				report.push({
					key: indent + key, 
					val: value
				});
			}
		}
		
		$.each(objects, function(){
			report.push(this);
		});
		
		var maxKeyLength = 0;
		return (arguments.length == 3) ? 0 :
			$(report).each(function(){
				maxKeyLength = Math.max(this.key.length, maxKeyLength);
				return this;
			}).map(function(){
				while (this.key.length < maxKeyLength)
					this.key += ' ';
				var key = this.key.replace(/(,\s*.)(\d)(\D|$)/, '$1&sup$2;$3');
				return key + '  ' + (this.val ? 
					$.map(
						$.makeArray(this.val),
						function(val){
							return typeof val == 'number' ? Meter.numberFormat(val) : val;
						}
					).join('') :
				'');
			}).get().join('\n');
	}
});

Meter.numberFormat = function(val){
	if (!val) return '';
	var val100 = Math.round(val / .01);
	return Math.floor(val100 / 100) + (
		(val100 % 100) ? 
			'.' + (
				(val100 % 100) < 10 ? '0' : ''
			) +
			(val100 % 100)
		: ''
	);
}

			/* extra */
			!function(){
	var __pointsEnum, __points, __faces, __lines;

	/**
	 * Деление фейсов фигуры (равные дуги)
	 * @return this
	 */
	Figure.prototype.splitFaces_EA = function(N) {
		var figure = this;

		// init
		__faces = [];
		__lines = {};
		__points = {};
		__pointsEnum = 0;

		// save prev points
		_.each(figure.$points, function(p){
			__points[p._enum = __pointsEnum++] = p;
		});

		var triIndex = 0;
		_.each(this.$primitives, function(p){
			if (p.type == 'face') {
				// init edge points
				var A = p.points[0], B = p.points[1], C = p.points[2];
				var AB = [A, B], BC = [B, C], CA = [C, A];
				_.each([AB, BC, CA], function(segment) {
					var a = segment[0], b = segment.pop();
					for (var i = 1; i < N; i++)
						segment.push(edgePoint(a, b, i, N));
					segment.push(b);
				});

				// main
				var up = [A], down;
				for (var n = 1; n <= N; n++) {
					down = [ CA[N - n] ];
					for (var i = 1; i < n; i++) {
						if (n == N) {
							down.push(BC[N - i]);
						} else {
							var point = findPoint(
								AB[n], CA[N - n],
								BC[N - i], AB[i],
								CA[N - n + i], BC[n - i],
								A, i
							);
							down.push(point);
						}
					}
					down.push(AB[ n ]);

					// collect faces
					for (i = 0; i < n; i++) {
						addFace(up[i], down[i + 1], down[i], [n, N - i, N - n + i + 1], triIndex);
						if (i > 0)
							addFace(down[i], up[i - 1], up[i], [n - 1, N - i, N - n + i], triIndex);
					}
					up = down;
				}
				triIndex++;
			}
		});

		__points = _.map(_.values(__points), function(point) {
			return new Figure({
				type: 'vertex',
				points: [point],
				center: point.center
			});
		});

		console.log('points', __points.length, 'lines', _.values(__lines).length, 'faces', __faces.length);

		this.$primitives = $( __points.concat(_.values(__lines)).concat(__faces) );

		return this;
	}

	Figure.prototype.splitFaces_EA_updateToMexican = function(N) {
		var lines = _.filter(this.$primitives, function(p){
				return (p.type == 'line') // && (2 <= p.sideDistance && p.sideDistance < N);
			});

		Figure.equalizeLineGroups(
			_.groupBy(lines, 'sideDistance')
		);

		return this;
	}

	Figure.prototype.splitFaces_updateToClassII = function() {
		console.time('Update to Class II');

		// prepare relations
		this.relations();

		// first wave
		var prevVertexWave = this.$primitives.map(function() {
			this.sideDistance = 0;
			this.underWave = (this.type == 'vertex') && this.$points[0].pptPoint;
			this.underLine = this.underWave ? 5 : 0;
			this.underLine1 = 0;
			return this.underWave ? this : null;
		});
		var lines = [];

		do {
			var vertexWave = [], lineWave = [];
			_.each(prevVertexWave, function(prevVertex) {
				var prevSideDistance = prevVertex.sideDistance;
				_.each(prevVertex.$super.line, function(line) {
					if (!line.underWave) {
						lineWave.push(line);
						_.each(line.$sub.vertex, function(vertex) {
							if (vertex != prevVertex && !vertex.lastWave) {
								if (!vertex.underLine)
									vertexWave.push(vertex);
								vertex.sideDistance += prevSideDistance;
								if (1 == prevSideDistance)
									vertex.underLine1++;
								vertex.underLine++;
							}
						});
						line.underWave = true;
					}
				});
			});

			_.each(vertexWave, function(vertex) {
				vertex.sideDistance /= vertex.underLine;
				if (vertex.underLine % 2)
					vertex.sideDistance++;
				else if (vertex.underLine == vertex.underLine1)
					vertex.sideDistance = 0;
				vertex.lastWave = true;
			});

			_.each(lineWave, function(line) {
				var lengths = _.pluck(line.$sub.vertex, 'sideDistance');
				if (lengths[0] == lengths[1] && lengths[0] == 1)
					line.sideDistance = 0;
				else
					line.sideDistance = lengths[0] + lengths[1];
			});

			lines = lines.concat(lineWave);

			prevVertexWave = vertexWave;
		} while (lineWave.length);

		console.log(_.groupBy(lines, 'sideDistance'));

		Figure.equalizeLineGroups(
			_.groupBy(lines, 'sideDistance')
		);

		// clean
		_.each(this.$primitives, function(f) {
			delete f.sideDistance;
			delete f.underLine;
			delete f.underWave;
			delete f.lastWave;
		});

		console.timeEnd('Update to Class II');

		return this;
	};

	Figure.prototype.splitFaces_updateToClassIII = function (M, N) {
		var figure = this,
			subdivisionScheme = [],
			pointsEnum = _.chain(this.$points).pluck('_enum').max().value();

		isNaN(pointsEnum) && console.error('points enum is', pointsEnum);

		M = Number(M);
		N = Number(N);
		var S = M * M + M * N + N * N;

		// prepare entities relation info
		this.relations();

		// make a Class III M,N subdivision scheme
		!function() {
			var base = [
					[-M - N, N, M], // n vector
					[-M, M + N, - N] // m vector
				],
				trio = [ [0, 0], [N, M], [M + N, -N] ],
				trioSquare = square.apply(null, trio);

			for (var y = -N; y < M; y++) {
				for (var x = 0; x < M + N; x++) {
					triangle([x, y], [x, y + 1], [x + 1, y]);
					triangle([x + 1, y + 1], [x + 1, y], [x, y + 1]);
				}
			}

			// assertions
			if (subdivisionScheme.length != S) {
				console.error('Class III: bad scheme with size', subdivisionScheme.length, 'expected', S);
			}
			var integer = _.chain(subdivisionScheme).map(function(f) {
					return _.map(f, roundS);
				}).value(),
				stat = _.chain(integer).flatten(true).map(function(p){ return _.sortBy(p).join() }).countBy().value();
			_.each(stat, function(count) {
				if (count % 3) {
					console.error('Class III: wrong symmetry on scheme', integer);
				}
			});
			// end

			function triangle(A, B, C) {
				var center = alter2base([ (A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3 ]),
					points = _.map([A, B, C], alter2base),
					inFace = _.countBy(points, function(p) { return _.all(p, positive) });

				if (
					_.all(center, positive) // center belongs to face
					|| (
						!_.some(center, negative) && // center belongs to edge of face
						inFace["true"] > inFace["false"] // inner vertices GT outer
					)
				) {
					subdivisionScheme.push(points);
					/*if (inFace["false"] == 2 || (!_.some(center, negative) && !_.all(center, positive))) {
						console.log(
							'scheme face: center', center, //_.map(center, function(c){ return Math.round(c*S*3) / 3 }),
							inFace, '=>', points
						);
					}*/
				}
			}

			// translate coords to face-based
			function alter2base(alter) {
				var coords = _.reduce(base, function(result, axis, axisIndex) {
						_.each(axis, function(axisCoord, axisCoordIndex) {
							result[axisCoordIndex] += axisCoord * alter[axisIndex] / S;
						});
						return result;
					}, [1, 0, 0]);

				// assertions
				Math.abs(_.reduce(coords, sum, 0) - 1) < 1e-9
					|| console.error('Class III: bad coords of subdivision point', coords);
				_.filter(coords, negative).length <= 1
					|| console.error('Class III: bad coords with greater than 1 negative', coords);

				return coords;
			}

			// 2d
			function diff(B, A) {
				return [B[0] - A[0], B[1] - A[1]];
			}
			function square(A, B, C) {
				A = diff(A, C);
				B = diff(B, C);
				return A[0] * B[1] - A[1] * B[0];
			}
		}();

		//console.log(_.map(faces, function(pp) { return _.map(pp, function(p) { return p[0] + p[1] + p[2] }) }));

		// subdivision each face by scheme
		!function() {
			var prevPrimitivesLength = figure.$primitives.length,
				addedLines = {};

			_.each(_.where(figure.$primitives, { type: 'vertex' }), function(vertex) {
				vertex.$points[0].vertex = vertex;
			});

			_.each(_.where(figure.$primitives, { type: 'face' }), function(face) {
				var facePoints = face.$points;

				_.each(subdivisionScheme, function(pointsCoords) {
					var points = _.map(pointsCoords, coords2point);

					figure.$primitives.push(new Figure({
						type: 'face',
						points: points
					}));
					//console.log('+ face');

					_.each([1, 2, 0], function(p1, p2) {
						var lineIndex = [points[p1].vertex._enum, points[p2].vertex._enum].sort().join();

						if (!addedLines[lineIndex]) {
							if (_.find(figure.$primitives, function(p) {
								return p.type == 'line' && (
									(points[p1] === p.$points[0] &&points[p2] === p.$points[1]) ||
									(points[p1] === p.$points[1] &&points[p2] === p.$points[0])
								);
							})) {
								console.error('doublet line detected for', points[p1], points[p2]);
							}
							figure.$primitives.push(new Figure({
								type: 'line',
								points: [ points[p1], points[p2] ],
								__enums: [points[p1].vertex._enum, points[p2].vertex._enum]
							}));
							addedLines[lineIndex] = true;
							//console.log('+ line');
						} else {
							//console.log('- decline line', points[p1].vertex._enum, points[p2].vertex._enum);
						}
					});
				});

				function coords2point(coords) {
					var baseIndex = _.indexOf(coords, 1);
					if (baseIndex != -1) {
						// PPT point
						//console.log('PPT point happens')
						return facePoints[baseIndex];
					}

					var negativeIndex = _.indexOf(coords, _.filter(coords, negative)[ 0 ]);
					if (negativeIndex != -1) {
						// point outside of the face
						var linePoints = _.filter(facePoints, function(point, index) {
								return index !== negativeIndex;
							}),
							negativeLine = _.find(face.$sub.line, function(line) {
								var points = line.$points;
								return 0
									|| (points[0] === linePoints[0] && points[1] === linePoints[1])
									|| (points[0] === linePoints[1] && points[1] === linePoints[0]);
							}),
							negativeFace = _.find(negativeLine.$super.face, function(f) { return f !== face }),
							negativePoint = _.difference(negativeFace.$points.get(), face.$points.get())[ 0 ],
							negativeOrdinate = coords[ negativeIndex ],
							base = [];

						/**
						 * Translate coordinates to other face by negative ordinate
						 *
						 *  (A, B, C) * (a, b, c) === (A, B, A + B - C) * (x, y, z)
						 * =>
						 *  z = -c
						 *  y = b + c
						 *  x = a + c
						 * where
						 *  (A + B - C)  new base ordinate
						 */
						coords = _.map(coords, function(coord, index) {
							base[index] = (negativeIndex === index) ? negativePoint : facePoints[index];
							return (negativeIndex === index) ? - coord : coord + negativeOrdinate;
						});

						// assert
						Math.abs(_.reduce(coords, sum, 0) - 1) < 1e-9
							|| console.error('Class III: bad coords for negative face', coords);
					}

					// find or calc new point
					return (function(face, base) {
						face.classIIIPoints = face.classIIIPoints || [];

						// make stamp of face-based coordinates of point
						var stamp = _.map(base, function(point, index) {
								return {
									order: point.vertex._enum,
									value: coords[index]
								};
							});
						stamp = _.pluck(_.sortBy(stamp, 'order'), 'value');

						// try to find similar class III point produced previous to
						var found = _.find(face.classIIIPoints, function(memo) {
								return _.all(memo.stamp, function(memoOrdinate, index) {
									return Math.abs(memoOrdinate - stamp[index]) < 1e-9;
								});
							});
						if (found) {
							//console.log('memoized point happens')
							return found.point;
						}

						// else calc new point
						var point = _.reduce(base, function(absolute, axis, index) {
								absolute.x += axis.x * coords[index];
								absolute.y += axis.y * coords[index];
								absolute.z += axis.z * coords[index];
								return absolute;
							}, new Vector);

						// memoize
						face.classIIIPoints.push({
							stamp: stamp,
							coords: coords,
							point: point
						});

						// new vertex promitive
						point.vertex = new Figure({
							type: 'vertex',
							points: [ point.normalize() ],
							negative: !!negativeFace
						});
						figure.$primitives.push(point.vertex);
						//console.log('+ vertex');

						point._enum = ++pointsEnum;

						return point;
					})(negativeIndex != -1 ? negativeFace : face, negativeIndex != -1 ? base : facePoints);
				}
			});

			// remove previous primitives
			figure.$primitives = $(
				_.filter(figure.$primitives, function(primitive, index) {
					// clear points memo
					delete primitive.classIIIPoints;

					return index >= prevPrimitivesLength ||
						primitive.type == 'vertex'; // save PPT points only
				})
			);

			// figure points
			figure.$points = $(
				_.chain(figure.$primitives).pluck('$points').invoke('get').flatten().uniq().value()
			);
		}();

		return this;

		// any helpers
		function positive(v) { return v > 1e-9 }
		function negative(v) { return v < -1e-9 }
		function zero(v) { return Math.abs(v) < 1e-9 }
		function sum(a, b) { return a + b }
		function roundS(p) { return _.map(p, function(c) { return Math.round(c*S) }) }
	};


	/**
	 * Lines length equalizer
	 * @static
	 * @return undefined
	 */
	Figure.equalizeLineGroups = function(lineGroups, diffPrecision, stepLimit) {
		console.time('Lengths equalizer');

		diffPrecision = diffPrecision || 1e-12;
		stepLimit = stepLimit || 300;

		var usedPoints = _.chain(lineGroups).flatten().pluck('$points').invoke('get').flatten().uniq().value();

		var step = 0;
		do {
			var delta = 0;
			// prepare
			_.each(lineGroups, function(lines, group) {
				_.each(lines, function(line) {
					line.__dirs = [
						Vector.subtract(line.$points[0], line.$points[1]),
						Vector.subtract(line.$points[1], line.$points[0])
					];
					line.length = line.__dirs[0].length();
				});
			});
			// change
			_.each(lineGroups, function(lines, group) {
				var lengths = _.pluck(lines, 'length'),
					diff = _.max(lengths) - _.min(lengths);

				if (diff < diffPrecision) return;
				delta = Math.max(delta, diff);

				var avgLength = _.reduce(lengths, function(a, l){ return a + l }, 0) / lengths.length;

				// try to move points
				_.each(lines, function(line) {
					var q = (avgLength - line.length) / line.length / 4;
					_.each(line.$points, function(point, i) {
						point.add(Vector.scale( line.__dirs[i], q ) );
					});
				});
			});
			// normalize
			_.each(usedPoints, function(point) {
				point.normalize();
			});
		} while (delta && ++step < stepLimit);

		// clean
		_.each(lineGroups, function(lines, group) {
			_.each(lines, function(line) {
				delete line.__dirs;
			});
		});

		console.log('Lengths equalizer: lines reduced by', step, 'steps, final delta', delta);
		console.timeEnd('Lengths equalizer');
	}

	// private helpers
	function findPoint(a1, a2, b1, b2, c1, c2, control, step) {
		var planes = _.map([ [a1, a2], [b1, b2], [c1, c2] ], function(pair) {
			var normal = Vector.crossProduct(pair[0], pair[1]).normalize();
			return new Plane(normal, 0);
		});

		var ABC = [];
		for (var i = 0, j = 2; i < 3; j = i, i++) {
			var vars = $.map(Solutions.twoPlanesAndSphere(planes[i], planes[j]), function(v) {
				return Vector.dotProduct(v, control) > 0 ? v : null;
			});
			if (vars.length != 1)
				console.log('super bug');
			ABC.push(vars[0]);
		}

		// todo: calc triangle's center point optionally (Euler set)

		// 1) in-center +normalize
		//var point = incenter.apply(this, ABC).normalize();

		// 2) in-center3d
		var point = incenter3d(planes[0], planes[1], planes[2], control);

		// 3) centeroid + normalize
		//	V6 {vertex: 11, line: 10, face: 12}
		//var point = ABC[0].add(ABC[1]).add(ABC[2]).scale(1/3).normalize();

		// 4) out-center3d
//		var pl = [];
//		for (var i = 0, j = 2; i < 3; j = i++) {
//			var ACmid = Vector.add(ABC[i], ABC[j]).scale(1/2);
//			var ACnorm = Vector.subtract(ABC[i], ABC[j]).normalize();
//			pl.push( new Plane(ACnorm, ACmid).normalize() );
//		}
//
//		var solpp = [];
//		for (var i = 0, j = 2; i < 3; j = i++) {
//			var vars = $.map(Solutions.twoPlanesAndSphere(pl[i], pl[j]), function(v) {
//				return Vector.dotProduct(v, control) > 0 ? v : null;
//			});
//			if (vars.length != 1)
//				console.log('super bug');
//			solpp.push( vars[0] );
//		}
		//var point = solpp[0];

		// equals distances assertion
		//var testDist = _.map(planes, function(pl) { return pl.result(point) });
		//console.log( testDist, _.max(testDist) - _.min(testDist) );

		point._enum = __pointsEnum++;
		var key = [ a1._enum, a2._enum, step ].join();
		__points[key] = point;
		//console.log(key)

		return point;
	}

	function edgePoint(A, B, i, N, key) {
		key = key || (
			A._enum < B._enum ?
				[A._enum, B._enum, i].join() :
				[B._enum, A._enum, N - i].join()
			);

		if (i * 2 > N) return edgePoint(B, A, N - i, N, key);

		if (__points[key]) return __points[key];

		var cos = A.cosWith(B);
		var Y = Vector.subtract(B, A.clone().scale(cos)).normalize();
		var angle = Math.acos(cos) * i / N;
		var point = Y.scale(Math.sin(angle)).add( A.clone().scale(Math.cos(angle)) );

		point._enum = __pointsEnum++;
		point.triSide = true;
		__points[key] = point;
		//console.log(key)

		return point;
	}

	function addFace(A, B, C, sideDistances, triIndex) {
		__faces.push(new Figure({
			type: 'face',
			points: [A, B, C]
		}));
		_.each([ [B, C], [C, A], [A, B] ], function(pair, i) {
			var key = _.pluck(pair, '_enum').sort().join();
			//console.log(key);
			__lines[key] = __lines[key] || new Figure({
				type: 'line',
				points: pair,
				sideDistance: sideDistances[i],
				sideIndex: i,
				triIndex: triIndex
			});
		});
	}

	// plain incenter
	function incenter(A, B, C) {
		var AB = Vector.subtract(B, A);
		var AC = Vector.subtract(C, A);
		var BC = Vector.subtract(C, B);
		var Ab = AB.clone().normalize().add( AC.clone().normalize() );
		var angle = AB.angleWith(AC);
		var l = [AB.length(), AC.length(), BC.length()];
		var p = (l[0] + l[1] + l[2]) / 2
		var S = Math.sqrt( p * (p - l[0]) * (p - l[1]) * (p - l[2]) );
		var r = S / p;
		var incenter = Ab.scale(
			(r / Math.sin(angle / 2)) / Ab.length()
		).add(A);

		// assertion
		var a = Vector.distance(B, C), b = Vector.distance(A, C), c = Vector.distance(A, B);
		_.each([ [A,B,C], [B,C,A], [C,A,B] ], function(test) {
			var v1 = Vector.subtract(test[0], test[1]);
			var v2 = Vector.subtract(test[2], test[1]);
			var bisect = v1.clone().normalize().add( v2.clone().normalize() );
			var angle = v1.angleWith(v2);
			var a1 = v1.angleWith(bisect);
			var a2 = v2.angleWith(bisect);

			if (Math.abs(a1 + a2 - angle) > 1e-13)
				console.warn('a1 + a2 != angle');
			if (Math.abs(a1 - a2) > 1e-13)
				console.warn('a1 != a2');
		});

		return incenter;
	}

	// spherically incenter
	function incenter3d(p1, p2, p3, control) {
		var bisect1 = new Plane(p1.A - p2.A, p1.B - p2.B, p1.C - p2.C, p1.D - p2.D);
		var bisect2 = new Plane(p3.A - p2.A, p3.B - p2.B, p3.C - p2.C, p3.D - p2.D);

		var vars = $.map(Solutions.twoPlanesAndSphere(bisect1, bisect2), function(v) {
			return Vector.dotProduct(v, control) > 0 ? v : null;
		});
		if (vars.length != 1)
			console.error('incenter3d bug');
		return vars[0];
	}
}();
			Figure.prototype.clientDownload = function(whatExport) {
	const
		figureUnifier = location.hash.substr(1),
		figureFileName = figureUnifier.replace(/[^\w\.]/g, '_'),
		figureAcidName = 'Acidome_' + figureFileName.replace(/\W/g, '_');
	
	var obj = {
			points: [],
			faces: [],
			add: function(what, entity){
				what += 's';
				if (!entity.index){
					this[what].push(entity);
					entity.index = this[what].length;
				}
				return entity.index;
			},
			output: []
		},

		R = parseFloat(window.form.state.radius); // => m

	switch (whatExport) {
		case 'faces':
			const faces = _.filter(figure.subs('face'), face => ! face.removed && face.live);
			
			_.each(faces, function(face){
				console.log('g ' + figureAcidName + ' ' + face.unifier.replace(/\W/g, '_'));
				obj.output.push('g ' + figureAcidName + ' ' + face.unifier.replace(/\W/g, '_'));
				
				var points = _.map(face.$points, function(vect){
						if (!vect.index){
							vect.scale(R);
							obj.output.push('v ' + vect.x + ' ' + vect.y + ' ' + vect.z);
						}
						return obj.add('point', vect);
					});
				obj.output.push('f ' + points.join(' '));
				
				obj.output.push('end');
			});
			break;
		
		case 'frame':
		default:
			whatExport = 'frame';
			const
				lines = _.chain(figure.subs('face'))
					.map(face => {
						return face.bindedLines || face.subs('line').get();
					})
					.flatten()
					.unique()
					.value(),
				
				ribs = lines
					.filter(line => ! line.removed && line.live)
					.map(line => {
						return {
							faces: line.product.model(true),
							unifier: line.product.unify().replace(/\s/g, '_') +
								' ' + line.index
						};
					});
			
			$.each(ribs, function(r, rib){
				obj.output.push('g ' + figureAcidName + ' ' + rib.unifier);
				
				var faces = $.map(rib.faces, function(face){
					var points = $.map(face, function(vect){
						if (!vect.index){
							vect.scale(R);
							obj.output.push('v ' + vect.x + ' ' + vect.y + ' ' + vect.z);
						}
						return obj.add('point', vect);
					});
					obj.output.push('f ' + points.join(' '));
					return obj.add('face', points);
				});
				obj.output.push('surf 0.0 1.0 0.0 1.0 ' + faces.join(' '));
				obj.output.push('end');
			});
			break;
	}

	// with header
	obj = [
		'##',
		'# //acidome.ru/lab/calc/#' + figureUnifier,
		'#',
		'# (c) ' + (new Date).getFullYear() +' acidome.ru/lab/calc',
		'# Under CC-BY-SA license',
		'# File units = ' + /*milli*/ 'meters', 
		'#',
		''
	].concat(obj.output).join('\r\n');

	const fileName = figureFileName + ' ' + whatExport + '.obj';
	
	// output 2.0
	return download(fileName, "application/object", obj);
	
	function download(filename, type, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:'+type+';charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
};

			
			/* calc ui */
			/**
 * Helper for usage url's #fragment as source of params.
 *
 * @license  Legalize Cannabis License
 * @author   popitch ya ru
 */

function Stringifier(options){
	this.options = options = $.extend(true, {
		// format: string,
		// mapping: hashmap
	}, options);
	
	var format = (options.format instanceof Array) ? options.format.join('') : options.format;
	this._compile(format);
	
	// Backbone.Events
	_.extend(this, Backbone.Events);
}

(function(root, _, $, undefined){
	Stringifier.prototype = {
		fromString: function(string){
			var matches = this.fullRegexp.exec(string);
			if (!matches) return {};
		
			var params = {};
			var options = this.options, i = 1;
			$.each(this.compiled, function(j, chunk){
				if (typeof chunk == 'string') return;
				
				var mapper = options.mapping[chunk.name];
				if (mapper)
					value = mapper.value.apply(params, matches.slice(i, i + chunk.argc + 1));
				else
					value = matches[i];
				i += chunk.argc + 1;
				if (typeof value == 'object')
					params = $.extend(true, params, value);
				else
					params[chunk.name] = value;
			});

			// fire event
			var moreArgs = [].slice.call(arguments, 1);
			this.trigger.apply(this, ['params', params].concat(moreArgs));
			
			return params;
		},
		
		fromParams: function(params){
			var options = this.options;
			var string = _.map(this.compiled, function(chunk){
				if (typeof chunk == 'string') return chunk;
				
				var mapper = options.mapping[chunk.name];
				return mapper ? 
					mapper.string.call(params, params[chunk.name])
					: params[chunk.name] || '';
			}).join('');

			// fire event
			var moreArgs = [].slice.call(arguments, 1);
			this.trigger.apply(this, ['string', string].concat(moreArgs));
			
			return string;
		},
	
		_compile: function(formatString){
			// reg exp helpers
			function rescape(str){
				return str.replace(/[\\\/\.\-+*?^$|{}\[\]]/g, '\\$&');
			}
			var reGroups = /\([^?][^\)]*\)/g;
		
			var compiled = this.compiled = [], pose = 1;
		
			// make chain
			formatString.replace(/([^<]+)|<([\w.]+):([^>]+)>/g,
				function(frag, simple, name, find){
					if (simple){
						compiled.push(simple);
						return;
					}
					var argc = find.split(reGroups).length - 1;
					compiled.push({
						name: name,
						find: find,
						produce: function(argv){
							var i = 0;
							return find.replace(reGroups, function(){
								return argv[i++];
							});
						},
						argc: argc,
						pose: pose + 1
					});
					pose += argc + 1;
				}
			);
		
			// make full string regexp
			this.fullRegexp = new RegExp('^' +
				$.map(this.compiled, function(frag){
					return (typeof frag == 'string') ? rescape(frag) : '(' + frag.find + ')';
				}).join('') +
			'$');
		
			return compiled;
		}
	};
})(this, _, jQuery);

			// exports
__ = i18n;

// simple text translater
function i18n(text, lang, translate) {
	lang = lang && _.isString(lang) ? lang.toLowerCase() : i18n.lang();
	text = String(text);

	// translate dictionary, if present
	translate = translate || i18n.translate[lang];

	if (translate) {
		var namespace = text.replace(/^(\w+:)\S.*$|^.*$/, '$1');

		if (namespace) {
			text = text.replace(/^\w+:(\S.*)$/, '$1');

			return _.has(translate, namespace) && _.has(translate[namespace], text) ? translate[namespace][text] : i18n(text, lang, translate[namespace]);
		}
		return _.has(translate, text) ? translate[text] : text;
	}
	return text;
}

_.extend(i18n, {
	BASE_LANG: 'en',
	LOCAL_STORAGE_KEY: 'acidome.i18n.lang'
});

_.extend(i18n, {
	lang: (function() {
		var lang = ko.observable(null);

		var savedLang = 
				// get current lang from local storage (v.2)
				localStorage.getItem(i18n.LOCAL_STORAGE_KEY)
				||
				// try to get lang from cookie (v.1)
				(document.cookie.split('i18n')[1] || '=;').replace(/^=([^;]*);.*$/, '$1');
		
		// to have an actual lang attribute of <html>
		lang.subscribe(function() {
			$('html').attr('lang', lang());
		});
		
		if (savedLang) {
			lang(savedLang);
		}
		
		// listen observable, save to local storage // (v.1 set cookie)
		lang.subscribe(function() {
			// document.cookie = 'i18n=' + lang(); // v.1
			localStorage.setItem(i18n.LOCAL_STORAGE_KEY, lang());
		});
		
		return lang;
	}()),
	langList: [],
	translate: {},
	addLang: function(lang, data) {
		this.translate[lang] = data;
		this.langList.push(lang);
	},
	isLangKnown: function(lang) {
		return _.has(this.translate, lang.toLowerCase());
	},
	langOptions: function() {
		return _.chain(this.langList)
			.map(function(lang) {
				return {
					id: lang,
					name: __(':lang', lang)
				};
			})
			.sortBy('name')
			.value();
	}
});

// ko.binding "text" adapter
ko.bindingHandlers.text = (function(textBinding) {
	return {
		/*init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			return textBinding.init.apply(this, arguments);
		},*/
		update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			$(element).text(
				i18n(
					ko.unwrap(valueAccessor())
				)
			);
		}
	};
})(ko.bindingHandlers.text);


/** Translate base (en)
 */
i18n.addLang('en', {
	':lang': 'English',

	"Carcass": "Framework",
	"Schema": "Scheme",
	
	"Level of detail, V": "Frequency, V",
	"Align the base": "Flat base",
	
	"else counter": "else anticlockwise",

	"Base radius, m": "Platform radius, m",
	"Base area, m2": "Platform area, m2",
	
	"Donate for Acidome": 'Donate for Acidome.Pro',
	
	"budget:": {
		"title:": {
			"line": "Edges",
			"face": "Faces",
			"vertex": "Vertices"
		}
	}
});


/** Translate extensions
 */
i18n.addLang('ru', {
	':lang': 'Русский',
	
	"//www.facebook.com/groups/acidome.calc/permalink/3170155026372549/"
		: "//www.facebook.com/groups/acidome.calc/permalink/3167952446592807/",

	"Carcass": "Каркас",
	"Schema": "Схема",
	"Cover": "Кровля",
	"Base": "План",

	"Figure options": "Исходная форма",
	
	"Polyhedron": "Многогранник",
	"Icosahedron": "Икосаэдр",
	"Octohedron": "Октаэдр",
	
	"Level of detail, V": "Частота, V",
	"Subdivision class": "Класс разбиения",
	"Subdivision method": "Метод разбиения",
	"method:": {
		"Equal Chords": 'Равные хорды',
		"Equal Arcs": 'Равные дуги',
		"Mexican": 'Мексиканец',
		"Kruschke": "Kruschke"
	},
	"Rotational symmetry": "Осевая симметрия",
	"Fullerene": "Фуллерен",
	"fulleren:": {
		"None": 'Нет',
		"Inscribed in": 'Вписанный',
		"Described around": 'Описанный'
	},
	"Part of full sphere": "Часть сферы",
	"Part of height": "По высоте",
	
	"Align the base": "Плоское основание",

	"Product options": "Продукция",
	"Sphere radius, m": "Радиус сферы, м",
	"Connection type": "Способ соединения",
	"Pipe diameter, mm": "Диаметр трубы, мм",
	"Spinning clockwise": "По-часовой",
	"else counter": "или против",

	"Timber size": "Материал ребер",
	"Width, mm": "Ширина, мм",
	"Thickness, mm": "Толщина, мм",

	"Resulting": "В результате",
	
	"Height from base, m": "Высота от основания, м",
	"Base radius, m": "Радиус основания, м",
	"Base area, m2": "Площадь основания, м2",
	"Base circle area, m2": "Площадь круга основания, м2",
	
	"Sizes (units)": "Типоразмеры (всего)",
	"Faces": "Граней",
	"Edges": "Ребер",
	"Vertices": "Вершин",
	
	"Beams": "Балки (ребра)",
	"Total length of beams, m": "Суммарная длина, м",
	"Total volume of beams, m3": "Объем ребер, м3",
	"Beam length, mm": "Длина ребра, мм",
	//"Max. beam length, mm": "Макс. длина ребра, мм",
	"Angle between faces, °": "Угол смежных граней, °",
	
	"Triangles": "Треугольники",
	"Polygons": "Многоугольники",
	"Coverage area, m2": "Площадь покрытия, м2",
	"Sum of perimeters, m": "Сумма периметров, м",
	
	"Min. height, mm": "Мин. высота, мм",
	"Max. side, mm": "Макс. сторона, mm",

	"mm": "мм",
	"pcs": "шт.",

	"buyme:": {
		"Product offering": "Предложения продукции",
		"Buy it": "Купить",
		"Sorry, error happens while we trying to order. Please, try again later.": 'К сожалению, при попытке заказать происходит ошибка. Пожалуйста, попробуйте повторить заказ позже.',
		"Thank you, the order has been successfully created.": 'Спасибо, заказ успешно создан. Проверьте вашу электронную почту.',
		"Check your email, if the letter is marked as spam, mark it as not spam.": 'Проверьте почту, если письмо случайно попало в папку "Спам", вытащите его оттуда.',
		"E-mail is not valid": "Вы ввели неправильный e-mail"
	},

	"share:": {
		"Share": 'Поделиться',
		"from acidome.com": 'от acidome.com'
	},

	"How to use calc": 'Как же этим пользоваться',
	"Facebook group": 'Группа Facebook',
	"Translate me": 'Переведи меня',
	
	"Acidome offline": 'Скачать Acidome',
	"Download frame .obj": 'Скачать каркас .obj',
	"Donate for Acidome": 'Donate for Acidome.Pro',

	"Please, wait...": "Ожидается...",
	"modified": 'изменен',

	"budget:": {
		"title:": {
			"line": "Ребра",
			"face": "Грани",
			"vertex": "Вершины"
		}
	},
	
	"door:": {
		"Door group": "Дверной проём",
		"Width, mm": "Ширина, мм",
		"Height, mm": "Высота, мм",
		"Direction, °": "Расположение, °",
	},

	"clothier:": {
		"Clothier": "Портной"
	}
});

/**
 * @thanks https://www.facebook.com/enrique.desanjulian
 */
i18n.addLang('es', {
	':lang': 'Español',
	
	"//www.facebook.com/groups/acidome.calc/permalink/3170155026372549/"
		: "//www.facebook.com/groups/acidome.calc/permalink/3169703449751040/",

	"Carcass": "Carcasa",
	"Schema": "Esquema",
	"Cover": "Cubierta",
	"Base": "Base",

	"Figure options": "Opciones de geometría",
	"Level of detail, V": "Frecuencia, V",
	"Subdivision class": "Tipo de subdivisión",
	"Subdivision method": "Método de subdivisión",
	"method:": {
		"Equal Chords": 'Cuerdas iguales',
		"Equal Arcs": 'Arcos iguales',
		"Mexican": 'Mexicano'
	},
	"Rotational symmetry": "Simetría rotacional",
	"Fullerene": "Circunscripción",
	"fulleren:": {
		"None": 'Ninguna',
		"Inscribed in": 'Inscrita dentro',
		"Described around": 'Descrita alrededor'
	},
	"Part of full sphere": "Porción de la esfera",
	"Align the base": "Alinear la base",

	"Product options": "Opciones de Proyecto",
	"Sphere radius, m": "Radio de la esfera, m",
	"Connection type": "Tipo de conexión",
	"Pipe diameter, mm": "Diámetro del tubo, mm",
	"Spinning clockwise": "Girando en sentido horario",
	"else counter": "sentido contrario",

	"Timber size": "Tamaño de las piezas",
	"Width, mm": "Anchura, mm",
	"Thickness, mm": "Grosor, mm",

	"Resulting": "Resultados",
	"Height from base, m": "Altura desde la base, m",
	"Base radius, m": "Radio de la base, m",
	"Sizes (units)": "Tamaños (unidades)",
	"Faces": "Caras",
	"Edges": "Aristas",
	"Vertices": "Vértices",
	"Beams": "Travesaños",
	"Total length of beams, m": "Longitud total de los travesaños, m",
	"Total volume of beams, m3": "Volumen total de los travesaños, m3",
	"Beam length, mm": "Longitud del travesaño, mm",
	"Max. beam length, mm": "Longitud máx. del travesaño, mm",
	"Angle between faces, °": "Ángulo entre caras, °",
	"Base area, m2": "Área de la base, m2",
	"Coverage area, m2": "Área de la cubierta, m2",
	"Triangles": "Triángulos",
	"Min. height, mm": "Altura mín., mm",
	"Max. side, mm": "Longitud máx. del lado, mm",

	"mm": "mm",
	"pcs": "piezas"
});

/**
 * @thanks https://www.facebook.com/bezruchko.arkadiy
 */
i18n.addLang('ua', {
	':lang': 'Українська',

	"Carcass": "Каркас",
	"Schema": "Схема",
	"Cover": "Покрівля",
	"Base": "План",

	"Figure options": "Вихідна форма",
	"Level of detail, V": "Частота, V",
	"Subdivision class": "Клас розбивки",
	"Subdivision method": "Метод розбивки",
	"method:": {
		"Equal Chords": 'Рівні хорди',
		"Equal Arcs": 'Рівні дуги',
		"Mexican": 'Мексиканський'
	},
	"Rotational symmetry": "Осьова симетрія",
	"Fullerene": "Фуллерен",
	"fulleren:": {
		"None": 'Немає',
		"Inscribed in": 'Вписаний',
		"Described around": 'Описаний'
	},
	"Part of full sphere": "Частина сфери",
	"Align the base": "Вирівнювати основу",

	"Product options": "Продукція",
	"Sphere radius, m": "Радіус сфери, м",
	"Connection type": "Спосіб з'єднаня",
	"Pipe diameter, mm": "Діаметр труби, мм",
	"Spinning clockwise": "За-годинниковою",
	"else counter": "або проти",

	"Timber size": "Матеріал ребер",
	"Width, mm": "Ширина, мм",
	"Thickness, mm": "Товщина, мм",

	"Resulting": "В результаті маємо",
	"Height from base, m": "Висота від основи, м",
	"Base radius, m": "Радіус основи, м",
	"Sizes (units)": "Разміри",
	"Faces": "Граней",
	"Edges": "Ребер",
	"Vertices": "Вершин",
	"Beams": "Балки (ребра)",
	"Total length of beams, m": "Сумарна довжина, м",
	"Total volume of beams, m3": "Об'єм ребер, м3",
	"Beam length, mm": "Довжина ребра, мм",
	"Max. beam length, mm": "Макс. довжина ребра, мм",
	"Angle between faces, °": "Кут суміжних граней, °",
	"Base area, m2": "Площа основи, м2",
	"Coverage area, m2": "Площа покриття, м2",
	"Triangles": "Трикутники",
	"Min. height, mm": "Мін. висота, мм",
	"Max. side, mm": "Макс. сторона, mm",

	"mm": "мм",
	"pcs": "шт."
});


/**
 * @thanks https://www.facebook.com/pascal.belzunce
 */
i18n.addLang('fr', {
	':lang': 'Français',

	"Carcass": "Squelette",
	"Schema": "Schéma",
	"Cover": "Couverture",
	"Base": "Sol",

	"Figure options": "Paramètres de la forme",
	"Level of detail, V": "Fréquence, V",
	"Subdivision class": "Classe de subdivision",
	"Subdivision method": "Méthode de subdivision",
	"method:": {
		"Equal Chords": 'Cordes égales',
		"Equal Arcs": 'Arcs égaux',
		"Mexican": 'Mexicaine'
	},
	"Rotational symmetry": "Axe de symétrie",
	"Fullerene": "Fullerène",
	"fulleren:": {
		"None": 'Aucune',
		"Inscribed in": 'Intérieur',
		"Described around": 'Extérieur'
	},
	"Part of full sphere": "Découpage de la sphère",
	"Align the base": "Aligner le bas",

	"Product options": "Caractéristiques du matériel",
	"Sphere radius, m": "Rayon de la sphère, m",
	"Connection type": "Type de connecteur",
	"Pipe diameter, mm": "Diamètre du tube, mm",
	"Spinning clockwise": "Sens horaire",
	"else counter": "antihoraire",

	"Timber size": "Taille des montants",
	"Width, mm": "Largeur, mm",
	"Thickness, mm": "Epaisseur, mm",

	"Resulting": "Résultats",
	"Height from base, m": "Hauteur au sol, m",
	"Base radius, m": "Rayon au sol, m",
	"Sizes (units)": "Quantités",
	"Faces": "Faces",
	"Edges": "Montants",
	"Vertices": "Nœuds",
	"Beams": "Montants",
	"Total length of beams, m": "Longueur totale des montants, м",
	"Total volume of beams, m3": "Volume total des montants, м3",
	"Beam length, mm": "Montant le plus, mm",
	"Max. beam length, mm": "Montant le plus grand, mm",
	"Angle between faces, °": "Angle entre les faces, °",
	"Base area, m2": "Surface au sol, m2",
	"Coverage area, m2": "Surface de la couverture, m2",
	"Triangles": "Triangles",
	"Min. height, mm": "Hauteur mini, mm",
	"Max. side, mm": "Côté maxi, mm",

	"mm": "mm",
	"pcs": "pcs",

	"Donate for Acidome": 'Donate for Acidome.Pro',

	"modified": 'modifié',

	"budget:": {
		"title:": {
			"line": "Montants",
			"face": "Faces",
			"vertex": "Nœuds"
		}
	}
});

/**
 * @thanks https://www.facebook.com/gencho.genchev.50
 */
i18n.addLang('bg', {
	':lang': 'Български',

	"Carcass": "Конструкция",
	"Schema": "Схема",
	"Cover": "Покрив",
	"Base": "Основа",

	"Figure options": "Изходна форма",
	"Level of detail, V": "Честота V",
	"Subdivision class": "Делови клас",
	"Subdivision method": "Метод на делене",
	"method:": {
		"Equal Chords": "Равни Хорди",
		"Equal Arcs": "Равни дъги",
		"Mexican": "Мексикански"
	},
	"Rotational symmetry": "Осева симетрия",
	"Fullerene": "Фулерен",
	"fulleren:": {
		"None": "Не",
		"Inscribed in": "Вписан",
		"Described around": "Описан"
	},
	"Part of full sphere": "Част от сферата",
	"Align the base": "Изравни на основата",

	"Product options": "Параметри на купола",
	"Sphere radius, m": "Радиус на сферата, м",
	"Connection type": "Тип връзки",
	"Pipe diameter, mm": "Диаметър на тръбата, мм",
	"Spinning clockwise": "По часовата стрелка",
	"else counter": "Обратно на ч.с.",

	"Timber size": "Материал на ребрата",
	"Width, mm": "Ширина, мм",
	"Thickness, mm": "Дебелина, мм",

	"Resulting": "Резултат",
	"Height from base, m": "Височина от основата, м",
	"Base radius, m": "Радиус на основата, м",
	"Sizes (units)": "Размери (бройки)",
	"Faces": "Многоъгълници",
	"Edges": "Греди",
	"Vertices": "Връзки",
	"Beams": "Греди",
	"Total length of beams, m": "Обща дължина греди, м",
	"Total volume of beams, m3": "Обем греди, м3",
	"Beam length, mm": "Дължина греда, мм",
	"Max. beam length, mm": "Максимална дължина греда, мм",
	"Angle between faces, °": "Ъгъл между съседни повърхности",
	"Base area, m2": "Площ на основата, м2",
	"Coverage area, m2": "Покривна площ, м2",
	"Triangles": "Триъгълници",
	"Min. height, mm": "Мин. Височина, мм",
	"Max. side, mm": "Минимална страна, мм",

	"mm": "мм",
	"pcs": "бр.",

    "budget:": {
        "title:": {
            "line": "Греди",
            "face": "Многоъгълници",
            "vertex": "Връзки"
        }
    }
});

i18n.addLang('pl', {
	':lang': 'Polski',

	"Carcass": "Konstrukcja",
	"Schema": "Schemat",
	"Cover": "Pokrycie",
	"Base": "Podstawa",

	"Figure options": "Opcje kształtu",
	"Level of detail, V": "Stopień aproksymacji, V",
	"Subdivision class": "Klasa podziału",
	"Subdivision method": "Metoda podziału",
	"method:": {
		"Equal Chords": 'Równych cięciw',
		"Equal Arcs": 'Równych łuków',
		"Mexican": 'Meksykańska'
	},
	"Rotational symmetry": "Оś symetrii",
	"Fullerene": "Wzór fulerenu",
	"fulleren:": {
		"None": 'Nie',
		"Inscribed in": 'Wpisany',
		"Described around": 'Opisany'
	},
	"Part of full sphere": "Część sfery",
	"Align the base": "Wyrównaj do podstawy",

	"Product options": "Opcje produktu",
	"Sphere radius, m": "Promień sfery, m",
	"Connection type": "Typ łączenia",
	"Pipe diameter, mm": "Średnica rury, mm",
	"Spinning clockwise": "Obrót w prawo ",
	"else counter": "lub w lewo",

	"Timber size": "Rozmiar belki",
	"Width, mm": "Szerokość, mm",
	"Thickness, mm": "Grubość, mm",

	"Resulting": "W wyniku otrzymujemy",
	"Height from base, m": "Wysokość od podstawy, m",
	"Base radius, m": "Promień podstawy, m",
	"Sizes (units)": "Elementy",
	"Faces": "Ścianki",
	"Edges": "Krawędzie",
	"Vertices": "Wierzchołki",
	"Beams": "Belki",
	"Total length of beams, m": "Całkowita długość belek, m",
	"Total volume of beams, m3": "Całkowita objętość belek, m3",
	"Beam length, mm": "Długość belki, mm",
	"Max. beam length, mm": "Maksymalna długość belki, mm",
	"Angle between faces, °": "Kąt pomiędzy ściankami, °",
	"Base area, m2": "Powierzchnia podstawy, m2",
	"Coverage area, m2": "Powierzchnia pokrycia, m2",
	"Triangles": "Тrójkąty",
	"Min. height, mm": "Maksymalna wysokość, mm",
	"Max. side, mm": "Maksymalna długość boku, mm",

	"mm": "mm",
	"pcs": "szt.",

	"budget:": {
		"title:": {
			"line": "Belki",
			"face": "Ścianki",
			"vertex": "Wierzchołki"
		}
	}
});

/**
 * @thanks Angelo Rebeli https://www.facebook.com/100009868328424
 */
i18n.addLang('gr', {
    ':lang': "Ελληνικά",
    "Carcass": "Πλαίσιο",
    "Schema": "Σχέδιο",
    "Cover": "Κάλυψη",
    "Base": "Σχέδιο Βάσης",
    "Figure options": " Επιλογές σχήματος ",
    "Level of detail, V": " Επίπεδο λεπτομέρειας, V",
    "Subdivision class": " Κλάση υποδιαίρεσης ",
    "Subdivision method": " Μέθοδος υποδιαίρεσης ",
    "method:": {
        "Equal Chords": ' Ίσες χορδές',
        "Equal Arcs": ' Ίσα τόξα ',
        "Mexican": ' Μεξικάνικη '
    },
    "Rotational symmetry": " Συμμετρία περιστροφής ",
    "Fullerene": " Fullerene ",
    "fulleren:": {
        "None": ' Όχι ',
        "Inscribed in": ' Εγγραφή σε ',
        "Described around": ' Περιγράφεται γύρω'
    },
    "Part of full sphere": " Μέρος της σφαίρας",
    "Align the base": " Ευθυγράμμιση της βάσης ",
    "Product options": " Επιλογές προϊόντος ",
    "Sphere radius, m": " Ακτίνα σφαίρας, м",
    "Connection type": " Μέθοδος σύνδεσης ",
    "Pipe diameter, mm": " Διάμετρος σωλήνα, mm",
    "Spinning clockwise": " Περιστροφή κατά τη φορά των δεικτών του ρολογιού ",
    "else counter": " Περιστροφή αντί τη φορά των δεικτών του ρολογιού ",
    "Timber size": " Διαστάσεις ξύλου ",
    "Width, mm": " Πλάτος, mm",
    "Thickness, mm": " Πάχος, mm",
    "Resulting": " Ως αποτέλεσμα έχουμε",
    "Height from base, m": " Ύψος από τη βάση, m",
    "Base radius, m": "Ακτίνα βάσης, m",
    "Sizes (units)": "Διαστάσεις ",
    "Faces": "Σύνορα",
    "Edges": "Ακόνες",
    "Vertices": " Κορυφές ",
    "Beams": " Δοκοί (νευρώσεις)",
    "Total length of beams, m": " Συνολικό μήκος δοκών, m",
    "Total volume of beams, m3": " Συνολικός όγκος δοκών, m3",
    "Beam length, mm": "Μέγιστο μήκος δέσμης, mm",
    "Max. beam length, mm": "Μέγιστο μήκος δέσμης, mm",
    "Angle between faces, °": "Γωνία μεταξύ γειτονικών προσώπων, °",
    "Base area, m2": "Εμβαδόν Βάσης, m2",
    "Coverage area, m2": "Εμβαδόν κάλυψης, m2",
    "Triangles": " Τρίγωνα ",
    "Min. height, mm": " Ελάχιστο ύψος, mm",
    "Max. side, mm": " Μέγιστη πλευρά, mm",
    "mm": "mm",
    "pcs": " τεμ."
});

/**
 * @thanks Hugo Hanssen https://www.facebook.com/groups/acidome.calc/?post_id=753359898052086&comment_id=2705936109461112
 */
i18n.addLang('nl', {
	':lang': 'Nederlands',
	
	"Carcass": "Skelet",
	"Schema": "Schema",
	"Cover": "Bedekking",
	"Base": "Basis",
	
	"Figure options": "Model opties",
	"Level of detail, V": "Aantal deelstukken, V",
	"Subdivision class": "Onderverdelings klasse",
	"Subdivision method": "Onderverdelings wijze",
	"method:": {
		"Equal Chords": 'Gelijke Staken',
		"Equal Arcs": 'Gelijke Hoeken',
		"Mexican": 'Меxicaans'
	},
	"Rotational symmetry": "Circulaire Symmetrie",
	"Fullerene": "Fullereen (Buckyball)",
	"fulleren:": {
		"None": 'Geen',
		"Inscribed in": 'Ingeschreven',
		"Described around": 'Omschreven'
	},
	"Part of full sphere": "Deel van hele bol",
	"Align the base": "De basis uitvlakken",
	
	"Product options": "Product Opties",
	"Sphere radius, m": "Straal van de bol, м",
	"Connection type": "Verbindings type",
	"Pipe diameter, mm": "Buis diameter, мм",
	"Spinning clockwise": "Draait kloksgewijs",
	"else counter": "Anders draaiend",
	
	"Timber size": "Balkmaat",
	"Width, mm": "Breedte, мм",
	"Thickness, mm": "Dikte, mm",
	
	"Resulting": "Resultaat",
	"Height from base, m": "Hoogte vanaf de basis, m",
	"Base radius, m": "Straal van de basis, m",
	"Sizes (units)": "Maten (eenheden)",
	"Faces": "Vlakken",
	"Edges": "Randen",
	"Vertices": "Hoekpunten",
	"Beams": "Balken (Ribben)",
	"Total length of beams, m": "Lengte van de balken, m",
	"Total volume of beams, m3": "Volume van de balken, m3",
	"Beam length, mm": "Balklengte, mm",
	"Max. beam length, mm": "Max. balklengte, mm",
	"Angle between faces, °": "oek tussen de vlakken, °",
	"Base area, m2": "Oppervlak van de basis, m2",
	"Coverage area, m2": "Bestrijkingsgebied, m2",
	
	"Triangles": "Driehoeken",
	"Min. height, mm": "Min. Hoogte, mm",
	"Max. side, mm": "Max. breedte, mm",
	"mm": "mm",
	"pcs": "stuks.",
});

/**
 * @thanks Gerhard Bicker https://www.facebook.com/groups/acidome.calc/?post_id=753359898052086&comment_id=2860008697387185
 */
i18n.addLang('de', {
	':lang': 'Deutsch',
	
	"Carcass": "Rahmen",
	"Schema": "Schema",
	"Cover": "Abdeckung",
	"Base": "Grundfläche",
	"Tent": "Bedruckung",
	
	"Figure options": "Berechnungsoptionen",
	
	"Polyhedron": "Polyeder",
	"Icosahedron": "Ikosaeder",
	"Octohedron": "Oktaeder",

	"Level of detail, V": "Frequenz (Detaillevel)",
	"Subdivision class": "Unterteilungsklasse",
	"Subdivision method": "Unterteilungsmethode",
	"method:": {
		"Equal Chords": 'gleiche Abstände',
		"Equal Arcs": 'gleiche Winkel',
		"Mexican": 'mexikanisch'
	},
	"Rotational symmetry": "Rotationssymetrie",
	"symmetry:": { // not used
		"Pentad": "5-fach",
		"Cross": "4-fach",
		"Triad": "3-fach"
	},
	"Fullerene": "Fullerene",
	"fulleren:": {
		"None": 'nein',
		"Inscribed in": 'einbeschrieben',
		"Described around": 'umbeschrieben'
	},
	"Part of full sphere": "Teil einer vollen Kugel",
	"Align the base": "Standfläche anpassen",
	
	"Product options": "Produktoptionen",
	"Sphere radius, m": "Kugelradius, m",
	"Connection type": "Verbindungstyp",
	"connection:": { // not used
		"Piped": "Rohr",
		"GoodKarma": "Stoß, Rahmenbauweise",
		"Semicone": "Spitz zulaufend, Rahmenbauweise",
		"Cone": "Spitz zulaufend",
		"Joint": "Stoß"
	},
	"Pipe diameter, mm": "Rohrdurchmesser, mm",
	"Spinning clockwise": "im Uhrzeigersinn gedreht",
	"else counter": "sonst dagegen",
	
	"Timber size": "Balken Abmessungen",
	"Width, mm": "Breite, mm",
	"Thickness, mm": "Stärke, mm",
	
	"Resulting": "Zusammenfassung",
	"Height from base, m": "Höhe von der Grundfläche, m",
	"Base radius, m": "Radius Grundfläche, m",
	"Sizes (units)": "verschiedene Größen (Gesamtanzahl)",
	"Faces": "Flächen",
	"Edges": "Kanten",
	"Vertices": "Eckpunkte",
	"Beams": "Balken",
	"Total length of beams, m": "Gesamtlänge der Balken, m",
	"Total volume of beams, m3": "Gesamtvolumen der Balken, m³",
	"Beam length, mm": "Balkenlänge, mm",
	"Max. beam length, mm": "Maximale Balkenlänge, mm",
	"Angle between faces, °": "Winkel zwischen Flächen, °",
	"Base area, m2": "Grundfläche, m²",
	"Coverage area, m2": "Oberfläche, m²",
	
	"Triangles": "Dreiecke",
	"Min. height, mm": "kleinste Höhen, mm",
	"Max. side, mm": "längste Seiten, mm",
	"mm": "mm",
	"pcs": "Stk.",

	"budget:": {
		"title:": {
			"line": "Balken",
			"face": "Flächen",
			"vertex": "Eckpunkte"
		}
	}
});

/**
 * @thanks Ionut Claudiu Baciu https://www.facebook.com/groups/acidome.calc/?post_id=753359898052086&comment_id=3012539525467434
 */
i18n.addLang('ro', {
	":lang": "Română",

	"Carcass": "Cadru",
	"Schema": "Schemă",
	"Cover": "Acoperire",
	"Base": "Bază",

	"Figure options": "Obțiuni de construcție",
	"Polyhedron": "Poliedru",
	"Icosahedron": "Icosahedron",
	"Octohedron": "Octaedru",
	"Level of detail, V": "Acuratețe formă, V",
	"Subdivision class": "Clasă de subdiviziune",
	"Subdivision method": "Metodă de divizare",

	"method:": {
		"Equal Chords": "Laturi egale",
		"Equal Arcs": "Unghiuri egale",
		"Mexican": "Mexican",
		"Kruschke": "Kruschke"
	},
	"Rotational symmetry": "Simetrie de rotație",
	"Fullerene": "Poziție laturi construcție",
	"fulleren:": {
		"None": "Nimic",
		"Inscribed in": "interiorul Sferei",
		"Described around": "exteriorul Sferei"
	},
	"Part of full sphere": "Parte din sferă",
	"Part of height": "Parte din înălțime",
	"Align the base": "Bază plată",

	"Product options": "Dimensiuni sferă",
	"Sphere radius, m": "Raza Sferei, m",
	"Connection type": "Tip de îmbinare",
	"Pipe diameter, mm": "Diametru țeavă îmbinare",
	"Spinning clockwise": "Sens orar",
	"else counter": "Sens antiorar",
	"Timber size": "Dimensiune cherestea",
	"Width, mm": "Lățime, mm",
	"Thickness, mm": "Grosime,mm",

	"Resulting": "Dimensiuni calcul Sferă",
	"Height from base, m": "Înaltimea sferei de la bază, m",
	"Base radius, m": "Raza bazei Sferei, m",
	"Sizes (units)": "Cantități",
	"Faces": "Nr. fețe",
	"Edges": "Nr. Grinzi",
	"Vertices": "nr. piese verticale",
	"Beams": "Grindă",
	"Total length of beams, m": "Lungimea totală a grindei, m",
	"Total volume of beams, m3": "Volumul total al grindei, m3",
	"Beam length, mm": "Lungimea a unei grinzi, mm",
	"Max. beam length, mm": "Lungimea max. a unei grinzi, mm",
	"Angle between faces, °": "Unghi îmbinare fețe, °",
	"Base area, m2": "Suprafață bază sferă, m2",
	"Coverage area, m2": "Suprafață de acoperit, m2",
	"Triangles": "Triunghiuri",
	"Min. height, mm": "Înălțime min., mm",
	"Max. side, mm": "Lungime max. latură, mm",

	"mm": "mm",
	"pcs": "buc.",

	"buyme:": {
		"Product offering": "Ofertă de produse",
		"Buy it": "Cumpără",
		"Sorry, error happens while we trying to order. Please, try again later.": "Ne pare rău,timp ce încercam să comandăm a apărut o eruare. Vă rugăm să încercați din nou mai târziu.",
		"Thank you, the order has been successfully created.": "Vă mulțumim, comanda a fost plasată cu succes.",
		"Check your email, if the letter is marked as spam, mark it as not spam.": "Verificați e-mailul dvs., dacă este marcat ca spam, marcați-l ca non spam.",
		"E-mail is not valid": "E-mail nu este valid"
	},
	"share:": {
		"Share": "Împărtășește",
		"from acidome.ru": "de la acidome.ru"
	},
	"How to use calc": "Cum se utilizează calc",
	"Facebook group": "Grup Facebook",
	"Translate me": "Traduce-mă",
	"Acidome offline": "Acidome offline",
	"Download frame .obj": "Descarcă piesa.obj 3D",
	"Donate for Acidome": "Donează pentru Acidome.Pro",
	"modified": "Modifică",
	"budget:": {
		"title:": {
			"line": "Linie",
			"face": "Fațete",
			"vertex": "Zenit"
		}
	},
	"clothier:": {
		"Clothier": "Croitor"
	}
});

			var viewer = (function() {
	var zoom = {current: 16, progress: 1, target: 16},
		ZOOM_RANGE = [-8, 40],// 32 stable!
		ZOOM_LATENCY = 80, // ms
		SCROLL_NATIVE_WHEEL = {
			DELAY_MAX: 600, // ms
			lastNativeTime: +new Date
		},
		NEAR = 1.01, FAR = 10;

	var viewer = _.clone(Backbone.Events);

	var $dom = viewer.$dom = $('.geodesic'),
		$canvas = $dom.find('canvas.preview'),
		$form = $dom.find('form.options');

	// resize spy
	!function() {
		// bind
		$(window).on('resize', _.debounce(resizeCanvas, 300));

		// init
		$(function() {
			$dom.show();
			$(window).resize();
			
			// brut-fix strange small canvas on small-height viewport
			_.delay(resizeCanvas, 2000);
		});
		
		function resizeCanvas() {
			var w = $(window).width(),
				h = $(window).height(),
				fb = _.chain($form)
					.map(form => $(form).outerHeight(true) + $(form).offset().top)
					.max().value();

			if (w != canvasW || h != canvasH) {
				canvasH = Math.max(fb, h - (IS_IFRAME ? 0 : 50));
				canvasW = w;
				viewer.trigger('render');
			}
		}
	}();
	
	// mouse spy
	!function() {
		var touchStart, touchCurrent, overObject, hasRotate;
		
		$canvas
			.bind('mousedown touchstart', function(e) {
				if (!commonGroup) return;
				touchStart = touchScene(e);
			})
			.bind('mouseup touchend', function(e) {
				touchStart = null;
				_.defer(function() {
					hasRotate = false;
				});
			})
			.bind('mousemove touchmove', function(e) {
				touchCurrent = touchScene(e);
				if (touchStart) {
					// rotate startTouch.matrix, from startTouch.sphereCross to touch.sphereCross
					rotateSphere(touchStart, touchCurrent);
					hasRotate = true;
				}
				return false;
			})
			.click(function(e) {
				if (!hasRotate) {
					trigger('click', e);
				}
				//touchStart = null;
			});
		
		// mouse wheel / zooming
		$canvas[0].addEventListener('DOMMouseScroll', handleScroll, false);
		$canvas[0].addEventListener('mousewheel', handleScroll, false);

		function handleScroll(e) {
			var evt = e || window.event;
			var delta = (evt.detail < 0 || evt.wheelDelta > 0) ? 1 : -1;
			
			function skip() {
				SCROLL_NATIVE_WHEEL.lastNativeTime = +new Date;
			}
			
			if (delta) {
				var before = touchScene(e);

				if (! before.sphereTouch) {
					// except scroll without touched sphere
					return skip();
				}

				if (+new Date - SCROLL_NATIVE_WHEEL.lastNativeTime <= SCROLL_NATIVE_WHEEL.DELAY_MAX) {
					// except native serial scroll events
					return skip();
				}
				
				zoom.target = Math.min(Math.max(zoom.target + delta, ZOOM_RANGE[0]), ZOOM_RANGE[1]);
				if (zoom.progress === 1) {
					zoom = _.extend(zoom, {
						progress: 0,
						start: zoom.current,
						startTouch: before,
						startAt: new Date,
						startEvent: e
					});
				}
				zoomProgress();
			}
			
			return e.preventDefault() && false;
		}
		
		viewer.setZoomTarget = function(target, e) {
			_.extend(zoom, {
				target: target,
				progress: 0,
				start: zoom.current,
				//startTouch: before,
				startAt: new Date//,
				//startEvent: e
			});
			zoomProgress();
		};
		
		// auto zoom progresser
		function zoomProgress() {
			var now = (new Date).getTime(),
				timeout = 100,
				current = zoom.current;
					
			if (zoom.startAt) {
				zoom.progress = Math.min(now - zoom.startAt.getTime(), ZOOM_LATENCY) / ZOOM_LATENCY;
				zoom.current = zoom.start + (zoom.target - zoom.start) * zoom.progress;
				
				if (zoom.current != current) {
					viewer.trigger('render');
					//viewer.flash(false);
					
					if (zoom.startEvent) {
						var touch = touchScene(zoom.startEvent);
						rotateSphere(zoom.startTouch, touch);
					}
					
					timeout = 0;
				}
				
				//console.log('zoom', zoom.current);
			}
			
			if (zoom.progress < 1) {
				_.delay(zoomProgress, timeout);
			}
		}
		
		function rotateSphere(touch1, touch2) {
			var axis = touch1.sphereCross.clone().cross(touch2.sphereCross);
			var angle = touch1.sphereCross.angleTo(touch2.sphereCross);
			
			if (Math.abs(angle) < 1e-4 || Math.abs(axis.length()) < 1e-9) return;
			
			commonGroup.matrix = (new THREE.Matrix4).rotateByAxis(axis, angle)
				.multiply(touch1.matrix);
			
			viewer.trigger('render');
		}

		function touchScene(e) {
			var raycaster = getRaycaster(e);

			// fix Threejs: prepare mesh's vertices position to world coordinates
			_.each(scene.getDescendants(), function(mesh) {
				if (mesh instanceof THREE.Mesh) {
					mesh._geometryVertices = mesh.geometry.vertices;
					mesh.geometry.vertices = mesh._geometryWorldVertices = mesh._geometryWorldVertices ||
						_.map(mesh.geometry.vertices, function(v) {
							return v.clone().add(mesh.position);
						});
				}
			});
			var intersects = raycaster.intersectObjects(scene.children, true);
			// from fix
			_.each(scene.getDescendants(), function(mesh) {
				if (mesh instanceof THREE.Mesh) {
					mesh.geometry.vertices = mesh._geometryVertices;
				}
			});

			
			// cross with shere
			var R = SCALE * form.state.radius,
				p = raycaster.ray.origin,
				v = raycaster.ray.direction,
				a = v.dot(v),
				b = v.dot(p) * 2,
				c = p.dot(p) - R * R,
				D = b * b - 4 * a * c,
				q = - b / 2 / a;
			if (D > 0) {
				D = Math.sqrt(D) / 2 / a;
				q = (c > 0) ? q - D : q + D;
			}
			
			var sphereCross = v.clone().multiplyScalar(q).add(p);

			if (_.isEmpty(intersects)) {
				trigger('mouseout', e);
				overObject = null;
			} else {
				if (overObject === intersects[0].object) {
					trigger('mousemove', e);
				}
				else {
					trigger('mouseout', e);
					overObject = intersects[0].object;
					trigger('mousein', e);
				}
			}

			return {
				raycaster: raycaster,
				intersect: intersects[0],
				product: intersects[0] && intersects[0].object._product,
				sphereCross: sphereCross,
				sphereTouch: D > 0,
				matrix: commonGroup && commonGroup.matrix
			};
		}

		function trigger(eventName, e) {
			if (overObject && overObject.trigger && overObject._events[eventName]) { // handler present
				overObject.trigger(eventName, e);
				viewer.flash();
			}
		}

		var projectionMatrixInverse = new THREE.Matrix4;
		function getRaycaster(e) {
			// ray
			// FF fix: used page's [X,Y] with canvas position [0,0]
			var oe = e.originalEvent || e,
				x = (e.offsetX || e.pageX) || (oe.touches && oe.touches[0] && oe.touches[0].pageX) || 0,
				y = (e.offsetY || e.pageY) || (oe.touches && oe.touches[0] && oe.touches[0].pageY) || 0,
				v = new THREE.Vector3(
					(x / canvasW) * 2 - 1,
				   -(y / canvasH) * 2 + 1,
					0.5
				);
			//v = projector.unprojectVector(v, camera);
			projectionMatrixInverse.getInverse(camera.projectionMatrix);
			v.applyProjection(projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
		
			var p = camera.position;
			v.sub(p).normalize();
			
			return new THREE.Raycaster(p, v);
		}
	}();

	// view mode switcher
	var activeMode, currentFigure;

	viewer.mode = ko.observable();

	!function() {
		var $modeList = $('.mode-list .mode', $dom),
			$activeMode = $modeList.filter('.active');

		activeMode = $activeMode.data('mode');
		viewer.mode(activeMode);

		// track initial mode
		Tracker.push('view', activeMode);

		$(document).on('click', '.mode-list .mode', function(event) {
			var $mode = $(event.target).closest('li');

			if ($mode[0] !== $activeMode[0]) {
				$activeMode.removeClass('active');
				$activeMode = $mode;
				$activeMode.addClass('active');

				activeMode = $activeMode.data('mode');

                viewer.mode(activeMode);
			}
		});

        viewer.mode.subscribe(function(mode) {
        	activeMode = viewer.mode();

        	if (!activeMode) {
        		debugger;
			}
			else {
                $activeMode = $('.mode-list .mode[data-mode]').removeClass('active')
					.filter('[data-mode="' + activeMode + '"]').addClass('active');
			}
        	init();
		});
		
		viewer.flash = _.throttle(function(render) {
            updateCameraPosition();
			
			if (viewer.needRenderScene) {
				render = true;
				viewer.needRenderScene = false;
			}
			
			if (render) {
				// render & redraw
				viewer.trigger('render', currentFigure);
			} else {
				// redraw only
				renderer.render(scene, camera);
			}
        }, 16, { leading: true });

		function init() {
            // track mode switched
            Tracker.push('view', activeMode);

            viewer.flash(true);	
        }
		
		// pattern as view mode
		viewer.pattern = (function() {
			var ready = ko.observable(true), // todo: ready is state with valid figure separated (by lines)
				
				pattern = {
					ready: ko.computed(function() {
						return ready() && pattern;
					}, null, { deferEvaluation: true }),
					
					progress: ko.observable(),
					
					tentCalcResult: ko.observable(),
					
					mode: ko.observable('polyhedron') //=)('pattern') //('polyhedron')
				};
			
			viewer.mode.subscribe(function(mode) {
				if ("tent" === mode) {
					pattern.mode('polyhedron');
				}
			});
			
			pattern.mode.subscribe(function(mode) {
				if ('pattern' === mode && pattern.lastNetStamp !== form.tentNetStamp()) {
					// rotate model for user can to see as pattern make self-form
					rootScene.children[1].matrix.rotateX(Math.PI / 2);
					
					// full image size
					viewer.setZoomTarget(15);
					
					form.tentCalculator.start();
				}
			
				viewer.flash(true);
			});
			
			viewer.on('tent-calc-start', function() {
				pattern.tentCalcResult(null);
			});
			
			viewer.on('tent-calc-success', function(result) {
				pattern.tentCalcResult(result);
			});
			
			return pattern;
		})();
	}();

	// stat switcher
	!function() {
		var active;

		$('.stat .toggle', $dom).click(function() {
			active = !active;
			$('.stat', $dom).add(this).toggleClass('active', active);
		});
	}();
	
	// adapt to tree.js
	var canvasW, canvasH,	
		camera, scene, light, renderer, commonGroup;
	
	// const
	var SCALE = 1000;
		
	// projection helper
	var projector = new THREE.Raycaster();

	function updateCameraPosition() {
		var pos = (ZOOM_RANGE[1] - zoom.current) / ZOOM_RANGE[1], // [0..1]
			R = form.state.radius;
		
		// todo: zoom by logarithmic scale
		//pos = Math.pow(2, pos * 10) / 1025;

		pos = NEAR + (FAR - NEAR) * pos; // (NEAR..FAR]

		pos = new THREE.Vector3(
			0,
			0, // man's eyes average height =)
			R * pos //form.state.radius * 5
		);
		pos[AXIS] = (figure ? _.min(_.pluck(figure.$points, AXIS)) : 0) * R + // dome base
			1.6; // avg eyes height

		var part = viewer.drivers[activeMode].particle;

		var dist = (pos.length() + (part * 3 - 1) * R) * SCALE;

		camera.far = dist;
		camera.position.copy(pos.multiplyScalar(SCALE));
		camera.updateMatrixWorld();

		// light distance
		light.distance = dist;
	}

	// renderer init
	!function() {
		canvasW = $canvas.innerWidth();
		canvasH = $canvas.innerHeight();
		window.camera = // debug
			camera = new THREE.PerspectiveCamera(30, canvasW / canvasH, 10, 1e+5);

		scene = rootScene = new THREE.Scene();

		window.renderer = // debug
			renderer = new THREE.CanvasRenderer({ canvas: $canvas[0], antialias: true });

		window.light = // debug
			light = new THREE.PointLight( 0xffffff, 1.5 );
		scene.add( light );
	}();

	// renderer
	viewer.on('render', function(figure) {
		camera.aspect = canvasW / canvasH;
		renderer.setSize(canvasW, canvasH);
		camera.updateProjectionMatrix();
		
		//console.log(canvasW, canvasH);;
		
		// set camera distance position
		updateCameraPosition();
		
		// actualize light position
		light.position.copy(camera.position);
		
		// update figure, if required
		if (figure) {
			// renew common group object, with saving matrix rotation
			if (commonGroup) {
				var prevMatrix = commonGroup.matrix.clone();
				scene.remove(commonGroup);
			}

			window.commonGroup = // debug
			commonGroup = new THREE.Object3D();
			commonGroup.matrixAutoUpdate = false;

			commonGroup.matrix.copy(prevMatrix || commonGroup.matrix);
			var mel = commonGroup.matrix.elements;
			commonGroup.matrix.multiplyScalar(SCALE * form.state.radius / Math.sqrt(mel[0] * mel[0] + mel[4] * mel[4] + mel[8] * mel[8])); //commonGroup.matrix.getColumnX().length());

			scene.add(commonGroup);
			
			// ethalon
			var ethalon = (! form.showEthalon || form.showEthalon()) && CONFIG.get('view.wysiwyg.ethalon');
			
			ethalon = _.isFunction(ethalon) ? ethalon() : ethalon;
			
			if (ethalon instanceof THREE.Mesh) {
				commonGroup.add(ethalon);
			}
			else if (ethalon && 'height' === form.state.partialMode) (function() {
				const
					geometry = new THREE.CubeGeometry(
						0.5 / form.state.radius, 
						1.8 / form.state.radius, 
						0.3 / form.state.radius
					),
					material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ),
					cube = new THREE.Mesh(geometry, material),
					baseY = (1 - 2 * form.state.partialHeight);
				
				cube.position.set(0, baseY + geometry.height / 2, 0);
				material.opacity = .4;
				
				commonGroup.add( cube );
			})();
					
			// refill common group
			_.each(figure.$primitives, function(f) {
				var showRemoved = viewer.drivers[activeMode].showRemoved;

				if (!showRemoved && f.removed) return;

				var color = (productPalette[f.type][f.order] || productPalette[f.type][98]).integer;

				var object = viewer.drivers[activeMode].present(f, color);
				var objects = _.compact(_.isArray(object) ? object : [object]);

				_.each(objects, function(object) {
					if (object.geometry) {
						// vertices relatively center
						averageVertex3(object.position, object.geometry.vertices);
						_.each(object.geometry.vertices, function(v) {
							v.sub(object.position);
						});
					}

					// back link
					object.sourceFigure = f;

					commonGroup.add(object);
				});
			});
			
			// sort if needed
			//if (_.has(commonGroup.children[0], 'sortOrder')) {
			//	commonGroup.children = _.sortBy(commonGroup.children, 'sortOrder');
			//}

			currentFigure = figure;
		}
		
		var renderStartAt = new Date;
		
		// update matrixWorld
		scene.updateMatrixWorld(true);
		
		camera.lookAt(scene.position);
		renderer.render(scene, camera);
		
		lastRenderAt = new Date - renderStartAt;
		if (figure) {
			console.log('render at', lastRenderAt, 'ms');
		}
	});
	
	return viewer;

	function averageVertex3(target, vertices) {
		target.x =
		target.y =
		target.z = 0;
		_.reduce(vertices, function(center, v) {
			return center.add(v);
		}, target)
		.multiplyScalar(1 / vertices.length);
	}
})();

			// any methods how figure may be present

viewer.drivers = (function() {
	var geometry;

	// new vertices registration helper
	function pushVertex(v) {
		var index = _.indexOf(_.pluck(geometry.vertices, 'source'), v);
		if (-1 != index) return index;

		var vertice = new THREE.Vector3().copy(v);
		//vertice.w = 1;
		vertice.source = v;
		geometry.vertices.push(vertice);
		return geometry.vertices.length - 1;
	}

	function pushFace(face, appendRevertedVersion) {
		if (appendRevertedVersion) {
			pushFace(face.slice(0).reverse(), false);
		}

		face = _.map(face, pushVertex);
		if (face.length == 3) {
			geometry.faces.push(new THREE.Face3( face[0], face[1], face[2] ));
		}
		else if (face.length >= 4) {
			for (var i = 1, l = face.length; i < l - 2; i += 2) {
				var face4 = new THREE.Face4( face[0], face[i + 0], face[i + 1], face[i + 2] );

				geometry.faces.push(face4);

				if (face.length > 4) {
					face4._source = face;
					(face._collect = face._collect || []).push(face4);
				}
			}
			if (face.length % 2) {
				var face3 = new THREE.Face3( face[0], face[i + 0], face[i + 1] );
				geometry.faces.push(face3);
				if (face.length > 4) {
					face3._source = face;
					(face._collect = face._collect || []).push(face3);
				}
			}
		}
		else {
			console.error('wrong face', face);
		}
	}

	function averageVertex3(target, vertices) {
		target.x =
			target.y =
				target.z = 0;
		_.reduce(vertices, function(center, v) {
			return center.add(v);
		}, target)
			.multiplyScalar(1 / vertices.length);
	}
	
	const MAX_FONT_SIZE = 200,
		MAX_BG_RADIUS = 200;

	function makeParticleLabelProgram(options) {
		const font = Math.min(options.fontSize, MAX_FONT_SIZE) + 'px ' + options.fontFamily,
			bgRadius = options.bgRadius && Math.min(options.bgRadius, MAX_BG_RADIUS);

		return function(ctx) {
			ctx.transform(1, 0, 0, -1, 0, 0);

			if (bgRadius) {
				ctx.beginPath();

				var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, bgRadius);
				gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
				gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

				ctx.arc(0, 0, bgRadius, 0, Math.PI*2);
				ctx.closePath();

				ctx.fillStyle = gradient;
				ctx.fill();
			}

			ctx.textBaseline = 'middle';
			ctx.textAlign = 'center';
			ctx.fillStyle = 'black';
			ctx.font = font;
			ctx.fillText(options.text, 0, 0);
		};
	}
	
	const CUTTING_LINE_MATERIAL = new THREE.LineDashedMaterial({
			color: 0,
			linewidth: 2,
			dashSize: 7,
			gapSize: 4,
			vertexColors: THREE.VertexColors
		}),
		presentCuttingLine = (face) => {
			if (_.isEmpty(face.cuttingLine)) return;
			
			var lineGeometry = new THREE.Geometry();

			_.each(face.cuttingLine, function(point) {
				lineGeometry.vertices.push(
					new THREE.Vector3().copy(point).multiplyScalar(1010 * form.state.radius)
				);
			});

			return new THREE.Line(lineGeometry, CUTTING_LINE_MATERIAL);
		};

	return {
		"carcass": {
			particle: 1,
			present: function(figure, color) {
				// cutting line
				if (figure.type === 'face') {
					return presentCuttingLine(figure);
				}

				// lines only
				if (figure.type !== 'line') return null;

				geometry = new THREE.Geometry();

				// get product model
				var model = figure.product.model(true);

				var material = new THREE.MeshLambertMaterial({
					color: color,
					shading: THREE.FlatShading,
					overdraw: true,
					wireframe: false,
					opacity: 0.95
				});

				_.each(model, function(face) {
					pushFace(face, false);
				});

				//geometry.normalsNeedUpdate = true;
				geometry.computeFaceNormals();

				// restore normals of face4 like face3
				_.each(geometry.faces, function(face) {
					const sface = face._source;
					
					if (sface) {
						const normally = _.find(sface._collect, face4 => face4.normal.length() > 0);
						
						normally && _.each(sface._collect, function(face4) {
							face4.normal.copy(normally.normal);
						});
					}
				});

				return new THREE.Mesh(geometry, material);
			}
		},

		"tent": {
			N: {
				loader: null,
				content: null
			},
            showRemoved: false,
            particle: (function(particle) {
				// optional
				if (! CONFIG.get('view.modeTent.present')) {
					return particle;
				}
				
				// static code
				const loader = new THREE.TextureLoader();
				
				loader.load('./N.jpg');
				loader.addEventListener("load", function(loader) {
					var texture = loader.content;
					
					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;
					texture.magFilter = THREE.NearestFilter;
					
					//texture.needsUpdate = true;
					
					var driver = viewer.drivers["tent"],
						N = driver.N,
						content = loader.content,
						image = content.image;
			
					N.loader = loader,
					N.content = content,
					N.width = image.width;
					N.height = image.height;
					
					driver.mapper = (function() {
						var width = N.width,
							height = N.height;
						
						return function(u, v) {
							return [
								u,//* width,
								v //* height
							];
						}
					})();
					
					console.log('N loaded...', N);
				});
				
				return particle;
			})(1),
			
            present: function(figure, color) {
				if ('vertex' === figure.type) return;
				
				var isModePattern = ('pattern' === viewer.pattern.mode()),
					useUV = figure.tentPoints && figure.tentPoints[0].stratoUV;
				
				var driver = viewer.drivers["tent"],
					faceMaterial,
					modelFace,
					smallFace,
					uvs;
				
				// hack to use-uv mode drawing without line
				if (! driver.useUV && useUV) {
					_.delay(function() {
						delete driver.useUV;
					});
					driver.useUV = true;
				}
				useUV = driver.useUV;
				
				// face model
				modelFace = figure.product.model(true)[ 0 ];
				smallFace = _.map(modelFace, function(point, index) {
					return nearPoint(
						point,
						modelFace[ (index + 1) % 3 ],
						modelFace[ (index + 2) % 3 ]
					);
				});
				
				function renderFaceModel(options) {
					options = options || {};
					
					var rendered = {};
					
					if (useUV) {
						// texture
						var facePoints = isModePattern ? figure.tentPoints : smallFace;
						pushFace(facePoints, false);
						
						faceMaterial = new THREE.MeshBasicMaterial({ 
							map: viewer.drivers["tent"].N.content, //texture
							side: THREE.DoubleSide,
							shading: THREE.FlatShading,
							
							overdraw: true,
							wireframe: false,
							
							opacity: .94//.93
						});
						
						uvs = geometry.faceVertexUvs[0] = [];

						_.each(geometry.faces, function() { // !!! once face onto geometry
							var mapper = viewer.drivers["tent"].mapper 
									|| (function(u, v) { return [u, v] }),
								
								uvs = _.pluck(figure.tentPoints, 'stratoUV')
									.map(function(uv) {
										var mapped = mapper(uv[0], uv[1]);
										
										return new THREE.Vector2(mapped[0], mapped[1]);
									});

							geometry.faceVertexUvs[0].push(
								//uvs	
								isModePattern ? uvs : uvs.reverse()
							);
						});

						geometry.uvsNeedUpdate = true;
					}
					else {
						// ! useUV
						// solid filling
						pushFace(smallFace, true);
					
						faceMaterial = new THREE.MeshLambertMaterial({
							color: color,
							side: THREE.DoubleSide,
							overdraw: true,
							wireframe: false
						});
					}
					
					geometry.computeFaceNormals();
					
					rendered.face = new THREE.Mesh(geometry, faceMaterial);

					// mouse :hover
					if (options.hover) {
						var overFace = false;
						
						function updateFaceOpacity() {
							faceMaterial.opacity = 
									overFace ? (options.hover.on || 1)
									         : (options.hover.off || .9);
							//contourMaterial.opacity = overFace ? .9 : 0.5;
							
							if (options.hover.cursor) {
								$('canvas')[0].style.cursor = overFace ? options.hover.cursor : '';
							}
						}
						
						updateFaceOpacity();
						
						_.extend(rendered.face, Backbone.Events)
							.on('mousein', function(e) {
								overFace = true;
								updateFaceOpacity();
							})
							.on('mouseout', function(e) {
								overFace = false;
								updateFaceOpacity();
							})
							.on('click', function(e) {
								options.click();
								
								overFace = true;
								updateFaceOpacity();
								
								_.delay(function() {
									// after all drived
									viewer.flash(true);
								});
							});
					}
					
					// contour
					if (true === options.contour) {
						var contourMaterial = new THREE.LineDashedMaterial({
								color: THREE.ColorKeywords.gray,
								linewidth: 2,
								dashSize: 5,
								gapSize: 3,
								vertexColors: THREE.VertexColors
							}),
							contourGeometry = new THREE.Geometry();

						_.each(geometry.vertices, function(vertice) {
							contourGeometry.vertices.push(
								vertice.clone().multiplyScalar(1.010 * form.state.radius)
							);
						});
						contourGeometry.vertices.push(
							geometry.vertices[0].clone().multiplyScalar(1.010 * form.state.radius)
						);

						rendered.contour = new THREE.Line(contourGeometry, contourMaterial);
					}
					
					return rendered;
				}
				
				geometry = new THREE.Geometry();
			
				// 2d mode
				if ('pattern' === viewer.pattern.mode()) {
					if ('face' === figure.type) {
						// render face model
						var face = figure,
							facePoints = face.$points.get(),
							faceMesh = renderFaceModel().face;
						
						// render overlaps
						var overlapMeshList = _.where(face.$sub.line, {
									separator: true 
								})
								// down-to-up direction for separation sides only
								.filter(function(line) {
									var points = line.$points.get(),
										map = _.map(points, function(point) {
											return _.indexOf(facePoints, point);
										}),
										dir = line._sideDir = (map[1] === (map[0] + 1) % 3),
										product = Vector.crossProduct(points[0], points[1])[ AXIS ];
									
									return dir ? product > 0 : product <= 0;
								})
								.map(function(line) {
									var overlapPoints = _.map(line.$points.get(), function(point) {
											var facePointIndex = _.indexOf(facePoints, point);
											
											return face.tentPoints[facePointIndex].clone();
										}),
										
										OVERLAP_WIDTH = .1 / form.state.radius,
										
										alongOverlap = overlapPoints[1].clone().subtract(overlapPoints[0])
											.normalize()
											.scale(OVERLAP_WIDTH * .62), // gold
										
										director = (new THREE.Vector3)
											.crossVectors(alongOverlap, AXIS_VECTOR3)
											.normalize()
											.multiplyScalar(line._sideDir ? - OVERLAP_WIDTH : OVERLAP_WIDTH),
										
										overlapMaterial = new THREE.MeshBasicMaterial({
											color: THREE.ColorKeywords.gray,
											shading: THREE.FlatShading,
											side: THREE.DoubleSide,
											overdraw: false,
											wireframe: false,
											opacity: .33
										});
									
									overlapPoints.push(
										overlapPoints[1].clone().add(director).subtract(alongOverlap)
											// hack overlap visibility under texture through "z-index" coordinate
											.add({ x:0, y:-OVERLAP_WIDTH, z:0 })
									);
									overlapPoints.push(
										overlapPoints[0].clone().add(director).add(alongOverlap)
											// etc
											.add({ x:0, y:-OVERLAP_WIDTH, z:0 })
									);
									
									// render
									geometry = new THREE.Geometry();
									
									pushFace(overlapPoints, true);

									var overlapMesh = new THREE.Mesh(geometry, overlapMaterial);
									
									//overlapMesh.sortOrder = 0;
									return overlapMesh;
								});
						
						//faceMesh.sortOrder = 1;
						return overlapMeshList.concat([ faceMesh ]);
					}
					// pattern => face only
					return;
				}
				
				// 3d mode
                if (figure.type === 'face') {
                    geometry = new THREE.Geometry();

                    // render model
                    var rendered = renderFaceModel({
							hover: {
								off: .94,
								on: 1,
								cursor: "all-scroll",
							},
							click: function() {
								form.tentNetBeginFace(figure["removeIndex"]);
							}
						});
					
					return [ rendered.face ];
				}
				else if ('line' === figure.type) {
                    var line = figure,
                        linePoints = line.$points.get(),
						
						isStatic = _.contains(form.tentNetStaticLineList(), line),
						isAdvanced = _.contains(form.tentNetAdvancedLineList(), line),
						
						lineObjects = _.chain(line.origin.$super.face)
							.map(function(face) {
								if (face.removed) return null;

								var farFacePoint = _.difference(face.$points.get(), linePoints)[ 0 ],
									semiLineFace = _.map([
										nearPoint(linePoints[0], linePoints[1], farFacePoint, .07),
										nearPoint(linePoints[1], linePoints[0], farFacePoint, .07),
										//linePoints[1],
										//linePoints[0],
										nearPoint(linePoints[1], linePoints[0], linePoints[0], .05),
										nearPoint(linePoints[0], linePoints[1], linePoints[1], .05),
									], v => v.scale(1)),
									semiFaceColor = productPalette[face.type][face.order].integer;

								geometry = new THREE.Geometry();

								pushFace(semiLineFace, true);

								var semiLineMaterial = new THREE.MeshLambertMaterial({
										color: isStatic ? THREE.ColorKeywords.red 
											: (isAdvanced ? THREE.ColorKeywords.green : THREE.ColorKeywords.green),
										shading: THREE.FlatShading,
										overdraw: true,
										wireframe: false,
									});
								
								// semiLineMaterial._color = semiFaceColor;
								
								geometry.computeFaceNormals();

								var lineMesh = new THREE.Mesh(geometry, semiLineMaterial);

								_.extend(lineMesh, Backbone.Events)
									.on('mousein', function(e) {
										lineOver = true;
										updateLineOpacity();
									})
									.on('mouseout', function(e) {
										lineOver = false;
										updateLineOpacity();
									})
									.on('click', function(e) {
										if (isStatic) return;
										
										if (isAdvanced) {
											var connected = line.connect();
											form.tentNetAdvancedLineList.removeAll(connected);
											isAdvanced = false;
										} else {
											var separated = line.separate();
											form.tentNetAdvancedLineList.push.apply(form.tentNetAdvancedLineList, separated);
											isAdvanced = true;
										}
										updateLineOpacity();
									});

								return lineMesh;
							})
							.compact()
							.value(),

                        lineMaterials = _.pluck(lineObjects, 'material'),

                        lineOver = false;

                    updateLineOpacity();

                    return lineObjects.length >= 2 ? lineObjects : [];

                    function updateLineOpacity() {
                    	var opacity = lineOver ?
								(line.separator ? .75 : .5) :
								(line.separator ? 1 : .25);

                    	_.each(lineMaterials, function(semiLineMaterial) {
							semiLineMaterial.opacity = opacity;
							//semiLineMaterial.color = color;
						});
                    }
				}
				else return null;

                function nearPoint(master, slave1, slave2, how) {
                	how = how || .05;

                    return new Metrics.Vector()
                        .add( master.clone().scale(1 - how) )
                        .add( slave1.clone().scale(how / 2) )
                        .add( slave2.clone().scale(how / 2) );
                }
            }
		},

		"cover": {
			showRemoved: true,
			particle: 1,
			present: function(figure, color) {
				if (figure.type != 'face') return null;

				geometry = new THREE.Geometry();

				// get product model
				var model = figure.product.model(true);

				_.each(model, function(face) {
					pushFace(face, true);
				});

				//geometry.normalsNeedUpdate = true;
				geometry.computeFaceNormals();

				// restore normals of face4 like face3
				_.each(geometry.faces, function(face) {
					var sface = face._source;

					if (sface) {
						var normal = _.filter(sface._collect, function(face4) {
								return face4.normal.length() > 0;
							})[0].normal;

						_.each(sface._collect, function(face4) {
							face4.normal.copy(normal);
						});
					}
				});

				var material = new THREE.MeshLambertMaterial({
						color: color,
						shading: THREE.FlatShading,
						overdraw: true,
						wireframe: false
					}),
					contourMaterial = new THREE.LineDashedMaterial({
						color: 0,
						linewidth: 5,
						dashSize: 8,
						gapSize: 5,
						vertexColors: THREE.VertexColors
					}),
					contourGeometry = new THREE.Geometry();

				_.each(figure.$points.get(), point => {
					const vertice = _.findWhere(geometry.vertices, { source: point });
					
					contourGeometry.vertices.push(
						vertice.clone().multiplyScalar(1000 * form.state.radius)
					);
				});
				contourGeometry.vertices.push(
					_.findWhere(geometry.vertices, { source: figure.$points[0] })
						.clone().multiplyScalar(1000 * form.state.radius)
				);
				/*
				_.each(geometry.vertices, function(vertice) {
					contourGeometry.vertices.push(
						vertice.clone().multiplyScalar(1000 * form.state.radius)
					);
				});
				contourGeometry.vertices.push(
					geometry.vertices[0].clone().multiplyScalar(1000 * form.state.radius)
				);
				*/

				var contour = new THREE.Line(contourGeometry, contourMaterial);

				updateOpacity();

				var object = new THREE.Mesh(geometry, material),
					over = false;

				_.extend(object, Backbone.Events)
					.on('mousein', function(e) {
						over = true;
						updateOpacity();
					})
					.on('mouseout', function(e) {
						over = false;
						updateOpacity();
					})
					.on('click', function(e) {
						if (figure.removed) {
							var restored = _.pluck(figure.restore(), 'removeIndex');
							form.removedList.removeAll(restored);
						} else {
							var removed = _.pluck(figure.remove(), 'removeIndex');
							form.removedList.push.apply(form.removedList, removed);
						}
						updateOpacity();
					});

				// cutting line
				return [object, contour, presentCuttingLine(figure)]; // todo: how to do cutting bolder?

				function updateOpacity() {
					material.opacity = CONFIG.view.modeCover.opacity(over, figure.removed);
					contourMaterial.opacity = over ? .5 : 0;
				}
			}
		},

		"schema": {
			particle: 1 / 3,
			present: function(figure, color) {
				geometry = new THREE.Geometry();

				_.each(figure.$points, pushVertex);

				var object = new THREE.Object3D();

//				if (this[figure.type]) {
//					var adv = this[figure.type](figure, color);
//					if (adv) object.add(adv);
//				}

				// product index
				var fontSize = (form.state.radius / form.state.detail * 100) * (form.state.subdivClass == 'I' ? 1 : 1.33),
					particle = new THREE.Particle(new THREE.ParticleCanvasMaterial({
						color: color,
						program: makeParticleLabelProgram({
							fontSize: fontSize * (figure.type === 'face' ? 1.3 : 1),
							fontFamily: 'Optimer, verdana',
							bgRadius: fontSize,
							text: figure.index
						})
					}));

				if (figure.type == 'vertex') {
					averageVertex3(particle.position, figure.$points);
					particle.position.multiplyScalar(1 + 0.05 / figure.product.R); // 5cm to outside
				} else {
					var points = _.unique(_.flatten(figure.product.model(true)));

					if (figure.type == 'line' && /^GoodKarma|Semicone$/.test(form.state.connType)) {
						//points = points.concat()
						points = points.concat(figure.bindedFace.$points.get());
					}

					averageVertex3(particle.position, points);
					particle.position.normalize();
				}
				particle.position.multiplyScalar(1.001);
				//particle.updateMatrix();

				object.add(particle);

				return [ viewer.drivers["carcass"].present(figure, color), object ];
			}
		},

		"base": {
			particle: 1 / 3,
			present: (function() {
				return function(figure, color) {
					if (figure.type != 'line' || figure.origin.removed || (figure.bindedFace && figure.bindedFace.removed)) return;

					var isActive = (_.where(figure.origin.$super.face, { removed: false }).length == 1), // basically
						isBase = isActive;

					var lineObject = viewer.drivers["carcass"].present(figure, color),
						objects = [ lineObject ];

					begin(objects);

					if (isBase) {
						baseLines.push(figure);
					}

					lineObject.material.opacity = isActive ? .5 : .027;

					_.extend(lineObject, Backbone.Events)
						.on('mousein', function(e) {
							this.material.opacity = .263;
						})
						.on('mouseout', function(e) {
							this.material.opacity = isActive ? .5 : .027;
						})
						.on('click', function(e) {
							// toggle activity
							isActive = !isActive;

							if (isActive) {
								activeLines.push(figure);
							} else {
								activeLines = _.difference(activeLines, [figure]);
							}

							if (isBase) {
								recalcBaseMetricContainer();
							}

							_.each(figure.origin.$sub.vertex, updateVertexMetric);

							this.material.opacity = isActive ? .5 : .027;
						});

					_.each(figure.origin.$sub.vertex, function(vertex) {
						if (once(vertex)) {
							vertex.metricObjects = vertexMetric(vertex);

							objects = objects.concat(vertex.metricObjects);
						}
						updateVertexMetric(vertex);
					});

					if (isActive) {
						activeLines.push(figure)
					}

					return objects;
				};

				var inited, axisDown, R,
					vertexRegister, activeLines, baseLines, baseVertexes,
					baseMetricContainer;

				function begin(objects) {
					if (inited) return;

					vertexRegister = [];
					activeLines = [];
					baseLines = [];

					// release mem
					_.each(figure.subs('vertex'), function(vertex) {
						delete vertex.metricObjects;
					});

					// init base metric container
					baseMetricContainer = new THREE.Object3D();
					objects.push(baseMetricContainer);

					R = form.state.radius;

					// get down position by axis uses global figure object
					axisDown = _.chain(figure.subs('vertex'))
						.where({ removed: false, live: true })
						.pluck('$points').pluck('0')
						.pluck(AXIS)
						.min()
						.value();

					// destroy inited state after driver been fully applied by current runtime
					_.defer(end);

					inited = true;
				}
				function end() {
					// order base vertexes collection as polygon
					var lines = _.tail(baseLines, 0),
						line = lines[0],
						vertex = line.origin.$sub.vertex[0];
					baseVertexes = [];
					while (line) {
						baseVertexes.push(vertex);
						lines = _.difference(lines, [line]);
						line = _.find(lines, function (l) {
							return _.contains(l.origin.$sub.vertex, vertex);
						});
						vertex = line && line.origin.$sub.vertex[ line.origin.$sub.vertex[0] === vertex ? 1 : 0 ];
					}

					_.isEmpty(lines) || console.error('Achtung happens');

					recalcBaseMetricContainer();
					viewer.trigger('render');

					inited = false;
				}

				function once(entity) {
					if (!_.contains(vertexRegister, entity)) {
						vertexRegister.push(entity);
						return true;
					}
				}

				function recalcBaseMetricContainer() {
					var cont = baseMetricContainer;

					// clear
					for (var i = cont.children.length - 1; i >= 0; i--)
						cont.remove(cont.children[i]);

					// fill
					var vertexes = _.intersection(baseVertexes, _.chain(activeLines).pluck('origin').unique().pluck('$sub').pluck('vertex').invoke('get').flatten().value());
					if (vertexes.length > 1) {
						var lineColor = 0x808080,
							lineMaterial = new THREE.LineBasicMaterial({
								color: lineColor,
								opacity: 1,
								linewidth: 1,
								vertexColors: THREE.VertexColors
							}),
							prevVertex = _.last(vertexes);

						_.each(vertexes, function(vertex) {
							var lineGeometry = new THREE.Geometry,
								vertices = _.map([prevVertex, vertex], function(vertex) {
									var point = vertex.$points[0],
										vertice = new THREE.Vector3(point.x, point.y, point.z);
									vertice[AXIS] = axisDown;
									lineGeometry.vertices.push(vertice.multiplyScalar(1000 * R));
									return vertice;
								});
							baseMetricContainer.add(new THREE.Line(lineGeometry, lineMaterial));

							// line length, mm
							var lineParticle = new THREE.Particle(new THREE.ParticleCanvasMaterial({
								color: 'black',
								program: makeParticleLabelProgram({
									fontSize: (24 * R),
									fontFamily: 'monospace, Optimer, verdana',
									text: Math.round(vertices[0].clone().sub(vertices[1]).length())
								})
							}));
							lineParticle.position.addVectors(vertices[0], vertices[1]).multiplyScalar(.5 / 1000 / R); // todo: refactor for no coords magic
							baseMetricContainer.add(lineParticle);

							prevVertex = vertex;
						});
					}

					// metric polygon members
					var members = _.intersection()
				}

				function updateVertexMetric(vertex) {
					_.each(vertex.metricObjects, function(object) {
						object.visible = _.any(vertex.$super.line, function(line) {
							return _.contains(activeLines, line);
						});
					});
				}

				function vertexMetric(vertex) {
					var point = vertex.$points[0],
						baseDelta = Math.abs(point[AXIS] - axisDown) * R;

					// radius
					var vertexColor = productPalette[vertex.type][vertex.order].integer,
						radiusGeometry = new THREE.Geometry,
						radiusVertice = new THREE.Vector3(point.x, point.y, point.z),
						radiusCenter = new THREE.Vector3,
						vertexMaterial = new THREE.LineBasicMaterial({
							color: vertexColor,
							opacity: 1,
							linewidth: 1,
							vertexColors: THREE.VertexColors
						});

					radiusCenter[AXIS] = axisDown;
					radiusVertice[AXIS] = axisDown;

					radiusGeometry.vertices.push(radiusCenter.multiplyScalar(1000 * R));
					radiusGeometry.vertices.push(radiusVertice.multiplyScalar(1000 * R));

					var radiusLine = new THREE.Line(radiusGeometry, vertexMaterial);

					// radius length, mm
					var radiusParticle = new THREE.Particle(new THREE.ParticleCanvasMaterial({
						color: 'black',
						program: makeParticleLabelProgram({
							fontSize: (24 * R),
							fontFamily: 'monospace, Optimer, verdana',
							text: Math.round(radiusVertice.clone().sub(radiusCenter).length())
						})
					}));
					radiusParticle.position.addVectors(radiusCenter, radiusVertice).multiplyScalar(.5 / 1000 / R); // todo: refactor for no coords magic

					if (baseDelta > 1e-6) {
						var deltaBase = new THREE.Vector3(point.x, point.y, point.z),
							deltaVertice = deltaBase.clone(),
							deltaGeometry = new THREE.Geometry;

						deltaBase[AXIS] = axisDown;

						deltaGeometry.vertices.push(deltaBase.multiplyScalar(1000 * R));
						deltaGeometry.vertices.push(deltaVertice.multiplyScalar(1000 * R));

						var deltaLine = new THREE.Line(deltaGeometry, vertexMaterial);

						// delta, mm
						var deltaParticle = new THREE.Particle(new THREE.ParticleCanvasMaterial({
							color: 'black',
							program: makeParticleLabelProgram({
								fontSize: (24 * R),
								fontFamily: 'monospace, Optimer, verdana',
								text: Math.round(deltaBase.clone().sub(deltaVertice).length())
							})
						}));
						deltaParticle.position.subVectors(deltaVertice, deltaBase).setLength(32 * R).add(deltaVertice).multiplyScalar(1 / 1000 / R);
					}

					return _.compact([radiusLine, radiusParticle, deltaLine, deltaParticle]);
				}
			})()
		}
	};
})();
			﻿var form = (function() {

	// teach knockout to animate visibility toggling
	(function(visible){
		var originUpdate = visible.update;
		visible.update = function (element, valueAccessor) {
			if (!form.animate || !$(element).closest('.slow-toggle-visibility').length)
				return originUpdate.apply(this, arguments);
			var show = ko.utils.unwrapObservable(valueAccessor());
			show ?
				$(element).slideDown('fast') :
				$(element).slideUp('fast');
		}
	})(ko.bindingHandlers.visible);

	// teach knockout to plot product on canvas
	ko.bindingHandlers.plot = {
		update: function(canvas, valueAccessor) {
			// get bound callback (don't care about context, it's ready-to-use ref to function)
			var product = valueAccessor();

			if (_.isArray(product)) {
				var options = product[1];
				product = product[0];
			}

			// fire callback with new value of an observable bound via 'html' binding
			_.defer(_.bind(product.plot, product, canvas, options));
		}
	};
	
	
	// figure default params
	FigureOptionsVM.defaults = CONFIG.defaultFigure;
	
	
	const form = new FigureOptionsVM(function(state){
		form.trigger('change', state);
	});
	
	// used as dependency by reporting product statistics
	form.resultFigure = ko.observable();

	form.resultMeter = ko.computed(function() {
		var meter = new Meter,
			figure = form.resultFigure(),
			removed = form.removedList(); // depends

		if (!figure) return;

		meter.push(__('Sizes (units)'), _.reduce({
			face: 'Faces',
			line: 'Edges',
			vertex: 'Vertices'
		}, function(stat, title, type) {
			var sizes = 0, total = 0;

			_.chain(figure.$primitives)
				.where({ type: type, /*new important cond*/live: true, removed: false })
				.countBy('index')
				.each(function(count, index) {
					sizes += count > 0;
					total += count;
				});
			stat[__(title)] = sizes + ' (' + total + ')';

			return stat;
		}, {}));

		_.each(['vertex', 'line', 'face'], function(type) {
			_.chain(figure.$primitives)
				.where({ type: type, removed: false })
				.groupBy('index')
				.each(function(list, index) {
					_.each(list, function(figure) {
						meter.push(figure.product.meter());
					});
				});
		});

		return meter;
	}, null, { deferEvaluation: true });

	form.reportText = ko.computed(function() {
		var meter = form.resultMeter();

		return meter ? meter.reportText() : i18n('Please, wait...');
	}, null, { deferEvaluation: true });

	// set flag
	$('form.options').addClass('slow-toggle-visibility');
	
	// flag to animate form elements
	form.animate = true;

	form.update = function(data) {
		_.each(data, function(value, key) {
			if (ko.isObservable(form[key])) {
				form[key]( value );
			}
		});
	};

	return form;
	

	// view model of form
	function FigureOptionsVM(stateReceiver, timeout){
		// const
		this.FULLEREN_TYPE_LIST = ko.computed(function() {
			return [{
				id: 'inscribed',
				name: __('fulleren:Inscribed in')
			}, {
				id: 'described',
				name: __('fulleren:Described around')
			}];
		});
	
		const form = this;

		form.state = {}; // of current

		// manual/auto mode
		!function() {
			var forcibly = 0; // counter for non-manual value change detection

			form.forceBegin = function() { forcibly++ };
			form.forceEnd = function() { forcibly-- };
			form.isModeForcibly = function() { return !!forcibly };
		}();

		/**
		 * init observables from config defaults (with one nested level)
		 * & firing logic..
		 */
		_.each(FigureOptionsVM.defaults, function(value, key) {
			if (_.isObject(value) && !_.isArray(value)) {
				// simplify init of nested
				const subForm = form[key] = {},
					subState = form.state[key] = {};
				
				_.each(value, (subValue, subKey) => {
					subForm[subKey] = ko.observable();
					subForm[subKey].subscribe(function(value) {
						subState[subKey] = value;
						
						fireChange();
					});
				});
				
				return;
			}
			
			form[key] = ko.observable();
			form[key].subscribe(function(value) {
				form.state[key] = value;

				// protect the values of the change is not manually
				if (! form.isModeForcibly() && form[key])
					form[key].manual = value;

				fireChange();
			});
		});
		
		var	lastFiredState;

		// deferred state-change firer
		fireChange = _.wrap(fireChange, function(fire) {
			calcProc.then(fire);
		});
		fireChange = _.debounce(fireChange, 200);

		function fireChange() {
			const state = JSON.stringify(
				_.omit(form.state, 'tentNetAdvancedLineList', 'tentNetLineList', 'tentNetStaticLineList')
			);
			if (state != lastFiredState) {
				stateReceiver(form.state);
			}
			lastFiredState = state;
		}
		
		/**
		 * computed options lists
		 */
		_.each('connTypeList detailList partialList subdivClassList'.split(' '), function(key) {
			form[key] = ko.observable();
		});

		// true subdivMethodList
		this.subdivMethodList = ko.computed(function() {
			var options = [{
					id: 'Chords',
					name: __('method:Equal Chords')
				}].concat(
					form.subdivClass() == 'I' && form.detail() > 2 ? [
						{
							id: 'Arcs',
							name: __('method:Equal Arcs')
						}, {
							id: 'Mexican',
							name: __('method:Mexican')
						}
					] : []
				).concat(
					form.base() === 'Icosahedron' && form.subdivClass() === 'I' && /^(3|4)$/.test(form.detail()) ? [
						{
							id: 'Kruschke',
							name: __('method:Kruschke')
						}
					] : []
				);

			form.subdivMethod(maybe(form.subdivMethod.manual, _.pluck(options, 'id')));

			return options;
		}, this, { deferEvaluation: true });


		// option lists fresher
		function refreshList(what) {
			form.forceBegin();
			_.each(what.split(/\s+/), function(what) {
				refreshList[what]();
			});
			form.forceEnd();
		}

		_.extend(refreshList, {
			detail: function() {
				var list = form.fullerenType() ? _.range(1, 9) : _.range(1, 19);
				if (form.subdivClass() == 'II') {
					list = _.filter(list, function(v) {
						return v % 2 != 1;
					});
				}

				form.detailList(list);
				form.detail( luckyNumber(form.detail.manual, list) );
			},

			subdivClass: function() {
				var classes = [{ 
						id: 'I', 
						name: 'I' 
					}],
					V = form.detail();

				for (var p = 1, q = V - p; p < V / 2; p++, q--) {
					classes.push({
						id: 'III_' + p + ',' + q, 
						name: 'III ' + p + ',' + q
					});
				}

				if (V % 2 == 0) {
					classes.push({
						id: 'II',
						name: 'II'
					});
				}

				for (var p = Math.floor(V / 2 + 1), q = V - p; p < V; p++, q--) {
					classes.push({
						id: 'III_' + p + ',' + q,
						name: 'III ' + p + ',' + q
					});
				}

				form.subdivClassList(classes);
				form.subdivClass(maybe(form.subdivClass.manual, _.pluck(classes, 'id')));
			},

			partial: function() {
				if ('Icosahedron' == form.base()) {
					var partialList = partialList_ClassI(form.detail());
				}
				else if ('Octohedron' == form.base()) {
					partialList = partialList_Octohedron(form.detail());
				}

				form.partialList(partialList);
				form.partial(nearestRational(form.partial.manual, partialList));
			},

			connType: function() {
				var list = ['Piped', 'GoodKarma', 'Semicone'];

				if (form.fullerenType() || form.subdivClass() == 'II' || /^(Chords|Kruschke)$/.test(form.subdivMethod()))
					list.push('Cone');

				list.push(form.fullerenType() ? 'Nose' : 'Joint');

				form.connTypeList(list);
				form.connType(maybe(form.connType.manual, list));
			}
		});

		// lists binding
		form.base.subscribe(function() {
			refreshList('partial');
		});

		form.detail.subscribe(function() {
			refreshList('partial subdivClass');
		});

		form.fullerenType.subscribe(function() {
			refreshList('partial connType detail');
		});

		form.subdivClass.subscribe(function() {
			refreshList('detail');
		});

		form.subdivMethod.subscribe(function() {
			refreshList('connType');
		});
		
		/**
		 * advanced computes
		 */
		form.canAlignTheBase = ko.computed(function() {
			var can = 
				(form.subdivClass() == 'I')
				&& 'Kruschke' !== form.subdivMethod()
				&& ! form.fullerenType()
				&& ! /^1\/[12]$/.test( form.partial() )
				&& /Piped|Joint|GoodKarma|Semicone/.test( form.connType() );

			// force set align
			form.forceBegin();
			form.alignTheBase(can && form.alignTheBase.manual);
			form.forceEnd();

			return can;
		}, null, { deferEvaluation: true });

		// strut view state
		form.strutViewBySide = ko.observable( JSON.parse(localStorage.getItem('acidome.view-strut-by-side') || 'false') );
        form.strutViewBySide.subscribe(function(bySide) {
        	localStorage.setItem('acidome.view-strut-by-side', JSON.stringify(bySide));
		});
		
		/**
		 * clothier [deprecated]
		 */
		form.clothier = {
			width: ko.observable(),
			height: ko.observable(),

			onRun: ko.observable(false),
			onPause: ko.observable(false),

			run: function() {
				form.clothier.onRun(true);
				form.clothier.onPause(false);
			},
			pause: function() {
				form.clothier.onPause(true);
			},
			stop: function() {
				form.clothier.onPause(false);
				form.clothier.onRun(false);
			}
		};

		// removed figure entities (working in "Cover" mode)
		form.removedList = ko.observableArray([]);
		form.removedList.subscribe(function(list) {
			form.state.removedList = list;
			fireChange();
		});

		/**
		 * Tent calculation mode
		 */
		form.tentNetBeginFace = ko.observable(); // =>
		form.tentNetStaticLineList = ko.observableArray([]);
		
		// + texture
		form.tentNetTextureName = ko.observable();
		
		// + advanced separators
		form.tentNetAdvancedLineList = ko.observableArray([]);
		
		// = sum
		form.tentNetLineList = ko.computed(function() {
			var staticList = form.tentNetStaticLineList(),
				advancedList = form.tentNetAdvancedLineList(),
				commonList = staticList.concat(advancedList);
			
			form.state.tentNetLineList = commonList;
		
			return commonList;
		});
		
		// reset tent net
		form.resetTentNet = function() {
			form.tentNetBeginFace(null);
			form.tentNetStaticLineList([]);
			form.tentNetAdvancedLineList([]);
		};

		// auto init net by begin face
		form.tentNetBeginFace.subscribe(function(beginFaceIndex) {
			form.state.tentNetBeginFace = beginFaceIndex;
			
			if (beginFaceIndex) {
				form.initTentNet(beginFaceIndex);
			} else {
				form.tentNetStaticLineList([]);
			}
			
			fireChange();
		});
		
		form.tentNetTextureName.subscribe(function(textureName) {
			form.state.tentNetTextureName = textureName;
			
			fireChange();
		});
		
        form.tentNetStaticLineList.subscribe(function(list) {
            form.state.tentNetStaticLineList = list;
			
			// reset advanced, after static beginning
			form.tentNetAdvancedLineList([]);
			
			fireChange();
        });
		
        form.tentNetAdvancedLineList.subscribe(function(list) {
            form.state.tentNetAdvancedLineList = list;
			
			fireChange();
        });
		
		
		form.tentNetStamp = ko.computed(function() {
			var beginFace = form.tentNetBeginFace(),
				advancedLines = form.tentNetAdvancedLineList();
			
			return _.compact([
				beginFace,
				_.pluck(advancedLines, 'removeIndex').join('')
			]).join('+');
		});
		
        form.initTentNet = function(start) {
			if (!figure) {
				form.tentNetNeedUpdate = {
					start: start
				};
				return;
			}
		
			var separateLines = [],
				coupleLineList = figure.coupleLineList = [],

				all = figure.$primitives.get(),
				points = figure.$points.get(),
				lines = _.where(all, { type: 'line', removed: false }),
				faces = _.where(all, { type: 'face', removed: false });

			if ('string' === typeof start) {
				start = _.findWhere(faces, { removeIndex: start });
			}
			
			// top face starter, as default
			var wave = start ? [ start ] : [ 
					_.max(faces, function(face) { 
						return _.max( 
							_.pluck(face.$points.get(), AXIS) 
						);
					})
				],
				left = wave.slice(0);

			// save start
			start = wave[0];
			
			// walk up
			while (wave[0]) {
				var next = [];

				_.each(wave, function (waveFace) {
					var directionFaces = _.difference(
							faceSiblings(waveFace),
							left, next
						);

					next = next.concat(directionFaces);

                    coupleLineList = figure.coupleLineList = coupleLineList.concat(
                        _.intersection(
                            subLinesOf([ waveFace ]),
                            subLinesOf(directionFaces)
                        )
                    );
                });

				left = left.concat(next);
				wave = next;
			}

			separateLines = _.difference(subLinesOf(faces), coupleLineList);

			// set into figure
            form.tentNetStaticLineList(separateLines);

			// init into figure
			_.each(lines, function(line) {	
				if (_.contains(separateLines, line)) {
					line.separate();
				} else {
					line.connect();
				}
            });
			
			// no calc start (start only after tent view mode switching to "pattern")
			form.initTentCalculator();

			// helpers
			function subLinesOf(faces) {
				return _.chain(faces)
                    .pluck('$sub')
                    .pluck('line')
					.invoke('get')
                    .flatten()
					.unique()
                    .where({ removed: false, selvage: false })
                    .value()
            }

			function faceSiblings(face) {
				return _.chain(face.$sub.line)
					.pluck('$super')
					.pluck('face')
                    .invoke('get')
                    .flatten()
                    .unique()
                    .where({ removed: false })
					.difference([ face ])
					.value();
            }
		};
		
		// todo?
		form.stopToCalcTent = _.noop;
		
		form.initTentCalculator = function() {
			console.log('form.initTentCalculator()...');
			
			// stop logic
			form.stopToCalcTent();
			
			var stopToCalcTent;
			form.stopToCalcTent = function() {
				stopToCalcTent = true;
			};
		
			// basic entities
			var netStamp = form.tentNetStamp(),
			
				all = _.where(figure.$primitives.get(), { removed: false }),
				//points = figure.$points.get(),
				lines = _.where(all, { type: 'line' }),
				faces = _.where(all, { type: 'face' });

			// init tent-points (copy from face points)
			var tentFaces = _.map(faces, function(face) {
					face.tentPoints = _.map(face.$points.get(), function(point) {
						var clone = point.clone();
						clone._from = point._enum;
						//clone._source = point;
						return clone;
					});
					return face;
				});
			
			console.log('tentPoints', _.chain(tentFaces).pluck('tentPoints').flatten().unique().value().length);
			
			// union common tent-points from couple faces with common line
			_.each(figure.coupleLineList, function(line) {
				var faces = line.$super.face,
					crossPoints = _.intersection(faces[0].$points.get(), faces[1].$points.get());
				
				//console.log('crossPoints', crossPoints);

				var times = 0;
				
				for (var i = 0; i < 3; i++) {
					var face0_tentPoint = faces[0].tentPoints[i];
					
					if (_.contains(crossPoints, faces[0].$points[i])) {
						var face1_i = _.indexOf(faces[1].$points.get(), faces[0].$points[i]),
							face1_tentPoint = faces[1].tentPoints[face1_i];
						
						if (face1_tentPoint.tentSource || ! face0_tentPoint.tentSource) {
							faces[0].tentPoints[i] = face1_tentPoint;
							face1_tentPoint.tentSource = true;
						} else {
							faces[1].tentPoints[face1_i] = face0_tentPoint;
							face0_tentPoint.tentSource = true;
						}
						times++;
					}
				}
					
				times === 2
					|| console.warn('2 points expected, found', times);
				
				_.every(faces) // todo: assertions by .tentPoints
			});
			
			var tentPoints = figure.tentPoints
					= _.chain(tentFaces).pluck('tentPoints').flatten().unique().value();
			console.log('tentPoints (after couple)', tentPoints.length);
			
			// reduce 3d to 2d
			var OTHER_AXES = {
					x: ['y', 'z'],
					y: ['z', 'x'],
					z: ['x', 'y'],
				}[ AXIS ],
				
				//BOOST_STEP = .002,
				PLAIN_BOOST_STEP = .4,
				REDUCE_ACCURACY = 3e-9,
				accuracy,
				steps = form.lastTentSteps = _.reduce(faces, function(steps, face) {
					var facePoints = face.$points.get();
					
					_.each(face.$sub.line, function(line) {
						if (! line.separator && _.contains(_.pluck(steps, 'line'), line)) return;
					
						var linePoints = line.$points.get(),
							i = _.indexOf(facePoints, linePoints[0]),
							j = _.indexOf(facePoints, linePoints[1]);
						
						//if (linePoints[0]._enum < linePoints[1]._enum) return;
						
						var A = face.tentPoints[i],
							B = face.tentPoints[j];
						
						steps.push({
							line: line,
							A: A,
							B: B,
							targetLength: A.distance(B),
							//velocity: 0,
							boost: function() {
								var AB = this.B.clone().subtract(this.A);
							
								// AB current length
								this.currentLength = AB.length();
								
								// current length delta to target
								this.deltaLength = (this.targetLength - this.currentLength);
								
								this.deltaVectorHalf = AB.scale(
									this.deltaLength / this.currentLength 
									* (1 - PLAIN_BOOST_STEP)
									/ 2
								);
								
								// acceleration of velocity
								//this.velocity = deltaLength * BOOST_STEP;
								
								// return accuracy
								return Math.abs(this.deltaLength) / this.targetLength;
							},
							step: function() {
								if (accuracy > .03) {
									//this._accurateFixed
									//	&& console.error('already accurate fixed');
										
									this.deltaVectorHalf.scale( .03 / accuracy );
									//this._accurateFixed = true;
								}
								
								this.B.add(this.deltaVectorHalf);
								this.A.subtract(this.deltaVectorHalf);
							}
						});
					});
					
					return steps;
				}, []);
				
			var heightAngle = function(point) {
					for (var side = point.clone(); side[AXIS] = 0; );
					
					return Math.atan2(side.length(), point[AXIS]);
				},
				maxHeightAngle = _.max(_.map(tentPoints, heightAngle));
			
			// in first, all tent points in one plain
			_.each(tentPoints, function(point) {
				for (var side = point.clone(); side[AXIS] = 0; );
				
				var sideLength = side.length(),
					ha = Math.atan2(sideLength, point[AXIS]),
					sideRadius = ha / maxHeightAngle;
					//semiSphereHeightAngle = (ha / maxHeightAngle) * Math.PI / 2,
					//semiSphereRadius = Math.sin(semiSphereHeightAngle);
				
				side.scale(1 / sideLength);
				
				// grounded
				point[AXIS] = 0;
				point[OTHER_AXES[0]] = side[OTHER_AXES[0]] * ha;
				point[OTHER_AXES[1]] = side[OTHER_AXES[1]] * ha;
				
				var sideUV = side.scale(sideRadius);
				
				// calc uvs
				point.stratoUV = [
					.5 + sideUV[OTHER_AXES[0]] / 2,
					.5 + sideUV[OTHER_AXES[1]] / 2
				];
			});
			
				
			var step = 0;
			
			// return in `promise` style
			return form.tentCalculator = {
				start: function() {
					one(); // no param!
				},
				stop: function() {
					stopToCalcTent = true;
				}
			};
			
			function pack() {
				for (var i = 0; i < 64; i++)
					one(i);
			}
			
			function one(tail) {
				// plainer
				//_.each(uniquePoints, function(point) {
				//	point[AXIS] *= PLAIN_BOOST_STEP;
				//});
				
				// meter max accuracy
				accuracy = _.max([
					//_.max( _.pluck(uniquePoints, AXIS) ),
					_.max( _.invoke(steps, 'boost') )
				]);
				
				// apply step actions
				_.invoke(steps, 'step');
				
				if (step % 1500 === 0) {
					requestAnimationFrame(function() {
						viewer.flash(true);
						
						var progress = Math.round( - Math.log10(accuracy) * 10 ),
							progressEnd = Math.round( - Math.log10(REDUCE_ACCURACY) * 10 );
						
						viewer.pattern.progress(progress >= progressEnd ? null : progress / progressEnd);
						
						//console.log(step + '. boost accuracy max', accuracy, ' ' + progress + '/' + progressEnd);
					});
				}
				
				if (accuracy >= REDUCE_ACCURACY) {
					tail || stopToCalcTent ||
						_.delay(pack, 1);
				} else {
					if (! tail || stopToCalcTent) {
						console.log(step + '. accuracy reduce complete', accuracy);
						
						viewer.flash(true);
						viewer.pattern.progress(null);
						
						if (! stopToCalcTent) {
							// to remember last calc result for
							viewer.pattern.lastNetStamp = netStamp;
							
							viewer.trigger('tent-calc-success', {
								points: tentPoints
							});
						}
						
						viewer.trigger('tent-calc-complete');
					}
				}
				
				if (0 === step++) {
					viewer.trigger('tent-calc-start');
				}
			}
		}

		// figure budget
		form.budgetList = ko.observable();

		// set default values
		!function() {
			defaults(FigureOptionsVM.defaults, form);

			function defaults(object, subject) {
				_.each(object, function(value, key) {
					_.isObject(value) && !_.isArray(value) ?
						defaults(value, subject[key]) :
						subject[key](value);
				});
			}
		}();

		// events support
		_.extend(this, Backbone.Events);
	}


	// helpers
	function maybe(value, list) {
		return _.contains(list, value) ? value : list[0];
	}

	function luckyNumber(best, variants) {
		var lucky, quality = -1;
		_.each(variants, function(number){
			var distance = Math.abs(number - best);
			if (-1 == quality || distance < quality){
				lucky = number;
				quality = distance;
			}
		});
		return lucky;
	}

	function partialList_Octohedron(V) {
		console.log('partialList_Octohedron(' + V + ')');
		
		var V2 = V * V;

		for (var list = [], p = 1; p <= V; p++)
			list.push(rational(p * p, 2 * V2));
		
		for (var p2 = 0, p = V; p >= 1; p--) {
			p2 += (2 * p - 1);
			list.push(rational(V2 + p2, 2 * V2));
		}
		
		return list;
	}

	function partialList_ClassI(V) {
		//console.log('partialList_ClassI(' + V + ')');

		for (var list = [], p = V, q = V * 4; p <= V * 4; p += (p != V * 3) ? 2 : V)
			list.push(rational(p, q));
		
		return list;
	}

	/*
	function partialList_ClassII(V, symmetry) {
		console.log('partialList_ClassII(' + V + ', ', symmetry + ')');

		var v = V / 2,
			faceCount = 60 * v * v;

		switch (symmetry) {
			case 'Cross':
			case 'Triad':
			case 'Pentad':
		}
	}
	*/

	function rational(p, q) {
		var pp = p, qq = q;
		// simplify rational fraction
		for (var m = 2; m <= pp && m <= qq;)
			if (pp % m == 0 && qq % m == 0) {
				pp /= m;
				qq /= m;
			} else
				m++;
		return pp + '/' + qq;
	}

	function nearestRational(rational, list) {
		var result, lastValue,
			target = eval(rational);

		_.each(list, function(rational) {
			var value = eval(rational);
			if (!result || Math.abs(value - target) < Math.abs(lastValue - target)) {
				result = rational;
				lastValue = value;
			}
		});
		return result;
	}
})();

			// calculation process

!function(root){
	var chain = [], io, startLength, timeout = null;
	
	var proc = root.calcProc = _.extend({
		stop: function(){
			if (chain.length){
				proc.trigger('cancel', chain);
			}
			chain = [];
			io = null;
			clearTimeout(timeout);
			timeout = null;
			return this;
		},
		start: function(stages){
			this.stop();
			chain = chain.concat(_.compact(_.flatten(stages)));
			startLength = chain.length;
			proc.trigger('start', chain);
			
			//timeout = true;
			//Promise.resolve().then(tick);
			timeout = setTimeout(tick, 0);
			return this;
		},
		length: function(){
			return chain.length;
		},
		then: function(after) {
			if (!this.length()) {
				after();
			} else {
				function cb() {
					this.off('complete cancel', cb);
					after();
				}
				this.on('complete cancel', cb, this);
			}
		}
	}, Backbone.Events);
	
	function tick() {
		var progress = startLength - chain.length;
		var stage = chain.shift();
		if (stage) {
			proc.trigger('stage', stage, progress, io);
			
			//function nextStep() {
				io = stage.process(io);
				
				if (!io) {
					proc.stop();
					debugger;
				}
				
				proc.trigger('stageOk', stage, progress, io);
			//	setTimeout(tick);
			//}
			
			//timeout && Promise.resolve().then(tick);
			timeout = setTimeout(tick, 0);
		} else {
			timeout = null;
			proc.trigger('complete', chain);
		}
	}
}(window);

			// offline version
$('body').toggleClass('offline', IS_OFFLINE);

// iframe version
$('body').toggleClass('iframe', IS_IFRAME);
if (IS_IFRAME) {
	$('html').css({ overflow: 'hidden' });
	$('.geodesic').height($(window).height());
}

// download
!function() {
	var downloadUrl;
	
	$('.download').on('click', function() {
		downloadUrl = downloadUrl || $(this).attr('href')
		$(this).attr('href',
			downloadUrl + '?figure=' + encodeURIComponent( fragmentRouter.fromParams(form.state, 'prevent #hash update') )
		);
	});
}();

// product color palettes
const productPalette = _.reduce(Palette.collections, function(palette, colors, type) {
	palette[type] = _.map(/*colors*/Palette.collections.line, function(cssColor) {
		return {
			integer: ( new Function('return 0x' + cssColor.substr(1)) )(),
			css: cssColor
		};
	});
	return palette;
}, {});

// const
const CALC_PATH = document.location.pathname;
const DEFAULT_SYMMETRY_BY_CLASS = { I: 'Pentad', II: 'Cross', III: 'Pentad' };

/**
 * url#fragment router                                           * * *         url#fragment
 */
const fragmentRouter = new Stringifier({
	format: [
		'<base:|(Icosahedron|Oct[oa]hedron)_>',
		'<alignTheBase:ground_|[Aa]lign_|[Ff]lat_|>',
		
		'<partial:@Float(>0)|@Natural/@Natural|1>_',
		
		'<subdivClass:|Class_(II)_|Class_III_(\\d+),(\\d+)_>',
		'<subdivMethod:|(Chords|Arcs|Mexican|Kruschke)_>',
		'<symmetry:|(Pentad|Cross|Triad)_>',
		'<fullerenType:|(Described_|Inscribed_|)Fuller(?:ene?)?_(?:with|in|on|of|smoke)_>',
		'<connType:(?:Piped|Cone)_D@Float(>=0)|(?:Joint|Nose|GoodKarma)(?:_back|_counter)?|Cone|Semicone|>_',
		'<detail:@Natural>V',
		
		'<radius:|_R@Float(>=0)>',
		'<material:|_beams_?(@Float(>0))x(@Float(>0))>',
	].concat(
		
		_.map(CONFIG.router && CONFIG.router.beforeRemovedList, conf => conf.route) // doorGroup eg.etc.
		
	).concat([
		'<removedList:|~(?:rm-)?([vlf]\\d+)+>',
		
		'<tentNetBeginFace:|~tent\\+(f\\d+)(?:\\+([a-zA-Z]{2}[\\w\\.]*))?>',
		'<tentNetAdvancedLineList:|\\+(l\\d+)+>'
	]).map(template => {
		return _.reduce({
			"@Float(>=0)": '(?:0|[1-9]\\d*)(?:\\.\\d+)?',
			"@Float(>0)": '(?:[1-9]\\d*)(?:\\.\\d+)?|0\\.\\d+',
			"@Floating": '-?(?:0|[1-9]\\d*)(?:\\.\\d+)?',
			"@Natural": '[1-9]\\d*',
			"@Integer": '0|-?[1-9]\\d*'
		}, (template, replace, search) => template.split(search).join('(?:' + replace + ')'), template);
	}),
	
	mapping: _.chain(CONFIG.router)
		.reduce((mapping, extenders, hookName) => {
			_.each(extenders, ext => {
				_.extend(mapping, ext.mapping);
			});
			return mapping;
		}, {})
		.extend({
			base: {
				value: function(figureAs, base) {
					return base || 'Icosahedron';
				},
				string: function(base) {
					return base == 'Icosahedron' ? '' : base + '_';
				}
			},
			alignTheBase: {
				value: function(align) {
					return !!align;
				},
				string: function(align) {
					return align && this.partial != '1/1' && this.partial != '1/2' ? 'Flat_'/*'Align_'*/ : '';
				}
			},
			
			partial: {
				value: function(string) {
					const isModeHeight = /^\d+(\.\d+)?$/.test(string);
				
					return {
						partialMode: isModeHeight ? 'height' : 'faces',
						partial: string,
						partialHeight: isModeHeight ? string : eval(string).toFixed(5)
					};
				},
				string: function(partial) {
					return {
						faces: partial,
						height: this.partialHeight
					}[ this.partialMode ];
				}
			},
			
			subdivClass: {
				value: function(string, II, III_M, III_N) {
					return III_M ? {
						subdivClass: 'III_' + III_M + ',' + III_N,
						M: III_M,
						N: III_N
					} : {
						subdivClass: II || 'I'
					};
				},
				string: function(klass) {
					var all = klass.split(/_|,/),
						subdivClass = all[0];
					switch (subdivClass) {
						case 'I': return '';
						case 'II': return 'Class_II_';
						case 'III': return 'Class_III_' + all[1] + ',' + all[2] + '_';
					}
					console.error('unknown subdivision class', klass);
				}
			},
			subdivMethod: {
				value: function(string, method) {
					return method || 'Chords';
				},
				string: function(method) {
					return method == 'Chords' ? '' : method + '_';
				}
			},
			symmetry: {
				value: function(string, symmetry) {
					var subdivClass = this.subdivClass.split('_')[0];
					return symmetry || DEFAULT_SYMMETRY_BY_CLASS[subdivClass];
				},
				string: function(symmetry) {
					var subdivClass = this.subdivClass.split('_')[0];
					return symmetry != DEFAULT_SYMMETRY_BY_CLASS[subdivClass] ? symmetry + '_' : '';
				}
			},
			// partial is simple
			fullerenType: {
				value: function(fulleren, type) {
					return fulleren ? type.match(/^descr/i) ? 'described' : 'inscribed' : false;
				},
				string: function(type) {
					if (type)
						return (type == 'inscribed' ? 'Inscribed_' : 'Described_') + 'Fulleren_on_';
					return '';
				}
			},
			connType: {
				value: function(string) {
					var matches = /^(Piped|Joint|Cone|Semicone|Nose|GoodKarma|)(.*)?$/.exec(string);
					var value = {
							connType: matches[1]
						};

					if (/^(Piped|Cone)$/.test(value.connType) && matches[2]) {
					//if (value.connType == 'Piped') {
						//debugger;
						value.pipeD = matches[2].replace(/^_D/g, '');
					}
					else if (/^(Joint|Nose|GoodKarma)$/.test(value.connType)) {
						value.clockwise = ! matches[2];
					}
					return value;
				},
				string: function(connType){
					switch (connType) {
						case 'Piped':
						case 'Cone':
							connType += '_D' + this.pipeD;
							break;
						case 'Joint':
						case 'Nose':
						case 'GoodKarma':
							connType += this.clockwise ? '' : '_counter';
							break;
					}
					return connType;
				}
			},
			// detail is simple
			radius: {
				value: function(string){
					return new Number(string.substr(2)).valueOf() || 69;
				},
				string: function(value){
					return '_R' + value;
				}
			},
			material: {
				value: function(string, width, height){
					return {
						beamsWidth: width,
						beamsThickness: height
					};
				},
				string: function(){
					return '_beams_' + this.beamsWidth + 'x' + this.beamsThickness;
				}
			},
			
			removedList: {
				value: function(string, rm) { // wtf: into rm last member only received O_o
					if (!rm) return [];

					var list = [];

					string.replace(/[vlf]\d+/g, function(index) {
						list.push(index);
					});

					return {
						removedList: list
					};
				},
				string: function(list) {
					if (!figure) {
						return _.isEmpty(list) ? '' : '~rm-' + list.join('');
					}

					// pack (compress) a list
					var removing = _.pluck(_.where(figure.$primitives, { removed: true, type: 'face' }), 'removeIndex'),
						groups = _.reduce(figure.$primitives, function(memo, item) {
							if (item.removed && (item.type == 'face' || _.all(item.$super.face, _.property('removed')))) {
								memo.push({
									index: item.removeIndex,
									faces: item.type == 'face' ? [item.removeIndex] : _.pluck(item.$super.face, 'removeIndex')
								});
							}
							return memo;
						}, []),
						packed = [],
						removed = [];

					while(removing.length > 0) {
						var group = _.reduce(groups, function(best, group) {
								return (best && best.faces.length >= group.faces.length) ? best : group;
							}, null),
							removedFaces = group.faces;

						// filter groups
						groups = _.filter(groups, function(group) {
							return _.all(group.faces, function(face) {
								return !_.contains(removedFaces, face);
							});
						});

						// release removed
						removing = _.difference(removing, removedFaces);

						packed.push(group.index);
					}

					return _.isEmpty(list) ? '' : '~rm-' + packed.join('')
				}
			},
			tentNetBeginFace: {
				value: function(string, beginFaceIndex, textureName) {
					if (!string) return null;
					
					return {
						tentNetBeginFace: beginFaceIndex,
						tentNetTextureName: textureName,
					};
				},
				string: function(beginFaceIndex) {
					var face = _.isEmpty(beginFaceIndex) ? '' : '+' + beginFaceIndex,
						texture = _.isEmpty(this.tentNetTextureName) ? '' : '+' + this.tentNetTextureName;
					
					return face ? '~tent' + face + texture : '';
				}
			},
			tentNetAdvancedLineList: {
				value: function(string, indexes) {
					if (!string) return [];

					var list = [];

					indexes.replace(/l\d+/g, function(index) {
						list.push(index);
					});

					return {
						tentNetAdvancedLineList: list
					};
				},
				string: function(list) {
					return _.isEmpty(list) ? '' : '+' + _.pluck(list, 'removeIndex').join('');
				}
			}
		})
		.value()
});


// binding url fragment with form                                  * * *
$(window).on('popstate', function(e){
	if (CALC_PATH == document.location.pathname) {
		var string = document.location.hash.substr(1);

		// try to restore figure configuration from file:path
		if (!string && IS_OFFLINE) {
			document.location.pathname.replace(/^.*\$(\d+)_([^$/]+)(?:\$([^ %/]+))?(?:(?: |%20)\(\d+\))?\.html$/, function(pathname, numerator, more, removed) {
				string = numerator + '/' + more + (removed && '~' + removed);
			});
		}

		fragmentRouter.fromString(string);

		// auto map params correction to url #fragment
		string = fragmentRouter.fromParams(form.state);

		// update page title
		updateTitle(string);
		return false;
	}
});

// router params => form state
fragmentRouter.on('params', function(state) {
	form.animate = false;

	// mark values as setted manually
	_.each(state, function(value, key){
		if (form[key]) {
			form[key].manual = value;
		}
	});

	// set form values
	_.each(state, function(value, key) {
		if (! _.isFunction(form[key]) && _.isObject(value)) {
			_.each(value, (subValue, subKey) => {
				// second level
				form[key][subKey](subValue);
			});
		} else {
			// first level
			form[key](value);
		}
	});

	// lame-force, todo: resolve depends in any way
	form.partial(state.partial);
	
	form.animate = true;
});

form.urlFragment = ko.observable('');
form.figureUrl = ko.computed(function() {
	return '//acidome.com/lab/calc/' + (form.urlFragment() ? '#' + form.urlFragment() : '');
});
form.figureName = ko.computed(function() {
	return form.urlFragment().replace(/_/g, ' ');
});

form.on('change', function(state) {
	// form state => router string
	var string = fragmentRouter.fromParams(state);
	form.urlFragment(string);
});

// router string => url fragment
fragmentRouter.on('string', function(string) {
	var currFragment = document.location.hash.substr(1);

	if (currFragment == string) {
		// prevent history repeating
		return;
	}

	// update history
	if (!IS_OFFLINE) {
		history.pushState('data', 'title', '#' + string);
		console.log('* push(!) state with', string);
	}

	// update page title
	updateTitle(string);
});

// page title helper
var initialTitle = $('head title').text();
function updateTitle(spec){
	if (!spec) return;
	var hasRemoved = /~/.test(spec),
		title = spec.split('~')[0].replace(/_/g, ' ') + (hasRemoved ? ' (' + __('modified') + ')' : '');
	$('head title').text( [title, initialTitle].join(' - ') );

	// update figure dowload name
	var $link = $('#js-download-link');
	$link.attr({
		href: $link.data('href-base') + '?figure=' + encodeURIComponent(spec)
	});
}


// init form params from url fragment
// called before form been bounded with figure calculation process
$(window).trigger('popstate');


// figure calculator
var AXIS = 'y',
	AXIS_VECTOR3 = new THREE.Vector3(
		AXIS === 'x' ? 1 : 0,
		AXIS === 'y' ? 1 : 0,
		AXIS === 'z' ? 1 : 0
	),
	
	CENTER = new Vector,
	figure;

form._lastState = {};
form.on('change', onFormChange);

form.removedList.subscribe(function() {
	if (form._listsDebounce) return;
	onFormChange();
});
form.tentNetLineList.subscribe(function() {
	if (form._listsDebounce) return;
	onFormChange();
});

function onFormChange() {
	// fix state.fullerenType
	form.state.fullerenType = _.contains(['none', null, false, undefined], form.state.fullerenType) 
		? false : form.state.fullerenType;
	// fix detail type
	form.state.detail = String(form.state.detail);
	
	
	var METRIC_OPTIONS = ['radius', 'connType' /* =) */, 'pipeD', 'beamsWidth', 'beamsThickness'],
		
		TENT_OPTIONS = ['tentNetBeginFace', 'tentNetTextureName', 'tentNetStaticLineList',
				'tentNetAdvancedLineList', 'tentNetLineList'],
		
		IGNORE_FORM_OPTIONS = METRIC_OPTIONS.concat(TENT_OPTIONS);

	if (! _.isEmpty(form._lastState) &&
		! _.isEqual(
			_.omit(form.state, IGNORE_FORM_OPTIONS, 'removedList'),
			_.omit(form._lastState, IGNORE_FORM_OPTIONS, 'removedList')
		) &&
		! _.isEmpty(form.state.removedList)
	) {
		console.warn('reset removed_list, if figure-form (option) was changed');
		
		// reset removed on figure form option was changed
		form._listsDebounce = true;
		form.removedList([]);
		delete form._listsDebounce;
	}

	if (! _.isEmpty(form._lastState) &&
		! _.isEqual(
			_.omit(form.state, IGNORE_FORM_OPTIONS),
			_.omit(form._lastState, IGNORE_FORM_OPTIONS)
		) &&
		! _.isEmpty(form.state.tentNetLineList)
	) {
		console.warn('reset tent net, if figure-form/removed was changed');
		
		// reset tent-separators
		form._listsDebounce = true;
		form.resetTentNet();
		delete form._listsDebounce;
		
		// switch to Cover mode, if now is Tent (and figure form changed)
		if (viewer.mode() === "tent") {
			viewer.mode("cover");
		}
	}
	
	// break, if figure form options has no change
	if (_.isEqual(
		_.omit(form.state, 'removedList', TENT_OPTIONS),
		_.omit(form._lastState, 'removedList', TENT_OPTIONS)
	)) return;
	
	// init view mode
	if (_.isEmpty(form._lastState)) {
		var MODES = ['base', 'carcass', 'schema', 'cover', 'tent'],
			modeIndex = _.indexOf(MODES, viewer.mode());
		
		if (modeIndex < _.indexOf(MODES, "cover")
			&& ! _.isEmpty(form.removedList())
		) {
			viewer.mode("cover");
		}
		
		if (modeIndex < _.indexOf(MODES, "tent")
			&& !! form.tentNetBeginFace()
		) {
			viewer.mode("tent");
		}
		
		form.TENT_TEXTURE_SAMPLE_DIR = './tent/pattern-samples';
		if (form.tentNetTextureName()) {
			
			viewer.drivers.tent.N.content.image.src = 
				form.TENT_TEXTURE_SAMPLE_DIR + '/' + form.tentNetTextureName();
		}
	}

	// calc subj
	var state = _.clone(form.state);
	var mm = (1 / 1000); // state.radius; // mm/R
	var calcStartedAt = +new Date;
	
	// fix none-value
	if (state.fullerenType === 'none') {
		state.fullerenType = null;
	}
	
	calcProc.start(_.compact([
		{
			name: 'reset',
			process: function() {
				Figure.__enum = 0;
				//console.clear();
				
				return true;
			}
		}, {
			name: 'base figure',
			process: function() {
				if ('II' == state.subdivClass) {
					figure = new Figure[ "Octohedron" == state.base ? "TetrakisHexahedron" : "PentakisDodecahedron" ]({
						axis: AXIS,
						symmetry: state.symmetry
					});
				}
				else {
					figure = new Figure[ "Octohedron" == state.base ? "Octohedron" : "Icosahedron" ]({
						axis: AXIS,
						symmetry: state.symmetry
					});
				}

				return figure;
			}
		}, {
			name: 'subdivision',
			process: function(figure) {
				var V = state.detail,
                    subdivAll = state.subdivClass.split(/_|,/),
					subdivClass = subdivAll[0];

				switch (subdivClass) {
					case 'I':
						switch (state.subdivMethod) {
							case 'Chords':
								return figure.splitFaces(V);

							case 'Arcs':
								return figure.splitFaces_EA(V);

							case 'Mexican':
								return figure.splitFaces_EA(V)
									.splitFaces_EA_updateToMexican(V);

							case 'Kruschke':
								figure.splitFaces(V);
								
								// Kruschke magic...
								if (3 == V) {
									var MAGIC_FIX_RATIO = 0.9442890204731844;
								}
								else if (4 == V) {
									// //www.domerama.com/calculators/4v-geodesic-dome-calculator/4v-712-kruschke-geodesic-dome-calculator/
									// F target = 0.22219
									var MAGIC_FIX_RATIO = 0.22219 
											/ 0.253185 // V4 Chords F
											* 0.9983958444733023; // ~fix
									
									/*
									//// testing Kruschke Mod M-1 .... not good ////
									var all = figure.$primitives.get(),
										
										vertices = all.filter(f => f.type === 'vertex'),
										pptVertices = vertices.filter(v => v.$points[0].pptPoint),
										pptPoints = pptVertices.map(v => v.$points[0]),
										
										lines = all.filter(f => f.type === 'line'),
										pptLines = lines.filter(l => l.$points[0].pptPoint || l.$points[1].pptPoint),
										
										pptWallPoints = _.chain(pptLines)
											.map(line => line.$points.get())
											.flatten()
											.unique()
											.value(),
										notWallVertices = vertices.filter(vertex => {
											return ! _.contains(pptWallPoints, vertex.$points[0]);
										});
									
									var MAGIC = .125941802282; // Kruschke M-1 =)
								
									m60 = notWallVertices
										.map(vertex => {
											var point = vertex.$points[0],
												pptGroup = _.chain(pptPoints)
													.map(ppt => {
														return {
															distance: Math.round(999 * ppt.distance(point)),
															ppt: ppt
														};
													})
													.groupBy('distance')
													.values()
													.sortBy(g => g[0].distance)
													.value()[ 0 ]
													.map(x => x.ppt),
												ppt = (pptGroup.length === 1) && pptGroup[0];
											
											return ppt && point
												.scale(1 + MAGIC)
												.subtract( ppt.clone().scale(MAGIC) )
												.normalize();
										})
										.filter(_.identity)
									
									console.log(
										_.unique(vertices
											.map(v => v.$points[0])
											.map(p => p.y > 0 && p.y.toFixed(14))
											.filter(y => y)
										).sort().slice(0, 6)
									);
									
									return figure;
									*/
								}
								else {
									//throw ['Wrong V', V];
									return figure;
								}
								
								_.chain(figure.$primitives.get())
									.filter(f => f.type === 'line')
									.filter(l => l.$points[0].pptPoint || l.$points[1].pptPoint)
									.each(line => {
										var points = line.$points,
											E = points[ points[0].pptPoint ? 0 : 1 ], // PPT
											S = points[ points[0].pptPoint ? 1 : 0 ];
										
										var mr = MAGIC_FIX_RATIO,
											T = E.clone().scale(1 - mr).add(S.clone().scale(mr)).normalize();
										
										S.x = T.x;
										S.y = T.y;
										S.z = T.z;
										
										/*
										// calc MAGIC_FIX_RATIO Kruschke constant
										var range = [0, 1],
											TARGET = 0.32970647; // thanks https://groups.google.com/d/msg/geodesichelp/L55V-KCFje0/A7IhFisIa2AJ
										
										while (range[1] - range[0] > 1e-15) {
											var mr = (range[1] + range[0]) / 2,
												T = E.clone().scale(1 - mr).add(S.clone().scale(mr)).normalize(),
												l = E.distance(T);
											
											range[l < TARGET ? 0 : 1] = mr;
										}
										
										console.log('PPT -> ', mr, 'source =', l);
										*/
									});
								
								return figure;

							default:
								throw 'Unknown subdivision method: ' + state.subdivMethod;
						}

					case 'II':
						//debugger;
						figure.splitFaces(V / 2);
						
						if ("Octohedron" == state.base) { // splitFaces_updateToClassII() not for Octo
							return figure;
						}
						
						return figure.splitFaces_updateToClassII();

					case 'III':
						return figure.splitFaces_updateToClassIII(subdivAll[1], subdivAll[2]);

					default:
						throw 'Unknown subdivision class: ' + state.subdivClass;
				}
			}
		}, {
			name: 'primitive relations',
			process: function(figure) {
				// figure primitives initial
				figure.$primitives.each(function(){
					// radius-center of points
					this.center = CENTER;
					this.$points.each(function(){
						this.center = CENTER;
					});
				});
				return figure.relations();
			}
		},
		(state.fullerenType) && {
			name: 'transmutation figure to fulleren', // if required
			process: function(figure) {
				switch (state.fullerenType) {
					case 'inscribed':
						figure.fulleren();
						break;
					case 'described':
						figure.prepareUnify();
						figure.outerFulleren();
						break;
					default:
						console.error('strange fulleren type:', state.fullerenType);
				}

				// recalc relations
				figure.relations();

				// assert faces vertexes has common plane
				var badFactor = 0;
				_.each(figure.subs('face'), function(face) {
					var points = face.$points,
						bad = _.filter(
							_.map(points, function(a, i) {
								var b = points[(i - 1 + points.length) % points.length],
									c = points[(i + 2) % points.length],
									normal = Vector.crossProduct(
										Vector.subtract(b, a),
										Vector.subtract(c, a)
									),
									plane = new Plane(normal, a).normalize();

								plane.badMax = _.max(_.map(points, function(point) {
									var result = Math.abs(plane.result(point));
									return result < 1e-9 ? 0 : result;
								}));
								return plane;
							}),
							function(plane) {
								return plane.badMax;
							}
						);
					if (!_.isEmpty(bad)) {
						//console.error('bad face');
						badFactor = Math.max(badFactor, _.min(_.compact(_.pluck(bad, 'badMax'))));
					}
				});
				if (badFactor) {
					console.error('bad factor', badFactor * state.radius * 1000 .toFixed(2), 'mm');
				}

				return figure;
			}
		}, {
			name: 'set items remove indexes',
			process: function(figure) {
				// set items remove indexes
				_.each(_.groupBy(figure.$primitives, 'type'), function(collection, type) {
					var typeIndex = type.substr(0, 1).toLowerCase();
					_.each(collection, function(figure, index) {
						figure.removeIndex = typeIndex + index;
					});
				});
				return figure;
			}
		}, {
			name: 'pre-slice',
			process: function(figure) {
				if ('height' === state.partialMode) {
					// in first, all primitives matter
					_.each(figure.$primitives, function(f) {
						f.live = true;
					});
					
					const
						ZERO_DIR = 270,
						directionAngleFn = deltaDegrees => {
							return Math.PI / 180 * (ZERO_DIR - Number(state.doorGroup.direction) + deltaDegrees);
						},
						horizVector = deltaDegrees => {
							var angle = directionAngleFn(deltaDegrees);
							
							//return new Vector(Math.cos(angle), 0, Math.sin(angle));
							return Vector.rotate(new Vector(1, 0, 0), - angle, 'y');
						},
						baseY = 1 - 2 * Number(state.partialHeight),
						doorHeight = state.doorGroup.height / 1000 / state.radius,
						doorWidth = state.doorGroup.width / 1000 / state.radius,
						
						forwardControlPlane = new Plane(horizVector(0), 0),
						
						basePlane  = new Plane(0,  1, 0, - baseY),
						
						topY = baseY + doorHeight,
						//topPlane   = new Plane(0, -1, 0, topY),
						// through the center
						topDirLength = Math.sqrt(1 - doorWidth * doorWidth / 4),
						topDirHorizComponent = Math.sqrt(topDirLength * topDirLength - topY * topY),
						topPlane   = new Plane(
							_.extend(
								horizVector(0).scale(
									- topY
								), {
									y: - topDirHorizComponent
								}
							).normalize(),
						0),
						
						leftPlane  = new Plane(horizVector(-90), + doorWidth / 2),
						rightPlane = new Plane(horizVector(+90), + doorWidth / 2);
					
					//console.log(topPlane, horizVector(0));
					
					//console.log(_.countBy(figure.$primitives, 'type'), figure.$points.length)
					
					console.time('Cutting cross & sew');
					
					const baseDoorCL = figure.CuttingLine('base & door')
						.begin()
						
						.stage('base')
						.crossPlane(basePlane)
						.cutFigure(true)
						.relations();
					
					(0 !== doorWidth) && baseDoorCL
						.stage('top')
						.crossPlane(topPlane)
						.cutFigure(true)
						.relations()
						
						.stage('left')
						.crossPlane(leftPlane)
						.cutFigure(true)
						.relations()
						
						.stage('right')
						.crossPlane(rightPlane)
						.cutFigure(true)
						.relations()
						
						.whereMark({ base: 1, left: 1, right: 1, top: 1 }, face => {
							// forward side only
							if (forwardControlPlane.result(face.$points[0]) < 0) {
								//face.live = false;
								figure.safeRemoveMember(face);
							}
						});
					
					baseDoorCL
						.whereMark({ base: -1 }, face => {
							//face.live = false;
							figure.safeRemoveMember(face);
						});
					
					(0 !== doorWidth) && baseDoorCL
						.stage('common')
						.sewBack()
						.relations();
					
					baseDoorCL
						.end();
					
					console.timeEnd('Cutting cross & sew');
					
					// vertical cut plane
					if (form.state.vertical.howMany < 1) {
						const vertCutPlane = new Plane(
							horizVector(180 + form.state.vertical.direction),
							2 * form.state.vertical.howMany - 1
						);
						
						figure.CuttingLine('vertical cut')
							.begin()
							
							.stage('vertical')
							.crossPlane(vertCutPlane)
							.cutFigure(false)
							.relations()
							
							.whereMark({ vertical: -1 }, face => {
								figure.safeRemoveMember(face);
							})
							
							.end();
					}
					
					// assert
					figure.testRelationship();
					
					// end for no door
					if (0 === doorWidth) {
						form.doorGroup.sides([]);
						return figure;
					}
					
					// catch left/right points
					const PRECISION_THRESHOLD_REL = 2.5 / 1000 / form.state.radius,
						dirAngle = Math.PI / 180 * (ZERO_DIR - Number(state.doorGroup.direction)),
						
						pointsByPlane = (plane, indoorFilter) => {
							return _.chain(figure.$points)
								.filter(p => Math.abs(plane.result(p)) < PRECISION_THRESHOLD_REL)
								.filter(p => (p._sides = []) &&
									(false === indoorFilter)
									|| forwardControlPlane.result(p) < 0
								)
								.map(p => {
									return _.all({
											top: topPlane,
											left: leftPlane,
											right: rightPlane
										}, (plane, side) => {
											if (Math.abs(plane.result(p)) < PRECISION_THRESHOLD_REL) {
												p._sides.push(side);
											}
											return (false === indoorFilter)
												|| plane.result(p) > - PRECISION_THRESHOLD_REL
										})
										&& _.extend(Vector.rotate(p, dirAngle, 'y'), {
											_sides: p._sides
										});
								})
								.compact()
								.invoke('scale', form.state.radius);
						},
						
						pointsBySide = {
							base: pointsByPlane(basePlane, false)
								.each(p => {
									p.copy(Vector.rotate(p, - Math.PI / 2, 'x')); // (x,z) => (x,y)
								})
								.sortBy(p => {
									var radial = Math.atan2(p.y, - p.x);
									if (radial < 0) {
										radial += Math.PI * 2;
									}
									return radial;
								})
								.each(p => {
									p.x *= -1;
								})
								.value(),
							
							left: pointsByPlane(leftPlane)
								.each(p => {
									p.z -= (state.doorGroup.width / 1000) / 2;
								})
								.sortBy(p => - p.y)
								.value(),
							
							top: pointsByPlane(topPlane)
								.each(p => {
									p.copy(Vector.rotate(p, - Math.acos(Math.abs(topPlane.B)), 'z')); // if(!) door's top > 0
									p.copy(Vector.rotate(p, - Math.PI / 2, 'x')); // (x,z) => (x,y)
								})
								.sortBy(p => - p.y)
								.value(),
							
							right: pointsByPlane(rightPlane)
								.each(p => {
									p.z += (state.doorGroup.width / 1000) / 2;
								})
								.sortBy(p => - p.y)
								.value(),
						};
					
					form.doorGroup.sides(
						_.map(pointsBySide, (points, side) => {
							const
								PIPE_WIDTH = 25 / 1000,
								HOLE_DIAMETER = form.state.polygon.holeDiameter / 1000,
								MAX_HOLES_INDENT = form.state.polygon.maxHolesIndent / 1000,
								SCALE_PX_IN_M = 8503.94 / 3;
							
							const range = ['x', 'y', 'z']
								.reduce((range, comp) => {
									range[comp] = {
										min: _.min(_.pluck(points, comp)),
										max: _.max(_.pluck(points, comp)),
									};
									range[comp].size = range[comp].max - range[comp].min;
									return range;
								}, {});
							
							_.each(points, p => {
								p.x -= range.x.min;
								p.y -= range.y.min;
								p.z -= range.z.min;
								p.z += (PIPE_WIDTH - range.z.size) / 2; // middlenoid
							});
							
							// points => hole- (circle) points
							const circleList = 
								points.slice(1).flatMap((B, index) => {
									const A = points[index],
										sideLength = A.distance(B),
										holeCount = Math.max(Math.ceil(sideLength / MAX_HOLES_INDENT), 1);
									
									return _.range(0, holeCount)
										.map(i => {
											return A.clone().scale((holeCount - i) / holeCount)
												.add(B.clone().scale(i / holeCount));
										});
								})
								.concat([
									_.last(points)
								]);
							
							// z/l coords
							circleList[0].l = 0;
							_.each(circleList.slice(1), (B, index) => {
								const A = circleList[index],
									d = Vector.subtract(A, B);
								
								B.l = A.l + Math.sqrt(d.x * d.x + d.y * d.y);
							});
							
							//console.log(side, points);
							//console.log(side, 'circles', circleList);
							
							return {
								SCALE_PX_IN_M: SCALE_PX_IN_M,
								HOLE_DIAMETER: HOLE_DIAMETER,
								PIPE_WIDTH: PIPE_WIDTH,
								side: side,// + ' (from inside, from top to bottom)',
								points: points
									.concat(/top|base/.test(side) ? [] : [
										_.extend(_.last(points).clone(), {
											x: points[0].x
										})
									])
									.concat([
										points[0]
									]),
								range: range,
								
								circleList: circleList, // from top to down
								maxL: _.max(circleList, 'l').l
							};
						})
					);
					
					console.log('pre-stat', _.countBy(figure.$primitives, 'type'), figure.$points.length);
				}
				else if (state.subdivClass == 'I' && ! state.fullerenType && state.symmetry == 'Pentad') {
					var upper = _.sortBy(figure.subs('vertex'), function(v) {
						return v.$points[0][AXIS];
					}).pop();
					//console.log(upper);
					// wrong: .sliceByFraction() call .relations() too
					figure.sliceByFraction(upper, state.partial, false);
				}
				else if (state.partialMode === 'faces') {
					figure.sliceByAxis(AXIS, state.partial, false);
				}
				else {
					debugger;
					throw ['what to do? state of partialMode:', state.partialMode];
				}
				
				return figure.detectSelvage('sliced');
			}
		},
		state.alignTheBase && { // if required
			name: 'flat base',
			process: function(figure){
				figure.groundSliced(AXIS);
				return figure;
			}
		}, {
			name: 'init product objects',
			process: function(figure) {
				var Connector = Product.Connector[ state.connType ],
					Rib = Product.Rib[ "Beam" ],
					Triangle = Product["Triangle"]["Simple"],
					Face = Product[ state.fullerenType ? 'Polygon' : 'Triangle' ][ "Simple" ];

				figure.$primitives = $(_.flatten(_.map(figure.$primitives, function(primitive) {
					switch (primitive.type) {
						case 'vertex':
							primitive.product = new Connector(primitive, {
								R: state.radius,
								Dpipe: state.pipeD * mm,
								whirlAsClock: state.clockwise
							});
							break;

						case 'line':
							if (Connector.lineSeparatelyForFaces) {
								// GoodKarma, Semicone
								var lineData = {
										$points: primitive.$points,
										origin: primitive
									};

								primitive = _.map(primitive.$super.face, function(face, i) {
									if (i > 0) {
										// clone primitive related to origin
										primitive = new Figure(lineData);
									}
									primitive.bindedFace = face;
									primitive.live = face.live;
									primitive.product = new Rib({
										R: state.radius,
										width: state.beamsWidth * mm,
										thickness: state.beamsThickness * mm,
										line: primitive
									});

									face.bindedLines = face.bindedLines || [];
									face.bindedLines.push(primitive);

									return primitive;
								});
							}
							else {
								primitive.product = new Rib({
									R: state.radius,
									width: state.beamsWidth * mm,
									thickness: state.beamsThickness * mm,
									line: primitive
								});
							}
							break;

						case 'face':
							primitive.product = new (primitive.$points.length === 3 && false ? Triangle : Face)(primitive, {
								R: state.radius,
								bilateral: _.contains(['GoodKarma', 'Semicone'], state.connType)
							});
							break;

						default:
							throw 'Product type unknown: ' + primitive.type;
					}
					return primitive;
				})));

				return figure;
			}
		}, {
			name: 'preparing to unify',
			process: function(figure){
				figure.prepareUnify();
				return figure;
			}
		}, {
			name: 'unification',
			process: function(figure){
				figure.unify();
				return figure;
			}
		}, {
			name: 'slice',
			process: function(figure) {
				/*
				figure.$points = $([]);
				figure.$primitives = figure.$primitives.filter(function() {
					if (this.type == 'vertex' && this.live) {
						figure.$points.push( this.$points[0] );
					}
					return this.bindedFace ? this.bindedFace.live : this.live;
				});
				figure.relations();
				*/
				_.chain(figure.$primitives)
					.map(prim => {
						var face = prim.bindedFace || (prim.type === 'face' && prim);
						
						return face && ! face.live && face;
					})
					.compact()
					.unique()
					.each(face => {
						figure.safeRemoveMember(face);
					});
				
				// GoodKarma/Semicone workaround, slice dark-side clones binded to removed face
				if (state.connType == 'GoodKarma' || state.connType == 'Semicone') {
					// filter lines binded to removed face
					var faces = _.filter(figure.$primitives, function(prim) {
							return ! prim.removed && prim.type === 'face';
						});

					figure.$primitives = figure.$primitives.filter(function() {
						return 0
							|| this.type != 'line'
							|| _.contains(faces, this.bindedFace);
					});
				}
				
				return figure.detectSelvage('sliced');
			}
		}, {
			name: 'statistics',
			process: function(figure) {
				// remove items
				_.each(figure.$primitives, function(figure, index) {
					if (_.contains(state.removedList, figure.removeIndex)) {
						figure.remove();
					}
					//if (_.contains(state.removedList, figure.removeIndex)) {
					//	figure.remove();
					//}
				});

				// apply tent net, if needed
				if (form.tentNetNeedUpdate) {
					form.initTentNet(form.tentNetNeedUpdate.start);
					form.tentNetNeedUpdate = false;
				}
				
				_.each(figure.$primitives.get(), function(line) {
					if (line.type === 'line') {
						if (_.contains(state.tentNetLineList, line.removeIndex)) {
							line.separate();
						} else {
							line.connect();
						}
					}
				});

				// translate figure value to start compute report
				form.resultFigure(figure);

				return figure;
			}
		}, {
			name: 'plot product',
			process: function(figure){
				// по типам
				var productAreaWidth = $('.budget-list').width() - 10;

				form.budgetList(_.compact(_.map([
					{ type: 'line',   canvasAttr: { width: productAreaWidth, height: state.connType == 'Semicone' ? 150 : 220 } },
					{ type: 'face',   canvasAttr: {
						width: productAreaWidth / CONFIG.view.drawings.face.cols,
						height: productAreaWidth / CONFIG.view.drawings.face.cols
					} },
					{ type: 'vertex', canvasAttr: { width: productAreaWidth / 3 } }
				], function(budget) {
					budget.units = ko.computed(function() {
						var dependsFrom = form.removedList();
						return _.where(figure.$primitives, { type: budget.type, removed: false });
					});
					budget.sizeList = _.compact(_.map(figure.stat[budget.type], function(size) {
						/*_.chain(size.collect) todo: implement plot for fullfilled instances (wrong lines plot)
								.sortBy(function(inst) {
									return inst.$subsets.length + inst.$supersets.length;
								})
								.last()
								.value()*/

						switch (budget.type) {
							case 'vertex':
								var sample = _.sortBy(size.collect, function(one) {
									return - // find with max count of live lines around
										_.chain(one.product.$hedgehog)
											.pluck('source')
											.where({ live: true })
											.value().length;
								})[ 0 ];
								break;
							default:
								sample = size.collect[0];
						}

						var product = sample.product;

						if (product.plot) {
							return {
								index: size.index,
								color: productPalette[budget.type][size.order].css,
								product: product,
								units: ko.computed(function() {
									return _.filter(budget.units(), function(unit) {
										return unit.index === size.index;
									});
								})
							};
						}
					}));
					return _.isEmpty(budget.sizeList) ? null : budget;
				})));

				return figure;
			}
		}, {
			name: 'render scene',
			process: function(figure){
				viewer.trigger('render', figure);
				return figure;
			}
		}, {
			name: 'push log',
			process: function(figure) {
				// state and last state diff
				var diff = _.reduce(state, function(diff, value, key) {
					if (form._lastState[key] !== state[key])
						diff[key] = value;
					return diff;
				}, {});

				// save last form state
				form._lastState = _.mapObject(state, _.clone);

				// track figure change
				Tracker.push('figure', diff, {
					dura: (+new Date) - calcStartedAt
				});

				// fix initial page height (auto scroll position refreshed page issue)
				if ($('body').css('height') !== 'auto') {
					$('body').css('height', 'auto');
				}
				
				if (! _.isEmpty(diff)) {
					console.log('figure diff:', diff);
				}

				return figure;
			}
		}
	]));

	form._lastState = state;
}

	
// progress bar of calculation process
!function(){
	var $progress = $('.geodesic .progress'), progressTotal;
	
	function progress(step, msg){
		$progress.text(msg + '  ' + (step + 1) + '/' + progressTotal);
	}

	calcProc
		.on('start', function(chain){
			$progress.show();
			progressTotal = chain.length;
			progress(0, 'calculation started...');
			console.time && console.time('process time');
		})
		.on('cancel', function(chain){
			progress(null, 'calculation was brutal cancelled');
			console.time && console.timeEnd('process time');
		})
		.on('complete', function(chain){
			progress(chain.length, 'calculation complete');
			console.time && console.timeEnd('process time');
			$progress.hide();
		})
		.on('stage', function(stage, step){
			progress(step, stage.name);
		})
		.on('stageOk', function(stage, step){
			progress(step, stage.name + ' ok');
		});
}();


// geo receiver
$(document).on('geo-complete', function(event, geo) {
	console.log('geo complete with', geo);
});


// bind form layout with view-model instance
$(function() {
	// test lang is set
	var hasLang = i18n.lang();

	ko.applyBindings(form);
	
	// auto focus lang selector
	if (! IS_IFRAME && ! hasLang) {
		var dropdown = $('#lang-select').focus().trigger('mousedown')/*[ 0 ], // --Chrome 53+
			event = document.createEvent('MouseEvents');
		event.initMouseEvent('mousedown', true, true, window);
		dropdown.dispatchEvent(event);*/

		// detect browser language setting
		// https://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference/3335420
		$.ajax({ 
			url: "//ajaxhttpheaders.appspot.com", 
			dataType: 'jsonp', 
			success: function(headers) {
				var language = headers['Accept-Language'],
					detected = _.sortBy(
						i18n.langList.filter(lang => language.indexOf(lang) >= 0), 
						lang => language.indexOf(lang)
					)[ 0 ];
				
				detected && i18n.lang(detected);
			}
		});
	}
});

		
		/* /pack me */

		/* offer factory */
		/* OfferFactory = (function() {
	var list = [];

	function OfferFactory(options) {
		_.extend(this, options);
	}

	OfferFactory.add = function(options) {
		list.push( new OfferFactory(options) );
	};

	OfferFactory.resultList = ko.computed(function() {
		if (!form.resultMeter()) return;

		form.removedList(); // depends

		var R = form.state.radius,
			R2 = R * R,
			live = _.where(figure.$primitives, { removed: false }),
			total = _.groupBy(live, 'type'),
			sizes = _.reduce(total, function(sizes, list, type) {
				sizes[type] = _.union(_.pluck(list, 'index')).length;
				return sizes;
			}, {}),
			context = _.extend({
				R: R,
				all: live,
				total: total,
				sizes: sizes,
				ribMaxLengthSum: _.reduce(total.line, function(sum, line) {
					return sum + line.product.maxLength();
				}, 0) * R, // => m
				maxRibProductLength:
					_.max(_.map(total.line, function(line) {
						return line.product.maxLength();
					}))
					* R
					* 1000, // => mm
				ribVolume:
					_.reduce(total.line, function(memo, line) {
						return memo +
							line.product.midLength * line.product.R *
							line.product.thickness * line.product.R *
							line.product.width * line.product.R;
					}, 0), // => m3
				skinArea:
					_.reduce(figure.stat.face, function(area, stat) {
						var sample = stat.collect[0],
							count = _.where(stat.collect, { removed: false }).length,
							pp = sample.$points,
							square = 0;

						for (var i = 1; i <= pp.length - 2; i++) {
							square += Vector.crossProduct(Vector.subtract(pp[i], pp[0]), Vector.subtract(pp[i + 1], pp[0])).length() / 2
						}

						return area + count * square * R2;
					}, 0), // => m2
				baseArea:
					_.reduce(total.line, function(area, line) {
						if (_.where(line.origin.$super.face, { removed: false }).length == 1) {
							var pp = _.invoke(line.$points, 'clone');
							_.each(pp, function(p) {
								p[figure.axis] = 0;
							});
							area += Vector.crossProduct(pp[0], pp[1]).length() / 2 * R2;
						}
						return area;
					}, 0),
				beamSection: form.state.beamsWidth + 'x' + form.state.beamsThickness
 			}, form.state);

		return _.compact(_.flatten(
			_.map(list, function(offer) {
				var producer = !offer.condition || offer.condition(context) ? offer.result(context) : null;
				if (producer && !_.isEmpty(producer.offer))
					return producer;
			})
		));
	}, null, { deferEvaluation: true });

	OfferFactory.Offer = Offer;

	function Offer(data) {
		_.extend(this, data);
	}

	OfferFactory.formatPrice = function(number) {
		number = String(Math.round(number));
		for (var prev; number != prev; prev = number, number = number.replace(/(\S)(\d{3})(\s|$)/, '$1 $2$3'));
		return number;
	};

	OfferFactory.Order = function(producer) {
		var order = this;

		this.email = ko.observable(localStorage["client-email"] || '');

		this.producer = producer;
		this.selectedPositions = ko.observableArray();

		this.pending = ko.observable(false);

		this.submit = function(order, event) {
			var $email = $(event.target).siblings('input[type="email"]'),
				email = order.email();

			if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
				alert(__('buyme:E-mail is not valid') + ': ' + email);
				$email.focus();
				return;
			}

			localStorage["client-email"] = email;

			order.pending(true);

			$.ajax({
				url: '//acidome.ru/lab/calc/order-flow/?action=create',
				type: 'POST',
				data: {
					order: _.pick(ko.toJS(order), 'email', 'producer', 'selectedPositions'),
					url: '//acidome.ru/lab/calc/' + location.hash,
					form: form.state
				},
				dataType: 'JSON',
				complete: function() {
					order.pending(false);
				},
				error: function() {
					alert(__('buyme:Sorry, error happens while we trying to order. Please, try again later.'));
				},
				success: function(error) {
					if (error) {
						alert(__('buyme:' + error));
					} else {
						alert(
							__('buyme:Thank you, the order has been successfully created.') +
							'\n-------\n' +
							__('buyme:Check your email, if the letter is marked as spam, mark it as not spam.')
						);
					}

					if (!error) {
						// reset selected positions
						order.selectedPositions([]);
					}
				}
			});
		};
	};

	return OfferFactory;
})();

/*
OfferFactory.add({
	price: {
		singleSlice: 35, // per item
		sliceTuning: 2000, // per size
		cutEdgePair: 25,
		sosnaCube: 20000, // RUR
		berezaCube: 18000, // RUR
		nalogIP: 0.06,
		nalogNDS: 0.20
	},
	condition: function(data) {
		return 1
			&& 20 <= data.beamsWidth && data.beamsWidth <= 300
			&& 20 <= data.beamsThickness && data.beamsThickness <= 300
			&& 500 <= data.maxRibProductLength && data.maxRibProductLength <= 3000
			//&& _.contains(['ru', 'ua'], i18n.lang());
	},
	result: function(data) {
		var q1 = Math.max(data.beamsWidth, 100) / 200 + 0.5, // mm
			q2 = Math.max(data.beamsThickness, 30) / 120 + 0.75, // mm
			q3 = Math.max(data.maxRibProductLength, 1000) / 2400 + 0.5, // mm
			cutsPerTail = {
				Piped: 1,
				Cone: 2,
				Joint: 1,
				Semicone: 1,
				GoodKarma: 1
			}[ data.connType ],

			cutCost = this.price.singleSlice * q1 * q2 * q3 * cutsPerTail
					* 2 // 2 tails
					* data.total.line.length // ribs total
					* 1 / (1 - this.price.nalogNDS), // НДС
			tuningCost  = this.price.sliceTuning
					* data.sizes.line // sizes
					/ ( data.connType == 'GoodKarma' ? 2 : 1 ) // тоесть гуд карма на 3 частоту настройка угла 3 пары * 2000, или 6 ребер / 2 * 2000
					* 1 / (1 - this.price.nalogNDS), // НДС

			cutEdgeCost = this.price.cutEdgePair * q3
					* data.total.line.length
					* 1 / (1 - this.price.nalogNDS); // НДС

		return new OfferFactory.Offer({
			producerName: 'Мастер гео дом',
			offer: [{
				name: (data.connType == 'Piped' ? 'Ребра каркаса' : 'Каркас') + ', сосна',
				price: cutCost + tuningCost
					+ data.ribVolume * this.price.sosnaCube * 1 / (1 - this.price.nalogIP), // material (ИП)
				currency: 'RUR'
			}, {
				name: (data.connType == 'Piped' ? 'Ребра каркаса' : 'Каркас') + ', береза',
				price: cutCost + tuningCost
					+ data.ribVolume * this.price.berezaCube * 1 / (1 - this.price.nalogIP), // material (ИП)
				currency: 'RUR'
			}],
			feedback: {
				email: 'beethowen@mail.ru'
			}
		});
	}
});
*/

// Acidome.Tent
// Kupolok.net
// Geosota.ru
// Геодом BY
// www.ecodome.com.ua
		/*script type="text/javascript" src="./js/extra/clothier.js"></script*/

		/* timing end */
		
			Tracker.timeEnd('js-loading', _jsLoadingStartAt);
			delete window._jsLoadingStartAt;
		
