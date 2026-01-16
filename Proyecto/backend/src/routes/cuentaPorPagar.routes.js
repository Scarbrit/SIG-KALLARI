import { Router } from 'express';
import { CuentaPorPagarController } from '../controllers/cuentaPorPagar.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { validateRequest, validateParams } from '../middleware/validation.middleware.js';
import {
    CreateCuentaPorPagarSchema,
    UpdateCuentaPorPagarSchema,
    CuentaPorPagarIdSchema,
    RegistrarPagoSchema
} from '../schemas/cuentaPorPagar.schema.js';
import { ROLES } from '../constants/codigos.js';

const router = Router();
const cuentaPorPagarController = new CuentaPorPagarController();

// Seguridad: Todos estos endpoints requieren autenticación
const accessMiddleware = [
    verifyToken,
    checkRole([ROLES.SUPERUSUARIO, ROLES.ADMINISTRADOR, ROLES.CONTADOR])
];

router.use(accessMiddleware);

// Resumen general de CxP
router.get('/resumen', (req, res) => cuentaPorPagarController.getResumen(req, res));

// Job para actualizar vencimientos (podría ser un cron)
router.post('/actualizar-vencimientos', (req, res) => cuentaPorPagarController.actualizarVencimientos(req, res));

// CRUD Cuentas por Pagar
router.get('/', (req, res) => cuentaPorPagarController.getAll(req, res));

router.get(
    '/:id',
    validateParams(CuentaPorPagarIdSchema),
    (req, res) => cuentaPorPagarController.getById(req, res)
);

router.post(
    '/',
    validateRequest(CreateCuentaPorPagarSchema),
    (req, res) => cuentaPorPagarController.create(req, res)
);

// Registrar pago a una cuenta
router.post(
    '/:id/pagos',
    validateParams(CuentaPorPagarIdSchema),
    validateRequest(RegistrarPagoSchema),
    (req, res) => cuentaPorPagarController.registrarPago(req, res)
);

export default router;
