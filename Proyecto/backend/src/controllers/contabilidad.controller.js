import { ContabilidadService } from '../services/contabilidad.service.js';

const contabilidadService = new ContabilidadService();

export class ContabilidadController {

    // ==================== PERÍODOS ====================

    async crearPeriodo(req, res) {
        try {
            const data = req.validatedData;
            const periodo = await contabilidadService.crearPeriodo(data);

            res.status(201).json({
                success: true,
                message: 'Período contable creado exitosamente.',
                periodo
            });
        } catch (error) {
            const status = error.message.includes('ya existe') ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    async cerrarPeriodo(req, res) {
        try {
            const { id } = req.validatedParams;
            const idUsuario = req.user.id_usuario;
            const periodo = await contabilidadService.cerrarPeriodo(id, idUsuario);

            res.status(200).json({
                success: true,
                message: 'Período cerrado exitosamente.',
                periodo
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getPeriodos(req, res) {
        try {
            const filtros = {
                anio: req.query.anio ? parseInt(req.query.anio) : undefined,
                estado: req.query.estado
            };
            const periodos = await contabilidadService.getPeriodos(filtros);

            res.status(200).json({
                success: true,
                periodos
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getPeriodoActivo(req, res) {
        try {
            const periodo = await contabilidadService.getPeriodoActivo();

            res.status(200).json({
                success: true,
                periodo
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ==================== ASIENTOS ====================

    async crearAsiento(req, res) {
        try {
            const data = req.validatedData;
            const idContador = req.user.id_usuario;
            const asiento = await contabilidadService.crearAsiento(data, idContador);

            res.status(201).json({
                success: true,
                message: 'Asiento contable creado exitosamente.',
                asiento
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async aprobarAsiento(req, res) {
        try {
            const { id } = req.validatedParams;
            const idContador = req.user.id_usuario;
            const asiento = await contabilidadService.aprobarAsiento(id, idContador);

            res.status(200).json({
                success: true,
                message: 'Asiento aprobado exitosamente.',
                asiento
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async anularAsiento(req, res) {
        try {
            const { id } = req.validatedParams;
            const { motivo } = req.validatedData;
            const idContador = req.user.id_usuario;
            const asiento = await contabilidadService.anularAsiento(id, motivo, idContador);

            res.status(200).json({
                success: true,
                message: 'Asiento anulado exitosamente.',
                asiento
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAsientos(req, res) {
        try {
            const filtros = {
                id_periodo: req.query.periodo,
                estado: req.query.estado,
                tipo_asiento: req.query.tipo,
                desde: req.query.desde,
                hasta: req.query.hasta
            };
            const asientos = await contabilidadService.getAsientos(filtros);

            res.status(200).json({
                success: true,
                asientos
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAsientoById(req, res) {
        try {
            const { id } = req.validatedParams;
            const asiento = await contabilidadService.getAsientoById(id);

            res.status(200).json({
                success: true,
                asiento
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ==================== PLAN DE CUENTAS ====================

    async getPlanCuentas(req, res) {
        try {
            const filtros = {
                activa: req.query.activa !== undefined ? req.query.activa === 'true' : undefined,
                tipo_cuenta: req.query.tipo,
                nivel: req.query.nivel,
                permitir_movimientos: req.query.movimientos !== undefined
                    ? req.query.movimientos === 'true'
                    : undefined
            };
            const cuentas = await contabilidadService.getPlanCuentas(filtros);

            res.status(200).json({
                success: true,
                cuentas
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getCuentaById(req, res) {
        try {
            const { id } = req.validatedParams;
            const cuenta = await contabilidadService.getCuentaById(id);

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

    // ==================== REPORTES ====================

    async getLibroDiario(req, res) {
        try {
            const { id } = req.validatedParams;
            const libroDiario = await contabilidadService.getLibroDiario(id);

            res.status(200).json({
                success: true,
                ...libroDiario
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getLibroMayor(req, res) {
        try {
            const { id } = req.validatedParams;
            const idPeriodo = req.query.periodo;
            const libroMayor = await contabilidadService.getLibroMayor(id, idPeriodo);

            res.status(200).json({
                success: true,
                ...libroMayor
            });
        } catch (error) {
            if (error.message.includes('no encontrada')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getBalanceGeneral(req, res) {
        try {
            const idPeriodo = req.query.periodo;
            const balance = await contabilidadService.getBalanceGeneral(idPeriodo);

            res.status(200).json({
                success: true,
                balance
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
