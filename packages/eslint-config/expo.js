import { config as baseConfig } from "./base.js";
// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require("eslint-config-expo/flat");

export const expoJsConfig = [
  ...baseConfig,
  ...expoConfig,
  {
    ignores: ["dist/*"],
  },
];
