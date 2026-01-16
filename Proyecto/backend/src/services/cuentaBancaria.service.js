import db, {
    CuentaBancaria,
    TipoCuentaBancaria,
    PlanCuenta,
    MovimientoCajaBanco,
    Usuario
} from '../models/index.js';
import { Op } from 'sequelize';

const { sequelize } = db;

export class CuentaBancariaService {

    async create(data) {
        const t = await sequelize.transaction();
        try {
            const { id_tipo_cuenta_bancaria, saldo_inicial, ...cuentaData } = data;

            // Validar tipo de cuenta
            const tipo = await TipoCuentaBancaria.findByPk(id_tipo_cuenta_bancaria, { transaction: t });
            if (!tipo) throw new Error("El tipo de cuenta bancaria no es válido.");

            // Validar plan de cuenta si se envía
            if (data.id_plan_cuenta) {
                const planCuenta = await PlanCuenta.findByPk(data.id_plan_cuenta, { transaction: t });
                if (!planCuenta) throw new Error("La cuenta contable no existe.");
                if (!planCuenta.permitir_movimientos) {
                    throw new Error("La cuenta contable seleccionada no permite movimientos.");
                }
            }

            // Crear cuenta bancaria
            const cuenta = await CuentaBancaria.create({
                ...cuentaData,
                id_tipo_cuenta_bancaria,
                saldo_inicial: saldo_inicial || 0,
                saldo_actual: saldo_inicial || 0
            }, { transaction: t });

            await t.commit();
            return cuenta;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async update(id, data) {
        const t = await sequelize.transaction();
        try {
            const cuenta = await CuentaBancaria.findByPk(id, { transaction: t });
            if (!cuenta) throw new Error("Cuenta bancaria no encontrada.");

            await cuenta.update(data, { transaction: t });
            await t.commit();

            return await this.getById(id);

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAll(filtros = {}) {
        const where = {};

        if (filtros.activa !== undefined) {
            where.activa = filtros.activa;
        }

        if (filtros.es_caja_chica !== undefined) {
            where.es_caja_chica = filtros.es_caja_chica;
        }

        if (filtros.id_tipo_cuenta_bancaria) {
            where.id_tipo_cuenta_bancaria = filtros.id_tipo_cuenta_bancaria;
        }

        return await CuentaBancaria.findAll({
            where,
            include: [
                { model: TipoCuentaBancaria, as: 'tipo_cuenta_bancaria' },
                { model: PlanCuenta, as: 'plan_cuenta' }
            ],
            order: [['nombre', 'ASC']]
        });
    }

    async getById(id) {
        const cuenta = await CuentaBancaria.findByPk(id, {
            include: [
                { model: TipoCuentaBancaria, as: 'tipo_cuenta_bancaria' },
                { model: PlanCuenta, as: 'plan_cuenta' }
            ]
        });
        if (!cuenta) throw new Error("Cuenta bancaria no encontrada.");
        return cuenta;
    }

    async registrarMovimiento(data, idUsuario) {
        const t = await sequelize.transaction();
        try {
            const { id_cuenta_bancaria, tipo_movimiento, monto, ...movData } = data;

            const cuenta = await CuentaBancaria.findByPk(id_cuenta_bancaria, { transaction: t });
            if (!cuenta) throw new Error("Cuenta bancaria no encontrada.");
            if (!cuenta.activa) throw new Error("La cuenta bancaria está inactiva.");

            const saldoAnterior = parseFloat(cuenta.saldo_actual);
            let saldoPosterior;

            // Calcular nuevo saldo según tipo de movimiento
            if (tipo_movimiento === 'INGRESO' || tipo_movimiento === 'TRANSFERENCIA_ENTRADA') {
                saldoPosterior = saldoAnterior + monto;
            } else if (tipo_movimiento === 'EGRESO' || tipo_movimiento === 'TRANSFERENCIA_SALIDA') {
                if (saldoAnterior < monto) {
                    throw new Error(`Fondos insuficientes. Saldo actual: $${saldoAnterior.toFixed(2)}`);
                }
                saldoPosterior = saldoAnterior - monto;
            }

            // Crear movimiento
            const movimiento = await MovimientoCajaBanco.create({
                ...movData,
                id_cuenta_bancaria,
                tipo_movimiento,
                monto,
                saldo_anterior: saldoAnterior,
                saldo_posterior: saldoPosterior,
                id_usuario_registro: idUsuario,
                fecha_movimiento: data.fecha_movimiento || new Date()
            }, { transaction: t });

            // Actualizar saldo de la cuenta
            await cuenta.update({ saldo_actual: saldoPosterior }, { transaction: t });

            await t.commit();

            return {
                movimiento,
                cuenta: await this.getById(id_cuenta_bancaria)
            };

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async transferir(data, idUsuario) {
        const t = await sequelize.transaction();
        try {
            const { id_cuenta_origen, id_cuenta_destino, monto, concepto, referencia } = data;

            // Validar cuentas
            const cuentaOrigen = await CuentaBancaria.findByPk(id_cuenta_origen, { transaction: t });
            const cuentaDestino = await CuentaBancaria.findByPk(id_cuenta_destino, { transaction: t });

            if (!cuentaOrigen) throw new Error("Cuenta de origen no encontrada.");
            if (!cuentaDestino) throw new Error("Cuenta de destino no encontrada.");
            if (!cuentaOrigen.activa) throw new Error("La cuenta de origen está inactiva.");
            if (!cuentaDestino.activa) throw new Error("La cuenta de destino está inactiva.");

            const saldoOrigen = parseFloat(cuentaOrigen.saldo_actual);
            if (saldoOrigen < monto) {
                throw new Error(`Fondos insuficientes en cuenta origen. Saldo: $${saldoOrigen.toFixed(2)}`);
            }

            const saldoDestino = parseFloat(cuentaDestino.saldo_actual);

            // Movimiento de salida
            const movSalida = await MovimientoCajaBanco.create({
                id_cuenta_bancaria: id_cuenta_origen,
                tipo_movimiento: 'TRANSFERENCIA_SALIDA',
                concepto: concepto || `Transferencia a ${cuentaDestino.nombre}`,
                monto,
                saldo_anterior: saldoOrigen,
                saldo_posterior: saldoOrigen - monto,
                id_cuenta_bancaria_destino: id_cuenta_destino,
                id_usuario_registro: idUsuario,
                referencia,
                fecha_movimiento: new Date()
            }, { transaction: t });

            // Movimiento de entrada
            const movEntrada = await MovimientoCajaBanco.create({
                id_cuenta_bancaria: id_cuenta_destino,
                tipo_movimiento: 'TRANSFERENCIA_ENTRADA',
                concepto: concepto || `Transferencia desde ${cuentaOrigen.nombre}`,
                monto,
                saldo_anterior: saldoDestino,
                saldo_posterior: saldoDestino + monto,
                id_cuenta_bancaria_destino: id_cuenta_origen,
                id_usuario_registro: idUsuario,
                referencia,
                fecha_movimiento: new Date()
            }, { transaction: t });

            // Actualizar saldos
            await cuentaOrigen.update({ saldo_actual: saldoOrigen - monto }, { transaction: t });
            await cuentaDestino.update({ saldo_actual: saldoDestino + monto }, { transaction: t });

            await t.commit();

            return {
                movimiento_salida: movSalida,
                movimiento_entrada: movEntrada,
                cuenta_origen: await this.getById(id_cuenta_origen),
                cuenta_destino: await this.getById(id_cuenta_destino)
            };

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getMovimientos(idCuenta, filtros = {}) {
        const where = { id_cuenta_bancaria: idCuenta };

        if (filtros.tipo_movimiento) {
            where.tipo_movimiento = filtros.tipo_movimiento;
        }

        if (filtros.desde && filtros.hasta) {
            where.fecha_movimiento = {
                [Op.between]: [filtros.desde, filtros.hasta]
            };
        }

        return await MovimientoCajaBanco.findAll({
            where,
            include: [
                { model: Usuario, as: 'usuario_registro', attributes: ['id_usuario', 'nombre', 'apellido'] }
            ],
            order: [['fecha_movimiento', 'DESC']],
            limit: filtros.limite || 100
        });
    }

    async getResumenGeneral() {
        const cuentas = await CuentaBancaria.findAll({
            where: { activa: true },
            include: [{ model: TipoCuentaBancaria, as: 'tipo_cuenta_bancaria' }]
        });

        const totalDisponible = cuentas.reduce((sum, c) => sum + parseFloat(c.saldo_actual), 0);
        const totalCajas = cuentas
            .filter(c => c.tipo_cuenta_bancaria?.nombre === 'Caja' || c.tipo_cuenta_bancaria?.nombre === 'Caja Chica')
            .reduce((sum, c) => sum + parseFloat(c.saldo_actual), 0);
        const totalBancos = cuentas
            .filter(c => c.tipo_cuenta_bancaria?.nombre === 'Corriente' || c.tipo_cuenta_bancaria?.nombre === 'Ahorros')
            .reduce((sum, c) => sum + parseFloat(c.saldo_actual), 0);

        return {
            total_disponible: totalDisponible,
            total_cajas: totalCajas,
            total_bancos: totalBancos,
            cuentas: cuentas.map(c => ({
                id: c.id_cuenta_bancaria,
                nombre: c.nombre,
                tipo: c.tipo_cuenta_bancaria?.nombre,
                saldo: parseFloat(c.saldo_actual)
            }))
        };
    }

    async getCatalogs() {
        const tipos = await TipoCuentaBancaria.findAll({
            where: { activo: true },
            order: [['nombre', 'ASC']]
        });

        const cuentasContables = await PlanCuenta.findAll({
            where: {
                permitir_movimientos: true,
                activa: true,
                tipo_cuenta: 'activo'
            },
            order: [['codigo_cuenta', 'ASC']]
        });

        return {
            tipos: tipos.map(t => t.toJSON()),
            cuentas_contables: cuentasContables.map(c => c.toJSON())
        };
    }
}
