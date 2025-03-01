import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Symptoms = () => {
  const [symptomText, setSymptomText] = useState("");

  const analyzeDisease = async () => {
    if (!symptomText) {
      Alert.alert("Error", "Please enter your symptoms.");
      return;
    }
  
    try {
      const symptomsToSend = symptomText.split(",").map(s => s.trim()); // Ensure symptoms are sent as a list
      console.log("Sending Symptoms:", symptomsToSend); // Debugging log
  
      const response = await fetch("http://10.224.110.245:8000/api/analyze_disease/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomsToSend }),  // Send as a list
      });
  
      const data = await response.json();
      console.log("Response from API:", data); // Debugging log
  
      if (response.ok) {
        Alert.alert("AI Prediction", `Possible  condition is: ${data.predicted_disease}`);
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Describe Your Symptoms</Text>
      <Text style={styles.subText}>Enter how you feel, and AI will analyze your condition.</Text>

      {/* Symptom Text Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="create-outline" size={24} color="#007aff" />
        <TextInput
          style={styles.textInput}
          placeholder="Describe your symptoms..."
          placeholderTextColor="#888"
          multiline
          value={symptomText}
          onChangeText={setSymptomText}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={analyzeDisease}>
        <Text style={styles.submitText}>Analyze Symptoms</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Symptoms;
