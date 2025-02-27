import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router'; // Use expo-router for navigation

const { width, height } = Dimensions.get('window'); // Get the window size to make it responsive

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Using expo-router's useRouter hook

  const handleLogin = () => {
    setLoading(true);

    
    setTimeout(() => {
        router.replace('/(tabs)'); // Navigate to the tabs layout (correct path)
    }, 1000);
  };

  const handleForgotPassword = () => {
    // Navigate to the forgot password screen
    router.push('forgotPassword'); // You should have a `forgotPassword.js` file in your routes
  };

  const handleSignUp = () => {
    // Navigate to the signup page
    router.push('signup'); // You should have a `signup.js` file in your routes
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back to E-Clinic AI</Text>

      <View style={styles.formContainer}>
        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#7a7a7a"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7a7a7a"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Login'}
          </Text>
        </TouchableOpacity>

        {/* Loading Text */}
        {loading && <Text style={styles.loadingText}>Please wait...</Text>}

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign Up Section */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            New to the app?{' '}
            <Text style={styles.signupLink} onPress={handleSignUp}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f8fc', // Light background color for a clean look
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 30,
    textAlign: 'center',
    width: '80%',
    lineHeight: 32,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400, // Limit max width to avoid stretching too much on larger screens
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow effect
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc', // Gray out the button when loading
  },
  loadingText: {
    fontSize: 16,
    color: '#007BFF',
    marginTop: 20,
    textAlign: 'center',
  },
  forgotPassword: {
    fontSize: 16,
    color: '#007BFF',
    marginTop: 10,
    textAlign: 'center',
  },
  signupContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginPage;
