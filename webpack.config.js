// __dirname - системная папка - содержит её адрес
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyPlugin = require('copy-webpack-plugin');


const mode = process.env.NODE_ENV || 'development';
// если переменная не определена то режим development 
const devMode = mode === 'development';
// проверка devMode - под что ? или разработка по умолчанию  или под продакшн -  тогда false ?
const target = devMode ? 'web' : 'browserslist';
//  devmode какой ? спрашивает - если true - то под web, если false - то browserlist - сборка под опр браузеры для использования автопрефиксов
const devtool = devMode ? 'source-map' : undefined;
// 
module.exports = {
	mode,
	target,
	devtool,
	devServer: {
		port: 3000,
		open: true,
		hot: true,
	},
	entry: path.resolve(__dirname, 'src', 'index.js'),
	// output - туда куда мы всё складываем
	// dist - папка с результатом всей сборки
	output: {
		path: path.resolve(__dirname, 'dist'),
		// clean - делает папку постоянно отчищаемой после команд
		// [contenthash].js - contenthash - изменяет имя файла js при изменении чего либо в js коде 
		// [name]. - делает авто имя - main.[...contenthash].js
		clean: true,
		filename: '[name].[contenthash].js',
		assetModuleFilename: 'assets/[name][ext]',
	},
	plugins: [
		new HtmlWebpackPlugin({
			// путь до нашего html док
			template: path.resolve(__dirname, 'src', 'index.html'),
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		// new CopyPlugin({
		//   patterns: [{ from: 'static', to: './' }],
		// }),
	],
	// добавляем модули типа лоадера 
	// module loader для html - чтобы автоматом обновлялось - также 
	//  обязательно включить слежку за файлом - в index.js делаем import ./index.html
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			// module loader для стилей - style loader - в index.js делаем import
			{
				test: /\.(c|sa|sc)ss$/i,
				use: [
					// если dev mode то используем styleloader иначе если прод то используем плагин
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [require('postcss-preset-env')],
							},
						},
					},
					'group-css-media-queries-loader',
					{
						loader: 'resolve-url-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.woff2?$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
			{
				test: /\.(jpe?g|png|webp|gif|svg)$/i,
				use: devMode
					? []
					: [
						{
							loader: 'image-webpack-loader',
							options: {
								mozjpeg: {
									progressive: true,
								},
								optipng: {
									enabled: false,
								},
								pngquant: {
									quality: [0.65, 0.9],
									speed: 4,
								},
								gifsicle: {
									interlaced: false,
								},
								webp: {
									quality: 75,
								},
							},
						},
					],
				type: 'asset/resource',
			},
			{
				test: /\.m?js$/i,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
};
