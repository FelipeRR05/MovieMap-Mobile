const API_BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjlmMWJjZjYwZTc0Zjk4YjNkYjUxMmI5MjdlMWMxMiIsIm5iZiI6MTcyODUxNjc2OC4zNDU2ODIsInN1YiI6IjY2YTgyNjNmZTYwOTI4OTU2NzAyYjNiMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EFEL1TsENt7rXMWTdqDm7PDPVZgxu9jUt485pauRD3w";

export const fetchFromApi = async (endpoint, method = "GET", body = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API:", errorData);
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição à API:", error);
    throw error;
  }
};

export const getDetails = async (id, type = "movie") => {
  const endpoint = `/${type}/${id}?language=pt-BR&append_to_response=credits,videos,recommendations,watch/providers,release_dates,content_ratings,translations`;
  return await fetchFromApi(endpoint);
};

export const searchMulti = async (query) => {
  const endpoint = `/search/multi?language=pt-BR&query=${query}&include_adult=false`;
  return await fetchFromApi(endpoint);
};
