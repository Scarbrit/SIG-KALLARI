// src/services/contabilidad.service.js
import axiosInstance from './axios';

class ContabilidadService {
    // --- Períodos Contables ---
    async getPeriodos(filtros = {}) {
        try {
            const response = await axiosInstance.get('/contabilidad/periodos', { params: filtros });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createPeriodo(data) {
        try {
            const response = await axiosInstance.post('/contabilidad/periodos', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async closePeriodo(id) {
        try {
            const response = await axiosInstance.patch(`/contabilidad/periodos/${id}/cerrar`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // --- Asientos Contables ---
    async getAsientos(filtros = {}) {
        try {
            const response = await axiosInstance.get('/contabilidad/asientos', { params: filtros });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getAsiento(id) {
        try {
            const response = await axiosInstance.get(`/contabilidad/asientos/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createAsiento(data) {
        try {
            const response = await axiosInstance.post('/contabilidad/asientos', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async approveAsiento(id) {
        try {
            const response = await axiosInstance.patch(`/contabilidad/asientos/${id}/aprobar`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async annulAsiento(id, motivo) {
        try {
            const response = await axiosInstance.patch(`/contabilidad/asientos/${id}/anular`, { motivo });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // --- Plan de Cuentas ---
    async getPlanCuentas() {
        try {
            const response = await axiosInstance.get('/contabilidad/plan-cuentas');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // --- Reportes ---
    async getLibroDiario(fechaInicio, fechaFin) {
        try {
            const response = await axiosInstance.get('/contabilidad/reportes/libro-diario', {
                params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getLibroMayor(idCuenta, fechaInicio, fechaFin) {
        try {
            const response = await axiosInstance.get(`/contabilidad/reportes/libro-mayor/${idCuenta}`, {
                params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getBalanceGeneral(fecha) {
        try {
            const response = await axiosInstance.get('/contabilidad/reportes/balance-general', {
                params: { fecha }
            });
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

export const contabilidadService = new ContabilidadService();
