import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, 
  KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window'); // Get screen width

const ContactForm = () => {
  const [userInfo, setUserInfo] = useState({});
  const [message, setMessage] = useState('');

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token'); 
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await fetch('http://10.224.110.245:8000/api/user_info/', {
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
      setUserInfo(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Function to send data
  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message.");
      return;
    }

    const sendData = {
      receipients: [userInfo.id],  // Sending the current user's ID
      message: message,
    };

    try {
      const token = await SecureStore.getItemAsync('access_token'); 
      if (!token) {
        Alert.alert('Error', 'No access token found');
        return;
      }

      const submitData = await fetch("http://10.224.110.245:8000/api/notifications/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });

      if (!submitData.ok) {
        const errorData = await submitData.json();
        throw new Error(errorData.error || 'Failed to submit message');
      }

      const data = await submitData.json();
      console.log(data);
      setMessage('');
      Alert.alert('Success', 'Your message has been sent successfully');
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', 'Failed to submit message');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.description}>
          Tell us about the challenges you face and what we can improve!
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#888"
          value={userInfo.username || ''} // Display username
          editable={false} // Make read-only if not editable
        />
        
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={userInfo.email || ''} // Display email
          editable={false} // Make read-only if not editable
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Your Message"
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: width * 0.9,
    maxWidth: 450,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContactForm;