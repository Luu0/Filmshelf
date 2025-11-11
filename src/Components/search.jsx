import React from "react";
import { useMovieStore } from "../store/useMovieStore.js";
export default function Search() {
  const { query, setQuery, searchMovies, loading, err } = useMovieStore();
  return (
    <header className="absolute right-8 top-8 z-20">
      <nav>
        <ul className="flex items-center justify-end p-4 gap-4">
          <li className="flex sm:flex-row gap-3 mb-8 justify-center bg-">
            <input
              type="text"
              placeholder="Buscar película..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchMovies(query)}
              className="w-[300px]  px-4 py-2 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 m-14"
            />
            <button
              onClick={searchMovies}
              className="px-6 py-2 rounded-lg text-white font-semibold transition"
            >
              <i className="fa-solid fa-magnifying-glass pointer-events-none "></i>
            </button>
          </li>
        </ul>
      </nav>

      {loading && <p className="text-center text-gray-400">Cargando…</p>}
      {err && <p className="text-center text-red-400">{err}</p>}
    </header>
  );
}
