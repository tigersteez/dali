// ProxyController
// ------------------------------------------------------------------------------------
function ProxyController(go) {
  GameComponent.call(this,go);
}

ProxyController.prototype.update = function () {
  this.gameObj.getCollider().reset();
};

ProxyController.prototype.readHID = function () {
    var mover = this.gameObj.getCollider();

    if (dalí.input.keys.isDown('LEFT')) {
      mover.velocity.x = -max_dx;
    } 

    if (dalí.input.keys.isDown('RIGHT')) {
      mover.velocity.x = max_dx;
    }

    if (dalí.input.keys.isDown('UP')) {
      mover.velocity.y = -max_dy;
    } 

    if (dalí.input.keys.isDown('DOWN')) {
      mover.velocity.y = max_dy;
    }
};

dalí.extend(GameComponent, ProxyController);

function Health(x,y,options) {
  UI_Element.call(this,x,y,options);
  this.health = 3;
  this.oldHealth = this.health;
  this.makeString();
  options.text = "Lives: " + this.str;
  this.gameComponents.push(
    new TextRenderer(this,options)
  );
  this.scaleRatio = this.gameComponents[0].scaleRatio;
}

Health.prototype.updateText = function() {
  this.makeString();
  this.gameComponents[0].setText("Lives: " + this.str);
};

Health.prototype.makeString = function() {
  if (this.health === 0)
    return dalí.gameOver();
  this.str = "";
  for (var i = 0; i < this.health; i++) {
    this.str += "X";
  }
};

Health.prototype.inc = function(amt) {
  this.oldHealth = this.health;
  this.health += amt || 1;
  this.updateText();
};

Health.prototype.dec = function (amt) {
  this.oldHealth = this.health;
  this.health -= amt || 1;
  this.updateText();
};

dalí.extend(UI_Element, Health);

// ProxyBot
// ------------------------------------------------------------------------------------
function ProxyBot(x,y,health,score,camera) {
  Player.call(this,x,y,camera);
  EventHandler.call(this,[dalí.physics.collisionEvent],this.GUID);
  this.gameComponents.push(new Mover(this,true));
  this.gameComponents.push(new ProxyController(this));
  this.gameComponents.push(new Animation(this,{
    scaleRatio: SPRITE_SCALE,
    spriteurl: SPRITE_URL,
    numFrames: NUM_SPRITES,
    ticksPerFrame: 1
  }));
  this.health = health;
  this.score = score;

  // Component GUID check
  // this.gameComponents.forEach(function (component) {
  //   console.log(component.GUID);
  // });
}

// var scoreboard = null;
// var score = 0;

// window.onload = function () {
//   scoreboard = document.getElementById("scoreboard");
// };

ProxyBot.prototype.ongamecollision = function(eventData) {
  // Collision test
  var myCollider = this.getCollider();
  var collInfo = eventData.collInfo[myCollider.GUID];
  var otherGUID = null;
  if (eventData.GUID1.hashCode() === myCollider.GUID.hashCode()) {
     otherGUID = eventData.GUID2; 
  } else {
    otherGUID = eventData.GUID1;
  }

  var otherData = dalí.identifier.getDataFromGUID(otherGUID);
  var myData = dalí.identifier.getDataFromGUID(this.GUID);

  if ("Wall".hashCode() == otherData.objClass.hashCode()) {
    if (collInfo.left || collInfo.right) {
      myCollider.velocity.x = 0;
    }
    if (collInfo.top || collInfo.bottom) {
      myCollider.velocity.y = 0;
    }
  } else {
    var scoreString = "<p>Collisions between " + otherData.objClass + " and " +
      myData.objClass + "</p>";
    console.log(scoreString); 
    // scoreboard.innerHTML = scoreString;
    this.health.dec();
    this.score.dec();
    dalí.room.removeObj(otherData.getObjID());

    if (canPlay) {
      bounceSound.play();
    }

  }
};

dalí.extend(EventHandler, ProxyBot);
dalí.extend(Player, ProxyBot);

