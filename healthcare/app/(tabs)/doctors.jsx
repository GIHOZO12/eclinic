import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as SecureStore from 'expo-secure-store';

const Doctors = () => {
  const [userinfo, setUserinfo] = useState({});
  const [symptomText, setSymptomText] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await fetch('http://172.31.201.93:8000/api/user_info/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user info');
      }

      const data = await response.json();
      setUserinfo(data);
    } catch (error) {
      console.error('Error fetching user info:', error.message);
    }
  };

  // Fetch user location
  const fetchLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location access is required to proceed.");
      setLoading(false);
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    setLoading(false);
  };

  // Submit symptom report
  const handleSubmit = async () => {
    if (!symptomText.trim() || !location) {
      Alert.alert("Error", "Please fill in your symptoms and ensure location is available.");
      return;
    }

    const patientData = {
      user: userinfo.id,  // Use the actual user ID
      symptoms: symptomText,
      location: `${location.latitude}, ${location.longitude}`, // String format for location
    };

    try {
      const token = await SecureStore.getItemAsync('access_token'); // Retrieve token
      const response = await fetch("http://172.31.201.93:8000/api/symptomreport/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Include the token
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error response
        console.error("Error Response:", errorData);
        throw new Error("Network response was not ok");
      }

      const jsonResponse = await response.json();
      Alert.alert("Submission Successful", "Your details have been sent to a doctor.");
      console.log("Response Data:", jsonResponse);

      // Clear inputs after submission
      setSymptomText("");
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Submission Error:", error.message);
    }
  };

  // Use effect for fetching user info and location
  useEffect(() => {
    fetchUserInfo();
    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Health Report</Text>
      <Text style={styles.subText}>Fill in your details and symptoms for doctor review.</Text>

      {/* User Info Display */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="#007aff" />
        <TextInput
          style={styles.textInput}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={userinfo.username || ""}
          editable={false} // Make it read-only if not editable
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color="#007aff" />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={userinfo.email || ""}
          editable={false} // Make it read-only if not editable
        />
      </View>

      {/* Symptom Input */}
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

      {/* Location Status */}
      <View style={styles.locationContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#007aff" />
        ) : location ? (
          <Text style={styles.locationText}>
            📍 Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        ) : (
          <Text style={styles.locationText}>❌ Location not detected</Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Send to symptoms</Text>
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
  locationContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: "#555",
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

export default Doctors;