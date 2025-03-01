import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window'); // Get screen width for responsiveness

const ResultsInfo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.description}>
        Your latest results and insights will appear here.
      </Text>
    </View>
  );
};

export default ResultsInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%', // Responsive width
    maxWidth: 500, // Prevents it from being too wide on large screens
    // backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 4,
    alignSelf: 'center', // Keeps it centered on all screen sizes
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
