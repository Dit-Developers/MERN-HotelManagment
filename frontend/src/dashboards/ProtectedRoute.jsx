import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ roles, children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) return <Navigate to="/login" />;
  if (!roles.includes(user.Role)) return <Navigate to="/not-authorized" />;

  return children;
};

export default ProtectedRoute;
