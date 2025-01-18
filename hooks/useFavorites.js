import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useFavorites(id, mediaType) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState({ movies: [], tvShows: [] });

  useEffect(() => {
    const fetchFavorites = async () => {
      const stored = await AsyncStorage.getItem('favorites');
      setFavorites(stored ? JSON.parse(stored) : { movies: [], tvShows: [] });
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    const type = mediaType === 'movie' ? 'movies' : 'tvShows';
    const exists = favorites[type].some((item) => item.id === id);
    setIsFavorite(exists);
  }, [favorites, id, mediaType]);

  const toggleFavorite = async () => {
    const type = mediaType === 'movie' ? 'movies' : 'tvShows';
    const updatedFavorites = { ...favorites };

    if (isFavorite) {
      updatedFavorites[type] = updatedFavorites[type].filter((item) => item.id !== id);
    } else {
      updatedFavorites[type].push({ id, media_type: mediaType });
    }

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);

    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return { isFavorite, toggleFavorite };
}
