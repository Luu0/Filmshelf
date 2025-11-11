import logo from "../assets/19e39a9ea246ceafb9f0673aa2addfe2c313e11c.png";
import bgImage from "../assets/d4839fb6a7578f7304003bbd105ec24e89625742.png";
import { Link } from "wouter";

export default function Welcome() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden">

      {/* Imagen blur + oscurecida */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: "blur(14px) brightness(0.50)",
          transform: "scale(1.15)"
        }}
      />

      {/* Degradado MORADO concentrado abajo a la derecha y difuminado al centro */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 90% 85%, rgba(120, 0, 255, 0.15), rgba(123, 0, 255, 0.25) 40%, rgba(0, 0, 0, 0.6) 75%)"
        }}
      />

      {/* Contenido frontal */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 ">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="FILMSHELF Logo"
              className="w-9 h-9 object-contain opacity-90"
            />
            <h1 className="text-white text-2xl font-semibold tracking-wide">
              FILMSHELF
            </h1>
          </div>

          <p className="text-gray-300 text-sm">
            Log Your Life in Film.
          </p>
        </div>

        {/* Botón login */}
        <Link href="/login">
          <button className="bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-3 px-10 rounded-xl shadow-lg">
            Log in
          </button>
        </Link>

        {/* Register */}
        <p className="text-gray-300 text-sm">
          No account?{" "}
          <Link href="/register">
            <span className="text-purple-400 font-semibold hover:underline cursor-pointer">
              Sign up
            </span>
          </Link>
        </p>
      </div>

    </div>
  );
}
