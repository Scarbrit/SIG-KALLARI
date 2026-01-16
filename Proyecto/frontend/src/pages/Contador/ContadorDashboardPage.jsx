// src/pages/Contador/ContadorDashboardPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/Layout/AdminLayout";

const ContadorDashboardPage = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-background-light">
            Panel del Contador
          </h1>
          <p className="text-text-secondary text-base font-normal leading-normal dark:text-background-light/70">
            Bienvenido al módulo de contabilidad. Seleccione una opción del menú.
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/contador/proveedores"
            className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">
                  groups
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-background-light">
                  Proveedores
                </h3>
                <p className="text-sm text-text-secondary dark:text-background-light/70">
                  Gestionar proveedores
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/contador/cuentas-por-pagar"
            className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-amber-600 dark:text-amber-400">
                  receipt_long
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-background-light">
                  Cuentas por Pagar
                </h3>
                <p className="text-sm text-text-secondary dark:text-background-light/70">
                  Facturas de proveedores
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/contador/cuentas-bancarias"
            className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">
                  account_balance
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-background-light">
                  Caja y Bancos
                </h3>
                <p className="text-sm text-text-secondary dark:text-background-light/70">
                  Movimientos de dinero
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/contador/contabilidad"
            className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400">
                  calculate
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-background-light">
                  Contabilidad
                </h3>
                <p className="text-sm text-text-secondary dark:text-background-light/70">
                  Períodos y asientos
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/contador/clientes"
            className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-teal-600 dark:text-teal-400">
                  group
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-background-light">
                  Clientes
                </h3>
                <p className="text-sm text-text-secondary dark:text-background-light/70">
                  Ver clientes
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/contador/ventas"
            className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-rose-600 dark:text-rose-400">
                  shopping_cart
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-background-light">
                  Ventas
                </h3>
                <p className="text-sm text-text-secondary dark:text-background-light/70">
                  Historial de ventas
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContadorDashboardPage;
