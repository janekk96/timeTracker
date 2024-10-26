import Home from "../Pages/Home";
import User from "../Pages/User";

export enum Role {
  Admin = "Admin",
  User = "User",
}

export interface RouteType {
  name: string;
  path: string;
  element: React.ReactNode;
  roles: Role[];
}

export const ROUTES: RouteType[] = [
  {
    name: "Home",
    path: "/",
    element: <Home />,
    roles: [Role.Admin],
  },
  {
    name: "User",
    path: "/:uid",
    element: <User />,
    roles: [Role.User, Role.Admin],
  },
];
