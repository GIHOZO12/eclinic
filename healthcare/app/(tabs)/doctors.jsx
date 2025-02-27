import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const doctorsList = [
  {
    id: '1',
    name: 'Dr. Alice Smith',
    specialty: 'Cardiologist',
    // image: require('../assets/doctors/doctor1.jpg'), // Ensure images exist in the correct path
    available: true,
  },
  {
    id: '2',
    name: 'Dr. John Doe',
    specialty: 'Dermatologist',
    // image: require('../assets/doctors/doctor2.jpg'),
    available: false,
  },
  {
    id: '3',
    name: 'Dr. Emily Johnson',
    specialty: 'Pediatrician',
    // image: require('../assets/doctors/doctor3.jpg'),
    available: true,
  },
];

const Doctors = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meet Our Doctors</Text>
      <FlatList
        data={doctorsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* <Image source={item.image} style={styles.image} /> */}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
            <Text style={[styles.availability, item.available ? styles.available : styles.unavailable]}>
              {item.available ? 'Available' : 'Not Available'}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f8fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    alignItems: 'center',
  },
  card: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 16,
    color: '#6b7280',
  },
  availability: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  available: {
    color: '#28a745', // Green color
  },
  unavailable: {
    color: '#dc3545', // Red color
  },
});

export default Doctors;
