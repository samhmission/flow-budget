import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

function ActiveBudgetCard({}: {}) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>Category 1 --- $ category total ↑</Text>
      <Text style={styles.subTitle}>Item 1 ↓</Text>
      <Text style={styles.subTitle}>Item 2 ↓</Text>
      <Text style={styles.subTitle}>Item 3 ↓</Text>
      <Text style={styles.subTitle}>Item 4 ↓</Text>
      <Text style={styles.title}>Category 2 --- $ category total ↑</Text>
      <Text style={styles.subTitle}>Item 1 ↓</Text>
      <Text style={styles.subTitle}>Item 2 ↓</Text>
      <Text style={styles.subTitle}>Item 3 ↓</Text>
      <Text style={styles.subTitle}>Item 4 ↓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 16,
  },
  amount: {
    fontSize: 24,
    color: "#28a745",
    marginBottom: 16,
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

export default ActiveBudgetCard;
