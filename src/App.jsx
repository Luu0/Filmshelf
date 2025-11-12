import { Route } from "wouter";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Route path="/" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/home" component={Home} />
    </>
  );
}

export default App;
