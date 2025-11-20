import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "https://studypro-backend.onrender.com";

interface Course {
  id: number;
  name: string;
  code: string;
}

interface Creator {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  Course?: Course;
  creator?: Creator;
}

export default function PublicGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);

  // 🔹 Obtener grupos públicos
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Error al obtener grupos públicos");

        setGroups(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // 🔹 Unirse a un grupo
  const handleJoinGroup = async (groupId: number) => {
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al unirse al grupo");

      setSuccess(`✅ ${data.message}`);
      setJoinedGroups((prev) => [...prev, groupId]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          🌍 Grupos Públicos de Estudio
        </h2>

        <p className="mt-2 text-center text-gray-400 text-sm">
          Únete a grupos creados por otros estudiantes que cursan las mismas materias.
        </p>

        {/* Mensajes */}
        {error && (
          <p className="text-center text-red-400 font-medium mt-4">{error}</p>
        )}
        {success && (
          <p className="text-center text-green-400 font-medium mt-4">{success}</p>
        )}

        {/* Lista de grupos */}
        <div className="mt-10 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {loading ? (
            <p className="text-center text-gray-400 col-span-full">
              Cargando grupos...
            </p>
          ) : groups.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No hay grupos públicos disponibles.
            </p>
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {group.description || "Sin descripción"}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  📘 Curso:{" "}
                  <span className="text-indigo-400 font-medium">
                    {group.Course?.name} ({group.Course?.code})
                  </span>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  👤 Creador:{" "}
                  <span className="text-indigo-300">
                    {group.creator?.name || "Desconocido"}
                  </span>
                </p>

                <button
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={joinedGroups.includes(group.id)}
                  className={`mt-4 w-full rounded-md px-4 py-2 font-semibold transition ${
                    joinedGroups.includes(group.id)
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-500"
                  }`}
                >
                  {joinedGroups.includes(group.id)
                    ? "✅ Ya eres miembro"
                    : "Unirse al grupo"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
