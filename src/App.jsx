import { Suspense } from "react";
import { Route, Switch }from "wouter";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import Register from "./pages/register";



// 1. Importa el PageLoader para el Suspense principal
import PageLoader from "./Components/pageloader.jsx";

// 2. Importa el componente que tiene el LAYOUT
import AppRoutes from "./Components/appRoutesHome.jsx";


export default function App() {
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
