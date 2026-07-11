// babel-preset-expo (SDK 57) automatically wires expo-router and the
// react-native-worklets/reanimated plugin when those packages are installed.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
