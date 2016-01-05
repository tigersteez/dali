// BallComponent
// ------------------------------------------------------------------------------------
const max_dx = 100;
const max_dy = 100;

function BallComponent(go,color,radius,dx,dy) {
  GameComponent.call(this,go);
  this.radius = radius;
  this.fillColor = color;
  this.dx = dx;
  this.dy = dy;
}

BallComponent.prototype.update = function () {
    var newx = this.gameObj.transform.position.x +
     this.dx * dalí.time.getDeltaTime();
    var newy = this.gameObj.transform.position.y +
     this.dy * dalí.time.getDeltaTime();

    var top = newy;
    var bottom = newy + 2*this.radius;

    var left = newx;
    var right = newx + 2*this.radius;

    if (!(left < 0 || right > dalí.canvas.width)) {
      this.gameObj.transform.position.x = newx;
    } else {
      this.dx = -this.dx;
    }

    if (!(top < 0 || bottom > dalí.canvas.height)) {
      this.gameObj.transform.position.y = newy;
    } else {
      this.dy = -this.dy;
    }
}

BallComponent.prototype.readHID = function () {
    if (dalí.input.getKey(dalí.input.UP)) {
      this.dy = -max_dy;
    } 

    if (dalí.input.getKey(dalí.input.DOWN)) {
      this.dy = max_dy;
    }

    if (dalí.input.getKey(dalí.input.LEFT)) {
      this.dx = -max_dx;
    } 

    if (dalí.input.getKey(dalí.input.RIGHT)) {
      this.dx = max_dx;
    } 
}

BallComponent.prototype.resetSpeeds = function () {
  this.dx = 0;
  this.dy = 0;
}

extend(GameComponent, BallComponent);

// Ball
// ------------------------------------------------------------------------------------
function Ball(x,y,color,radius,dx,dy) {
  Player.call(this,x,y);
  this.gameComponents.push(new ParticleRenderer(this,{
    width: 10,
    height: 10,
    color: "#000000"
  }));
  this.gameComponents.push(new BallComponent(this,color,radius,dx,dy));
  this.gameComponents.push(new Collider(this,true));
}

extend(Player, Ball);
