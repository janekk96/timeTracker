import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ROUTES } from "./consts/routes";
import useAuth from "./hooks/useAuth";
import Login from "./Pages/Login";

function App() {
  const { session, user } = useAuth();
  console.log(user);
  if (!session) return <Login />;
  return (
    <Router>
      <Routes>
        {ROUTES.map((route) => (
          <Route key={route.name} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
