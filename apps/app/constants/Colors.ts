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
  lightOrange: "#eba925", // Light orange
  orange: "#e8981c", // Orange
  darkOrange: "#a06a3a", // Dark orange
  lightPink: "#e9cfd5", // Light pink
  lightPurple: "#c0abc0", // Light purple gray
  darkPurple: "#4f1f65", // Dark purple
  white: "#ffffff",
  black: "#000000",
};
// TODO: refactor this into the theme file for better organization and maintainability
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
        text: brandColors.black,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderColor: brandColors.darkOrange,
      },
      secondary: {
        background: brandColors.white,
        text: brandColors.black,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderColor: brandColors.darkOrange,
      },
    },
  },

  dark: {
    text: "#ECEDEE",
    background: brandColors.primary,
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    buttons: {
      primary: {
        background: brandColors.lightOrange,
        text: brandColors.black,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderColor: brandColors.darkOrange,
      },
      secondary: {
        background: brandColors.lightPink,
        text: brandColors.black,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderColor: brandColors.darkOrange,
      },
    },
  },
};

// export type ColorScheme = keyof typeof Colors; // TODO type checking / auto completion for colors if needed
// export type BrandColors = typeof brandColors;
