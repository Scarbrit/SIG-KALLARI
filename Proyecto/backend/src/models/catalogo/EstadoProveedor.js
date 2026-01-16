export default (sequelize, DataTypes) => {
    const EstadoProveedor = sequelize.define('EstadoProveedor', {
        id_estado_proveedor: {
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
        }
    }, {
        tableName: 'estado_proveedor',
        schema: 'catalogo',
        timestamps: false
    });

    EstadoProveedor.associate = (models) => {
        EstadoProveedor.hasMany(models.Proveedor, {
            foreignKey: 'id_estado_proveedor'
        });
    };

    return EstadoProveedor;
};
