import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import MovieCard from '../components/MovieCard';

const getStoredFavorites = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : { movies: [], tvShows: [] };
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    return { movies: [], tvShows: [] };
  }
};

export default function Favorites() {
  const [favorites, setFavorites] = useState({ movies: [], tvShows: [] });
  const [refreshing, setRefreshing] = useState(false);

  const updateFavorites = async () => {
    const storedFavorites = await getStoredFavorites();
    setFavorites(storedFavorites);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await updateFavorites();
    setRefreshing(false);
  };

  useEffect(() => {
    updateFavorites();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Header />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Meus Favoritos</Text>

        <Carousel
          title="Filmes Favoritos"
          items={favorites.movies}
          emptyMessage="Nenhum filme favorito."
          onFavoriteChange={updateFavorites}
          component={MovieCard}
        />

        <Carousel
          title="Séries Favoritas"
          items={favorites.tvShows}
          emptyMessage="Nenhuma série favorita."
          onFavoriteChange={updateFavorites}
          component={MovieCard}
        />
      </ScrollView>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 10,
  },
});
