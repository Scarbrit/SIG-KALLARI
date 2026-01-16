// src/services/cuentaBancaria.service.js
import axiosInstance from './axios';

class CuentaBancariaService {
    async getCuentas(filtros = {}) {
        try {
            const params = new URLSearchParams();
            if (filtros.activa !== undefined) params.append('activa', filtros.activa);
            if (filtros.tipo) params.append('tipo', filtros.tipo);

            const response = await axiosInstance.get(`/cuentas-bancarias?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getCuenta(id) {
        try {
            const response = await axiosInstance.get(`/cuentas-bancarias/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createCuenta(data) {
        try {
            const response = await axiosInstance.post('/cuentas-bancarias', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateCuenta(id, data) {
        try {
            const response = await axiosInstance.put(`/cuentas-bancarias/${id}`, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getMovimientos(idCuenta, filtros = {}) {
        try {
            const params = new URLSearchParams();
            if (filtros.tipo) params.append('tipo', filtros.tipo);
            if (filtros.limite) params.append('limite', filtros.limite);

            const response = await axiosInstance.get(`/cuentas-bancarias/${idCuenta}/movimientos?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async registrarMovimiento(data) {
        try {
            const response = await axiosInstance.post('/cuentas-bancarias/movimientos', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async transferir(data) {
        try {
            const response = await axiosInstance.post('/cuentas-bancarias/transferencias', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getResumen() {
        try {
            const response = await axiosInstance.get('/cuentas-bancarias/resumen');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getCatalogs() {
        try {
            const response = await axiosInstance.get('/cuentas-bancarias/catalogs');
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

export const cuentaBancariaService = new CuentaBancariaService();
