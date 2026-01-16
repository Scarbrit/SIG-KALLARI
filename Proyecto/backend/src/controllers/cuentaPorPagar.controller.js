import { CuentaPorPagarService } from '../services/cuentaPorPagar.service.js';

const cuentaPorPagarService = new CuentaPorPagarService();

export class CuentaPorPagarController {

    async create(req, res) {
        try {
            const data = req.validatedData;
            const idUsuario = req.user.id_usuario;
            const cuenta = await cuentaPorPagarService.create(data, idUsuario);

            res.status(201).json({
                success: true,
                message: 'Cuenta por pagar registrada exitosamente.',
                cuenta
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async registrarPago(req, res) {
        try {
            const { id } = req.validatedParams;
            const data = req.validatedData;
            const idUsuario = req.user.id_usuario;

            const resultado = await cuentaPorPagarService.registrarPago(id, data, idUsuario);

            res.status(200).json({
                success: true,
                message: 'Pago registrado exitosamente.',
                ...resultado
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
                estado: req.query.estado,
                id_proveedor: req.query.proveedor,
                vencidas: req.query.vencidas === 'true',
                desde: req.query.desde,
                hasta: req.query.hasta
            };
            const cuentas = await cuentaPorPagarService.getAll(filtros);

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
            const cuenta = await cuentaPorPagarService.getById(id);

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

    async getResumen(req, res) {
        try {
            const resumen = await cuentaPorPagarService.getResumen();

            res.status(200).json({
                success: true,
                resumen
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async actualizarVencimientos(req, res) {
        try {
            const resultado = await cuentaPorPagarService.actualizarDiasVencidos();

            res.status(200).json({
                success: true,
                message: `Se actualizaron ${resultado.actualizadas} cuenta(s).`,
                ...resultado
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
