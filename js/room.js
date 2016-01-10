// Room
// ---------------------------------------------------
function Room() {
  this.loadingObjs = {};
  this.objects = {};
  this.colliders = [];
  this.movers = [];
  this.players = [];
  this.toBeRemoved = new Queue();
  this.mainCamera = null;
  this.cameras = [];
}

Room.prototype.addLoadingObj = function(gameObj) {
  if (gameObj instanceof GameObject) {
    this.loadingObjs[gameObj.GUID] = gameObj;
  }
};

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

    if (gameObj instanceof Camera) {
      this.cameras.push(gameObj.GUID);
      if (this.mainCamera === null) {
        this.mainCamera = gameObj;
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
  // TODO: might want to restructure this...
  for (var key in this.objects) {
    if (this.objects[key] instanceof Player || 
      this.objects[key] instanceof Camera) {
      this.objects[key].readHID();
    }
  }
};

Room.prototype.draw = function() {
  dalí.main.clearRect(0, 0, dalí.canvas.width, dalí.canvas.height);
  dalí.fg.clearRect(0,0, dalí.canvas.width, dalí.canvas.height);
  for (var key in this.objects) {
    if (this.objects[key] instanceof GameObject) {
      this.objects[key].draw();
    }
  }
  dalí.drawing.draw();
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
};

Room.prototype.getMover = function(GUID) {
  if (this.movers.contains(GUID)) {
    var obj = this.getObj(GUID);
    if (obj !== null) {
      return obj.getCollider();
    }
  }
  return null;
};

Room.prototype.loop = function () {
  dalí.events.emptyQueue();
  this.readHID();
  dalí.time.updateDeltaTime();
  this.update();
  dalí.events.emptyQueue();
  this.removeObjects();
  this.draw();
  dalí.physics.checkCollisions(this);
};

Room.prototype.drawLoading = function () {
  dalí.main.clearRect(0, 0, dalí.canvas.width, dalí.canvas.height);
  dalí.fg.clearRect(0,0, dalí.canvas.width, dalí.canvas.height);
  dalí.main.fillStyle = "#000";
  dalí.main.fillRect(0,0,dalí.canvas.width,dalí.canvas.height);
  for (var key in this.loadingObjs) {
    if (this.loadingObjs[key] instanceof GameObject) {
      this.loadingObjs[key].draw();
    }
  }
  dalí.drawing.draw();
};

Room.prototype.deleteLoading = function () {
  delete loadingObjs;
};


