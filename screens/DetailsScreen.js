import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailsScreen({ route }) {
  const { location } = route.params;

  useEffect(() => {
    const saveToRecentPlaces = async () => {
      try {
        // Get existing places
        const storedPlaces = JSON.parse(await AsyncStorage.getItem('recentPlaces')) || [];
        console.log('Existing Places:', storedPlaces); // Debug log

        // Add the new place and keep the last 10
        const updatedPlaces = [...storedPlaces, location].slice(-10);
        await AsyncStorage.setItem('recentPlaces', JSON.stringify(updatedPlaces));
        console.log('Updated Places:', updatedPlaces); // Debug log
      } catch (error) {
        console.error('Error saving recently visited places:', error);
      }
    };

    saveToRecentPlaces();
  }, [location]);

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    Linking.openURL(url).catch((err) => console.error('Error opening maps:', err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{location.name}</Text>
      <Text style={styles.description}>{location.description}</Text>
      <Button title="Open in Google Maps" onPress={openInMaps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', marginBottom: 20 },
});
