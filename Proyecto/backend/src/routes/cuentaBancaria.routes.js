import { Router } from 'express';
import { CuentaBancariaController } from '../controllers/cuentaBancaria.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { validateRequest, validateParams } from '../middleware/validation.middleware.js';
import {
    CreateCuentaBancariaSchema,
    UpdateCuentaBancariaSchema,
    CuentaBancariaIdSchema,
    CreateMovimientoSchema,
    TransferenciaSchema,
    MovimientoIdSchema
} from '../schemas/cuentaBancaria.schema.js';
import { ROLES } from '../constants/codigos.js';

const router = Router();
const cuentaBancariaController = new CuentaBancariaController();

// Seguridad: Todos estos endpoints requieren autenticación
const accessMiddleware = [
    verifyToken,
    checkRole([ROLES.SUPERUSUARIO, ROLES.ADMINISTRADOR, ROLES.CONTADOR])
];

router.use(accessMiddleware);

// Catálogos para formularios
router.get('/catalogs', (req, res) => cuentaBancariaController.getCatalogs(req, res));

// Resumen general de caja/bancos
router.get('/resumen', (req, res) => cuentaBancariaController.getResumen(req, res));

// Transferencias entre cuentas
router.post(
    '/transferencias',
    validateRequest(TransferenciaSchema),
    (req, res) => cuentaBancariaController.transferir(req, res)
);

// CRUD Cuentas Bancarias
router.get('/', (req, res) => cuentaBancariaController.getAll(req, res));

router.get(
    '/:id',
    validateParams(CuentaBancariaIdSchema),
    (req, res) => cuentaBancariaController.getById(req, res)
);

router.get(
    '/:id/movimientos',
    validateParams(CuentaBancariaIdSchema),
    (req, res) => cuentaBancariaController.getMovimientos(req, res)
);

router.post(
    '/',
    validateRequest(CreateCuentaBancariaSchema),
    (req, res) => cuentaBancariaController.create(req, res)
);

router.put(
    '/:id',
    validateParams(CuentaBancariaIdSchema),
    validateRequest(UpdateCuentaBancariaSchema),
    (req, res) => cuentaBancariaController.update(req, res)
);

// Registrar movimiento de caja/banco
router.post(
    '/movimientos',
    validateRequest(CreateMovimientoSchema),
    (req, res) => cuentaBancariaController.registrarMovimiento(req, res)
);

export default router;
