import { Router } from 'express';
import { ProveedorController } from '../controllers/proveedor.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { validateRequest, validateParams } from '../middleware/validation.middleware.js';
import {
    CreateProveedorSchema,
    UpdateProveedorSchema,
    ProveedorIdSchema,
    ChangeStateProveedorSchema
} from '../schemas/proveedor.schema.js';
import { ROLES } from '../constants/codigos.js';

const router = Router();
const proveedorController = new ProveedorController();

// Seguridad: Todos estos endpoints requieren autenticación
const accessMiddleware = [
    verifyToken,
    checkRole([ROLES.SUPERUSUARIO, ROLES.ADMINISTRADOR, ROLES.CONTADOR])
];

router.use(accessMiddleware);

// Catálogos para formularios
router.get('/catalogs', (req, res) => proveedorController.getCatalogs(req, res));

// CRUD Proveedores
router.get('/', (req, res) => proveedorController.getAll(req, res));

router.get(
    '/:id',
    validateParams(ProveedorIdSchema),
    (req, res) => proveedorController.getById(req, res)
);

router.get(
    '/:id/cuentas',
    validateParams(ProveedorIdSchema),
    (req, res) => proveedorController.getResumenCuentas(req, res)
);

router.post(
    '/',
    validateRequest(CreateProveedorSchema),
    (req, res) => proveedorController.create(req, res)
);

router.put(
    '/:id',
    validateParams(ProveedorIdSchema),
    validateRequest(UpdateProveedorSchema),
    (req, res) => proveedorController.update(req, res)
);

router.patch(
    '/:id/state',
    validateParams(ProveedorIdSchema),
    validateRequest(ChangeStateProveedorSchema),
    (req, res) => proveedorController.changeState(req, res)
);

export default router;
