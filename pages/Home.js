import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import Carousel from '../components/Carousel'; 
import { useFetchMedia } from '../hooks/useFetchMedia';

export default function Home() {
  const { movies, tvShows } = useFetchMedia();

  return (
    <ScrollView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.catalog}>
          <Text style={styles.heading}>Catálogo de Filmes</Text>
          
          <Carousel
            title="Top 10 Filmes"
            items={movies.topRated}
            component={MovieCard}
          />

          <Carousel
            title="Filmes em Alta"
            items={movies.popular}
            component={MovieCard}
          />

          <Text style={styles.heading}>Catálogo de Séries</Text>
          
          <Carousel
            title="Top 10 Séries"
            items={tvShows.topRated}
            component={MovieCard}
          />

          <Carousel
            title="Séries em Alta"
            items={tvShows.popular}
            component={MovieCard}
          />
        </View>
      </ScrollView>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingVertical: 20,  
  },
  catalog: {
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#212529',
  },
});