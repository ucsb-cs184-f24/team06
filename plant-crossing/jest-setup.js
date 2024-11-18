import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock React Native's NativeAnimatedHelper
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-native/Libraries/Modal/RCTModalHostViewNativeComponent', () => {
  return {
    __INTERNAL_VIEW_CONFIG: {},
  };
});
