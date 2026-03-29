'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

export default function EmployeeForm({ onCreated }) {
  const { register, handleSubmit, reset } = useForm();
  const [role, setRole] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setRole(parsedUser.role || null);
      } catch (error) {
        console.error('Error leyendo usuario del storage', error);
        setRole(null);
      }
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsCreating(true);
      await api.post('/employees', data);
      toast.success('Empleado creado');
      reset();
      onCreated();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al crear empleado');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mb-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <UserPlus size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Nuevo empleado
          </h2>
          <p className="text-sm text-slate-500">
            Añade un empleado al sistema de ToolTrack
          </p>
          {role === 'demo' && (
            <p className="mt-2 text-xs text-amber-600">
              La cuenta demo tiene un límite de creación de empleados.
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              {...register('nombre')}
              placeholder="Ej: Hugo"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Apellido
            </label>
            <input
              {...register('apellido')}
              placeholder="Ej: Do Vale"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Departamento
          </label>
          <input
            {...register('departamento')}
            placeholder="Ej: Consultoría"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCreating ? 'Creando...' : 'Crear empleado'}
          </button>
        </div>
      </form>
    </div>
  );
}