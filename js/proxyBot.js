var spriteImg = new Image();
spriteImg.src = "./img/proxyBot.png";

const SPRITE_WIDTH = 4096;
const SPRITE_HEIGHT = 256;
const NUM_SPRITES = 8;
const SPRITE_SCALE = 0.1;

var spriteMap = new SpriteMap({
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    image: spriteImg,
    numFrames: NUM_SPRITES,
    numCols: NUM_SPRITES,
    ticksPerFrame: 1
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

ProxyBot.prototype.ongamecollision = function(eventData) {
  // Collision test
  console.log("Collision between " + dalí.identifier.getClassFromID(eventData.GUID1) + " and " +
    dalí.identifier.getClassFromID(eventData.GUID2));

  var collInfo = eventData.collInfo[this.getCollider().GUID];
  for (var key in collInfo) {
    console.log(key + ": " + collInfo[key]);
  }

};

dalí.extend(EventHandler, ProxyBot);
dalí.extend(Player, ProxyBot);


