const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {

    entry: './src/index.js',

    mode: 'development',

    devtool: 'cheap-module-source-map', // 錯誤後可查看到原本代碼位置

    //配置插件,值是一個陣列
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', //使用的html模板路徑
            //filename: 'app.html', //產出後的html名稱
            inject: 'body', // 注入script標籤的位置
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[contenthash].css' //產出css後的路徑 //contenthash 自動產生hash檔名
        })
    ],

    // 這些選項決定瞭如何處理項目中不同類型的模塊
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ]
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            // 圖片處理
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: 'asset', //根據條件會轉換base64
                parser: {
                    dataUrlCondition: {
                        // 小於100kb轉base64字符串
                        // 優點: 減少請求量, 缺點: 體積會更大
                        maxSize: 100 * 1024, //10kb
                    }
                },
                generator: {
                    // 輸出名稱
                    filename: 'images/[contenthash][ext]'
                }
            },
            //字體處理
            {
                test: /\.(ttf|woff2?)$/,
                type: 'asset/resource', //不會轉換base64
                generator: {
                    filename: 'fonts/[contenthash][ext]'
                }
            }
        ]
    },
    devServer: {
        open: true,
        port: '1111',
        hot: true, // 開啟(HMR) 只更新有修改的模塊不需整個頁面重新載入(打包速度快)
        static: {
            directory: path.join(__dirname, './dist'), // 配置用於從目錄提供靜態文件的選項,
            //publicPath: '/serve-public-path-url',
        },
        // historyApiFallback: {
        //     index: './app.html'
        // }
    },
    // 配置優化
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },

}