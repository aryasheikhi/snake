class Snake {
    width: number;
    height: number;
    scale: number;
    canvas: HTMLCanvasElement;
    selfCollision: boolean;
    wallCollision: boolean;
    gameStatus: boolean;
    context: CanvasRenderingContext2D | null;
    snakePoints: Array<null>;

    constructor(width: number, height: number, scale: number, canvas: HTMLCanvasElement) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.canvas = canvas;
        this.selfCollision = false;
        this.wallCollision = false;
        this.gameStatus = false;
        this.context = this.canvas.getContext('2d');
        this.configureCanvas();
    }

    configureCanvas() {
        if (this.context) {
            this.context.fillStyle = '#063300';
            this.context.imageSmoothingEnabled = false;
            this.context.fillRect(0, 0, width, height);
            this.context.fillStyle = 'red';
        } else {
            console.log('Canvas context not configured properly. Check if your browser supports "CanvasRenderingContext2D".');
        }
    }

    api() {}

    start() {
        if (this.selfCollision || this.wallCollision)
            this.reset();
        
        this.gameStatus = true;
        
    }

    stop() {}

    reset() {}
}

const cv: HTMLCanvasElement | null = document.getElementsByTagName('canvas')[0];
if (cv) {
    const game = new Snake(300, 300, 10, cv);
    game.start();
}
