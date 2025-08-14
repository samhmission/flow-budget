import { Theme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  View,
} from "react-native";

interface ThemedButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary";
  title: string;
}

export function ThemedButton(props: ThemedButtonProps) {
  const theme = useColorScheme() ?? "dark";
  const variant = props.variant ?? "primary";
  const buttonColors = Colors[theme].buttons[variant];
  const buttonStyles = Theme.buttons[variant];

  // Destructure to separate style and other props
  const { style, variant: _, title, ...restProps } = props;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonColors.background,
          borderBottomWidth: buttonColors.borderBottomWidth,
          borderRightWidth: buttonColors.borderRightWidth,
          borderColor: buttonColors.borderColor,
        },
        buttonStyles,
        style,
      ]}
      {...restProps}
    >
      <View style={styles.outerBevelBorder}>
        <View style={styles.bevel}>
          <View style={styles.innerBevelBorder}>
            <Text style={[styles.text, { color: buttonColors.text }]}>
              {title}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// TODO: refactor into theme file once the button styles are finalized
const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    overflow: "visible",
    position: "relative",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    zIndex: 3,
  },
  outerBevelBorder: {
    position: "absolute",
    height: "90%",
    width: "95%",
    borderLeftWidth: 5,
    borderTopWidth: 5,
    borderRightWidth: 0,
    borderBottomWidth: 5,
    borderColor: "#e8981c",
    borderRadius: 9999,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  bevel: {
    position: "absolute",
    height: "100%",
    width: "100%",
    borderRadius: 9999,
    borderWidth: 10,
    borderColor: "#f7cf4b",
    zIndex: 1,
  },
  innerBevelBorder: {
    position: "absolute",
    height: "100%",
    width: "100%",
    borderRadius: 9999,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#a06a3a",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});
