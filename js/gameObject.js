// extend - function for inheritance from StackOverflow
// --------------------------------------------------------------------------------
function extend(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  // for a polyfill
  // Also, do a recursive merge of two prototypes, so we don't overwrite 
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto)  {
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
}

// GameComponent
// -------------------------------------------------------------------------------
function GameComponent (go) {
  this.gameObj = go;
}

GameComponent.prototype.update = function () {};
GameComponent.prototype.draw = function () {};
GameComponent.prototype.readHID = function () {};


// Vector
// -------------------------------------------------------------------------------
function Vector (x,y) {
  this.x = x;
  this.y = y;
}

// GameObject
// -------------------------------------------------------------------------------

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

// Client unique string
var MY_UNIQUE_ID = randomString(25);

function GameObject (x,y) {
  this.GUID = this.constructor.name + ":" + MY_UNIQUE_ID + ":" + randomString(7);
  this.gameComponents = new Array();
  this.transform = {
    position: new Vector(x,y),
    rotation: 0,
    scale: new Vector(1,1)
  };
}

GameObject.prototype.update = function () {
  this.gameComponents.forEach(
    function(component) {
      if (component instanceof GameComponent) {
        component.update();
      }
    }
  );
};

GameObject.prototype.draw = function () {
  this.gameComponents.forEach(
    function(component) {
      if (component instanceof GameComponent) {
        component.draw();
      }
    }
  );
};

GameObject.prototype.readHID = function () {
  this.gameComponents.forEach(
    function(component) {
      if (component instanceof GameComponent) {
        component.readHID();
      }
    }
  );
};

GameObject.prototype.getX = function () {
  return this.transform.position.x;
};


GameObject.prototype.getY = function () {
  return this.transform.position.y;
};
