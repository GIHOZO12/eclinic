import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import clinic from '../../assets/images/project/clinic.jpg';

const BASE_URL = 'http://10.224.110.245:8000'; // Your API base URL

const Index = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/home/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Fetched data:', result); // Log the fetched data
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to the AI based e-Clinic</Text>
      {/* <Image source={clinic} style={styles.image} />
      <Text style={{ margin: 20 }}>Get good health and easy access to medical services</Text> */}

      {data.map((item) => {
        const imageUrl = item.image; // Use the full URL directly from the API response
        console.log('Image URL:', imageUrl); // Log the full image URL

        return (
          <View key={item.id} style={styles.dataContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.dataImage}
              onError={() => console.log('Image failed to load:', imageUrl)}
            />
            <Text style={styles.dataTitle}>{item.title}</Text>
            
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    // backgroundColor: '#fff',
    borderRadius: 8,
    // shadowColor: '#000',
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // elevation: 3,
    alignItems: 'center', // Center items in the data container
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  dataImage: {
    width: '100%', // Makes it responsive
    height: 200, // Adjust based on your preference
    resizeMode: 'cover',
    borderRadius: 10, // Adds rounded corners
  },
});

export default Index;