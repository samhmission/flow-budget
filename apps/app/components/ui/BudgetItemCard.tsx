import Constants from "expo-constants";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function BudgetItemCard({
  item: { id, category, amount },
}: {
  item: { id: string; category: string; amount: number };
}) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedAmount, setEditedAmount] = useState(amount.toString());

  const deleteMutation = useMutation({
    mutationFn: deleteBudgetItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetItems"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; category: string; amount: number }) =>
      updateBudgetItem(data),
    onSuccess: (data) => {
      console.log("Budget item updated successfully:", data);
      // Force immediate refetch and invalidation of the query cache
      queryClient.invalidateQueries({
        queryKey: ["budgetItems"],
        refetchType: "active",
        exact: false,
      });
      queryClient.refetchQueries({ queryKey: ["budgetItems"] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Failed to update budget item:", error);
    },
  });

  const handleUpdate = () => {
    // Ensure amount is a valid number
    const parsedAmount = parseFloat(editedAmount);
    if (isNaN(parsedAmount)) {
      console.error("Invalid amount value");
      return;
    }

    console.log("Updating budget item:", {
      id,
      category: editedCategory,
      amount: parsedAmount,
    });
    updateMutation.mutate({
      id,
      category: editedCategory,
      amount: parsedAmount,
    });
  };

  return (
    <View key={id} style={styles.budgetItem}>
      {!isEditing ? (
        <>
          <Text style={styles.budgetItemText}>{category}</Text>
          <Text style={styles.budgetItemAmount}>${amount.toFixed(2)}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.actionButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteMutation.mutate(id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <TextInput
            value={editedCategory}
            onChangeText={setEditedCategory}
            style={styles.input}
          />
          <TextInput
            value={editedAmount}
            onChangeText={setEditedAmount}
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleUpdate}
              style={styles.saveButton}
              disabled={updateMutation.isPending}
            >
              <Text style={styles.saveButtonText}>
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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

async function updateBudgetItem({
  id,
  category,
  amount,
}: {
  id: string;
  category: string;
  amount: number;
}) {
  const apiURL = Constants.expoConfig.extra.apiUrl;

  if (!apiURL) {
    throw new Error("API URL is not defined in environment variables");
  }

  console.log(`Sending update to ${apiURL}/budgetItem/${id}`, {
    category,
    amount,
  });

  try {
    const response = await fetch(`${apiURL}/budgetItem/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, amount }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server returned ${response.status}: ${errorText}`);
      throw new Error(
        `Failed to update budget item: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error updating budget item:", error);
    throw error;
  }
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
    backgroundColor: "#f7cf4b",
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
    flex: 1,
  },
  budgetItemAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
    flex: 1,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#4f1f65",
    borderRadius: 12,
    padding: 8,
    minWidth: 50,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FF5252",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  actionButton: {
    marginRight: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#2196F3",
  },
  editButtonText: {
    color: "white",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 8,
    minWidth: 100,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#FFA000",
    padding: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default BudgetItemCard;
