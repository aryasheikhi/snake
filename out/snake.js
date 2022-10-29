var Snake = /** @class */ (function () {
    function Snake(width, height, scale, canvas) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.canvas = canvas;
        this.selfCollision = false;
        this.wallCollision = false;
        this.gameStatus = false;
    }
    Snake.prototype.start = function () {
        if (this.selfCollision || this.wallCollision)
            this.reset();
    };
    Snake.prototype.stop = function () { };
    Snake.prototype.reset = function () { };
    return Snake;
}());
var cv = document.getElementsByTagName('canvas')[0];
var game = new Snake(300, 300, 10, cv);
game.start();
