import { useEffect, useState } from "react";
import { supabase } from "../consts/supabase";

function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState();

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
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setUser({ ...user, ...data });
        });
    });
  }, [session]);

  return { session, user };
}

export default useAuth;
