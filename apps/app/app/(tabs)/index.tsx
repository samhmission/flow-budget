import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import type { BudgetItem } from "@flow-budget/api-types";

export default function HomeScreen() {
  const [budgetItem, setBudgetItem] = useState<BudgetItem>();
  const apiURL = Constants.expoConfig.extra.apiUrl;
  console.log("Constants:", Constants);
  console.log("expoConfig:", Constants.expoConfig);
  console.log("extra:", Constants.expoConfig?.extra);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch(`${apiURL}/budgetItem`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: BudgetItem[] = await response.json();
        setBudgetItem(data[0]);
      } catch (error) {
        console.error("Failed to fetch budget:", error);
      }
    };

    fetchBudget();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {!budgetItem ? (
          <ThemedText>Loading budget item...</ThemedText>
        ) : (
          <ThemedText>
            Budget Item: {budgetItem.id} - {budgetItem.category} -{" "}
            {budgetItem.amount}
          </ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
