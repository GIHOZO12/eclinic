import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const _layout = () => {
  const [userInfo, setUserInfo] = useState(null);

  
  useEffect(() => {
   
    const fetchUserInfo = async () => {
      // Simulating an API call
      const user = await getUserDataFromBackend();
      setUserInfo(user);
    };

    fetchUserInfo();
  }, []);

  // Simulated backend function
  const getUserDataFromBackend = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ name: 'John Doe', email: 'john.doe@example.com' });
      }, 1000);
    });
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: '#007aff',
        headerTitle:false,
        tabBarInactiveTintColor: '#8e8e93',
        headerStyle: styles.headerStyle,
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: () => (
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={30} color="#fff" />
            {userInfo && (
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>{userInfo.name}</Text>
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
          title: 'contact',
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
