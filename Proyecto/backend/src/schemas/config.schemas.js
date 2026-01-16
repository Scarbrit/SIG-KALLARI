// src/schemas/config.schemas.js
import { z } from 'zod';

// Schema para tiempo de expiración de token
export const TokenExpirationSchema = z.object({
    tiempo_expiracion: z.string()
        .min(1, "El tiempo de expiración es requerido")
        .regex(/^\d+[smhd]$/, {
            message: 'Formato inválido. Use "s" (segundos), "m" (minutos), "h" (horas) o "d" (días). Ej: "8h"'
        })
        .refine((time) => {
            // Validación adicional: máximo 30 días por seguridad
            const value = parseInt(time);
            const unit = time.slice(-1);

            if (unit === 'd' && value > 30) {
                return false;
            }
            if (unit === 'h' && value > 720) { // 30 días en horas
                return false;
            }
            return true;
        }, {
            message: 'El tiempo máximo permitido es 30 días'
        })
});

// Schema para configuración de bloqueo
export const BlockConfigSchema = z.object({
    intentos_maximos: z.number()
        .int("Los intentos máximos deben ser un número entero")
        .min(1, "Mínimo 1 intento permitido")
        .max(10, "Máximo 10 intentos permitidos por seguridad"),

    duracion_bloqueo_minutos: z.number()
        .int("La duración debe ser un número entero")
        .min(1, "Mínimo 1 minuto de bloqueo")
        .max(1440, "Máximo 24 horas (1440 minutos) de bloqueo")
});

// Schema para parámetros de configuración (si necesitas)
export const ConfigIdSchema = z.object({
    id: z.string()
        .regex(/^\d+$/, "El ID debe ser un número")
        .transform(Number)
});

// ==================== CONFIGURACIÓN SRI ====================

// Validador de RUC ecuatoriano
const validarRUC = (ruc) => {
    if (!/^\d{13}$/.test(ruc)) return false;
    if (!ruc.endsWith('001')) return false;

    // Validar dígito verificador (algoritmo módulo 11)
    const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
        suma += parseInt(ruc[i]) * coeficientes[i];
    }
    const residuo = suma % 11;
    const digitoVerificador = residuo === 0 ? 0 : 11 - residuo;

    return parseInt(ruc[9]) === digitoVerificador;
};

// Schema para configuración SRI
export const ConfiguracionSriSchema = z.object({
    razon_social: z.string({
        required_error: "La razón social es obligatoria"
    })
        .min(3, "La razón social debe tener al menos 3 caracteres")
        .max(300, "La razón social es muy larga")
        .trim(),

    nombre_comercial: z.string()
        .max(300, "El nombre comercial es muy largo")
        .trim()
        .optional()
        .nullable(),

    ruc: z.string({
        required_error: "El RUC es obligatorio"
    })
        .length(13, "El RUC debe tener exactamente 13 dígitos")
        .regex(/^\d+$/, "El RUC solo debe contener números")
        .refine(validarRUC, {
            message: "El RUC no es válido. Verifique el número ingresado."
        }),

    direccion_matriz: z.string({
        required_error: "La dirección de la matriz es obligatoria"
    })
        .min(5, "La dirección debe ser más descriptiva")
        .max(300, "La dirección es muy larga")
        .trim(),

    establecimiento: z.string()
        .length(3, "El establecimiento debe tener 3 dígitos")
        .regex(/^\d{3}$/, "El establecimiento debe ser un número de 3 dígitos (ej: 001)")
        .default("001"),

    punto_emision: z.string()
        .length(3, "El punto de emisión debe tener 3 dígitos")
        .regex(/^\d{3}$/, "El punto de emisión debe ser un número de 3 dígitos (ej: 001)")
        .default("001"),

    ambiente: z.number({
        required_error: "El ambiente es obligatorio"
    })
        .int()
        .min(1, "El ambiente debe ser 1 (Pruebas) o 2 (Producción)")
        .max(2, "El ambiente debe ser 1 (Pruebas) o 2 (Producción)"),

    tipo_emision: z.number()
        .int()
        .min(1)
        .max(1)
        .default(1), // 1 = Normal (único soportado actualmente)

    obligado_contabilidad: z.boolean({
        required_error: "Indique si es obligado a llevar contabilidad"
    }),

    contribuyente_especial: z.string()
        .max(5, "El número de contribuyente especial es muy largo")
        .regex(/^\d*$/, "Solo debe contener números")
        .optional()
        .nullable()
});

// Schema para actualización parcial
export const UpdateConfiguracionSriSchema = ConfiguracionSriSchema.partial();

// Schema para cambiar ambiente (acción rápida)
export const CambiarAmbienteSriSchema = z.object({
    ambiente: z.number()
        .int()
        .min(1)
        .max(2)
        .refine(val => val === 1 || val === 2, {
            message: "El ambiente debe ser 1 (Pruebas) o 2 (Producción)"
        })
});