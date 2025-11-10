import React from "react";
import Home from "./Home.jsx";

export default function App() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400">🎬 Películas</h1>
        <p className="text-sm text-gray-400">Tendencias y búsqueda desde TMDb</p>
      </header>
      <Home />
    </div>
  );
}
