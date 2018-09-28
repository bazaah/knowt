const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/bin/frontend/index.html",
  filename: "./index.html"
});

module.exports = {
  entry: {
    main: "./src/bin/frontend/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  devServer: {
    host: "zebra.stemmet.dot", // 172.17.17.223
    port: 8066,
    compress: true,
    disableHostCheck: true,
    allowedHosts: ["zebra.stemmet.dot"],
    proxy: {
      "/api": {
        target: "http://172.17.17.223:8033/",
        //secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64:5]",
              sourceMap: true,
              minimize: true
            }
          }
        ]
      }
    ]
  },
  plugins: [htmlPlugin]
};
