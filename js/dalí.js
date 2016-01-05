// global namespace
var dalí = {};

dalí.canvas = document.getElementById("myCanvas");
dalí.main = dalí.canvas.getContext("2d");

var canvas = document.createElement("canvas");
canvas.width = dalí.canvas.width;
canvas.height = dalí.canvas.height;

dalí.fg = canvas.getContext("2d");


// Time singleton 
// -------------------------------------------------------
(function () {
    var timer = null;
    var deltaTime = 0.0;

    function updateDeltaTime() {
        var now = Date.now();
        deltaTime = ( now - (timer || now) ) / 1000.0;
     
        timer = now;
    }

    function getDeltaTime() {
        return deltaTime;
    }

    window.dalí.time = {
        getDeltaTime: getDeltaTime,
        updateDeltaTime: updateDeltaTime
    };

} ());
