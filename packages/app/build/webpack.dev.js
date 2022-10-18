const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const config = process.env;
module.exports = env => {
    return merge(common(env), {
        // 动态监测并实时更新页面
        // watch: true,
        mode: 'development',
        externals: {
            'custom-jquery': '$'
        },
        devServer: {
            hot: true,
            host: '0.0.0.0',
            // 默认端口8080，可不填
            port: config.APP_DEV_SERVER_PORT,
            historyApiFallback: true,
            watchFiles: [ 'src/**/*.ejs', 'public/**/*' ],
            proxy: {
                '/': {
                    ws: false,
                    target: config.APP_DEV_SERVER_TARGET,
                    changeOrigin: true
                }
            }
        },
        plugins: [ new webpack.HotModuleReplacementPlugin() ],
        target: 'web',
    });
};
