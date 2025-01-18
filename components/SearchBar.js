import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MovieCard from '../components/MovieCard';  CreatorCard
import ActorCard from '../components/ActorCard';
import CreatorCard from '../components/CreatorCard';
import { searchMulti } from '../services/api'; 

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState(false);

  const handleSearch = async (searchQuery) => {
    try {
      const data = await searchMulti(searchQuery);
      setResults(data.results);
      setSuggestions([]);
      setNoResultsMessage(data.results.length === 0);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const data = await searchMulti(query);
          const suggestionsResults = data.results.slice(0, 20);
          setSuggestions(suggestionsResults);
          setNoResultsMessage(suggestionsResults.length === 0);
        } catch (error) {
          console.error('Erro ao buscar sugestões:', error);
        }
      } else {
        setSuggestions([]);
        setNoResultsMessage(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setNoResultsMessage(false);
  };

  const handleSuggestionClick = (suggestion) => {
    const searchQuery = suggestion.title || suggestion.name;
    setQuery(searchQuery);
    handleSearch(searchQuery);
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar filmes, séries, atores..."
          placeholderTextColor="#999"
        />
        {query ? (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <FontAwesome name="times" size={20} color="#212529" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={() => handleSearch(query)} style={styles.searchButton}>
          <FontAwesome name="search" size={20} color="#f8f9fa" />
        </TouchableOpacity>
      </View>

      {suggestions.length > 0 && (
        <FlatList
          style={styles.suggestions}
          data={suggestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionClick(item)} style={styles.suggestionItem}>
              <Text>{item.title || item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {results.length > 0 ? (
        <View style={styles.results}>
          {results.map((result) => {
            if (result.media_type === 'movie' || result.media_type === 'tv') {
              return <MovieCard key={result.id} movieId={result.id} mediaType={result.media_type} />;
            } else if (result.media_type === 'person') {
              const isDirector = result.known_for_department === 'Directing';
              return isDirector ? (
                <CreatorCard key={result.id} person={result} />
              ) : (
                <ActorCard key={result.id} actor={result} />
              );
            }
            return null;
          })}
        </View>
      ) : (
        query &&
        noResultsMessage && (
          <Text style={styles.noResultsText}>Nenhum resultado encontrado no catálogo</Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#f8f9fa',
    color: '#212529',
    padding: 20,
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#212529',
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#1a2585',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestions: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  results: {
    width: '100%',
    marginTop: 15,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  noResultsText: {
    marginTop: 15,
    color: '#212529',
    fontSize: 16,
  },
  clearButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
