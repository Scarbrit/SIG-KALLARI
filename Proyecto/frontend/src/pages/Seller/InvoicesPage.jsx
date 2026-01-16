// src/pages/Seller/InvoicesPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import Table from "../../components/ui/Table";
import TablePagination from "../../components/ui/TablePagination";
import InvoiceDetailModal from "../../components/ui/InvoiceDetailModal";
import { salesService } from "../../services/sales.service";
import { toast } from "react-toastify";

const InvoicesPage = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "fecha_emision", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (dateFrom) filters.fecha_desde = dateFrom;
      if (dateTo) filters.fecha_hasta = dateTo;
      
      const response = await salesService.getSalesHistory(filters);
      setFacturas(response.facturas || []);
    } catch (error) {
      toast.error(error.message || "Error al cargar facturas");
    } finally {
      setLoading(false);
    }
  };

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFrom, dateTo]);

  // Filtering
  const filteredFacturas = useMemo(() => {
    return facturas.filter((f) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        f.numero_autorizacion?.toLowerCase().includes(searchLower) ||
        f.Cliente?.nombre?.toLowerCase().includes(searchLower) ||
        f.Cliente?.apellido?.toLowerCase().includes(searchLower) ||
        f.Cliente?.identificacion?.includes(searchTerm);

      let matchesStatus = true;
      if (statusFilter !== "all") {
        matchesStatus = f.EstadoSri?.codigo === statusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  }, [facturas, searchTerm, statusFilter]);

  // Sorting
  const sortedFacturas = useMemo(() => {
    let items = [...filteredFacturas];
    if (sortConfig.key) {
      items.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        if (sortConfig.key === "fecha_emision") {
          aVal = new Date(aVal || 0);
          bVal = new Date(bVal || 0);
        } else if (sortConfig.key === "total") {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        } else {
          aVal = aVal?.toString().toLowerCase() || "";
          bVal = bVal?.toString().toLowerCase() || "";
        }
        
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [filteredFacturas, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedFacturas.slice(indexOfFirst, indexOfLast);
  const totalItems = sortedFacturas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleViewDetail = async (factura) => {
    try {
      const detail = await salesService.getSaleById(factura.id_factura);
      setSelectedInvoice(detail.venta || detail);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error("Error al cargar detalle de factura");
    }
  };

  const handleDownloadXml = async (factura) => {
    try {
      const url = await salesService.downloadXml(factura.id_factura);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Error al descargar XML");
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getStatusBadge = (estado) => {
    const styles = {
      SRI_AUTORIZADO: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      SRI_PENDIENTE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      SRI_RECHAZADO: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      SRI_ANULADA: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      SRI_FIRMADO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "EN PROCESO": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    };
    const badgeText = estado?.estado_sri || "Pendiente";
    const styleClass = styles[estado?.codigo] || styles.SRI_PENDIENTE;

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styleClass}`}>
        {badgeText}
      </span>
    );
  };

  const columns = [
    {
      header: "# Factura",
      sortable: true,
      accessorKey: "numero_autorizacion",
      className: "font-mono text-sm",
      render: (row) => (
        <span className="text-primary font-medium">
          {row.numero_autorizacion?.slice(-10) || `FAC-${row.id_factura}`}
        </span>
      )
    },
    {
      header: "Cliente",
      render: (row) => (
        <div>
          <p className="font-medium text-text-primary dark:text-background-light">
            {row.Cliente?.nombre} {row.Cliente?.apellido}
          </p>
          <p className="text-xs text-text-secondary dark:text-background-light/60">
            {row.Cliente?.identificacion}
          </p>
        </div>
      )
    },
    {
      header: "Fecha",
      sortable: true,
      accessorKey: "fecha_emision",
      render: (row) => formatDate(row.fecha_emision)
    },
    {
      header: "Tipo",
      render: (row) => (
        <span className={`text-xs px-2 py-1 rounded ${
          row.tipo_venta === "CONTADO" 
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        }`}>
          {row.tipo_venta || "CONTADO"}
        </span>
      )
    },
    {
      header: "Subtotal",
      className: "text-right",
      render: (row) => (
        <span className="text-text-secondary dark:text-background-light/70">
          {formatCurrency(row.subtotal)}
        </span>
      )
    },
    {
      header: "IVA",
      className: "text-right",
      render: (row) => (
        <span className="text-text-secondary dark:text-background-light/70">
          {formatCurrency(row.iva)}
        </span>
      )
    },
    {
      header: "Total",
      sortable: true,
      accessorKey: "total",
      className: "text-right",
      render: (row) => (
        <span className="font-bold text-text-primary dark:text-background-light">
          {formatCurrency(row.total)}
        </span>
      )
    },
    {
      header: "Estado SRI",
      render: (row) => getStatusBadge(row.EstadoSri)
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (row) => (
        <div className="inline-flex gap-1">
          <button
            onClick={() => handleViewDetail(row)}
            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 rounded-lg transition-colors"
            title="Ver detalle"
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
          {row.EstadoSri?.codigo === "SRI_AUTORIZADO" && (
            <button
              onClick={() => handleDownloadXml(row)}
              className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 rounded-lg transition-colors"
              title="Descargar XML"
            >
              <span className="material-symbols-outlined text-lg">download</span>
            </button>
          )}
        </div>
      )
    }
  ];

  // Resumen
  const resumen = useMemo(() => ({
    total: filteredFacturas.reduce((sum, f) => sum + parseFloat(f.total || 0), 0),
    count: filteredFacturas.length,
    autorizadas: filteredFacturas.filter(f => f.EstadoSri?.codigo === "SRI_AUTORIZADO").length
  }), [filteredFacturas]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-background-light">
              Facturas
            </h1>
            <p className="text-text-secondary dark:text-background-light/70">
              Historial de facturas emitidas
            </p>
          </div>
          <button
            onClick={loadFacturas}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className={`material-symbols-outlined ${loading ? "animate-spin" : ""}`}>
              {loading ? "progress_activity" : "refresh"}
            </span>
            Actualizar
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
            <p className="text-sm text-text-secondary dark:text-background-light/70">Total Facturado</p>
            <p className="text-2xl font-bold text-text-primary dark:text-background-light">
              {formatCurrency(resumen.total)}
            </p>
          </div>
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
            <p className="text-sm text-text-secondary dark:text-background-light/70">Facturas</p>
            <p className="text-2xl font-bold text-text-primary dark:text-background-light">
              {resumen.count}
            </p>
          </div>
          <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 p-4">
            <p className="text-sm text-text-secondary dark:text-background-light/70">Autorizadas SRI</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {resumen.autorizadas}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/80">
              search
            </span>
            <input
              type="search"
              placeholder="Buscar por cliente, # factura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-primary/30 bg-white/50 py-2 pl-10 pr-4 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-primary/30 bg-white/50 py-2 px-4 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
          >
            <option value="all">Todos los estados</option>
            <option value="SRI_AUTORIZADO">Autorizadas</option>
            <option value="SRI_PENDIENTE">Pendientes</option>
            <option value="SRI_RECHAZADO">Rechazadas</option>
            <option value="SRI_ANULADA">Anuladas</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-primary/30 bg-white/50 py-2 px-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            />
            <span className="text-text-secondary">a</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-primary/30 bg-white/50 py-2 px-3 dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light"
            />
            <button
              onClick={loadFacturas}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg"
              title="Aplicar filtro de fechas"
            >
              <span className="material-symbols-outlined">filter_alt</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <Table
            columns={columns}
            data={currentItems}
            isLoading={loading}
            keyField="id_factura"
            sortConfig={sortConfig}
            onSort={handleSort}
            emptyText="No se encontraron facturas"
          />
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          limit={itemsPerPage}
          onLimitChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
          totalItems={totalItems}
          showingFrom={indexOfFirst + 1}
          showingTo={Math.min(indexOfLast, totalItems)}
        />
      </div>

      {/* Detail Modal */}
      <InvoiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        invoice={selectedInvoice}
      />
    </AdminLayout>
  );
};

export default InvoicesPage;
