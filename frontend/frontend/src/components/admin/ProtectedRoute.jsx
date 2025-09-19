import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null || user.role !== "recruiter") {
      navigate("/");
    }
  }, [user, navigate]); // ✅ added dependencies

  // If user not loaded yet, don’t render children
  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
