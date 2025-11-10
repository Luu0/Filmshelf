import React, { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "es-AR";
const API_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function fetchTrending() {
    setLoading(true); setErr("");
    try {
      const res = await fetch(`${API_URL}/trending/movie/week?language=${LANG}&api_key=${API_KEY}`);
      if (!res.ok) throw new Error("No se pudo cargar tendencias");
      const data = await res.json();
      setMovies(data.results || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function searchMovies() {
    if (!query.trim()) return fetchTrending();
    setLoading(true); setErr("");
    try {
      const res = await fetch(
        `${API_URL}/search/movie?query=${encodeURIComponent(query)}&language=${LANG}&include_adult=false&api_key=${API_KEY}`
      );
      if (!res.ok) throw new Error("Error en la búsqueda");
      const data = await res.json();
      setMovies(data.results || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTrending(); }, []);

  return (
    <section>
      {/* Buscador */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center">
        <input
          type="text"
          placeholder="Buscar película..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovies()}
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchMovies}
          className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
        >
          Buscar
        </button>
      </div>

      {loading && <p className="text-center text-gray-400">Cargando…</p>}
      {err && <p className="text-center text-red-400">{err}</p>}

      {/* Grilla */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((m) => (
          <div
            key={m.id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:scale-[1.02] transition-transform"
            title={m.title}
          >
            {m.poster_path ? (
              <img src={`${IMG_URL}${m.poster_path}`} alt={m.title} className="w-full h-auto" loading="lazy" />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                Sin imagen
              </div>
            )}
            <div className="p-3">
              <h3 className="text-sm font-semibold mb-1 truncate">{m.title}</h3>
              <p className="text-xs text-gray-400">{m.release_date || "—"}</p>
              <p className="text-xs text-yellow-400 mt-1">⭐ {Number(m.vote_average || 0).toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
