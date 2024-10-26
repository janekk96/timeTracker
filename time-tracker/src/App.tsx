import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ROUTES } from "./consts/routes";
import useAuth from "./hooks/useAuth";
import Login from "./Pages/Login";
import { useEffect } from "react";

function RouterRoutes() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "User") {
      navigate(`/user/${user?.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return <div>Loading ...</div>;
  return (
    <Routes>
      {ROUTES.map((route) => (
        <Route key={route.name} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

function App() {
  const { session } = useAuth();
  if (!session) return <Login />;
  return (
    <Router>
      <RouterRoutes />
    </Router>
  );
}

export default App;
