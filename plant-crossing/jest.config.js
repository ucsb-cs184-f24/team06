module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|react-native' +
      '|@react-native-community' +
      '|expo' +
      '|@expo' +
      '|expo-status-bar' +
      '|@unimodules' +
      '|unimodules' +
      '|sentry-expo' +
      ')/)',
  ],
};
