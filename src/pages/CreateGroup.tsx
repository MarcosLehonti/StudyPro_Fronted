import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "https://studypro-backend.onrender.com";

interface Course {
  id: number;
  name: string;
  code: string;
}

export default function CreateGroup() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [groupName, setGroupName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Obtener los cursos inscritos (para asociar el grupo a un curso)
  useEffect(() => {
    const fetchCourses = async () => {
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

  // 🔹 Enviar formulario para crear grupo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedCourse || !groupName.trim()) {
      setError("Debes seleccionar un curso y escribir un nombre para el grupo.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          name: groupName,
          isPublic,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al crear grupo");

      setSuccess("🎉 Grupo creado exitosamente.");
      setGroupName("");
      setSelectedCourse("");
      setIsPublic(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          🧩 Crear Nuevo Grupo
        </h2>

        <p className="mt-2 text-center text-gray-400 text-sm">
          Crea un grupo de estudio para uno de tus cursos inscritos.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg"
        >
          {/* Curso */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Curso asociado
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">-- Selecciona un curso --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>

          {/* Nombre del grupo */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nombre del grupo
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ejemplo: Grupo de repaso final"
              className="mt-2 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Grupo público */}
          <div className="flex items-center">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="isPublic"
              className="ml-2 block text-sm text-gray-300"
            >
              Hacer este grupo público
            </label>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear grupo"}
          </button>

          {/* Mensajes */}
          {error && (
            <p className="text-center text-red-400 font-medium mt-3">{error}</p>
          )}
          {success && (
            <p className="text-center text-green-400 font-medium mt-3">
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
