import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface Course {
  id: number;
  name: string;
  code: string;
  group: string;
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<number[]>([]); // 👈 IDs seleccionados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/courses/course-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Error al obtener cursos");
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/usercourse/add-courses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseIds: selected }), // 👈 enviar array de IDs
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al inscribirse");

      setSuccess("✅ Cursos inscritos correctamente");
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          📚 Lista de Materias
        </h2>

        {loading && <p className="mt-6 text-center text-gray-400">Cargando materias...</p>}
        {error && <p className="mt-6 text-center text-red-400">{error}</p>}
        {success && <p className="mt-6 text-center text-green-400">{success}</p>}

        <ul className="mt-10 space-y-4">
          {courses.map((course) => (
            <li
              key={course.id}
              onClick={() => toggleSelect(course.id)} // 👈 marcar al hacer click
              className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 shadow transition ${
                selected.includes(course.id)
                  ? "border-indigo-500 bg-indigo-900"
                  : "border-gray-700 bg-gray-800 hover:border-indigo-500"
              }`}
            >
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{course.name}</p>
                                <p className="text-white font-medium truncate">{course.id}</p>

                <p className="text-sm text-gray-400">{course.code}</p>
              </div>

              <span className="ml-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold text-gray-200">
                Grupo {course.group}
              </span>
            </li>
          ))}
        </ul>

        {selected.length > 0 && (
          <button
            onClick={handleEnroll}
            className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Inscribirse en {selected.length} materias
          </button>
        )}
      </div>
    </div>
  );
}
