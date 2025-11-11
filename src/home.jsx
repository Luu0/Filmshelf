import React, { useEffect, useState } from "react";
import axios from "axios";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "es-AR";
const API_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [titleMovie, setTitleMovie] = useState(null);
  const [background, setBackground] = useState(null);

  async function fetchTrending() {
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(
        `${API_URL}/trending/movie/week?language=${LANG}&api_key=${API_KEY}`
      );
      if (!res.data) throw new Error("No se pudo cargar tendencias");
      console.log(res.data);
      setMovies(res.data.results || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function searchMovies() {
    if (!query.trim()) return fetchTrending();
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(
        `${API_URL}/search/movie?query=${encodeURIComponent(
          query
        )}&language=${LANG}&include_adult=false&api_key=${API_KEY}`
      );

      setMovies(res.data.results || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrending();
  }, []);
  useEffect(() => {
    if (movies.length > 0) {
      const movie = movies[Math.floor(Math.random() * movies.length)];

      setBackground(`${IMG_URL}${movie.poster_path}`);
      setTitleMovie(movie.title);
    }
  }, [movies]);
  return (
    <>
      <header>
        <nav>
          <ul>
            <li className="flex flex-col sm:flex-row gap-3 mb-8 justify-center bg-">
              <input
                type="text"
                placeholder="Buscar película..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchMovies()}
                className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </li>
            <li>
              <button
                onClick={searchMovies}
                className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition">
                Buscar
              </button>
            </li>
          </ul>
        </nav>

        {loading && <p className="text-center text-gray-400">Cargando…</p>}
        {err && <p className="text-center text-red-400">{err}</p>}
      </header>

      <div className="   w-100% h-[500px]">
        <img
          src={background}
          alt={titleMovie}
          className="w-full h-[500px] object-cover"
        />
        <div className="text-center">{titleMovie} </div>
      </div>

      <h2 className="font-extrabold text-start text-[32px]">Recommendations</h2>
      <section className="inline-flex  flex-wrap">
        <div className=" cards-container">
          {movies.map((m) => (
            <div className="film-card relative " key={m.id}>
              {m.poster_path ? (
                <img
                  src={`${IMG_URL}${m.poster_path}`}
                  alt={m.title}
                  className="film-img"
                  loading="lazy"
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}
              <div className=" flex flex-col gap-3 bg-white/50 px-6 rounded-bl-[20px] rounded-br-[20px] absolute bottom-0 left-0 right-0 ">
                <h3 className="  font-semibold text-black text-start  ">
                  {m.title}
                </h3>
                <p className=" text-black text-start  ">
                  {m.release_date || "—"}
                </p>
                <p className=" text-yellow-400 text-end  ">
                  ⭐ {Number(m.vote_average || 0).toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
