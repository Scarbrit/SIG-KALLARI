// src/components/ui/MovimientoModal.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Button from "./Button";

const MovimientoModal = ({ isOpen, onClose, onSave, cuenta }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const tipoMovimiento = watch("tipo_movimiento");

  useEffect(() => {
    if (isOpen && cuenta) {
      reset({
        id_cuenta_bancaria: cuenta.id_cuenta_bancaria,
        tipo_movimiento: "INGRESO",
        concepto: "",
        monto: "",
        referencia: "",
      });
    }
  }, [isOpen, cuenta, reset]);

  const onSubmit = async (data) => {
    const result = await onSave({
      ...data,
      monto: parseFloat(data.monto),
    });
    if (result?.success) onClose();
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value || 0);

  if (!cuenta) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Movimiento">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Info de cuenta */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-text-primary dark:text-background-light">
              {cuenta.nombre}
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(cuenta.saldo_actual)}
            </span>
          </div>
        </div>

        {/* Tipo de movimiento */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-2">
            Tipo de Movimiento
          </label>
          <div className="flex gap-2">
            <label className={`flex-1 cursor-pointer rounded-lg border-2 p-3 text-center transition-colors ${
              tipoMovimiento === "INGRESO"
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}>
              <input
                {...register("tipo_movimiento")}
                type="radio"
                value="INGRESO"
                className="sr-only"
              />
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                arrow_downward
              </span>
              <p className="text-sm font-medium mt-1">Ingreso</p>
            </label>
            <label className={`flex-1 cursor-pointer rounded-lg border-2 p-3 text-center transition-colors ${
              tipoMovimiento === "EGRESO"
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}>
              <input
                {...register("tipo_movimiento")}
                type="radio"
                value="EGRESO"
                className="sr-only"
              />
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                arrow_upward
              </span>
              <p className="text-sm font-medium mt-1">Egreso</p>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Monto ($) <span className="text-red-500">*</span>
          </label>
          <input
            {...register("monto", {
              required: "Ingrese el monto",
              min: { value: 0.01, message: "El monto debe ser mayor a 0" },
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
            Concepto <span className="text-red-500">*</span>
          </label>
          <input
            {...register("concepto", { required: "Ingrese el concepto" })}
            placeholder="Describe el motivo del movimiento"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
          {errors.concepto && <p className="mt-1 text-sm text-red-500">{errors.concepto.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Referencia
          </label>
          <input
            {...register("referencia")}
            placeholder="Ej: Factura #123, Cheque #456"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-primary/10">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary">
            Cancelar
          </button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Procesando..." : "Registrar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MovimientoModal;
