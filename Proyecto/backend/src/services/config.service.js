// src/services/config.service.js
import { ConfiguracionToken, ConfiguracionBloqueo, ConfiguracionSri } from '../models/index.js';

// URLs del SRI según ambiente
const SRI_URLS = {
    1: { // Pruebas
        recepcion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
        autorizacion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl'
    },
    2: { // Producción
        recepcion: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
        autorizacion: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl'
    }
};

export class ConfigService {

    // ==================== CONFIGURACIÓN SRI ====================

    /**
     * Obtener configuración SRI actual
     */
    async obtenerConfiguracionSri() {
        const config = await ConfiguracionSri.findOne({
            where: { activo: true }
        });

        if (!config) {
            return {
                configurada: false,
                mensaje: 'La configuración del SRI no ha sido establecida. Por favor configure los datos de su empresa.'
            };
        }

        return {
            configurada: true,
            configuracion: config
        };
    }

    /**
     * Crear o actualizar configuración SRI
     */
    async guardarConfiguracionSri(data) {
        const { ambiente, ...restoDatos } = data;

        // Generar URLs según ambiente
        const urls = SRI_URLS[ambiente];
        if (!urls) {
            throw new Error('El ambiente seleccionado no es válido.');
        }

        // Buscar configuración existente
        let config = await ConfiguracionSri.findOne();

        if (config) {
            // Actualizar existente
            await config.update({
                ...restoDatos,
                ambiente,
                url_recepcion: urls.recepcion,
                url_autorizacion: urls.autorizacion,
                activo: true
            });
        } else {
            // Crear nueva
            config = await ConfiguracionSri.create({
                ...restoDatos,
                ambiente,
                url_recepcion: urls.recepcion,
                url_autorizacion: urls.autorizacion,
                activo: true
            });
        }

        return config;
    }

    /**
     * Actualizar solo algunos campos de la configuración SRI
     */
    async actualizarConfiguracionSri(data) {
        const config = await ConfiguracionSri.findOne({ where: { activo: true } });

        if (!config) {
            throw new Error('No existe configuración SRI. Debe crear una primero.');
        }

        // Si cambia el ambiente, actualizar URLs
        if (data.ambiente && data.ambiente !== config.ambiente) {
            const urls = SRI_URLS[data.ambiente];
            if (!urls) {
                throw new Error('El ambiente seleccionado no es válido.');
            }
            data.url_recepcion = urls.recepcion;
            data.url_autorizacion = urls.autorizacion;
        }

        await config.update(data);
        return config;
    }

    /**
     * Cambiar ambiente SRI (acción rápida)
     */
    async cambiarAmbienteSri(ambiente) {
        const config = await ConfiguracionSri.findOne({ where: { activo: true } });

        if (!config) {
            throw new Error('No existe configuración SRI. Debe configurar primero los datos de su empresa.');
        }

        const urls = SRI_URLS[ambiente];
        if (!urls) {
            throw new Error('El ambiente seleccionado no es válido.');
        }

        await config.update({
            ambiente,
            url_recepcion: urls.recepcion,
            url_autorizacion: urls.autorizacion
        });

        return {
            ambiente,
            ambiente_nombre: ambiente === 1 ? 'Pruebas' : 'Producción',
            config
        };
    }

    /**
     * Validar que la configuración SRI esté completa
     */
    async validarConfiguracionSri() {
        const config = await ConfiguracionSri.findOne({ where: { activo: true } });

        if (!config) {
            return {
                valida: false,
                errores: ['No existe configuración SRI']
            };
        }

        const errores = [];

        if (!config.ruc) errores.push('Falta el RUC');
        if (!config.razon_social) errores.push('Falta la razón social');
        if (!config.direccion_matriz) errores.push('Falta la dirección de la matriz');
        if (!config.url_recepcion) errores.push('Falta la URL de recepción');
        if (!config.url_autorizacion) errores.push('Falta la URL de autorización');

        return {
            valida: errores.length === 0,
            errores,
            config: errores.length === 0 ? config : null
        };
    }

    // ==================== TOKEN Y BLOQUEO ====================

    /**
     * Actualiza el tiempo de expiración del token
     */
    async actualizarTiempoExpiracion(nuevoTiempo) {
        try {
            // ✅ Buscar la configuración (asumimos id 1)
            const configToken = await ConfiguracionToken.findByPk(1);

            if (!configToken) {
                // Si no existe, la creamos
                const nuevaConfig = await ConfiguracionToken.create({
                    id_token: 1,
                    tiempo_expiracion: nuevoTiempo
                });
                return nuevaConfig;
            }

            // ✅ Actualizar
            configToken.tiempo_expiracion = nuevoTiempo;
            await configToken.save();

            return configToken;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualiza configuración de bloqueo
     */
    async actualizarConfigBloqueo(datosConfig) {
        try {
            const { intentos_maximos, duracion_bloqueo_minutos } = datosConfig;

            // ✅ Buscar configuración (asumimos id 1)
            const config = await ConfiguracionBloqueo.findByPk(1);

            if (!config) {
                throw new Error('Configuración de bloqueo no encontrada.');
            }

            // ✅ Actualizar
            config.intentos_maximos = intentos_maximos;
            config.duracion_bloqueo_minutos = duracion_bloqueo_minutos;
            await config.save();

            return config;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener configuración actual completa
     */
    async obtenerConfiguracionActual() {
        try {
            const [configToken, configBloqueo, configSri] = await Promise.all([
                ConfiguracionToken.findByPk(1),
                ConfiguracionBloqueo.findByPk(1),
                ConfiguracionSri.findOne({ where: { activo: true } })
            ]);

            return {
                token: configToken,
                bloqueo: configBloqueo,
                sri: configSri ? {
                    configurada: true,
                    ...configSri.toJSON(),
                    ambiente_nombre: configSri.ambiente === 1 ? 'Pruebas' : 'Producción'
                } : {
                    configurada: false,
                    mensaje: 'Configuración SRI pendiente'
                }
            };

        } catch (error) {
            throw error;
        }
    }
}