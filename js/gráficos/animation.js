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
    return this.spriteMap.getMapIndices(this.frameIndex);
};

dalí.extend(SpriteRenderer, Animation);

// UI_Element
// -------------------------------------------------------------------
function UI_Element(x,y,options) {
    GameObject.call(this,x,y);
    this.x0 = this.transform.position.x;
    this.y0 = this.transform.position.y;
}

UI_Element.prototype.draw = function () {
    for (var i =0; i < this.gameComponents.length; i++) {
        dalí.drawing.queue(this.gameComponents[i]);
        this.transform.position.x += this.gameComponents[i].width * this.gameComponents[i].scaleRatio;
    }
    this.transform.position.x = this.x0;
};

dalí.extend(GameObject, UI_Element);

