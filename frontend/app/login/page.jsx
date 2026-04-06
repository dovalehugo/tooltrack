'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Wrench, ShieldCheck, Users, ArrowRightLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await api.post('/auth/login', data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success('Inicio de sesión correcto');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-slate-900 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_30%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <div>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/90 backdrop-blur">
                <div className="rounded-xl bg-blue-500/20 p-2 text-blue-300">
                  <Wrench size={20} />
                </div>
                <span className="text-sm font-medium tracking-wide">
                  Plataforma de control de herramientas
                </span>
              </div>

              <div className="mt-10 max-w-xl">
                <h1 className="text-5xl font-extrabold tracking-tight text-white xl:text-6xl">
                  ToolTrack
                </h1>

                <p className="mt-6 text-lg leading-8 text-slate-300">
                  Gestiona préstamos de herramientas, controla el inventario en
                  tiempo real y mantén trazabilidad completa de la operación en
                  entornos industriales.
                </p>

                <p className="mt-4 text-base leading-7 text-slate-400">
                  Diseñada para equipos de montaje, tubería, soldadura y
                  mantenimiento que necesitan orden, visibilidad y control sobre
                  los recursos de trabajo.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="mb-3 inline-flex rounded-xl bg-emerald-500/15 p-2 text-emerald-300">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Control seguro
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Acceso protegido y trazabilidad de cada movimiento.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="mb-3 inline-flex rounded-xl bg-blue-500/15 p-2 text-blue-300">
                  <ArrowRightLeft size={18} />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Préstamos claros
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Saber quién tiene cada herramienta y desde cuándo.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="mb-3 inline-flex rounded-xl bg-amber-500/15 p-2 text-amber-300">
                  <Users size={18} />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Operación ordenada
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Empleados, stock y actividad reciente en un solo sitio.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 h-1.5 w-24 rounded-full bg-blue-600" />
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                ToolTrack
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Controla el préstamo de herramientas y mantén el inventario
                organizado en tiempo real.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Iniciar sesión
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Accede a la plataforma para gestionar empleados,
                  herramientas, préstamos e inventario.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="admin@tooltrack.com"
                    {...register('email', {
                      required: 'El correo es obligatorio',
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'La contraseña es obligatoria',
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Entrando...' : 'Entrar al panel'}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-sm font-semibold text-amber-900">
                  Demo disponible
                </h3>
                <p className="mt-2 text-sm text-amber-800">
                  Correo: demo@tooltrack.com
                </p>
                <p className="mt-1 text-sm text-amber-800">
                  Contraseña: Demo1234*
                </p>
                <p className="mt-3 text-xs leading-6 text-amber-700">
                  Esta cuenta permite probar la aplicación con permisos
                  limitados.
                </p>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  <strong>Importante:</strong> La primera carga puede tardar unos segundos. El backend está alojado en un servicio gratuito y puede entrar en reposo tras un tiempo de inactividad.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}