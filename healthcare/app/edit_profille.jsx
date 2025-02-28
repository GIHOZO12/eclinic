import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image 
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import * as ImagePicker from 'expo-image-picker';
  import * as SecureStore from 'expo-secure-store';
  
  const { width } = Dimensions.get('window');
  
  const EditProfile = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null);
  
    useEffect(() => {
      fetchUserData(); // Fetch current user data on component mount
    }, []);
  
    const fetchUserData = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      const response = await fetch('http://172.31.201.93:8000/api/user_info/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username || '');
        setEmail(data.email || '');
        setFirstName(data.name || '');
        setLastName(data.last_name || '');
        setPhoneNumber(data.phone_number || '');
        setProfileImage(data.profile_pic || null); // Set existing image or null
      } else {
        alert('Error fetching user data: ' + response.status);
      }
    };
  
    const handleImagePicker = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync();
  
      if (!result.cancelled) {
        setProfileImage(result.uri); // Set the selected image URI
      }
    };
  
    const handleSave = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('name', name);
      formData.append('last_name', lastName);
      formData.append('phone_number', phoneNumber);
      
      if (profileImage) {
        formData.append('profile_pic', {
          uri: profileImage,
          type: 'image/jpeg', // Adjust based on the image type
          name: 'profile.jpg', // Adjust as needed
        });
      }
  
      const response = await fetch('http://172.31.201.93:8000/api/update_profile/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Error updating profile: ' + JSON.stringify(errorData));
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
        
        <TouchableOpacity onPress={handleImagePicker} style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.imagePlaceholder}>Upload Profile Picture</Text>
          )}
        </TouchableOpacity>
  
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
  
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={name}
          onChangeText={setName}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
  
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default EditProfile;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f2f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
    imageContainer: {
      width: width * 0.3,
      height: width * 0.3,
      borderRadius: width * 0.15,
      backgroundColor: '#e0e0e0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      alignSelf: 'center',
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: width * 0.15,
    },
    imagePlaceholder: {
      color: '#888',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 14,
      marginBottom: 12,
      fontSize: 16,
      borderColor: '#ddd',
      borderWidth: 1,
    },
    button: {
      backgroundColor: '#007bff',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });