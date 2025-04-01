const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.alias = {
  "@": "./",
};

module.exports = defaultConfig;
