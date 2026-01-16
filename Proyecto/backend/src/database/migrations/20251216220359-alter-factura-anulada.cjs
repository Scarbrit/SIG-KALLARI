'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Agregar columna anulada a factura
        await queryInterface.addColumn(
            { tableName: 'factura', schema: 'ventas' },
            'anulada',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Indica si la factura fue anulada'
            }
        );

        // Agregar columna fecha_anulacion
        await queryInterface.addColumn(
            { tableName: 'factura', schema: 'ventas' },
            'fecha_anulacion',
            {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Fecha en que se anuló la factura'
            }
        );

        // Agregar columna motivo_anulacion
        await queryInterface.addColumn(
            { tableName: 'factura', schema: 'ventas' },
            'motivo_anulacion',
            {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Razón de la anulación'
            }
        );

        // Agregar columna id_usuario_anulacion
        await queryInterface.addColumn(
            { tableName: 'factura', schema: 'ventas' },
            'id_usuario_anulacion',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'usuario',
                        schema: 'seguridad'
                    },
                    key: 'id_usuario'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
                comment: 'Usuario que anuló la factura'
            }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn(
            { tableName: 'factura', schema: 'ventas' },
            'id_usuario_anulacion'
        );
        await queryInterface.removeColumn(
            { tableName: 'factura', schema: 'ventas' },
            'motivo_anulacion'
        );
        await queryInterface.removeColumn(
            { tableName: 'factura', schema: 'ventas' },
            'fecha_anulacion'
        );
        await queryInterface.removeColumn(
            { tableName: 'factura', schema: 'ventas' },
            'anulada'
        );
    }
};
