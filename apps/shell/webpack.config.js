import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack'; // <-- default import

const { ModuleFederationPlugin } = webpack.container; // <-- get it from webpack.container

export default {
  mode: 'development',
  entry: path.resolve(process.cwd(), 'src/feature-shell.tsx'),
  devServer: {
    port: 3000,
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
      name: 'shell',
      remotes: {
        ui_base: 'ui_base@http://localhost:3001/remoteEntry.js',
        ui_campus: 'ui_campus@http://localhost:3002/remoteEntry.js',
        ui_groups: 'ui_groups@http://localhost:3003/remoteEntry.js',
        ui_students: 'ui_students@http://localhost:3004/remoteEntry.js',
        ui_tech_prod: 'ui_tech_prod@http://localhost:3005/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
        'react-router-dom': { singleton: true, eager: true }
      }
    }),
    new HtmlWebpackPlugin({ template: path.resolve(process.cwd(), 'public/index.html') }),
    new webpack.DefinePlugin({
      'process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID': JSON.stringify(process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID || ''),
      'process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI': JSON.stringify(process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI || ''),
      'process.env.NEXT_PUBLIC_WORKOS_ORGANIZATION_ID': JSON.stringify(process.env.NEXT_PUBLIC_WORKOS_ORGANIZATION_ID || ''),
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'http://localhost:4000')
    })
  ],
  output: { publicPath: 'auto', clean: true }
};
