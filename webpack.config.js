// @ts-nocheck

const path = require("path");
const webpack = require("webpack");
const jquery = require("jquery");

const dev = "development";
const pro = "production";

module.exports = {
    mode: pro,
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.[tj]s$/,
                use: "babel-loader"
            }
        ]
    },
    resolve: {
        extensions: ["*", ".ts", ".js"]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: jquery,
            jQuery: jquery
        })
    ]
};
