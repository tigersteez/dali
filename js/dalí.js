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

    function generateObjID(obj) {
        return obj.constructor.name + "::" + 
          dalí.identifier.getClientID() + "::" + 
            dalí.identifier.randomString(7);
    }

    function generateComponentID(component) {
      return component.gameObj.GUID + "::" +
        component.constructor.name + "::" +
          dalí.identifier.randomString(4);
    }

    function getClassFromID(guid) {
      return guid.split("::")[0];
    }

    function getGUIDFromCompID(id) {
      return id.split("::").splice(0,3).join("::");
    }

    function GUIDData(GUID) {
      var idParts = GUID.split("::");
      this.objClass = idParts[0];
      this.clientID = idParts[1];
      this.objID = idParts[2];
      if (idParts.length == 5) {
        this.compClass = idParts[3];
        this.compID = idParts[4];
      } else {
        this.compClass = null;
        this.compID = null;
      }
    }

    GUIDData.prototype.getObjID = function() {
      return this.objClass + "::" + this.clientID + "::" + this.objID;
    }

    GUIDData.prototype.getCompID = function() {
      if (this.compID !== null)
        return this.getObjID() + "::" + this.compClass + "::" + this.compID;
      return null;
    }

    function getDataFromGUID(GUID) {
      return new GUIDData(GUID);
    }

    window.dalí.identifier = {
      randomString: randomString,
      getClientID: getClientID,
      generateObjID: generateObjID,
      generateComponentID: generateComponentID,
      getDataFromGUID: getDataFromGUID
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

// Addition public functions for useful objects
Array.prototype.contains = function(v) {
  return this.indexOf(v) > -1;
};

// src: http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Queue
// src:
//   http://code.tutsplus.com/articles/data-structures-with-javascript-stack-and-queue--cms-23348
// ------------------------------------------------------------
function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}
 
Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};
 
Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};
 
Queue.prototype.dequeue = function() {
    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;
 
    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;
 
        return deletedData;
    }
};

Queue.prototype.isEmpty = function () {
  return this._oldestIndex === this._newestIndex;
};

// My own function that accepts a callback
Queue.prototype.emptyQueue = function (func) {
  while (!this.isEmpty()) {
    func(this.dequeue());
  }
};
