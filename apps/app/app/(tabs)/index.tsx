import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { navigate } from "expo-router/build/global-state/routing";

export default function HomeScreen() {
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
          onPress={() => navigate("/(tabs)/coins")}
        />
        <ThemedButton
          variant="primary"
          title="Moons"
          onPress={() => navigate("/(tabs)/moons")}
        />
        <ThemedButton
          variant="primary"
          title="Teller"
          onPress={() => navigate("/(tabs)/teller")}
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
});
