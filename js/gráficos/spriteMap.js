// SpriteMap
// adapted from:
//    http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
// ------------------------------------------------------------------------------------------
function SpriteMap(options) {
  this.numFrames = options.numFrames || 1;
  this.numRows = options.numRows || 1;
  this.numCols = options.numCols || 1;
  this.width = options.width;
  this.height = options.height;
  this.image = options.image;
  this.scaleRatio = options.scaleRatio || 1;

  this.spriteWidth = this.width / this.numCols;
  this.spriteHeight = this.height / this.numRows;
}

SpriteMap.prototype.getScaledWidth = function () {
  return this.spriteWidth * this.scaleRatio;
};

SpriteMap.prototype.getScaledHeight = function () {
  return this.spriteHeight * this.scaleRatio;
};

SpriteMap.prototype.render = function (i,j) {
  // Draw the corresponding sprite
  dalí.ctx.drawImage(
    this.image,
    j * this.spriteWidth, // column
    i * this.spriteHeight, // row
    this.spriteWidth,
    this.spriteHeight,
    0,
    0,
    this.getScaledWidth(),
    this.getScaledHeight()
  );
};

SpriteMap.prototype.draw = function(x,y,i,j) {
  dalí.ctx.save();
  // top left corner
  dalí.ctx.translate(x - this.getScaledWidth() / 2,
    y - this.getScaledHeight() / 2);
  this.render(i,j);
  dalí.ctx.restore();
};
