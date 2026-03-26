'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  UserCog,
  Users,
  Mail,
  Trash2,
  BadgeCheck,
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-toastify';

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [search, setSearch] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== 'admin') {
        toast.error('No tienes permisos para acceder a esta sección');
        router.push('/dashboard');
        return;
      }

      setAuthorized(true);
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error cargando usuarios');
    }
  };

  useEffect(() => {
    if (authorized) {
      fetchUsers();
    }
  }, [authorized]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) => {
      const fullName =
        `${user.nombre || ''} ${user.apellido || ''}`.toLowerCase();
      const emailMatch = user.email?.toLowerCase().includes(term);
      const roleMatch = user.role?.toLowerCase().includes(term);

      return fullName.includes(term) || emailMatch || roleMatch;
    });
  }, [users, search]);

  const createUser = async (e) => {
    e.preventDefault();

    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      toast.error('Debes completar todos los campos');
      return;
    }

    try {
      setIsCreating(true);

      await api.post('/users', {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
      });

      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');
      setRole('user');

      fetchUsers();
      toast.success('Usuario creado correctamente');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteUser = async (id) => {
    const storedUser = localStorage.getItem('user');
    let currentUserId = null;

    if (storedUser) {
      try {
        currentUserId = JSON.parse(storedUser).id;
      } catch (error) {
        currentUserId = null;
      }
    }

    if (id === currentUserId) {
      toast.error('No puedes eliminar tu propio usuario');
      return;
    }

    const confirmed = window.confirm(
      '¿Seguro que quieres eliminar este usuario?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
      toast.success('Usuario eliminado');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const getRoleClasses = (userRole) => {
    if (userRole === 'admin') {
      return 'bg-blue-100 text-blue-700';
    }

    return 'bg-slate-100 text-slate-700';
  };

  if (!authorized) return null;

  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-6 shadow-sm sm:p-8">
        <div className="mb-4 h-1.5 w-24 rounded-full bg-blue-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Usuarios
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Administra las cuentas de acceso a ToolTrack, asigna roles y controla
          qué usuarios pueden operar dentro de la plataforma.
        </p>
      </section>

      <div className="mb-6 grid gap-6 lg:grid-cols-2 lg:items-start">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <UserCog size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Nuevo usuario
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Crea cuentas con nombre, apellidos, correo y rol
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <form onSubmit={createUser} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Juan"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="usuario@tooltrack.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Introduce una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Rol
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isCreating ? 'Creando...' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Roles y permisos
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Controla qué nivel de acceso tiene cada cuenta
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-blue-700" />
                <h3 className="text-sm font-semibold text-blue-900">Admin</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-blue-800">
                Puede gestionar usuarios, empleados, herramientas, préstamos y
                el funcionamiento general del sistema.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Usuario
                </h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Utiliza la plataforma en el día a día, pero sin acceso a la
                administración de cuentas.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Listado de usuarios
              </h2>
              <p className="text-sm text-slate-500">
                Busca usuarios por nombre, correo o rol
              </p>
            </div>

            <div className="w-full sm:w-80">
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[950px]">
            <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              <div>Nombre</div>
              <div>Apellido</div>
              <div>Correo</div>
              <div>Rol</div>
              <div className="text-right">Acciones</div>
            </div>

            <div className="max-h-[720px] overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="grid grid-cols-5 items-center border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    <div className="font-medium text-slate-900">
                      {user.nombre || '-'}
                    </div>

                    <div className="text-slate-700">
                      {user.apellido || '-'}
                    </div>

                    <div className="text-slate-700">{user.email}</div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleClasses(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        <Trash2 size={15} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No hay usuarios que coincidan con la búsqueda.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}