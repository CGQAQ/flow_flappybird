// @flow

import $ from "jquery";
import {Game, Bird} from './main';


const game_canvas: $<HTMLCanvasElement> = $('#game-canvas');

const game = new Game(game_canvas.get(0));


game.ctx.drawImage(new ('./../assets/bird.png'), 0, 0);
