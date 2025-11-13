import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import axios from "axios";

const IMG_URL = "https://image.tmdb.org/t/p/original";
const API_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "es-AR";

export default function SeriesView() {
  const [_match, params] = useRoute("/tv/:id");
  const id = params ? params.id : null;
  const [_location, setLocation] = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setErr] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErr(null);
    axios
      .get(`${API_URL}/tv/${id}?language=${LANG}&api_key=${API_KEY}`)
      .then((res) => setData(res.data))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !data) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-[#252422] to-[#3a3636] text-white flex justify-center items-center">
        <h1 className="text-3xl">Cargando...</h1>
      </div>
    );
  }

  const getRatingStars = (ratingValue) => {
    const stars = [];
    const normalizedRating = Math.round(ratingValue / 2);
    for (let i = 0; i < 5; i++) {
      stars.push(i < normalizedRating ? "★" : "☆");
    }
    return stars.join(" ");
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-[#1d1c1b] to-[#3a3636] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-4 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30"
        >
          &larr; Volver
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={data.poster_path ? `${IMG_URL}${data.poster_path}` : "https://placehold.co/400x600/2a2a2a/444444?text=Sin+Imagen"}
                alt={data.name}
                className="w-full h-auto max-h-[450px] object-cover object-top"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x600/2a2a2a/444444?text=Sin+Imagen" }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4">
                <h1 className="text-3xl font-bold">{data.name}</h1>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Puntuación de Usuarios</h3>
              <span className="text-3xl text-yellow-400">
                {getRatingStars(data.vote_average)}
              </span>
              <span className="ml-2 text-lg text-gray-300">
                {data.vote_average.toFixed(1)} / 10
              </span>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tu Reseña Personal</h3>
              <textarea
                className="w-full bg-black/40 rounded-xl p-4 min-h-[120px] outline-none resize-none text-gray-200"
                defaultValue={""}
                placeholder="Escribe tu reseña personal aquí..."
              />
            </div>
          </div>

          <div className="lg:w-2/3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Descripción</h1>

              <p className="text-gray-200 text-base font-bold">
                {data.first_air_date ? data.first_air_date.substring(0, 4) : "—"} |
                {data.genres.map((g) => g.name).join(", ")}
              </p>

              <p className="mt-4 text-gray-100 leading-relaxed">{data.overview || "No hay descripción disponible."}</p>

              <p className="mt-4 text-base font-bold">
                Temporadas:
                <span className="font-normal text-gray-200 ml-2">{data.number_of_seasons}</span>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Mira lo que dicen</h2>
              <div className="bg-black/40 rounded-xl p-4 space-y-4 h-[250px] overflow-y-auto">
                <p className="text-gray-400">Reviews de usuarios (aún no implementado).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
