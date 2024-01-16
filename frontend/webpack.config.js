const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace with the path to your main JavaScript file
  output: {
    filename: 'bundle.js', // Replace with the desired output file name
    path: path.resolve(__dirname, 'dist'), // Replace with the desired output directory
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/")
    },
  },
};