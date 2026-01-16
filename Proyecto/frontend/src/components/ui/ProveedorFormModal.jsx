// src/components/ui/ProveedorFormModal.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Button from "./Button";

const ProveedorFormModal = ({ isOpen, onClose, onSave, proveedor, catalogs }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (proveedor) {
        reset({
          id_proveedor: proveedor.id_proveedor,
          id_tipo_identificacion: proveedor.id_tipo_identificacion?.toString() || "",
          identificacion: proveedor.identificacion || "",
          razon_social: proveedor.razon_social || "",
          nombre_comercial: proveedor.nombre_comercial || "",
          direccion: proveedor.direccion || "",
          telefono: proveedor.telefono || "",
          email: proveedor.email || "",
          dias_credito: proveedor.dias_credito || 0,
          limite_credito: proveedor.limite_credito || 0,
        });
      } else {
        reset({
          id_tipo_identificacion: "",
          identificacion: "",
          razon_social: "",
          nombre_comercial: "",
          direccion: "",
          telefono: "",
          email: "",
          dias_credito: 30,
          limite_credito: 0,
        });
      }
    }
  }, [isOpen, proveedor, reset]);

  const onSubmit = async (data) => {
    const result = await onSave({
      ...data,
      id_tipo_identificacion: parseInt(data.id_tipo_identificacion),
      dias_credito: parseInt(data.dias_credito) || 0,
      limite_credito: parseFloat(data.limite_credito) || 0,
    });
    if (result?.success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Tipo de Identificación */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Tipo de Identificación <span className="text-red-500">*</span>
          </label>
          <select
            {...register("id_tipo_identificacion", { required: "Seleccione un tipo" })}
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          >
            <option value="">Seleccionar...</option>
            {catalogs.tipos_identificacion?.map((tipo) => (
              <option key={tipo.id_tipo_identificacion} value={tipo.id_tipo_identificacion}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          {errors.id_tipo_identificacion && (
            <p className="mt-1 text-sm text-red-500">{errors.id_tipo_identificacion.message}</p>
          )}
        </div>

        {/* Identificación */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            RUC / Cédula <span className="text-red-500">*</span>
          </label>
          <input
            {...register("identificacion", {
              required: "La identificación es obligatoria",
              pattern: {
                value: /^\d{10,13}$/,
                message: "Ingrese una identificación válida",
              },
            })}
            type="text"
            maxLength={13}
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            placeholder="Ej: 1234567890001"
          />
          {errors.identificacion && (
            <p className="mt-1 text-sm text-red-500">{errors.identificacion.message}</p>
          )}
        </div>

        {/* Razón Social */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Razón Social <span className="text-red-500">*</span>
          </label>
          <input
            {...register("razon_social", { required: "La razón social es obligatoria" })}
            type="text"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            placeholder="Nombre legal de la empresa"
          />
          {errors.razon_social && (
            <p className="mt-1 text-sm text-red-500">{errors.razon_social.message}</p>
          )}
        </div>

        {/* Nombre Comercial */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Nombre Comercial
          </label>
          <input
            {...register("nombre_comercial")}
            type="text"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            placeholder="Nombre comercial (opcional)"
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
            Dirección
          </label>
          <input
            {...register("direccion")}
            type="text"
            className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            placeholder="Dirección del proveedor"
          />
        </div>

        {/* Teléfono y Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
              Teléfono
            </label>
            <input
              {...register("telefono")}
              type="tel"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
              placeholder="0999999999"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
              Email
            </label>
            <input
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email inválido",
                },
              })}
              type="email"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
              placeholder="email@ejemplo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Días de Crédito y Límite */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
              Días de Crédito
            </label>
            <input
              {...register("dias_credito")}
              type="number"
              min="0"
              max="365"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-1">
              Límite de Crédito ($)
            </label>
            <input
              {...register("limite_credito")}
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-primary/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary dark:text-background-light/70 dark:hover:text-background-light transition-colors"
          >
            Cancelar
          </button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : proveedor ? "Actualizar" : "Crear Proveedor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProveedorFormModal;
