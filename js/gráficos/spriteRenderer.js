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
    this.scaleRatio = options.scaleRatio || 1;
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
    return {
        i: Math.floor(this.frameIndex / this.spriteMap.numCols),
        j: this.frameIndex % this.spriteMap.numCols
    };
}

SpriteRenderer.prototype.draw = function() {
    var idx = this.getMapIndices();
    this.spriteMap.draw(this.gameObj.getX(),this.gameObj.getY(), // x,y
        idx.i, idx.j, // i,j
        this.scaleRatio); // scale
}

extend(GameComponent, SpriteRenderer);
