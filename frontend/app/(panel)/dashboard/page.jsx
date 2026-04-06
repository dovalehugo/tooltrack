'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Wrench,
  PackageCheck,
  ArrowRightLeft,
  AlertTriangle,
  Clock3,
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error leyendo usuario', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  const getToolsLabel = (loan) => {
    if (!Array.isArray(loan?.tools) || loan.tools.length === 0) {
      return 'Sin herramientas';
    }

    return loan.tools.map((tool) => tool?.nombre).filter(Boolean).join(', ');
  };

  const kpis = data?.kpis || {
    totalEmployees: 0,
    totalTools: 0,
    totalAvailable: 0,
    totalBorrowed: 0,
    outOfStockCount: 0,
  };

  const cards = [
    {
      title: 'Empleados totales',
      value: kpis.totalEmployees,
      icon: Users,
      ring: 'ring-blue-100',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Herramientas totales',
      value: kpis.totalTools,
      icon: Wrench,
      ring: 'ring-slate-100',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
    },
    {
      title: 'Disponibles',
      value: kpis.totalAvailable,
      icon: PackageCheck,
      ring: 'ring-emerald-100',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Prestadas',
      value: kpis.totalBorrowed,
      icon: ArrowRightLeft,
      ring: 'ring-amber-100',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Sin stock',
      value: kpis.outOfStockCount,
      icon: AlertTriangle,
      ring: 'ring-red-100',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-6 shadow-sm sm:p-8">
        <div className="mb-4 h-1.5 w-24 rounded-full bg-blue-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {currentUser?.nombre
            ? `Bienvenido, ${currentUser.nombre}`
            : 'Dashboard'}
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          {currentUser?.nombre && currentUser?.apellido
            ? `Sesión iniciada como ${currentUser.nombre} ${currentUser.apellido}. Aquí tienes un resumen del estado actual del sistema.`
            : 'Visualiza el estado general del sistema, actividad reciente y métricas clave.'}
        </p>
      </section>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : (
        <>
          <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ${card.ring}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {card.title}
                      </p>
                      <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                        {card.value}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl p-3 ${card.iconBg} ${card.iconColor}`}
                    >
                      <Icon size={22} />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="mb-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Inventario crítico
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Herramientas sin stock o con unidades bajas disponibles
                </p>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {data?.outOfStockTools?.length === 0 &&
                  data?.lowStockTools?.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                      No hay alertas de inventario ahora mismo.
                    </div>
                  ) : (
                    <>
                      {data?.outOfStockTools?.map((tool) => (
                        <div
                          key={`out-${tool._id}`}
                          className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-slate-900">
                              {tool.nombre}
                            </p>
                            <p className="text-sm text-red-700">Sin stock</p>
                          </div>
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            0 disponibles
                          </span>
                        </div>
                      ))}

                      {data?.lowStockTools?.map((tool) => (
                        <div
                          key={`low-${tool._id}`}
                          className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-slate-900">
                              {tool.nombre}
                            </p>
                            <p className="text-sm text-amber-700">
                              Stock bajo
                            </p>
                          </div>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            {tool.cantidadDisponible} disponibles
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Actividad reciente
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Últimos préstamos registrados en el sistema
                </p>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {data?.recentLoans?.length > 0 ? (
                    data.recentLoans.map((loan) => (
                      <div
                        key={loan._id}
                        className="flex items-start justify-between rounded-xl border border-slate-200 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {loan.employee?.nombre} {loan.employee?.apellido}
                          </p>
                          <p className="text-sm text-slate-600">
                            {getToolsLabel(loan)}
                          </p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              loan.estado === 'activo'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {loan.estado}
                          </span>
                          <p className="mt-2 text-xs text-slate-500">
                            {formatDate(loan.fechaPrestamo)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                      Todavía no hay actividad registrada.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <Clock3 className="text-slate-500" size={18} />
                <h2 className="text-lg font-semibold text-slate-900">
                  Préstamos activos
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Herramientas actualmente asignadas a empleados
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                  <div>Empleado</div>
                  <div>Herramientas</div>
                  <div>Fecha préstamo</div>
                  <div>Estado</div>
                </div>

                <div className="max-h-[520px] overflow-y-auto">
                  {data?.activeLoans?.length > 0 ? (
                    data.activeLoans.map((loan) => (
                      <div
                        key={loan._id}
                        className="grid grid-cols-4 items-center border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
                      >
                        <div className="font-medium text-slate-900">
                          {loan.employee?.nombre} {loan.employee?.apellido}
                        </div>
                        <div className="text-slate-700">
                          {getToolsLabel(loan)}
                        </div>
                        <div className="text-slate-600">
                          {formatDate(loan.fechaPrestamo)}
                        </div>
                        <div>
                          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            Activo
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      No hay préstamos activos en este momento.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}