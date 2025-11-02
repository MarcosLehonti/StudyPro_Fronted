// src/pages/Profile.tsx
import React, { useEffect, useMemo, useState } from 'react';

type UserProfile = {
  id?: number;
  name: string;
  email: string;
  numberreg: number;
  semester: number;
  role: 'admin' | 'estudiante' | 'auxiliar';
};

type ProfileForm = {
  name: string;
  email: string;
  numberreg: string;
  semester: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/users';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    email: '',
    numberreg: '',
    semester: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [pwdForm, setPwdForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('token');

  const authFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
      throw new Error('No token');
    }
    const headers = new Headers(init?.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    return fetch(input, { ...init, headers });
  };

  // Cargar perfil
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await authFetch(`${API_URL}/profile`, { method: 'GET' });
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message ?? 'Error al cargar el perfil');
        }
        const data: Partial<UserProfile> = await res.json();

        if (!mounted) return;

        const normalized: UserProfile = {
          id: data.id,
          name: data.name ?? '',
          email: data.email ?? '',
          numberreg: Number(data.numberreg ?? 0),
          semester: Number(data.semester ?? 0),
          role: (data.role as UserProfile['role']) ?? 'estudiante',
        };
        setProfile(normalized);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? 'Error al cargar el perfil');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Inicializar formulario de perfil cuando llega el perfil
  const initialProfileForm: ProfileForm = useMemo(() => ({
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    numberreg: profile?.numberreg != null ? String(profile.numberreg) : '',
    semester: profile?.semester != null ? String(profile.semester) : '',
  }), [profile]);

  useEffect(() => { setProfileForm(initialProfileForm); }, [initialProfileForm]);

  // --- Handlers Perfil ---
  const onChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const body = {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        numberreg: Number(profileForm.numberreg),
        semester: Number(profileForm.semester),
      };

      const res = await authFetch(`${API_URL}/profile`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? 'No se pudo guardar');

      // Sincroniza UI con lo que devuelve el backend
      setProfile((prev) => prev ? {
        ...prev,
        name: data.name ?? prev.name,
        email: data.email ?? prev.email,
        numberreg: data.numberreg ?? prev.numberreg,
        semester: data.semester ?? prev.semester,
      } : prev);

      setProfileMsg('Perfil actualizado correctamente');
    } catch (err: any) {
      setProfileMsg(err?.message ?? 'Error al actualizar perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Handlers Password ---
  const onChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPwdForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPwd(true);
    setPwdMsg(null);

    try {
      if (!pwdForm.currentPassword || !pwdForm.newPassword) {
        throw new Error('Completa la contraseña actual y la nueva contraseña');
      }
      if (pwdForm.newPassword !== pwdForm.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const res = await authFetch(`${API_URL}/profile/password`, {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: pwdForm.currentPassword,
          newPassword: pwdForm.newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? 'No se pudo cambiar la contraseña');

      setPwdMsg('Contraseña cambiada correctamente');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPwdMsg(err?.message ?? 'Error al cambiar contraseña');
    } finally {
      setSavingPwd(false);
    }
  };

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // --- Error card ---
  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfil de usuario</h2>
        <p className="text-red-600 mb-4">Error: {error}</p>
        <a href="/login" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 underline">
          Ir al login
        </a>
      </div>
    );
  }

  // --- UI principal ---
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-10">
      <h2 className="text-2xl font-bold text-gray-900">Perfil de usuario</h2>

      {/* Mensaje global */}
      {(profileMsg || pwdMsg) && (
        <div className="rounded-md bg-indigo-50 p-3 text-sm text-indigo-800">
          {profileMsg || pwdMsg}
        </div>
      )}

      {/* ---------- FORMULARIO PERFIL ---------- */}
      <form className="space-y-6" onSubmit={onSubmitProfile}>
        {/* Foto (placeholder) */}
        <div className="flex items-center space-x-4">
          <img
            className="h-16 w-16 rounded-full ring-2 ring-gray-300 object-cover"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            alt="Foto de perfil"
          />
          <div>
            <button
              type="button"
              onClick={() => alert('Funcionalidad de foto no implementada')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Cambiar foto
            </button>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={profileForm.name}
            onChange={onChangeProfile}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={profileForm.email}
            onChange={onChangeProfile}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Número de registro */}
        <div>
          <label htmlFor="numberreg" className="block text-sm font-medium text-gray-700">
            Número de registro
          </label>
          <input
            type="number"
            name="numberreg"
            id="numberreg"
            value={profileForm.numberreg}
            onChange={onChangeProfile}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Semestre */}
        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
            Semestre
          </label>
          <input
            type="number"
            name="semester"
            id="semester"
            value={profileForm.semester}
            onChange={onChangeProfile}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Rol (solo lectura) */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Rol
          </label>
          <input
            type="text"
            id="role"
            value={profile?.role ?? ''}
            disabled
            className="mt-2 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
          />
        </div>

        {/* Botón guardar perfil */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
          >
            {savingProfile ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {/* ---------- FORMULARIO CAMBIAR CONTRASEÑA ---------- */}
      <form className="space-y-4 border-t pt-6" onSubmit={onSubmitPwd}>
        <h3 className="text-lg font-semibold text-gray-900">Cambiar contraseña</h3>
        <p className="text-xs text-gray-500">Ingresa tu contraseña actual y la nueva.</p>

        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Contraseña actual
          </label>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            value={pwdForm.currentPassword}
            onChange={onChangePwd}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Nueva contraseña
          </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            value={pwdForm.newPassword}
            onChange={onChangePwd}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={pwdForm.confirmPassword}
            onChange={onChangePwd}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPwd}
            className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-60"
          >
            {savingPwd ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
}
