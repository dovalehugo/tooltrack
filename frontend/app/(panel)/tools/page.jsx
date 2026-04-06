'use client';

import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import api from '@/services/api';
import { toast } from 'react-toastify';

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState('');
  const [toolName, setToolName] = useState('');
  const [cantidadTotal, setCantidadTotal] = useState(1);
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

  const fetchTools = async () => {
    try {
      const res = await api.get('/tools');
      setTools(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando herramientas');
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const filteredTools = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return tools;

    return tools.filter((tool) => tool.nombre.toLowerCase().includes(term));
  }, [tools, search]);

  const handleCreateTool = async (e) => {
    e.preventDefault();

    if (!toolName.trim()) {
      toast.error('Debes indicar el nombre de la herramienta');
      return;
    }

    if (Number(cantidadTotal) < 1) {
      toast.error('La cantidad total debe ser al menos 1');
      return;
    }

    try {
      await api.post('/tools', {
        nombre: toolName,
        cantidadTotal: Number(cantidadTotal),
      });

      setToolName('');
      setCantidadTotal(1);
      fetchTools();
      toast.success('Herramienta creada correctamente');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al crear herramienta');
    }
  };

  const handleImportCSV = (e) => {
    if (isDemo) {
      toast.error('La cuenta demo no puede importar herramientas por CSV');
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
            cantidadTotal: row.cantidadTotal?.trim() || '',
          }));

          if (!rows.length) {
            toast.error('El archivo CSV está vacío o no es válido');
            return;
          }

          const res = await api.post('/tools/import', {
            tools: rows,
          });

          fetchTools();

          const inserted = res.data?.inserted || 0;
          const errors = res.data?.errors || [];

          if (errors.length > 0) {
            toast.warning(
              `Importación parcial: ${inserted} herramientas importadas, ${errors.length} filas con error`
            );
          } else {
            toast.success(`Importación completada: ${inserted} herramientas`);
          }
        } catch (error) {
          console.error(error);
          toast.error(
            error.response?.data?.message || 'Error al importar herramientas'
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

  const handleDeleteTool = async (tool) => {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar la herramienta "${tool.nombre}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tools/${tool._id}`);
      fetchTools();
      toast.success('Herramienta eliminada correctamente');
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Error al eliminar herramienta'
      );
    }
  };

  const getStockBadgeClasses = (tool) => {
    const total = Number(tool.cantidadTotal) || 0;
    const available = Number(tool.cantidadDisponible) || 0;

    if (available === 0) {
      return 'bg-red-100 text-red-700';
    }

    if (available < total) {
      return 'bg-amber-100 text-amber-700';
    }

    return 'bg-emerald-100 text-emerald-700';
  };

  const getStockLabel = (tool) => {
    const total = Number(tool.cantidadTotal) || 0;
    const available = Number(tool.cantidadDisponible) || 0;

    if (available === 0) return 'Sin stock';
    if (available < total) return 'Stock parcial';
    return 'Disponible';
  };

  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4 shadow-sm sm:mb-8 sm:p-6 lg:p-8">
        <div className="mb-4 h-1.5 w-20 rounded-full bg-blue-600 sm:w-24" />
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Herramientas
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Gestiona el inventario, añade herramientas manualmente e importa
          grandes volúmenes mediante archivos CSV.
        </p>
      </section>

      <div className="mb-6 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Nueva herramienta
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Añade herramientas manualmente de forma individual
            </p>
            {isDemo && (
              <p className="mt-2 text-xs text-amber-600">
                La cuenta demo tiene un límite de creación de herramientas.
              </p>
            )}
          </div>

          <div className="p-4 sm:p-5">
            <form onSubmit={handleCreateTool}>
              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nombre de la herramienta
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Taladro Bosch"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cantidad total
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cantidadTotal}
                    onChange={(e) => setCantidadTotal(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                  >
                    Añadir herramienta
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {!isDemo && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Importar herramientas por CSV
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Sube un archivo CSV con las columnas: nombre, cantidadTotal
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-5">
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
                        nombre, cantidadTotal
                      </span>
                    </p>
                    <div className="overflow-x-auto rounded-xl bg-white p-3 font-mono text-xs text-slate-500 ring-1 ring-slate-200">
                      <div className="min-w-[250px]">
                        nombre,cantidadTotal
                        <br />
                        Taladro Bosch,10
                        <br />
                        Martillo Stanley,25
                      </div>
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
                Listado de herramientas
              </h2>
              <p className="text-sm text-slate-500">
                Busca herramientas por nombre y revisa su stock disponible
              </p>
            </div>

            <div className="w-full sm:w-80">
              <input
                type="text"
                placeholder="Buscar herramienta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {filteredTools.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <div className="min-w-[980px]">
                  <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                    <div>Nombre</div>
                    <div>Total</div>
                    <div>Disponibles</div>
                    <div>Prestadas</div>
                    <div>Estado</div>
                    <div className="text-right">Acciones</div>
                  </div>

                  <div className="max-h-[900px] overflow-y-auto">
                    {filteredTools.map((tool) => {
                      const total = Number(tool.cantidadTotal) || 0;
                      const available = Number(tool.cantidadDisponible) || 0;
                      const borrowed = total - available;

                      return (
                        <div
                          key={tool._id}
                          className="grid grid-cols-6 items-center border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
                        >
                          <div className="font-medium text-slate-900">
                            {tool.nombre}
                          </div>

                          <div className="text-slate-700">{total}</div>
                          <div className="text-slate-700">{available}</div>
                          <div className="text-slate-700">{borrowed}</div>

                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStockBadgeClasses(
                                tool
                              )}`}
                            >
                              {getStockLabel(tool)}
                            </span>
                          </div>

                          <div className="text-right">
                            <button
                              onClick={() => handleDeleteTool(tool)}
                              className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:hidden">
                {filteredTools.map((tool) => {
                  const total = Number(tool.cantidadTotal) || 0;
                  const available = Number(tool.cantidadDisponible) || 0;
                  const borrowed = total - available;

                  return (
                    <div
                      key={tool._id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Herramienta
                          </p>
                          <p className="mt-1 font-medium text-slate-900">
                            {tool.nombre}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Total
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-900">
                              {total}
                            </p>
                          </div>

                          <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Disponibles
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-900">
                              {available}
                            </p>
                          </div>

                          <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Prestadas
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-900">
                              {borrowed}
                            </p>
                          </div>

                          <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Estado
                            </p>
                            <div className="mt-2">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStockBadgeClasses(
                                  tool
                                )}`}
                              >
                                {getStockLabel(tool)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-1">
                          <button
                            onClick={() => handleDeleteTool(tool)}
                            className="w-full rounded-xl bg-red-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No hay herramientas que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}