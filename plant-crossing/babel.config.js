module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.ts',
            '.tsx',
            '.json',
            '.fbx'
          ],
          root: ['./src'],
          alias: {
            '@assets': './assets',
            '@components': './components'
          }
        }
      ]
    ]
  };
};
