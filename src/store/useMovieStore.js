import axios from "axios";
import { create } from "zustand";
// 1. IMPORTA TUS FUNCIONES DE AUTENTICACIÓN
import { signIn, signOut, getSelf } from "../services/auth";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "es-AR";
const API_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/";

export const useMovieStore = create((set, get) => ({
  // --- ESTADOS DE PELÍCULAS ---
  movies: [],
  query: "",
  loading: false, // Loading general para auth y fetches
  err: "",
  background: null,
  titleMovie: null,
  bannerMovieId: null, // ID de la peli en el banner
  favorites: [],
  actionMovies: [],
  comedyMovies: [],
  horrorMovies: [],
  popularMovies: [],
  adventureMovies: [],
  tvSeries: [],
  actionSeries: [],
  comedySeries: [],
  horrorSeries: [],
  documentaries: [],
  selectedMovie: null,

  // --- ESTADOS DE AUTENTICACIÓN ---
  isAuthenticated: false,
  isAuthLoading: true, // Para saber si la app está verificando el auth inicial
  user: null, // Para guardar los datos del usuario logueado

  // --- ACCIONES DE AUTENTICACIÓN ---
  checkLoginStatus: async () => {
    set({ isAuthLoading: true });
    try {
      const user = await getSelf(); // Llama a tu API (/me)
      // Si tiene éxito, guarda al usuario y marca como autenticado
      set({ isAuthenticated: true, user: user, isAuthLoading: false });
    } catch (e) {
      // Si falla (error 401), no está logueado
      set({ isAuthenticated: false, user: null, isAuthLoading: false });
    }
  },

  login: async (credentials) => {
    set({ loading: true, err: "" });
    try {
      const res = await signIn(credentials); // Llama a /login
      // Guardamos el usuario que devuelve el login
      set({ isAuthenticated: true, user: res.user, loading: false });
      return res; // Devuelve la respuesta
    } catch (error) {
      set({ loading: false, err: "Invalid email or password", user: null });
      throw error; // Lanza el error para que el componente Login lo atrape
    }
  },

  logout: async () => {
    try {
      await signOut(); // Llama a /logout
      // Limpiamos el usuario al salir
      set({ isAuthenticated: false, user: null, favorites: [] });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },

  // --- ACCIONES DE PELÍCULAS ---

  setQuery: (query) => set({ query }),

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
        movieToDisplay =
          moviesWithBackdrop[
            Math.floor(Math.random() * moviesWithBackdrop.length)
          ];
      } else if (movies.length > 0) {
        movieToDisplay = movies.find((m) => m.poster_path);
      }

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
          bannerMovieId: movieToDisplay.id,
        });
      } else {
        set({ movies, background: null, titleMovie: null, bannerMovieId: null });
      }
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      set({ err: error.message, background: null, titleMovie: null });
    } finally {
      set({ loading: false });
    }
  },

  searchMovies: async (query) => {
    if (!query.trim()) return get().fetchTrending();
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/search/movie?query=${encodeURIComponent(
          query
        )}&language=${LANG}&include_adult=false&api_key=${API_KEY}`
      );
      const movies = res.data.results || [];
      set({ movies });
    } catch (error) {
      console.error("Error searching movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // --- FUNCIÓN toggleFavorite (CON EL ALERT) ---
  toggleFavorite: (movieOrId) => {
    const isAuthenticated = get().isAuthenticated;

    if (!isAuthenticated) {
      // --- ¡AQUÍ ESTÁ TU CAMBIO! ---
      alert("Debes estar logueado para añadir películas a favoritos.");
      return;
      // --- FIN DEL CAMBIO ---
    }

    // El resto de tu lógica (solo se ejecuta si está logueado)
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
    });
  },

  // --- FETCHS POR GÉNERO ---
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

  fetchPopularMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/movie/popular?language=${LANG}&api_key=${API_KEY}`
      );
      set({ popularMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchAdventureMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=12&language=${LANG}&api_key=${API_KEY}`
      );
      set({ adventureMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching adventure movies:", error);
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

  fetchActionSeries: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/tv?with_genres=10759&language=${LANG}&api_key=${API_KEY}`
      );
      set({ actionSeries: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching action series:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchComedySeries: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/tv?with_genres=35&language=${LANG}&api_key=${API_KEY}`
      );
      set({ comedySeries: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching comedy series:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchHorrorSeries: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/tv?with_genres=80&language=${LANG}&api_key=${API_KEY}`
      );
      set({ horrorSeries: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching horror series:", error);
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