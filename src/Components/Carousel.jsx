import { useRef } from 'react';
import { useMovieStore } from '../store/useMovieStore';
import { Link } from "wouter"; 

const IMG_URL = 'https://image.tmdb.org/t/p/w342';

export default function Carousel({ title, items = [] }) {
  const { favorites, toggleFavorite } = useMovieStore();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 px-4 md:px-6 w-full">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>

      <div className="relative w-full flex justify-center">
        {/* boton movver izq */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition-all hover:scale-110"
          aria-label="Anterior"
        >
          <i className="fa-solid fa-chevron-left text-sm"></i>
        </button>

        {/* contenedor de scroll */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto overflow-y-hidden"
          style={{
            height: '300px',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex gap-4">
            {items.map((item) => {
              const isLiked = favorites.some((f) => f.id === item.id);
              const poster = item.poster_path || item.still_path;
              const title = item.title || item.name;
              const isTV = !!item.name && !item.title;
              const href = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;

              return (
                <Link key={item.id} href={href}>
                  <div
                    className="shrink-0 w-44 h-64 bg-gray-800 rounded-lg overflow-hidden group/card relative cursor-pointer"
                  >
                    {poster ? (
                      <img
                        src={`${IMG_URL}${poster}`}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Sin imagen
                      </div>
                    )}

                    {/* Overlay con info */}
                    <div 
                      className={`
                        absolute inset-0 flex flex-col justify-end p-3 transition-all 
                        bg-linear-to-t from-black/80 to-transparent opacity-100
                        lg:bg-black/0 lg:opacity-0 
                        lg:group-hover/card:bg-black/60 
                        lg:group-hover/card:opacity-100
                      `}
                    >
                      <h4 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                        {title}
                      </h4>
                      {/* Boton corazon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          e.preventDefault(); 
                          toggleFavorite(item);
                        }}
                        className="self-end bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
                        aria-label="Agregar a favoritos"
                      >
                        <i
                          className={`fa-heart text-lg ${
                            isLiked ? 'fa-solid text-red-500' : 'fa-regular text-white'
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* boton derecha */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition-all hover:scale-110"
          aria-label="Siguiente"
        >
          <i className="fa-solid fa-chevron-right text-sm"></i>
        </button>
      </div>
    </div>
  );
}