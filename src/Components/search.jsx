import { useMovieStore } from "../store/useMovieStore.js";

export default function Search() {
  const { query, setQuery, searchMovies, loading, err } = useMovieStore();

  return (
    <header className="absolute top-0 left-0 right-0 w-full z-20 px-4 py-4 md:px-16 md:py-8"> 
      <nav>
        <ul className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8"> 
          
          <li>
            <ul className="flex items-center justify-center gap-4 md:gap-8"> 
              <li>
                <p className="text-white font-medium hover:text-violet-400 transition-colors cursor-pointer text-lg">
                  Movies
                </p>
              </li>
              <li>
                <p className="text-white font-medium hover:text-violet-400 transition-colors cursor-pointer text-lg">
                  Series
                </p>
              </li>
              <li>
                <p className="text-white font-medium hover:text-violet-400 transition-colors cursor-pointer text-lg">
                  Documentaries
                </p>
              </li>
            </ul>
          </li>

          <li className="relative w-full md:w-auto"> 
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search movies, series, documentaries..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchMovies(query)}
                className="w-full md:w-[500px] px-4 py-3 rounded-lg bg-black/30 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" // CAMBIO
              />
              <button
                onClick={searchMovies}
                className="px-4 py-3 rounded-lg text-white font-semibold transition hover:bg-black/30"
              >
                <i className="fa-solid fa-magnifying-glass pointer-events-none"></i>
              </button>
            </div>

            <div className="absolute top-full right-0 mt-2 w-full md:w-[500px]"> 
              {loading && <p className="text-center text-gray-400">Cargando…</p>}
              {err && <p className="text-center text-red-400">{err}</p>}
            </div>
          </li>

        </ul>
      </nav>
    </header>
  );
}