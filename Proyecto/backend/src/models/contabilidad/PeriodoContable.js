export default (sequelize, DataTypes) => {
    const PeriodoContable = sequelize.define('PeriodoContable', {
        id_periodo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        anio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        mes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 12
            }
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'Ejemplo: Enero 2026'
        },
        fecha_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_fin: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('ABIERTO', 'CERRADO'),
            allowNull: false,
            defaultValue: 'ABIERTO'
        },
        fecha_cierre: {
            type: DataTypes.DATE,
            allowNull: true
        },
        id_usuario_cierre: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'periodo_contable',
        schema: 'contabilidad',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['anio', 'mes']
            }
        ]
    });

    PeriodoContable.associate = (models) => {
        PeriodoContable.belongsTo(models.Usuario, {
            foreignKey: 'id_usuario_cierre',
            as: 'usuario_cierre'
        });
        PeriodoContable.hasMany(models.AsientoContable, {
            foreignKey: 'id_periodo'
        });
    };

    return PeriodoContable;
};
