// src/pages/Admin/ContabilidadPage.jsx
import React, { useState, useMemo } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { useContabilidad } from "../../hooks/useContabilidad";
import { toast } from "react-toastify";

const ContabilidadPage = () => {
  const {
    periodos,
    asientos,
    planCuentas,
    loading,
    createPeriodo,
    closePeriodo,
    approveAsiento,
    annulAsiento,
  } = useContabilidad();

  const [activeTab, setActiveTab] = useState("periodos");
  const [showNewPeriodoModal, setShowNewPeriodoModal] = useState(false);

  const formatCurrency = (v) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(v || 0);

  // Período actual (el más reciente abierto)
  const periodoActual = useMemo(() => 
    periodos.find((p) => !p.cerrado) || periodos[0],
    [periodos]
  );

  // Resumen rápido
  const resumen = useMemo(() => ({
    totalAsientos: asientos.length,
    asientosPendientes: asientos.filter((a) => a.estado === "BORRADOR").length,
    asientosAprobados: asientos.filter((a) => a.estado === "APROBADO").length,
    periodosAbiertos: periodos.filter((p) => !p.cerrado).length,
  }), [asientos, periodos]);

  const handleClosePeriodo = async (id) => {
    if (!confirm("¿Está seguro de cerrar este período? Esta acción no se puede deshacer.")) return;
    try {
      await closePeriodo(id);
      toast.success("Período cerrado exitosamente");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleApproveAsiento = async (id) => {
    try {
      await approveAsiento(id);
      toast.success("Asiento aprobado");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAnnulAsiento = async (id) => {
    const motivo = prompt("Ingrese el motivo de anulación:");
    if (!motivo) return;
    try {
      await annulAsiento(id, motivo);
      toast.success("Asiento anulado");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const periodosColumns = [
    { header: "Año", accessorKey: "anio" },
    { header: "Mes", accessorKey: "mes" },
    {
      header: "Inicio",
      render: (row) => new Date(row.fecha_inicio).toLocaleDateString("es-EC"),
    },
    {
      header: "Fin",
      render: (row) => new Date(row.fecha_fin).toLocaleDateString("es-EC"),
    },
    {
      header: "Estado",
      render: (row) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
          row.cerrado
            ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
        }`}>
          {row.cerrado ? "Cerrado" : "Abierto"}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (row) =>
        !row.cerrado && (
          <button
            onClick={() => handleClosePeriodo(row.id_periodo_contable)}
            className="p-2 text-red-600 hover:text-red-800 rounded-lg"
            title="Cerrar período"
          >
            <span className="material-symbols-outlined text-lg">lock</span>
          </button>
        ),
    },
  ];

  const asientosColumns = [
    { header: "#", accessorKey: "numero_asiento" },
    {
      header: "Fecha",
      render: (row) => new Date(row.fecha_asiento).toLocaleDateString("es-EC"),
    },
    { header: "Descripción", accessorKey: "descripcion" },
    { header: "Tipo", accessorKey: "tipo_asiento" },
    {
      header: "Total",
      render: (row) => formatCurrency(row.total_debe),
      className: "text-right",
    },
    {
      header: "Estado",
      render: (row) => {
        const styles = {
          BORRADOR: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          APROBADO: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          ANULADO: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        };
        return (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[row.estado] || ""}`}>
            {row.estado}
          </span>
        );
      },
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (row) => (
        <div className="inline-flex gap-1">
          {row.estado === "BORRADOR" && (
            <button
              onClick={() => handleApproveAsiento(row.id_asiento_contable)}
              className="p-2 text-green-600 hover:text-green-800 rounded-lg"
              title="Aprobar"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </button>
          )}
          {row.estado === "APROBADO" && (
            <button
              onClick={() => handleAnnulAsiento(row.id_asiento_contable)}
              className="p-2 text-red-600 hover:text-red-800 rounded-lg"
              title="Anular"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  const tabs = [
    { id: "periodos", label: "Períodos", icon: "calendar_month" },
    { id: "asientos", label: "Asientos", icon: "receipt_long" },
    { id: "plan", label: "Plan Cuentas", icon: "account_tree" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-background-light">
            Contabilidad
          </h1>
          <p className="text-text-secondary dark:text-background-light/70">
            Gestión de períodos contables, asientos y plan de cuentas.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
          <p className="text-sm text-text-secondary dark:text-background-light/70">Período Actual</p>
          <p className="text-xl font-bold text-text-primary dark:text-background-light">
            {periodoActual ? `${periodoActual.mes}/${periodoActual.anio}` : "Sin período"}
          </p>
        </div>
        <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
          <p className="text-sm text-text-secondary dark:text-background-light/70">Asientos Pendientes</p>
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{resumen.asientosPendientes}</p>
        </div>
        <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
          <p className="text-sm text-text-secondary dark:text-background-light/70">Asientos Aprobados</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{resumen.asientosAprobados}</p>
        </div>
        <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
          <p className="text-sm text-text-secondary dark:text-background-light/70">Total Asientos</p>
          <p className="text-xl font-bold text-text-primary dark:text-background-light">{resumen.totalAsientos}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mt-6 border-b border-primary/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "periodos" && (
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            <Table
              columns={periodosColumns}
              data={periodos}
              isLoading={loading}
              keyField="id_periodo_contable"
              emptyText="No hay períodos contables"
            />
          </div>
        )}

        {activeTab === "asientos" && (
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            <Table
              columns={asientosColumns}
              data={asientos}
              isLoading={loading}
              keyField="id_asiento_contable"
              emptyText="No hay asientos contables"
            />
          </div>
        )}

        {activeTab === "plan" && (
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6">
            <h3 className="font-semibold text-lg text-text-primary dark:text-background-light mb-4">
              Plan de Cuentas
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {planCuentas.length === 0 ? (
                <p className="text-text-secondary dark:text-background-light/70">
                  No hay cuentas registradas
                </p>
              ) : (
                planCuentas.map((cuenta) => (
                  <div
                    key={cuenta.id_plan_cuenta}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    style={{ paddingLeft: `${(cuenta.nivel || 1) * 16}px` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-text-secondary dark:text-background-light/70">
                        {cuenta.codigo}
                      </span>
                      <span className="text-text-primary dark:text-background-light">
                        {cuenta.nombre}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      cuenta.tipo === "ACTIVO" ? "bg-blue-100 text-blue-700" :
                      cuenta.tipo === "PASIVO" ? "bg-red-100 text-red-700" :
                      cuenta.tipo === "PATRIMONIO" ? "bg-purple-100 text-purple-700" :
                      cuenta.tipo === "INGRESO" ? "bg-green-100 text-green-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {cuenta.tipo}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContabilidadPage;
