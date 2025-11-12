import { useEffect } from "react";
import { useMovieStore } from "../store/useMovieStore";
import Search from "../Components/search.jsx";
import Carousel from "../Components/Carousel.jsx";

export default function Home() {
  const { 
    movies, 
    background, 
    titleMovie, 
    fetchTrending,
    actionMovies,
    comedyMovies,
    horrorMovies,
    tvSeries,
    documentaries,
    fetchActionMovies,
    fetchComedyMovies,
    fetchHorrorMovies,
    fetchTvSeries,
    fetchDocumentaries,
  } = useMovieStore();
  
  useEffect(() => {
    fetchTrending();
    fetchActionMovies();
    fetchComedyMovies();
    fetchHorrorMovies();
    fetchTvSeries();
    fetchDocumentaries();
  }, [fetchTrending, fetchActionMovies, fetchComedyMovies, fetchHorrorMovies, fetchTvSeries, fetchDocumentaries]);

  const displayTitle = titleMovie || "Título de Película";

  return (
    <main className="grow flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden rounded-lg shadow-xl mb-4 mx-4 mt-20 md:mx-6 md:mt-6">
        <Search /> 
        
        {background && (
          <img
            src={background}
            alt={displayTitle}
            className="w-full h-full object-cover absolute inset-0 -z-10 opacity-70 brightness-100 rounded-lg"
            loading="lazy"
          />
        )}
        
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>

        {/* Contenido del Banner (Título y Botones) */}
        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 text-white max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 leading-tight">
            {displayTitle} 
          </h2>
          <div className="flex items-center gap-4 mt-2 md:mt-6">
            <button className="critics-btn">Join the Critics</button>
            <button className="like-btn">
              <i className="fa-solid fa-heart text-purple-500"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Carruseles de categorias */}
      <section className="flex-1 py-6 px-0 md:px-6">
        <Carousel title="Recommended" items={movies} />
        <Carousel title="Action movies" items={actionMovies} />
        <Carousel title="Comedy movies" items={comedyMovies} />
        <Carousel title="Horror movies" items={horrorMovies} />
        <Carousel title="TV Series" items={tvSeries} />
        <Carousel title="Documentaries" items={documentaries} />
      </section>
    </main>
  );
}