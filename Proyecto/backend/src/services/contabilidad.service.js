import db, {
    PeriodoContable,
    AsientoContable,
    DetalleAsiento,
    PlanCuenta,
    Usuario,
    Factura,
    CuentaPorCobrar,
    CuentaPorPagar
} from '../models/index.js';
import { Op } from 'sequelize';

const { sequelize } = db;

export class ContabilidadService {

    // ==================== PERÍODOS CONTABLES ====================

    async crearPeriodo(data) {
        const { anio, mes } = data;

        // Verificar si ya existe
        const existe = await PeriodoContable.findOne({
            where: { anio, mes }
        });
        if (existe) throw new Error(`El período ${mes}/${anio} ya existe.`);

        // Generar nombre automático
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const nombre = data.nombre || `${meses[mes - 1]} ${anio}`;

        // Calcular fechas
        const fecha_inicio = new Date(anio, mes - 1, 1);
        const fecha_fin = new Date(anio, mes, 0); // Último día del mes

        const periodo = await PeriodoContable.create({
            anio,
            mes,
            nombre,
            fecha_inicio,
            fecha_fin,
            estado: 'ABIERTO'
        });

        return periodo;
    }

    async cerrarPeriodo(id, idUsuario) {
        const t = await sequelize.transaction();
        try {
            const periodo = await PeriodoContable.findByPk(id, { transaction: t });
            if (!periodo) throw new Error("Período contable no encontrado.");

            if (periodo.estado === 'CERRADO') {
                throw new Error("El período ya está cerrado.");
            }

            // Verificar que todos los asientos estén aprobados
            const asientosPendientes = await AsientoContable.count({
                where: {
                    id_periodo: id,
                    estado: { [Op.ne]: 'APROBADO' }
                },
                transaction: t
            });

            if (asientosPendientes > 0) {
                throw new Error(`Hay ${asientosPendientes} asiento(s) sin aprobar en este período.`);
            }

            await periodo.update({
                estado: 'CERRADO',
                fecha_cierre: new Date(),
                id_usuario_cierre: idUsuario
            }, { transaction: t });

            await t.commit();
            return periodo;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getPeriodos(filtros = {}) {
        const where = {};

        if (filtros.anio) where.anio = filtros.anio;
        if (filtros.estado) where.estado = filtros.estado;

        return await PeriodoContable.findAll({
            where,
            include: [
                { model: Usuario, as: 'usuario_cierre', attributes: ['id_usuario', 'nombre', 'apellido'] }
            ],
            order: [['anio', 'DESC'], ['mes', 'DESC']]
        });
    }

    async getPeriodoActivo() {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = hoy.getMonth() + 1;

        let periodo = await PeriodoContable.findOne({
            where: { anio, mes, estado: 'ABIERTO' }
        });

        // Si no existe, crearlo automáticamente
        if (!periodo) {
            periodo = await this.crearPeriodo({ anio, mes });
        }

        return periodo;
    }

    // ==================== ASIENTOS CONTABLES ====================

    async crearAsiento(data, idContador) {
        const t = await sequelize.transaction();
        try {
            const { detalles, fecha_asiento, ...asientoData } = data;

            // Obtener período correspondiente a la fecha
            const fecha = new Date(fecha_asiento);
            const periodo = await PeriodoContable.findOne({
                where: {
                    anio: fecha.getFullYear(),
                    mes: fecha.getMonth() + 1
                },
                transaction: t
            });

            if (!periodo) {
                throw new Error("No existe un período contable para la fecha seleccionada.");
            }

            if (periodo.estado === 'CERRADO') {
                throw new Error("El período contable está cerrado. No se pueden registrar asientos.");
            }

            // Validar cuentas contables
            for (const detalle of detalles) {
                const cuenta = await PlanCuenta.findByPk(detalle.id_plan_cuenta, { transaction: t });
                if (!cuenta) {
                    throw new Error(`La cuenta contable ${detalle.id_plan_cuenta} no existe.`);
                }
                if (!cuenta.permitir_movimientos) {
                    throw new Error(`La cuenta "${cuenta.nombre_cuenta}" no permite movimientos.`);
                }
                if (!cuenta.activa) {
                    throw new Error(`La cuenta "${cuenta.nombre_cuenta}" está inactiva.`);
                }
            }

            // Calcular totales
            const total_debe = detalles.reduce((sum, d) => sum + (d.debe || 0), 0);
            const total_haber = detalles.reduce((sum, d) => sum + (d.haber || 0), 0);

            // Generar número de asiento
            const ultimoAsiento = await AsientoContable.findOne({
                where: { id_periodo: periodo.id_periodo },
                order: [['numero_asiento', 'DESC']],
                transaction: t
            });

            const siguienteNumero = ultimoAsiento
                ? parseInt(ultimoAsiento.numero_asiento.split('-')[1]) + 1
                : 1;
            const numero_asiento = `${periodo.anio}${String(periodo.mes).padStart(2, '0')}-${String(siguienteNumero).padStart(6, '0')}`;

            // Crear asiento
            const asiento = await AsientoContable.create({
                ...asientoData,
                id_periodo: periodo.id_periodo,
                numero_asiento,
                fecha_asiento,
                id_contador: idContador,
                estado: 'BORRADOR',
                total_debe,
                total_haber
            }, { transaction: t });

            // Crear detalles
            for (const detalle of detalles) {
                await DetalleAsiento.create({
                    id_asiento_contable: asiento.id_asiento,
                    id_plan_cuenta: detalle.id_plan_cuenta,
                    debe: detalle.debe || 0,
                    haber: detalle.haber || 0
                }, { transaction: t });
            }

            await t.commit();
            return await this.getAsientoById(asiento.id_asiento);

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async aprobarAsiento(id, idContador) {
        const asiento = await AsientoContable.findByPk(id);
        if (!asiento) throw new Error("Asiento contable no encontrado.");

        if (asiento.estado === 'APROBADO') {
            throw new Error("El asiento ya está aprobado.");
        }

        if (asiento.estado === 'ANULADO') {
            throw new Error("No se puede aprobar un asiento anulado.");
        }

        // Verificar que el período siga abierto
        const periodo = await PeriodoContable.findByPk(asiento.id_periodo);
        if (periodo?.estado === 'CERRADO') {
            throw new Error("El período contable está cerrado.");
        }

        await asiento.update({ estado: 'APROBADO' });
        return await this.getAsientoById(id);
    }

    async anularAsiento(id, motivo, idContador) {
        const asiento = await AsientoContable.findByPk(id);
        if (!asiento) throw new Error("Asiento contable no encontrado.");

        if (asiento.estado === 'ANULADO') {
            throw new Error("El asiento ya está anulado.");
        }

        // Verificar que el período siga abierto
        const periodo = await PeriodoContable.findByPk(asiento.id_periodo);
        if (periodo?.estado === 'CERRADO') {
            throw new Error("No se puede anular un asiento de un período cerrado.");
        }

        await asiento.update({
            estado: 'ANULADO',
            glosa: `${asiento.glosa} [ANULADO: ${motivo}]`
        });

        return await this.getAsientoById(id);
    }

    async getAsientos(filtros = {}) {
        const where = {};

        if (filtros.id_periodo) where.id_periodo = filtros.id_periodo;
        if (filtros.estado) where.estado = filtros.estado;
        if (filtros.tipo_asiento) where.tipo_asiento = filtros.tipo_asiento;

        if (filtros.desde && filtros.hasta) {
            where.fecha_asiento = {
                [Op.between]: [filtros.desde, filtros.hasta]
            };
        }

        return await AsientoContable.findAll({
            where,
            include: [
                { model: PeriodoContable, as: 'periodo' },
                { model: Usuario, as: 'contador', attributes: ['id_usuario', 'nombre', 'apellido'] },
                {
                    model: DetalleAsiento,
                    include: [{ model: PlanCuenta }]
                }
            ],
            order: [['fecha_asiento', 'DESC'], ['numero_asiento', 'DESC']]
        });
    }

    async getAsientoById(id) {
        const asiento = await AsientoContable.findByPk(id, {
            include: [
                { model: PeriodoContable, as: 'periodo' },
                { model: Usuario, as: 'contador', attributes: ['id_usuario', 'nombre', 'apellido'] },
                { model: Factura, as: 'factura' },
                { model: CuentaPorCobrar, as: 'cuenta_cobrar' },
                { model: CuentaPorPagar, as: 'cuenta_pagar' },
                {
                    model: DetalleAsiento,
                    include: [{ model: PlanCuenta }]
                }
            ]
        });
        if (!asiento) throw new Error("Asiento contable no encontrado.");
        return asiento;
    }

    // ==================== PLAN DE CUENTAS ====================

    async getPlanCuentas(filtros = {}) {
        const where = {};

        if (filtros.activa !== undefined) where.activa = filtros.activa;
        if (filtros.tipo_cuenta) where.tipo_cuenta = filtros.tipo_cuenta;
        if (filtros.nivel) where.nivel = filtros.nivel;
        if (filtros.permitir_movimientos !== undefined) {
            where.permitir_movimientos = filtros.permitir_movimientos;
        }

        return await PlanCuenta.findAll({
            where,
            include: [
                { model: PlanCuenta, as: 'cuenta_padre', attributes: ['id_cuenta', 'codigo_cuenta', 'nombre_cuenta'] }
            ],
            order: [['codigo_cuenta', 'ASC']]
        });
    }

    async getCuentaById(id) {
        const cuenta = await PlanCuenta.findByPk(id, {
            include: [
                { model: PlanCuenta, as: 'cuenta_padre' },
                { model: PlanCuenta, as: 'subcuentas' },
                { model: DetalleAsiento }
            ]
        });
        if (!cuenta) throw new Error("Cuenta contable no encontrada.");
        return cuenta;
    }

    // ==================== REPORTES ====================

    async getLibroDiario(idPeriodo) {
        const periodo = await PeriodoContable.findByPk(idPeriodo);
        if (!periodo) throw new Error("Período no encontrado.");

        const asientos = await AsientoContable.findAll({
            where: {
                id_periodo: idPeriodo,
                estado: 'APROBADO'
            },
            include: [
                {
                    model: DetalleAsiento,
                    include: [{ model: PlanCuenta }]
                }
            ],
            order: [['fecha_asiento', 'ASC'], ['numero_asiento', 'ASC']]
        });

        return {
            periodo: periodo.toJSON(),
            asientos: asientos.map(a => a.toJSON())
        };
    }

    async getLibroMayor(idCuenta, idPeriodo = null) {
        const cuenta = await PlanCuenta.findByPk(idCuenta);
        if (!cuenta) throw new Error("Cuenta no encontrada.");

        const whereDetalle = { id_plan_cuenta: idCuenta };
        const includeAsiento = {
            model: AsientoContable,
            where: { estado: 'APROBADO' }
        };

        if (idPeriodo) {
            includeAsiento.where.id_periodo = idPeriodo;
        }

        const movimientos = await DetalleAsiento.findAll({
            where: whereDetalle,
            include: [includeAsiento],
            order: [[AsientoContable, 'fecha_asiento', 'ASC']]
        });

        const totalDebe = movimientos.reduce((sum, m) => sum + parseFloat(m.debe), 0);
        const totalHaber = movimientos.reduce((sum, m) => sum + parseFloat(m.haber), 0);
        const saldo = totalDebe - totalHaber;

        return {
            cuenta: cuenta.toJSON(),
            movimientos: movimientos.map(m => m.toJSON()),
            resumen: {
                total_debe: totalDebe,
                total_haber: totalHaber,
                saldo,
                naturaleza: totalDebe > totalHaber ? 'DEUDOR' : 'ACREEDOR'
            }
        };
    }

    async getBalanceGeneral(idPeriodo) {
        // Obtener saldos por tipo de cuenta
        const cuentas = await PlanCuenta.findAll({
            where: { activa: true }
        });

        const resultado = {
            activos: [],
            pasivos: [],
            patrimonio: []
        };

        for (const cuenta of cuentas) {
            if (!cuenta.permitir_movimientos) continue;

            const mayor = await this.getLibroMayor(cuenta.id_cuenta, idPeriodo);
            if (mayor.resumen.saldo === 0) continue;

            const item = {
                codigo: cuenta.codigo_cuenta,
                nombre: cuenta.nombre_cuenta,
                saldo: Math.abs(mayor.resumen.saldo)
            };

            if (cuenta.tipo_cuenta === 'activo') {
                resultado.activos.push(item);
            } else if (cuenta.tipo_cuenta === 'pasivo') {
                resultado.pasivos.push(item);
            } else if (cuenta.tipo_cuenta === 'patrimonio') {
                resultado.patrimonio.push(item);
            }
        }

        resultado.total_activos = resultado.activos.reduce((sum, a) => sum + a.saldo, 0);
        resultado.total_pasivos = resultado.pasivos.reduce((sum, p) => sum + p.saldo, 0);
        resultado.total_patrimonio = resultado.patrimonio.reduce((sum, p) => sum + p.saldo, 0);

        return resultado;
    }
}
