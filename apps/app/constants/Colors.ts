/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// Brand Color Palette
const brandColors = {
  primary: "#01042d", // Dark navy blue
  accent: "#00cfd4", // Cyan
  purple: "#b474ea", // Light purple
  yellow: "#f7cf4b", // Bright yellow
  orange: "#eba925", // Orange
  darkOrange: "#e8981c", // Dark orange
  lightPink: "#e9cfd5", // Light pink
  lightPurple: "#c0abc0", // Light purple gray
  darkPurple: "#4f1f65", // Dark purple
  white: "#ffffff",
  black: "#000000",
};

export const Colors = {
  light: {
    text: "#11181C",
    background: brandColors.primary,
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    buttons: {
      primary: {
        background: brandColors.yellow,
        text: brandColors.darkPurple,
      },
      secondary: {
        background: brandColors.white,
        text: brandColors.darkPurple,
      },
    },
  },

  dark: {
    text: "#ECEDEE",
    background: brandColors.white,
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    buttons: {
      primary: {
        background: brandColors.orange,
        text: brandColors.white,
      },
      secondary: {
        background: brandColors.lightPink,
        text: brandColors.darkPurple,
      },
    },
  },
};

export type BrandColors = typeof brandColors;
