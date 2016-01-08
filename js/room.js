// Room
// ---------------------------------------------------
function Room() {
  this.objects = {};
  this.colliders = [];
  this.movers = [];
  this.players = [];
  this.toBeRemoved = new Queue();
}

Room.prototype.addObj = function(gameObj) {
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

function removeNum(array,number) {
  for(var i = array.length - 1; i >= 0; i--) {
    if(array[i] === number) {
       array.splice(i, 1);
    }
  }
}

Room.prototype.removeObj = function(GUID) {
  this.toBeRemoved.enqueue(GUID);
};

Room.prototype.removeObjects = function() {
  while(!this.toBeRemoved.isEmpty()) {
    this.remove(this.toBeRemoved.dequeue());
  }
};

Room.prototype.remove = function(GUID) {
  // TODO: optimize
  removeNum(this.colliders, GUID);
  removeNum(this.movers, GUID);
  removeNum(this.players, GUID);
  delete this.objects[GUID];
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

Room.prototype.getObj = function(GUID) {
  if (GUID in this.objects) {
    return this.objects[GUID];
  }
  return null;
};

Room.prototype.getPlayer = function(GUID) {
  if (this.players.contains(GUID)) {
    return this.getObj(GUID);
  }
  return null;
};

Room.prototype.getCollider = function(GUID) {
  if (this.colliders.contains(GUID)) {
    var obj = this.getObj(GUID);
    if (obj !== null) {
      return obj.getCollider();
    }
  }
  return null;
}

Room.prototype.getMover = function(GUID) {
  if (this.movers.contains(GUID)) {
    var obj = this.getObj(GUID);
    if (obj !== null) {
      return obj.getCollider();
    }
  }
  return null;
}
