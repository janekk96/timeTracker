import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";

export interface ProtectedElementProps {
  children: React.ReactNode;
  roles: string[];
  validator?: (params: Record<string, unknown>) => boolean;
}

function ProtectedElement({
  children,
  roles,
  validator,
}: ProtectedElementProps) {
  const { uid } = useParams();
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
  if (
    validator &&
    user &&
    !validator({
      userRole: user.role,
      loggedUid: user.id,
      selectedUid: uid,
    })
  ) {
    toRender = unauthorized;
  }
  return <>{toRender}</>;
}

export default ProtectedElement;
