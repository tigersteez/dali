function Collider(go,isSolid) {
  GameComponent.call(this,go);
  this.imgData = null;
  this.isSolid = isSolid;
} 

extend(GameComponent,Collider);

GameObject.prototype.getCollider = function () {
  for (var i in this.gameComponents) {
    if (this.gameComponents[i] instanceof Collider) {
      return this.gameComponents[i];
    }
  }
  return null;
};


function Mover(go,isSolid,vx,vy,ax,ay) {
  Collider.call(this,go);
  this.velocity = new Vector(vx || 0, vy || 0);
  this.acceler = new Vector(ax || 0, ay || 0);
}

Mover.prototype.update = function () {
  this.velocity = Vector.add(this.velocity,
    Vector.mult(this.acceler,dalí.time.getDeltaTime));
  this.gameObj.transform.position = Vector.add(this.gameObj.transform.position,
    Vector.mult(this.velocity,dalí.time.getDeltaTime()));
}

Mover.prototype.resetSpeeds = function () {
  this.velocity = new Vector();
}

Mover.prototype.resetAccs = function () {
  this.acceler = new Vector();
}

Mover.prototype.reset = function () {
  this.resetSpeeds();
  this.resetAccs();
}

extend(Collider,Mover);
