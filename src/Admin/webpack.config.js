var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: {
        main: './lib/main.js',
        vendor: [
            'react',
            'react-dom',
            'react-router',
            'babel-polyfill',
            'chart.js',
            'react-chartjs'            
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css!postcss' },
            { test: /\.css$/, loader: 'style!css' },

            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015'],
                    plugins: ['syntax-async-functions', 'transform-regenerator', 'transform-class-properties']
                }
            },

            {
                test: /\.(jpeg|gif|png).*/,
                exclude: /(node_modules)/,
                loader: 'url?limit=1000&name=[name].[hash].[ext]'
            },
            { test: /\.(woff|woff2).*/, loader: 'url?limit=10000&mimetype=application/font-woff&name=[name].[hash].[ext]' },
            { test: /\.ttf.*/, loader: 'url?limit=10000&mimetype=application/octet-stream&name=[name].[hash].[ext]' },
            { test: /\.eot.*/, loader: 'file' },
            { test: /\.svg.*/, loader: 'url?limit=10000&mimetype=image/svg+xml&name=[name].[hash].[ext]' }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    postcss: function () {
        return [autoprefixer];
    },
    plugins: [
        new webpack.ProvidePlugin({
            'Router': 'react-router',
            'React': 'react',
            'ReactDOM': 'react-dom',
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin(
          /* chunkName= */'vendor',
          /* filename= */'js/vendor.js'
        ),
        new HtmlWebpackPlugin({  // Also generate a test.html
          template: 'templates/index.html'
        }),
        new webpack.NoErrorsPlugin()
    ]
};
