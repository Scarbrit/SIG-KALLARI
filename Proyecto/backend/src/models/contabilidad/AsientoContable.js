export default (sequelize, DataTypes) => {
    const AsientoContable = sequelize.define('AsientoContable', {
        id_asiento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_periodo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Período contable al que pertenece'
        },
        numero_asiento: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: 'Numeración secuencial por período'
        },
        fecha_asiento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        glosa: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tipo_asiento: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'VENTA, COMPRA, COBRO, PAGO, AJUSTE, APERTURA, CIERRE, etc.'
        },
        id_factura: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'NULL para asientos generales no relacionados con facturas'
        },
        id_cuenta_cobrar: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Para asientos relacionados con CxC'
        },
        id_cuenta_pagar: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Para asientos relacionados con CxP'
        },
        id_movimiento_caja: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Para asientos relacionados con movimientos de caja/banco'
        },
        id_contador: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Usuario contador que registra el asiento'
        },
        estado: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'BORRADOR, APROBADO, ANULADO'
        },
        total_debe: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        total_haber: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName: 'asiento_contable',
        schema: 'contabilidad',
        timestamps: false
    });

    AsientoContable.associate = (models) => {
        AsientoContable.hasMany(models.DetalleAsiento, { foreignKey: 'id_asiento_contable' });
        AsientoContable.belongsTo(models.PeriodoContable, {
            foreignKey: 'id_periodo',
            as: 'periodo'
        });
        AsientoContable.belongsTo(models.Factura, {
            foreignKey: 'id_factura',
            as: 'factura'
        });
        AsientoContable.belongsTo(models.CuentaPorCobrar, {
            foreignKey: 'id_cuenta_cobrar',
            as: 'cuenta_cobrar'
        });
        AsientoContable.belongsTo(models.CuentaPorPagar, {
            foreignKey: 'id_cuenta_pagar',
            as: 'cuenta_pagar'
        });
        AsientoContable.belongsTo(models.MovimientoCajaBanco, {
            foreignKey: 'id_movimiento_caja',
            as: 'movimiento_caja'
        });
        AsientoContable.belongsTo(models.Usuario, {
            foreignKey: 'id_contador',
            as: 'contador'
        });
    };

    return AsientoContable;
};