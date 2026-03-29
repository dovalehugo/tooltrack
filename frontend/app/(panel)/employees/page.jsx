'use client';

import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import api from '@/services/api';
import EmployeeForm from '@/components/EmployeeForm';
import { toast } from 'react-toastify';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [role, setRole] = useState(null);

  const isDemo = role === 'demo';

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

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando empleados');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return employees;

    return employees.filter((emp) =>
      `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(term)
    );
  }, [employees, search]);

  const handleImportCSV = (e) => {
    if (isDemo) {
      toast.error('La cuenta demo no puede importar empleados por CSV');
      e.target.value = '';
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data.map((row) => ({
            nombre: row.nombre?.trim() || '',
            apellido: row.apellido?.trim() || '',
            departamento: row.departamento?.trim() || '',
          }));

          if (!rows.length) {
            toast.error('El archivo CSV está vacío o no es válido');
            return;
          }

          const res = await api.post('/employees/import', {
            employees: rows,
          });

          fetchEmployees();

          const inserted = res.data?.inserted || 0;
          const errors = res.data?.errors || [];

          if (errors.length > 0) {
            toast.warning(
              `Importación parcial: ${inserted} empleados importados, ${errors.length} filas con error`
            );
          } else {
            toast.success(`Importación completada: ${inserted} empleados`);
          }
        } catch (error) {
          console.error(error);
          toast.error(
            error.response?.data?.message || 'Error al importar empleados'
          );
        } finally {
          setIsImporting(false);
          e.target.value = '';
        }
      },
      error: (error) => {
        console.error(error);
        toast.error('No se pudo leer el archivo CSV');
        setIsImporting(false);
        e.target.value = '';
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-6 shadow-sm sm:p-8">
        <div className="mb-4 h-1.5 w-24 rounded-full bg-blue-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Empleados
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Gestiona tu plantilla, añade nuevos empleados y realiza importaciones
          masivas mediante archivos CSV.
        </p>
      </section>

      <div className="mb-6 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Nuevo empleado
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Añade empleados manualmente de forma individual
            </p>
          </div>

          <div className="p-5">
            <EmployeeForm onCreated={fetchEmployees} />
          </div>
        </div>

        {!isDemo && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Importar empleados por CSV
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Sube un archivo CSV con las columnas: nombre, apellido,
                departamento
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex flex-col gap-4">
                  <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto">
                    {isImporting ? 'Importando...' : 'Seleccionar archivo CSV'}
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportCSV}
                      disabled={isImporting}
                      className="hidden"
                    />
                  </label>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      Formato esperado:{' '}
                      <span className="font-semibold text-slate-800">
                        nombre, apellido, departamento
                      </span>
                    </p>
                    <div className="rounded-xl bg-white p-3 font-mono text-xs text-slate-500 ring-1 ring-slate-200">
                      nombre,apellido,departamento
                      <br />
                      Juan,Pérez,IT
                      <br />
                      Ana,García,RRHH
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Listado de empleados
              </h2>
              <p className="text-sm text-slate-500">
                Busca empleados por nombre o apellido
              </p>
            </div>

            <div className="w-full sm:w-80">
              <input
                type="text"
                placeholder="Buscar empleado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              <div>Nombre</div>
              <div>Apellido</div>
              <div>Departamento</div>
              <div className="text-right">Acciones</div>
            </div>

            <div className="max-h-[900px] overflow-y-auto">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <div
                    key={emp._id}
                    className="grid grid-cols-4 items-center border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    <div className="font-medium text-slate-900">
                      {emp.nombre}
                    </div>
                    <div className="text-slate-700">{emp.apellido}</div>
                    <div className="text-slate-600">{emp.departamento}</div>
                    <div className="text-right">
                      <button
                        onClick={async () => {
                          try {
                            await api.delete(`/employees/${emp._id}`);
                            fetchEmployees();
                          } catch (error) {
                            console.error(error);
                            toast.error(
                              error.response?.data?.message ||
                                'Error al eliminar empleado'
                            );
                          }
                        }}
                        className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No hay empleados que coincidan con la búsqueda.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}