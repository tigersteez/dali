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

var health = new Health(5,5,{
    font: font,
    desiredLength: 200
});

var score = new Score(5,dalí.canvas.height-25,{
    textRender: {
        font: font,
        desiredLength: 20
    },
    spriteRender: {
        width: BALL_LENGTH,
        height: BALL_LENGTH,
        scaleRatio: BALL_SCALE,
        spriteMap: ballMap
    }
});

var test = new ProxyBot(100,100,health,score);
var wall = new Wall(0,0,dalí.canvas.width,25);

var room = new Room();

dalí.room = room;

var bgObj = new GameObject(0,0);

var bgTexture = new TextureRenderer(bgObj,{
    texture: stone,
    width: dalí.canvas.width,
    height: dalí.canvas.height,
    isBackground: true
});

bgObj.gameComponents.push(bgTexture);
dalí.room.addObj(bgObj);

dalí.room.addObj(test);

var maker = new GameObject(0,0);
maker.gameComponents.push(
    new BallMaker(this,score,test)
);
dalí.room.addObj(maker);
maker.gameComponents[0].generateBall();
maker.gameComponents[0].generateBall();
maker.gameComponents[0].generateBall();

dalí.room.addObj(health);

dalí.room.addObj(score);

dalí.room.addObj(wall);

wall = new Wall(0,0,25,dalí.canvas.height);
dalí.room.addObj(wall);

wall = new Wall(0,dalí.canvas.height - 25,dalí.canvas.width,25);
dalí.room.addObj(wall);

wall = new Wall(dalí.canvas.width-25,0,25,dalí.canvas.height);
dalí.room.addObj(wall);

var text = new GameObject(dalí.canvas.width - 205,5);
text.gameComponents.push(new TextRenderer(text,{
    font: font,
    text: "Ball Game!",
    desiredLength: 200
}));

dalí.room.addObj(text);

var loading = new GameObject((dalí.canvas.width/2)-200,50);
loading.gameComponents.push(new TextRenderer(loading,{
    font: font,
    text: "Loading...",
    desiredLength: 400
}));

// check generated GUID's
console.log(test.GUID);

(function () {
    var quitState = 0;

    function gameOver() {
        alert("GAME OVER\nYour score: " + score.score.toString());
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
    dalí.room.readHID();
}

function draw() {
    dalí.main.clearRect(0, 0, dalí.canvas.width, dalí.canvas.height);
    dalí.fg.clearRect(0,0, dalí.canvas.width, dalí.canvas.height);
    dalí.room.draw();
    dalí.drawing.draw();
}

function update() {
    dalí.time.updateDeltaTime();
    dalí.room.update();
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
        dalí.room.removeObjects();
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
