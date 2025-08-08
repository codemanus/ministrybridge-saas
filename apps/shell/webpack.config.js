import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack'; // <-- default import

const { ModuleFederationPlugin } = webpack.container; // <-- get it from webpack.container

export default {
  mode: 'development',
  entry: path.resolve(process.cwd(), 'src/main.tsx'),
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        ui_base: 'ui_base@http://localhost:3001/remoteEntry.js'
      },
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
