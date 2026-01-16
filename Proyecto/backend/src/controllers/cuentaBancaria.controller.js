import { CuentaBancariaService } from '../services/cuentaBancaria.service.js';

const cuentaBancariaService = new CuentaBancariaService();

export class CuentaBancariaController {

    async create(req, res) {
        try {
            const data = req.validatedData;
            const cuenta = await cuentaBancariaService.create(data);

            res.status(201).json({
                success: true,
                message: 'Cuenta bancaria creada exitosamente.',
                cuenta
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.validatedParams;
            const data = req.validatedData;
            const cuenta = await cuentaBancariaService.update(id, data);

            res.status(200).json({
                success: true,
                message: 'Cuenta bancaria actualizada correctamente.',
                cuenta
            });
        } catch (error) {
            if (error.message.includes('no encontrada')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const filtros = {
                activa: req.query.activa !== undefined ? req.query.activa === 'true' : undefined,
                es_caja_chica: req.query.caja_chica !== undefined ? req.query.caja_chica === 'true' : undefined,
                id_tipo_cuenta_bancaria: req.query.tipo
            };
            const cuentas = await cuentaBancariaService.getAll(filtros);

            res.status(200).json({
                success: true,
                cuentas
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.validatedParams;
            const cuenta = await cuentaBancariaService.getById(id);

            res.status(200).json({
                success: true,
                cuenta
            });
        } catch (error) {
            if (error.message.includes('no encontrada')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async registrarMovimiento(req, res) {
        try {
            const data = req.validatedData;
            const idUsuario = req.user.id_usuario;

            const resultado = await cuentaBancariaService.registrarMovimiento(data, idUsuario);

            res.status(201).json({
                success: true,
                message: 'Movimiento registrado exitosamente.',
                ...resultado
            });
        } catch (error) {
            if (error.message.includes('no encontrada') || error.message.includes('inactiva')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async transferir(req, res) {
        try {
            const data = req.validatedData;
            const idUsuario = req.user.id_usuario;

            const resultado = await cuentaBancariaService.transferir(data, idUsuario);

            res.status(200).json({
                success: true,
                message: 'Transferencia realizada exitosamente.',
                ...resultado
            });
        } catch (error) {
            if (error.message.includes('no encontrada')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getMovimientos(req, res) {
        try {
            const { id } = req.validatedParams;
            const filtros = {
                tipo_movimiento: req.query.tipo,
                desde: req.query.desde,
                hasta: req.query.hasta,
                limite: req.query.limite ? parseInt(req.query.limite) : 100
            };

            const movimientos = await cuentaBancariaService.getMovimientos(id, filtros);

            res.status(200).json({
                success: true,
                movimientos
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getResumen(req, res) {
        try {
            const resumen = await cuentaBancariaService.getResumenGeneral();

            res.status(200).json({
                success: true,
                resumen
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getCatalogs(req, res) {
        try {
            const catalogs = await cuentaBancariaService.getCatalogs();
            res.status(200).json({
                success: true,
                ...catalogs
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
