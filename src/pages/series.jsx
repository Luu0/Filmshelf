import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMovieStore } from "../store/useMovieStore";
import Carousel from "../Components/Carousel.jsx";

export default function Series() {
  const [, setLocation] = useLocation();
  const { 
    tvSeries, 
    actionSeries, 
    comedySeries, 
    horrorSeries, 
    background,
    titleMovie,
    bannerMovieId,
    toggleFavorite,
    fetchTvSeries, 
    fetchActionSeries, 
    fetchComedySeries, 
    fetchHorrorSeries,
    fetchTrending,
  } = useMovieStore();

  useEffect(() => {
    fetchTrending();
    fetchTvSeries();
    fetchActionSeries();
    fetchComedySeries();
    fetchHorrorSeries();
  }, [
    fetchTrending,
    fetchTvSeries, 
    fetchActionSeries, 
    fetchComedySeries, 
    fetchHorrorSeries
  ]);

  const displayTitle = titleMovie || "Popular Series";

  const handleFavoriteClick = () => {
    if (bannerMovieId) {
      toggleFavorite(bannerMovieId);
    }
  };

  const handleJoinCritics = () => {
    if (bannerMovieId) {
      setLocation(`/movie/${bannerMovieId}`);
    }
  };

  return (
    <main className="grow flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden rounded-lg shadow-xl mb-4 mx-4 mt-20 md:mx-6 md:mt-6">
        {background && (
          <img
            src={background}
            alt={displayTitle}
            className="w-full h-full object-cover absolute inset-0 -z-10 opacity-70 brightness-100 rounded-lg"
            loading="lazy"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>

        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 text-white max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 leading-tight">
            {displayTitle}
          </h2>
          <div className="flex items-center gap-4 mt-2 md:mt-6">
            <button className="critics-btn" onClick={handleJoinCritics}>
              Join the Critics
            </button>
            <button
              className="like-btn"
              onClick={handleFavoriteClick} 
            >
              <i className="fa-solid fa-heart text-purple-500"></i>
            </button>
          </div>
        </div>

        <button 
          onClick={() => setLocation("/")}
          className="absolute top-4 left-4 flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back
        </button>
      </div>

      <section className="flex-1 py-6 px-0 md:px-6">
        <Carousel title="Popular Series" items={tvSeries} />
        <Carousel title="Action Series" items={actionSeries} />
        <Carousel title="Comedy Series" items={comedySeries} />
        <Carousel title="Horror Series" items={horrorSeries} />
      </section>
    </main>
  );
}
