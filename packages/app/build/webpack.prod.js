const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = env => {
    return merge(common(env), {
        mode: 'production',
        target: [ 'web', 'es5' ],
        externals: {
            'custom-jquery': '$'
        },
        // devtool: false,
        devtool: 'source-map',
        plugins: [
            new CleanWebpackPlugin(),
        ],
        output: {
            path: path.resolve('./dist'),
            publicPath: ''
        }
    });
};
