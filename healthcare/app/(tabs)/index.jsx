import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import clinic from '../../assets/images/project/clinic.jpg';

const Index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the AI based  e-Clinic</Text>
      <Image source={clinic} style={styles.image} />
      <Text style={{margin:20,}}> Get good health and easy acces to medical services </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  image: {
    width: '100%', // Makes it responsive
    height: 200, // Adjust based on your preference
    resizeMode: 'cover',
    borderRadius: 10, // Adds rounded corners
  },
});

export default Index;
