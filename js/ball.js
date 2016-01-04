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

BallComponent.prototype.draw = function () {
    dalí.ctx.beginPath();
    dalí.ctx.arc(this.gameObj.getX(), this.gameObj.getY(), 
      this.gameObj.transform.scale.x * this.radius, 0, Math.PI*2);
    dalí.ctx.fillStyle = this.fillColor;
    dalí.ctx.fill();
    dalí.ctx.closePath();
}

BallComponent.prototype.update = function () {
    var newx = this.gameObj.transform.position.x +
     this.dx * dalí.time.getDeltaTime();
    var newy = this.gameObj.transform.position.y +
     this.dy * dalí.time.getDeltaTime();

    var top = newy - this.radius;
    var bottom = newy + this.radius;

    var left = newx - this.radius;
    var right = newx + this.radius;

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
  GameObject.call(this,x,y);
  this.gameComponents.push(new BallComponent(this,color,radius,dx,dy));
}

extend(GameObject, Ball);
