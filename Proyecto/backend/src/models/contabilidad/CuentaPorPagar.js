export default (sequelize, DataTypes) => {
    const CuentaPorPagar = sequelize.define('CuentaPorPagar', {
        id_cuenta_pagar: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_proveedor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        numero_factura: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'Número de factura del proveedor'
        },
        fecha_factura: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_vencimiento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        monto_total: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'Monto total de la deuda'
        },
        monto_pagado: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Total pagado hasta el momento'
        },
        saldo_pendiente: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'Saldo que falta por pagar'
        },
        dias_vencidos: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            comment: 'Días transcurridos desde vencimiento (si aplica)'
        },
        estado: {
            type: DataTypes.ENUM('PENDIENTE', 'PAGADA', 'VENCIDA', 'PARCIAL'),
            allowNull: false,
            defaultValue: 'PENDIENTE'
        },
        concepto: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Descripción de la compra o servicio'
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'cuenta_por_pagar',
        schema: 'contabilidad',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    });

    CuentaPorPagar.associate = (models) => {
        CuentaPorPagar.belongsTo(models.Proveedor, {
            foreignKey: 'id_proveedor',
            as: 'proveedor'
        });
        CuentaPorPagar.hasMany(models.PagoCuentaPagar, {
            foreignKey: 'id_cuenta_pagar'
        });
        CuentaPorPagar.hasMany(models.AsientoContable, {
            foreignKey: 'id_cuenta_pagar'
        });
    };

    return CuentaPorPagar;
};
