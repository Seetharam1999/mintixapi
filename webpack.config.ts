const nodeExternals = require('webpack-node-externals');
const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/main.ts",
    target: 'node',
    context: __dirname,
    externals: [nodeExternals()],
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'main.js',
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'package.json' }
        ])
    ],
    node: {
        __dirname: false
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }

        ],
    },
};
