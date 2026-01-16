import db, {
    CuentaPorPagar,
    PagoCuentaPagar,
    Proveedor,
    MetodoPago,
    Usuario,
    CuentaBancaria,
    MovimientoCajaBanco
} from '../models/index.js';
import { Op } from 'sequelize';

const { sequelize } = db;

export class CuentaPorPagarService {

    async create(data, idUsuario) {
        const t = await sequelize.transaction();
        try {
            const { id_proveedor, monto_total, fecha_factura, fecha_vencimiento, ...cuentaData } = data;

            // Validar proveedor
            const proveedor = await Proveedor.findByPk(id_proveedor, { transaction: t });
            if (!proveedor) throw new Error("El proveedor no existe.");

            // Calcular días de vencimiento
            const hoy = new Date();
            const vencimiento = new Date(fecha_vencimiento);
            const diasVencidos = vencimiento < hoy ? Math.floor((hoy - vencimiento) / (1000 * 60 * 60 * 24)) : 0;

            // Crear cuenta por pagar
            const cuenta = await CuentaPorPagar.create({
                ...cuentaData,
                id_proveedor,
                fecha_factura,
                fecha_vencimiento,
                monto_total,
                monto_pagado: 0,
                saldo_pendiente: monto_total,
                dias_vencidos: diasVencidos,
                estado: diasVencidos > 0 ? 'VENCIDA' : 'PENDIENTE'
            }, { transaction: t });

            await t.commit();
            return cuenta;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async registrarPago(idCuenta, data, idUsuario) {
        const t = await sequelize.transaction();
        try {
            const cuenta = await CuentaPorPagar.findByPk(idCuenta, { transaction: t });
            if (!cuenta) throw new Error("Cuenta por pagar no encontrada.");

            if (cuenta.estado === 'PAGADA') {
                throw new Error("Esta cuenta ya está completamente pagada.");
            }

            const { monto_pago, id_metodo_pago, id_cuenta_bancaria, ...pagoData } = data;

            // Validar que el monto no exceda el saldo pendiente
            if (monto_pago > parseFloat(cuenta.saldo_pendiente)) {
                throw new Error(`El monto del pago ($${monto_pago}) excede el saldo pendiente ($${cuenta.saldo_pendiente}).`);
            }

            // Validar método de pago
            const metodoPago = await MetodoPago.findByPk(id_metodo_pago, { transaction: t });
            if (!metodoPago) throw new Error("Método de pago no válido.");

            // Si hay cuenta bancaria, validar y registrar movimiento
            if (id_cuenta_bancaria) {
                const cuentaBancaria = await CuentaBancaria.findByPk(id_cuenta_bancaria, { transaction: t });
                if (!cuentaBancaria) throw new Error("Cuenta bancaria no encontrada.");

                // Verificar fondos suficientes
                if (parseFloat(cuentaBancaria.saldo_actual) < monto_pago) {
                    throw new Error("Fondos insuficientes en la cuenta bancaria.");
                }

                // Actualizar saldo de cuenta bancaria
                const saldoAnterior = parseFloat(cuentaBancaria.saldo_actual);
                const saldoPosterior = saldoAnterior - monto_pago;

                await cuentaBancaria.update({
                    saldo_actual: saldoPosterior
                }, { transaction: t });
            }

            // Crear registro de pago
            const pago = await PagoCuentaPagar.create({
                ...pagoData,
                id_cuenta_pagar: idCuenta,
                id_metodo_pago,
                id_cuenta_bancaria,
                id_usuario_registro: idUsuario,
                monto_pago,
                fecha_pago: data.fecha_pago || new Date()
            }, { transaction: t });

            // Actualizar cuenta por pagar
            const nuevoMontoPagado = parseFloat(cuenta.monto_pagado) + monto_pago;
            const nuevoSaldoPendiente = parseFloat(cuenta.monto_total) - nuevoMontoPagado;
            const nuevoEstado = nuevoSaldoPendiente <= 0 ? 'PAGADA' : 'PARCIAL';

            await cuenta.update({
                monto_pagado: nuevoMontoPagado,
                saldo_pendiente: nuevoSaldoPendiente,
                estado: nuevoEstado
            }, { transaction: t });

            await t.commit();

            return {
                pago,
                cuenta: await this.getById(idCuenta)
            };

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAll(filtros = {}) {
        const where = {};

        if (filtros.estado) {
            where.estado = filtros.estado;
        }

        if (filtros.id_proveedor) {
            where.id_proveedor = filtros.id_proveedor;
        }

        if (filtros.vencidas) {
            where.estado = 'VENCIDA';
        }

        if (filtros.desde && filtros.hasta) {
            where.fecha_factura = {
                [Op.between]: [filtros.desde, filtros.hasta]
            };
        }

        return await CuentaPorPagar.findAll({
            where,
            include: [
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['id_proveedor', 'razon_social', 'identificacion']
                },
                { model: PagoCuentaPagar }
            ],
            order: [['fecha_vencimiento', 'ASC']]
        });
    }

    async getById(id) {
        const cuenta = await CuentaPorPagar.findByPk(id, {
            include: [
                {
                    model: Proveedor,
                    as: 'proveedor'
                },
                {
                    model: PagoCuentaPagar,
                    include: [
                        { model: MetodoPago, as: 'metodo_pago' },
                        { model: Usuario, as: 'usuario_registro', attributes: ['id_usuario', 'nombre', 'apellido'] }
                    ]
                }
            ]
        });
        if (!cuenta) throw new Error("Cuenta por pagar no encontrada.");
        return cuenta;
    }

    async getResumen() {
        const cuentas = await CuentaPorPagar.findAll();

        const totalPorPagar = cuentas.reduce((sum, c) => sum + parseFloat(c.saldo_pendiente), 0);
        const totalVencido = cuentas
            .filter(c => c.estado === 'VENCIDA')
            .reduce((sum, c) => sum + parseFloat(c.saldo_pendiente), 0);

        const porEstado = {
            pendiente: cuentas.filter(c => c.estado === 'PENDIENTE').length,
            parcial: cuentas.filter(c => c.estado === 'PARCIAL').length,
            vencida: cuentas.filter(c => c.estado === 'VENCIDA').length,
            pagada: cuentas.filter(c => c.estado === 'PAGADA').length
        };

        return {
            total_por_pagar: totalPorPagar,
            total_vencido: totalVencido,
            por_estado: porEstado,
            total_cuentas: cuentas.length
        };
    }

    async actualizarDiasVencidos() {
        // Job para actualizar días vencidos y estados
        const cuentasPendientes = await CuentaPorPagar.findAll({
            where: {
                estado: { [Op.in]: ['PENDIENTE', 'PARCIAL'] }
            }
        });

        const hoy = new Date();

        for (const cuenta of cuentasPendientes) {
            const vencimiento = new Date(cuenta.fecha_vencimiento);
            if (vencimiento < hoy) {
                const diasVencidos = Math.floor((hoy - vencimiento) / (1000 * 60 * 60 * 24));
                await cuenta.update({
                    dias_vencidos: diasVencidos,
                    estado: 'VENCIDA'
                });
            }
        }

        return { actualizadas: cuentasPendientes.length };
    }
}
