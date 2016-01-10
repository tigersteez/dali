// CameraMover
// ------------------------------------------------------------------------------------
function CameraMover(go) {
  GameComponent.call(this,go);
this.dx = 0;
  this.dy = 0;
}

CameraMover.prototype.update = function () {
    this.gameObj.transform.position.x = this.gameObj.transform.position.x + 
        this.dx * dalí.time.getDeltaTime();

    this.gameObj.transform.position.y = this.gameObj.transform.position.y + 
        this.dy * dalí.time.getDeltaTime();

  this.dx = 0;
  this.dy = 0;
};

CameraMover.prototype.readHID = function () {
    if (dalí.input.keys.isDown('A')) {
      this.dx = -max_dx;
    } 

    if (dalí.input.keys.isDown('D')) {
      this.dx = max_dx;
    }

    if (dalí.input.keys.isDown('W')) {
      this.dy = -max_dy;
    } 

    if (dalí.input.keys.isDown('S')) {
      this.dy = max_dy;
    }
};

dalí.extend(GameComponent, CameraMover);


// The game setup
// ------------------------------------------------------------------------

// Font test
// src: https://github.com/mihaip/web-experiments/blob/master/canvas-text/font.png
const FONT_URL = "./img/font.png";

// check generated GUID's
// console.log(test.GUID);

var score = null;

(function () {
    var quitState = 0;

    function gameOver() {
        alert("GAME OVER\nYour score: " + score.score.toString());
        document.location.reload();
    }

    function checkQuit() {
        if (dalí.input.keys.isDown('Q')) {
            console.log("Pressing Q");
            if (quitState == 0) {
                quitState = 1;
            } 
        } else if (quitState == 1) {
            quitState = 2;
        }

        if (quitState == 2) {
            quitState = 0;
            window.dalí.gameOver();
        }
    }

    window.dalí.checkQuit = checkQuit;
    window.dalí.gameOver = gameOver;
}());

function init() {
    var health = new Health(5,5,{
        fonturl: FONT_URL,
        desiredLength: 200
    });

    score = new Score(5,dalí.canvas.height-25,{
        textRender: {
            fonturl: FONT_URL,
            desiredLength: 20
        },
        spriteRender: {
            width: BALL_LENGTH,
            height: BALL_LENGTH,
            scaleRatio: BALL_SCALE,
            spriteurl: BALL_URL
        }
    });

    var test = new ProxyBot(100,100,health,score,dalí.room.mainCamera);
    var wall = new Wall(0,0,dalí.canvas.width,25);

    var bgObj = new GameObject(0,0);

    var bgTexture = new TextureRenderer(bgObj,{
        textureurl: STONE_URL,
        width: dalí.canvas.width,
        height: dalí.canvas.height,
        isBackground: true
    });

    bgObj.gameComponents.push(bgTexture);
    bgObj.addComp(new GameAudio(bgObj,"./audio/med.wav",true));
    bgObj.getAudio().play();
    dalí.room.addObj(bgObj);

    dalí.room.addObj(test);

    var maker = new GameObject(0,0);
    maker.gameComponents.push(
        new BallMaker(maker,score,test)
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
        fonturl: FONT_URL,
        text: "Ball Game!",
        desiredLength: 200
    }));

    dalí.room.addObj(text);
}

var loop = false;
var firstLoop = false;
var firstLoad = true;

function gameLoop() {
    requestAnimationFrame(gameLoop);

    if (loop) {
        dalí.checkQuit();
        dalí.room.loop();
    } else if (firstLoop) {
        dalí.room.deleteLoading();
        init();
        loop = true;
        firstLoop = false;
    } else {
        dalí.resources.updateState();
        if (dalí.resources.preloaders.isReady()) {
            if (firstLoad) {
                    var camera = new Camera();
                    camera.gameComponents.push(new CameraMover(camera));
                    dalí.room.addObj(camera);
                var loading = new GameObject((dalí.canvas.width/2)-200,50);
                loading.addComp(new TextRenderer(loading,{
                        fonturl: FONT_URL,
                        text: "Loading...",
                        desiredLength: 400
                }));
                dalí.room.addLoadingObj(loading);
                firstLoad = false;
            }
            dalí.room.drawLoading();
        }
    }
}

var myAssets = null;
$.getJSON('./ballgame.json', function(data) { 
    myAssets=data;

    var room = new Room();

    dalí.room = room;

   dalí.resources.preloaders.load(myAssets.preloadResources);

   dalí.resources.gameloaders.load(myAssets.gameResources);

   dalí.resources.levelloaders.preloaders.load(myAssets.levelPreloadResources);

   dalí.resources.levelloaders.manager.load(myAssets.levelResources);
   gameLoop();
});
