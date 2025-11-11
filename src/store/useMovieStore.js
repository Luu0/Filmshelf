import axios from "axios";
import { create } from "zustand";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "es-AR";
const API_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";
export const useMovieStore = create((set, get) => ({
  // lista de peliculas
  movies: [],
  // fpara actualizar la lista de peliculas
  setMovies: (movies) => set({ movies }),
  query: "",
  //Para actualizar la query de busqueda
  setQuery: (query) => set({ query }),
  loading: false,
  //para actualizar cuando se cargaron
  setLoading: (loading) => set({ loading }),
  err: "",
  //para actualizar el error
  setErr: (err) => set({ err }),
  background: null,
  titleMovie: null,

  //----------------------------------------------------------------------------------
  //El axios de peliculas pero tomi lacomba lo nombro fetch
  fetchTrending: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/trending/movie/week?language=${LANG}&api_key=${API_KEY}`
      );
      const movies = res.data.results || [];
      const moviesbackground = movies.filter((m) => m.backdrop_path);
      const movie =
        moviesbackground[Math.floor(Math.random() * moviesbackground.length)];
      // un seteo grande pa que se vea el poster y no la foto vertical odio esta api
      set({
        movies,
        background: movie.backdrop_path
          ? `${IMG_URL}${movie.backdrop_path}`
          : `${IMG_URL}${movie.poster_path}`,
        titleMovie: movie.title,
      });
      console.log(res.data);
    } catch (error) {
      set({ err: error.message });
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
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));
