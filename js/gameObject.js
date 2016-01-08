// Vector
// -------------------------------------------------------------------------------
function Vector (x,y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.mult = function(vect,constant) {
  return new Vector(vect.x * constant, vect.y * constant);
}

Vector.add = function(vect,otherVect) {
  var res = new Vector(vect.x, vect.y);
  res.x += otherVect.x;
  res.y += otherVect.y;
  return res;
}

// GameObject
// -------------------------------------------------------------------------------
function GameObject (x,y) {
  // generate globally unique id for instance
  this.GUID = dalí.identifier.generateObjID(this);

  this.gameComponents = new Array();
  this.transform = {
    position: new Vector(x,y),
    rotation: 0
  };
}

GameObject.prototype.addComp = function(comp) {
  this.gameComponents.push(comp);
}

GameObject.prototype.update = function () {
  this.gameComponents.forEach(
    function(component) {
      if (component instanceof GameComponent) {
        component.update();
      }
    }
  );
};

GameObject.prototype.getX = function () {
  return this.transform.position.x;
};


GameObject.prototype.getY = function () {
  return this.transform.position.y;
};

GameObject.prototype.getPosition = function () {
  return this.transform.position;
}

function Camera(player) {
  if (typeof player !== 'undefined' && player !== null) {
    GameObject.call(this,player.getX(),player.getY());
  } else {
    GameObject.call(this,0,0);
  }
}

dalí.extend(GameObject, Camera);

// Player
// -------------------------------------------------------------------------------
function Player(x,y,camera) {
  GameObject.call(this,x,y);
  if (typeof camera !== 'undefined' && camera !== null) {
    this.camera = camera;
    // Assumes that since camera was given, it was already added to room
  } else {
    this.camera = new Camera(this);
    dalí.room.addObj(this.camera);
  }
}

dalí.extend(GameObject, Player);

GameObject.prototype.readHID = function () {
  this.gameComponents.forEach(
    function(component) {
      if (component instanceof GameComponent) {
        component.readHID();
      }
    }
  );
};

// GameComponent
// -------------------------------------------------------------------------------
function GameComponent (go) {
  this.gameObj = go;
  this.GUID = dalí.identifier.generateComponentID(this);
}

GameComponent.prototype.update = function () {};
GameComponent.prototype.draw = function () {};
GameComponent.prototype.readHID = function () {};
