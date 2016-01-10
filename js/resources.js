// ResourceLoader
// // http://jlongster.com/Making-Sprite-based-Games-with-Canvas
// ------------------------------------------------------------------------------------------
function ResourceLoader(loadResource,manager,extraData) {
  this.resourceCache = {};
  this.readyCallbacks = [];
  this.loadResource = loadResource;
  this.manager = manager;
  this.extraData = extraData || null;
}

  // Load an image url or an array of image urls
ResourceLoader.prototype.load = function (urlOrArr) {
    if(urlOrArr instanceof Array) {
        for(var i =0; i < urlOrArr.length;i++) {
            this._load(urlOrArr[i]);
        }
    }
    else {
        this._load(urlOrArr);
    }
    if (this.isReady()) {
              for (var i = 0; i < this.readyCallbacks.length; i++) {
                this.readyCallbacks[i](this.manager);
              }
    }
};

ResourceLoader.prototype._load = function (url) {
    if(this.resourceCache[url]) {
        return this.resourceCache[url];
    }
    else {
      // Resource loader, make "virtual" loadResource(url) function
      this.loadResource(url,this);
    }
};

ResourceLoader.prototype.get = function (url) {
    return this.resourceCache[url];
};

ResourceLoader.prototype.isReady = function () {
    var ready = true;
    for(var k in this.resourceCache) {
        if(this.resourceCache.hasOwnProperty(k) &&
           !this.resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
};

ResourceLoader.prototype.onReady = function (func) {
    this.readyCallbacks.push(func);
};

function ResourceManager() {

    function loadImage(url,loader) {
      var img = new Image();
      img.loader = loader;
      img.onload = function() {
          img.loader.resourceCache[url] = img;
          if(img.loader.isReady()) {
              for (var i = 0; i < img.loader.readyCallbacks.length; i++) {
                img.loader.readyCallbacks[i](img.loader.manager);
              }
          }
      };
      img.src = url;
      loader.resourceCache[url] = false;
    }

    function loadTexture(url,loader) {
      loader.resourceCache[url] = new Texture(url);
    }

    function loadSprite(url,loader) {
      loader.resourceCache[url] = new SpriteMap(loader.extraData[url]);
    }

    function loadFont(url,loader) {
      loader.resourceCache[url] = new FontMap(loader.extraData[url]);
    }

    this.imgs = new ResourceLoader(loadImage,this);
    this.fonts = new ResourceLoader(loadFont,this);
    this.sprites = new ResourceLoader(loadSprite,this);
    this.textures = new ResourceLoader(loadTexture,this);

    function notifyManager(manager) {
      manager.textures.load(manager.resources.textures);
      manager.fonts.extraData = manager.resources.fonts.details;
      manager.fonts.load(manager.resources.fonts.urls);
      manager.sprites.extraData = manager.resources.sprites.details;
      manager.sprites.load(manager.resources.sprites.urls);
    }

    this.loadImgs = function () {
      var imgURLs = [];
      imgURLs = imgURLs.concat(this.resources.textures,
                           this.resources.fonts.urls,
                           this.resources.sprites.urls);
      this.imgs.onReady(notifyManager);
      this.imgs.load(imgURLs);
    }
}

ResourceManager.prototype.isReady = function () {
  return (this.imgs.isReady() && this.textures.isReady() &&
          this.fonts.isReady() && this.sprites.isReady());
};


ResourceManager.prototype.load = function (resources) {
  this.resources = resources;
  this.loadImgs();
};

ResourceManager.prototype.toString = function () {
  return "ResourceManager";
};

(function () {
  var state = "preloading";

  function updateState() {
    console.log("Updating load state..." + state);
    var ready = true;
    if (state.hashCode() === "preloading".hashCode() && window.dalí.resources.preloaders.isReady()) {
      state = "gameloading";
    } else if (state.hashCode() === "gameloading".hashCode() && window.dalí.resources.gameloaders.isReady()) {
        state = "levelpreloading";
    } else if (state.hashCode() === "levelpreloading".hashCode() && window.dalí.resources.levelloaders.preloaders.isReady()) {
        state = "levelloading";
    } else if (state.hashCode() === "levelloading".hashCode() && window.dalí.resources.levelloaders.manager.isReady()) {
        window.firstLoop = true;
        state = "preloading";
    }
  }

  function getGameState() {
    return state;
  }

  function getImg(url) { 
    return window.dalí.resources.levelloaders.manager.imgs.get(url) || 
   window.dalí.resources.preloaders.imgs.get(url) ||
   window.dalí.resources.gameloaders.imgs.get(url) ||
   window.dalí.resources.levelloaders.preloaders.imgs.get(url);
 }

   function getTexture(url) { 
    return window.dalí.resources.levelloaders.manager.textures.get(url) || 
   window.dalí.resources.preloaders.textures.get(url) ||
   window.dalí.resources.gameloaders.textures.get(url) ||
   window.dalí.resources.levelloaders.preloaders.textures.get(url);
 }

  function getFont(url) { 
    return window.dalí.resources.levelloaders.manager.fonts.get(url) || 
   window.dalí.resources.preloaders.fonts.get(url) ||
   window.dalí.resources.gameloaders.fonts.get(url) ||
   window.dalí.resources.levelloaders.preloaders.fonts.get(url);
 }
    function getSprite(url) { 
    return window.dalí.resources.levelloaders.manager.sprites.get(url) || 
   window.dalí.resources.preloaders.sprites.get(url) ||
   window.dalí.resources.gameloaders.sprites.get(url) ||
   window.dalí.resources.levelloaders.preloaders.sprites.get(url);
 }

  // These each should be instances of  ResourceManager which
  // has several resource loaders
  window.dalí.resources = {
    preloaders: new ResourceManager(),
    gameloaders: new ResourceManager(),
    levelloaders: {
      preloaders: new ResourceManager(),
      manager: new ResourceManager()
    },
    updateState: updateState,
    getGameState: getGameState,
    getImg: getImg,
    getTexture: getTexture,
    getFont: getFont,
    getSprite: getSprite
  };

} ());

const BALL_URL = "./img/blue_orb.png";
const SPRITE_URL = "./img/proxyBot.png";

const STONE_URL = "./img/stone_texture.png";
const BRICK_URL = "./img/brick.png";

// AudioLoader
// ------------------------------------------------------------------------------------------
function AudioLoader() {}

