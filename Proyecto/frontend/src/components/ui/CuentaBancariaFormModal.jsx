// src/components/ui/CuentaBancariaFormModal.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Button from "./Button";

const CuentaBancariaFormModal = ({ isOpen, onClose, onSave, catalogs }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      reset({
        nombre: "",
        id_tipo_cuenta_bancaria: "",
        nombre_banco: "",
        numero_cuenta: "",
        saldo_inicial: 0,
        activa: true,
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    const result = await onSave({
      ...data,
      id_tipo_cuenta_bancaria: parseInt(data.id_tipo_cuenta_bancaria),
      saldo_inicial: parseFloat(data.saldo_inicial) || 0,
    });
    if (result?.success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Cuenta Bancaria">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Nombre de la Cuenta <span className="text-red-500">*</span>
          </label>
          <input
            {...register("nombre", { required: "El nombre es obligatorio" })}
            placeholder="Ej: Caja Principal, Banco Pichincha"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Tipo <span className="text-red-500">*</span>
          </label>
          <select
            {...register("id_tipo_cuenta_bancaria", { required: "Seleccione un tipo" })}
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          >
            <option value="">Seleccionar...</option>
            {catalogs.tipos?.map((t) => (
              <option key={t.id_tipo_cuenta_bancaria} value={t.id_tipo_cuenta_bancaria}>
                {t.nombre}
              </option>
            ))}
          </select>
          {errors.id_tipo_cuenta_bancaria && (
            <p className="mt-1 text-sm text-red-500">{errors.id_tipo_cuenta_bancaria.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
              Banco
            </label>
            <input
              {...register("nombre_banco")}
              placeholder="Ej: Banco Pichincha"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
              # Cuenta
            </label>
            <input
              {...register("numero_cuenta")}
              placeholder="Número de cuenta"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Saldo Inicial ($)
          </label>
          <input
            {...register("saldo_inicial")}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-primary/10">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary">
            Cancelar
          </button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Crear Cuenta"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CuentaBancariaFormModal;
