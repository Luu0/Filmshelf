import { Suspense, useEffect } from "react"; // 1. IMPORTA useEffect
import { Route, Switch } from "wouter";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import Register from "./pages/register";
import PageLoader from "./Components/pageloader.jsx";
import AppRoutes from "./Components/appRoutesHome.jsx";

// 2. IMPORTA EL STORE
import { useMovieStore } from "./store/useMovieStore";

export default function App() {
  // 3. OBTÉN LA FUNCIÓN DE CHECKEO
  const checkLoginStatus = useMovieStore((state) => state.checkLoginStatus);

  // 4. EJECUTA EL CHECKEO AL CARGAR LA APP
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/singIn" component={Welcome} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />

        {/* --- RUTAS CON LAYOUT --- */}
        <Route component={AppRoutes} />
      </Switch>
    </Suspense>
  );
}