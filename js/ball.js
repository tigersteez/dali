const max_dx = 100;
const max_dy = 100;

const max_a = 2;

const MIN_R = 3;
const MAX_R = 10;

const BALL_LENGTH = 216;
const BALL_SCALE = 0.05;

var ballMap = new SpriteMap({
    width: BALL_LENGTH,
    height: BALL_LENGTH,
    imageurl: BALL_URL,
    numFrames: 1,
    numCols: 1
});

var canPlay = false;

var bounceSound = new Audio("./audio/whoosh.wav");
// if (typeof bounceSound.loop === 'boolean') {
//     bounceSound.loop = true;
// } else {
//     bounceSound.addEventListener("ended", function() {
//         this.currentTime = 0;
//         this.play();
//     }, false);
// }

bounceSound.loop = false;
bounceSound.addEventListener('canplaythrough', function() { 
   canPlay = true;
}, false);

var scoreboard = document.getElementById("scoreboard");

// Ball
// ------------------------------------------------------------------------------------
function Ball(x,y,radius,dx,dy,ax,ay) {
  GameObject.call(this,x,y);
  EventHandler.call(this,[dalí.physics.collisionEvent],this.GUID);
  this.gameComponents.push(new SpriteRenderer(this,{
    width: BALL_LENGTH,
    height: BALL_LENGTH,
    scaleRatio: (2*radius)/BALL_LENGTH,
    spriteMap: ballMap
  }));
  this.gameComponents.push(new Mover(this,true,dx,dy,ax||1,ay||1));
}

Ball.prototype.ongamecollision = function(eventData) {

  var mover = this.getCollider();
  var collInfo = eventData.collInfo[mover.GUID];
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

// Test function
// Mover.prototype.draw = function () {
//     dalí.main.beginPath();
//     dalí.main.arc(this.gameObj.getX(), 
//       this.gameObj.getY(), 
//       4, 
//       0, Math.PI*2);
//     dalí.main.fillStyle = "#eee";
//     dalí.main.fill();
//     dalí.main.closePath();

//     dalí.main.beginPath();
//     dalí.main.arc(this.gameObj.getX() + this.imgData.width, 
//       this.gameObj.getY() + this.imgData.height, 
//       4, 
//       0, Math.PI*2);
//     dalí.main.fillStyle = "#eee";
//     dalí.main.fill();
//     dalí.main.closePath();
// };

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
      texture: brick
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
const cushion = 7;

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
    scoreboard.innerHTML += "<p>Would have had collision</p>";
    x = getRandomInt(25,dalí.canvas.width-25);
    y = getRandomInt(25,dalí.canvas.height-25);
  }   

  dalí.room.addObj(
    new Ball(x, y, //x.y
      getRandomInt(MIN_R,MAX_R), //r
      getRandomInt(-max_dx,max_dx),getRandomInt(-max_dy,max_dy), // v
      getRandomInt(-max_a,max_a),getRandomInt(-max_a,max_a) // a
      )
  );
}

dalí.extend(GameComponent, BallMaker);

