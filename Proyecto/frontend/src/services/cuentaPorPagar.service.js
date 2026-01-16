// src/services/cuentaPorPagar.service.js
import axiosInstance from './axios';

class CuentaPorPagarService {
    /**
     * Obtener todas las cuentas por pagar
     */
    async getCuentas(filtros = {}) {
        try {
            const params = new URLSearchParams();
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.proveedor) params.append('proveedor', filtros.proveedor);
            if (filtros.vencidas) params.append('vencidas', filtros.vencidas);

            const response = await axiosInstance.get(`/cuentas-por-pagar?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener cuenta por ID
     */
    async getCuenta(id) {
        try {
            const response = await axiosInstance.get(`/cuentas-por-pagar/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Crear cuenta por pagar
     */
    async createCuenta(data) {
        try {
            const response = await axiosInstance.post('/cuentas-por-pagar', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Registrar pago
     */
    async registrarPago(idCuenta, data) {
        try {
            const response = await axiosInstance.post(`/cuentas-por-pagar/${idCuenta}/pagos`, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener resumen general de CxP
     */
    async getResumen() {
        try {
            const response = await axiosInstance.get('/cuentas-por-pagar/resumen');
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

export const cuentaPorPagarService = new CuentaPorPagarService();
