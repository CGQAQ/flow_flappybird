const Width = 600;
const Height = 700;

// position
class Point {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    // apply a vector to itself
    apply(v: Vector) {
        this.x += v.x;
        this.y += v.y;
    }
}


class Vector {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    plus(another: Vector): Vector {
        this.x += another.x;
        this.y += another.y;
        return this;
    }

    minus(another: Vector): Vector {
        this.x -= another.x;
        this.y -= another.y;
        return this;
    }

    scale(factor: number): Vector {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    scale_dry(factor: number): Vector {
        return new Vector(this.x * factor, this.y * factor);
    }

    dotProductOf(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    // never use;
    crossProductOf(v: Vector) {

    }
}

class Direction {
    static readonly Up = new Vector(0, -1);
    static readonly Right = new Vector(1, 0);
    static readonly Down = new Vector(0, 1);
    static readonly Left = new Vector(-1, 0);
    private constructor() { }
}

export class Sprite {
    frames: HTMLImageElement[] | HTMLImageElement;
    curr: number;
    frameCount: number;
    pos: Point;
    width: number;
    height: number;
    destW: number;
    destH: number;
    constructor(x: number,
        y: number,
        frames: HTMLImageElement[] | HTMLImageElement,
        frameCount?: number,
        destW?: number,
        destH?: number,
    ) {
        if (frames === undefined) {
            this.frames = [];
        }
        else {
            this.frames = frames;
            if (!(this.frames instanceof Array) && frameCount !== undefined) {
                this.frameCount = frameCount;
                this.width = this.frames.width;
                this.height = this.frames.height / this.frameCount;
            }
            else if (this.frames instanceof Array) {
                this.frameCount = this.frames.length;
                this.width = this.frames[0].width;
                this.height = this.frames[0].height;
            }
            else {
                throw new Error('Frames are composed in one single element and didn\'t providing frame count!');
            }
        }

        this.curr = 0;
        this.pos = new Point(x, y);
        this.destW = destW;
        this.destH = destH;
    }

    addFrame(frame: HTMLImageElement): boolean {
        if (this.frames instanceof Array) {
            this.frames.push(frame);
            return true;
        }
        else {
            return false;
        }
    }

    getCurr(): HTMLImageElement | [HTMLImageElement, number] {
        if (this.frames instanceof Array) {
            if (this.curr + 1 < this.frameCount) {
                return this.frames[this.curr++];
            }
            else {
                return this.frames[this.curr = 0];
            }
        }
        else {
            // there is img element, handle by yourself.
            if (this.curr + 1 < this.frameCount) {
                return [this.frames, this.curr++];
            }
            else {
                const curr = this.curr;
                this.curr = 0;
                return [this.frames, curr];
            }
        }
    }

    move(v: Vector) {
        this.pos.apply(v);
    }

    draw(ctx: CanvasRenderingContext2D) {
        // only work for frames in different element
        if (this.frames instanceof Array) {

            // @ts-ignores
            ctx.drawImage(this.getCurr(), this.pos.x, this.pos.y);
        }
        else {
            // @ts-ignore
            const [img, curr] = this.getCurr();
            // console.log(this.width, this.height)
            // @ts-ignore
            ctx.drawImage(img,
                0,
                // @ts-ignore
                curr * this.height,
                // @ts-ignore
                this.width, this.height,
                // @ts-ignore
                this.pos.x, this.pos.y,
                // @ts-ignore
                this.destW || this.width,
                // @ts-ignore
                this.destH || this.height
            );
        }
    }

    drawBy(fun: (frame: HTMLImageElement) => void) {
        // @ts-ignore
        fun(this.getCurr());
    }
}

// Texture
export interface Images {
    bird: HTMLImageElement;
    ceiling: HTMLImageElement;
    land: HTMLImageElement;
    replay: HTMLImageElement;
    scoreboard: HTMLImageElement;
    sky: HTMLImageElement;
    splash: HTMLImageElement;
    thumb: HTMLImageElement;
    // big fonts
    font_big: Array<HTMLImageElement>;
    // small fonts
    font_small: Array<HTMLImageElement>;
    // medals
    medal: Array<HTMLImageElement>;
}

export class Texture {
    move() { }
}

// bird
export class Bird extends Sprite {
    constructor(x: number,
        y: number,
        img: HTMLImageElement | HTMLImageElement[],
        frameCount?: number) {
        super(x, y, img, frameCount);
    }
}

// export class;


// pipe
class Pipe {
    x: number;
    y: number;
    constructor() {

    }
}



export class Game {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    images: Images;

    // will render
    bird: Bird;
    land: Sprite;

    constructor(canvas: HTMLCanvasElement, images: Images, width: number = Width, height: number = Height) {
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.fillStyle = 'white';
        this.resize(width, height)
        this.images = images;
        this.bird = new Bird(0, 0, this.images.bird, 4);
        this.mainloop()
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas.setAttribute('width', width + 'px');
        this.canvas.setAttribute('height', height + 'px');
    }

    mainloop() {
        requestAnimationFrame(this.render.bind(this));
        // this.bird.move()
        setTimeout(this.mainloop.bind(this), 100);
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.bird.draw(this.ctx);
        // this.bird.move(Direction.Right)
        // this.land.draw(this.ctx)
    }
}
