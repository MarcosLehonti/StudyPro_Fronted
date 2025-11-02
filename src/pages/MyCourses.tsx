import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface Course {
  id: number;
  name: string;
  code: string;
  group: string;
  schedule: string;
  semester: string;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usercourse/my-courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Error al obtener mis cursos");

        setCourses(data); // 👈 el backend devuelve directamente user.Courses
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          ✅ Mis Cursos Inscritos
        </h2>

        {loading && <p className="mt-6 text-center text-gray-400">Cargando...</p>}
        {error && <p className="mt-6 text-center text-red-400">{error}</p>}

        {!loading && courses.length === 0 && (
          <p className="mt-6 text-center text-gray-400">No tienes cursos inscritos aún</p>
        )}

        <ul className="mt-10 space-y-4">
          {courses.map((course) => (
            <li
              key={course.id}
              className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 shadow hover:border-indigo-500 transition"
            >
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{course.name}</p>
                <p className="text-sm text-gray-400">Código: {course.code}</p>
                <p className="text-sm text-gray-400">Horario: {course.schedule}</p>
              </div>

              <span className="ml-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold text-gray-200">
                Grupo {course.group}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
