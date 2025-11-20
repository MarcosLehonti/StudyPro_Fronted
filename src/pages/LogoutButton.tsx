import { useNavigate } from "react-router-dom";
import React from "react";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true }); // 🔹 Redirige al login
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
