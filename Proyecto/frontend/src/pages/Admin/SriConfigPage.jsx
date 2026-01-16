// src/pages/Admin/SriConfigPage.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import Button from "../../components/ui/Button";
import { configService } from "../../services/config.service";
import { toast } from "react-toastify";

const SriConfigPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configurada, setConfigurada] = useState(false);
  const [formData, setFormData] = useState({
    razon_social: "",
    nombre_comercial: "",
    ruc: "",
    direccion_matriz: "",
    establecimiento: "001",
    punto_emision: "001",
    ambiente: 1,
    tipo_emision: 1,
    obligado_contabilidad: true,
    contribuyente_especial: ""
  });
  const [errors, setErrors] = useState({});

  // Cargar configuración al montar
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await configService.getSriConfig();
      if (response.configurada && response.configuracion) {
        setConfigurada(true);
        setFormData({
          razon_social: response.configuracion.razon_social || "",
          nombre_comercial: response.configuracion.nombre_comercial || "",
          ruc: response.configuracion.ruc || "",
          direccion_matriz: response.configuracion.direccion_matriz || "",
          establecimiento: response.configuracion.establecimiento || "001",
          punto_emision: response.configuracion.punto_emision || "001",
          ambiente: response.configuracion.ambiente || 1,
          tipo_emision: response.configuracion.tipo_emision || 1,
          obligado_contabilidad: response.configuracion.obligado_contabilidad ?? true,
          contribuyente_especial: response.configuracion.contribuyente_especial || ""
        });
      }
    } catch (error) {
      console.error("Error al cargar configuración:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.razon_social?.trim()) {
      newErrors.razon_social = "La razón social es obligatoria";
    }
    
    if (!formData.ruc?.trim()) {
      newErrors.ruc = "El RUC es obligatorio";
    } else if (!/^\d{13}$/.test(formData.ruc)) {
      newErrors.ruc = "El RUC debe tener 13 dígitos";
    } else if (!formData.ruc.endsWith("001")) {
      newErrors.ruc = "El RUC debe terminar en 001";
    }
    
    if (!formData.direccion_matriz?.trim()) {
      newErrors.direccion_matriz = "La dirección es obligatoria";
    }

    if (!/^\d{3}$/.test(formData.establecimiento)) {
      newErrors.establecimiento = "Debe ser un número de 3 dígitos";
    }

    if (!/^\d{3}$/.test(formData.punto_emision)) {
      newErrors.punto_emision = "Debe ser un número de 3 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Por favor corrija los errores del formulario");
      return;
    }

    try {
      setSaving(true);
      const dataToSend = {
        ...formData,
        ambiente: parseInt(formData.ambiente),
        tipo_emision: parseInt(formData.tipo_emision)
      };
      
      await configService.saveSriConfig(dataToSend);
      setConfigurada(true);
      toast.success("Configuración guardada correctamente");
    } catch (error) {
      toast.error(error.message || "Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const handleChangeAmbiente = async (nuevoAmbiente) => {
    try {
      setSaving(true);
      const response = await configService.changeAmbiente(nuevoAmbiente);
      setFormData(prev => ({ ...prev, ambiente: nuevoAmbiente }));
      toast.success(`Ambiente cambiado a: ${response.ambiente_nombre}`);
    } catch (error) {
      toast.error(error.message || "Error al cambiar el ambiente");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-background-light">
            Configuración SRI
          </h1>
          <p className="text-text-secondary text-base font-normal leading-normal dark:text-background-light/70">
            Configure los datos de su empresa para la facturación electrónica.
          </p>
        </div>
        {configurada && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Configurado
            </span>
          </div>
        )}
      </div>

      {/* Ambiente Quick Toggle */}
      {configurada && (
        <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-background-light">
                Ambiente Actual
              </h3>
              <p className="text-sm text-text-secondary dark:text-background-light/70">
                {formData.ambiente === 1 ? "Pruebas (Desarrollo)" : "Producción (Real)"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleChangeAmbiente(1)}
                disabled={saving || formData.ambiente === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.ambiente === 1
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                🧪 Pruebas
              </button>
              <button
                onClick={() => handleChangeAmbiente(2)}
                disabled={saving || formData.ambiente === 2}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.ambiente === 2
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                🏭 Producción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RUC */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-2">
              RUC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              maxLength={13}
              placeholder="Ej: 1234567890001"
              className={`w-full rounded-lg border ${errors.ruc ? 'border-red-500' : 'border-primary/30'} bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light`}
            />
            {errors.ruc && <p className="mt-1 text-sm text-red-500">{errors.ruc}</p>}
          </div>

          {/* Razón Social */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-2">
              Razón Social <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="razon_social"
              value={formData.razon_social}
              onChange={handleChange}
              placeholder="Nombre legal de la empresa"
              className={`w-full rounded-lg border ${errors.razon_social ? 'border-red-500' : 'border-primary/30'} bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light`}
            />
            {errors.razon_social && <p className="mt-1 text-sm text-red-500">{errors.razon_social}</p>}
          </div>

          {/* Nombre Comercial */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-2">
              Nombre Comercial
            </label>
            <input
              type="text"
              name="nombre_comercial"
              value={formData.nombre_comercial}
              onChange={handleChange}
              placeholder="Nombre comercial (opcional)"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-2">
              Dirección Matriz <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="direccion_matriz"
              value={formData.direccion_matriz}
              onChange={handleChange}
              placeholder="Dirección de la matriz"
              className={`w-full rounded-lg border ${errors.direccion_matriz ? 'border-red-500' : 'border-primary/30'} bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light`}
            />
            {errors.direccion_matriz && <p className="mt-1 text-sm text-red-500">{errors.direccion_matriz}</p>}
          </div>

          {/* Establecimiento */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-2">
              Establecimiento
            </label>
            <input
              type="text"
              name="establecimiento"
              value={formData.establecimiento}
              onChange={handleChange}
              maxLength={3}
              placeholder="001"
              className={`w-full rounded-lg border ${errors.establecimiento ? 'border-red-500' : 'border-primary/30'} bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light`}
            />
            {errors.establecimiento && <p className="mt-1 text-sm text-red-500">{errors.establecimiento}</p>}
          </div>

          {/* Punto de Emisión */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-2">
              Punto de Emisión
            </label>
            <input
              type="text"
              name="punto_emision"
              value={formData.punto_emision}
              onChange={handleChange}
              maxLength={3}
              placeholder="001"
              className={`w-full rounded-lg border ${errors.punto_emision ? 'border-red-500' : 'border-primary/30'} bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light`}
            />
            {errors.punto_emision && <p className="mt-1 text-sm text-red-500">{errors.punto_emision}</p>}
          </div>

          {/* Ambiente */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-2">
              Ambiente
            </label>
            <select
              name="ambiente"
              value={formData.ambiente}
              onChange={handleChange}
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            >
              <option value={1}>🧪 Pruebas (Desarrollo)</option>
              <option value={2}>🏭 Producción (Real)</option>
            </select>
            <p className="mt-1 text-xs text-text-secondary dark:text-background-light/60">
              Las URLs del SRI se configuran automáticamente según el ambiente
            </p>
          </div>

          {/* Contribuyente Especial */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-background-light mb-2">
              Contribuyente Especial
            </label>
            <input
              type="text"
              name="contribuyente_especial"
              value={formData.contribuyente_especial}
              onChange={handleChange}
              maxLength={5}
              placeholder="Número de resolución (si aplica)"
              className="w-full rounded-lg border border-primary/30 bg-white/50 p-3 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            />
          </div>

          {/* Obligado a Contabilidad */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="obligado_contabilidad"
                checked={formData.obligado_contabilidad}
                onChange={handleChange}
                className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-text-primary dark:text-background-light">
                Obligado a llevar contabilidad
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-primary/10">
          <Button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3"
          >
            <span className="material-symbols-outlined">save</span>
            {saving ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>
      </form>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">Información Importante</h4>
            <ul className="mt-2 text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• El certificado digital se configura por separado en la sección de Certificados.</li>
              <li>• Use el ambiente de <strong>Pruebas</strong> para desarrollo y testing.</li>
              <li>• Cambie a <strong>Producción</strong> solo cuando esté listo para facturar.</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SriConfigPage;
