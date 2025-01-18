import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import MovieCard from '../components/MovieCard';

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjlmMWJjZjYwZTc0Zjk4YjNkYjUxMmI5MjdlMWMxMiIsIm5iZiI6MTcyODUxNjc2OC4zNDU2ODIsInN1YiI6IjY2YTgyNjNmZTYwOTI4OTU2NzAyYjNiMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EFEL1TsENt7rXMWTdqDm7PDPVZgxu9jUt485pauRD3w";

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [tvRecommendations, setTvRecommendations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setMovieRecommendations([]);
    setTvRecommendations([]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    resetQuiz();
    setRefreshing(false);
  };

  const questions = [
    {
      question: 'Qual gênero você prefere?',
      options: [
        { label: 'Ação', id: 28 },
        { label: 'Comédia', id: 35 },
        { label: 'Drama', id: 18 },
        { label: 'Fantasia', id: 14 },
        { label: 'Terror', id: 27 },
      ],
      key: 'genre',
    },
    {
      question: 'Qual época prefere?',
      options: [
        { label: 'Anos 80', year: '1980' },
        { label: 'Anos 90', year: '1990' },
        { label: '2000s', year: '2000' },
        { label: 'Atual', year: new Date().getFullYear().toString() },
      ],
      key: 'decade',
    },
    {
      question: 'Qual tipo de enredo gosta?',
      options: ['Aventura', 'Suspense', 'Romance', 'Biográfico'],
      key: 'plot',
    },
    {
      question: 'Qual o tempo de duração preferido?',
      options: [
        { label: 'Curto (até 90 min)', maxRuntime: 90 },
        { label: 'Médio (90-120 min)', minRuntime: 90, maxRuntime: 120 },
        { label: 'Longo (mais de 120 min)', minRuntime: 120 },
      ],
      key: 'runtime',
    },
    {
      question: 'Prefere conteúdo para qual faixa etária?',
      options: ['Livre', '12+', '16+', '18+'],
      key: 'ageRating',
    },
  ];

  const handleAnswer = async (answer) => {
    const updatedAnswers = { ...answers, [questions[step].key]: answer };
    setAnswers(updatedAnswers);
    setStep(step + 1);

    if (step >= questions.length - 1) {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedAnswers));
      fetchRecommendations(updatedAnswers);
    }
  };

  const fetchRecommendations = async (preferences) => {
    const genreId = preferences.genre?.id;
    const year = preferences.decade?.year;
    const runtime = preferences.runtime || {};
    const certification = preferences.ageRating;

    const commonParams = `with_genres=${genreId}&primary_release_year=${year}&sort_by=popularity.desc&vote_average.gte=6`;
    const movieParams = `${commonParams}&with_runtime.gte=${runtime.minRuntime || ''}&with_runtime.lte=${runtime.maxRuntime || ''}`;
    const tvParams = `${commonParams}&first_air_date_year=${year}`;

    try {
      const [movieResponse, tvResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/discover/movie?${movieParams}`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        }),
        fetch(`${API_BASE_URL}/discover/tv?${tvParams}`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        }),
      ]);

      const movieData = await movieResponse.json();
      const tvData = await tvResponse.json();

      setMovieRecommendations(movieData.results);
      setTvRecommendations(tvData.results);
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
    }
  };

  useEffect(() => {
    const loadPreferences = async () => {
      const savedAnswers = await AsyncStorage.getItem('userPreferences');
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    };
    loadPreferences();
  }, []);

  if (step >= questions.length) {
    return (
      <ScrollView style={styles.container}>
        <Header />
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.recommendations}>
            <Text style={styles.title}>Recomendações para você</Text>
            <Carousel
              title="Filmes recomendados para você"
              items={movieRecommendations}
              component={MovieCard}
              emptyMessage="Nenhum filme encontrado"
            />
            <Carousel
              title="Séries recomendadas para você"
              items={tvRecommendations}
              component={MovieCard}
              emptyMessage="Nenhuma série encontrada"
            />
          </View>
        </ScrollView>
        <Footer />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.quizContainer}>
          <Text style={styles.quizTitle}>Quiz de Preferências</Text>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{questions[step].question}</Text>
            <View style={styles.optionsContainer}>
              {questions[step].options.map((option) => (
                <TouchableOpacity
                  key={option.label || option}
                  onPress={() => handleAnswer(option)}
                  style={styles.optionButton}
                >
                  <Text style={styles.optionButtonText}>{option.label || option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
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
  quizContainer: {
    padding: 20,
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
  },
  questionContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 15,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#1a2585',
    marginVertical: 5,
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  recommendations: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
  },
});
