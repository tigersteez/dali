// Input singleton
// courtesy of: http://jlongster.com/Making-Sprite-based-Games-with-Canvas
// will alter to support other inputs and input remapping
// -------------------------------------------------------------------------------
(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    // init singleton
    window.dalí.input = {
        keys: {
          isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
          }
        }
    };

    // TODO: mouse
    // TODO: touch

})();
