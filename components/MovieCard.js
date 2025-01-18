import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getDetails } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigation } from '@react-navigation/native';

export default function MovieCard({
  movieId,
  mediaType = "movie",
  onFavoriteChange,
}) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites(movieId, mediaType);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setError(null);
        const details = await getDetails(movieId, mediaType);
        setMovieDetails(details);
      } catch (error) {
        if (error.message.includes("404")) {
          const fallbackType = mediaType === "movie" ? "tv" : "movie";
          const details = await getDetails(movieId, fallbackType);
          setMovieDetails(details);
        } else {
          setError(error.message);
        }
      }
    };

    if (movieId) fetchMovieDetails();
  }, [movieId, mediaType]);

  if (!movieDetails) return <Text>Carregando...</Text>;

  const {
    poster_path,
    title,
    name,
    vote_average,
    release_date,
    first_air_date,
    genres,
  } = movieDetails;

  const mediaTitle = title || name;
  const releaseYear = new Date(release_date || first_air_date).getFullYear();
  const primaryGenre = genres?.length > 0 ? genres[0].name : "Sem gênero";
  const rating = Math.round(vote_average * 10);

  const handleCardClick = () => {
    navigation.navigate('MovieDetails', { mediaType, movieId });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardClick}>
      <View style={styles.imageContainer}>
        {!poster_path ? (
          <View style={styles.placeholder}>
            <Icon name="image" size={48} color="#888" />
          </View>
        ) : (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w200${poster_path}` }}
            style={styles.image}
          />
        )}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          style={styles.favoriteButton}
        >
          <Icon name={isFavorite ? "check" : "plus"} size={14} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{mediaTitle}</Text>
        <Text style={styles.genre}>{primaryGenre} - {releaseYear}</Text>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{rating}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'relative',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 4,
  },
  rating: {
    position: 'absolute',
    top: -14,
    left: 5,
    backgroundColor: '#1a2585',
    borderRadius: 50,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  ratingText: {
    color: '#f8f9fa',
    fontWeight: 'bold',
    fontSize: 8,
  },
  info: {
    alignItems: 'center',
    paddingTop: 4,
  },
  title: {
    paddingTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  genre: {
    fontSize: 11,
    color: '#666',
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
