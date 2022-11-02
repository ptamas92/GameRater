const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProd = process.env.NODE_ENV === "production";
const staticRoot = process.env.CDN_ROOT || "";

module.exports = {
    mode: process.env.NODE_ENV || "development",

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },

    entry: {
        'App': [
            "babel-polyfill",
            "./React/app"
        ]
    },

    output: {
        libraryTarget: "var",
        // name of the global var: "Foo"
        library: "[name]",
        pathinfo: !isProd,

        path: __dirname + "/wwwroot/app_bundles",
        publicPath: staticRoot + "/app_bundles/",

        //filename: "[name].[hash].js",
        filename: "[name].js",
        chunkFilename: "[id].[chunkhash].js"
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader?silent=true" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            {
                test: /\.less$/, use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "postcss-loader", options: { plugins: [autoprefixer] } },
                    { loader: "less-loader" }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            { test: /\.gif$/, loader: "url-loader?name=[name]-[hash:base64:8].[ext]&limit=10000&mimetype=image/gif" },
            { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?name=[name]-[hash:base64:8].[ext]&limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name]-[hash:base64:8].[ext]" },
            { test: /\.(jpg|png|svg)$/, loader: 'file-loader?name=[name]-[hash:base64:8].[ext]' },
            //{ test: /\.font\.(js|json)$/, loader: "style-loader!css-loader!webfonts-loader?publicPath=" + staticRoot + "/bundles/" }
            { test: /\.font\.(js|json)$/, use: [{ loader: "style-loader" }, { loader: "css-loader", options: { url: false, } }, { loader: "webfonts-loader", options: { publicPath: "./app_bundles/" } }] }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        isProd ? new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 50000
        }) : null,
        new webpack.HashedModuleIdsPlugin()
    ].filter(x => x),

    node: { fs: 'empty' },

    externals: [
        { './cptable': 'var cptable' },
        { './jszip': 'jszip' },
        { '../xlsx': 'xlsx' }
    ],

    optimization: {
        minimize: false,
        minimizer: [],
        sideEffects: false
    }
};
