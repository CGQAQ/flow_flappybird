// @flow

import $ from "jquery";

const game_canvas: JQuery<HTMLCanvasElement> = $('#game-canvas');


game_canvas.attr('width', '500px');
game_canvas.attr('height', '700px');

game_canvas.get(0).getContext('2d');