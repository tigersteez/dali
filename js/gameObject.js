// GameComponent
// -------------------------------------------------------------------------------
function GameComponent (go) {
  this.gameObj = go;
}

GameComponent.prototype.update = function () {};
GameComponent.prototype.draw = function () {};
GameComponent.prototype.readHID = function () {};

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
  this.GUID = this.constructor.name + ":" + 
    dalí.identifier.getClientID() + ":" + 
    dalí.identifier.randomString(7);

  this.gameComponents = new Array();
  this.transform = {
    position: new Vector(x,y),
    rotation: 0
  };
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

// Player
// -------------------------------------------------------------------------------
function Player(x,y) {
  GameObject.call(this,x,y);
}

dalí.extend(GameObject, Player);

Player.prototype.readHID = function () {
  this.gameComponents.forEach(
    function(component) {
      if (component instanceof GameComponent) {
        component.readHID();
      }
    }
  );
};
