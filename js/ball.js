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
  this.getCollider().velocity.x = -this.getCollider().velocity.x;
  this.getCollider().velocity.y = -this.getCollider().velocity.y;
}

dalí.extend(EventHandler, Ball);
dalí.extend(GameObject, Ball);
