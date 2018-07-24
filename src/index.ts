import $ from "jquery";
import { Game, Bird, Sprite, Images } from './main';


$(document).ready(function () {
    const game_canvas: $<HTMLCanvasElement> = $('#game-canvas');
    const bird = $('.bird');
    const ceiling = $('.ceiling');
    const land = $('.land');
    const replay = $('.replay');
    const scoreboard = $('.scoreboard');
    const sky = $('.sky');
    const splash = $('.splash');
    const thumb = $('.thumb');

    // big font;
    const font_big_0 = $('.font-big-0');
    const font_big_1 = $('.font-big-1');
    const font_big_2 = $('.font-big-2');
    const font_big_3 = $('.font-big-3');
    const font_big_4 = $('.font-big-4');
    const font_big_5 = $('.font-big-5');
    const font_big_6 = $('.font-big-6');
    const font_big_7 = $('.font-big-7');
    const font_big_8 = $('.font-big-8');
    const font_big_9 = $('.font-big-9');

    // small font
    const font_small_0 = $('.font-small-0');
    const font_small_1 = $('.font-small-1');
    const font_small_2 = $('.font-small-2');
    const font_small_3 = $('.font-small-3');
    const font_small_4 = $('.font-small-4');
    const font_small_5 = $('.font-small-5');
    const font_small_6 = $('.font-small-6');
    const font_small_7 = $('.font-small-7');
    const font_small_8 = $('.font-small-8');
    const font_small_9 = $('.font-small-9');

    // medal
    const medal_bronze = $('.medal-bronze');
    const medal_gold = $('.medal-gold');
    const medal_platinum = $('.medal-platinum');
    const medal_silver = $('.medal-silver');

    // pipe
    const pipe = $('.pipe');
    const pipe_up = $('.pipe-up');
    const pipe_down = $('.pipe-down');

    const imgs: Images = {
        bird: bird.get(0),
        ceiling: ceiling.get(0),
        land: land.get(0),
        replay: replay.get(0),
        scoreboard: scoreboard.get(0),
        sky: sky.get(0),
        splash: splash.get(0),
        thumb: thumb.get(0),
        font_big: [
            font_big_0.get(0),
            font_big_1.get(0),
            font_big_2.get(0),
            font_big_3.get(0),
            font_big_4.get(0),
            font_big_5.get(0),
            font_big_6.get(0),
            font_big_7.get(0),
            font_big_8.get(0),
            font_big_9.get(0),
        ],
        font_small: [
            font_small_0.get(0),
            font_small_1.get(0),
            font_small_2.get(0),
            font_small_3.get(0),
            font_small_4.get(0),
            font_small_5.get(0),
            font_small_6.get(0),
            font_small_7.get(0),
            font_small_8.get(0),
            font_small_9.get(0),
        ],
        medal: [
            medal_bronze.get(0),
            medal_gold.get(0),
            medal_platinum.get(0),
            medal_silver.get(0),
        ],
    }




    const game = new Game(game_canvas.get(0), imgs);

    // const s = new Spirit(0, 0);
    // s.addFrame(bird);
    // s.draw(game.ctx);


    const ctx = game_canvas.get(0).getContext('2d');
    // ctx.drawImage(bird.get(0), 0, 0)
    // ctx.drawImage(bird.get(0), 0, 0)
    // const s = new Sprite(0, 0, bird.get(0), 4);
    // const render = () => {
    //     s.draw(ctx)
    //     requestAnimationFrame(render)
    // }
    // requestAnimationFrame(render);
    game.render()
});
