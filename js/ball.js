const max_dx = 100;
const max_dy = 100;

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
   scoreboard.innerHTML = "Noise ready";
}, false);

var scoreboard = document.getElementById("scoreboard");

// Ball
// ------------------------------------------------------------------------------------
function Ball(x,y,color,radius,dx,dy) {
  GameObject.call(this,x,y);
  EventHandler.call(this,[dalí.physics.collisionEvent],this.GUID);
  this.gameComponents.push(new SpriteRenderer(this,{
    width: BALL_LENGTH,
    height: BALL_LENGTH,
    scaleRatio: BALL_SCALE,
    spriteMap: ballMap
  }));
  this.gameComponents.push(new Mover(this,true,dx,dy));
}

Ball.prototype.ongamecollision = function(eventData) {

  var mover = this.getCollider();
  var collInfo = eventData.collInfo[mover.GUID];
  if (collInfo.left && mover.velocity.x < 0) {
    mover.velocity.x = -mover.velocity.x;
  } else if (collInfo.right && mover.velocity.x > 0) {
    mover.velocity.x = -mover.velocity.x;
  }


  if (collInfo.top && mover.velocity.y < 0) {
    mover.velocity.y = -mover.velocity.y;
  } else if (collInfo.bottom && mover.velocity.y > 0) {
    mover.velocity.y = -mover.velocity.y;
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
