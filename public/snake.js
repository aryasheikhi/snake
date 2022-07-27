const interval = 500;
let intervalID = 0;

let gameStatus = false;

let width = 500;
let height = 500;
let scale = 10;

const canvas = document.getElementById('gameCanvas');
canvas.height = height;
canvas.width = width;

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';

let snake = [[20, 20], [40, 20], [60, 20]];

let appleCoords = [0, 0];

let direction = [scale, 0]; // goes right

const keyCapture = e => {
    if (e.keyCode === 32) controller();
    else if (gameStatus && 37 <= e.keyCode <= 40)
        switch (e.keyCode) {
            case 37:
                direction = [-scale, 0];
                break;
            case 38:
                direction = [0, -scale];
                break;
            case 39:
                direction = [scale, 0];
                break;
            case 40:
                direction = [0, scale];
                break;
        }
};

document.addEventListener('keydown', keyCapture);

const generateRandomApple = () => [
    Math.floor(Math.floor(Math.random() * width) / 10) * 10,
    Math.floor(Math.floor(Math.random() * height) / 10) * 10,
];

const appleContainer = document.getElementById('appleContainer');
appleCoords = generateRandomApple();
appleContainer.style.left = appleCoords[0] + 'px';
appleContainer.style.top = appleCoords[1] + 'px';
appleContainer.style.border = '1px solid black';

const checkForCollision = () => {
    const appleXForChecking = Math.abs(snake[snake.length - 1][0] - appleCoords[0]);
    const appleYForChecking = Math.abs(snake[snake.length - 1][1] - appleCoords[1]);

    const appleCollideX = appleCoords[0] === snake[snake.length - 1][0];
    const appleCollideY = appleCoords[1] === snake[snake.length - 1][1];


    if (appleCollideX && appleCollideY) {
        appleCoords = generateRandomApple();
        appleContainer.style.left = appleCoords[0] + 'px';
        appleContainer.style.top = appleCoords[1] + 'px';
    } else 
        snake = snake.slice(1);
};

const gameLoop = () => {
    const newSnakeHead = [
        snake[snake.length - 1][0] + direction[0],
        snake[snake.length - 1][1] + direction[1],
    ];
    snake.push(newSnakeHead);

    checkForCollision();

    snake.forEach(block => ctx.fillRect(block[0], block[1], scale, scale));
    ctx.clearRect(snake[0][0], snake[0][1], scale, scale);

    return;
};

const controller = () => {
    gameStatus = !gameStatus;
    const controlButton = document.getElementById('controller');
    if (gameStatus) {
        appleContainer.style.visibility = 'visible';
        controlButton.innerHTML = 'Stop';
        intervalID = setInterval(gameLoop, interval);
    } else {
        controlButton.innerHTML = 'Start';
        clearInterval(intervalID);
    }
};
