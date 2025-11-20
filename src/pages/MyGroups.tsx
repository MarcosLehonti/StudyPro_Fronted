import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL ?? "https://studypro-backend.onrender.com";

interface Group {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  Course: {
    id: number;
    name: string;
    code: string;
  };
}

export default function MyGroups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token de autenticación");

        const res = await fetch(`${API_URL}/api/groups/my-groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Error al obtener mis grupos");

        setGroups(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, []);

  return (
    <div className="mt-10">
      {/* 🔹 Mostrar mensaje de carga */}
      {loading && (
        <p className="text-gray-400 text-center">Cargando tus grupos...</p>
      )}

      {/* 🔹 Mostrar mensaje de error */}
      {error && (
        <p className="text-red-400 text-center">{error}</p>
      )}

      {/* 🔹 Mostrar mensaje si no hay grupos */}
      {!loading && !error && groups.length === 0 && (
        <p className="text-gray-400 text-center">
          No tienes grupos todavía.
        </p>
      )}

      {/* 🔹 Mostrar lista de grupos */}
      {!loading && !error && groups.length > 0 && (
        <ul className="space-y-4">
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 shadow hover:border-indigo-500 transition"
            >
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{group.name}</p>
                <p className="text-sm text-gray-400">{group.description}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Curso:{" "}
                  <span className="text-indigo-400">{group.Course?.name}</span> (
                  {group.Course?.code})
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    group.isPublic
                      ? "text-green-300 border-green-500"
                      : "text-gray-400 border-gray-600"
                  }`}
                >
                  {group.isPublic ? "Público" : "Privado"}
                </span>

                <button
                  onClick={() => navigate(`/groups/${group.id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-1 rounded-lg"
                >
                  Ver
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
