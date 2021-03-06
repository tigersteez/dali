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

  this.spriteWidth = this.width / this.numCols;
  this.spriteHeight = this.height / this.numRows;
}

SpriteMap.prototype.render = function (i,j,scaleRatio) {
  // Draw the corresponding sprite

  dalí.main.drawImage(
    this.img,
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
    this.img,
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
  var cameraPos = dalí.room.mainCamera.getPosition();
  dalí.fg.save();
  dalí.main.save();
  // top left corner
  dalí.fg.translate(x,y);
  dalí.main.translate(x - cameraPos.x,y - cameraPos.y);
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

FontMap.prototype.draw = function (x,y,char,scaleRatio) {
  var ij = this.getMapIndices(this.mapCharToIdx(char));
  SpriteMap.prototype.draw.call(this,x,y,ij.i,ij.j,scaleRatio);
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

