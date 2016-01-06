const max_dx = 100;
const max_dy = 100;

// Ball
// ------------------------------------------------------------------------------------
function Ball(x,y,color,radius,dx,dy) {
  GameObject.call(this,x,y);
  EventHandler.call(this,[dalí.physics.collisionEvent],this.GUID);
  this.gameComponents.push(new ParticleRenderer(this,{
    width: radius*2,
    height: radius*2,
    color: color
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

dalí.extend(EventHandler, Ball);
dalí.extend(GameObject, Ball);

// Wall
// --------------------------------------------------------------------------------------
function Wall(x,y,width,height) {
  GameObject.call(this,x,y);
  this.gameComponents.push(
    new BoxRenderer(this,{
      width: width,
      height: height,
      color: "#000",
      borderThickness: 0
    })
  );
  this.gameComponents.push(new Collider(this,true));
}

dalí.extend(GameObject, Wall);
