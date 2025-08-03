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

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonColors.background,
          boxShadow: buttonColors.boxShadow,
        },
        buttonStyles,
      ]}
      {...props}
    >
      <View style={styles.innerBevelBorder}>
        <View style={styles.innerBevel} />
        <Text style={[styles.text, { color: buttonColors.text }]}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  innerBevelBorder: {
    left: 0,
    height: "90%",
    width: "95%",
    borderLeftWidth: 5,
    borderTopWidth: 5,
    borderRightWidth: 0, // nothing on the right side
    borderBottomWidth: 5,
    borderColor: "#C08000FF",
    borderRadius: 9999,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  innerBevel: {
    position: "absolute",
    height: "100%",
    width: "100%",
    borderRadius: 9999,
    borderWidth: 10,
    borderColor: "#FFD700",
    boxShadow: `inset -3px -3px  rgba(192, 128, 0, 1)`,
  },
});
