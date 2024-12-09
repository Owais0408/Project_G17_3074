import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [recentPlaces, setRecentPlaces] = useState([]);

  useEffect(() => {
    const loadRecentPlaces = async () => {
      try {
        const storedPlaces = JSON.parse(await AsyncStorage.getItem('recentPlaces')) || [];
        console.log('Loaded Recent Places:', storedPlaces); // Debug log
        setRecentPlaces(storedPlaces);
      } catch (error) {
        console.error('Error loading recently visited places:', error);
      }
    };

    loadRecentPlaces();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recently Visited Places</Text>
      {recentPlaces.length === 0 ? (
        <Text style={styles.emptyText}>You have no recently visited places.</Text>
      ) : (
        <FlatList
          data={recentPlaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.placeItem}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#555' },
  placeItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  placeName: { fontSize: 18, fontWeight: 'bold' },
  placeDescription: { fontSize: 14, color: '#777' },
});
