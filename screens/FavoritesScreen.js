import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Button } from 'react-native-paper';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // Fetch favorites from AsyncStorage when the screen loads
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  // Remove a favorite item
  const removeFavorite = async (id) => {
    try {
      const updatedFavorites = favorites.filter((item) => item.id !== id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>You have no favorite places saved!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={item.description} />
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Details', { location: item })}
                  style={styles.detailsButton}
                >
                  View Details
                </Button>
                <Button
                  mode="text"
                  onPress={() => removeFavorite(item.id)}
                  color="red"
                >
                  Remove
                </Button>
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
    backgroundColor: '#f8f8f8',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#555',
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  detailsButton: {
    margin: 5,
    backgroundColor: '#4CAF50',
  },
});
