import { useEffect } from "react";
import { useMovieStore } from "./store/useMovieStore";
import Search from "./Components/search.jsx";
import SideBar from "./Components/sideBar.jsx";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "es-AR";
const API_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";

export default function Home() {
  const { movies, background, titleMovie, fetchTrending } = useMovieStore();
  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);
  return (
    <>
      <main className="grow">
        <div className=" relative w-full h-[550px] overflow-hidden ">
          <Search />
          <img
            src={background}
            alt={titleMovie}
            className="w-full h-full object-cover absolute inset-0 -z-10"
          />
          <div className="text-center absolute bottom-20 left-10 flex flex-col  justify-center ">
            <h2 className="font-bold text-[36px]">{titleMovie} </h2>
            <div className="flex flex-row items-center justify-center gap-4 absolute top-15 left-3">
              <button className="critics-btn">Join the Critics</button>
              <button className="like-btn">
                <i class="fa-solid fa-heart text-purple-900"></i>
              </button>
            </div>
          </div>
        </div>

        <h3 className="font-semibold  text-[28px] ">Recommendations</h3>
        <section className="inline-flex  flex-wrap ">
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
                <div className=" flex flex-col  bg-stone-400/70 px-6 rounded-bl-[20px] rounded-br-[20px] absolute bottom-0 left-0 right-0 ">
                  <h3 className="  font-semibold text-[20px] text-black relative bottom-0 left-3  ">
                    {m.title}
                  </h3>
                  <p className=" text-black font-medium relative bottom-0 left-3 ">
                    {m.release_date || "—"}
                  </p>
                  <p className=" text-yellow-400 font-extrabold relative bottom-1 left-45 ">
                    ⭐ {Number(m.vote_average || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
