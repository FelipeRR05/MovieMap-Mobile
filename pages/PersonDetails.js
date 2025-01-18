import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { usePersonDetails } from '../hooks/usePersonDetails';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import MovieCard from '../components/MovieCard';

export default function PersonDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { details, error } = usePersonDetails(id);

  if (error) return <Text>{error}</Text>;
  if (!details) return <Text>Carregando...</Text>;

  const handlePanGesture = ({ nativeEvent }) => {
    if (nativeEvent.translationX > 50) {  // Deslizar 50px para direita
      navigation.goBack();
    }
  };

  const {
    profile_path,
    name,
    biography,
    birthday,
    deathday,
    gender,
    place_of_birth,
    movie_credits,
    tv_credits,
  } = details;

  const genderText = gender === 1 ? 'Feminino' : 'Masculino';
  const age = birthday ? new Date().getFullYear() - new Date(birthday).getFullYear() : 'N/D';

  return (
    <PanGestureHandler onGestureEvent={handlePanGesture}>
    <ScrollView style={styles.container}>
      <Header />


      <View style={styles.detailsContainer}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w300${profile_path}` }}
          style={styles.poster}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.biography}>
            <Text style={styles.boldText}>Biografia: </Text>
            {biography || 'Biografia não disponível.'}
          </Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            <Text style={styles.boldText}>Idade: </Text>{age} anos
          </Text>
          <Text style={styles.metaText}>
            <Text style={styles.boldText}>Gênero: </Text>{genderText}
          </Text>
          <Text style={styles.metaText}>
            <Text style={styles.boldText}>Aniversário: </Text>{birthday || 'N/D'}
          </Text>
          {deathday && (
            <Text style={styles.metaText}>
              <Text style={styles.boldText}>Falecimento: </Text>{deathday}
            </Text>
          )}
          <Text style={styles.metaText}>
            <Text style={styles.boldText}>Local de Nascimento: </Text>{place_of_birth || 'N/D'}
          </Text>
        </View>
      </View>

      <View style={styles.creditsContainer}>
        {movie_credits?.cast?.length > 0 && (
          <Carousel
            title="Filmes que participou"
            items={movie_credits.cast}
            component={MovieCard}
          />
        )}
        {tv_credits?.cast?.length > 0 && (
          <Carousel
            title="Séries que participou"
            items={tv_credits.cast}
            component={MovieCard}
          />
        )}
      </View>

      <Footer />
    </ScrollView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  detailsContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  poster: {
    width: 300,
    height: 450,
    borderRadius: 10,
    marginBottom: 20,
  },
  info: {
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 600,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  biography: {
    marginTop: 10,
    color: '#000',
    textAlign: 'center',
    lineHeight: 20,
  },
  meta: {
    marginTop: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  metaText: {
    alignItems: 'center',
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
    marginVertical: 2,
  },
  boldText: {
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  creditsContainer: {
    padding: 10,
    backgroundColor: "#f0f5fa",
  },
});
