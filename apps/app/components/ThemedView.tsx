import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const backgroundColor =
    typeof themeColor === "string" ? themeColor : undefined;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
