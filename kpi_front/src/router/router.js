import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import ProtectedRoute from "../services/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <ProtectedRoute component={Dashboard} /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
