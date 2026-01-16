// src/pages/Admin/ProveedoresPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import TablePagination from "../../components/ui/TablePagination";
import ProveedorFormModal from "../../components/ui/ProveedorFormModal";
import { useProveedores } from "../../hooks/useProveedores";
import { toast } from "react-toastify";

const ProveedoresPage = () => {
  const {
    proveedores,
    catalogs,
    loading,
    error,
    createProveedor,
    updateProveedor,
    changeState,
  } = useProveedores();

  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Filtrado
  const filteredProveedores = useMemo(() => {
    return proveedores.filter((prov) => {
      const matchesSearch =
        prov.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prov.identificacion?.includes(searchTerm) ||
        prov.nombre_comercial?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus = prov.EstadoProveedor?.nombre === "Activo";
      } else if (statusFilter === "inactive") {
        matchesStatus = prov.EstadoProveedor?.nombre !== "Activo";
      }

      return matchesSearch && matchesStatus;
    });
  }, [proveedores, searchTerm, statusFilter]);

  // Ordenamiento
  const sortedProveedores = useMemo(() => {
    let items = [...filteredProveedores];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const aVal = a[sortConfig.key]?.toString().toLowerCase() || "";
        const bVal = b[sortConfig.key]?.toString().toLowerCase() || "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [filteredProveedores, sortConfig]);

  // Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedProveedores.slice(indexOfFirst, indexOfLast);
  const totalItems = sortedProveedores.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleAdd = () => {
    setCurrentProveedor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prov) => {
    setCurrentProveedor(prov);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (data.id_proveedor) {
        await updateProveedor(data.id_proveedor, data);
        toast.success("Proveedor actualizado exitosamente");
      } else {
        await createProveedor(data);
        toast.success("Proveedor creado exitosamente");
      }
      setIsModalOpen(false);
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Error al guardar proveedor");
      return { success: false };
    }
  };

  const handleToggleStatus = async (prov) => {
    try {
      const nuevoEstado = prov.EstadoProveedor?.nombre === "Activo" ? "Inactivo" : "Activo";
      await changeState(prov.id_proveedor, nuevoEstado);
      toast.success(`Proveedor ${nuevoEstado.toLowerCase()} exitosamente`);
    } catch (err) {
      toast.error(err.message || "Error al cambiar estado");
    }
  };

  const getStatusBadge = (estado) => {
    if (estado === "Activo") {
      return (
        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Activo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        {estado || "Inactivo"}
      </span>
    );
  };

  // Columnas
  const columns = [
    {
      header: "RUC/Cédula",
      accessorKey: "identificacion",
      sortable: true,
      className: "font-medium text-text-primary dark:text-background-light",
    },
    {
      header: "Razón Social",
      accessorKey: "razon_social",
      sortable: true,
      className: "text-text-primary dark:text-background-light",
    },
    {
      header: "Teléfono",
      accessorKey: "telefono",
      className: "text-text-secondary dark:text-background-light/80",
    },
    {
      header: "Email",
      accessorKey: "email",
      className: "text-text-secondary dark:text-background-light/80 break-all",
    },
    {
      header: "Días Crédito",
      accessorKey: "dias_credito",
      className: "text-center",
      render: (row) => (
        <span className="text-text-secondary dark:text-background-light/80">
          {row.dias_credito || 0}
        </span>
      ),
    },
    {
      header: "Estado",
      render: (row) => getStatusBadge(row.EstadoProveedor?.nombre),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (row) => (
        <div className="inline-flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-text-secondary/80 hover:text-blue-600 dark:text-background-light/70 dark:hover:text-blue-400 rounded-lg transition-colors"
            title="Editar"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className={`p-2 rounded-lg transition-colors ${
              row.EstadoProveedor?.nombre === "Activo"
                ? "text-text-secondary/80 hover:text-orange-600 dark:text-background-light/70 dark:hover:text-orange-400"
                : "text-text-secondary/80 hover:text-green-600 dark:text-background-light/70 dark:hover:text-green-400"
            }`}
            title={row.EstadoProveedor?.nombre === "Activo" ? "Desactivar" : "Activar"}
          >
            <span className="material-symbols-outlined text-lg">
              {row.EstadoProveedor?.nombre === "Activo" ? "person_off" : "how_to_reg"}
            </span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-background-light">
            Gestión de Proveedores
          </h1>
          <p className="text-text-secondary text-base font-normal leading-normal dark:text-background-light/70">
            Administre los proveedores de la empresa y sus condiciones de crédito.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-6 py-3 min-w-[180px] justify-center"
          disabled={loading}
        >
          <span className="material-symbols-outlined">add_business</span>
          Nuevo Proveedor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/80">
              search
            </span>
            <input
              type="search"
              className="w-full rounded-lg border border-primary/30 bg-white/50 py-2 pl-10 pr-4 text-text-primary placeholder:text-text-secondary/60 focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light dark:placeholder:text-background-light/60"
              placeholder="Buscar por RUC, razón social..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/80 pointer-events-none">
              filter_list
            </span>
            <select
              className="w-full appearance-none rounded-lg border border-primary/30 bg-white/50 py-2 pl-10 pr-8 text-text-primary focus:border-primary focus:ring-primary dark:border-primary/40 dark:bg-background-dark/50 dark:text-background-light sm:w-auto cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <Table
            columns={columns}
            data={currentItems}
            isLoading={loading}
            keyField="id_proveedor"
            sortConfig={sortConfig}
            onSort={handleSort}
            emptyText="No hay proveedores registrados"
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-2">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          limit={itemsPerPage}
          onLimitChange={(newLimit) => {
            setItemsPerPage(newLimit);
            setCurrentPage(1);
          }}
          totalItems={totalItems}
          showingFrom={indexOfFirst + 1}
          showingTo={Math.min(indexOfLast, totalItems)}
        />
      </div>

      {/* Modal */}
      <ProveedorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        proveedor={currentProveedor}
        catalogs={catalogs}
      />
    </AdminLayout>
  );
};

export default ProveedoresPage;
