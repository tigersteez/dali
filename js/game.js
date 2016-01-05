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

//var blue = new Ball(canvas.width/2,canvas.height-30,dalí,"#0095DD",10,0,0);
var red = new Ball(50,50,"#FF0000",5,max_dx,max_dy);
var test = new ProxyBot(100,100);

// check generated GUID's
//console.log(blue.GUID);
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
    test.readHID();
    //red.readHID();
}

var first = true

function drawGame() {
    red.update();
    red.draw();

    // blue.update();
    // blue.draw();

    test.update();
    test.draw();

    // if (first) {
    //     var imgData = dalí.main.getImageData(0,0,10,10);
    //     for (var i = 0; i < 10; i++) {
    //         for (var j = 0; j < 10; j++) {
    //             if (imgData.data[ (i + j*10)*4 + 3 ] == 0) {
    //                 console.log("Black");
    //             }
    //         }
    //     }
    //     first = false;
    // }

    var fgData = dalí.fg.getImageData(0,0,dalí.canvas.width,dalí.canvas.height);
    var bgData = dalí.main.getImageData(0,0,dalí.canvas.width,dalí.canvas.height);

    var pixel = null;
    for (var y = 0; y < dalí.canvas.height; y++) {
        for (var x = 0; x < dalí.canvas.width; x++) {
            pixel = (x + y*dalí.canvas.width)*4 + 3;
            if (fgData.data[pixel] !== 0) {
                bgData.data[pixel-3] = fgData.data[pixel - 3];
                bgData.data[pixel-2] = fgData.data[pixel - 2];
                bgData.data[pixel-1] = fgData.data[pixel - 1];
                bgData.data[pixel] = fgData.data[pixel];
            }
        }
    }

    dalí.main.putImageData(bgData,0,0);

    test.gameComponents[0].resetSpeeds();
    //blue.gameComponents[0].resetSpeeds();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    dalí.main.clearRect(0, 0, dalí.canvas.width, dalí.canvas.height);
    dalí.fg.clearRect(0,0, dalí.canvas.width, dalí.canvas.height);
    dalí.main.fillStyle = bgd;
    dalí.main.fillRect(0, 0, dalí.canvas.width, dalí.canvas.height);
    drawGame();
    readHID();
    dalí.time.updateDeltaTime();

}

var backgroundImg = new Image();
backgroundImg.src = "./img/brick.png";
var bgd = null;
backgroundImg.onload = function () {
    bgd = dalí.main.createPattern(backgroundImg, 'repeat');
    gameLoop();
};


