'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/services/api';
import { toast } from 'react-toastify';

export default function EmployeeForm({ onCreated }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              placeholder="Ej: Hugo"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            {errors.nombre && (
              <p className="mt-2 text-sm text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Apellido
            </label>
            <input
              {...register('apellido', {
                required: 'El apellido es obligatorio',
              })}
              placeholder="Ej: Do Vale"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            {errors.apellido && (
              <p className="mt-2 text-sm text-red-500">
                {errors.apellido.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Departamento
          </label>
          <input
            {...register('departamento', {
              required: 'El departamento es obligatorio',
            })}
            placeholder="Ej: Consultoría"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
          {errors.departamento && (
            <p className="mt-2 text-sm text-red-500">
              {errors.departamento.message}
            </p>
          )}
        </div>

        {role === 'demo' && (
          <p className="text-xs text-amber-600">
            La cuenta demo tiene un límite de creación de empleados.
          </p>
        )}

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