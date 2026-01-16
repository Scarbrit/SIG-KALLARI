import { Router } from 'express';
import { ContabilidadController } from '../controllers/contabilidad.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { validateRequest, validateParams } from '../middleware/validation.middleware.js';
import {
    CreatePeriodoContableSchema,
    PeriodoContableIdSchema,
    CerrarPeriodoSchema,
    CreateAsientoContableSchema,
    AsientoContableIdSchema,
    AnularAsientoSchema
} from '../schemas/contabilidad.schema.js';
import { ROLES } from '../constants/codigos.js';

const router = Router();
const contabilidadController = new ContabilidadController();

// Seguridad: Todos estos endpoints requieren autenticación
const accessMiddleware = [
    verifyToken,
    checkRole([ROLES.SUPERUSUARIO, ROLES.ADMINISTRADOR, ROLES.CONTADOR])
];

router.use(accessMiddleware);

// ==================== PERÍODOS CONTABLES ====================

router.get('/periodos', (req, res) => contabilidadController.getPeriodos(req, res));

router.get('/periodos/activo', (req, res) => contabilidadController.getPeriodoActivo(req, res));

router.post(
    '/periodos',
    validateRequest(CreatePeriodoContableSchema),
    (req, res) => contabilidadController.crearPeriodo(req, res)
);

router.post(
    '/periodos/:id/cerrar',
    validateParams(PeriodoContableIdSchema),
    validateRequest(CerrarPeriodoSchema),
    (req, res) => contabilidadController.cerrarPeriodo(req, res)
);

// ==================== ASIENTOS CONTABLES ====================

router.get('/asientos', (req, res) => contabilidadController.getAsientos(req, res));

router.get(
    '/asientos/:id',
    validateParams(AsientoContableIdSchema),
    (req, res) => contabilidadController.getAsientoById(req, res)
);

router.post(
    '/asientos',
    validateRequest(CreateAsientoContableSchema),
    (req, res) => contabilidadController.crearAsiento(req, res)
);

router.post(
    '/asientos/:id/aprobar',
    validateParams(AsientoContableIdSchema),
    (req, res) => contabilidadController.aprobarAsiento(req, res)
);

router.post(
    '/asientos/:id/anular',
    validateParams(AsientoContableIdSchema),
    validateRequest(AnularAsientoSchema),
    (req, res) => contabilidadController.anularAsiento(req, res)
);

// ==================== PLAN DE CUENTAS ====================

router.get('/plan-cuentas', (req, res) => contabilidadController.getPlanCuentas(req, res));

router.get(
    '/plan-cuentas/:id',
    validateParams(AsientoContableIdSchema), // Reutilizamos el schema de ID
    (req, res) => contabilidadController.getCuentaById(req, res)
);

// ==================== REPORTES ====================

router.get(
    '/reportes/libro-diario/:id',
    validateParams(PeriodoContableIdSchema),
    (req, res) => contabilidadController.getLibroDiario(req, res)
);

router.get(
    '/reportes/libro-mayor/:id',
    validateParams(AsientoContableIdSchema), // ID de cuenta
    (req, res) => contabilidadController.getLibroMayor(req, res)
);

router.get('/reportes/balance-general', (req, res) => contabilidadController.getBalanceGeneral(req, res));

export default router;
