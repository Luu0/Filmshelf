import { Route } from "wouter";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <>
      <Route path="/" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </>
  );
}

export default App;
