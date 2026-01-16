// src/pages/Admin/CuentasPorPagarPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import TablePagination from "../../components/ui/TablePagination";
import CuentaPorPagarFormModal from "../../components/ui/CuentaPorPagarFormModal";
import PagoProveedorModal from "../../components/ui/PagoProveedorModal";
import { useCuentasPorPagar } from "../../hooks/useCuentasPorPagar";
import { useProveedores } from "../../hooks/useProveedores";
import { toast } from "react-toastify";

const CuentasPorPagarPage = () => {
  const { cuentas, resumen, loading, createCuenta, registrarPago } = useCuentasPorPagar();
  const { proveedores } = useProveedores();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredCuentas = useMemo(() => {
    return cuentas.filter((c) => {
      const matchesSearch =
        c.Proveedor?.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.numero_factura_proveedor?.includes(searchTerm);

      let matchesStatus = true;
      if (statusFilter === "pendiente") matchesStatus = c.estado === "PENDIENTE";
      if (statusFilter === "parcial") matchesStatus = c.estado === "PARCIAL";
      if (statusFilter === "pagada") matchesStatus = c.estado === "PAGADA";
      if (statusFilter === "vencida") matchesStatus = c.dias_vencido > 0;

      return matchesSearch && matchesStatus;
    });
  }, [cuentas, searchTerm, statusFilter]);

  const sortedCuentas = useMemo(() => {
    let items = [...filteredCuentas];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const aVal = a[sortConfig.key]?.toString() || "";
        const bVal = b[sortConfig.key]?.toString() || "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [filteredCuentas, sortConfig]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedCuentas.slice(indexOfFirst, indexOfLast);
  const totalItems = sortedCuentas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSaveCuenta = async (data) => {
    try {
      await createCuenta(data);
      toast.success("Cuenta por pagar registrada");
      setIsFormModalOpen(false);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  };

  const handleOpenPago = (cuenta) => {
    setSelectedCuenta(cuenta);
    setIsPagoModalOpen(true);
  };

  const handleSavePago = async (data) => {
    try {
      await registrarPago(selectedCuenta.id_cuenta_pagar, data);
      toast.success("Pago registrado exitosamente");
      setIsPagoModalOpen(false);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  };

  const getStatusBadge = (estado, diasVencido) => {
    if (diasVencido > 0) {
      return (
        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          Vencida ({diasVencido}d)
        </span>
      );
    }
    const styles = {
      PENDIENTE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      PARCIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      PAGADA: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[estado] || ""}`}>
        {estado}
      </span>
    );
  };

  const columns = [
    {
      header: "Proveedor",
      render: (row) => row.Proveedor?.razon_social || "-",
      className: "font-medium text-text-primary dark:text-background-light",
    },
    {
      header: "# Factura",
      accessorKey: "numero_factura_proveedor",
      sortable: true,
    },
    {
      header: "Fecha Venc.",
      accessorKey: "fecha_vencimiento",
      sortable: true,
      render: (row) => new Date(row.fecha_vencimiento).toLocaleDateString("es-EC"),
    },
    {
      header: "Total",
      render: (row) => formatCurrency(row.monto_total),
      className: "text-right",
    },
    {
      header: "Pagado",
      render: (row) => formatCurrency(row.monto_pagado),
      className: "text-right text-green-600 dark:text-green-400",
    },
    {
      header: "Saldo",
      render: (row) => formatCurrency(row.saldo_pendiente),
      className: "text-right font-medium",
    },
    {
      header: "Estado",
      render: (row) => getStatusBadge(row.estado, row.dias_vencido),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (row) => (
        <div className="inline-flex gap-2">
          {row.estado !== "PAGADA" && (
            <button
              onClick={() => handleOpenPago(row)}
              className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 rounded-lg transition-colors"
              title="Registrar pago"
            >
              <span className="material-symbols-outlined text-lg">payments</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-background-light">
            Cuentas por Pagar
          </h1>
          <p className="text-text-secondary text-base dark:text-background-light/70">
            Gestione las facturas de proveedores y sus pagos.
          </p>
        </div>
        <Button
          onClick={() => setIsFormModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3"
        >
          <span className="material-symbols-outlined">add_card</span>
          Nueva Cuenta
        </Button>
      </div>

      {/* Resumen Cards */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
            <p className="text-sm text-text-secondary dark:text-background-light/70">Total Pendiente</p>
            <p className="text-2xl font-bold text-text-primary dark:text-background-light">
              {formatCurrency(resumen.total_pendiente)}
            </p>
          </div>
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
            <p className="text-sm text-text-secondary dark:text-background-light/70">Por Vencer (7d)</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatCurrency(resumen.por_vencer_7_dias)}
            </p>
          </div>
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
            <p className="text-sm text-text-secondary dark:text-background-light/70">Vencidas</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(resumen.total_vencido)}
            </p>
          </div>
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
            <p className="text-sm text-text-secondary dark:text-background-light/70">Cuentas Activas</p>
            <p className="text-2xl font-bold text-text-primary dark:text-background-light">
              {resumen.cuentas_activas || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/80">
            search
          </span>
          <input
            type="search"
            className="w-full rounded-lg border border-primary/30 bg-white/50 py-2 pl-10 pr-4 text-text-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            placeholder="Buscar por proveedor o # factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-primary/30 bg-white/50 py-2 px-4 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="parcial">Parciales</option>
          <option value="pagada">Pagadas</option>
          <option value="vencida">Vencidas</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 shadow-sm overflow-hidden mt-4">
        <Table
          columns={columns}
          data={currentItems}
          isLoading={loading}
          keyField="id_cuenta_pagar"
          sortConfig={sortConfig}
          onSort={handleSort}
          emptyText="No hay cuentas por pagar"
        />
      </div>

      <div className="mt-2">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          limit={itemsPerPage}
          onLimitChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
          totalItems={totalItems}
          showingFrom={indexOfFirst + 1}
          showingTo={Math.min(indexOfLast, totalItems)}
        />
      </div>

      <CuentaPorPagarFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveCuenta}
        proveedores={proveedores}
      />

      <PagoProveedorModal
        isOpen={isPagoModalOpen}
        onClose={() => setIsPagoModalOpen(false)}
        onSave={handleSavePago}
        cuenta={selectedCuenta}
      />
    </AdminLayout>
  );
};

export default CuentasPorPagarPage;
