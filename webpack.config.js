"use strict";
var webpack = require('webpack');

module.exports = {
    entry: './guest/app.js',
    output: {
        filename: './public/js/bundle.js'
    },
    module: {
        rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			}
		]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    }
};
