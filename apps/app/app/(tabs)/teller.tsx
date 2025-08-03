import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import BudgetItemList from "@/components/ui/BudgetItemList";

import type { BudgetItem } from "@flow-budget/api-types";
import CreateBudgetItemForm from "@/components/ui/CreateBudgetItemForm";
export default function TellerScreen() {
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
  }, [apiURL]);

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
    backgroundColor: "transparent",
  },
  headerImage: {
    width: 500,
    height: 500,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: -150,
  },
});
