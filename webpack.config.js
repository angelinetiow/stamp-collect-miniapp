const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  // For GitHub Pages, output directly to root folder
  const outputPath = isProduction 
    ? path.resolve(__dirname) 
    : path.resolve(__dirname, 'dist');

  return {
    entry: './src/index.tsx',
    output: {
      path: outputPath,
      filename: 'bundle.js',
      publicPath: isProduction ? './' : '/',
      // Don't clean in production to avoid deleting source files
      clean: !isProduction,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    // Optimization for smaller bundle
    optimization: {
      minimize: isProduction,
      splitChunks: false, // Keep single bundle for simpler GitHub Pages hosting
      usedExports: true,  // Tree shaking
    },
    // Suppress size warnings for GitHub Pages (static hosting is fine with larger bundles)
    performance: {
      hints: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: {
                  filter: (url) => !url.startsWith('/'),
                },
              },
            },
          ],
        },
        {
          test: /\.module\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { modules: true },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.module\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        } : false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public/svg', to: 'svg' },
          { from: 'public/images', to: 'images' },
          { from: 'public/icons', to: 'icons' },
          { from: 'public/manifest.json', to: 'manifest.json' },
          { from: 'public/sw.js', to: 'sw.js' },
        ],
      }),
    ],
    devServer: {
      allowedHosts: 'all',
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 3000,
      historyApiFallback: true,
      open: false,
    },
  };
};
