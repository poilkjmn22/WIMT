/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

var wimt = root.wimt || {};

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = wimt).wimt = wimt;
    // Export for CommonJS support.
    freeExports.wimt = wimt;
} else {
    // Export to the global object.
    root.wimt = wimt;
}

var utils = {};
wimt.utils = utils;
utils.isNumber = function(n) {
    return typeof n === 'number' && !isNaN(n) && n < Infinity && n > -Infinity;
};

utils.pInt = function(s, mag) {
    return parseInt(s, mag || 10);
};

utils.arrTail = function(data){
  return data && data.length > 0 && data[data.length - 1] || undefined;
}

/**
 * Return the first value that is not null or undefined.
 *
 * @function #pick
 * @memberof wimt.tils
 * @param {...*} items - Variable number of arguments to inspect.
 * @returns {*} The value of the first argument that is not null or undefined.
 */
utils.pick = function() {
    var args = arguments,
        i,
        arg,
        length = args.length;
    for (i = 0; i < length; i++) {
        arg = args[i];
        if (arg !== undefined && arg !== null) {
            return arg;
        }
    }
};

utils.numberFormat = function(number, decimals, decimalPoint, thousandsSep) {
    number = +number || 0;
    decimals = +decimals;

    var lang = {
            decimalPoint: '.',
            thousandsSep: ','
        },
        origDec = (number.toString().split('.')[1] || '').split('e')[0].length,
        strinteger,
        thousands,
        ret,
        roundedNumber,
        exponent = number.toString().split('e'),
        fractionDigits;

    if (decimals === -1) {
        // Preserve decimals. Not huge numbers (#3793).
        decimals = Math.min(origDec, 20);
    } else if (!utils.isNumber(decimals)) {
        decimals = 2;
    } else if (decimals && exponent[1] && exponent[1] < 0) {
        // Expose decimals from exponential notation (#7042)
        fractionDigits = decimals + +exponent[1];
        if (fractionDigits >= 0) {
            // remove too small part of the number while keeping the notation
            exponent[0] = (+exponent[0]).toExponential(fractionDigits)
                .split('e')[0];
            decimals = fractionDigits;
        } else {
            // fractionDigits < 0
            exponent[0] = exponent[0].split('.')[0] || 0;

            if (decimals < 20) {
                // use number instead of exponential notation (#7405)
                number = (exponent[0] * Math.pow(10, exponent[1]))
                    .toFixed(decimals);
            } else {
                // or zero
                number = 0;
            }
            exponent[1] = 0;
        }
    }

    // Add another decimal to avoid rounding errors of float numbers. (#4573)
    // Then use toFixed to handle rounding.
    roundedNumber = (
        Math.abs(exponent[1] ? exponent[0] : number) +
        Math.pow(10, -Math.max(decimals, origDec) - 1)
    ).toFixed(decimals);

    // A string containing the positive integer component of the number
    strinteger = String(utils.pInt(roundedNumber));

    // Leftover after grouping into thousands. Can be 0, 1 or 2.
    thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;

    // Language
    decimalPoint = utils.pick(decimalPoint, lang.decimalPoint);
    thousandsSep = utils.pick(thousandsSep, lang.thousandsSep);

    // Start building the return
    ret = number < 0 ? '-' : '';

    // Add the leftover after grouping into thousands. For example, in the
    // number 42 000 000, this line adds 42.
    ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';

    // Add the remaining thousands groups, joined by the thousands separator
    ret += strinteger
        .substr(thousands)
        .replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);

    // Add the decimal point and the decimal component
    if (decimals) {
        // Get the decimal component
        ret += decimalPoint + roundedNumber.slice(-decimals);
    }

    if (exponent[1] && +ret !== 0) {
        ret += 'e' + exponent[1];
    }

    return ret;
};

utils.parseDuration = function(duration){
  if(typeof duration != 'string'){
    return 0
  }
  if(duration.split('~').length === 2){
    return ((new Date(duration.split('~')[1]).getTime() - new Date(duration.split('~')[0]).getTime()) / 1000 / 3600).toFixed(1)
  }
  var m = duration.match(/(\d+\.?\d*)h?/)
  return m && parseFloat(m[1]) || 0
}

utils.extractDate = function(dateStr){
  if(typeof dateStr != 'string'){
    return ''
  }
  var m = dateStr.match(/\d+\-\d{2}\-\d{2}/)
  return m && m[0] || ''
}

utils.getStrRealLength = function(str) {
    var realLength = 0,
        len = str.length,
        charCode = -1;
    if(!str){
      return 0;
    }
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128)
            realLength += 1;
        else
            realLength += 2;
    }
    return realLength;
};

utils.getTextEllipsis = function(str, max){
  if(!str || typeof str != 'string'){
    return '';
  }
  var realLength = 0,
      len = str.length,
      charCode = -1;
  for (var i = 0; i < len; i++) {
      if(realLength >= max){
        break;
      }
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128){
        realLength += 1;
      }
      else{
        realLength += 3;
      }
  }
  if(i >= len){
    return str;
  }
  return str.substring(0, i) + '......';
};

utils.colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

utils.queryUrlParam = function(key) {
    if (typeof window.location.search != 'string') {
        return '';
    }
    var paramPairs = window.location.search.replace(/^\?/, '').split('&');
    var res = '';
    for (var i = 0; i < paramPairs.length; i++) {
        var temp;
        if (typeof paramPairs[i] == 'string' && paramPairs[i].split('=')) {
            temp = paramPairs[i].split('=');
            if (key == temp[0]) {
                res = temp[1];
                break;
            }
        }
    }
    return res;
}

utils.getHost = function() {
    if (!window) {
        return '';
    }
    return window.location.host;
}

utils.compactPlainObject = function(obj) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
        return {};
    }
    var res = {};
    for (k in obj) {
        if (obj[k] !== '') {
            res[k] = obj[k];
        }
    }
    return res;
}

// regexpHelper
var regexpHelper = {};
wimt.regexpHelper = regexpHelper;

regexpHelper.toThousandsSep = function(str) {
    if (Object.prototype.toString.call(str) !== '[object String]') {
        return '';
    }
    return str.replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/g, '$&,');
};
// EOF regexpHelper

// puzzleHelper
var puzzleHelper = {};
wimt.puzzleHelper = puzzleHelper;
puzzleHelper.pickCoincidedGroup = function(data, predicate, comparator){
  var res = [];
  var defaultPredicate = function(a){
    return a;
  };
  var defaultComparator = function(a, b){
    return a === b;
  };
  var predicate = (typeof predicate !== 'function' ? defaultPredicate : predicate);
  var comparator = (typeof comparator !== 'function' ? defaultComparator : comparator);
  if(!data || !data.length){
    return res;
  }
  data = data.sort(function(a, b){
    return predicate.call(this, a) - predicate.call(this, b);
  });
  var tailG = null;
  for (var i = 0; i < (data.length - 1); i++) {
    if(comparator.call(this, data[i], data[i + 1])){
      tailG = utils.arrTail(res);
      if(tailG && comparator.call(this, utils.arrTail(tailG), data[i])){//已经存在
        tailG.push(data[i + 1]);
      }else{
        res.push([data[i], data[i + 1]]);
      }
    }
  }
  return res;
};

puzzleHelper.traverseTree = function traverseTree(tree, cb, includeRoot){
  if(includeRoot){
    cb.call(this, tree);
  }
  (tree.children || []).forEach(function(node){
    cb.call(this, node);
    traverseTree(node, cb);
  });
}

puzzleHelper.findTree = function findTree(tree, cb){
  var res = null;
  function look(tree, cb){
    (tree.children || []).forEach(function(node){
      if(cb.call(this, node) === true){
        res = node;
        return;
      };
      look(node, cb);
    });
  }
  look(tree, cb);
  return res;
}
// EOF puzzleHelper

// domHelper
var domHelper = {};
wimt.domHelper = domHelper;
domHelper.getStyles = function(elem){
  // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
  // IE throws on elements created in popups
  // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
  var view = elem.ownerDocument.defaultView;

  if ( !view || !view.opener ) {
    view = window;
  }

  return view.getComputedStyle( elem );
};

domHelper.width = function(elem){
  var match = /^\d+\.?\d*/.exec(this.getStyles(elem).width);
  return match && parseFloat(match[0]);
};

// Check whether CSS3 transform is supported. This is a one time check
// performed above.
domHelper._detectTransformSupport = function(featureName) {
        var isSupported = false,
            domPrefixes = 'Webkit Moz ms O Khtml'.split(' '),
            elm = document.createElement('div'),
            featureNameCapital = null;

        featureName = featureName.toLowerCase();

        if (elm.style[featureName] !== undefined) {
            isSupported = true;
        }

        if (isSupported === false) {
            featureNameCapital = featureName.charAt(0).toUpperCase() + featureName.substr(1);
            for (var i = 0; i < domPrefixes.length; i++) {
                if (elm.style[domPrefixes[i] + featureNameCapital] !== undefined) {
                    isSupported = true;
                    break;
                }
            }
        }
        return isSupported;
    }
// EOF domHelper
