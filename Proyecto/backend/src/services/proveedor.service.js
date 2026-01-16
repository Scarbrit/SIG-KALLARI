import db, {
    Proveedor,
    EstadoProveedor,
    TipoIdentificacion,
    Parroquia,
    Canton,
    Provincia,
    CuentaPorPagar
} from '../models/index.js';
import { Op } from 'sequelize';

const { sequelize } = db;

export class ProveedorService {

    async create(data) {
        const t = await sequelize.transaction();
        try {
            const { id_tipo_identificacion, identificacion, id_estado_proveedor, ...proveedorData } = data;

            // Validar tipo de identificación
            const tipoIdent = await TipoIdentificacion.findByPk(id_tipo_identificacion, { transaction: t });
            if (!tipoIdent) throw new Error("El tipo de identificación no es válido.");

            // Verificar si ya existe el proveedor con esa identificación
            const existe = await Proveedor.findOne({
                where: { identificacion },
                transaction: t
            });
            if (existe) throw new Error("Ya existe un proveedor con esta identificación.");

            // Obtener estado por defecto si no se envía
            let estadoId;
            if (id_estado_proveedor) {
                const estadoExiste = await EstadoProveedor.findByPk(id_estado_proveedor, { transaction: t });
                if (!estadoExiste) throw new Error("El estado del proveedor no es válido.");
                estadoId = id_estado_proveedor;
            } else {
                const estadoActivo = await EstadoProveedor.findOne({
                    where: { nombre: 'Activo' },
                    transaction: t
                });
                if (!estadoActivo) throw new Error("No se encontró el estado 'Activo'.");
                estadoId = estadoActivo.id_estado_proveedor;
            }

            // Crear proveedor
            const proveedor = await Proveedor.create({
                ...proveedorData,
                id_tipo_identificacion,
                identificacion,
                id_estado_proveedor: estadoId
            }, { transaction: t });

            await t.commit();
            return proveedor;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async update(id, data) {
        const t = await sequelize.transaction();
        try {
            const proveedor = await Proveedor.findByPk(id, { transaction: t });
            if (!proveedor) throw new Error("Proveedor no encontrado.");

            // Si cambia identificación, verificar que no exista
            if (data.identificacion && data.identificacion !== proveedor.identificacion) {
                const existe = await Proveedor.findOne({
                    where: {
                        identificacion: data.identificacion,
                        id_proveedor: { [Op.ne]: id }
                    },
                    transaction: t
                });
                if (existe) throw new Error("Ya existe otro proveedor con esta identificación.");
            }

            await proveedor.update(data, { transaction: t });
            await t.commit();

            return await this.getById(id);

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAll(filtros = {}) {
        const where = {};

        if (filtros.estado) {
            const estado = await EstadoProveedor.findOne({ where: { nombre: filtros.estado } });
            if (estado) where.id_estado_proveedor = estado.id_estado_proveedor;
        }

        if (filtros.busqueda) {
            where[Op.or] = [
                { razon_social: { [Op.iLike]: `%${filtros.busqueda}%` } },
                { nombre_comercial: { [Op.iLike]: `%${filtros.busqueda}%` } },
                { identificacion: { [Op.iLike]: `%${filtros.busqueda}%` } }
            ];
        }

        return await Proveedor.findAll({
            where,
            include: [
                { model: TipoIdentificacion, as: 'tipo_identificacion' },
                { model: EstadoProveedor, as: 'estado_proveedor' },
                {
                    model: Parroquia,
                    as: 'parroquia',
                    include: [{
                        model: Canton,
                        as: 'canton',
                        include: [{ model: Provincia, as: 'provincia' }]
                    }]
                }
            ],
            order: [['razon_social', 'ASC']]
        });
    }

    async getById(id) {
        const proveedor = await Proveedor.findByPk(id, {
            include: [
                { model: TipoIdentificacion, as: 'tipo_identificacion' },
                { model: EstadoProveedor, as: 'estado_proveedor' },
                {
                    model: Parroquia,
                    as: 'parroquia',
                    include: [{
                        model: Canton,
                        as: 'canton',
                        include: [{ model: Provincia, as: 'provincia' }]
                    }]
                },
                { model: CuentaPorPagar }
            ]
        });
        if (!proveedor) throw new Error("Proveedor no encontrado.");
        return proveedor;
    }

    async changeState(id, nombreEstado) {
        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) throw new Error("Proveedor no encontrado.");

        const estado = await EstadoProveedor.findOne({ where: { nombre: nombreEstado } });
        if (!estado) throw new Error("Estado no válido.");

        await proveedor.update({ id_estado_proveedor: estado.id_estado_proveedor });

        return await this.getById(id);
    }

    async getCatalogs() {
        const estados = await EstadoProveedor.findAll({ order: [['nombre', 'ASC']] });
        const tiposIdentificacion = await TipoIdentificacion.findAll({ order: [['tipo_identificacion', 'ASC']] });

        return {
            estados: estados.map(e => e.toJSON()),
            tiposIdentificacion: tiposIdentificacion.map(t => t.toJSON())
        };
    }

    async getResumenCuentas(id) {
        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) throw new Error("Proveedor no encontrado.");

        const cuentas = await CuentaPorPagar.findAll({
            where: { id_proveedor: id },
            order: [['fecha_factura', 'DESC']]
        });

        const totalDeuda = cuentas.reduce((sum, c) => sum + parseFloat(c.saldo_pendiente), 0);
        const cuentasVencidas = cuentas.filter(c => c.estado === 'VENCIDA').length;
        const cuentasPendientes = cuentas.filter(c => ['PENDIENTE', 'PARCIAL'].includes(c.estado)).length;

        return {
            proveedor: proveedor.toJSON(),
            resumen: {
                total_deuda: totalDeuda,
                cuentas_vencidas: cuentasVencidas,
                cuentas_pendientes: cuentasPendientes,
                total_cuentas: cuentas.length
            },
            cuentas: cuentas.map(c => c.toJSON())
        };
    }
}
