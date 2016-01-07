// The game setup
// ------------------------------------------------------------------------

// Font test
// src: https://github.com/mihaip/web-experiments/blob/master/canvas-text/font.png

var font = new FontMap({
    width: 512,
    height: 512,
    imageurl: "./img/font.png",
    numFrames: 256,
    numCols: 16,
    numRows: 16
});


var red = new Ball(50,50,"#FF0000",5,max_dx,max_dy);
var health = new Health(5,5,{
    font: font,
    desiredLength: 200
});
var test = new ProxyBot(100,100,health);
var wall = new Wall(0,0,dalí.canvas.width,25);

var room = new Room();

var bgObj = new GameObject(0,0);

var bgTexture = new TextureRenderer(bgObj,{
    texture: stone,
    width: dalí.canvas.width,
    height: dalí.canvas.height,
    isBackground: true
});

bgObj.gameComponents.push(bgTexture);
room.addObject(bgObj);


room.addObject(red);
room.addObject(test);
room.addObject(wall);

wall = new Wall(0,0,25,dalí.canvas.height);
room.addObject(wall);

wall = new Wall(0,dalí.canvas.height - 25,dalí.canvas.width,25);
room.addObject(wall);

wall = new Wall(dalí.canvas.width-25,0,25,dalí.canvas.height);
room.addObject(wall);

var text = new GameObject(dalí.canvas.width - 205,5);
text.gameComponents.push(new TextRenderer(text,{
    font: font,
    text: "Ball Game!",
    desiredLength: 200
}));

room.addObject(text);

room.addObject(health);

var loading = new GameObject((dalí.canvas.width/2)-200,50);
loading.gameComponents.push(new TextRenderer(loading,{
    font: font,
    text: "Loading...",
    desiredLength: 400
}));

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
    window.gameOver = gameOver;
}());


function readHID() {
    checkQuit();
    room.readHID();
}

function draw() {
    dalí.main.clearRect(0, 0, dalí.canvas.width, dalí.canvas.height);
    dalí.fg.clearRect(0,0, dalí.canvas.width, dalí.canvas.height);
    room.draw();
}

function update() {
    dalí.time.updateDeltaTime();
    room.update();
    dalí.physics.checkCollisions(room);
}

var loop = false;

function gameLoop() {
    requestAnimationFrame(gameLoop);

    if (loop) {
        dalí.events.emptyQueue();
        readHID();
        update();
        dalí.events.emptyQueue();
        draw();
    } else {
        dalí.resources.updateState();
        if (dalí.resources.preloaders.imgs.isReady()) {
            dalí.main.clearRect(0, 0, dalí.canvas.width, dalí.canvas.height);
            dalí.main.fillStyle = "#000";
            dalí.main.fillRect(0,0,dalí.canvas.width,dalí.canvas.height);
            loading.draw();
        }
    }
}

// var backgroundImg = new Image();
// backgroundImg.src = "./img/brick.png";
// var bgd = null;

// backgroundImg.onload = function () {
//     bgd = dalí.main.createPattern(backgroundImg, 'repeat');
//     gameLoop();
// };

var bgMusic = new Audio("./audio/med.wav");
if (typeof bgMusic.loop === 'boolean') {
    bgMusic.loop = true;
} else {
    bgMusic.addEventListener("ended", function() {
        this.currentTime = 0;
        this.play();
    }, false);
}

bgMusic.addEventListener('canplaythrough', function() { 
   bgMusic.play();
   gameLoop();
}, false);
