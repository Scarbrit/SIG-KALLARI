// src/components/ui/CuentaPorPagarFormModal.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Button from "./Button";

const CuentaPorPagarFormModal = ({ isOpen, onClose, onSave, proveedores }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const montoTotal = watch("monto_total");

  useEffect(() => {
    if (isOpen) {
      const hoy = new Date().toISOString().split("T")[0];
      const vencimiento = new Date();
      vencimiento.setDate(vencimiento.getDate() + 30);
      
      reset({
        id_proveedor: "",
        numero_factura_proveedor: "",
        fecha_emision: hoy,
        fecha_vencimiento: vencimiento.toISOString().split("T")[0],
        monto_total: "",
        descripcion: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    const result = await onSave({
      ...data,
      id_proveedor: parseInt(data.id_proveedor),
      monto_total: parseFloat(data.monto_total),
    });
    if (result?.success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Cuenta por Pagar">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Proveedor */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Proveedor <span className="text-red-500">*</span>
          </label>
          <select
            {...register("id_proveedor", { required: "Seleccione un proveedor" })}
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          >
            <option value="">Seleccionar proveedor...</option>
            {proveedores.map((p) => (
              <option key={p.id_proveedor} value={p.id_proveedor}>
                {p.razon_social} - {p.identificacion}
              </option>
            ))}
          </select>
          {errors.id_proveedor && (
            <p className="mt-1 text-sm text-red-500">{errors.id_proveedor.message}</p>
          )}
        </div>

        {/* Número de Factura */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            # Factura Proveedor <span className="text-red-500">*</span>
          </label>
          <input
            {...register("numero_factura_proveedor", { required: "Ingrese el número de factura" })}
            type="text"
            placeholder="Ej: 001-001-000001234"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
          {errors.numero_factura_proveedor && (
            <p className="mt-1 text-sm text-red-500">{errors.numero_factura_proveedor.message}</p>
          )}
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
              Fecha Emisión
            </label>
            <input
              {...register("fecha_emision")}
              type="date"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
              Fecha Vencimiento <span className="text-red-500">*</span>
            </label>
            <input
              {...register("fecha_vencimiento", { required: "Seleccione fecha de vencimiento" })}
              type="date"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            />
            {errors.fecha_vencimiento && (
              <p className="mt-1 text-sm text-red-500">{errors.fecha_vencimiento.message}</p>
            )}
          </div>
        </div>

        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Monto Total ($) <span className="text-red-500">*</span>
          </label>
          <input
            {...register("monto_total", {
              required: "Ingrese el monto",
              min: { value: 0.01, message: "El monto debe ser mayor a 0" },
            })}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
          {errors.monto_total && (
            <p className="mt-1 text-sm text-red-500">{errors.monto_total.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Descripción
          </label>
          <textarea
            {...register("descripcion")}
            rows={2}
            placeholder="Descripción o concepto de la compra"
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
            {isSubmitting ? "Guardando..." : "Registrar Cuenta"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CuentaPorPagarFormModal;
