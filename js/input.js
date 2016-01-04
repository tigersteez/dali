// Input singleton
// -------------------------------------------------------------------------------
(function () {
  var keys = new Object();
  // TODO: touch controls
  // TODO: mouse controls

  function addKey (keyCode) {
    keys[keyCode] = false;
  }

  function needKey (keyCode) {
    return typeof keys[keyCode] === 'undefined';
  }

  var getKey = function(keyCode) {
    if (needKey(keyCode)) {
      addKey(keyCode);
    }
    return keys[keyCode];
  }

  var keyPressed = function (keyCode) {
    keys[keyCode] = true;
  }

  var keyReleased = function (keyCode) {
    addKey(keyCode);
  }

  // init singleton
  window.dalí.input = {
    getKey: getKey,
    keyPressed: keyPressed,
    keyReleased: keyReleased
  };
} ());

// Arrow keycodes for all modern browsers and other consts
dalí.input.LEFT = 37;
dalí.input.UP = 38;
dalí.input.RIGHT = 39;
dalí.input.DOWN = 40;
dalí.input.Q = 81;

document.addEventListener("keydown", function (event) {
  dalí.input.keyPressed(event.keyCode);
});

document.addEventListener("keyup", function (event) {
  dalí.input.keyReleased(event.keyCode);
});
