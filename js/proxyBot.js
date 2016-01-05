var spriteImg = new Image();
spriteImg.src = "./img/sprite_sheet.png";

const SPRITE_WIDTH = 4096;
const SPRITE_HEIGHT = 256;
const NUM_SPRITES = 8;
const SPRITE_SCALE = 0.1;

var spriteMap = new SpriteMap({
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    image: spriteImg,
    numFrames: NUM_SPRITES,
    numCols: NUM_SPRITES,
    ticksPerFrame: 1
});

// ProxyController
// ------------------------------------------------------------------------------------
function ProxyController(go,dx,dy) {
  GameComponent.call(this,go);
  this.dx = dx;
  this.dy = dy;
}

ProxyController.prototype.update = function () {
  var newx = this.gameObj.transform.position.x +
  this.dx * dalí.time.getDeltaTime();

    // var top = newy - this.radius;
    // var bottom = newy + this.radius;

    var left = newx;
    var right = newx + (SPRITE_WIDTH / (NUM_SPRITES)) * this.gameObj.transform.scale.x;

    if (!(left < 0 || right > dalí.canvas.width)) {
      this.gameObj.transform.position.x = newx;
    } else {
      this.dx = -this.dx;
    }
  }

  ProxyController.prototype.readHID = function () {
    if (dalí.input.getKey(dalí.input.LEFT)) {
      this.dx = -max_dx;
    } 

    if (dalí.input.getKey(dalí.input.RIGHT)) {
      this.dx = max_dx;
    }
  }

  ProxyController.prototype.resetSpeeds = function () {
    this.dx = 0;
    this.dy = 0;
  }

  extend(GameComponent, ProxyController);

// ProxyBot
// ------------------------------------------------------------------------------------
function ProxyBot(x,y) {
  GameObject.call(this,x,y);
  this.renderer = new SpriteRenderer(this,{
    scaleRatio: SPRITE_SCALE,
    spriteMap: spriteMap,
    numFrames: NUM_SPRITES,
    ticksPerFrame: 1
  });
  this.transform.scale.x = this.renderer.scaleRatio;
  this.transform.scale.y = this.renderer.scaleRatio; 
  this.gameComponents.push(new ProxyController(this,0,0));
  this.gameComponents.push(this.renderer);
}

extend(GameObject, ProxyBot);
