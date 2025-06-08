import React, { use } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { BudgetItem } from "@flow-budget/api-types";
import Constants from "expo-constants";
function BudgetItemList() {
  const query = useQuery({
    queryKey: ["budgetItems"],
    queryFn: getBudgetItemList,
  });

  const budgetItems = query.data || [];
  // const isLoading = query.isLoading;
  // const isError = query.isError;
  // const error = query.error;
  // const refetch = query.refetch;

  const myScrollView = () => (
    <ScrollView style={styles.container}>
      {budgetItems.map((item) => (
        <View key={item.id} style={styles.budgetItem}>
          <Text style={styles.budgetItemName}>{item.category}</Text>
          <Text style={styles.budgetItemAmount}>${item.amount.toFixed(2)}</Text>
        </View>
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
  list: {
    width: "100%",
  },
  budgetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  budgetItemAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32", // A green color for money
  },
});

export default BudgetItemList;
