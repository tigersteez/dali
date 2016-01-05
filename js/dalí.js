// global namespace
var dalí = {};

dalí.canvas = document.getElementById("myCanvas");
dalí.main = dalí.canvas.getContext("2d");

var canvas = document.createElement("canvas");
canvas.width = dalí.canvas.width;
canvas.height = dalí.canvas.height;

dalí.fg = canvas.getContext("2d");

// Client unique string
(function () {

    // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
    function randomString(len, charSet) {
      charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var randomString = '';
      for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    }

    var MY_UNIQUE_ID = randomString(25);

    function getClientID() {
        return MY_UNIQUE_ID;
    }

    window.dalí.identifier = {
      randomString: randomString,
      getClientID: getClientID
    };

}());

// Time singleton 
// -------------------------------------------------------
(function () {
    var timer = null;
    var deltaTime = 0.0;

    function updateDeltaTime() {
        var now = Date.now();
        deltaTime = ( now - (timer || now) ) / 1000.0;
     
        timer = now;
    }

    function getDeltaTime() {
        return deltaTime;
    }

    window.dalí.time = {
        getDeltaTime: getDeltaTime,
        updateDeltaTime: updateDeltaTime
    };

} ());

// extend - function for inheritance from StackOverflow
// --------------------------------------------------------------------------------
dalí.extend = function(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  // for a polyfill
  // Also, do a recursive merge of two prototypes, so we don't overwrite 
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto) {
    sub.prototype[key] = origProto[key];
  }
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
  // In ECMAScript5+ (all modern browsers), you can make the constructor property
  // non-enumerable if you define it like this instead
  Object.defineProperty(sub.prototype, 'constructor', { 
    enumerable: false, 
    value: sub 
  });
};

// for requestAnimationFrame
// -------------------------------------------------------------------------
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

// (function (){ ...code }()); is a trick to create a private scope for the variables within
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o', ''];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
