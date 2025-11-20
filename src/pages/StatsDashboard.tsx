import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// 📘 Tipos
interface UserStats {
  today: number;
  week: number;
  year: number;
}

interface TopGroup {
  id: number;
  name: string;
  memberCount: number;
}

interface StatsResponse {
  success: boolean;
  users: UserStats;
  topGroups: TopGroup[];
}

interface Course {
  id: number;
  name: string;
  code: string;
  group: string;
  schedule: string;
  semester: string;
}

interface Group {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  Course?: {
    id: number;
    name: string;
    code: string;
  };
  creator?: {
    id: number;
    name: string;
  };
}

export default function DashboardWithCourses() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);
  const [errorGroups, setErrorGroups] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#a1c4fd",
    "#fdbb2d",
  ];

  // 📊 Obtener estadísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/stats`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al obtener estadísticas");
        setStats(data);
      } catch (err: any) {
        setErrorStats(err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // 📚 Obtener cursos
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usercourse/my-courses`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al obtener mis cursos");
        setCourses(data);
      } catch (err: any) {
        setErrorCourses(err.message);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // 🌍 Obtener grupos públicos
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/groups`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Error al obtener grupos públicos");
        setGroups(data);
      } catch (err: any) {
        setErrorGroups(err.message);
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, []);

  // 🔹 Unirse a grupo
  const handleJoinGroup = async (groupId: number) => {
    setErrorGroups(null);
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
      setErrorGroups(err.message);
    }
  };

  // 📊 Datos gráficos
  const userData = stats
    ? [
        { name: "Hoy", usuarios: stats.users.today },
        { name: "Semana", usuarios: stats.users.week },
        { name: "Año", usuarios: stats.users.year },
      ]
    : [];

  const groupData = stats
    ? stats.topGroups.map((g) => ({
        name: g.name,
        miembros: g.memberCount,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-indigo-400 text-center">
          📊 Panel de Estadísticas, Cursos y Grupos
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SECCIÓN IZQUIERDA → Gráficas */}
          <div className="lg:col-span-2 space-y-8">
            {/* Usuarios */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
                👤 Usuarios Registrados
              </h2>
              {loadingStats ? (
                <p className="text-gray-400">Cargando estadísticas...</p>
              ) : errorStats ? (
                <p className="text-red-400">{errorStats}</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usuarios" barSize={60}>
                      {userData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Grupos populares → CAMBIADO A BARRAS */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
                🏆 Grupos más populares
              </h2>
              {loadingStats ? (
                <p className="text-gray-400">Cargando grupos...</p>
              ) : groupData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={groupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="miembros" barSize={60}>
                      {groupData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400">No hay grupos populares disponibles.</p>
              )}
            </div>
          </div>

          {/* SECCIÓN DERECHA → Cursos + Grupos públicos */}
          <div className="flex flex-col space-y-8">
            {/* 📚 Cursos */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-300 text-center">
                📚 Mis Cursos Inscritos
              </h2>
              {loadingCourses && <p className="text-gray-400">Cargando cursos...</p>}
              {errorCourses && <p className="text-red-400">{errorCourses}</p>}
              {!loadingCourses && courses.length === 0 && (
                <p className="text-gray-400 text-center">No tienes cursos inscritos aún.</p>
              )}
              <ul className="mt-4 space-y-4">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    className="flex flex-col rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 shadow hover:border-indigo-500 transition"
                  >
                    <p className="text-white font-medium truncate">{course.name}</p>
                    <p className="text-sm text-gray-400">Código: {course.code}</p>
                    <p className="text-sm text-gray-400">Horario: {course.schedule}</p>
                    <span className="mt-2 inline-flex items-center self-start rounded-full border border-indigo-400 px-3 py-1 text-xs font-semibold text-indigo-300">
                      Grupo {course.group}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 🌍 Grupos públicos */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-300 text-center">
                🌍 Grupos Públicos de Estudio
              </h2>
              {errorGroups && (
                <p className="text-center text-red-400 font-medium">{errorGroups}</p>
              )}
              {success && (
                <p className="text-center text-green-400 font-medium">{success}</p>
              )}
              <div className="grid gap-4 sm:grid-cols-1">
                {loadingGroups ? (
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
                      className="rounded-lg border border-gray-700 bg-gray-900 p-4 shadow-md hover:border-indigo-500 transition"
                    >
                      <h3 className="text-lg font-semibold text-white">
                        {group.name}
                      </h3>
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
        </div>
      </div>
    </div>
  );
}
