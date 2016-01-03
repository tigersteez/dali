// for window.requestAnimationFrame
// -------------------------------------------------------------------------
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

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

// Setup canvas with extra properties
// ------------------------------------------------------------------------

var canvas = document.getElementById("myCanvas");
canvas.ctx = canvas.getContext("2d");

canvas.pressed = new Object(); // Using object like a dictionary

canvas.pressed[LEFT] = false;
canvas.pressed[RIGHT] = false;
canvas.pressed[UP] = false;
canvas.pressed[DOWN] = false;
canvas.pressed[Q] = false;

document.onkeydown = function (event) { // like addEventListener
  canvas.pressed[event.keyCode] = true;
}

document.onkeyup = function (event) {
  canvas.pressed[event.keyCode] = false;
}

canvas.timer = null;
canvas.deltaTime = 0.0;

function getDeltaTime() {
    var now = Date.now();
    canvas.deltaTime = ( now - (canvas.timer || now) ) / 1000.0;
 
    canvas.timer = now;
}

// The game setup
// ------------------------------------------------------------------------

const x = canvas.width/2;
const y = canvas.height-30;

var quitState = 0;

//var blue = new Ball(x,y,canvas,"#0095DD",10,0,0);
var red = new Ball(50,50,canvas,"#FF0000",5,max_dx,max_dy);

var test = new ProxyBot(100,100,canvas);

// check generated GUID's
//console.log(blue.GUID);
console.log(test.GUID);
console.log(red.GUID);

function gameOver() {
    alert("GAME OVER");
    document.location.reload();
}

function checkQuit() {
   if (canvas.pressed[Q]) {
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

function readHID() {
   test.readHID(); 

   checkQuit();
}

function drawGame() {
    red.update();
    red.draw();

    // blue.update();
    // blue.draw();

    test.update();
    test.draw();
    
    test.gameComponents[0].resetSpeeds();
    //blue.gameComponents[0].resetSpeeds();
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    readHID();
    getDeltaTime();
    drawGame();
}

gameLoop();