export default (sequelize, DataTypes) => {
    const CuentaBancaria = sequelize.define('CuentaBancaria', {
        id_cuenta_bancaria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_tipo_cuenta_bancaria: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_plan_cuenta: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Vincula con la cuenta contable correspondiente'
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Nombre descriptivo: Caja General, Banco Pichincha, etc.'
        },
        nombre_banco: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Nombre del banco (null si es caja)'
        },
        numero_cuenta: {
            type: DataTypes.STRING(30),
            allowNull: true,
            comment: 'Número de cuenta bancaria'
        },
        saldo_inicial: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        saldo_actual: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        es_caja_chica: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        limite_caja_chica: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Límite máximo para caja chica'
        },
        activa: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'cuenta_bancaria',
        schema: 'contabilidad',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    });

    CuentaBancaria.associate = (models) => {
        CuentaBancaria.belongsTo(models.TipoCuentaBancaria, {
            foreignKey: 'id_tipo_cuenta_bancaria',
            as: 'tipo_cuenta_bancaria'
        });
        CuentaBancaria.belongsTo(models.PlanCuenta, {
            foreignKey: 'id_plan_cuenta',
            as: 'plan_cuenta'
        });
        CuentaBancaria.hasMany(models.MovimientoCajaBanco, {
            foreignKey: 'id_cuenta_bancaria'
        });
        CuentaBancaria.hasMany(models.PagoCuentaPagar, {
            foreignKey: 'id_cuenta_bancaria'
        });
    };

    return CuentaBancaria;
};
