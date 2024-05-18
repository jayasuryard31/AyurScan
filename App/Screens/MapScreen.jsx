import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const db = getFirestore(app);
  const {user} = useUser()

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Camera Pics'));
        const locationsData = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const address = await getLocationName(data.latitude, data.longitude);
          locationsData.push({
            id: doc.id,
            latitude: data.latitude,
            longitude: data.longitude,
            imageUrl: data.imageUrl,
            address,
            plant: data.plant || 'Unknown plant', // Assuming 'plant' is a field in your data
          });
        }
        setLocations(locationsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching locations: ', error);
        setLoading(false);
      }
    };

    fetchLocations();

    // Get the user's current location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  const getLocationName = async (latitude, longitude) => {
    try {
      const [location] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (location) {
        const address = `${location.street || ''}, ${location.city || ''}, ${location.region || ''}, ${location.country || ''}`;
        return address.replace(/(^[,\s]+)|([,\s]+$)/g, ''); // Remove leading/trailing commas or spaces
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Error getting location name:', error);
      return 'Unknown location';
    }
  };

  const handleMarkerPress = (location) => {
    console.log('Marker pressed:', location);
    // You can access the details of the pressed marker (location) here
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#02A76D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : (locations.length > 0 ? locations[0].latitude : 37.78825),
          longitude: userLocation ? userLocation.longitude : (locations.length > 0 ? locations[0].longitude : -122.4324),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="satellite" // Set the map type to satellite
        showsUserLocation={true} // Show the user's current location
      >
        {locations.map(location => (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Captured Location"
            onPress={() => handleMarkerPress(location)}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <View style={styles.calloutText}>
                  <Text>{location.plant}</Text>
                  <Text>{location.address}</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutContainer: {
    width: 200,
    alignItems: 'center',
  },
  calloutText: {
    marginTop: 5,
    alignItems: 'center',
  },
});
