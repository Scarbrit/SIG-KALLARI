// src/components/ui/TransferenciaModal.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Button from "./Button";

const TransferenciaModal = ({ isOpen, onClose, onSave, cuentas }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const idOrigen = watch("id_cuenta_origen");

  useEffect(() => {
    if (isOpen) {
      reset({
        id_cuenta_origen: "",
        id_cuenta_destino: "",
        monto: "",
        concepto: "Transferencia entre cuentas",
        referencia: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    if (data.id_cuenta_origen === data.id_cuenta_destino) {
      return;
    }
    const result = await onSave({
      ...data,
      id_cuenta_origen: parseInt(data.id_cuenta_origen),
      id_cuenta_destino: parseInt(data.id_cuenta_destino),
      monto: parseFloat(data.monto),
    });
    if (result?.success) onClose();
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value || 0);

  const cuentaOrigen = cuentas.find((c) => c.id_cuenta_bancaria === parseInt(idOrigen));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transferencia entre Cuentas">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Cuenta Origen <span className="text-red-500">*</span>
          </label>
          <select
            {...register("id_cuenta_origen", { required: "Seleccione cuenta origen" })}
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          >
            <option value="">Seleccionar...</option>
            {cuentas.filter((c) => c.activa).map((c) => (
              <option key={c.id_cuenta_bancaria} value={c.id_cuenta_bancaria}>
                {c.nombre} - {formatCurrency(c.saldo_actual)}
              </option>
            ))}
          </select>
          {errors.id_cuenta_origen && (
            <p className="mt-1 text-sm text-red-500">{errors.id_cuenta_origen.message}</p>
          )}
        </div>

        {cuentaOrigen && (
          <div className="flex items-center justify-center py-2">
            <span className="material-symbols-outlined text-3xl text-primary animate-bounce">
              arrow_downward
            </span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Cuenta Destino <span className="text-red-500">*</span>
          </label>
          <select
            {...register("id_cuenta_destino", {
              required: "Seleccione cuenta destino",
              validate: (v) => v !== idOrigen || "Las cuentas deben ser diferentes",
            })}
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          >
            <option value="">Seleccionar...</option>
            {cuentas
              .filter((c) => c.activa && c.id_cuenta_bancaria !== parseInt(idOrigen))
              .map((c) => (
                <option key={c.id_cuenta_bancaria} value={c.id_cuenta_bancaria}>
                  {c.nombre} - {formatCurrency(c.saldo_actual)}
                </option>
              ))}
          </select>
          {errors.id_cuenta_destino && (
            <p className="mt-1 text-sm text-red-500">{errors.id_cuenta_destino.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Monto a Transferir ($) <span className="text-red-500">*</span>
          </label>
          <input
            {...register("monto", {
              required: "Ingrese el monto",
              min: { value: 0.01, message: "Monto mínimo: $0.01" },
              max: cuentaOrigen
                ? { value: cuentaOrigen.saldo_actual, message: `Máximo disponible: ${formatCurrency(cuentaOrigen.saldo_actual)}` }
                : undefined,
            })}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
          {errors.monto && <p className="mt-1 text-sm text-red-500">{errors.monto.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Concepto
          </label>
          <input
            {...register("concepto")}
            placeholder="Motivo de la transferencia"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-primary/10">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary">
            Cancelar
          </button>
          <Button type="submit" disabled={isSubmitting}>
            <span className="material-symbols-outlined text-lg mr-1">sync_alt</span>
            {isSubmitting ? "Procesando..." : "Transferir"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferenciaModal;
