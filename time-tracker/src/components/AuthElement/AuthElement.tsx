import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import Login from "../../Pages/Login";

export interface AuthElementProps {
  element: React.ReactNode;
  isAuthRequired: boolean;
}
function AuthElement({ element, isAuthRequired }: AuthElementProps) {
  const auth = useContext(AuthContext);
  if (!auth || (!auth?.isAuthenticated && isAuthRequired)) {
    return <Login />;
  }
  return element;
}

export default AuthElement;
