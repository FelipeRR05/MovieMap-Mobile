import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useMovieDetails } from "../hooks/useMovieDetails";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ActorCard from "../components/ActorCard";
import CreatorCard from "../components/CreatorCard";
import MovieCard from "../components/MovieCard";
import Carousel from "../components/Carousel";

export default function MovieDetails({ route }) {
  const navigation = useNavigation();
  const { mediaType, movieId } = route.params;
  const { details, error } = useMovieDetails(movieId, mediaType);

  if (error) return <Text>{error}</Text>;
  if (!details) return <Text>Carregando...</Text>;

  const handlePanGesture = ({ nativeEvent }) => {
    if (nativeEvent.translationX > 50) { 
      navigation.goBack();
    }
  };

  const {
    poster_path,
    backdrop_path,
    title,
    name,
    overview,
    vote_average,
    genres,
    release_date,
    first_air_date,
    runtime,
    number_of_seasons,
    number_of_episodes,
    credits,
    recommendations,
    created_by,
    adult,
    videos,
  } = details;

  const mediaTitle = title || name;
  const releaseYear = new Date(release_date || first_air_date).getFullYear();
  const genreNames = genres?.map((genre) => genre.name).join(", ") || "N/A";
  const synopsis = overview || "Sinopse não disponível.";
  const trailer = videos?.results?.find((vid) => vid.type === "Trailer");

  const streamingProviders =
    details["watch/providers"]?.results?.BR?.flatrate || [];

  const ageRating =
    mediaType === "tv"
      ? details.content_ratings?.results?.find(
          (rating) => rating.iso_3166_1 === "BR"
        )?.rating || "L"
      : details.release_dates?.results
          ?.find((release) => release.iso_3166_1 === "BR")
          ?.release_dates?.find((release) => release.certification)
          ?.certification || (adult ? "18" : "L");

  const creatorOrDirector =
    mediaType === "tv"
      ? { ...created_by?.[0], job: "Creator" }
      : credits?.crew?.find((person) => person.job === "Director");

  return (
    <PanGestureHandler onGestureEvent={handlePanGesture}>
      <ScrollView style={styles.container}>
      <Header />
      <View style={styles.detailsContainer}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w300${poster_path}` }}
          style={styles.poster}
        />

        <View style={styles.info}>
          <Text style={styles.title}>
            {mediaTitle} <Text style={styles.year}>({releaseYear})</Text>
          </Text>

          <Text style={styles.meta}>
            <Text style={styles.ageRating}>{ageRating}</Text> •{" "}
            {mediaType === "movie" ? `${runtime} min` : `${number_of_seasons} temporadas, ${number_of_episodes} episódios`}
          </Text>

          {genreNames && <Text style={styles.genre}>Gêneros: {genreNames}</Text>}
          <Text>Sinopse: {synopsis}</Text>

          <View style={styles.actions}>
            <View style={styles.rating}>
              <Text style={styles.userRatingText}>Avaliação dos usuários:</Text>
              <View style={styles.ratingCircle}>
                <Text style={styles.ratingCircleText}>{Math.round(vote_average * 10)}%</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sidebar}>
          {streamingProviders.length > 0 ? (
            <View style={styles.streamingProviders}>
              <Text>Disponível em:</Text>
              <View style={styles.providers}>
                {streamingProviders.map((provider) => (
                  <Image
                    key={provider.provider_id}
                    source={{ uri: `https://image.tmdb.org/t/p/w45${provider.logo_path}` }}
                    style={styles.providerLogo}
                  />
                ))}
              </View>
            </View>
          ) : (
            <Text>Não disponível em streaming.</Text>
          )}

          {creatorOrDirector && <CreatorCard person={creatorOrDirector} />}
        </View>
      </View>

      <View style={styles.infosContainer}>
        {credits?.cast?.length > 0 ? (
          <Carousel title="Elenco" items={credits.cast} component={ActorCard} />
        ) : (
          <Text>Nenhum ator encontrado.</Text>
        )}
        {recommendations?.results?.length > 0 ? (
          <Carousel title="Títulos semelhantes" items={recommendations.results} component={MovieCard} />
        ) : (
          <Text>Nenhum título recomendado encontrado.</Text>
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
    alignItems: "center",
    backgroundColor: '#f8f9fa',
  },
  poster: {
    width: 300,
    height: 450,
    borderRadius: 10,
    marginBottom: 20,
  },
  info: {
    alignItems: "center",
    textAlign: "center",
    maxWidth: 600,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  year: {
    fontSize: 18,
    color: "#636363",
  },
  meta: {
    fontSize: 14,
    color: "#000",
    marginVertical: 5,
  },
  ageRating: {
    backgroundColor: "#f54242",
    padding: 4,
    borderRadius: 4,
    color: "#000",
  },
  genre: {
    fontSize: 14,
    color: "#636363",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  rating: {
    alignItems: "center",
    marginTop: 10,
  },
  ratingCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1a2585",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingCircleText: {
    color: "#fff",
  },
  userRatingText: {
    color: "#000",
    marginBottom: 5,
  },
  sidebar: {
    alignItems: "center",
  },
  streamingProviders: {
    alignItems: "center",
    marginBottom: 10,
  },
  providers: {
    flexDirection: "row",
    gap: 10,
  },
  providerLogo: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
  infosContainer: {
    padding: 10,
    backgroundColor: "#f0f5fa",
  },
});
