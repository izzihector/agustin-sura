const path = require('path');

module.exports ={
    mode: 'production',
    output: {
        path: path.join(__dirname, '..', 'static', 'src', 'js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },{
                test:/\.css$/,
                use: ['style-loader','css-loader']
            }
        ]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true
    }
}