import { useState, useEffect } from "react";
import { getDetails } from "../services/api";

export function useMovieDetails(id, mediaType) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchDetails = async () => {
        try {
          setError(null);
          const data = await getDetails(id, mediaType);
          setDetails(data);
        } catch (err) {
          if (err.message.includes("404")) {
            // Retry with alternate media type
            const fallbackType = mediaType === "movie" ? "tv" : "movie";
            try {
              const fallbackData = await getDetails(id, fallbackType);
              setDetails(fallbackData);
            } catch (fallbackError) {
              console.error("Erro ao buscar detalhes com tipo alternativo:", fallbackError);
              setError("Erro ao carregar os detalhes.");
            }
          } else {
            console.error("Erro ao buscar detalhes:", err);
            setError("Erro ao carregar os detalhes.");
          }
        }
      };
    fetchDetails();
  }, [id, mediaType]);

  return { details, error };
}
