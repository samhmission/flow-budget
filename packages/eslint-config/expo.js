import { config as baseConfig } from "./base.js";
// https://docs.expo.dev/guides/using-eslint/
import defaultExpoConfig from "eslint-config-expo/flat.js";

export const expoConfig = [
  ...defaultExpoConfig,
  {
    ignores: ["dist/*"],
  },
];
