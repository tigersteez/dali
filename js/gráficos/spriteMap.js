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
  dalí.main.drawImage(
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
  dalí.fg.drawImage(
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
  dalí.fg.save();
  dalí.main.save();
  // top left corner
  dalí.fg.translate(x,y);
  dalí.main.translate(x,y);
  this.render(i,j,scaleRatio);
  dalí.fg.restore();
  dalí.main.restore();
};
