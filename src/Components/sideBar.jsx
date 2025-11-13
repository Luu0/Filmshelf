import { Link, useRoute } from "wouter";
// 1. IMPORTAR EL STORE
import { useMovieStore } from "../store/useMovieStore"; // Ajusta la ruta si es necesario

export default function SideBar({ isOpen = true }) {
  const [isHome] = useRoute("/");
  const [isFavorites] = useRoute("/favorites");
  const [isAdmin] = useRoute("/admin");
  const [isLogin] = useRoute("/login");
  const [isRegister] = useRoute("/register");
  const isAuthenticated = useMovieStore((state) => state.isAuthenticated);
  const logout = useMovieStore((state) => state.logout);

  const handleLogout = async () => {
    await logout(); 
    window.location.href = "/login";
  };

  const handleFavoritesClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault(); 
      alert("Debes estar logueado para ver tus favoritos.");
    }
  };

  return (
    <>
      <aside
        aria-hidden={!isOpen}
        className={`sidebar ${
          isOpen ? "w-56" : "w-0"
        } shrink-0 h-screen fixed md:sticky top-0 left-0 flex justify-between flex-col transition-all duration-300 overflow-hidden z-40 bg-[#191817]`}
      >
        <ul className="font-normal flex flex-col place-items-start gap-y-4 p-4 overflow-y-auto h-full">
          <li>
            <Link href="/" className=" w-full flex items-center p-2 ">
              <span className="ms-3 font-bold">FILMSHELF</span>
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className={`flex items-center gap-2 p-1 ${
                isHome ? "font-bold" : ""
              }`}
            >
              <i className="fa-solid fa-film"></i>
              <span>Home</span>
            </Link>
          </li>
          
          <li>
            <Link
              href="/favorites"
              onClick={handleFavoritesClick} 
              className={`flex items-center gap-2 p-1 ${
                isFavorites ? "font-bold" : ""
              }`}
            >
              <i className="fa-regular fa-heart"></i>
              <span>Favoritos</span>
            </Link>
          </li>

          <li>
            <Link
              href="/admin"
              className={`flex items-center gap-2 p-1 ${
                isAdmin ? "font-bold" : ""
              }`}
            >
              <i className="fa-solid fa-user-shield"></i>
              <span>Admin</span>
            </Link>
          </li>

          {/* LÓGICA CONDICIONAL DE AUTH*/}
          {isAuthenticated ? (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-1 w-full text-left"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Log Out</span>
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className={`flex items-center gap-2 p-1 ${
                    isLogin ? "font-bold" : ""
                  }`}
                >
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  <span>Log In</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className={`flex items-center gap-2 p-1 ${
                    isRegister ? "font-bold" : ""
                  }`}
                >
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Sign Up</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </aside>
    </>
  );
}