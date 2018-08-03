module.exports = {
    entry: __dirname + '/client/src/gamecanvas.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/client/dist'
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                include: __dirname + '/client/src',
                loader: 'babel-loader',
                query: {
                    presets: [ 'env']
                }
            }
        ]
    }
};