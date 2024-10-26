// src/AuthContext.js
import React, { createContext, useState } from "react";

interface AuthContextType {
  children: React.ReactNode;
}

enum UserRole {
  Admin = "Admin",
  User = "User",
}

interface UserType {
  username: string;
  role: UserRole;
  id: number;
}

interface AuthContextInterface {
  isAuthenticated: boolean;
  user: UserType;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextInterface | null>(null);

// Create a provider component
export const AuthProvider = ({ children }: AuthContextType) => {
  // State to hold authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType>({
    username: "",
    id: 0,
    role: UserRole.User,
  });

  const [session, setSession] = useState(null);

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

  // Function to handle login
  const login = (username: string, password: string) => {
    // For simplicity, using hardcoded credentials
    if (username === "user" && password === "p") {
      setIsAuthenticated(true);
      setUser({ username: username, role: UserRole.User, id: 1 });
      return true;
    }
    if (username === "admin" && password === "p") {
      setIsAuthenticated(true);
      setUser({ username: username, role: UserRole.Admin, id: 2 });
      return true;
    }
    return false;
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
