// @flow


const Width = 500;
const Height = 700;

// bird
export class Bird {
    +d: string
    constructor() {

    }
}

// pipe
class Pipe {
    constructor() {

    }
}



export class Game{
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, width: number = Width, height: number = Height){
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize(width, height)
    }

    resize(width: number, height: number){
        this.width = width;
        this.height = height;
        this.canvas.setAttribute('width', width+'px');
        this.canvas.setAttribute('height', height+'px');
    }

    render(){

    }
}
