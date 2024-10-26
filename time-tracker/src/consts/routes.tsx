import AuthElement from "../components/AuthElement/AuthElement";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import User from "../Pages/User";

export enum Role {
  Admin = "Admin",
  User = "User",
}

export interface RouteType {
  name: string;
  path: string;
  element: React.ReactNode;
}

export const ROUTES: RouteType[] = [
  {
    name: "Home",
    path: "/",
    element: <Home />,
  },
  {
    name: "User",
    path: "/user/:uid",
    element: <User />,
  },
  {
    name: "Logout",
    path: "/logout",
    element: <>logout</>,
  },
];
