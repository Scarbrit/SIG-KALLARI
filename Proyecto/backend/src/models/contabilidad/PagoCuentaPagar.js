export default (sequelize, DataTypes) => {
    const PagoCuentaPagar = sequelize.define('PagoCuentaPagar', {
        id_pago: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_cuenta_pagar: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_metodo_pago: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Método de pago usado en este abono'
        },
        id_cuenta_bancaria: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Cuenta de donde se realiza el pago'
        },
        id_usuario_registro: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Usuario que registró el pago'
        },
        monto_pago: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'Monto del pago realizado'
        },
        fecha_pago: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        referencia_pago: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Número de cheque, transferencia, etc.'
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'pago_cuenta_pagar',
        schema: 'contabilidad',
        timestamps: true,
        createdAt: 'fecha_registro',
        updatedAt: false
    });

    PagoCuentaPagar.associate = (models) => {
        PagoCuentaPagar.belongsTo(models.CuentaPorPagar, {
            foreignKey: 'id_cuenta_pagar',
            as: 'cuenta_pagar'
        });
        PagoCuentaPagar.belongsTo(models.MetodoPago, {
            foreignKey: 'id_metodo_pago',
            as: 'metodo_pago'
        });
        PagoCuentaPagar.belongsTo(models.CuentaBancaria, {
            foreignKey: 'id_cuenta_bancaria',
            as: 'cuenta_bancaria'
        });
        PagoCuentaPagar.belongsTo(models.Usuario, {
            foreignKey: 'id_usuario_registro',
            as: 'usuario_registro'
        });
        PagoCuentaPagar.hasMany(models.MovimientoCajaBanco, {
            foreignKey: 'id_pago_cuenta_pagar'
        });
    };

    return PagoCuentaPagar;
};
