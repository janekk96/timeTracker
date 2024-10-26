import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export interface ProtectedElementProps {
  children: React.ReactNode;
  roles: string[];
}

function ProtectedElement({ children, roles }: ProtectedElementProps) {
  const { user } = useContext(AuthContext) || {};
  const loading = <div>Loading ...</div>;
  const unauthorized = <div>Dostęp Nieautoryzowany</div>;
  let toRender = children;
  if (!user) {
    toRender = loading;
  }
  if (user && !roles.includes(user.role)) {
    toRender = unauthorized;
  }
  return <>{toRender}</>;
}

export default ProtectedElement;
