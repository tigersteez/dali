// Room
// ---------------------------------------------------
function Room() {
  this.objects = {};
  this.colliders = [];
  this.movers = [];
  this.players = [];
}

Room.prototype.addObject = function(gameObj) {
  if (gameObj instanceof GameObject) {
    this.objects[gameObj.GUID] = gameObj;

    if (gameObj instanceof Player) {
      this.players.push(gameObj.GUID);
    }

    var collider = gameObj.getCollider();

    if (collider !== null) {
      if (collider instanceof Mover) {
        this.movers.push(gameObj.GUID);
      } else {
        this.colliders.push(gameObj.GUID);
      }
    }
  }
};

Room.prototype.readHID = function() {
  for (var i in this.players) {
    if (this.objects[this.players[i]] instanceof Player) {
      this.objects[this.players[i]].readHID();
    }
  }
};

Room.prototype.draw = function() {
  for (var key in this.objects) {
    if (this.objects[key] instanceof GameObject) {
      this.objects[key].draw();
    }
  }
};

Room.prototype.update = function() {
  for (var key in this.objects) {
    if (this.objects[key] instanceof GameObject) {
      this.objects[key].update();
    }
  }
};
