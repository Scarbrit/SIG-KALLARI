export default (sequelize, DataTypes) => {
    const TipoCuentaBancaria = sequelize.define('TipoCuentaBancaria', {
        id_tipo_cuenta_bancaria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'tipo_cuenta_bancaria',
        schema: 'catalogo',
        timestamps: false
    });

    TipoCuentaBancaria.associate = (models) => {
        TipoCuentaBancaria.hasMany(models.CuentaBancaria, {
            foreignKey: 'id_tipo_cuenta_bancaria'
        });
    };

    return TipoCuentaBancaria;
};
