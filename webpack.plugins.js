const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = [
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      configOverwrite: {
        compilerOptions: {
          noUnusedLocals: false,
        },
      },
    },
  }),
]
