// src/pages/SellerDashboardPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Layout/AdminLayout";
import { useSalesStats } from "../hooks/useSalesStats";

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const {
    ventasHoy,
    ventasSemana,
    ventasMes,
    totalClientes,
    productosStock,
    facturasRecientes,
    loading,
    refresh
  } = useSalesStats();

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusBadge = (estado) => {
    const styles = {
      SRI_AUTORIZADO: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      SRI_PENDIENTE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      SRI_RECHAZADO: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      SRI_ANULADA: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      SRI_FIRMADO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    };
    // Mapear el nombre descriptivo o el código
    const badgeText = estado?.estado_sri || "Pendiente";
    const styleClass = styles[estado?.codigo] || styles.SRI_PENDIENTE;
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styleClass}`}>
        {badgeText}
      </span>
    );
  };

  const statsCards = [
    {
      title: "Ventas Hoy",
      value: formatCurrency(ventasHoy),
      icon: "today",
      color: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Ventas Semana",
      value: formatCurrency(ventasSemana),
      icon: "date_range",
      color: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Ventas Mes",
      value: formatCurrency(ventasMes),
      icon: "calendar_month",
      color: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Clientes",
      value: totalClientes,
      icon: "groups",
      color: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400"
    }
  ];

  const quickActions = [
    {
      title: "Nueva Venta",
      description: "Iniciar una nueva transacción",
      icon: "add_shopping_cart",
      link: "/seller/sales",
      color: "bg-primary"
    },
    {
      title: "Ver Clientes",
      description: "Gestionar clientes",
      icon: "groups",
      link: "/seller/clients",
      color: "bg-blue-600"
    },
    {
      title: "Inventario",
      description: `${productosStock} productos en stock`,
      icon: "inventory_2",
      link: "/seller/inventory",
      color: "bg-amber-600"
    },
    {
      title: "Facturas",
      description: "Ver historial de facturas",
      icon: "receipt_long",
      link: "/seller/invoices",
      color: "bg-teal-600"
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-background-light">
              ¡Hola, {user?.nombre || "Vendedor"}!
            </h1>
            <p className="text-text-secondary dark:text-background-light/70">
              Panel de ventas - {new Date().toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <span className={`material-symbols-outlined ${loading ? "animate-spin" : ""}`}>refresh</span>
            Actualizar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <span className={`material-symbols-outlined text-2xl ${stat.iconColor}`}>
                    {stat.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-text-secondary dark:text-background-light/70">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary dark:text-background-light">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.link}
              className="group bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-2xl text-white">{action.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary dark:text-background-light">
                    {action.title}
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-background-light/70">
                    {action.description}
                  </p>
                </div>
                <span className="material-symbols-outlined text-text-secondary/50 group-hover:text-primary transition-colors">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
            <h2 className="font-semibold text-lg text-text-primary dark:text-background-light">
              Últimas Facturas
            </h2>
            <Link
              to="/seller/invoices"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver todas
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            </div>
          ) : facturasRecientes.length === 0 ? (
            <div className="text-center py-12 text-text-secondary dark:text-background-light/70">
              <span className="material-symbols-outlined text-4xl mb-2">receipt_long</span>
              <p>No hay facturas recientes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr className="text-left text-sm text-text-secondary dark:text-background-light/70">
                    <th className="px-6 py-3 font-medium"># Factura</th>
                    <th className="px-6 py-3 font-medium">Cliente</th>
                    <th className="px-6 py-3 font-medium">Fecha</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                    <th className="px-6 py-3 font-medium">Estado SRI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {facturasRecientes.map((factura) => (
                    <tr key={factura.id_factura} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <td className="px-6 py-4 font-mono text-sm text-primary">
                        {factura.numero_autorizacion?.slice(-10) || `FAC-${factura.id_factura}`}
                      </td>
                      <td className="px-6 py-4 text-text-primary dark:text-background-light">
                        {factura.Cliente?.nombre} {factura.Cliente?.apellido}
                      </td>
                      <td className="px-6 py-4 text-text-secondary dark:text-background-light/70">
                        {formatDate(factura.fecha_emision)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-text-primary dark:text-background-light">
                        {formatCurrency(factura.total)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(factura.EstadoSri)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SellerDashboardPage;
