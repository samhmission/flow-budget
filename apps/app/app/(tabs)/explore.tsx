import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#01042d", dark: "#01042d" }}
      headerImage={
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.headerImage}
          onError={(error) => console.log("Image load error:", error)}
          onLoad={() => console.log("Image loaded successfully")}
          contentFit="contain"
          placeholder="Loading..."
        />
      }
    >
      <View style={styles.mainContentContainer}>
        <ThemedButton
          variant="primary"
          title="Coins"
          onPress={() => console.log("Coins button pressed")}
        />
        <ThemedButton
          variant="primary"
          title="Moons"
          onPress={() => console.log("Moons button pressed")}
        />
        <ThemedButton
          variant="primary"
          title="Teller"
          onPress={() => console.log("Teller button pressed")}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: 600,
    height: 600,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: -200,
    marginLeft: -10, // TODO check image alignment
  },
  mainContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginVertical: 24,
  },
  buttonWrapper: {
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    zIndex: 1,
  },
});
