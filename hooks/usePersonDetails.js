import { useState, useEffect } from "react";
import { fetchFromApi } from "../services/api";

export function usePersonDetails(personId) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const data = await fetchFromApi(
          `/person/${personId}?language=pt-BR&append_to_response=movie_credits,tv_credits`
        );
        setDetails(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da pessoa:", error);
        setError("Erro ao buscar detalhes da pessoa.");
      }
    };

    if (personId) {
      fetchPersonDetails();
    }
  }, [personId]);

  return { details, error };
}
