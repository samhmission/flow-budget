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
  const response = await fetch(apiURL + "/budgetItem");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data: BudgetItem[] = await response.json();
  console.log("data:", data);
  return data;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
  },
});

export default BudgetItemList;
