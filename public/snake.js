/**
 * Hello there! 
 * This is Arya. I hope you like my work :D
 * please checkout my other stuff on my github به نشانی https://github.com/AryaSheikhi
 */

const interval = 250;
let intervalID = 0;

let gameStatus = false;
const controlButton = document.getElementById('controller');

const gamePoints = [];
let wallCollision = false;
let selfCollision = false;

let width = 300;
let height = 300;
let scale = 10;

const canvas = document.getElementById('gameCanvas');
canvas.height = height;
canvas.width = width;

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.imageSmoothingEnabled = false;

let snake = [[20, 20], [40, 20], [60, 20]];

let appleCoords = [0, 0];
let appleEaten = false;

let direction = [scale, 0]; // goes right
let dirName = 'right';
let touches = []; // [clientX, clientY]

const genApple = () => [
	Math.floor(Math.floor(Math.random() * width) / 10) * 10,
	Math.floor(Math.floor(Math.random() * height) / 10) * 10,
];

const apple = document.getElementById('apple');
appleCoords = genApple();
apple.style.left = appleCoords[0] + 'px';
apple.style.top = appleCoords[1] + 'px';

const checkForApple = nextHead => {
	let eatenX = false;
	let eatenY = false;

    if (direction[0] === scale) {
        eatenX = appleCoords[0] === nextHead[0] + scale;
        eatenY = appleCoords[1] === nextHead[1];
    } else if (direction[0] === -scale) {
        eatenX = appleCoords[0] === nextHead[0] - scale;
        eatenY = appleCoords[1] === nextHead[1];
    } else if (direction[0] === 0) {
        if (direction[1] === scale) {
            eatenX = appleCoords[0] === nextHead[0];
            eatenY = appleCoords[1] === nextHead[1] + scale;
        } else {
            eatenX = appleCoords[0] === nextHead[0];
            eatenY = appleCoords[1] === nextHead[1] - scale;
        }
    }
    return eatenX && eatenY ? true : false;
};

const checkWallCollision = newSnakeHead => (
    newSnakeHead[0] >= width ||
    newSnakeHead[1] >= height ||
    newSnakeHead[0] <= 0 - scale ||
    newSnakeHead[1] <= 0 - scale
);

const checkSelfCollision = nextHead => !!snake.find(currentHead => (currentHead[0] === nextHead[0]) && (currentHead[1] === nextHead[1]));

const drawEyes = (x, y) => {
    ctx.fillStyle = 'white';
    switch (dirName) {
        case 'left':
            ctx.fillRect(x + (scale / 4), y + (scale / 5), 3, 2);
            ctx.fillRect(x + (scale / 4), y + (2 * scale / 4), 3, 2);
            break;
        case 'up':
            ctx.fillRect(x + (2 * scale / 4), y + (scale / 5), 2, 3);
            ctx.fillRect(x + (scale / 5), y + (scale / 5), 2, 3);
            break;
        case 'right':
            ctx.fillRect(x + (scale / 2), y + (scale / 5), 3, 2);
            ctx.fillRect(x + (scale / 2), y + (scale / 2), 3, 2);
            break;
        case 'bottom':
            ctx.fillRect(x + (scale / 5), y + (2 * scale / 5), 2, 3);
            ctx.fillRect(x + (scale / 2), y + (2 * scale / 5), 2, 3);
            break;
    }
    ctx.fillStyle = 'red';
};

const draw = () => {
    snake.forEach((block, index, snake) => {
        ctx.fillRect(block[0], block[1], scale, scale)
        if (index === snake.length - 1) drawEyes(block[0], block[1]);
    });
	ctx.clearRect(snake[0][0], snake[0][1], scale, scale);
};

const gameLoop = () => {
	const nextHead = [
		snake[snake.length - 1][0] + direction[0],
		snake[snake.length - 1][1] + direction[1],
	];
    
    appleEaten = checkForApple(nextHead);
    if (appleEaten) {
        appleCoords = genApple();
		apple.style.left = appleCoords[0] + 'px';
		apple.style.top = appleCoords[1] + 'px';
    } else snake = snake.slice(1);
    
    selfCollision = checkSelfCollision(nextHead);
    wallCollision = checkWallCollision(nextHead);
    if (selfCollision || wallCollision) return stop();
    
    snake.push(nextHead);
    return draw();
};

const reset = () => {
    snake = [[20, 20], [40, 20], [60, 20]];
    appleCoords = genApple();
    apple.style.left = appleCoords[0] + 'px';
    apple.style.top = appleCoords[1] + 'px';
    direction = [scale, 0];
    ctx.clearRect(0, 0, width, height);
};

const start = () => {
    if (wallCollision || selfCollision) reset();
    gameStatus = true;
    controlButton.blur();
    controlButton.innerHTML = 'stop';
    apple.style.visibility = 'visible';
    intervalID = setInterval(gameLoop, interval);
};

const stop = () => {
    gameStatus = false;
    controlButton.innerHTML = 'start';
    clearInterval(intervalID);
};

const controller = () => gameStatus ? stop() : start();

const setDirection = dir => {
    dirName = dir;
    switch (dir) {
        case 'left':
            if (direction[0] === scale && direction[1] === 0) break;
            direction = [-scale, 0];
            break;
        case 'up':
            if (direction[0] === 0 && direction[1] === scale) break;
            direction = [0, -scale];
            break;
        case 'right':
            if (direction[0] === -scale && direction[1] === 0) break;
            direction = [scale, 0];
            break;
        case 'bottom':
            if (direction[0] === 0 && direction[1] === -scale) break;
            direction = [0, scale];
            break;
    }
};

const keyCapture = e => {
	if (e.keyCode === 32) gameStatus ? stop() : controller();
    else if (gameStatus && 37 <= e.keyCode <= 40)
		switch (e.keyCode) {
			case 37: setDirection('left');   break;
			case 38: setDirection('up');     break;
			case 39: setDirection('right');  break;
			case 40: setDirection('bottom'); break;
		}
};

const touchMoving = e => touches.push([e.touches[0].clientX, e.touches[0].clientY]);

const touchEnds = e => {
    let sumX = 0, sumY = 0;
    
    for (let t = 1; t < touches.length; t++) {
        sumX += touches[t][0] - touches[t - 1][0];
        sumY += touches[t][1] - touches[t - 1][1];
    }

    if (sumX > 0) {
        // right
        if (Math.abs(sumY) > Math.abs(sumX)) {
            if (sumY > 0) setDirection('bottom');
            else setDirection('up');
        } else setDirection('right');
    } else {
        // left
        if (Math.abs(sumY) > Math.abs(sumX)) {
            if (sumY > 0) setDirection('bottom');
            else setDirection('up');
        } else setDirection('left');
    }
    touches = [];
};

const isTouch = () => {
    const hintSpan = document.getElementById('hintSpan');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    hintSpan.innerHTML = isTouch ? 'swipe to control movement' : 'use arrow keys for movement';
};

document.addEventListener('DOMContentLoaded', isTouch);
document.addEventListener('keydown', keyCapture);
document.addEventListener('touchmove', touchMoving);
const hint = document.getElementById('hint');
hint.addEventListener('touchend', touchEnds);
hint.addEventListener('touchcancel', touchEnds);
