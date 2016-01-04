function SpriteMap(options) {

}

// SpriteRenderer
// adapted from:
//    http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
// ------------------------------------------------------------------------------------------
function SpriteRenderer(go,options) {
    GameComponent.call(this,go);
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.numberOfFrames = options.numberOfFrames || 1;
    
    this.context = options.context;
    this.width = options.width;
    this.height = options.height;
    this.image = options.image;
    this.scaleRatio = 1;
}

SpriteRenderer.prototype.update = function () {
    this.tickCount += 1;

    if (this.tickCount > this.ticksPerFrame) {

        this.tickCount = 0;

            // If the current frame index is in range
            if (this.frameIndex < this.numberOfFrames - 1) {  
                // Go to the next frame
                this.frameIndex += 1;
            } else {
                this.frameIndex = 0;
            }
        }
    };

SpriteRenderer.prototype.render = function () {
  // Draw the animation
  this.context.save();
  this.context.translate(this.gameObj.transform.position.x - (this.width / (2*this.numberOfFrames)) * this.scaleRatio,
    this.gameObj.transform.position.y - (this.height / 2) * this.scaleRatio);
  this.context.drawImage(
    this.image,
    this.frameIndex * this.width / this.numberOfFrames,
    0,
    this.width / this.numberOfFrames,
    this.height,
    0, // top left corner
    0,
    this.width / this.numberOfFrames * this.scaleRatio,
    this.height * this.scaleRatio);

  this.context.restore();
};

SpriteRenderer.prototype.getFrameWidth = function () {
  return this.width / this.numberOfFrames;
};

SpriteRenderer.prototype.draw = function() {
    this.render();
}

extend(GameComponent, SpriteRenderer);
