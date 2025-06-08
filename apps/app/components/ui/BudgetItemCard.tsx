import { Button } from "@react-navigation/elements";
import Constants from "expo-constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function BudgetItemCard({
  item: { id, category, amount },
}: {
  item: { id: string; category: string; amount: number };
}) {
  const queryClient = useQueryClient();
  // Mutations
  const mutation = useMutation({
    mutationFn: deleteBudgetItem,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["budgetItems"] });
    },
  });
  return (
    <View key={id} style={styles.budgetItem}>
      <Text style={styles.budgetItemText}>{category}</Text>
      <Text style={styles.budgetItemAmount}>${amount.toFixed(2)}</Text>
      <Text style={styles.budgetItemText}>{id}</Text>
      {/* Delete button */}
      <Button onPress={() => mutation.mutate(id)} style={styles.deleteButton}>
        X
      </Button>
    </View>
  );
}

async function deleteBudgetItem(id: string) {
  const apiURL = Constants.expoConfig.extra.apiUrl;

  if (!apiURL) {
    throw new Error("API URL is not defined in environment variables");
  }
  console.log("Deleting budget item with ID:", id);
  const response = await fetch(`${apiURL}/budgetItem/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete budget item");
  }
  console.log("Budget item deleted successfully");
  return response.json();
}

const styles = StyleSheet.create({
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
  budgetItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  budgetItemAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32", // A green color for money
  },
  deleteButton: {
    backgroundColor: "FFFFFF",
    borderRadius: 20,
    padding: 8,
    color: "#FF5252",
  },
});

export default BudgetItemCard;
