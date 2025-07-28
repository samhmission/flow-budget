import { Image } from "expo-image";
import { Platform, StyleSheet, Button, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import BudgetItemList from "@/components/ui/BudgetItemList";

import type { BudgetItem } from "@flow-budget/api-types";
import CreateBudgetItemForm from "@/components/ui/CreateBudgetItemForm";
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
        <Image source={require("@/assets/images/partial-react-logo.png")} />
      }
    >
      <ThemedView style={styles.budgetItemContainer}>
        <CreateBudgetItemForm />
        <BudgetItemList />
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
  budgetItemContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
