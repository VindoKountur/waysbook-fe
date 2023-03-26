import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const UserRoute = () => {
  const { state } = useContext(UserContext);
  let isUser = state.user.role === "user";

  return isUser ? <Outlet /> : <Navigate to="/" />;
};

export const AdminRoute = () => {
  const { state } = useContext(UserContext);
  
  let isAdmin = state.user.role === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};
