import { useMovieStore } from '../store/useMovieStore';

const IMG_URL = 'https://image.tmdb.org/t/p/w300';

export default function Favorites() {
  const { favorites, toggleFavorite } = useMovieStore();

  if (!favorites || favorites.length === 0) {
    return (
      <main className="w-full grow p-4 pt-20 md:p-8 md:pt-16 text-white">
        <h2 className="text-2xl font-bold">Tus favoritos</h2>
        <p className="mt-4 text-gray-300">No hay favoritos aún.</p>
      </main>
    );
  }

  return (
    <main className="w-full grow p-4 pt-20 md:p-8 md:pt-16 text-white">
      <h2 className="text-2xl font-bold mb-4">Tus favoritos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favorites.map((m) => (
          <div key={m.id} className="bg-[#121212] rounded-lg p-3 flex gap-3 items-center">
            {m.poster_path ? (
              <img src={`${IMG_URL}${m.poster_path}`} alt={m.title || m.name} className="w-20 h-28 object-cover rounded" />
            ) : (
              <div className="w-20 h-28 bg-gray-800 rounded flex items-center justify-center text-sm">No img</div>
            )}

            <div className="flex-1">
              <h3 className="font-semibold">{m.title || m.name || 'Sin título'}</h3>
              <p className="text-sm text-gray-300">{m.release_date ? m.release_date.substring(0,4) : m.first_air_date ? m.first_air_date.substring(0,4) : '—'}</p>
            </div>

            <button
              onClick={() => toggleFavorite(m)}
              className="bg-white/10 p-2 rounded hover:bg-white/20"
              aria-label="Quitar favorito"
            >
              <i className="fa-solid fa-heart text-pink-400"></i>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}