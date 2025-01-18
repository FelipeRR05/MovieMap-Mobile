import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useUserLocation } from '../hooks/useUserLocation';
import { fetchFromApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import MovieCard from '../components/MovieCard';

export default function RegionalContent() {
  const { location, errorMsg } = useUserLocation();
  const [regionalMovies, setRegionalMovies] = useState([]);
  const [regionalTvShows, setRegionalTvShows] = useState([]);

  useEffect(() => {
    if (!location) return;

    const fetchRegionalContent = async () => {
      try {
        const latitude = location.latitude;
        const longitude = location.longitude;

        const regionCode = "BR"; 

        const movies = await fetchFromApi(
          `/discover/movie?region=${regionCode}&sort_by=popularity.desc`
        );
        const tvShows = await fetchFromApi(
          `/discover/tv?region=${regionCode}&sort_by=popularity.desc`
        );

        setRegionalMovies(movies.results || []);
        setRegionalTvShows(tvShows.results || []);
      } catch (error) {
        console.error('Erro ao buscar conteúdo regional:', error);
      }
    };

    fetchRegionalContent();
  }, [location]);

  if (errorMsg) {
    return (
      <ScrollView style={styles.container}>
        <Header />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Footer />
      </ScrollView>
    );
  }

  if (!location) {
    return (
      <ScrollView style={styles.container}>
        <Header />
        <Text style={styles.loadingText}>Obtendo localização...</Text>
        <Footer />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Popular na sua Região</Text>

        <Carousel
          title="Filmes Populares na Região"
          items={regionalMovies}
          emptyMessage="Nenhum filme encontrado na região."
          component={MovieCard}
        />

        <Carousel
          title="Séries Populares na Região"
          items={regionalTvShows}
          emptyMessage="Nenhuma série encontrada na região."
          component={MovieCard}
        />
      </View>
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
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    color: '#212529',
    textAlign: 'center',
    marginTop: 50,
  },
});
