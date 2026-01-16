import { z } from 'zod';

// Schema para crear cuenta por pagar
export const CreateCuentaPorPagarSchema = z.object({
    id_proveedor: z.number({
        invalid_type_error: "El proveedor es inválido",
        required_error: "Selecciona un proveedor"
    }).int().positive(),

    numero_factura: z.string({
        required_error: "El número de factura es obligatorio"
    })
        .min(1, "El número de factura es obligatorio")
        .max(50, "El número de factura es muy largo")
        .trim(),

    fecha_factura: z.string({
        required_error: "La fecha de factura es obligatoria"
    }).regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),

    fecha_vencimiento: z.string({
        required_error: "La fecha de vencimiento es obligatoria"
    }).regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),

    monto_total: z.number({
        invalid_type_error: "El monto debe ser un número",
        required_error: "El monto total es obligatorio"
    }).positive("El monto debe ser mayor a 0"),

    concepto: z.string()
        .max(1000, "El concepto es muy largo")
        .trim()
        .optional()
        .nullable(),

    observaciones: z.string()
        .max(1000, "Las observaciones son muy largas")
        .trim()
        .optional()
        .nullable()
});

export const UpdateCuentaPorPagarSchema = z.object({
    fecha_vencimiento: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
        .optional(),
    concepto: z.string().max(1000).trim().optional().nullable(),
    observaciones: z.string().max(1000).trim().optional().nullable()
});

export const CuentaPorPagarIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número válido")
});

// Schema para registrar pago
export const RegistrarPagoSchema = z.object({
    id_metodo_pago: z.number({
        invalid_type_error: "El método de pago es inválido",
        required_error: "Selecciona un método de pago"
    }).int().positive(),

    id_cuenta_bancaria: z.number()
        .int()
        .positive()
        .optional()
        .nullable(),

    monto_pago: z.number({
        invalid_type_error: "El monto debe ser un número",
        required_error: "El monto del pago es obligatorio"
    }).positive("El monto debe ser mayor a 0"),

    fecha_pago: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
        .optional(),

    referencia_pago: z.string()
        .max(50, "La referencia es muy larga")
        .trim()
        .optional()
        .nullable(),

    observaciones: z.string()
        .max(1000, "Las observaciones son muy largas")
        .trim()
        .optional()
        .nullable()
});
