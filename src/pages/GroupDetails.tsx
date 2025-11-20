import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ?? "https://studypro-backend.onrender.com";

interface Course {
  id: number;
  name: string;
  code: string;
  group: string;
  schedule: string;
  semester: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  numberreg: number;
  semester: number;
  role: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  Course: Course;
  creator: User;
  Users: User[];
}

interface Meeting {
  id: number;
  startTime: string;
  endTime: string;
  type: string;
  link?: string;
  location?: string;
  status: string;
  topic_name?: string;
}

export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newMeeting, setNewMeeting] = useState({
    startTime: "",
    endTime: "",
    type: "presencial",
    link: "",
    location: "",
    topic_name: "",
  });

  // 🧠 GEMINI
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState<number | null>(null); // <-- Mostrar debajo del botón

  useEffect(() => {
    const fetchGroupDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/groups/${id}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Error al obtener detalles del grupo");

        setGroup(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/meetings/group/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) setMeetings(data);
      } catch (err) {
        console.error("Error al cargar reuniones:", err);
      }
    };

    fetchMeetings();
  }, [id]);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studyGroupId: id,
          ...newMeeting,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear la reunión");

      setMeetings([...meetings, data.meeting]);
      setNewMeeting({
        startTime: "",
        endTime: "",
        type: "presencial",
        link: "",
        location: "",
        topic_name: "",
      });

      alert("Reunión creada correctamente ✅");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const askGeminiForTopic = async (topic: string, meetingId: number) => {
    setGeminiLoading(true);
    setGeminiResponse(null);
    setActiveMeetingId(meetingId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/gemini/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: topic }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al obtener respuesta de Gemini");

      setGeminiResponse(data.text);
    } catch (error: any) {
      setGeminiResponse("❌ No se pudo obtener material de estudio.");
      console.error(error);
    } finally {
      setGeminiLoading(false);
    }
  };

  // 🧩 Función para transformar el texto de Gemini en lista de enlaces con descripciones
  const parseGeminiResponse = (text: string) => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, idx) => {
      const match = line.match(linkRegex);
      if (match) {
        const url = match[0];
        const description = line.replace(url, "").trim() || "Recurso recomendado";
        return (
          <li key={idx} className="mb-2">
            🔗{" "}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {url}
            </a>
            <span className="text-gray-300"> — {description}</span>
          </li>
        );
      }
      return (
        <li key={idx} className="text-gray-400">
          {line}
        </li>
      );
    });
  };

  if (loading) return <p className="text-center text-gray-400 mt-10">Cargando...</p>;
  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;
  if (!group) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-indigo-400">{group.name}</h2>
        <p className="text-gray-300 mb-4">{group.description}</p>

        {/* Información del curso */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-3 text-indigo-300">📘 Información del Curso</h3>
          <p><strong>Nombre:</strong> {group.Course.name}</p>
          <p><strong>Código:</strong> {group.Course.code}</p>
          <p><strong>Grupo:</strong> {group.Course.group}</p>
          <p><strong>Horario:</strong> {group.Course.schedule}</p>
          <p><strong>Semestre:</strong> {group.Course.semester}</p>
        </div>

        {/* Miembros */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
          <h3 className="text-xl font-semibold mb-3 text-indigo-300">👥 Miembros del Grupo</h3>
          <ul className="space-y-2">
            {group.Users.map((user) => (
              <li key={user.id} className="border-b border-gray-700 pb-2 flex justify-between">
                <span>{user.name}</span>
                <span className="text-sm text-gray-400">{user.role}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🕒 Reuniones */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-300">🕒 Reuniones del Grupo</h3>

          {meetings.length > 0 ? (
            <ul className="space-y-3">
              {meetings.map((meeting) => (
                <li key={meeting.id} className="border-b border-gray-700 pb-3">
                  <p><strong>Inicio:</strong> {new Date(meeting.startTime).toLocaleString()}</p>
                  <p><strong>Fin:</strong> {new Date(meeting.endTime).toLocaleString()}</p>
                  <p><strong>Tipo:</strong> {meeting.type}</p>
                  {meeting.type === "virtual" && (
                    <p>
                      <strong>Link:</strong>{" "}
                      <a href={meeting.link} target="_blank" className="text-blue-400 underline">
                        {meeting.link}
                      </a>
                    </p>
                  )}
                  {meeting.type === "presencial" && <p><strong>Lugar:</strong> {meeting.location}</p>}
                  {meeting.topic_name && <p><strong>Tema:</strong> {meeting.topic_name}</p>}
                  <p><strong>Estado:</strong> <span className="text-sm text-gray-400">{meeting.status}</span></p>

                  {/* 🧠 Botón para obtener material de estudio */}
                  {meeting.topic_name && (
                    <div className="mt-2">
                      <button
                        onClick={() => askGeminiForTopic(meeting.topic_name!, meeting.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                      >
                        🧠 Obtener material con IA
                      </button>

                      {/* Mostrar material debajo del botón */}
                      {activeMeetingId === meeting.id && (
                        <div className="mt-3 bg-gray-700 p-3 rounded-lg border border-gray-600">
                          {geminiLoading ? (
                            <p className="text-indigo-300">Generando material de estudio...</p>
                          ) : geminiResponse ? (
                            <ul className="list-disc list-inside">{parseGeminiResponse(geminiResponse)}</ul>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No hay reuniones programadas.</p>
          )}

          {/* Formulario para crear nueva reunión */}
          <form onSubmit={handleCreateMeeting} className="mt-6 space-y-3">
            <h4 className="text-indigo-300 text-lg font-semibold mb-2">➕ Crear nueva reunión</h4>

            <div>
              <label className="block text-sm mb-1">Tema de la reunión</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                value={newMeeting.topic_name}
                onChange={(e) => setNewMeeting({ ...newMeeting, topic_name: e.target.value })}
                placeholder="Ejemplo: Límites, Derivadas..."
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Inicio</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                value={newMeeting.startTime}
                onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Fin</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                value={newMeeting.endTime}
                onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Tipo</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                value={newMeeting.type}
                onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>

            {newMeeting.type === "virtual" ? (
              <div>
                <label className="block text-sm mb-1">Link (Meet, Zoom, etc.)</label>
                <input
                  type="url"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                  value={newMeeting.link}
                  onChange={(e) => setNewMeeting({ ...newMeeting, link: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm mb-1">Lugar</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full mt-3"
            >
              Crear Reunión
            </button>
          </form>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          🧑‍💻 <strong>Creador:</strong> {group.creator.name} ({group.creator.email})
        </p>
      </div>
    </div>
  );
}
