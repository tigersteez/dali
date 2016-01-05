// Animation 
// -------------------------------------------------------------------
function Animation(go,options) {
    SpriteRenderer.call(this,go,options);
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.numberOfFrames = options.numFrames || 1;
}

Animation.prototype.update = function () {
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

Animation.prototype.getMapIndices = function() {
    return {
        i: Math.floor(this.frameIndex / this.spriteMap.numCols),
        j: this.frameIndex % this.spriteMap.numCols
    };
}

dalí.extend(SpriteRenderer, Animation);

// UI_Element
// -------------------------------------------------------------------
function UI_Element(go,options) {
    SpriteRenderer.call(this,options);
    this.font = this.spriteMap;
}

UI_Element.prototype.render = function () {
    // TODO
}

dalí.extend(SpriteRenderer, UI_Element);

