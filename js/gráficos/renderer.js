// Renderer
// ------------------------------------------------------------------------------------------
function Renderer(go,options) {
    GameComponent.call(this,go);
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.scaleRatio = options.scaleRatio || 1;
}

Renderer.prototype.draw = function() {
    this.render();

    var collider = this.gameObj.getCollider();
    if (collider !== null) {
        collider.imgData = dalí.fg.getImageData(this.gameObj.getX(),this.gameObj.getY(),
            this.width * this.scaleRatio, this.height * this.scaleRatio);
    }
}

Renderer.prototype.render = function () {};

dalí.extend(GameComponent, Renderer);

(function () {
  var bg = new Queue();
  var movers = new Queue();
  var colliders = new Queue();
  var ui = new Queue();

  function queue(comp) {
    if (comp.gameObj instanceof UI_Element || comp instanceof TextRenderer) {
      ui.enqueue(comp);
    } else {
      var collider = comp.gameObj.getCollider();
      if (collider !== null) {
        if (collider instanceof Mover) {
          movers.enqueue(comp);
        } else {
          colliders.enqueue(comp);
        }
      } else {
        bg.enqueue(comp);
      }
    }
  }

  var drawComp = function(comp) {
    comp.draw();
  }

  function draw() {
    bg.emptyQueue(drawComp);
    movers.emptyQueue(drawComp);
    colliders.emptyQueue(drawComp);
    ui.emptyQueue(drawComp);
  }

  window.dalí.drawing = {
    draw: draw,
    queue: queue
  };

} ());

GameObject.prototype.getRenderer = function () {
  for (var i in this.gameComponents) {
    if (this.gameComponents[i] instanceof Renderer) {
      return this.gameComponents[i];
    }
  }
  return null;
};

GameObject.prototype.draw = function () {
  this.gameComponents.forEach(
    function(component) {
      if (component instanceof Renderer) {
        dalí.drawing.queue(component);
      }
    }
  );
};

// SpriteRenderer
// adapted from:
//    http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
// ------------------------------------------------------------------------------------------
function SpriteRenderer(go,options) {
    Renderer.call(this,go,options);
    this.spriteMap = options.spriteMap;
    this.width = this.spriteMap.spriteWidth;
    this.height = this.spriteMap.spriteHeight;
}

SpriteRenderer.prototype.getMapIndices = function () {
    return {
        i: 0,
        j: 0
    };
};

SpriteRenderer.prototype.render = function () {
    var idx = this.getMapIndices();
    this.spriteMap.draw(this.gameObj.getX(),this.gameObj.getY(), // x,y
        idx.i, idx.j, // i,j
        this.scaleRatio); // scale
};

dalí.extend(Renderer, SpriteRenderer);

// ParticleRenderer
// -------------------------------------------------------------------
function ParticleRenderer(go,options) {
    Renderer.call(this,go,options);
    this.radius = this.width/2;
    this.fillColor = options.color;
}

ParticleRenderer.prototype.render = function () {
    var cameraPos = dalí.room.mainCamera.getPosition();
    var gameX = this.gameObj.getX() - cameraPos.x,
      gameY = this.gameObj.getY() - cameraPos.y;

    dalí.fg.beginPath();
    dalí.fg.arc(this.gameObj.getX() + this.scaleRatio * this.radius, 
      this.gameObj.getY() + this.scaleRatio * this.radius, 
      this.scaleRatio * this.radius, 
      0, Math.PI*2);
    dalí.fg.fillStyle = this.fillColor;
    dalí.fg.fill();
    dalí.fg.closePath();

    dalí.main.beginPath();
    dalí.main.arc(gameX + this.scaleRatio * this.radius, 
      gameY + this.scaleRatio * this.radius, 
      this.scaleRatio * this.radius, 
      0, Math.PI*2);
    dalí.main.fillStyle = this.fillColor;
    dalí.main.fill();
    dalí.main.closePath();
}

dalí.extend(Renderer, ParticleRenderer);

// BoxRender
// -------------------------------------------------------------------
function BoxRenderer(go,options) {
  Renderer.call(this,go,options);
  this.borderThickness = options.borderThickness || 0;
  this.fillColor = options.color;
  this.borderColor = options.borderColor || "#000000";
}

BoxRenderer.prototype.render = function () {
  var cameraPos = dalí.room.mainCamera.getPosition();
  var gameX = this.gameObj.getX() - cameraPos.x,
      gameY = this.gameObj.getY() - cameraPos.y;
  dalí.fg.beginPath();
  dalí.fg.fillStyle = this.fillColor;
  dalí.fg.fillRect(this.gameObj.getX(),
      this.gameObj.getY(), 
      this.width,
      this.height);

  dalí.main.beginPath();
  dalí.main.fillStyle = this.fillColor;
  dalí.main.fillRect(gameX,
      gameY, 
      this.width,
      this.height);

  if (this.borderThickness != 0) { 
    dalí.fg.strokeStyle = this.borderColor;
    dalí.fg.lineWidth = this.borderThickness;
    dalí.fg.strokeRect(this.gameObj.getX(),
      this.gameObj.getY(),
      this.width,
      this.height);

    dalí.main.strokeStyle = this.borderColor;
    dalí.main.lineWidth = this.borderThickness;
    dalí.main.strokeRect(gameX,
      gameY, 
      this.width,
      this.height);
  }

  dalí.fg.closePath();
  dalí.main.closePath();
};

dalí.extend(Renderer, BoxRenderer);

// TextRenderer
// -------------------------------------------------------------------
function TextRenderer(go,options) {
  Renderer.call(this,go,options);
  this.font = options.font;
  this.text = options.text;
  this.setDesiredLength(options.desiredLength);
  this.width = this.font.spriteWidth * this.text.length;
  this.height = this.font.spriteHeight;
};

TextRenderer.prototype.render = function () {
    for (var i = 0; i < this.text.length; i++) {
        this.font.draw(this.gameObj.getX() + this.font.spriteWidth * this.scaleRatio * i, // x
          this.gameObj.getY(), // y
          this.text.charAt(i), // i,j
          this.scaleRatio); // scale
    }

};

TextRenderer.prototype.setText = function(text,dl) {
  if (typeof dl === 'undefined' || dl === null) {
    this.resize(text);
    this.text = text;
  } else {
    this.text = text;
    this.setDesiredLength(dl);
  }
};

TextRenderer.prototype.resize = function(text) {
  this.desiredLength += (text.length - this.text.length)*(this.font.spriteWidth*this.scaleRatio);
};

TextRenderer.prototype.setDesiredLength = function(dl) {
  this.desiredLength = dl;
  this.scaleRatio = dl / (this.font.spriteWidth * this.text.length);
}

dalí.extend(Renderer, TextRenderer);

// TextureRenderer
// -------------------------------------------------------------------
function TextureRenderer(go,options) {
  Renderer.call(this,go,options);
  this.texture = options.texture;
  this.isBackground = options.isBackground || true;
}

TextureRenderer.prototype.render = function() {
  this.texture.render(this.gameObj.getX(), this.gameObj.getY(), 
    this.width * this.scaleRatio, this.height * this.scaleRatio, this.isBackground);
};

dalí.extend(Renderer, TextureRenderer);
