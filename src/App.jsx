import { Suspense } from "react";
import { Switch, Route } from "wouter"; 

// 1. Importa el PageLoader para el Suspense principal
import PageLoader from "./Components/pageloader.jsx";

// 2. Importa el componente que tiene el LAYOUT
import AppRoutes from "./Components/appRoutesHome.jsx";


export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>

        {/* --- RUTAS CON LAYOUT --- */}
        <Route component={AppRoutes} />
      </Switch>
    </Suspense>
  );
}