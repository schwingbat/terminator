const path = require('path');

module.exports = {
    context: path.join(__dirname, "engine"),
    entry: "./core.js",
    output: {
        path: path.join(__dirname, "build"),
        filename: "terminator.js"
    },
    module: {
      loaders: [
        {
          test: /.js$/,
          loaders: 'buble',
          include: path.join(__dirname, 'src'),
          query: {
            objectAssign: 'Object.assign',
            arrow: true,
            letConst: true,
            templateString: true
          }
        }
      ]
    },
    devtool: 'inline-source-map'
}
