/**
 * Hello there! 
 * This is Arya. I hope you like my work :D
 * please checkout my other stuff on my github به نشانی https://github.com/AryaSheikhi
 */

const interval = 150;
let intervalID = 0;
let goThrough = true;

let gameStatus = false;
const controlButton = document.getElementById('controller');

// const gamePoints = [10000, 444, 2342134, 20, 13245, 23, 683, 587686, 4, 23, 3425];

let snakePoints = JSON.parse(localStorage.getItem('snakePoints'));
if (!snakePoints) {
    localStorage.setItem('snakePoints', '[]');
    snakePoints = [];
}

let wallCollision = false;
let selfCollision = false;

let width = 300;
let height = 300;
let scale = 10;

const canvas = document.getElementById('gameCanvas');
canvas.height = height;
canvas.width = width;

const ctx = canvas.getContext('2d');
ctx.fillStyle = '#063300';
ctx.imageSmoothingEnabled = false;
ctx.fillRect(0, 0, width, height);
ctx.fillStyle = 'red';

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
    let eatenX = appleCoords[0] === nextHead[0];
    let eatenY = appleCoords[1] === nextHead[1];
    
    return eatenX && eatenY ? true : false;
};

let hitPlace = '';
const checkWallCollision = newSnakeHead => {
    if (newSnakeHead[0] >= width)          { hitPlace =  'right'; return true; }
    else if (newSnakeHead[1] >= height)    { hitPlace = 'bottom'; return true; }
    else if (newSnakeHead[0] <= 0 - scale) { hitPlace =   'left'; return true; }
    else if (newSnakeHead[1] <= 0 - scale) { hitPlace =    'top'; return true; }
};

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
    ctx.fillStyle = '#063300';
	ctx.fillRect(snake[0][0], snake[0][1], scale, scale);
    ctx.fillStyle = 'red';
};

const gameLoop = () => {
	const nextHead = [
		snake[snake.length - 1][0] + direction[0],
		snake[snake.length - 1][1] + direction[1],
	];
    
    selfCollision = checkSelfCollision(nextHead);
    wallCollision = checkWallCollision(nextHead);
    if (selfCollision) return stop();
    if (goThrough && wallCollision) {
        switch (hitPlace) {
            case 'left':    nextHead[0] += width;  break;
            case 'top':     nextHead[1] += height; break;
            case 'right':   nextHead[0] -= width;  break;
            case 'bottom':  nextHead[1] -= height; break;
        }
    }
    if (!goThrough && (selfCollision || wallCollision)) return stop();

    appleEaten = checkForApple(nextHead);
    if (appleEaten) {
        appleCoords = genApple();
		apple.style.left = appleCoords[0] + 'px';
		apple.style.top = appleCoords[1] + 'px';
    } else snake = snake.slice(1);

    snake.push(nextHead);
    return draw();
};

const start = () => {
    if (selfCollision || wallCollision) reset();
    snakePoints = JSON.parse(localStorage.getItem('snakePoints'));
    localStorage.setItem('snakePoints', JSON.stringify([...snakePoints, snake.length]));
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

const reset = () => {
    snake = [[20, 20], [40, 20], [60, 20]];
    appleCoords = genApple();
    apple.style.left = appleCoords[0] + 'px';
    apple.style.top = appleCoords[1] + 'px';
    direction = [scale, 0];
    ctx.clearRect(0, 0, width, height);
};

const controller = () => {
    Array.from(document.getElementsByClassName('drawer')).forEach(drawer => drawer.classList.add('display-none'));
    return gameStatus ? stop() : start();
};

const modeController = e => {
    e.target.blur();
    const modeMenu = document.getElementById('modeMenu');
    modeMenu.classList.toggle('display-none');
};

const changeGameMode = e => {
    console.log(e.target.value)
    if (e.target.value === 'on') {
        goThrough = true;
    } else {
        goThrough = false;
    }
};

const pointsController = e => {
    e.target.blur();
    const pointsMenu = document.getElementById('pointsMenu');
    pointsMenu.classList.toggle('display-none');
    const pointsList = document.getElementById('pointsList');
    pointsList.innerHTML = '';
    const sorted = snakePoints.sort((a, b) => a < b ? 1 : a > b ? -1 : 0).filter((point, index, array) => !index || point !== array[index - 1]);
    sorted.slice(0, 10).forEach(point => {
        const li = document.createElement('li');
        li.innerHTML = point;
        pointsList.appendChild(li);
    });
};

const setDirection = dir => {
    dirName = dir;
    switch (dir) {
        case 'left':
            if (direction[0] === scale && direction[1] === 0)  break;
            direction = [-scale, 0]; break;
        case 'up':
            if (direction[0] === 0 && direction[1] === scale)  break;
            direction = [0, -scale]; break;
        case 'right':
            if (direction[0] === -scale && direction[1] === 0) break;
            direction = [scale, 0];  break;
        case 'bottom':
            if (direction[0] === 0 && direction[1] === -scale) break;
            direction = [0, scale];  break;
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
    const hint = document.getElementById('hint');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    hint.innerHTML = isTouch ? 'swipe to control movement' : 'use arrow keys for movement';
};

document.addEventListener('DOMContentLoaded', isTouch);
document.addEventListener('keydown', keyCapture);
document.addEventListener('touchmove', touchMoving);
const hint = document.getElementById('hint');
hint.addEventListener('touchend', touchEnds);
hint.addEventListener('touchcancel', touchEnds);
