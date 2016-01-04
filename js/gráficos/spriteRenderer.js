// SpriteRenderer
// adapted from:
//    http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
// ------------------------------------------------------------------------------------------
function SpriteRenderer(go,options) {
    GameComponent.call(this,go);
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.spriteMap = options.spriteMap;
    this.numberOfFrames = options.numFrames || 1;
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

SpriteRenderer.prototype.getMapIndices = function () {
    var indices = new Array();
    indices.push(Math.floor(this.frameIndex / this.spriteMap.numCols));
    indices.push(this.frameIndex % this.spriteMap.numCols);
    return indices;
}

SpriteRenderer.prototype.draw = function() {
    var indices = this.getMapIndices();
    this.spriteMap.draw(this.gameObj.getX(),this.gameObj.getY(),indices[0],indices[1]);
}

extend(GameComponent, SpriteRenderer);
