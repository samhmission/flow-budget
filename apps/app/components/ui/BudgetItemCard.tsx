import Constants from "expo-constants";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Picker } from "@react-native-picker/picker";
function BudgetItemCard({
  item: {
    id,
    name,
    category,
    amount,
    description,
    recurring,
    recurrence_interval,
    created_at,
    updated_at,
  },
}: {
  item: {
    id: string;
    name: string;
    category: string;
    amount: number;
    description: string;
    recurring: boolean;
    recurrence_interval: string;
    created_at: string;
    updated_at: string;
  };
}) {
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name || "");
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedAmount, setEditedAmount] = useState(amount.toString());
  const [editedDescription, setEditedDescription] = useState(description || "");
  const [editedRecurring, setEditedRecurring] = useState(recurring || false);
  const [editedRecurrenceInterval, setEditedRecurrenceInterval] = useState<
    "weekly" | "monthly" | "yearly" | undefined
  >(
    recurrence_interval === "weekly" ||
      recurrence_interval === "monthly" ||
      recurrence_interval === "yearly"
      ? recurrence_interval
      : undefined
  );

  const deleteMutation = useMutation({
    mutationFn: deleteBudgetItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetItems"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      category: string;
      amount: number;
      description: string;
      recurring?: boolean;
      recurrence_interval?: "weekly" | "monthly" | "yearly";
    }) => updateBudgetItem(data),
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

    // Type-safe recurrence interval validation
    const validRecurrenceInterval =
      editedRecurrenceInterval === "weekly" ||
      editedRecurrenceInterval === "monthly" ||
      editedRecurrenceInterval === "yearly"
        ? editedRecurrenceInterval
        : undefined;

    console.log("Updating budget item:", {
      id,
      name: editedName,
      category: editedCategory,
      amount: parsedAmount,
      description: editedDescription,
      recurring: editedRecurring,
      recurrence_interval: validRecurrenceInterval,
    });

    updateMutation.mutate({
      id,
      name: editedName,
      category: editedCategory,
      amount: parsedAmount,
      description: editedDescription,
      recurring: editedRecurring,
      recurrence_interval: validRecurrenceInterval,
    });
  };

  return (
    <View style={styles.cardContainer}>
      {/* Edit Form Overlay */}
      {isEditing ? (
        <View style={styles.editForm}>
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Budget item name"
            style={styles.input}
          />
          <TextInput
            value={editedCategory}
            onChangeText={setEditedCategory}
            placeholder="Category"
            style={styles.input}
          />
          <TextInput
            value={editedAmount}
            onChangeText={setEditedAmount}
            placeholder="Amount"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            value={editedDescription}
            onChangeText={setEditedDescription}
            placeholder="Description"
            style={styles.input}
          />

          <View style={styles.switchContainer}>
            <Text>Recurring:</Text>
            <Switch
              value={editedRecurring}
              onValueChange={setEditedRecurring}
            />
          </View>

          {editedRecurring && (
            <View style={styles.pickerContainer}>
              <Text>Frequency:</Text>
              <Picker
                selectedValue={editedRecurrenceInterval}
                onValueChange={(value) => setEditedRecurrenceInterval(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select frequency" value={undefined} />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
                <Picker.Item label="Yearly" value="yearly" />
              </Picker>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* Main Budget Item Content */}
          <TouchableOpacity
            onPress={() => setShowDetails((prev: boolean) => !prev)}
            style={styles.budgetItemContainer}
          >
            <Text style={styles.budgetItemText}>
              {category} {showDetails ? "▲" : "▼"}
            </Text>
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
          </TouchableOpacity>

          {/* Extra Budget Item Details */}
          {showDetails && (
            <TouchableOpacity
              onPress={() => setShowDetails((prev: boolean) => !prev)}
              style={styles.itemDetailsContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.itemDetailsText}>{description}</Text>
              <Text style={styles.itemDetailsText}>
                Recurring:
                {recurring ? " Yes, Interval: " + recurrence_interval : " No"}
              </Text>
              <Text style={styles.itemDetailsText}>
                Created at: {created_at}
              </Text>
              <Text style={styles.itemDetailsText}>
                Updated at: {updated_at}
              </Text>
              <Text style={styles.closeHintText}>Tap to collapse</Text>
            </TouchableOpacity>
          )}
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
  name,
  category,
  amount,
  description,
  recurring,
  recurrence_interval,
}: {
  id: string;
  name: string;
  category: string;
  amount: number;
  description: string;
  recurring?: boolean;
  recurrence_interval?: "weekly" | "monthly" | "yearly";
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
      body: JSON.stringify({
        name,
        category,
        amount,
        description,
        recurring,
        recurrence_interval,
      }),
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
  cardContainer: {
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    backgroundColor: "#f7cf4b",
    borderRadius: 12,
    width: "100%",
  },
  budgetItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
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
  itemDetailsContainer: {
    flexDirection: "column",
    gap: 4,
    width: "100%",
    alignSelf: "stretch",
  },
  itemDetailsText: {
    fontSize: 16,
  },
  closeHintText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  editForm: {
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default BudgetItemCard;
