const Width = 600;
const Height = 700;

const MinimumGap = 100;
const MinimumSpace = 70;
const MaximumSpace = 200;

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
    crossProductOf(v: Vector) {}
}

class Direction {
    static readonly Up = new Vector(0, -1);
    static readonly Right = new Vector(1, 0);
    static readonly Down = new Vector(0, 1);
    static readonly Left = new Vector(-1, 0);
    private constructor() {}
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
    constructor(
        x: number,
        y: number,
        frames: HTMLImageElement[] | HTMLImageElement,
        frameCount?: number,
        destW?: number,
        destH?: number
    ) {
        if (frames === undefined) {
            this.frames = [];
        } else {
            this.frames = frames;
            if (!(this.frames instanceof Array) && frameCount !== undefined) {
                this.frameCount = frameCount;
                this.width = this.frames.width;
                this.height = this.frames.height / this.frameCount;
            } else if (this.frames instanceof Array) {
                this.frameCount = this.frames.length;
                this.width = this.frames[0].width;
                this.height = this.frames[0].height;
            } else {
                throw new Error(
                    "Frames are composed in one single element and didn't providing frame count!"
                );
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
        } else {
            return false;
        }
    }

    getCurr(): HTMLImageElement | [HTMLImageElement, number] {
        if (this.frames instanceof Array) {
            if (this.curr + 1 < this.frameCount) {
                return this.frames[this.curr++];
            } else {
                return this.frames[(this.curr = 0)];
            }
        } else {
            // there is img element, handle by yourself.
            if (this.curr + 1 < this.frameCount) {
                return [this.frames, this.curr++];
            } else {
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
        } else {
            // @ts-ignore
            const [img, curr] = this.getCurr();
            // console.log(this.width, this.height)
            // @ts-ignore
            ctx.drawImage(
                // @ts-ignore
                img,
                0,
                // @ts-ignore
                curr * this.height, // @ts-ignore
                this.width,
                this.height, // @ts-ignore
                this.pos.x,
                this.pos.y, // @ts-ignore
                this.destW || this.width, // @ts-ignore
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
    // pipes
    pipe: Array<HTMLImageElement>;
    // big fonts
    font_big: Array<HTMLImageElement>;
    // small fonts
    font_small: Array<HTMLImageElement>;
    // medals
    medal: Array<HTMLImageElement>;
}

export interface Sounds {
    sfx_wing: HTMLAudioElement;
    sfx_point: HTMLAudioElement;
    sfx_hit: HTMLAudioElement;
    sfx_die: HTMLAudioElement;
    sfx_swooshing: HTMLAudioElement;
}

interface Moveable {
    move(v: Vector);
}

export class Texture {
    img: HTMLImageElement;
    pos: Point;
    constructor(
        img: HTMLImageElement,
        x: number,
        y: number,
        dx: number,
        dy: number
    ) {
        this.img = img;
        this.pos = new Point(dx, dy);
    }
    move(v: Vector) {
        this.pos.apply(v);
    }
}

// bird
export class Bird extends Sprite implements Moveable {
    frames: HTMLImageElement;
    speed: Vector;
    miny: number;
    maxy: number;
    constructor(
        x: number,
        y: number,
        miny: number,
        maxy: number,
        img: HTMLImageElement | HTMLImageElement[],
        frameCount?: number
    ) {
        // ground
        super(x, y, img, frameCount);

        // default is still
        this.speed = new Vector(0, 0);
        this.miny = miny;
        this.maxy = maxy;
    }

    // apply a acceleration to bird, such as gravity
    apply(v: Vector) {
        this.speed.plus(v);
        if (this.speed.y < -10) {
            this.speed.y = -10;
        }
        if (this.pos.y + this.height > this.maxy && this.speed.y > 0) {
            this.speed.scale(0);
        } else if (this.pos.y < this.miny && this.speed.y < 0) {
            this.speed.scale(0);
        }
        if (this.pos) this.pos.apply(this.speed.scale(0.96));
    }

    die(maxy: number) {
        if (this.pos.y + this.frames.height / 4 >= maxy) {
            return true;
        } else {
            return false;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
    }
}

export class Land extends Texture implements Moveable {
    offset: number;

    constructor(img) {
        super(img, 0, 0, 0, 0);
        this.offset = 0;
    }

    move(v: Vector) {
        this.pos.apply(v);
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        for (
            let base = 0;
            base <= this.img.width * (width / this.img.width + 1);
            base += this.img.width
        ) {
            ctx.drawImage(
                this.img,
                0,
                0,
                this.img.width,
                this.img.height,
                base + this.offset,
                height - this.img.height,
                this.img.width,
                this.img.height
            );
        }
        this.offset--;
        if (-this.offset > this.img.width) {
            this.offset = 0;
        }
    }
}

export class Sky extends Texture implements Moveable {
    offset: number;

    constructor(img) {
        super(img, 0, 0, 0, 0);
        this.offset = 0;
    }

    move(v: Vector) {
        this.pos.apply(v);
    }

    draw(
        ctx: CanvasRenderingContext2D,
        y: number,
        width: number,
        height: number
    ) {
        for (let base = 0; base < width * 2; base += width) {
            ctx.drawImage(
                this.img,
                0,
                0,
                this.img.width,
                this.img.height,
                base + this.offset,
                y,
                width,
                height
            );
        }
        this.offset--;
        if (-this.offset > width) {
            this.offset = 0;
        }
    }
}

export class Ceiling extends Texture {
    offset: number;

    constructor(img) {
        super(img, 0, 0, 0, 0);
        this.offset = 0;
    }

    move(v: Vector) {
        this.pos.apply(v);
    }

    draw(ctx: CanvasRenderingContext2D, width, height) {
        for (
            let base = 0;
            base <= this.img.width * (width / this.img.width + 1);
            base += this.img.width
        ) {
            ctx.drawImage(
                this.img,
                0,
                0,
                this.img.width,
                this.img.height,
                base + this.offset,
                0,
                this.img.width,
                this.img.height
            );
        }
        this.offset--;
        if (-this.offset > this.img.width) {
            this.offset = 0;
        }
    }
}

// pipe
abstract class Pipe {
    readonly name;
    x: number;
    y: number;
    height: number;
    top: HTMLImageElement;
    body: HTMLImageElement;

    constructor(
        top: HTMLImageElement,
        body: HTMLImageElement,
        x: number,
        y: number,
        height: number
    ) {
        this.x = x;
        this.y = y;
        this.top = top;
        this.body = body;
        this.height = height;
    }
    move() {
        this.x--;
    }

    hit(bird: Bird): boolean {
        if (
            this.name == "up pipe" &&
            bird.pos.x + bird.frames.width > this.x &&
            bird.pos.x < this.x + this.top.width &&
            bird.pos.y + bird.frames.height / 4 > this.y
        ) {
            return true;
        } else if (
            this.name == "down pipe" &&
            bird.pos.x + bird.frames.width > this.x &&
            bird.pos.x < this.x + this.top.width &&
            bird.pos.y < this.y + this.height
        ) {
            return true;
        } else {
            return false;
        }
    }

    score(bird: Bird): boolean {
        if (this.x + this.top.width / 2 == bird.pos.x + bird.frames.width) {
            return true;
        } else {
            return false;
        }
    }

    offscreen(width: number): boolean {
        if (this.x < -width) {
            return true;
        } else {
            return false;
        }
    }
    abstract draw(ctx: CanvasRenderingContext2D);
}

class TopPipe extends Pipe {
    readonly name = "down pipe";
    constructor(
        top: HTMLImageElement,
        body: HTMLImageElement,
        x: number,
        y: number,
        height: number
    ) {
        super(top, body, x, y, height);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.body,
            0,
            0,
            this.body.width,
            this.body.height,
            this.x,
            this.y,
            this.body.width,
            this.height - this.top.height
        );
        ctx.drawImage(
            this.top,
            0,
            0,
            this.top.width,
            this.top.height,
            this.x,
            this.y + (this.height - this.top.height),
            this.top.width,
            this.top.height
        );
    }
}

class BottomPipe extends Pipe {
    readonly name = "up pipe";
    constructor(
        top: HTMLImageElement,
        body: HTMLImageElement,
        x: number,
        y: number,
        height: number
    ) {
        super(top, body, x, y, height);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.top,
            0,
            0,
            this.top.width,
            this.top.height,
            this.x,
            this.y,
            this.top.width,
            this.top.height
        );
        ctx.drawImage(
            this.body,
            0,
            0,
            this.body.width,
            this.body.height,
            this.x,
            this.y + this.top.height,
            this.body.width,
            this.height - this.top.height
        );
    }
}

export class Dashboard {
           offset = 0;
           img: HTMLImageElement;
           bf: HTMLImageElement[];
           sf: HTMLImageElement[];
           medal: HTMLImageElement[];
           width: number;
           height: number;
           constructor(img: HTMLImageElement, bf: HTMLImageElement[], sf: HTMLImageElement[], medal: HTMLImageElement[], w: number, h: number) {
               this.img = img;
               this.bf = bf;
               this.sf = sf;
               this.medal = medal;
               this.width = w;
               this.height = h;
           }

           reset() {
               this.offset = 0;
           }

    draw(ctx: CanvasRenderingContext2D, score: number, hscore: number) {
               ctx.drawImage(this.img, this.width / 2 - this.img.width / 2, this.height / 2 - this.img.height / 2 + this.height / 3 - this.offset);
               ctx.drawImage(this.medal[0], this.width / 2 - (this.img.width / 2) + 30, this.height / 2 - this.img.height / 2 + this.height / 2 - this.offset);
               ctx.drawImage(this.sf[score % 10], this.width / 2 + (this.img.width / 2 * 0.5) + this.sf[0].width * 2, this.height / 2 - this.img.height/2 - 10 + this.height / 2 - this.offset);
        ctx.drawImage(this.sf[Math.floor(score / 10) % 10], this.width / 2 + (this.img.width / 2 * 0.5) + this.sf[0].width , this.height / 2 - this.img.height / 2 - 10 + this.height / 2 - this.offset);
        ctx.drawImage(this.sf[Math.floor(score / 100) % 10], this.width / 2 + (this.img.width / 2 * 0.5), this.height / 2 - this.img.height / 2 - 10 + this.height / 2 - this.offset);

        ctx.drawImage(this.bf[hscore % 10], this.width / 2 + (this.img.width / 2 * 0.3) + this.bf[0].width * 2, this.height / 2 - this.img.height / 5 * 2+ this.height / 2 - this.offset);
        ctx.drawImage(this.bf[Math.floor(hscore / 10) % 10], this.width / 2 + (this.img.width / 2 * 0.3) + this.bf[0].width, this.height / 2 - this.img.height / 5 * 2 + this.height / 2 - this.offset);
        ctx.drawImage(this.bf[Math.floor(hscore / 100) % 10], this.width / 2 + (this.img.width / 2) * 0.3, this.height / 2 - (this.img.height / 5) * 2 + this.height / 2 - this.offset);
                   if(this.offset < this.height / 3){
        this.offset += 5;
                   }
               }
           }

enum GameState {
    Start,
    Stop,
    Pause,
    Dash
}

export class Game {
    state: GameState;
    score: number;
    dash: Dashboard;

    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    fcount: number;
    fps: number;
    gravity: Vector;
    initSpeed: Vector;

    images: Images;
    sounds: Sounds;

    // will render
    bird: Bird;
    land: Land;
    ceiling: Ceiling;
    sky: Sky;
    pipes: Pipe[];

    constructor(
        canvas: HTMLCanvasElement,
        images: Images,
        sounds: Sounds,
        width: number = Width,
        height: number = Height
    ) {
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.fcount = 0;
        this.fps = 0;
        this.canvas.onmousedown = this.onMouseDown.bind(this);
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "white";
        this.resize(width, height);
        this.images = images;
        this.sounds = sounds;
        this.dash = new Dashboard(
            this.images.scoreboard,
            this.images.font_big,
            this.images.font_small,
            this.images.medal,
            this.width,
            this.height
        );
        this.init();
        this.mainloop();
    }

    init() {
        this.state = GameState.Stop;
        this.score = 0;
        this.dash.reset();
        this.gravity = new Vector(0, 0.45);
        this.initSpeed = new Vector(0, 0);
        this.bird = new Bird(
            this.width / 8,
            this.height / 2,
            this.images.ceiling.height,
            this.height - this.images.land.height,
            this.images.bird,
            4
        );
        this.land = new Land(this.images.land);
        this.ceiling = new Ceiling(this.images.ceiling);
        this.sky = new Sky(this.images.sky);
        this.pipes = [];
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas.setAttribute("width", width + "px");
        this.canvas.setAttribute("height", height + "px");
    }

    mainloop() {
        if (this.state == GameState.Start) {
            this.fps = this.fcount;
            this.fcount = 0;
            this.pipes.push(...this.generate_pipe());
            this.pipes.forEach((pipe, index) => {
                if (pipe.offscreen(this.width)) {
                    this.pipes.slice(index, 1);
                }
            });
        }

        setTimeout(this.mainloop.bind(this), 1000);
    }

    generate_pipe(): [Pipe, Pipe] {
        let gap =
            (Math.floor(Math.random() * 10000) %
                (Math.max(
                    this.height / 3,
                    this.images.ceiling.height + this.images.land.height
                ) -
                    MinimumGap)) +
            MinimumGap;
        const lastX =
            this.pipes.length > 0 ? this.pipes[this.pipes.length - 1].x : 0;
        const lastY =
            this.pipes.length > 0 ? this.pipes[this.pipes.length - 1].y : 0;
        const lastGap =
            this.pipes.length > 0
                ? this.pipes[this.pipes.length - 1].y -
                  this.pipes[this.pipes.length - 2].y
                : 0;
        const lastCy = lastY - lastGap / 2;
        let x = 0;
        if (this.pipes.length <= 0) {
            x = (this.width / 2) * 1.5;
        } else {
            x =
                (Math.floor(Math.random() * 10000) %
                    (MaximumSpace - MinimumSpace)) +
                MinimumSpace +
                lastX +
                this.images.pipe[1].width;
        }
        let cy = 0;
        if (x - lastX > this.images.bird.width * 2.5 || lastX == 0) {
            cy =
                (Math.floor(Math.random() * 10000) %
                    (this.height -
                        this.images.land.height -
                        this.images.pipe[2].height -
                        gap / 2 -
                        (this.images.ceiling.height +
                            this.images.pipe[1].height +
                            gap / 2))) +
                (this.images.ceiling.height +
                    this.images.pipe[1].height +
                    gap / 2);
        } else {
            const r =
                (Math.floor(Math.random() * 10000) % lastGap) - lastGap / 2;
            cy = lastCy + r;
            if (
                cy - gap <
                this.images.ceiling.height + this.images.pipe[2].height
            ) {
                cy =
                    this.images.ceiling.height +
                    this.images.pipe[2].height +
                    gap;
            } else if (
                cy - gap >
                this.height -
                    this.images.land.height -
                    this.images.pipe[1].height
            ) {
                cy =
                    this.height -
                    this.images.land.height -
                    this.images.pipe[1].height -
                    gap;
            }
        }

        return [
            new TopPipe(
                this.images.pipe[2],
                this.images.pipe[0],
                x,
                this.images.ceiling.height,
                cy - gap / 2 - this.images.ceiling.height
            ),
            new BottomPipe(
                this.images.pipe[1],
                this.images.pipe[0],
                x,
                cy + gap / 2,
                this.height - (cy + gap / 2) - this.images.land.height
            )
        ];
    }

    dashboard() {
        let hscore: number;
        if(document.cookie == ''){
            document.cookie = this.score+''
            hscore = this.score;
        }
        else{
            if(this.score > Number(document.cookie)){
                document.cookie = this.score + ''
                hscore = this.score;
            }
            else{
                hscore = Number(document.cookie);
            }
        }
        this.dash.draw(this.ctx, this.score, hscore);
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.sky.draw(
            this.ctx,
            this.images.ceiling.height,
            this.width,
            this.height - this.images.ceiling.height - this.images.land.height
        );
        this.land.draw(this.ctx, this.width, this.height);
        this.ceiling.draw(this.ctx, this.width, this.height);

        // gravity
        if (this.state == GameState.Start) this.bird.apply(this.gravity);
        this.bird.draw(this.ctx);
        if (this.bird.die(this.height - this.images.land.height)) {
            if (this.state == GameState.Start) {
                this.playsfx(this.sounds.sfx_die);
                this.playsfx(this.sounds.sfx_hit);
            }

            this.state = GameState.Dash;
            this.playsfx(this.sounds.sfx_swooshing);
        }

    
        this.pipes.forEach(pipe => {
            if (this.state == GameState.Start) pipe.move();
            if (this.state == GameState.Start || this.state == GameState.Pause) {
                pipe.draw(this.ctx);

                if (pipe.hit(this.bird)) {
                    this.playsfx(this.sounds.sfx_hit);
                    this.state = GameState.Dash;
                    this.playsfx(this.sounds.sfx_swooshing);
                }
                if (pipe.name == "up pipe" && pipe.score(this.bird)) {
                    this.playsfx(this.sounds.sfx_point);
                    this.score++;
                }
            }
        });

        if (this.state == GameState.Stop) {
            this.ctx.drawImage(
                this.images.splash,
                this.width / 2 - this.images.splash.width / 2,
                this.height / 2 - this.images.splash.height / 2
            );
        }

        if(this.state == GameState.Dash){
            this.dashboard();
        }

        // fps info
        this.fcount++;
        this.ctx.fillStyle = "black";
        this.ctx.fillText(
            `FPS: ${this.fps}`,
            this.width - 50,
            this.images.ceiling.height * 2
        );
        this.ctx.fillText(
            `Score: ${this.score}`,
            this.width - 50,
            this.images.ceiling.height * 3
        );
        requestAnimationFrame(this.render.bind(this));
    }

    onMouseDown(e) {
        if (e.which == 1) {
            // left button clicked

            if (this.state == GameState.Dash) {
                this.init();
            } else {
                if (this.state != GameState.Start) {
                    this.state = GameState.Start;
                }
                this.bird.apply(new Vector(0, -12));
                this.playsfx(this.sounds.sfx_wing);
            }
        }
    }

    playsfx(sound: HTMLAudioElement) {
        sound.pause();
        sound.currentTime = 0;
        sound.play();
    }
}
