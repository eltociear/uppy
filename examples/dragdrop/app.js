(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
module.exports = function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  num = Number(num / Math.pow(1024, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}

},{}],2:[function(require,module,exports){
(function (global){(function (){
/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
: this
), function(global) {
    'use strict';
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.6.4";
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa && typeof global.btoa == 'function'
        ? function(b){ return global.btoa(b) } : function(b) {
        if (b.match(/[^\x00-\xFF]/)) throw new RangeError(
            'The string contains invalid characters.'
        );
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function(u) {
        return btoa(utob(String(u)));
    };
    var mkUriSafe = function (b64) {
        return b64.replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encode = function(u, urisafe) {
        return urisafe ? mkUriSafe(_encode(u)) : _encode(u);
    };
    var encodeURI = function(u) { return encode(u, true) };
    var fromUint8Array;
    if (global.Uint8Array) fromUint8Array = function(a, urisafe) {
        // return btoa(fromCharCode.apply(null, a));
        var b64 = '';
        for (var i = 0, l = a.length; i < l; i += 3) {
            var a0 = a[i], a1 = a[i+1], a2 = a[i+2];
            var ord = a0 << 16 | a1 << 8 | a2;
            b64 +=    b64chars.charAt( ord >>> 18)
                +     b64chars.charAt((ord >>> 12) & 63)
                + ( typeof a1 != 'undefined'
                    ? b64chars.charAt((ord >>>  6) & 63) : '=')
                + ( typeof a2 != 'undefined'
                    ? b64chars.charAt( ord         & 63) : '=');
        }
        return urisafe ? mkUriSafe(b64) : b64;
    };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob && typeof global.atob == 'function'
        ? function(a){ return global.atob(a) } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = function(a) { return btou(_atob(a)) };
    var _fromURI = function(a) {
        return String(a).replace(/[-_]/g, function(m0) {
            return m0 == '-' ? '+' : '/'
        }).replace(/[^A-Za-z0-9\+\/]/g, '');
    };
    var decode = function(a){
        return _decode(_fromURI(a));
    };
    var toUint8Array;
    if (global.Uint8Array) toUint8Array = function(a) {
        return Uint8Array.from(atob(_fromURI(a)), function(c) {
            return c.charCodeAt(0);
        });
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        fromUint8Array: fromUint8Array,
        toUint8Array: toUint8Array
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64}
}));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
var wildcard = require('wildcard');
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};

},{"wildcard":25}],5:[function(require,module,exports){
/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}

},{}],6:[function(require,module,exports){
var n,l,u,t,i,o,r,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function p(n){var l=n.parentNode;l&&l.removeChild(n)}function v(l,u,t){var i,o,r,f={};for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return h(l,f,i,o,null)}function h(n,t,i,o,r){var f={type:n,props:t,key:i,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u:r};return null!=l.vnode&&l.vnode(f),f}function y(n){return n.children}function d(n,l){this.props=n,this.context=l}function _(n,l){if(null==l)return n.__?_(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?_(n):null}function k(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return k(n)}}function x(n){(!n.__d&&(n.__d=!0)&&i.push(n)&&!b.__r++||r!==l.debounceRendering)&&((r=l.debounceRendering)||o)(b)}function b(){for(var n;b.__r=i.length;)n=i.sort(function(n,l){return n.__v.__b-l.__v.__b}),i=[],n.some(function(n){var l,u,t,i,o,r;n.__d&&(o=(i=(l=n).__v).__e,(r=l.__P)&&(u=[],(t=a({},i)).__v=i.__v+1,I(r,i,t,l.__n,void 0!==r.ownerSVGElement,null!=i.__h?[o]:null,u,null==o?_(i):o,i.__h),T(u,i),i.__e!=o&&k(i)))})}function m(n,l,u,t,i,o,r,f,s,a){var p,v,d,k,x,b,m,A=t&&t.__k||c,P=A.length;for(u.__k=[],p=0;p<l.length;p++)if(null!=(k=u.__k[p]=null==(k=l[p])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k||"bigint"==typeof k?h(null,k,null,null,k):Array.isArray(k)?h(y,{children:k},null,null,null):k.__b>0?h(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(d=A[p])||d&&k.key==d.key&&k.type===d.type)A[p]=void 0;else for(v=0;v<P;v++){if((d=A[v])&&k.key==d.key&&k.type===d.type){A[v]=void 0;break}d=null}I(n,k,d=d||e,i,o,r,f,s,a),x=k.__e,(v=k.ref)&&d.ref!=v&&(m||(m=[]),d.ref&&m.push(d.ref,null,k),m.push(v,k.__c||x,k)),null!=x?(null==b&&(b=x),"function"==typeof k.type&&null!=k.__k&&k.__k===d.__k?k.__d=s=g(k,s,n):s=w(n,k,d,A,x,s),a||"option"!==u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&d.__e==s&&s.parentNode!=n&&(s=_(d))}for(u.__e=b,p=P;p--;)null!=A[p]&&("function"==typeof u.type&&null!=A[p].__e&&A[p].__e==u.__d&&(u.__d=_(t,p+1)),L(A[p],A[p]));if(m)for(p=0;p<m.length;p++)z(m[p],m[++p],m[++p])}function g(n,l,u){var t,i;for(t=0;t<n.__k.length;t++)(i=n.__k[t])&&(i.__=n,l="function"==typeof i.type?g(i,l,u):w(u,i,i,n.__k,i.__e,l));return l}function w(n,l,u,t,i,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||i!=o||null==i.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(i),r=null;else{for(f=o,e=0;(f=f.nextSibling)&&e<t.length;e+=2)if(f==i)break n;n.insertBefore(i,o),r=o}return void 0!==r?r:i.nextSibling}function A(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||C(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||C(n,o,l[o],u[o],t)}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s.test(l)?u:u+"px"}function C(n,l,u,t,i){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||P(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||P(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?t||n.addEventListener(l,o?H:$,o):n.removeEventListener(l,o?H:$,o);else if("dangerouslySetInnerHTML"!==l){if(i)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l))}}function $(n){this.l[n.type+!1](l.event?l.event(n):n)}function H(n){this.l[n.type+!0](l.event?l.event(n):n)}function I(n,u,t,i,o,r,f,e,c){var s,p,v,h,_,k,x,b,g,w,A,P=u.type;if(void 0!==u.constructor)return null;null!=t.__h&&(c=t.__h,e=u.__e=t.__e,u.__h=null,r=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof P){if(b=u.props,g=(s=P.contextType)&&i[s.__c],w=s?g?g.props.value:s.__:i,t.__c?x=(p=u.__c=t.__c).__=p.__E:("prototype"in P&&P.prototype.render?u.__c=p=new P(b,w):(u.__c=p=new d(b,w),p.constructor=P,p.render=M),g&&g.sub(p),p.props=b,p.state||(p.state={}),p.context=w,p.__n=i,v=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=P.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=a({},p.__s)),a(p.__s,P.getDerivedStateFromProps(b,p.__s))),h=p.props,_=p.state,v)null==P.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==P.getDerivedStateFromProps&&b!==h&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(b,w),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(b,p.__s,w)||u.__v===t.__v){p.props=b,p.state=p.__s,u.__v!==t.__v&&(p.__d=!1),p.__v=u,u.__e=t.__e,u.__k=t.__k,u.__k.forEach(function(n){n&&(n.__=u)}),p.__h.length&&f.push(p);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(b,p.__s,w),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(h,_,k)})}p.context=w,p.props=b,p.state=p.__s,(s=l.__r)&&s(u),p.__d=!1,p.__v=u,p.__P=n,s=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(i=a(a({},i),p.getChildContext())),v||null==p.getSnapshotBeforeUpdate||(k=p.getSnapshotBeforeUpdate(h,_)),A=null!=s&&s.type===y&&null==s.key?s.props.children:s,m(n,Array.isArray(A)?A:[A],u,t,i,o,r,f,e,c),p.base=u.__e,u.__h=null,p.__h.length&&f.push(p),x&&(p.__E=p.__=null),p.__e=!1}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=j(t.__e,u,t,i,o,r,f,c);(s=l.diffed)&&s(u)}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l.__e(n,u,t)}}function T(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function j(l,u,t,i,o,r,f,c){var s,a,v,h=t.props,y=u.props,d=u.type,k=0;if("svg"===d&&(o=!0),null!=r)for(;k<r.length;k++)if((s=r[k])&&(s===l||(d?s.localName==d:3==s.nodeType))){l=s,r[k]=null;break}if(null==l){if(null===d)return document.createTextNode(y);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,y.is&&y),r=null,c=!1}if(null===d)h===y||c&&l.data===y||(l.data=y);else{if(r=r&&n.call(l.childNodes),a=(h=t.props||e).dangerouslySetInnerHTML,v=y.dangerouslySetInnerHTML,!c){if(null!=r)for(h={},k=0;k<l.attributes.length;k++)h[l.attributes[k].name]=l.attributes[k].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""))}if(A(l,y,h,o,c),v)u.__k=[];else if(k=u.props.children,m(l,Array.isArray(k)?k:[k],u,t,i,o&&"foreignObject"!==d,r,f,r?r[0]:t.__k&&_(t,0),c),null!=r)for(k=r.length;k--;)null!=r[k]&&p(r[k]);c||("value"in y&&void 0!==(k=y.value)&&(k!==l.value||"progress"===d&&!k)&&C(l,"value",k,h.value,!1),"checked"in y&&void 0!==(k=y.checked)&&k!==l.checked&&C(l,"checked",k,h.checked,!1))}return l}function z(n,u,t){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,t)}}function L(n,u,t){var i,o;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||z(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=null}if(i=n.__k)for(o=0;o<i.length;o++)i[o]&&L(i[o],u,"function"!=typeof n.type);t||null==n.__e||p(n.__e),n.__e=n.__d=void 0}function M(n,l,u){return this.constructor(n,u)}function N(u,t,i){var o,r,f;l.__&&l.__(u,t),r=(o="function"==typeof i)?null:i&&i.__k||t.__k,f=[],I(t,u=(!o&&i||t).__k=v(y,null,[u]),r||e,e,void 0!==t.ownerSVGElement,!o&&i?[i]:r?null:t.firstChild?n.call(t.childNodes):null,f,!o&&i?i:r?r.__e:t.firstChild,o),T(f,u)}n=c.slice,l={__e:function(n,l){for(var u,t,i;l=l.__;)if((u=l.__c)&&!u.__)try{if((t=u.constructor)&&null!=t.getDerivedStateFromError&&(u.setState(t.getDerivedStateFromError(n)),i=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),i=u.__d),i)return u.__E=u}catch(l){n=l}throw n}},u=0,t=function(n){return null!=n&&void 0===n.constructor},d.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(a({},u),this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),x(this))},d.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),x(this))},d.prototype.render=y,i=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,b.__r=0,f=0,exports.render=N,exports.hydrate=function n(l,u){N(l,u,n)},exports.createElement=v,exports.h=v,exports.Fragment=y,exports.createRef=function(){return{current:null}},exports.isValidElement=t,exports.Component=d,exports.cloneElement=function(l,u,t){var i,o,r,f=a({},l.props);for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),h(l.type,f,i||l.key,o||l.ref,null)},exports.createContext=function(n,l){var u={__c:l="__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(x)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u},exports.toChildArray=function n(l,u){return u=u||[],null==l||"boolean"==typeof l||(Array.isArray(l)?l.some(function(l){n(l,u)}):u.push(l)),u},exports.options=l;


},{}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],9:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

var _uriToBlob = _interopRequireDefault(require("./uriToBlob"));

var _isCordova = _interopRequireDefault(require("./isCordova"));

var _readAsByteArray = _interopRequireDefault(require("./readAsByteArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var FileSource = /*#__PURE__*/function () {
  // Make this.size a method
  function FileSource(file) {
    _classCallCheck(this, FileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      // In Apache Cordova applications, a File must be resolved using
      // FileReader instances, see
      // https://cordova.apache.org/docs/en/8.x/reference/cordova-plugin-file/index.html#read-a-file
      if ((0, _isCordova.default)()) {
        return (0, _readAsByteArray.default)(this._file.slice(start, end));
      }

      var value = this._file.slice(start, end);

      return Promise.resolve({
        value: value
      });
    }
  }, {
    key: "close",
    value: function close() {// Nothing to do here since we don't need to release any resources.
    }
  }]);

  return FileSource;
}();

var StreamSource = /*#__PURE__*/function () {
  function StreamSource(reader, chunkSize) {
    _classCallCheck(this, StreamSource);

    this._chunkSize = chunkSize;
    this._buffer = undefined;
    this._bufferOffset = 0;
    this._reader = reader;
    this._done = false;
  }

  _createClass(StreamSource, [{
    key: "slice",
    value: function slice(start, end) {
      if (start < this._bufferOffset) {
        return Promise.reject(new Error("Requested data is before the reader's current offset"));
      }

      return this._readUntilEnoughDataOrDone(start, end);
    }
  }, {
    key: "_readUntilEnoughDataOrDone",
    value: function _readUntilEnoughDataOrDone(start, end) {
      var _this = this;

      var hasEnoughData = end <= this._bufferOffset + len(this._buffer);

      if (this._done || hasEnoughData) {
        var value = this._getDataFromBuffer(start, end);

        var done = value == null ? this._done : false;
        return Promise.resolve({
          value: value,
          done: done
        });
      }

      return this._reader.read().then(function (_ref) {
        var value = _ref.value,
            done = _ref.done;

        if (done) {
          _this._done = true;
        } else if (_this._buffer === undefined) {
          _this._buffer = value;
        } else {
          _this._buffer = concat(_this._buffer, value);
        }

        return _this._readUntilEnoughDataOrDone(start, end);
      });
    }
  }, {
    key: "_getDataFromBuffer",
    value: function _getDataFromBuffer(start, end) {
      // Remove data from buffer before `start`.
      // Data might be reread from the buffer if an upload fails, so we can only
      // safely delete data when it comes *before* what is currently being read.
      if (start > this._bufferOffset) {
        this._buffer = this._buffer.slice(start - this._bufferOffset);
        this._bufferOffset = start;
      } // If the buffer is empty after removing old data, all data has been read.


      var hasAllDataBeenRead = len(this._buffer) === 0;

      if (this._done && hasAllDataBeenRead) {
        return null;
      } // We already removed data before `start`, so we just return the first
      // chunk from the buffer.


      return this._buffer.slice(0, end - start);
    }
  }, {
    key: "close",
    value: function close() {
      if (this._reader.cancel) {
        this._reader.cancel();
      }
    }
  }]);

  return StreamSource;
}();

function len(blobOrArray) {
  if (blobOrArray === undefined) return 0;
  if (blobOrArray.size !== undefined) return blobOrArray.size;
  return blobOrArray.length;
}
/*
  Typed arrays and blobs don't have a concat method.
  This function helps StreamSource accumulate data to reach chunkSize.
*/


function concat(a, b) {
  if (a.concat) {
    // Is `a` an Array?
    return a.concat(b);
  }

  if (a instanceof Blob) {
    return new Blob([a, b], {
      type: a.type
    });
  }

  if (a.set) {
    // Is `a` a typed array?
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  throw new Error("Unknown data type");
}

var FileReader = /*#__PURE__*/function () {
  function FileReader() {
    _classCallCheck(this, FileReader);
  }

  _createClass(FileReader, [{
    key: "openFile",
    value: function openFile(input, chunkSize) {
      // In React Native, when user selects a file, instead of a File or Blob,
      // you usually get a file object {} with a uri property that contains
      // a local path to the file. We use XMLHttpRequest to fetch
      // the file blob, before uploading with tus.
      if ((0, _isReactNative.default)() && input && typeof input.uri !== "undefined") {
        return (0, _uriToBlob.default)(input.uri).then(function (blob) {
          return new FileSource(blob);
        })["catch"](function (err) {
          throw new Error("tus: cannot fetch `file.uri` as Blob, make sure the uri is correct and accessible. " + err);
        });
      } // Since we emulate the Blob type in our tests (not all target browsers
      // support it), we cannot use `instanceof` for testing whether the input value
      // can be handled. Instead, we simply check is the slice() function and the
      // size property are available.


      if (typeof input.slice === "function" && typeof input.size !== "undefined") {
        return Promise.resolve(new FileSource(input));
      }

      if (typeof input.read === "function") {
        chunkSize = +chunkSize;

        if (!isFinite(chunkSize)) {
          return Promise.reject(new Error("cannot create source for stream without a finite value for the `chunkSize` option"));
        }

        return Promise.resolve(new StreamSource(input, chunkSize));
      }

      return Promise.reject(new Error("source object may only be an instance of File, Blob, or Reader in this environment"));
    }
  }]);

  return FileReader;
}();

exports.default = FileReader;
},{"./isCordova":14,"./isReactNative":15,"./readAsByteArray":16,"./uriToBlob":17}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fingerprint;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Differenciate between input types

/**
 * Generate a fingerprint for a file which will be used the store the endpoint
 *
 * @param {File} file
 * @param {Object} options
 * @param {Function} callback
 */
function fingerprint(file, options) {
  if ((0, _isReactNative.default)()) {
    return Promise.resolve(reactNativeFingerprint(file, options));
  }

  return Promise.resolve(["tus-br", file.name, file.type, file.size, file.lastModified, options.endpoint].join("-"));
}

function reactNativeFingerprint(file, options) {
  var exifHash = file.exif ? hashCode(JSON.stringify(file.exif)) : "noexif";
  return ["tus-rn", file.name || "noname", file.size || "nosize", exifHash, options.endpoint].join("/");
}

function hashCode(str) {
  // from https://stackoverflow.com/a/8831937/151666
  var hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    var _char = str.charCodeAt(i);

    hash = (hash << 5) - hash + _char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
}
},{"./isReactNative":15}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window */


var XHRHttpStack = /*#__PURE__*/function () {
  function XHRHttpStack() {
    _classCallCheck(this, XHRHttpStack);
  }

  _createClass(XHRHttpStack, [{
    key: "createRequest",
    value: function createRequest(method, url) {
      return new Request(method, url);
    }
  }, {
    key: "getName",
    value: function getName() {
      return "XHRHttpStack";
    }
  }]);

  return XHRHttpStack;
}();

exports.default = XHRHttpStack;

var Request = /*#__PURE__*/function () {
  function Request(method, url) {
    _classCallCheck(this, Request);

    this._xhr = new XMLHttpRequest();

    this._xhr.open(method, url, true);

    this._method = method;
    this._url = url;
    this._headers = {};
  }

  _createClass(Request, [{
    key: "getMethod",
    value: function getMethod() {
      return this._method;
    }
  }, {
    key: "getURL",
    value: function getURL() {
      return this._url;
    }
  }, {
    key: "setHeader",
    value: function setHeader(header, value) {
      this._xhr.setRequestHeader(header, value);

      this._headers[header] = value;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._headers[header];
    }
  }, {
    key: "setProgressHandler",
    value: function setProgressHandler(progressHandler) {
      // Test support for progress events before attaching an event listener
      if (!("upload" in this._xhr)) {
        return;
      }

      this._xhr.upload.onprogress = function (e) {
        if (!e.lengthComputable) {
          return;
        }

        progressHandler(e.loaded);
      };
    }
  }, {
    key: "send",
    value: function send() {
      var _this = this;

      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return new Promise(function (resolve, reject) {
        _this._xhr.onload = function () {
          resolve(new Response(_this._xhr));
        };

        _this._xhr.onerror = function (err) {
          reject(err);
        };

        _this._xhr.send(body);
      });
    }
  }, {
    key: "abort",
    value: function abort() {
      this._xhr.abort();

      return Promise.resolve();
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Request;
}();

var Response = /*#__PURE__*/function () {
  function Response(xhr) {
    _classCallCheck(this, Response);

    this._xhr = xhr;
  }

  _createClass(Response, [{
    key: "getStatus",
    value: function getStatus() {
      return this._xhr.status;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._xhr.getResponseHeader(header);
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this._xhr.responseText;
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Response;
}();
},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "enableDebugLog", {
  enumerable: true,
  get: function () {
    return _logger.enableDebugLog;
  }
});
Object.defineProperty(exports, "canStoreURLs", {
  enumerable: true,
  get: function () {
    return _urlStorage.canStoreURLs;
  }
});
exports.isSupported = exports.defaultOptions = exports.Upload = void 0;

var _upload = _interopRequireDefault(require("../upload"));

var _noopUrlStorage = _interopRequireDefault(require("../noopUrlStorage"));

var _logger = require("../logger");

var _urlStorage = require("./urlStorage");

var _httpStack = _interopRequireDefault(require("./httpStack"));

var _fileReader = _interopRequireDefault(require("./fileReader"));

var _fingerprint = _interopRequireDefault(require("./fingerprint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/* global window */


var defaultOptions = _objectSpread({}, _upload.default.defaultOptions, {
  httpStack: new _httpStack.default(),
  fileReader: new _fileReader.default(),
  urlStorage: _urlStorage.canStoreURLs ? new _urlStorage.WebStorageUrlStorage() : new _noopUrlStorage.default(),
  fingerprint: _fingerprint.default
});

exports.defaultOptions = defaultOptions;

var Upload = /*#__PURE__*/function (_BaseUpload) {
  _inherits(Upload, _BaseUpload);

  var _super = _createSuper(Upload);

  function Upload() {
    var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Upload);

    options = _objectSpread({}, defaultOptions, {}, options);
    return _super.call(this, file, options);
  }

  _createClass(Upload, null, [{
    key: "terminate",
    value: function terminate(url, options, cb) {
      options = _objectSpread({}, defaultOptions, {}, options);
      return _upload.default.terminate(url, options, cb);
    }
  }]);

  return Upload;
}(_upload.default);

exports.Upload = Upload;
var _window = window,
    XMLHttpRequest = _window.XMLHttpRequest,
    Blob = _window.Blob;
var isSupported = XMLHttpRequest && Blob && typeof Blob.prototype.slice === "function";
exports.isSupported = isSupported;
},{"../logger":20,"../noopUrlStorage":21,"../upload":22,"./fileReader":10,"./fingerprint":11,"./httpStack":12,"./urlStorage":18}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var isCordova = function isCordova() {
  return typeof window != "undefined" && (typeof window.PhoneGap != "undefined" || typeof window.Cordova != "undefined" || typeof window.cordova != "undefined");
};

var _default = isCordova;
exports.default = _default;
},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var isReactNative = function isReactNative() {
  return typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
};

var _default = isReactNative;
exports.default = _default;
},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readAsByteArray;

/**
 * readAsByteArray converts a File object to a Uint8Array.
 * This function is only used on the Apache Cordova platform.
 * See https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html#read-a-file
 */
function readAsByteArray(chunk) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();

    reader.onload = function () {
      var value = new Uint8Array(reader.result);
      resolve({
        value: value
      });
    };

    reader.onerror = function (err) {
      reject(err);
    };

    reader.readAsArrayBuffer(chunk);
  });
}
},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uriToBlob;

/**
 * uriToBlob resolves a URI to a Blob object. This is used for
 * React Native to retrieve a file (identified by a file://
 * URI) as a blob.
 */
function uriToBlob(uri) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    xhr.onload = function () {
      var blob = xhr.response;
      resolve(blob);
    };

    xhr.onerror = function (err) {
      reject(err);
    };

    xhr.open("GET", uri);
    xhr.send();
  });
}
},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebStorageUrlStorage = exports.canStoreURLs = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window, localStorage */


var hasStorage = false;

try {
  hasStorage = "localStorage" in window; // Attempt to store and read entries from the local storage to detect Private
  // Mode on Safari on iOS (see #49)

  var key = "tusSupport";
  localStorage.setItem(key, localStorage.getItem(key));
} catch (e) {
  // If we try to access localStorage inside a sandboxed iframe, a SecurityError
  // is thrown. When in private mode on iOS Safari, a QuotaExceededError is
  // thrown (see #49)
  if (e.code === e.SECURITY_ERR || e.code === e.QUOTA_EXCEEDED_ERR) {
    hasStorage = false;
  } else {
    throw e;
  }
}

var canStoreURLs = hasStorage;
exports.canStoreURLs = canStoreURLs;

var WebStorageUrlStorage = /*#__PURE__*/function () {
  function WebStorageUrlStorage() {
    _classCallCheck(this, WebStorageUrlStorage);
  }

  _createClass(WebStorageUrlStorage, [{
    key: "findAllUploads",
    value: function findAllUploads() {
      var results = this._findEntries("tus::");

      return Promise.resolve(results);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      var results = this._findEntries("tus::".concat(fingerprint, "::"));

      return Promise.resolve(results);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      localStorage.removeItem(urlStorageKey);
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      var id = Math.round(Math.random() * 1e12);
      var key = "tus::".concat(fingerprint, "::").concat(id);
      localStorage.setItem(key, JSON.stringify(upload));
      return Promise.resolve(key);
    }
  }, {
    key: "_findEntries",
    value: function _findEntries(prefix) {
      var results = [];

      for (var i = 0; i < localStorage.length; i++) {
        var _key = localStorage.key(i);

        if (_key.indexOf(prefix) !== 0) continue;

        try {
          var upload = JSON.parse(localStorage.getItem(_key));
          upload.urlStorageKey = _key;
          results.push(upload);
        } catch (e) {// The JSON parse error is intentionally ignored here, so a malformed
          // entry in the storage cannot prevent an upload.
        }
      }

      return results;
    }
  }]);

  return WebStorageUrlStorage;
}();

exports.WebStorageUrlStorage = WebStorageUrlStorage;
},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

var DetailedError = /*#__PURE__*/function (_Error) {
  _inherits(DetailedError, _Error);

  var _super = _createSuper(DetailedError);

  function DetailedError(message) {
    var _this;

    var causingErr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var req = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var res = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, DetailedError);

    _this = _super.call(this, message);
    _this.originalRequest = req;
    _this.originalResponse = res;
    _this.causingError = causingErr;

    if (causingErr != null) {
      message += ", caused by ".concat(causingErr.toString());
    }

    if (req != null) {
      var requestId = req.getHeader("X-Request-ID") || "n/a";
      var method = req.getMethod();
      var url = req.getURL();
      var status = res ? res.getStatus() : "n/a";
      var body = res ? res.getBody() || "" : "n/a";
      message += ", originated from request (method: ".concat(method, ", url: ").concat(url, ", response code: ").concat(status, ", response text: ").concat(body, ", request id: ").concat(requestId, ")");
    }

    _this.message = message;
    return _this;
  }

  return DetailedError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var _default = DetailedError;
exports.default = _default;
},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableDebugLog = enableDebugLog;
exports.log = log;

/* eslint no-console: "off" */
var isEnabled = false;

function enableDebugLog() {
  isEnabled = true;
}

function log(msg) {
  if (!isEnabled) return;
  console.log(msg);
}
},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* eslint no-unused-vars: "off" */


var NoopUrlStorage = /*#__PURE__*/function () {
  function NoopUrlStorage() {
    _classCallCheck(this, NoopUrlStorage);
  }

  _createClass(NoopUrlStorage, [{
    key: "listAllUploads",
    value: function listAllUploads() {
      return Promise.resolve([]);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      return Promise.resolve([]);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      return Promise.resolve(null);
    }
  }]);

  return NoopUrlStorage;
}();

exports.default = NoopUrlStorage;
},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _error = _interopRequireDefault(require("./error"));

var _uuid = _interopRequireDefault(require("./uuid"));

var _jsBase = require("js-base64");

var _urlParse = _interopRequireDefault(require("url-parse"));

var _logger = require("./logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window */


var defaultOptions = {
  endpoint: null,
  uploadUrl: null,
  metadata: {},
  fingerprint: null,
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  _onUploadUrlAvailable: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  onBeforeRequest: null,
  onAfterResponse: null,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false,
  urlStorage: null,
  fileReader: null,
  httpStack: null
};

var BaseUpload = /*#__PURE__*/function () {
  function BaseUpload(file, options) {
    _classCallCheck(this, BaseUpload); // Warn about removed options from previous versions


    if ("resume" in options) {
      console.log("tus: The `resume` option has been removed in tus-js-client v2. Please use the URL storage API instead."); // eslint-disable-line no-console
    } // The default options will already be added from the wrapper classes.


    this.options = options; // The storage module used to store URLs

    this._urlStorage = this.options.urlStorage; // The underlying File/Blob object

    this.file = file; // The URL against which the file will be uploaded

    this.url = null; // The underlying request object for the current PATCH request

    this._req = null; // The fingerpinrt for the current file (set after start())

    this._fingerprint = null; // The key that the URL storage returned when saving an URL with a fingerprint,

    this._urlStorageKey = null; // The offset used in the current PATCH request

    this._offset = null; // True if the current PATCH request has been aborted

    this._aborted = false; // The file's size in bytes

    this._size = null; // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.

    this._source = null; // The current count of attempts which have been made. Zero indicates none.

    this._retryAttempt = 0; // The timeout's ID which is used to delay the next retry

    this._retryTimeout = null; // The offset of the remote upload before the latest attempt was started.

    this._offsetBeforeRetry = 0; // An array of BaseUpload instances which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploads = null; // An array of upload URLs which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploadUrls = null;
  }
  /**
   * Use the Termination extension to delete an upload from the server by sending a DELETE
   * request to the specified upload URL. This is only possible if the server supports the
   * Termination extension. If the `options.retryDelays` property is set, the method will
   * also retry if an error ocurrs.
   *
   * @param {String} url The upload's URL which will be terminated.
   * @param {object} options Optional options for influencing HTTP requests.
   * @return {Promise} The Promise will be resolved/rejected when the requests finish.
   */


  _createClass(BaseUpload, [{
    key: "findPreviousUploads",
    value: function findPreviousUploads() {
      var _this = this;

      return this.options.fingerprint(this.file, this.options).then(function (fingerprint) {
        return _this._urlStorage.findUploadsByFingerprint(fingerprint);
      });
    }
  }, {
    key: "resumeFromPreviousUpload",
    value: function resumeFromPreviousUpload(previousUpload) {
      this.url = previousUpload.uploadUrl || null;
      this._parallelUploadUrls = previousUpload.parallelUploadUrls || null;
      this._urlStorageKey = previousUpload.urlStorageKey;
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      var file = this.file;

      if (!file) {
        this._emitError(new Error("tus: no file or stream to upload provided"));

        return;
      }

      if (!this.options.endpoint && !this.options.uploadUrl) {
        this._emitError(new Error("tus: neither an endpoint or an upload URL is provided"));

        return;
      }

      var retryDelays = this.options.retryDelays;

      if (retryDelays != null && Object.prototype.toString.call(retryDelays) !== "[object Array]") {
        this._emitError(new Error("tus: the `retryDelays` option must either be an array or null"));

        return;
      }

      if (this.options.parallelUploads > 1) {
        // Test which options are incompatible with parallel uploads.
        ["uploadUrl", "uploadSize", "uploadLengthDeferred"].forEach(function (optionName) {
          if (_this2.options[optionName]) {
            _this2._emitError(new Error("tus: cannot use the ".concat(optionName, " option when parallelUploads is enabled")));
          }
        });
      }

      this.options.fingerprint(file, this.options).then(function (fingerprint) {
        if (fingerprint == null) {
          (0, _logger.log)("No fingerprint was calculated meaning that the upload cannot be stored in the URL storage.");
        } else {
          (0, _logger.log)("Calculated fingerprint: ".concat(fingerprint));
        }

        _this2._fingerprint = fingerprint;

        if (_this2._source) {
          return _this2._source;
        } else {
          return _this2.options.fileReader.openFile(file, _this2.options.chunkSize);
        }
      }).then(function (source) {
        _this2._source = source; // If the upload was configured to use multiple requests or if we resume from
        // an upload which used multiple requests, we start a parallel upload.

        if (_this2.options.parallelUploads > 1 || _this2._parallelUploadUrls != null) {
          _this2._startParallelUpload();
        } else {
          _this2._startSingleUpload();
        }
      })["catch"](function (err) {
        _this2._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a parallelized upload, where one file is split into
     * multiple request which are run in parallel.
     *
     * @api private
     */

  }, {
    key: "_startParallelUpload",
    value: function _startParallelUpload() {
      var _this3 = this;

      var totalSize = this._size = this._source.size;
      var totalProgress = 0;
      this._parallelUploads = [];
      var partCount = this._parallelUploadUrls != null ? this._parallelUploadUrls.length : this.options.parallelUploads; // The input file will be split into multiple slices which are uploaded in separate
      // requests. Here we generate the start and end position for the slices.

      var parts = splitSizeIntoParts(this._source.size, partCount, this._parallelUploadUrls); // Create an empty list for storing the upload URLs

      this._parallelUploadUrls = new Array(parts.length); // Generate a promise for each slice that will be resolve if the respective
      // upload is completed.

      var uploads = parts.map(function (part, index) {
        var lastPartProgress = 0;
        return _this3._source.slice(part.start, part.end).then(function (_ref) {
          var value = _ref.value;
          return new Promise(function (resolve, reject) {
            // Merge with the user supplied options but overwrite some values.
            var options = _objectSpread({}, _this3.options, {
              // If available, the partial upload should be resumed from a previous URL.
              uploadUrl: part.uploadUrl || null,
              // We take manually care of resuming for partial uploads, so they should
              // not be stored in the URL storage.
              storeFingerprintForResuming: false,
              removeFingerprintOnSuccess: false,
              // Reset the parallelUploads option to not cause recursion.
              parallelUploads: 1,
              metadata: {},
              // Add the header to indicate the this is a partial upload.
              headers: _objectSpread({}, _this3.options.headers, {
                "Upload-Concat": "partial"
              }),
              // Reject or resolve the promise if the upload errors or completes.
              onSuccess: resolve,
              onError: reject,
              // Based in the progress for this partial upload, calculate the progress
              // for the entire final upload.
              onProgress: function onProgress(newPartProgress) {
                totalProgress = totalProgress - lastPartProgress + newPartProgress;
                lastPartProgress = newPartProgress;

                _this3._emitProgress(totalProgress, totalSize);
              },
              // Wait until every partial upload has an upload URL, so we can add
              // them to the URL storage.
              _onUploadUrlAvailable: function _onUploadUrlAvailable() {
                _this3._parallelUploadUrls[index] = upload.url; // Test if all uploads have received an URL

                if (_this3._parallelUploadUrls.filter(function (u) {
                  return !!u;
                }).length === parts.length) {
                  _this3._saveUploadInUrlStorage();
                }
              }
            });

            var upload = new BaseUpload(value, options);
            upload.start(); // Store the upload in an array, so we can later abort them if necessary.

            _this3._parallelUploads.push(upload);
          });
        });
      });
      var req; // Wait until all partial uploads are finished and we can send the POST request for
      // creating the final upload.

      Promise.all(uploads).then(function () {
        req = _this3._openRequest("POST", _this3.options.endpoint);
        req.setHeader("Upload-Concat", "final;".concat(_this3._parallelUploadUrls.join(" "))); // Add metadata if values have been added

        var metadata = encodeMetadata(_this3.options.metadata);

        if (metadata !== "") {
          req.setHeader("Upload-Metadata", metadata);
        }

        return _this3._sendRequest(req, null);
      }).then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this3._emitHttpError(req, res, "tus: unexpected response while creating upload");

          return;
        }

        var location = res.getHeader("Location");

        if (location == null) {
          _this3._emitHttpError(req, res, "tus: invalid or missing Location header");

          return;
        }

        _this3.url = resolveUrl(_this3.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this3.url));

        _this3._emitSuccess();
      })["catch"](function (err) {
        _this3._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a non-parallel upload. Here the entire file is
     * uploaded in a sequential matter.
     *
     * @api private
     */

  }, {
    key: "_startSingleUpload",
    value: function _startSingleUpload() {
      // First, we look at the uploadLengthDeferred option.
      // Next, we check if the caller has supplied a manual upload size.
      // Finally, we try to use the calculated size from the source object.
      if (this.options.uploadLengthDeferred) {
        this._size = null;
      } else if (this.options.uploadSize != null) {
        this._size = +this.options.uploadSize;

        if (isNaN(this._size)) {
          this._emitError(new Error("tus: cannot convert `uploadSize` option into a number"));

          return;
        }
      } else {
        this._size = this._source.size;

        if (this._size == null) {
          this._emitError(new Error("tus: cannot automatically derive upload's size from input and must be specified manually using the `uploadSize` option"));

          return;
        }
      } // Reset the aborted flag when the upload is started or else the
      // _performUpload will stop before sending a request if the upload has been
      // aborted previously.


      this._aborted = false; // The upload had been started previously and we should reuse this URL.

      if (this.url != null) {
        (0, _logger.log)("Resuming upload from previous URL: ".concat(this.url));

        this._resumeUpload();

        return;
      } // A URL has manually been specified, so we try to resume


      if (this.options.uploadUrl != null) {
        (0, _logger.log)("Resuming upload from provided URL: ".concat(this.options.url));
        this.url = this.options.uploadUrl;

        this._resumeUpload();

        return;
      } // An upload has not started for the file yet, so we start a new one


      (0, _logger.log)("Creating a new upload");

      this._createUpload();
    }
    /**
     * Abort any running request and stop the current upload. After abort is called, no event
     * handler will be invoked anymore. You can use the `start` method to resume the upload
     * again.
     * If `shouldTerminate` is true, the `terminate` function will be called to remove the
     * current upload from the server.
     *
     * @param {boolean} shouldTerminate True if the upload should be deleted from the server.
     * @return {Promise} The Promise will be resolved/rejected when the requests finish.
     */

  }, {
    key: "abort",
    value: function abort(shouldTerminate, cb) {
      var _this4 = this;

      if (typeof cb === "function") {
        throw new Error("tus: the abort function does not accept a callback since v2 anymore; please use the returned Promise instead");
      } // Stop any parallel partial uploads, that have been started in _startParallelUploads.


      if (this._parallelUploads != null) {
        this._parallelUploads.forEach(function (upload) {
          upload.abort(shouldTerminate);
        });
      } // Stop any current running request.


      if (this._req !== null) {
        this._req.abort();

        this._source.close();
      }

      this._aborted = true; // Stop any timeout used for initiating a retry.

      if (this._retryTimeout != null) {
        clearTimeout(this._retryTimeout);
        this._retryTimeout = null;
      }

      if (!shouldTerminate || this.url == null) {
        return Promise.resolve();
      }

      return BaseUpload.terminate(this.url, this.options) // Remove entry from the URL storage since the upload URL is no longer valid.
      .then(function () {
        return _this4._removeFromUrlStorage();
      });
    }
  }, {
    key: "_emitHttpError",
    value: function _emitHttpError(req, res, message, causingErr) {
      this._emitError(new _error.default(message, causingErr, req, res));
    }
  }, {
    key: "_emitError",
    value: function _emitError(err) {
      var _this5 = this; // Do not emit errors, e.g. from aborted HTTP requests, if the upload has been stopped.


      if (this._aborted) return; // Check if we should retry, when enabled, before sending the error to the user.

      if (this.options.retryDelays != null) {
        // We will reset the attempt counter if
        // - we were already able to connect to the server (offset != null) and
        // - we were able to upload a small chunk of data to the server
        var shouldResetDelays = this._offset != null && this._offset > this._offsetBeforeRetry;

        if (shouldResetDelays) {
          this._retryAttempt = 0;
        }

        if (shouldRetry(err, this._retryAttempt, this.options)) {
          var delay = this.options.retryDelays[this._retryAttempt++];
          this._offsetBeforeRetry = this._offset;
          this._retryTimeout = setTimeout(function () {
            _this5.start();
          }, delay);
          return;
        }
      }

      if (typeof this.options.onError === "function") {
        this.options.onError(err);
      } else {
        throw err;
      }
    }
    /**
     * Publishes notification if the upload has been successfully completed.
     *
     * @api private
     */

  }, {
    key: "_emitSuccess",
    value: function _emitSuccess() {
      if (this.options.removeFingerprintOnSuccess) {
        // Remove stored fingerprint and corresponding endpoint. This causes
        // new uploads of the same file to be treated as a different file.
        this._removeFromUrlStorage();
      }

      if (typeof this.options.onSuccess === "function") {
        this.options.onSuccess();
      }
    }
    /**
     * Publishes notification when data has been sent to the server. This
     * data may not have been accepted by the server yet.
     *
     * @param {number} bytesSent  Number of bytes sent to the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitProgress",
    value: function _emitProgress(bytesSent, bytesTotal) {
      if (typeof this.options.onProgress === "function") {
        this.options.onProgress(bytesSent, bytesTotal);
      }
    }
    /**
     * Publishes notification when a chunk of data has been sent to the server
     * and accepted by the server.
     * @param {number} chunkSize  Size of the chunk that was accepted by the server.
     * @param {number} bytesAccepted Total number of bytes that have been
     *                                accepted by the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitChunkComplete",
    value: function _emitChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
      if (typeof this.options.onChunkComplete === "function") {
        this.options.onChunkComplete(chunkSize, bytesAccepted, bytesTotal);
      }
    }
    /**
     * Create a new upload using the creation extension by sending a POST
     * request to the endpoint. After successful creation the file will be
     * uploaded
     *
     * @api private
     */

  }, {
    key: "_createUpload",
    value: function _createUpload() {
      var _this6 = this;

      if (!this.options.endpoint) {
        this._emitError(new Error("tus: unable to create upload because no endpoint is provided"));

        return;
      }

      var req = this._openRequest("POST", this.options.endpoint);

      if (this.options.uploadLengthDeferred) {
        req.setHeader("Upload-Defer-Length", 1);
      } else {
        req.setHeader("Upload-Length", this._size);
      } // Add metadata if values have been added


      var metadata = encodeMetadata(this.options.metadata);

      if (metadata !== "") {
        req.setHeader("Upload-Metadata", metadata);
      }

      var promise;

      if (this.options.uploadDataDuringCreation && !this.options.uploadLengthDeferred) {
        this._offset = 0;
        promise = this._addChunkToRequest(req);
      } else {
        promise = this._sendRequest(req, null);
      }

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this6._emitHttpError(req, res, "tus: unexpected response while creating upload");

          return;
        }

        var location = res.getHeader("Location");

        if (location == null) {
          _this6._emitHttpError(req, res, "tus: invalid or missing Location header");

          return;
        }

        _this6.url = resolveUrl(_this6.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this6.url));

        if (typeof _this6.options._onUploadUrlAvailable === "function") {
          _this6.options._onUploadUrlAvailable();
        }

        if (_this6._size === 0) {
          // Nothing to upload and file was successfully created
          _this6._emitSuccess();

          _this6._source.close();

          return;
        }

        _this6._saveUploadInUrlStorage();

        if (_this6.options.uploadDataDuringCreation) {
          _this6._handleUploadResponse(req, res);
        } else {
          _this6._offset = 0;

          _this6._performUpload();
        }
      })["catch"](function (err) {
        _this6._emitHttpError(req, null, "tus: failed to create upload", err);
      });
    }
    /*
     * Try to resume an existing upload. First a HEAD request will be sent
     * to retrieve the offset. If the request fails a new upload will be
     * created. In the case of a successful response the file will be uploaded.
     *
     * @api private
     */

  }, {
    key: "_resumeUpload",
    value: function _resumeUpload() {
      var _this7 = this;

      var req = this._openRequest("HEAD", this.url);

      var promise = this._sendRequest(req, null);

      promise.then(function (res) {
        var status = res.getStatus();

        if (!inStatusCategory(status, 200)) {
          if (inStatusCategory(status, 400)) {
            // Remove stored fingerprint and corresponding endpoint,
            // on client errors since the file can not be found
            _this7._removeFromUrlStorage();
          } // If the upload is locked (indicated by the 423 Locked status code), we
          // emit an error instead of directly starting a new upload. This way the
          // retry logic can catch the error and will retry the upload. An upload
          // is usually locked for a short period of time and will be available
          // afterwards.


          if (status === 423) {
            _this7._emitHttpError(req, res, "tus: upload is currently locked; retry later");

            return;
          }

          if (!_this7.options.endpoint) {
            // Don't attempt to create a new upload if no endpoint is provided.
            _this7._emitHttpError(req, res, "tus: unable to resume upload (new upload cannot be created without an endpoint)");

            return;
          } // Try to create a new upload


          _this7.url = null;

          _this7._createUpload();

          return;
        }

        var offset = parseInt(res.getHeader("Upload-Offset"), 10);

        if (isNaN(offset)) {
          _this7._emitHttpError(req, res, "tus: invalid or missing offset value");

          return;
        }

        var length = parseInt(res.getHeader("Upload-Length"), 10);

        if (isNaN(length) && !_this7.options.uploadLengthDeferred) {
          _this7._emitHttpError(req, res, "tus: invalid or missing length value");

          return;
        }

        if (typeof _this7.options._onUploadUrlAvailable === "function") {
          _this7.options._onUploadUrlAvailable();
        } // Upload has already been completed and we do not need to send additional
        // data to the server


        if (offset === length) {
          _this7._emitProgress(length, length);

          _this7._emitSuccess();

          return;
        }

        _this7._offset = offset;

        _this7._performUpload();
      })["catch"](function (err) {
        _this7._emitHttpError(req, null, "tus: failed to resume upload", err);
      });
    }
    /**
     * Start uploading the file using PATCH requests. The file will be divided
     * into chunks as specified in the chunkSize option. During the upload
     * the onProgress event handler may be invoked multiple times.
     *
     * @api private
     */

  }, {
    key: "_performUpload",
    value: function _performUpload() {
      var _this8 = this; // If the upload has been aborted, we will not send the next PATCH request.
      // This is important if the abort method was called during a callback, such
      // as onChunkComplete or onProgress.


      if (this._aborted) {
        return;
      }

      var req; // Some browser and servers may not support the PATCH method. For those
      // cases, you can tell tus-js-client to use a POST request with the
      // X-HTTP-Method-Override header for simulating a PATCH request.

      if (this.options.overridePatchMethod) {
        req = this._openRequest("POST", this.url);
        req.setHeader("X-HTTP-Method-Override", "PATCH");
      } else {
        req = this._openRequest("PATCH", this.url);
      }

      req.setHeader("Upload-Offset", this._offset);

      var promise = this._addChunkToRequest(req);

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this8._emitHttpError(req, res, "tus: unexpected response while uploading chunk");

          return;
        }

        _this8._handleUploadResponse(req, res);
      })["catch"](function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this8._aborted) {
          return;
        }

        _this8._emitHttpError(req, null, "tus: failed to upload chunk at offset " + _this8._offset, err);
      });
    }
    /**
     * _addChunktoRequest reads a chunk from the source and sends it using the
     * supplied request object. It will not handle the response.
     *
     * @api private
     */

  }, {
    key: "_addChunkToRequest",
    value: function _addChunkToRequest(req) {
      var _this9 = this;

      var start = this._offset;
      var end = this._offset + this.options.chunkSize;
      req.setProgressHandler(function (bytesSent) {
        _this9._emitProgress(start + bytesSent, _this9._size);
      });
      req.setHeader("Content-Type", "application/offset+octet-stream"); // The specified chunkSize may be Infinity or the calcluated end position
      // may exceed the file's size. In both cases, we limit the end position to
      // the input's total size for simpler calculations and correctness.

      if ((end === Infinity || end > this._size) && !this.options.uploadLengthDeferred) {
        end = this._size;
      }

      return this._source.slice(start, end).then(function (_ref2) {
        var value = _ref2.value,
            done = _ref2.done; // If the upload length is deferred, the upload size was not specified during
        // upload creation. So, if the file reader is done reading, we know the total
        // upload size and can tell the tus server.

        if (_this9.options.uploadLengthDeferred && done) {
          _this9._size = _this9._offset + (value && value.size ? value.size : 0);
          req.setHeader("Upload-Length", _this9._size);
        }

        if (value === null) {
          return _this9._sendRequest(req);
        } else {
          _this9._emitProgress(_this9._offset, _this9._size);

          return _this9._sendRequest(req, value);
        }
      });
    }
    /**
     * _handleUploadResponse is used by requests that haven been sent using _addChunkToRequest
     * and already have received a response.
     *
     * @api private
     */

  }, {
    key: "_handleUploadResponse",
    value: function _handleUploadResponse(req, res) {
      var offset = parseInt(res.getHeader("Upload-Offset"), 10);

      if (isNaN(offset)) {
        this._emitHttpError(req, res, "tus: invalid or missing offset value");

        return;
      }

      this._emitProgress(offset, this._size);

      this._emitChunkComplete(offset - this._offset, offset, this._size);

      this._offset = offset;

      if (offset == this._size) {
        // Yay, finally done :)
        this._emitSuccess();

        this._source.close();

        return;
      }

      this._performUpload();
    }
    /**
     * Create a new HTTP request object with the given method and URL.
     *
     * @api private
     */

  }, {
    key: "_openRequest",
    value: function _openRequest(method, url) {
      var req = openRequest(method, url, this.options);
      this._req = req;
      return req;
    }
    /**
     * Remove the entry in the URL storage, if it has been saved before.
     *
     * @api private
     */

  }, {
    key: "_removeFromUrlStorage",
    value: function _removeFromUrlStorage() {
      var _this10 = this;

      if (!this._urlStorageKey) return;

      this._urlStorage.removeUpload(this._urlStorageKey)["catch"](function (err) {
        _this10._emitError(err);
      });

      this._urlStorageKey = null;
    }
    /**
     * Add the upload URL to the URL storage, if possible.
     *
     * @api private
     */

  }, {
    key: "_saveUploadInUrlStorage",
    value: function _saveUploadInUrlStorage() {
      var _this11 = this; // Only if a fingerprint was calculated for the input (i.e. not a stream), we can store the upload URL.


      if (!this.options.storeFingerprintForResuming || !this._fingerprint) {
        return;
      }

      var storedUpload = {
        size: this._size,
        metadata: this.options.metadata,
        creationTime: new Date().toString()
      };

      if (this._parallelUploads) {
        // Save multiple URLs if the parallelUploads option is used ...
        storedUpload.parallelUploadUrls = this._parallelUploadUrls;
      } else {
        // ... otherwise we just save the one available URL.
        storedUpload.uploadUrl = this.url;
      }

      this._urlStorage.addUpload(this._fingerprint, storedUpload).then(function (urlStorageKey) {
        return _this11._urlStorageKey = urlStorageKey;
      })["catch"](function (err) {
        _this11._emitError(err);
      });
    }
    /**
     * Send a request with the provided body while invoking the onBeforeRequest
     * and onAfterResponse callbacks.
     *
     * @api private
     */

  }, {
    key: "_sendRequest",
    value: function _sendRequest(req) {
      var _this12 = this;

      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (typeof this.options.onBeforeRequest === "function") {
        this.options.onBeforeRequest(req);
      }

      return req.send(body).then(function (res) {
        if (typeof _this12.options.onAfterResponse === "function") {
          _this12.options.onAfterResponse(req, res);
        }

        return res;
      });
    }
  }], [{
    key: "terminate",
    value: function terminate(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cb = arguments.length > 2 ? arguments[2] : undefined;

      if (typeof options === "function" || typeof cb === "function") {
        throw new Error("tus: the terminate function does not accept a callback since v2 anymore; please use the returned Promise instead");
      }

      var req = openRequest("DELETE", url, options);
      var promise = req.send();
      return promise.then(function (res) {
        // A 204 response indicates a successfull request
        if (res.getStatus() === 204) {
          return;
        }

        throw new _error.default("tus: unexpected response while terminating upload", null, req, res);
      })["catch"](function (err) {
        if (!(err instanceof _error.default)) {
          err = new _error.default("tus: failed to terminate upload", err, req, null);
        }

        if (!shouldRetry(err, 0, options)) {
          throw err;
        } // Instead of keeping track of the retry attempts, we remove the first element from the delays
        // array. If the array is empty, all retry attempts are used up and we will bubble up the error.
        // We recursively call the terminate function will removing elements from the retryDelays array.


        var delay = options.retryDelays[0];
        var remainingDelays = options.retryDelays.slice(1);

        var newOptions = _objectSpread({}, options, {
          retryDelays: remainingDelays
        });

        return new Promise(function (resolve) {
          return setTimeout(resolve, delay);
        }).then(function () {
          return BaseUpload.terminate(url, newOptions);
        });
      });
    }
  }]);

  return BaseUpload;
}();

function encodeMetadata(metadata) {
  var encoded = [];

  for (var key in metadata) {
    encoded.push(key + " " + _jsBase.Base64.encode(metadata[key]));
  }

  return encoded.join(",");
}
/**
 * Checks whether a given status is in the range of the expected category.
 * For example, only a status between 200 and 299 will satisfy the category 200.
 *
 * @api private
 */


function inStatusCategory(status, category) {
  return status >= category && status < category + 100;
}
/**
 * Create a new HTTP request with the specified method and URL.
 * The necessary headers that are included in every request
 * will be added, including the request ID.
 *
 * @api private
 */


function openRequest(method, url, options) {
  var req = options.httpStack.createRequest(method, url);
  req.setHeader("Tus-Resumable", "1.0.0");
  var headers = options.headers || {};

  for (var name in headers) {
    req.setHeader(name, headers[name]);
  }

  if (options.addRequestId) {
    var requestId = (0, _uuid.default)();
    req.setHeader("X-Request-ID", requestId);
  }

  return req;
}
/**
 * Checks whether the browser running this code has internet access.
 * This function will always return true in the node.js environment
 *
 * @api private
 */


function isOnline() {
  var online = true;

  if (typeof window !== "undefined" && "navigator" in window && window.navigator.onLine === false) {
    online = false;
  }

  return online;
}
/**
 * Checks whether or not it is ok to retry a request.
 * @param {Error} err the error returned from the last request
 * @param {number} retryAttempt the number of times the request has already been retried
 * @param {object} options tus Upload options
 *
 * @api private
 */


function shouldRetry(err, retryAttempt, options) {
  // We only attempt a retry if
  // - retryDelays option is set
  // - we didn't exceed the maxium number of retries, yet, and
  // - this error was caused by a request or it's response and
  // - the error is server error (i.e. no a status 4xx or a 409 or 423) and
  // - the browser does not indicate that we are offline
  var status = err.originalResponse ? err.originalResponse.getStatus() : 0;
  var isServerError = !inStatusCategory(status, 400) || status === 409 || status === 423;
  return options.retryDelays != null && retryAttempt < options.retryDelays.length && err.originalRequest != null && isServerError && isOnline();
}
/**
 * Resolve a relative link given the origin as source. For example,
 * if a HTTP request to http://example.com/files/ returns a Location
 * header with the value /upload/abc, the resolved URL will be:
 * http://example.com/upload/abc
 */


function resolveUrl(origin, link) {
  return new _urlParse.default(link, origin).toString();
}
/**
 * Calculate the start and end positions for the parts if an upload
 * is split into multiple parallel requests.
 *
 * @param {number} totalSize The byte size of the upload, which will be split.
 * @param {number} partCount The number in how many parts the upload will be split.
 * @param {string[]} previousUrls The upload URLs for previous parts.
 * @return {object[]}
 * @api private
 */


function splitSizeIntoParts(totalSize, partCount, previousUrls) {
  var partSize = Math.floor(totalSize / partCount);
  var parts = [];

  for (var i = 0; i < partCount; i++) {
    parts.push({
      start: partSize * i,
      end: partSize * (i + 1)
    });
  }

  parts[partCount - 1].end = totalSize; // Attach URLs from previous uploads, if available.

  if (previousUrls) {
    parts.forEach(function (part, index) {
      part.uploadUrl = previousUrls[index] || null;
    });
  }

  return parts;
}

BaseUpload.defaultOptions = defaultOptions;
var _default = BaseUpload;
exports.default = _default;
},{"./error":19,"./logger":20,"./uuid":23,"js-base64":2,"url-parse":24}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uuid;

/**
 * Generate a UUID v4 based on random numbers. We intentioanlly use the less
 * secure Math.random function here since the more secure crypto.getRandomNumbers
 * is not available on all platforms.
 * This is not a problem for us since we use the UUID only for generating a
 * request ID, so we can correlate server logs to client errors.
 *
 * This function is taken from following site:
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *
 * @return {string} The generate UUID
 */
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
},{}],24:[function(require,module,exports){
(function (global){(function (){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:[\\/]+/
  , protocolre = /^([a-z][a-z0-9.+-]*:)?([\\/]{1,})?([\S\s]*)/i
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address) {
  address = trimLeft(address);

  var match = protocolre.exec(address)
    , protocol = match[1] ? match[1].toLowerCase() : ''
    , slashes = !!(match[2] && match[2].length >= 2)
    , rest =  match[2] && match[2].length === 1 ? '/' + match[3] : match[3];

  return {
    protocol: protocol,
    slashes: slashes,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && url.hostname) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"querystringify":8,"requires-port":9}],25:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

},{}],26:[function(require,module,exports){
'use strict';

class AuthError extends Error {
  constructor() {
    super('Authorization required');
    this.name = 'AuthError';
    this.isAuthError = true;
  }

}

module.exports = AuthError;

},{}],27:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const tokenStorage = require('./tokenStorage');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class Provider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
    this.tokenKey = `companion-${this.pluginId}-auth-token`;
    this.companionKeysParams = this.opts.companionKeysParams;
    this.preAuthToken = null;
  }

  headers() {
    return Promise.all([super.headers(), this.getAuthToken()]).then(([headers, token]) => {
      const authHeaders = {};

      if (token) {
        authHeaders['uppy-auth-token'] = token;
      }

      if (this.companionKeysParams) {
        authHeaders['uppy-credentials-params'] = btoa(JSON.stringify({
          params: this.companionKeysParams
        }));
      }

      return { ...headers,
        ...authHeaders
      };
    });
  }

  onReceiveResponse(response) {
    response = super.onReceiveResponse(response);
    const plugin = this.uppy.getPlugin(this.pluginId);
    const oldAuthenticated = plugin.getPluginState().authenticated;
    const authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated
    });
    return response;
  }

  setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  }

  getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  }

  authUrl(queries = {}) {
    if (this.preAuthToken) {
      queries.uppyPreAuthToken = this.preAuthToken;
    }

    return `${this.hostname}/${this.id}/connect?${new URLSearchParams(queries)}`;
  }

  fileUrl(id) {
    return `${this.hostname}/${this.id}/get/${id}`;
  }

  fetchPreAuthToken() {
    if (!this.companionKeysParams) {
      return Promise.resolve();
    }

    return this.post(`${this.id}/preauth/`, {
      params: this.companionKeysParams
    }).then(res => {
      this.preAuthToken = res.token;
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to fetch preAuthToken ${err}`, 'warning');
    });
  }

  list(directory) {
    return this.get(`${this.id}/list/${directory || ''}`);
  }

  logout() {
    return this.get(`${this.id}/logout`).then(response => Promise.all([response, this.uppy.getPlugin(this.pluginId).storage.removeItem(this.tokenKey)])).then(([response]) => response);
  }

  static initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = { ...defaultOpts,
        ...opts
      };
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      const pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(`${plugin.id}: the option "companionAllowedHosts" must be one of string, Array, RegExp`);
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
      // does not start with https://
      plugin.opts.companionAllowedHosts = `https://${opts.companionUrl.replace(/^\/\//, '')}`;
    } else {
      plugin.opts.companionAllowedHosts = new URL(opts.companionUrl).origin;
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  }

};

},{"./RequestClient":28,"./tokenStorage":32}],28:[function(require,module,exports){
'use strict';

var _class, _getPostResponseFunc, _getUrl, _errorHandler, _temp;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const fetchWithNetworkError = require('./../../utils/lib/fetchWithNetworkError');

const AuthError = require('./AuthError'); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

async function handleJSONResponse(res) {
  if (res.status === 401) {
    throw new AuthError();
  }

  const jsonPromise = res.json();

  if (res.status < 200 || res.status > 300) {
    let errMsg = `Failed request with status: ${res.status}. ${res.statusText}`;

    try {
      const errData = await jsonPromise;
      errMsg = errData.message ? `${errMsg} message: ${errData.message}` : errMsg;
      errMsg = errData.requestId ? `${errMsg} request-Id: ${errData.requestId}` : errMsg;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(errMsg);
    }
  }

  return jsonPromise;
}

module.exports = (_temp = (_getPostResponseFunc = /*#__PURE__*/_classPrivateFieldLooseKey("getPostResponseFunc"), _getUrl = /*#__PURE__*/_classPrivateFieldLooseKey("getUrl"), _errorHandler = /*#__PURE__*/_classPrivateFieldLooseKey("errorHandler"), _class = class RequestClient {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    Object.defineProperty(this, _errorHandler, {
      value: _errorHandler2
    });
    Object.defineProperty(this, _getUrl, {
      value: _getUrl2
    });
    Object.defineProperty(this, _getPostResponseFunc, {
      writable: true,
      value: skip => response => skip ? response : this.onReceiveResponse(response)
    });
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  get hostname() {
    const {
      companion
    } = this.uppy.getState();
    const host = this.opts.companionUrl;
    return stripSlash(companion && companion[host] ? companion[host] : host);
  }

  headers() {
    const userHeaders = this.opts.companionHeaders || {};
    return Promise.resolve({ ...RequestClient.defaultHeaders,
      ...userHeaders
    });
  }

  onReceiveResponse(response) {
    const state = this.uppy.getState();
    const companion = state.companion || {};
    const host = this.opts.companionUrl;
    const {
      headers
    } = response; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      this.uppy.setState({
        companion: { ...companion,
          [host]: headers.get('i-am')
        }
      });
    }

    return response;
  }

  preflight(path) {
    if (this.preflightDone) {
      return Promise.resolve(this.allowedHeaders.slice());
    }

    return fetch(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method: 'OPTIONS'
    }).then(response => {
      if (response.headers.has('access-control-allow-headers')) {
        this.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(headerName => headerName.trim().toLowerCase());
      }

      this.preflightDone = true;
      return this.allowedHeaders.slice();
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to make preflight request ${err}`, 'warning');
      this.preflightDone = true;
      return this.allowedHeaders.slice();
    });
  }

  preflightAndHeaders(path) {
    return Promise.all([this.preflight(path), this.headers()]).then(([allowedHeaders, headers]) => {
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(header => {
        if (!allowedHeaders.includes(header.toLowerCase())) {
          this.uppy.log(`[CompanionClient] excluding disallowed header ${header}`);
          delete headers[header]; // eslint-disable-line no-param-reassign
        }
      });
      return headers;
    });
  }

  get(path, skipPostResponse) {
    const method = 'get';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin'
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  post(path, data, skipPostResponse) {
    const method = 'post';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: JSON.stringify(data)
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  delete(path, data, skipPostResponse) {
    const method = 'delete';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(`${this.hostname}/${path}`, {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: data ? JSON.stringify(data) : null
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

}), _class.VERSION = "2.0.1", _class.defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Uppy-Versions': `@uppy/companion-client=${_class.VERSION}`
}, _temp);

function _getUrl2(url) {
  if (/^(https?:|)\/\//.test(url)) {
    return url;
  }

  return `${this.hostname}/${url}`;
}

function _errorHandler2(method, path) {
  return err => {
    var _err;

    if (!((_err = err) != null && _err.isAuthError)) {
      const error = new Error(`Could not ${method} ${_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path)}`);
      error.cause = err;
      err = error; // eslint-disable-line no-param-reassign
    }

    return Promise.reject(err);
  };
}

},{"./../../utils/lib/fetchWithNetworkError":52,"./AuthError":26}],29:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class SearchProvider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
  }

  fileUrl(id) {
    return `${this.hostname}/search/${this.id}/get/${id}`;
  }

  search(text, queries) {
    queries = queries ? `&${queries}` : '';
    return this.get(`search/${this.id}/list?q=${encodeURIComponent(text)}${queries}`);
  }

};

},{"./RequestClient":28}],30:[function(require,module,exports){
"use strict";

var _queued, _emitter, _isOpen, _socket, _handleMessage;

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const ee = require('namespace-emitter');

module.exports = (_queued = /*#__PURE__*/_classPrivateFieldLooseKey("queued"), _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _isOpen = /*#__PURE__*/_classPrivateFieldLooseKey("isOpen"), _socket = /*#__PURE__*/_classPrivateFieldLooseKey("socket"), _handleMessage = /*#__PURE__*/_classPrivateFieldLooseKey("handleMessage"), _Symbol$for = Symbol.for('uppy test: getSocket'), _Symbol$for2 = Symbol.for('uppy test: getQueued'), class UppySocket {
  constructor(opts) {
    Object.defineProperty(this, _queued, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _isOpen, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _socket, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handleMessage, {
      writable: true,
      value: e => {
        try {
          const message = JSON.parse(e.data);
          this.emit(message.action, message.payload);
        } catch (err) {
          // TODO: use a more robust error handler.
          console.log(err); // eslint-disable-line no-console
        }
      }
    });
    this.opts = opts;

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  get isOpen() {
    return _classPrivateFieldLooseBase(this, _isOpen)[_isOpen];
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _socket)[_socket];
  }

  [_Symbol$for2]() {
    return _classPrivateFieldLooseBase(this, _queued)[_queued];
  }

  open() {
    _classPrivateFieldLooseBase(this, _socket)[_socket] = new WebSocket(this.opts.target);

    _classPrivateFieldLooseBase(this, _socket)[_socket].onopen = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = true;

      while (_classPrivateFieldLooseBase(this, _queued)[_queued].length > 0 && _classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
        const first = _classPrivateFieldLooseBase(this, _queued)[_queued].shift();

        this.send(first.action, first.payload);
      }
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onclose = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = false;
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onmessage = _classPrivateFieldLooseBase(this, _handleMessage)[_handleMessage];
  }

  close() {
    var _classPrivateFieldLoo;

    (_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _socket)[_socket]) == null ? void 0 : _classPrivateFieldLoo.close();
  }

  send(action, payload) {
    // attach uuid
    if (!_classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
      _classPrivateFieldLooseBase(this, _queued)[_queued].push({
        action,
        payload
      });

      return;
    }

    _classPrivateFieldLooseBase(this, _socket)[_socket].send(JSON.stringify({
      action,
      payload
    }));
  }

  on(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(action, handler);
  }

  emit(action, payload) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(action, payload);
  }

  once(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(action, handler);
  }

});

},{"namespace-emitter":5}],31:[function(require,module,exports){
'use strict';
/**
 * Manages communications with Companion
 */

const RequestClient = require('./RequestClient');

const Provider = require('./Provider');

const SearchProvider = require('./SearchProvider');

const Socket = require('./Socket');

module.exports = {
  RequestClient,
  Provider,
  SearchProvider,
  Socket
};

},{"./Provider":27,"./RequestClient":28,"./SearchProvider":29,"./Socket":30}],32:[function(require,module,exports){
'use strict';
/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = (key, value) => {
  return new Promise(resolve => {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = key => {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = key => {
  return new Promise(resolve => {
    localStorage.removeItem(key);
    resolve();
  });
};

},{}],33:[function(require,module,exports){
(function (process){(function (){
// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

let { urlAlphabet } = require('./url-alphabet/index.cjs')

if (process.env.NODE_ENV !== 'production') {
  // All bundlers will remove this block in the production bundle.
  if (
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative' &&
    typeof crypto === 'undefined'
  ) {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
        'If you don’t need unpredictable IDs use `nanoid/non-secure`. ' +
        'For secure IDs, import `react-native-get-random-values` ' +
        'before Nano ID.'
    )
  }
  if (typeof msCrypto !== 'undefined' && typeof crypto === 'undefined') {
    throw new Error(
      'Import file with `if (!window.crypto) window.crypto = window.msCrypto`' +
        ' before importing Nano ID to fix IE 11 support'
    )
  }
  if (typeof crypto === 'undefined') {
    throw new Error(
      'Your browser does not have secure random generator. ' +
        'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

let customRandom = (alphabet, size, getRandom) => {
  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  // `Math.clz32` is not used, because it is not available in browsers.
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  // Though, the bitmask solution is not perfect since the bytes exceeding
  // the alphabet size are refused. Therefore, to reliably generate the ID,
  // the random bytes redundancy has to be satisfied.

  // Note: every hardware random generator call is performance expensive,
  // because the system call for entropy collection takes a lot of time.
  // So, to avoid additional system calls, extra bytes are requested in advance.

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
  // according to benchmarks).

  // `-~f => Math.ceil(f)` if f is a float
  // `-~i => i + 1` if i is an integer
  let step = -~((1.6 * mask * size) / alphabet.length)

  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step
      while (j--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}

let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)

let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    let byte = bytes[size] & 63
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36)
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}

module.exports = { nanoid, customAlphabet, customRandom, urlAlphabet, random }

}).call(this)}).call(this,require('_process'))

},{"./url-alphabet/index.cjs":34,"_process":7}],34:[function(require,module,exports){
// This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
// optimize the gzip compression for this alphabet.
let urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'

module.exports = { urlAlphabet }

},{}],35:[function(require,module,exports){
"use strict";

/**
 * Core plugin logic that all plugins share.
 *
 * BasePlugin does not contain DOM rendering so it can be used for plugins
 * without a user interface.
 *
 * See `Plugin` for the extended version with Preact rendering for interfaces.
 */
const Translator = require('./../../utils/lib/Translator');

module.exports = class BasePlugin {
  constructor(uppy, opts = {}) {
    this.uppy = uppy;
    this.opts = opts;
  }

  getPluginState() {
    const {
      plugins
    } = this.uppy.getState();
    return plugins[this.id] || {};
  }

  setPluginState(update) {
    const {
      plugins
    } = this.uppy.getState();
    this.uppy.setState({
      plugins: { ...plugins,
        [this.id]: { ...plugins[this.id],
          ...update
        }
      }
    });
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts
    };
    this.setPluginState(); // so that UI re-renders with new options

    this.i18nInit();
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  }
  /**
   * Extendable methods
   * ==================
   * These methods are here to serve as an overview of the extendable methods as well as
   * making them not conditional in use, such as `if (this.afterUpdate)`.
   */
  // eslint-disable-next-line class-methods-use-this


  addTarget() {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  } // eslint-disable-next-line class-methods-use-this


  install() {} // eslint-disable-next-line class-methods-use-this


  uninstall() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */


  render() {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  } // eslint-disable-next-line class-methods-use-this


  update() {} // Called after every state update, after everything's mounted. Debounced.
  // eslint-disable-next-line class-methods-use-this


  afterUpdate() {}

};

},{"./../../utils/lib/Translator":50}],36:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  render
} = require('preact');

const findDOMElement = require('./../../utils/lib/findDOMElement');

const BasePlugin = require('./BasePlugin');
/**
 * Defer a frequent call to the microtask queue.
 *
 * @param {() => T} fn
 * @returns {Promise<T>}
 */


function debounce(fn) {
  let calling = null;
  let latestArgs = null;
  return (...args) => {
    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(() => {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn(...latestArgs);
      });
    }

    return calling;
  };
}
/**
 * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
 * Use this for plugins that need a user interface.
 *
 * For plugins without an user interface, see BasePlugin.
 */


var _updateUI = /*#__PURE__*/_classPrivateFieldLooseKey("updateUI");

class UIPlugin extends BasePlugin {
  constructor(...args) {
    super(...args);
    Object.defineProperty(this, _updateUI, {
      writable: true,
      value: void 0
    });
  }

  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   */
  mount(target, plugin) {
    const callerPluginName = plugin.id;
    const targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // When target is <body> with a single <div> element,
      // Preact thinks it’s the Uppy root element in there when doing a diff,
      // and destroys it. So we are creating a fragment (could be empty div)

      const uppyRootElement = document.createDocumentFragment(); // API for plugins that require a synchronous rerender.

      _classPrivateFieldLooseBase(this, _updateUI)[_updateUI] = debounce(state => {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!this.uppy.getPlugin(this.id)) return;
        render(this.render(state), uppyRootElement);
        this.afterUpdate();
      });
      this.uppy.log(`Installing ${callerPluginName} to a DOM element '${target}'`);

      if (this.opts.replaceTargetContent) {
        // Doing render(h(null), targetElement), which should have been
        // a better way, since because the component might need to do additional cleanup when it is removed,
        // stopped working — Preact just adds null into target, not replacing
        targetElement.innerHTML = '';
      }

      render(this.render(this.uppy.getState()), uppyRootElement);
      this.el = uppyRootElement.firstElementChild;
      targetElement.appendChild(uppyRootElement);
      this.onMount();
      return this.el;
    }

    let targetPlugin;

    if (typeof target === 'object' && target instanceof UIPlugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      const Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(p => {
        if (p instanceof Target) {
          targetPlugin = p;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log(`Installing ${callerPluginName} to ${targetPlugin.id}`);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log(`Not installing ${callerPluginName}`);
    let message = `Invalid target option given to ${callerPluginName}.`;

    if (typeof target === 'function') {
      message += ' The given target is not a Plugin class. ' + 'Please check that you\'re not specifying a React Component instead of a plugin. ' + 'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' + 'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
    } else {
      message += 'If you meant to target an HTML element, please make sure that the element exists. ' + 'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' + '(see https://github.com/transloadit/uppy/issues/1042)\n\n' + 'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
    }

    throw new Error(message);
  }

  update(state) {
    if (this.el != null) {
      var _classPrivateFieldLoo, _classPrivateFieldLoo2;

      (_classPrivateFieldLoo = (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(this, _updateUI))[_updateUI]) == null ? void 0 : _classPrivateFieldLoo.call(_classPrivateFieldLoo2, state);
    }
  }

  unmount() {
    if (this.isTargetDOMEl) {
      var _this$el;

      (_this$el = this.el) == null ? void 0 : _this$el.remove();
    }

    this.onUnmount();
  } // eslint-disable-next-line class-methods-use-this


  onMount() {} // eslint-disable-next-line class-methods-use-this


  onUnmount() {}

}

module.exports = UIPlugin;

},{"./../../utils/lib/findDOMElement":53,"./BasePlugin":35,"preact":6}],37:[function(require,module,exports){
/* global AggregateError */
'use strict';

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const Translator = require('./../../utils/lib/Translator');

const ee = require('namespace-emitter');

const {
  nanoid
} = require('nanoid');

const throttle = require('lodash.throttle');

const prettierBytes = require('@transloadit/prettier-bytes');

const match = require('mime-match');

const DefaultStore = require('./../../store-default');

const getFileType = require('./../../utils/lib/getFileType');

const getFileNameAndExtension = require('./../../utils/lib/getFileNameAndExtension');

const generateFileID = require('./../../utils/lib/generateFileID');

const supportsUploadProgress = require('./supportsUploadProgress');

const getFileName = require('./getFileName');

const {
  justErrorsLogger,
  debugLogger
} = require('./loggers'); // Exported from here.


class RestrictionError extends Error {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}

if (typeof AggregateError === 'undefined') {
  // eslint-disable-next-line no-global-assign
  globalThis.AggregateError = class AggregateError extends Error {
    constructor(message, errors) {
      super(message);
      this.errors = errors;
    }

  };
}

class AggregateRestrictionError extends AggregateError {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var _plugins = /*#__PURE__*/_classPrivateFieldLooseKey("plugins");

var _storeUnsubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("storeUnsubscribe");

var _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter");

var _preProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("preProcessors");

var _uploaders = /*#__PURE__*/_classPrivateFieldLooseKey("uploaders");

var _postProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("postProcessors");

var _checkRestrictions = /*#__PURE__*/_classPrivateFieldLooseKey("checkRestrictions");

var _checkMinNumberOfFiles = /*#__PURE__*/_classPrivateFieldLooseKey("checkMinNumberOfFiles");

var _checkRequiredMetaFields = /*#__PURE__*/_classPrivateFieldLooseKey("checkRequiredMetaFields");

var _showOrLogErrorAndThrow = /*#__PURE__*/_classPrivateFieldLooseKey("showOrLogErrorAndThrow");

var _assertNewUploadAllowed = /*#__PURE__*/_classPrivateFieldLooseKey("assertNewUploadAllowed");

var _checkAndCreateFileStateObject = /*#__PURE__*/_classPrivateFieldLooseKey("checkAndCreateFileStateObject");

var _startIfAutoProceed = /*#__PURE__*/_classPrivateFieldLooseKey("startIfAutoProceed");

var _addListeners = /*#__PURE__*/_classPrivateFieldLooseKey("addListeners");

var _updateOnlineStatus = /*#__PURE__*/_classPrivateFieldLooseKey("updateOnlineStatus");

var _createUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createUpload");

var _getUpload = /*#__PURE__*/_classPrivateFieldLooseKey("getUpload");

var _removeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("removeUpload");

var _runUpload = /*#__PURE__*/_classPrivateFieldLooseKey("runUpload");

_Symbol$for = Symbol.for('uppy test: getPlugins');
_Symbol$for2 = Symbol.for('uppy test: createUpload');

class Uppy {
  // eslint-disable-next-line global-require

  /** @type {Record<string, BasePlugin[]>} */

  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  constructor(_opts) {
    Object.defineProperty(this, _runUpload, {
      value: _runUpload2
    });
    Object.defineProperty(this, _removeUpload, {
      value: _removeUpload2
    });
    Object.defineProperty(this, _getUpload, {
      value: _getUpload2
    });
    Object.defineProperty(this, _createUpload, {
      value: _createUpload2
    });
    Object.defineProperty(this, _addListeners, {
      value: _addListeners2
    });
    Object.defineProperty(this, _startIfAutoProceed, {
      value: _startIfAutoProceed2
    });
    Object.defineProperty(this, _checkAndCreateFileStateObject, {
      value: _checkAndCreateFileStateObject2
    });
    Object.defineProperty(this, _assertNewUploadAllowed, {
      value: _assertNewUploadAllowed2
    });
    Object.defineProperty(this, _showOrLogErrorAndThrow, {
      value: _showOrLogErrorAndThrow2
    });
    Object.defineProperty(this, _checkRequiredMetaFields, {
      value: _checkRequiredMetaFields2
    });
    Object.defineProperty(this, _checkMinNumberOfFiles, {
      value: _checkMinNumberOfFiles2
    });
    Object.defineProperty(this, _checkRestrictions, {
      value: _checkRestrictions2
    });
    Object.defineProperty(this, _plugins, {
      writable: true,
      value: Object.create(null)
    });
    Object.defineProperty(this, _storeUnsubscribe, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _preProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _uploaders, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _postProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _updateOnlineStatus, {
      writable: true,
      value: this.updateOnlineStatus.bind(this)
    });
    this.defaultLocale = {
      strings: {
        addBulkFilesFailed: {
          0: 'Failed to add %{smart_count} file due to an internal error',
          1: 'Failed to add %{smart_count} files due to internal errors'
        },
        youCanOnlyUploadX: {
          0: 'You can only upload %{smart_count} file',
          1: 'You can only upload %{smart_count} files'
        },
        youHaveToAtLeastSelectX: {
          0: 'You have to select at least %{smart_count} file',
          1: 'You have to select at least %{smart_count} files'
        },
        exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
        missingRequiredMetaField: 'Missing required meta fields',
        missingRequiredMetaFieldOnFile: 'Missing required meta fields in %{fileName}',
        inferiorSize: 'This file is smaller than the allowed size of %{size}',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        noMoreFilesAllowed: 'Cannot add more files',
        noDuplicates: 'Cannot add the duplicate file \'%{fileName}\', it already exists',
        companionError: 'Connection with Companion failed',
        authAborted: 'Authentication aborted',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        selectX: {
          0: 'Select %{smart_count}',
          1: 'Select %{smart_count}'
        },
        allFilesFromFolderNamed: 'All files from folder %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        signInWithGoogle: 'Sign in with Google',
        searchImages: 'Search for images',
        enterTextToSearch: 'Enter text to search for images',
        backToSearch: 'Back to Search',
        emptyFolderAdded: 'No files were added from empty folder',
        folderAlreadyAdded: 'The folder "%{folder}" was already added',
        folderAdded: {
          0: 'Added %{smart_count} file from %{folder}',
          1: 'Added %{smart_count} files from %{folder}'
        }
      }
    };
    const defaultOptions = {
      id: 'uppy',
      autoProceed: false,

      /**
       * @deprecated The method should not be used
       */
      allowMultipleUploads: true,
      allowMultipleUploadBatches: true,
      debug: false,
      restrictions: {
        maxFileSize: null,
        minFileSize: null,
        maxTotalFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: null,
        requiredMetaFields: []
      },
      meta: {},
      onBeforeFileAdded: currentFile => currentFile,
      onBeforeUpload: files => files,
      store: DefaultStore(),
      logger: justErrorsLogger,
      infoTimeout: 5000
    }; // Merge default options with the ones set by user,
    // making sure to merge restrictions too

    this.opts = { ...defaultOptions,
      ..._opts,
      restrictions: { ...defaultOptions.restrictions,
        ...(_opts && _opts.restrictions)
      }
    }; // Support debug: true for backwards-compatability, unless logger is set in opts
    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

    if (_opts && _opts.logger && _opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (_opts && _opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log(`Using Core v${this.constructor.VERSION}`);

    if (this.opts.restrictions.allowedFileTypes && this.opts.restrictions.allowedFileTypes !== null && !Array.isArray(this.opts.restrictions.allowedFileTypes)) {
      throw new TypeError('`restrictions.allowedFileTypes` must be an array');
    }

    this.i18nInit(); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well
    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this.calculateProgress = throttle(this.calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: { ...this.opts.meta
      },
      info: [],
      recoveredState: null
    });
    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe] = this.store.subscribe((prevState, nextState, patch) => {
      this.emit('state-update', prevState, nextState, patch);
      this.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    _classPrivateFieldLooseBase(this, _addListeners)[_addListeners]();
  }

  emit(event, ...args) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(event, ...args);
  }

  on(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, callback);

    return this;
  }

  once(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(event, callback);

    return this;
  }

  off(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, callback);

    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */


  updateAll(state) {
    this.iteratePlugins(plugin => {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */


  setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */


  getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   *
   * @deprecated
   */


  get state() {
    // Here, state is a non-enumerable property.
    return this.getState();
  }
  /**
   * Shorthand to set state for a specific file.
   */


  setFileState(fileID, state) {
    if (!this.getState().files[fileID]) {
      throw new Error(`Can’t set state for ${fileID} (the file could have been removed)`);
    }

    this.setState({
      files: { ...this.getState().files,
        [fileID]: { ...this.getState().files[fileID],
          ...state
        }
      }
    });
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.locale = translator.locale;
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts,
      restrictions: { ...this.opts.restrictions,
        ...(newOpts && newOpts.restrictions)
      }
    };

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(plugin => {
        plugin.setOptions();
      });
    } // Note: this is not the preact `setState`, it's an internal function that has the same name.


    this.setState(); // so that UI re-renders with new options
  }

  resetProgress() {
    const defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };
    const files = { ...this.getState().files
    };
    const updatedFiles = {};
    Object.keys(files).forEach(fileID => {
      const updatedFile = { ...files[fileID]
      };
      updatedFile.progress = { ...updatedFile.progress,
        ...defaultProgress
      };
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });
    this.emit('reset-progress');
  }

  addPreProcessor(fn) {
    _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].add(fn);
  }

  removePreProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].delete(fn);
  }

  addPostProcessor(fn) {
    _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].add(fn);
  }

  removePostProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].delete(fn);
  }

  addUploader(fn) {
    _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].add(fn);
  }

  removeUploader(fn) {
    return _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].delete(fn);
  }

  setMeta(data) {
    const updatedMeta = { ...this.getState().meta,
      ...data
    };
    const updatedFiles = { ...this.getState().files
    };
    Object.keys(updatedFiles).forEach(fileID => {
      updatedFiles[fileID] = { ...updatedFiles[fileID],
        meta: { ...updatedFiles[fileID].meta,
          ...data
        }
      };
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  }

  setFileMeta(fileID, data) {
    const updatedFiles = { ...this.getState().files
    };

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    const newMeta = { ...updatedFiles[fileID].meta,
      ...data
    };
    updatedFiles[fileID] = { ...updatedFiles[fileID],
      meta: newMeta
    };
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */


  getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */


  getFiles() {
    const {
      files
    } = this.getState();
    return Object.values(files);
  }

  getObjectOfFilesPerState() {
    const {
      files: filesObject,
      totalProgress,
      error
    } = this.getState();
    const files = Object.values(filesObject);
    const inProgressFiles = files.filter(({
      progress
    }) => !progress.uploadComplete && progress.uploadStarted);
    const newFiles = files.filter(file => !file.progress.uploadStarted);
    const startedFiles = files.filter(file => file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess);
    const uploadStartedFiles = files.filter(file => file.progress.uploadStarted);
    const pausedFiles = files.filter(file => file.isPaused);
    const completeFiles = files.filter(file => file.progress.uploadComplete);
    const erroredFiles = files.filter(file => file.error);
    const inProgressNotPausedFiles = inProgressFiles.filter(file => !file.isPaused);
    const processingFiles = files.filter(file => file.progress.preprocess || file.progress.postprocess);
    return {
      newFiles,
      startedFiles,
      uploadStartedFiles,
      pausedFiles,
      completeFiles,
      erroredFiles,
      inProgressFiles,
      inProgressNotPausedFiles,
      processingFiles,
      isUploadStarted: uploadStartedFiles.length > 0,
      isAllComplete: totalProgress === 100 && completeFiles.length === files.length && processingFiles.length === 0,
      isAllErrored: !!error && erroredFiles.length === files.length,
      isAllPaused: inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length,
      isUploadInProgress: inProgressFiles.length > 0,
      isSomeGhost: files.some(file => file.isGhost)
    };
  }
  /**
   * A public wrapper for _checkRestrictions — checks if a file passes a set of restrictions.
   * For use in UI pluigins (like Providers), to disallow selecting files that won’t pass restrictions.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @returns {object} { result: true/false, reason: why file didn’t pass restrictions }
   */


  validateRestrictions(file, files) {
    try {
      _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](file, files);

      return {
        result: true
      };
    } catch (err) {
      return {
        result: false,
        reason: err.message
      };
    }
  }
  /**
   * Check if file passes a set of restrictions set in options: maxFileSize, minFileSize,
   * maxNumberOfFiles and allowedFileTypes.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @private
   */


  checkIfFileAlreadyExists(fileID) {
    const {
      files
    } = this.getState();

    if (files[fileID] && !files[fileID].isGhost) {
      return true;
    }

    return false;
  }
  /**
   * Create a file state object based on user-provided `addFile()` options.
   *
   * Note this is extremely side-effectful and should only be done when a file state object
   * will be added to state immediately afterward!
   *
   * The `files` value is passed in because it may be updated by the caller without updating the store.
   */


  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  addFile(file) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](file);

    const {
      files
    } = this.getState();

    let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, file); // Users are asked to re-select recovered files without data,
    // and to keep the progress, meta and everthing else, we only replace said data


    if (files[newFile.id] && files[newFile.id].isGhost) {
      newFile = { ...files[newFile.id],
        data: file.data,
        isGhost: false
      };
      this.log(`Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`);
    }

    this.setState({
      files: { ...files,
        [newFile.id]: newFile
      }
    });
    this.emit('file-added', newFile);
    this.emit('files-added', [newFile]);
    this.log(`Added file: ${newFile.name}, ${newFile.id}, mime type: ${newFile.type}`);

    _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();

    return newFile.id;
  }
  /**
   * Add multiple files to `state.files`. See the `addFile()` documentation.
   *
   * If an error occurs while adding a file, it is logged and the user is notified.
   * This is good for UI plugins, but not for programmatic use.
   * Programmatic users should usually still use `addFile()` on individual files.
   */


  addFiles(fileDescriptors) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](); // create a copy of the files object only once


    const files = { ...this.getState().files
    };
    const newFiles = [];
    const errors = [];

    for (let i = 0; i < fileDescriptors.length; i++) {
      try {
        let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, fileDescriptors[i]); // Users are asked to re-select recovered files without data,
        // and to keep the progress, meta and everthing else, we only replace said data


        if (files[newFile.id] && files[newFile.id].isGhost) {
          newFile = { ...files[newFile.id],
            data: fileDescriptors[i].data,
            isGhost: false
          };
          this.log(`Replaced blob in a ghost file: ${newFile.name}, ${newFile.id}`);
        }

        files[newFile.id] = newFile;
        newFiles.push(newFile);
      } catch (err) {
        if (!err.isRestriction) {
          errors.push(err);
        }
      }
    }

    this.setState({
      files
    });
    newFiles.forEach(newFile => {
      this.emit('file-added', newFile);
    });
    this.emit('files-added', newFiles);

    if (newFiles.length > 5) {
      this.log(`Added batch of ${newFiles.length} files`);
    } else {
      Object.keys(newFiles).forEach(fileID => {
        this.log(`Added file: ${newFiles[fileID].name}\n id: ${newFiles[fileID].id}\n type: ${newFiles[fileID].type}`);
      });
    }

    if (newFiles.length > 0) {
      _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();
    }

    if (errors.length > 0) {
      let message = 'Multiple errors occurred while adding files:\n';
      errors.forEach(subError => {
        message += `\n * ${subError.message}`;
      });
      this.info({
        message: this.i18n('addBulkFilesFailed', {
          smart_count: errors.length
        }),
        details: message
      }, 'error', this.opts.infoTimeout);

      if (typeof AggregateError === 'function') {
        throw new AggregateError(errors, message);
      } else {
        const err = new Error(message);
        err.errors = errors;
        throw err;
      }
    }
  }

  removeFiles(fileIDs, reason) {
    const {
      files,
      currentUploads
    } = this.getState();
    const updatedFiles = { ...files
    };
    const updatedUploads = { ...currentUploads
    };
    const removedFiles = Object.create(null);
    fileIDs.forEach(fileID => {
      if (files[fileID]) {
        removedFiles[fileID] = files[fileID];
        delete updatedFiles[fileID];
      }
    }); // Remove files from the `fileIDs` list in each upload.

    function fileIsNotRemoved(uploadFileID) {
      return removedFiles[uploadFileID] === undefined;
    }

    Object.keys(updatedUploads).forEach(uploadID => {
      const newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        delete updatedUploads[uploadID];
        return;
      }

      updatedUploads[uploadID] = { ...currentUploads[uploadID],
        fileIDs: newFileIDs
      };
    });
    const stateUpdate = {
      currentUploads: updatedUploads,
      files: updatedFiles
    }; // If all files were removed - allow new uploads,
    // and clear recoveredState

    if (Object.keys(updatedFiles).length === 0) {
      stateUpdate.allowNewUpload = true;
      stateUpdate.error = null;
      stateUpdate.recoveredState = null;
    }

    this.setState(stateUpdate);
    this.calculateTotalProgress();
    const removedFileIDs = Object.keys(removedFiles);
    removedFileIDs.forEach(fileID => {
      this.emit('file-removed', removedFiles[fileID], reason);
    });

    if (removedFileIDs.length > 5) {
      this.log(`Removed ${removedFileIDs.length} files`);
    } else {
      this.log(`Removed files: ${removedFileIDs.join(', ')}`);
    }
  }

  removeFile(fileID, reason = null) {
    this.removeFiles([fileID], reason);
  }

  pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return undefined;
    }

    const wasPaused = this.getFile(fileID).isPaused || false;
    const isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  }

  pauseAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: true
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  }

  resumeAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  }

  retryAll() {
    const updatedFiles = { ...this.getState().files
    };
    const filesToRetry = Object.keys(updatedFiles).filter(file => {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    if (filesToRetry.length === 0) {
      return Promise.resolve({
        successful: [],
        failed: []
      });
    }

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](filesToRetry, {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  cancelAll() {
    this.emit('cancel-all');
    const {
      files
    } = this.getState();
    const fileIDs = Object.keys(files);

    if (fileIDs.length) {
      this.removeFiles(fileIDs, 'cancel-all');
    }

    this.setState({
      totalProgress: 0,
      error: null,
      recoveredState: null
    });
  }

  retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload]([fileID], {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  reset() {
    this.cancelAll();
  }

  logout() {
    this.iteratePlugins(plugin => {
      if (plugin.provider && plugin.provider.logout) {
        plugin.provider.logout();
      }
    });
  }

  calculateProgress(file, data) {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    const canHavePercentage = Number.isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      }
    });
    this.calculateTotalProgress();
  }

  calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    const files = this.getFiles();
    const inProgress = files.filter(file => {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    const sizedFiles = inProgress.filter(file => file.progress.bytesTotal != null);
    const unsizedFiles = inProgress.filter(file => file.progress.bytesTotal == null);

    if (sizedFiles.length === 0) {
      const progressMax = inProgress.length * 100;
      const currentProgress = unsizedFiles.reduce((acc, file) => {
        return acc + file.progress.percentage;
      }, 0);
      const totalProgress = Math.round(currentProgress / progressMax * 100);
      this.setState({
        totalProgress
      });
      return;
    }

    let totalSize = sizedFiles.reduce((acc, file) => {
      return acc + file.progress.bytesTotal;
    }, 0);
    const averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    let uploadedSize = 0;
    sizedFiles.forEach(file => {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(file => {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    let totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */


  updateOnlineStatus() {
    const online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  }

  getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  // eslint-disable-next-line no-shadow


  use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      const msg = `Expected a plugin class, but got ${Plugin === null ? 'null' : typeof Plugin}.` + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    const plugin = new Plugin(this, opts);
    const pluginId = plugin.id;

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    const existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      const msg = `Already found a plugin named '${existsPluginAlready.id}'. ` + `Tried to use: '${pluginId}'.\n` + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';
      throw new Error(msg);
    }

    if (Plugin.VERSION) {
      this.log(`Using ${pluginId} v${Plugin.VERSION}`);
    }

    if (plugin.type in _classPrivateFieldLooseBase(this, _plugins)[_plugins]) {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type].push(plugin);
    } else {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type] = [plugin];
    }

    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {BasePlugin|undefined}
   */


  getPlugin(id) {
    for (const plugins of Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins])) {
      const foundPlugin = plugins.find(plugin => plugin.id === id);
      if (foundPlugin != null) return foundPlugin;
    }

    return undefined;
  }

  [_Symbol$for](type) {
    return _classPrivateFieldLooseBase(this, _plugins)[_plugins][type];
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */


  iteratePlugins(method) {
    Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins]).flat(1).forEach(method);
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */


  removePlugin(instance) {
    this.log(`Removing plugin ${instance.id}`);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    const list = _classPrivateFieldLooseBase(this, _plugins)[_plugins][instance.type]; // list.indexOf failed here, because Vue3 converted the plugin instance
    // to a Proxy object, which failed the strict comparison test:
    // obj !== objProxy


    const index = list.findIndex(item => item.id === instance.id);

    if (index !== -1) {
      list.splice(index, 1);
    }

    const state = this.getState();
    const updatedState = {
      plugins: { ...state.plugins,
        [instance.id]: undefined
      }
    };
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */


  close() {
    this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`);
    this.reset();

    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe]();

    this.iteratePlugins(plugin => {
      this.removePlugin(plugin);
    });

    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
      window.removeEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    }
  }

  hideInfo() {
    const {
      info
    } = this.getState();
    this.setState({
      info: info.slice(1)
    });
    this.emit('info-hidden');
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */


  info(message, type = 'info', duration = 3000) {
    const isComplexMessage = typeof message === 'object';
    this.setState({
      info: [...this.getState().info, {
        type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }]
    });
    setTimeout(() => this.hideInfo(), duration);
    this.emit('info-visible');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */


  log(message, type) {
    const {
      logger
    } = this.opts;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Restore an upload by its ID.
   */


  restore(uploadID) {
    this.log(`Core: attempting to restore upload "${uploadID}"`);

    if (!this.getState().currentUploads[uploadID]) {
      _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */


  [_Symbol$for2](...args) {
    return _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](...args);
  }

  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  addResultData(uploadID, data) {
    if (!_classPrivateFieldLooseBase(this, _getUpload)[_getUpload](uploadID)) {
      this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
      return;
    }

    const {
      currentUploads
    } = this.getState();
    const currentUpload = { ...currentUploads[uploadID],
      result: { ...currentUploads[uploadID].result,
        ...data
      }
    };
    this.setState({
      currentUploads: { ...currentUploads,
        [uploadID]: currentUpload
      }
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */


  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  upload() {
    var _classPrivateFieldLoo;

    if (!((_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _plugins)[_plugins].uploader) != null && _classPrivateFieldLoo.length)) {
      this.log('No uploader type plugins are used', 'warning');
    }

    let {
      files
    } = this.getState();
    const onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
      // and then fetch the actual file object from state

      this.setState({
        files
      });
    }

    return Promise.resolve().then(() => {
      _classPrivateFieldLooseBase(this, _checkMinNumberOfFiles)[_checkMinNumberOfFiles](files);

      _classPrivateFieldLooseBase(this, _checkRequiredMetaFields)[_checkRequiredMetaFields](files);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err);
    }).then(() => {
      const {
        currentUploads
      } = this.getState(); // get a list of files that are currently assigned to uploads

      const currentlyUploadingFiles = Object.values(currentUploads).flatMap(curr => curr.fileIDs);
      const waitingFileIDs = [];
      Object.keys(files).forEach(fileID => {
        const file = this.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..

        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](waitingFileIDs);

      return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
        showInformer: false
      });
    });
  }

}

function _checkRestrictions2(file, files = this.getFiles()) {
  const {
    maxFileSize,
    minFileSize,
    maxTotalFileSize,
    maxNumberOfFiles,
    allowedFileTypes
  } = this.opts.restrictions;

  if (maxNumberOfFiles) {
    if (files.length + 1 > maxNumberOfFiles) {
      throw new RestrictionError(`${this.i18n('youCanOnlyUploadX', {
        smart_count: maxNumberOfFiles
      })}`);
    }
  }

  if (allowedFileTypes) {
    const isCorrectFileType = allowedFileTypes.some(type => {
      // check if this is a mime-type
      if (type.indexOf('/') > -1) {
        if (!file.type) return false;
        return match(file.type.replace(/;.*?$/, ''), type);
      } // otherwise this is likely an extension


      if (type[0] === '.' && file.extension) {
        return file.extension.toLowerCase() === type.substr(1).toLowerCase();
      }

      return false;
    });

    if (!isCorrectFileType) {
      const allowedFileTypesString = allowedFileTypes.join(', ');
      throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
        types: allowedFileTypesString
      }));
    }
  } // We can't check maxTotalFileSize if the size is unknown.


  if (maxTotalFileSize && file.size != null) {
    let totalFilesSize = 0;
    totalFilesSize += file.size;
    files.forEach(f => {
      totalFilesSize += f.size;
    });

    if (totalFilesSize > maxTotalFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxTotalFileSize),
        file: file.name
      }));
    }
  } // We can't check maxFileSize if the size is unknown.


  if (maxFileSize && file.size != null) {
    if (file.size > maxFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxFileSize),
        file: file.name
      }));
    }
  } // We can't check minFileSize if the size is unknown.


  if (minFileSize && file.size != null) {
    if (file.size < minFileSize) {
      throw new RestrictionError(this.i18n('inferiorSize', {
        size: prettierBytes(minFileSize)
      }));
    }
  }
}

function _checkMinNumberOfFiles2(files) {
  const {
    minNumberOfFiles
  } = this.opts.restrictions;

  if (Object.keys(files).length < minNumberOfFiles) {
    throw new RestrictionError(`${this.i18n('youHaveToAtLeastSelectX', {
      smart_count: minNumberOfFiles
    })}`);
  }
}

function _checkRequiredMetaFields2(files) {
  const {
    requiredMetaFields
  } = this.opts.restrictions;
  const {
    hasOwnProperty
  } = Object.prototype;
  const errors = [];

  for (const fileID of Object.keys(files)) {
    const file = this.getFile(fileID);

    for (let i = 0; i < requiredMetaFields.length; i++) {
      if (!hasOwnProperty.call(file.meta, requiredMetaFields[i]) || file.meta[requiredMetaFields[i]] === '') {
        const err = new RestrictionError(`${this.i18n('missingRequiredMetaFieldOnFile', {
          fileName: file.name
        })}`);
        errors.push(err);

        _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
          file,
          showInformer: false,
          throwErr: false
        });
      }
    }
  }

  if (errors.length) {
    throw new AggregateRestrictionError(`${this.i18n('missingRequiredMetaField')}`, errors);
  }
}

function _showOrLogErrorAndThrow2(err, {
  showInformer = true,
  file = null,
  throwErr = true
} = {}) {
  const message = typeof err === 'object' ? err.message : err;
  const details = typeof err === 'object' && err.details ? err.details : ''; // Restriction errors should be logged, but not as errors,
  // as they are expected and shown in the UI.

  let logMessageWithDetails = message;

  if (details) {
    logMessageWithDetails += ` ${details}`;
  }

  if (err.isRestriction) {
    this.log(logMessageWithDetails);
    this.emit('restriction-failed', file, err);
  } else {
    this.log(logMessageWithDetails, 'error');
  } // Sometimes informer has to be shown manually by the developer,
  // for example, in `onBeforeFileAdded`.


  if (showInformer) {
    this.info({
      message,
      details
    }, 'error', this.opts.infoTimeout);
  }

  if (throwErr) {
    throw typeof err === 'object' ? err : new Error(err);
  }
}

function _assertNewUploadAllowed2(file) {
  const {
    allowNewUpload
  } = this.getState();

  if (allowNewUpload === false) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError(this.i18n('noMoreFilesAllowed')), {
      file
    });
  }
}

function _checkAndCreateFileStateObject2(files, fileDescriptor) {
  const fileType = getFileType(fileDescriptor);
  const fileName = getFileName(fileType, fileDescriptor);
  const fileExtension = getFileNameAndExtension(fileName).extension;
  const isRemote = Boolean(fileDescriptor.isRemote);
  const fileID = generateFileID({ ...fileDescriptor,
    type: fileType
  });

  if (this.checkIfFileAlreadyExists(fileID)) {
    const error = new RestrictionError(this.i18n('noDuplicates', {
      fileName
    }));

    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
      file: fileDescriptor
    });
  }

  const meta = fileDescriptor.meta || {};
  meta.name = fileName;
  meta.type = fileType; // `null` means the size is unknown.

  const size = Number.isFinite(fileDescriptor.data.size) ? fileDescriptor.data.size : null;
  let newFile = {
    source: fileDescriptor.source || '',
    id: fileID,
    name: fileName,
    extension: fileExtension || '',
    meta: { ...this.getState().meta,
      ...meta
    },
    type: fileType,
    data: fileDescriptor.data,
    progress: {
      percentage: 0,
      bytesUploaded: 0,
      bytesTotal: size,
      uploadComplete: false,
      uploadStarted: null
    },
    size,
    isRemote,
    remote: fileDescriptor.remote || '',
    preview: fileDescriptor.preview
  };
  const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(newFile, files);

  if (onBeforeFileAddedResult === false) {
    // Don’t show UI info for this error, as it should be done by the developer
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.'), {
      showInformer: false,
      fileDescriptor
    });
  } else if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult !== null) {
    newFile = onBeforeFileAddedResult;
  }

  try {
    const filesArray = Object.keys(files).map(i => files[i]);

    _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](newFile, filesArray);
  } catch (err) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
      file: newFile
    });
  }

  return newFile;
}

function _startIfAutoProceed2() {
  if (this.opts.autoProceed && !this.scheduledAutoProceed) {
    this.scheduledAutoProceed = setTimeout(() => {
      this.scheduledAutoProceed = null;
      this.upload().catch(err => {
        if (!err.isRestriction) {
          this.log(err.stack || err.message || err);
        }
      });
    }, 4);
  }
}

function _addListeners2() {
  /**
   * @param {Error} error
   * @param {object} [file]
   * @param {object} [response]
   */
  const errorHandler = (error, file, response) => {
    let errorMsg = error.message || 'Unknown error';

    if (error.details) {
      errorMsg += ` ${error.details}`;
    }

    this.setState({
      error: errorMsg
    });

    if (file != null && file.id in this.getState().files) {
      this.setFileState(file.id, {
        error: errorMsg,
        response
      });
    }
  };

  this.on('error', errorHandler);
  this.on('upload-error', (file, error, response) => {
    errorHandler(error, file, response);

    if (typeof error === 'object' && error.message) {
      const newError = new Error(error.message);
      newError.details = error.message;

      if (error.details) {
        newError.details += ` ${error.details}`;
      }

      newError.message = this.i18n('failedToUpload', {
        file: file.name
      });

      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](newError, {
        throwErr: false
      });
    } else {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
        throwErr: false
      });
    }
  });
  this.on('upload', () => {
    this.setState({
      error: null
    });
  });
  this.on('upload-started', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: {
        uploadStarted: Date.now(),
        uploadComplete: false,
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: file.size
      }
    });
  });
  this.on('upload-progress', this.calculateProgress);
  this.on('upload-success', (file, uploadResp) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const currentProgress = this.getFile(file.id).progress;
    this.setFileState(file.id, {
      progress: { ...currentProgress,
        postprocess: _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].size > 0 ? {
          mode: 'indeterminate'
        } : null,
        uploadComplete: true,
        percentage: 100,
        bytesUploaded: currentProgress.bytesTotal
      },
      response: uploadResp,
      uploadURL: uploadResp.uploadURL,
      isPaused: false
    }); // Remote providers sometimes don't tell us the file size,
    // but we can know how many bytes we uploaded once the upload is complete.

    if (file.size == null) {
      this.setFileState(file.id, {
        size: uploadResp.bytesUploaded || currentProgress.bytesTotal
      });
    }

    this.calculateTotalProgress();
  });
  this.on('preprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        preprocess: progress
      }
    });
  });
  this.on('preprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.preprocess;
    this.setState({
      files
    });
  });
  this.on('postprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getState().files[file.id].progress,
        postprocess: progress
      }
    });
  });
  this.on('postprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.postprocess;
    this.setState({
      files
    });
  });
  this.on('restored', () => {
    // Files may have changed--ensure progress is still accurate.
    this.calculateTotalProgress();
  }); // show informer if offline

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    window.addEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    setTimeout(_classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus], 3000);
  }
}

function _createUpload2(fileIDs, opts = {}) {
  // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
  const {
    forceAllowNewUpload = false
  } = opts;
  const {
    allowNewUpload,
    currentUploads
  } = this.getState();

  if (!allowNewUpload && !forceAllowNewUpload) {
    throw new Error('Cannot create a new upload: already uploading.');
  }

  const uploadID = nanoid();
  this.emit('upload', {
    id: uploadID,
    fileIDs
  });
  this.setState({
    allowNewUpload: this.opts.allowMultipleUploadBatches !== false && this.opts.allowMultipleUploads !== false,
    currentUploads: { ...currentUploads,
      [uploadID]: {
        fileIDs,
        step: 0,
        result: {}
      }
    }
  });
  return uploadID;
}

function _getUpload2(uploadID) {
  const {
    currentUploads
  } = this.getState();
  return currentUploads[uploadID];
}

function _removeUpload2(uploadID) {
  const currentUploads = { ...this.getState().currentUploads
  };
  delete currentUploads[uploadID];
  this.setState({
    currentUploads
  });
}

async function _runUpload2(uploadID) {
  let {
    currentUploads
  } = this.getState();
  let currentUpload = currentUploads[uploadID];
  const restoreStep = currentUpload.step || 0;
  const steps = [..._classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors], ..._classPrivateFieldLooseBase(this, _uploaders)[_uploaders], ..._classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors]];

  try {
    for (let step = restoreStep; step < steps.length; step++) {
      if (!currentUpload) {
        break;
      }

      const fn = steps[step];
      const updatedUpload = { ...currentUpload,
        step
      };
      this.setState({
        currentUploads: { ...currentUploads,
          [uploadID]: updatedUpload
        }
      }); // TODO give this the `updatedUpload` object as its only parameter maybe?
      // Otherwise when more metadata may be added to the upload this would keep getting more parameters

      await fn(updatedUpload.fileIDs, uploadID); // Update currentUpload value in case it was modified asynchronously.

      currentUploads = this.getState().currentUploads;
      currentUpload = currentUploads[uploadID];
    }
  } catch (err) {
    this.emit('error', err);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

    throw err;
  } // Set result data.


  if (currentUpload) {
    // Mark postprocessing step as complete if necessary; this addresses a case where we might get
    // stuck in the postprocessing UI while the upload is fully complete.
    // If the postprocessing steps do not do any work, they may not emit postprocessing events at
    // all, and never mark the postprocessing as complete. This is fine on its own but we
    // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
    // state if any postprocessors are registered. That is to avoid a "flash of completed state"
    // before the postprocessing plugins can emit events.
    //
    // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
    // postprocessing completion, we do it instead.
    currentUpload.fileIDs.forEach(fileID => {
      const file = this.getFile(fileID);

      if (file && file.progress.postprocess) {
        this.emit('postprocess-complete', file);
      }
    });
    const files = currentUpload.fileIDs.map(fileID => this.getFile(fileID));
    const successful = files.filter(file => !file.error);
    const failed = files.filter(file => file.error);
    await this.addResultData(uploadID, {
      successful,
      failed,
      uploadID
    }); // Update currentUpload value in case it was modified asynchronously.

    currentUploads = this.getState().currentUploads;
    currentUpload = currentUploads[uploadID];
  } // Emit completion events.
  // This is in a separate function so that the `currentUploads` variable
  // always refers to the latest state. In the handler right above it refers
  // to an outdated object without the `.result` property.


  let result;

  if (currentUpload) {
    result = currentUpload.result;
    this.emit('complete', result);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);
  }

  if (result == null) {
    this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
  }

  return result;
}

Uppy.VERSION = "2.0.3";
module.exports = Uppy;

},{"./../../store-default":44,"./../../utils/lib/Translator":50,"./../../utils/lib/generateFileID":54,"./../../utils/lib/getFileNameAndExtension":60,"./../../utils/lib/getFileType":61,"./getFileName":38,"./loggers":40,"./supportsUploadProgress":41,"@transloadit/prettier-bytes":1,"lodash.throttle":3,"mime-match":4,"namespace-emitter":5,"nanoid":33}],38:[function(require,module,exports){
"use strict";

module.exports = function getFileName(fileType, fileDescriptor) {
  if (fileDescriptor.name) {
    return fileDescriptor.name;
  }

  if (fileType.split('/')[0] === 'image') {
    return `${fileType.split('/')[0]}.${fileType.split('/')[1]}`;
  }

  return 'noname';
};

},{}],39:[function(require,module,exports){
'use strict';

const Uppy = require('./Uppy');

const UIPlugin = require('./UIPlugin');

const BasePlugin = require('./BasePlugin');

const {
  debugLogger
} = require('./loggers');

module.exports = Uppy;
module.exports.Uppy = Uppy;
module.exports.UIPlugin = UIPlugin;
module.exports.BasePlugin = BasePlugin;
module.exports.debugLogger = debugLogger;

},{"./BasePlugin":35,"./UIPlugin":36,"./Uppy":37,"./loggers":40}],40:[function(require,module,exports){
"use strict";

/* eslint-disable no-console */
const getTimeStamp = require('./../../utils/lib/getTimeStamp'); // Swallow all logs, except errors.
// default if logger is not set or debug: false


const justErrorsLogger = {
  debug: () => {},
  warn: () => {},
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

const debugLogger = {
  debug: (...args) => console.debug(`[Uppy] [${getTimeStamp()}]`, ...args),
  warn: (...args) => console.warn(`[Uppy] [${getTimeStamp()}]`, ...args),
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
};
module.exports = {
  justErrorsLogger,
  debugLogger
};

},{"./../../utils/lib/getTimeStamp":63}],41:[function(require,module,exports){
"use strict";

// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  const edgeVersion = m[1];
  let [major, minor] = edgeVersion.split('.');
  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};

},{}],42:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const toArray = require('./../../utils/lib/toArray');

const isDragDropSupported = require('./../../utils/lib/isDragDropSupported');

const getDroppedFiles = require('./../../utils/lib/getDroppedFiles');

const {
  h
} = require('preact');
/**
 * Drag & Drop plugin
 *
 */


module.exports = (_temp = _class = class DragDrop extends UIPlugin {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    super(uppy, opts);
    this.type = 'acquirer';
    this.id = this.opts.id || 'DragDrop';
    this.title = 'Drag & Drop';
    this.defaultLocale = {
      strings: {
        dropHereOr: 'Drop files here or %{browse}',
        browse: 'browse'
      }
    }; // Default options

    const defaultOpts = {
      target: null,
      inputName: 'files[]',
      width: '100%',
      height: '100%',
      note: null
    }; // Merge default options with the ones set by user

    this.opts = { ...defaultOpts,
      ...opts
    };
    this.i18nInit(); // Check for browser dragDrop support

    this.isDragDropSupported = isDragDropSupported();
    this.removeDragOverClassTimeout = null; // Bind `this` to class methods

    this.onInputChange = this.onInputChange.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.addFiles = this.addFiles.bind(this);
    this.render = this.render.bind(this);
  }

  addFiles(files) {
    const descriptors = files.map(file => ({
      source: this.id,
      name: file.name,
      type: file.type,
      data: file,
      meta: {
        // path of the file relative to the ancestor directory the user selected.
        // e.g. 'docs/Old Prague/airbnb.pdf'
        relativePath: file.relativePath || null
      }
    }));

    try {
      this.uppy.addFiles(descriptors);
    } catch (err) {
      this.uppy.log(err);
    }
  }

  onInputChange(event) {
    this.uppy.log('[DragDrop] Files selected through input');
    const files = toArray(event.target.files);
    this.addFiles(files); // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).
    // eslint-disable-next-line no-param-reassign

    event.target.value = null;
  }

  handleDrop(event) {
    if (this.opts.onDrop) this.opts.onDrop(event);
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.removeDragOverClassTimeout); // 2. Remove dragover class

    this.setPluginState({
      isDraggingOver: false
    }); // 3. Add all dropped files

    this.uppy.log('[DragDrop] Files were dropped');

    const logDropError = error => {
      this.uppy.log(error, 'error');
    };

    getDroppedFiles(event.dataTransfer, {
      logDropError
    }).then(files => this.addFiles(files));
  }

  handleDragOver(event) {
    if (this.opts.onDragOver) this.opts.onDragOver(event);
    event.preventDefault();
    event.stopPropagation(); // 1. Add a small (+) icon on drop
    // (and prevent browsers from interpreting this as files being _moved_ into the browser
    // https://github.com/transloadit/uppy/issues/1978)
    //
    // eslint-disable-next-line no-param-reassign

    event.dataTransfer.dropEffect = 'copy';
    clearTimeout(this.removeDragOverClassTimeout);
    this.setPluginState({
      isDraggingOver: true
    });
  }

  handleDragLeave(event) {
    if (this.opts.onDragLeave) this.opts.onDragLeave(event);
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.removeDragOverClassTimeout); // Timeout against flickering, this solution is taken from drag-drop library.
    // Solution with 'pointer-events: none' didn't work across browsers.

    this.removeDragOverClassTimeout = setTimeout(() => {
      this.setPluginState({
        isDraggingOver: false
      });
    }, 50);
  }

  renderHiddenFileInput() {
    const {
      restrictions
    } = this.uppy.opts;
    return h("input", {
      className: "uppy-DragDrop-input",
      type: "file",
      hidden: true,
      ref: ref => {
        this.fileInputRef = ref;
      },
      name: this.opts.inputName,
      multiple: restrictions.maxNumberOfFiles !== 1,
      accept: restrictions.allowedFileTypes,
      onChange: this.onInputChange
    });
  }

  static renderArrowSvg() {
    return h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon uppy-DragDrop-arrow",
      width: "16",
      height: "16",
      viewBox: "0 0 16 16"
    }, h("path", {
      d: "M11 10V0H5v10H2l6 6 6-6h-3zm0 0",
      fillRule: "evenodd"
    }));
  }

  renderLabel() {
    return h("div", {
      className: "uppy-DragDrop-label"
    }, this.i18nArray('dropHereOr', {
      browse: h("span", {
        className: "uppy-DragDrop-browse"
      }, this.i18n('browse'))
    }));
  }

  renderNote() {
    return h("span", {
      className: "uppy-DragDrop-note"
    }, this.opts.note);
  }

  render() {
    const dragDropClass = `uppy-Root
      uppy-u-reset
      uppy-DragDrop-container
      ${this.isDragDropSupported ? 'uppy-DragDrop--isDragDropSupported' : ''}
      ${this.getPluginState().isDraggingOver ? 'uppy-DragDrop--isDraggingOver' : ''}
    `;
    const dragDropStyle = {
      width: this.opts.width,
      height: this.opts.height
    };
    return h("button", {
      type: "button",
      className: dragDropClass,
      style: dragDropStyle,
      onClick: () => this.fileInputRef.click(),
      onDragOver: this.handleDragOver,
      onDragLeave: this.handleDragLeave,
      onDrop: this.handleDrop
    }, this.renderHiddenFileInput(), h("div", {
      className: "uppy-DragDrop-inner"
    }, DragDrop.renderArrowSvg(), this.renderLabel(), this.renderNote()));
  }

  install() {
    const {
      target
    } = this.opts;
    this.setPluginState({
      isDraggingOver: false
    });

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.0.2", _temp);

},{"./../../core":39,"./../../utils/lib/getDroppedFiles":55,"./../../utils/lib/isDragDropSupported":66,"./../../utils/lib/toArray":70,"preact":6}],43:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const {
  h
} = require('preact');
/**
 * Progress bar
 *
 */


module.exports = (_temp = _class = class ProgressBar extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'ProgressBar';
    this.title = 'Progress Bar';
    this.type = 'progressindicator'; // set default options

    const defaultOptions = {
      target: 'body',
      fixed: false,
      hideAfterFinish: true
    }; // merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    };
    this.render = this.render.bind(this);
  }

  render(state) {
    const progress = state.totalProgress || 0; // before starting and after finish should be hidden if specified in the options

    const isHidden = (progress === 0 || progress === 100) && this.opts.hideAfterFinish;
    return h("div", {
      className: "uppy uppy-ProgressBar",
      style: {
        position: this.opts.fixed ? 'fixed' : 'initial'
      },
      "aria-hidden": isHidden
    }, h("div", {
      className: "uppy-ProgressBar-inner",
      style: {
        width: `${progress}%`
      }
    }), h("div", {
      className: "uppy-ProgressBar-percentage"
    }, progress));
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.0.2", _temp);

},{"./../../core":39,"preact":6}],44:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _publish = /*#__PURE__*/_classPrivateFieldLooseKey("publish");

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore {
  constructor() {
    Object.defineProperty(this, _publish, {
      value: _publish2
    });
    this.state = {};
    this.callbacks = [];
  }

  getState() {
    return this.state;
  }

  setState(patch) {
    const prevState = { ...this.state
    };
    const nextState = { ...this.state,
      ...patch
    };
    this.state = nextState;

    _classPrivateFieldLooseBase(this, _publish)[_publish](prevState, nextState, patch);
  }

  subscribe(listener) {
    this.callbacks.push(listener);
    return () => {
      // Remove the listener.
      this.callbacks.splice(this.callbacks.indexOf(listener), 1);
    };
  }

}

function _publish2(...args) {
  this.callbacks.forEach(listener => {
    listener(...args);
  });
}

DefaultStore.VERSION = "2.0.0";

module.exports = function defaultStore() {
  return new DefaultStore();
};

},{}],45:[function(require,module,exports){
"use strict";

const tus = require('tus-js-client');

function isCordova() {
  return typeof window !== 'undefined' && (typeof window.PhoneGap !== 'undefined' || typeof window.Cordova !== 'undefined' || typeof window.cordova !== 'undefined');
}

function isReactNative() {
  return typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
} // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
// now also includes `relativePath` for files added from folders.
// This means you can add 2 identical files, if one is in folder a,
// the other in folder b — `a/file.jpg` and `b/file.jpg`, when added
// together with a folder, will be treated as 2 separate files.
//
// For React Native and Cordova, we let tus-js-client’s default
// fingerprint handling take charge.


module.exports = function getFingerprint(uppyFileObj) {
  return (file, options) => {
    if (isCordova() || isReactNative()) {
      return tus.defaultOptions.fingerprint(file, options);
    }

    const uppyFingerprint = ['tus', uppyFileObj.id, options.endpoint].join('-');
    return Promise.resolve(uppyFingerprint);
  };
};

},{"tus-js-client":13}],46:[function(require,module,exports){
"use strict";

var _class, _temp;

const BasePlugin = require('./../../core/lib/BasePlugin');

const tus = require('tus-js-client');

const {
  Provider,
  RequestClient,
  Socket
} = require('./../../companion-client');

const emitSocketProgress = require('./../../utils/lib/emitSocketProgress');

const getSocketHost = require('./../../utils/lib/getSocketHost');

const settle = require('./../../utils/lib/settle');

const EventTracker = require('./../../utils/lib/EventTracker');

const NetworkError = require('./../../utils/lib/NetworkError');

const isNetworkError = require('./../../utils/lib/isNetworkError');

const {
  RateLimitedQueue
} = require('./../../utils/lib/RateLimitedQueue');

const hasProperty = require('./../../utils/lib/hasProperty');

const getFingerprint = require('./getFingerprint');
/** @typedef {import('..').TusOptions} TusOptions */

/** @typedef {import('tus-js-client').UploadOptions} RawTusOptions */

/** @typedef {import('@uppy/core').Uppy} Uppy */

/** @typedef {import('@uppy/core').UppyFile} UppyFile */

/** @typedef {import('@uppy/core').FailedUppyFile<{}>} FailedUppyFile */

/**
 * Extracted from https://github.com/tus/tus-js-client/blob/master/lib/upload.js#L13
 * excepted we removed 'fingerprint' key to avoid adding more dependencies
 *
 * @type {RawTusOptions}
 */


const tusDefaultOptions = {
  endpoint: '',
  uploadUrl: null,
  metadata: {},
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false
};
/**
 * Tus resumable file uploader
 */

module.exports = (_temp = _class = class Tus extends BasePlugin {
  /**
   * @param {Uppy} uppy
   * @param {TusOptions} opts
   */
  constructor(uppy, opts) {
    super(uppy, opts);
    this.type = 'uploader';
    this.id = this.opts.id || 'Tus';
    this.title = 'Tus'; // set default options

    const defaultOptions = {
      useFastRemoteRetry: true,
      limit: 5,
      retryDelays: [0, 1000, 3000, 5000],
      withCredentials: false
    }; // merge default options with the ones set by user

    /** @type {import("..").TusOptions} */

    this.opts = { ...defaultOptions,
      ...opts
    };

    if ('autoRetry' in opts) {
      throw new Error('The `autoRetry` option was deprecated and has been removed.');
    }
    /**
     * Simultaneous upload limiting is shared across all uploads with this plugin.
     *
     * @type {RateLimitedQueue}
     */


    this.requests = new RateLimitedQueue(this.opts.limit);
    this.uploaders = Object.create(null);
    this.uploaderEvents = Object.create(null);
    this.uploaderSockets = Object.create(null);
    this.handleResetProgress = this.handleResetProgress.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleResetProgress() {
    const files = { ...this.uppy.getState().files
    };
    Object.keys(files).forEach(fileID => {
      // Only clone the file object if it has a Tus `uploadUrl` attached.
      if (files[fileID].tus && files[fileID].tus.uploadUrl) {
        const tusState = { ...files[fileID].tus
        };
        delete tusState.uploadUrl;
        files[fileID] = { ...files[fileID],
          tus: tusState
        };
      }
    });
    this.uppy.setState({
      files
    });
  }
  /**
   * Clean up all references for a file's upload: the tus.Upload instance,
   * any events related to the file, and the Companion WebSocket connection.
   *
   * @param {string} fileID
   */


  resetUploaderReferences(fileID, opts = {}) {
    if (this.uploaders[fileID]) {
      const uploader = this.uploaders[fileID];
      uploader.abort();

      if (opts.abort) {
        uploader.abort(true);
      }

      this.uploaders[fileID] = null;
    }

    if (this.uploaderEvents[fileID]) {
      this.uploaderEvents[fileID].remove();
      this.uploaderEvents[fileID] = null;
    }

    if (this.uploaderSockets[fileID]) {
      this.uploaderSockets[fileID].close();
      this.uploaderSockets[fileID] = null;
    }
  }
  /**
   * Create a new Tus upload.
   *
   * A lot can happen during an upload, so this is quite hard to follow!
   * - First, the upload is started. If the file was already paused by the time the upload starts, nothing should happen.
   *   If the `limit` option is used, the upload must be queued onto the `this.requests` queue.
   *   When an upload starts, we store the tus.Upload instance, and an EventTracker instance that manages the event listeners
   *   for pausing, cancellation, removal, etc.
   * - While the upload is in progress, it may be paused or cancelled.
   *   Pausing aborts the underlying tus.Upload, and removes the upload from the `this.requests` queue. All other state is
   *   maintained.
   *   Cancelling removes the upload from the `this.requests` queue, and completely aborts the upload-- the `tus.Upload`
   *   instance is aborted and discarded, the EventTracker instance is destroyed (removing all listeners).
   *   Resuming the upload uses the `this.requests` queue as well, to prevent selectively pausing and resuming uploads from
   *   bypassing the limit.
   * - After completing an upload, the tus.Upload and EventTracker instances are cleaned up, and the upload is marked as done
   *   in the `this.requests` queue.
   * - When an upload completed with an error, the same happens as on successful completion, but the `upload()` promise is
   *   rejected.
   *
   * When working on this function, keep in mind:
   *  - When an upload is completed or cancelled for any reason, the tus.Upload and EventTracker instances need to be cleaned
   *    up using this.resetUploaderReferences().
   *  - When an upload is cancelled or paused, for any reason, it needs to be removed from the `this.requests` queue using
   *    `queuedRequest.abort()`.
   *  - When an upload is completed for any reason, including errors, it needs to be marked as such using
   *    `queuedRequest.done()`.
   *  - When an upload is started or resumed, it needs to go through the `this.requests` queue. The `queuedRequest` variable
   *    must be updated so the other uses of it are valid.
   *  - Before replacing the `queuedRequest` variable, the previous `queuedRequest` must be aborted, else it will keep taking
   *    up a spot in the queue.
   *
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */


  upload(file) {
    this.resetUploaderReferences(file.id); // Create a new tus upload

    return new Promise((resolve, reject) => {
      this.uppy.emit('upload-started', file);
      const opts = { ...this.opts,
        ...(file.tus || {})
      };

      if (typeof opts.headers === 'function') {
        opts.headers = opts.headers(file);
      }
      /** @type {RawTusOptions} */


      const uploadOptions = { ...tusDefaultOptions,
        ...opts
      }; // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
      // now also includes `relativePath` for files added from folders.
      // This means you can add 2 identical files, if one is in folder a,
      // the other in folder b.

      uploadOptions.fingerprint = getFingerprint(file);

      uploadOptions.onBeforeRequest = req => {
        const xhr = req.getUnderlyingObject();
        xhr.withCredentials = !!opts.withCredentials;

        if (typeof opts.onBeforeRequest === 'function') {
          opts.onBeforeRequest(req);
        }
      };

      uploadOptions.onError = err => {
        this.uppy.log(err);
        const xhr = err.originalRequest ? err.originalRequest.getUnderlyingObject() : null;

        if (isNetworkError(xhr)) {
          err = new NetworkError(err, xhr);
        }

        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        this.uppy.emit('upload-error', file, err);
        reject(err);
      };

      uploadOptions.onProgress = (bytesUploaded, bytesTotal) => {
        this.onReceiveUploadUrl(file, upload.url);
        this.uppy.emit('upload-progress', file, {
          uploader: this,
          bytesUploaded,
          bytesTotal
        });
      };

      uploadOptions.onSuccess = () => {
        const uploadResp = {
          uploadURL: upload.url
        };
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        this.uppy.emit('upload-success', file, uploadResp);

        if (upload.url) {
          this.uppy.log(`Download ${upload.file.name} from ${upload.url}`);
        }

        resolve(upload);
      };

      const copyProp = (obj, srcProp, destProp) => {
        if (hasProperty(obj, srcProp) && !hasProperty(obj, destProp)) {
          obj[destProp] = obj[srcProp];
        }
      };
      /** @type {Record<string, string>} */


      const meta = {};
      const metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
      : Object.keys(file.meta);
      metaFields.forEach(item => {
        meta[item] = file.meta[item];
      }); // tusd uses metadata fields 'filetype' and 'filename'

      copyProp(meta, 'type', 'filetype');
      copyProp(meta, 'name', 'filename');
      uploadOptions.metadata = meta;
      const upload = new tus.Upload(file.data, uploadOptions);
      this.uploaders[file.id] = upload;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      upload.findPreviousUploads().then(previousUploads => {
        const previousUpload = previousUploads[0];

        if (previousUpload) {
          this.uppy.log(`[Tus] Resuming upload of ${file.id} started at ${previousUpload.creationTime}`);
          upload.resumeFromPreviousUpload(previousUpload);
        }
      });
      let queuedRequest = this.requests.run(() => {
        if (!file.isPaused) {
          upload.start();
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return () => {};
      });
      this.onFileRemove(file.id, targetFileID => {
        queuedRequest.abort();
        this.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });
        resolve(`upload ${targetFileID} was removed`);
      });
      this.onPause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          upload.abort();
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            upload.start();
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        upload.abort();
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        this.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });
        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          upload.abort();
        }

        queuedRequest = this.requests.run(() => {
          upload.start();
          return () => {};
        });
      });
    }).catch(err => {
      this.uppy.emit('upload-error', file, err);
      throw err;
    });
  }
  /**
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */


  uploadRemote(file) {
    this.resetUploaderReferences(file.id);
    const opts = { ...this.opts
    };

    if (file.tus) {
      // Install file-specific upload overrides.
      Object.assign(opts, file.tus);
    }

    this.uppy.emit('upload-started', file);
    this.uppy.log(file.remote.url);

    if (file.serverToken) {
      return this.connectToServerSocket(file);
    }

    return new Promise((resolve, reject) => {
      const Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      const client = new Client(this.uppy, file.remote.providerOptions); // !! cancellation is NOT supported at this stage yet

      client.post(file.remote.url, { ...file.remote.body,
        endpoint: opts.endpoint,
        uploadUrl: opts.uploadUrl,
        protocol: 'tus',
        size: file.data.size,
        headers: opts.headers,
        metadata: file.meta
      }).then(res => {
        this.uppy.setFileState(file.id, {
          serverToken: res.token
        });
        file = this.uppy.getFile(file.id);
        return this.connectToServerSocket(file);
      }).then(() => {
        resolve();
      }).catch(err => {
        this.uppy.emit('upload-error', file, err);
        reject(err);
      });
    });
  }
  /**
   * See the comment on the upload() method.
   *
   * Additionally, when an upload is removed, completed, or cancelled, we need to close the WebSocket connection. This is
   * handled by the resetUploaderReferences() function, so the same guidelines apply as in upload().
   *
   * @param {UppyFile} file
   */


  connectToServerSocket(file) {
    return new Promise((resolve, reject) => {
      const token = file.serverToken;
      const host = getSocketHost(file.remote.companionUrl);
      const socket = new Socket({
        target: `${host}/api/${token}`,
        autoOpen: false
      });
      this.uploaderSockets[file.id] = socket;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      this.onFileRemove(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id);
        resolve(`upload ${file.id} was removed`);
      });
      this.onPause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          socket.send('pause', {});
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            socket.send('resume', {});
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        socket.send('pause', {});
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id);
        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          socket.send('pause', {});
        }

        queuedRequest = this.requests.run(() => {
          socket.send('resume', {});
          return () => {};
        });
      });
      this.onRetry(file.id, () => {
        // Only do the retry if the upload is actually in progress;
        // else we could try to send these messages when the upload is still queued.
        // We may need a better check for this since the socket may also be closed
        // for other reasons, like network failures.
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      this.onRetryAll(file.id, () => {
        // See the comment in the onRetry() call
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      socket.on('progress', progressData => emitSocketProgress(this, progressData, file));
      socket.on('error', errData => {
        const {
          message
        } = errData.error;
        const error = Object.assign(new Error(message), {
          cause: errData.error
        }); // If the remote retry optimisation should not be used,
        // close the socket—this will tell companion to clear state and delete the file.

        if (!this.opts.useFastRemoteRetry) {
          this.resetUploaderReferences(file.id); // Remove the serverToken so that a new one will be created for the retry.

          this.uppy.setFileState(file.id, {
            serverToken: null
          });
        } else {
          socket.close();
        }

        this.uppy.emit('upload-error', file, error);
        queuedRequest.done();
        reject(error);
      });
      socket.on('success', data => {
        const uploadResp = {
          uploadURL: data.url
        };
        this.uppy.emit('upload-success', file, uploadResp);
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        resolve();
      });
      let queuedRequest = this.requests.run(() => {
        socket.open();

        if (file.isPaused) {
          socket.send('pause', {});
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return () => {};
      });
    });
  }
  /**
   * Store the uploadUrl on the file options, so that when Golden Retriever
   * restores state, we will continue uploading to the correct URL.
   *
   * @param {UppyFile} file
   * @param {string} uploadURL
   */


  onReceiveUploadUrl(file, uploadURL) {
    const currentFile = this.uppy.getFile(file.id);
    if (!currentFile) return; // Only do the update if we didn't have an upload URL yet.

    if (!currentFile.tus || currentFile.tus.uploadUrl !== uploadURL) {
      this.uppy.log('[Tus] Storing upload url');
      this.uppy.setFileState(currentFile.id, {
        tus: { ...currentFile.tus,
          uploadUrl: uploadURL
        }
      });
    }
  }
  /**
   * @param {string} fileID
   * @param {function(string): void} cb
   */


  onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', file => {
      if (fileID === file.id) cb(file.id);
    });
  }
  /**
   * @param {string} fileID
   * @param {function(boolean): void} cb
   */


  onPause(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-pause', (targetFileID, isPaused) => {
      if (fileID === targetFileID) {
        // const isPaused = this.uppy.pauseResume(fileID)
        cb(isPaused);
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', targetFileID => {
      if (fileID === targetFileID) {
        cb();
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onRetryAll(fileID, cb) {
    this.uploaderEvents[fileID].on('retry-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onPauseAll(fileID, cb) {
    this.uploaderEvents[fileID].on('pause-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onCancelAll(fileID, cb) {
    this.uploaderEvents[fileID].on('cancel-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onResumeAll(fileID, cb) {
    this.uploaderEvents[fileID].on('resume-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {(UppyFile | FailedUppyFile)[]} files
   */


  uploadFiles(files) {
    const promises = files.map((file, i) => {
      const current = i + 1;
      const total = files.length;

      if ('error' in file && file.error) {
        return Promise.reject(new Error(file.error));
      }

      if (file.isRemote) {
        // We emit upload-started here, so that it's also emitted for files
        // that have to wait due to the `limit` option.
        // Don't double-emit upload-started for Golden Retriever-restored files that were already started
        if (!file.progress.uploadStarted || !file.isRestored) {
          this.uppy.emit('upload-started', file);
        }

        return this.uploadRemote(file, current, total);
      } // Don't double-emit upload-started for Golden Retriever-restored files that were already started


      if (!file.progress.uploadStarted || !file.isRestored) {
        this.uppy.emit('upload-started', file);
      }

      return this.upload(file, current, total);
    });
    return settle(promises);
  }
  /**
   * @param {string[]} fileIDs
   */


  handleUpload(fileIDs) {
    if (fileIDs.length === 0) {
      this.uppy.log('[Tus] No files to upload');
      return Promise.resolve();
    }

    if (this.opts.limit === 0) {
      this.uppy.log('[Tus] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/tus/#limit-0', 'warning');
    }

    this.uppy.log('[Tus] Uploading...');
    const filesToUpload = fileIDs.map(fileID => this.uppy.getFile(fileID));
    return this.uploadFiles(filesToUpload).then(() => null);
  }

  install() {
    this.uppy.setState({
      capabilities: { ...this.uppy.getState().capabilities,
        resumableUploads: true
      }
    });
    this.uppy.addUploader(this.handleUpload);
    this.uppy.on('reset-progress', this.handleResetProgress);
  }

  uninstall() {
    this.uppy.setState({
      capabilities: { ...this.uppy.getState().capabilities,
        resumableUploads: false
      }
    });
    this.uppy.removeUploader(this.handleUpload);
  }

}, _class.VERSION = "2.0.2", _temp);

},{"./../../companion-client":31,"./../../core/lib/BasePlugin":35,"./../../utils/lib/EventTracker":47,"./../../utils/lib/NetworkError":48,"./../../utils/lib/RateLimitedQueue":49,"./../../utils/lib/emitSocketProgress":51,"./../../utils/lib/getSocketHost":62,"./../../utils/lib/hasProperty":64,"./../../utils/lib/isNetworkError":67,"./../../utils/lib/settle":69,"./getFingerprint":45,"tus-js-client":13}],47:[function(require,module,exports){
"use strict";

var _emitter, _events;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports = (_emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _events = /*#__PURE__*/_classPrivateFieldLooseKey("events"), class EventTracker {
  constructor(emitter) {
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _events, {
      writable: true,
      value: []
    });
    _classPrivateFieldLooseBase(this, _emitter)[_emitter] = emitter;
  }

  on(event, fn) {
    _classPrivateFieldLooseBase(this, _events)[_events].push([event, fn]);

    return _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, fn);
  }

  remove() {
    for (const [event, fn] of _classPrivateFieldLooseBase(this, _events)[_events].splice(0)) {
      _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, fn);
    }
  }

});

},{}],48:[function(require,module,exports){
"use strict";

class NetworkError extends Error {
  constructor(error, xhr = null) {
    super(`This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.`);
    this.cause = error;
    this.isNetworkError = true;
    this.request = xhr;
  }

}

module.exports = NetworkError;

},{}],49:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

function createCancelError() {
  return new Error('Cancelled');
}

var _activeRequests = /*#__PURE__*/_classPrivateFieldLooseKey("activeRequests");

var _queuedHandlers = /*#__PURE__*/_classPrivateFieldLooseKey("queuedHandlers");

var _call = /*#__PURE__*/_classPrivateFieldLooseKey("call");

var _queueNext = /*#__PURE__*/_classPrivateFieldLooseKey("queueNext");

var _next = /*#__PURE__*/_classPrivateFieldLooseKey("next");

var _queue = /*#__PURE__*/_classPrivateFieldLooseKey("queue");

var _dequeue = /*#__PURE__*/_classPrivateFieldLooseKey("dequeue");

class RateLimitedQueue {
  constructor(limit) {
    Object.defineProperty(this, _dequeue, {
      value: _dequeue2
    });
    Object.defineProperty(this, _queue, {
      value: _queue2
    });
    Object.defineProperty(this, _next, {
      value: _next2
    });
    Object.defineProperty(this, _queueNext, {
      value: _queueNext2
    });
    Object.defineProperty(this, _call, {
      value: _call2
    });
    Object.defineProperty(this, _activeRequests, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _queuedHandlers, {
      writable: true,
      value: []
    });

    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }
  }

  run(fn, queueOptions) {
    if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] < this.limit) {
      return _classPrivateFieldLooseBase(this, _call)[_call](fn);
    }

    return _classPrivateFieldLooseBase(this, _queue)[_queue](fn, queueOptions);
  }

  wrapPromiseFunction(fn, queueOptions) {
    return (...args) => {
      let queuedRequest;
      const outerPromise = new Promise((resolve, reject) => {
        queuedRequest = this.run(() => {
          let cancelError;
          let innerPromise;

          try {
            innerPromise = Promise.resolve(fn(...args));
          } catch (err) {
            innerPromise = Promise.reject(err);
          }

          innerPromise.then(result => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, err => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return () => {
            cancelError = createCancelError();
          };
        }, queueOptions);
      });

      outerPromise.abort = () => {
        queuedRequest.abort();
      };

      return outerPromise;
    };
  }

}

function _call2(fn) {
  _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] += 1;
  let done = false;
  let cancelActive;

  try {
    cancelActive = fn();
  } catch (err) {
    _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
    throw err;
  }

  return {
    abort: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
      cancelActive();

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    },
    done: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    }
  };
}

function _queueNext2() {
  // Do it soon but not immediately, this allows clearing out the entire queue synchronously
  // one by one without continuously _advancing_ it (and starting new tasks before immediately
  // aborting them)
  queueMicrotask(() => _classPrivateFieldLooseBase(this, _next)[_next]());
}

function _next2() {
  if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] >= this.limit) {
    return;
  }

  if (_classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].length === 0) {
    return;
  } // Dispatch the next request, and update the abort/done handlers
  // so that cancelling it does the Right Thing (and doesn't just try
  // to dequeue an already-running request).


  const next = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].shift();

  const handler = _classPrivateFieldLooseBase(this, _call)[_call](next.fn);

  next.abort = handler.abort;
  next.done = handler.done;
}

function _queue2(fn, options = {}) {
  const handler = {
    fn,
    priority: options.priority || 0,
    abort: () => {
      _classPrivateFieldLooseBase(this, _dequeue)[_dequeue](handler);
    },
    done: () => {
      throw new Error('Cannot mark a queued request as done: this indicates a bug');
    }
  };

  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].findIndex(other => {
    return handler.priority > other.priority;
  });

  if (index === -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].push(handler);
  } else {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 0, handler);
  }

  return handler;
}

function _dequeue2(handler) {
  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].indexOf(handler);

  if (index !== -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 1);
  }
}

module.exports = {
  RateLimitedQueue,
  internalRateLimitedQueue: Symbol('__queue')
};

},{}],50:[function(require,module,exports){
"use strict";

var _apply;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const has = require('./hasProperty');

function insertReplacement(source, rx, replacement) {
  const newParts = [];
  source.forEach(chunk => {
    // When the source contains multiple placeholders for interpolation,
    // we should ignore chunks that are not strings, because those
    // can be JSX objects and will be otherwise incorrectly turned into strings.
    // Without this condition we’d get this: [object Object] hello [object Object] my <button>
    if (typeof chunk !== 'string') {
      return newParts.push(chunk);
    }

    return rx[Symbol.split](chunk).forEach((raw, i, list) => {
      if (raw !== '') {
        newParts.push(raw);
      } // Interlace with the `replacement` value


      if (i < list.length - 1) {
        newParts.push(replacement);
      }
    });
  });
  return newParts;
}
/**
 * Takes a string with placeholder variables like `%{smart_count} file selected`
 * and replaces it with values from options `{smart_count: 5}`
 *
 * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
 * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
 *
 * @param {string} phrase that needs interpolation, with placeholders
 * @param {object} options with values that will be used to replace placeholders
 * @returns {any[]} interpolated
 */


function interpolate(phrase, options) {
  const dollarRegex = /\$/g;
  const dollarBillsYall = '$$$$';
  let interpolated = [phrase];
  if (options == null) return interpolated;

  for (const arg of Object.keys(options)) {
    if (arg !== '_') {
      // Ensure replacement value is escaped to prevent special $-prefixed
      // regex replace tokens. the "$$$$" is needed because each "$" needs to
      // be escaped with "$" itself, and we need two in the resulting output.
      let replacement = options[arg];

      if (typeof replacement === 'string') {
        replacement = dollarRegex[Symbol.replace](replacement, dollarBillsYall);
      } // We create a new `RegExp` each time instead of using a more-efficient
      // string replace so that the same argument can be replaced multiple times
      // in the same phrase.


      interpolated = insertReplacement(interpolated, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
    }
  }

  return interpolated;
}
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports = (_apply = /*#__PURE__*/_classPrivateFieldLooseKey("apply"), class Translator {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  constructor(locales) {
    Object.defineProperty(this, _apply, {
      value: _apply2
    });
    this.locale = {
      strings: {},

      pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }

    };

    if (Array.isArray(locales)) {
      locales.forEach(_classPrivateFieldLooseBase(this, _apply)[_apply], this);
    } else {
      _classPrivateFieldLooseBase(this, _apply)[_apply](locales);
    }
  }

  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */


  translateArray(key, options) {
    if (!has(this.locale.strings, key)) {
      throw new Error(`missing string: ${key}`);
    }

    const string = this.locale.strings[key];
    const hasPluralForms = typeof string === 'object';

    if (hasPluralForms) {
      if (options && typeof options.smart_count !== 'undefined') {
        const plural = this.locale.pluralize(options.smart_count);
        return interpolate(string[plural], options);
      }

      throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
    }

    return interpolate(string, options);
  }

});

function _apply2(locale) {
  if (!(locale != null && locale.strings)) {
    return;
  }

  const prevLocale = this.locale;
  this.locale = { ...prevLocale,
    strings: { ...prevLocale.strings,
      ...locale.strings
    }
  };
  this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
}

},{"./hasProperty":64}],51:[function(require,module,exports){
"use strict";

const throttle = require('lodash.throttle');

function emitSocketProgress(uploader, progressData, file) {
  const {
    progress,
    bytesUploaded,
    bytesTotal
  } = progressData;

  if (progress) {
    uploader.uppy.log(`Upload progress: ${progress}`);
    uploader.uppy.emit('upload-progress', file, {
      uploader,
      bytesUploaded,
      bytesTotal
    });
  }
}

module.exports = throttle(emitSocketProgress, 300, {
  leading: true,
  trailing: true
});

},{"lodash.throttle":3}],52:[function(require,module,exports){
"use strict";

const NetworkError = require('./NetworkError');
/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */


module.exports = function fetchWithNetworkError(...options) {
  return fetch(...options).catch(err => {
    if (err.name === 'AbortError') {
      throw err;
    } else {
      throw new NetworkError(err);
    }
  });
};

},{"./NetworkError":48}],53:[function(require,module,exports){
"use strict";

const isDOMElement = require('./isDOMElement');
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context = document) {
  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (isDOMElement(element)) {
    return element;
  }

  return null;
};

},{"./isDOMElement":65}],54:[function(require,module,exports){
"use strict";

function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}

function encodeFilename(name) {
  let suffix = '';
  return name.replace(/[^A-Z0-9]/ig, character => {
    suffix += `-${encodeCharacter(character)}`;
    return '/';
  }) + suffix;
}
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 */


module.exports = function generateFileID(file) {
  // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
  // is slower! simple string concatenation is fast
  let id = 'uppy';

  if (typeof file.name === 'string') {
    id += `-${encodeFilename(file.name.toLowerCase())}`;
  }

  if (file.type !== undefined) {
    id += `-${file.type}`;
  }

  if (file.meta && typeof file.meta.relativePath === 'string') {
    id += `-${encodeFilename(file.meta.relativePath.toLowerCase())}`;
  }

  if (file.data.size !== undefined) {
    id += `-${file.data.size}`;
  }

  if (file.data.lastModified !== undefined) {
    id += `-${file.data.lastModified}`;
  }

  return id;
};

},{}],55:[function(require,module,exports){
"use strict";

const webkitGetAsEntryApi = require('./utils/webkitGetAsEntryApi/index');

const fallbackApi = require('./utils/fallbackApi');
/**
 * Returns a promise that resolves to the array of dropped files (if a folder is
 * dropped, and browser supports folder parsing - promise resolves to the flat
 * array of all files in all directories).
 * Each file has .relativePath prop appended to it (e.g. "/docs/Prague/ticket_from_prague_to_ufa.pdf")
 * if browser supports it. Otherwise it's undefined.
 *
 * @param {DataTransfer} dataTransfer
 * @param {Function} logDropError - a function that's called every time some
 * folder or some file error out (e.g. because of the folder name being too long
 * on Windows). Notice that resulting promise will always be resolved anyway.
 *
 * @returns {Promise} - Array<File>
 */


module.exports = function getDroppedFiles(dataTransfer, {
  logDropError = () => {}
} = {}) {
  var _dataTransfer$items;

  // Get all files from all subdirs. Works (at least) in Chrome, Mozilla, and Safari
  if ((_dataTransfer$items = dataTransfer.items) != null && _dataTransfer$items[0] && 'webkitGetAsEntry' in dataTransfer.items[0]) {
    return webkitGetAsEntryApi(dataTransfer, logDropError); // Otherwise just return all first-order files
  }

  return fallbackApi(dataTransfer);
};

},{"./utils/fallbackApi":56,"./utils/webkitGetAsEntryApi/index":59}],56:[function(require,module,exports){
"use strict";

const toArray = require('../../toArray'); // .files fallback, should be implemented in any browser


module.exports = function fallbackApi(dataTransfer) {
  const files = toArray(dataTransfer.files);
  return Promise.resolve(files);
};

},{"../../toArray":70}],57:[function(require,module,exports){
"use strict";

/**
 * Recursive function, calls the original callback() when the directory is entirely parsed.
 *
 * @param {FileSystemDirectoryReader} directoryReader
 * @param {Array} oldEntries
 * @param {Function} logDropError
 * @param {Function} callback - called with ([ all files and directories in that directoryReader ])
 */
module.exports = function getFilesAndDirectoriesFromDirectory(directoryReader, oldEntries, logDropError, {
  onSuccess
}) {
  directoryReader.readEntries(entries => {
    const newEntries = [...oldEntries, ...entries]; // According to the FileSystem API spec, getFilesAndDirectoriesFromDirectory()
    // must be called until it calls the onSuccess with an empty array.

    if (entries.length) {
      setTimeout(() => {
        getFilesAndDirectoriesFromDirectory(directoryReader, newEntries, logDropError, {
          onSuccess
        });
      }, 0); // Done iterating this particular directory
    } else {
      onSuccess(newEntries);
    }
  }, // Make sure we resolve on error anyway, it's fine if only one directory couldn't be parsed!
  error => {
    logDropError(error);
    onSuccess(oldEntries);
  });
};

},{}],58:[function(require,module,exports){
"use strict";

/**
 * Get the relative path from the FileEntry#fullPath, because File#webkitRelativePath is always '', at least onDrop.
 *
 * @param {FileEntry} fileEntry
 *
 * @returns {string|null} - if file is not in a folder - return null (this is to
 * be consistent with .relativePath-s of files selected from My Device). If file
 * is in a folder - return its fullPath, e.g. '/simpsons/hi.jpeg'.
 */
module.exports = function getRelativePath(fileEntry) {
  // fileEntry.fullPath - "/simpsons/hi.jpeg" or undefined (for browsers that don't support it)
  // fileEntry.name - "hi.jpeg"
  if (!fileEntry.fullPath || fileEntry.fullPath === `/${fileEntry.name}`) {
    return null;
  }

  return fileEntry.fullPath;
};

},{}],59:[function(require,module,exports){
"use strict";

const toArray = require('../../../toArray');

const getRelativePath = require('./getRelativePath');

const getFilesAndDirectoriesFromDirectory = require('./getFilesAndDirectoriesFromDirectory');

module.exports = function webkitGetAsEntryApi(dataTransfer, logDropError) {
  const files = [];
  const rootPromises = [];
  /**
   * Returns a resolved promise, when :files array is enhanced
   *
   * @param {(FileSystemFileEntry|FileSystemDirectoryEntry)} entry
   * @returns {Promise} - empty promise that resolves when :files is enhanced with a file
   */

  const createPromiseToAddFileOrParseDirectory = entry => new Promise(resolve => {
    // This is a base call
    if (entry.isFile) {
      // Creates a new File object which can be used to read the file.
      entry.file(file => {
        // eslint-disable-next-line no-param-reassign
        file.relativePath = getRelativePath(entry);
        files.push(file);
        resolve();
      }, // Make sure we resolve on error anyway, it's fine if only one file couldn't be read!
      error => {
        logDropError(error);
        resolve();
      }); // This is a recursive call
    } else if (entry.isDirectory) {
      const directoryReader = entry.createReader();
      getFilesAndDirectoriesFromDirectory(directoryReader, [], logDropError, {
        onSuccess: entries => resolve(Promise.all(entries.map(createPromiseToAddFileOrParseDirectory)))
      });
    }
  }); // For each dropped item, - make sure it's a file/directory, and start deepening in!


  toArray(dataTransfer.items).forEach(item => {
    const entry = item.webkitGetAsEntry(); // :entry can be null when we drop the url e.g.

    if (entry) {
      rootPromises.push(createPromiseToAddFileOrParseDirectory(entry));
    }
  });
  return Promise.all(rootPromises).then(() => files);
};

},{"../../../toArray":70,"./getFilesAndDirectoriesFromDirectory":57,"./getRelativePath":58}],60:[function(require,module,exports){
"use strict";

/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  const lastDot = fullFileName.lastIndexOf('.'); // these count as no extension: "no-dot", "trailing-dot."

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    return {
      name: fullFileName,
      extension: undefined
    };
  }

  return {
    name: fullFileName.slice(0, lastDot),
    extension: fullFileName.slice(lastDot + 1)
  };
};

},{}],61:[function(require,module,exports){
"use strict";

const getFileNameAndExtension = require('./getFileNameAndExtension');

const mimeTypes = require('./mimeTypes');

module.exports = function getFileType(file) {
  var _getFileNameAndExtens;

  if (file.type) return file.type;
  const fileExtension = file.name ? (_getFileNameAndExtens = getFileNameAndExtension(file.name).extension) == null ? void 0 : _getFileNameAndExtens.toLowerCase() : null;

  if (fileExtension && fileExtension in mimeTypes) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } // if all fails, fall back to a generic byte stream type


  return 'application/octet-stream';
};

},{"./getFileNameAndExtension":60,"./mimeTypes":68}],62:[function(require,module,exports){
"use strict";

module.exports = function getSocketHost(url) {
  // get the host domain
  const regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  const host = regex.exec(url)[1];
  const socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return `${socketProtocol}://${host}`;
};

},{}],63:[function(require,module,exports){
"use strict";

/**
 * Adds zero to strings shorter than two characters.
 *
 * @param {number} number
 * @returns {string}
 */
function pad(number) {
  return number < 10 ? `0${number}` : number.toString();
}
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */


module.exports = function getTimeStamp() {
  const date = new Date();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

},{}],64:[function(require,module,exports){
"use strict";

module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};

},{}],65:[function(require,module,exports){
"use strict";

/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return (obj == null ? void 0 : obj.nodeType) === Node.ELEMENT_NODE;
};

},{}],66:[function(require,module,exports){
"use strict";

/**
 * Checks if the browser supports Drag & Drop (not supported on mobile devices, for example).
 *
 * @returns {boolean}
 */
module.exports = function isDragDropSupported() {
  const div = document.body;

  if (!('draggable' in div) || !('ondragstart' in div && 'ondrop' in div)) {
    return false;
  }

  if (!('FormData' in window)) {
    return false;
  }

  if (!('FileReader' in window)) {
    return false;
  }

  return true;
};

},{}],67:[function(require,module,exports){
"use strict";

function isNetworkError(xhr) {
  if (!xhr) {
    return false;
  }

  return xhr.readyState !== 0 && xhr.readyState !== 4 || xhr.status === 0;
}

module.exports = isNetworkError;

},{}],68:[function(require,module,exports){
"use strict";

// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  tab: 'text/tab-separated-values',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf',
  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  dmg: 'application/x-apple-diskimage'
};

},{}],69:[function(require,module,exports){
"use strict";

module.exports = function settle(promises) {
  const resolutions = [];
  const rejections = [];

  function resolved(value) {
    resolutions.push(value);
  }

  function rejected(error) {
    rejections.push(error);
  }

  const wait = Promise.all(promises.map(promise => promise.then(resolved, rejected)));
  return wait.then(() => {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
};

},{}],70:[function(require,module,exports){
"use strict";

/**
 * Converts list into array
 */
module.exports = Array.from;

},{}],71:[function(require,module,exports){
"use strict";

const Uppy = require('./../../../../packages/@uppy/core');

const DragDrop = require('./../../../../packages/@uppy/drag-drop');

const ProgressBar = require('./../../../../packages/@uppy/progress-bar');

const Tus = require('./../../../../packages/@uppy/tus'); // Function for displaying uploaded files


const onUploadSuccess = elForUploadedFiles => (file, response) => {
  const url = response.uploadURL;
  const fileName = file.name;
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.appendChild(document.createTextNode(fileName));
  li.appendChild(a);
  document.querySelector(elForUploadedFiles).appendChild(li);
};

const uppyOne = new Uppy({
  debug: true,
  autoProceed: true
});
uppyOne.use(DragDrop, {
  target: '.example-one .for-DragDrop'
}).use(Tus, {
  endpoint: 'https://tusd.tusdemo.net/files/'
}).use(ProgressBar, {
  target: '.example-one .for-ProgressBar',
  hideAfterFinish: false
}).on('upload-success', onUploadSuccess('.example-one .uploaded-files ol'));
const uppyTwo = new Uppy({
  debug: true,
  autoProceed: false
});
uppyTwo.use(DragDrop, {
  target: '.example-two .for-DragDrop'
}).use(Tus, {
  endpoint: 'https://tusd.tusdemo.net/files/'
}).use(ProgressBar, {
  target: '.example-two .for-ProgressBar',
  hideAfterFinish: false
}).on('upload-success', onUploadSuccess('.example-two .uploaded-files ol'));
const uploadBtn = document.querySelector('.example-two button.upload-button');
uploadBtn.addEventListener('click', function () {
  uppyTwo.upload();
});

},{"./../../../../packages/@uppy/core":39,"./../../../../packages/@uppy/drag-drop":42,"./../../../../packages/@uppy/progress-bar":43,"./../../../../packages/@uppy/tus":46}]},{},[71])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQHRyYW5zbG9hZGl0L3ByZXR0aWVyLWJ5dGVzL3ByZXR0aWVyQnl0ZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvanMtYmFzZTY0L2Jhc2U2NC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gudGhyb3R0bGUvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvbWltZS1tYXRjaC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9uYW1lc3BhY2UtZW1pdHRlci9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5naWZ5L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlcXVpcmVzLXBvcnQvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvZmlsZVJlYWRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9maW5nZXJwcmludC5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9odHRwU3RhY2suanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvaXNDb3Jkb3ZhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9icm93c2VyL2lzUmVhY3ROYXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvcmVhZEFzQnl0ZUFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9icm93c2VyL3VyaVRvQmxvYi5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci91cmxTdG9yYWdlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9lcnJvci5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvbG9nZ2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9ub29wVXJsU3RvcmFnZS5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvdXBsb2FkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS91dWlkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3VybC1wYXJzZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy93aWxkY2FyZC9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL0F1dGhFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL1Byb3ZpZGVyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvUmVxdWVzdENsaWVudC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL1NlYXJjaFByb3ZpZGVyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvU29ja2V0LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy90b2tlblN0b3JhZ2UuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL25vZGVfbW9kdWxlcy9uYW5vaWQvaW5kZXguYnJvd3Nlci5janMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmNqcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL0Jhc2VQbHVnaW4uanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9VSVBsdWdpbi5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL1VwcHkuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9nZXRGaWxlTmFtZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL2luZGV4LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvbG9nZ2Vycy5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL3N1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9kcmFnLWRyb3Avc3JjL2luZGV4LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvcHJvZ3Jlc3MtYmFyL3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3N0b3JlLWRlZmF1bHQvc3JjL2luZGV4LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdHVzL3NyYy9nZXRGaW5nZXJwcmludC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3R1cy9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvRXZlbnRUcmFja2VyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL05ldHdvcmtFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9SYXRlTGltaXRlZFF1ZXVlLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL1RyYW5zbGF0b3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZW1pdFNvY2tldFByb2dyZXNzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2ZldGNoV2l0aE5ldHdvcmtFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9maW5kRE9NRWxlbWVudC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZW5lcmF0ZUZpbGVJRC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXREcm9wcGVkRmlsZXMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0RHJvcHBlZEZpbGVzL3V0aWxzL2ZhbGxiYWNrQXBpLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2dldERyb3BwZWRGaWxlcy91dGlscy93ZWJraXRHZXRBc0VudHJ5QXBpL2dldEZpbGVzQW5kRGlyZWN0b3JpZXNGcm9tRGlyZWN0b3J5LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2dldERyb3BwZWRGaWxlcy91dGlscy93ZWJraXRHZXRBc0VudHJ5QXBpL2dldFJlbGF0aXZlUGF0aC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXREcm9wcGVkRmlsZXMvdXRpbHMvd2Via2l0R2V0QXNFbnRyeUFwaS9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbi5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRGaWxlVHlwZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRTb2NrZXRIb3N0LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2dldFRpbWVTdGFtcC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9oYXNQcm9wZXJ0eS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9pc0RPTUVsZW1lbnQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvaXNEcmFnRHJvcFN1cHBvcnRlZC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9pc05ldHdvcmtFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9taW1lVHlwZXMuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvc2V0dGxlLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL3RvQXJyYXkuanMiLCJzcmMvZXhhbXBsZXMvZHJhZ2Ryb3AvYXBwLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDam9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNKLEdBREgsQ0FDTyxRQURQLEVBQ2lCO0FBQUUsRUFBQSxNQUFNLEVBQUU7QUFBVixDQURqQixFQUVHLEdBRkgsQ0FFTyxHQUZQLEVBRVk7QUFBRSxFQUFBLFFBQVEsRUFBRTtBQUFaLENBRlosRUFHRyxHQUhILENBR08sV0FIUCxFQUdvQjtBQUFFLEVBQUEsTUFBTSxFQUFFLCtCQUFWO0FBQTJDLEVBQUEsZUFBZSxFQUFFO0FBQTVELENBSHBCLEVBSUcsRUFKSCxDQUlNLGdCQUpOLEVBSXdCLGVBQWUsQ0FBQyxpQ0FBRCxDQUp2QztBQU1BLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSixDQUFTO0FBQUUsRUFBQSxLQUFLLEVBQUUsSUFBVDtBQUFlLEVBQUEsV0FBVyxFQUFFO0FBQTVCLENBQVQsQ0FBaEI7QUFDQSxPQUFPLENBQ0osR0FESCxDQUNPLFFBRFAsRUFDaUI7QUFBRSxFQUFBLE1BQU0sRUFBRTtBQUFWLENBRGpCLEVBRUcsR0FGSCxDQUVPLEdBRlAsRUFFWTtBQUFFLEVBQUEsUUFBUSxFQUFFO0FBQVosQ0FGWixFQUdHLEdBSEgsQ0FHTyxXQUhQLEVBR29CO0FBQUUsRUFBQSxNQUFNLEVBQUUsK0JBQVY7QUFBMkMsRUFBQSxlQUFlLEVBQUU7QUFBNUQsQ0FIcEIsRUFJRyxFQUpILENBSU0sZ0JBSk4sRUFJd0IsZUFBZSxDQUFDLGlDQUFELENBSnZDO0FBTUEsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsbUNBQXZCLENBQWxCO0FBQ0EsU0FBUyxDQUFDLGdCQUFWLENBQTJCLE9BQTNCLEVBQW9DLFlBQVk7QUFDOUMsRUFBQSxPQUFPLENBQUMsTUFBUjtBQUNELENBRkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZsZXQvcHJldHRpZXItYnl0ZXMvXG4vLyBDaGFuZ2luZyAxMDAwIGJ5dGVzIHRvIDEwMjQsIHNvIHdlIGNhbiBrZWVwIHVwcGVyY2FzZSBLQiB2cyBrQlxuLy8gSVNDIExpY2Vuc2UgKGMpIERhbiBGbGV0dHJlIGh0dHBzOi8vZ2l0aHViLmNvbS9GbGV0L3ByZXR0aWVyLWJ5dGVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0Vcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcHJldHRpZXJCeXRlcyAobnVtKSB7XG4gIGlmICh0eXBlb2YgbnVtICE9PSAnbnVtYmVyJyB8fCBpc05hTihudW0pKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBudW1iZXIsIGdvdCAnICsgdHlwZW9mIG51bSlcbiAgfVxuXG4gIHZhciBuZWcgPSBudW0gPCAwXG4gIHZhciB1bml0cyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddXG5cbiAgaWYgKG5lZykge1xuICAgIG51bSA9IC1udW1cbiAgfVxuXG4gIGlmIChudW0gPCAxKSB7XG4gICAgcmV0dXJuIChuZWcgPyAnLScgOiAnJykgKyBudW0gKyAnIEInXG4gIH1cblxuICB2YXIgZXhwb25lbnQgPSBNYXRoLm1pbihNYXRoLmZsb29yKE1hdGgubG9nKG51bSkgLyBNYXRoLmxvZygxMDI0KSksIHVuaXRzLmxlbmd0aCAtIDEpXG4gIG51bSA9IE51bWJlcihudW0gLyBNYXRoLnBvdygxMDI0LCBleHBvbmVudCkpXG4gIHZhciB1bml0ID0gdW5pdHNbZXhwb25lbnRdXG5cbiAgaWYgKG51bSA+PSAxMCB8fCBudW0gJSAxID09PSAwKSB7XG4gICAgLy8gRG8gbm90IHNob3cgZGVjaW1hbHMgd2hlbiB0aGUgbnVtYmVyIGlzIHR3by1kaWdpdCwgb3IgaWYgdGhlIG51bWJlciBoYXMgbm9cbiAgICAvLyBkZWNpbWFsIGNvbXBvbmVudC5cbiAgICByZXR1cm4gKG5lZyA/ICctJyA6ICcnKSArIG51bS50b0ZpeGVkKDApICsgJyAnICsgdW5pdFxuICB9IGVsc2Uge1xuICAgIHJldHVybiAobmVnID8gJy0nIDogJycpICsgbnVtLnRvRml4ZWQoMSkgKyAnICcgKyB1bml0XG4gIH1cbn1cbiIsIi8qXG4gKiAgYmFzZTY0LmpzXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbiAqICAgIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqXG4gKiAgUmVmZXJlbmNlczpcbiAqICAgIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0XG4gKi9cbjsoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShnbG9iYWwpXG4gICAgICAgIDogdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kXG4gICAgICAgID8gZGVmaW5lKGZhY3RvcnkpIDogZmFjdG9yeShnbG9iYWwpXG59KChcbiAgICB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmXG4gICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3dcbiAgICAgICAgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFxuOiB0aGlzXG4pLCBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gZXhpc3RpbmcgdmVyc2lvbiBmb3Igbm9Db25mbGljdCgpXG4gICAgZ2xvYmFsID0gZ2xvYmFsIHx8IHt9O1xuICAgIHZhciBfQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB2YXIgdmVyc2lvbiA9IFwiMi42LjRcIjtcbiAgICAvLyBjb25zdGFudHNcbiAgICB2YXIgYjY0Y2hhcnNcbiAgICAgICAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG4gICAgdmFyIGI2NHRhYiA9IGZ1bmN0aW9uKGJpbikge1xuICAgICAgICB2YXIgdCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJpbi5sZW5ndGg7IGkgPCBsOyBpKyspIHRbYmluLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9KGI2NGNoYXJzKTtcbiAgICB2YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbiAgICAvLyBlbmNvZGVyIHN0dWZmXG4gICAgdmFyIGNiX3V0b2IgPSBmdW5jdGlvbihjKSB7XG4gICAgICAgIGlmIChjLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHZhciBjYyA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIHJldHVybiBjYyA8IDB4ODAgPyBjXG4gICAgICAgICAgICAgICAgOiBjYyA8IDB4ODAwID8gKGZyb21DaGFyQ29kZSgweGMwIHwgKGNjID4+PiA2KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8IChjYyAmIDB4M2YpKSlcbiAgICAgICAgICAgICAgICA6IChmcm9tQ2hhckNvZGUoMHhlMCB8ICgoY2MgPj4+IDEyKSAmIDB4MGYpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gIDYpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoIGNjICAgICAgICAgJiAweDNmKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNjID0gMHgxMDAwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgwKSAtIDB4RDgwMCkgKiAweDQwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgxKSAtIDB4REMwMCk7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgweGYwIHwgKChjYyA+Pj4gMTgpICYgMHgwNykpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAxMikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKCBjYyAgICAgICAgICYgMHgzZikpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlX3V0b2IgPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGRl18W15cXHgwMC1cXHg3Rl0vZztcbiAgICB2YXIgdXRvYiA9IGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgcmV0dXJuIHUucmVwbGFjZShyZV91dG9iLCBjYl91dG9iKTtcbiAgICB9O1xuICAgIHZhciBjYl9lbmNvZGUgPSBmdW5jdGlvbihjY2MpIHtcbiAgICAgICAgdmFyIHBhZGxlbiA9IFswLCAyLCAxXVtjY2MubGVuZ3RoICUgM10sXG4gICAgICAgIG9yZCA9IGNjYy5jaGFyQ29kZUF0KDApIDw8IDE2XG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDEgPyBjY2MuY2hhckNvZGVBdCgxKSA6IDApIDw8IDgpXG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDIgPyBjY2MuY2hhckNvZGVBdCgyKSA6IDApKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpLFxuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAyID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDYpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDEgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQob3JkICYgNjMpXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBidG9hID0gZ2xvYmFsLmJ0b2EgJiYgdHlwZW9mIGdsb2JhbC5idG9hID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBmdW5jdGlvbihiKXsgcmV0dXJuIGdsb2JhbC5idG9hKGIpIH0gOiBmdW5jdGlvbihiKSB7XG4gICAgICAgIGlmIChiLm1hdGNoKC9bXlxceDAwLVxceEZGXS8pKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICdUaGUgc3RyaW5nIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycy4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UoL1tcXHNcXFNdezEsM30vZywgY2JfZW5jb2RlKTtcbiAgICB9O1xuICAgIHZhciBfZW5jb2RlID0gZnVuY3Rpb24odSkge1xuICAgICAgICByZXR1cm4gYnRvYSh1dG9iKFN0cmluZyh1KSkpO1xuICAgIH07XG4gICAgdmFyIG1rVXJpU2FmZSA9IGZ1bmN0aW9uIChiNjQpIHtcbiAgICAgICAgcmV0dXJuIGI2NC5yZXBsYWNlKC9bK1xcL10vZywgZnVuY3Rpb24obTApIHtcbiAgICAgICAgICAgIHJldHVybiBtMCA9PSAnKycgPyAnLScgOiAnXyc7XG4gICAgICAgIH0pLnJlcGxhY2UoLz0vZywgJycpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uKHUsIHVyaXNhZmUpIHtcbiAgICAgICAgcmV0dXJuIHVyaXNhZmUgPyBta1VyaVNhZmUoX2VuY29kZSh1KSkgOiBfZW5jb2RlKHUpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZVVSSSA9IGZ1bmN0aW9uKHUpIHsgcmV0dXJuIGVuY29kZSh1LCB0cnVlKSB9O1xuICAgIHZhciBmcm9tVWludDhBcnJheTtcbiAgICBpZiAoZ2xvYmFsLlVpbnQ4QXJyYXkpIGZyb21VaW50OEFycmF5ID0gZnVuY3Rpb24oYSwgdXJpc2FmZSkge1xuICAgICAgICAvLyByZXR1cm4gYnRvYShmcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgYSkpO1xuICAgICAgICB2YXIgYjY0ID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYS5sZW5ndGg7IGkgPCBsOyBpICs9IDMpIHtcbiAgICAgICAgICAgIHZhciBhMCA9IGFbaV0sIGExID0gYVtpKzFdLCBhMiA9IGFbaSsyXTtcbiAgICAgICAgICAgIHZhciBvcmQgPSBhMCA8PCAxNiB8IGExIDw8IDggfCBhMjtcbiAgICAgICAgICAgIGI2NCArPSAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpXG4gICAgICAgICAgICAgICAgKyAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKVxuICAgICAgICAgICAgICAgICsgKCB0eXBlb2YgYTEgIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgPyBiNjRjaGFycy5jaGFyQXQoKG9yZCA+Pj4gIDYpICYgNjMpIDogJz0nKVxuICAgICAgICAgICAgICAgICsgKCB0eXBlb2YgYTIgIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgPyBiNjRjaGFycy5jaGFyQXQoIG9yZCAgICAgICAgICYgNjMpIDogJz0nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJpc2FmZSA/IG1rVXJpU2FmZShiNjQpIDogYjY0O1xuICAgIH07XG4gICAgLy8gZGVjb2RlciBzdHVmZlxuICAgIHZhciByZV9idG91ID0gL1tcXHhDMC1cXHhERl1bXFx4ODAtXFx4QkZdfFtcXHhFMC1cXHhFRl1bXFx4ODAtXFx4QkZdezJ9fFtcXHhGMC1cXHhGN11bXFx4ODAtXFx4QkZdezN9L2c7XG4gICAgdmFyIGNiX2J0b3UgPSBmdW5jdGlvbihjY2NjKSB7XG4gICAgICAgIHN3aXRjaChjY2NjLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB2YXIgY3AgPSAoKDB4MDcgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDE4KVxuICAgICAgICAgICAgICAgIHwgICAgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCAxMilcbiAgICAgICAgICAgICAgICB8ICAgICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSkgPDwgIDYpXG4gICAgICAgICAgICAgICAgfCAgICAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMykpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gY3AgLSAweDEwMDAwO1xuICAgICAgICAgICAgcmV0dXJuIChmcm9tQ2hhckNvZGUoKG9mZnNldCAgPj4+IDEwKSArIDB4RDgwMClcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoKG9mZnNldCAmIDB4M0ZGKSArIDB4REMwMCkpO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICgoMHgwZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgICAgIHwgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gIGZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAoKDB4MWYgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDYpXG4gICAgICAgICAgICAgICAgICAgIHwgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGJ0b3UgPSBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UocmVfYnRvdSwgY2JfYnRvdSk7XG4gICAgfTtcbiAgICB2YXIgY2JfZGVjb2RlID0gZnVuY3Rpb24oY2NjYykge1xuICAgICAgICB2YXIgbGVuID0gY2NjYy5sZW5ndGgsXG4gICAgICAgIHBhZGxlbiA9IGxlbiAlIDQsXG4gICAgICAgIG4gPSAobGVuID4gMCA/IGI2NHRhYltjY2NjLmNoYXJBdCgwKV0gPDwgMTggOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMSA/IGI2NHRhYltjY2NjLmNoYXJBdCgxKV0gPDwgMTIgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMiA/IGI2NHRhYltjY2NjLmNoYXJBdCgyKV0gPDwgIDYgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMyA/IGI2NHRhYltjY2NjLmNoYXJBdCgzKV0gICAgICAgOiAwKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gPj4+IDE2KSxcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSgobiA+Pj4gIDgpICYgMHhmZiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gICAgICAgICAmIDB4ZmYpXG4gICAgICAgIF07XG4gICAgICAgIGNoYXJzLmxlbmd0aCAtPSBbMCwgMCwgMiwgMV1bcGFkbGVuXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIF9hdG9iID0gZ2xvYmFsLmF0b2IgJiYgdHlwZW9mIGdsb2JhbC5hdG9iID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBmdW5jdGlvbihhKXsgcmV0dXJuIGdsb2JhbC5hdG9iKGEpIH0gOiBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIGEucmVwbGFjZSgvXFxTezEsNH0vZywgY2JfZGVjb2RlKTtcbiAgICB9O1xuICAgIHZhciBhdG9iID0gZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gX2F0b2IoU3RyaW5nKGEpLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJykpO1xuICAgIH07XG4gICAgdmFyIF9kZWNvZGUgPSBmdW5jdGlvbihhKSB7IHJldHVybiBidG91KF9hdG9iKGEpKSB9O1xuICAgIHZhciBfZnJvbVVSSSA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhhKS5yZXBsYWNlKC9bLV9dL2csIGZ1bmN0aW9uKG0wKSB7XG4gICAgICAgICAgICByZXR1cm4gbTAgPT0gJy0nID8gJysnIDogJy8nXG4gICAgICAgIH0pLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJyk7XG4gICAgfTtcbiAgICB2YXIgZGVjb2RlID0gZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBfZGVjb2RlKF9mcm9tVVJJKGEpKTtcbiAgICB9O1xuICAgIHZhciB0b1VpbnQ4QXJyYXk7XG4gICAgaWYgKGdsb2JhbC5VaW50OEFycmF5KSB0b1VpbnQ4QXJyYXkgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LmZyb20oYXRvYihfZnJvbVVSSShhKSksIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIG5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgICAgIGdsb2JhbC5CYXNlNjQgPSBfQmFzZTY0O1xuICAgICAgICByZXR1cm4gQmFzZTY0O1xuICAgIH07XG4gICAgLy8gZXhwb3J0IEJhc2U2NFxuICAgIGdsb2JhbC5CYXNlNjQgPSB7XG4gICAgICAgIFZFUlNJT046IHZlcnNpb24sXG4gICAgICAgIGF0b2I6IGF0b2IsXG4gICAgICAgIGJ0b2E6IGJ0b2EsXG4gICAgICAgIGZyb21CYXNlNjQ6IGRlY29kZSxcbiAgICAgICAgdG9CYXNlNjQ6IGVuY29kZSxcbiAgICAgICAgdXRvYjogdXRvYixcbiAgICAgICAgZW5jb2RlOiBlbmNvZGUsXG4gICAgICAgIGVuY29kZVVSSTogZW5jb2RlVVJJLFxuICAgICAgICBidG91OiBidG91LFxuICAgICAgICBkZWNvZGU6IGRlY29kZSxcbiAgICAgICAgbm9Db25mbGljdDogbm9Db25mbGljdCxcbiAgICAgICAgZnJvbVVpbnQ4QXJyYXk6IGZyb21VaW50OEFycmF5LFxuICAgICAgICB0b1VpbnQ4QXJyYXk6IHRvVWludDhBcnJheVxuICAgIH07XG4gICAgLy8gaWYgRVM1IGlzIGF2YWlsYWJsZSwgbWFrZSBCYXNlNjQuZXh0ZW5kU3RyaW5nKCkgYXZhaWxhYmxlXG4gICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIG5vRW51bSA9IGZ1bmN0aW9uKHYpe1xuICAgICAgICAgICAgcmV0dXJuIHt2YWx1ZTp2LGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZX07XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbC5CYXNlNjQuZXh0ZW5kU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUsICdmcm9tQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZSh0aGlzKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjQnLCBub0VudW0oZnVuY3Rpb24gKHVyaXNhZmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB1cmlzYWZlKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjRVUkknLCBub0VudW0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlKHRoaXMsIHRydWUpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvL1xuICAgIC8vIGV4cG9ydCBCYXNlNjQgdG8gdGhlIG5hbWVzcGFjZVxuICAgIC8vXG4gICAgaWYgKGdsb2JhbFsnTWV0ZW9yJ10pIHsgLy8gTWV0ZW9yLmpzXG4gICAgICAgIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgfVxuICAgIC8vIG1vZHVsZS5leHBvcnRzIGFuZCBBTUQgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZS5cbiAgICAvLyBtb2R1bGUuZXhwb3J0cyBoYXMgcHJlY2VkZW5jZS5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMuQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpeyByZXR1cm4gZ2xvYmFsLkJhc2U2NCB9KTtcbiAgICB9XG4gICAgLy8gdGhhdCdzIGl0IVxuICAgIHJldHVybiB7QmFzZTY0OiBnbG9iYWwuQmFzZTY0fVxufSkpO1xuIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlclxuICogZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gVGhlIHRocm90dGxlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGBcbiAqIG1ldGhvZCB0byBjYW5jZWwgZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG9cbiAqIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YFxuICogdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZVxuICogdGhyb3R0bGVkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gcmV0dXJuIHRoZVxuICogcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLnRocm90dGxlYCBhbmQgYF8uZGVib3VuY2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgaW52b2NhdGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCkpO1xuICpcbiAqIC8vIEludm9rZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzLlxuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7ICd0cmFpbGluZyc6IGZhbHNlIH0pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHRocm90dGxlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyB0aHJvdHRsZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHRocm90dGxlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwge1xuICAgICdsZWFkaW5nJzogbGVhZGluZyxcbiAgICAnbWF4V2FpdCc6IHdhaXQsXG4gICAgJ3RyYWlsaW5nJzogdHJhaWxpbmdcbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuIiwidmFyIHdpbGRjYXJkID0gcmVxdWlyZSgnd2lsZGNhcmQnKTtcbnZhciByZU1pbWVQYXJ0U3BsaXQgPSAvW1xcL1xcK1xcLl0vO1xuXG4vKipcbiAgIyBtaW1lLW1hdGNoXG5cbiAgQSBzaW1wbGUgZnVuY3Rpb24gdG8gY2hlY2tlciB3aGV0aGVyIGEgdGFyZ2V0IG1pbWUgdHlwZSBtYXRjaGVzIGEgbWltZS10eXBlXG4gIHBhdHRlcm4gKGUuZy4gaW1hZ2UvanBlZyBtYXRjaGVzIGltYWdlL2pwZWcgT1IgaW1hZ2UvKikuXG5cbiAgIyMgRXhhbXBsZSBVc2FnZVxuXG4gIDw8PCBleGFtcGxlLmpzXG5cbioqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHBhdHRlcm4pIHtcbiAgZnVuY3Rpb24gdGVzdChwYXR0ZXJuKSB7XG4gICAgdmFyIHJlc3VsdCA9IHdpbGRjYXJkKHBhdHRlcm4sIHRhcmdldCwgcmVNaW1lUGFydFNwbGl0KTtcblxuICAgIC8vIGVuc3VyZSB0aGF0IHdlIGhhdmUgYSB2YWxpZCBtaW1lIHR5cGUgKHNob3VsZCBoYXZlIHR3byBwYXJ0cylcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPj0gMjtcbiAgfVxuXG4gIHJldHVybiBwYXR0ZXJuID8gdGVzdChwYXR0ZXJuLnNwbGl0KCc7JylbMF0pIDogdGVzdDtcbn07XG4iLCIvKipcbiogQ3JlYXRlIGFuIGV2ZW50IGVtaXR0ZXIgd2l0aCBuYW1lc3BhY2VzXG4qIEBuYW1lIGNyZWF0ZU5hbWVzcGFjZUVtaXR0ZXJcbiogQGV4YW1wbGVcbiogdmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2luZGV4JykoKVxuKlxuKiBlbWl0dGVyLm9uKCcqJywgZnVuY3Rpb24gKCkge1xuKiAgIGNvbnNvbGUubG9nKCdhbGwgZXZlbnRzIGVtaXR0ZWQnLCB0aGlzLmV2ZW50KVxuKiB9KVxuKlxuKiBlbWl0dGVyLm9uKCdleGFtcGxlJywgZnVuY3Rpb24gKCkge1xuKiAgIGNvbnNvbGUubG9nKCdleGFtcGxlIGV2ZW50IGVtaXR0ZWQnKVxuKiB9KVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTmFtZXNwYWNlRW1pdHRlciAoKSB7XG4gIHZhciBlbWl0dGVyID0ge31cbiAgdmFyIF9mbnMgPSBlbWl0dGVyLl9mbnMgPSB7fVxuXG4gIC8qKlxuICAqIEVtaXQgYW4gZXZlbnQuIE9wdGlvbmFsbHkgbmFtZXNwYWNlIHRoZSBldmVudC4gSGFuZGxlcnMgYXJlIGZpcmVkIGluIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IHdlcmUgYWRkZWQgd2l0aCBleGFjdCBtYXRjaGVzIHRha2luZyBwcmVjZWRlbmNlLiBTZXBhcmF0ZSB0aGUgbmFtZXNwYWNlIGFuZCBldmVudCB3aXRoIGEgYDpgXG4gICogQG5hbWUgZW1pdFxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCDigJMgdGhlIG5hbWUgb2YgdGhlIGV2ZW50LCB3aXRoIG9wdGlvbmFsIG5hbWVzcGFjZVxuICAqIEBwYXJhbSB7Li4uKn0gZGF0YSDigJMgdXAgdG8gNiBhcmd1bWVudHMgdGhhdCBhcmUgcGFzc2VkIHRvIHRoZSBldmVudCBsaXN0ZW5lclxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5lbWl0KCdleGFtcGxlJylcbiAgKiBlbWl0dGVyLmVtaXQoJ2RlbW86dGVzdCcpXG4gICogZW1pdHRlci5lbWl0KCdkYXRhJywgeyBleGFtcGxlOiB0cnVlfSwgJ2Egc3RyaW5nJywgMSlcbiAgKi9cbiAgZW1pdHRlci5lbWl0ID0gZnVuY3Rpb24gZW1pdCAoZXZlbnQsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQsIGFyZzUsIGFyZzYpIHtcbiAgICB2YXIgdG9FbWl0ID0gZ2V0TGlzdGVuZXJzKGV2ZW50KVxuXG4gICAgaWYgKHRvRW1pdC5sZW5ndGgpIHtcbiAgICAgIGVtaXRBbGwoZXZlbnQsIHRvRW1pdCwgW2FyZzEsIGFyZzIsIGFyZzMsIGFyZzQsIGFyZzUsIGFyZzZdKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIENyZWF0ZSBlbiBldmVudCBsaXN0ZW5lci5cbiAgKiBAbmFtZSBvblxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICogQGV4YW1wbGVcbiAgKiBlbWl0dGVyLm9uKCdleGFtcGxlJywgZnVuY3Rpb24gKCkge30pXG4gICogZW1pdHRlci5vbignZGVtbycsIGZ1bmN0aW9uICgpIHt9KVxuICAqL1xuICBlbWl0dGVyLm9uID0gZnVuY3Rpb24gb24gKGV2ZW50LCBmbikge1xuICAgIGlmICghX2Zuc1tldmVudF0pIHtcbiAgICAgIF9mbnNbZXZlbnRdID0gW11cbiAgICB9XG5cbiAgICBfZm5zW2V2ZW50XS5wdXNoKGZuKVxuICB9XG5cbiAgLyoqXG4gICogQ3JlYXRlIGVuIGV2ZW50IGxpc3RlbmVyIHRoYXQgZmlyZXMgb25jZS5cbiAgKiBAbmFtZSBvbmNlXG4gICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIub25jZSgnZXhhbXBsZScsIGZ1bmN0aW9uICgpIHt9KVxuICAqIGVtaXR0ZXIub25jZSgnZGVtbycsIGZ1bmN0aW9uICgpIHt9KVxuICAqL1xuICBlbWl0dGVyLm9uY2UgPSBmdW5jdGlvbiBvbmNlIChldmVudCwgZm4pIHtcbiAgICBmdW5jdGlvbiBvbmUgKCkge1xuICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgZW1pdHRlci5vZmYoZXZlbnQsIG9uZSlcbiAgICB9XG4gICAgdGhpcy5vbihldmVudCwgb25lKVxuICB9XG5cbiAgLyoqXG4gICogU3RvcCBsaXN0ZW5pbmcgdG8gYW4gZXZlbnQuIFN0b3AgYWxsIGxpc3RlbmVycyBvbiBhbiBldmVudCBieSBvbmx5IHBhc3NpbmcgdGhlIGV2ZW50IG5hbWUuIFN0b3AgYSBzaW5nbGUgbGlzdGVuZXIgYnkgcGFzc2luZyB0aGF0IGV2ZW50IGhhbmRsZXIgYXMgYSBjYWxsYmFjay5cbiAgKiBZb3UgbXVzdCBiZSBleHBsaWNpdCBhYm91dCB3aGF0IHdpbGwgYmUgdW5zdWJzY3JpYmVkOiBgZW1pdHRlci5vZmYoJ2RlbW8nKWAgd2lsbCB1bnN1YnNjcmliZSBhbiBgZW1pdHRlci5vbignZGVtbycpYCBsaXN0ZW5lcixcbiAgKiBgZW1pdHRlci5vZmYoJ2RlbW86ZXhhbXBsZScpYCB3aWxsIHVuc3Vic2NyaWJlIGFuIGBlbWl0dGVyLm9uKCdkZW1vOmV4YW1wbGUnKWAgbGlzdGVuZXJcbiAgKiBAbmFtZSBvZmZcbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dIOKAkyB0aGUgc3BlY2lmaWMgaGFuZGxlclxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5vZmYoJ2V4YW1wbGUnKVxuICAqIGVtaXR0ZXIub2ZmKCdkZW1vJywgZnVuY3Rpb24gKCkge30pXG4gICovXG4gIGVtaXR0ZXIub2ZmID0gZnVuY3Rpb24gb2ZmIChldmVudCwgZm4pIHtcbiAgICB2YXIga2VlcCA9IFtdXG5cbiAgICBpZiAoZXZlbnQgJiYgZm4pIHtcbiAgICAgIHZhciBmbnMgPSB0aGlzLl9mbnNbZXZlbnRdXG4gICAgICB2YXIgaSA9IDBcbiAgICAgIHZhciBsID0gZm5zID8gZm5zLmxlbmd0aCA6IDBcblxuICAgICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChmbnNbaV0gIT09IGZuKSB7XG4gICAgICAgICAga2VlcC5wdXNoKGZuc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGtlZXAubGVuZ3RoID8gdGhpcy5fZm5zW2V2ZW50XSA9IGtlZXAgOiBkZWxldGUgdGhpcy5fZm5zW2V2ZW50XVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGlzdGVuZXJzIChlKSB7XG4gICAgdmFyIG91dCA9IF9mbnNbZV0gPyBfZm5zW2VdIDogW11cbiAgICB2YXIgaWR4ID0gZS5pbmRleE9mKCc6JylcbiAgICB2YXIgYXJncyA9IChpZHggPT09IC0xKSA/IFtlXSA6IFtlLnN1YnN0cmluZygwLCBpZHgpLCBlLnN1YnN0cmluZyhpZHggKyAxKV1cblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoX2ZucylcbiAgICB2YXIgaSA9IDBcbiAgICB2YXIgbCA9IGtleXMubGVuZ3RoXG5cbiAgICBmb3IgKGk7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICBpZiAoa2V5ID09PSAnKicpIHtcbiAgICAgICAgb3V0ID0gb3V0LmNvbmNhdChfZm5zW2tleV0pXG4gICAgICB9XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJiBhcmdzWzBdID09PSBrZXkpIHtcbiAgICAgICAgb3V0ID0gb3V0LmNvbmNhdChfZm5zW2tleV0pXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dFxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdEFsbCAoZSwgZm5zLCBhcmdzKSB7XG4gICAgdmFyIGkgPSAwXG4gICAgdmFyIGwgPSBmbnMubGVuZ3RoXG5cbiAgICBmb3IgKGk7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICghZm5zW2ldKSBicmVha1xuICAgICAgZm5zW2ldLmV2ZW50ID0gZVxuICAgICAgZm5zW2ldLmFwcGx5KGZuc1tpXSwgYXJncylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZW1pdHRlclxufVxuIiwidmFyIG4sbCx1LHQsaSxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZHxpdGVyYS9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gcChuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiB2KGwsdSx0KXt2YXIgaSxvLHIsZj17fTtmb3IociBpbiB1KVwia2V5XCI9PXI/aT11W3JdOlwicmVmXCI9PXI/bz11W3JdOmZbcl09dVtyXTtpZihhcmd1bWVudHMubGVuZ3RoPjImJihmLmNoaWxkcmVuPWFyZ3VtZW50cy5sZW5ndGg+Mz9uLmNhbGwoYXJndW1lbnRzLDIpOnQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwmJm51bGwhPWwuZGVmYXVsdFByb3BzKWZvcihyIGluIGwuZGVmYXVsdFByb3BzKXZvaWQgMD09PWZbcl0mJihmW3JdPWwuZGVmYXVsdFByb3BzW3JdKTtyZXR1cm4gaChsLGYsaSxvLG51bGwpfWZ1bmN0aW9uIGgobix0LGksbyxyKXt2YXIgZj17dHlwZTpuLHByb3BzOnQsa2V5OmkscmVmOm8sX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLF9faDpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6bnVsbD09cj8rK3U6cn07cmV0dXJuIG51bGwhPWwudm5vZGUmJmwudm5vZGUoZiksZn1mdW5jdGlvbiB5KG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIGQobixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gXyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/XyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT9fKG4pOm51bGx9ZnVuY3Rpb24gayhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGsobil9fWZ1bmN0aW9uIHgobil7KCFuLl9fZCYmKG4uX19kPSEwKSYmaS5wdXNoKG4pJiYhYi5fX3IrK3x8ciE9PWwuZGVib3VuY2VSZW5kZXJpbmcpJiYoKHI9bC5kZWJvdW5jZVJlbmRlcmluZyl8fG8pKGIpfWZ1bmN0aW9uIGIoKXtmb3IodmFyIG47Yi5fX3I9aS5sZW5ndGg7KW49aS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSxpPVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LHQsaSxvLHI7bi5fX2QmJihvPShpPShsPW4pLl9fdikuX19lLChyPWwuX19QKSYmKHU9W10sKHQ9YSh7fSxpKSkuX192PWkuX192KzEsSShyLGksdCxsLl9fbix2b2lkIDAhPT1yLm93bmVyU1ZHRWxlbWVudCxudWxsIT1pLl9faD9bb106bnVsbCx1LG51bGw9PW8/XyhpKTpvLGkuX19oKSxUKHUsaSksaS5fX2UhPW8mJmsoaSkpKX0pfWZ1bmN0aW9uIG0obixsLHUsdCxpLG8scixmLHMsYSl7dmFyIHAsdixkLGsseCxiLG0sQT10JiZ0Ll9fa3x8YyxQPUEubGVuZ3RoO2Zvcih1Ll9faz1bXSxwPTA7cDxsLmxlbmd0aDtwKyspaWYobnVsbCE9KGs9dS5fX2tbcF09bnVsbD09KGs9bFtwXSl8fFwiYm9vbGVhblwiPT10eXBlb2Ygaz9udWxsOlwic3RyaW5nXCI9PXR5cGVvZiBrfHxcIm51bWJlclwiPT10eXBlb2Yga3x8XCJiaWdpbnRcIj09dHlwZW9mIGs/aChudWxsLGssbnVsbCxudWxsLGspOkFycmF5LmlzQXJyYXkoayk/aCh5LHtjaGlsZHJlbjprfSxudWxsLG51bGwsbnVsbCk6ay5fX2I+MD9oKGsudHlwZSxrLnByb3BzLGsua2V5LG51bGwsay5fX3YpOmspKXtpZihrLl9fPXUsay5fX2I9dS5fX2IrMSxudWxsPT09KGQ9QVtwXSl8fGQmJmsua2V5PT1kLmtleSYmay50eXBlPT09ZC50eXBlKUFbcF09dm9pZCAwO2Vsc2UgZm9yKHY9MDt2PFA7disrKXtpZigoZD1BW3ZdKSYmay5rZXk9PWQua2V5JiZrLnR5cGU9PT1kLnR5cGUpe0Fbdl09dm9pZCAwO2JyZWFrfWQ9bnVsbH1JKG4sayxkPWR8fGUsaSxvLHIsZixzLGEpLHg9ay5fX2UsKHY9ay5yZWYpJiZkLnJlZiE9diYmKG18fChtPVtdKSxkLnJlZiYmbS5wdXNoKGQucmVmLG51bGwsayksbS5wdXNoKHYsay5fX2N8fHgsaykpLG51bGwhPXg/KG51bGw9PWImJihiPXgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGsudHlwZSYmbnVsbCE9ay5fX2smJmsuX19rPT09ZC5fX2s/ay5fX2Q9cz1nKGsscyxuKTpzPXcobixrLGQsQSx4LHMpLGF8fFwib3B0aW9uXCIhPT11LnR5cGU/XCJmdW5jdGlvblwiPT10eXBlb2YgdS50eXBlJiYodS5fX2Q9cyk6bi52YWx1ZT1cIlwiKTpzJiZkLl9fZT09cyYmcy5wYXJlbnROb2RlIT1uJiYocz1fKGQpKX1mb3IodS5fX2U9YixwPVA7cC0tOyludWxsIT1BW3BdJiYoXCJmdW5jdGlvblwiPT10eXBlb2YgdS50eXBlJiZudWxsIT1BW3BdLl9fZSYmQVtwXS5fX2U9PXUuX19kJiYodS5fX2Q9Xyh0LHArMSkpLEwoQVtwXSxBW3BdKSk7aWYobSlmb3IocD0wO3A8bS5sZW5ndGg7cCsrKXoobVtwXSxtWysrcF0sbVsrK3BdKX1mdW5jdGlvbiBnKG4sbCx1KXt2YXIgdCxpO2Zvcih0PTA7dDxuLl9fay5sZW5ndGg7dCsrKShpPW4uX19rW3RdKSYmKGkuX189bixsPVwiZnVuY3Rpb25cIj09dHlwZW9mIGkudHlwZT9nKGksbCx1KTp3KHUsaSxpLG4uX19rLGkuX19lLGwpKTtyZXR1cm4gbH1mdW5jdGlvbiB3KG4sbCx1LHQsaSxvKXt2YXIgcixmLGU7aWYodm9pZCAwIT09bC5fX2Qpcj1sLl9fZCxsLl9fZD12b2lkIDA7ZWxzZSBpZihudWxsPT11fHxpIT1vfHxudWxsPT1pLnBhcmVudE5vZGUpbjppZihudWxsPT1vfHxvLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoaSkscj1udWxsO2Vsc2V7Zm9yKGY9byxlPTA7KGY9Zi5uZXh0U2libGluZykmJmU8dC5sZW5ndGg7ZSs9MilpZihmPT1pKWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoaSxvKSxyPW99cmV0dXJuIHZvaWQgMCE9PXI/cjppLm5leHRTaWJsaW5nfWZ1bmN0aW9uIEEobixsLHUsdCxpKXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fEMobixvLG51bGwsdVtvXSx0KTtmb3IobyBpbiBsKWkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxDKG4sbyxsW29dLHVbb10sdCl9ZnVuY3Rpb24gUChuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPW51bGw9PXU/XCJcIjpcIm51bWJlclwiIT10eXBlb2YgdXx8cy50ZXN0KGwpP3U6dStcInB4XCJ9ZnVuY3Rpb24gQyhuLGwsdSx0LGkpe3ZhciBvO246aWYoXCJzdHlsZVwiPT09bClpZihcInN0cmluZ1wiPT10eXBlb2YgdSluLnN0eWxlLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0JiYobi5zdHlsZS5jc3NUZXh0PXQ9XCJcIiksdClmb3IobCBpbiB0KXUmJmwgaW4gdXx8UChuLnN0eWxlLGwsXCJcIik7aWYodSlmb3IobCBpbiB1KXQmJnVbbF09PT10W2xdfHxQKG4uc3R5bGUsbCx1W2xdKX1lbHNlIGlmKFwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdKW89bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxsPWwudG9Mb3dlckNhc2UoKWluIG4/bC50b0xvd2VyQ2FzZSgpLnNsaWNlKDIpOmwuc2xpY2UoMiksbi5sfHwobi5sPXt9KSxuLmxbbCtvXT11LHU/dHx8bi5hZGRFdmVudExpc3RlbmVyKGwsbz9IOiQsbyk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwsbz9IOiQsbyk7ZWxzZSBpZihcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sKXtpZihpKWw9bC5yZXBsYWNlKC94bGlua1tIOmhdLyxcImhcIikucmVwbGFjZSgvc05hbWUkLyxcInNcIik7ZWxzZSBpZihcImhyZWZcIiE9PWwmJlwibGlzdFwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInRhYkluZGV4XCIhPT1sJiZcImRvd25sb2FkXCIhPT1sJiZsIGluIG4pdHJ5e25bbF09bnVsbD09dT9cIlwiOnU7YnJlYWsgbn1jYXRjaChuKXt9XCJmdW5jdGlvblwiPT10eXBlb2YgdXx8KG51bGwhPXUmJighMSE9PXV8fFwiYVwiPT09bFswXSYmXCJyXCI9PT1sWzFdKT9uLnNldEF0dHJpYnV0ZShsLHUpOm4ucmVtb3ZlQXR0cmlidXRlKGwpKX19ZnVuY3Rpb24gJChuKXt0aGlzLmxbbi50eXBlKyExXShsLmV2ZW50P2wuZXZlbnQobik6bil9ZnVuY3Rpb24gSChuKXt0aGlzLmxbbi50eXBlKyEwXShsLmV2ZW50P2wuZXZlbnQobik6bil9ZnVuY3Rpb24gSShuLHUsdCxpLG8scixmLGUsYyl7dmFyIHMscCx2LGgsXyxrLHgsYixnLHcsQSxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsO251bGwhPXQuX19oJiYoYz10Ll9faCxlPXUuX19lPXQuX19lLHUuX19oPW51bGwscj1bZV0pLChzPWwuX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihiPXUucHJvcHMsZz0ocz1QLmNvbnRleHRUeXBlKSYmaVtzLl9fY10sdz1zP2c/Zy5wcm9wcy52YWx1ZTpzLl9fOmksdC5fX2M/eD0ocD11Ll9fYz10Ll9fYykuX189cC5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9cD1uZXcgUChiLHcpOih1Ll9fYz1wPW5ldyBkKGIsdykscC5jb25zdHJ1Y3Rvcj1QLHAucmVuZGVyPU0pLGcmJmcuc3ViKHApLHAucHJvcHM9YixwLnN0YXRlfHwocC5zdGF0ZT17fSkscC5jb250ZXh0PXcscC5fX249aSx2PXAuX19kPSEwLHAuX19oPVtdKSxudWxsPT1wLl9fcyYmKHAuX19zPXAuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYocC5fX3M9PXAuc3RhdGUmJihwLl9fcz1hKHt9LHAuX19zKSksYShwLl9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhiLHAuX19zKSkpLGg9cC5wcm9wcyxfPXAuc3RhdGUsdiludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9cC5jb21wb25lbnRXaWxsTW91bnQmJnAuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9cC5jb21wb25lbnREaWRNb3VudCYmcC5fX2gucHVzaChwLmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZiIT09aCYmbnVsbCE9cC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZwLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoYix3KSwhcC5fX2UmJm51bGwhPXAuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXAuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGIscC5fX3Msdyl8fHUuX192PT09dC5fX3Ype3AucHJvcHM9YixwLnN0YXRlPXAuX19zLHUuX192IT09dC5fX3YmJihwLl9fZD0hMSkscC5fX3Y9dSx1Ll9fZT10Ll9fZSx1Ll9faz10Ll9fayx1Ll9fay5mb3JFYWNoKGZ1bmN0aW9uKG4pe24mJihuLl9fPXUpfSkscC5fX2gubGVuZ3RoJiZmLnB1c2gocCk7YnJlYWsgbn1udWxsIT1wLmNvbXBvbmVudFdpbGxVcGRhdGUmJnAuY29tcG9uZW50V2lsbFVwZGF0ZShiLHAuX19zLHcpLG51bGwhPXAuY29tcG9uZW50RGlkVXBkYXRlJiZwLl9faC5wdXNoKGZ1bmN0aW9uKCl7cC5jb21wb25lbnREaWRVcGRhdGUoaCxfLGspfSl9cC5jb250ZXh0PXcscC5wcm9wcz1iLHAuc3RhdGU9cC5fX3MsKHM9bC5fX3IpJiZzKHUpLHAuX19kPSExLHAuX192PXUscC5fX1A9bixzPXAucmVuZGVyKHAucHJvcHMscC5zdGF0ZSxwLmNvbnRleHQpLHAuc3RhdGU9cC5fX3MsbnVsbCE9cC5nZXRDaGlsZENvbnRleHQmJihpPWEoYSh7fSxpKSxwLmdldENoaWxkQ29udGV4dCgpKSksdnx8bnVsbD09cC5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KGs9cC5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShoLF8pKSxBPW51bGwhPXMmJnMudHlwZT09PXkmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46cyxtKG4sQXJyYXkuaXNBcnJheShBKT9BOltBXSx1LHQsaSxvLHIsZixlLGMpLHAuYmFzZT11Ll9fZSx1Ll9faD1udWxsLHAuX19oLmxlbmd0aCYmZi5wdXNoKHApLHgmJihwLl9fRT1wLl9fPW51bGwpLHAuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT10Ll9fdj8odS5fX2s9dC5fX2ssdS5fX2U9dC5fX2UpOnUuX19lPWoodC5fX2UsdSx0LGksbyxyLGYsYyk7KHM9bC5kaWZmZWQpJiZzKHUpfWNhdGNoKG4pe3UuX192PW51bGwsKGN8fG51bGwhPXIpJiYodS5fX2U9ZSx1Ll9faD0hIWMscltyLmluZGV4T2YoZSldPW51bGwpLGwuX19lKG4sdSx0KX19ZnVuY3Rpb24gVChuLHUpe2wuX19jJiZsLl9fYyh1LG4pLG4uc29tZShmdW5jdGlvbih1KXt0cnl7bj11Ll9faCx1Ll9faD1bXSxuLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobil7bC5fX2Uobix1Ll9fdil9fSl9ZnVuY3Rpb24gaihsLHUsdCxpLG8scixmLGMpe3ZhciBzLGEsdixoPXQucHJvcHMseT11LnByb3BzLGQ9dS50eXBlLGs9MDtpZihcInN2Z1wiPT09ZCYmKG89ITApLG51bGwhPXIpZm9yKDtrPHIubGVuZ3RoO2srKylpZigocz1yW2tdKSYmKHM9PT1sfHwoZD9zLmxvY2FsTmFtZT09ZDozPT1zLm5vZGVUeXBlKSkpe2w9cyxyW2tdPW51bGw7YnJlYWt9aWYobnVsbD09bCl7aWYobnVsbD09PWQpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHkpO2w9bz9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGQpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZCx5LmlzJiZ5KSxyPW51bGwsYz0hMX1pZihudWxsPT09ZCloPT09eXx8YyYmbC5kYXRhPT09eXx8KGwuZGF0YT15KTtlbHNle2lmKHI9ciYmbi5jYWxsKGwuY2hpbGROb2RlcyksYT0oaD10LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCx2PXkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWMpe2lmKG51bGwhPXIpZm9yKGg9e30saz0wO2s8bC5hdHRyaWJ1dGVzLmxlbmd0aDtrKyspaFtsLmF0dHJpYnV0ZXNba10ubmFtZV09bC5hdHRyaWJ1dGVzW2tdLnZhbHVlOyh2fHxhKSYmKHYmJihhJiZ2Ll9faHRtbD09YS5fX2h0bWx8fHYuX19odG1sPT09bC5pbm5lckhUTUwpfHwobC5pbm5lckhUTUw9diYmdi5fX2h0bWx8fFwiXCIpKX1pZihBKGwseSxoLG8sYyksdil1Ll9faz1bXTtlbHNlIGlmKGs9dS5wcm9wcy5jaGlsZHJlbixtKGwsQXJyYXkuaXNBcnJheShrKT9rOltrXSx1LHQsaSxvJiZcImZvcmVpZ25PYmplY3RcIiE9PWQscixmLHI/clswXTp0Ll9fayYmXyh0LDApLGMpLG51bGwhPXIpZm9yKGs9ci5sZW5ndGg7ay0tOyludWxsIT1yW2tdJiZwKHJba10pO2N8fChcInZhbHVlXCJpbiB5JiZ2b2lkIDAhPT0oaz15LnZhbHVlKSYmKGshPT1sLnZhbHVlfHxcInByb2dyZXNzXCI9PT1kJiYhaykmJkMobCxcInZhbHVlXCIsayxoLnZhbHVlLCExKSxcImNoZWNrZWRcImluIHkmJnZvaWQgMCE9PShrPXkuY2hlY2tlZCkmJmshPT1sLmNoZWNrZWQmJkMobCxcImNoZWNrZWRcIixrLGguY2hlY2tlZCwhMSkpfXJldHVybiBsfWZ1bmN0aW9uIHoobix1LHQpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odSk6bi5jdXJyZW50PXV9Y2F0Y2gobil7bC5fX2Uobix0KX19ZnVuY3Rpb24gTChuLHUsdCl7dmFyIGksbztpZihsLnVubW91bnQmJmwudW5tb3VudChuKSwoaT1uLnJlZikmJihpLmN1cnJlbnQmJmkuY3VycmVudCE9PW4uX19lfHx6KGksbnVsbCx1KSksbnVsbCE9KGk9bi5fX2MpKXtpZihpLmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXtpLmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobil7bC5fX2Uobix1KX1pLmJhc2U9aS5fX1A9bnVsbH1pZihpPW4uX19rKWZvcihvPTA7bzxpLmxlbmd0aDtvKyspaVtvXSYmTChpW29dLHUsXCJmdW5jdGlvblwiIT10eXBlb2Ygbi50eXBlKTt0fHxudWxsPT1uLl9fZXx8cChuLl9fZSksbi5fX2U9bi5fX2Q9dm9pZCAwfWZ1bmN0aW9uIE0obixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gTih1LHQsaSl7dmFyIG8scixmO2wuX18mJmwuX18odSx0KSxyPShvPVwiZnVuY3Rpb25cIj09dHlwZW9mIGkpP251bGw6aSYmaS5fX2t8fHQuX19rLGY9W10sSSh0LHU9KCFvJiZpfHx0KS5fX2s9dih5LG51bGwsW3VdKSxyfHxlLGUsdm9pZCAwIT09dC5vd25lclNWR0VsZW1lbnQsIW8mJmk/W2ldOnI/bnVsbDp0LmZpcnN0Q2hpbGQ/bi5jYWxsKHQuY2hpbGROb2Rlcyk6bnVsbCxmLCFvJiZpP2k6cj9yLl9fZTp0LmZpcnN0Q2hpbGQsbyksVChmLHUpfW49Yy5zbGljZSxsPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsdCxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYoKHQ9dS5jb25zdHJ1Y3RvcikmJm51bGwhPXQuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYodS5zZXRTdGF0ZSh0LmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSksaT11Ll9fZCksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKHUuY29tcG9uZW50RGlkQ2F0Y2gobiksaT11Ll9fZCksaSlyZXR1cm4gdS5fX0U9dX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LHU9MCx0PWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxkLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9bnVsbCE9dGhpcy5fX3MmJnRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4oYSh7fSx1KSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSx4KHRoaXMpKX0sZC5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLHgodGhpcykpfSxkLnByb3RvdHlwZS5yZW5kZXI9eSxpPVtdLG89XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQsYi5fX3I9MCxmPTAsZXhwb3J0cy5yZW5kZXI9TixleHBvcnRzLmh5ZHJhdGU9ZnVuY3Rpb24gbihsLHUpe04obCx1LG4pfSxleHBvcnRzLmNyZWF0ZUVsZW1lbnQ9dixleHBvcnRzLmg9dixleHBvcnRzLkZyYWdtZW50PXksZXhwb3J0cy5jcmVhdGVSZWY9ZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpudWxsfX0sZXhwb3J0cy5pc1ZhbGlkRWxlbWVudD10LGV4cG9ydHMuQ29tcG9uZW50PWQsZXhwb3J0cy5jbG9uZUVsZW1lbnQ9ZnVuY3Rpb24obCx1LHQpe3ZhciBpLG8scixmPWEoe30sbC5wcm9wcyk7Zm9yKHIgaW4gdSlcImtleVwiPT1yP2k9dVtyXTpcInJlZlwiPT1yP289dVtyXTpmW3JdPXVbcl07cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg+MiYmKGYuY2hpbGRyZW49YXJndW1lbnRzLmxlbmd0aD4zP24uY2FsbChhcmd1bWVudHMsMik6dCksaChsLnR5cGUsZixpfHxsLmtleSxvfHxsLnJlZixudWxsKX0sZXhwb3J0cy5jcmVhdGVDb250ZXh0PWZ1bmN0aW9uKG4sbCl7dmFyIHU9e19fYzpsPVwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciB1LHQ7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwodT1bXSwodD17fSlbbF09dGhpcyx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0fSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLnByb3BzLnZhbHVlIT09bi52YWx1ZSYmdS5zb21lKHgpfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXt1LnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dS5zcGxpY2UodS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuUHJvdmlkZXIuX189dS5Db25zdW1lci5jb250ZXh0VHlwZT11fSxleHBvcnRzLnRvQ2hpbGRBcnJheT1mdW5jdGlvbiBuKGwsdSl7cmV0dXJuIHU9dXx8W10sbnVsbD09bHx8XCJib29sZWFuXCI9PXR5cGVvZiBsfHwoQXJyYXkuaXNBcnJheShsKT9sLnNvbWUoZnVuY3Rpb24obCl7bihsLHUpfSk6dS5wdXNoKGwpKSx1fSxleHBvcnRzLm9wdGlvbnM9bDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5qcy5tYXBcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gICwgdW5kZWY7XG5cbi8qKlxuICogRGVjb2RlIGEgVVJJIGVuY29kZWQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgVVJJIGVuY29kZWQgc3RyaW5nLlxuICogQHJldHVybnMge1N0cmluZ3xOdWxsfSBUaGUgZGVjb2RlZCBzdHJpbmcuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChpbnB1dC5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIGVuY29kZSBhIGdpdmVuIGlucHV0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgc3RyaW5nIHRoYXQgbmVlZHMgdG8gYmUgZW5jb2RlZC5cbiAqIEByZXR1cm5zIHtTdHJpbmd8TnVsbH0gVGhlIGVuY29kZWQgc3RyaW5nLlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuICB0cnkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoaW5wdXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBTaW1wbGUgcXVlcnkgc3RyaW5nIHBhcnNlci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgVGhlIHF1ZXJ5IHN0cmluZyB0aGF0IG5lZWRzIHRvIGJlIHBhcnNlZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBxdWVyeXN0cmluZyhxdWVyeSkge1xuICB2YXIgcGFyc2VyID0gLyhbXj0/IyZdKyk9PyhbXiZdKikvZ1xuICAgICwgcmVzdWx0ID0ge31cbiAgICAsIHBhcnQ7XG5cbiAgd2hpbGUgKHBhcnQgPSBwYXJzZXIuZXhlYyhxdWVyeSkpIHtcbiAgICB2YXIga2V5ID0gZGVjb2RlKHBhcnRbMV0pXG4gICAgICAsIHZhbHVlID0gZGVjb2RlKHBhcnRbMl0pO1xuXG4gICAgLy9cbiAgICAvLyBQcmV2ZW50IG92ZXJyaWRpbmcgb2YgZXhpc3RpbmcgcHJvcGVydGllcy4gVGhpcyBlbnN1cmVzIHRoYXQgYnVpbGQtaW5cbiAgICAvLyBtZXRob2RzIGxpa2UgYHRvU3RyaW5nYCBvciBfX3Byb3RvX18gYXJlIG5vdCBvdmVycmlkZW4gYnkgbWFsaWNpb3VzXG4gICAgLy8gcXVlcnlzdHJpbmdzLlxuICAgIC8vXG4gICAgLy8gSW4gdGhlIGNhc2UgaWYgZmFpbGVkIGRlY29kaW5nLCB3ZSB3YW50IHRvIG9taXQgdGhlIGtleS92YWx1ZSBwYWlyc1xuICAgIC8vIGZyb20gdGhlIHJlc3VsdC5cbiAgICAvL1xuICAgIGlmIChrZXkgPT09IG51bGwgfHwgdmFsdWUgPT09IG51bGwgfHwga2V5IGluIHJlc3VsdCkgY29udGludWU7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIGEgcXVlcnkgc3RyaW5nIHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIE9iamVjdCB0aGF0IHNob3VsZCBiZSB0cmFuc2Zvcm1lZC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXggT3B0aW9uYWwgcHJlZml4LlxuICogQHJldHVybnMge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5naWZ5KG9iaiwgcHJlZml4KSB7XG4gIHByZWZpeCA9IHByZWZpeCB8fCAnJztcblxuICB2YXIgcGFpcnMgPSBbXVxuICAgICwgdmFsdWVcbiAgICAsIGtleTtcblxuICAvL1xuICAvLyBPcHRpb25hbGx5IHByZWZpeCB3aXRoIGEgJz8nIGlmIG5lZWRlZFxuICAvL1xuICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBwcmVmaXgpIHByZWZpeCA9ICc/JztcblxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzLmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICB2YWx1ZSA9IG9ialtrZXldO1xuXG4gICAgICAvL1xuICAgICAgLy8gRWRnZSBjYXNlcyB3aGVyZSB3ZSBhY3R1YWxseSB3YW50IHRvIGVuY29kZSB0aGUgdmFsdWUgdG8gYW4gZW1wdHlcbiAgICAgIC8vIHN0cmluZyBpbnN0ZWFkIG9mIHRoZSBzdHJpbmdpZmllZCB2YWx1ZS5cbiAgICAgIC8vXG4gICAgICBpZiAoIXZhbHVlICYmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWYgfHwgaXNOYU4odmFsdWUpKSkge1xuICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgfVxuXG4gICAgICBrZXkgPSBlbmNvZGUoa2V5KTtcbiAgICAgIHZhbHVlID0gZW5jb2RlKHZhbHVlKTtcblxuICAgICAgLy9cbiAgICAgIC8vIElmIHdlIGZhaWxlZCB0byBlbmNvZGUgdGhlIHN0cmluZ3MsIHdlIHNob3VsZCBiYWlsIG91dCBhcyB3ZSBkb24ndFxuICAgICAgLy8gd2FudCB0byBhZGQgaW52YWxpZCBzdHJpbmdzIHRvIHRoZSBxdWVyeS5cbiAgICAgIC8vXG4gICAgICBpZiAoa2V5ID09PSBudWxsIHx8IHZhbHVlID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIHBhaXJzLnB1c2goa2V5ICsnPScrIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFpcnMubGVuZ3RoID8gcHJlZml4ICsgcGFpcnMuam9pbignJicpIDogJyc7XG59XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5leHBvcnRzLnN0cmluZ2lmeSA9IHF1ZXJ5c3RyaW5naWZ5O1xuZXhwb3J0cy5wYXJzZSA9IHF1ZXJ5c3RyaW5nO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENoZWNrIGlmIHdlJ3JlIHJlcXVpcmVkIHRvIGFkZCBhIHBvcnQgbnVtYmVyLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly91cmwuc3BlYy53aGF0d2cub3JnLyNkZWZhdWx0LXBvcnRcbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gcG9ydCBQb3J0IG51bWJlciB3ZSBuZWVkIHRvIGNoZWNrXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2wgUHJvdG9jb2wgd2UgbmVlZCB0byBjaGVjayBhZ2FpbnN0LlxuICogQHJldHVybnMge0Jvb2xlYW59IElzIGl0IGEgZGVmYXVsdCBwb3J0IGZvciB0aGUgZ2l2ZW4gcHJvdG9jb2xcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlcXVpcmVkKHBvcnQsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wuc3BsaXQoJzonKVswXTtcbiAgcG9ydCA9ICtwb3J0O1xuXG4gIGlmICghcG9ydCkgcmV0dXJuIGZhbHNlO1xuXG4gIHN3aXRjaCAocHJvdG9jb2wpIHtcbiAgICBjYXNlICdodHRwJzpcbiAgICBjYXNlICd3cyc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDgwO1xuXG4gICAgY2FzZSAnaHR0cHMnOlxuICAgIGNhc2UgJ3dzcyc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDQ0MztcblxuICAgIGNhc2UgJ2Z0cCc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDIxO1xuXG4gICAgY2FzZSAnZ29waGVyJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gNzA7XG5cbiAgICBjYXNlICdmaWxlJzpcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcG9ydCAhPT0gMDtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxudmFyIF9pc1JlYWN0TmF0aXZlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9pc1JlYWN0TmF0aXZlXCIpKTtcblxudmFyIF91cmlUb0Jsb2IgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3VyaVRvQmxvYlwiKSk7XG5cbnZhciBfaXNDb3Jkb3ZhID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9pc0NvcmRvdmFcIikpO1xuXG52YXIgX3JlYWRBc0J5dGVBcnJheSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vcmVhZEFzQnl0ZUFycmF5XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG52YXIgRmlsZVNvdXJjZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIC8vIE1ha2UgdGhpcy5zaXplIGEgbWV0aG9kXG4gIGZ1bmN0aW9uIEZpbGVTb3VyY2UoZmlsZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlU291cmNlKTtcblxuICAgIHRoaXMuX2ZpbGUgPSBmaWxlO1xuICAgIHRoaXMuc2l6ZSA9IGZpbGUuc2l6ZTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhGaWxlU291cmNlLCBbe1xuICAgIGtleTogXCJzbGljZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzbGljZShzdGFydCwgZW5kKSB7XG4gICAgICAvLyBJbiBBcGFjaGUgQ29yZG92YSBhcHBsaWNhdGlvbnMsIGEgRmlsZSBtdXN0IGJlIHJlc29sdmVkIHVzaW5nXG4gICAgICAvLyBGaWxlUmVhZGVyIGluc3RhbmNlcywgc2VlXG4gICAgICAvLyBodHRwczovL2NvcmRvdmEuYXBhY2hlLm9yZy9kb2NzL2VuLzgueC9yZWZlcmVuY2UvY29yZG92YS1wbHVnaW4tZmlsZS9pbmRleC5odG1sI3JlYWQtYS1maWxlXG4gICAgICBpZiAoKDAsIF9pc0NvcmRvdmEuZGVmYXVsdCkoKSkge1xuICAgICAgICByZXR1cm4gKDAsIF9yZWFkQXNCeXRlQXJyYXkuZGVmYXVsdCkodGhpcy5fZmlsZS5zbGljZShzdGFydCwgZW5kKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuX2ZpbGUuc2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbG9zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZSgpIHsvLyBOb3RoaW5nIHRvIGRvIGhlcmUgc2luY2Ugd2UgZG9uJ3QgbmVlZCB0byByZWxlYXNlIGFueSByZXNvdXJjZXMuXG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEZpbGVTb3VyY2U7XG59KCk7XG5cbnZhciBTdHJlYW1Tb3VyY2UgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdHJlYW1Tb3VyY2UocmVhZGVyLCBjaHVua1NpemUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3RyZWFtU291cmNlKTtcblxuICAgIHRoaXMuX2NodW5rU2l6ZSA9IGNodW5rU2l6ZTtcbiAgICB0aGlzLl9idWZmZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fYnVmZmVyT2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9yZWFkZXIgPSByZWFkZXI7XG4gICAgdGhpcy5fZG9uZSA9IGZhbHNlO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFN0cmVhbVNvdXJjZSwgW3tcbiAgICBrZXk6IFwic2xpY2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCkge1xuICAgICAgaWYgKHN0YXJ0IDwgdGhpcy5fYnVmZmVyT2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJSZXF1ZXN0ZWQgZGF0YSBpcyBiZWZvcmUgdGhlIHJlYWRlcidzIGN1cnJlbnQgb2Zmc2V0XCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3JlYWRVbnRpbEVub3VnaERhdGFPckRvbmUoc3RhcnQsIGVuZCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9yZWFkVW50aWxFbm91Z2hEYXRhT3JEb25lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9yZWFkVW50aWxFbm91Z2hEYXRhT3JEb25lKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBoYXNFbm91Z2hEYXRhID0gZW5kIDw9IHRoaXMuX2J1ZmZlck9mZnNldCArIGxlbih0aGlzLl9idWZmZXIpO1xuXG4gICAgICBpZiAodGhpcy5fZG9uZSB8fCBoYXNFbm91Z2hEYXRhKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuX2dldERhdGFGcm9tQnVmZmVyKHN0YXJ0LCBlbmQpO1xuXG4gICAgICAgIHZhciBkb25lID0gdmFsdWUgPT0gbnVsbCA/IHRoaXMuX2RvbmUgOiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIGRvbmU6IGRvbmVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZWFkZXIucmVhZCgpLnRoZW4oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gX3JlZi52YWx1ZSxcbiAgICAgICAgICAgIGRvbmUgPSBfcmVmLmRvbmU7XG5cbiAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICBfdGhpcy5fZG9uZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoX3RoaXMuX2J1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgX3RoaXMuX2J1ZmZlciA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLl9idWZmZXIgPSBjb25jYXQoX3RoaXMuX2J1ZmZlciwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLl9yZWFkVW50aWxFbm91Z2hEYXRhT3JEb25lKHN0YXJ0LCBlbmQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9nZXREYXRhRnJvbUJ1ZmZlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0RGF0YUZyb21CdWZmZXIoc3RhcnQsIGVuZCkge1xuICAgICAgLy8gUmVtb3ZlIGRhdGEgZnJvbSBidWZmZXIgYmVmb3JlIGBzdGFydGAuXG4gICAgICAvLyBEYXRhIG1pZ2h0IGJlIHJlcmVhZCBmcm9tIHRoZSBidWZmZXIgaWYgYW4gdXBsb2FkIGZhaWxzLCBzbyB3ZSBjYW4gb25seVxuICAgICAgLy8gc2FmZWx5IGRlbGV0ZSBkYXRhIHdoZW4gaXQgY29tZXMgKmJlZm9yZSogd2hhdCBpcyBjdXJyZW50bHkgYmVpbmcgcmVhZC5cbiAgICAgIGlmIChzdGFydCA+IHRoaXMuX2J1ZmZlck9mZnNldCkge1xuICAgICAgICB0aGlzLl9idWZmZXIgPSB0aGlzLl9idWZmZXIuc2xpY2Uoc3RhcnQgLSB0aGlzLl9idWZmZXJPZmZzZXQpO1xuICAgICAgICB0aGlzLl9idWZmZXJPZmZzZXQgPSBzdGFydDtcbiAgICAgIH0gLy8gSWYgdGhlIGJ1ZmZlciBpcyBlbXB0eSBhZnRlciByZW1vdmluZyBvbGQgZGF0YSwgYWxsIGRhdGEgaGFzIGJlZW4gcmVhZC5cblxuXG4gICAgICB2YXIgaGFzQWxsRGF0YUJlZW5SZWFkID0gbGVuKHRoaXMuX2J1ZmZlcikgPT09IDA7XG5cbiAgICAgIGlmICh0aGlzLl9kb25lICYmIGhhc0FsbERhdGFCZWVuUmVhZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gLy8gV2UgYWxyZWFkeSByZW1vdmVkIGRhdGEgYmVmb3JlIGBzdGFydGAsIHNvIHdlIGp1c3QgcmV0dXJuIHRoZSBmaXJzdFxuICAgICAgLy8gY2h1bmsgZnJvbSB0aGUgYnVmZmVyLlxuXG5cbiAgICAgIHJldHVybiB0aGlzLl9idWZmZXIuc2xpY2UoMCwgZW5kIC0gc3RhcnQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbG9zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgIGlmICh0aGlzLl9yZWFkZXIuY2FuY2VsKSB7XG4gICAgICAgIHRoaXMuX3JlYWRlci5jYW5jZWwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU3RyZWFtU291cmNlO1xufSgpO1xuXG5mdW5jdGlvbiBsZW4oYmxvYk9yQXJyYXkpIHtcbiAgaWYgKGJsb2JPckFycmF5ID09PSB1bmRlZmluZWQpIHJldHVybiAwO1xuICBpZiAoYmxvYk9yQXJyYXkuc2l6ZSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gYmxvYk9yQXJyYXkuc2l6ZTtcbiAgcmV0dXJuIGJsb2JPckFycmF5Lmxlbmd0aDtcbn1cbi8qXG4gIFR5cGVkIGFycmF5cyBhbmQgYmxvYnMgZG9uJ3QgaGF2ZSBhIGNvbmNhdCBtZXRob2QuXG4gIFRoaXMgZnVuY3Rpb24gaGVscHMgU3RyZWFtU291cmNlIGFjY3VtdWxhdGUgZGF0YSB0byByZWFjaCBjaHVua1NpemUuXG4qL1xuXG5cbmZ1bmN0aW9uIGNvbmNhdChhLCBiKSB7XG4gIGlmIChhLmNvbmNhdCkge1xuICAgIC8vIElzIGBhYCBhbiBBcnJheT9cbiAgICByZXR1cm4gYS5jb25jYXQoYik7XG4gIH1cblxuICBpZiAoYSBpbnN0YW5jZW9mIEJsb2IpIHtcbiAgICByZXR1cm4gbmV3IEJsb2IoW2EsIGJdLCB7XG4gICAgICB0eXBlOiBhLnR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChhLnNldCkge1xuICAgIC8vIElzIGBhYCBhIHR5cGVkIGFycmF5P1xuICAgIHZhciBjID0gbmV3IGEuY29uc3RydWN0b3IoYS5sZW5ndGggKyBiLmxlbmd0aCk7XG4gICAgYy5zZXQoYSk7XG4gICAgYy5zZXQoYiwgYS5sZW5ndGgpO1xuICAgIHJldHVybiBjO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBkYXRhIHR5cGVcIik7XG59XG5cbnZhciBGaWxlUmVhZGVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRmlsZVJlYWRlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZVJlYWRlcik7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRmlsZVJlYWRlciwgW3tcbiAgICBrZXk6IFwib3BlbkZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbkZpbGUoaW5wdXQsIGNodW5rU2l6ZSkge1xuICAgICAgLy8gSW4gUmVhY3QgTmF0aXZlLCB3aGVuIHVzZXIgc2VsZWN0cyBhIGZpbGUsIGluc3RlYWQgb2YgYSBGaWxlIG9yIEJsb2IsXG4gICAgICAvLyB5b3UgdXN1YWxseSBnZXQgYSBmaWxlIG9iamVjdCB7fSB3aXRoIGEgdXJpIHByb3BlcnR5IHRoYXQgY29udGFpbnNcbiAgICAgIC8vIGEgbG9jYWwgcGF0aCB0byB0aGUgZmlsZS4gV2UgdXNlIFhNTEh0dHBSZXF1ZXN0IHRvIGZldGNoXG4gICAgICAvLyB0aGUgZmlsZSBibG9iLCBiZWZvcmUgdXBsb2FkaW5nIHdpdGggdHVzLlxuICAgICAgaWYgKCgwLCBfaXNSZWFjdE5hdGl2ZS5kZWZhdWx0KSgpICYmIGlucHV0ICYmIHR5cGVvZiBpbnB1dC51cmkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXJpVG9CbG9iLmRlZmF1bHQpKGlucHV0LnVyaSkudGhlbihmdW5jdGlvbiAoYmxvYikge1xuICAgICAgICAgIHJldHVybiBuZXcgRmlsZVNvdXJjZShibG9iKTtcbiAgICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHVzOiBjYW5ub3QgZmV0Y2ggYGZpbGUudXJpYCBhcyBCbG9iLCBtYWtlIHN1cmUgdGhlIHVyaSBpcyBjb3JyZWN0IGFuZCBhY2Nlc3NpYmxlLiBcIiArIGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSAvLyBTaW5jZSB3ZSBlbXVsYXRlIHRoZSBCbG9iIHR5cGUgaW4gb3VyIHRlc3RzIChub3QgYWxsIHRhcmdldCBicm93c2Vyc1xuICAgICAgLy8gc3VwcG9ydCBpdCksIHdlIGNhbm5vdCB1c2UgYGluc3RhbmNlb2ZgIGZvciB0ZXN0aW5nIHdoZXRoZXIgdGhlIGlucHV0IHZhbHVlXG4gICAgICAvLyBjYW4gYmUgaGFuZGxlZC4gSW5zdGVhZCwgd2Ugc2ltcGx5IGNoZWNrIGlzIHRoZSBzbGljZSgpIGZ1bmN0aW9uIGFuZCB0aGVcbiAgICAgIC8vIHNpemUgcHJvcGVydHkgYXJlIGF2YWlsYWJsZS5cblxuXG4gICAgICBpZiAodHlwZW9mIGlucHV0LnNsaWNlID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGlucHV0LnNpemUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgRmlsZVNvdXJjZShpbnB1dCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGlucHV0LnJlYWQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjaHVua1NpemUgPSArY2h1bmtTaXplO1xuXG4gICAgICAgIGlmICghaXNGaW5pdGUoY2h1bmtTaXplKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJjYW5ub3QgY3JlYXRlIHNvdXJjZSBmb3Igc3RyZWFtIHdpdGhvdXQgYSBmaW5pdGUgdmFsdWUgZm9yIHRoZSBgY2h1bmtTaXplYCBvcHRpb25cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgU3RyZWFtU291cmNlKGlucHV0LCBjaHVua1NpemUpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcInNvdXJjZSBvYmplY3QgbWF5IG9ubHkgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZSwgQmxvYiwgb3IgUmVhZGVyIGluIHRoaXMgZW52aXJvbm1lbnRcIikpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBGaWxlUmVhZGVyO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBGaWxlUmVhZGVyOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZmluZ2VycHJpbnQ7XG5cbnZhciBfaXNSZWFjdE5hdGl2ZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaXNSZWFjdE5hdGl2ZVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIFRPRE86IERpZmZlcmVuY2lhdGUgYmV0d2VlbiBpbnB1dCB0eXBlc1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgZmluZ2VycHJpbnQgZm9yIGEgZmlsZSB3aGljaCB3aWxsIGJlIHVzZWQgdGhlIHN0b3JlIHRoZSBlbmRwb2ludFxuICpcbiAqIEBwYXJhbSB7RmlsZX0gZmlsZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIGZpbmdlcnByaW50KGZpbGUsIG9wdGlvbnMpIHtcbiAgaWYgKCgwLCBfaXNSZWFjdE5hdGl2ZS5kZWZhdWx0KSgpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFjdE5hdGl2ZUZpbmdlcnByaW50KGZpbGUsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoW1widHVzLWJyXCIsIGZpbGUubmFtZSwgZmlsZS50eXBlLCBmaWxlLnNpemUsIGZpbGUubGFzdE1vZGlmaWVkLCBvcHRpb25zLmVuZHBvaW50XS5qb2luKFwiLVwiKSk7XG59XG5cbmZ1bmN0aW9uIHJlYWN0TmF0aXZlRmluZ2VycHJpbnQoZmlsZSwgb3B0aW9ucykge1xuICB2YXIgZXhpZkhhc2ggPSBmaWxlLmV4aWYgPyBoYXNoQ29kZShKU09OLnN0cmluZ2lmeShmaWxlLmV4aWYpKSA6IFwibm9leGlmXCI7XG4gIHJldHVybiBbXCJ0dXMtcm5cIiwgZmlsZS5uYW1lIHx8IFwibm9uYW1lXCIsIGZpbGUuc2l6ZSB8fCBcIm5vc2l6ZVwiLCBleGlmSGFzaCwgb3B0aW9ucy5lbmRwb2ludF0uam9pbihcIi9cIik7XG59XG5cbmZ1bmN0aW9uIGhhc2hDb2RlKHN0cikge1xuICAvLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODMxOTM3LzE1MTY2NlxuICB2YXIgaGFzaCA9IDA7XG5cbiAgaWYgKHN0ci5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gaGFzaDtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9jaGFyID0gc3RyLmNoYXJDb2RlQXQoaSk7XG5cbiAgICBoYXNoID0gKGhhc2ggPDwgNSkgLSBoYXNoICsgX2NoYXI7XG4gICAgaGFzaCA9IGhhc2ggJiBoYXNoOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIHJldHVybiBoYXNoO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG4vKiBnbG9iYWwgd2luZG93ICovXG5cblxudmFyIFhIUkh0dHBTdGFjayA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFhIUkh0dHBTdGFjaygpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgWEhSSHR0cFN0YWNrKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhYSFJIdHRwU3RhY2ssIFt7XG4gICAga2V5OiBcImNyZWF0ZVJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlUmVxdWVzdChtZXRob2QsIHVybCkge1xuICAgICAgcmV0dXJuIG5ldyBSZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXROYW1lKCkge1xuICAgICAgcmV0dXJuIFwiWEhSSHR0cFN0YWNrXCI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFhIUkh0dHBTdGFjaztcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gWEhSSHR0cFN0YWNrO1xuXG52YXIgUmVxdWVzdCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVxdWVzdCk7XG5cbiAgICB0aGlzLl94aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHRoaXMuX3hoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcblxuICAgIHRoaXMuX21ldGhvZCA9IG1ldGhvZDtcbiAgICB0aGlzLl91cmwgPSB1cmw7XG4gICAgdGhpcy5faGVhZGVycyA9IHt9O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFJlcXVlc3QsIFt7XG4gICAga2V5OiBcImdldE1ldGhvZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRNZXRob2QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWV0aG9kO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRVUkxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VVJMKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0SGVhZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldEhlYWRlcihoZWFkZXIsIHZhbHVlKSB7XG4gICAgICB0aGlzLl94aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHZhbHVlKTtcblxuICAgICAgdGhpcy5faGVhZGVyc1toZWFkZXJdID0gdmFsdWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEhlYWRlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRIZWFkZXIoaGVhZGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGVhZGVyc1toZWFkZXJdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRQcm9ncmVzc0hhbmRsZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0UHJvZ3Jlc3NIYW5kbGVyKHByb2dyZXNzSGFuZGxlcikge1xuICAgICAgLy8gVGVzdCBzdXBwb3J0IGZvciBwcm9ncmVzcyBldmVudHMgYmVmb3JlIGF0dGFjaGluZyBhbiBldmVudCBsaXN0ZW5lclxuICAgICAgaWYgKCEoXCJ1cGxvYWRcIiBpbiB0aGlzLl94aHIpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5feGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwcm9ncmVzc0hhbmRsZXIoZS5sb2FkZWQpO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2VuZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGJvZHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBfdGhpcy5feGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShfdGhpcy5feGhyKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgX3RoaXMuX3hoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIF90aGlzLl94aHIuc2VuZChib2R5KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhYm9ydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhYm9ydCgpIHtcbiAgICAgIHRoaXMuX3hoci5hYm9ydCgpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFVuZGVybHlpbmdPYmplY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VW5kZXJseWluZ09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJlcXVlc3Q7XG59KCk7XG5cbnZhciBSZXNwb25zZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlc3BvbnNlKHhocikge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZXNwb25zZSk7XG5cbiAgICB0aGlzLl94aHIgPSB4aHI7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUmVzcG9uc2UsIFt7XG4gICAga2V5OiBcImdldFN0YXR1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdGF0dXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5feGhyLnN0YXR1cztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0SGVhZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEhlYWRlcihoZWFkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoaGVhZGVyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0Qm9keVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCb2R5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3hoci5yZXNwb25zZVRleHQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFVuZGVybHlpbmdPYmplY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VW5kZXJseWluZ09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJlc3BvbnNlO1xufSgpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZW5hYmxlRGVidWdMb2dcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2xvZ2dlci5lbmFibGVEZWJ1Z0xvZztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjYW5TdG9yZVVSTHNcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX3VybFN0b3JhZ2UuY2FuU3RvcmVVUkxzO1xuICB9XG59KTtcbmV4cG9ydHMuaXNTdXBwb3J0ZWQgPSBleHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZXhwb3J0cy5VcGxvYWQgPSB2b2lkIDA7XG5cbnZhciBfdXBsb2FkID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vdXBsb2FkXCIpKTtcblxudmFyIF9ub29wVXJsU3RvcmFnZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL25vb3BVcmxTdG9yYWdlXCIpKTtcblxudmFyIF9sb2dnZXIgPSByZXF1aXJlKFwiLi4vbG9nZ2VyXCIpO1xuXG52YXIgX3VybFN0b3JhZ2UgPSByZXF1aXJlKFwiLi91cmxTdG9yYWdlXCIpO1xuXG52YXIgX2h0dHBTdGFjayA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaHR0cFN0YWNrXCIpKTtcblxudmFyIF9maWxlUmVhZGVyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9maWxlUmVhZGVyXCIpKTtcblxudmFyIF9maW5nZXJwcmludCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZmluZ2VycHJpbnRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgby5fX3Byb3RvX18gPSBwO1xuICAgIHJldHVybiBvO1xuICB9O1xuXG4gIHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICBpZiAoX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpKSB7XG4gICAgICB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yO1xuXG4gICAgICByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gIGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgcmV0dXJuIGNhbGw7XG4gIH1cblxuICByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlO1xuICBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlO1xuICBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlO1xuXG4gIHRyeSB7XG4gICAgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH07XG4gIHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7XG59XG5cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTtcbiAgICBpZiAoZW51bWVyYWJsZU9ubHkpIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTtcbiAgICB9KTtcbiAgICBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcblxuICAgIGlmIChpICUgMikge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG4vKiBnbG9iYWwgd2luZG93ICovXG5cblxudmFyIGRlZmF1bHRPcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgX3VwbG9hZC5kZWZhdWx0LmRlZmF1bHRPcHRpb25zLCB7XG4gIGh0dHBTdGFjazogbmV3IF9odHRwU3RhY2suZGVmYXVsdCgpLFxuICBmaWxlUmVhZGVyOiBuZXcgX2ZpbGVSZWFkZXIuZGVmYXVsdCgpLFxuICB1cmxTdG9yYWdlOiBfdXJsU3RvcmFnZS5jYW5TdG9yZVVSTHMgPyBuZXcgX3VybFN0b3JhZ2UuV2ViU3RvcmFnZVVybFN0b3JhZ2UoKSA6IG5ldyBfbm9vcFVybFN0b3JhZ2UuZGVmYXVsdCgpLFxuICBmaW5nZXJwcmludDogX2ZpbmdlcnByaW50LmRlZmF1bHRcbn0pO1xuXG5leHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG5cbnZhciBVcGxvYWQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9CYXNlVXBsb2FkKSB7XG4gIF9pbmhlcml0cyhVcGxvYWQsIF9CYXNlVXBsb2FkKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKFVwbG9hZCk7XG5cbiAgZnVuY3Rpb24gVXBsb2FkKCkge1xuICAgIHZhciBmaWxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBVcGxvYWQpO1xuXG4gICAgb3B0aW9ucyA9IF9vYmplY3RTcHJlYWQoe30sIGRlZmF1bHRPcHRpb25zLCB7fSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIGZpbGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFVwbG9hZCwgbnVsbCwgW3tcbiAgICBrZXk6IFwidGVybWluYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRlcm1pbmF0ZSh1cmwsIG9wdGlvbnMsIGNiKSB7XG4gICAgICBvcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgZGVmYXVsdE9wdGlvbnMsIHt9LCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBfdXBsb2FkLmRlZmF1bHQudGVybWluYXRlKHVybCwgb3B0aW9ucywgY2IpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBVcGxvYWQ7XG59KF91cGxvYWQuZGVmYXVsdCk7XG5cbmV4cG9ydHMuVXBsb2FkID0gVXBsb2FkO1xudmFyIF93aW5kb3cgPSB3aW5kb3csXG4gICAgWE1MSHR0cFJlcXVlc3QgPSBfd2luZG93LlhNTEh0dHBSZXF1ZXN0LFxuICAgIEJsb2IgPSBfd2luZG93LkJsb2I7XG52YXIgaXNTdXBwb3J0ZWQgPSBYTUxIdHRwUmVxdWVzdCAmJiBCbG9iICYmIHR5cGVvZiBCbG9iLnByb3RvdHlwZS5zbGljZSA9PT0gXCJmdW5jdGlvblwiO1xuZXhwb3J0cy5pc1N1cHBvcnRlZCA9IGlzU3VwcG9ydGVkOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgaXNDb3Jkb3ZhID0gZnVuY3Rpb24gaXNDb3Jkb3ZhKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPSBcInVuZGVmaW5lZFwiICYmICh0eXBlb2Ygd2luZG93LlBob25lR2FwICE9IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIHdpbmRvdy5Db3Jkb3ZhICE9IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIHdpbmRvdy5jb3Jkb3ZhICE9IFwidW5kZWZpbmVkXCIpO1xufTtcblxudmFyIF9kZWZhdWx0ID0gaXNDb3Jkb3ZhO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbnZhciBpc1JlYWN0TmF0aXZlID0gZnVuY3Rpb24gaXNSZWFjdE5hdGl2ZSgpIHtcbiAgcmV0dXJuIHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIG5hdmlnYXRvci5wcm9kdWN0ID09PSBcInN0cmluZ1wiICYmIG5hdmlnYXRvci5wcm9kdWN0LnRvTG93ZXJDYXNlKCkgPT09IFwicmVhY3RuYXRpdmVcIjtcbn07XG5cbnZhciBfZGVmYXVsdCA9IGlzUmVhY3ROYXRpdmU7XG5leHBvcnRzLmRlZmF1bHQgPSBfZGVmYXVsdDsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHJlYWRBc0J5dGVBcnJheTtcblxuLyoqXG4gKiByZWFkQXNCeXRlQXJyYXkgY29udmVydHMgYSBGaWxlIG9iamVjdCB0byBhIFVpbnQ4QXJyYXkuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZCBvbiB0aGUgQXBhY2hlIENvcmRvdmEgcGxhdGZvcm0uXG4gKiBTZWUgaHR0cHM6Ly9jb3Jkb3ZhLmFwYWNoZS5vcmcvZG9jcy9lbi9sYXRlc3QvcmVmZXJlbmNlL2NvcmRvdmEtcGx1Z2luLWZpbGUvaW5kZXguaHRtbCNyZWFkLWEtZmlsZVxuICovXG5mdW5jdGlvbiByZWFkQXNCeXRlQXJyYXkoY2h1bmspIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBuZXcgVWludDhBcnJheShyZWFkZXIucmVzdWx0KTtcbiAgICAgIHJlc29sdmUoe1xuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH07XG5cbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoY2h1bmspO1xuICB9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHVyaVRvQmxvYjtcblxuLyoqXG4gKiB1cmlUb0Jsb2IgcmVzb2x2ZXMgYSBVUkkgdG8gYSBCbG9iIG9iamVjdC4gVGhpcyBpcyB1c2VkIGZvclxuICogUmVhY3QgTmF0aXZlIHRvIHJldHJpZXZlIGEgZmlsZSAoaWRlbnRpZmllZCBieSBhIGZpbGU6Ly9cbiAqIFVSSSkgYXMgYSBibG9iLlxuICovXG5mdW5jdGlvbiB1cmlUb0Jsb2IodXJpKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSBcImJsb2JcIjtcblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYmxvYiA9IHhoci5yZXNwb25zZTtcbiAgICAgIHJlc29sdmUoYmxvYik7XG4gICAgfTtcblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfTtcblxuICAgIHhoci5vcGVuKFwiR0VUXCIsIHVyaSk7XG4gICAgeGhyLnNlbmQoKTtcbiAgfSk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLldlYlN0b3JhZ2VVcmxTdG9yYWdlID0gZXhwb3J0cy5jYW5TdG9yZVVSTHMgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cbi8qIGdsb2JhbCB3aW5kb3csIGxvY2FsU3RvcmFnZSAqL1xuXG5cbnZhciBoYXNTdG9yYWdlID0gZmFsc2U7XG5cbnRyeSB7XG4gIGhhc1N0b3JhZ2UgPSBcImxvY2FsU3RvcmFnZVwiIGluIHdpbmRvdzsgLy8gQXR0ZW1wdCB0byBzdG9yZSBhbmQgcmVhZCBlbnRyaWVzIGZyb20gdGhlIGxvY2FsIHN0b3JhZ2UgdG8gZGV0ZWN0IFByaXZhdGVcbiAgLy8gTW9kZSBvbiBTYWZhcmkgb24gaU9TIChzZWUgIzQ5KVxuXG4gIHZhciBrZXkgPSBcInR1c1N1cHBvcnRcIjtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcbn0gY2F0Y2ggKGUpIHtcbiAgLy8gSWYgd2UgdHJ5IHRvIGFjY2VzcyBsb2NhbFN0b3JhZ2UgaW5zaWRlIGEgc2FuZGJveGVkIGlmcmFtZSwgYSBTZWN1cml0eUVycm9yXG4gIC8vIGlzIHRocm93bi4gV2hlbiBpbiBwcml2YXRlIG1vZGUgb24gaU9TIFNhZmFyaSwgYSBRdW90YUV4Y2VlZGVkRXJyb3IgaXNcbiAgLy8gdGhyb3duIChzZWUgIzQ5KVxuICBpZiAoZS5jb2RlID09PSBlLlNFQ1VSSVRZX0VSUiB8fCBlLmNvZGUgPT09IGUuUVVPVEFfRVhDRUVERURfRVJSKSB7XG4gICAgaGFzU3RvcmFnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IGU7XG4gIH1cbn1cblxudmFyIGNhblN0b3JlVVJMcyA9IGhhc1N0b3JhZ2U7XG5leHBvcnRzLmNhblN0b3JlVVJMcyA9IGNhblN0b3JlVVJMcztcblxudmFyIFdlYlN0b3JhZ2VVcmxTdG9yYWdlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gV2ViU3RvcmFnZVVybFN0b3JhZ2UoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFdlYlN0b3JhZ2VVcmxTdG9yYWdlKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhXZWJTdG9yYWdlVXJsU3RvcmFnZSwgW3tcbiAgICBrZXk6IFwiZmluZEFsbFVwbG9hZHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmluZEFsbFVwbG9hZHMoKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IHRoaXMuX2ZpbmRFbnRyaWVzKFwidHVzOjpcIik7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpbmRVcGxvYWRzQnlGaW5nZXJwcmludFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kVXBsb2Fkc0J5RmluZ2VycHJpbnQoZmluZ2VycHJpbnQpIHtcbiAgICAgIHZhciByZXN1bHRzID0gdGhpcy5fZmluZEVudHJpZXMoXCJ0dXM6OlwiLmNvbmNhdChmaW5nZXJwcmludCwgXCI6OlwiKSk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZVVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVVcGxvYWQodXJsU3RvcmFnZUtleSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odXJsU3RvcmFnZUtleSk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZFVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRVcGxvYWQoZmluZ2VycHJpbnQsIHVwbG9hZCkge1xuICAgICAgdmFyIGlkID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxMik7XG4gICAgICB2YXIga2V5ID0gXCJ0dXM6OlwiLmNvbmNhdChmaW5nZXJwcmludCwgXCI6OlwiKS5jb25jYXQoaWQpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGxvYWQpKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoa2V5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2ZpbmRFbnRyaWVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9maW5kRW50cmllcyhwcmVmaXgpIHtcbiAgICAgIHZhciByZXN1bHRzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBfa2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcblxuICAgICAgICBpZiAoX2tleS5pbmRleE9mKHByZWZpeCkgIT09IDApIGNvbnRpbnVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHVwbG9hZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oX2tleSkpO1xuICAgICAgICAgIHVwbG9hZC51cmxTdG9yYWdlS2V5ID0gX2tleTtcbiAgICAgICAgICByZXN1bHRzLnB1c2godXBsb2FkKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgey8vIFRoZSBKU09OIHBhcnNlIGVycm9yIGlzIGludGVudGlvbmFsbHkgaWdub3JlZCBoZXJlLCBzbyBhIG1hbGZvcm1lZFxuICAgICAgICAgIC8vIGVudHJ5IGluIHRoZSBzdG9yYWdlIGNhbm5vdCBwcmV2ZW50IGFuIHVwbG9hZC5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gV2ViU3RvcmFnZVVybFN0b3JhZ2U7XG59KCk7XG5cbmV4cG9ydHMuV2ViU3RvcmFnZVVybFN0b3JhZ2UgPSBXZWJTdG9yYWdlVXJsU3RvcmFnZTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgaWYgKF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSkge1xuICAgICAgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjtcblxuICAgICAgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG59XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikge1xuICBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGY7XG59XG5cbmZ1bmN0aW9uIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpIHtcbiAgdmFyIF9jYWNoZSA9IHR5cGVvZiBNYXAgPT09IFwiZnVuY3Rpb25cIiA/IG5ldyBNYXAoKSA6IHVuZGVmaW5lZDtcblxuICBfd3JhcE5hdGl2ZVN1cGVyID0gZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykge1xuICAgIGlmIChDbGFzcyA9PT0gbnVsbCB8fCAhX2lzTmF0aXZlRnVuY3Rpb24oQ2xhc3MpKSByZXR1cm4gQ2xhc3M7XG5cbiAgICBpZiAodHlwZW9mIENsYXNzICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIF9jYWNoZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaWYgKF9jYWNoZS5oYXMoQ2xhc3MpKSByZXR1cm4gX2NhY2hlLmdldChDbGFzcyk7XG5cbiAgICAgIF9jYWNoZS5zZXQoQ2xhc3MsIFdyYXBwZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFdyYXBwZXIoKSB7XG4gICAgICByZXR1cm4gX2NvbnN0cnVjdChDbGFzcywgYXJndW1lbnRzLCBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3IpO1xuICAgIH1cblxuICAgIFdyYXBwZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGFzcy5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBXcmFwcGVyLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBfc2V0UHJvdG90eXBlT2YoV3JhcHBlciwgQ2xhc3MpO1xuICB9O1xuXG4gIHJldHVybiBfd3JhcE5hdGl2ZVN1cGVyKENsYXNzKTtcbn1cblxuZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7XG4gIGlmIChfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkpIHtcbiAgICBfY29uc3RydWN0ID0gUmVmbGVjdC5jb25zdHJ1Y3Q7XG4gIH0gZWxzZSB7XG4gICAgX2NvbnN0cnVjdCA9IGZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykge1xuICAgICAgdmFyIGEgPSBbbnVsbF07XG4gICAgICBhLnB1c2guYXBwbHkoYSwgYXJncyk7XG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSBGdW5jdGlvbi5iaW5kLmFwcGx5KFBhcmVudCwgYSk7XG4gICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTtcbiAgICAgIGlmIChDbGFzcykgX3NldFByb3RvdHlwZU9mKGluc3RhbmNlLCBDbGFzcy5wcm90b3R5cGUpO1xuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX2NvbnN0cnVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkge1xuICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7XG4gIGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7XG4gIGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7XG5cbiAgdHJ5IHtcbiAgICBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZUZ1bmN0aW9uKGZuKSB7XG4gIHJldHVybiBGdW5jdGlvbi50b1N0cmluZy5jYWxsKGZuKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSAhPT0gLTE7XG59XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gIF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH07XG4gIHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7XG59XG5cbnZhciBEZXRhaWxlZEVycm9yID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfRXJyb3IpIHtcbiAgX2luaGVyaXRzKERldGFpbGVkRXJyb3IsIF9FcnJvcik7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihEZXRhaWxlZEVycm9yKTtcblxuICBmdW5jdGlvbiBEZXRhaWxlZEVycm9yKG1lc3NhZ2UpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICB2YXIgY2F1c2luZ0VyciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICB2YXIgcmVxID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuICAgIHZhciByZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IG51bGw7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGV0YWlsZWRFcnJvcik7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuICAgIF90aGlzLm9yaWdpbmFsUmVxdWVzdCA9IHJlcTtcbiAgICBfdGhpcy5vcmlnaW5hbFJlc3BvbnNlID0gcmVzO1xuICAgIF90aGlzLmNhdXNpbmdFcnJvciA9IGNhdXNpbmdFcnI7XG5cbiAgICBpZiAoY2F1c2luZ0VyciAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlICs9IFwiLCBjYXVzZWQgYnkgXCIuY29uY2F0KGNhdXNpbmdFcnIudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcSAhPSBudWxsKSB7XG4gICAgICB2YXIgcmVxdWVzdElkID0gcmVxLmdldEhlYWRlcihcIlgtUmVxdWVzdC1JRFwiKSB8fCBcIm4vYVwiO1xuICAgICAgdmFyIG1ldGhvZCA9IHJlcS5nZXRNZXRob2QoKTtcbiAgICAgIHZhciB1cmwgPSByZXEuZ2V0VVJMKCk7XG4gICAgICB2YXIgc3RhdHVzID0gcmVzID8gcmVzLmdldFN0YXR1cygpIDogXCJuL2FcIjtcbiAgICAgIHZhciBib2R5ID0gcmVzID8gcmVzLmdldEJvZHkoKSB8fCBcIlwiIDogXCJuL2FcIjtcbiAgICAgIG1lc3NhZ2UgKz0gXCIsIG9yaWdpbmF0ZWQgZnJvbSByZXF1ZXN0IChtZXRob2Q6IFwiLmNvbmNhdChtZXRob2QsIFwiLCB1cmw6IFwiKS5jb25jYXQodXJsLCBcIiwgcmVzcG9uc2UgY29kZTogXCIpLmNvbmNhdChzdGF0dXMsIFwiLCByZXNwb25zZSB0ZXh0OiBcIikuY29uY2F0KGJvZHksIFwiLCByZXF1ZXN0IGlkOiBcIikuY29uY2F0KHJlcXVlc3RJZCwgXCIpXCIpO1xuICAgIH1cblxuICAgIF90aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIHJldHVybiBEZXRhaWxlZEVycm9yO1xufSggLyojX19QVVJFX18qL193cmFwTmF0aXZlU3VwZXIoRXJyb3IpKTtcblxudmFyIF9kZWZhdWx0ID0gRGV0YWlsZWRFcnJvcjtcbmV4cG9ydHMuZGVmYXVsdCA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5lbmFibGVEZWJ1Z0xvZyA9IGVuYWJsZURlYnVnTG9nO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5cbi8qIGVzbGludCBuby1jb25zb2xlOiBcIm9mZlwiICovXG52YXIgaXNFbmFibGVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGVuYWJsZURlYnVnTG9nKCkge1xuICBpc0VuYWJsZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBsb2cobXNnKSB7XG4gIGlmICghaXNFbmFibGVkKSByZXR1cm47XG4gIGNvbnNvbGUubG9nKG1zZyk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogXCJvZmZcIiAqL1xuXG5cbnZhciBOb29wVXJsU3RvcmFnZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE5vb3BVcmxTdG9yYWdlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBOb29wVXJsU3RvcmFnZSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoTm9vcFVybFN0b3JhZ2UsIFt7XG4gICAga2V5OiBcImxpc3RBbGxVcGxvYWRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3RBbGxVcGxvYWRzKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpbmRVcGxvYWRzQnlGaW5nZXJwcmludFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kVXBsb2Fkc0J5RmluZ2VycHJpbnQoZmluZ2VycHJpbnQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlVXBsb2FkKHVybFN0b3JhZ2VLZXkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFVwbG9hZChmaW5nZXJwcmludCwgdXBsb2FkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBOb29wVXJsU3RvcmFnZTtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gTm9vcFVybFN0b3JhZ2U7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbnZhciBfZXJyb3IgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Vycm9yXCIpKTtcblxudmFyIF91dWlkID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91dWlkXCIpKTtcblxudmFyIF9qc0Jhc2UgPSByZXF1aXJlKFwianMtYmFzZTY0XCIpO1xuXG52YXIgX3VybFBhcnNlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwidXJsLXBhcnNlXCIpKTtcblxudmFyIF9sb2dnZXIgPSByZXF1aXJlKFwiLi9sb2dnZXJcIik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTtcbiAgICBpZiAoZW51bWVyYWJsZU9ubHkpIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTtcbiAgICB9KTtcbiAgICBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcblxuICAgIGlmIChpICUgMikge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cbi8qIGdsb2JhbCB3aW5kb3cgKi9cblxuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGVuZHBvaW50OiBudWxsLFxuICB1cGxvYWRVcmw6IG51bGwsXG4gIG1ldGFkYXRhOiB7fSxcbiAgZmluZ2VycHJpbnQ6IG51bGwsXG4gIHVwbG9hZFNpemU6IG51bGwsXG4gIG9uUHJvZ3Jlc3M6IG51bGwsXG4gIG9uQ2h1bmtDb21wbGV0ZTogbnVsbCxcbiAgb25TdWNjZXNzOiBudWxsLFxuICBvbkVycm9yOiBudWxsLFxuICBfb25VcGxvYWRVcmxBdmFpbGFibGU6IG51bGwsXG4gIG92ZXJyaWRlUGF0Y2hNZXRob2Q6IGZhbHNlLFxuICBoZWFkZXJzOiB7fSxcbiAgYWRkUmVxdWVzdElkOiBmYWxzZSxcbiAgb25CZWZvcmVSZXF1ZXN0OiBudWxsLFxuICBvbkFmdGVyUmVzcG9uc2U6IG51bGwsXG4gIGNodW5rU2l6ZTogSW5maW5pdHksXG4gIHJldHJ5RGVsYXlzOiBbMCwgMTAwMCwgMzAwMCwgNTAwMF0sXG4gIHBhcmFsbGVsVXBsb2FkczogMSxcbiAgc3RvcmVGaW5nZXJwcmludEZvclJlc3VtaW5nOiB0cnVlLFxuICByZW1vdmVGaW5nZXJwcmludE9uU3VjY2VzczogZmFsc2UsXG4gIHVwbG9hZExlbmd0aERlZmVycmVkOiBmYWxzZSxcbiAgdXBsb2FkRGF0YUR1cmluZ0NyZWF0aW9uOiBmYWxzZSxcbiAgdXJsU3RvcmFnZTogbnVsbCxcbiAgZmlsZVJlYWRlcjogbnVsbCxcbiAgaHR0cFN0YWNrOiBudWxsXG59O1xuXG52YXIgQmFzZVVwbG9hZCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJhc2VVcGxvYWQoZmlsZSwgb3B0aW9ucykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCYXNlVXBsb2FkKTsgLy8gV2FybiBhYm91dCByZW1vdmVkIG9wdGlvbnMgZnJvbSBwcmV2aW91cyB2ZXJzaW9uc1xuXG5cbiAgICBpZiAoXCJyZXN1bWVcIiBpbiBvcHRpb25zKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInR1czogVGhlIGByZXN1bWVgIG9wdGlvbiBoYXMgYmVlbiByZW1vdmVkIGluIHR1cy1qcy1jbGllbnQgdjIuIFBsZWFzZSB1c2UgdGhlIFVSTCBzdG9yYWdlIEFQSSBpbnN0ZWFkLlwiKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgfSAvLyBUaGUgZGVmYXVsdCBvcHRpb25zIHdpbGwgYWxyZWFkeSBiZSBhZGRlZCBmcm9tIHRoZSB3cmFwcGVyIGNsYXNzZXMuXG5cblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7IC8vIFRoZSBzdG9yYWdlIG1vZHVsZSB1c2VkIHRvIHN0b3JlIFVSTHNcblxuICAgIHRoaXMuX3VybFN0b3JhZ2UgPSB0aGlzLm9wdGlvbnMudXJsU3RvcmFnZTsgLy8gVGhlIHVuZGVybHlpbmcgRmlsZS9CbG9iIG9iamVjdFxuXG4gICAgdGhpcy5maWxlID0gZmlsZTsgLy8gVGhlIFVSTCBhZ2FpbnN0IHdoaWNoIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWRcblxuICAgIHRoaXMudXJsID0gbnVsbDsgLy8gVGhlIHVuZGVybHlpbmcgcmVxdWVzdCBvYmplY3QgZm9yIHRoZSBjdXJyZW50IFBBVENIIHJlcXVlc3RcblxuICAgIHRoaXMuX3JlcSA9IG51bGw7IC8vIFRoZSBmaW5nZXJwaW5ydCBmb3IgdGhlIGN1cnJlbnQgZmlsZSAoc2V0IGFmdGVyIHN0YXJ0KCkpXG5cbiAgICB0aGlzLl9maW5nZXJwcmludCA9IG51bGw7IC8vIFRoZSBrZXkgdGhhdCB0aGUgVVJMIHN0b3JhZ2UgcmV0dXJuZWQgd2hlbiBzYXZpbmcgYW4gVVJMIHdpdGggYSBmaW5nZXJwcmludCxcblxuICAgIHRoaXMuX3VybFN0b3JhZ2VLZXkgPSBudWxsOyAvLyBUaGUgb2Zmc2V0IHVzZWQgaW4gdGhlIGN1cnJlbnQgUEFUQ0ggcmVxdWVzdFxuXG4gICAgdGhpcy5fb2Zmc2V0ID0gbnVsbDsgLy8gVHJ1ZSBpZiB0aGUgY3VycmVudCBQQVRDSCByZXF1ZXN0IGhhcyBiZWVuIGFib3J0ZWRcblxuICAgIHRoaXMuX2Fib3J0ZWQgPSBmYWxzZTsgLy8gVGhlIGZpbGUncyBzaXplIGluIGJ5dGVzXG5cbiAgICB0aGlzLl9zaXplID0gbnVsbDsgLy8gVGhlIFNvdXJjZSBvYmplY3Qgd2hpY2ggd2lsbCB3cmFwIGFyb3VuZCB0aGUgZ2l2ZW4gZmlsZSBhbmQgcHJvdmlkZXMgdXNcbiAgICAvLyB3aXRoIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGdldHRpbmcgaXRzIHNpemUgYW5kIHNsaWNlIGNodW5rcyBmcm9tIGl0c1xuICAgIC8vIGNvbnRlbnQgYWxsb3dpbmcgdXMgdG8gZWFzaWx5IGhhbmRsZSBGaWxlcywgQmxvYnMsIEJ1ZmZlcnMgYW5kIFN0cmVhbXMuXG5cbiAgICB0aGlzLl9zb3VyY2UgPSBudWxsOyAvLyBUaGUgY3VycmVudCBjb3VudCBvZiBhdHRlbXB0cyB3aGljaCBoYXZlIGJlZW4gbWFkZS4gWmVybyBpbmRpY2F0ZXMgbm9uZS5cblxuICAgIHRoaXMuX3JldHJ5QXR0ZW1wdCA9IDA7IC8vIFRoZSB0aW1lb3V0J3MgSUQgd2hpY2ggaXMgdXNlZCB0byBkZWxheSB0aGUgbmV4dCByZXRyeVxuXG4gICAgdGhpcy5fcmV0cnlUaW1lb3V0ID0gbnVsbDsgLy8gVGhlIG9mZnNldCBvZiB0aGUgcmVtb3RlIHVwbG9hZCBiZWZvcmUgdGhlIGxhdGVzdCBhdHRlbXB0IHdhcyBzdGFydGVkLlxuXG4gICAgdGhpcy5fb2Zmc2V0QmVmb3JlUmV0cnkgPSAwOyAvLyBBbiBhcnJheSBvZiBCYXNlVXBsb2FkIGluc3RhbmNlcyB3aGljaCBhcmUgdXNlZCBmb3IgdXBsb2FkaW5nIHRoZSBkaWZmZXJlbnRcbiAgICAvLyBwYXJ0cywgaWYgdGhlIHBhcmFsbGVsVXBsb2FkcyBvcHRpb24gaXMgdXNlZC5cblxuICAgIHRoaXMuX3BhcmFsbGVsVXBsb2FkcyA9IG51bGw7IC8vIEFuIGFycmF5IG9mIHVwbG9hZCBVUkxzIHdoaWNoIGFyZSB1c2VkIGZvciB1cGxvYWRpbmcgdGhlIGRpZmZlcmVudFxuICAgIC8vIHBhcnRzLCBpZiB0aGUgcGFyYWxsZWxVcGxvYWRzIG9wdGlvbiBpcyB1c2VkLlxuXG4gICAgdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzID0gbnVsbDtcbiAgfVxuICAvKipcbiAgICogVXNlIHRoZSBUZXJtaW5hdGlvbiBleHRlbnNpb24gdG8gZGVsZXRlIGFuIHVwbG9hZCBmcm9tIHRoZSBzZXJ2ZXIgYnkgc2VuZGluZyBhIERFTEVURVxuICAgKiByZXF1ZXN0IHRvIHRoZSBzcGVjaWZpZWQgdXBsb2FkIFVSTC4gVGhpcyBpcyBvbmx5IHBvc3NpYmxlIGlmIHRoZSBzZXJ2ZXIgc3VwcG9ydHMgdGhlXG4gICAqIFRlcm1pbmF0aW9uIGV4dGVuc2lvbi4gSWYgdGhlIGBvcHRpb25zLnJldHJ5RGVsYXlzYCBwcm9wZXJ0eSBpcyBzZXQsIHRoZSBtZXRob2Qgd2lsbFxuICAgKiBhbHNvIHJldHJ5IGlmIGFuIGVycm9yIG9jdXJycy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgdXBsb2FkJ3MgVVJMIHdoaWNoIHdpbGwgYmUgdGVybWluYXRlZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgT3B0aW9uYWwgb3B0aW9ucyBmb3IgaW5mbHVlbmNpbmcgSFRUUCByZXF1ZXN0cy5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2Ugd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSByZXF1ZXN0cyBmaW5pc2guXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKEJhc2VVcGxvYWQsIFt7XG4gICAga2V5OiBcImZpbmRQcmV2aW91c1VwbG9hZHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmluZFByZXZpb3VzVXBsb2FkcygpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmluZ2VycHJpbnQodGhpcy5maWxlLCB0aGlzLm9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGZpbmdlcnByaW50KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5fdXJsU3RvcmFnZS5maW5kVXBsb2Fkc0J5RmluZ2VycHJpbnQoZmluZ2VycHJpbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc3VtZUZyb21QcmV2aW91c1VwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXN1bWVGcm9tUHJldmlvdXNVcGxvYWQocHJldmlvdXNVcGxvYWQpIHtcbiAgICAgIHRoaXMudXJsID0gcHJldmlvdXNVcGxvYWQudXBsb2FkVXJsIHx8IG51bGw7XG4gICAgICB0aGlzLl9wYXJhbGxlbFVwbG9hZFVybHMgPSBwcmV2aW91c1VwbG9hZC5wYXJhbGxlbFVwbG9hZFVybHMgfHwgbnVsbDtcbiAgICAgIHRoaXMuX3VybFN0b3JhZ2VLZXkgPSBwcmV2aW91c1VwbG9hZC51cmxTdG9yYWdlS2V5O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdGFydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgZmlsZSA9IHRoaXMuZmlsZTtcblxuICAgICAgaWYgKCFmaWxlKSB7XG4gICAgICAgIHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IoXCJ0dXM6IG5vIGZpbGUgb3Igc3RyZWFtIHRvIHVwbG9hZCBwcm92aWRlZFwiKSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbmRwb2ludCAmJiAhdGhpcy5vcHRpb25zLnVwbG9hZFVybCkge1xuICAgICAgICB0aGlzLl9lbWl0RXJyb3IobmV3IEVycm9yKFwidHVzOiBuZWl0aGVyIGFuIGVuZHBvaW50IG9yIGFuIHVwbG9hZCBVUkwgaXMgcHJvdmlkZWRcIikpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJldHJ5RGVsYXlzID0gdGhpcy5vcHRpb25zLnJldHJ5RGVsYXlzO1xuXG4gICAgICBpZiAocmV0cnlEZWxheXMgIT0gbnVsbCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocmV0cnlEZWxheXMpICE9PSBcIltvYmplY3QgQXJyYXldXCIpIHtcbiAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogdGhlIGByZXRyeURlbGF5c2Agb3B0aW9uIG11c3QgZWl0aGVyIGJlIGFuIGFycmF5IG9yIG51bGxcIikpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYXJhbGxlbFVwbG9hZHMgPiAxKSB7XG4gICAgICAgIC8vIFRlc3Qgd2hpY2ggb3B0aW9ucyBhcmUgaW5jb21wYXRpYmxlIHdpdGggcGFyYWxsZWwgdXBsb2Fkcy5cbiAgICAgICAgW1widXBsb2FkVXJsXCIsIFwidXBsb2FkU2l6ZVwiLCBcInVwbG9hZExlbmd0aERlZmVycmVkXCJdLmZvckVhY2goZnVuY3Rpb24gKG9wdGlvbk5hbWUpIHtcbiAgICAgICAgICBpZiAoX3RoaXMyLm9wdGlvbnNbb3B0aW9uTmFtZV0pIHtcbiAgICAgICAgICAgIF90aGlzMi5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogY2Fubm90IHVzZSB0aGUgXCIuY29uY2F0KG9wdGlvbk5hbWUsIFwiIG9wdGlvbiB3aGVuIHBhcmFsbGVsVXBsb2FkcyBpcyBlbmFibGVkXCIpKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmZpbmdlcnByaW50KGZpbGUsIHRoaXMub3B0aW9ucykudGhlbihmdW5jdGlvbiAoZmluZ2VycHJpbnQpIHtcbiAgICAgICAgaWYgKGZpbmdlcnByaW50ID09IG51bGwpIHtcbiAgICAgICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiTm8gZmluZ2VycHJpbnQgd2FzIGNhbGN1bGF0ZWQgbWVhbmluZyB0aGF0IHRoZSB1cGxvYWQgY2Fubm90IGJlIHN0b3JlZCBpbiB0aGUgVVJMIHN0b3JhZ2UuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICgwLCBfbG9nZ2VyLmxvZykoXCJDYWxjdWxhdGVkIGZpbmdlcnByaW50OiBcIi5jb25jYXQoZmluZ2VycHJpbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMi5fZmluZ2VycHJpbnQgPSBmaW5nZXJwcmludDtcblxuICAgICAgICBpZiAoX3RoaXMyLl9zb3VyY2UpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMyLl9zb3VyY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzMi5vcHRpb25zLmZpbGVSZWFkZXIub3BlbkZpbGUoZmlsZSwgX3RoaXMyLm9wdGlvbnMuY2h1bmtTaXplKTtcbiAgICAgICAgfVxuICAgICAgfSkudGhlbihmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICAgIF90aGlzMi5fc291cmNlID0gc291cmNlOyAvLyBJZiB0aGUgdXBsb2FkIHdhcyBjb25maWd1cmVkIHRvIHVzZSBtdWx0aXBsZSByZXF1ZXN0cyBvciBpZiB3ZSByZXN1bWUgZnJvbVxuICAgICAgICAvLyBhbiB1cGxvYWQgd2hpY2ggdXNlZCBtdWx0aXBsZSByZXF1ZXN0cywgd2Ugc3RhcnQgYSBwYXJhbGxlbCB1cGxvYWQuXG5cbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLnBhcmFsbGVsVXBsb2FkcyA+IDEgfHwgX3RoaXMyLl9wYXJhbGxlbFVwbG9hZFVybHMgIT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzMi5fc3RhcnRQYXJhbGxlbFVwbG9hZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzMi5fc3RhcnRTaW5nbGVVcGxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMi5fZW1pdEVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5pdGlhdGUgdGhlIHVwbG9hZGluZyBwcm9jZWR1cmUgZm9yIGEgcGFyYWxsZWxpemVkIHVwbG9hZCwgd2hlcmUgb25lIGZpbGUgaXMgc3BsaXQgaW50b1xuICAgICAqIG11bHRpcGxlIHJlcXVlc3Qgd2hpY2ggYXJlIHJ1biBpbiBwYXJhbGxlbC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3N0YXJ0UGFyYWxsZWxVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3N0YXJ0UGFyYWxsZWxVcGxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIHRvdGFsU2l6ZSA9IHRoaXMuX3NpemUgPSB0aGlzLl9zb3VyY2Uuc2l6ZTtcbiAgICAgIHZhciB0b3RhbFByb2dyZXNzID0gMDtcbiAgICAgIHRoaXMuX3BhcmFsbGVsVXBsb2FkcyA9IFtdO1xuICAgICAgdmFyIHBhcnRDb3VudCA9IHRoaXMuX3BhcmFsbGVsVXBsb2FkVXJscyAhPSBudWxsID8gdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzLmxlbmd0aCA6IHRoaXMub3B0aW9ucy5wYXJhbGxlbFVwbG9hZHM7IC8vIFRoZSBpbnB1dCBmaWxlIHdpbGwgYmUgc3BsaXQgaW50byBtdWx0aXBsZSBzbGljZXMgd2hpY2ggYXJlIHVwbG9hZGVkIGluIHNlcGFyYXRlXG4gICAgICAvLyByZXF1ZXN0cy4gSGVyZSB3ZSBnZW5lcmF0ZSB0aGUgc3RhcnQgYW5kIGVuZCBwb3NpdGlvbiBmb3IgdGhlIHNsaWNlcy5cblxuICAgICAgdmFyIHBhcnRzID0gc3BsaXRTaXplSW50b1BhcnRzKHRoaXMuX3NvdXJjZS5zaXplLCBwYXJ0Q291bnQsIHRoaXMuX3BhcmFsbGVsVXBsb2FkVXJscyk7IC8vIENyZWF0ZSBhbiBlbXB0eSBsaXN0IGZvciBzdG9yaW5nIHRoZSB1cGxvYWQgVVJMc1xuXG4gICAgICB0aGlzLl9wYXJhbGxlbFVwbG9hZFVybHMgPSBuZXcgQXJyYXkocGFydHMubGVuZ3RoKTsgLy8gR2VuZXJhdGUgYSBwcm9taXNlIGZvciBlYWNoIHNsaWNlIHRoYXQgd2lsbCBiZSByZXNvbHZlIGlmIHRoZSByZXNwZWN0aXZlXG4gICAgICAvLyB1cGxvYWQgaXMgY29tcGxldGVkLlxuXG4gICAgICB2YXIgdXBsb2FkcyA9IHBhcnRzLm1hcChmdW5jdGlvbiAocGFydCwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGxhc3RQYXJ0UHJvZ3Jlc3MgPSAwO1xuICAgICAgICByZXR1cm4gX3RoaXMzLl9zb3VyY2Uuc2xpY2UocGFydC5zdGFydCwgcGFydC5lbmQpLnRoZW4oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBfcmVmLnZhbHVlO1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAvLyBNZXJnZSB3aXRoIHRoZSB1c2VyIHN1cHBsaWVkIG9wdGlvbnMgYnV0IG92ZXJ3cml0ZSBzb21lIHZhbHVlcy5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgX3RoaXMzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgLy8gSWYgYXZhaWxhYmxlLCB0aGUgcGFydGlhbCB1cGxvYWQgc2hvdWxkIGJlIHJlc3VtZWQgZnJvbSBhIHByZXZpb3VzIFVSTC5cbiAgICAgICAgICAgICAgdXBsb2FkVXJsOiBwYXJ0LnVwbG9hZFVybCB8fCBudWxsLFxuICAgICAgICAgICAgICAvLyBXZSB0YWtlIG1hbnVhbGx5IGNhcmUgb2YgcmVzdW1pbmcgZm9yIHBhcnRpYWwgdXBsb2Fkcywgc28gdGhleSBzaG91bGRcbiAgICAgICAgICAgICAgLy8gbm90IGJlIHN0b3JlZCBpbiB0aGUgVVJMIHN0b3JhZ2UuXG4gICAgICAgICAgICAgIHN0b3JlRmluZ2VycHJpbnRGb3JSZXN1bWluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHJlbW92ZUZpbmdlcnByaW50T25TdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHBhcmFsbGVsVXBsb2FkcyBvcHRpb24gdG8gbm90IGNhdXNlIHJlY3Vyc2lvbi5cbiAgICAgICAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAxLFxuICAgICAgICAgICAgICBtZXRhZGF0YToge30sXG4gICAgICAgICAgICAgIC8vIEFkZCB0aGUgaGVhZGVyIHRvIGluZGljYXRlIHRoZSB0aGlzIGlzIGEgcGFydGlhbCB1cGxvYWQuXG4gICAgICAgICAgICAgIGhlYWRlcnM6IF9vYmplY3RTcHJlYWQoe30sIF90aGlzMy5vcHRpb25zLmhlYWRlcnMsIHtcbiAgICAgICAgICAgICAgICBcIlVwbG9hZC1Db25jYXRcIjogXCJwYXJ0aWFsXCJcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIC8vIFJlamVjdCBvciByZXNvbHZlIHRoZSBwcm9taXNlIGlmIHRoZSB1cGxvYWQgZXJyb3JzIG9yIGNvbXBsZXRlcy5cbiAgICAgICAgICAgICAgb25TdWNjZXNzOiByZXNvbHZlLFxuICAgICAgICAgICAgICBvbkVycm9yOiByZWplY3QsXG4gICAgICAgICAgICAgIC8vIEJhc2VkIGluIHRoZSBwcm9ncmVzcyBmb3IgdGhpcyBwYXJ0aWFsIHVwbG9hZCwgY2FsY3VsYXRlIHRoZSBwcm9ncmVzc1xuICAgICAgICAgICAgICAvLyBmb3IgdGhlIGVudGlyZSBmaW5hbCB1cGxvYWQuXG4gICAgICAgICAgICAgIG9uUHJvZ3Jlc3M6IGZ1bmN0aW9uIG9uUHJvZ3Jlc3MobmV3UGFydFByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgdG90YWxQcm9ncmVzcyA9IHRvdGFsUHJvZ3Jlc3MgLSBsYXN0UGFydFByb2dyZXNzICsgbmV3UGFydFByb2dyZXNzO1xuICAgICAgICAgICAgICAgIGxhc3RQYXJ0UHJvZ3Jlc3MgPSBuZXdQYXJ0UHJvZ3Jlc3M7XG5cbiAgICAgICAgICAgICAgICBfdGhpczMuX2VtaXRQcm9ncmVzcyh0b3RhbFByb2dyZXNzLCB0b3RhbFNpemUpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAvLyBXYWl0IHVudGlsIGV2ZXJ5IHBhcnRpYWwgdXBsb2FkIGhhcyBhbiB1cGxvYWQgVVJMLCBzbyB3ZSBjYW4gYWRkXG4gICAgICAgICAgICAgIC8vIHRoZW0gdG8gdGhlIFVSTCBzdG9yYWdlLlxuICAgICAgICAgICAgICBfb25VcGxvYWRVcmxBdmFpbGFibGU6IGZ1bmN0aW9uIF9vblVwbG9hZFVybEF2YWlsYWJsZSgpIHtcbiAgICAgICAgICAgICAgICBfdGhpczMuX3BhcmFsbGVsVXBsb2FkVXJsc1tpbmRleF0gPSB1cGxvYWQudXJsOyAvLyBUZXN0IGlmIGFsbCB1cGxvYWRzIGhhdmUgcmVjZWl2ZWQgYW4gVVJMXG5cbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMzLl9wYXJhbGxlbFVwbG9hZFVybHMuZmlsdGVyKGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gISF1O1xuICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA9PT0gcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczMuX3NhdmVVcGxvYWRJblVybFN0b3JhZ2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkID0gbmV3IEJhc2VVcGxvYWQodmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdXBsb2FkLnN0YXJ0KCk7IC8vIFN0b3JlIHRoZSB1cGxvYWQgaW4gYW4gYXJyYXksIHNvIHdlIGNhbiBsYXRlciBhYm9ydCB0aGVtIGlmIG5lY2Vzc2FyeS5cblxuICAgICAgICAgICAgX3RoaXMzLl9wYXJhbGxlbFVwbG9hZHMucHVzaCh1cGxvYWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgdmFyIHJlcTsgLy8gV2FpdCB1bnRpbCBhbGwgcGFydGlhbCB1cGxvYWRzIGFyZSBmaW5pc2hlZCBhbmQgd2UgY2FuIHNlbmQgdGhlIFBPU1QgcmVxdWVzdCBmb3JcbiAgICAgIC8vIGNyZWF0aW5nIHRoZSBmaW5hbCB1cGxvYWQuXG5cbiAgICAgIFByb21pc2UuYWxsKHVwbG9hZHMpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICByZXEgPSBfdGhpczMuX29wZW5SZXF1ZXN0KFwiUE9TVFwiLCBfdGhpczMub3B0aW9ucy5lbmRwb2ludCk7XG4gICAgICAgIHJlcS5zZXRIZWFkZXIoXCJVcGxvYWQtQ29uY2F0XCIsIFwiZmluYWw7XCIuY29uY2F0KF90aGlzMy5fcGFyYWxsZWxVcGxvYWRVcmxzLmpvaW4oXCIgXCIpKSk7IC8vIEFkZCBtZXRhZGF0YSBpZiB2YWx1ZXMgaGF2ZSBiZWVuIGFkZGVkXG5cbiAgICAgICAgdmFyIG1ldGFkYXRhID0gZW5jb2RlTWV0YWRhdGEoX3RoaXMzLm9wdGlvbnMubWV0YWRhdGEpO1xuXG4gICAgICAgIGlmIChtZXRhZGF0YSAhPT0gXCJcIikge1xuICAgICAgICAgIHJlcS5zZXRIZWFkZXIoXCJVcGxvYWQtTWV0YWRhdGFcIiwgbWV0YWRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF90aGlzMy5fc2VuZFJlcXVlc3QocmVxLCBudWxsKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAoIWluU3RhdHVzQ2F0ZWdvcnkocmVzLmdldFN0YXR1cygpLCAyMDApKSB7XG4gICAgICAgICAgX3RoaXMzLl9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCBcInR1czogdW5leHBlY3RlZCByZXNwb25zZSB3aGlsZSBjcmVhdGluZyB1cGxvYWRcIik7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jYXRpb24gPSByZXMuZ2V0SGVhZGVyKFwiTG9jYXRpb25cIik7XG5cbiAgICAgICAgaWYgKGxvY2F0aW9uID09IG51bGwpIHtcbiAgICAgICAgICBfdGhpczMuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiBpbnZhbGlkIG9yIG1pc3NpbmcgTG9jYXRpb24gaGVhZGVyXCIpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMzLnVybCA9IHJlc29sdmVVcmwoX3RoaXMzLm9wdGlvbnMuZW5kcG9pbnQsIGxvY2F0aW9uKTtcbiAgICAgICAgKDAsIF9sb2dnZXIubG9nKShcIkNyZWF0ZWQgdXBsb2FkIGF0IFwiLmNvbmNhdChfdGhpczMudXJsKSk7XG5cbiAgICAgICAgX3RoaXMzLl9lbWl0U3VjY2VzcygpO1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMy5fZW1pdEVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5pdGlhdGUgdGhlIHVwbG9hZGluZyBwcm9jZWR1cmUgZm9yIGEgbm9uLXBhcmFsbGVsIHVwbG9hZC4gSGVyZSB0aGUgZW50aXJlIGZpbGUgaXNcbiAgICAgKiB1cGxvYWRlZCBpbiBhIHNlcXVlbnRpYWwgbWF0dGVyLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfc3RhcnRTaW5nbGVVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3N0YXJ0U2luZ2xlVXBsb2FkKCkge1xuICAgICAgLy8gRmlyc3QsIHdlIGxvb2sgYXQgdGhlIHVwbG9hZExlbmd0aERlZmVycmVkIG9wdGlvbi5cbiAgICAgIC8vIE5leHQsIHdlIGNoZWNrIGlmIHRoZSBjYWxsZXIgaGFzIHN1cHBsaWVkIGEgbWFudWFsIHVwbG9hZCBzaXplLlxuICAgICAgLy8gRmluYWxseSwgd2UgdHJ5IHRvIHVzZSB0aGUgY2FsY3VsYXRlZCBzaXplIGZyb20gdGhlIHNvdXJjZSBvYmplY3QuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkU2l6ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSArdGhpcy5vcHRpb25zLnVwbG9hZFNpemU7XG5cbiAgICAgICAgaWYgKGlzTmFOKHRoaXMuX3NpemUpKSB7XG4gICAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogY2Fubm90IGNvbnZlcnQgYHVwbG9hZFNpemVgIG9wdGlvbiBpbnRvIGEgbnVtYmVyXCIpKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHRoaXMuX3NvdXJjZS5zaXplO1xuXG4gICAgICAgIGlmICh0aGlzLl9zaXplID09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9lbWl0RXJyb3IobmV3IEVycm9yKFwidHVzOiBjYW5ub3QgYXV0b21hdGljYWxseSBkZXJpdmUgdXBsb2FkJ3Mgc2l6ZSBmcm9tIGlucHV0IGFuZCBtdXN0IGJlIHNwZWNpZmllZCBtYW51YWxseSB1c2luZyB0aGUgYHVwbG9hZFNpemVgIG9wdGlvblwiKSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0gLy8gUmVzZXQgdGhlIGFib3J0ZWQgZmxhZyB3aGVuIHRoZSB1cGxvYWQgaXMgc3RhcnRlZCBvciBlbHNlIHRoZVxuICAgICAgLy8gX3BlcmZvcm1VcGxvYWQgd2lsbCBzdG9wIGJlZm9yZSBzZW5kaW5nIGEgcmVxdWVzdCBpZiB0aGUgdXBsb2FkIGhhcyBiZWVuXG4gICAgICAvLyBhYm9ydGVkIHByZXZpb3VzbHkuXG5cblxuICAgICAgdGhpcy5fYWJvcnRlZCA9IGZhbHNlOyAvLyBUaGUgdXBsb2FkIGhhZCBiZWVuIHN0YXJ0ZWQgcHJldmlvdXNseSBhbmQgd2Ugc2hvdWxkIHJldXNlIHRoaXMgVVJMLlxuXG4gICAgICBpZiAodGhpcy51cmwgIT0gbnVsbCkge1xuICAgICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiUmVzdW1pbmcgdXBsb2FkIGZyb20gcHJldmlvdXMgVVJMOiBcIi5jb25jYXQodGhpcy51cmwpKTtcblxuICAgICAgICB0aGlzLl9yZXN1bWVVcGxvYWQoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9IC8vIEEgVVJMIGhhcyBtYW51YWxseSBiZWVuIHNwZWNpZmllZCwgc28gd2UgdHJ5IHRvIHJlc3VtZVxuXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkVXJsICE9IG51bGwpIHtcbiAgICAgICAgKDAsIF9sb2dnZXIubG9nKShcIlJlc3VtaW5nIHVwbG9hZCBmcm9tIHByb3ZpZGVkIFVSTDogXCIuY29uY2F0KHRoaXMub3B0aW9ucy51cmwpKTtcbiAgICAgICAgdGhpcy51cmwgPSB0aGlzLm9wdGlvbnMudXBsb2FkVXJsO1xuXG4gICAgICAgIHRoaXMuX3Jlc3VtZVVwbG9hZCgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gLy8gQW4gdXBsb2FkIGhhcyBub3Qgc3RhcnRlZCBmb3IgdGhlIGZpbGUgeWV0LCBzbyB3ZSBzdGFydCBhIG5ldyBvbmVcblxuXG4gICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiQ3JlYXRpbmcgYSBuZXcgdXBsb2FkXCIpO1xuXG4gICAgICB0aGlzLl9jcmVhdGVVcGxvYWQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWJvcnQgYW55IHJ1bm5pbmcgcmVxdWVzdCBhbmQgc3RvcCB0aGUgY3VycmVudCB1cGxvYWQuIEFmdGVyIGFib3J0IGlzIGNhbGxlZCwgbm8gZXZlbnRcbiAgICAgKiBoYW5kbGVyIHdpbGwgYmUgaW52b2tlZCBhbnltb3JlLiBZb3UgY2FuIHVzZSB0aGUgYHN0YXJ0YCBtZXRob2QgdG8gcmVzdW1lIHRoZSB1cGxvYWRcbiAgICAgKiBhZ2Fpbi5cbiAgICAgKiBJZiBgc2hvdWxkVGVybWluYXRlYCBpcyB0cnVlLCB0aGUgYHRlcm1pbmF0ZWAgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgdG8gcmVtb3ZlIHRoZVxuICAgICAqIGN1cnJlbnQgdXBsb2FkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2hvdWxkVGVybWluYXRlIFRydWUgaWYgdGhlIHVwbG9hZCBzaG91bGQgYmUgZGVsZXRlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2Ugd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSByZXF1ZXN0cyBmaW5pc2guXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJhYm9ydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhYm9ydChzaG91bGRUZXJtaW5hdGUsIGNiKSB7XG4gICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR1czogdGhlIGFib3J0IGZ1bmN0aW9uIGRvZXMgbm90IGFjY2VwdCBhIGNhbGxiYWNrIHNpbmNlIHYyIGFueW1vcmU7IHBsZWFzZSB1c2UgdGhlIHJldHVybmVkIFByb21pc2UgaW5zdGVhZFwiKTtcbiAgICAgIH0gLy8gU3RvcCBhbnkgcGFyYWxsZWwgcGFydGlhbCB1cGxvYWRzLCB0aGF0IGhhdmUgYmVlbiBzdGFydGVkIGluIF9zdGFydFBhcmFsbGVsVXBsb2Fkcy5cblxuXG4gICAgICBpZiAodGhpcy5fcGFyYWxsZWxVcGxvYWRzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcGFyYWxsZWxVcGxvYWRzLmZvckVhY2goZnVuY3Rpb24gKHVwbG9hZCkge1xuICAgICAgICAgIHVwbG9hZC5hYm9ydChzaG91bGRUZXJtaW5hdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gLy8gU3RvcCBhbnkgY3VycmVudCBydW5uaW5nIHJlcXVlc3QuXG5cblxuICAgICAgaWYgKHRoaXMuX3JlcSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9yZXEuYWJvcnQoKTtcblxuICAgICAgICB0aGlzLl9zb3VyY2UuY2xvc2UoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWU7IC8vIFN0b3AgYW55IHRpbWVvdXQgdXNlZCBmb3IgaW5pdGlhdGluZyBhIHJldHJ5LlxuXG4gICAgICBpZiAodGhpcy5fcmV0cnlUaW1lb3V0ICE9IG51bGwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JldHJ5VGltZW91dCk7XG4gICAgICAgIHRoaXMuX3JldHJ5VGltZW91dCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghc2hvdWxkVGVybWluYXRlIHx8IHRoaXMudXJsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQmFzZVVwbG9hZC50ZXJtaW5hdGUodGhpcy51cmwsIHRoaXMub3B0aW9ucykgLy8gUmVtb3ZlIGVudHJ5IGZyb20gdGhlIFVSTCBzdG9yYWdlIHNpbmNlIHRoZSB1cGxvYWQgVVJMIGlzIG5vIGxvbmdlciB2YWxpZC5cbiAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzNC5fcmVtb3ZlRnJvbVVybFN0b3JhZ2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZW1pdEh0dHBFcnJvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgbWVzc2FnZSwgY2F1c2luZ0Vycikge1xuICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBfZXJyb3IuZGVmYXVsdChtZXNzYWdlLCBjYXVzaW5nRXJyLCByZXEsIHJlcykpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZW1pdEVycm9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbWl0RXJyb3IoZXJyKSB7XG4gICAgICB2YXIgX3RoaXM1ID0gdGhpczsgLy8gRG8gbm90IGVtaXQgZXJyb3JzLCBlLmcuIGZyb20gYWJvcnRlZCBIVFRQIHJlcXVlc3RzLCBpZiB0aGUgdXBsb2FkIGhhcyBiZWVuIHN0b3BwZWQuXG5cblxuICAgICAgaWYgKHRoaXMuX2Fib3J0ZWQpIHJldHVybjsgLy8gQ2hlY2sgaWYgd2Ugc2hvdWxkIHJldHJ5LCB3aGVuIGVuYWJsZWQsIGJlZm9yZSBzZW5kaW5nIHRoZSBlcnJvciB0byB0aGUgdXNlci5cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXRyeURlbGF5cyAhPSBudWxsKSB7XG4gICAgICAgIC8vIFdlIHdpbGwgcmVzZXQgdGhlIGF0dGVtcHQgY291bnRlciBpZlxuICAgICAgICAvLyAtIHdlIHdlcmUgYWxyZWFkeSBhYmxlIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlciAob2Zmc2V0ICE9IG51bGwpIGFuZFxuICAgICAgICAvLyAtIHdlIHdlcmUgYWJsZSB0byB1cGxvYWQgYSBzbWFsbCBjaHVuayBvZiBkYXRhIHRvIHRoZSBzZXJ2ZXJcbiAgICAgICAgdmFyIHNob3VsZFJlc2V0RGVsYXlzID0gdGhpcy5fb2Zmc2V0ICE9IG51bGwgJiYgdGhpcy5fb2Zmc2V0ID4gdGhpcy5fb2Zmc2V0QmVmb3JlUmV0cnk7XG5cbiAgICAgICAgaWYgKHNob3VsZFJlc2V0RGVsYXlzKSB7XG4gICAgICAgICAgdGhpcy5fcmV0cnlBdHRlbXB0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91bGRSZXRyeShlcnIsIHRoaXMuX3JldHJ5QXR0ZW1wdCwgdGhpcy5vcHRpb25zKSkge1xuICAgICAgICAgIHZhciBkZWxheSA9IHRoaXMub3B0aW9ucy5yZXRyeURlbGF5c1t0aGlzLl9yZXRyeUF0dGVtcHQrK107XG4gICAgICAgICAgdGhpcy5fb2Zmc2V0QmVmb3JlUmV0cnkgPSB0aGlzLl9vZmZzZXQ7XG4gICAgICAgICAgdGhpcy5fcmV0cnlUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczUuc3RhcnQoKTtcbiAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uRXJyb3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcihlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBQdWJsaXNoZXMgbm90aWZpY2F0aW9uIGlmIHRoZSB1cGxvYWQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2VtaXRTdWNjZXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbWl0U3VjY2VzcygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlRmluZ2VycHJpbnRPblN1Y2Nlc3MpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHN0b3JlZCBmaW5nZXJwcmludCBhbmQgY29ycmVzcG9uZGluZyBlbmRwb2ludC4gVGhpcyBjYXVzZXNcbiAgICAgICAgLy8gbmV3IHVwbG9hZHMgb2YgdGhlIHNhbWUgZmlsZSB0byBiZSB0cmVhdGVkIGFzIGEgZGlmZmVyZW50IGZpbGUuXG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21VcmxTdG9yYWdlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uU3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vblN1Y2Nlc3MoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUHVibGlzaGVzIG5vdGlmaWNhdGlvbiB3aGVuIGRhdGEgaGFzIGJlZW4gc2VudCB0byB0aGUgc2VydmVyLiBUaGlzXG4gICAgICogZGF0YSBtYXkgbm90IGhhdmUgYmVlbiBhY2NlcHRlZCBieSB0aGUgc2VydmVyIHlldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlc1NlbnQgIE51bWJlciBvZiBieXRlcyBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVzVG90YWwgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRvIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9lbWl0UHJvZ3Jlc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VtaXRQcm9ncmVzcyhieXRlc1NlbnQsIGJ5dGVzVG90YWwpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uUHJvZ3Jlc3MgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25Qcm9ncmVzcyhieXRlc1NlbnQsIGJ5dGVzVG90YWwpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBQdWJsaXNoZXMgbm90aWZpY2F0aW9uIHdoZW4gYSBjaHVuayBvZiBkYXRhIGhhcyBiZWVuIHNlbnQgdG8gdGhlIHNlcnZlclxuICAgICAqIGFuZCBhY2NlcHRlZCBieSB0aGUgc2VydmVyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjaHVua1NpemUgIFNpemUgb2YgdGhlIGNodW5rIHRoYXQgd2FzIGFjY2VwdGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVzQWNjZXB0ZWQgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRoYXQgaGF2ZSBiZWVuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VwdGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVzVG90YWwgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRvIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9lbWl0Q2h1bmtDb21wbGV0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZW1pdENodW5rQ29tcGxldGUoY2h1bmtTaXplLCBieXRlc0FjY2VwdGVkLCBieXRlc1RvdGFsKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbkNodW5rQ29tcGxldGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25DaHVua0NvbXBsZXRlKGNodW5rU2l6ZSwgYnl0ZXNBY2NlcHRlZCwgYnl0ZXNUb3RhbCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyB1cGxvYWQgdXNpbmcgdGhlIGNyZWF0aW9uIGV4dGVuc2lvbiBieSBzZW5kaW5nIGEgUE9TVFxuICAgICAqIHJlcXVlc3QgdG8gdGhlIGVuZHBvaW50LiBBZnRlciBzdWNjZXNzZnVsIGNyZWF0aW9uIHRoZSBmaWxlIHdpbGwgYmVcbiAgICAgKiB1cGxvYWRlZFxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfY3JlYXRlVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9jcmVhdGVVcGxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogdW5hYmxlIHRvIGNyZWF0ZSB1cGxvYWQgYmVjYXVzZSBubyBlbmRwb2ludCBpcyBwcm92aWRlZFwiKSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVxID0gdGhpcy5fb3BlblJlcXVlc3QoXCJQT1NUXCIsIHRoaXMub3B0aW9ucy5lbmRwb2ludCk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTGVuZ3RoRGVmZXJyZWQpIHtcbiAgICAgICAgcmVxLnNldEhlYWRlcihcIlVwbG9hZC1EZWZlci1MZW5ndGhcIiwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXEuc2V0SGVhZGVyKFwiVXBsb2FkLUxlbmd0aFwiLCB0aGlzLl9zaXplKTtcbiAgICAgIH0gLy8gQWRkIG1ldGFkYXRhIGlmIHZhbHVlcyBoYXZlIGJlZW4gYWRkZWRcblxuXG4gICAgICB2YXIgbWV0YWRhdGEgPSBlbmNvZGVNZXRhZGF0YSh0aGlzLm9wdGlvbnMubWV0YWRhdGEpO1xuXG4gICAgICBpZiAobWV0YWRhdGEgIT09IFwiXCIpIHtcbiAgICAgICAgcmVxLnNldEhlYWRlcihcIlVwbG9hZC1NZXRhZGF0YVwiLCBtZXRhZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9taXNlO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZERhdGFEdXJpbmdDcmVhdGlvbiAmJiAhdGhpcy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgICAgIHByb21pc2UgPSB0aGlzLl9hZGRDaHVua1RvUmVxdWVzdChyZXEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvbWlzZSA9IHRoaXMuX3NlbmRSZXF1ZXN0KHJlcSwgbnVsbCk7XG4gICAgICB9XG5cbiAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeShyZXMuZ2V0U3RhdHVzKCksIDIwMCkpIHtcbiAgICAgICAgICBfdGhpczYuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiB1bmV4cGVjdGVkIHJlc3BvbnNlIHdoaWxlIGNyZWF0aW5nIHVwbG9hZFwiKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NhdGlvbiA9IHJlcy5nZXRIZWFkZXIoXCJMb2NhdGlvblwiKTtcblxuICAgICAgICBpZiAobG9jYXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzNi5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgXCJ0dXM6IGludmFsaWQgb3IgbWlzc2luZyBMb2NhdGlvbiBoZWFkZXJcIik7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczYudXJsID0gcmVzb2x2ZVVybChfdGhpczYub3B0aW9ucy5lbmRwb2ludCwgbG9jYXRpb24pO1xuICAgICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiQ3JlYXRlZCB1cGxvYWQgYXQgXCIuY29uY2F0KF90aGlzNi51cmwpKTtcblxuICAgICAgICBpZiAodHlwZW9mIF90aGlzNi5vcHRpb25zLl9vblVwbG9hZFVybEF2YWlsYWJsZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgX3RoaXM2Lm9wdGlvbnMuX29uVXBsb2FkVXJsQXZhaWxhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXM2Ll9zaXplID09PSAwKSB7XG4gICAgICAgICAgLy8gTm90aGluZyB0byB1cGxvYWQgYW5kIGZpbGUgd2FzIHN1Y2Nlc3NmdWxseSBjcmVhdGVkXG4gICAgICAgICAgX3RoaXM2Ll9lbWl0U3VjY2VzcygpO1xuXG4gICAgICAgICAgX3RoaXM2Ll9zb3VyY2UuY2xvc2UoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNi5fc2F2ZVVwbG9hZEluVXJsU3RvcmFnZSgpO1xuXG4gICAgICAgIGlmIChfdGhpczYub3B0aW9ucy51cGxvYWREYXRhRHVyaW5nQ3JlYXRpb24pIHtcbiAgICAgICAgICBfdGhpczYuX2hhbmRsZVVwbG9hZFJlc3BvbnNlKHJlcSwgcmVzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpczYuX29mZnNldCA9IDA7XG5cbiAgICAgICAgICBfdGhpczYuX3BlcmZvcm1VcGxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzNi5fZW1pdEh0dHBFcnJvcihyZXEsIG51bGwsIFwidHVzOiBmYWlsZWQgdG8gY3JlYXRlIHVwbG9hZFwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qXG4gICAgICogVHJ5IHRvIHJlc3VtZSBhbiBleGlzdGluZyB1cGxvYWQuIEZpcnN0IGEgSEVBRCByZXF1ZXN0IHdpbGwgYmUgc2VudFxuICAgICAqIHRvIHJldHJpZXZlIHRoZSBvZmZzZXQuIElmIHRoZSByZXF1ZXN0IGZhaWxzIGEgbmV3IHVwbG9hZCB3aWxsIGJlXG4gICAgICogY3JlYXRlZC4gSW4gdGhlIGNhc2Ugb2YgYSBzdWNjZXNzZnVsIHJlc3BvbnNlIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9yZXN1bWVVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3Jlc3VtZVVwbG9hZCgpIHtcbiAgICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgICB2YXIgcmVxID0gdGhpcy5fb3BlblJlcXVlc3QoXCJIRUFEXCIsIHRoaXMudXJsKTtcblxuICAgICAgdmFyIHByb21pc2UgPSB0aGlzLl9zZW5kUmVxdWVzdChyZXEsIG51bGwpO1xuXG4gICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgc3RhdHVzID0gcmVzLmdldFN0YXR1cygpO1xuXG4gICAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeShzdGF0dXMsIDIwMCkpIHtcbiAgICAgICAgICBpZiAoaW5TdGF0dXNDYXRlZ29yeShzdGF0dXMsIDQwMCkpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBzdG9yZWQgZmluZ2VycHJpbnQgYW5kIGNvcnJlc3BvbmRpbmcgZW5kcG9pbnQsXG4gICAgICAgICAgICAvLyBvbiBjbGllbnQgZXJyb3JzIHNpbmNlIHRoZSBmaWxlIGNhbiBub3QgYmUgZm91bmRcbiAgICAgICAgICAgIF90aGlzNy5fcmVtb3ZlRnJvbVVybFN0b3JhZ2UoKTtcbiAgICAgICAgICB9IC8vIElmIHRoZSB1cGxvYWQgaXMgbG9ja2VkIChpbmRpY2F0ZWQgYnkgdGhlIDQyMyBMb2NrZWQgc3RhdHVzIGNvZGUpLCB3ZVxuICAgICAgICAgIC8vIGVtaXQgYW4gZXJyb3IgaW5zdGVhZCBvZiBkaXJlY3RseSBzdGFydGluZyBhIG5ldyB1cGxvYWQuIFRoaXMgd2F5IHRoZVxuICAgICAgICAgIC8vIHJldHJ5IGxvZ2ljIGNhbiBjYXRjaCB0aGUgZXJyb3IgYW5kIHdpbGwgcmV0cnkgdGhlIHVwbG9hZC4gQW4gdXBsb2FkXG4gICAgICAgICAgLy8gaXMgdXN1YWxseSBsb2NrZWQgZm9yIGEgc2hvcnQgcGVyaW9kIG9mIHRpbWUgYW5kIHdpbGwgYmUgYXZhaWxhYmxlXG4gICAgICAgICAgLy8gYWZ0ZXJ3YXJkcy5cblxuXG4gICAgICAgICAgaWYgKHN0YXR1cyA9PT0gNDIzKSB7XG4gICAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiB1cGxvYWQgaXMgY3VycmVudGx5IGxvY2tlZDsgcmV0cnkgbGF0ZXJcIik7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIV90aGlzNy5vcHRpb25zLmVuZHBvaW50KSB7XG4gICAgICAgICAgICAvLyBEb24ndCBhdHRlbXB0IHRvIGNyZWF0ZSBhIG5ldyB1cGxvYWQgaWYgbm8gZW5kcG9pbnQgaXMgcHJvdmlkZWQuXG4gICAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiB1bmFibGUgdG8gcmVzdW1lIHVwbG9hZCAobmV3IHVwbG9hZCBjYW5ub3QgYmUgY3JlYXRlZCB3aXRob3V0IGFuIGVuZHBvaW50KVwiKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gLy8gVHJ5IHRvIGNyZWF0ZSBhIG5ldyB1cGxvYWRcblxuXG4gICAgICAgICAgX3RoaXM3LnVybCA9IG51bGw7XG5cbiAgICAgICAgICBfdGhpczcuX2NyZWF0ZVVwbG9hZCgpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9mZnNldCA9IHBhcnNlSW50KHJlcy5nZXRIZWFkZXIoXCJVcGxvYWQtT2Zmc2V0XCIpLCAxMCk7XG5cbiAgICAgICAgaWYgKGlzTmFOKG9mZnNldCkpIHtcbiAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiBpbnZhbGlkIG9yIG1pc3Npbmcgb2Zmc2V0IHZhbHVlXCIpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHBhcnNlSW50KHJlcy5nZXRIZWFkZXIoXCJVcGxvYWQtTGVuZ3RoXCIpLCAxMCk7XG5cbiAgICAgICAgaWYgKGlzTmFOKGxlbmd0aCkgJiYgIV90aGlzNy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgICAgX3RoaXM3Ll9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCBcInR1czogaW52YWxpZCBvciBtaXNzaW5nIGxlbmd0aCB2YWx1ZVwiKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgX3RoaXM3Lm9wdGlvbnMuX29uVXBsb2FkVXJsQXZhaWxhYmxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBfdGhpczcub3B0aW9ucy5fb25VcGxvYWRVcmxBdmFpbGFibGUoKTtcbiAgICAgICAgfSAvLyBVcGxvYWQgaGFzIGFscmVhZHkgYmVlbiBjb21wbGV0ZWQgYW5kIHdlIGRvIG5vdCBuZWVkIHRvIHNlbmQgYWRkaXRpb25hbFxuICAgICAgICAvLyBkYXRhIHRvIHRoZSBzZXJ2ZXJcblxuXG4gICAgICAgIGlmIChvZmZzZXQgPT09IGxlbmd0aCkge1xuICAgICAgICAgIF90aGlzNy5fZW1pdFByb2dyZXNzKGxlbmd0aCwgbGVuZ3RoKTtcblxuICAgICAgICAgIF90aGlzNy5fZW1pdFN1Y2Nlc3MoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNy5fb2Zmc2V0ID0gb2Zmc2V0O1xuXG4gICAgICAgIF90aGlzNy5fcGVyZm9ybVVwbG9hZCgpO1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzNy5fZW1pdEh0dHBFcnJvcihyZXEsIG51bGwsIFwidHVzOiBmYWlsZWQgdG8gcmVzdW1lIHVwbG9hZFwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB1c2luZyBQQVRDSCByZXF1ZXN0cy4gVGhlIGZpbGUgd2lsbCBiZSBkaXZpZGVkXG4gICAgICogaW50byBjaHVua3MgYXMgc3BlY2lmaWVkIGluIHRoZSBjaHVua1NpemUgb3B0aW9uLiBEdXJpbmcgdGhlIHVwbG9hZFxuICAgICAqIHRoZSBvblByb2dyZXNzIGV2ZW50IGhhbmRsZXIgbWF5IGJlIGludm9rZWQgbXVsdGlwbGUgdGltZXMuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9wZXJmb3JtVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9wZXJmb3JtVXBsb2FkKCkge1xuICAgICAgdmFyIF90aGlzOCA9IHRoaXM7IC8vIElmIHRoZSB1cGxvYWQgaGFzIGJlZW4gYWJvcnRlZCwgd2Ugd2lsbCBub3Qgc2VuZCB0aGUgbmV4dCBQQVRDSCByZXF1ZXN0LlxuICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgaWYgdGhlIGFib3J0IG1ldGhvZCB3YXMgY2FsbGVkIGR1cmluZyBhIGNhbGxiYWNrLCBzdWNoXG4gICAgICAvLyBhcyBvbkNodW5rQ29tcGxldGUgb3Igb25Qcm9ncmVzcy5cblxuXG4gICAgICBpZiAodGhpcy5fYWJvcnRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciByZXE7IC8vIFNvbWUgYnJvd3NlciBhbmQgc2VydmVycyBtYXkgbm90IHN1cHBvcnQgdGhlIFBBVENIIG1ldGhvZC4gRm9yIHRob3NlXG4gICAgICAvLyBjYXNlcywgeW91IGNhbiB0ZWxsIHR1cy1qcy1jbGllbnQgdG8gdXNlIGEgUE9TVCByZXF1ZXN0IHdpdGggdGhlXG4gICAgICAvLyBYLUhUVFAtTWV0aG9kLU92ZXJyaWRlIGhlYWRlciBmb3Igc2ltdWxhdGluZyBhIFBBVENIIHJlcXVlc3QuXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub3ZlcnJpZGVQYXRjaE1ldGhvZCkge1xuICAgICAgICByZXEgPSB0aGlzLl9vcGVuUmVxdWVzdChcIlBPU1RcIiwgdGhpcy51cmwpO1xuICAgICAgICByZXEuc2V0SGVhZGVyKFwiWC1IVFRQLU1ldGhvZC1PdmVycmlkZVwiLCBcIlBBVENIXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxID0gdGhpcy5fb3BlblJlcXVlc3QoXCJQQVRDSFwiLCB0aGlzLnVybCk7XG4gICAgICB9XG5cbiAgICAgIHJlcS5zZXRIZWFkZXIoXCJVcGxvYWQtT2Zmc2V0XCIsIHRoaXMuX29mZnNldCk7XG5cbiAgICAgIHZhciBwcm9taXNlID0gdGhpcy5fYWRkQ2h1bmtUb1JlcXVlc3QocmVxKTtcblxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFpblN0YXR1c0NhdGVnb3J5KHJlcy5nZXRTdGF0dXMoKSwgMjAwKSkge1xuICAgICAgICAgIF90aGlzOC5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgXCJ0dXM6IHVuZXhwZWN0ZWQgcmVzcG9uc2Ugd2hpbGUgdXBsb2FkaW5nIGNodW5rXCIpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXM4Ll9oYW5kbGVVcGxvYWRSZXNwb25zZShyZXEsIHJlcyk7XG4gICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgLy8gRG9uJ3QgZW1pdCBhbiBlcnJvciBpZiB0aGUgdXBsb2FkIHdhcyBhYm9ydGVkIG1hbnVhbGx5XG4gICAgICAgIGlmIChfdGhpczguX2Fib3J0ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczguX2VtaXRIdHRwRXJyb3IocmVxLCBudWxsLCBcInR1czogZmFpbGVkIHRvIHVwbG9hZCBjaHVuayBhdCBvZmZzZXQgXCIgKyBfdGhpczguX29mZnNldCwgZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBfYWRkQ2h1bmt0b1JlcXVlc3QgcmVhZHMgYSBjaHVuayBmcm9tIHRoZSBzb3VyY2UgYW5kIHNlbmRzIGl0IHVzaW5nIHRoZVxuICAgICAqIHN1cHBsaWVkIHJlcXVlc3Qgb2JqZWN0LiBJdCB3aWxsIG5vdCBoYW5kbGUgdGhlIHJlc3BvbnNlLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfYWRkQ2h1bmtUb1JlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2FkZENodW5rVG9SZXF1ZXN0KHJlcSkge1xuICAgICAgdmFyIF90aGlzOSA9IHRoaXM7XG5cbiAgICAgIHZhciBzdGFydCA9IHRoaXMuX29mZnNldDtcbiAgICAgIHZhciBlbmQgPSB0aGlzLl9vZmZzZXQgKyB0aGlzLm9wdGlvbnMuY2h1bmtTaXplO1xuICAgICAgcmVxLnNldFByb2dyZXNzSGFuZGxlcihmdW5jdGlvbiAoYnl0ZXNTZW50KSB7XG4gICAgICAgIF90aGlzOS5fZW1pdFByb2dyZXNzKHN0YXJ0ICsgYnl0ZXNTZW50LCBfdGhpczkuX3NpemUpO1xuICAgICAgfSk7XG4gICAgICByZXEuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vb2Zmc2V0K29jdGV0LXN0cmVhbVwiKTsgLy8gVGhlIHNwZWNpZmllZCBjaHVua1NpemUgbWF5IGJlIEluZmluaXR5IG9yIHRoZSBjYWxjbHVhdGVkIGVuZCBwb3NpdGlvblxuICAgICAgLy8gbWF5IGV4Y2VlZCB0aGUgZmlsZSdzIHNpemUuIEluIGJvdGggY2FzZXMsIHdlIGxpbWl0IHRoZSBlbmQgcG9zaXRpb24gdG9cbiAgICAgIC8vIHRoZSBpbnB1dCdzIHRvdGFsIHNpemUgZm9yIHNpbXBsZXIgY2FsY3VsYXRpb25zIGFuZCBjb3JyZWN0bmVzcy5cblxuICAgICAgaWYgKChlbmQgPT09IEluZmluaXR5IHx8IGVuZCA+IHRoaXMuX3NpemUpICYmICF0aGlzLm9wdGlvbnMudXBsb2FkTGVuZ3RoRGVmZXJyZWQpIHtcbiAgICAgICAgZW5kID0gdGhpcy5fc2l6ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZS5zbGljZShzdGFydCwgZW5kKS50aGVuKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgICB2YXIgdmFsdWUgPSBfcmVmMi52YWx1ZSxcbiAgICAgICAgICAgIGRvbmUgPSBfcmVmMi5kb25lOyAvLyBJZiB0aGUgdXBsb2FkIGxlbmd0aCBpcyBkZWZlcnJlZCwgdGhlIHVwbG9hZCBzaXplIHdhcyBub3Qgc3BlY2lmaWVkIGR1cmluZ1xuICAgICAgICAvLyB1cGxvYWQgY3JlYXRpb24uIFNvLCBpZiB0aGUgZmlsZSByZWFkZXIgaXMgZG9uZSByZWFkaW5nLCB3ZSBrbm93IHRoZSB0b3RhbFxuICAgICAgICAvLyB1cGxvYWQgc2l6ZSBhbmQgY2FuIHRlbGwgdGhlIHR1cyBzZXJ2ZXIuXG5cbiAgICAgICAgaWYgKF90aGlzOS5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkICYmIGRvbmUpIHtcbiAgICAgICAgICBfdGhpczkuX3NpemUgPSBfdGhpczkuX29mZnNldCArICh2YWx1ZSAmJiB2YWx1ZS5zaXplID8gdmFsdWUuc2l6ZSA6IDApO1xuICAgICAgICAgIHJlcS5zZXRIZWFkZXIoXCJVcGxvYWQtTGVuZ3RoXCIsIF90aGlzOS5fc2l6ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM5Ll9zZW5kUmVxdWVzdChyZXEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzOS5fZW1pdFByb2dyZXNzKF90aGlzOS5fb2Zmc2V0LCBfdGhpczkuX3NpemUpO1xuXG4gICAgICAgICAgcmV0dXJuIF90aGlzOS5fc2VuZFJlcXVlc3QocmVxLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBfaGFuZGxlVXBsb2FkUmVzcG9uc2UgaXMgdXNlZCBieSByZXF1ZXN0cyB0aGF0IGhhdmVuIGJlZW4gc2VudCB1c2luZyBfYWRkQ2h1bmtUb1JlcXVlc3RcbiAgICAgKiBhbmQgYWxyZWFkeSBoYXZlIHJlY2VpdmVkIGEgcmVzcG9uc2UuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9oYW5kbGVVcGxvYWRSZXNwb25zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlVXBsb2FkUmVzcG9uc2UocmVxLCByZXMpIHtcbiAgICAgIHZhciBvZmZzZXQgPSBwYXJzZUludChyZXMuZ2V0SGVhZGVyKFwiVXBsb2FkLU9mZnNldFwiKSwgMTApO1xuXG4gICAgICBpZiAoaXNOYU4ob2Zmc2V0KSkge1xuICAgICAgICB0aGlzLl9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCBcInR1czogaW52YWxpZCBvciBtaXNzaW5nIG9mZnNldCB2YWx1ZVwiKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2VtaXRQcm9ncmVzcyhvZmZzZXQsIHRoaXMuX3NpemUpO1xuXG4gICAgICB0aGlzLl9lbWl0Q2h1bmtDb21wbGV0ZShvZmZzZXQgLSB0aGlzLl9vZmZzZXQsIG9mZnNldCwgdGhpcy5fc2l6ZSk7XG5cbiAgICAgIHRoaXMuX29mZnNldCA9IG9mZnNldDtcblxuICAgICAgaWYgKG9mZnNldCA9PSB0aGlzLl9zaXplKSB7XG4gICAgICAgIC8vIFlheSwgZmluYWxseSBkb25lIDopXG4gICAgICAgIHRoaXMuX2VtaXRTdWNjZXNzKCk7XG5cbiAgICAgICAgdGhpcy5fc291cmNlLmNsb3NlKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wZXJmb3JtVXBsb2FkKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBIVFRQIHJlcXVlc3Qgb2JqZWN0IHdpdGggdGhlIGdpdmVuIG1ldGhvZCBhbmQgVVJMLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfb3BlblJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX29wZW5SZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gICAgICB2YXIgcmVxID0gb3BlblJlcXVlc3QobWV0aG9kLCB1cmwsIHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLl9yZXEgPSByZXE7XG4gICAgICByZXR1cm4gcmVxO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGVudHJ5IGluIHRoZSBVUkwgc3RvcmFnZSwgaWYgaXQgaGFzIGJlZW4gc2F2ZWQgYmVmb3JlLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfcmVtb3ZlRnJvbVVybFN0b3JhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbW92ZUZyb21VcmxTdG9yYWdlKCkge1xuICAgICAgdmFyIF90aGlzMTAgPSB0aGlzO1xuXG4gICAgICBpZiAoIXRoaXMuX3VybFN0b3JhZ2VLZXkpIHJldHVybjtcblxuICAgICAgdGhpcy5fdXJsU3RvcmFnZS5yZW1vdmVVcGxvYWQodGhpcy5fdXJsU3RvcmFnZUtleSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMTAuX2VtaXRFcnJvcihlcnIpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3VybFN0b3JhZ2VLZXkgPSBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgdGhlIHVwbG9hZCBVUkwgdG8gdGhlIFVSTCBzdG9yYWdlLCBpZiBwb3NzaWJsZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3NhdmVVcGxvYWRJblVybFN0b3JhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3NhdmVVcGxvYWRJblVybFN0b3JhZ2UoKSB7XG4gICAgICB2YXIgX3RoaXMxMSA9IHRoaXM7IC8vIE9ubHkgaWYgYSBmaW5nZXJwcmludCB3YXMgY2FsY3VsYXRlZCBmb3IgdGhlIGlucHV0IChpLmUuIG5vdCBhIHN0cmVhbSksIHdlIGNhbiBzdG9yZSB0aGUgdXBsb2FkIFVSTC5cblxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5zdG9yZUZpbmdlcnByaW50Rm9yUmVzdW1pbmcgfHwgIXRoaXMuX2ZpbmdlcnByaW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0b3JlZFVwbG9hZCA9IHtcbiAgICAgICAgc2l6ZTogdGhpcy5fc2l6ZSxcbiAgICAgICAgbWV0YWRhdGE6IHRoaXMub3B0aW9ucy5tZXRhZGF0YSxcbiAgICAgICAgY3JlYXRpb25UaW1lOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKClcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLl9wYXJhbGxlbFVwbG9hZHMpIHtcbiAgICAgICAgLy8gU2F2ZSBtdWx0aXBsZSBVUkxzIGlmIHRoZSBwYXJhbGxlbFVwbG9hZHMgb3B0aW9uIGlzIHVzZWQgLi4uXG4gICAgICAgIHN0b3JlZFVwbG9hZC5wYXJhbGxlbFVwbG9hZFVybHMgPSB0aGlzLl9wYXJhbGxlbFVwbG9hZFVybHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAuLi4gb3RoZXJ3aXNlIHdlIGp1c3Qgc2F2ZSB0aGUgb25lIGF2YWlsYWJsZSBVUkwuXG4gICAgICAgIHN0b3JlZFVwbG9hZC51cGxvYWRVcmwgPSB0aGlzLnVybDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdXJsU3RvcmFnZS5hZGRVcGxvYWQodGhpcy5fZmluZ2VycHJpbnQsIHN0b3JlZFVwbG9hZCkudGhlbihmdW5jdGlvbiAodXJsU3RvcmFnZUtleSkge1xuICAgICAgICByZXR1cm4gX3RoaXMxMS5fdXJsU3RvcmFnZUtleSA9IHVybFN0b3JhZ2VLZXk7XG4gICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgX3RoaXMxMS5fZW1pdEVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZCBhIHJlcXVlc3Qgd2l0aCB0aGUgcHJvdmlkZWQgYm9keSB3aGlsZSBpbnZva2luZyB0aGUgb25CZWZvcmVSZXF1ZXN0XG4gICAgICogYW5kIG9uQWZ0ZXJSZXNwb25zZSBjYWxsYmFja3MuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9zZW5kUmVxdWVzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfc2VuZFJlcXVlc3QocmVxKSB7XG4gICAgICB2YXIgX3RoaXMxMiA9IHRoaXM7XG5cbiAgICAgIHZhciBib2R5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbkJlZm9yZVJlcXVlc3QgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25CZWZvcmVSZXF1ZXN0KHJlcSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXEuc2VuZChib2R5KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBfdGhpczEyLm9wdGlvbnMub25BZnRlclJlc3BvbnNlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBfdGhpczEyLm9wdGlvbnMub25BZnRlclJlc3BvbnNlKHJlcSwgcmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dLCBbe1xuICAgIGtleTogXCJ0ZXJtaW5hdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGVybWluYXRlKHVybCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgdmFyIGNiID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBjYiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR1czogdGhlIHRlcm1pbmF0ZSBmdW5jdGlvbiBkb2VzIG5vdCBhY2NlcHQgYSBjYWxsYmFjayBzaW5jZSB2MiBhbnltb3JlOyBwbGVhc2UgdXNlIHRoZSByZXR1cm5lZCBQcm9taXNlIGluc3RlYWRcIik7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXEgPSBvcGVuUmVxdWVzdChcIkRFTEVURVwiLCB1cmwsIG9wdGlvbnMpO1xuICAgICAgdmFyIHByb21pc2UgPSByZXEuc2VuZCgpO1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIEEgMjA0IHJlc3BvbnNlIGluZGljYXRlcyBhIHN1Y2Nlc3NmdWxsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcy5nZXRTdGF0dXMoKSA9PT0gMjA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IF9lcnJvci5kZWZhdWx0KFwidHVzOiB1bmV4cGVjdGVkIHJlc3BvbnNlIHdoaWxlIHRlcm1pbmF0aW5nIHVwbG9hZFwiLCBudWxsLCByZXEsIHJlcyk7XG4gICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKCEoZXJyIGluc3RhbmNlb2YgX2Vycm9yLmRlZmF1bHQpKSB7XG4gICAgICAgICAgZXJyID0gbmV3IF9lcnJvci5kZWZhdWx0KFwidHVzOiBmYWlsZWQgdG8gdGVybWluYXRlIHVwbG9hZFwiLCBlcnIsIHJlcSwgbnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNob3VsZFJldHJ5KGVyciwgMCwgb3B0aW9ucykpIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0gLy8gSW5zdGVhZCBvZiBrZWVwaW5nIHRyYWNrIG9mIHRoZSByZXRyeSBhdHRlbXB0cywgd2UgcmVtb3ZlIHRoZSBmaXJzdCBlbGVtZW50IGZyb20gdGhlIGRlbGF5c1xuICAgICAgICAvLyBhcnJheS4gSWYgdGhlIGFycmF5IGlzIGVtcHR5LCBhbGwgcmV0cnkgYXR0ZW1wdHMgYXJlIHVzZWQgdXAgYW5kIHdlIHdpbGwgYnViYmxlIHVwIHRoZSBlcnJvci5cbiAgICAgICAgLy8gV2UgcmVjdXJzaXZlbHkgY2FsbCB0aGUgdGVybWluYXRlIGZ1bmN0aW9uIHdpbGwgcmVtb3ZpbmcgZWxlbWVudHMgZnJvbSB0aGUgcmV0cnlEZWxheXMgYXJyYXkuXG5cblxuICAgICAgICB2YXIgZGVsYXkgPSBvcHRpb25zLnJldHJ5RGVsYXlzWzBdO1xuICAgICAgICB2YXIgcmVtYWluaW5nRGVsYXlzID0gb3B0aW9ucy5yZXRyeURlbGF5cy5zbGljZSgxKTtcblxuICAgICAgICB2YXIgbmV3T3B0aW9ucyA9IF9vYmplY3RTcHJlYWQoe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICByZXRyeURlbGF5czogcmVtYWluaW5nRGVsYXlzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIEJhc2VVcGxvYWQudGVybWluYXRlKHVybCwgbmV3T3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJhc2VVcGxvYWQ7XG59KCk7XG5cbmZ1bmN0aW9uIGVuY29kZU1ldGFkYXRhKG1ldGFkYXRhKSB7XG4gIHZhciBlbmNvZGVkID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG1ldGFkYXRhKSB7XG4gICAgZW5jb2RlZC5wdXNoKGtleSArIFwiIFwiICsgX2pzQmFzZS5CYXNlNjQuZW5jb2RlKG1ldGFkYXRhW2tleV0pKTtcbiAgfVxuXG4gIHJldHVybiBlbmNvZGVkLmpvaW4oXCIsXCIpO1xufVxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHN0YXR1cyBpcyBpbiB0aGUgcmFuZ2Ugb2YgdGhlIGV4cGVjdGVkIGNhdGVnb3J5LlxuICogRm9yIGV4YW1wbGUsIG9ubHkgYSBzdGF0dXMgYmV0d2VlbiAyMDAgYW5kIDI5OSB3aWxsIHNhdGlzZnkgdGhlIGNhdGVnb3J5IDIwMC5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIGluU3RhdHVzQ2F0ZWdvcnkoc3RhdHVzLCBjYXRlZ29yeSkge1xuICByZXR1cm4gc3RhdHVzID49IGNhdGVnb3J5ICYmIHN0YXR1cyA8IGNhdGVnb3J5ICsgMTAwO1xufVxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgSFRUUCByZXF1ZXN0IHdpdGggdGhlIHNwZWNpZmllZCBtZXRob2QgYW5kIFVSTC5cbiAqIFRoZSBuZWNlc3NhcnkgaGVhZGVycyB0aGF0IGFyZSBpbmNsdWRlZCBpbiBldmVyeSByZXF1ZXN0XG4gKiB3aWxsIGJlIGFkZGVkLCBpbmNsdWRpbmcgdGhlIHJlcXVlc3QgSUQuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBvcGVuUmVxdWVzdChtZXRob2QsIHVybCwgb3B0aW9ucykge1xuICB2YXIgcmVxID0gb3B0aW9ucy5odHRwU3RhY2suY3JlYXRlUmVxdWVzdChtZXRob2QsIHVybCk7XG4gIHJlcS5zZXRIZWFkZXIoXCJUdXMtUmVzdW1hYmxlXCIsIFwiMS4wLjBcIik7XG4gIHZhciBoZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuXG4gIGZvciAodmFyIG5hbWUgaW4gaGVhZGVycykge1xuICAgIHJlcS5zZXRIZWFkZXIobmFtZSwgaGVhZGVyc1tuYW1lXSk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5hZGRSZXF1ZXN0SWQpIHtcbiAgICB2YXIgcmVxdWVzdElkID0gKDAsIF91dWlkLmRlZmF1bHQpKCk7XG4gICAgcmVxLnNldEhlYWRlcihcIlgtUmVxdWVzdC1JRFwiLCByZXF1ZXN0SWQpO1xuICB9XG5cbiAgcmV0dXJuIHJlcTtcbn1cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGJyb3dzZXIgcnVubmluZyB0aGlzIGNvZGUgaGFzIGludGVybmV0IGFjY2Vzcy5cbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBhbHdheXMgcmV0dXJuIHRydWUgaW4gdGhlIG5vZGUuanMgZW52aXJvbm1lbnRcbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzT25saW5lKCkge1xuICB2YXIgb25saW5lID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBcIm5hdmlnYXRvclwiIGluIHdpbmRvdyAmJiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZSA9PT0gZmFsc2UpIHtcbiAgICBvbmxpbmUgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBvbmxpbmU7XG59XG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIG9yIG5vdCBpdCBpcyBvayB0byByZXRyeSBhIHJlcXVlc3QuXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnIgdGhlIGVycm9yIHJldHVybmVkIGZyb20gdGhlIGxhc3QgcmVxdWVzdFxuICogQHBhcmFtIHtudW1iZXJ9IHJldHJ5QXR0ZW1wdCB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZSByZXF1ZXN0IGhhcyBhbHJlYWR5IGJlZW4gcmV0cmllZFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgdHVzIFVwbG9hZCBvcHRpb25zXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBzaG91bGRSZXRyeShlcnIsIHJldHJ5QXR0ZW1wdCwgb3B0aW9ucykge1xuICAvLyBXZSBvbmx5IGF0dGVtcHQgYSByZXRyeSBpZlxuICAvLyAtIHJldHJ5RGVsYXlzIG9wdGlvbiBpcyBzZXRcbiAgLy8gLSB3ZSBkaWRuJ3QgZXhjZWVkIHRoZSBtYXhpdW0gbnVtYmVyIG9mIHJldHJpZXMsIHlldCwgYW5kXG4gIC8vIC0gdGhpcyBlcnJvciB3YXMgY2F1c2VkIGJ5IGEgcmVxdWVzdCBvciBpdCdzIHJlc3BvbnNlIGFuZFxuICAvLyAtIHRoZSBlcnJvciBpcyBzZXJ2ZXIgZXJyb3IgKGkuZS4gbm8gYSBzdGF0dXMgNHh4IG9yIGEgNDA5IG9yIDQyMykgYW5kXG4gIC8vIC0gdGhlIGJyb3dzZXIgZG9lcyBub3QgaW5kaWNhdGUgdGhhdCB3ZSBhcmUgb2ZmbGluZVxuICB2YXIgc3RhdHVzID0gZXJyLm9yaWdpbmFsUmVzcG9uc2UgPyBlcnIub3JpZ2luYWxSZXNwb25zZS5nZXRTdGF0dXMoKSA6IDA7XG4gIHZhciBpc1NlcnZlckVycm9yID0gIWluU3RhdHVzQ2F0ZWdvcnkoc3RhdHVzLCA0MDApIHx8IHN0YXR1cyA9PT0gNDA5IHx8IHN0YXR1cyA9PT0gNDIzO1xuICByZXR1cm4gb3B0aW9ucy5yZXRyeURlbGF5cyAhPSBudWxsICYmIHJldHJ5QXR0ZW1wdCA8IG9wdGlvbnMucmV0cnlEZWxheXMubGVuZ3RoICYmIGVyci5vcmlnaW5hbFJlcXVlc3QgIT0gbnVsbCAmJiBpc1NlcnZlckVycm9yICYmIGlzT25saW5lKCk7XG59XG4vKipcbiAqIFJlc29sdmUgYSByZWxhdGl2ZSBsaW5rIGdpdmVuIHRoZSBvcmlnaW4gYXMgc291cmNlLiBGb3IgZXhhbXBsZSxcbiAqIGlmIGEgSFRUUCByZXF1ZXN0IHRvIGh0dHA6Ly9leGFtcGxlLmNvbS9maWxlcy8gcmV0dXJucyBhIExvY2F0aW9uXG4gKiBoZWFkZXIgd2l0aCB0aGUgdmFsdWUgL3VwbG9hZC9hYmMsIHRoZSByZXNvbHZlZCBVUkwgd2lsbCBiZTpcbiAqIGh0dHA6Ly9leGFtcGxlLmNvbS91cGxvYWQvYWJjXG4gKi9cblxuXG5mdW5jdGlvbiByZXNvbHZlVXJsKG9yaWdpbiwgbGluaykge1xuICByZXR1cm4gbmV3IF91cmxQYXJzZS5kZWZhdWx0KGxpbmssIG9yaWdpbikudG9TdHJpbmcoKTtcbn1cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBzdGFydCBhbmQgZW5kIHBvc2l0aW9ucyBmb3IgdGhlIHBhcnRzIGlmIGFuIHVwbG9hZFxuICogaXMgc3BsaXQgaW50byBtdWx0aXBsZSBwYXJhbGxlbCByZXF1ZXN0cy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxTaXplIFRoZSBieXRlIHNpemUgb2YgdGhlIHVwbG9hZCwgd2hpY2ggd2lsbCBiZSBzcGxpdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJ0Q291bnQgVGhlIG51bWJlciBpbiBob3cgbWFueSBwYXJ0cyB0aGUgdXBsb2FkIHdpbGwgYmUgc3BsaXQuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwcmV2aW91c1VybHMgVGhlIHVwbG9hZCBVUkxzIGZvciBwcmV2aW91cyBwYXJ0cy5cbiAqIEByZXR1cm4ge29iamVjdFtdfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBzcGxpdFNpemVJbnRvUGFydHModG90YWxTaXplLCBwYXJ0Q291bnQsIHByZXZpb3VzVXJscykge1xuICB2YXIgcGFydFNpemUgPSBNYXRoLmZsb29yKHRvdGFsU2l6ZSAvIHBhcnRDb3VudCk7XG4gIHZhciBwYXJ0cyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydENvdW50OyBpKyspIHtcbiAgICBwYXJ0cy5wdXNoKHtcbiAgICAgIHN0YXJ0OiBwYXJ0U2l6ZSAqIGksXG4gICAgICBlbmQ6IHBhcnRTaXplICogKGkgKyAxKVxuICAgIH0pO1xuICB9XG5cbiAgcGFydHNbcGFydENvdW50IC0gMV0uZW5kID0gdG90YWxTaXplOyAvLyBBdHRhY2ggVVJMcyBmcm9tIHByZXZpb3VzIHVwbG9hZHMsIGlmIGF2YWlsYWJsZS5cblxuICBpZiAocHJldmlvdXNVcmxzKSB7XG4gICAgcGFydHMuZm9yRWFjaChmdW5jdGlvbiAocGFydCwgaW5kZXgpIHtcbiAgICAgIHBhcnQudXBsb2FkVXJsID0gcHJldmlvdXNVcmxzW2luZGV4XSB8fCBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG5CYXNlVXBsb2FkLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG52YXIgX2RlZmF1bHQgPSBCYXNlVXBsb2FkO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB1dWlkO1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgVVVJRCB2NCBiYXNlZCBvbiByYW5kb20gbnVtYmVycy4gV2UgaW50ZW50aW9hbmxseSB1c2UgdGhlIGxlc3NcbiAqIHNlY3VyZSBNYXRoLnJhbmRvbSBmdW5jdGlvbiBoZXJlIHNpbmNlIHRoZSBtb3JlIHNlY3VyZSBjcnlwdG8uZ2V0UmFuZG9tTnVtYmVyc1xuICogaXMgbm90IGF2YWlsYWJsZSBvbiBhbGwgcGxhdGZvcm1zLlxuICogVGhpcyBpcyBub3QgYSBwcm9ibGVtIGZvciB1cyBzaW5jZSB3ZSB1c2UgdGhlIFVVSUQgb25seSBmb3IgZ2VuZXJhdGluZyBhXG4gKiByZXF1ZXN0IElELCBzbyB3ZSBjYW4gY29ycmVsYXRlIHNlcnZlciBsb2dzIHRvIGNsaWVudCBlcnJvcnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyB0YWtlbiBmcm9tIGZvbGxvd2luZyBzaXRlOlxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2NyZWF0ZS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGdlbmVyYXRlIFVVSURcbiAqL1xuZnVuY3Rpb24gdXVpZCgpIHtcbiAgcmV0dXJuIFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCxcbiAgICAgICAgdiA9IGMgPT0gXCJ4XCIgPyByIDogciAmIDB4MyB8IDB4ODtcbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcXVpcmVkID0gcmVxdWlyZSgncmVxdWlyZXMtcG9ydCcpXG4gICwgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZ2lmeScpXG4gICwgc2xhc2hlcyA9IC9eW0EtWmEtel1bQS1aYS16MC05Ky0uXSo6W1xcXFwvXSsvXG4gICwgcHJvdG9jb2xyZSA9IC9eKFthLXpdW2EtejAtOS4rLV0qOik/KFtcXFxcL117MSx9KT8oW1xcU1xcc10qKS9pXG4gICwgd2hpdGVzcGFjZSA9ICdbXFxcXHgwOVxcXFx4MEFcXFxceDBCXFxcXHgwQ1xcXFx4MERcXFxceDIwXFxcXHhBMFxcXFx1MTY4MFxcXFx1MTgwRVxcXFx1MjAwMFxcXFx1MjAwMVxcXFx1MjAwMlxcXFx1MjAwM1xcXFx1MjAwNFxcXFx1MjAwNVxcXFx1MjAwNlxcXFx1MjAwN1xcXFx1MjAwOFxcXFx1MjAwOVxcXFx1MjAwQVxcXFx1MjAyRlxcXFx1MjA1RlxcXFx1MzAwMFxcXFx1MjAyOFxcXFx1MjAyOVxcXFx1RkVGRl0nXG4gICwgbGVmdCA9IG5ldyBSZWdFeHAoJ14nKyB3aGl0ZXNwYWNlICsnKycpO1xuXG4vKipcbiAqIFRyaW0gYSBnaXZlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBTdHJpbmcgdG8gdHJpbS5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdHJpbUxlZnQoc3RyKSB7XG4gIHJldHVybiAoc3RyID8gc3RyIDogJycpLnRvU3RyaW5nKCkucmVwbGFjZShsZWZ0LCAnJyk7XG59XG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSBwYXJzZSBydWxlcyBmb3IgdGhlIFVSTCBwYXJzZXIsIGl0IGluZm9ybXMgdGhlIHBhcnNlclxuICogYWJvdXQ6XG4gKlxuICogMC4gVGhlIGNoYXIgaXQgTmVlZHMgdG8gcGFyc2UsIGlmIGl0J3MgYSBzdHJpbmcgaXQgc2hvdWxkIGJlIGRvbmUgdXNpbmdcbiAqICAgIGluZGV4T2YsIFJlZ0V4cCB1c2luZyBleGVjIGFuZCBOYU4gbWVhbnMgc2V0IGFzIGN1cnJlbnQgdmFsdWUuXG4gKiAxLiBUaGUgcHJvcGVydHkgd2Ugc2hvdWxkIHNldCB3aGVuIHBhcnNpbmcgdGhpcyB2YWx1ZS5cbiAqIDIuIEluZGljYXRpb24gaWYgaXQncyBiYWNrd2FyZHMgb3IgZm9yd2FyZCBwYXJzaW5nLCB3aGVuIHNldCBhcyBudW1iZXIgaXQnc1xuICogICAgdGhlIHZhbHVlIG9mIGV4dHJhIGNoYXJzIHRoYXQgc2hvdWxkIGJlIHNwbGl0IG9mZi5cbiAqIDMuIEluaGVyaXQgZnJvbSBsb2NhdGlvbiBpZiBub24gZXhpc3RpbmcgaW4gdGhlIHBhcnNlci5cbiAqIDQuIGB0b0xvd2VyQ2FzZWAgdGhlIHJlc3VsdGluZyB2YWx1ZS5cbiAqL1xudmFyIHJ1bGVzID0gW1xuICBbJyMnLCAnaGFzaCddLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgWyc/JywgJ3F1ZXJ5J10sICAgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIGZ1bmN0aW9uIHNhbml0aXplKGFkZHJlc3MpIHsgICAgICAgICAgLy8gU2FuaXRpemUgd2hhdCBpcyBsZWZ0IG9mIHRoZSBhZGRyZXNzXG4gICAgcmV0dXJuIGFkZHJlc3MucmVwbGFjZSgnXFxcXCcsICcvJyk7XG4gIH0sXG4gIFsnLycsICdwYXRobmFtZSddLCAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJ0AnLCAnYXV0aCcsIDFdLCAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgZnJvbnQuXG4gIFtOYU4sICdob3N0JywgdW5kZWZpbmVkLCAxLCAxXSwgICAgICAgLy8gU2V0IGxlZnQgb3ZlciB2YWx1ZS5cbiAgWy86KFxcZCspJC8sICdwb3J0JywgdW5kZWZpbmVkLCAxXSwgICAgLy8gUmVnRXhwIHRoZSBiYWNrLlxuICBbTmFOLCAnaG9zdG5hbWUnLCB1bmRlZmluZWQsIDEsIDFdICAgIC8vIFNldCBsZWZ0IG92ZXIuXG5dO1xuXG4vKipcbiAqIFRoZXNlIHByb3BlcnRpZXMgc2hvdWxkIG5vdCBiZSBjb3BpZWQgb3IgaW5oZXJpdGVkIGZyb20uIFRoaXMgaXMgb25seSBuZWVkZWRcbiAqIGZvciBhbGwgbm9uIGJsb2IgVVJMJ3MgYXMgYSBibG9iIFVSTCBkb2VzIG5vdCBpbmNsdWRlIGEgaGFzaCwgb25seSB0aGVcbiAqIG9yaWdpbi5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByaXZhdGVcbiAqL1xudmFyIGlnbm9yZSA9IHsgaGFzaDogMSwgcXVlcnk6IDEgfTtcblxuLyoqXG4gKiBUaGUgbG9jYXRpb24gb2JqZWN0IGRpZmZlcnMgd2hlbiB5b3VyIGNvZGUgaXMgbG9hZGVkIHRocm91Z2ggYSBub3JtYWwgcGFnZSxcbiAqIFdvcmtlciBvciB0aHJvdWdoIGEgd29ya2VyIHVzaW5nIGEgYmxvYi4gQW5kIHdpdGggdGhlIGJsb2JibGUgYmVnaW5zIHRoZVxuICogdHJvdWJsZSBhcyB0aGUgbG9jYXRpb24gb2JqZWN0IHdpbGwgY29udGFpbiB0aGUgVVJMIG9mIHRoZSBibG9iLCBub3QgdGhlXG4gKiBsb2NhdGlvbiBvZiB0aGUgcGFnZSB3aGVyZSBvdXIgY29kZSBpcyBsb2FkZWQgaW4uIFRoZSBhY3R1YWwgb3JpZ2luIGlzXG4gKiBlbmNvZGVkIGluIHRoZSBgcGF0aG5hbWVgIHNvIHdlIGNhbiB0aGFua2Z1bGx5IGdlbmVyYXRlIGEgZ29vZCBcImRlZmF1bHRcIlxuICogbG9jYXRpb24gZnJvbSBpdCBzbyB3ZSBjYW4gZ2VuZXJhdGUgcHJvcGVyIHJlbGF0aXZlIFVSTCdzIGFnYWluLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gbG9jIE9wdGlvbmFsIGRlZmF1bHQgbG9jYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gbG9sY2F0aW9uIG9iamVjdC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gbG9sY2F0aW9uKGxvYykge1xuICB2YXIgZ2xvYmFsVmFyO1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gd2luZG93O1xuICBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gZ2xvYmFsO1xuICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIGdsb2JhbFZhciA9IHNlbGY7XG4gIGVsc2UgZ2xvYmFsVmFyID0ge307XG5cbiAgdmFyIGxvY2F0aW9uID0gZ2xvYmFsVmFyLmxvY2F0aW9uIHx8IHt9O1xuICBsb2MgPSBsb2MgfHwgbG9jYXRpb247XG5cbiAgdmFyIGZpbmFsZGVzdGluYXRpb24gPSB7fVxuICAgICwgdHlwZSA9IHR5cGVvZiBsb2NcbiAgICAsIGtleTtcblxuICBpZiAoJ2Jsb2I6JyA9PT0gbG9jLnByb3RvY29sKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwodW5lc2NhcGUobG9jLnBhdGhuYW1lKSwge30pO1xuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwobG9jLCB7fSk7XG4gICAgZm9yIChrZXkgaW4gaWdub3JlKSBkZWxldGUgZmluYWxkZXN0aW5hdGlvbltrZXldO1xuICB9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlKSB7XG4gICAgZm9yIChrZXkgaW4gbG9jKSB7XG4gICAgICBpZiAoa2V5IGluIGlnbm9yZSkgY29udGludWU7XG4gICAgICBmaW5hbGRlc3RpbmF0aW9uW2tleV0gPSBsb2Nba2V5XTtcbiAgICB9XG5cbiAgICBpZiAoZmluYWxkZXN0aW5hdGlvbi5zbGFzaGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpbmFsZGVzdGluYXRpb24uc2xhc2hlcyA9IHNsYXNoZXMudGVzdChsb2MuaHJlZik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZpbmFsZGVzdGluYXRpb247XG59XG5cbi8qKlxuICogQHR5cGVkZWYgUHJvdG9jb2xFeHRyYWN0XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwcm90b2NvbCBQcm90b2NvbCBtYXRjaGVkIGluIHRoZSBVUkwsIGluIGxvd2VyY2FzZS5cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc2xhc2hlcyBgdHJ1ZWAgaWYgcHJvdG9jb2wgaXMgZm9sbG93ZWQgYnkgXCIvL1wiLCBlbHNlIGBmYWxzZWAuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcmVzdCBSZXN0IG9mIHRoZSBVUkwgdGhhdCBpcyBub3QgcGFydCBvZiB0aGUgcHJvdG9jb2wuXG4gKi9cblxuLyoqXG4gKiBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGZyb20gYSBVUkwgd2l0aC93aXRob3V0IGRvdWJsZSBzbGFzaCAoXCIvL1wiKS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBVUkwgd2Ugd2FudCB0byBleHRyYWN0IGZyb20uXG4gKiBAcmV0dXJuIHtQcm90b2NvbEV4dHJhY3R9IEV4dHJhY3RlZCBpbmZvcm1hdGlvbi5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RQcm90b2NvbChhZGRyZXNzKSB7XG4gIGFkZHJlc3MgPSB0cmltTGVmdChhZGRyZXNzKTtcblxuICB2YXIgbWF0Y2ggPSBwcm90b2NvbHJlLmV4ZWMoYWRkcmVzcylcbiAgICAsIHByb3RvY29sID0gbWF0Y2hbMV0gPyBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpIDogJydcbiAgICAsIHNsYXNoZXMgPSAhIShtYXRjaFsyXSAmJiBtYXRjaFsyXS5sZW5ndGggPj0gMilcbiAgICAsIHJlc3QgPSAgbWF0Y2hbMl0gJiYgbWF0Y2hbMl0ubGVuZ3RoID09PSAxID8gJy8nICsgbWF0Y2hbM10gOiBtYXRjaFszXTtcblxuICByZXR1cm4ge1xuICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICBzbGFzaGVzOiBzbGFzaGVzLFxuICAgIHJlc3Q6IHJlc3RcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgcmVsYXRpdmUgVVJMIHBhdGhuYW1lIGFnYWluc3QgYSBiYXNlIFVSTCBwYXRobmFtZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVsYXRpdmUgUGF0aG5hbWUgb2YgdGhlIHJlbGF0aXZlIFVSTC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlIFBhdGhuYW1lIG9mIHRoZSBiYXNlIFVSTC5cbiAqIEByZXR1cm4ge1N0cmluZ30gUmVzb2x2ZWQgcGF0aG5hbWUuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiByZXNvbHZlKHJlbGF0aXZlLCBiYXNlKSB7XG4gIGlmIChyZWxhdGl2ZSA9PT0gJycpIHJldHVybiBiYXNlO1xuXG4gIHZhciBwYXRoID0gKGJhc2UgfHwgJy8nKS5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5jb25jYXQocmVsYXRpdmUuc3BsaXQoJy8nKSlcbiAgICAsIGkgPSBwYXRoLmxlbmd0aFxuICAgICwgbGFzdCA9IHBhdGhbaSAtIDFdXG4gICAgLCB1bnNoaWZ0ID0gZmFsc2VcbiAgICAsIHVwID0gMDtcblxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHBhdGhbaV0gPT09ICcuJykge1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChwYXRoW2ldID09PSAnLi4nKSB7XG4gICAgICBwYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgaWYgKGkgPT09IDApIHVuc2hpZnQgPSB0cnVlO1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1bnNoaWZ0KSBwYXRoLnVuc2hpZnQoJycpO1xuICBpZiAobGFzdCA9PT0gJy4nIHx8IGxhc3QgPT09ICcuLicpIHBhdGgucHVzaCgnJyk7XG5cbiAgcmV0dXJuIHBhdGguam9pbignLycpO1xufVxuXG4vKipcbiAqIFRoZSBhY3R1YWwgVVJMIGluc3RhbmNlLiBJbnN0ZWFkIG9mIHJldHVybmluZyBhbiBvYmplY3Qgd2UndmUgb3B0ZWQtaW4gdG9cbiAqIGNyZWF0ZSBhbiBhY3R1YWwgY29uc3RydWN0b3IgYXMgaXQncyBtdWNoIG1vcmUgbWVtb3J5IGVmZmljaWVudCBhbmRcbiAqIGZhc3RlciBhbmQgaXQgcGxlYXNlcyBteSBPQ0QuXG4gKlxuICogSXQgaXMgd29ydGggbm90aW5nIHRoYXQgd2Ugc2hvdWxkIG5vdCB1c2UgYFVSTGAgYXMgY2xhc3MgbmFtZSB0byBwcmV2ZW50XG4gKiBjbGFzaGVzIHdpdGggdGhlIGdsb2JhbCBVUkwgaW5zdGFuY2UgdGhhdCBnb3QgaW50cm9kdWNlZCBpbiBicm93c2Vycy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIFVSTCB3ZSB3YW50IHRvIHBhcnNlLlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBbbG9jYXRpb25dIExvY2F0aW9uIGRlZmF1bHRzIGZvciByZWxhdGl2ZSBwYXRocy5cbiAqIEBwYXJhbSB7Qm9vbGVhbnxGdW5jdGlvbn0gW3BhcnNlcl0gUGFyc2VyIGZvciB0aGUgcXVlcnkgc3RyaW5nLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gVXJsKGFkZHJlc3MsIGxvY2F0aW9uLCBwYXJzZXIpIHtcbiAgYWRkcmVzcyA9IHRyaW1MZWZ0KGFkZHJlc3MpO1xuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVcmwpKSB7XG4gICAgcmV0dXJuIG5ldyBVcmwoYWRkcmVzcywgbG9jYXRpb24sIHBhcnNlcik7XG4gIH1cblxuICB2YXIgcmVsYXRpdmUsIGV4dHJhY3RlZCwgcGFyc2UsIGluc3RydWN0aW9uLCBpbmRleCwga2V5XG4gICAgLCBpbnN0cnVjdGlvbnMgPSBydWxlcy5zbGljZSgpXG4gICAgLCB0eXBlID0gdHlwZW9mIGxvY2F0aW9uXG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBpID0gMDtcblxuICAvL1xuICAvLyBUaGUgZm9sbG93aW5nIGlmIHN0YXRlbWVudHMgYWxsb3dzIHRoaXMgbW9kdWxlIHR3byBoYXZlIGNvbXBhdGliaWxpdHkgd2l0aFxuICAvLyAyIGRpZmZlcmVudCBBUEk6XG4gIC8vXG4gIC8vIDEuIE5vZGUuanMncyBgdXJsLnBhcnNlYCBhcGkgd2hpY2ggYWNjZXB0cyBhIFVSTCwgYm9vbGVhbiBhcyBhcmd1bWVudHNcbiAgLy8gICAgd2hlcmUgdGhlIGJvb2xlYW4gaW5kaWNhdGVzIHRoYXQgdGhlIHF1ZXJ5IHN0cmluZyBzaG91bGQgYWxzbyBiZSBwYXJzZWQuXG4gIC8vXG4gIC8vIDIuIFRoZSBgVVJMYCBpbnRlcmZhY2Ugb2YgdGhlIGJyb3dzZXIgd2hpY2ggYWNjZXB0cyBhIFVSTCwgb2JqZWN0IGFzXG4gIC8vICAgIGFyZ3VtZW50cy4gVGhlIHN1cHBsaWVkIG9iamVjdCB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdCB2YWx1ZXMgLyBmYWxsLWJhY2tcbiAgLy8gICAgZm9yIHJlbGF0aXZlIHBhdGhzLlxuICAvL1xuICBpZiAoJ29iamVjdCcgIT09IHR5cGUgJiYgJ3N0cmluZycgIT09IHR5cGUpIHtcbiAgICBwYXJzZXIgPSBsb2NhdGlvbjtcbiAgICBsb2NhdGlvbiA9IG51bGw7XG4gIH1cblxuICBpZiAocGFyc2VyICYmICdmdW5jdGlvbicgIT09IHR5cGVvZiBwYXJzZXIpIHBhcnNlciA9IHFzLnBhcnNlO1xuXG4gIGxvY2F0aW9uID0gbG9sY2F0aW9uKGxvY2F0aW9uKTtcblxuICAvL1xuICAvLyBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGJlZm9yZSBydW5uaW5nIHRoZSBpbnN0cnVjdGlvbnMuXG4gIC8vXG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RQcm90b2NvbChhZGRyZXNzIHx8ICcnKTtcbiAgcmVsYXRpdmUgPSAhZXh0cmFjdGVkLnByb3RvY29sICYmICFleHRyYWN0ZWQuc2xhc2hlcztcbiAgdXJsLnNsYXNoZXMgPSBleHRyYWN0ZWQuc2xhc2hlcyB8fCByZWxhdGl2ZSAmJiBsb2NhdGlvbi5zbGFzaGVzO1xuICB1cmwucHJvdG9jb2wgPSBleHRyYWN0ZWQucHJvdG9jb2wgfHwgbG9jYXRpb24ucHJvdG9jb2wgfHwgJyc7XG4gIGFkZHJlc3MgPSBleHRyYWN0ZWQucmVzdDtcblxuICAvL1xuICAvLyBXaGVuIHRoZSBhdXRob3JpdHkgY29tcG9uZW50IGlzIGFic2VudCB0aGUgVVJMIHN0YXJ0cyB3aXRoIGEgcGF0aFxuICAvLyBjb21wb25lbnQuXG4gIC8vXG4gIGlmICghZXh0cmFjdGVkLnNsYXNoZXMpIGluc3RydWN0aW9uc1szXSA9IFsvKC4qKS8sICdwYXRobmFtZSddO1xuXG4gIGZvciAoOyBpIDwgaW5zdHJ1Y3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaW5zdHJ1Y3Rpb24gPSBpbnN0cnVjdGlvbnNbaV07XG5cbiAgICBpZiAodHlwZW9mIGluc3RydWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhZGRyZXNzID0gaW5zdHJ1Y3Rpb24oYWRkcmVzcyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBwYXJzZSA9IGluc3RydWN0aW9uWzBdO1xuICAgIGtleSA9IGluc3RydWN0aW9uWzFdO1xuXG4gICAgaWYgKHBhcnNlICE9PSBwYXJzZSkge1xuICAgICAgdXJsW2tleV0gPSBhZGRyZXNzO1xuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBwYXJzZSkge1xuICAgICAgaWYgKH4oaW5kZXggPSBhZGRyZXNzLmluZGV4T2YocGFyc2UpKSkge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBpbnN0cnVjdGlvblsyXSkge1xuICAgICAgICAgIHVybFtrZXldID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoaW5kZXggKyBpbnN0cnVjdGlvblsyXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsW2tleV0gPSBhZGRyZXNzLnNsaWNlKGluZGV4KTtcbiAgICAgICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKChpbmRleCA9IHBhcnNlLmV4ZWMoYWRkcmVzcykpKSB7XG4gICAgICB1cmxba2V5XSA9IGluZGV4WzFdO1xuICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXguaW5kZXgpO1xuICAgIH1cblxuICAgIHVybFtrZXldID0gdXJsW2tleV0gfHwgKFxuICAgICAgcmVsYXRpdmUgJiYgaW5zdHJ1Y3Rpb25bM10gPyBsb2NhdGlvbltrZXldIHx8ICcnIDogJydcbiAgICApO1xuXG4gICAgLy9cbiAgICAvLyBIb3N0bmFtZSwgaG9zdCBhbmQgcHJvdG9jb2wgc2hvdWxkIGJlIGxvd2VyY2FzZWQgc28gdGhleSBjYW4gYmUgdXNlZCB0b1xuICAgIC8vIGNyZWF0ZSBhIHByb3BlciBgb3JpZ2luYC5cbiAgICAvL1xuICAgIGlmIChpbnN0cnVjdGlvbls0XSkgdXJsW2tleV0gPSB1cmxba2V5XS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLy9cbiAgLy8gQWxzbyBwYXJzZSB0aGUgc3VwcGxpZWQgcXVlcnkgc3RyaW5nIGluIHRvIGFuIG9iamVjdC4gSWYgd2UncmUgc3VwcGxpZWRcbiAgLy8gd2l0aCBhIGN1c3RvbSBwYXJzZXIgYXMgZnVuY3Rpb24gdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgZGVmYXVsdCBidWlsZC1pblxuICAvLyBwYXJzZXIuXG4gIC8vXG4gIGlmIChwYXJzZXIpIHVybC5xdWVyeSA9IHBhcnNlcih1cmwucXVlcnkpO1xuXG4gIC8vXG4gIC8vIElmIHRoZSBVUkwgaXMgcmVsYXRpdmUsIHJlc29sdmUgdGhlIHBhdGhuYW1lIGFnYWluc3QgdGhlIGJhc2UgVVJMLlxuICAvL1xuICBpZiAoXG4gICAgICByZWxhdGl2ZVxuICAgICYmIGxvY2F0aW9uLnNsYXNoZXNcbiAgICAmJiB1cmwucGF0aG5hbWUuY2hhckF0KDApICE9PSAnLydcbiAgICAmJiAodXJsLnBhdGhuYW1lICE9PSAnJyB8fCBsb2NhdGlvbi5wYXRobmFtZSAhPT0gJycpXG4gICkge1xuICAgIHVybC5wYXRobmFtZSA9IHJlc29sdmUodXJsLnBhdGhuYW1lLCBsb2NhdGlvbi5wYXRobmFtZSk7XG4gIH1cblxuICAvL1xuICAvLyBEZWZhdWx0IHRvIGEgLyBmb3IgcGF0aG5hbWUgaWYgbm9uZSBleGlzdHMuIFRoaXMgbm9ybWFsaXplcyB0aGUgVVJMXG4gIC8vIHRvIGFsd2F5cyBoYXZlIGEgL1xuICAvL1xuICBpZiAodXJsLnBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nICYmIHVybC5ob3N0bmFtZSkge1xuICAgIHVybC5wYXRobmFtZSA9ICcvJyArIHVybC5wYXRobmFtZTtcbiAgfVxuXG4gIC8vXG4gIC8vIFdlIHNob3VsZCBub3QgYWRkIHBvcnQgbnVtYmVycyBpZiB0aGV5IGFyZSBhbHJlYWR5IHRoZSBkZWZhdWx0IHBvcnQgbnVtYmVyXG4gIC8vIGZvciBhIGdpdmVuIHByb3RvY29sLiBBcyB0aGUgaG9zdCBhbHNvIGNvbnRhaW5zIHRoZSBwb3J0IG51bWJlciB3ZSdyZSBnb2luZ1xuICAvLyBvdmVycmlkZSBpdCB3aXRoIHRoZSBob3N0bmFtZSB3aGljaCBjb250YWlucyBubyBwb3J0IG51bWJlci5cbiAgLy9cbiAgaWYgKCFyZXF1aXJlZCh1cmwucG9ydCwgdXJsLnByb3RvY29sKSkge1xuICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgIHVybC5wb3J0ID0gJyc7XG4gIH1cblxuICAvL1xuICAvLyBQYXJzZSBkb3duIHRoZSBgYXV0aGAgZm9yIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQuXG4gIC8vXG4gIHVybC51c2VybmFtZSA9IHVybC5wYXNzd29yZCA9ICcnO1xuICBpZiAodXJsLmF1dGgpIHtcbiAgICBpbnN0cnVjdGlvbiA9IHVybC5hdXRoLnNwbGl0KCc6Jyk7XG4gICAgdXJsLnVzZXJuYW1lID0gaW5zdHJ1Y3Rpb25bMF0gfHwgJyc7XG4gICAgdXJsLnBhc3N3b3JkID0gaW5zdHJ1Y3Rpb25bMV0gfHwgJyc7XG4gIH1cblxuICB1cmwub3JpZ2luID0gdXJsLnByb3RvY29sICYmIHVybC5ob3N0ICYmIHVybC5wcm90b2NvbCAhPT0gJ2ZpbGU6J1xuICAgID8gdXJsLnByb3RvY29sICsnLy8nKyB1cmwuaG9zdFxuICAgIDogJ251bGwnO1xuXG4gIC8vXG4gIC8vIFRoZSBocmVmIGlzIGp1c3QgdGhlIGNvbXBpbGVkIHJlc3VsdC5cbiAgLy9cbiAgdXJsLmhyZWYgPSB1cmwudG9TdHJpbmcoKTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY2hhbmdpbmcgcHJvcGVydGllcyBpbiB0aGUgVVJMIGluc3RhbmNlIHRvXG4gKiBpbnN1cmUgdGhhdCB0aGV5IGFsbCBwcm9wYWdhdGUgY29ycmVjdGx5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXJ0ICAgICAgICAgIFByb3BlcnR5IHdlIG5lZWQgdG8gYWRqdXN0LlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgICAgICAgICAgVGhlIG5ld2x5IGFzc2lnbmVkIHZhbHVlLlxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSBmbiAgV2hlbiBzZXR0aW5nIHRoZSBxdWVyeSwgaXQgd2lsbCBiZSB0aGUgZnVuY3Rpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWQgdG8gcGFyc2UgdGhlIHF1ZXJ5LlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2hlbiBzZXR0aW5nIHRoZSBwcm90b2NvbCwgZG91YmxlIHNsYXNoIHdpbGwgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWQgZnJvbSB0aGUgZmluYWwgdXJsIGlmIGl0IGlzIHRydWUuXG4gKiBAcmV0dXJucyB7VVJMfSBVUkwgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBzZXQocGFydCwgdmFsdWUsIGZuKSB7XG4gIHZhciB1cmwgPSB0aGlzO1xuXG4gIHN3aXRjaCAocGFydCkge1xuICAgIGNhc2UgJ3F1ZXJ5JzpcbiAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICB2YWx1ZSA9IChmbiB8fCBxcy5wYXJzZSkodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncG9ydCc6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcblxuICAgICAgaWYgKCFyZXF1aXJlZCh2YWx1ZSwgdXJsLnByb3RvY29sKSkge1xuICAgICAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZTtcbiAgICAgICAgdXJsW3BhcnRdID0gJyc7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lICsnOicrIHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hvc3RuYW1lJzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAodXJsLnBvcnQpIHZhbHVlICs9ICc6JysgdXJsLnBvcnQ7XG4gICAgICB1cmwuaG9zdCA9IHZhbHVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdob3N0JzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoLzpcXGQrJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zcGxpdCgnOicpO1xuICAgICAgICB1cmwucG9ydCA9IHZhbHVlLnBvcCgpO1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZS5qb2luKCc6Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZTtcbiAgICAgICAgdXJsLnBvcnQgPSAnJztcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwcm90b2NvbCc6XG4gICAgICB1cmwucHJvdG9jb2wgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgdXJsLnNsYXNoZXMgPSAhZm47XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3BhdGhuYW1lJzpcbiAgICBjYXNlICdoYXNoJzpcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB2YXIgY2hhciA9IHBhcnQgPT09ICdwYXRobmFtZScgPyAnLycgOiAnIyc7XG4gICAgICAgIHVybFtwYXJ0XSA9IHZhbHVlLmNoYXJBdCgwKSAhPT0gY2hhciA/IGNoYXIgKyB2YWx1ZSA6IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaW5zID0gcnVsZXNbaV07XG5cbiAgICBpZiAoaW5zWzRdKSB1cmxbaW5zWzFdXSA9IHVybFtpbnNbMV1dLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICB1cmwub3JpZ2luID0gdXJsLnByb3RvY29sICYmIHVybC5ob3N0ICYmIHVybC5wcm90b2NvbCAhPT0gJ2ZpbGU6J1xuICAgID8gdXJsLnByb3RvY29sICsnLy8nKyB1cmwuaG9zdFxuICAgIDogJ251bGwnO1xuXG4gIHVybC5ocmVmID0gdXJsLnRvU3RyaW5nKCk7XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIHByb3BlcnRpZXMgYmFjayBpbiB0byBhIHZhbGlkIGFuZCBmdWxsIFVSTCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5naWZ5IE9wdGlvbmFsIHF1ZXJ5IHN0cmluZ2lmeSBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IENvbXBpbGVkIHZlcnNpb24gb2YgdGhlIFVSTC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcoc3RyaW5naWZ5KSB7XG4gIGlmICghc3RyaW5naWZ5IHx8ICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdHJpbmdpZnkpIHN0cmluZ2lmeSA9IHFzLnN0cmluZ2lmeTtcblxuICB2YXIgcXVlcnlcbiAgICAsIHVybCA9IHRoaXNcbiAgICAsIHByb3RvY29sID0gdXJsLnByb3RvY29sO1xuXG4gIGlmIChwcm90b2NvbCAmJiBwcm90b2NvbC5jaGFyQXQocHJvdG9jb2wubGVuZ3RoIC0gMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIHZhciByZXN1bHQgPSBwcm90b2NvbCArICh1cmwuc2xhc2hlcyA/ICcvLycgOiAnJyk7XG5cbiAgaWYgKHVybC51c2VybmFtZSkge1xuICAgIHJlc3VsdCArPSB1cmwudXNlcm5hbWU7XG4gICAgaWYgKHVybC5wYXNzd29yZCkgcmVzdWx0ICs9ICc6JysgdXJsLnBhc3N3b3JkO1xuICAgIHJlc3VsdCArPSAnQCc7XG4gIH1cblxuICByZXN1bHQgKz0gdXJsLmhvc3QgKyB1cmwucGF0aG5hbWU7XG5cbiAgcXVlcnkgPSAnb2JqZWN0JyA9PT0gdHlwZW9mIHVybC5xdWVyeSA/IHN0cmluZ2lmeSh1cmwucXVlcnkpIDogdXJsLnF1ZXJ5O1xuICBpZiAocXVlcnkpIHJlc3VsdCArPSAnPycgIT09IHF1ZXJ5LmNoYXJBdCgwKSA/ICc/JysgcXVlcnkgOiBxdWVyeTtcblxuICBpZiAodXJsLmhhc2gpIHJlc3VsdCArPSB1cmwuaGFzaDtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5VcmwucHJvdG90eXBlID0geyBzZXQ6IHNldCwgdG9TdHJpbmc6IHRvU3RyaW5nIH07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIFVSTCBwYXJzZXIgYW5kIHNvbWUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRoYXQgbWlnaHQgYmUgdXNlZnVsIGZvclxuLy8gb3RoZXJzIG9yIHRlc3RpbmcuXG4vL1xuVXJsLmV4dHJhY3RQcm90b2NvbCA9IGV4dHJhY3RQcm90b2NvbDtcblVybC5sb2NhdGlvbiA9IGxvbGNhdGlvbjtcblVybC50cmltTGVmdCA9IHRyaW1MZWZ0O1xuVXJsLnFzID0gcXM7XG5cbm1vZHVsZS5leHBvcnRzID0gVXJsO1xuIiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gICMgd2lsZGNhcmRcblxuICBWZXJ5IHNpbXBsZSB3aWxkY2FyZCBtYXRjaGluZywgd2hpY2ggaXMgZGVzaWduZWQgdG8gcHJvdmlkZSB0aGUgc2FtZVxuICBmdW5jdGlvbmFsaXR5IHRoYXQgaXMgZm91bmQgaW4gdGhlXG4gIFtldmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9hZG9iZS13ZWJwbGF0Zm9ybS9ldmUpIGV2ZW50aW5nIGxpYnJhcnkuXG5cbiAgIyMgVXNhZ2VcblxuICBJdCB3b3JrcyB3aXRoIHN0cmluZ3M6XG5cbiAgPDw8IGV4YW1wbGVzL3N0cmluZ3MuanNcblxuICBBcnJheXM6XG5cbiAgPDw8IGV4YW1wbGVzL2FycmF5cy5qc1xuXG4gIE9iamVjdHMgKG1hdGNoaW5nIGFnYWluc3Qga2V5cyk6XG5cbiAgPDw8IGV4YW1wbGVzL29iamVjdHMuanNcblxuICBXaGlsZSB0aGUgbGlicmFyeSB3b3JrcyBpbiBOb2RlLCBpZiB5b3UgYXJlIGFyZSBsb29raW5nIGZvciBmaWxlLWJhc2VkXG4gIHdpbGRjYXJkIG1hdGNoaW5nIHRoZW4geW91IHNob3VsZCBoYXZlIGEgbG9vayBhdDpcblxuICA8aHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLWdsb2I+XG4qKi9cblxuZnVuY3Rpb24gV2lsZGNhcmRNYXRjaGVyKHRleHQsIHNlcGFyYXRvcikge1xuICB0aGlzLnRleHQgPSB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgdGhpcy5oYXNXaWxkID0gfnRleHQuaW5kZXhPZignKicpO1xuICB0aGlzLnNlcGFyYXRvciA9IHNlcGFyYXRvcjtcbiAgdGhpcy5wYXJ0cyA9IHRleHQuc3BsaXQoc2VwYXJhdG9yKTtcbn1cblxuV2lsZGNhcmRNYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gIHZhciBtYXRjaGVzID0gdHJ1ZTtcbiAgdmFyIHBhcnRzID0gdGhpcy5wYXJ0cztcbiAgdmFyIGlpO1xuICB2YXIgcGFydHNDb3VudCA9IHBhcnRzLmxlbmd0aDtcbiAgdmFyIHRlc3RQYXJ0cztcblxuICBpZiAodHlwZW9mIGlucHV0ID09ICdzdHJpbmcnIHx8IGlucHV0IGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmhhc1dpbGQgJiYgdGhpcy50ZXh0ICE9IGlucHV0KSB7XG4gICAgICBtYXRjaGVzID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlc3RQYXJ0cyA9IChpbnB1dCB8fCAnJykuc3BsaXQodGhpcy5zZXBhcmF0b3IpO1xuICAgICAgZm9yIChpaSA9IDA7IG1hdGNoZXMgJiYgaWkgPCBwYXJ0c0NvdW50OyBpaSsrKSB7XG4gICAgICAgIGlmIChwYXJ0c1tpaV0gPT09ICcqJykgIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpaSA8IHRlc3RQYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICBtYXRjaGVzID0gcGFydHNbaWldID09PSB0ZXN0UGFydHNbaWldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hdGNoZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiBtYXRjaGVzLCB0aGVuIHJldHVybiB0aGUgY29tcG9uZW50IHBhcnRzXG4gICAgICBtYXRjaGVzID0gbWF0Y2hlcyAmJiB0ZXN0UGFydHM7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBpbnB1dC5zcGxpY2UgPT0gJ2Z1bmN0aW9uJykge1xuICAgIG1hdGNoZXMgPSBbXTtcblxuICAgIGZvciAoaWkgPSBpbnB1dC5sZW5ndGg7IGlpLS07ICkge1xuICAgICAgaWYgKHRoaXMubWF0Y2goaW5wdXRbaWldKSkge1xuICAgICAgICBtYXRjaGVzW21hdGNoZXMubGVuZ3RoXSA9IGlucHV0W2lpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGlucHV0ID09ICdvYmplY3QnKSB7XG4gICAgbWF0Y2hlcyA9IHt9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIGlucHV0KSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChrZXkpKSB7XG4gICAgICAgIG1hdGNoZXNba2V5XSA9IGlucHV0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQsIHRlc3QsIHNlcGFyYXRvcikge1xuICB2YXIgbWF0Y2hlciA9IG5ldyBXaWxkY2FyZE1hdGNoZXIodGV4dCwgc2VwYXJhdG9yIHx8IC9bXFwvXFwuXS8pO1xuICBpZiAodHlwZW9mIHRlc3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gbWF0Y2hlci5tYXRjaCh0ZXN0KTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVyO1xufTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBBdXRoRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcignQXV0aG9yaXphdGlvbiByZXF1aXJlZCcpXG4gICAgdGhpcy5uYW1lID0gJ0F1dGhFcnJvcidcbiAgICB0aGlzLmlzQXV0aEVycm9yID0gdHJ1ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aEVycm9yXG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5jb25zdCB0b2tlblN0b3JhZ2UgPSByZXF1aXJlKCcuL3Rva2VuU3RvcmFnZScpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICAgIHRoaXMudG9rZW5LZXkgPSBgY29tcGFuaW9uLSR7dGhpcy5wbHVnaW5JZH0tYXV0aC10b2tlbmBcbiAgICB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgPSB0aGlzLm9wdHMuY29tcGFuaW9uS2V5c1BhcmFtc1xuICAgIHRoaXMucHJlQXV0aFRva2VuID0gbnVsbFxuICB9XG5cbiAgaGVhZGVycyAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtzdXBlci5oZWFkZXJzKCksIHRoaXMuZ2V0QXV0aFRva2VuKCldKVxuICAgICAgLnRoZW4oKFtoZWFkZXJzLCB0b2tlbl0pID0+IHtcbiAgICAgICAgY29uc3QgYXV0aEhlYWRlcnMgPSB7fVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICBhdXRoSGVhZGVyc1sndXBweS1hdXRoLXRva2VuJ10gPSB0b2tlblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcykge1xuICAgICAgICAgIGF1dGhIZWFkZXJzWyd1cHB5LWNyZWRlbnRpYWxzLXBhcmFtcyddID0gYnRvYShcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgcGFyYW1zOiB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgfSlcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgLi4uaGVhZGVycywgLi4uYXV0aEhlYWRlcnMgfVxuICAgICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIHJlc3BvbnNlID0gc3VwZXIub25SZWNlaXZlUmVzcG9uc2UocmVzcG9uc2UpXG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKVxuICAgIGNvbnN0IG9sZEF1dGhlbnRpY2F0ZWQgPSBwbHVnaW4uZ2V0UGx1Z2luU3RhdGUoKS5hdXRoZW50aWNhdGVkXG4gICAgY29uc3QgYXV0aGVudGljYXRlZCA9IG9sZEF1dGhlbnRpY2F0ZWQgPyByZXNwb25zZS5zdGF0dXMgIT09IDQwMSA6IHJlc3BvbnNlLnN0YXR1cyA8IDQwMFxuICAgIHBsdWdpbi5zZXRQbHVnaW5TdGF0ZSh7IGF1dGhlbnRpY2F0ZWQgfSlcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHNldEF1dGhUb2tlbiAodG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnNldEl0ZW0odGhpcy50b2tlbktleSwgdG9rZW4pXG4gIH1cblxuICBnZXRBdXRoVG9rZW4gKCkge1xuICAgIHJldHVybiB0aGlzLnVwcHkuZ2V0UGx1Z2luKHRoaXMucGx1Z2luSWQpLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnRva2VuS2V5KVxuICB9XG5cbiAgYXV0aFVybCAocXVlcmllcyA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJlQXV0aFRva2VuKSB7XG4gICAgICBxdWVyaWVzLnVwcHlQcmVBdXRoVG9rZW4gPSB0aGlzLnByZUF1dGhUb2tlblxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aGlzLmhvc3RuYW1lfS8ke3RoaXMuaWR9L2Nvbm5lY3Q/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJpZXMpfWBcbiAgfVxuXG4gIGZpbGVVcmwgKGlkKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaG9zdG5hbWV9LyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgZmV0Y2hQcmVBdXRoVG9rZW4gKCkge1xuICAgIGlmICghdGhpcy5jb21wYW5pb25LZXlzUGFyYW1zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KGAke3RoaXMuaWR9L3ByZWF1dGgvYCwgeyBwYXJhbXM6IHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcyB9KVxuICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnByZUF1dGhUb2tlbiA9IHJlcy50b2tlblxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSB1bmFibGUgdG8gZmV0Y2ggcHJlQXV0aFRva2VuICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgIH0pXG4gIH1cblxuICBsaXN0IChkaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbGlzdC8ke2RpcmVjdG9yeSB8fCAnJ31gKVxuICB9XG5cbiAgbG9nb3V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbG9nb3V0YClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gUHJvbWlzZS5hbGwoW1xuICAgICAgICByZXNwb25zZSxcbiAgICAgICAgdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy50b2tlbktleSksXG4gICAgICBdKSkudGhlbigoW3Jlc3BvbnNlXSkgPT4gcmVzcG9uc2UpXG4gIH1cblxuICBzdGF0aWMgaW5pdFBsdWdpbiAocGx1Z2luLCBvcHRzLCBkZWZhdWx0T3B0cykge1xuICAgIHBsdWdpbi50eXBlID0gJ2FjcXVpcmVyJ1xuICAgIHBsdWdpbi5maWxlcyA9IFtdXG4gICAgaWYgKGRlZmF1bHRPcHRzKSB7XG4gICAgICBwbHVnaW4ub3B0cyA9IHsgLi4uZGVmYXVsdE9wdHMsIC4uLm9wdHMgfVxuICAgIH1cblxuICAgIGlmIChvcHRzLnNlcnZlclVybCB8fCBvcHRzLnNlcnZlclBhdHRlcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlcnZlclVybGAgYW5kIGBzZXJ2ZXJQYXR0ZXJuYCBoYXZlIGJlZW4gcmVuYW1lZCB0byBgY29tcGFuaW9uVXJsYCBhbmQgYGNvbXBhbmlvbkFsbG93ZWRIb3N0c2AgcmVzcGVjdGl2ZWx5IGluIHRoZSAwLjMwLjUgcmVsZWFzZS4gUGxlYXNlIGNvbnN1bHQgdGhlIGRvY3MgKGZvciBleGFtcGxlLCBodHRwczovL3VwcHkuaW8vZG9jcy9pbnN0YWdyYW0vIGZvciB0aGUgSW5zdGFncmFtIHBsdWdpbikgYW5kIHVzZSB0aGUgdXBkYXRlZCBvcHRpb25zLmAnKVxuICAgIH1cblxuICAgIGlmIChvcHRzLmNvbXBhbmlvbkFsbG93ZWRIb3N0cykge1xuICAgICAgY29uc3QgcGF0dGVybiA9IG9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzXG4gICAgICAvLyB2YWxpZGF0ZSBjb21wYW5pb25BbGxvd2VkSG9zdHMgcGFyYW1cbiAgICAgIGlmICh0eXBlb2YgcGF0dGVybiAhPT0gJ3N0cmluZycgJiYgIUFycmF5LmlzQXJyYXkocGF0dGVybikgJiYgIShwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke3BsdWdpbi5pZH06IHRoZSBvcHRpb24gXCJjb21wYW5pb25BbGxvd2VkSG9zdHNcIiBtdXN0IGJlIG9uZSBvZiBzdHJpbmcsIEFycmF5LCBSZWdFeHBgKVxuICAgICAgfVxuICAgICAgcGx1Z2luLm9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzID0gcGF0dGVyblxuICAgIH0gZWxzZSBpZiAoL14oPyFodHRwcz86XFwvXFwvKS4qJC9pLnRlc3Qob3B0cy5jb21wYW5pb25VcmwpKSB7XG4gICAgICAvLyBkb2VzIG5vdCBzdGFydCB3aXRoIGh0dHBzOi8vXG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBgaHR0cHM6Ly8ke29wdHMuY29tcGFuaW9uVXJsLnJlcGxhY2UoL15cXC9cXC8vLCAnJyl9YFxuICAgIH0gZWxzZSB7XG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBuZXcgVVJMKG9wdHMuY29tcGFuaW9uVXJsKS5vcmlnaW5cbiAgICB9XG5cbiAgICBwbHVnaW4uc3RvcmFnZSA9IHBsdWdpbi5vcHRzLnN0b3JhZ2UgfHwgdG9rZW5TdG9yYWdlXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmZXRjaFdpdGhOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmV0Y2hXaXRoTmV0d29ya0Vycm9yJylcbmNvbnN0IEF1dGhFcnJvciA9IHJlcXVpcmUoJy4vQXV0aEVycm9yJylcblxuLy8gUmVtb3ZlIHRoZSB0cmFpbGluZyBzbGFzaCBzbyB3ZSBjYW4gYWx3YXlzIHNhZmVseSBhcHBlbmQgL3h5ei5cbmZ1bmN0aW9uIHN0cmlwU2xhc2ggKHVybCkge1xuICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSlNPTlJlc3BvbnNlIChyZXMpIHtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSkge1xuICAgIHRocm93IG5ldyBBdXRoRXJyb3IoKVxuICB9XG5cbiAgY29uc3QganNvblByb21pc2UgPSByZXMuanNvbigpXG5cbiAgaWYgKHJlcy5zdGF0dXMgPCAyMDAgfHwgcmVzLnN0YXR1cyA+IDMwMCkge1xuICAgIGxldCBlcnJNc2cgPSBgRmFpbGVkIHJlcXVlc3Qgd2l0aCBzdGF0dXM6ICR7cmVzLnN0YXR1c30uICR7cmVzLnN0YXR1c1RleHR9YFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnJEYXRhID0gYXdhaXQganNvblByb21pc2VcbiAgICAgIGVyck1zZyA9IGVyckRhdGEubWVzc2FnZSA/IGAke2Vyck1zZ30gbWVzc2FnZTogJHtlcnJEYXRhLm1lc3NhZ2V9YCA6IGVyck1zZ1xuICAgICAgZXJyTXNnID0gZXJyRGF0YS5yZXF1ZXN0SWQgPyBgJHtlcnJNc2d9IHJlcXVlc3QtSWQ6ICR7ZXJyRGF0YS5yZXF1ZXN0SWR9YCA6IGVyck1zZ1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5zYWZlLWZpbmFsbHlcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpXG4gICAgfVxuICB9XG4gIHJldHVybiBqc29uUHJvbWlzZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJlcXVlc3RDbGllbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgI2dldFBvc3RSZXNwb25zZUZ1bmMgPSBza2lwID0+IHJlc3BvbnNlID0+IChza2lwID8gcmVzcG9uc2UgOiB0aGlzLm9uUmVjZWl2ZVJlc3BvbnNlKHJlc3BvbnNlKSlcblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHRoaXMudXBweSA9IHVwcHlcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgdGhpcy5vblJlY2VpdmVSZXNwb25zZSA9IHRoaXMub25SZWNlaXZlUmVzcG9uc2UuYmluZCh0aGlzKVxuICAgIHRoaXMuYWxsb3dlZEhlYWRlcnMgPSBbJ2FjY2VwdCcsICdjb250ZW50LXR5cGUnLCAndXBweS1hdXRoLXRva2VuJ11cbiAgICB0aGlzLnByZWZsaWdodERvbmUgPSBmYWxzZVxuICB9XG5cbiAgZ2V0IGhvc3RuYW1lICgpIHtcbiAgICBjb25zdCB7IGNvbXBhbmlvbiB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIHJldHVybiBzdHJpcFNsYXNoKGNvbXBhbmlvbiAmJiBjb21wYW5pb25baG9zdF0gPyBjb21wYW5pb25baG9zdF0gOiBob3N0KVxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRIZWFkZXJzID17XG4gICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnVXBweS1WZXJzaW9ucyc6IGBAdXBweS9jb21wYW5pb24tY2xpZW50PSR7UmVxdWVzdENsaWVudC5WRVJTSU9OfWAsXG4gIH1cblxuICBoZWFkZXJzICgpIHtcbiAgICBjb25zdCB1c2VySGVhZGVycyA9IHRoaXMub3B0cy5jb21wYW5pb25IZWFkZXJzIHx8IHt9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAuLi5SZXF1ZXN0Q2xpZW50LmRlZmF1bHRIZWFkZXJzLFxuICAgICAgLi4udXNlckhlYWRlcnMsXG4gICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBjb21wYW5pb24gPSBzdGF0ZS5jb21wYW5pb24gfHwge31cbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIGNvbnN0IHsgaGVhZGVycyB9ID0gcmVzcG9uc2VcbiAgICAvLyBTdG9yZSB0aGUgc2VsZi1pZGVudGlmaWVkIGRvbWFpbiBuYW1lIGZvciB0aGUgQ29tcGFuaW9uIGluc3RhbmNlIHdlIGp1c3QgaGl0LlxuICAgIGlmIChoZWFkZXJzLmhhcygnaS1hbScpICYmIGhlYWRlcnMuZ2V0KCdpLWFtJykgIT09IGNvbXBhbmlvbltob3N0XSkge1xuICAgICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgICAgY29tcGFuaW9uOiB7IC4uLmNvbXBhbmlvbiwgW2hvc3RdOiBoZWFkZXJzLmdldCgnaS1hbScpIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gICNnZXRVcmwgKHVybCkge1xuICAgIGlmICgvXihodHRwcz86fClcXC9cXC8vLnRlc3QodXJsKSkge1xuICAgICAgcmV0dXJuIHVybFxuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vJHt1cmx9YFxuICB9XG5cbiAgI2Vycm9ySGFuZGxlciAobWV0aG9kLCBwYXRoKSB7XG4gICAgcmV0dXJuIChlcnIpID0+IHtcbiAgICAgIGlmICghZXJyPy5pc0F1dGhFcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgQ291bGQgbm90ICR7bWV0aG9kfSAke3RoaXMuI2dldFVybChwYXRoKX1gKVxuICAgICAgICBlcnJvci5jYXVzZSA9IGVyclxuICAgICAgICBlcnIgPSBlcnJvciAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgIH1cbiAgfVxuXG4gIHByZWZsaWdodCAocGF0aCkge1xuICAgIGlmICh0aGlzLnByZWZsaWdodERvbmUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpKVxuICAgIH1cblxuICAgIHJldHVybiBmZXRjaCh0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgIG1ldGhvZDogJ09QVElPTlMnLFxuICAgIH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMuaGFzKCdhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJykpIHtcbiAgICAgICAgICB0aGlzLmFsbG93ZWRIZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnKVxuICAgICAgICAgICAgLnNwbGl0KCcsJykubWFwKChoZWFkZXJOYW1lKSA9PiBoZWFkZXJOYW1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0RG9uZSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsb3dlZEhlYWRlcnMuc2xpY2UoKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coYFtDb21wYW5pb25DbGllbnRdIHVuYWJsZSB0byBtYWtlIHByZWZsaWdodCByZXF1ZXN0ICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgICAgdGhpcy5wcmVmbGlnaHREb25lID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpXG4gICAgICB9KVxuICB9XG5cbiAgcHJlZmxpZ2h0QW5kSGVhZGVycyAocGF0aCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5wcmVmbGlnaHQocGF0aCksIHRoaXMuaGVhZGVycygpXSlcbiAgICAgIC50aGVuKChbYWxsb3dlZEhlYWRlcnMsIGhlYWRlcnNdKSA9PiB7XG4gICAgICAgIC8vIGZpbHRlciB0byBrZWVwIG9ubHkgYWxsb3dlZCBIZWFkZXJzXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICAgIGlmICghYWxsb3dlZEhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSBleGNsdWRpbmcgZGlzYWxsb3dlZCBoZWFkZXIgJHtoZWFkZXJ9YClcbiAgICAgICAgICAgIGRlbGV0ZSBoZWFkZXJzW2hlYWRlcl0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gaGVhZGVyc1xuICAgICAgfSlcbiAgfVxuXG4gIGdldCAocGF0aCwgc2tpcFBvc3RSZXNwb25zZSkge1xuICAgIGNvbnN0IG1ldGhvZCA9ICdnZXQnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICB9KSlcbiAgICAgIC50aGVuKHRoaXMuI2dldFBvc3RSZXNwb25zZUZ1bmMoc2tpcFBvc3RSZXNwb25zZSkpXG4gICAgICAudGhlbihoYW5kbGVKU09OUmVzcG9uc2UpXG4gICAgICAuY2F0Y2godGhpcy4jZXJyb3JIYW5kbGVyKG1ldGhvZCwgcGF0aCkpXG4gIH1cblxuICBwb3N0IChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ3Bvc3QnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG5cbiAgZGVsZXRlIChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ2RlbGV0ZSdcbiAgICByZXR1cm4gdGhpcy5wcmVmbGlnaHRBbmRIZWFkZXJzKHBhdGgpXG4gICAgICAudGhlbigoaGVhZGVycykgPT4gZmV0Y2hXaXRoTmV0d29ya0Vycm9yKGAke3RoaXMuaG9zdG5hbWV9LyR7cGF0aH1gLCB7XG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgY3JlZGVudGlhbHM6IHRoaXMub3B0cy5jb21wYW5pb25Db29raWVzUnVsZSB8fCAnc2FtZS1vcmlnaW4nLFxuICAgICAgICBib2R5OiBkYXRhID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiBudWxsLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU2VhcmNoUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICB9XG5cbiAgZmlsZVVybCAoaWQpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vc2VhcmNoLyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgc2VhcmNoICh0ZXh0LCBxdWVyaWVzKSB7XG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgPyBgJiR7cXVlcmllc31gIDogJydcbiAgICByZXR1cm4gdGhpcy5nZXQoYHNlYXJjaC8ke3RoaXMuaWR9L2xpc3Q/cT0ke2VuY29kZVVSSUNvbXBvbmVudCh0ZXh0KX0ke3F1ZXJpZXN9YClcbiAgfVxufVxuIiwiY29uc3QgZWUgPSByZXF1aXJlKCduYW1lc3BhY2UtZW1pdHRlcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVXBweVNvY2tldCB7XG4gICNxdWV1ZWQgPSBbXVxuXG4gICNlbWl0dGVyID0gZWUoKVxuXG4gICNpc09wZW4gPSBmYWxzZVxuXG4gICNzb2NrZXRcblxuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMub3B0cyA9IG9wdHNcblxuICAgIGlmICghb3B0cyB8fCBvcHRzLmF1dG9PcGVuICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5vcGVuKClcbiAgICB9XG4gIH1cblxuICBnZXQgaXNPcGVuICgpIHsgcmV0dXJuIHRoaXMuI2lzT3BlbiB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0U29ja2V0JyldICgpIHsgcmV0dXJuIHRoaXMuI3NvY2tldCB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0UXVldWVkJyldICgpIHsgcmV0dXJuIHRoaXMuI3F1ZXVlZCB9XG5cbiAgb3BlbiAoKSB7XG4gICAgdGhpcy4jc29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLm9wdHMudGFyZ2V0KVxuXG4gICAgdGhpcy4jc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2lzT3BlbiA9IHRydWVcblxuICAgICAgd2hpbGUgKHRoaXMuI3F1ZXVlZC5sZW5ndGggPiAwICYmIHRoaXMuI2lzT3Blbikge1xuICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMuI3F1ZXVlZC5zaGlmdCgpXG4gICAgICAgIHRoaXMuc2VuZChmaXJzdC5hY3Rpb24sIGZpcnN0LnBheWxvYWQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNpc09wZW4gPSBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMuI3NvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLiNoYW5kbGVNZXNzYWdlXG4gIH1cblxuICBjbG9zZSAoKSB7XG4gICAgdGhpcy4jc29ja2V0Py5jbG9zZSgpXG4gIH1cblxuICBzZW5kIChhY3Rpb24sIHBheWxvYWQpIHtcbiAgICAvLyBhdHRhY2ggdXVpZFxuXG4gICAgaWYgKCF0aGlzLiNpc09wZW4pIHtcbiAgICAgIHRoaXMuI3F1ZXVlZC5wdXNoKHsgYWN0aW9uLCBwYXlsb2FkIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLiNzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhY3Rpb24sXG4gICAgICBwYXlsb2FkLFxuICAgIH0pKVxuICB9XG5cbiAgb24gKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub24oYWN0aW9uLCBoYW5kbGVyKVxuICB9XG5cbiAgZW1pdCAoYWN0aW9uLCBwYXlsb2FkKSB7XG4gICAgdGhpcy4jZW1pdHRlci5lbWl0KGFjdGlvbiwgcGF5bG9hZClcbiAgfVxuXG4gIG9uY2UgKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub25jZShhY3Rpb24sIGhhbmRsZXIpXG4gIH1cblxuICAjaGFuZGxlTWVzc2FnZT0gKGUpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKVxuICAgICAgdGhpcy5lbWl0KG1lc3NhZ2UuYWN0aW9uLCBtZXNzYWdlLnBheWxvYWQpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBUT0RPOiB1c2UgYSBtb3JlIHJvYnVzdCBlcnJvciBoYW5kbGVyLlxuICAgICAgY29uc29sZS5sb2coZXJyKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIE1hbmFnZXMgY29tbXVuaWNhdGlvbnMgd2l0aCBDb21wYW5pb25cbiAqL1xuXG5jb25zdCBSZXF1ZXN0Q2xpZW50ID0gcmVxdWlyZSgnLi9SZXF1ZXN0Q2xpZW50JylcbmNvbnN0IFByb3ZpZGVyID0gcmVxdWlyZSgnLi9Qcm92aWRlcicpXG5jb25zdCBTZWFyY2hQcm92aWRlciA9IHJlcXVpcmUoJy4vU2VhcmNoUHJvdmlkZXInKVxuY29uc3QgU29ja2V0ID0gcmVxdWlyZSgnLi9Tb2NrZXQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgUmVxdWVzdENsaWVudCxcbiAgUHJvdmlkZXIsXG4gIFNlYXJjaFByb3ZpZGVyLFxuICBTb2NrZXQsXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBzZXJ2ZXMgYXMgYW4gQXN5bmMgd3JhcHBlciBmb3IgTG9jYWxTdG9yYWdlXG4gKi9cbm1vZHVsZS5leHBvcnRzLnNldEl0ZW0gPSAoa2V5LCB2YWx1ZSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKVxuICAgIHJlc29sdmUoKVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cy5nZXRJdGVtID0gKGtleSkgPT4ge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpXG59XG5cbm1vZHVsZS5leHBvcnRzLnJlbW92ZUl0ZW0gPSAoa2V5KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSlcbiAgICByZXNvbHZlKClcbiAgfSlcbn1cbiIsIi8vIFRoaXMgZmlsZSByZXBsYWNlcyBgaW5kZXguanNgIGluIGJ1bmRsZXJzIGxpa2Ugd2VicGFjayBvciBSb2xsdXAsXG4vLyBhY2NvcmRpbmcgdG8gYGJyb3dzZXJgIGNvbmZpZyBpbiBgcGFja2FnZS5qc29uYC5cblxubGV0IHsgdXJsQWxwaGFiZXQgfSA9IHJlcXVpcmUoJy4vdXJsLWFscGhhYmV0L2luZGV4LmNqcycpXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIC8vIEFsbCBidW5kbGVycyB3aWxsIHJlbW92ZSB0aGlzIGJsb2NrIGluIHRoZSBwcm9kdWN0aW9uIGJ1bmRsZS5cbiAgaWYgKFxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmXG4gICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgJiZcbiAgICB0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJ1xuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnUmVhY3QgTmF0aXZlIGRvZXMgbm90IGhhdmUgYSBidWlsdC1pbiBzZWN1cmUgcmFuZG9tIGdlbmVyYXRvci4gJyArXG4gICAgICAgICdJZiB5b3UgZG9u4oCZdCBuZWVkIHVucHJlZGljdGFibGUgSURzIHVzZSBgbmFub2lkL25vbi1zZWN1cmVgLiAnICtcbiAgICAgICAgJ0ZvciBzZWN1cmUgSURzLCBpbXBvcnQgYHJlYWN0LW5hdGl2ZS1nZXQtcmFuZG9tLXZhbHVlc2AgJyArXG4gICAgICAgICdiZWZvcmUgTmFubyBJRC4nXG4gICAgKVxuICB9XG4gIGlmICh0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0ltcG9ydCBmaWxlIHdpdGggYGlmICghd2luZG93LmNyeXB0bykgd2luZG93LmNyeXB0byA9IHdpbmRvdy5tc0NyeXB0b2AnICtcbiAgICAgICAgJyBiZWZvcmUgaW1wb3J0aW5nIE5hbm8gSUQgdG8gZml4IElFIDExIHN1cHBvcnQnXG4gICAgKVxuICB9XG4gIGlmICh0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdZb3VyIGJyb3dzZXIgZG9lcyBub3QgaGF2ZSBzZWN1cmUgcmFuZG9tIGdlbmVyYXRvci4gJyArXG4gICAgICAgICdJZiB5b3UgZG9u4oCZdCBuZWVkIHVucHJlZGljdGFibGUgSURzLCB5b3UgY2FuIHVzZSBuYW5vaWQvbm9uLXNlY3VyZS4nXG4gICAgKVxuICB9XG59XG5cbmxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcblxubGV0IGN1c3RvbVJhbmRvbSA9IChhbHBoYWJldCwgc2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIC8vIEZpcnN0LCBhIGJpdG1hc2sgaXMgbmVjZXNzYXJ5IHRvIGdlbmVyYXRlIHRoZSBJRC4gVGhlIGJpdG1hc2sgbWFrZXMgYnl0ZXNcbiAgLy8gdmFsdWVzIGNsb3NlciB0byB0aGUgYWxwaGFiZXQgc2l6ZS4gVGhlIGJpdG1hc2sgY2FsY3VsYXRlcyB0aGUgY2xvc2VzdFxuICAvLyBgMl4zMSAtIDFgIG51bWJlciwgd2hpY2ggZXhjZWVkcyB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgLy8gRm9yIGV4YW1wbGUsIHRoZSBiaXRtYXNrIGZvciB0aGUgYWxwaGFiZXQgc2l6ZSAzMCBpcyAzMSAoMDAwMTExMTEpLlxuICAvLyBgTWF0aC5jbHozMmAgaXMgbm90IHVzZWQsIGJlY2F1c2UgaXQgaXMgbm90IGF2YWlsYWJsZSBpbiBicm93c2Vycy5cbiAgbGV0IG1hc2sgPSAoMiA8PCAoTWF0aC5sb2coYWxwaGFiZXQubGVuZ3RoIC0gMSkgLyBNYXRoLkxOMikpIC0gMVxuICAvLyBUaG91Z2gsIHRoZSBiaXRtYXNrIHNvbHV0aW9uIGlzIG5vdCBwZXJmZWN0IHNpbmNlIHRoZSBieXRlcyBleGNlZWRpbmdcbiAgLy8gdGhlIGFscGhhYmV0IHNpemUgYXJlIHJlZnVzZWQuIFRoZXJlZm9yZSwgdG8gcmVsaWFibHkgZ2VuZXJhdGUgdGhlIElELFxuICAvLyB0aGUgcmFuZG9tIGJ5dGVzIHJlZHVuZGFuY3kgaGFzIHRvIGJlIHNhdGlzZmllZC5cblxuICAvLyBOb3RlOiBldmVyeSBoYXJkd2FyZSByYW5kb20gZ2VuZXJhdG9yIGNhbGwgaXMgcGVyZm9ybWFuY2UgZXhwZW5zaXZlLFxuICAvLyBiZWNhdXNlIHRoZSBzeXN0ZW0gY2FsbCBmb3IgZW50cm9weSBjb2xsZWN0aW9uIHRha2VzIGEgbG90IG9mIHRpbWUuXG4gIC8vIFNvLCB0byBhdm9pZCBhZGRpdGlvbmFsIHN5c3RlbSBjYWxscywgZXh0cmEgYnl0ZXMgYXJlIHJlcXVlc3RlZCBpbiBhZHZhbmNlLlxuXG4gIC8vIE5leHQsIGEgc3RlcCBkZXRlcm1pbmVzIGhvdyBtYW55IHJhbmRvbSBieXRlcyB0byBnZW5lcmF0ZS5cbiAgLy8gVGhlIG51bWJlciBvZiByYW5kb20gYnl0ZXMgZ2V0cyBkZWNpZGVkIHVwb24gdGhlIElEIHNpemUsIG1hc2ssXG4gIC8vIGFscGhhYmV0IHNpemUsIGFuZCBtYWdpYyBudW1iZXIgMS42ICh1c2luZyAxLjYgcGVha3MgYXQgcGVyZm9ybWFuY2VcbiAgLy8gYWNjb3JkaW5nIHRvIGJlbmNobWFya3MpLlxuXG4gIC8vIGAtfmYgPT4gTWF0aC5jZWlsKGYpYCBpZiBmIGlzIGEgZmxvYXRcbiAgLy8gYC1+aSA9PiBpICsgMWAgaWYgaSBpcyBhbiBpbnRlZ2VyXG4gIGxldCBzdGVwID0gLX4oKDEuNiAqIG1hc2sgKiBzaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIGxldCBpZCA9ICcnXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBieXRlcyA9IGdldFJhbmRvbShzdGVwKVxuICAgICAgLy8gQSBjb21wYWN0IGFsdGVybmF0aXZlIGZvciBgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGVwOyBpKyspYC5cbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICAvLyBBZGRpbmcgYHx8ICcnYCByZWZ1c2VzIGEgcmFuZG9tIGJ5dGUgdGhhdCBleGNlZWRzIHRoZSBhbHBoYWJldCBzaXplLlxuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5sZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUpID0+IGN1c3RvbVJhbmRvbShhbHBoYWJldCwgc2l6ZSwgcmFuZG9tKVxuXG5sZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT4ge1xuICBsZXQgaWQgPSAnJ1xuICBsZXQgYnl0ZXMgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KHNpemUpKVxuXG4gIC8vIEEgY29tcGFjdCBhbHRlcm5hdGl2ZSBmb3IgYGZvciAodmFyIGkgPSAwOyBpIDwgc3RlcDsgaSsrKWAuXG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICAvLyBJdCBpcyBpbmNvcnJlY3QgdG8gdXNlIGJ5dGVzIGV4Y2VlZGluZyB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgICAvLyBUaGUgZm9sbG93aW5nIG1hc2sgcmVkdWNlcyB0aGUgcmFuZG9tIGJ5dGUgaW4gdGhlIDAtMjU1IHZhbHVlXG4gICAgLy8gcmFuZ2UgdG8gdGhlIDAtNjMgdmFsdWUgcmFuZ2UuIFRoZXJlZm9yZSwgYWRkaW5nIGhhY2tzLCBzdWNoXG4gICAgLy8gYXMgZW1wdHkgc3RyaW5nIGZhbGxiYWNrIG9yIG1hZ2ljIG51bWJlcnMsIGlzIHVubmVjY2Vzc2FyeSBiZWNhdXNlXG4gICAgLy8gdGhlIGJpdG1hc2sgdHJpbXMgYnl0ZXMgZG93biB0byB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgICBsZXQgYnl0ZSA9IGJ5dGVzW3NpemVdICYgNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICAvLyBgMC05YS16YFxuICAgICAgaWQgKz0gYnl0ZS50b1N0cmluZygzNilcbiAgICB9IGVsc2UgaWYgKGJ5dGUgPCA2Mikge1xuICAgICAgLy8gYEEtWmBcbiAgICAgIGlkICs9IChieXRlIC0gMjYpLnRvU3RyaW5nKDM2KS50b1VwcGVyQ2FzZSgpXG4gICAgfSBlbHNlIGlmIChieXRlIDwgNjMpIHtcbiAgICAgIGlkICs9ICdfJ1xuICAgIH0gZWxzZSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlkXG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBuYW5vaWQsIGN1c3RvbUFscGhhYmV0LCBjdXN0b21SYW5kb20sIHVybEFscGhhYmV0LCByYW5kb20gfVxuIiwiLy8gVGhpcyBhbHBoYWJldCB1c2VzIGBBLVphLXowLTlfLWAgc3ltYm9scy4gVGhlIGdlbmV0aWMgYWxnb3JpdGhtIGhlbHBlZFxuLy8gb3B0aW1pemUgdGhlIGd6aXAgY29tcHJlc3Npb24gZm9yIHRoaXMgYWxwaGFiZXQuXG5sZXQgdXJsQWxwaGFiZXQgPVxuICAnTW9kdWxlU3ltYmhhc093blByLTAxMjM0NTY3ODlBQkNERUZHSE5SVmZnY3RpVXZ6X0txWVRKa0x4cFpYSWpRVydcblxubW9kdWxlLmV4cG9ydHMgPSB7IHVybEFscGhhYmV0IH1cbiIsIi8qKlxuICogQ29yZSBwbHVnaW4gbG9naWMgdGhhdCBhbGwgcGx1Z2lucyBzaGFyZS5cbiAqXG4gKiBCYXNlUGx1Z2luIGRvZXMgbm90IGNvbnRhaW4gRE9NIHJlbmRlcmluZyBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgcGx1Z2luc1xuICogd2l0aG91dCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIFNlZSBgUGx1Z2luYCBmb3IgdGhlIGV4dGVuZGVkIHZlcnNpb24gd2l0aCBQcmVhY3QgcmVuZGVyaW5nIGZvciBpbnRlcmZhY2VzLlxuICovXG5cbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmFzZVBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzID0ge30pIHtcbiAgICB0aGlzLnVwcHkgPSB1cHB5XG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICB9XG5cbiAgZ2V0UGx1Z2luU3RhdGUgKCkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICByZXR1cm4gcGx1Z2luc1t0aGlzLmlkXSB8fCB7fVxuICB9XG5cbiAgc2V0UGx1Z2luU3RhdGUgKHVwZGF0ZSkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcblxuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7XG4gICAgICAgIC4uLnBsdWdpbnMsXG4gICAgICAgIFt0aGlzLmlkXToge1xuICAgICAgICAgIC4uLnBsdWdpbnNbdGhpcy5pZF0sXG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgc2V0T3B0aW9ucyAobmV3T3B0cykge1xuICAgIHRoaXMub3B0cyA9IHsgLi4udGhpcy5vcHRzLCAuLi5uZXdPcHRzIH1cbiAgICB0aGlzLnNldFBsdWdpblN0YXRlKCkgLy8gc28gdGhhdCBVSSByZS1yZW5kZXJzIHdpdGggbmV3IG9wdGlvbnNcbiAgICB0aGlzLmkxOG5Jbml0KClcbiAgfVxuXG4gIGkxOG5Jbml0ICgpIHtcbiAgICBjb25zdCB0cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IoW3RoaXMuZGVmYXVsdExvY2FsZSwgdGhpcy51cHB5LmxvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZV0pXG4gICAgdGhpcy5pMThuID0gdHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0cmFuc2xhdG9yKVxuICAgIHRoaXMuaTE4bkFycmF5ID0gdHJhbnNsYXRvci50cmFuc2xhdGVBcnJheS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5zZXRQbHVnaW5TdGF0ZSgpIC8vIHNvIHRoYXQgVUkgcmUtcmVuZGVycyBhbmQgd2Ugc2VlIHRoZSB1cGRhdGVkIGxvY2FsZVxuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZGFibGUgbWV0aG9kc1xuICAgKiA9PT09PT09PT09PT09PT09PT1cbiAgICogVGhlc2UgbWV0aG9kcyBhcmUgaGVyZSB0byBzZXJ2ZSBhcyBhbiBvdmVydmlldyBvZiB0aGUgZXh0ZW5kYWJsZSBtZXRob2RzIGFzIHdlbGwgYXNcbiAgICogbWFraW5nIHRoZW0gbm90IGNvbmRpdGlvbmFsIGluIHVzZSwgc3VjaCBhcyBgaWYgKHRoaXMuYWZ0ZXJVcGRhdGUpYC5cbiAgICovXG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWRkVGFyZ2V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4dGVuZCB0aGUgYWRkVGFyZ2V0IG1ldGhvZCB0byBhZGQgeW91ciBwbHVnaW4gdG8gYW5vdGhlciBwbHVnaW5cXCdzIHRhcmdldCcpXG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICBpbnN0YWxsICgpIHt9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdW5pbnN0YWxsICgpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHBsdWdpbiBpcyBtb3VudGVkLCB3aGV0aGVyIGluIERPTSBvciBpbnRvIGFub3RoZXIgcGx1Z2luLlxuICAgKiBOZWVkZWQgYmVjYXVzZSBzb21ldGltZXMgcGx1Z2lucyBhcmUgbW91bnRlZCBzZXBhcmF0ZWx5L2FmdGVyIGBpbnN0YWxsYCxcbiAgICogc28gdGhpcy5lbCBhbmQgdGhpcy5wYXJlbnQgbWlnaHQgbm90IGJlIGF2YWlsYWJsZSBpbiBgaW5zdGFsbGAuXG4gICAqIFRoaXMgaXMgdGhlIGNhc2Ugd2l0aCBAdXBweS9yZWFjdCBwbHVnaW5zLCBmb3IgZXhhbXBsZS5cbiAgICovXG4gIHJlbmRlciAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHRlbmQgdGhlIHJlbmRlciBtZXRob2QgdG8gYWRkIHlvdXIgcGx1Z2luIHRvIGEgRE9NIGVsZW1lbnQnKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdXBkYXRlICgpIHt9XG5cbiAgLy8gQ2FsbGVkIGFmdGVyIGV2ZXJ5IHN0YXRlIHVwZGF0ZSwgYWZ0ZXIgZXZlcnl0aGluZydzIG1vdW50ZWQuIERlYm91bmNlZC5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWZ0ZXJVcGRhdGUgKCkge31cbn1cbiIsImNvbnN0IHsgcmVuZGVyIH0gPSByZXF1aXJlKCdwcmVhY3QnKVxuY29uc3QgZmluZERPTUVsZW1lbnQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmluZERPTUVsZW1lbnQnKVxuXG5jb25zdCBCYXNlUGx1Z2luID0gcmVxdWlyZSgnLi9CYXNlUGx1Z2luJylcblxuLyoqXG4gKiBEZWZlciBhIGZyZXF1ZW50IGNhbGwgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0geygpID0+IFR9IGZuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UgKGZuKSB7XG4gIGxldCBjYWxsaW5nID0gbnVsbFxuICBsZXQgbGF0ZXN0QXJncyA9IG51bGxcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgbGF0ZXN0QXJncyA9IGFyZ3NcbiAgICBpZiAoIWNhbGxpbmcpIHtcbiAgICAgIGNhbGxpbmcgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY2FsbGluZyA9IG51bGxcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCBgYXJnc2AgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBzdGF0ZSwgaWYgbXVsdGlwbGUgY2FsbHMgaGFwcGVuZWQgc2luY2UgdGhpcyB0YXNrXG4gICAgICAgIC8vIHdhcyBxdWV1ZWQuIFNvIHdlIHVzZSB0aGUgYGxhdGVzdEFyZ3NgLCB3aGljaCBkZWZpbml0ZWx5XG4gICAgICAgIC8vIGlzIHRoZSBtb3N0IHJlY2VudCBjYWxsLlxuICAgICAgICByZXR1cm4gZm4oLi4ubGF0ZXN0QXJncylcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBjYWxsaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBVSVBsdWdpbiBpcyB0aGUgZXh0ZW5kZWQgdmVyc2lvbiBvZiBCYXNlUGx1Z2luIHRvIGluY29ycG9yYXRlIHJlbmRlcmluZyB3aXRoIFByZWFjdC5cbiAqIFVzZSB0aGlzIGZvciBwbHVnaW5zIHRoYXQgbmVlZCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIEZvciBwbHVnaW5zIHdpdGhvdXQgYW4gdXNlciBpbnRlcmZhY2UsIHNlZSBCYXNlUGx1Z2luLlxuICovXG5jbGFzcyBVSVBsdWdpbiBleHRlbmRzIEJhc2VQbHVnaW4ge1xuICAjdXBkYXRlVUlcblxuICAvKipcbiAgICogQ2hlY2sgaWYgc3VwcGxpZWQgYHRhcmdldGAgaXMgYSBET00gZWxlbWVudCBvciBhbiBgb2JqZWN0YC5cbiAgICogSWYgaXTigJlzIGFuIG9iamVjdCDigJQgdGFyZ2V0IGlzIGEgcGx1Z2luLCBhbmQgd2Ugc2VhcmNoIGBwbHVnaW5zYFxuICAgKiBmb3IgYSBwbHVnaW4gd2l0aCBzYW1lIG5hbWUgYW5kIHJldHVybiBpdHMgdGFyZ2V0LlxuICAgKi9cbiAgbW91bnQgKHRhcmdldCwgcGx1Z2luKSB7XG4gICAgY29uc3QgY2FsbGVyUGx1Z2luTmFtZSA9IHBsdWdpbi5pZFxuXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGZpbmRET01FbGVtZW50KHRhcmdldClcblxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICB0aGlzLmlzVGFyZ2V0RE9NRWwgPSB0cnVlXG4gICAgICAvLyBXaGVuIHRhcmdldCBpcyA8Ym9keT4gd2l0aCBhIHNpbmdsZSA8ZGl2PiBlbGVtZW50LFxuICAgICAgLy8gUHJlYWN0IHRoaW5rcyBpdOKAmXMgdGhlIFVwcHkgcm9vdCBlbGVtZW50IGluIHRoZXJlIHdoZW4gZG9pbmcgYSBkaWZmLFxuICAgICAgLy8gYW5kIGRlc3Ryb3lzIGl0LiBTbyB3ZSBhcmUgY3JlYXRpbmcgYSBmcmFnbWVudCAoY291bGQgYmUgZW1wdHkgZGl2KVxuICAgICAgY29uc3QgdXBweVJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cbiAgICAgIC8vIEFQSSBmb3IgcGx1Z2lucyB0aGF0IHJlcXVpcmUgYSBzeW5jaHJvbm91cyByZXJlbmRlci5cbiAgICAgIHRoaXMuI3VwZGF0ZVVJID0gZGVib3VuY2UoKHN0YXRlKSA9PiB7XG4gICAgICAgIC8vIHBsdWdpbiBjb3VsZCBiZSByZW1vdmVkLCBidXQgdGhpcy5yZXJlbmRlciBpcyBkZWJvdW5jZWQgYmVsb3csXG4gICAgICAgIC8vIHNvIGl0IGNvdWxkIHN0aWxsIGJlIGNhbGxlZCBldmVuIGFmdGVyIHVwcHkucmVtb3ZlUGx1Z2luIG9yIHVwcHkuY2xvc2VcbiAgICAgICAgLy8gaGVuY2UgdGhlIGNoZWNrXG4gICAgICAgIGlmICghdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLmlkKSkgcmV0dXJuXG4gICAgICAgIHJlbmRlcih0aGlzLnJlbmRlcihzdGF0ZSksIHVwcHlSb290RWxlbWVudClcbiAgICAgICAgdGhpcy5hZnRlclVwZGF0ZSgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gYSBET00gZWxlbWVudCAnJHt0YXJnZXR9J2ApXG5cbiAgICAgIGlmICh0aGlzLm9wdHMucmVwbGFjZVRhcmdldENvbnRlbnQpIHtcbiAgICAgICAgLy8gRG9pbmcgcmVuZGVyKGgobnVsbCksIHRhcmdldEVsZW1lbnQpLCB3aGljaCBzaG91bGQgaGF2ZSBiZWVuXG4gICAgICAgIC8vIGEgYmV0dGVyIHdheSwgc2luY2UgYmVjYXVzZSB0aGUgY29tcG9uZW50IG1pZ2h0IG5lZWQgdG8gZG8gYWRkaXRpb25hbCBjbGVhbnVwIHdoZW4gaXQgaXMgcmVtb3ZlZCxcbiAgICAgICAgLy8gc3RvcHBlZCB3b3JraW5nIOKAlCBQcmVhY3QganVzdCBhZGRzIG51bGwgaW50byB0YXJnZXQsIG5vdCByZXBsYWNpbmdcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5pbm5lckhUTUwgPSAnJ1xuICAgICAgfVxuXG4gICAgICByZW5kZXIodGhpcy5yZW5kZXIodGhpcy51cHB5LmdldFN0YXRlKCkpLCB1cHB5Um9vdEVsZW1lbnQpXG4gICAgICB0aGlzLmVsID0gdXBweVJvb3RFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkXG4gICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHVwcHlSb290RWxlbWVudClcblxuICAgICAgdGhpcy5vbk1vdW50KClcblxuICAgICAgcmV0dXJuIHRoaXMuZWxcbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0UGx1Z2luXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCBpbnN0YW5jZW9mIFVJUGx1Z2luKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gKmluc3RhbmNlKlxuICAgICAgdGFyZ2V0UGx1Z2luID0gdGFyZ2V0XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gdHlwZVxuICAgICAgY29uc3QgVGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgcGx1Z2luIGluc3RhbmNlLlxuICAgICAgdGhpcy51cHB5Lml0ZXJhdGVQbHVnaW5zKHAgPT4ge1xuICAgICAgICBpZiAocCBpbnN0YW5jZW9mIFRhcmdldCkge1xuICAgICAgICAgIHRhcmdldFBsdWdpbiA9IHBcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0UGx1Z2luKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gJHt0YXJnZXRQbHVnaW4uaWR9YClcbiAgICAgIHRoaXMucGFyZW50ID0gdGFyZ2V0UGx1Z2luXG4gICAgICB0aGlzLmVsID0gdGFyZ2V0UGx1Z2luLmFkZFRhcmdldChwbHVnaW4pXG5cbiAgICAgIHRoaXMub25Nb3VudCgpXG4gICAgICByZXR1cm4gdGhpcy5lbFxuICAgIH1cblxuICAgIHRoaXMudXBweS5sb2coYE5vdCBpbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX1gKVxuXG4gICAgbGV0IG1lc3NhZ2UgPSBgSW52YWxpZCB0YXJnZXQgb3B0aW9uIGdpdmVuIHRvICR7Y2FsbGVyUGx1Z2luTmFtZX0uYFxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlICs9ICcgVGhlIGdpdmVuIHRhcmdldCBpcyBub3QgYSBQbHVnaW4gY2xhc3MuICdcbiAgICAgICAgKyAnUGxlYXNlIGNoZWNrIHRoYXQgeW91XFwncmUgbm90IHNwZWNpZnlpbmcgYSBSZWFjdCBDb21wb25lbnQgaW5zdGVhZCBvZiBhIHBsdWdpbi4gJ1xuICAgICAgICArICdJZiB5b3UgYXJlIHVzaW5nIEB1cHB5LyogcGFja2FnZXMgZGlyZWN0bHksIG1ha2Ugc3VyZSB5b3UgaGF2ZSBvbmx5IDEgdmVyc2lvbiBvZiBAdXBweS9jb3JlIGluc3RhbGxlZDogJ1xuICAgICAgICArICdydW4gYG5wbSBscyBAdXBweS9jb3JlYCBvbiB0aGUgY29tbWFuZCBsaW5lIGFuZCB2ZXJpZnkgdGhhdCBhbGwgdGhlIHZlcnNpb25zIG1hdGNoIGFuZCBhcmUgZGVkdXBlZCBjb3JyZWN0bHkuJ1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlICs9ICdJZiB5b3UgbWVhbnQgdG8gdGFyZ2V0IGFuIEhUTUwgZWxlbWVudCwgcGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBlbGVtZW50IGV4aXN0cy4gJ1xuICAgICAgICArICdDaGVjayB0aGF0IHRoZSA8c2NyaXB0PiB0YWcgaW5pdGlhbGl6aW5nIFVwcHkgaXMgcmlnaHQgYmVmb3JlIHRoZSBjbG9zaW5nIDwvYm9keT4gdGFnIGF0IHRoZSBlbmQgb2YgdGhlIHBhZ2UuICdcbiAgICAgICAgKyAnKHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXMvMTA0MilcXG5cXG4nXG4gICAgICAgICsgJ0lmIHlvdSBtZWFudCB0byB0YXJnZXQgYSBwbHVnaW4sIHBsZWFzZSBjb25maXJtIHRoYXQgeW91ciBgaW1wb3J0YCBzdGF0ZW1lbnRzIG9yIGByZXF1aXJlYCBjYWxscyBhcmUgY29ycmVjdC4nXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKVxuICB9XG5cbiAgdXBkYXRlIChzdGF0ZSkge1xuICAgIGlmICh0aGlzLmVsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuI3VwZGF0ZVVJPy4oc3RhdGUpXG4gICAgfVxuICB9XG5cbiAgdW5tb3VudCAoKSB7XG4gICAgaWYgKHRoaXMuaXNUYXJnZXRET01FbCkge1xuICAgICAgdGhpcy5lbD8ucmVtb3ZlKClcbiAgICB9XG4gICAgdGhpcy5vblVubW91bnQoKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgb25Nb3VudCAoKSB7fVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gIG9uVW5tb3VudCAoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJUGx1Z2luXG4iLCIvKiBnbG9iYWwgQWdncmVnYXRlRXJyb3IgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5jb25zdCBlZSA9IHJlcXVpcmUoJ25hbWVzcGFjZS1lbWl0dGVyJylcbmNvbnN0IHsgbmFub2lkIH0gPSByZXF1aXJlKCduYW5vaWQnKVxuY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuY29uc3QgcHJldHRpZXJCeXRlcyA9IHJlcXVpcmUoJ0B0cmFuc2xvYWRpdC9wcmV0dGllci1ieXRlcycpXG5jb25zdCBtYXRjaCA9IHJlcXVpcmUoJ21pbWUtbWF0Y2gnKVxuY29uc3QgRGVmYXVsdFN0b3JlID0gcmVxdWlyZSgnQHVwcHkvc3RvcmUtZGVmYXVsdCcpXG5jb25zdCBnZXRGaWxlVHlwZSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlVHlwZScpXG5jb25zdCBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbiA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpXG5jb25zdCBnZW5lcmF0ZUZpbGVJRCA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZW5lcmF0ZUZpbGVJRCcpXG5jb25zdCBzdXBwb3J0c1VwbG9hZFByb2dyZXNzID0gcmVxdWlyZSgnLi9zdXBwb3J0c1VwbG9hZFByb2dyZXNzJylcbmNvbnN0IGdldEZpbGVOYW1lID0gcmVxdWlyZSgnLi9nZXRGaWxlTmFtZScpXG5jb25zdCB7IGp1c3RFcnJvcnNMb2dnZXIsIGRlYnVnTG9nZ2VyIH0gPSByZXF1aXJlKCcuL2xvZ2dlcnMnKVxuXG4vLyBFeHBvcnRlZCBmcm9tIGhlcmUuXG5jbGFzcyBSZXN0cmljdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5pc1Jlc3RyaWN0aW9uID0gdHJ1ZVxuICB9XG59XG5pZiAodHlwZW9mIEFnZ3JlZ2F0ZUVycm9yID09PSAndW5kZWZpbmVkJykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZ2xvYmFsLWFzc2lnblxuICBnbG9iYWxUaGlzLkFnZ3JlZ2F0ZUVycm9yID0gY2xhc3MgQWdncmVnYXRlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IgKG1lc3NhZ2UsIGVycm9ycykge1xuICAgICAgc3VwZXIobWVzc2FnZSlcbiAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzXG4gICAgfVxuICB9XG59XG5jbGFzcyBBZ2dyZWdhdGVSZXN0cmljdGlvbkVycm9yIGV4dGVuZHMgQWdncmVnYXRlRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5pc1Jlc3RyaWN0aW9uID0gdHJ1ZVxuICB9XG59XG5cbi8qKlxuICogVXBweSBDb3JlIG1vZHVsZS5cbiAqIE1hbmFnZXMgcGx1Z2lucywgc3RhdGUgdXBkYXRlcywgYWN0cyBhcyBhbiBldmVudCBidXMsXG4gKiBhZGRzL3JlbW92ZXMgZmlsZXMgYW5kIG1ldGFkYXRhLlxuICovXG5jbGFzcyBVcHB5IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgQmFzZVBsdWdpbltdPn0gKi9cbiAgI3BsdWdpbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgI3N0b3JlVW5zdWJzY3JpYmVcblxuICAjZW1pdHRlciA9IGVlKClcblxuICAjcHJlUHJvY2Vzc29ycyA9IG5ldyBTZXQoKVxuXG4gICN1cGxvYWRlcnMgPSBuZXcgU2V0KClcblxuICAjcG9zdFByb2Nlc3NvcnMgPSBuZXcgU2V0KClcblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgVXBweVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyDigJQgVXBweSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMuZGVmYXVsdExvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgYWRkQnVsa0ZpbGVzRmFpbGVkOiB7XG4gICAgICAgICAgMDogJ0ZhaWxlZCB0byBhZGQgJXtzbWFydF9jb3VudH0gZmlsZSBkdWUgdG8gYW4gaW50ZXJuYWwgZXJyb3InLFxuICAgICAgICAgIDE6ICdGYWlsZWQgdG8gYWRkICV7c21hcnRfY291bnR9IGZpbGVzIGR1ZSB0byBpbnRlcm5hbCBlcnJvcnMnLFxuICAgICAgICB9LFxuICAgICAgICB5b3VDYW5Pbmx5VXBsb2FkWDoge1xuICAgICAgICAgIDA6ICdZb3UgY2FuIG9ubHkgdXBsb2FkICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdZb3UgY2FuIG9ubHkgdXBsb2FkICV7c21hcnRfY291bnR9IGZpbGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgeW91SGF2ZVRvQXRMZWFzdFNlbGVjdFg6IHtcbiAgICAgICAgICAwOiAnWW91IGhhdmUgdG8gc2VsZWN0IGF0IGxlYXN0ICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdZb3UgaGF2ZSB0byBzZWxlY3QgYXQgbGVhc3QgJXtzbWFydF9jb3VudH0gZmlsZXMnLFxuICAgICAgICB9LFxuICAgICAgICBleGNlZWRzU2l6ZTogJyV7ZmlsZX0gZXhjZWVkcyBtYXhpbXVtIGFsbG93ZWQgc2l6ZSBvZiAle3NpemV9JyxcbiAgICAgICAgbWlzc2luZ1JlcXVpcmVkTWV0YUZpZWxkOiAnTWlzc2luZyByZXF1aXJlZCBtZXRhIGZpZWxkcycsXG4gICAgICAgIG1pc3NpbmdSZXF1aXJlZE1ldGFGaWVsZE9uRmlsZTogJ01pc3NpbmcgcmVxdWlyZWQgbWV0YSBmaWVsZHMgaW4gJXtmaWxlTmFtZX0nLFxuICAgICAgICBpbmZlcmlvclNpemU6ICdUaGlzIGZpbGUgaXMgc21hbGxlciB0aGFuIHRoZSBhbGxvd2VkIHNpemUgb2YgJXtzaXplfScsXG4gICAgICAgIHlvdUNhbk9ubHlVcGxvYWRGaWxlVHlwZXM6ICdZb3UgY2FuIG9ubHkgdXBsb2FkOiAle3R5cGVzfScsXG4gICAgICAgIG5vTW9yZUZpbGVzQWxsb3dlZDogJ0Nhbm5vdCBhZGQgbW9yZSBmaWxlcycsXG4gICAgICAgIG5vRHVwbGljYXRlczogJ0Nhbm5vdCBhZGQgdGhlIGR1cGxpY2F0ZSBmaWxlIFxcJyV7ZmlsZU5hbWV9XFwnLCBpdCBhbHJlYWR5IGV4aXN0cycsXG4gICAgICAgIGNvbXBhbmlvbkVycm9yOiAnQ29ubmVjdGlvbiB3aXRoIENvbXBhbmlvbiBmYWlsZWQnLFxuICAgICAgICBhdXRoQWJvcnRlZDogJ0F1dGhlbnRpY2F0aW9uIGFib3J0ZWQnLFxuICAgICAgICBjb21wYW5pb25VbmF1dGhvcml6ZUhpbnQ6ICdUbyB1bmF1dGhvcml6ZSB0byB5b3VyICV7cHJvdmlkZXJ9IGFjY291bnQsIHBsZWFzZSBnbyB0byAle3VybH0nLFxuICAgICAgICBmYWlsZWRUb1VwbG9hZDogJ0ZhaWxlZCB0byB1cGxvYWQgJXtmaWxlfScsXG4gICAgICAgIG5vSW50ZXJuZXRDb25uZWN0aW9uOiAnTm8gSW50ZXJuZXQgY29ubmVjdGlvbicsXG4gICAgICAgIGNvbm5lY3RlZFRvSW50ZXJuZXQ6ICdDb25uZWN0ZWQgdG8gdGhlIEludGVybmV0JyxcbiAgICAgICAgLy8gU3RyaW5ncyBmb3IgcmVtb3RlIHByb3ZpZGVyc1xuICAgICAgICBub0ZpbGVzRm91bmQ6ICdZb3UgaGF2ZSBubyBmaWxlcyBvciBmb2xkZXJzIGhlcmUnLFxuICAgICAgICBzZWxlY3RYOiB7XG4gICAgICAgICAgMDogJ1NlbGVjdCAle3NtYXJ0X2NvdW50fScsXG4gICAgICAgICAgMTogJ1NlbGVjdCAle3NtYXJ0X2NvdW50fScsXG4gICAgICAgIH0sXG4gICAgICAgIGFsbEZpbGVzRnJvbUZvbGRlck5hbWVkOiAnQWxsIGZpbGVzIGZyb20gZm9sZGVyICV7bmFtZX0nLFxuICAgICAgICBvcGVuRm9sZGVyTmFtZWQ6ICdPcGVuIGZvbGRlciAle25hbWV9JyxcbiAgICAgICAgY2FuY2VsOiAnQ2FuY2VsJyxcbiAgICAgICAgbG9nT3V0OiAnTG9nIG91dCcsXG4gICAgICAgIGZpbHRlcjogJ0ZpbHRlcicsXG4gICAgICAgIHJlc2V0RmlsdGVyOiAnUmVzZXQgZmlsdGVyJyxcbiAgICAgICAgbG9hZGluZzogJ0xvYWRpbmcuLi4nLFxuICAgICAgICBhdXRoZW50aWNhdGVXaXRoVGl0bGU6ICdQbGVhc2UgYXV0aGVudGljYXRlIHdpdGggJXtwbHVnaW5OYW1lfSB0byBzZWxlY3QgZmlsZXMnLFxuICAgICAgICBhdXRoZW50aWNhdGVXaXRoOiAnQ29ubmVjdCB0byAle3BsdWdpbk5hbWV9JyxcbiAgICAgICAgc2lnbkluV2l0aEdvb2dsZTogJ1NpZ24gaW4gd2l0aCBHb29nbGUnLFxuICAgICAgICBzZWFyY2hJbWFnZXM6ICdTZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGVudGVyVGV4dFRvU2VhcmNoOiAnRW50ZXIgdGV4dCB0byBzZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGJhY2tUb1NlYXJjaDogJ0JhY2sgdG8gU2VhcmNoJyxcbiAgICAgICAgZW1wdHlGb2xkZXJBZGRlZDogJ05vIGZpbGVzIHdlcmUgYWRkZWQgZnJvbSBlbXB0eSBmb2xkZXInLFxuICAgICAgICBmb2xkZXJBbHJlYWR5QWRkZWQ6ICdUaGUgZm9sZGVyIFwiJXtmb2xkZXJ9XCIgd2FzIGFscmVhZHkgYWRkZWQnLFxuICAgICAgICBmb2xkZXJBZGRlZDoge1xuICAgICAgICAgIDA6ICdBZGRlZCAle3NtYXJ0X2NvdW50fSBmaWxlIGZyb20gJXtmb2xkZXJ9JyxcbiAgICAgICAgICAxOiAnQWRkZWQgJXtzbWFydF9jb3VudH0gZmlsZXMgZnJvbSAle2ZvbGRlcn0nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGlkOiAndXBweScsXG4gICAgICBhdXRvUHJvY2VlZDogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIEBkZXByZWNhdGVkIFRoZSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkXG4gICAgICAgKi9cbiAgICAgIGFsbG93TXVsdGlwbGVVcGxvYWRzOiB0cnVlLFxuICAgICAgYWxsb3dNdWx0aXBsZVVwbG9hZEJhdGNoZXM6IHRydWUsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgbWF4RmlsZVNpemU6IG51bGwsXG4gICAgICAgIG1pbkZpbGVTaXplOiBudWxsLFxuICAgICAgICBtYXhUb3RhbEZpbGVTaXplOiBudWxsLFxuICAgICAgICBtYXhOdW1iZXJPZkZpbGVzOiBudWxsLFxuICAgICAgICBtaW5OdW1iZXJPZkZpbGVzOiBudWxsLFxuICAgICAgICBhbGxvd2VkRmlsZVR5cGVzOiBudWxsLFxuICAgICAgICByZXF1aXJlZE1ldGFGaWVsZHM6IFtdLFxuICAgICAgfSxcbiAgICAgIG1ldGE6IHt9LFxuICAgICAgb25CZWZvcmVGaWxlQWRkZWQ6IChjdXJyZW50RmlsZSkgPT4gY3VycmVudEZpbGUsXG4gICAgICBvbkJlZm9yZVVwbG9hZDogKGZpbGVzKSA9PiBmaWxlcyxcbiAgICAgIHN0b3JlOiBEZWZhdWx0U3RvcmUoKSxcbiAgICAgIGxvZ2dlcjoganVzdEVycm9yc0xvZ2dlcixcbiAgICAgIGluZm9UaW1lb3V0OiA1MDAwLFxuICAgIH1cblxuICAgIC8vIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBvbmVzIHNldCBieSB1c2VyLFxuICAgIC8vIG1ha2luZyBzdXJlIHRvIG1lcmdlIHJlc3RyaWN0aW9ucyB0b29cbiAgICB0aGlzLm9wdHMgPSB7XG4gICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLm9wdHMsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMucmVzdHJpY3Rpb25zLFxuICAgICAgICAuLi4ob3B0cyAmJiBvcHRzLnJlc3RyaWN0aW9ucyksXG4gICAgICB9LFxuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgZGVidWc6IHRydWUgZm9yIGJhY2t3YXJkcy1jb21wYXRhYmlsaXR5LCB1bmxlc3MgbG9nZ2VyIGlzIHNldCBpbiBvcHRzXG4gICAgLy8gb3B0cyBpbnN0ZWFkIG9mIHRoaXMub3B0cyB0byBhdm9pZCBjb21wYXJpbmcgb2JqZWN0cyDigJQgd2Ugc2V0IGxvZ2dlcjoganVzdEVycm9yc0xvZ2dlciBpbiBkZWZhdWx0T3B0aW9uc1xuICAgIGlmIChvcHRzICYmIG9wdHMubG9nZ2VyICYmIG9wdHMuZGVidWcpIHtcbiAgICAgIHRoaXMubG9nKCdZb3UgYXJlIHVzaW5nIGEgY3VzdG9tIGBsb2dnZXJgLCBidXQgYWxzbyBzZXQgYGRlYnVnOiB0cnVlYCwgd2hpY2ggdXNlcyBidWlsdC1pbiBsb2dnZXIgdG8gb3V0cHV0IGxvZ3MgdG8gY29uc29sZS4gSWdub3JpbmcgYGRlYnVnOiB0cnVlYCBhbmQgdXNpbmcgeW91ciBjdXN0b20gYGxvZ2dlcmAuJywgJ3dhcm5pbmcnKVxuICAgIH0gZWxzZSBpZiAob3B0cyAmJiBvcHRzLmRlYnVnKSB7XG4gICAgICB0aGlzLm9wdHMubG9nZ2VyID0gZGVidWdMb2dnZXJcbiAgICB9XG5cbiAgICB0aGlzLmxvZyhgVXNpbmcgQ29yZSB2JHt0aGlzLmNvbnN0cnVjdG9yLlZFUlNJT059YClcblxuICAgIGlmICh0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXNcbiAgICAgICAgJiYgdGhpcy5vcHRzLnJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzICE9PSBudWxsXG4gICAgICAgICYmICFBcnJheS5pc0FycmF5KHRoaXMub3B0cy5yZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlcykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ByZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlc2AgbXVzdCBiZSBhbiBhcnJheScpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICAvLyBfX19XaHkgdGhyb3R0bGUgYXQgNTAwbXM/XG4gICAgLy8gICAgLSBXZSBtdXN0IHRocm90dGxlIGF0ID4yNTBtcyBmb3Igc3VwZXJmb2N1cyBpbiBEYXNoYm9hcmQgdG8gd29yayB3ZWxsXG4gICAgLy8gICAgKGJlY2F1c2UgYW5pbWF0aW9uIHRha2VzIDAuMjVzLCBhbmQgd2Ugd2FudCB0byB3YWl0IGZvciBhbGwgYW5pbWF0aW9ucyB0byBiZSBvdmVyIGJlZm9yZSByZWZvY3VzaW5nKS5cbiAgICAvLyAgICBbUHJhY3RpY2FsIENoZWNrXTogaWYgdGhvdHRsZSBpcyBhdCAxMDBtcywgdGhlbiBpZiB5b3UgYXJlIHVwbG9hZGluZyBhIGZpbGUsXG4gICAgLy8gICAgYW5kIGNsaWNrICdBREQgTU9SRSBGSUxFUycsIC0gZm9jdXMgd29uJ3QgYWN0aXZhdGUgaW4gRmlyZWZveC5cbiAgICAvLyAgICAtIFdlIG11c3QgdGhyb3R0bGUgYXQgYXJvdW5kID41MDBtcyB0byBhdm9pZCBwZXJmb3JtYW5jZSBsYWdzLlxuICAgIC8vICAgIFtQcmFjdGljYWwgQ2hlY2tdIEZpcmVmb3gsIHRyeSB0byB1cGxvYWQgYSBiaWcgZmlsZSBmb3IgYSBwcm9sb25nZWQgcGVyaW9kIG9mIHRpbWUuIExhcHRvcCB3aWxsIHN0YXJ0IHRvIGhlYXQgdXAuXG4gICAgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcyA9IHRocm90dGxlKHRoaXMuY2FsY3VsYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKSwgNTAwLCB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiB0cnVlIH0pXG5cbiAgICB0aGlzLnN0b3JlID0gdGhpcy5vcHRzLnN0b3JlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7fSxcbiAgICAgIGZpbGVzOiB7fSxcbiAgICAgIGN1cnJlbnRVcGxvYWRzOiB7fSxcbiAgICAgIGFsbG93TmV3VXBsb2FkOiB0cnVlLFxuICAgICAgY2FwYWJpbGl0aWVzOiB7XG4gICAgICAgIHVwbG9hZFByb2dyZXNzOiBzdXBwb3J0c1VwbG9hZFByb2dyZXNzKCksXG4gICAgICAgIGluZGl2aWR1YWxDYW5jZWxsYXRpb246IHRydWUsXG4gICAgICAgIHJlc3VtYWJsZVVwbG9hZHM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDAsXG4gICAgICBtZXRhOiB7IC4uLnRoaXMub3B0cy5tZXRhIH0sXG4gICAgICBpbmZvOiBbXSxcbiAgICAgIHJlY292ZXJlZFN0YXRlOiBudWxsLFxuICAgIH0pXG5cbiAgICB0aGlzLiNzdG9yZVVuc3Vic2NyaWJlID0gdGhpcy5zdG9yZS5zdWJzY3JpYmUoKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaCkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdzdGF0ZS11cGRhdGUnLCBwcmV2U3RhdGUsIG5leHRTdGF0ZSwgcGF0Y2gpXG4gICAgICB0aGlzLnVwZGF0ZUFsbChuZXh0U3RhdGUpXG4gICAgfSlcblxuICAgIC8vIEV4cG9zaW5nIHVwcHkgb2JqZWN0IG9uIHdpbmRvdyBmb3IgZGVidWdnaW5nIGFuZCB0ZXN0aW5nXG4gICAgaWYgKHRoaXMub3B0cy5kZWJ1ZyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93W3RoaXMub3B0cy5pZF0gPSB0aGlzXG4gICAgfVxuXG4gICAgdGhpcy4jYWRkTGlzdGVuZXJzKClcbiAgfVxuXG4gIGVtaXQgKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgdGhpcy4jZW1pdHRlci5lbWl0KGV2ZW50LCAuLi5hcmdzKVxuICB9XG5cbiAgb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMuI2VtaXR0ZXIub24oZXZlbnQsIGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBvbmNlIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLiNlbWl0dGVyLm9uY2UoZXZlbnQsIGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBvZmYgKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMuI2VtaXR0ZXIub2ZmKGV2ZW50LCBjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb24gYWxsIHBsdWdpbnMgYW5kIHJ1biBgdXBkYXRlYCBvbiB0aGVtLlxuICAgKiBDYWxsZWQgZWFjaCB0aW1lIHN0YXRlIGNoYW5nZXMuXG4gICAqXG4gICAqL1xuICB1cGRhdGVBbGwgKHN0YXRlKSB7XG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhwbHVnaW4gPT4ge1xuICAgICAgcGx1Z2luLnVwZGF0ZShzdGF0ZSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgc3RhdGUgd2l0aCBhIHBhdGNoXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXRjaCB7Zm9vOiAnYmFyJ31cbiAgICovXG4gIHNldFN0YXRlIChwYXRjaCkge1xuICAgIHRoaXMuc3RvcmUuc2V0U3RhdGUocGF0Y2gpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBjdXJyZW50IHN0YXRlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBCYWNrIGNvbXBhdCBmb3Igd2hlbiB1cHB5LnN0YXRlIGlzIHVzZWQgaW5zdGVhZCBvZiB1cHB5LmdldFN0YXRlKCkuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBnZXQgc3RhdGUgKCkge1xuICAgIC8vIEhlcmUsIHN0YXRlIGlzIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkuXG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCB0byBzZXQgc3RhdGUgZm9yIGEgc3BlY2lmaWMgZmlsZS5cbiAgICovXG4gIHNldEZpbGVTdGF0ZSAoZmlsZUlELCBzdGF0ZSkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fu4oCZdCBzZXQgc3RhdGUgZm9yICR7ZmlsZUlEfSAodGhlIGZpbGUgY291bGQgaGF2ZSBiZWVuIHJlbW92ZWQpYClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcywgW2ZpbGVJRF06IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0sIC4uLnN0YXRlIH0gfSxcbiAgICB9KVxuICB9XG5cbiAgaTE4bkluaXQgKCkge1xuICAgIGNvbnN0IHRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcihbdGhpcy5kZWZhdWx0TG9jYWxlLCB0aGlzLm9wdHMubG9jYWxlXSlcbiAgICB0aGlzLmkxOG4gPSB0cmFuc2xhdG9yLnRyYW5zbGF0ZS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5pMThuQXJyYXkgPSB0cmFuc2xhdG9yLnRyYW5zbGF0ZUFycmF5LmJpbmQodHJhbnNsYXRvcilcbiAgICB0aGlzLmxvY2FsZSA9IHRyYW5zbGF0b3IubG9jYWxlXG4gIH1cblxuICBzZXRPcHRpb25zIChuZXdPcHRzKSB7XG4gICAgdGhpcy5vcHRzID0ge1xuICAgICAgLi4udGhpcy5vcHRzLFxuICAgICAgLi4ubmV3T3B0cyxcbiAgICAgIHJlc3RyaWN0aW9uczoge1xuICAgICAgICAuLi50aGlzLm9wdHMucmVzdHJpY3Rpb25zLFxuICAgICAgICAuLi4obmV3T3B0cyAmJiBuZXdPcHRzLnJlc3RyaWN0aW9ucyksXG4gICAgICB9LFxuICAgIH1cblxuICAgIGlmIChuZXdPcHRzLm1ldGEpIHtcbiAgICAgIHRoaXMuc2V0TWV0YShuZXdPcHRzLm1ldGEpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICBpZiAobmV3T3B0cy5sb2NhbGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0ZVBsdWdpbnMoKHBsdWdpbikgPT4ge1xuICAgICAgICBwbHVnaW4uc2V0T3B0aW9ucygpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIE5vdGU6IHRoaXMgaXMgbm90IHRoZSBwcmVhY3QgYHNldFN0YXRlYCwgaXQncyBhbiBpbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGhhcyB0aGUgc2FtZSBuYW1lLlxuICAgIHRoaXMuc2V0U3RhdGUoKSAvLyBzbyB0aGF0IFVJIHJlLXJlbmRlcnMgd2l0aCBuZXcgb3B0aW9uc1xuICB9XG5cbiAgcmVzZXRQcm9ncmVzcyAoKSB7XG4gICAgY29uc3QgZGVmYXVsdFByb2dyZXNzID0ge1xuICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICB1cGxvYWRTdGFydGVkOiBudWxsLFxuICAgIH1cbiAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7fVxuICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKGZpbGVJRCA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IHsgLi4uZmlsZXNbZmlsZUlEXSB9XG4gICAgICB1cGRhdGVkRmlsZS5wcm9ncmVzcyA9IHsgLi4udXBkYXRlZEZpbGUucHJvZ3Jlc3MsIC4uLmRlZmF1bHRQcm9ncmVzcyB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZUlEXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDAsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgncmVzZXQtcHJvZ3Jlc3MnKVxuICB9XG5cbiAgYWRkUHJlUHJvY2Vzc29yIChmbikge1xuICAgIHRoaXMuI3ByZVByb2Nlc3NvcnMuYWRkKGZuKVxuICB9XG5cbiAgcmVtb3ZlUHJlUHJvY2Vzc29yIChmbikge1xuICAgIHJldHVybiB0aGlzLiNwcmVQcm9jZXNzb3JzLmRlbGV0ZShmbilcbiAgfVxuXG4gIGFkZFBvc3RQcm9jZXNzb3IgKGZuKSB7XG4gICAgdGhpcy4jcG9zdFByb2Nlc3NvcnMuYWRkKGZuKVxuICB9XG5cbiAgcmVtb3ZlUG9zdFByb2Nlc3NvciAoZm4pIHtcbiAgICByZXR1cm4gdGhpcy4jcG9zdFByb2Nlc3NvcnMuZGVsZXRlKGZuKVxuICB9XG5cbiAgYWRkVXBsb2FkZXIgKGZuKSB7XG4gICAgdGhpcy4jdXBsb2FkZXJzLmFkZChmbilcbiAgfVxuXG4gIHJlbW92ZVVwbG9hZGVyIChmbikge1xuICAgIHJldHVybiB0aGlzLiN1cGxvYWRlcnMuZGVsZXRlKGZuKVxuICB9XG5cbiAgc2V0TWV0YSAoZGF0YSkge1xuICAgIGNvbnN0IHVwZGF0ZWRNZXRhID0geyAuLi50aGlzLmdldFN0YXRlKCkubWV0YSwgLi4uZGF0YSB9XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuXG4gICAgT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5mb3JFYWNoKChmaWxlSUQpID0+IHtcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0geyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXSwgbWV0YTogeyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXS5tZXRhLCAuLi5kYXRhIH0gfVxuICAgIH0pXG5cbiAgICB0aGlzLmxvZygnQWRkaW5nIG1ldGFkYXRhOicpXG4gICAgdGhpcy5sb2coZGF0YSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbWV0YTogdXBkYXRlZE1ldGEsXG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgIH0pXG4gIH1cblxuICBzZXRGaWxlTWV0YSAoZmlsZUlELCBkYXRhKSB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGlmICghdXBkYXRlZEZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRoaXMubG9nKCdXYXMgdHJ5aW5nIHRvIHNldCBtZXRhZGF0YSBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJywgZmlsZUlEKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IG5ld01ldGEgPSB7IC4uLnVwZGF0ZWRGaWxlc1tmaWxlSURdLm1ldGEsIC4uLmRhdGEgfVxuICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0geyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXSwgbWV0YTogbmV3TWV0YSB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBmaWxlIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRCBUaGUgSUQgb2YgdGhlIGZpbGUgb2JqZWN0IHRvIHJldHVybi5cbiAgICovXG4gIGdldEZpbGUgKGZpbGVJRCkge1xuICAgIHJldHVybiB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgZmlsZXMgaW4gYW4gYXJyYXkuXG4gICAqL1xuICBnZXRGaWxlcyAoKSB7XG4gICAgY29uc3QgeyBmaWxlcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZmlsZXMpXG4gIH1cblxuICBnZXRPYmplY3RPZkZpbGVzUGVyU3RhdGUgKCkge1xuICAgIGNvbnN0IHsgZmlsZXM6IGZpbGVzT2JqZWN0LCB0b3RhbFByb2dyZXNzLCBlcnJvciB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgZmlsZXMgPSBPYmplY3QudmFsdWVzKGZpbGVzT2JqZWN0KVxuICAgIGNvbnN0IGluUHJvZ3Jlc3NGaWxlcyA9IGZpbGVzLmZpbHRlcigoeyBwcm9ncmVzcyB9KSA9PiAhcHJvZ3Jlc3MudXBsb2FkQ29tcGxldGUgJiYgcHJvZ3Jlc3MudXBsb2FkU3RhcnRlZClcbiAgICBjb25zdCBuZXdGaWxlcyA9ICBmaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpXG4gICAgY29uc3Qgc3RhcnRlZEZpbGVzID0gZmlsZXMuZmlsdGVyKFxuICAgICAgZmlsZSA9PiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHwgZmlsZS5wcm9ncmVzcy5wcmVwcm9jZXNzIHx8IGZpbGUucHJvZ3Jlc3MucG9zdHByb2Nlc3NcbiAgICApXG4gICAgY29uc3QgdXBsb2FkU3RhcnRlZEZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpXG4gICAgY29uc3QgcGF1c2VkRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUuaXNQYXVzZWQpXG4gICAgY29uc3QgY29tcGxldGVGaWxlcyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZSlcbiAgICBjb25zdCBlcnJvcmVkRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUuZXJyb3IpXG4gICAgY29uc3QgaW5Qcm9ncmVzc05vdFBhdXNlZEZpbGVzID0gaW5Qcm9ncmVzc0ZpbGVzLmZpbHRlcigoZmlsZSkgPT4gIWZpbGUuaXNQYXVzZWQpXG4gICAgY29uc3QgcHJvY2Vzc2luZ0ZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLnByZXByb2Nlc3MgfHwgZmlsZS5wcm9ncmVzcy5wb3N0cHJvY2VzcylcblxuICAgIHJldHVybiB7XG4gICAgICBuZXdGaWxlcyxcbiAgICAgIHN0YXJ0ZWRGaWxlcyxcbiAgICAgIHVwbG9hZFN0YXJ0ZWRGaWxlcyxcbiAgICAgIHBhdXNlZEZpbGVzLFxuICAgICAgY29tcGxldGVGaWxlcyxcbiAgICAgIGVycm9yZWRGaWxlcyxcbiAgICAgIGluUHJvZ3Jlc3NGaWxlcyxcbiAgICAgIGluUHJvZ3Jlc3NOb3RQYXVzZWRGaWxlcyxcbiAgICAgIHByb2Nlc3NpbmdGaWxlcyxcblxuICAgICAgaXNVcGxvYWRTdGFydGVkOiB1cGxvYWRTdGFydGVkRmlsZXMubGVuZ3RoID4gMCxcbiAgICAgIGlzQWxsQ29tcGxldGU6IHRvdGFsUHJvZ3Jlc3MgPT09IDEwMFxuICAgICAgICAmJiBjb21wbGV0ZUZpbGVzLmxlbmd0aCA9PT0gZmlsZXMubGVuZ3RoXG4gICAgICAgICYmIHByb2Nlc3NpbmdGaWxlcy5sZW5ndGggPT09IDAsXG4gICAgICBpc0FsbEVycm9yZWQ6ICEhZXJyb3IgJiYgZXJyb3JlZEZpbGVzLmxlbmd0aCA9PT0gZmlsZXMubGVuZ3RoLFxuICAgICAgaXNBbGxQYXVzZWQ6IGluUHJvZ3Jlc3NGaWxlcy5sZW5ndGggIT09IDAgJiYgcGF1c2VkRmlsZXMubGVuZ3RoID09PSBpblByb2dyZXNzRmlsZXMubGVuZ3RoLFxuICAgICAgaXNVcGxvYWRJblByb2dyZXNzOiBpblByb2dyZXNzRmlsZXMubGVuZ3RoID4gMCxcbiAgICAgIGlzU29tZUdob3N0OiBmaWxlcy5zb21lKGZpbGUgPT4gZmlsZS5pc0dob3N0KSxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBwdWJsaWMgd3JhcHBlciBmb3IgX2NoZWNrUmVzdHJpY3Rpb25zIOKAlCBjaGVja3MgaWYgYSBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMuXG4gICAqIEZvciB1c2UgaW4gVUkgcGx1aWdpbnMgKGxpa2UgUHJvdmlkZXJzKSwgdG8gZGlzYWxsb3cgc2VsZWN0aW5nIGZpbGVzIHRoYXQgd29u4oCZdCBwYXNzIHJlc3RyaWN0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGNoZWNrXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtmaWxlc10gYXJyYXkgdG8gY2hlY2sgbWF4TnVtYmVyT2ZGaWxlcyBhbmQgbWF4VG90YWxGaWxlU2l6ZVxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSB7IHJlc3VsdDogdHJ1ZS9mYWxzZSwgcmVhc29uOiB3aHkgZmlsZSBkaWRu4oCZdCBwYXNzIHJlc3RyaWN0aW9ucyB9XG4gICAqL1xuICB2YWxpZGF0ZVJlc3RyaWN0aW9ucyAoZmlsZSwgZmlsZXMpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy4jY2hlY2tSZXN0cmljdGlvbnMoZmlsZSwgZmlsZXMpXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IHRydWUsXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IGZhbHNlLFxuICAgICAgICByZWFzb246IGVyci5tZXNzYWdlLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMgc2V0IGluIG9wdGlvbnM6IG1heEZpbGVTaXplLCBtaW5GaWxlU2l6ZSxcbiAgICogbWF4TnVtYmVyT2ZGaWxlcyBhbmQgYWxsb3dlZEZpbGVUeXBlcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGNoZWNrXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtmaWxlc10gYXJyYXkgdG8gY2hlY2sgbWF4TnVtYmVyT2ZGaWxlcyBhbmQgbWF4VG90YWxGaWxlU2l6ZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgI2NoZWNrUmVzdHJpY3Rpb25zIChmaWxlLCBmaWxlcyA9IHRoaXMuZ2V0RmlsZXMoKSkge1xuICAgIGNvbnN0IHsgbWF4RmlsZVNpemUsIG1pbkZpbGVTaXplLCBtYXhUb3RhbEZpbGVTaXplLCBtYXhOdW1iZXJPZkZpbGVzLCBhbGxvd2VkRmlsZVR5cGVzIH0gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG5cbiAgICBpZiAobWF4TnVtYmVyT2ZGaWxlcykge1xuICAgICAgaWYgKGZpbGVzLmxlbmd0aCArIDEgPiBtYXhOdW1iZXJPZkZpbGVzKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKGAke3RoaXMuaTE4bigneW91Q2FuT25seVVwbG9hZFgnLCB7IHNtYXJ0X2NvdW50OiBtYXhOdW1iZXJPZkZpbGVzIH0pfWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFsbG93ZWRGaWxlVHlwZXMpIHtcbiAgICAgIGNvbnN0IGlzQ29ycmVjdEZpbGVUeXBlID0gYWxsb3dlZEZpbGVUeXBlcy5zb21lKCh0eXBlKSA9PiB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBtaW1lLXR5cGVcbiAgICAgICAgaWYgKHR5cGUuaW5kZXhPZignLycpID4gLTEpIHtcbiAgICAgICAgICBpZiAoIWZpbGUudHlwZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgcmV0dXJuIG1hdGNoKGZpbGUudHlwZS5yZXBsYWNlKC87Lio/JC8sICcnKSwgdHlwZSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG90aGVyd2lzZSB0aGlzIGlzIGxpa2VseSBhbiBleHRlbnNpb25cbiAgICAgICAgaWYgKHR5cGVbMF0gPT09ICcuJyAmJiBmaWxlLmV4dGVuc2lvbikge1xuICAgICAgICAgIHJldHVybiBmaWxlLmV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSB0eXBlLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoIWlzQ29ycmVjdEZpbGVUeXBlKSB7XG4gICAgICAgIGNvbnN0IGFsbG93ZWRGaWxlVHlwZXNTdHJpbmcgPSBhbGxvd2VkRmlsZVR5cGVzLmpvaW4oJywgJylcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCd5b3VDYW5Pbmx5VXBsb2FkRmlsZVR5cGVzJywgeyB0eXBlczogYWxsb3dlZEZpbGVUeXBlc1N0cmluZyB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBjaGVjayBtYXhUb3RhbEZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1heFRvdGFsRmlsZVNpemUgJiYgZmlsZS5zaXplICE9IG51bGwpIHtcbiAgICAgIGxldCB0b3RhbEZpbGVzU2l6ZSA9IDBcbiAgICAgIHRvdGFsRmlsZXNTaXplICs9IGZpbGUuc2l6ZVxuICAgICAgZmlsZXMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICB0b3RhbEZpbGVzU2l6ZSArPSBmLnNpemVcbiAgICAgIH0pXG4gICAgICBpZiAodG90YWxGaWxlc1NpemUgPiBtYXhUb3RhbEZpbGVTaXplKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignZXhjZWVkc1NpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtYXhUb3RhbEZpbGVTaXplKSxcbiAgICAgICAgICBmaWxlOiBmaWxlLm5hbWUsXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIGNhbid0IGNoZWNrIG1heEZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1heEZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplID4gbWF4RmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdleGNlZWRzU2l6ZScsIHtcbiAgICAgICAgICBzaXplOiBwcmV0dGllckJ5dGVzKG1heEZpbGVTaXplKSxcbiAgICAgICAgICBmaWxlOiBmaWxlLm5hbWUsXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIGNhbid0IGNoZWNrIG1pbkZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1pbkZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplIDwgbWluRmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdpbmZlcmlvclNpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtaW5GaWxlU2l6ZSksXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBtaW5OdW1iZXJPZkZpbGVzIHJlc3RyaWN0aW9uIGlzIHJlYWNoZWQgYmVmb3JlIHVwbG9hZGluZy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNjaGVja01pbk51bWJlck9mRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgeyBtaW5OdW1iZXJPZkZpbGVzIH0gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG4gICAgaWYgKE9iamVjdC5rZXlzKGZpbGVzKS5sZW5ndGggPCBtaW5OdW1iZXJPZkZpbGVzKSB7XG4gICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcihgJHt0aGlzLmkxOG4oJ3lvdUhhdmVUb0F0TGVhc3RTZWxlY3RYJywgeyBzbWFydF9jb3VudDogbWluTnVtYmVyT2ZGaWxlcyB9KX1gKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiByZXF1aXJlZE1ldGFGaWVsZCByZXN0cmljdGlvbiBpcyBtZXQgYmVmb3JlIHVwbG9hZGluZy5cbiAgICpcbiAgICovXG4gICNjaGVja1JlcXVpcmVkTWV0YUZpZWxkcyAoZmlsZXMpIHtcbiAgICBjb25zdCB7IHJlcXVpcmVkTWV0YUZpZWxkcyB9ID0gdGhpcy5vcHRzLnJlc3RyaWN0aW9uc1xuICAgIGNvbnN0IHsgaGFzT3duUHJvcGVydHkgfSA9IE9iamVjdC5wcm90b3R5cGVcblxuICAgIGNvbnN0IGVycm9ycyA9IFtdXG4gICAgZm9yIChjb25zdCBmaWxlSUQgb2YgT2JqZWN0LmtleXMoZmlsZXMpKSB7XG4gICAgICBjb25zdCBmaWxlID0gdGhpcy5nZXRGaWxlKGZpbGVJRClcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWlyZWRNZXRhRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChmaWxlLm1ldGEsIHJlcXVpcmVkTWV0YUZpZWxkc1tpXSkgfHwgZmlsZS5tZXRhW3JlcXVpcmVkTWV0YUZpZWxkc1tpXV0gPT09ICcnKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gbmV3IFJlc3RyaWN0aW9uRXJyb3IoYCR7dGhpcy5pMThuKCdtaXNzaW5nUmVxdWlyZWRNZXRhRmllbGRPbkZpbGUnLCB7IGZpbGVOYW1lOiBmaWxlLm5hbWUgfSl9YClcbiAgICAgICAgICBlcnJvcnMucHVzaChlcnIpXG4gICAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHsgZmlsZSwgc2hvd0luZm9ybWVyOiBmYWxzZSwgdGhyb3dFcnI6IGZhbHNlIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZVJlc3RyaWN0aW9uRXJyb3IoYCR7dGhpcy5pMThuKCdtaXNzaW5nUmVxdWlyZWRNZXRhRmllbGQnKX1gLCBlcnJvcnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgYW4gZXJyb3IsIHNldHMgSW5mb3JtZXIgbWVzc2FnZSwgdGhlbiB0aHJvd3MgdGhlIGVycm9yLlxuICAgKiBFbWl0cyBhICdyZXN0cmljdGlvbi1mYWlsZWQnIGV2ZW50IGlmIGl04oCZcyBhIHJlc3RyaWN0aW9uIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0IHwgc3RyaW5nfSBlcnIg4oCUIEVycm9yIG9iamVjdCBvciBwbGFpbiBzdHJpbmcgbWVzc2FnZVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuc2hvd0luZm9ybWVyPXRydWVdIOKAlCBTb21ldGltZXMgZGV2ZWxvcGVyIG1pZ2h0IHdhbnQgdG8gc2hvdyBJbmZvcm1lciBtYW51YWxseVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnMuZmlsZT1udWxsXSDigJQgRmlsZSBvYmplY3QgdXNlZCB0byBlbWl0IHRoZSByZXN0cmljdGlvbiBlcnJvclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRocm93RXJyPXRydWVdIOKAlCBFcnJvcnMgc2hvdWxkbuKAmXQgYmUgdGhyb3duLCBmb3IgZXhhbXBsZSwgaW4gYHVwbG9hZC1lcnJvcmAgZXZlbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNzaG93T3JMb2dFcnJvckFuZFRocm93IChlcnIsIHsgc2hvd0luZm9ybWVyID0gdHJ1ZSwgZmlsZSA9IG51bGwsIHRocm93RXJyID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBjb25zdCBtZXNzYWdlID0gdHlwZW9mIGVyciA9PT0gJ29iamVjdCcgPyBlcnIubWVzc2FnZSA6IGVyclxuICAgIGNvbnN0IGRldGFpbHMgPSAodHlwZW9mIGVyciA9PT0gJ29iamVjdCcgJiYgZXJyLmRldGFpbHMpID8gZXJyLmRldGFpbHMgOiAnJ1xuXG4gICAgLy8gUmVzdHJpY3Rpb24gZXJyb3JzIHNob3VsZCBiZSBsb2dnZWQsIGJ1dCBub3QgYXMgZXJyb3JzLFxuICAgIC8vIGFzIHRoZXkgYXJlIGV4cGVjdGVkIGFuZCBzaG93biBpbiB0aGUgVUkuXG4gICAgbGV0IGxvZ01lc3NhZ2VXaXRoRGV0YWlscyA9IG1lc3NhZ2VcbiAgICBpZiAoZGV0YWlscykge1xuICAgICAgbG9nTWVzc2FnZVdpdGhEZXRhaWxzICs9IGAgJHtkZXRhaWxzfWBcbiAgICB9XG4gICAgaWYgKGVyci5pc1Jlc3RyaWN0aW9uKSB7XG4gICAgICB0aGlzLmxvZyhsb2dNZXNzYWdlV2l0aERldGFpbHMpXG4gICAgICB0aGlzLmVtaXQoJ3Jlc3RyaWN0aW9uLWZhaWxlZCcsIGZpbGUsIGVycilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2cobG9nTWVzc2FnZVdpdGhEZXRhaWxzLCAnZXJyb3InKVxuICAgIH1cblxuICAgIC8vIFNvbWV0aW1lcyBpbmZvcm1lciBoYXMgdG8gYmUgc2hvd24gbWFudWFsbHkgYnkgdGhlIGRldmVsb3BlcixcbiAgICAvLyBmb3IgZXhhbXBsZSwgaW4gYG9uQmVmb3JlRmlsZUFkZGVkYC5cbiAgICBpZiAoc2hvd0luZm9ybWVyKSB7XG4gICAgICB0aGlzLmluZm8oeyBtZXNzYWdlLCBkZXRhaWxzIH0sICdlcnJvcicsIHRoaXMub3B0cy5pbmZvVGltZW91dClcbiAgICB9XG5cbiAgICBpZiAodGhyb3dFcnIpIHtcbiAgICAgIHRocm93ICh0eXBlb2YgZXJyID09PSAnb2JqZWN0JyA/IGVyciA6IG5ldyBFcnJvcihlcnIpKVxuICAgIH1cbiAgfVxuXG4gICNhc3NlcnROZXdVcGxvYWRBbGxvd2VkIChmaWxlKSB7XG4gICAgY29uc3QgeyBhbGxvd05ld1VwbG9hZCB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoYWxsb3dOZXdVcGxvYWQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignbm9Nb3JlRmlsZXNBbGxvd2VkJykpLCB7IGZpbGUgfSlcbiAgICB9XG4gIH1cblxuICBjaGVja0lmRmlsZUFscmVhZHlFeGlzdHMgKGZpbGVJRCkge1xuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKGZpbGVzW2ZpbGVJRF0gJiYgIWZpbGVzW2ZpbGVJRF0uaXNHaG9zdCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZmlsZSBzdGF0ZSBvYmplY3QgYmFzZWQgb24gdXNlci1wcm92aWRlZCBgYWRkRmlsZSgpYCBvcHRpb25zLlxuICAgKlxuICAgKiBOb3RlIHRoaXMgaXMgZXh0cmVtZWx5IHNpZGUtZWZmZWN0ZnVsIGFuZCBzaG91bGQgb25seSBiZSBkb25lIHdoZW4gYSBmaWxlIHN0YXRlIG9iamVjdFxuICAgKiB3aWxsIGJlIGFkZGVkIHRvIHN0YXRlIGltbWVkaWF0ZWx5IGFmdGVyd2FyZCFcbiAgICpcbiAgICogVGhlIGBmaWxlc2AgdmFsdWUgaXMgcGFzc2VkIGluIGJlY2F1c2UgaXQgbWF5IGJlIHVwZGF0ZWQgYnkgdGhlIGNhbGxlciB3aXRob3V0IHVwZGF0aW5nIHRoZSBzdG9yZS5cbiAgICovXG4gICNjaGVja0FuZENyZWF0ZUZpbGVTdGF0ZU9iamVjdCAoZmlsZXMsIGZpbGVEZXNjcmlwdG9yKSB7XG4gICAgY29uc3QgZmlsZVR5cGUgPSBnZXRGaWxlVHlwZShmaWxlRGVzY3JpcHRvcilcbiAgICBjb25zdCBmaWxlTmFtZSA9IGdldEZpbGVOYW1lKGZpbGVUeXBlLCBmaWxlRGVzY3JpcHRvcilcbiAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24oZmlsZU5hbWUpLmV4dGVuc2lvblxuICAgIGNvbnN0IGlzUmVtb3RlID0gQm9vbGVhbihmaWxlRGVzY3JpcHRvci5pc1JlbW90ZSlcbiAgICBjb25zdCBmaWxlSUQgPSBnZW5lcmF0ZUZpbGVJRCh7XG4gICAgICAuLi5maWxlRGVzY3JpcHRvcixcbiAgICAgIHR5cGU6IGZpbGVUeXBlLFxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5jaGVja0lmRmlsZUFscmVhZHlFeGlzdHMoZmlsZUlEKSkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgUmVzdHJpY3Rpb25FcnJvcih0aGlzLmkxOG4oJ25vRHVwbGljYXRlcycsIHsgZmlsZU5hbWUgfSkpXG4gICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KGVycm9yLCB7IGZpbGU6IGZpbGVEZXNjcmlwdG9yIH0pXG4gICAgfVxuXG4gICAgY29uc3QgbWV0YSA9IGZpbGVEZXNjcmlwdG9yLm1ldGEgfHwge31cbiAgICBtZXRhLm5hbWUgPSBmaWxlTmFtZVxuICAgIG1ldGEudHlwZSA9IGZpbGVUeXBlXG5cbiAgICAvLyBgbnVsbGAgbWVhbnMgdGhlIHNpemUgaXMgdW5rbm93bi5cbiAgICBjb25zdCBzaXplID0gTnVtYmVyLmlzRmluaXRlKGZpbGVEZXNjcmlwdG9yLmRhdGEuc2l6ZSkgPyBmaWxlRGVzY3JpcHRvci5kYXRhLnNpemUgOiBudWxsXG5cbiAgICBsZXQgbmV3RmlsZSA9IHtcbiAgICAgIHNvdXJjZTogZmlsZURlc2NyaXB0b3Iuc291cmNlIHx8ICcnLFxuICAgICAgaWQ6IGZpbGVJRCxcbiAgICAgIG5hbWU6IGZpbGVOYW1lLFxuICAgICAgZXh0ZW5zaW9uOiBmaWxlRXh0ZW5zaW9uIHx8ICcnLFxuICAgICAgbWV0YToge1xuICAgICAgICAuLi50aGlzLmdldFN0YXRlKCkubWV0YSxcbiAgICAgICAgLi4ubWV0YSxcbiAgICAgIH0sXG4gICAgICB0eXBlOiBmaWxlVHlwZSxcbiAgICAgIGRhdGE6IGZpbGVEZXNjcmlwdG9yLmRhdGEsXG4gICAgICBwcm9ncmVzczoge1xuICAgICAgICBwZXJjZW50YWdlOiAwLFxuICAgICAgICBieXRlc1VwbG9hZGVkOiAwLFxuICAgICAgICBieXRlc1RvdGFsOiBzaXplLFxuICAgICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICAgIHVwbG9hZFN0YXJ0ZWQ6IG51bGwsXG4gICAgICB9LFxuICAgICAgc2l6ZSxcbiAgICAgIGlzUmVtb3RlLFxuICAgICAgcmVtb3RlOiBmaWxlRGVzY3JpcHRvci5yZW1vdGUgfHwgJycsXG4gICAgICBwcmV2aWV3OiBmaWxlRGVzY3JpcHRvci5wcmV2aWV3LFxuICAgIH1cblxuICAgIGNvbnN0IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID0gdGhpcy5vcHRzLm9uQmVmb3JlRmlsZUFkZGVkKG5ld0ZpbGUsIGZpbGVzKVxuXG4gICAgaWYgKG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgLy8gRG9u4oCZdCBzaG93IFVJIGluZm8gZm9yIHRoaXMgZXJyb3IsIGFzIGl0IHNob3VsZCBiZSBkb25lIGJ5IHRoZSBkZXZlbG9wZXJcbiAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cobmV3IFJlc3RyaWN0aW9uRXJyb3IoJ0Nhbm5vdCBhZGQgdGhlIGZpbGUgYmVjYXVzZSBvbkJlZm9yZUZpbGVBZGRlZCByZXR1cm5lZCBmYWxzZS4nKSwgeyBzaG93SW5mb3JtZXI6IGZhbHNlLCBmaWxlRGVzY3JpcHRvciB9KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSAnb2JqZWN0JyAmJiBvbkJlZm9yZUZpbGVBZGRlZFJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgbmV3RmlsZSA9IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZpbGVzQXJyYXkgPSBPYmplY3Qua2V5cyhmaWxlcykubWFwKGkgPT4gZmlsZXNbaV0pXG4gICAgICB0aGlzLiNjaGVja1Jlc3RyaWN0aW9ucyhuZXdGaWxlLCBmaWxlc0FycmF5KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHsgZmlsZTogbmV3RmlsZSB9KVxuICAgIH1cblxuICAgIHJldHVybiBuZXdGaWxlXG4gIH1cblxuICAvLyBTY2hlZHVsZSBhbiB1cGxvYWQgaWYgYGF1dG9Qcm9jZWVkYCBpcyBlbmFibGVkLlxuICAjc3RhcnRJZkF1dG9Qcm9jZWVkICgpIHtcbiAgICBpZiAodGhpcy5vcHRzLmF1dG9Qcm9jZWVkICYmICF0aGlzLnNjaGVkdWxlZEF1dG9Qcm9jZWVkKSB7XG4gICAgICB0aGlzLnNjaGVkdWxlZEF1dG9Qcm9jZWVkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQgPSBudWxsXG4gICAgICAgIHRoaXMudXBsb2FkKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIGlmICghZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMubG9nKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSB8fCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSwgNClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGZpbGUgdG8gYHN0YXRlLmZpbGVzYC4gVGhpcyB3aWxsIHJ1biBgb25CZWZvcmVGaWxlQWRkZWRgLFxuICAgKiB0cnkgdG8gZ3Vlc3MgZmlsZSB0eXBlIGluIGEgY2xldmVyIHdheSwgY2hlY2sgZmlsZSBhZ2FpbnN0IHJlc3RyaWN0aW9ucyxcbiAgICogYW5kIHN0YXJ0IGFuIHVwbG9hZCBpZiBgYXV0b1Byb2NlZWQgPT09IHRydWVgLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZmlsZSBvYmplY3QgdG8gYWRkXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGlkIGZvciB0aGUgYWRkZWQgZmlsZVxuICAgKi9cbiAgYWRkRmlsZSAoZmlsZSkge1xuICAgIHRoaXMuI2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoZmlsZSlcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgIGxldCBuZXdGaWxlID0gdGhpcy4jY2hlY2tBbmRDcmVhdGVGaWxlU3RhdGVPYmplY3QoZmlsZXMsIGZpbGUpXG5cbiAgICAvLyBVc2VycyBhcmUgYXNrZWQgdG8gcmUtc2VsZWN0IHJlY292ZXJlZCBmaWxlcyB3aXRob3V0IGRhdGEsXG4gICAgLy8gYW5kIHRvIGtlZXAgdGhlIHByb2dyZXNzLCBtZXRhIGFuZCBldmVydGhpbmcgZWxzZSwgd2Ugb25seSByZXBsYWNlIHNhaWQgZGF0YVxuICAgIGlmIChmaWxlc1tuZXdGaWxlLmlkXSAmJiBmaWxlc1tuZXdGaWxlLmlkXS5pc0dob3N0KSB7XG4gICAgICBuZXdGaWxlID0ge1xuICAgICAgICAuLi5maWxlc1tuZXdGaWxlLmlkXSxcbiAgICAgICAgZGF0YTogZmlsZS5kYXRhLFxuICAgICAgICBpc0dob3N0OiBmYWxzZSxcbiAgICAgIH1cbiAgICAgIHRoaXMubG9nKGBSZXBsYWNlZCB0aGUgYmxvYiBpbiB0aGUgcmVzdG9yZWQgZ2hvc3QgZmlsZTogJHtuZXdGaWxlLm5hbWV9LCAke25ld0ZpbGUuaWR9YClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB7XG4gICAgICAgIC4uLmZpbGVzLFxuICAgICAgICBbbmV3RmlsZS5pZF06IG5ld0ZpbGUsXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ2ZpbGUtYWRkZWQnLCBuZXdGaWxlKVxuICAgIHRoaXMuZW1pdCgnZmlsZXMtYWRkZWQnLCBbbmV3RmlsZV0pXG4gICAgdGhpcy5sb2coYEFkZGVkIGZpbGU6ICR7bmV3RmlsZS5uYW1lfSwgJHtuZXdGaWxlLmlkfSwgbWltZSB0eXBlOiAke25ld0ZpbGUudHlwZX1gKVxuXG4gICAgdGhpcy4jc3RhcnRJZkF1dG9Qcm9jZWVkKClcblxuICAgIHJldHVybiBuZXdGaWxlLmlkXG4gIH1cblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIGZpbGVzIHRvIGBzdGF0ZS5maWxlc2AuIFNlZSB0aGUgYGFkZEZpbGUoKWAgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogSWYgYW4gZXJyb3Igb2NjdXJzIHdoaWxlIGFkZGluZyBhIGZpbGUsIGl0IGlzIGxvZ2dlZCBhbmQgdGhlIHVzZXIgaXMgbm90aWZpZWQuXG4gICAqIFRoaXMgaXMgZ29vZCBmb3IgVUkgcGx1Z2lucywgYnV0IG5vdCBmb3IgcHJvZ3JhbW1hdGljIHVzZS5cbiAgICogUHJvZ3JhbW1hdGljIHVzZXJzIHNob3VsZCB1c3VhbGx5IHN0aWxsIHVzZSBgYWRkRmlsZSgpYCBvbiBpbmRpdmlkdWFsIGZpbGVzLlxuICAgKi9cbiAgYWRkRmlsZXMgKGZpbGVEZXNjcmlwdG9ycykge1xuICAgIHRoaXMuI2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoKVxuXG4gICAgLy8gY3JlYXRlIGEgY29weSBvZiB0aGUgZmlsZXMgb2JqZWN0IG9ubHkgb25jZVxuICAgIGNvbnN0IGZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGNvbnN0IG5ld0ZpbGVzID0gW11cbiAgICBjb25zdCBlcnJvcnMgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZURlc2NyaXB0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgbmV3RmlsZSA9IHRoaXMuI2NoZWNrQW5kQ3JlYXRlRmlsZVN0YXRlT2JqZWN0KGZpbGVzLCBmaWxlRGVzY3JpcHRvcnNbaV0pXG4gICAgICAgIC8vIFVzZXJzIGFyZSBhc2tlZCB0byByZS1zZWxlY3QgcmVjb3ZlcmVkIGZpbGVzIHdpdGhvdXQgZGF0YSxcbiAgICAgICAgLy8gYW5kIHRvIGtlZXAgdGhlIHByb2dyZXNzLCBtZXRhIGFuZCBldmVydGhpbmcgZWxzZSwgd2Ugb25seSByZXBsYWNlIHNhaWQgZGF0YVxuICAgICAgICBpZiAoZmlsZXNbbmV3RmlsZS5pZF0gJiYgZmlsZXNbbmV3RmlsZS5pZF0uaXNHaG9zdCkge1xuICAgICAgICAgIG5ld0ZpbGUgPSB7XG4gICAgICAgICAgICAuLi5maWxlc1tuZXdGaWxlLmlkXSxcbiAgICAgICAgICAgIGRhdGE6IGZpbGVEZXNjcmlwdG9yc1tpXS5kYXRhLFxuICAgICAgICAgICAgaXNHaG9zdDogZmFsc2UsXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubG9nKGBSZXBsYWNlZCBibG9iIGluIGEgZ2hvc3QgZmlsZTogJHtuZXdGaWxlLm5hbWV9LCAke25ld0ZpbGUuaWR9YClcbiAgICAgICAgfVxuICAgICAgICBmaWxlc1tuZXdGaWxlLmlkXSA9IG5ld0ZpbGVcbiAgICAgICAgbmV3RmlsZXMucHVzaChuZXdGaWxlKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmICghZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChlcnIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXMgfSlcblxuICAgIG5ld0ZpbGVzLmZvckVhY2goKG5ld0ZpbGUpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnZmlsZS1hZGRlZCcsIG5ld0ZpbGUpXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgnZmlsZXMtYWRkZWQnLCBuZXdGaWxlcylcblxuICAgIGlmIChuZXdGaWxlcy5sZW5ndGggPiA1KSB7XG4gICAgICB0aGlzLmxvZyhgQWRkZWQgYmF0Y2ggb2YgJHtuZXdGaWxlcy5sZW5ndGh9IGZpbGVzYClcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMobmV3RmlsZXMpLmZvckVhY2goZmlsZUlEID0+IHtcbiAgICAgICAgdGhpcy5sb2coYEFkZGVkIGZpbGU6ICR7bmV3RmlsZXNbZmlsZUlEXS5uYW1lfVxcbiBpZDogJHtuZXdGaWxlc1tmaWxlSURdLmlkfVxcbiB0eXBlOiAke25ld0ZpbGVzW2ZpbGVJRF0udHlwZX1gKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAobmV3RmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy4jc3RhcnRJZkF1dG9Qcm9jZWVkKClcbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBtZXNzYWdlID0gJ011bHRpcGxlIGVycm9ycyBvY2N1cnJlZCB3aGlsZSBhZGRpbmcgZmlsZXM6XFxuJ1xuICAgICAgZXJyb3JzLmZvckVhY2goKHN1YkVycm9yKSA9PiB7XG4gICAgICAgIG1lc3NhZ2UgKz0gYFxcbiAqICR7c3ViRXJyb3IubWVzc2FnZX1gXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmluZm8oe1xuICAgICAgICBtZXNzYWdlOiB0aGlzLmkxOG4oJ2FkZEJ1bGtGaWxlc0ZhaWxlZCcsIHsgc21hcnRfY291bnQ6IGVycm9ycy5sZW5ndGggfSksXG4gICAgICAgIGRldGFpbHM6IG1lc3NhZ2UsXG4gICAgICB9LCAnZXJyb3InLCB0aGlzLm9wdHMuaW5mb1RpbWVvdXQpXG5cbiAgICAgIGlmICh0eXBlb2YgQWdncmVnYXRlRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZUVycm9yKGVycm9ycywgbWVzc2FnZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgICAgICBlcnIuZXJyb3JzID0gZXJyb3JzXG4gICAgICAgIHRocm93IGVyclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUZpbGVzIChmaWxlSURzLCByZWFzb24pIHtcbiAgICBjb25zdCB7IGZpbGVzLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi5maWxlcyB9XG4gICAgY29uc3QgdXBkYXRlZFVwbG9hZHMgPSB7IC4uLmN1cnJlbnRVcGxvYWRzIH1cblxuICAgIGNvbnN0IHJlbW92ZWRGaWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICBmaWxlSURzLmZvckVhY2goKGZpbGVJRCkgPT4ge1xuICAgICAgaWYgKGZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgICAgcmVtb3ZlZEZpbGVzW2ZpbGVJRF0gPSBmaWxlc1tmaWxlSURdXG4gICAgICAgIGRlbGV0ZSB1cGRhdGVkRmlsZXNbZmlsZUlEXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBSZW1vdmUgZmlsZXMgZnJvbSB0aGUgYGZpbGVJRHNgIGxpc3QgaW4gZWFjaCB1cGxvYWQuXG4gICAgZnVuY3Rpb24gZmlsZUlzTm90UmVtb3ZlZCAodXBsb2FkRmlsZUlEKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlZEZpbGVzW3VwbG9hZEZpbGVJRF0gPT09IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRVcGxvYWRzKS5mb3JFYWNoKCh1cGxvYWRJRCkgPT4ge1xuICAgICAgY29uc3QgbmV3RmlsZUlEcyA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXS5maWxlSURzLmZpbHRlcihmaWxlSXNOb3RSZW1vdmVkKVxuXG4gICAgICAvLyBSZW1vdmUgdGhlIHVwbG9hZCBpZiBubyBmaWxlcyBhcmUgYXNzb2NpYXRlZCB3aXRoIGl0IGFueW1vcmUuXG4gICAgICBpZiAobmV3RmlsZUlEcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIHVwZGF0ZWRVcGxvYWRzW3VwbG9hZElEXVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdXBkYXRlZFVwbG9hZHNbdXBsb2FkSURdID0ge1xuICAgICAgICAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sXG4gICAgICAgIGZpbGVJRHM6IG5ld0ZpbGVJRHMsXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IHN0YXRlVXBkYXRlID0ge1xuICAgICAgY3VycmVudFVwbG9hZHM6IHVwZGF0ZWRVcGxvYWRzLFxuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICB9XG5cbiAgICAvLyBJZiBhbGwgZmlsZXMgd2VyZSByZW1vdmVkIC0gYWxsb3cgbmV3IHVwbG9hZHMsXG4gICAgLy8gYW5kIGNsZWFyIHJlY292ZXJlZFN0YXRlXG4gICAgaWYgKE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICBzdGF0ZVVwZGF0ZS5hbGxvd05ld1VwbG9hZCA9IHRydWVcbiAgICAgIHN0YXRlVXBkYXRlLmVycm9yID0gbnVsbFxuICAgICAgc3RhdGVVcGRhdGUucmVjb3ZlcmVkU3RhdGUgPSBudWxsXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZVVwZGF0ZSlcbiAgICB0aGlzLmNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKVxuXG4gICAgY29uc3QgcmVtb3ZlZEZpbGVJRHMgPSBPYmplY3Qua2V5cyhyZW1vdmVkRmlsZXMpXG4gICAgcmVtb3ZlZEZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ2ZpbGUtcmVtb3ZlZCcsIHJlbW92ZWRGaWxlc1tmaWxlSURdLCByZWFzb24pXG4gICAgfSlcblxuICAgIGlmIChyZW1vdmVkRmlsZUlEcy5sZW5ndGggPiA1KSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCAke3JlbW92ZWRGaWxlSURzLmxlbmd0aH0gZmlsZXNgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCBmaWxlczogJHtyZW1vdmVkRmlsZUlEcy5qb2luKCcsICcpfWApXG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRmlsZSAoZmlsZUlELCByZWFzb24gPSBudWxsKSB7XG4gICAgdGhpcy5yZW1vdmVGaWxlcyhbZmlsZUlEXSwgcmVhc29uKVxuICB9XG5cbiAgcGF1c2VSZXN1bWUgKGZpbGVJRCkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmNhcGFiaWxpdGllcy5yZXN1bWFibGVVcGxvYWRzXG4gICAgICAgICB8fCB0aGlzLmdldEZpbGUoZmlsZUlEKS51cGxvYWRDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGNvbnN0IHdhc1BhdXNlZCA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpLmlzUGF1c2VkIHx8IGZhbHNlXG4gICAgY29uc3QgaXNQYXVzZWQgPSAhd2FzUGF1c2VkXG5cbiAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlSUQsIHtcbiAgICAgIGlzUGF1c2VkLFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3VwbG9hZC1wYXVzZScsIGZpbGVJRCwgaXNQYXVzZWQpXG5cbiAgICByZXR1cm4gaXNQYXVzZWRcbiAgfVxuXG4gIHBhdXNlQWxsICgpIHtcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcyB9XG4gICAgY29uc3QgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcyA9IE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gIXVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZVxuICAgICAgICAgICAgICYmIHVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgfSlcblxuICAgIGluUHJvZ3Jlc3NVcGRhdGVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlZEZpbGUgPSB7IC4uLnVwZGF0ZWRGaWxlc1tmaWxlXSwgaXNQYXVzZWQ6IHRydWUgfVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcbiAgICB0aGlzLmVtaXQoJ3BhdXNlLWFsbCcpXG4gIH1cblxuICByZXN1bWVBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCBpblByb2dyZXNzVXBkYXRlZEZpbGVzID0gT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiAhdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZENvbXBsZXRlXG4gICAgICAgICAgICAgJiYgdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWRcbiAgICB9KVxuXG4gICAgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IHtcbiAgICAgICAgLi4udXBkYXRlZEZpbGVzW2ZpbGVdLFxuICAgICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlczogdXBkYXRlZEZpbGVzIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3Jlc3VtZS1hbGwnKVxuICB9XG5cbiAgcmV0cnlBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCBmaWxlc1RvUmV0cnkgPSBPYmplY3Qua2V5cyh1cGRhdGVkRmlsZXMpLmZpbHRlcihmaWxlID0+IHtcbiAgICAgIHJldHVybiB1cGRhdGVkRmlsZXNbZmlsZV0uZXJyb3JcbiAgICB9KVxuXG4gICAgZmlsZXNUb1JldHJ5LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRGaWxlID0ge1xuICAgICAgICAuLi51cGRhdGVkRmlsZXNbZmlsZV0sXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZV0gPSB1cGRhdGVkRmlsZVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgncmV0cnktYWxsJywgZmlsZXNUb1JldHJ5KVxuXG4gICAgaWYgKGZpbGVzVG9SZXRyeS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBzdWNjZXNzZnVsOiBbXSxcbiAgICAgICAgZmFpbGVkOiBbXSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQoZmlsZXNUb1JldHJ5LCB7XG4gICAgICBmb3JjZUFsbG93TmV3VXBsb2FkOiB0cnVlLCAvLyBjcmVhdGUgbmV3IHVwbG9hZCBldmVuIGlmIGFsbG93TmV3VXBsb2FkOiBmYWxzZVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuI3J1blVwbG9hZCh1cGxvYWRJRClcbiAgfVxuXG4gIGNhbmNlbEFsbCAoKSB7XG4gICAgdGhpcy5lbWl0KCdjYW5jZWwtYWxsJylcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgZmlsZUlEcyA9IE9iamVjdC5rZXlzKGZpbGVzKVxuICAgIGlmIChmaWxlSURzLmxlbmd0aCkge1xuICAgICAgdGhpcy5yZW1vdmVGaWxlcyhmaWxlSURzLCAnY2FuY2VsLWFsbCcpXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0b3RhbFByb2dyZXNzOiAwLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICByZWNvdmVyZWRTdGF0ZTogbnVsbCxcbiAgICB9KVxuICB9XG5cbiAgcmV0cnlVcGxvYWQgKGZpbGVJRCkge1xuICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGVJRCwge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgndXBsb2FkLXJldHJ5JywgZmlsZUlEKVxuXG4gICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQoW2ZpbGVJRF0sIHtcbiAgICAgIGZvcmNlQWxsb3dOZXdVcGxvYWQ6IHRydWUsIC8vIGNyZWF0ZSBuZXcgdXBsb2FkIGV2ZW4gaWYgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy4jcnVuVXBsb2FkKHVwbG9hZElEKVxuICB9XG5cbiAgcmVzZXQgKCkge1xuICAgIHRoaXMuY2FuY2VsQWxsKClcbiAgfVxuXG4gIGxvZ291dCAoKSB7XG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhwbHVnaW4gPT4ge1xuICAgICAgaWYgKHBsdWdpbi5wcm92aWRlciAmJiBwbHVnaW4ucHJvdmlkZXIubG9nb3V0KSB7XG4gICAgICAgIHBsdWdpbi5wcm92aWRlci5sb2dvdXQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjYWxjdWxhdGVQcm9ncmVzcyAoZmlsZSwgZGF0YSkge1xuICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gYnl0ZXNUb3RhbCBtYXkgYmUgbnVsbCBvciB6ZXJvOyBpbiB0aGF0IGNhc2Ugd2UgY2FuJ3QgZGl2aWRlIGJ5IGl0XG4gICAgY29uc3QgY2FuSGF2ZVBlcmNlbnRhZ2UgPSBOdW1iZXIuaXNGaW5pdGUoZGF0YS5ieXRlc1RvdGFsKSAmJiBkYXRhLmJ5dGVzVG90YWwgPiAwXG4gICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgLi4udGhpcy5nZXRGaWxlKGZpbGUuaWQpLnByb2dyZXNzLFxuICAgICAgICBieXRlc1VwbG9hZGVkOiBkYXRhLmJ5dGVzVXBsb2FkZWQsXG4gICAgICAgIGJ5dGVzVG90YWw6IGRhdGEuYnl0ZXNUb3RhbCxcbiAgICAgICAgcGVyY2VudGFnZTogY2FuSGF2ZVBlcmNlbnRhZ2VcbiAgICAgICAgICA/IE1hdGgucm91bmQoKGRhdGEuYnl0ZXNVcGxvYWRlZCAvIGRhdGEuYnl0ZXNUb3RhbCkgKiAxMDApXG4gICAgICAgICAgOiAwLFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgdGhpcy5jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MgKCkge1xuICAgIC8vIGNhbGN1bGF0ZSB0b3RhbCBwcm9ncmVzcywgdXNpbmcgdGhlIG51bWJlciBvZiBmaWxlcyBjdXJyZW50bHkgdXBsb2FkaW5nLFxuICAgIC8vIG11bHRpcGxpZWQgYnkgMTAwIGFuZCB0aGUgc3VtbSBvZiBpbmRpdmlkdWFsIHByb2dyZXNzIG9mIGVhY2ggZmlsZVxuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5nZXRGaWxlcygpXG5cbiAgICBjb25zdCBpblByb2dyZXNzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgICAgIHx8IGZpbGUucHJvZ3Jlc3MucHJlcHJvY2Vzc1xuICAgICAgICB8fCBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG4gICAgfSlcblxuICAgIGlmIChpblByb2dyZXNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5lbWl0KCdwcm9ncmVzcycsIDApXG4gICAgICB0aGlzLnNldFN0YXRlKHsgdG90YWxQcm9ncmVzczogMCB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgc2l6ZWRGaWxlcyA9IGluUHJvZ3Jlc3MuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLmJ5dGVzVG90YWwgIT0gbnVsbClcbiAgICBjb25zdCB1bnNpemVkRmlsZXMgPSBpblByb2dyZXNzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy5ieXRlc1RvdGFsID09IG51bGwpXG5cbiAgICBpZiAoc2l6ZWRGaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHByb2dyZXNzTWF4ID0gaW5Qcm9ncmVzcy5sZW5ndGggKiAxMDBcbiAgICAgIGNvbnN0IGN1cnJlbnRQcm9ncmVzcyA9IHVuc2l6ZWRGaWxlcy5yZWR1Y2UoKGFjYywgZmlsZSkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjICsgZmlsZS5wcm9ncmVzcy5wZXJjZW50YWdlXG4gICAgICB9LCAwKVxuICAgICAgY29uc3QgdG90YWxQcm9ncmVzcyA9IE1hdGgucm91bmQoKGN1cnJlbnRQcm9ncmVzcyAvIHByb2dyZXNzTWF4KSAqIDEwMClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0b3RhbFByb2dyZXNzIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgdG90YWxTaXplID0gc2l6ZWRGaWxlcy5yZWR1Y2UoKGFjYywgZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuIGFjYyArIGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbFxuICAgIH0sIDApXG4gICAgY29uc3QgYXZlcmFnZVNpemUgPSB0b3RhbFNpemUgLyBzaXplZEZpbGVzLmxlbmd0aFxuICAgIHRvdGFsU2l6ZSArPSBhdmVyYWdlU2l6ZSAqIHVuc2l6ZWRGaWxlcy5sZW5ndGhcblxuICAgIGxldCB1cGxvYWRlZFNpemUgPSAwXG4gICAgc2l6ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICB1cGxvYWRlZFNpemUgKz0gZmlsZS5wcm9ncmVzcy5ieXRlc1VwbG9hZGVkXG4gICAgfSlcbiAgICB1bnNpemVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgdXBsb2FkZWRTaXplICs9IChhdmVyYWdlU2l6ZSAqIChmaWxlLnByb2dyZXNzLnBlcmNlbnRhZ2UgfHwgMCkpIC8gMTAwXG4gICAgfSlcblxuICAgIGxldCB0b3RhbFByb2dyZXNzID0gdG90YWxTaXplID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogTWF0aC5yb3VuZCgodXBsb2FkZWRTaXplIC8gdG90YWxTaXplKSAqIDEwMClcblxuICAgIC8vIGhvdCBmaXgsIGJlY2F1c2U6XG4gICAgLy8gdXBsb2FkZWRTaXplIGVuZGVkIHVwIGxhcmdlciB0aGFuIHRvdGFsU2l6ZSwgcmVzdWx0aW5nIGluIDEzMjUlIHRvdGFsXG4gICAgaWYgKHRvdGFsUHJvZ3Jlc3MgPiAxMDApIHtcbiAgICAgIHRvdGFsUHJvZ3Jlc3MgPSAxMDBcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdG90YWxQcm9ncmVzcyB9KVxuICAgIHRoaXMuZW1pdCgncHJvZ3Jlc3MnLCB0b3RhbFByb2dyZXNzKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBsaXN0ZW5lcnMgZm9yIGFsbCBnbG9iYWwgYWN0aW9ucywgbGlrZTpcbiAgICogYGVycm9yYCwgYGZpbGUtcmVtb3ZlZGAsIGB1cGxvYWQtcHJvZ3Jlc3NgXG4gICAqL1xuICAjYWRkTGlzdGVuZXJzICgpIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbZmlsZV1cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW3Jlc3BvbnNlXVxuICAgICAqL1xuICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnJvciwgZmlsZSwgcmVzcG9uc2UpID0+IHtcbiAgICAgIGxldCBlcnJvck1zZyA9IGVycm9yLm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InXG4gICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICBlcnJvck1zZyArPSBgICR7ZXJyb3IuZGV0YWlsc31gXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogZXJyb3JNc2cgfSlcblxuICAgICAgaWYgKGZpbGUgIT0gbnVsbCAmJiBmaWxlLmlkIGluIHRoaXMuZ2V0U3RhdGUoKS5maWxlcykge1xuICAgICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgICAgZXJyb3I6IGVycm9yTXNnLFxuICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub24oJ2Vycm9yJywgZXJyb3JIYW5kbGVyKVxuXG4gICAgdGhpcy5vbigndXBsb2FkLWVycm9yJywgKGZpbGUsIGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgZXJyb3JIYW5kbGVyKGVycm9yLCBmaWxlLCByZXNwb25zZSlcblxuICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcgJiYgZXJyb3IubWVzc2FnZSkge1xuICAgICAgICBjb25zdCBuZXdFcnJvciA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKVxuICAgICAgICBuZXdFcnJvci5kZXRhaWxzID0gZXJyb3IubWVzc2FnZVxuICAgICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICAgIG5ld0Vycm9yLmRldGFpbHMgKz0gYCAke2Vycm9yLmRldGFpbHN9YFxuICAgICAgICB9XG4gICAgICAgIG5ld0Vycm9yLm1lc3NhZ2UgPSB0aGlzLmkxOG4oJ2ZhaWxlZFRvVXBsb2FkJywgeyBmaWxlOiBmaWxlLm5hbWUgfSlcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhuZXdFcnJvciwge1xuICAgICAgICAgIHRocm93RXJyOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3coZXJyb3IsIHtcbiAgICAgICAgICB0aHJvd0VycjogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub24oJ3VwbG9hZCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogbnVsbCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtc3RhcnRlZCcsIChmaWxlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICB1cGxvYWRTdGFydGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgICBwZXJjZW50YWdlOiAwLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICAgICAgYnl0ZXNUb3RhbDogZmlsZS5zaXplLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkLXByb2dyZXNzJywgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcylcblxuICAgIHRoaXMub24oJ3VwbG9hZC1zdWNjZXNzJywgKGZpbGUsIHVwbG9hZFJlc3ApID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50UHJvZ3Jlc3MgPSB0aGlzLmdldEZpbGUoZmlsZS5pZCkucHJvZ3Jlc3NcbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICAuLi5jdXJyZW50UHJvZ3Jlc3MsXG4gICAgICAgICAgcG9zdHByb2Nlc3M6IHRoaXMuI3Bvc3RQcm9jZXNzb3JzLnNpemUgPiAwID8ge1xuICAgICAgICAgICAgbW9kZTogJ2luZGV0ZXJtaW5hdGUnLFxuICAgICAgICAgIH0gOiBudWxsLFxuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiB0cnVlLFxuICAgICAgICAgIHBlcmNlbnRhZ2U6IDEwMCxcbiAgICAgICAgICBieXRlc1VwbG9hZGVkOiBjdXJyZW50UHJvZ3Jlc3MuYnl0ZXNUb3RhbCxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzcG9uc2U6IHVwbG9hZFJlc3AsXG4gICAgICAgIHVwbG9hZFVSTDogdXBsb2FkUmVzcC51cGxvYWRVUkwsXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlbW90ZSBwcm92aWRlcnMgc29tZXRpbWVzIGRvbid0IHRlbGwgdXMgdGhlIGZpbGUgc2l6ZSxcbiAgICAgIC8vIGJ1dCB3ZSBjYW4ga25vdyBob3cgbWFueSBieXRlcyB3ZSB1cGxvYWRlZCBvbmNlIHRoZSB1cGxvYWQgaXMgY29tcGxldGUuXG4gICAgICBpZiAoZmlsZS5zaXplID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICAgIHNpemU6IHVwbG9hZFJlc3AuYnl0ZXNVcGxvYWRlZCB8fCBjdXJyZW50UHJvZ3Jlc3MuYnl0ZXNUb3RhbCxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncHJlcHJvY2Vzcy1wcm9ncmVzcycsIChmaWxlLCBwcm9ncmVzcykgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgIHByb2dyZXNzOiB7IC4uLnRoaXMuZ2V0RmlsZShmaWxlLmlkKS5wcm9ncmVzcywgcHJlcHJvY2VzczogcHJvZ3Jlc3MgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMub24oJ3ByZXByb2Nlc3MtY29tcGxldGUnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICAgIGZpbGVzW2ZpbGUuaWRdID0geyAuLi5maWxlc1tmaWxlLmlkXSwgcHJvZ3Jlc3M6IHsgLi4uZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MgfSB9XG4gICAgICBkZWxldGUgZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MucHJlcHJvY2Vzc1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXMgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtcHJvZ3Jlc3MnLCAoZmlsZSwgcHJvZ3Jlc3MpID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICBwcm9ncmVzczogeyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MsIHBvc3Rwcm9jZXNzOiBwcm9ncmVzcyB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtY29tcGxldGUnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBmaWxlcyA9IHtcbiAgICAgICAgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzLFxuICAgICAgfVxuICAgICAgZmlsZXNbZmlsZS5pZF0gPSB7XG4gICAgICAgIC4uLmZpbGVzW2ZpbGUuaWRdLFxuICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgIC4uLmZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgZGVsZXRlIGZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlcyB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdyZXN0b3JlZCcsICgpID0+IHtcbiAgICAgIC8vIEZpbGVzIG1heSBoYXZlIGNoYW5nZWQtLWVuc3VyZSBwcm9ncmVzcyBpcyBzdGlsbCBhY2N1cmF0ZS5cbiAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWxQcm9ncmVzcygpXG4gICAgfSlcblxuICAgIC8vIHNob3cgaW5mb3JtZXIgaWYgb2ZmbGluZVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIHRoaXMuI3VwZGF0ZU9ubGluZVN0YXR1cylcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgdGhpcy4jdXBkYXRlT25saW5lU3RhdHVzKVxuICAgICAgc2V0VGltZW91dCh0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMsIDMwMDApXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlT25saW5lU3RhdHVzICgpIHtcbiAgICBjb25zdCBvbmxpbmVcbiAgICAgID0gdHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lXG4gICAgICAgIDogdHJ1ZVxuICAgIGlmICghb25saW5lKSB7XG4gICAgICB0aGlzLmVtaXQoJ2lzLW9mZmxpbmUnKVxuICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignbm9JbnRlcm5ldENvbm5lY3Rpb24nKSwgJ2Vycm9yJywgMClcbiAgICAgIHRoaXMud2FzT2ZmbGluZSA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KCdpcy1vbmxpbmUnKVxuICAgICAgaWYgKHRoaXMud2FzT2ZmbGluZSkge1xuICAgICAgICB0aGlzLmVtaXQoJ2JhY2stb25saW5lJylcbiAgICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignY29ubmVjdGVkVG9JbnRlcm5ldCcpLCAnc3VjY2VzcycsIDMwMDApXG4gICAgICAgIHRoaXMud2FzT2ZmbGluZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgI3VwZGF0ZU9ubGluZVN0YXR1cyA9IHRoaXMudXBkYXRlT25saW5lU3RhdHVzLmJpbmQodGhpcylcblxuICBnZXRJRCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0cy5pZFxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIHBsdWdpbiB3aXRoIENvcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBQbHVnaW4gb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0c10gb2JqZWN0IHdpdGggb3B0aW9ucyB0byBiZSBwYXNzZWQgdG8gUGx1Z2luXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IHNlbGYgZm9yIGNoYWluaW5nXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gIHVzZSAoUGx1Z2luLCBvcHRzKSB7XG4gICAgaWYgKHR5cGVvZiBQbHVnaW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGBFeHBlY3RlZCBhIHBsdWdpbiBjbGFzcywgYnV0IGdvdCAke1BsdWdpbiA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiBQbHVnaW59LmBcbiAgICAgICAgKyAnIFBsZWFzZSB2ZXJpZnkgdGhhdCB0aGUgcGx1Z2luIHdhcyBpbXBvcnRlZCBhbmQgc3BlbGxlZCBjb3JyZWN0bHkuJ1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgLy8gSW5zdGFudGlhdGVcbiAgICBjb25zdCBwbHVnaW4gPSBuZXcgUGx1Z2luKHRoaXMsIG9wdHMpXG4gICAgY29uc3QgcGx1Z2luSWQgPSBwbHVnaW4uaWRcblxuICAgIGlmICghcGx1Z2luSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBwbHVnaW4gbXVzdCBoYXZlIGFuIGlkJylcbiAgICB9XG5cbiAgICBpZiAoIXBsdWdpbi50eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgcGx1Z2luIG11c3QgaGF2ZSBhIHR5cGUnKVxuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0c1BsdWdpbkFscmVhZHkgPSB0aGlzLmdldFBsdWdpbihwbHVnaW5JZClcbiAgICBpZiAoZXhpc3RzUGx1Z2luQWxyZWFkeSkge1xuICAgICAgY29uc3QgbXNnID0gYEFscmVhZHkgZm91bmQgYSBwbHVnaW4gbmFtZWQgJyR7ZXhpc3RzUGx1Z2luQWxyZWFkeS5pZH0nLiBgXG4gICAgICAgICsgYFRyaWVkIHRvIHVzZTogJyR7cGx1Z2luSWR9Jy5cXG5gXG4gICAgICAgICsgJ1VwcHkgcGx1Z2lucyBtdXN0IGhhdmUgdW5pcXVlIGBpZGAgb3B0aW9ucy4gU2VlIGh0dHBzOi8vdXBweS5pby9kb2NzL3BsdWdpbnMvI2lkLidcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgaWYgKFBsdWdpbi5WRVJTSU9OKSB7XG4gICAgICB0aGlzLmxvZyhgVXNpbmcgJHtwbHVnaW5JZH0gdiR7UGx1Z2luLlZFUlNJT059YClcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnR5cGUgaW4gdGhpcy4jcGx1Z2lucykge1xuICAgICAgdGhpcy4jcGx1Z2luc1twbHVnaW4udHlwZV0ucHVzaChwbHVnaW4pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI3BsdWdpbnNbcGx1Z2luLnR5cGVdID0gW3BsdWdpbl1cbiAgICB9XG4gICAgcGx1Z2luLmluc3RhbGwoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIG9uZSBQbHVnaW4gYnkgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIHBsdWdpbiBpZFxuICAgKiBAcmV0dXJucyB7QmFzZVBsdWdpbnx1bmRlZmluZWR9XG4gICAqL1xuICBnZXRQbHVnaW4gKGlkKSB7XG4gICAgZm9yIChjb25zdCBwbHVnaW5zIG9mIE9iamVjdC52YWx1ZXModGhpcy4jcGx1Z2lucykpIHtcbiAgICAgIGNvbnN0IGZvdW5kUGx1Z2luID0gcGx1Z2lucy5maW5kKHBsdWdpbiA9PiBwbHVnaW4uaWQgPT09IGlkKVxuICAgICAgaWYgKGZvdW5kUGx1Z2luICE9IG51bGwpIHJldHVybiBmb3VuZFBsdWdpblxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICBbU3ltYm9sLmZvcigndXBweSB0ZXN0OiBnZXRQbHVnaW5zJyldICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuI3BsdWdpbnNbdHlwZV1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggYWxsIGB1c2VgZCBwbHVnaW5zLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCB3aWxsIGJlIHJ1biBvbiBlYWNoIHBsdWdpblxuICAgKi9cbiAgaXRlcmF0ZVBsdWdpbnMgKG1ldGhvZCkge1xuICAgIE9iamVjdC52YWx1ZXModGhpcy4jcGx1Z2lucykuZmxhdCgxKS5mb3JFYWNoKG1ldGhvZClcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYW5kIHJlbW92ZSBhIHBsdWdpbi5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGluc3RhbmNlIFRoZSBwbHVnaW4gaW5zdGFuY2UgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGx1Z2luIChpbnN0YW5jZSkge1xuICAgIHRoaXMubG9nKGBSZW1vdmluZyBwbHVnaW4gJHtpbnN0YW5jZS5pZH1gKVxuICAgIHRoaXMuZW1pdCgncGx1Z2luLXJlbW92ZScsIGluc3RhbmNlKVxuXG4gICAgaWYgKGluc3RhbmNlLnVuaW5zdGFsbCkge1xuICAgICAgaW5zdGFuY2UudW5pbnN0YWxsKClcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy4jcGx1Z2luc1tpbnN0YW5jZS50eXBlXVxuICAgIC8vIGxpc3QuaW5kZXhPZiBmYWlsZWQgaGVyZSwgYmVjYXVzZSBWdWUzIGNvbnZlcnRlZCB0aGUgcGx1Z2luIGluc3RhbmNlXG4gICAgLy8gdG8gYSBQcm94eSBvYmplY3QsIHdoaWNoIGZhaWxlZCB0aGUgc3RyaWN0IGNvbXBhcmlzb24gdGVzdDpcbiAgICAvLyBvYmogIT09IG9ialByb3h5XG4gICAgY29uc3QgaW5kZXggPSBsaXN0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGluc3RhbmNlLmlkKVxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgdXBkYXRlZFN0YXRlID0ge1xuICAgICAgcGx1Z2luczoge1xuICAgICAgICAuLi5zdGF0ZS5wbHVnaW5zLFxuICAgICAgICBbaW5zdGFuY2UuaWRdOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHVwZGF0ZWRTdGF0ZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYWxsIHBsdWdpbnMgYW5kIGNsb3NlIGRvd24gdGhpcyBVcHB5IGluc3RhbmNlLlxuICAgKi9cbiAgY2xvc2UgKCkge1xuICAgIHRoaXMubG9nKGBDbG9zaW5nIFVwcHkgaW5zdGFuY2UgJHt0aGlzLm9wdHMuaWR9OiByZW1vdmluZyBhbGwgZmlsZXMgYW5kIHVuaW5zdGFsbGluZyBwbHVnaW5zYClcblxuICAgIHRoaXMucmVzZXQoKVxuXG4gICAgdGhpcy4jc3RvcmVVbnN1YnNjcmliZSgpXG5cbiAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKChwbHVnaW4pID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlUGx1Z2luKHBsdWdpbilcbiAgICB9KVxuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy4jdXBkYXRlT25saW5lU3RhdHVzKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCB0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMpXG4gICAgfVxuICB9XG5cbiAgaGlkZUluZm8gKCkge1xuICAgIGNvbnN0IHsgaW5mbyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICB0aGlzLnNldFN0YXRlKHsgaW5mbzogaW5mby5zbGljZSgxKSB9KVxuXG4gICAgdGhpcy5lbWl0KCdpbmZvLWhpZGRlbicpXG4gIH1cblxuICAvKipcbiAgICogU2V0IGluZm8gbWVzc2FnZSBpbiBgc3RhdGUuaW5mb2AsIHNvIHRoYXQgVUkgcGx1Z2lucyBsaWtlIGBJbmZvcm1lcmBcbiAgICogY2FuIGRpc3BsYXkgdGhlIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgb2JqZWN0fSBtZXNzYWdlIE1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIGJ5IHRoZSBpbmZvcm1lclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb25dXG4gICAqL1xuICBpbmZvIChtZXNzYWdlLCB0eXBlID0gJ2luZm8nLCBkdXJhdGlvbiA9IDMwMDApIHtcbiAgICBjb25zdCBpc0NvbXBsZXhNZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGluZm86IFtcbiAgICAgICAgLi4udGhpcy5nZXRTdGF0ZSgpLmluZm8sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIG1lc3NhZ2U6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLm1lc3NhZ2UgOiBtZXNzYWdlLFxuICAgICAgICAgIGRldGFpbHM6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLmRldGFpbHMgOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZGVJbmZvKCksIGR1cmF0aW9uKVxuXG4gICAgdGhpcy5lbWl0KCdpbmZvLXZpc2libGUnKVxuICB9XG5cbiAgLyoqXG4gICAqIFBhc3NlcyBtZXNzYWdlcyB0byBhIGZ1bmN0aW9uLCBwcm92aWRlZCBpbiBgb3B0cy5sb2dnZXJgLlxuICAgKiBJZiBgb3B0cy5sb2dnZXI6IFVwcHkuZGVidWdMb2dnZXJgIG9yIGBvcHRzLmRlYnVnOiB0cnVlYCwgbG9ncyB0byB0aGUgYnJvd3NlciBjb25zb2xlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG1lc3NhZ2UgdG8gbG9nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gb3B0aW9uYWwgYGVycm9yYCBvciBgd2FybmluZ2BcbiAgICovXG4gIGxvZyAobWVzc2FnZSwgdHlwZSkge1xuICAgIGNvbnN0IHsgbG9nZ2VyIH0gPSB0aGlzLm9wdHNcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2Vycm9yJzogbG9nZ2VyLmVycm9yKG1lc3NhZ2UpOyBicmVha1xuICAgICAgY2FzZSAnd2FybmluZyc6IGxvZ2dlci53YXJuKG1lc3NhZ2UpOyBicmVha1xuICAgICAgZGVmYXVsdDogbG9nZ2VyLmRlYnVnKG1lc3NhZ2UpOyBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlIGFuIHVwbG9hZCBieSBpdHMgSUQuXG4gICAqL1xuICByZXN0b3JlICh1cGxvYWRJRCkge1xuICAgIHRoaXMubG9nKGBDb3JlOiBhdHRlbXB0aW5nIHRvIHJlc3RvcmUgdXBsb2FkIFwiJHt1cGxvYWRJRH1cImApXG5cbiAgICBpZiAoIXRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0pIHtcbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vbmV4aXN0ZW50IHVwbG9hZCcpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNydW5VcGxvYWQodXBsb2FkSUQpXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHVwbG9hZCBmb3IgYSBidW5jaCBvZiBmaWxlcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBmaWxlSURzIEZpbGUgSURzIHRvIGluY2x1ZGUgaW4gdGhpcyB1cGxvYWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IElEIG9mIHRoaXMgdXBsb2FkLlxuICAgKi9cbiAgI2NyZWF0ZVVwbG9hZCAoZmlsZUlEcywgb3B0cyA9IHt9KSB7XG4gICAgLy8gdXBweS5yZXRyeUFsbCBzZXRzIHRoaXMgdG8gdHJ1ZSDigJQgd2hlbiByZXRyeWluZyB3ZSB3YW50IHRvIGlnbm9yZSBgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlYFxuICAgIGNvbnN0IHsgZm9yY2VBbGxvd05ld1VwbG9hZCA9IGZhbHNlIH0gPSBvcHRzXG5cbiAgICBjb25zdCB7IGFsbG93TmV3VXBsb2FkLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgaWYgKCFhbGxvd05ld1VwbG9hZCAmJiAhZm9yY2VBbGxvd05ld1VwbG9hZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHVwbG9hZDogYWxyZWFkeSB1cGxvYWRpbmcuJylcbiAgICB9XG5cbiAgICBjb25zdCB1cGxvYWRJRCA9IG5hbm9pZCgpXG5cbiAgICB0aGlzLmVtaXQoJ3VwbG9hZCcsIHtcbiAgICAgIGlkOiB1cGxvYWRJRCxcbiAgICAgIGZpbGVJRHMsXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYWxsb3dOZXdVcGxvYWQ6IHRoaXMub3B0cy5hbGxvd011bHRpcGxlVXBsb2FkQmF0Y2hlcyAhPT0gZmFsc2UgJiYgdGhpcy5vcHRzLmFsbG93TXVsdGlwbGVVcGxvYWRzICE9PSBmYWxzZSxcblxuICAgICAgY3VycmVudFVwbG9hZHM6IHtcbiAgICAgICAgLi4uY3VycmVudFVwbG9hZHMsXG4gICAgICAgIFt1cGxvYWRJRF06IHtcbiAgICAgICAgICBmaWxlSURzLFxuICAgICAgICAgIHN0ZXA6IDAsXG4gICAgICAgICAgcmVzdWx0OiB7fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHJldHVybiB1cGxvYWRJRFxuICB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogY3JlYXRlVXBsb2FkJyldICguLi5hcmdzKSB7IHJldHVybiB0aGlzLiNjcmVhdGVVcGxvYWQoLi4uYXJncykgfVxuXG4gICNnZXRVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICByZXR1cm4gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdXG4gIH1cblxuICAvKipcbiAgICogQWRkIGRhdGEgdG8gYW4gdXBsb2FkJ3MgcmVzdWx0IG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElEIFRoZSBJRCBvZiB0aGUgdXBsb2FkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBEYXRhIHByb3BlcnRpZXMgdG8gYWRkIHRvIHRoZSByZXN1bHQgb2JqZWN0LlxuICAgKi9cbiAgYWRkUmVzdWx0RGF0YSAodXBsb2FkSUQsIGRhdGEpIHtcbiAgICBpZiAoIXRoaXMuI2dldFVwbG9hZCh1cGxvYWRJRCkpIHtcbiAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7dXBsb2FkSUR9YClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICBjb25zdCBjdXJyZW50VXBsb2FkID0geyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sIHJlc3VsdDogeyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0ucmVzdWx0LCAuLi5kYXRhIH0gfVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVwbG9hZHM6IHsgLi4uY3VycmVudFVwbG9hZHMsIFt1cGxvYWRJRF06IGN1cnJlbnRVcGxvYWQgfSxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiB1cGxvYWQsIGVnLiBpZiBpdCBoYXMgYmVlbiBjYW5jZWxlZCBvciBjb21wbGV0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJRCBUaGUgSUQgb2YgdGhlIHVwbG9hZC5cbiAgICovXG4gICNyZW1vdmVVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgY3VycmVudFVwbG9hZHMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2FkcyB9XG4gICAgZGVsZXRlIGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50VXBsb2FkcyxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1biBhbiB1cGxvYWQuIFRoaXMgcGlja3MgdXAgd2hlcmUgaXQgbGVmdCBvZmYgaW4gY2FzZSB0aGUgdXBsb2FkIGlzIGJlaW5nIHJlc3RvcmVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgI3J1blVwbG9hZCAodXBsb2FkSUQpIHtcbiAgICBsZXQgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgbGV0IGN1cnJlbnRVcGxvYWQgPSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cbiAgICBjb25zdCByZXN0b3JlU3RlcCA9IGN1cnJlbnRVcGxvYWQuc3RlcCB8fCAwXG5cbiAgICBjb25zdCBzdGVwcyA9IFtcbiAgICAgIC4uLnRoaXMuI3ByZVByb2Nlc3NvcnMsXG4gICAgICAuLi50aGlzLiN1cGxvYWRlcnMsXG4gICAgICAuLi50aGlzLiNwb3N0UHJvY2Vzc29ycyxcbiAgICBdXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobGV0IHN0ZXAgPSByZXN0b3JlU3RlcDsgc3RlcCA8IHN0ZXBzLmxlbmd0aDsgc3RlcCsrKSB7XG4gICAgICAgIGlmICghY3VycmVudFVwbG9hZCkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZm4gPSBzdGVwc1tzdGVwXVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRVcGxvYWQgPSB7XG4gICAgICAgICAgLi4uY3VycmVudFVwbG9hZCxcbiAgICAgICAgICBzdGVwLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY3VycmVudFVwbG9hZHM6IHtcbiAgICAgICAgICAgIC4uLmN1cnJlbnRVcGxvYWRzLFxuICAgICAgICAgICAgW3VwbG9hZElEXTogdXBkYXRlZFVwbG9hZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFRPRE8gZ2l2ZSB0aGlzIHRoZSBgdXBkYXRlZFVwbG9hZGAgb2JqZWN0IGFzIGl0cyBvbmx5IHBhcmFtZXRlciBtYXliZT9cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdoZW4gbW9yZSBtZXRhZGF0YSBtYXkgYmUgYWRkZWQgdG8gdGhlIHVwbG9hZCB0aGlzIHdvdWxkIGtlZXAgZ2V0dGluZyBtb3JlIHBhcmFtZXRlcnNcbiAgICAgICAgYXdhaXQgZm4odXBkYXRlZFVwbG9hZC5maWxlSURzLCB1cGxvYWRJRClcblxuICAgICAgICAvLyBVcGRhdGUgY3VycmVudFVwbG9hZCB2YWx1ZSBpbiBjYXNlIGl0IHdhcyBtb2RpZmllZCBhc3luY2hyb25vdXNseS5cbiAgICAgICAgY3VycmVudFVwbG9hZHMgPSB0aGlzLmdldFN0YXRlKCkuY3VycmVudFVwbG9hZHNcbiAgICAgICAgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICAgIHRocm93IGVyclxuICAgIH1cblxuICAgIC8vIFNldCByZXN1bHQgZGF0YS5cbiAgICBpZiAoY3VycmVudFVwbG9hZCkge1xuICAgICAgLy8gTWFyayBwb3N0cHJvY2Vzc2luZyBzdGVwIGFzIGNvbXBsZXRlIGlmIG5lY2Vzc2FyeTsgdGhpcyBhZGRyZXNzZXMgYSBjYXNlIHdoZXJlIHdlIG1pZ2h0IGdldFxuICAgICAgLy8gc3R1Y2sgaW4gdGhlIHBvc3Rwcm9jZXNzaW5nIFVJIHdoaWxlIHRoZSB1cGxvYWQgaXMgZnVsbHkgY29tcGxldGUuXG4gICAgICAvLyBJZiB0aGUgcG9zdHByb2Nlc3Npbmcgc3RlcHMgZG8gbm90IGRvIGFueSB3b3JrLCB0aGV5IG1heSBub3QgZW1pdCBwb3N0cHJvY2Vzc2luZyBldmVudHMgYXRcbiAgICAgIC8vIGFsbCwgYW5kIG5ldmVyIG1hcmsgdGhlIHBvc3Rwcm9jZXNzaW5nIGFzIGNvbXBsZXRlLiBUaGlzIGlzIGZpbmUgb24gaXRzIG93biBidXQgd2VcbiAgICAgIC8vIGludHJvZHVjZWQgY29kZSBpbiB0aGUgQHVwcHkvY29yZSB1cGxvYWQtc3VjY2VzcyBoYW5kbGVyIHRvIHByZXBhcmUgcG9zdHByb2Nlc3NpbmcgcHJvZ3Jlc3NcbiAgICAgIC8vIHN0YXRlIGlmIGFueSBwb3N0cHJvY2Vzc29ycyBhcmUgcmVnaXN0ZXJlZC4gVGhhdCBpcyB0byBhdm9pZCBhIFwiZmxhc2ggb2YgY29tcGxldGVkIHN0YXRlXCJcbiAgICAgIC8vIGJlZm9yZSB0aGUgcG9zdHByb2Nlc3NpbmcgcGx1Z2lucyBjYW4gZW1pdCBldmVudHMuXG4gICAgICAvL1xuICAgICAgLy8gU28sIGp1c3QgaW4gY2FzZSBhbiB1cGxvYWQgd2l0aCBwb3N0cHJvY2Vzc2luZyBwbHVnaW5zICpoYXMqIGNvbXBsZXRlZCAqd2l0aG91dCogZW1pdHRpbmdcbiAgICAgIC8vIHBvc3Rwcm9jZXNzaW5nIGNvbXBsZXRpb24sIHdlIGRvIGl0IGluc3RlYWQuXG4gICAgICBjdXJyZW50VXBsb2FkLmZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmdldEZpbGUoZmlsZUlEKVxuICAgICAgICBpZiAoZmlsZSAmJiBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwb3N0cHJvY2Vzcy1jb21wbGV0ZScsIGZpbGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGZpbGVzID0gY3VycmVudFVwbG9hZC5maWxlSURzLm1hcCgoZmlsZUlEKSA9PiB0aGlzLmdldEZpbGUoZmlsZUlEKSlcbiAgICAgIGNvbnN0IHN1Y2Nlc3NmdWwgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLmVycm9yKVxuICAgICAgY29uc3QgZmFpbGVkID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmVycm9yKVxuICAgICAgYXdhaXQgdGhpcy5hZGRSZXN1bHREYXRhKHVwbG9hZElELCB7IHN1Y2Nlc3NmdWwsIGZhaWxlZCwgdXBsb2FkSUQgfSlcblxuICAgICAgLy8gVXBkYXRlIGN1cnJlbnRVcGxvYWQgdmFsdWUgaW4gY2FzZSBpdCB3YXMgbW9kaWZpZWQgYXN5bmNocm9ub3VzbHkuXG4gICAgICBjdXJyZW50VXBsb2FkcyA9IHRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1xuICAgICAgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgIH1cbiAgICAvLyBFbWl0IGNvbXBsZXRpb24gZXZlbnRzLlxuICAgIC8vIFRoaXMgaXMgaW4gYSBzZXBhcmF0ZSBmdW5jdGlvbiBzbyB0aGF0IHRoZSBgY3VycmVudFVwbG9hZHNgIHZhcmlhYmxlXG4gICAgLy8gYWx3YXlzIHJlZmVycyB0byB0aGUgbGF0ZXN0IHN0YXRlLiBJbiB0aGUgaGFuZGxlciByaWdodCBhYm92ZSBpdCByZWZlcnNcbiAgICAvLyB0byBhbiBvdXRkYXRlZCBvYmplY3Qgd2l0aG91dCB0aGUgYC5yZXN1bHRgIHByb3BlcnR5LlxuICAgIGxldCByZXN1bHRcbiAgICBpZiAoY3VycmVudFVwbG9hZCkge1xuICAgICAgcmVzdWx0ID0gY3VycmVudFVwbG9hZC5yZXN1bHRcbiAgICAgIHRoaXMuZW1pdCgnY29tcGxldGUnLCByZXN1bHQpXG5cbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcmVzdWx0IGZvciBhbiB1cGxvYWQgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke3VwbG9hZElEfWApXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhbiB1cGxvYWQgZm9yIGFsbCB0aGUgZmlsZXMgdGhhdCBhcmUgbm90IGN1cnJlbnRseSBiZWluZyB1cGxvYWRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICB1cGxvYWQgKCkge1xuICAgIGlmICghdGhpcy4jcGx1Z2lucy51cGxvYWRlcj8ubGVuZ3RoKSB7XG4gICAgICB0aGlzLmxvZygnTm8gdXBsb2FkZXIgdHlwZSBwbHVnaW5zIGFyZSB1c2VkJywgJ3dhcm5pbmcnKVxuICAgIH1cblxuICAgIGxldCB7IGZpbGVzIH0gPSB0aGlzLmdldFN0YXRlKClcblxuICAgIGNvbnN0IG9uQmVmb3JlVXBsb2FkUmVzdWx0ID0gdGhpcy5vcHRzLm9uQmVmb3JlVXBsb2FkKGZpbGVzKVxuXG4gICAgaWYgKG9uQmVmb3JlVXBsb2FkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm90IHN0YXJ0aW5nIHRoZSB1cGxvYWQgYmVjYXVzZSBvbkJlZm9yZVVwbG9hZCByZXR1cm5lZCBmYWxzZScpKVxuICAgIH1cblxuICAgIGlmIChvbkJlZm9yZVVwbG9hZFJlc3VsdCAmJiB0eXBlb2Ygb25CZWZvcmVVcGxvYWRSZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBmaWxlcyA9IG9uQmVmb3JlVXBsb2FkUmVzdWx0XG4gICAgICAvLyBVcGRhdGluZyBmaWxlcyBpbiBzdGF0ZSwgYmVjYXVzZSB1cGxvYWRlciBwbHVnaW5zIHJlY2VpdmUgZmlsZSBJRHMsXG4gICAgICAvLyBhbmQgdGhlbiBmZXRjaCB0aGUgYWN0dWFsIGZpbGUgb2JqZWN0IGZyb20gc3RhdGVcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmaWxlcyxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuI2NoZWNrTWluTnVtYmVyT2ZGaWxlcyhmaWxlcylcbiAgICAgICAgdGhpcy4jY2hlY2tSZXF1aXJlZE1ldGFGaWVsZHMoZmlsZXMpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICAgICAgLy8gZ2V0IGEgbGlzdCBvZiBmaWxlcyB0aGF0IGFyZSBjdXJyZW50bHkgYXNzaWduZWQgdG8gdXBsb2Fkc1xuICAgICAgICBjb25zdCBjdXJyZW50bHlVcGxvYWRpbmdGaWxlcyA9IE9iamVjdC52YWx1ZXMoY3VycmVudFVwbG9hZHMpLmZsYXRNYXAoY3VyciA9PiBjdXJyLmZpbGVJRHMpXG5cbiAgICAgICAgY29uc3Qgd2FpdGluZ0ZpbGVJRHMgPSBbXVxuICAgICAgICBPYmplY3Qua2V5cyhmaWxlcykuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpXG4gICAgICAgICAgLy8gaWYgdGhlIGZpbGUgaGFzbid0IHN0YXJ0ZWQgdXBsb2FkaW5nIGFuZCBoYXNuJ3QgYWxyZWFkeSBiZWVuIGFzc2lnbmVkIHRvIGFuIHVwbG9hZC4uXG4gICAgICAgICAgaWYgKCghZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkKSAmJiAoY3VycmVudGx5VXBsb2FkaW5nRmlsZXMuaW5kZXhPZihmaWxlSUQpID09PSAtMSkpIHtcbiAgICAgICAgICAgIHdhaXRpbmdGaWxlSURzLnB1c2goZmlsZS5pZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQod2FpdGluZ0ZpbGVJRHMpXG4gICAgICAgIHJldHVybiB0aGlzLiNydW5VcGxvYWQodXBsb2FkSUQpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHtcbiAgICAgICAgICBzaG93SW5mb3JtZXI6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwcHlcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWUgKGZpbGVUeXBlLCBmaWxlRGVzY3JpcHRvcikge1xuICBpZiAoZmlsZURlc2NyaXB0b3IubmFtZSkge1xuICAgIHJldHVybiBmaWxlRGVzY3JpcHRvci5uYW1lXG4gIH1cblxuICBpZiAoZmlsZVR5cGUuc3BsaXQoJy8nKVswXSA9PT0gJ2ltYWdlJykge1xuICAgIHJldHVybiBgJHtmaWxlVHlwZS5zcGxpdCgnLycpWzBdfS4ke2ZpbGVUeXBlLnNwbGl0KCcvJylbMV19YFxuICB9XG5cbiAgcmV0dXJuICdub25hbWUnXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgVXBweSA9IHJlcXVpcmUoJy4vVXBweScpXG5jb25zdCBVSVBsdWdpbiA9IHJlcXVpcmUoJy4vVUlQbHVnaW4nKVxuY29uc3QgQmFzZVBsdWdpbiA9IHJlcXVpcmUoJy4vQmFzZVBsdWdpbicpXG5jb25zdCB7IGRlYnVnTG9nZ2VyIH0gPSByZXF1aXJlKCcuL2xvZ2dlcnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwcHlcbm1vZHVsZS5leHBvcnRzLlVwcHkgPSBVcHB5XG5tb2R1bGUuZXhwb3J0cy5VSVBsdWdpbiA9IFVJUGx1Z2luXG5tb2R1bGUuZXhwb3J0cy5CYXNlUGx1Z2luID0gQmFzZVBsdWdpblxubW9kdWxlLmV4cG9ydHMuZGVidWdMb2dnZXIgPSBkZWJ1Z0xvZ2dlclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuY29uc3QgZ2V0VGltZVN0YW1wID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2dldFRpbWVTdGFtcCcpXG5cbi8vIFN3YWxsb3cgYWxsIGxvZ3MsIGV4Y2VwdCBlcnJvcnMuXG4vLyBkZWZhdWx0IGlmIGxvZ2dlciBpcyBub3Qgc2V0IG9yIGRlYnVnOiBmYWxzZVxuY29uc3QganVzdEVycm9yc0xvZ2dlciA9IHtcbiAgZGVidWc6ICgpID0+IHt9LFxuICB3YXJuOiAoKSA9PiB7fSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBjb25zb2xlLmVycm9yKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxufVxuXG4vLyBQcmludCBsb2dzIHRvIGNvbnNvbGUgd2l0aCBuYW1lc3BhY2UgKyB0aW1lc3RhbXAsXG4vLyBzZXQgYnkgbG9nZ2VyOiBVcHB5LmRlYnVnTG9nZ2VyIG9yIGRlYnVnOiB0cnVlXG5jb25zdCBkZWJ1Z0xvZ2dlciA9IHtcbiAgZGVidWc6ICguLi5hcmdzKSA9PiBjb25zb2xlLmRlYnVnKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxuICB3YXJuOiAoLi4uYXJncykgPT4gY29uc29sZS53YXJuKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IGNvbnNvbGUuZXJyb3IoYFtVcHB5XSBbJHtnZXRUaW1lU3RhbXAoKX1dYCwgLi4uYXJncyksXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBqdXN0RXJyb3JzTG9nZ2VyLFxuICBkZWJ1Z0xvZ2dlcixcbn1cbiIsIi8vIEVkZ2UgMTUueCBkb2VzIG5vdCBmaXJlICdwcm9ncmVzcycgZXZlbnRzIG9uIHVwbG9hZHMuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkvaXNzdWVzLzk0NVxuLy8gQW5kIGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEyMjI0NTEwL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdXBwb3J0c1VwbG9hZFByb2dyZXNzICh1c2VyQWdlbnQpIHtcbiAgLy8gQWxsb3cgcGFzc2luZyBpbiB1c2VyQWdlbnQgZm9yIHRlc3RzXG4gIGlmICh1c2VyQWdlbnQgPT0gbnVsbCkge1xuICAgIHVzZXJBZ2VudCA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnID8gbmF2aWdhdG9yLnVzZXJBZ2VudCA6IG51bGxcbiAgfVxuICAvLyBBc3N1bWUgaXQgd29ya3MgYmVjYXVzZSBiYXNpY2FsbHkgZXZlcnl0aGluZyBzdXBwb3J0cyBwcm9ncmVzcyBldmVudHMuXG4gIGlmICghdXNlckFnZW50KSByZXR1cm4gdHJ1ZVxuXG4gIGNvbnN0IG0gPSAvRWRnZVxcLyhcXGQrXFwuXFxkKykvLmV4ZWModXNlckFnZW50KVxuICBpZiAoIW0pIHJldHVybiB0cnVlXG5cbiAgY29uc3QgZWRnZVZlcnNpb24gPSBtWzFdXG4gIGxldCBbbWFqb3IsIG1pbm9yXSA9IGVkZ2VWZXJzaW9uLnNwbGl0KCcuJylcbiAgbWFqb3IgPSBwYXJzZUludChtYWpvciwgMTApXG4gIG1pbm9yID0gcGFyc2VJbnQobWlub3IsIDEwKVxuXG4gIC8vIFdvcmtlZCBiZWZvcmU6XG4gIC8vIEVkZ2UgNDAuMTUwNjMuMC4wXG4gIC8vIE1pY3Jvc29mdCBFZGdlSFRNTCAxNS4xNTA2M1xuICBpZiAobWFqb3IgPCAxNSB8fCAobWFqb3IgPT09IDE1ICYmIG1pbm9yIDwgMTUwNjMpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8vIEZpeGVkIGluOlxuICAvLyBNaWNyb3NvZnQgRWRnZUhUTUwgMTguMTgyMThcbiAgaWYgKG1ham9yID4gMTggfHwgKG1ham9yID09PSAxOCAmJiBtaW5vciA+PSAxODIxOCkpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLy8gb3RoZXIgdmVyc2lvbnMgZG9uJ3Qgd29yay5cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCJjb25zdCB7IFVJUGx1Z2luIH0gPSByZXF1aXJlKCdAdXBweS9jb3JlJylcbmNvbnN0IHRvQXJyYXkgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvdG9BcnJheScpXG5jb25zdCBpc0RyYWdEcm9wU3VwcG9ydGVkID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2lzRHJhZ0Ryb3BTdXBwb3J0ZWQnKVxuY29uc3QgZ2V0RHJvcHBlZEZpbGVzID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2dldERyb3BwZWRGaWxlcycpXG5jb25zdCB7IGggfSA9IHJlcXVpcmUoJ3ByZWFjdCcpXG5cbi8qKlxuICogRHJhZyAmIERyb3AgcGx1Z2luXG4gKlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIERyYWdEcm9wIGV4dGVuZHMgVUlQbHVnaW4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMudHlwZSA9ICdhY3F1aXJlcidcbiAgICB0aGlzLmlkID0gdGhpcy5vcHRzLmlkIHx8ICdEcmFnRHJvcCdcbiAgICB0aGlzLnRpdGxlID0gJ0RyYWcgJiBEcm9wJ1xuXG4gICAgdGhpcy5kZWZhdWx0TG9jYWxlID0ge1xuICAgICAgc3RyaW5nczoge1xuICAgICAgICBkcm9wSGVyZU9yOiAnRHJvcCBmaWxlcyBoZXJlIG9yICV7YnJvd3NlfScsXG4gICAgICAgIGJyb3dzZTogJ2Jyb3dzZScsXG4gICAgICB9LFxuICAgIH1cblxuICAgIC8vIERlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRzID0ge1xuICAgICAgdGFyZ2V0OiBudWxsLFxuICAgICAgaW5wdXROYW1lOiAnZmlsZXNbXScsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICBub3RlOiBudWxsLFxuICAgIH1cblxuICAgIC8vIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBvbmVzIHNldCBieSB1c2VyXG4gICAgdGhpcy5vcHRzID0geyAuLi5kZWZhdWx0T3B0cywgLi4ub3B0cyB9XG5cbiAgICB0aGlzLmkxOG5Jbml0KClcblxuICAgIC8vIENoZWNrIGZvciBicm93c2VyIGRyYWdEcm9wIHN1cHBvcnRcbiAgICB0aGlzLmlzRHJhZ0Ryb3BTdXBwb3J0ZWQgPSBpc0RyYWdEcm9wU3VwcG9ydGVkKClcbiAgICB0aGlzLnJlbW92ZURyYWdPdmVyQ2xhc3NUaW1lb3V0ID0gbnVsbFxuXG4gICAgLy8gQmluZCBgdGhpc2AgdG8gY2xhc3MgbWV0aG9kc1xuICAgIHRoaXMub25JbnB1dENoYW5nZSA9IHRoaXMub25JbnB1dENoYW5nZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVEcmFnT3ZlciA9IHRoaXMuaGFuZGxlRHJhZ092ZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRHJhZ0xlYXZlID0gdGhpcy5oYW5kbGVEcmFnTGVhdmUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRHJvcCA9IHRoaXMuaGFuZGxlRHJvcC5iaW5kKHRoaXMpXG4gICAgdGhpcy5hZGRGaWxlcyA9IHRoaXMuYWRkRmlsZXMuYmluZCh0aGlzKVxuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKVxuICB9XG5cbiAgYWRkRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBmaWxlcy5tYXAoKGZpbGUpID0+ICh7XG4gICAgICBzb3VyY2U6IHRoaXMuaWQsXG4gICAgICBuYW1lOiBmaWxlLm5hbWUsXG4gICAgICB0eXBlOiBmaWxlLnR5cGUsXG4gICAgICBkYXRhOiBmaWxlLFxuICAgICAgbWV0YToge1xuICAgICAgICAvLyBwYXRoIG9mIHRoZSBmaWxlIHJlbGF0aXZlIHRvIHRoZSBhbmNlc3RvciBkaXJlY3RvcnkgdGhlIHVzZXIgc2VsZWN0ZWQuXG4gICAgICAgIC8vIGUuZy4gJ2RvY3MvT2xkIFByYWd1ZS9haXJibmIucGRmJ1xuICAgICAgICByZWxhdGl2ZVBhdGg6IGZpbGUucmVsYXRpdmVQYXRoIHx8IG51bGwsXG4gICAgICB9LFxuICAgIH0pKVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudXBweS5hZGRGaWxlcyhkZXNjcmlwdG9ycylcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMudXBweS5sb2coZXJyKVxuICAgIH1cbiAgfVxuXG4gIG9uSW5wdXRDaGFuZ2UgKGV2ZW50KSB7XG4gICAgdGhpcy51cHB5LmxvZygnW0RyYWdEcm9wXSBGaWxlcyBzZWxlY3RlZCB0aHJvdWdoIGlucHV0JylcbiAgICBjb25zdCBmaWxlcyA9IHRvQXJyYXkoZXZlbnQudGFyZ2V0LmZpbGVzKVxuICAgIHRoaXMuYWRkRmlsZXMoZmlsZXMpXG5cbiAgICAvLyBXZSBjbGVhciB0aGUgaW5wdXQgYWZ0ZXIgYSBmaWxlIGlzIHNlbGVjdGVkLCBiZWNhdXNlIG90aGVyd2lzZVxuICAgIC8vIGNoYW5nZSBldmVudCBpcyBub3QgZmlyZWQgaW4gQ2hyb21lIGFuZCBTYWZhcmkgd2hlbiBhIGZpbGVcbiAgICAvLyB3aXRoIHRoZSBzYW1lIG5hbWUgaXMgc2VsZWN0ZWQuXG4gICAgLy8gX19fV2h5IG5vdCB1c2UgdmFsdWU9XCJcIiBvbiA8aW5wdXQvPiBpbnN0ZWFkP1xuICAgIC8vICAgIEJlY2F1c2UgaWYgd2UgdXNlIHRoYXQgbWV0aG9kIG9mIGNsZWFyaW5nIHRoZSBpbnB1dCxcbiAgICAvLyAgICBDaHJvbWUgd2lsbCBub3QgdHJpZ2dlciBjaGFuZ2UgaWYgd2UgZHJvcCB0aGUgc2FtZSBmaWxlIHR3aWNlIChJc3N1ZSAjNzY4KS5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBldmVudC50YXJnZXQudmFsdWUgPSBudWxsXG4gIH1cblxuICBoYW5kbGVEcm9wIChldmVudCkge1xuICAgIGlmICh0aGlzLm9wdHMub25Ecm9wKSB0aGlzLm9wdHMub25Ecm9wKGV2ZW50KVxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVtb3ZlRHJhZ092ZXJDbGFzc1RpbWVvdXQpXG5cbiAgICAvLyAyLiBSZW1vdmUgZHJhZ292ZXIgY2xhc3NcbiAgICB0aGlzLnNldFBsdWdpblN0YXRlKHsgaXNEcmFnZ2luZ092ZXI6IGZhbHNlIH0pXG5cbiAgICAvLyAzLiBBZGQgYWxsIGRyb3BwZWQgZmlsZXNcbiAgICB0aGlzLnVwcHkubG9nKCdbRHJhZ0Ryb3BdIEZpbGVzIHdlcmUgZHJvcHBlZCcpXG4gICAgY29uc3QgbG9nRHJvcEVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLnVwcHkubG9nKGVycm9yLCAnZXJyb3InKVxuICAgIH1cbiAgICBnZXREcm9wcGVkRmlsZXMoZXZlbnQuZGF0YVRyYW5zZmVyLCB7IGxvZ0Ryb3BFcnJvciB9KVxuICAgICAgLnRoZW4oKGZpbGVzKSA9PiB0aGlzLmFkZEZpbGVzKGZpbGVzKSlcbiAgfVxuXG4gIGhhbmRsZURyYWdPdmVyIChldmVudCkge1xuICAgIGlmICh0aGlzLm9wdHMub25EcmFnT3ZlcikgdGhpcy5vcHRzLm9uRHJhZ092ZXIoZXZlbnQpXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICAvLyAxLiBBZGQgYSBzbWFsbCAoKykgaWNvbiBvbiBkcm9wXG4gICAgLy8gKGFuZCBwcmV2ZW50IGJyb3dzZXJzIGZyb20gaW50ZXJwcmV0aW5nIHRoaXMgYXMgZmlsZXMgYmVpbmcgX21vdmVkXyBpbnRvIHRoZSBicm93c2VyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkvaXNzdWVzLzE5NzgpXG4gICAgLy9cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdjb3B5J1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVtb3ZlRHJhZ092ZXJDbGFzc1RpbWVvdXQpXG4gICAgdGhpcy5zZXRQbHVnaW5TdGF0ZSh7IGlzRHJhZ2dpbmdPdmVyOiB0cnVlIH0pXG4gIH1cblxuICBoYW5kbGVEcmFnTGVhdmUgKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMub3B0cy5vbkRyYWdMZWF2ZSkgdGhpcy5vcHRzLm9uRHJhZ0xlYXZlKGV2ZW50KVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVtb3ZlRHJhZ092ZXJDbGFzc1RpbWVvdXQpXG4gICAgLy8gVGltZW91dCBhZ2FpbnN0IGZsaWNrZXJpbmcsIHRoaXMgc29sdXRpb24gaXMgdGFrZW4gZnJvbSBkcmFnLWRyb3AgbGlicmFyeS5cbiAgICAvLyBTb2x1dGlvbiB3aXRoICdwb2ludGVyLWV2ZW50czogbm9uZScgZGlkbid0IHdvcmsgYWNyb3NzIGJyb3dzZXJzLlxuICAgIHRoaXMucmVtb3ZlRHJhZ092ZXJDbGFzc1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0UGx1Z2luU3RhdGUoeyBpc0RyYWdnaW5nT3ZlcjogZmFsc2UgfSlcbiAgICB9LCA1MClcbiAgfVxuXG4gIHJlbmRlckhpZGRlbkZpbGVJbnB1dCAoKSB7XG4gICAgY29uc3QgeyByZXN0cmljdGlvbnMgfSA9IHRoaXMudXBweS5vcHRzXG4gICAgcmV0dXJuIChcbiAgICAgIDxpbnB1dFxuICAgICAgICBjbGFzc05hbWU9XCJ1cHB5LURyYWdEcm9wLWlucHV0XCJcbiAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICBoaWRkZW5cbiAgICAgICAgcmVmPXsocmVmKSA9PiB7IHRoaXMuZmlsZUlucHV0UmVmID0gcmVmIH19XG4gICAgICAgIG5hbWU9e3RoaXMub3B0cy5pbnB1dE5hbWV9XG4gICAgICAgIG11bHRpcGxlPXtyZXN0cmljdGlvbnMubWF4TnVtYmVyT2ZGaWxlcyAhPT0gMX1cbiAgICAgICAgYWNjZXB0PXtyZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlc31cbiAgICAgICAgb25DaGFuZ2U9e3RoaXMub25JbnB1dENoYW5nZX1cbiAgICAgIC8+XG4gICAgKVxuICB9XG5cbiAgc3RhdGljIHJlbmRlckFycm93U3ZnICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBhcmlhLWhpZGRlbj1cInRydWVcIiBmb2N1c2FibGU9XCJmYWxzZVwiIGNsYXNzTmFtZT1cInVwcHktYy1pY29uIHVwcHktRHJhZ0Ryb3AtYXJyb3dcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTEgMTBWMEg1djEwSDJsNiA2IDYtNmgtM3ptMCAwXCIgZmlsbFJ1bGU9XCJldmVub2RkXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckxhYmVsICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LURyYWdEcm9wLWxhYmVsXCI+XG4gICAgICAgIHt0aGlzLmkxOG5BcnJheSgnZHJvcEhlcmVPcicsIHtcbiAgICAgICAgICBicm93c2U6IDxzcGFuIGNsYXNzTmFtZT1cInVwcHktRHJhZ0Ryb3AtYnJvd3NlXCI+e3RoaXMuaTE4bignYnJvd3NlJyl9PC9zcGFuPixcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJOb3RlICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidXBweS1EcmFnRHJvcC1ub3RlXCI+e3RoaXMub3B0cy5ub3RlfTwvc3Bhbj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IGRyYWdEcm9wQ2xhc3MgPSBgdXBweS1Sb290XG4gICAgICB1cHB5LXUtcmVzZXRcbiAgICAgIHVwcHktRHJhZ0Ryb3AtY29udGFpbmVyXG4gICAgICAke3RoaXMuaXNEcmFnRHJvcFN1cHBvcnRlZCA/ICd1cHB5LURyYWdEcm9wLS1pc0RyYWdEcm9wU3VwcG9ydGVkJyA6ICcnfVxuICAgICAgJHt0aGlzLmdldFBsdWdpblN0YXRlKCkuaXNEcmFnZ2luZ092ZXIgPyAndXBweS1EcmFnRHJvcC0taXNEcmFnZ2luZ092ZXInIDogJyd9XG4gICAgYFxuXG4gICAgY29uc3QgZHJhZ0Ryb3BTdHlsZSA9IHtcbiAgICAgIHdpZHRoOiB0aGlzLm9wdHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMub3B0cy5oZWlnaHQsXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT17ZHJhZ0Ryb3BDbGFzc31cbiAgICAgICAgc3R5bGU9e2RyYWdEcm9wU3R5bGV9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuZmlsZUlucHV0UmVmLmNsaWNrKCl9XG4gICAgICAgIG9uRHJhZ092ZXI9e3RoaXMuaGFuZGxlRHJhZ092ZXJ9XG4gICAgICAgIG9uRHJhZ0xlYXZlPXt0aGlzLmhhbmRsZURyYWdMZWF2ZX1cbiAgICAgICAgb25Ecm9wPXt0aGlzLmhhbmRsZURyb3B9XG4gICAgICA+XG4gICAgICAgIHt0aGlzLnJlbmRlckhpZGRlbkZpbGVJbnB1dCgpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktRHJhZ0Ryb3AtaW5uZXJcIj5cbiAgICAgICAgICB7RHJhZ0Ryb3AucmVuZGVyQXJyb3dTdmcoKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJMYWJlbCgpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlck5vdGUoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2J1dHRvbj5cbiAgICApXG4gIH1cblxuICBpbnN0YWxsICgpIHtcbiAgICBjb25zdCB7IHRhcmdldCB9ID0gdGhpcy5vcHRzXG5cbiAgICB0aGlzLnNldFBsdWdpblN0YXRlKHtcbiAgICAgIGlzRHJhZ2dpbmdPdmVyOiBmYWxzZSxcbiAgICB9KVxuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGhpcy5tb3VudCh0YXJnZXQsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgdW5pbnN0YWxsICgpIHtcbiAgICB0aGlzLnVubW91bnQoKVxuICB9XG59XG4iLCJjb25zdCB7IFVJUGx1Z2luIH0gPSByZXF1aXJlKCdAdXBweS9jb3JlJylcbmNvbnN0IHsgaCB9ID0gcmVxdWlyZSgncHJlYWN0JylcblxuLyoqXG4gKiBQcm9ncmVzcyBiYXJcbiAqXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJvZ3Jlc3NCYXIgZXh0ZW5kcyBVSVBsdWdpbiB7XG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLmlkID0gdGhpcy5vcHRzLmlkIHx8ICdQcm9ncmVzc0JhcidcbiAgICB0aGlzLnRpdGxlID0gJ1Byb2dyZXNzIEJhcidcbiAgICB0aGlzLnR5cGUgPSAncHJvZ3Jlc3NpbmRpY2F0b3InXG5cbiAgICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgIGZpeGVkOiBmYWxzZSxcbiAgICAgIGhpZGVBZnRlckZpbmlzaDogdHJ1ZSxcbiAgICB9XG5cbiAgICAvLyBtZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgb25lcyBzZXQgYnkgdXNlclxuICAgIHRoaXMub3B0cyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdHMgfVxuXG4gICAgdGhpcy5yZW5kZXIgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpXG4gIH1cblxuICByZW5kZXIgKHN0YXRlKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSBzdGF0ZS50b3RhbFByb2dyZXNzIHx8IDBcbiAgICAvLyBiZWZvcmUgc3RhcnRpbmcgYW5kIGFmdGVyIGZpbmlzaCBzaG91bGQgYmUgaGlkZGVuIGlmIHNwZWNpZmllZCBpbiB0aGUgb3B0aW9uc1xuICAgIGNvbnN0IGlzSGlkZGVuID0gKHByb2dyZXNzID09PSAwIHx8IHByb2dyZXNzID09PSAxMDApICYmIHRoaXMub3B0cy5oaWRlQWZ0ZXJGaW5pc2hcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJ1cHB5IHVwcHktUHJvZ3Jlc3NCYXJcIlxuICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogdGhpcy5vcHRzLmZpeGVkID8gJ2ZpeGVkJyA6ICdpbml0aWFsJyB9fVxuICAgICAgICBhcmlhLWhpZGRlbj17aXNIaWRkZW59XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1Qcm9ncmVzc0Jhci1pbm5lclwiIHN0eWxlPXt7IHdpZHRoOiBgJHtwcm9ncmVzc30lYCB9fSAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktUHJvZ3Jlc3NCYXItcGVyY2VudGFnZVwiPntwcm9ncmVzc308L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGluc3RhbGwgKCkge1xuICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSB0aGlzLm9wdHNcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0aGlzLm1vdW50KHRhcmdldCwgdGhpcylcbiAgICB9XG4gIH1cblxuICB1bmluc3RhbGwgKCkge1xuICAgIHRoaXMudW5tb3VudCgpXG4gIH1cbn1cbiIsIi8qKlxuICogRGVmYXVsdCBzdG9yZSB0aGF0IGtlZXBzIHN0YXRlIGluIGEgc2ltcGxlIG9iamVjdC5cbiAqL1xuY2xhc3MgRGVmYXVsdFN0b3JlIHtcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuc3RhdGUgPSB7fVxuICAgIHRoaXMuY2FsbGJhY2tzID0gW11cbiAgfVxuXG4gIGdldFN0YXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZVxuICB9XG5cbiAgc2V0U3RhdGUgKHBhdGNoKSB7XG4gICAgY29uc3QgcHJldlN0YXRlID0geyAuLi50aGlzLnN0YXRlIH1cbiAgICBjb25zdCBuZXh0U3RhdGUgPSB7IC4uLnRoaXMuc3RhdGUsIC4uLnBhdGNoIH1cblxuICAgIHRoaXMuc3RhdGUgPSBuZXh0U3RhdGVcbiAgICB0aGlzLiNwdWJsaXNoKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaClcbiAgfVxuXG4gIHN1YnNjcmliZSAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGxpc3RlbmVyKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAvLyBSZW1vdmUgdGhlIGxpc3RlbmVyLlxuICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKFxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5pbmRleE9mKGxpc3RlbmVyKSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gICNwdWJsaXNoICguLi5hcmdzKSB7XG4gICAgdGhpcy5jYWxsYmFja3MuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgIGxpc3RlbmVyKC4uLmFyZ3MpXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmF1bHRTdG9yZSAoKSB7XG4gIHJldHVybiBuZXcgRGVmYXVsdFN0b3JlKClcbn1cbiIsImNvbnN0IHR1cyA9IHJlcXVpcmUoJ3R1cy1qcy1jbGllbnQnKVxuXG5mdW5jdGlvbiBpc0NvcmRvdmEgKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgKFxuICAgIHR5cGVvZiB3aW5kb3cuUGhvbmVHYXAgIT09ICd1bmRlZmluZWQnXG4gICAgfHwgdHlwZW9mIHdpbmRvdy5Db3Jkb3ZhICE9PSAndW5kZWZpbmVkJ1xuICAgIHx8IHR5cGVvZiB3aW5kb3cuY29yZG92YSAhPT0gJ3VuZGVmaW5lZCdcbiAgKVxufVxuXG5mdW5jdGlvbiBpc1JlYWN0TmF0aXZlICgpIHtcbiAgcmV0dXJuIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgdHlwZW9mIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnc3RyaW5nJ1xuICAgICYmIG5hdmlnYXRvci5wcm9kdWN0LnRvTG93ZXJDYXNlKCkgPT09ICdyZWFjdG5hdGl2ZSdcbn1cblxuLy8gV2Ugb3ZlcnJpZGUgdHVzIGZpbmdlcnByaW50IHRvIHVwcHnigJlzIGBmaWxlLmlkYCwgc2luY2UgdGhlIGBmaWxlLmlkYFxuLy8gbm93IGFsc28gaW5jbHVkZXMgYHJlbGF0aXZlUGF0aGAgZm9yIGZpbGVzIGFkZGVkIGZyb20gZm9sZGVycy5cbi8vIFRoaXMgbWVhbnMgeW91IGNhbiBhZGQgMiBpZGVudGljYWwgZmlsZXMsIGlmIG9uZSBpcyBpbiBmb2xkZXIgYSxcbi8vIHRoZSBvdGhlciBpbiBmb2xkZXIgYiDigJQgYGEvZmlsZS5qcGdgIGFuZCBgYi9maWxlLmpwZ2AsIHdoZW4gYWRkZWRcbi8vIHRvZ2V0aGVyIHdpdGggYSBmb2xkZXIsIHdpbGwgYmUgdHJlYXRlZCBhcyAyIHNlcGFyYXRlIGZpbGVzLlxuLy9cbi8vIEZvciBSZWFjdCBOYXRpdmUgYW5kIENvcmRvdmEsIHdlIGxldCB0dXMtanMtY2xpZW504oCZcyBkZWZhdWx0XG4vLyBmaW5nZXJwcmludCBoYW5kbGluZyB0YWtlIGNoYXJnZS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmluZ2VycHJpbnQgKHVwcHlGaWxlT2JqKSB7XG4gIHJldHVybiAoZmlsZSwgb3B0aW9ucykgPT4ge1xuICAgIGlmIChpc0NvcmRvdmEoKSB8fCBpc1JlYWN0TmF0aXZlKCkpIHtcbiAgICAgIHJldHVybiB0dXMuZGVmYXVsdE9wdGlvbnMuZmluZ2VycHJpbnQoZmlsZSwgb3B0aW9ucylcbiAgICB9XG5cbiAgICBjb25zdCB1cHB5RmluZ2VycHJpbnQgPSBbXG4gICAgICAndHVzJyxcbiAgICAgIHVwcHlGaWxlT2JqLmlkLFxuICAgICAgb3B0aW9ucy5lbmRwb2ludCxcbiAgICBdLmpvaW4oJy0nKVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1cHB5RmluZ2VycHJpbnQpXG4gIH1cbn1cbiIsImNvbnN0IEJhc2VQbHVnaW4gPSByZXF1aXJlKCdAdXBweS9jb3JlL2xpYi9CYXNlUGx1Z2luJylcbmNvbnN0IHR1cyA9IHJlcXVpcmUoJ3R1cy1qcy1jbGllbnQnKVxuY29uc3QgeyBQcm92aWRlciwgUmVxdWVzdENsaWVudCwgU29ja2V0IH0gPSByZXF1aXJlKCdAdXBweS9jb21wYW5pb24tY2xpZW50JylcbmNvbnN0IGVtaXRTb2NrZXRQcm9ncmVzcyA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9lbWl0U29ja2V0UHJvZ3Jlc3MnKVxuY29uc3QgZ2V0U29ja2V0SG9zdCA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRTb2NrZXRIb3N0JylcbmNvbnN0IHNldHRsZSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9zZXR0bGUnKVxuY29uc3QgRXZlbnRUcmFja2VyID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL0V2ZW50VHJhY2tlcicpXG5jb25zdCBOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvTmV0d29ya0Vycm9yJylcbmNvbnN0IGlzTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2lzTmV0d29ya0Vycm9yJylcbmNvbnN0IHsgUmF0ZUxpbWl0ZWRRdWV1ZSB9ID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL1JhdGVMaW1pdGVkUXVldWUnKVxuY29uc3QgaGFzUHJvcGVydHkgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvaGFzUHJvcGVydHknKVxuY29uc3QgZ2V0RmluZ2VycHJpbnQgPSByZXF1aXJlKCcuL2dldEZpbmdlcnByaW50JylcblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uJykuVHVzT3B0aW9uc30gVHVzT3B0aW9ucyAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ3R1cy1qcy1jbGllbnQnKS5VcGxvYWRPcHRpb25zfSBSYXdUdXNPcHRpb25zICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnQHVwcHkvY29yZScpLlVwcHl9IFVwcHkgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdAdXBweS9jb3JlJykuVXBweUZpbGV9IFVwcHlGaWxlICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnQHVwcHkvY29yZScpLkZhaWxlZFVwcHlGaWxlPHt9Pn0gRmFpbGVkVXBweUZpbGUgKi9cblxuLyoqXG4gKiBFeHRyYWN0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdHVzL3R1cy1qcy1jbGllbnQvYmxvYi9tYXN0ZXIvbGliL3VwbG9hZC5qcyNMMTNcbiAqIGV4Y2VwdGVkIHdlIHJlbW92ZWQgJ2ZpbmdlcnByaW50JyBrZXkgdG8gYXZvaWQgYWRkaW5nIG1vcmUgZGVwZW5kZW5jaWVzXG4gKlxuICogQHR5cGUge1Jhd1R1c09wdGlvbnN9XG4gKi9cbmNvbnN0IHR1c0RlZmF1bHRPcHRpb25zID0ge1xuICBlbmRwb2ludDogJycsXG5cbiAgdXBsb2FkVXJsOiBudWxsLFxuICBtZXRhZGF0YToge30sXG4gIHVwbG9hZFNpemU6IG51bGwsXG5cbiAgb25Qcm9ncmVzczogbnVsbCxcbiAgb25DaHVua0NvbXBsZXRlOiBudWxsLFxuICBvblN1Y2Nlc3M6IG51bGwsXG4gIG9uRXJyb3I6IG51bGwsXG5cbiAgb3ZlcnJpZGVQYXRjaE1ldGhvZDogZmFsc2UsXG4gIGhlYWRlcnM6IHt9LFxuICBhZGRSZXF1ZXN0SWQ6IGZhbHNlLFxuXG4gIGNodW5rU2l6ZTogSW5maW5pdHksXG4gIHJldHJ5RGVsYXlzOiBbMCwgMTAwMCwgMzAwMCwgNTAwMF0sXG4gIHBhcmFsbGVsVXBsb2FkczogMSxcbiAgcmVtb3ZlRmluZ2VycHJpbnRPblN1Y2Nlc3M6IGZhbHNlLFxuICB1cGxvYWRMZW5ndGhEZWZlcnJlZDogZmFsc2UsXG4gIHVwbG9hZERhdGFEdXJpbmdDcmVhdGlvbjogZmFsc2UsXG59XG5cbi8qKlxuICogVHVzIHJlc3VtYWJsZSBmaWxlIHVwbG9hZGVyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHVzIGV4dGVuZHMgQmFzZVBsdWdpbiB7XG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1VwcHl9IHVwcHlcbiAgICogQHBhcmFtIHtUdXNPcHRpb25zfSBvcHRzXG4gICAqL1xuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHN1cGVyKHVwcHksIG9wdHMpXG4gICAgdGhpcy50eXBlID0gJ3VwbG9hZGVyJ1xuICAgIHRoaXMuaWQgPSB0aGlzLm9wdHMuaWQgfHwgJ1R1cydcbiAgICB0aGlzLnRpdGxlID0gJ1R1cydcblxuICAgIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIHVzZUZhc3RSZW1vdGVSZXRyeTogdHJ1ZSxcbiAgICAgIGxpbWl0OiA1LFxuICAgICAgcmV0cnlEZWxheXM6IFswLCAxMDAwLCAzMDAwLCA1MDAwXSxcbiAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4gICAgfVxuXG4gICAgLy8gbWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIG9uZXMgc2V0IGJ5IHVzZXJcbiAgICAvKiogQHR5cGUge2ltcG9ydChcIi4uXCIpLlR1c09wdGlvbnN9ICovXG4gICAgdGhpcy5vcHRzID0geyAuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0cyB9XG5cbiAgICBpZiAoJ2F1dG9SZXRyeScgaW4gb3B0cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYGF1dG9SZXRyeWAgb3B0aW9uIHdhcyBkZXByZWNhdGVkIGFuZCBoYXMgYmVlbiByZW1vdmVkLicpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2ltdWx0YW5lb3VzIHVwbG9hZCBsaW1pdGluZyBpcyBzaGFyZWQgYWNyb3NzIGFsbCB1cGxvYWRzIHdpdGggdGhpcyBwbHVnaW4uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7UmF0ZUxpbWl0ZWRRdWV1ZX1cbiAgICAgKi9cbiAgICB0aGlzLnJlcXVlc3RzID0gbmV3IFJhdGVMaW1pdGVkUXVldWUodGhpcy5vcHRzLmxpbWl0KVxuXG4gICAgdGhpcy51cGxvYWRlcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgdGhpcy51cGxvYWRlckV2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB0aGlzLnVwbG9hZGVyU29ja2V0cyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICAgIHRoaXMuaGFuZGxlUmVzZXRQcm9ncmVzcyA9IHRoaXMuaGFuZGxlUmVzZXRQcm9ncmVzcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVVcGxvYWQgPSB0aGlzLmhhbmRsZVVwbG9hZC5iaW5kKHRoaXMpXG4gIH1cblxuICBoYW5kbGVSZXNldFByb2dyZXNzICgpIHtcbiAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy51cHB5LmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKChmaWxlSUQpID0+IHtcbiAgICAgIC8vIE9ubHkgY2xvbmUgdGhlIGZpbGUgb2JqZWN0IGlmIGl0IGhhcyBhIFR1cyBgdXBsb2FkVXJsYCBhdHRhY2hlZC5cbiAgICAgIGlmIChmaWxlc1tmaWxlSURdLnR1cyAmJiBmaWxlc1tmaWxlSURdLnR1cy51cGxvYWRVcmwpIHtcbiAgICAgICAgY29uc3QgdHVzU3RhdGUgPSB7IC4uLmZpbGVzW2ZpbGVJRF0udHVzIH1cbiAgICAgICAgZGVsZXRlIHR1c1N0YXRlLnVwbG9hZFVybFxuICAgICAgICBmaWxlc1tmaWxlSURdID0geyAuLi5maWxlc1tmaWxlSURdLCB0dXM6IHR1c1N0YXRlIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy51cHB5LnNldFN0YXRlKHsgZmlsZXMgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbiB1cCBhbGwgcmVmZXJlbmNlcyBmb3IgYSBmaWxlJ3MgdXBsb2FkOiB0aGUgdHVzLlVwbG9hZCBpbnN0YW5jZSxcbiAgICogYW55IGV2ZW50cyByZWxhdGVkIHRvIHRoZSBmaWxlLCBhbmQgdGhlIENvbXBhbmlvbiBXZWJTb2NrZXQgY29ubmVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRFxuICAgKi9cbiAgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMgKGZpbGVJRCwgb3B0cyA9IHt9KSB7XG4gICAgaWYgKHRoaXMudXBsb2FkZXJzW2ZpbGVJRF0pIHtcbiAgICAgIGNvbnN0IHVwbG9hZGVyID0gdGhpcy51cGxvYWRlcnNbZmlsZUlEXVxuXG4gICAgICB1cGxvYWRlci5hYm9ydCgpXG5cbiAgICAgIGlmIChvcHRzLmFib3J0KSB7XG4gICAgICAgIHVwbG9hZGVyLmFib3J0KHRydWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBsb2FkZXJzW2ZpbGVJRF0gPSBudWxsXG4gICAgfVxuICAgIGlmICh0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0pIHtcbiAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5yZW1vdmUoKVxuICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy51cGxvYWRlclNvY2tldHNbZmlsZUlEXSkge1xuICAgICAgdGhpcy51cGxvYWRlclNvY2tldHNbZmlsZUlEXS5jbG9zZSgpXG4gICAgICB0aGlzLnVwbG9hZGVyU29ja2V0c1tmaWxlSURdID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgVHVzIHVwbG9hZC5cbiAgICpcbiAgICogQSBsb3QgY2FuIGhhcHBlbiBkdXJpbmcgYW4gdXBsb2FkLCBzbyB0aGlzIGlzIHF1aXRlIGhhcmQgdG8gZm9sbG93IVxuICAgKiAtIEZpcnN0LCB0aGUgdXBsb2FkIGlzIHN0YXJ0ZWQuIElmIHRoZSBmaWxlIHdhcyBhbHJlYWR5IHBhdXNlZCBieSB0aGUgdGltZSB0aGUgdXBsb2FkIHN0YXJ0cywgbm90aGluZyBzaG91bGQgaGFwcGVuLlxuICAgKiAgIElmIHRoZSBgbGltaXRgIG9wdGlvbiBpcyB1c2VkLCB0aGUgdXBsb2FkIG11c3QgYmUgcXVldWVkIG9udG8gdGhlIGB0aGlzLnJlcXVlc3RzYCBxdWV1ZS5cbiAgICogICBXaGVuIGFuIHVwbG9hZCBzdGFydHMsIHdlIHN0b3JlIHRoZSB0dXMuVXBsb2FkIGluc3RhbmNlLCBhbmQgYW4gRXZlbnRUcmFja2VyIGluc3RhbmNlIHRoYXQgbWFuYWdlcyB0aGUgZXZlbnQgbGlzdGVuZXJzXG4gICAqICAgZm9yIHBhdXNpbmcsIGNhbmNlbGxhdGlvbiwgcmVtb3ZhbCwgZXRjLlxuICAgKiAtIFdoaWxlIHRoZSB1cGxvYWQgaXMgaW4gcHJvZ3Jlc3MsIGl0IG1heSBiZSBwYXVzZWQgb3IgY2FuY2VsbGVkLlxuICAgKiAgIFBhdXNpbmcgYWJvcnRzIHRoZSB1bmRlcmx5aW5nIHR1cy5VcGxvYWQsIGFuZCByZW1vdmVzIHRoZSB1cGxvYWQgZnJvbSB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLiBBbGwgb3RoZXIgc3RhdGUgaXNcbiAgICogICBtYWludGFpbmVkLlxuICAgKiAgIENhbmNlbGxpbmcgcmVtb3ZlcyB0aGUgdXBsb2FkIGZyb20gdGhlIGB0aGlzLnJlcXVlc3RzYCBxdWV1ZSwgYW5kIGNvbXBsZXRlbHkgYWJvcnRzIHRoZSB1cGxvYWQtLSB0aGUgYHR1cy5VcGxvYWRgXG4gICAqICAgaW5zdGFuY2UgaXMgYWJvcnRlZCBhbmQgZGlzY2FyZGVkLCB0aGUgRXZlbnRUcmFja2VyIGluc3RhbmNlIGlzIGRlc3Ryb3llZCAocmVtb3ZpbmcgYWxsIGxpc3RlbmVycykuXG4gICAqICAgUmVzdW1pbmcgdGhlIHVwbG9hZCB1c2VzIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUgYXMgd2VsbCwgdG8gcHJldmVudCBzZWxlY3RpdmVseSBwYXVzaW5nIGFuZCByZXN1bWluZyB1cGxvYWRzIGZyb21cbiAgICogICBieXBhc3NpbmcgdGhlIGxpbWl0LlxuICAgKiAtIEFmdGVyIGNvbXBsZXRpbmcgYW4gdXBsb2FkLCB0aGUgdHVzLlVwbG9hZCBhbmQgRXZlbnRUcmFja2VyIGluc3RhbmNlcyBhcmUgY2xlYW5lZCB1cCwgYW5kIHRoZSB1cGxvYWQgaXMgbWFya2VkIGFzIGRvbmVcbiAgICogICBpbiB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLlxuICAgKiAtIFdoZW4gYW4gdXBsb2FkIGNvbXBsZXRlZCB3aXRoIGFuIGVycm9yLCB0aGUgc2FtZSBoYXBwZW5zIGFzIG9uIHN1Y2Nlc3NmdWwgY29tcGxldGlvbiwgYnV0IHRoZSBgdXBsb2FkKClgIHByb21pc2UgaXNcbiAgICogICByZWplY3RlZC5cbiAgICpcbiAgICogV2hlbiB3b3JraW5nIG9uIHRoaXMgZnVuY3Rpb24sIGtlZXAgaW4gbWluZDpcbiAgICogIC0gV2hlbiBhbiB1cGxvYWQgaXMgY29tcGxldGVkIG9yIGNhbmNlbGxlZCBmb3IgYW55IHJlYXNvbiwgdGhlIHR1cy5VcGxvYWQgYW5kIEV2ZW50VHJhY2tlciBpbnN0YW5jZXMgbmVlZCB0byBiZSBjbGVhbmVkXG4gICAqICAgIHVwIHVzaW5nIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKS5cbiAgICogIC0gV2hlbiBhbiB1cGxvYWQgaXMgY2FuY2VsbGVkIG9yIHBhdXNlZCwgZm9yIGFueSByZWFzb24sIGl0IG5lZWRzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlIHVzaW5nXG4gICAqICAgIGBxdWV1ZWRSZXF1ZXN0LmFib3J0KClgLlxuICAgKiAgLSBXaGVuIGFuIHVwbG9hZCBpcyBjb21wbGV0ZWQgZm9yIGFueSByZWFzb24sIGluY2x1ZGluZyBlcnJvcnMsIGl0IG5lZWRzIHRvIGJlIG1hcmtlZCBhcyBzdWNoIHVzaW5nXG4gICAqICAgIGBxdWV1ZWRSZXF1ZXN0LmRvbmUoKWAuXG4gICAqICAtIFdoZW4gYW4gdXBsb2FkIGlzIHN0YXJ0ZWQgb3IgcmVzdW1lZCwgaXQgbmVlZHMgdG8gZ28gdGhyb3VnaCB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLiBUaGUgYHF1ZXVlZFJlcXVlc3RgIHZhcmlhYmxlXG4gICAqICAgIG11c3QgYmUgdXBkYXRlZCBzbyB0aGUgb3RoZXIgdXNlcyBvZiBpdCBhcmUgdmFsaWQuXG4gICAqICAtIEJlZm9yZSByZXBsYWNpbmcgdGhlIGBxdWV1ZWRSZXF1ZXN0YCB2YXJpYWJsZSwgdGhlIHByZXZpb3VzIGBxdWV1ZWRSZXF1ZXN0YCBtdXN0IGJlIGFib3J0ZWQsIGVsc2UgaXQgd2lsbCBrZWVwIHRha2luZ1xuICAgKiAgICB1cCBhIHNwb3QgaW4gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlIGZvciB1c2Ugd2l0aCB1cGxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnQgZmlsZSBpbiBhIHF1ZXVlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbCBudW1iZXIgb2YgZmlsZXMgaW4gYSBxdWV1ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIHVwbG9hZCAoZmlsZSkge1xuICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZClcblxuICAgIC8vIENyZWF0ZSBhIG5ldyB0dXMgdXBsb2FkXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3RhcnRlZCcsIGZpbGUpXG5cbiAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgIC4uLnRoaXMub3B0cyxcbiAgICAgICAgLi4uKGZpbGUudHVzIHx8IHt9KSxcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBvcHRzLmhlYWRlcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb3B0cy5oZWFkZXJzID0gb3B0cy5oZWFkZXJzKGZpbGUpXG4gICAgICB9XG5cbiAgICAgIC8qKiBAdHlwZSB7UmF3VHVzT3B0aW9uc30gKi9cbiAgICAgIGNvbnN0IHVwbG9hZE9wdGlvbnMgPSB7XG4gICAgICAgIC4uLnR1c0RlZmF1bHRPcHRpb25zLFxuICAgICAgICAuLi5vcHRzLFxuICAgICAgfVxuXG4gICAgICAvLyBXZSBvdmVycmlkZSB0dXMgZmluZ2VycHJpbnQgdG8gdXBweeKAmXMgYGZpbGUuaWRgLCBzaW5jZSB0aGUgYGZpbGUuaWRgXG4gICAgICAvLyBub3cgYWxzbyBpbmNsdWRlcyBgcmVsYXRpdmVQYXRoYCBmb3IgZmlsZXMgYWRkZWQgZnJvbSBmb2xkZXJzLlxuICAgICAgLy8gVGhpcyBtZWFucyB5b3UgY2FuIGFkZCAyIGlkZW50aWNhbCBmaWxlcywgaWYgb25lIGlzIGluIGZvbGRlciBhLFxuICAgICAgLy8gdGhlIG90aGVyIGluIGZvbGRlciBiLlxuICAgICAgdXBsb2FkT3B0aW9ucy5maW5nZXJwcmludCA9IGdldEZpbmdlcnByaW50KGZpbGUpXG5cbiAgICAgIHVwbG9hZE9wdGlvbnMub25CZWZvcmVSZXF1ZXN0ID0gKHJlcSkgPT4ge1xuICAgICAgICBjb25zdCB4aHIgPSByZXEuZ2V0VW5kZXJseWluZ09iamVjdCgpXG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSAhIW9wdHMud2l0aENyZWRlbnRpYWxzXG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRzLm9uQmVmb3JlUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIG9wdHMub25CZWZvcmVSZXF1ZXN0KHJlcSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cGxvYWRPcHRpb25zLm9uRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coZXJyKVxuXG4gICAgICAgIGNvbnN0IHhociA9IGVyci5vcmlnaW5hbFJlcXVlc3QgPyBlcnIub3JpZ2luYWxSZXF1ZXN0LmdldFVuZGVybHlpbmdPYmplY3QoKSA6IG51bGxcbiAgICAgICAgaWYgKGlzTmV0d29ya0Vycm9yKHhocikpIHtcbiAgICAgICAgICBlcnIgPSBuZXcgTmV0d29ya0Vycm9yKGVyciwgeGhyKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKVxuXG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLCBlcnIpXG5cbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIH1cblxuICAgICAgdXBsb2FkT3B0aW9ucy5vblByb2dyZXNzID0gKGJ5dGVzVXBsb2FkZWQsIGJ5dGVzVG90YWwpID0+IHtcbiAgICAgICAgdGhpcy5vblJlY2VpdmVVcGxvYWRVcmwoZmlsZSwgdXBsb2FkLnVybClcbiAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1wcm9ncmVzcycsIGZpbGUsIHtcbiAgICAgICAgICB1cGxvYWRlcjogdGhpcyxcbiAgICAgICAgICBieXRlc1VwbG9hZGVkLFxuICAgICAgICAgIGJ5dGVzVG90YWwsXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHVwbG9hZE9wdGlvbnMub25TdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB1cGxvYWRSZXNwID0ge1xuICAgICAgICAgIHVwbG9hZFVSTDogdXBsb2FkLnVybCxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZClcbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcblxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN1Y2Nlc3MnLCBmaWxlLCB1cGxvYWRSZXNwKVxuXG4gICAgICAgIGlmICh1cGxvYWQudXJsKSB7XG4gICAgICAgICAgdGhpcy51cHB5LmxvZyhgRG93bmxvYWQgJHt1cGxvYWQuZmlsZS5uYW1lfSBmcm9tICR7dXBsb2FkLnVybH1gKVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSh1cGxvYWQpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvcHlQcm9wID0gKG9iaiwgc3JjUHJvcCwgZGVzdFByb3ApID0+IHtcbiAgICAgICAgaWYgKGhhc1Byb3BlcnR5KG9iaiwgc3JjUHJvcCkgJiYgIWhhc1Byb3BlcnR5KG9iaiwgZGVzdFByb3ApKSB7XG4gICAgICAgICAgb2JqW2Rlc3RQcm9wXSA9IG9ialtzcmNQcm9wXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgc3RyaW5nPn0gKi9cbiAgICAgIGNvbnN0IG1ldGEgPSB7fVxuICAgICAgY29uc3QgbWV0YUZpZWxkcyA9IEFycmF5LmlzQXJyYXkob3B0cy5tZXRhRmllbGRzKVxuICAgICAgICA/IG9wdHMubWV0YUZpZWxkc1xuICAgICAgICAvLyBTZW5kIGFsb25nIGFsbCBmaWVsZHMgYnkgZGVmYXVsdC5cbiAgICAgICAgOiBPYmplY3Qua2V5cyhmaWxlLm1ldGEpXG4gICAgICBtZXRhRmllbGRzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgbWV0YVtpdGVtXSA9IGZpbGUubWV0YVtpdGVtXVxuICAgICAgfSlcblxuICAgICAgLy8gdHVzZCB1c2VzIG1ldGFkYXRhIGZpZWxkcyAnZmlsZXR5cGUnIGFuZCAnZmlsZW5hbWUnXG4gICAgICBjb3B5UHJvcChtZXRhLCAndHlwZScsICdmaWxldHlwZScpXG4gICAgICBjb3B5UHJvcChtZXRhLCAnbmFtZScsICdmaWxlbmFtZScpXG5cbiAgICAgIHVwbG9hZE9wdGlvbnMubWV0YWRhdGEgPSBtZXRhXG5cbiAgICAgIGNvbnN0IHVwbG9hZCA9IG5ldyB0dXMuVXBsb2FkKGZpbGUuZGF0YSwgdXBsb2FkT3B0aW9ucylcbiAgICAgIHRoaXMudXBsb2FkZXJzW2ZpbGUuaWRdID0gdXBsb2FkXG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdID0gbmV3IEV2ZW50VHJhY2tlcih0aGlzLnVwcHkpXG5cbiAgICAgIHVwbG9hZC5maW5kUHJldmlvdXNVcGxvYWRzKCkudGhlbigocHJldmlvdXNVcGxvYWRzKSA9PiB7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzVXBsb2FkID0gcHJldmlvdXNVcGxvYWRzWzBdXG4gICAgICAgIGlmIChwcmV2aW91c1VwbG9hZCkge1xuICAgICAgICAgIHRoaXMudXBweS5sb2coYFtUdXNdIFJlc3VtaW5nIHVwbG9hZCBvZiAke2ZpbGUuaWR9IHN0YXJ0ZWQgYXQgJHtwcmV2aW91c1VwbG9hZC5jcmVhdGlvblRpbWV9YClcbiAgICAgICAgICB1cGxvYWQucmVzdW1lRnJvbVByZXZpb3VzVXBsb2FkKHByZXZpb3VzVXBsb2FkKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgcXVldWVkUmVxdWVzdCA9IHRoaXMucmVxdWVzdHMucnVuKCgpID0+IHtcbiAgICAgICAgaWYgKCFmaWxlLmlzUGF1c2VkKSB7XG4gICAgICAgICAgdXBsb2FkLnN0YXJ0KClcbiAgICAgICAgfVxuICAgICAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBoZXJlLCB0aGUgY2FsbGVyIHdpbGwgdGFrZSBjYXJlIG9mIGNhbmNlbGxpbmcgdGhlIHVwbG9hZCBpdHNlbGZcbiAgICAgICAgLy8gdXNpbmcgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKS4gVGhpcyBpcyBiZWNhdXNlIHJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKCkgaGFzIHRvIGJlXG4gICAgICAgIC8vIGNhbGxlZCB3aGVuIHRoaXMgcmVxdWVzdCBpcyBzdGlsbCBpbiB0aGUgcXVldWUsIGFuZCBoYXMgbm90IGJlZW4gc3RhcnRlZCB5ZXQsIHRvby4gQXRcbiAgICAgICAgLy8gdGhhdCBwb2ludCB0aGlzIGNhbmNlbGxhdGlvbiBmdW5jdGlvbiBpcyBub3QgZ29pbmcgdG8gYmUgY2FsbGVkLlxuICAgICAgICAvLyBBbHNvLCB3ZSBuZWVkIHRvIHJlbW92ZSB0aGUgcmVxdWVzdCBmcm9tIHRoZSBxdWV1ZSBfd2l0aG91dF8gZGVzdHJveWluZyBldmVyeXRoaW5nXG4gICAgICAgIC8vIHJlbGF0ZWQgdG8gdGhpcyB1cGxvYWQgdG8gaGFuZGxlIHBhdXNlcy5cbiAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uRmlsZVJlbW92ZShmaWxlLmlkLCAodGFyZ2V0RmlsZUlEKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQsIHsgYWJvcnQ6ICEhdXBsb2FkLnVybCB9KVxuICAgICAgICByZXNvbHZlKGB1cGxvYWQgJHt0YXJnZXRGaWxlSUR9IHdhcyByZW1vdmVkYClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25QYXVzZShmaWxlLmlkLCAoaXNQYXVzZWQpID0+IHtcbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRoaXMgZmlsZSBmcm9tIHRoZSBxdWV1ZSBzbyBhbm90aGVyIGZpbGUgY2FuIHN0YXJ0IGluIGl0cyBwbGFjZS5cbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgICB1cGxvYWQuYWJvcnQoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFJlc3VtaW5nIGFuIHVwbG9hZCBzaG91bGQgYmUgcXVldWVkLCBlbHNlIHlvdSBjb3VsZCBwYXVzZSBhbmQgdGhlblxuICAgICAgICAgIC8vIHJlc3VtZSBhIHF1ZXVlZCB1cGxvYWQgdG8gbWFrZSBpdCBza2lwIHRoZSBxdWV1ZS5cbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0cy5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdXBsb2FkLnN0YXJ0KClcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25QYXVzZUFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICB1cGxvYWQuYWJvcnQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vbkNhbmNlbEFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQsIHsgYWJvcnQ6ICEhdXBsb2FkLnVybCB9KVxuICAgICAgICByZXNvbHZlKGB1cGxvYWQgJHtmaWxlLmlkfSB3YXMgY2FuY2VsZWRgKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblJlc3VtZUFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICBpZiAoZmlsZS5lcnJvcikge1xuICAgICAgICAgIHVwbG9hZC5hYm9ydCgpXG4gICAgICAgIH1cbiAgICAgICAgcXVldWVkUmVxdWVzdCA9IHRoaXMucmVxdWVzdHMucnVuKCgpID0+IHtcbiAgICAgICAgICB1cGxvYWQuc3RhcnQoKVxuICAgICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyKVxuICAgICAgdGhyb3cgZXJyXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlIGZvciB1c2Ugd2l0aCB1cGxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnQgZmlsZSBpbiBhIHF1ZXVlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbCBudW1iZXIgb2YgZmlsZXMgaW4gYSBxdWV1ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIHVwbG9hZFJlbW90ZSAoZmlsZSkge1xuICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZClcblxuICAgIGNvbnN0IG9wdHMgPSB7IC4uLnRoaXMub3B0cyB9XG4gICAgaWYgKGZpbGUudHVzKSB7XG4gICAgICAvLyBJbnN0YWxsIGZpbGUtc3BlY2lmaWMgdXBsb2FkIG92ZXJyaWRlcy5cbiAgICAgIE9iamVjdC5hc3NpZ24ob3B0cywgZmlsZS50dXMpXG4gICAgfVxuXG4gICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSlcbiAgICB0aGlzLnVwcHkubG9nKGZpbGUucmVtb3RlLnVybClcblxuICAgIGlmIChmaWxlLnNlcnZlclRva2VuKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0VG9TZXJ2ZXJTb2NrZXQoZmlsZSlcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgQ2xpZW50ID0gZmlsZS5yZW1vdGUucHJvdmlkZXJPcHRpb25zLnByb3ZpZGVyID8gUHJvdmlkZXIgOiBSZXF1ZXN0Q2xpZW50XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KHRoaXMudXBweSwgZmlsZS5yZW1vdGUucHJvdmlkZXJPcHRpb25zKVxuXG4gICAgICAvLyAhISBjYW5jZWxsYXRpb24gaXMgTk9UIHN1cHBvcnRlZCBhdCB0aGlzIHN0YWdlIHlldFxuICAgICAgY2xpZW50LnBvc3QoZmlsZS5yZW1vdGUudXJsLCB7XG4gICAgICAgIC4uLmZpbGUucmVtb3RlLmJvZHksXG4gICAgICAgIGVuZHBvaW50OiBvcHRzLmVuZHBvaW50LFxuICAgICAgICB1cGxvYWRVcmw6IG9wdHMudXBsb2FkVXJsLFxuICAgICAgICBwcm90b2NvbDogJ3R1cycsXG4gICAgICAgIHNpemU6IGZpbGUuZGF0YS5zaXplLFxuICAgICAgICBoZWFkZXJzOiBvcHRzLmhlYWRlcnMsXG4gICAgICAgIG1ldGFkYXRhOiBmaWxlLm1ldGEsXG4gICAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7IHNlcnZlclRva2VuOiByZXMudG9rZW4gfSlcbiAgICAgICAgZmlsZSA9IHRoaXMudXBweS5nZXRGaWxlKGZpbGUuaWQpXG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3RUb1NlcnZlclNvY2tldChmaWxlKVxuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyKVxuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZSB0aGUgY29tbWVudCBvbiB0aGUgdXBsb2FkKCkgbWV0aG9kLlxuICAgKlxuICAgKiBBZGRpdGlvbmFsbHksIHdoZW4gYW4gdXBsb2FkIGlzIHJlbW92ZWQsIGNvbXBsZXRlZCwgb3IgY2FuY2VsbGVkLCB3ZSBuZWVkIHRvIGNsb3NlIHRoZSBXZWJTb2NrZXQgY29ubmVjdGlvbi4gVGhpcyBpc1xuICAgKiBoYW5kbGVkIGJ5IHRoZSByZXNldFVwbG9hZGVyUmVmZXJlbmNlcygpIGZ1bmN0aW9uLCBzbyB0aGUgc2FtZSBndWlkZWxpbmVzIGFwcGx5IGFzIGluIHVwbG9hZCgpLlxuICAgKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlXG4gICAqL1xuICBjb25uZWN0VG9TZXJ2ZXJTb2NrZXQgKGZpbGUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBmaWxlLnNlcnZlclRva2VuXG4gICAgICBjb25zdCBob3N0ID0gZ2V0U29ja2V0SG9zdChmaWxlLnJlbW90ZS5jb21wYW5pb25VcmwpXG4gICAgICBjb25zdCBzb2NrZXQgPSBuZXcgU29ja2V0KHsgdGFyZ2V0OiBgJHtob3N0fS9hcGkvJHt0b2tlbn1gLCBhdXRvT3BlbjogZmFsc2UgfSlcbiAgICAgIHRoaXMudXBsb2FkZXJTb2NrZXRzW2ZpbGUuaWRdID0gc29ja2V0XG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdID0gbmV3IEV2ZW50VHJhY2tlcih0aGlzLnVwcHkpXG5cbiAgICAgIHRoaXMub25GaWxlUmVtb3ZlKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHNvY2tldC5zZW5kKCdjYW5jZWwnLCB7fSlcbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICByZXNvbHZlKGB1cGxvYWQgJHtmaWxlLmlkfSB3YXMgcmVtb3ZlZGApXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUGF1c2UoZmlsZS5pZCwgKGlzUGF1c2VkKSA9PiB7XG4gICAgICAgIGlmIChpc1BhdXNlZCkge1xuICAgICAgICAgIC8vIFJlbW92ZSB0aGlzIGZpbGUgZnJvbSB0aGUgcXVldWUgc28gYW5vdGhlciBmaWxlIGNhbiBzdGFydCBpbiBpdHMgcGxhY2UuXG4gICAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVzdW1pbmcgYW4gdXBsb2FkIHNob3VsZCBiZSBxdWV1ZWQsIGVsc2UgeW91IGNvdWxkIHBhdXNlIGFuZCB0aGVuXG4gICAgICAgICAgLy8gcmVzdW1lIGEgcXVldWVkIHVwbG9hZCB0byBtYWtlIGl0IHNraXAgdGhlIHF1ZXVlLlxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBzb2NrZXQuc2VuZCgncmVzdW1lJywge30pXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUGF1c2VBbGwoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uQ2FuY2VsQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHNvY2tldC5zZW5kKCdjYW5jZWwnLCB7fSlcbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICByZXNvbHZlKGB1cGxvYWQgJHtmaWxlLmlkfSB3YXMgY2FuY2VsZWRgKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblJlc3VtZUFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICBpZiAoZmlsZS5lcnJvcikge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KVxuICAgICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblJldHJ5KGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgLy8gT25seSBkbyB0aGUgcmV0cnkgaWYgdGhlIHVwbG9hZCBpcyBhY3R1YWxseSBpbiBwcm9ncmVzcztcbiAgICAgICAgLy8gZWxzZSB3ZSBjb3VsZCB0cnkgdG8gc2VuZCB0aGVzZSBtZXNzYWdlcyB3aGVuIHRoZSB1cGxvYWQgaXMgc3RpbGwgcXVldWVkLlxuICAgICAgICAvLyBXZSBtYXkgbmVlZCBhIGJldHRlciBjaGVjayBmb3IgdGhpcyBzaW5jZSB0aGUgc29ja2V0IG1heSBhbHNvIGJlIGNsb3NlZFxuICAgICAgICAvLyBmb3Igb3RoZXIgcmVhc29ucywgbGlrZSBuZXR3b3JrIGZhaWx1cmVzLlxuICAgICAgICBpZiAoc29ja2V0LmlzT3Blbikge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KVxuICAgICAgICAgIHNvY2tldC5zZW5kKCdyZXN1bWUnLCB7fSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblJldHJ5QWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgLy8gU2VlIHRoZSBjb21tZW50IGluIHRoZSBvblJldHJ5KCkgY2FsbFxuICAgICAgICBpZiAoc29ja2V0LmlzT3Blbikge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KVxuICAgICAgICAgIHNvY2tldC5zZW5kKCdyZXN1bWUnLCB7fSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgc29ja2V0Lm9uKCdwcm9ncmVzcycsIChwcm9ncmVzc0RhdGEpID0+IGVtaXRTb2NrZXRQcm9ncmVzcyh0aGlzLCBwcm9ncmVzc0RhdGEsIGZpbGUpKVxuXG4gICAgICBzb2NrZXQub24oJ2Vycm9yJywgKGVyckRhdGEpID0+IHtcbiAgICAgICAgY29uc3QgeyBtZXNzYWdlIH0gPSBlcnJEYXRhLmVycm9yXG4gICAgICAgIGNvbnN0IGVycm9yID0gT2JqZWN0LmFzc2lnbihuZXcgRXJyb3IobWVzc2FnZSksIHsgY2F1c2U6IGVyckRhdGEuZXJyb3IgfSlcblxuICAgICAgICAvLyBJZiB0aGUgcmVtb3RlIHJldHJ5IG9wdGltaXNhdGlvbiBzaG91bGQgbm90IGJlIHVzZWQsXG4gICAgICAgIC8vIGNsb3NlIHRoZSBzb2NrZXTigJR0aGlzIHdpbGwgdGVsbCBjb21wYW5pb24gdG8gY2xlYXIgc3RhdGUgYW5kIGRlbGV0ZSB0aGUgZmlsZS5cbiAgICAgICAgaWYgKCF0aGlzLm9wdHMudXNlRmFzdFJlbW90ZVJldHJ5KSB7XG4gICAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICAgIC8vIFJlbW92ZSB0aGUgc2VydmVyVG9rZW4gc28gdGhhdCBhIG5ldyBvbmUgd2lsbCBiZSBjcmVhdGVkIGZvciB0aGUgcmV0cnkuXG4gICAgICAgICAgdGhpcy51cHB5LnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgICAgICBzZXJ2ZXJUb2tlbjogbnVsbCxcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNvY2tldC5jbG9zZSgpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IpXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0pXG5cbiAgICAgIHNvY2tldC5vbignc3VjY2VzcycsIChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IHVwbG9hZFJlc3AgPSB7XG4gICAgICAgICAgdXBsb2FkVVJMOiBkYXRhLnVybCxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3VjY2VzcycsIGZpbGUsIHVwbG9hZFJlc3ApXG4gICAgICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZClcbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcblxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG5cbiAgICAgIGxldCBxdWV1ZWRSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0cy5ydW4oKCkgPT4ge1xuICAgICAgICBzb2NrZXQub3BlbigpXG4gICAgICAgIGlmIChmaWxlLmlzUGF1c2VkKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgIH1cblxuICAgICAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBoZXJlLCB0aGUgY2FsbGVyIHdpbGwgdGFrZSBjYXJlIG9mIGNhbmNlbGxpbmcgdGhlIHVwbG9hZCBpdHNlbGZcbiAgICAgICAgLy8gdXNpbmcgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKS4gVGhpcyBpcyBiZWNhdXNlIHJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKCkgaGFzIHRvIGJlXG4gICAgICAgIC8vIGNhbGxlZCB3aGVuIHRoaXMgcmVxdWVzdCBpcyBzdGlsbCBpbiB0aGUgcXVldWUsIGFuZCBoYXMgbm90IGJlZW4gc3RhcnRlZCB5ZXQsIHRvby4gQXRcbiAgICAgICAgLy8gdGhhdCBwb2ludCB0aGlzIGNhbmNlbGxhdGlvbiBmdW5jdGlvbiBpcyBub3QgZ29pbmcgdG8gYmUgY2FsbGVkLlxuICAgICAgICAvLyBBbHNvLCB3ZSBuZWVkIHRvIHJlbW92ZSB0aGUgcmVxdWVzdCBmcm9tIHRoZSBxdWV1ZSBfd2l0aG91dF8gZGVzdHJveWluZyBldmVyeXRoaW5nXG4gICAgICAgIC8vIHJlbGF0ZWQgdG8gdGhpcyB1cGxvYWQgdG8gaGFuZGxlIHBhdXNlcy5cbiAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgdGhlIHVwbG9hZFVybCBvbiB0aGUgZmlsZSBvcHRpb25zLCBzbyB0aGF0IHdoZW4gR29sZGVuIFJldHJpZXZlclxuICAgKiByZXN0b3JlcyBzdGF0ZSwgd2Ugd2lsbCBjb250aW51ZSB1cGxvYWRpbmcgdG8gdGhlIGNvcnJlY3QgVVJMLlxuICAgKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRVUkxcbiAgICovXG4gIG9uUmVjZWl2ZVVwbG9hZFVybCAoZmlsZSwgdXBsb2FkVVJMKSB7XG4gICAgY29uc3QgY3VycmVudEZpbGUgPSB0aGlzLnVwcHkuZ2V0RmlsZShmaWxlLmlkKVxuICAgIGlmICghY3VycmVudEZpbGUpIHJldHVyblxuICAgIC8vIE9ubHkgZG8gdGhlIHVwZGF0ZSBpZiB3ZSBkaWRuJ3QgaGF2ZSBhbiB1cGxvYWQgVVJMIHlldC5cbiAgICBpZiAoIWN1cnJlbnRGaWxlLnR1cyB8fCBjdXJyZW50RmlsZS50dXMudXBsb2FkVXJsICE9PSB1cGxvYWRVUkwpIHtcbiAgICAgIHRoaXMudXBweS5sb2coJ1tUdXNdIFN0b3JpbmcgdXBsb2FkIHVybCcpXG4gICAgICB0aGlzLnVwcHkuc2V0RmlsZVN0YXRlKGN1cnJlbnRGaWxlLmlkLCB7XG4gICAgICAgIHR1czogeyAuLi5jdXJyZW50RmlsZS50dXMsIHVwbG9hZFVybDogdXBsb2FkVVJMIH0sXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oc3RyaW5nKTogdm9pZH0gY2JcbiAgICovXG4gIG9uRmlsZVJlbW92ZSAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbignZmlsZS1yZW1vdmVkJywgKGZpbGUpID0+IHtcbiAgICAgIGlmIChmaWxlSUQgPT09IGZpbGUuaWQpIGNiKGZpbGUuaWQpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oYm9vbGVhbik6IHZvaWR9IGNiXG4gICAqL1xuICBvblBhdXNlIChmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCd1cGxvYWQtcGF1c2UnLCAodGFyZ2V0RmlsZUlELCBpc1BhdXNlZCkgPT4ge1xuICAgICAgaWYgKGZpbGVJRCA9PT0gdGFyZ2V0RmlsZUlEKSB7XG4gICAgICAgIC8vIGNvbnN0IGlzUGF1c2VkID0gdGhpcy51cHB5LnBhdXNlUmVzdW1lKGZpbGVJRClcbiAgICAgICAgY2IoaXNQYXVzZWQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIG9uUmV0cnkgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3VwbG9hZC1yZXRyeScsICh0YXJnZXRGaWxlSUQpID0+IHtcbiAgICAgIGlmIChmaWxlSUQgPT09IHRhcmdldEZpbGVJRCkge1xuICAgICAgICBjYigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIG9uUmV0cnlBbGwgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3JldHJ5LWFsbCcsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSkgcmV0dXJuXG4gICAgICBjYigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIG9uUGF1c2VBbGwgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3BhdXNlLWFsbCcsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSkgcmV0dXJuXG4gICAgICBjYigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIG9uQ2FuY2VsQWxsIChmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCdjYW5jZWwtYWxsJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnVwcHkuZ2V0RmlsZShmaWxlSUQpKSByZXR1cm5cbiAgICAgIGNiKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25SZXN1bWVBbGwgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3Jlc3VtZS1hbGwnLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMudXBweS5nZXRGaWxlKGZpbGVJRCkpIHJldHVyblxuICAgICAgY2IoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHsoVXBweUZpbGUgfCBGYWlsZWRVcHB5RmlsZSlbXX0gZmlsZXNcbiAgICovXG4gIHVwbG9hZEZpbGVzIChmaWxlcykge1xuICAgIGNvbnN0IHByb21pc2VzID0gZmlsZXMubWFwKChmaWxlLCBpKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gaSArIDFcbiAgICAgIGNvbnN0IHRvdGFsID0gZmlsZXMubGVuZ3RoXG5cbiAgICAgIGlmICgnZXJyb3InIGluIGZpbGUgJiYgZmlsZS5lcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGZpbGUuZXJyb3IpKVxuICAgICAgfSBpZiAoZmlsZS5pc1JlbW90ZSkge1xuICAgICAgICAvLyBXZSBlbWl0IHVwbG9hZC1zdGFydGVkIGhlcmUsIHNvIHRoYXQgaXQncyBhbHNvIGVtaXR0ZWQgZm9yIGZpbGVzXG4gICAgICAgIC8vIHRoYXQgaGF2ZSB0byB3YWl0IGR1ZSB0byB0aGUgYGxpbWl0YCBvcHRpb24uXG4gICAgICAgIC8vIERvbid0IGRvdWJsZS1lbWl0IHVwbG9hZC1zdGFydGVkIGZvciBHb2xkZW4gUmV0cmlldmVyLXJlc3RvcmVkIGZpbGVzIHRoYXQgd2VyZSBhbHJlYWR5IHN0YXJ0ZWRcbiAgICAgICAgaWYgKCFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHwgIWZpbGUuaXNSZXN0b3JlZCkge1xuICAgICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3RhcnRlZCcsIGZpbGUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudXBsb2FkUmVtb3RlKGZpbGUsIGN1cnJlbnQsIHRvdGFsKVxuICAgICAgfVxuICAgICAgLy8gRG9uJ3QgZG91YmxlLWVtaXQgdXBsb2FkLXN0YXJ0ZWQgZm9yIEdvbGRlbiBSZXRyaWV2ZXItcmVzdG9yZWQgZmlsZXMgdGhhdCB3ZXJlIGFscmVhZHkgc3RhcnRlZFxuICAgICAgaWYgKCFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHwgIWZpbGUuaXNSZXN0b3JlZCkge1xuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN0YXJ0ZWQnLCBmaWxlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMudXBsb2FkKGZpbGUsIGN1cnJlbnQsIHRvdGFsKVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2V0dGxlKHByb21pc2VzKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGZpbGVJRHNcbiAgICovXG4gIGhhbmRsZVVwbG9hZCAoZmlsZUlEcykge1xuICAgIGlmIChmaWxlSURzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy51cHB5LmxvZygnW1R1c10gTm8gZmlsZXMgdG8gdXBsb2FkJylcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMubGltaXQgPT09IDApIHtcbiAgICAgIHRoaXMudXBweS5sb2coXG4gICAgICAgICdbVHVzXSBXaGVuIHVwbG9hZGluZyBtdWx0aXBsZSBmaWxlcyBhdCBvbmNlLCBjb25zaWRlciBzZXR0aW5nIHRoZSBgbGltaXRgIG9wdGlvbiAodG8gYDEwYCBmb3IgZXhhbXBsZSksIHRvIGxpbWl0IHRoZSBudW1iZXIgb2YgY29uY3VycmVudCB1cGxvYWRzLCB3aGljaCBoZWxwcyBwcmV2ZW50IG1lbW9yeSBhbmQgbmV0d29yayBpc3N1ZXM6IGh0dHBzOi8vdXBweS5pby9kb2NzL3R1cy8jbGltaXQtMCcsXG4gICAgICAgICd3YXJuaW5nJ1xuICAgICAgKVxuICAgIH1cblxuICAgIHRoaXMudXBweS5sb2coJ1tUdXNdIFVwbG9hZGluZy4uLicpXG4gICAgY29uc3QgZmlsZXNUb1VwbG9hZCA9IGZpbGVJRHMubWFwKChmaWxlSUQpID0+IHRoaXMudXBweS5nZXRGaWxlKGZpbGVJRCkpXG5cbiAgICByZXR1cm4gdGhpcy51cGxvYWRGaWxlcyhmaWxlc1RvVXBsb2FkKVxuICAgICAgLnRoZW4oKCkgPT4gbnVsbClcbiAgfVxuXG4gIGluc3RhbGwgKCkge1xuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBjYXBhYmlsaXRpZXM6IHsgLi4udGhpcy51cHB5LmdldFN0YXRlKCkuY2FwYWJpbGl0aWVzLCByZXN1bWFibGVVcGxvYWRzOiB0cnVlIH0sXG4gICAgfSlcbiAgICB0aGlzLnVwcHkuYWRkVXBsb2FkZXIodGhpcy5oYW5kbGVVcGxvYWQpXG5cbiAgICB0aGlzLnVwcHkub24oJ3Jlc2V0LXByb2dyZXNzJywgdGhpcy5oYW5kbGVSZXNldFByb2dyZXNzKVxuICB9XG5cbiAgdW5pbnN0YWxsICgpIHtcbiAgICB0aGlzLnVwcHkuc2V0U3RhdGUoe1xuICAgICAgY2FwYWJpbGl0aWVzOiB7IC4uLnRoaXMudXBweS5nZXRTdGF0ZSgpLmNhcGFiaWxpdGllcywgcmVzdW1hYmxlVXBsb2FkczogZmFsc2UgfSxcbiAgICB9KVxuICAgIHRoaXMudXBweS5yZW1vdmVVcGxvYWRlcih0aGlzLmhhbmRsZVVwbG9hZClcbiAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGUgYSB3cmFwcGVyIGFyb3VuZCBhbiBldmVudCBlbWl0dGVyIHdpdGggYSBgcmVtb3ZlYCBtZXRob2QgdG8gcmVtb3ZlXG4gKiBhbGwgZXZlbnRzIHRoYXQgd2VyZSBhZGRlZCB1c2luZyB0aGUgd3JhcHBlZCBlbWl0dGVyLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEV2ZW50VHJhY2tlciB7XG4gICNlbWl0dGVyXG5cbiAgI2V2ZW50cyA9IFtdXG5cbiAgY29uc3RydWN0b3IgKGVtaXR0ZXIpIHtcbiAgICB0aGlzLiNlbWl0dGVyID0gZW1pdHRlclxuICB9XG5cbiAgb24gKGV2ZW50LCBmbikge1xuICAgIHRoaXMuI2V2ZW50cy5wdXNoKFtldmVudCwgZm5dKVxuICAgIHJldHVybiB0aGlzLiNlbWl0dGVyLm9uKGV2ZW50LCBmbilcbiAgfVxuXG4gIHJlbW92ZSAoKSB7XG4gICAgZm9yIChjb25zdCBbZXZlbnQsIGZuXSBvZiB0aGlzLiNldmVudHMuc3BsaWNlKDApKSB7XG4gICAgICB0aGlzLiNlbWl0dGVyLm9mZihldmVudCwgZm4pXG4gICAgfVxuICB9XG59XG4iLCJjbGFzcyBOZXR3b3JrRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yIChlcnJvciwgeGhyID0gbnVsbCkge1xuICAgIHN1cGVyKGBUaGlzIGxvb2tzIGxpa2UgYSBuZXR3b3JrIGVycm9yLCB0aGUgZW5kcG9pbnQgbWlnaHQgYmUgYmxvY2tlZCBieSBhbiBpbnRlcm5ldCBwcm92aWRlciBvciBhIGZpcmV3YWxsLmApXG5cbiAgICB0aGlzLmNhdXNlID0gZXJyb3JcbiAgICB0aGlzLmlzTmV0d29ya0Vycm9yID0gdHJ1ZVxuICAgIHRoaXMucmVxdWVzdCA9IHhoclxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmV0d29ya0Vycm9yXG4iLCJmdW5jdGlvbiBjcmVhdGVDYW5jZWxFcnJvciAoKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ0NhbmNlbGxlZCcpXG59XG5cbmNsYXNzIFJhdGVMaW1pdGVkUXVldWUge1xuICAjYWN0aXZlUmVxdWVzdHMgPSAwXG5cbiAgI3F1ZXVlZEhhbmRsZXJzID0gW11cblxuICBjb25zdHJ1Y3RvciAobGltaXQpIHtcbiAgICBpZiAodHlwZW9mIGxpbWl0ICE9PSAnbnVtYmVyJyB8fCBsaW1pdCA9PT0gMCkge1xuICAgICAgdGhpcy5saW1pdCA9IEluZmluaXR5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGltaXQgPSBsaW1pdFxuICAgIH1cbiAgfVxuXG4gICNjYWxsIChmbikge1xuICAgIHRoaXMuI2FjdGl2ZVJlcXVlc3RzICs9IDFcblxuICAgIGxldCBkb25lID0gZmFsc2VcblxuICAgIGxldCBjYW5jZWxBY3RpdmVcbiAgICB0cnkge1xuICAgICAgY2FuY2VsQWN0aXZlID0gZm4oKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgLT0gMVxuICAgICAgdGhyb3cgZXJyXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiAoKSA9PiB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm5cbiAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgLT0gMVxuICAgICAgICBjYW5jZWxBY3RpdmUoKVxuICAgICAgICB0aGlzLiNxdWV1ZU5leHQoKVxuICAgICAgfSxcblxuICAgICAgZG9uZTogKCkgPT4ge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuXG4gICAgICAgIGRvbmUgPSB0cnVlXG4gICAgICAgIHRoaXMuI2FjdGl2ZVJlcXVlc3RzIC09IDFcbiAgICAgICAgdGhpcy4jcXVldWVOZXh0KClcbiAgICAgIH0sXG4gICAgfVxuICB9XG5cbiAgI3F1ZXVlTmV4dCAoKSB7XG4gICAgLy8gRG8gaXQgc29vbiBidXQgbm90IGltbWVkaWF0ZWx5LCB0aGlzIGFsbG93cyBjbGVhcmluZyBvdXQgdGhlIGVudGlyZSBxdWV1ZSBzeW5jaHJvbm91c2x5XG4gICAgLy8gb25lIGJ5IG9uZSB3aXRob3V0IGNvbnRpbnVvdXNseSBfYWR2YW5jaW5nXyBpdCAoYW5kIHN0YXJ0aW5nIG5ldyB0YXNrcyBiZWZvcmUgaW1tZWRpYXRlbHlcbiAgICAvLyBhYm9ydGluZyB0aGVtKVxuICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHRoaXMuI25leHQoKSlcbiAgfVxuXG4gICNuZXh0ICgpIHtcbiAgICBpZiAodGhpcy4jYWN0aXZlUmVxdWVzdHMgPj0gdGhpcy5saW1pdCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLiNxdWV1ZWRIYW5kbGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIERpc3BhdGNoIHRoZSBuZXh0IHJlcXVlc3QsIGFuZCB1cGRhdGUgdGhlIGFib3J0L2RvbmUgaGFuZGxlcnNcbiAgICAvLyBzbyB0aGF0IGNhbmNlbGxpbmcgaXQgZG9lcyB0aGUgUmlnaHQgVGhpbmcgKGFuZCBkb2Vzbid0IGp1c3QgdHJ5XG4gICAgLy8gdG8gZGVxdWV1ZSBhbiBhbHJlYWR5LXJ1bm5pbmcgcmVxdWVzdCkuXG4gICAgY29uc3QgbmV4dCA9IHRoaXMuI3F1ZXVlZEhhbmRsZXJzLnNoaWZ0KClcbiAgICBjb25zdCBoYW5kbGVyID0gdGhpcy4jY2FsbChuZXh0LmZuKVxuICAgIG5leHQuYWJvcnQgPSBoYW5kbGVyLmFib3J0XG4gICAgbmV4dC5kb25lID0gaGFuZGxlci5kb25lXG4gIH1cblxuICAjcXVldWUgKGZuLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBoYW5kbGVyID0ge1xuICAgICAgZm4sXG4gICAgICBwcmlvcml0eTogb3B0aW9ucy5wcmlvcml0eSB8fCAwLFxuICAgICAgYWJvcnQ6ICgpID0+IHtcbiAgICAgICAgdGhpcy4jZGVxdWV1ZShoYW5kbGVyKVxuICAgICAgfSxcbiAgICAgIGRvbmU6ICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbWFyayBhIHF1ZXVlZCByZXF1ZXN0IGFzIGRvbmU6IHRoaXMgaW5kaWNhdGVzIGEgYnVnJylcbiAgICAgIH0sXG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLiNxdWV1ZWRIYW5kbGVycy5maW5kSW5kZXgoKG90aGVyKSA9PiB7XG4gICAgICByZXR1cm4gaGFuZGxlci5wcmlvcml0eSA+IG90aGVyLnByaW9yaXR5XG4gICAgfSlcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aGlzLiNxdWV1ZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI3F1ZXVlZEhhbmRsZXJzLnNwbGljZShpbmRleCwgMCwgaGFuZGxlcilcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZXJcbiAgfVxuXG4gICNkZXF1ZXVlIChoYW5kbGVyKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLiNxdWV1ZWRIYW5kbGVycy5pbmRleE9mKGhhbmRsZXIpXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy4jcXVldWVkSGFuZGxlcnMuc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cbiAgfVxuXG4gIHJ1biAoZm4sIHF1ZXVlT3B0aW9ucykge1xuICAgIGlmICh0aGlzLiNhY3RpdmVSZXF1ZXN0cyA8IHRoaXMubGltaXQpIHtcbiAgICAgIHJldHVybiB0aGlzLiNjYWxsKGZuKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy4jcXVldWUoZm4sIHF1ZXVlT3B0aW9ucylcbiAgfVxuXG4gIHdyYXBQcm9taXNlRnVuY3Rpb24gKGZuLCBxdWV1ZU9wdGlvbnMpIHtcbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGxldCBxdWV1ZWRSZXF1ZXN0XG4gICAgICBjb25zdCBvdXRlclByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgbGV0IGNhbmNlbEVycm9yXG4gICAgICAgICAgbGV0IGlubmVyUHJvbWlzZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpbm5lclByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoZm4oLi4uYXJncykpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpbm5lclByb21pc2UgPSBQcm9taXNlLnJlamVjdChlcnIpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaW5uZXJQcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNhbmNlbEVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChjYW5jZWxFcnJvcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmIChjYW5jZWxFcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoY2FuY2VsRXJyb3IpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKVxuICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY2FuY2VsRXJyb3IgPSBjcmVhdGVDYW5jZWxFcnJvcigpXG4gICAgICAgICAgfVxuICAgICAgICB9LCBxdWV1ZU9wdGlvbnMpXG4gICAgICB9KVxuXG4gICAgICBvdXRlclByb21pc2UuYWJvcnQgPSAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0ZXJQcm9taXNlXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBSYXRlTGltaXRlZFF1ZXVlLFxuICBpbnRlcm5hbFJhdGVMaW1pdGVkUXVldWU6IFN5bWJvbCgnX19xdWV1ZScpLFxufVxuIiwiY29uc3QgaGFzID0gcmVxdWlyZSgnLi9oYXNQcm9wZXJ0eScpXG5cbmZ1bmN0aW9uIGluc2VydFJlcGxhY2VtZW50IChzb3VyY2UsIHJ4LCByZXBsYWNlbWVudCkge1xuICBjb25zdCBuZXdQYXJ0cyA9IFtdXG4gIHNvdXJjZS5mb3JFYWNoKChjaHVuaykgPT4ge1xuICAgIC8vIFdoZW4gdGhlIHNvdXJjZSBjb250YWlucyBtdWx0aXBsZSBwbGFjZWhvbGRlcnMgZm9yIGludGVycG9sYXRpb24sXG4gICAgLy8gd2Ugc2hvdWxkIGlnbm9yZSBjaHVua3MgdGhhdCBhcmUgbm90IHN0cmluZ3MsIGJlY2F1c2UgdGhvc2VcbiAgICAvLyBjYW4gYmUgSlNYIG9iamVjdHMgYW5kIHdpbGwgYmUgb3RoZXJ3aXNlIGluY29ycmVjdGx5IHR1cm5lZCBpbnRvIHN0cmluZ3MuXG4gICAgLy8gV2l0aG91dCB0aGlzIGNvbmRpdGlvbiB3ZeKAmWQgZ2V0IHRoaXM6IFtvYmplY3QgT2JqZWN0XSBoZWxsbyBbb2JqZWN0IE9iamVjdF0gbXkgPGJ1dHRvbj5cbiAgICBpZiAodHlwZW9mIGNodW5rICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ld1BhcnRzLnB1c2goY2h1bmspXG4gICAgfVxuXG4gICAgcmV0dXJuIHJ4W1N5bWJvbC5zcGxpdF0oY2h1bmspLmZvckVhY2goKHJhdywgaSwgbGlzdCkgPT4ge1xuICAgICAgaWYgKHJhdyAhPT0gJycpIHtcbiAgICAgICAgbmV3UGFydHMucHVzaChyYXcpXG4gICAgICB9XG5cbiAgICAgIC8vIEludGVybGFjZSB3aXRoIHRoZSBgcmVwbGFjZW1lbnRgIHZhbHVlXG4gICAgICBpZiAoaSA8IGxpc3QubGVuZ3RoIC0gMSkge1xuICAgICAgICBuZXdQYXJ0cy5wdXNoKHJlcGxhY2VtZW50KVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG4gIHJldHVybiBuZXdQYXJ0c1xufVxuXG4vKipcbiAqIFRha2VzIGEgc3RyaW5nIHdpdGggcGxhY2Vob2xkZXIgdmFyaWFibGVzIGxpa2UgYCV7c21hcnRfY291bnR9IGZpbGUgc2VsZWN0ZWRgXG4gKiBhbmQgcmVwbGFjZXMgaXQgd2l0aCB2YWx1ZXMgZnJvbSBvcHRpb25zIGB7c21hcnRfY291bnQ6IDV9YFxuICpcbiAqIEBsaWNlbnNlIGh0dHBzOi8vZ2l0aHViLmNvbS9haXJibmIvcG9seWdsb3QuanMvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICogdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYWlyYm5iL3BvbHlnbG90LmpzL2Jsb2IvbWFzdGVyL2xpYi9wb2x5Z2xvdC5qcyNMMjk5XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBocmFzZSB0aGF0IG5lZWRzIGludGVycG9sYXRpb24sIHdpdGggcGxhY2Vob2xkZXJzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyB3aXRoIHZhbHVlcyB0aGF0IHdpbGwgYmUgdXNlZCB0byByZXBsYWNlIHBsYWNlaG9sZGVyc1xuICogQHJldHVybnMge2FueVtdfSBpbnRlcnBvbGF0ZWRcbiAqL1xuZnVuY3Rpb24gaW50ZXJwb2xhdGUgKHBocmFzZSwgb3B0aW9ucykge1xuICBjb25zdCBkb2xsYXJSZWdleCA9IC9cXCQvZ1xuICBjb25zdCBkb2xsYXJCaWxsc1lhbGwgPSAnJCQkJCdcbiAgbGV0IGludGVycG9sYXRlZCA9IFtwaHJhc2VdXG5cbiAgaWYgKG9wdGlvbnMgPT0gbnVsbCkgcmV0dXJuIGludGVycG9sYXRlZFxuXG4gIGZvciAoY29uc3QgYXJnIG9mIE9iamVjdC5rZXlzKG9wdGlvbnMpKSB7XG4gICAgaWYgKGFyZyAhPT0gJ18nKSB7XG4gICAgICAvLyBFbnN1cmUgcmVwbGFjZW1lbnQgdmFsdWUgaXMgZXNjYXBlZCB0byBwcmV2ZW50IHNwZWNpYWwgJC1wcmVmaXhlZFxuICAgICAgLy8gcmVnZXggcmVwbGFjZSB0b2tlbnMuIHRoZSBcIiQkJCRcIiBpcyBuZWVkZWQgYmVjYXVzZSBlYWNoIFwiJFwiIG5lZWRzIHRvXG4gICAgICAvLyBiZSBlc2NhcGVkIHdpdGggXCIkXCIgaXRzZWxmLCBhbmQgd2UgbmVlZCB0d28gaW4gdGhlIHJlc3VsdGluZyBvdXRwdXQuXG4gICAgICBsZXQgcmVwbGFjZW1lbnQgPSBvcHRpb25zW2FyZ11cbiAgICAgIGlmICh0eXBlb2YgcmVwbGFjZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlcGxhY2VtZW50ID0gZG9sbGFyUmVnZXhbU3ltYm9sLnJlcGxhY2VdKHJlcGxhY2VtZW50LCBkb2xsYXJCaWxsc1lhbGwpXG4gICAgICB9XG4gICAgICAvLyBXZSBjcmVhdGUgYSBuZXcgYFJlZ0V4cGAgZWFjaCB0aW1lIGluc3RlYWQgb2YgdXNpbmcgYSBtb3JlLWVmZmljaWVudFxuICAgICAgLy8gc3RyaW5nIHJlcGxhY2Ugc28gdGhhdCB0aGUgc2FtZSBhcmd1bWVudCBjYW4gYmUgcmVwbGFjZWQgbXVsdGlwbGUgdGltZXNcbiAgICAgIC8vIGluIHRoZSBzYW1lIHBocmFzZS5cbiAgICAgIGludGVycG9sYXRlZCA9IGluc2VydFJlcGxhY2VtZW50KGludGVycG9sYXRlZCwgbmV3IFJlZ0V4cChgJVxcXFx7JHthcmd9XFxcXH1gLCAnZycpLCByZXBsYWNlbWVudClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW50ZXJwb2xhdGVkXG59XG5cbi8qKlxuICogVHJhbnNsYXRlcyBzdHJpbmdzIHdpdGggaW50ZXJwb2xhdGlvbiAmIHBsdXJhbGl6YXRpb24gc3VwcG9ydC5cbiAqIEV4dGVuc2libGUgd2l0aCBjdXN0b20gZGljdGlvbmFyaWVzIGFuZCBwbHVyYWxpemF0aW9uIGZ1bmN0aW9ucy5cbiAqXG4gKiBCb3Jyb3dzIGhlYXZpbHkgZnJvbSBhbmQgaW5zcGlyZWQgYnkgUG9seWdsb3QgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcyxcbiAqIGJhc2ljYWxseSBhIHN0cmlwcGVkLWRvd24gdmVyc2lvbiBvZiBpdC4gRGlmZmVyZW5jZXM6IHBsdXJhbGl6YXRpb24gZnVuY3Rpb25zIGFyZSBub3QgaGFyZGNvZGVkXG4gKiBhbmQgY2FuIGJlIGVhc2lseSBhZGRlZCBhbW9uZyB3aXRoIGRpY3Rpb25hcmllcywgbmVzdGVkIG9iamVjdHMgYXJlIHVzZWQgZm9yIHBsdXJhbGl6YXRpb25cbiAqIGFzIG9wcG9zZWQgdG8gYHx8fHxgIGRlbGltZXRlclxuICpcbiAqIFVzYWdlIGV4YW1wbGU6IGB0cmFuc2xhdG9yLnRyYW5zbGF0ZSgnZmlsZXNfY2hvc2VuJywge3NtYXJ0X2NvdW50OiAzfSlgXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHJhbnNsYXRvciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdHxBcnJheTxvYmplY3Q+fSBsb2NhbGVzIC0gbG9jYWxlIG9yIGxpc3Qgb2YgbG9jYWxlcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yIChsb2NhbGVzKSB7XG4gICAgdGhpcy5sb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7fSxcbiAgICAgIHBsdXJhbGl6ZSAobikge1xuICAgICAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDFcbiAgICAgIH0sXG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobG9jYWxlcykpIHtcbiAgICAgIGxvY2FsZXMuZm9yRWFjaCh0aGlzLiNhcHBseSwgdGhpcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jYXBwbHkobG9jYWxlcylcbiAgICB9XG4gIH1cblxuICAjYXBwbHkgKGxvY2FsZSkge1xuICAgIGlmICghbG9jYWxlPy5zdHJpbmdzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBwcmV2TG9jYWxlID0gdGhpcy5sb2NhbGVcbiAgICB0aGlzLmxvY2FsZSA9IHsgLi4ucHJldkxvY2FsZSwgc3RyaW5nczogeyAuLi5wcmV2TG9jYWxlLnN0cmluZ3MsIC4uLmxvY2FsZS5zdHJpbmdzIH0gfVxuICAgIHRoaXMubG9jYWxlLnBsdXJhbGl6ZSA9IGxvY2FsZS5wbHVyYWxpemUgfHwgcHJldkxvY2FsZS5wbHVyYWxpemVcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgdHJhbnNsYXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIGxhdGVyIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzIGluIHN0cmluZ1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0cmFuc2xhdGVkIChhbmQgaW50ZXJwb2xhdGVkKVxuICAgKi9cbiAgdHJhbnNsYXRlIChrZXksIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVBcnJheShrZXksIG9wdGlvbnMpLmpvaW4oJycpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgdHJhbnNsYXRpb24gYW5kIHJldHVybiB0aGUgdHJhbnNsYXRlZCBhbmQgaW50ZXJwb2xhdGVkIHBhcnRzIGFzIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzXG4gICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHRyYW5zbGF0ZWQgYW5kIGludGVycG9sYXRlZCBwYXJ0cywgaW4gb3JkZXIuXG4gICAqL1xuICB0cmFuc2xhdGVBcnJheSAoa2V5LCBvcHRpb25zKSB7XG4gICAgaWYgKCFoYXModGhpcy5sb2NhbGUuc3RyaW5ncywga2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBtaXNzaW5nIHN0cmluZzogJHtrZXl9YClcbiAgICB9XG5cbiAgICBjb25zdCBzdHJpbmcgPSB0aGlzLmxvY2FsZS5zdHJpbmdzW2tleV1cbiAgICBjb25zdCBoYXNQbHVyYWxGb3JtcyA9IHR5cGVvZiBzdHJpbmcgPT09ICdvYmplY3QnXG5cbiAgICBpZiAoaGFzUGx1cmFsRm9ybXMpIHtcbiAgICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnNtYXJ0X2NvdW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zdCBwbHVyYWwgPSB0aGlzLmxvY2FsZS5wbHVyYWxpemUob3B0aW9ucy5zbWFydF9jb3VudClcbiAgICAgICAgcmV0dXJuIGludGVycG9sYXRlKHN0cmluZ1twbHVyYWxdLCBvcHRpb25zKVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0ZWQgdG8gdXNlIGEgc3RyaW5nIHdpdGggcGx1cmFsIGZvcm1zLCBidXQgbm8gdmFsdWUgd2FzIGdpdmVuIGZvciAle3NtYXJ0X2NvdW50fScpXG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVycG9sYXRlKHN0cmluZywgb3B0aW9ucylcbiAgfVxufVxuIiwiY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuXG5mdW5jdGlvbiBlbWl0U29ja2V0UHJvZ3Jlc3MgKHVwbG9hZGVyLCBwcm9ncmVzc0RhdGEsIGZpbGUpIHtcbiAgY29uc3QgeyBwcm9ncmVzcywgYnl0ZXNVcGxvYWRlZCwgYnl0ZXNUb3RhbCB9ID0gcHJvZ3Jlc3NEYXRhXG4gIGlmIChwcm9ncmVzcykge1xuICAgIHVwbG9hZGVyLnVwcHkubG9nKGBVcGxvYWQgcHJvZ3Jlc3M6ICR7cHJvZ3Jlc3N9YClcbiAgICB1cGxvYWRlci51cHB5LmVtaXQoJ3VwbG9hZC1wcm9ncmVzcycsIGZpbGUsIHtcbiAgICAgIHVwbG9hZGVyLFxuICAgICAgYnl0ZXNVcGxvYWRlZCxcbiAgICAgIGJ5dGVzVG90YWwsXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlKGVtaXRTb2NrZXRQcm9ncmVzcywgMzAwLCB7XG4gIGxlYWRpbmc6IHRydWUsXG4gIHRyYWlsaW5nOiB0cnVlLFxufSlcbiIsImNvbnN0IE5ldHdvcmtFcnJvciA9IHJlcXVpcmUoJy4vTmV0d29ya0Vycm9yJylcblxuLyoqXG4gKiBXcmFwcGVyIGFyb3VuZCB3aW5kb3cuZmV0Y2ggdGhhdCB0aHJvd3MgYSBOZXR3b3JrRXJyb3Igd2hlbiBhcHByb3ByaWF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZldGNoV2l0aE5ldHdvcmtFcnJvciAoLi4ub3B0aW9ucykge1xuICByZXR1cm4gZmV0Y2goLi4ub3B0aW9ucylcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKGVyci5uYW1lID09PSAnQWJvcnRFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgTmV0d29ya0Vycm9yKGVycilcbiAgICAgIH1cbiAgICB9KVxufVxuIiwiY29uc3QgaXNET01FbGVtZW50ID0gcmVxdWlyZSgnLi9pc0RPTUVsZW1lbnQnKVxuXG4vKipcbiAqIEZpbmQgYSBET00gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge05vZGV8c3RyaW5nfSBlbGVtZW50XG4gKiBAcmV0dXJucyB7Tm9kZXxudWxsfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbmRET01FbGVtZW50IChlbGVtZW50LCBjb250ZXh0ID0gZG9jdW1lbnQpIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudClcbiAgfVxuXG4gIGlmIChpc0RPTUVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICByZXR1cm4gZWxlbWVudFxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cbiIsImZ1bmN0aW9uIGVuY29kZUNoYXJhY3RlciAoY2hhcmFjdGVyKSB7XG4gIHJldHVybiBjaGFyYWN0ZXIuY2hhckNvZGVBdCgwKS50b1N0cmluZygzMilcbn1cblxuZnVuY3Rpb24gZW5jb2RlRmlsZW5hbWUgKG5hbWUpIHtcbiAgbGV0IHN1ZmZpeCA9ICcnXG4gIHJldHVybiBuYW1lLnJlcGxhY2UoL1teQS1aMC05XS9pZywgKGNoYXJhY3RlcikgPT4ge1xuICAgIHN1ZmZpeCArPSBgLSR7ZW5jb2RlQ2hhcmFjdGVyKGNoYXJhY3Rlcil9YFxuICAgIHJldHVybiAnLydcbiAgfSkgKyBzdWZmaXhcbn1cblxuLyoqXG4gKiBUYWtlcyBhIGZpbGUgb2JqZWN0IGFuZCB0dXJucyBpdCBpbnRvIGZpbGVJRCwgYnkgY29udmVydGluZyBmaWxlLm5hbWUgdG8gbG93ZXJjYXNlLFxuICogcmVtb3ZpbmcgZXh0cmEgY2hhcmFjdGVycyBhbmQgYWRkaW5nIHR5cGUsIHNpemUgYW5kIGxhc3RNb2RpZmllZFxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZmlsZUlEXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVGaWxlSUQgKGZpbGUpIHtcbiAgLy8gSXQncyB0ZW1wdGluZyB0byBkbyBgW2l0ZW1zXS5maWx0ZXIoQm9vbGVhbikuam9pbignLScpYCBoZXJlLCBidXQgdGhhdFxuICAvLyBpcyBzbG93ZXIhIHNpbXBsZSBzdHJpbmcgY29uY2F0ZW5hdGlvbiBpcyBmYXN0XG5cbiAgbGV0IGlkID0gJ3VwcHknXG4gIGlmICh0eXBlb2YgZmlsZS5uYW1lID09PSAnc3RyaW5nJykge1xuICAgIGlkICs9IGAtJHtlbmNvZGVGaWxlbmFtZShmaWxlLm5hbWUudG9Mb3dlckNhc2UoKSl9YFxuICB9XG5cbiAgaWYgKGZpbGUudHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gYC0ke2ZpbGUudHlwZX1gXG4gIH1cblxuICBpZiAoZmlsZS5tZXRhICYmIHR5cGVvZiBmaWxlLm1ldGEucmVsYXRpdmVQYXRoID09PSAnc3RyaW5nJykge1xuICAgIGlkICs9IGAtJHtlbmNvZGVGaWxlbmFtZShmaWxlLm1ldGEucmVsYXRpdmVQYXRoLnRvTG93ZXJDYXNlKCkpfWBcbiAgfVxuXG4gIGlmIChmaWxlLmRhdGEuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gYC0ke2ZpbGUuZGF0YS5zaXplfWBcbiAgfVxuICBpZiAoZmlsZS5kYXRhLmxhc3RNb2RpZmllZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gYC0ke2ZpbGUuZGF0YS5sYXN0TW9kaWZpZWR9YFxuICB9XG5cbiAgcmV0dXJuIGlkXG59XG4iLCJjb25zdCB3ZWJraXRHZXRBc0VudHJ5QXBpID0gcmVxdWlyZSgnLi91dGlscy93ZWJraXRHZXRBc0VudHJ5QXBpL2luZGV4JylcbmNvbnN0IGZhbGxiYWNrQXBpID0gcmVxdWlyZSgnLi91dGlscy9mYWxsYmFja0FwaScpXG5cbi8qKlxuICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgYXJyYXkgb2YgZHJvcHBlZCBmaWxlcyAoaWYgYSBmb2xkZXIgaXNcbiAqIGRyb3BwZWQsIGFuZCBicm93c2VyIHN1cHBvcnRzIGZvbGRlciBwYXJzaW5nIC0gcHJvbWlzZSByZXNvbHZlcyB0byB0aGUgZmxhdFxuICogYXJyYXkgb2YgYWxsIGZpbGVzIGluIGFsbCBkaXJlY3RvcmllcykuXG4gKiBFYWNoIGZpbGUgaGFzIC5yZWxhdGl2ZVBhdGggcHJvcCBhcHBlbmRlZCB0byBpdCAoZS5nLiBcIi9kb2NzL1ByYWd1ZS90aWNrZXRfZnJvbV9wcmFndWVfdG9fdWZhLnBkZlwiKVxuICogaWYgYnJvd3NlciBzdXBwb3J0cyBpdC4gT3RoZXJ3aXNlIGl0J3MgdW5kZWZpbmVkLlxuICpcbiAqIEBwYXJhbSB7RGF0YVRyYW5zZmVyfSBkYXRhVHJhbnNmZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxvZ0Ryb3BFcnJvciAtIGEgZnVuY3Rpb24gdGhhdCdzIGNhbGxlZCBldmVyeSB0aW1lIHNvbWVcbiAqIGZvbGRlciBvciBzb21lIGZpbGUgZXJyb3Igb3V0IChlLmcuIGJlY2F1c2Ugb2YgdGhlIGZvbGRlciBuYW1lIGJlaW5nIHRvbyBsb25nXG4gKiBvbiBXaW5kb3dzKS4gTm90aWNlIHRoYXQgcmVzdWx0aW5nIHByb21pc2Ugd2lsbCBhbHdheXMgYmUgcmVzb2x2ZWQgYW55d2F5LlxuICpcbiAqIEByZXR1cm5zIHtQcm9taXNlfSAtIEFycmF5PEZpbGU+XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RHJvcHBlZEZpbGVzIChkYXRhVHJhbnNmZXIsIHsgbG9nRHJvcEVycm9yID0gKCkgPT4ge30gfSA9IHt9KSB7XG4gIC8vIEdldCBhbGwgZmlsZXMgZnJvbSBhbGwgc3ViZGlycy4gV29ya3MgKGF0IGxlYXN0KSBpbiBDaHJvbWUsIE1vemlsbGEsIGFuZCBTYWZhcmlcbiAgaWYgKGRhdGFUcmFuc2Zlci5pdGVtcz8uWzBdICYmICd3ZWJraXRHZXRBc0VudHJ5JyBpbiBkYXRhVHJhbnNmZXIuaXRlbXNbMF0pIHtcbiAgICByZXR1cm4gd2Via2l0R2V0QXNFbnRyeUFwaShkYXRhVHJhbnNmZXIsIGxvZ0Ryb3BFcnJvcilcbiAgLy8gT3RoZXJ3aXNlIGp1c3QgcmV0dXJuIGFsbCBmaXJzdC1vcmRlciBmaWxlc1xuICB9XG4gIHJldHVybiBmYWxsYmFja0FwaShkYXRhVHJhbnNmZXIpXG59XG4iLCJjb25zdCB0b0FycmF5ID0gcmVxdWlyZSgnLi4vLi4vdG9BcnJheScpXG5cbi8vIC5maWxlcyBmYWxsYmFjaywgc2hvdWxkIGJlIGltcGxlbWVudGVkIGluIGFueSBicm93c2VyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZhbGxiYWNrQXBpIChkYXRhVHJhbnNmZXIpIHtcbiAgY29uc3QgZmlsZXMgPSB0b0FycmF5KGRhdGFUcmFuc2Zlci5maWxlcylcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmaWxlcylcbn1cbiIsIi8qKlxuICogUmVjdXJzaXZlIGZ1bmN0aW9uLCBjYWxscyB0aGUgb3JpZ2luYWwgY2FsbGJhY2soKSB3aGVuIHRoZSBkaXJlY3RvcnkgaXMgZW50aXJlbHkgcGFyc2VkLlxuICpcbiAqIEBwYXJhbSB7RmlsZVN5c3RlbURpcmVjdG9yeVJlYWRlcn0gZGlyZWN0b3J5UmVhZGVyXG4gKiBAcGFyYW0ge0FycmF5fSBvbGRFbnRyaWVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsb2dEcm9wRXJyb3JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGVkIHdpdGggKFsgYWxsIGZpbGVzIGFuZCBkaXJlY3RvcmllcyBpbiB0aGF0IGRpcmVjdG9yeVJlYWRlciBdKVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEZpbGVzQW5kRGlyZWN0b3JpZXNGcm9tRGlyZWN0b3J5IChkaXJlY3RvcnlSZWFkZXIsIG9sZEVudHJpZXMsIGxvZ0Ryb3BFcnJvciwgeyBvblN1Y2Nlc3MgfSkge1xuICBkaXJlY3RvcnlSZWFkZXIucmVhZEVudHJpZXMoXG4gICAgKGVudHJpZXMpID0+IHtcbiAgICAgIGNvbnN0IG5ld0VudHJpZXMgPSBbLi4ub2xkRW50cmllcywgLi4uZW50cmllc11cbiAgICAgIC8vIEFjY29yZGluZyB0byB0aGUgRmlsZVN5c3RlbSBBUEkgc3BlYywgZ2V0RmlsZXNBbmREaXJlY3Rvcmllc0Zyb21EaXJlY3RvcnkoKVxuICAgICAgLy8gbXVzdCBiZSBjYWxsZWQgdW50aWwgaXQgY2FsbHMgdGhlIG9uU3VjY2VzcyB3aXRoIGFuIGVtcHR5IGFycmF5LlxuICAgICAgaWYgKGVudHJpZXMubGVuZ3RoKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGdldEZpbGVzQW5kRGlyZWN0b3JpZXNGcm9tRGlyZWN0b3J5KGRpcmVjdG9yeVJlYWRlciwgbmV3RW50cmllcywgbG9nRHJvcEVycm9yLCB7IG9uU3VjY2VzcyB9KVxuICAgICAgICB9LCAwKVxuICAgICAgLy8gRG9uZSBpdGVyYXRpbmcgdGhpcyBwYXJ0aWN1bGFyIGRpcmVjdG9yeVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25TdWNjZXNzKG5ld0VudHJpZXMpXG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBNYWtlIHN1cmUgd2UgcmVzb2x2ZSBvbiBlcnJvciBhbnl3YXksIGl0J3MgZmluZSBpZiBvbmx5IG9uZSBkaXJlY3RvcnkgY291bGRuJ3QgYmUgcGFyc2VkIVxuICAgIChlcnJvcikgPT4ge1xuICAgICAgbG9nRHJvcEVycm9yKGVycm9yKVxuICAgICAgb25TdWNjZXNzKG9sZEVudHJpZXMpXG4gICAgfVxuICApXG59XG4iLCIvKipcbiAqIEdldCB0aGUgcmVsYXRpdmUgcGF0aCBmcm9tIHRoZSBGaWxlRW50cnkjZnVsbFBhdGgsIGJlY2F1c2UgRmlsZSN3ZWJraXRSZWxhdGl2ZVBhdGggaXMgYWx3YXlzICcnLCBhdCBsZWFzdCBvbkRyb3AuXG4gKlxuICogQHBhcmFtIHtGaWxlRW50cnl9IGZpbGVFbnRyeVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd8bnVsbH0gLSBpZiBmaWxlIGlzIG5vdCBpbiBhIGZvbGRlciAtIHJldHVybiBudWxsICh0aGlzIGlzIHRvXG4gKiBiZSBjb25zaXN0ZW50IHdpdGggLnJlbGF0aXZlUGF0aC1zIG9mIGZpbGVzIHNlbGVjdGVkIGZyb20gTXkgRGV2aWNlKS4gSWYgZmlsZVxuICogaXMgaW4gYSBmb2xkZXIgLSByZXR1cm4gaXRzIGZ1bGxQYXRoLCBlLmcuICcvc2ltcHNvbnMvaGkuanBlZycuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0UmVsYXRpdmVQYXRoIChmaWxlRW50cnkpIHtcbiAgLy8gZmlsZUVudHJ5LmZ1bGxQYXRoIC0gXCIvc2ltcHNvbnMvaGkuanBlZ1wiIG9yIHVuZGVmaW5lZCAoZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBpdClcbiAgLy8gZmlsZUVudHJ5Lm5hbWUgLSBcImhpLmpwZWdcIlxuICBpZiAoIWZpbGVFbnRyeS5mdWxsUGF0aCB8fCBmaWxlRW50cnkuZnVsbFBhdGggPT09IGAvJHtmaWxlRW50cnkubmFtZX1gKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICByZXR1cm4gZmlsZUVudHJ5LmZ1bGxQYXRoXG59XG4iLCJjb25zdCB0b0FycmF5ID0gcmVxdWlyZSgnLi4vLi4vLi4vdG9BcnJheScpXG5jb25zdCBnZXRSZWxhdGl2ZVBhdGggPSByZXF1aXJlKCcuL2dldFJlbGF0aXZlUGF0aCcpXG5jb25zdCBnZXRGaWxlc0FuZERpcmVjdG9yaWVzRnJvbURpcmVjdG9yeSA9IHJlcXVpcmUoJy4vZ2V0RmlsZXNBbmREaXJlY3Rvcmllc0Zyb21EaXJlY3RvcnknKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdlYmtpdEdldEFzRW50cnlBcGkgKGRhdGFUcmFuc2ZlciwgbG9nRHJvcEVycm9yKSB7XG4gIGNvbnN0IGZpbGVzID0gW11cblxuICBjb25zdCByb290UHJvbWlzZXMgPSBbXVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZSwgd2hlbiA6ZmlsZXMgYXJyYXkgaXMgZW5oYW5jZWRcbiAgICpcbiAgICogQHBhcmFtIHsoRmlsZVN5c3RlbUZpbGVFbnRyeXxGaWxlU3lzdGVtRGlyZWN0b3J5RW50cnkpfSBlbnRyeVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gLSBlbXB0eSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiA6ZmlsZXMgaXMgZW5oYW5jZWQgd2l0aCBhIGZpbGVcbiAgICovXG4gIGNvbnN0IGNyZWF0ZVByb21pc2VUb0FkZEZpbGVPclBhcnNlRGlyZWN0b3J5ID0gKGVudHJ5KSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIC8vIFRoaXMgaXMgYSBiYXNlIGNhbGxcbiAgICBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgICAvLyBDcmVhdGVzIGEgbmV3IEZpbGUgb2JqZWN0IHdoaWNoIGNhbiBiZSB1c2VkIHRvIHJlYWQgdGhlIGZpbGUuXG4gICAgICBlbnRyeS5maWxlKFxuICAgICAgICAoZmlsZSkgPT4ge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgIGZpbGUucmVsYXRpdmVQYXRoID0gZ2V0UmVsYXRpdmVQYXRoKGVudHJ5KVxuICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSlcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSxcbiAgICAgICAgLy8gTWFrZSBzdXJlIHdlIHJlc29sdmUgb24gZXJyb3IgYW55d2F5LCBpdCdzIGZpbmUgaWYgb25seSBvbmUgZmlsZSBjb3VsZG4ndCBiZSByZWFkIVxuICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICBsb2dEcm9wRXJyb3IoZXJyb3IpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIC8vIFRoaXMgaXMgYSByZWN1cnNpdmUgY2FsbFxuICAgIH0gZWxzZSBpZiAoZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgIGNvbnN0IGRpcmVjdG9yeVJlYWRlciA9IGVudHJ5LmNyZWF0ZVJlYWRlcigpXG4gICAgICBnZXRGaWxlc0FuZERpcmVjdG9yaWVzRnJvbURpcmVjdG9yeShkaXJlY3RvcnlSZWFkZXIsIFtdLCBsb2dEcm9wRXJyb3IsIHtcbiAgICAgICAgb25TdWNjZXNzOiAoZW50cmllcykgPT4gcmVzb2x2ZShQcm9taXNlLmFsbChcbiAgICAgICAgICBlbnRyaWVzLm1hcChjcmVhdGVQcm9taXNlVG9BZGRGaWxlT3JQYXJzZURpcmVjdG9yeSlcbiAgICAgICAgKSksXG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICAvLyBGb3IgZWFjaCBkcm9wcGVkIGl0ZW0sIC0gbWFrZSBzdXJlIGl0J3MgYSBmaWxlL2RpcmVjdG9yeSwgYW5kIHN0YXJ0IGRlZXBlbmluZyBpbiFcbiAgdG9BcnJheShkYXRhVHJhbnNmZXIuaXRlbXMpXG4gICAgLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gaXRlbS53ZWJraXRHZXRBc0VudHJ5KClcbiAgICAgIC8vIDplbnRyeSBjYW4gYmUgbnVsbCB3aGVuIHdlIGRyb3AgdGhlIHVybCBlLmcuXG4gICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgcm9vdFByb21pc2VzLnB1c2goY3JlYXRlUHJvbWlzZVRvQWRkRmlsZU9yUGFyc2VEaXJlY3RvcnkoZW50cnkpKVxuICAgICAgfVxuICAgIH0pXG5cbiAgcmV0dXJuIFByb21pc2UuYWxsKHJvb3RQcm9taXNlcylcbiAgICAudGhlbigoKSA9PiBmaWxlcylcbn1cbiIsIi8qKlxuICogVGFrZXMgYSBmdWxsIGZpbGVuYW1lIHN0cmluZyBhbmQgcmV0dXJucyBhbiBvYmplY3Qge25hbWUsIGV4dGVuc2lvbn1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZnVsbEZpbGVOYW1lXG4gKiBAcmV0dXJucyB7b2JqZWN0fSB7bmFtZSwgZXh0ZW5zaW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uIChmdWxsRmlsZU5hbWUpIHtcbiAgY29uc3QgbGFzdERvdCA9IGZ1bGxGaWxlTmFtZS5sYXN0SW5kZXhPZignLicpXG4gIC8vIHRoZXNlIGNvdW50IGFzIG5vIGV4dGVuc2lvbjogXCJuby1kb3RcIiwgXCJ0cmFpbGluZy1kb3QuXCJcbiAgaWYgKGxhc3REb3QgPT09IC0xIHx8IGxhc3REb3QgPT09IGZ1bGxGaWxlTmFtZS5sZW5ndGggLSAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGZ1bGxGaWxlTmFtZSxcbiAgICAgIGV4dGVuc2lvbjogdW5kZWZpbmVkLFxuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIG5hbWU6IGZ1bGxGaWxlTmFtZS5zbGljZSgwLCBsYXN0RG90KSxcbiAgICBleHRlbnNpb246IGZ1bGxGaWxlTmFtZS5zbGljZShsYXN0RG90ICsgMSksXG4gIH1cbn1cbiIsImNvbnN0IGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uID0gcmVxdWlyZSgnLi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpXG5jb25zdCBtaW1lVHlwZXMgPSByZXF1aXJlKCcuL21pbWVUeXBlcycpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZVR5cGUgKGZpbGUpIHtcbiAgaWYgKGZpbGUudHlwZSkgcmV0dXJuIGZpbGUudHlwZVxuXG4gIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBmaWxlLm5hbWUgPyBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbihmaWxlLm5hbWUpLmV4dGVuc2lvbj8udG9Mb3dlckNhc2UoKSA6IG51bGxcbiAgaWYgKGZpbGVFeHRlbnNpb24gJiYgZmlsZUV4dGVuc2lvbiBpbiBtaW1lVHlwZXMpIHtcbiAgICAvLyBlbHNlLCBzZWUgaWYgd2UgY2FuIG1hcCBleHRlbnNpb24gdG8gYSBtaW1lIHR5cGVcbiAgICByZXR1cm4gbWltZVR5cGVzW2ZpbGVFeHRlbnNpb25dXG4gIH1cbiAgLy8gaWYgYWxsIGZhaWxzLCBmYWxsIGJhY2sgdG8gYSBnZW5lcmljIGJ5dGUgc3RyZWFtIHR5cGVcbiAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFNvY2tldEhvc3QgKHVybCkge1xuICAvLyBnZXQgdGhlIGhvc3QgZG9tYWluXG4gIGNvbnN0IHJlZ2V4ID0gL14oPzpodHRwcz86XFwvXFwvfFxcL1xcLyk/KD86W15AXFxuXStAKT8oPzp3d3dcXC4pPyhbXlxcbl0rKS9pXG4gIGNvbnN0IGhvc3QgPSByZWdleC5leGVjKHVybClbMV1cbiAgY29uc3Qgc29ja2V0UHJvdG9jb2wgPSAvXmh0dHA6XFwvXFwvL2kudGVzdCh1cmwpID8gJ3dzJyA6ICd3c3MnXG5cbiAgcmV0dXJuIGAke3NvY2tldFByb3RvY29sfTovLyR7aG9zdH1gXG59XG4iLCIvKipcbiAqIEFkZHMgemVybyB0byBzdHJpbmdzIHNob3J0ZXIgdGhhbiB0d28gY2hhcmFjdGVycy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBwYWQgKG51bWJlcikge1xuICByZXR1cm4gbnVtYmVyIDwgMTAgPyBgMCR7bnVtYmVyfWAgOiBudW1iZXIudG9TdHJpbmcoKVxufVxuXG4vKipcbiAqIFJldHVybnMgYSB0aW1lc3RhbXAgaW4gdGhlIGZvcm1hdCBvZiBgaG91cnM6bWludXRlczpzZWNvbmRzYFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFRpbWVTdGFtcCAoKSB7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpXG4gIGNvbnN0IGhvdXJzID0gcGFkKGRhdGUuZ2V0SG91cnMoKSlcbiAgY29uc3QgbWludXRlcyA9IHBhZChkYXRlLmdldE1pbnV0ZXMoKSlcbiAgY29uc3Qgc2Vjb25kcyA9IHBhZChkYXRlLmdldFNlY29uZHMoKSlcbiAgcmV0dXJuIGAke2hvdXJzfToke21pbnV0ZXN9OiR7c2Vjb25kc31gXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhcyAob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSlcbn1cbiIsIi8qKlxuICogQ2hlY2sgaWYgYW4gb2JqZWN0IGlzIGEgRE9NIGVsZW1lbnQuIER1Y2stdHlwaW5nIGJhc2VkIG9uIGBub2RlVHlwZWAuXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0RPTUVsZW1lbnQgKG9iaikge1xuICByZXR1cm4gb2JqPy5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREVcbn1cbiIsIi8qKlxuICogQ2hlY2tzIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIERyYWcgJiBEcm9wIChub3Qgc3VwcG9ydGVkIG9uIG1vYmlsZSBkZXZpY2VzLCBmb3IgZXhhbXBsZSkuXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNEcmFnRHJvcFN1cHBvcnRlZCAoKSB7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmJvZHlcblxuICBpZiAoISgnZHJhZ2dhYmxlJyBpbiBkaXYpIHx8ICEoJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2KSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaWYgKCEoJ0Zvcm1EYXRhJyBpbiB3aW5kb3cpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAoISgnRmlsZVJlYWRlcicgaW4gd2luZG93KSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cbiIsImZ1bmN0aW9uIGlzTmV0d29ya0Vycm9yICh4aHIpIHtcbiAgaWYgKCF4aHIpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gKHhoci5yZWFkeVN0YXRlICE9PSAwICYmIHhoci5yZWFkeVN0YXRlICE9PSA0KSB8fCB4aHIuc3RhdHVzID09PSAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOZXR3b3JrRXJyb3JcbiIsIi8vIF9fX1doeSBub3QgYWRkIHRoZSBtaW1lLXR5cGVzIHBhY2thZ2U/XG4vLyAgICBJdCdzIDE5LjdrQiBnemlwcGVkLCBhbmQgd2Ugb25seSBuZWVkIG1pbWUgdHlwZXMgZm9yIHdlbGwta25vd24gZXh0ZW5zaW9ucyAoZm9yIGZpbGUgcHJldmlld3MpLlxuLy8gX19fV2hlcmUgdG8gdGFrZSBuZXcgZXh0ZW5zaW9ucyBmcm9tP1xuLy8gICAgaHR0cHM6Ly9naXRodWIuY29tL2pzaHR0cC9taW1lLWRiL2Jsb2IvbWFzdGVyL2RiLmpzb25cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1kOiAndGV4dC9tYXJrZG93bicsXG4gIG1hcmtkb3duOiAndGV4dC9tYXJrZG93bicsXG4gIG1wNDogJ3ZpZGVvL21wNCcsXG4gIG1wMzogJ2F1ZGlvL21wMycsXG4gIHN2ZzogJ2ltYWdlL3N2Zyt4bWwnLFxuICBqcGc6ICdpbWFnZS9qcGVnJyxcbiAgcG5nOiAnaW1hZ2UvcG5nJyxcbiAgZ2lmOiAnaW1hZ2UvZ2lmJyxcbiAgaGVpYzogJ2ltYWdlL2hlaWMnLFxuICBoZWlmOiAnaW1hZ2UvaGVpZicsXG4gIHlhbWw6ICd0ZXh0L3lhbWwnLFxuICB5bWw6ICd0ZXh0L3lhbWwnLFxuICBjc3Y6ICd0ZXh0L2NzdicsXG4gIHRzdjogJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnLFxuICB0YWI6ICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJyxcbiAgYXZpOiAndmlkZW8veC1tc3ZpZGVvJyxcbiAgbWtzOiAndmlkZW8veC1tYXRyb3NrYScsXG4gIG1rdjogJ3ZpZGVvL3gtbWF0cm9za2EnLFxuICBtb3Y6ICd2aWRlby9xdWlja3RpbWUnLFxuICBkb2M6ICdhcHBsaWNhdGlvbi9tc3dvcmQnLFxuICBkb2NtOiAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmQuZG9jdW1lbnQubWFjcm9lbmFibGVkLjEyJyxcbiAgZG9jeDogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JyxcbiAgZG90OiAnYXBwbGljYXRpb24vbXN3b3JkJyxcbiAgZG90bTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMicsXG4gIGRvdHg6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC50ZW1wbGF0ZScsXG4gIHhsYTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsYW06ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuYWRkaW4ubWFjcm9lbmFibGVkLjEyJyxcbiAgeGxjOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxmOiAnYXBwbGljYXRpb24veC14bGlmZit4bWwnLFxuICB4bG06ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bHM6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bHNiOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0LmJpbmFyeS5tYWNyb2VuYWJsZWQuMTInLFxuICB4bHNtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0Lm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsc3g6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCcsXG4gIHhsdDogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsdG06ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwudGVtcGxhdGUubWFjcm9lbmFibGVkLjEyJyxcbiAgeGx0eDogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnRlbXBsYXRlJyxcbiAgeGx3OiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgdHh0OiAndGV4dC9wbGFpbicsXG4gIHRleHQ6ICd0ZXh0L3BsYWluJyxcbiAgY29uZjogJ3RleHQvcGxhaW4nLFxuICBsb2c6ICd0ZXh0L3BsYWluJyxcbiAgcGRmOiAnYXBwbGljYXRpb24vcGRmJyxcbiAgemlwOiAnYXBwbGljYXRpb24vemlwJyxcbiAgJzd6JzogJ2FwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZCcsXG4gIHJhcjogJ2FwcGxpY2F0aW9uL3gtcmFyLWNvbXByZXNzZWQnLFxuICB0YXI6ICdhcHBsaWNhdGlvbi94LXRhcicsXG4gIGd6OiAnYXBwbGljYXRpb24vZ3ppcCcsXG4gIGRtZzogJ2FwcGxpY2F0aW9uL3gtYXBwbGUtZGlza2ltYWdlJyxcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlIChwcm9taXNlcykge1xuICBjb25zdCByZXNvbHV0aW9ucyA9IFtdXG4gIGNvbnN0IHJlamVjdGlvbnMgPSBbXVxuICBmdW5jdGlvbiByZXNvbHZlZCAodmFsdWUpIHtcbiAgICByZXNvbHV0aW9ucy5wdXNoKHZhbHVlKVxuICB9XG4gIGZ1bmN0aW9uIHJlamVjdGVkIChlcnJvcikge1xuICAgIHJlamVjdGlvbnMucHVzaChlcnJvcilcbiAgfVxuXG4gIGNvbnN0IHdhaXQgPSBQcm9taXNlLmFsbChcbiAgICBwcm9taXNlcy5tYXAoKHByb21pc2UpID0+IHByb21pc2UudGhlbihyZXNvbHZlZCwgcmVqZWN0ZWQpKVxuICApXG5cbiAgcmV0dXJuIHdhaXQudGhlbigoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3NmdWw6IHJlc29sdXRpb25zLFxuICAgICAgZmFpbGVkOiByZWplY3Rpb25zLFxuICAgIH1cbiAgfSlcbn1cbiIsIi8qKlxuICogQ29udmVydHMgbGlzdCBpbnRvIGFycmF5XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuZnJvbVxuIiwiY29uc3QgVXBweSA9IHJlcXVpcmUoJ0B1cHB5L2NvcmUnKVxuY29uc3QgRHJhZ0Ryb3AgPSByZXF1aXJlKCdAdXBweS9kcmFnLWRyb3AnKVxuY29uc3QgUHJvZ3Jlc3NCYXIgPSByZXF1aXJlKCdAdXBweS9wcm9ncmVzcy1iYXInKVxuY29uc3QgVHVzID0gcmVxdWlyZSgnQHVwcHkvdHVzJylcblxuLy8gRnVuY3Rpb24gZm9yIGRpc3BsYXlpbmcgdXBsb2FkZWQgZmlsZXNcbmNvbnN0IG9uVXBsb2FkU3VjY2VzcyA9IChlbEZvclVwbG9hZGVkRmlsZXMpID0+XG4gIChmaWxlLCByZXNwb25zZSkgPT4ge1xuICAgIGNvbnN0IHVybCA9IHJlc3BvbnNlLnVwbG9hZFVSTFxuICAgIGNvbnN0IGZpbGVOYW1lID0gZmlsZS5uYW1lXG5cbiAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgYS5ocmVmID0gdXJsXG4gICAgYS50YXJnZXQgPSAnX2JsYW5rJ1xuICAgIGEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZmlsZU5hbWUpKVxuICAgIGxpLmFwcGVuZENoaWxkKGEpXG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsRm9yVXBsb2FkZWRGaWxlcykuYXBwZW5kQ2hpbGQobGkpXG4gIH1cblxuY29uc3QgdXBweU9uZSA9IG5ldyBVcHB5KHsgZGVidWc6IHRydWUsIGF1dG9Qcm9jZWVkOiB0cnVlIH0pXG51cHB5T25lXG4gIC51c2UoRHJhZ0Ryb3AsIHsgdGFyZ2V0OiAnLmV4YW1wbGUtb25lIC5mb3ItRHJhZ0Ryb3AnIH0pXG4gIC51c2UoVHVzLCB7IGVuZHBvaW50OiAnaHR0cHM6Ly90dXNkLnR1c2RlbW8ubmV0L2ZpbGVzLycgfSlcbiAgLnVzZShQcm9ncmVzc0JhciwgeyB0YXJnZXQ6ICcuZXhhbXBsZS1vbmUgLmZvci1Qcm9ncmVzc0JhcicsIGhpZGVBZnRlckZpbmlzaDogZmFsc2UgfSlcbiAgLm9uKCd1cGxvYWQtc3VjY2VzcycsIG9uVXBsb2FkU3VjY2VzcygnLmV4YW1wbGUtb25lIC51cGxvYWRlZC1maWxlcyBvbCcpKVxuXG5jb25zdCB1cHB5VHdvID0gbmV3IFVwcHkoeyBkZWJ1ZzogdHJ1ZSwgYXV0b1Byb2NlZWQ6IGZhbHNlIH0pXG51cHB5VHdvXG4gIC51c2UoRHJhZ0Ryb3AsIHsgdGFyZ2V0OiAnLmV4YW1wbGUtdHdvIC5mb3ItRHJhZ0Ryb3AnIH0pXG4gIC51c2UoVHVzLCB7IGVuZHBvaW50OiAnaHR0cHM6Ly90dXNkLnR1c2RlbW8ubmV0L2ZpbGVzLycgfSlcbiAgLnVzZShQcm9ncmVzc0JhciwgeyB0YXJnZXQ6ICcuZXhhbXBsZS10d28gLmZvci1Qcm9ncmVzc0JhcicsIGhpZGVBZnRlckZpbmlzaDogZmFsc2UgfSlcbiAgLm9uKCd1cGxvYWQtc3VjY2VzcycsIG9uVXBsb2FkU3VjY2VzcygnLmV4YW1wbGUtdHdvIC51cGxvYWRlZC1maWxlcyBvbCcpKVxuXG5jb25zdCB1cGxvYWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXhhbXBsZS10d28gYnV0dG9uLnVwbG9hZC1idXR0b24nKVxudXBsb2FkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICB1cHB5VHdvLnVwbG9hZCgpXG59KVxuIl19
