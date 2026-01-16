// src/routes/config.routes.js
import { Router } from 'express';
import { ConfigController } from '../controllers/config.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { ROLES } from '../constants/codigos.js';
import {
    TokenExpirationSchema,
    BlockConfigSchema,
    ConfiguracionSriSchema,
    UpdateConfiguracionSriSchema,
    CambiarAmbienteSriSchema
} from '../schemas/config.schemas.js';

const router = Router();
const configController = new ConfigController();

// Middleware de seguridad para administradores
const adminAccess = [
    verifyToken,
    checkRole([ROLES.SUPERUSUARIO, ROLES.ADMINISTRADOR])
];

// ==================== CONFIGURACIÓN SRI ====================

/**
 * @route   GET /api/config/sri
 * @desc    Obtener configuración SRI actual
 * @access  Privado (Admin/Superusuario)
 */
router.get(
    '/sri',
    adminAccess,
    (req, res) => configController.obtenerConfiguracionSri(req, res)
);

/**
 * @route   POST /api/config/sri
 * @desc    Guardar configuración SRI (crear o actualizar completa)
 * @access  Privado (Admin/Superusuario)
 */
router.post(
    '/sri',
    adminAccess,
    validateRequest(ConfiguracionSriSchema),
    (req, res) => configController.guardarConfiguracionSri(req, res)
);

/**
 * @route   PUT /api/config/sri
 * @desc    Actualizar parcialmente la configuración SRI
 * @access  Privado (Admin/Superusuario)
 */
router.put(
    '/sri',
    adminAccess,
    validateRequest(UpdateConfiguracionSriSchema),
    (req, res) => configController.actualizarConfiguracionSri(req, res)
);

/**
 * @route   PATCH /api/config/sri/ambiente
 * @desc    Cambiar ambiente SRI (acción rápida: Pruebas/Producción)
 * @access  Privado (Admin/Superusuario)
 */
router.patch(
    '/sri/ambiente',
    adminAccess,
    validateRequest(CambiarAmbienteSriSchema),
    (req, res) => configController.cambiarAmbienteSri(req, res)
);

/**
 * @route   GET /api/config/sri/validar
 * @desc    Validar que la configuración SRI esté completa
 * @access  Privado (Admin/Superusuario)
 */
router.get(
    '/sri/validar',
    adminAccess,
    (req, res) => configController.validarConfiguracionSri(req, res)
);

// ==================== TOKEN Y BLOQUEO ====================

/**
 * @route   PUT /api/config/token-expiration
 * @desc    Actualizar tiempo de expiración del token JWT
 * @access  Privado (Admin/Superusuario)
 */
router.put(
    '/token-expiration',
    adminAccess,
    validateRequest(TokenExpirationSchema),
    (req, res) => configController.actualizarTiempoExpiracion(req, res)
);

/**
 * @route   PUT /api/config/block-config
 * @desc    Actualizar configuración de bloqueo de cuentas
 * @access  Privado (Admin/Superusuario)
 */
router.put(
    '/block-config',
    adminAccess,
    validateRequest(BlockConfigSchema),
    (req, res) => configController.actualizarConfigBloqueo(req, res)
);

/**
 * @route   GET /api/config
 * @desc    Obtener configuración actual del sistema (completa)
 * @access  Privado (Admin/Superusuario)
 */
router.get(
    '/',
    adminAccess,
    (req, res) => configController.obtenerConfiguracion(req, res)
);

export default router;