// BallComponent
// ------------------------------------------------------------------------------------
const max_dx = 100;
const max_dy = 100;


function BallComponent(go,radius) {
  GameComponent.call(this,go);
  this.radius = radius;
}

BallComponent.prototype.update = function () {
    var mover = this.gameObj.getCollider();
    var top = this.gameObj.transform.position.y;
    var bottom = top + 2*this.radius;

    var left = this.gameObj.transform.position.x;
    var right = left + 2*this.radius;

    if (left < 0 || right > dalí.canvas.width) {
      mover.velocity.x = -mover.velocity.x;
      //mover.acceler.x = -mover.acceler.x;
    }

    if (top < 0 || bottom > dalí.canvas.height) {
      mover.velocity.y = -mover.velocity.y;
      //mover.acceler.y = -mover.acceler.y;
    }
}

dalí.extend(GameComponent, BallComponent);

// Ball
// ------------------------------------------------------------------------------------
function Ball(x,y,color,radius,dx,dy) {
  GameObject.call(this,x,y);
  EventHandler.call(this,[dalí.physics.collisionEvent],this.GUID);
  this.gameComponents.push(new ParticleRenderer(this,{
    width: 10,
    height: 10,
    color: color
  }));
  this.gameComponents.push(new BallComponent(this,radius));
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

dalí.extend(EventHandler, Ball);
dalí.extend(GameObject, Ball);
