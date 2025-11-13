import { useState } from 'react';
import { useLocation } from 'wouter';
import SideBar from './sideBar.jsx';
import Footer from './footer.jsx';


export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();
  const showSidebar = location === "/" || location === "/favorites" || location === "/admin" || location === "/movies" || location === "/series";

  return (
    <div className="flex min-h-screen">
      {showSidebar && <SideBar isOpen={sidebarOpen} />}

      <div className="flex flex-1 min-w-0 flex-col">
        {showSidebar && (
          <button
            aria-label={sidebarOpen ? 'Cerrar' : 'Abrir'}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((s) => !s)}
            className={`fixed top-4 z-50 bg-white/10 text-white p-2 rounded-md backdrop-blur-sm hover:bg-white/20 transition-all duration-300 ${
              sidebarOpen ? 'left-[232px]' : 'left-4' 
            }`}
          >
            <i className={`fa-solid ${sidebarOpen ? 'fa-chevron-left' : 'fa-bars'}`}></i>
          </button>
        )}

        <div className="flex-1 min-h-0">
          {children}
        </div>

        <Footer />
      </div>
    </div>
  );
}