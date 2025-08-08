import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack'; // <-- default import

const { ModuleFederationPlugin } = webpack.container; // <-- get it from webpack.container

export default {
  mode: 'development',
  entry: path.resolve(process.cwd(), 'src/bootstrap.tsx'),
  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: true
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'ui_base',
      filename: 'remoteEntry.js',
      exposes: { './App': path.resolve(process.cwd(), 'src/App') },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
        'react-router-dom': { singleton: true, eager: true }
      }
    }),
    new HtmlWebpackPlugin({ template: path.resolve(process.cwd(), 'public/index.html') })
  ],
  output: { publicPath: 'auto', clean: true }
};
