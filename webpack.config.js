module.exports = {
    entry: __dirname + '/gameClient/src/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/gameClient/dist'
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                include: __dirname + '/gameClient/src',
                loader: 'babel-loader',
                query: {
                    presets: [ 'env']
                }
            }
        ]
    }
};