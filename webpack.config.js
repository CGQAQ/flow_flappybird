// @ts-nocheck

const path = require('path');
const webpack = require('webpack');
const jquery = require('jquery');

const dev = 'development';
const pro = 'production';

module.exports = {
    mode: dev,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: jquery,
            jQuery: jquery,
        })
    ]
}