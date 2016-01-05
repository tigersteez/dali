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
        if (dalí.input.keys.isDown('Q')) {
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
    dalí.physics.checkCollisions(room);
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


