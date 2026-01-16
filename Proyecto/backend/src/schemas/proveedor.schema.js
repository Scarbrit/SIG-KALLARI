import { z } from 'zod';

// Schema para crear proveedor
export const CreateProveedorSchema = z.object({
    id_tipo_identificacion: z.number({
        invalid_type_error: "El tipo de identificación es inválido",
        required_error: "Selecciona un tipo de identificación"
    }).int().positive(),

    identificacion: z.string({
        required_error: "La identificación es obligatoria"
    })
        .min(10, "La identificación debe tener al menos 10 caracteres")
        .max(20, "La identificación es muy larga (máx 20 caracteres)")
        .regex(/^[0-9]+$/, "La identificación solo debe contener números")
        .trim(),

    razon_social: z.string({
        required_error: "La razón social es obligatoria"
    })
        .min(3, "La razón social debe tener al menos 3 caracteres")
        .max(255, "La razón social es muy larga")
        .trim(),

    nombre_comercial: z.string()
        .max(255, "El nombre comercial es muy largo")
        .trim()
        .optional()
        .nullable(),

    direccion: z.string()
        .max(500, "La dirección es muy larga")
        .trim()
        .optional()
        .nullable(),

    telefono: z.string()
        .regex(/^[0-9]{7,15}$/, "El teléfono debe tener entre 7 y 15 dígitos")
        .trim()
        .optional()
        .nullable(),

    email: z.string()
        .email("Formato de correo electrónico inválido")
        .toLowerCase()
        .trim()
        .optional()
        .nullable(),

    id_parroquia: z.number()
        .int()
        .positive()
        .optional()
        .nullable(),

    dias_credito: z.number({
        invalid_type_error: "Los días de crédito deben ser un número"
    })
        .int()
        .min(0, "Los días de crédito no pueden ser negativos")
        .max(365, "Los días de crédito no pueden ser mayores a 365")
        .optional()
        .default(0),

    id_estado_proveedor: z.number().int().positive().optional(),

    observaciones: z.string()
        .max(1000, "Las observaciones son muy largas")
        .trim()
        .optional()
        .nullable()
});

export const UpdateProveedorSchema = CreateProveedorSchema.partial();

export const ProveedorIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID del proveedor debe ser un número válido")
});

export const ChangeStateProveedorSchema = z.object({
    estado: z.enum(['Activo', 'Inactivo', 'Suspendido', 'En Evaluación'], {
        errorMap: () => ({ message: "El estado no es válido." })
    })
});
