// @ts-check

const path = require('path');

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
    }
}