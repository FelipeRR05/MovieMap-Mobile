import { useState, useEffect } from "react";
import { DeviceEventEmitter } from "react-native"; // Import DeviceEventEmitter
import { fetchFromApi } from "../services/api";

export const useFetchMedia = () => {
  const [movies, setMovies] = useState({ topRated: [], popular: [] });
  const [tvShows, setTvShows] = useState({ topRated: [], popular: [] });

  const fetchMovies = async () => {
    try {
      const [topRatedData, popularData] = await Promise.all([
        fetchFromApi("/movie/top_rated?language=pt-BR"),
        fetchFromApi("/trending/movie/week?language=pt-BR"),
      ]);
      setMovies({
        topRated: topRatedData?.results?.slice(0, 10) || [],
        popular: popularData?.results?.slice(0, 30) || [],
      });
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  const fetchTvShows = async () => {
    try {
      const [topRatedData, popularData] = await Promise.all([
        fetchFromApi("/tv/top_rated?language=pt-BR"),
        fetchFromApi("/trending/tv/week?language=pt-BR"),
      ]);
      setTvShows({
        topRated: topRatedData?.results?.slice(0, 10) || [],
        popular: popularData?.results?.slice(0, 30) || [],
      });
    } catch (error) {
      console.error("Erro ao buscar séries:", error);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchMovies();
    fetchTvShows();

    // Event listener for custom 'favoritesUpdated' event
    const handleFavoritesUpdated = () => {
      fetchMovies();
      fetchTvShows();
    };

    // Subscribe to the 'favoritesUpdated' event using DeviceEventEmitter
    const subscription = DeviceEventEmitter.addListener("favoritesUpdated", handleFavoritesUpdated);

    // Cleanup the listener on component unmount
    return () => {
      subscription.remove();
    };
  }, []);

  return { movies, tvShows };
};
