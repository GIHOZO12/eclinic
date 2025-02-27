import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Animation setup
  const scaleAnim = useRef(new Animated.Value(0)).current; // Start at 0 scale

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1, // Zoom in to normal size
      duration: 1500, // Animation duration (1.5 sec)
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGetStarted = () => {
    setLoading(true);
    setTimeout(() => {
      router.replace('/login');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animated.Image
        source={require('../assets/images/project/clinic.jpg')} // Ensure the image exists in this path
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />
      
      {/* Main Title */}
      <Text style={styles.title}>Welcome to E-Clinic AI</Text>
      
      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Enter your symptoms and let our AI-powered system suggest potential conditions.
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Continue" color="#007BFF" onPress={handleGetStarted} />
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
    backgroundColor: '#f4f8fc',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 30,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  button: {
    marginBottom: 15,
  },
});

export default WelcomeScreen;
