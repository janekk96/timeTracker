import { createContext } from "react";
import { Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  setSession: (session: Session) => void;
  setUser: (user: AuthUser) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
