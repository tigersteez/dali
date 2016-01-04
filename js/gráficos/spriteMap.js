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

  this.spriteWidth = this.width / this.numCols;
  this.spriteHeight = this.height / this.numRows;
}

SpriteMap.prototype.render = function (i,j,scaleRatio) {
  // Draw the corresponding sprite
  dalí.ctx.drawImage(
    this.image,
    j * this.spriteWidth, // column
    i * this.spriteHeight, // row
    this.spriteWidth,
    this.spriteHeight,
    0,
    0,
    this.spriteWidth * scaleRatio,
    this.spriteHeight * scaleRatio
  );
};

SpriteMap.prototype.draw = function(x,y,i,j,scaleRatio) {
  dalí.ctx.save();
  // top left corner
  dalí.ctx.translate(x - this.spriteWidth * scaleRatio / 2,
    y - this.spriteHeight * scaleRatio / 2);
  this.render(i,j,scaleRatio);
  dalí.ctx.restore();
};
