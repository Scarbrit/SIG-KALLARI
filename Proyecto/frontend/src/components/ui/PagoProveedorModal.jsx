// src/components/ui/PagoProveedorModal.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Button from "./Button";

const PagoProveedorModal = ({ isOpen, onClose, onSave, cuenta }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const montoPago = watch("monto_pago");

  useEffect(() => {
    if (isOpen && cuenta) {
      reset({
        monto_pago: cuenta.saldo_pendiente || 0,
        referencia_pago: "",
        observaciones: "",
      });
    }
  }, [isOpen, cuenta, reset]);

  const onSubmit = async (data) => {
    const result = await onSave({
      ...data,
      monto_pago: parseFloat(data.monto_pago),
    });
    if (result?.success) {
      onClose();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  };

  if (!cuenta) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Info de la cuenta */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary dark:text-background-light/70">
              Proveedor:
            </span>
            <span className="font-medium text-text-primary dark:text-background-light">
              {cuenta.Proveedor?.razon_social}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary dark:text-background-light/70">
              Factura:
            </span>
            <span className="font-medium text-text-primary dark:text-background-light">
              {cuenta.numero_factura_proveedor}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary dark:text-background-light/70">
              Monto Total:
            </span>
            <span className="font-medium text-text-primary dark:text-background-light">
              {formatCurrency(cuenta.monto_total)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary dark:text-background-light/70">
              Pagado:
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatCurrency(cuenta.monto_pagado)}
            </span>
          </div>
          <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-2">
            <span className="text-sm font-medium text-text-primary dark:text-background-light">
              Saldo Pendiente:
            </span>
            <span className="font-bold text-lg text-red-600 dark:text-red-400">
              {formatCurrency(cuenta.saldo_pendiente)}
            </span>
          </div>
        </div>

        {/* Monto a pagar */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Monto a Pagar ($) <span className="text-red-500">*</span>
          </label>
          <input
            {...register("monto_pago", {
              required: "Ingrese el monto",
              min: { value: 0.01, message: "El monto debe ser mayor a 0" },
              max: {
                value: cuenta.saldo_pendiente,
                message: `El monto no puede ser mayor al saldo (${formatCurrency(cuenta.saldo_pendiente)})`,
              },
            })}
            type="number"
            step="0.01"
            min="0"
            max={cuenta.saldo_pendiente}
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
          {errors.monto_pago && (
            <p className="mt-1 text-sm text-red-500">{errors.monto_pago.message}</p>
          )}
        </div>

        {/* Botones de monto rápido */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => reset({ ...watch(), monto_pago: cuenta.saldo_pendiente })}
            className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 transition-colors"
          >
            Pago Total
          </button>
          <button
            type="button"
            onClick={() => reset({ ...watch(), monto_pago: cuenta.saldo_pendiente / 2 })}
            className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 transition-colors"
          >
            50%
          </button>
        </div>

        {/* Referencia */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Referencia de Pago
          </label>
          <input
            {...register("referencia_pago")}
            type="text"
            placeholder="Ej: Transferencia #12345"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Observaciones
          </label>
          <textarea
            {...register("observaciones")}
            rows={2}
            placeholder="Notas adicionales sobre el pago"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-primary/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancelar
          </button>
          <Button type="submit" disabled={isSubmitting}>
            <span className="material-symbols-outlined text-lg mr-1">payments</span>
            {isSubmitting ? "Procesando..." : "Registrar Pago"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PagoProveedorModal;
