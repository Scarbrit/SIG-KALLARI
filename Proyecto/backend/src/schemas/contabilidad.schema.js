import { z } from 'zod';

// Schema para crear período contable
export const CreatePeriodoContableSchema = z.object({
    anio: z.number({
        invalid_type_error: "El año debe ser un número",
        required_error: "El año es obligatorio"
    })
        .int()
        .min(2000, "El año debe ser mayor a 2000")
        .max(2100, "El año no es válido"),

    mes: z.number({
        invalid_type_error: "El mes debe ser un número",
        required_error: "El mes es obligatorio"
    })
        .int()
        .min(1, "El mes debe estar entre 1 y 12")
        .max(12, "El mes debe estar entre 1 y 12"),

    nombre: z.string()
        .max(50, "El nombre es muy largo")
        .trim()
        .optional()
});

export const PeriodoContableIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número válido")
});

export const CerrarPeriodoSchema = z.object({
    confirmar: z.boolean({
        required_error: "Debe confirmar el cierre del período"
    }).refine(val => val === true, {
        message: "Debe confirmar el cierre del período"
    })
});

// Schema para asiento contable
export const CreateAsientoContableSchema = z.object({
    id_periodo: z.number()
        .int()
        .positive()
        .optional()
        .nullable(),

    fecha_asiento: z.string({
        required_error: "La fecha del asiento es obligatoria"
    }).regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),

    glosa: z.string({
        required_error: "La glosa es obligatoria"
    })
        .min(5, "La glosa debe ser más descriptiva")
        .max(500, "La glosa es muy larga")
        .trim(),

    tipo_asiento: z.enum([
        'VENTA', 'COMPRA', 'COBRO', 'PAGO', 'AJUSTE',
        'APERTURA', 'CIERRE', 'DEPRECIACION', 'PROVISION', 'OTRO'
    ], {
        errorMap: () => ({ message: "El tipo de asiento no es válido" })
    }),

    detalles: z.array(
        z.object({
            id_plan_cuenta: z.number({
                required_error: "La cuenta contable es obligatoria"
            }).int().positive(),
            debe: z.number().min(0).optional().default(0),
            haber: z.number().min(0).optional().default(0)
        }).refine(data => data.debe > 0 || data.haber > 0, {
            message: "Cada línea debe tener un valor en debe o haber"
        }).refine(data => !(data.debe > 0 && data.haber > 0), {
            message: "Una línea no puede tener valores en debe y haber simultáneamente"
        })
    )
        .min(2, "El asiento debe tener al menos 2 líneas")
        .refine(detalles => {
            const totalDebe = detalles.reduce((sum, d) => sum + (d.debe || 0), 0);
            const totalHaber = detalles.reduce((sum, d) => sum + (d.haber || 0), 0);
            return Math.abs(totalDebe - totalHaber) < 0.01; // Tolerancia de centavos
        }, {
            message: "El asiento no está cuadrado: Total Debe debe ser igual a Total Haber"
        })
});

export const AsientoContableIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número válido")
});

export const AnularAsientoSchema = z.object({
    motivo: z.string({
        required_error: "El motivo de anulación es obligatorio"
    })
        .min(10, "El motivo debe ser más descriptivo")
        .max(500, "El motivo es muy largo")
        .trim()
});
