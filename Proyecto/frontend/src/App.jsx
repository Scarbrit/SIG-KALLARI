import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

// Components de Rutas
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Pages Publicas / Auth
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordSentPage from "./pages/ResetPasswordSentPage";
import CreateNewPasswordPage from "./pages/CreateNewPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";

// Pages Admin
import AdminDashboardPage from "./pages/AdminDashboardPage";
import TokenSettingsPage from "./pages/Admin/TokenSettingsPage";
import UsersPage from "./pages/Admin/UsersPage";
import CategoriesPage from "./pages/Admin/CategoriesPage";
import LocksPage from "./pages/Admin/LocksPage";
import AdminSettingsPage from "./pages/Admin/SettingsPage";
import DiscountPage from "./pages/Admin/DiscountPage";
import IvaPage from "./pages/Admin/IvaPage";
import CertificatesPage from "./pages/Admin/CertificatesPage";
import SriConfigPage from "./pages/Admin/SriConfigPage";
import ProveedoresPage from "./pages/Admin/ProveedoresPage";
import CuentasPorPagarPage from "./pages/Admin/CuentasPorPagarPage";
import CuentasBancariasPage from "./pages/Admin/CuentasBancariasPage";
import ContabilidadPage from "./pages/Admin/ContabilidadPage";

// Pages Vendedor
import SellerDashboardPage from "./pages/SellerDashboardPage";
import SellerSettingsPage from "./pages/Seller/SettingsPage";
import InventoryPage from "./pages/Seller/InventoryPage";
import ClientsPage from "./pages/Seller/ClientsPage";
import SalesPage from "./pages/Seller/SalesPage";
import InvoicesPage from "./pages/Seller/InvoicesPage";
import CheckoutPage from "./pages/Seller/CheckoutPage";
import SaleSuccessPage from "./pages/Seller/SaleSuccessPage";

// Pages Contador
import ContadorDashboardPage from "./pages/Contador/ContadorDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          {/* === RUTAS PÚBLICAS === */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password-sent"
              element={<ResetPasswordSentPage />}
            />
            <Route
              path="/reset-password/:token"
              element={<CreateNewPasswordPage />}
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>

          {/* === RUTAS SEMI-PÚBLICAS === */}
          <Route path="/update-password" element={<UpdatePasswordPage />} />

          {/* === RUTAS PROTEGIDAS ADMIN === */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={["Administrador", "Superusuario"]}
              />
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="tokens" element={<TokenSettingsPage />} />
            <Route path="locks" element={<LocksPage />} />
            <Route path="discounts" element={<DiscountPage />} />
            <Route path="taxes" element={<IvaPage />} />
            <Route path="profile" element={<AdminSettingsPage />} />
            <Route path="certificate" element={<CertificatesPage />} />
            {/* Módulo Contabilidad */}
            <Route path="sri-config" element={<SriConfigPage />} />
            <Route path="proveedores" element={<ProveedoresPage />} />
            <Route path="cuentas-por-pagar" element={<CuentasPorPagarPage />} />
            <Route path="cuentas-bancarias" element={<CuentasBancariasPage />} />
            <Route path="contabilidad" element={<ContabilidadPage />} />
          </Route>

          {/* === RUTAS PROTEGIDAS VENDEDOR === */}
          <Route
            path="/seller"
            element={<ProtectedRoute allowedRoles={["Vendedor"]} />}
          >
            <Route index element={<SellerDashboardPage />} />
            <Route path="profile" element={<SellerSettingsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="sale-success" element={<SaleSuccessPage />} />
          </Route>

          {/* === RUTAS PROTEGIDAS CONTADOR === */}
          <Route
            path="/contador"
            element={<ProtectedRoute allowedRoles={["Contador"]} />}
          >
            <Route index element={<ContadorDashboardPage />} />
            <Route path="dashboard" element={<ContadorDashboardPage />} />
            <Route path="profile" element={<AdminSettingsPage />} />
            {/* Acceso a módulos contables */}
            <Route path="proveedores" element={<ProveedoresPage />} />
            <Route path="cuentas-por-pagar" element={<CuentasPorPagarPage />} />
            <Route path="cuentas-bancarias" element={<CuentasBancariasPage />} />
            <Route path="contabilidad" element={<ContabilidadPage />} />
            {/* Acceso de solo lectura a ventas y clientes */}
            <Route path="clientes" element={<ClientsPage />} />
            <Route path="ventas" element={<SalesPage />} />
          </Route>

          {/* === CATCH ALL === */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

