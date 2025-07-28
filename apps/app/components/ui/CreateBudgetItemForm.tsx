import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";

const CreateBudgetItemForm = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [formErrors, setFormErrors] = useState<{
    category?: string;
    amount?: string;
  }>({});
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createBudgetItem,
    onSuccess: (data) => {
      console.log("Budget item created successfully:", data);

      resetForm();

      // Refresh the list
      queryClient.invalidateQueries({ queryKey: ["budgetItems"] });
      queryClient.refetchQueries({ queryKey: ["budgetItems"] });

      Alert.alert(
        "Success",
        `Budget item created successfully!\nID: ${data.id}`
      );
    },
    onError: (error) => {
      console.error("Failed to create budget item:", error);
      Alert.alert("Error", "Failed to create budget item. Please try again.");
    },
  });

  const resetForm = () => {
    setCategory("");
    setAmount("");
    setDescription("");
    setIsExpense(true);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: { category?: string; amount?: string } = {};
    let isValid = true;

    if (!category.trim()) {
      errors.category = "Category is required";
      isValid = false;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.amount = "Please enter a valid positive amount";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Convert to negative if it's an expense
    const parsedAmount = parseFloat(amount);
    const finalAmount = isExpense ? -parsedAmount : parsedAmount;

    console.log("Creating budget item:", {
      category,
      amount: finalAmount,
      description,
    });

    createMutation.mutate({
      category,
      amount: finalAmount,
      description,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ width: "100%" }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Add New Budget Item</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={[
              styles.input,
              formErrors.category ? styles.inputError : null,
            ]}
            value={category}
            onChangeText={(text) => {
              setCategory(text);
              if (formErrors.category) {
                setFormErrors({ ...formErrors, category: undefined });
              }
            }}
            placeholder="e.g., Food, Transport, Salary"
          />
          {formErrors.category ? (
            <Text style={styles.errorText}>{formErrors.category}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, formErrors.amount ? styles.inputError : null]}
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              if (formErrors.amount) {
                setFormErrors({ ...formErrors, amount: undefined });
              }
            }}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
          {formErrors.amount ? (
            <Text style={styles.errorText}>{formErrors.amount}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about this item"
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              isExpense ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => setIsExpense(true)}
          >
            <Text style={isExpense ? styles.activeText : styles.inactiveText}>
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              !isExpense ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => setIsExpense(false)}
          >
            <Text style={!isExpense ? styles.activeText : styles.inactiveText}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetForm}
            disabled={createMutation.isPending}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.submitButtonText}> Creating...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Add Budget Item</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

async function createBudgetItem({
  category,
  amount,
  description,
}: {
  category: string;
  amount: number;
  description: string;
}): Promise<{
  id: string;
  category: string;
  amount: number;
  description: string;
  created_at: string;
}> {
  const apiURL = Constants.expoConfig?.extra?.apiUrl;

  if (!apiURL) {
    throw new Error("API URL is not defined in environment variables");
  }

  console.log(`Sending create request to ${apiURL}/budgetItem`, {
    category,
    amount,
    description,
  });

  try {
    const response = await fetch(`${apiURL}/budgetItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        amount,
        description,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server returned ${response.status}: ${errorText}`);
      throw new Error(
        `Failed to create budget item: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error creating budget item:", error);
    throw error;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333333",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#666666",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF5252",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#2196F3",
  },
  inactiveButton: {
    backgroundColor: "#e0e0e0",
  },
  activeText: {
    color: "white",
    fontWeight: "600",
  },
  inactiveText: {
    color: "#666666",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    flex: 3,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
    flex: 1,
  },
  resetButtonText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CreateBudgetItemForm;
