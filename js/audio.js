// adapted from: https://forestmist.org/blog/web-audio-api-loops

dalí.audio = {};
dalí.audio.ctx = null;

try {
    // More info at http://caniuse.com/#feat=audio-api
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    dalí.audio.ctx = new window.AudioContext();
} catch(e) {
    alert('Web Audio API not supported in this browser.');
}

function GameAudio(go,bufferurl,loop) {
  GameComponent.call(this,go);
  this.source = dalí.audio.ctx.createBufferSource();
  this.source.buffer = dalí.resources.getAudioBuffer(bufferurl);
  this.source.loop = loop;
  this.source._playing = false;
  this.source.connect(dalí.audio.ctx.destination);
}

GameAudio.prototype.play = function() {
  if (!this.source._playing) {
    this.source.start(dalí.audio.ctx.currentTime);
    this.source._playing = true;
  }
};

GameAudio.prototype.stop = function() {
  if (this.source._playing) {
    this.source.stop();
    this.source._playing = false;
  }
};

dalí.extend(GameComponent, GameAudio);

GameObject.prototype.getAudio = function () {
  for (var i in this.gameComponents) {
    if (this.gameComponents[i] instanceof GameAudio) {
      return this.gameComponents[i];
    }
  }
  return null;
};


