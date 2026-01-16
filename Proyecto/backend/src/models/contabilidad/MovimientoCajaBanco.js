export default (sequelize, DataTypes) => {
    const MovimientoCajaBanco = sequelize.define('MovimientoCajaBanco', {
        id_movimiento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_cuenta_bancaria: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipo_movimiento: {
            type: DataTypes.ENUM('INGRESO', 'EGRESO', 'TRANSFERENCIA_ENTRADA', 'TRANSFERENCIA_SALIDA'),
            allowNull: false
        },
        concepto: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        monto: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        saldo_anterior: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false
        },
        saldo_posterior: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false
        },
        fecha_movimiento: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        id_asiento: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Asiento contable generado por este movimiento'
        },
        id_pago_cuenta_cobrar: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Si es un cobro de CxC'
        },
        id_pago_cuenta_pagar: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Si es un pago de CxP'
        },
        id_cuenta_bancaria_destino: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Para transferencias entre cuentas'
        },
        id_usuario_registro: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        referencia: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Número de documento, cheque, transferencia, etc.'
        }
    }, {
        tableName: 'movimiento_caja_banco',
        schema: 'contabilidad',
        timestamps: true,
        createdAt: 'fecha_registro',
        updatedAt: false
    });

    MovimientoCajaBanco.associate = (models) => {
        MovimientoCajaBanco.belongsTo(models.CuentaBancaria, {
            foreignKey: 'id_cuenta_bancaria',
            as: 'cuenta_bancaria'
        });
        MovimientoCajaBanco.belongsTo(models.CuentaBancaria, {
            foreignKey: 'id_cuenta_bancaria_destino',
            as: 'cuenta_destino'
        });
        MovimientoCajaBanco.belongsTo(models.AsientoContable, {
            foreignKey: 'id_asiento',
            as: 'asiento_contable'
        });
        MovimientoCajaBanco.belongsTo(models.PagoCuentaCobrar, {
            foreignKey: 'id_pago_cuenta_cobrar',
            as: 'pago_cuenta_cobrar'
        });
        MovimientoCajaBanco.belongsTo(models.PagoCuentaPagar, {
            foreignKey: 'id_pago_cuenta_pagar',
            as: 'pago_cuenta_pagar'
        });
        MovimientoCajaBanco.belongsTo(models.Usuario, {
            foreignKey: 'id_usuario_registro',
            as: 'usuario_registro'
        });
    };

    return MovimientoCajaBanco;
};
