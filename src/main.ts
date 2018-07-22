//@flow

const Width = 500;
const Height = 700;

// position
class Point{
    x: number;
    y: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}

export class Sprite{
    frames: HTMLImageElement[] | HTMLImageElement;
    curr: number;
    frameCount: number;
    pos: Point;
    constructor(x: number, 
        y: number, 
        frames: HTMLImageElement[]|HTMLImageElement,
        frameCount?: number
    ){
        if(frames === undefined){
            this.frames = [];
        }
        else {
            this.frames = frames;
            if(!(this.frames instanceof Array) && frameCount !== undefined){
                this.frameCount = frameCount;
            }
            else if(this.frames instanceof Array){
                this.frameCount = this.frames.length;
            }
            else{
                throw new Error('Frames are composed in one single element and didn\'t providing frame count!');
            }
        }

        this.curr = 0;
        this.pos = new Point(x, y);
    }

    addFrame(frame: HTMLImageElement): boolean{
        if(this.frames instanceof Array){
            this.frames.push(frame);
            return true;
        }
        else{
            return false;
        }
    }

    getCurr(){
        if(this.frames instanceof Array){
            if(this.curr + 1 < this.frameCount){
                return this.frames[this.curr++];
            }
            else{
                return this.frames[this.curr=0];
            }
        }
        else{
            // there is img element, handle by yourself.
            return this.frames;
        }
    }

    draw(ctx: CanvasRenderingContext2D){
        ctx.drawImage(this.getCurr(), this.pos.x, this.pos.y);
    }
}


// Texture
export class Texture {
    bird: HTMLImageElement;
    ceiling: HTMLImageElement;
    land: HTMLImageElement;
    replay: HTMLImageElement;
    scoreboard: HTMLImageElement;
    sky: HTMLImageElement;
    splash: HTMLImageElement;
    thumb: HTMLImageElement;
    // big font
    font_big: Array<HTMLImageElement>;
    // small font
    font_small: Array<HTMLImageElement>;
}

// bird
export class Bird {
    pos: Point;
    constructor(x: number, y: number) {
        this.pos = new Point(x, y);
    }
}

// pipe
class Pipe {
    x: number;
    y: number;
    constructor() {

    }
}



export class Game{
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    texture: Texture;

    constructor(canvas: HTMLCanvasElement, texture: Texture, width: number = Width, height: number = Height){
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize(width, height)
        this.texture = texture;
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
