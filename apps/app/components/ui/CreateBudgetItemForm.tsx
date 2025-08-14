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
  Switch,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";
import type { BudgetItem, RecurrenceInterval } from "@flow-budget/api-types";

// types
interface FormErrors {
  name?: string;
  category?: string;
  amount?: string;
  description?: string;
  recurrence_interval?: string;
}
interface BudgetItemFormData {
  name: string;
  category: string;
  amount: number;
  description: string;
  recurring: boolean;
  recurrence_interval: RecurrenceInterval | null;
}

const CreateBudgetItemForm = () => {
  const [showInputs, setShowInputs] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] =
    useState<RecurrenceInterval | null>(null);
  const [isExpense, setIsExpense] = useState(true);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
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
    setName("");
    setCategory("");
    setAmount("");
    setDescription("");
    setRecurring(false);
    setRecurrenceInterval(null);
    setIsExpense(true);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    } else if (name.trim().length > 100) {
      errors.name = "Name cannot exceed 100 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s\-_.,&()]+$/.test(name.trim())) {
      errors.name = "Name contains invalid characters";
      isValid = false;
    }

    // Category validation
    if (!category.trim()) {
      errors.category = "Category is required";
      isValid = false;
    } else if (category.trim().length < 2) {
      errors.category = "Category must be at least 2 characters";
      isValid = false;
    } else if (category.trim().length > 50) {
      errors.category = "Category cannot exceed 50 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s\-_&]+$/.test(category.trim())) {
      errors.category = "Category contains invalid characters";
      isValid = false;
    }

    // Amount validation
    const amountValue = amount.trim();
    if (!amountValue) {
      errors.amount = "Amount is required";
      isValid = false;
    } else {
      const parsedAmount = parseFloat(amountValue);
      if (isNaN(parsedAmount)) {
        errors.amount = "Please enter a valid number";
        isValid = false;
      } else if (parsedAmount <= 0) {
        errors.amount = "Amount must be greater than 0";
        isValid = false;
      } else if (parsedAmount > 999999.99) {
        errors.amount = "Amount cannot exceed $999,999.99";
        isValid = false;
      } else if (!/^\d+(\.\d{1,2})?$/.test(amountValue)) {
        errors.amount = "Amount can have maximum 2 decimal places";
        isValid = false;
      }
    }

    // Description validation (with length limit)
    if (description.trim().length > 500) {
      errors.description = "Description cannot exceed 500 characters";
      isValid = false;
    }

    // Recurrence validation - ensure frequency is selected for recurring items
    if (recurring && !recurrenceInterval) {
      errors.recurrence_interval =
        "Please select a frequency for recurring items";
      isValid = false;
    }

    // Validate recurrence interval value if provided
    if (
      recurrenceInterval &&
      !["weekly", "monthly", "yearly"].includes(recurrenceInterval)
    ) {
      errors.recurrence_interval = "Invalid frequency selected";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (): void => {
    if (!validateForm()) {
      return;
    }

    // Convert to negative if it's an expense
    const parsedAmount = parseFloat(amount);
    const finalAmount = isExpense ? -parsedAmount : parsedAmount;

    const budgetItemData: BudgetItemFormData = {
      name: name.trim(),
      category: category.trim(),
      amount: finalAmount,
      description: description.trim(),
      recurring,
      recurrence_interval: recurring ? recurrenceInterval : null,
    };

    console.log("Creating budget item:", budgetItemData);

    createMutation.mutate(budgetItemData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ width: "100%" }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setShowInputs((prev: boolean) => !prev)}
        >
          <Text style={styles.title}>
            Add New Budget Item {showInputs ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>

        {showInputs && (
          <View style={styles.inputContainerGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.name ? styles.inputError : null,
                ]}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (formErrors.name) {
                    setFormErrors({ ...formErrors, name: undefined });
                  }
                }}
                placeholder="e.g., Groceries, Rent"
                placeholderTextColor={"#c0abc0"}
              />
              {formErrors.name ? (
                <Text style={styles.errorText}>{formErrors.name}</Text>
              ) : null}
            </View>
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
                placeholderTextColor={"#c0abc0"}
              />
              {formErrors.category ? (
                <Text style={styles.errorText}>{formErrors.category}</Text>
              ) : null}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.amount ? styles.inputError : null,
                ]}
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  if (formErrors.amount) {
                    setFormErrors({ ...formErrors, amount: undefined });
                  }
                }}
                placeholder="0.00"
                placeholderTextColor={"#c0abc0"}
                keyboardType="decimal-pad"
              />
              {formErrors.amount ? (
                <Text style={styles.errorText}>{formErrors.amount}</Text>
              ) : null}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.description ? styles.inputError : null,
                ]}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (formErrors.description) {
                    setFormErrors({ ...formErrors, description: undefined });
                  }
                }}
                placeholder="Add details about this item"
                placeholderTextColor={"#c0abc0"}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {description.length}/500 characters
              </Text>
              {formErrors.description ? (
                <Text style={styles.errorText}>{formErrors.description}</Text>
              ) : null}
            </View>
            <View style={styles.switchContainer}>
              <Text>Recurring:</Text>
              <Switch
                value={recurring}
                onValueChange={(value) => {
                  setRecurring(value);
                  // Reset recurrence interval to null when recurring is disabled
                  if (!value) {
                    setRecurrenceInterval(null);
                  }
                }}
              />
            </View>

            {recurring && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Frequency:</Text>
                <View
                  style={[
                    styles.pickerContainer,
                    formErrors.recurrence_interval ? styles.pickerError : null,
                  ]}
                >
                  <Picker
                    selectedValue={recurrenceInterval}
                    onValueChange={(value) => {
                      setRecurrenceInterval(value);
                      // Clear error when a valid selection is made
                      if (formErrors.recurrence_interval && value) {
                        setFormErrors({
                          ...formErrors,
                          recurrence_interval: undefined,
                        });
                      }
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item
                      label="Select frequency..."
                      value={undefined}
                      color="#999"
                    />
                    <Picker.Item label="Weekly" value="weekly" />
                    <Picker.Item label="Monthly" value="monthly" />
                    <Picker.Item label="Yearly" value="yearly" />
                  </Picker>
                </View>
                {formErrors.recurrence_interval ? (
                  <Text style={styles.errorText}>
                    {formErrors.recurrence_interval}
                  </Text>
                ) : null}
              </View>
            )}
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  isExpense ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => setIsExpense(true)}
              >
                <Text
                  style={isExpense ? styles.activeText : styles.inactiveText}
                >
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
                <Text
                  style={!isExpense ? styles.activeText : styles.inactiveText}
                >
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
                    <Text style={styles.submitButtonText}>Creating...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>Add Budget Item</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

async function createBudgetItem(data: BudgetItemFormData): Promise<BudgetItem> {
  const apiURL = Constants.expoConfig?.extra?.apiUrl;

  if (!apiURL) {
    throw new Error("API URL is not defined in environment variables");
  }

  console.log(`Sending create request to ${apiURL}/budgetItem`, data);

  try {
    const response = await fetch(`${apiURL}/budgetItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server returned ${response.status}: ${errorText}`);
      throw new Error(
        `Failed to create budget item: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating budget item:", error);
    throw error;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7cf4b",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4f1f65",
    textAlign: "center",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainerGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#4f1f65",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#4f1f65",
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
  pickerError: {
    borderColor: "#FF5252",
    borderWidth: 2,
  },
  characterCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
});

export default CreateBudgetItemForm;
