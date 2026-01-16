import { z } from 'zod';

// Schema para crear cuenta bancaria
export const CreateCuentaBancariaSchema = z.object({
    id_tipo_cuenta_bancaria: z.number({
        invalid_type_error: "El tipo de cuenta es inválido",
        required_error: "Selecciona un tipo de cuenta"
    }).int().positive(),

    id_plan_cuenta: z.number()
        .int()
        .positive()
        .optional()
        .nullable(),

    nombre: z.string({
        required_error: "El nombre de la cuenta es obligatorio"
    })
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre es muy largo")
        .trim(),

    nombre_banco: z.string()
        .max(100, "El nombre del banco es muy largo")
        .trim()
        .optional()
        .nullable(),

    numero_cuenta: z.string()
        .max(30, "El número de cuenta es muy largo")
        .trim()
        .optional()
        .nullable(),

    saldo_inicial: z.number({
        invalid_type_error: "El saldo debe ser un número"
    })
        .min(0, "El saldo no puede ser negativo")
        .optional()
        .default(0),

    es_caja_chica: z.boolean().optional().default(false),

    limite_caja_chica: z.number()
        .positive("El límite debe ser mayor a 0")
        .optional()
        .nullable(),

    activa: z.boolean().optional().default(true)
});

export const UpdateCuentaBancariaSchema = CreateCuentaBancariaSchema.partial().omit({
    saldo_inicial: true // No se puede modificar el saldo inicial
});

export const CuentaBancariaIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número válido")
});

// Schema para movimiento de caja/banco
export const CreateMovimientoSchema = z.object({
    id_cuenta_bancaria: z.number({
        invalid_type_error: "La cuenta es inválida",
        required_error: "Selecciona una cuenta"
    }).int().positive(),

    tipo_movimiento: z.enum(['INGRESO', 'EGRESO', 'TRANSFERENCIA_ENTRADA', 'TRANSFERENCIA_SALIDA'], {
        errorMap: () => ({ message: "El tipo de movimiento no es válido" })
    }),

    concepto: z.string({
        required_error: "El concepto es obligatorio"
    })
        .min(3, "El concepto debe ser más descriptivo")
        .max(500, "El concepto es muy largo")
        .trim(),

    monto: z.number({
        invalid_type_error: "El monto debe ser un número",
        required_error: "El monto es obligatorio"
    }).positive("El monto debe ser mayor a 0"),

    fecha_movimiento: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
        .optional(),

    id_cuenta_bancaria_destino: z.number()
        .int()
        .positive()
        .optional()
        .nullable(),

    referencia: z.string()
        .max(100, "La referencia es muy larga")
        .trim()
        .optional()
        .nullable()
});

// Schema para transferencia entre cuentas
export const TransferenciaSchema = z.object({
    id_cuenta_origen: z.number({
        required_error: "Selecciona la cuenta de origen"
    }).int().positive(),

    id_cuenta_destino: z.number({
        required_error: "Selecciona la cuenta de destino"
    }).int().positive(),

    monto: z.number({
        required_error: "El monto es obligatorio"
    }).positive("El monto debe ser mayor a 0"),

    concepto: z.string()
        .min(3, "El concepto debe ser más descriptivo")
        .max(500, "El concepto es muy largo")
        .trim()
        .optional()
        .default("Transferencia entre cuentas"),

    referencia: z.string()
        .max(100)
        .trim()
        .optional()
        .nullable()
}).refine(data => data.id_cuenta_origen !== data.id_cuenta_destino, {
    message: "La cuenta de origen y destino no pueden ser la misma",
    path: ["id_cuenta_destino"]
});

export const MovimientoIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número válido")
});
