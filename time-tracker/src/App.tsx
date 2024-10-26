import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ROUTES } from "./consts/routes";
import Login from "./Pages/Login";
import { useContext, useEffect, useState } from "react";
import { supabase } from "./consts/supabase";
import { AuthContext, AuthUser } from "./contexts/AuthContext";
import { Session } from "@supabase/supabase-js";

function RouterRoutes() {
  const { user } = useContext(AuthContext) || {};

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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const { user } = data;
      supabase
        .from("profiles")
        .select()
        .eq("id", user?.id)
        .single()
        .then(({ data }) => {
          setUser({ ...user, ...data });
        });
    });
  }, [session]);

  if (!session) return <Login />;
  return (
    <AuthContext.Provider
      value={{
        session: session,
        user: user,
        setSession: setSession,
        setUser: setUser,
      }}
    >
      <Router>
        <RouterRoutes />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
