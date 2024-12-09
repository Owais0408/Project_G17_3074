import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_API_KEY = 'AIzaSyDY4Y_piOosgWQNKtUsYjB1QjLNwncfN-M'; // Replace with your key

export default function HomeScreen({ navigation }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=43.651070,-79.347015&radius=2000&type=point_of_interest&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();

        if (data.results) {
          const formattedData = data.results.map((item) => ({
            id: item.place_id,
            name: item.name,
            description: item.vicinity || 'No description available',
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
            photoUrl: item.photos
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
              : null,
          }));
          setLocations(formattedData);
        }
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const saveToFavorites = async (location) => {
    try {
      const existingFavorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
      const updatedFavorites = [...existingFavorites, location];
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert(`${location.name} added to favorites!`);
    } catch (error) {
      console.error('Error saving to favorites:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommended Places</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              {item.photoUrl && <Card.Cover source={{ uri: item.photoUrl }} />}
              <Card.Title title={item.name} subtitle={item.description} />
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Details', { location: item })}
                  style={styles.button}
                >
                  Details
                </Button>
                <IconButton icon="heart-outline" color="red" onPress={() => saveToFavorites(item)} />
              </Card.Actions>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#4CAF50',
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  button: {
    margin: 5,
    backgroundColor: '#4CAF50',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});
