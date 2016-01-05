// for window.requestAnimationFrame
// -------------------------------------------------------------------------
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

// (function (){ ...code }()); is a trick to create a private scope for the variables within
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o', ''];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// The game setup
// ------------------------------------------------------------------------

var red = new Ball(50,50,"#FF0000",5,max_dx,max_dy);
var test = new ProxyBot(100,100);

var room = new Room();
room.addObject(red);
room.addObject(test);

// check generated GUID's
console.log(test.GUID);
console.log(red.GUID);

(function () {
    var quitState = 0;

    function gameOver() {
        alert("GAME OVER");
        document.location.reload();
    }

    function checkQuit() {
        if (dalí.input.getKey(dalí.input.Q)) {
            if (quitState == 0) {
                quitState = 1;
            }
        } else {
            if (quitState == 1) {
                quitState = 2;
            }
        }

        if (quitState == 2) {
            quitState = 0;
            gameOver();
        }
    }

    window.checkQuit = checkQuit;
}());


function readHID() {
    checkQuit();
    room.readHID();
}

function draw() {
    dalí.main.clearRect(0, 0, dalí.canvas.width, dalí.canvas.height);
    dalí.fg.clearRect(0,0, dalí.canvas.width, dalí.canvas.height);
    dalí.main.fillStyle = bgd;
    dalí.main.fillRect(0, 0, dalí.canvas.width, dalí.canvas.height);

    room.draw();
}

function update() {
    dalí.time.updateDeltaTime();
    room.update();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    readHID();
    update();
    draw();
}

var backgroundImg = new Image();
backgroundImg.src = "./img/brick.png";
var bgd = null;
backgroundImg.onload = function () {
    bgd = dalí.main.createPattern(backgroundImg, 'repeat');
    gameLoop();
};


