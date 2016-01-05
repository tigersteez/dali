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

extend(GameComponent, Renderer);

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
        component.draw();
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
    this.width = spriteMap.spriteWidth;
    this.height = spriteMap.spriteHeight;
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

extend(Renderer, SpriteRenderer);

// ParticleRenderer
// -------------------------------------------------------------------
function ParticleRenderer(go,options) {
    Renderer.call(this,go,options);
    this.radius = this.width/2;
    this.fillColor = options.color;
}

ParticleRenderer.prototype.render = function () {
    dalí.fg.beginPath();
    dalí.fg.arc(this.gameObj.getX() + this.scaleRatio * this.radius, 
      this.gameObj.getY() + this.scaleRatio * this.radius, 
      this.scaleRatio * this.radius, 
      0, Math.PI*2);
    dalí.fg.fillStyle = this.fillColor;
    dalí.fg.fill();
    dalí.fg.closePath();

    dalí.main.beginPath();
    dalí.main.arc(this.gameObj.getX() + this.scaleRatio * this.radius, 
      this.gameObj.getY() + this.scaleRatio * this.radius, 
      this.scaleRatio * this.radius, 
      0, Math.PI*2);
    dalí.main.fillStyle = this.fillColor;
    dalí.main.fill();
    dalí.main.closePath();
}

extend(Renderer, ParticleRenderer);
