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
    this.gameObj.canvas.ctx.beginPath();
    this.gameObj.canvas.ctx.arc(this.gameObj.getX(), this.gameObj.getY(), 
      this.gameObj.transform.scale.x * this.radius, 0, Math.PI*2);
    this.gameObj.canvas.ctx.fillStyle = this.fillColor;
    this.gameObj.canvas.ctx.fill();
    this.gameObj.canvas.ctx.closePath();
}

BallComponent.prototype.update = function () {
    var newx = this.gameObj.transform.position.x +
     this.dx * this.gameObj.canvas.deltaTime;
    var newy = this.gameObj.transform.position.y +
     this.dy * this.gameObj.canvas.deltaTime;

    var top = newy - this.radius;
    var bottom = newy + this.radius;

    var left = newx - this.radius;
    var right = newx + this.radius;

    if (!(left < 0 || right > this.gameObj.canvas.width)) {
      this.gameObj.transform.position.x = newx;
    } else {
      this.dx = -this.dx;
    }

    if (!(top < 0 || bottom > this.gameObj.canvas.height)) {
      this.gameObj.transform.position.y = newy;
    } else {
      this.dy = -this.dy;
    }
}

BallComponent.prototype.readHID = function () {
    if (this.gameObj.canvas.pressed[UP]) {
      this.dy = -max_dy;
    } 

    if (this.gameObj.canvas.pressed[DOWN]) {
      this.dy = max_dy;
    }

    if (this.gameObj.canvas.pressed[LEFT]) {
      this.dx = -max_dx;
    } 

    if (this.gameObj.canvas.pressed[RIGHT]) {
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
function Ball(x,y,canvas,color,radius,dx,dy) {
  GameObject.call(this,x,y,canvas);
  this.gameComponents.push(new BallComponent(this,color,radius,dx,dy));
}

extend(GameObject, Ball);
