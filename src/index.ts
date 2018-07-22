// @flow

import $ from "jquery";
import {Game, Bird, Sprite, Texture} from './main';


$(document).ready(function() {
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

    const texture = new Texture();
    texture.bird = bird.get(0);
    texture.ceiling = ceiling.get(0);

    const game = new Game(game_canvas.get(0), texture);

    // const s = new Spirit(0, 0);
    // s.addFrame(bird);
    // s.draw(game.ctx);


    const ctx = game_canvas.get(0).getContext('2d');
    // ctx.drawImage(bird.get(0), 0, 0)
    ctx.drawImage(font_big_8.get(0), 0, 0)
});
