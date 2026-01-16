// src/services/proveedor.service.js
import axiosInstance from './axios';

class ProveedorService {
    /**
     * Obtener todos los proveedores
     */
    async getProveedores(filtros = {}) {
        try {
            const params = new URLSearchParams();
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.q) params.append('q', filtros.q);

            const response = await axiosInstance.get(`/proveedores?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener proveedor por ID
     */
    async getProveedor(id) {
        try {
            const response = await axiosInstance.get(`/proveedores/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Crear proveedor
     */
    async createProveedor(data) {
        try {
            const response = await axiosInstance.post('/proveedores', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Actualizar proveedor
     */
    async updateProveedor(id, data) {
        try {
            const response = await axiosInstance.put(`/proveedores/${id}`, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Cambiar estado del proveedor
     */
    async changeState(id, estado) {
        try {
            const response = await axiosInstance.patch(`/proveedores/${id}/state`, { estado });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener catálogos para formularios
     */
    async getCatalogs() {
        try {
            const response = await axiosInstance.get('/proveedores/catalogs');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener resumen de cuentas del proveedor
     */
    async getResumenCuentas(id) {
        try {
            const response = await axiosInstance.get(`/proveedores/${id}/cuentas`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response?.data?.message) {
            return new Error(error.response.data.message);
        }
        return new Error('Error de conexión con el servidor');
    }
}

export const proveedorService = new ProveedorService();
