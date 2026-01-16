// src/components/ui/InvoiceDetailModal.jsx
import React from "react";
import Modal from "./Modal";

const InvoiceDetailModal = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (estado) => {
    const styles = {
      SRI_AUTORIZADO: "bg-green-100 text-green-800",
      SRI_PENDIENTE: "bg-yellow-100 text-yellow-800",
      SRI_RECHAZADO: "bg-red-100 text-red-800",
      SRI_ANULADA: "bg-gray-100 text-gray-800",
      SRI_FIRMADO: "bg-blue-100 text-blue-800"
    };
    const badgeText = estado?.estado_sri || "Pendiente";
    const styleClass = styles[estado?.codigo] || styles.SRI_PENDIENTE;

    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${styleClass}`}>
        {badgeText}
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Factura">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-text-secondary dark:text-background-light/70">Número:</p>
            <p className="font-mono text-lg font-bold text-primary">
              {invoice.numero_autorizacion?.slice(-10) || `FAC-${invoice.id_factura}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary dark:text-background-light/70 mb-1">Estado SRI</p>
            {getStatusBadge(invoice.EstadoSri)}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div>
            <p className="text-xs text-text-secondary dark:text-background-light/60">Cliente</p>
            <p className="font-medium text-text-primary dark:text-background-light">
              {invoice.Cliente?.nombre} {invoice.Cliente?.apellido}
            </p>
            <p className="text-sm text-text-secondary dark:text-background-light/70">
              {invoice.Cliente?.identificacion}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary dark:text-background-light/60">Fecha Emisión</p>
            <p className="font-medium text-text-primary dark:text-background-light">
              {formatDate(invoice.fecha_emision)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary dark:text-background-light/60">Tipo de Venta</p>
            <p className="font-medium text-text-primary dark:text-background-light">
              {invoice.tipo_venta || "CONTADO"}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary dark:text-background-light/60">Método de Pago</p>
            <p className="font-medium text-text-primary dark:text-background-light">
              {invoice.MetodoPago?.nombre || "-"}
            </p>
          </div>
        </div>

        {/* Líneas de Detalle */}
        <div>
          <h4 className="font-semibold text-text-primary dark:text-background-light mb-3">
            Productos
          </h4>
          <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr className="text-left text-text-secondary dark:text-background-light/70">
                  <th className="px-4 py-2">Producto</th>
                  <th className="px-4 py-2 text-center">Cant.</th>
                  <th className="px-4 py-2 text-right">P.Unit</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {invoice.DetallesFactura?.map((detalle, idx) => (
                  <tr key={idx} className="text-text-primary dark:text-background-light">
                    <td className="px-4 py-2">
                      {detalle.Producto?.nombre || "Producto"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {detalle.cantidad}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatCurrency(detalle.precio_unitario)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatCurrency(detalle.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totales */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-text-secondary dark:text-background-light/70">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.descuento > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Descuento:</span>
                <span>-{formatCurrency(invoice.descuento)}</span>
              </div>
            )}
            <div className="flex justify-between text-text-secondary dark:text-background-light/70">
              <span>IVA ({invoice.porcentaje_iva || 15}%):</span>
              <span>{formatCurrency(invoice.iva)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-text-primary dark:text-background-light pt-2 border-t dark:border-gray-700">
              <span>TOTAL:</span>
              <span className="text-primary">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Autorización SRI */}
        {invoice.numero_autorizacion && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-text-secondary dark:text-background-light/60 mb-1">
              Número de Autorización SRI
            </p>
            <p className="font-mono text-xs text-green-700 dark:text-green-400 break-all">
              {invoice.numero_autorizacion}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-primary/10">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceDetailModal;
