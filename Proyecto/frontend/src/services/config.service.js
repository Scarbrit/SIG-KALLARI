// src/services/config.service.js
import axiosInstance from './axios';

class ConfigService {
    /**
     * Obtener la configuración actual del sistema
     */
    async getConfig() {
        try {
            const response = await axiosInstance.get('/config');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // ==================== CONFIGURACIÓN SRI ====================

    /**
     * Obtener configuración SRI
     */
    async getSriConfig() {
        try {
            const response = await axiosInstance.get('/config/sri');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Guardar configuración SRI (crear o actualizar completa)
     */
    async saveSriConfig(data) {
        try {
            const response = await axiosInstance.post('/config/sri', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Actualizar parcialmente configuración SRI
     */
    async updateSriConfig(data) {
        try {
            const response = await axiosInstance.put('/config/sri', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Cambiar ambiente SRI (acción rápida)
     */
    async changeAmbiente(ambiente) {
        try {
            const response = await axiosInstance.patch('/config/sri/ambiente', { ambiente });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Validar que la configuración SRI esté completa
     */
    async validateSriConfig() {
        try {
            const response = await axiosInstance.get('/config/sri/validar');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // ==================== TOKEN Y BLOQUEO ====================

    /**
     * Actualizar tiempo de expiración del token
     */
    async updateTokenExpiration(tiempo_expiracion) {
        try {
            const response = await axiosInstance.put('/config/token-expiration', {
                tiempo_expiracion
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Actualizar configuración de bloqueo
     */
    async updateBlockConfig(configData) {
        try {
            const response = await axiosInstance.put('/config/block-config', configData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // ==================== HELPERS ====================

    /**
     * Manejar errores de la API
     */
    handleError(error) {
        if (error.name === 'ConnectionError' || error.name === 'TimeoutError') {
            return error;
        }

        // Error de validación del backend
        if (error.response?.data?.message) {
            return new Error(error.response.data.message);
        }

        // Error genérico
        return new Error('Error de conexión con el servidor');
    }

    /**
     * Convertir formato frontend a backend para tiempo de expiración
     */
    convertToBackendFormat(value, unit) {
        const unitsMap = {
            'Minutos': 'm',
            'Horas': 'h',
            'Días': 'd'
        };

        return `${value}${unitsMap[unit]}`;
    }

    /**
     * Convertir formato backend a frontend para tiempo de expiración
     */
    convertToFrontendFormat(backendTime) {
        if (!backendTime) return { value: '30', unit: 'Horas' };

        const match = backendTime.match(/^(\d+)([smhd])$/);
        if (!match) return { value: '30', unit: 'Horas' };

        const value = match[1];
        const unitMap = {
            's': 'Minutos',
            'm': 'Minutos',
            'h': 'Horas',
            'd': 'Días'
        };

        return {
            value,
            unit: unitMap[match[2]]
        };
    }

    /**
     * Convertir minutos a formato frontend
     */
    convertMinutesToFrontend(minutes) {
        if (minutes >= 60) {
            return {
                duration: (minutes / 60).toString(),
                unit: 'Horas'
            };
        }
        return {
            duration: minutes.toString(),
            unit: 'Minutos'
        };
    }

    /**
     * Convertir formato frontend a minutos
     */
    convertFrontendToMinutes(duration, unit) {
        const durationNum = parseInt(duration);
        if (unit === 'Horas') {
            return durationNum * 60;
        }
        return durationNum;
    }
}

export const configService = new ConfigService();