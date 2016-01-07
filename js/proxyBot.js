
const SPRITE_WIDTH = 4096;
const SPRITE_HEIGHT = 256;
const NUM_SPRITES = 8;
const SPRITE_SCALE = 0.1;

var spriteMap = new SpriteMap({
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    imageurl: SPRITE_URL,
    numFrames: NUM_SPRITES,
    numCols: NUM_SPRITES
});

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
};

dalí.extend(GameComponent, ProxyController);

// ProxyBot
// ------------------------------------------------------------------------------------
function ProxyBot(x,y) {
  Player.call(this,x,y);
  EventHandler.call(this,[dalí.physics.collisionEvent],this.GUID);
  this.gameComponents.push(new Mover(this,true));
  this.gameComponents.push(new ProxyController(this));
  this.gameComponents.push(new Animation(this,{
    scaleRatio: SPRITE_SCALE,
    spriteMap: spriteMap,
    numFrames: NUM_SPRITES,
    ticksPerFrame: 1
  }));

  // Component GUID check
  // this.gameComponents.forEach(function (component) {
  //   console.log(component.GUID);
  // });
}

var scoreboard = null;
var score = 0;

window.onload = function () {
  scoreboard = document.getElementById("scoreboard");
};

ProxyBot.prototype.ongamecollision = function(eventData) {
  // Collision test
  var collInfo = eventData.collInfo[this.getCollider().GUID];
  var otherGUID = null;
  if (dalí.identifier.getDataFromGUID(eventData.GUID1).getObjID().hashCode() === this.GUID.hashCode()) {
     otherGUID = eventData.GUID2; 
  } else {
    otherGUID = eventData.GUID1;
  }

  var otherData = dalí.identifier.getDataFromGUID(otherGUID);
  var myData = dalí.identifier.getDataFromGUID(this.GUID);

  if ("Wall".hashCode() == otherData.objClass.hashCode()) {
    if (collInfo.left || collInfo.right) {
      this.getCollider().velocity.x = 0;
    }
  } else {
    score += 1;
    var scoreString = "<p>Collisions between " + otherData.objClass + " and " +
      myData.objClass + ": " + score + "</p>";
    console.log(scoreString); 
    scoreboard.innerHTML = scoreString;
    text.getRenderer().setText(score.toString(),50);
  }
};

dalí.extend(EventHandler, ProxyBot);
dalí.extend(Player, ProxyBot);


