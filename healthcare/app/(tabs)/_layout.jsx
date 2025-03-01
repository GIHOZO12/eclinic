import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const _layout = () => {
  const [userInfo, setUserInfo] = useState(null);
  const router=useRouter()

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

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: '#007aff',
        headerTitle: false,
        tabBarInactiveTintColor: '#8e8e93',
        headerStyle: styles.headerStyle,
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: () => (
          <TouchableOpacity style={styles.profileButton} onPress={()=>router.push('contact')}>
            <Ionicons name="person-circle-outline" size={30} color="#fff" />
            {userInfo && (
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>{userInfo.username}</Text>
              </View>
            )}
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="symptoms"
        options={{
          title: 'Symptoms',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{
          title: 'doctors',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color, size }) => <Ionicons name="mail-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    paddingBottom: 5,
    height: 60,
  },
  headerStyle: {
    backgroundColor: '#007aff',
    height: 80,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  profileTextContainer: {
    marginLeft: 5,
    flexDirection: 'column',
  },
  profileName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default _layout;
