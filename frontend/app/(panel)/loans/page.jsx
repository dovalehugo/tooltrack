'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tools, setTools] = useState([]);

  const [employee, setEmployee] = useState('');
  const [tool, setTool] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [loansRes, empRes, toolsRes] = await Promise.all([
        api.get('/loans'),
        api.get('/employees'),
        api.get('/tools'),
      ]);

      setLoans(loansRes.data);
      setEmployees(empRes.data);
      setTools(toolsRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando datos');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createLoan = async (e) => {
    e.preventDefault();

    if (!employee || !tool) {
      toast.error('Debes seleccionar empleado y herramienta');
      return;
    }

    try {
      await api.post('/loans', {
        employee,
        tool,
      });

      toast.success('Préstamo creado');
      setEmployee('');
      setTool('');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al crear préstamo');
    }
  };

  const returnLoan = async (id) => {
    try {
      await api.delete(`/loans/${id}`);
      fetchData();
      toast.success('Herramienta devuelta');
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Error al devolver herramienta'
      );
    }
  };

  const availableTools = useMemo(() => {
    return tools.filter((tool) => Number(tool.cantidadDisponible) > 0);
  }, [tools]);

  const filteredLoans = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return loans;

    return loans.filter((loan) => {
      const employeeName =
        `${loan.employee?.nombre || ''} ${loan.employee?.apellido || ''}`.toLowerCase();
      const toolName = `${loan.tool?.nombre || ''}`.toLowerCase();
      const status = `${loan.estado || ''}`.toLowerCase();

      return (
        employeeName.includes(term) ||
        toolName.includes(term) ||
        status.includes(term)
      );
    });
  }, [loans, search]);

  const getStatusClasses = (estado) => {
    if (estado === 'devuelto') {
      return 'bg-emerald-100 text-emerald-700';
    }

    return 'bg-amber-100 text-amber-700';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Préstamos</h1>

      <form
        onSubmit={createLoan}
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Empleado
            </label>
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Seleccionar empleado</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.nombre} {emp.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Herramienta
            </label>
            <select
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Seleccionar herramienta</option>
              {availableTools.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.nombre} ({t.cantidadDisponible} disponibles de {t.cantidadTotal})
                </option>
              ))}
            </select>
          </div>

          <div className="lg:self-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 lg:w-auto"
            >
              Crear préstamo
            </button>
          </div>
        </div>
      </form>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Listado de préstamos
              </h2>
              <p className="text-sm text-slate-500">
                Busca por empleado, herramienta o estado
              </p>
            </div>

            <div className="w-full sm:w-80">
              <input
                type="text"
                placeholder="Buscar préstamo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[950px]">
            <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              <div>Empleado</div>
              <div>Herramienta</div>
              <div>Fecha préstamo</div>
              <div>Fecha devolución</div>
              <div>Estado</div>
              <div className="text-right">Acciones</div>
            </div>

            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <div
                  key={loan._id}
                  className="grid grid-cols-6 items-center border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
                >
                  <div className="font-medium text-slate-900">
                    {loan.employee?.nombre} {loan.employee?.apellido}
                  </div>

                  <div className="text-slate-700">{loan.tool?.nombre}</div>

                  <div className="text-slate-600">
                    {formatDate(loan.fechaPrestamo)}
                  </div>

                  <div className="text-slate-600">
                    {loan.fechaDevolucionReal
                      ? formatDate(loan.fechaDevolucionReal)
                      : '-'}
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(loan.estado)}`}
                    >
                      {loan.estado}
                    </span>
                  </div>

                  <div className="text-right">
                    {loan.estado === 'activo' ? (
                      <button
                        onClick={() => returnLoan(loan._id)}
                        className="rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                      >
                        Devolver
                      </button>
                    ) : (
                      <span className="text-sm text-slate-500">Devuelto</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No hay préstamos que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}