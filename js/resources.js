// ImageLoader
// ------------------------------------------------------------------------------------------
function ImageLoader() {
  this.resourceCache = {};
  this.readyCallbacks = [];
}

  // Load an image url or an array of image urls
ImageLoader.prototype.load = function (urlOrArr) {
    if(urlOrArr instanceof Array) {
        for(var i =0; i < urlOrArr.length;i++) {
            this._load(urlOrArr[i]);
        }
    }
    else {
        this._load(urlOrArr);
    }
    if (this.isReady()) {
      this.readyCallbacks.forEach(function (func) { func(); });
    }
};

ImageLoader.prototype._load = function (url) {
  console.log("stuff");
    if(this.resourceCache[url]) {
        return this.resourceCache[url];
    }
    else {
      // Resource loader, make "virtual" loadResource(url) function
        var img = new Image();
        img.loader = this;
        img.onload = function() {
            img.loader.resourceCache[url] = img;
            console.log("stuff1");
            if(img.loader.isReady()) {
                img.loader.readyCallbacks.forEach(function(func) { func(); });
            }
        };
        this.resourceCache[url] = false;
        img.src = url;
    }
};

ImageLoader.prototype.get = function (url) {
    return this.resourceCache[url];
};

ImageLoader.prototype.isReady = function () {
    var ready = true;
    for(var k in this.resourceCache) {
        if(this.resourceCache.hasOwnProperty(k) &&
           !this.resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
};

ImageLoader.prototype.onReady = function (func) {
    this.readyCallbacks.push(func);
};

// SpriteLoader
// ------------------------------------------------------------------------------------------
function SpriteLoader() {}

// TextureLoader
// ------------------------------------------------------------------------------------------
function TextureLoader() {}

// FontLoader
// ------------------------------------------------------------------------------------------
function FontLoader() {}

// AudioLoader
// ------------------------------------------------------------------------------------------
function AudioLoader() {}


// http://jlongster.com/Making-Sprite-based-Games-with-Canvas

(function () {
  var state = "preloading";

  function updateState() {
    console.log("Updating load state..." + state);
    var ready = true;
    if (state.hashCode() === "preloading".hashCode()) {
      for (var key in window.dalí.resources.preloaders) {
        if (!window.dalí.resources.preloaders[key].isReady()) {
          ready = false;
          break;  
        }
      }
      if (ready) {
        state = "gameloading";
      }
    } else if (state.hashCode() === "gameloading".hashCode()) {
      for (var key in window.dalí.resources.gameloaders) {
        if (!window.dalí.resources.gameloaders[key].isReady()) {
          ready = false;
          break;  
        }
      }
      if (ready) {
        state = "levelpreloading";
      }
    } else if (state.hashCode() === "levelpreloading".hashCode()) {
      for (var key in window.dalí.resources.levelloaders.preloaders) {
        if (!window.dalí.resources.levelloaders.preloaders[key].isReady()) {
          ready = false;
          break;  
        }
      }
      if (ready) {
        state = "levelloading";
      }
    } else if (state.hashCode() === "levelloading".hashCode()) {
      for (var key in window.dalí.resources.levelloaders) {
        if (key !== "preloaders" && !window.dalí.resources.levelloaders[key].isReady()) {
          ready = false;
          break;  
        }
      }
      if (ready) {
        window.loop = true;
        console.log("stuff2");
        state = "preloading";
      }
    }
  }

  window.dalí.resources = {
    preloaders: {},
    gameloaders: {},
    levelloaders: {
      preloaders: {}
    },
    updateState: updateState
  };

  window.dalí.resources.preloaders.imgs = new ImageLoader();
  window.dalí.resources.preloaders.imgs.onReady(updateState);

  window.dalí.resources.gameloaders.imgs = new ImageLoader();
  window.dalí.resources.gameloaders.imgs.onReady(updateState);

  window.dalí.resources.levelloaders.preloaders.imgs = new ImageLoader();
  window.dalí.resources.levelloaders.preloaders.imgs.onReady(updateState);

  window.dalí.resources.levelloaders.imgs = new ImageLoader();
  window.dalí.resources.levelloaders.imgs.onReady(updateState);

} ());

dalí.resources.preloaders.imgs.load("./img/font.png");
dalí.resources.gameloaders.imgs.load([]);
dalí.resources.levelloaders.preloaders.imgs.load([]);
const BALL_URL = "./img/blue_orb.png";
const SPRITE_URL = "./img/proxyBot.png";
dalí.resources.levelloaders.imgs.load([SPRITE_URL,BALL_URL]);
