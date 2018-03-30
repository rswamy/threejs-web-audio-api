var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: [
		'webpack-dev-server/client?http://0.0.0.0:8080',
		'webpack/hot/only-dev-server',
		'./app/app.js'
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
	output: {
		path: path.join(__dirname, 'docs'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel-loader'
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		}, {
			test: /\.scss$/,
			use: [
				'style-loader',
				'css-loader',
				'sass-loader'
			]
		}, {
			test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
			loader: "file-loader"
		}, {
			test: /\.(woff|woff2)$/,
			loader: "url?prefix=font/&limit=5000"
		}, {
			test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
			loader: "url?limit=10000&mimetype=application/octet-stream"
		}, {
			test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			loader: "url?limit=10000&mimetype=image/svg+xml"
		}, {
			test: /\.gif/,
			loader: "url-loader?limit=10000&minetype=image/gif"
		}, {
			test: /\.jpg/,
			loader: "url-loader?limit=10000&minetype=image/jpg"
		}, {
			test: /\.png/,
			loader: "url-loader?limit=10000&minetype=image/png"
		}
		]
	},
	devServer: {
		contentBase: "./docs",
		noInfo: true,
		hot: true,
		inline: true
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin()
	]
};
