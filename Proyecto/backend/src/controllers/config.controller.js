// src/controllers/config.controller.js
import { ConfigService } from '../services/config.service.js';

const configService = new ConfigService();

export class ConfigController {

    // ==================== CONFIGURACIÓN SRI ====================

    /**
     * Obtener configuración SRI
     */
    async obtenerConfiguracionSri(req, res) {
        try {
            const resultado = await configService.obtenerConfiguracionSri();

            res.status(200).json({
                success: true,
                ...resultado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error al obtener la configuración SRI'
            });
        }
    }

    /**
     * Guardar configuración SRI (crear o actualizar)
     */
    async guardarConfiguracionSri(req, res) {
        try {
            const data = req.validatedData;
            const config = await configService.guardarConfiguracionSri(data);

            res.status(200).json({
                success: true,
                message: 'Configuración SRI guardada correctamente',
                configuracion: config
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al guardar la configuración SRI'
            });
        }
    }

    /**
     * Actualizar parcialmente configuración SRI
     */
    async actualizarConfiguracionSri(req, res) {
        try {
            const data = req.validatedData;
            const config = await configService.actualizarConfiguracionSri(data);

            res.status(200).json({
                success: true,
                message: 'Configuración SRI actualizada correctamente',
                configuracion: config
            });
        } catch (error) {
            if (error.message.includes('No existe')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({
                success: false,
                message: error.message || 'Error al actualizar la configuración SRI'
            });
        }
    }

    /**
     * Cambiar ambiente SRI (acción rápida)
     */
    async cambiarAmbienteSri(req, res) {
        try {
            const { ambiente } = req.validatedData;
            const resultado = await configService.cambiarAmbienteSri(ambiente);

            res.status(200).json({
                success: true,
                message: `Ambiente cambiado a: ${resultado.ambiente_nombre}`,
                ...resultado
            });
        } catch (error) {
            if (error.message.includes('No existe')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Validar que la configuración SRI esté completa
     */
    async validarConfiguracionSri(req, res) {
        try {
            const resultado = await configService.validarConfiguracionSri();

            res.status(200).json({
                success: true,
                ...resultado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ==================== TOKEN Y BLOQUEO ====================

    /**
     * Actualizar tiempo de expiración del token
     */
    async actualizarTiempoExpiracion(req, res) {
        try {
            // ✅ Los datos YA están validados por Zod
            const { tiempo_expiracion } = req.validatedData;

            const configActualizada = await configService.actualizarTiempoExpiracion(tiempo_expiracion);

            res.status(200).json({
                success: true,
                message: 'Tiempo de expiración actualizado correctamente',
                configuracion: configActualizada
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al actualizar la configuración'
            });
        }
    }

    /**
     * Actualizar configuración de bloqueo
     */
    async actualizarConfigBloqueo(req, res) {
        try {
            // ✅ Los datos YA están validados por Zod
            const configData = req.validatedData;

            const configActualizada = await configService.actualizarConfigBloqueo(configData);

            res.status(200).json({
                success: true,
                message: 'Configuración de bloqueo actualizada correctamente',
                configuracion: configActualizada
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al actualizar la configuración de bloqueo'
            });
        }
    }

    /**
     * Obtener configuración actual completa
     */
    async obtenerConfiguracion(req, res) {
        try {
            const configuracion = await configService.obtenerConfiguracionActual();

            res.status(200).json({
                success: true,
                configuracion
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener la configuración'
            });
        }
    }
}