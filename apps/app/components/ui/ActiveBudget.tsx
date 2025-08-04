import Constants from "expo-constants";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

import ActiveBudgetCard from "@/components/ui/ActiveBudgetCard";

function ActiveBudget({}: {}) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.label}>Monthly Budget total:</Text>
        <Text style={styles.amount}>$6,000</Text>
      </View>
      <ActiveBudgetCard />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amount: {
    fontSize: 24,
    color: "#28a745",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default ActiveBudget;
