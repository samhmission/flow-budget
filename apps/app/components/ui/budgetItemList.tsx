import React, { use } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import type { BudgetItem } from "@flow-budget/api-types";
import Constants from "expo-constants";
import BudgetItemCard from "./BudgetItemCard";
function BudgetItemList() {
  const query = useQuery({
    queryKey: ["budgetItems"],
    queryFn: getBudgetItemList,
    staleTime: 0, // Data is always considered stale immediately
    refetchOnMount: true, // Always refetch when the component mounts
    refetchOnWindowFocus: true, // Refetch when the window regains focus
  });

  const budgetItems = query.data || [];

  const myScrollView = () => (
    <ScrollView style={styles.container}>
      {budgetItems.map((item) => (
        <BudgetItemCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );

  return <View style={styles.container}>{myScrollView()}</View>;
}

const getBudgetItemList = async (): Promise<BudgetItem[]> => {
  const apiURL = Constants.expoConfig.extra.apiUrl;
  if (!apiURL) {
    throw new Error("API URL is not defined in environment variables");
  }
  console.log("Fetching budget items from:", apiURL);

  try {
    // Add timestamp to prevent caching by the browser or network
    const timestamp = new Date().getTime();
    const response = await fetch(`${apiURL}/budgetItem?_t=${timestamp}`);

    if (!response.ok) {
      console.error(
        "Network response was not ok:",
        response.status,
        response.statusText
      );
      throw new Error("Network response was not ok");
    }

    const data: BudgetItem[] = await response.json();
    console.log("Fetched budget items:", data);
    return data;
  } catch (error) {
    console.error("Error fetching budget items:", error);
    throw error;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
  },
});

export default BudgetItemList;
