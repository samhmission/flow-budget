import { Image } from "expo-image";
import { StyleSheet, View, Text } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";

import type { BudgetItem } from "@flow-budget/api-types";
import ActiveBudget from "@/components/ui/ActiveBudget";
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
      <ThemedView style={styles.mainContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Budget</Text>
        </View>
        <View style={styles.budgetListContainer}>
          <ActiveBudget />
        </View>
        <Calendar style={styles.calendar} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: 500,
    height: 500,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: -150,
  },
  mainContainer: {
    gap: 8,
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ccc",
  },
  budgetListContainer: {
    padding: 16,
    backgroundColor: "transparent",
    borderRadius: 12,
    gap: 8,
    flex: 1,
  },
  calendar: {
    margin: 16,
    borderRadius: 12,
    paddingBottom: 16,
  },
});
