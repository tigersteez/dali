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
  this.img = dalí.resources.getImg(options.imgurl);
  this.offsetX = options.offsetX || 0;
  this.offsetY = options.offsetY || 0;

  this.spriteWidth = this.width / this.numCols;
  this.spriteHeight = this.height / this.numRows;
}

SpriteMap.prototype.render = function (i,j,scaleRatio) {
  // Draw the corresponding sprite

  dalí.main.drawImage(
    this.img,
    j * this.spriteWidth + this.offsetY, // column
    i * this.spriteHeight + this.offsetX, // row
    this.spriteWidth,
    this.spriteHeight,
    0,
    0,
    this.spriteWidth * scaleRatio,
    this.spriteHeight * scaleRatio
  );
  dalí.fg.drawImage(
    this.img,
    j * this.spriteWidth + this.offsetY, // column
    i * this.spriteHeight + this.offsetX, // row
    this.spriteWidth,
    this.spriteHeight,
    0,
    0,
    this.spriteWidth * scaleRatio,
    this.spriteHeight * scaleRatio
  );
};

SpriteMap.prototype.draw = function(x,y,i,j,scaleRatio,orientation) {
  var cameraPos = dalí.room.mainCamera.getPosition();
  dalí.fg.save();
  dalí.main.save();
  // top left corner
  dalí.fg.translate(x,y);
  dalí.fg.translate(this.spriteWidth * scaleRatio / 2, this.spriteHeight * scaleRatio / 2);
  dalí.fg.rotate(orientation);
  dalí.fg.translate(-this.spriteWidth * scaleRatio / 2, -this.spriteHeight * scaleRatio / 2);

  dalí.main.translate(x - cameraPos.x,y - cameraPos.y);
  dalí.main.translate(this.spriteWidth * scaleRatio / 2, this.spriteHeight * scaleRatio / 2);
  dalí.main.rotate(orientation);
  dalí.main.translate(-this.spriteWidth * scaleRatio / 2, -this.spriteHeight * scaleRatio / 2);

  this.render(i,j,scaleRatio);
  dalí.fg.restore();
  dalí.main.restore();
};

SpriteMap.prototype.getMapIndices = function(frameIdx) {
    return {
        i: Math.floor(frameIdx / this.numCols),
        j: frameIdx % this.numCols
    };
};


// FontMap
// ------------------------------------------------------------------------------------------
function FontMap(options) {
  SpriteMap.call(this,options);
  this.mapCharToIdx = options.mapCharToIdx || function (char) {
    return char.charCodeAt(0);
  };
}

FontMap.prototype.draw = function (x,y,char,scaleRatio,orientation) {
  var ij = this.getMapIndices(this.mapCharToIdx(char));
  SpriteMap.prototype.draw.call(this,x,y,ij.i,ij.j,scaleRatio,orientation);
};

dalí.extend(SpriteMap,FontMap);


// Texture
// ------------------------------------------------------------------------------------------
function Texture(imgurl) {
  this.imgurl = imgurl;
  this.texture = dalí.main.createPattern(dalí.resources.getImg(imgurl), 'repeat');
}

Texture.prototype.render = function(x,y,w,h,isBackground) {
    var cameraPos = dalí.room.mainCamera.getPosition();
    dalí.main.fillStyle = this.texture;
    dalí.main.fillRect(x - cameraPos.x, y - cameraPos.y, w, h);

    if (!isBackground) {
      dalí.fg.fillStyle = this.texture;
      dalí.fg.fillRect(x, y, w, h);
    }
};

