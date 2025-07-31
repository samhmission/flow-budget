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
        },
        buttonStyles,
      ]}
      {...props}
    >
      <View style={styles.innerBevel} />
      <Text style={[styles.text, { color: buttonColors.text }]}>
        {props.title}
      </Text>
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
  innerBevel: {
    position: "absolute",
    height: "90%",
    width: "95%",
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: "#FFD700",
    boxShadow: "-3px -3px 3px rgba(192, 128, 0, 0.4)",
  },
});
