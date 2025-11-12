import axios from "axios";
import { create } from "zustand";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "es-AR";
const API_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/";

export const useMovieStore = create((set, get) => ({
  // ESTADOS
  movies: [],
  query: "",
  loading: false,
  err: "",
  background: null,
  titleMovie: null,

  // Listas por categoría
  favorites: [],
  actionMovies: [],
  comedyMovies: [],
  horrorMovies: [],
  tvSeries: [],
  documentaries: [],

  // Estado para la vista de detalles
  selectedMovie: null,

  // ACCIONES

  // Setter para query (usado por search.jsx)
  setQuery: (query) => set({ query }),

  // FETCH PARA VISTA DE DETALLES
  fetchMovieById: async (movieId) => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/movie/${movieId}?language=${LANG}&api_key=${API_KEY}`
      );
      set({ selectedMovie: res.data });
    } catch (error) {
      console.error("Error fetching movie by ID:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  clearSelectedMovie: () => set({ selectedMovie: null }),

  // FETCH PARA HOME
  fetchTrending: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/trending/movie/week?language=${LANG}&api_key=${API_KEY}`
      );
      const movies = res.data.results || [];
      const moviesWithBackdrop = movies.filter((m) => m.backdrop_path);

      let movieToDisplay = null;
      let finalBackgroundUrl = null;

      if (moviesWithBackdrop.length > 0) {
        // 1. Preferimos una película con backdrop al azar
        movieToDisplay =
          moviesWithBackdrop[
            Math.floor(Math.random() * moviesWithBackdrop.length)
          ];
      } else if (movies.length > 0) {
        // 2. Si no hay, usamos la primera que tenga poster
        movieToDisplay = movies.find((m) => m.poster_path);
      }
      // 3. Si no hay ninguna con poster, movieToDisplay queda null

      if (movieToDisplay) {
        if (movieToDisplay.backdrop_path) {
          finalBackgroundUrl = `${IMG_BASE_URL}original${movieToDisplay.backdrop_path}`;
        } else if (movieToDisplay.poster_path) {
          finalBackgroundUrl = `${IMG_BASE_URL}original${movieToDisplay.poster_path}`;
        }

        set({
          movies,
          background: finalBackgroundUrl,
          titleMovie:
            movieToDisplay.title ||
            movieToDisplay.name ||
            "Película sin título",
        });
      } else {
        // No hay películas en el resultado
        set({ movies, background: null, titleMovie: null });
      }
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      set({ err: error.message, background: null, titleMovie: null });
    } finally {
      set({ loading: false });
    }
  },

  searchMovies: async (query) => {
    if (!query.trim()) return get().fetchTrending(); // Vuelve a trending si la búsqueda está vacía
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/search/movie?query=${encodeURIComponent(
          query
        )}&language=${LANG}&include_adult=false&api_key=${API_KEY}`
      );
      const movies = res.data.results || [];
      set({ movies }); // Actualiza la lista principal con los resultados
    } catch (error) {
      console.error("Error searching movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: (movieOrId) =>
    set((state) => {
      const id = typeof movieOrId === "object" ? movieOrId.id : movieOrId;
      const exists = state.favorites.some((f) => f.id === id);

      if (exists) {
        // Quitar de favoritos
        return { favorites: state.favorites.filter((f) => f.id !== id) };
      } else {
        // Añadir a favoritos
        let movieObj = null;
        if (typeof movieOrId === "object") {
          movieObj = movieOrId;
        } else {
          movieObj =
            state.movies.find((m) => m.id === id) ||
            state.actionMovies.find((m) => m.id === id) ||
            state.comedyMovies.find((m) => m.id === id) ||
            state.horrorMovies.find((m) => m.id === id) ||
            state.tvSeries.find((m) => m.id === id) ||
            state.documentaries.find((m) => m.id === id) ||
            { id };
        }
        return { favorites: [...state.favorites, movieObj] };
      }
    }),

  // FETCHS POR GÉNERO
  fetchActionMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=28&language=${LANG}&api_key=${API_KEY}`
      );
      set({ actionMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching action movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchComedyMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=35&language=${LANG}&api_key=${API_KEY}`
      );
      set({ comedyMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching comedy movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchHorrorMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=27&language=${LANG}&api_key=${API_KEY}`
      );
      set({ horrorMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching horror movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchTvSeries: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/tv/popular?language=${LANG}&api_key=${API_KEY}`
      );
      set({ tvSeries: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching TV series:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchDocumentaries: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=99&language=${LANG}&api_key=${API_KEY}`
      );
      set({ documentaries: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching documentaries:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));