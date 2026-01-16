// src/pages/Admin/CuentasBancariasPage.jsx
import React, { useState, useMemo } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import CuentaBancariaFormModal from "../../components/ui/CuentaBancariaFormModal";
import MovimientoModal from "../../components/ui/MovimientoModal";
import TransferenciaModal from "../../components/ui/TransferenciaModal";
import { useCuentasBancarias } from "../../hooks/useCuentasBancarias";
import { toast } from "react-toastify";

const CuentasBancariasPage = () => {
  const {
    cuentas,
    catalogs,
    resumen,
    loading,
    createCuenta,
    registrarMovimiento,
    transferir,
  } = useCuentasBancarias();

  const [isCuentaModalOpen, setIsCuentaModalOpen] = useState(false);
  const [isMovimientoModalOpen, setIsMovimientoModalOpen] = useState(false);
  const [isTransferenciaModalOpen, setIsTransferenciaModalOpen] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value || 0);

  const handleSaveCuenta = async (data) => {
    try {
      await createCuenta(data);
      toast.success("Cuenta creada exitosamente");
      setIsCuentaModalOpen(false);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  };

  const handleOpenMovimiento = (cuenta) => {
    setSelectedCuenta(cuenta);
    setIsMovimientoModalOpen(true);
  };

  const handleSaveMovimiento = async (data) => {
    try {
      await registrarMovimiento(data);
      toast.success("Movimiento registrado");
      setIsMovimientoModalOpen(false);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  };

  const handleSaveTransferencia = async (data) => {
    try {
      await transferir(data);
      toast.success("Transferencia realizada");
      setIsTransferenciaModalOpen(false);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  };

  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
      className: "font-medium text-text-primary dark:text-background-light",
    },
    {
      header: "Tipo",
      render: (row) => row.tipo_cuenta_bancaria?.nombre || "-",
    },
    {
      header: "Banco",
      accessorKey: "nombre_banco",
    },
    {
      header: "# Cuenta",
      accessorKey: "numero_cuenta",
      className: "font-mono text-sm",
    },
    {
      header: "Saldo",
      className: "text-right",
      render: (row) => (
        <span className={`font-bold ${parseFloat(row.saldo_actual) < 0 ? 'text-red-600' : 'text-green-600'}`}>
          {formatCurrency(row.saldo_actual)}
        </span>
      ),
    },
    {
      header: "Estado",
      render: (row) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
          row.activa
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {row.activa ? "Activa" : "Inactiva"}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (row) => (
        <div className="inline-flex gap-1">
          <button
            onClick={() => handleOpenMovimiento(row)}
            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 rounded-lg"
            title="Registrar movimiento"
          >
            <span className="material-symbols-outlined text-lg">add_card</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-background-light">
            Caja y Bancos
          </h1>
          <p className="text-text-secondary text-base dark:text-background-light/70">
            Gestione las cuentas bancarias, caja y movimientos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsTransferenciaModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700"
            disabled={cuentas.length < 2}
          >
            <span className="material-symbols-outlined">sync_alt</span>
            Transferir
          </Button>
          <Button
            onClick={() => setIsCuentaModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2"
          >
            <span className="material-symbols-outlined">add</span>
            Nueva Cuenta
          </Button>
        </div>
      </div>

      {/* Resumen Cards */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">
                  account_balance_wallet
                </span>
              </div>
              <div>
                <p className="text-sm text-text-secondary dark:text-background-light/70">Total Disponible</p>
                <p className="text-2xl font-bold text-text-primary dark:text-background-light">
                  {formatCurrency(resumen.total_disponible)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <span className="material-symbols-outlined text-2xl text-amber-600 dark:text-amber-400">
                  point_of_sale
                </span>
              </div>
              <div>
                <p className="text-sm text-text-secondary dark:text-background-light/70">Total en Caja</p>
                <p className="text-2xl font-bold text-text-primary dark:text-background-light">
                  {formatCurrency(resumen.total_cajas)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">
                  account_balance
                </span>
              </div>
              <div>
                <p className="text-sm text-text-secondary dark:text-background-light/70">Total en Bancos</p>
                <p className="text-2xl font-bold text-text-primary dark:text-background-light">
                  {formatCurrency(resumen.total_bancos)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accounts Table */}
      <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 shadow-sm overflow-hidden mt-6">
        <Table
          columns={columns}
          data={cuentas}
          isLoading={loading}
          keyField="id_cuenta_bancaria"
          emptyText="No hay cuentas registradas"
        />
      </div>

      {/* Modals */}
      <CuentaBancariaFormModal
        isOpen={isCuentaModalOpen}
        onClose={() => setIsCuentaModalOpen(false)}
        onSave={handleSaveCuenta}
        catalogs={catalogs}
      />

      <MovimientoModal
        isOpen={isMovimientoModalOpen}
        onClose={() => setIsMovimientoModalOpen(false)}
        onSave={handleSaveMovimiento}
        cuenta={selectedCuenta}
      />

      <TransferenciaModal
        isOpen={isTransferenciaModalOpen}
        onClose={() => setIsTransferenciaModalOpen(false)}
        onSave={handleSaveTransferencia}
        cuentas={cuentas}
      />
    </AdminLayout>
  );
};

export default CuentasBancariasPage;
