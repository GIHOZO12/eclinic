import { View, Text, FlatList, TouchableOpacity, StyleSheet,Image, Dimensions, ScrollView } from 'react-native';
import React, { useState,useEffect } from 'react';
import { profile } from '../../components/user_info';
import ContactForm from '../profile_info';
import ResultsInfo from '../results';
import Edit_profille from '../edit_profille';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const Contact = () => {
  const [activeId, setActiveId] = useState(null);
  const [data, setData] = useState(null);
  const [userInfo, setUserInfo] = useState({});






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





  const handleData = (selectedItem) => {
    console.log('Selected Item:', selectedItem); // Debugging
    if (selectedItem === 'yourdata') {
      setData(<ResultsInfo />);
    } else if (selectedItem === 'contact') {
      setData(<ContactForm />);
    }
    else if (selectedItem === 'edit profile') {
      setData(<Edit_profille />);
    }
    
  };

  return (
    <View style={styles.container}>
      <View style={{}}>
      <Image source='' alt='Profile Image' style={styles.profileImage} />
      <Text style={styles.header}>{userInfo.username}</Text>
     
      </View>

      {/* Scrollable Horizontal List (Always Visible) */}
      <FlatList
        data={profile}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer} 
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              console.log('Item pressed:', item.title); // Debugging
              setActiveId(item.id); 
              handleData(item.title.toLowerCase());
            }}
            style={styles.itemWrapper}
          >
            <View style={styles.itemContainer}>
              <Text style={[styles.itemText, activeId === item.id && styles.activeText]}>
                {item.title}
              </Text>
              {activeId === item.id && <View style={styles.activeIndicator} />}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Dynamic Content (Below Titles) */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {data}
      </ScrollView>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
      margin:20
   },
  itemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: width * 0.3, 
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#007aff',
  },
   activeIndicator: {
    marginTop: 5,
    height: 3,
    width: '80%',
    backgroundColor: '#007aff',
    alignSelf: 'center',
    borderRadius: 2,
  },
  
});