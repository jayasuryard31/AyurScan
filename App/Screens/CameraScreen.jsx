import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
export default function CameraScreen({ navigation }) {
  const db = getFirestore(app);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [plantdetail, setPlantDetail] = useState([]);
  const { user } = useUser()
  const url = 'https://us-central1-ayurscan.cloudfunctions.net/predict';

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      console.log('Internet status:', state.isConnected ? 'Connected' : 'Disconnected');
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const readFileAsBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result.replace(/^data:image\/\w+;base64,/, '');
          resolve(base64data);
        };
        reader.onerror = reject;
      });
    } catch (error) {
      console.error('Error reading image file:', error);
      throw error;
    }
  };

  const retryCount = 2; // Number of retries allowed for prediction

  const confirmImageContent = (result, callback) => {
    Alert.alert(
      'Image Confirmation',
      'Does this image contain only plants?',
      [
        { text: 'No', onPress: () => setLoading(false), style: 'cancel' },
        { text: 'Yes', onPress: () => callback(result) }
      ]
    );
  };

  const predictImage = async (result) => {
    let retries = 0;
    console.log(result.uri);
    while (retries < retryCount) {
      setLoading(true);
      try {
        const base64data = await readFileAsBase64(result.uri);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: base64data,
        });

        if (!response.ok) {
          throw new Error('Failed to predict image');
        }

        const data = await response.json();
        console.log(data); // Logging the response data

        // Query Firebase Firestore for plant details with LocalName 'Lavang'
        const querySnapshot = await query(collection(db, 'Plant Data'), where('LocalName', '==', data.class));
        const snapshot = await getDocs(querySnapshot);
        const plantDetails = [];
        snapshot.forEach((doc) => {
          plantDetails.push(doc.data());
        });

        console.log(plantDetails[0].LocalName);
        setPlantDetail(plantDetails);
        navigation.push('PlantDetail', { plantname: plantDetails[0].LocalName, plant: plantDetails[0] });
        setPrediction(data);
        uploadImage(result,plantDetails[0].LocalName)
        return; // Success, exit the loop

      } catch (error) {
        retries++;

        if (retries === retryCount) {
          Alert.alert(
            'Error',
            'Failed to predict image after multiple attempts',
            [
              { text: 'OK', onPress: () => setLoading(false) },
            ]
          );
        } else {
          setLoading(false); // Reset loading state before retry
        }
      } finally {
        setLoading(false); // Ensure loading state is reset even on error
      }
    }
  };

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
      });

      if (!result.canceled) {
        
        confirmImageContent(result.assets[0], predictImage);
      }
    } catch (error) {
      console.error('Error launching camera:', error);
    }
  };

  const uploadImage = async (image,name) => {
    try {
      setLoading(true);

      // Get current location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Upload image and location data to Firestore
      const docRef = await addDoc(collection(db, 'Camera Pics'), {
        plant:name,
        imageUrl: image.uri,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        userName: user.fullName,
        userid:user.primaryEmailAddress.emailAddress,
        userimage:user.imageUrl
      });

      console.log('Document written with ID: ', docRef.id);
      setLoading(false);
      return
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });

      if (!result.canceled) {
        confirmImageContent(result.assets[0], predictImage);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#02A76D" />
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Capture Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
            <Text style={styles.buttonText}>Pick from Gallery</Text>
          </TouchableOpacity>
          <View style={styles.button}>
            <Text style={{ color: isConnected ? 'green' : 'red' }}>
              {isConnected ? 'Connected to Internet' : 'Not Connected to Internet'}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#01B777',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#02A76D',
  },
  predictionText: {
    fontSize: 20,
    marginTop: 20,
    color: '#fff',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
