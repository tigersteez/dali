const max_dx = 100;
const max_dy = 100;

const max_a = 2;

const MIN_R = 3;
const MAX_R = 10;

const MIN_O = 12;
const MAX_O = 36;

const BALL_LENGTH = 216;
const BALL_SCALE = 0.05;

function Rotator(go,speed) {
  GameComponent.call(this,go);
  this.speed = speed;
}

Rotator.prototype.update = function() {
  this.gameObj.transform.orientation += this.speed * dalí.time.getDeltaTime();
};

dalí.extend(GameComponent, Rotator);

// Ball
// ------------------------------------------------------------------------------------
function Ball(x,y,radius,dx,dy,ax,ay,rotation) {
  GameObject.call(this,x,y);
  EventHandler.call(this,[dalí.physics.collisionEvent],this.GUID);
  this.gameComponents.push(new SpriteRenderer(this,{
    width: BALL_LENGTH,
    height: BALL_LENGTH,
    scaleRatio: (2*radius)/BALL_LENGTH,
    spriteurl: BALL_URL
  }));
  this.gameComponents.push(new Mover(this,true,dx,dy,ax||1,ay||1));
  this.addComp(new GameAudio(this,"./audio/whoosh.wav",false));
  this.addComp(new Rotator(this,rotation||16));
}

Ball.prototype.ongamecollision = function(eventData) {

  var mover = this.getCollider();
  var collInfo = eventData.collInfo[mover.GUID];
  var otherGUID = null;
  if (eventData.GUID1.hashCode() === mover.GUID.hashCode()) {
     otherGUID = eventData.GUID2; 
  } else {
    otherGUID = eventData.GUID1;
  }

  var otherData = dalí.identifier.getDataFromGUID(otherGUID);
  if (otherData.objClass.hashCode() === "ProxyBot".hashCode()) {
    this.getAudio().play();
  }

  if (collInfo.left && mover.velocity.x < 0) {
    mover.velocity.x = -mover.velocity.x;
    mover.acceler.x = -mover.acceler.x;
  } else if (collInfo.right && mover.velocity.x > 0) {
    mover.velocity.x = -mover.velocity.x;
    mover.acceler.x = -mover.acceler.x;
  }


  if (collInfo.top && mover.velocity.y < 0) {
    mover.velocity.y = -mover.velocity.y;
    mover.acceler.y = -mover.acceler.y;
  } else if (collInfo.bottom && mover.velocity.y > 0) {
    mover.velocity.y = -mover.velocity.y;
    mover.acceler.y = -mover.acceler.y;
  }

}

dalí.extend(EventHandler, Ball);
dalí.extend(GameObject, Ball);

// Wall
// --------------------------------------------------------------------------------------
function Wall(x,y,width,height) {
  GameObject.call(this,x,y);
  this.gameComponents.push(
    new TextureRenderer(this,{
      width: width,
      height: height,
      isBackground: false,
      textureurl: BRICK_URL
    })
  );
  this.gameComponents.push(new Collider(this,true));
}

dalí.extend(GameObject, Wall);

function Score(x,y,options) {
  UI_Element.call(this,x,y,options);
  this.score = 0;
  options.textRender.text = this.score.toString();
  this.gameComponents.push(
    new SpriteRenderer(this,options.spriteRender)
  );
  this.gameComponents.push(
    new TextRenderer(this,options.textRender)
  );
}

Score.prototype.updateText = function() {
  this.gameComponents[1].setText(this.score.toString());
};

Score.prototype.inc = function(amt) {
  this.score += amt || 1;
  this.updateText();
};

Score.prototype.dec = function (amt) {
  this.score -= amt || 1;
  this.updateText();
};

dalí.extend(UI_Element, Score);

const ANOTHER_BALL = 4;

const SPRITE_WIDTH = 4096;
const SPRITE_HEIGHT = 256;
const NUM_SPRITES = 8;
const SPRITE_SCALE = 0.1;

const proxy_width = SPRITE_WIDTH  * SPRITE_SCALE / NUM_SPRITES;
const proxy_height = SPRITE_HEIGHT* SPRITE_SCALE;
const cushion = 100;

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function BallMaker(go,score,bot) {
  GameComponent.call(this,go);
  this.score = score;
  this.time = 0;
  this.proxyBot = bot;
}

BallMaker.prototype.update = function () {
  this.time += dalí.time.getDeltaTime();
  if (this.time >= ANOTHER_BALL) {
    this.generateBall();
    this.time = 0;
  }
};

BallMaker.prototype.generateBall = function() {
  this.score.inc();

  // make sure ball isn't within proxy
  var x = getRandomInt(25,dalí.canvas.width-25),
      y = getRandomInt(25,dalí.canvas.height-25);

  while (x >= this.proxyBot.getX() - cushion && x <= this.proxyBot.getX() + proxy_width + cushion && 
            y >= this.proxyBot.getY() - cushion && y <= this.proxyBot.getY() + proxy_height + cushion) {
    x = getRandomInt(25,dalí.canvas.width-25);
    y = getRandomInt(25,dalí.canvas.height-25);
  }   

  dalí.room.addObj(
    new Ball(x, y, //x.y
      getRandomInt(MIN_R,MAX_R), //r
      getRandomInt(-max_dx,max_dx),getRandomInt(-max_dy,max_dy), // v
      getRandomInt(-max_a,max_a),getRandomInt(-max_a,max_a), // a
      getRandomInt(MIN_O,MAX_O))
  );
}

dalí.extend(GameComponent, BallMaker);

