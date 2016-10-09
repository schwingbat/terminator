const path = require('path');

module.exports = {
    context: path.join(__dirname, "engine"),
    entry: "./core.js",
    output: {
        path: __dirname,
        filename: "terminator.engine.js"
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
    }
}