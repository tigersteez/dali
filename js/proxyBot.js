var spriteImg = new Image();
spriteImg.src = "./img/sprite_sheet.png";

const SPRITE_WIDTH = 4096;
const SPRITE_HEIGHT = 256;
const NUM_SPRITES = 8;
const SPRITE_SCALE = 0.1;

// ProxyController
// ------------------------------------------------------------------------------------
function ProxyController(go,dx,dy) {
  GameComponent.call(this,go);
  this.dx = dx;
  this.dy = dy;
}

ProxyController.prototype.update = function () {
  var newx = this.gameObj.transform.position.x +
  this.dx * this.gameObj.canvas.deltaTime;

    // var top = newy - this.radius;
    // var bottom = newy + this.radius;

    var left = newx - (SPRITE_WIDTH / (2*NUM_SPRITES)) * this.gameObj.transform.scale.x;
    var right = newx + (SPRITE_WIDTH / (2*NUM_SPRITES)) * this.gameObj.transform.scale.x;

    if (!(left < 0 || right > this.gameObj.canvas.width)) {
      this.gameObj.transform.position.x = newx;
    } else {
      this.dx = -this.dx;
    }
  }

  ProxyController.prototype.readHID = function () {
    if (this.gameObj.canvas.pressed[LEFT]) {
      this.dx = -max_dx;
    } 

    if (this.gameObj.canvas.pressed[RIGHT]) {
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
function ProxyBot(x,y,canvas) {
  GameObject.call(this,x,y,canvas);
  this.renderer = new SpriteRenderer(this,{
    context: this.canvas.ctx,
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    image: spriteImg,
    numberOfFrames: NUM_SPRITES,
    ticksPerFrame: 1
  });
  this.renderer.scaleRatio = SPRITE_SCALE;
  this.transform.scale.x = this.renderer.scaleRatio;
  this.transform.scale.y = this.renderer.scaleRatio; 
  this.gameComponents.push(new ProxyController(this,0,0));
  this.gameComponents.push(this.renderer);
}

extend(GameObject, ProxyBot);
