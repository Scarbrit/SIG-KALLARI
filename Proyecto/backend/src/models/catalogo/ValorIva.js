export default (sequelize, DataTypes) => {
    const ValorIva = sequelize.define('ValorIva', {
        id_iva: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        codigo: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        codigo_sri: {
            type: DataTypes.STRING(2),
            allowNull: false,
            comment: 'Código oficial del SRI (0=0%, 2=12%, 4=15%, etc.)'
        },
        porcentaje_iva: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {
        tableName: 'valor_iva',
        schema: 'catalogo',
        timestamps: false
    });

    ValorIva.associate = (models) => {
        ValorIva.hasMany(models.Factura, { foreignKey: 'id_valor_iva' });
        ValorIva.hasMany(models.DetalleFactura, { foreignKey: 'id_valor_iva' });
    };

    return ValorIva;
};