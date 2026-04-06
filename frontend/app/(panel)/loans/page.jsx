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
  const [selectedTools, setSelectedTools] = useState([]);
  const [search, setSearch] = useState('');

  const [editingLoan, setEditingLoan] = useState(null);
  const [toolToAddInModal, setToolToAddInModal] = useState('');

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

  const availableTools = useMemo(() => {
    return tools.filter((toolItem) => {
      const isAlreadySelected = selectedTools.some(
        (selectedTool) => selectedTool._id === toolItem._id
      );

      return Number(toolItem.cantidadDisponible) > 0 && !isAlreadySelected;
    });
  }, [tools, selectedTools]);

  const filteredLoans = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return loans;

    return loans.filter((loan) => {
      const employeeName =
        `${loan.employee?.nombre || ''} ${loan.employee?.apellido || ''}`.toLowerCase();

      const toolNames = Array.isArray(loan.tools)
        ? loan.tools
            .map((toolItem) => toolItem?.nombre || '')
            .join(' ')
            .toLowerCase()
        : '';

      const status = `${loan.estado || ''}`.toLowerCase();

      return (
        employeeName.includes(term) ||
        toolNames.includes(term) ||
        status.includes(term)
      );
    });
  }, [loans, search]);

  const activeLoans = useMemo(
    () => filteredLoans.filter((loan) => loan.estado === 'activo'),
    [filteredLoans]
  );

  const returnedLoans = useMemo(
    () => filteredLoans.filter((loan) => loan.estado === 'devuelto'),
    [filteredLoans]
  );

  const addToolToList = () => {
    if (!tool) {
      toast.error('Debes seleccionar una herramienta');
      return;
    }

    const selectedTool = tools.find((toolItem) => toolItem._id === tool);

    if (!selectedTool) {
      toast.error('Herramienta no encontrada');
      return;
    }

    if (Number(selectedTool.cantidadDisponible) <= 0) {
      toast.error('No hay unidades disponibles de esta herramienta');
      return;
    }

    const alreadyAdded = selectedTools.some(
      (toolItem) => toolItem._id === selectedTool._id
    );

    if (alreadyAdded) {
      toast.error('Esa herramienta ya está añadida');
      return;
    }

    setSelectedTools((prev) => [...prev, selectedTool]);
    setTool('');
  };

  const removeToolFromList = (toolId) => {
    setSelectedTools((prev) =>
      prev.filter((toolItem) => toolItem._id !== toolId)
    );
  };

  const clearSelectedTools = () => {
    setSelectedTools([]);
    setTool('');
  };

  const createLoan = async (e) => {
    e.preventDefault();

    if (!employee) {
      toast.error('Debes seleccionar un empleado');
      return;
    }

    if (selectedTools.length === 0) {
      toast.error('Debes añadir al menos una herramienta');
      return;
    }

    try {
      const res = await api.post('/loans', {
        employee,
        tools: selectedTools.map((toolItem) => toolItem._id),
      });

      toast.success(res.data?.message || 'Operación realizada correctamente');
      setEmployee('');
      setTool('');
      setSelectedTools([]);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al guardar préstamo');
    }
  };

  const returnLoan = async (id) => {
    const confirmed = window.confirm(
      '¿Seguro que quieres devolver todas las herramientas de este préstamo?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/loans/${id}`);
      toast.success('Préstamo devuelto correctamente');
      closeEditModal();
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Error al devolver préstamo'
      );
    }
  };

  const openEditModal = (loan) => {
    setEditingLoan(loan);
    setToolToAddInModal('');
  };

  const closeEditModal = () => {
    setEditingLoan(null);
    setToolToAddInModal('');
  };

  const getModalAvailableTools = () => {
    if (!editingLoan) return [];

    const currentToolIds =
      editingLoan.tools?.map((toolItem) => toolItem._id) || [];

    return tools.filter((toolItem) => {
      const isAlreadyIncluded = currentToolIds.includes(toolItem._id);
      return Number(toolItem.cantidadDisponible) > 0 && !isAlreadyIncluded;
    });
  };

  const addToolToLoan = async () => {
    if (!editingLoan?._id) return;

    if (!toolToAddInModal) {
      toast.error('Debes seleccionar una herramienta');
      return;
    }

    try {
      const res = await api.post(`/loans/${editingLoan._id}/tools`, {
        toolId: toolToAddInModal,
      });

      toast.success(res.data?.message || 'Herramienta añadida al préstamo');
      setToolToAddInModal('');
      await fetchData();

      if (res.data?.loan) {
        setEditingLoan(res.data.loan);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Error al añadir herramienta'
      );
    }
  };

  const removeToolFromLoan = async (toolId, toolName) => {
    if (!editingLoan?._id) return;

    const confirmed = window.confirm(
      `¿Seguro que quieres quitar "${toolName}" de este préstamo?`
    );

    if (!confirmed) return;

    try {
      const res = await api.delete(`/loans/${editingLoan._id}/tools/${toolId}`);

      toast.success(res.data?.message || 'Herramienta eliminada del préstamo');
      await fetchData();

      if (res.data?.loan?.estado === 'devuelto') {
        closeEditModal();
        return;
      }

      if (res.data?.loan) {
        setEditingLoan(res.data.loan);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Error al quitar herramienta'
      );
    }
  };

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

  const getToolsText = (loan) => {
    if (!Array.isArray(loan?.tools) || loan.tools.length === 0) {
      return 'Sin herramientas';
    }

    return loan.tools.map((toolItem) => toolItem.nombre).join(', ');
  };

  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4 shadow-sm sm:mb-8 sm:p-6 lg:p-8">
        <div className="mb-4 h-1.5 w-20 rounded-full bg-blue-600 sm:w-24" />
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Préstamos
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Crea préstamos seleccionando un empleado y añadiendo una o varias
          herramientas. Si el empleado ya tiene un préstamo activo hoy, las
          nuevas herramientas se agregarán al existente.
        </p>
      </section>

      <form
        onSubmit={createLoan}
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_auto]">
          <div>
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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Herramienta
            </label>
            <select
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Seleccionar herramienta</option>
              {availableTools.map((toolItem) => (
                <option key={toolItem._id} value={toolItem._id}>
                  {toolItem.nombre} ({toolItem.cantidadDisponible} disponibles
                  de {toolItem.cantidadTotal})
                </option>
              ))}
            </select>
          </div>

          <div className="lg:self-end">
            <button
              type="button"
              onClick={addToolToList}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 lg:w-auto"
            >
              Añadir herramienta
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Herramientas preparadas
              </h2>
              <p className="text-sm text-slate-500">
                Puedes quitar una a una o vaciar toda la lista antes de guardar.
              </p>
            </div>

            <button
              type="button"
              onClick={clearSelectedTools}
              disabled={selectedTools.length === 0}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Vaciar lista
            </button>
          </div>

          {selectedTools.length > 0 ? (
            <div className="space-y-3">
              {selectedTools.map((selectedTool) => (
                <div
                  key={selectedTool._id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {selectedTool.nombre}
                    </p>
                    <p className="text-sm text-slate-500">
                      {selectedTool.cantidadDisponible} disponibles de{' '}
                      {selectedTool.cantidadTotal}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToolFromList(selectedTool._id)}
                    className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
              Aún no has añadido herramientas.
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Guardar préstamo
          </button>
        </div>
      </form>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Buscar préstamos
              </h2>
              <p className="text-sm text-slate-500">
                Busca por empleado, herramientas o estado
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
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Préstamos activos
          </h2>
          <p className="text-sm text-slate-500">
            Un empleado solo mantiene un préstamo activo por día
          </p>
        </div>

        <div className="p-4 sm:p-5">
          {activeLoans.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <div className="min-w-[1050px]">
                  <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                    <div>Empleado</div>
                    <div>Herramientas</div>
                    <div>Fecha préstamo</div>
                    <div>Estado</div>
                    <div className="text-right">Acciones</div>
                  </div>

                  {activeLoans.map((loan) => (
                    <div
                      key={loan._id}
                      className="grid grid-cols-5 items-center border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
                    >
                      <div className="font-medium text-slate-900">
                        {loan.employee?.nombre} {loan.employee?.apellido}
                      </div>

                      <div className="text-slate-700">
                        <div className="flex flex-wrap gap-2">
                          {loan.tools?.map((toolItem) => (
                            <span
                              key={toolItem._id}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {toolItem.nombre}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-slate-600">
                        {formatDate(loan.fechaPrestamo)}
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            loan.estado
                          )}`}
                        >
                          {loan.estado}
                        </span>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(loan)}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => returnLoan(loan._id)}
                          className="rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                        >
                          Devolver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 lg:hidden">
                {activeLoans.map((loan) => (
                  <div
                    key={loan._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Empleado
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {loan.employee?.nombre} {loan.employee?.apellido}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Herramientas
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {getToolsText(loan)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Fecha préstamo
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(loan.fechaPrestamo)}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            loan.estado
                          )}`}
                        >
                          {loan.estado}
                        </span>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <button
                          onClick={() => openEditModal(loan)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => returnLoan(loan._id)}
                          className="w-full rounded-xl bg-green-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                        >
                          Devolver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No hay préstamos activos que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Préstamos devueltos
          </h2>
          <p className="text-sm text-slate-500">
            Historial de préstamos cerrados
          </p>
        </div>

        <div className="p-4 sm:p-5">
          {returnedLoans.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <div className="min-w-[1050px]">
                  <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                    <div>Empleado</div>
                    <div>Herramientas</div>
                    <div>Fecha préstamo</div>
                    <div>Fecha devolución</div>
                    <div>Estado</div>
                  </div>

                  {returnedLoans.map((loan) => (
                    <div
                      key={loan._id}
                      className="grid grid-cols-5 items-center border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
                    >
                      <div className="font-medium text-slate-900">
                        {loan.employee?.nombre} {loan.employee?.apellido}
                      </div>

                      <div className="text-slate-700">
                        <div className="flex flex-wrap gap-2">
                          {loan.tools?.map((toolItem) => (
                            <span
                              key={toolItem._id}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {toolItem.nombre}
                            </span>
                          ))}
                        </div>
                      </div>

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
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            loan.estado
                          )}`}
                        >
                          {loan.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 lg:hidden">
                {returnedLoans.map((loan) => (
                  <div
                    key={loan._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Empleado
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {loan.employee?.nombre} {loan.employee?.apellido}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Herramientas
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {getToolsText(loan)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Fecha préstamo
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(loan.fechaPrestamo)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Fecha devolución
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {loan.fechaDevolucionReal
                            ? formatDate(loan.fechaDevolucionReal)
                            : '-'}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            loan.estado
                          )}`}
                        >
                          {loan.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No hay préstamos devueltos que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </section>

      {editingLoan && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-3xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-4 sm:p-5">
              <div className="pr-4">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Editar préstamo activo
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingLoan.employee?.nombre} {editingLoan.employee?.apellido}
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-6 p-4 sm:p-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Herramientas actuales
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Quita herramientas individuales o devuelve todo el préstamo.
                </p>

                <div className="mt-4 space-y-3">
                  {editingLoan.tools?.length > 0 ? (
                    editingLoan.tools.map((toolItem) => (
                      <div
                        key={toolItem._id}
                        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <p className="font-medium text-slate-900">
                          {toolItem.nombre}
                        </p>

                        <button
                          onClick={() =>
                            removeToolFromLoan(toolItem._id, toolItem.nombre)
                          }
                          className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                        >
                          Quitar
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
                      Este préstamo no tiene herramientas.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Añadir herramienta
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Solo se muestran herramientas disponibles que aún no están en
                  este préstamo.
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <select
                    value={toolToAddInModal}
                    onChange={(e) => setToolToAddInModal(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Seleccionar herramienta</option>
                    {getModalAvailableTools().map((toolItem) => (
                      <option key={toolItem._id} value={toolItem._id}>
                        {toolItem.nombre} ({toolItem.cantidadDisponible}{' '}
                        disponibles de {toolItem.cantidadTotal})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={addToolToLoan}
                    className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 sm:w-auto"
                  >
                    Añadir
                  </button>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-2 sm:flex-row sm:justify-between">
                <button
                  onClick={() => returnLoan(editingLoan._id)}
                  className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 sm:w-auto"
                >
                  Devolver todo el préstamo
                </button>

                <button
                  onClick={closeEditModal}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}