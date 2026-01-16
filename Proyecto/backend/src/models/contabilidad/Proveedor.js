export default (sequelize, DataTypes) => {
    const Proveedor = sequelize.define('Proveedor', {
        id_proveedor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_tipo_identificacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        identificacion: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        razon_social: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        nombre_comercial: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        direccion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        telefono: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        id_parroquia: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        dias_credito: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Días de crédito que otorga el proveedor'
        },
        id_estado_proveedor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'proveedor',
        schema: 'contabilidad',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    });

    Proveedor.associate = (models) => {
        Proveedor.belongsTo(models.TipoIdentificacion, {
            foreignKey: 'id_tipo_identificacion',
            as: 'tipo_identificacion'
        });
        Proveedor.belongsTo(models.Parroquia, {
            foreignKey: 'id_parroquia',
            as: 'parroquia'
        });
        Proveedor.belongsTo(models.EstadoProveedor, {
            foreignKey: 'id_estado_proveedor',
            as: 'estado_proveedor'
        });
        Proveedor.hasMany(models.CuentaPorPagar, {
            foreignKey: 'id_proveedor'
        });
    };

    return Proveedor;
};
