'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Agregar columna id_periodo a asiento_contable
        await queryInterface.addColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_periodo',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'periodo_contable',
                        schema: 'contabilidad'
                    },
                    key: 'id_periodo'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            }
        );

        // Agregar columna numero_asiento
        await queryInterface.addColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'numero_asiento',
            {
                type: Sequelize.STRING(20),
                allowNull: true,
                comment: 'Numeración secuencial por período'
            }
        );

        // Hacer id_factura nullable para asientos generales
        await queryInterface.changeColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_factura',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'NULL para asientos generales no relacionados con facturas'
            }
        );

        // Agregar columna id_cuenta_cobrar
        await queryInterface.addColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_cuenta_cobrar',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'cuenta_por_cobrar',
                        schema: 'contabilidad'
                    },
                    key: 'id_cuenta_cobrar'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                comment: 'Para asientos relacionados con CxC'
            }
        );

        // Agregar columna id_cuenta_pagar
        await queryInterface.addColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_cuenta_pagar',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'cuenta_por_pagar',
                        schema: 'contabilidad'
                    },
                    key: 'id_cuenta_pagar'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                comment: 'Para asientos relacionados con CxP'
            }
        );

        // Agregar columna id_movimiento_caja
        await queryInterface.addColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_movimiento_caja',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'movimiento_caja_banco',
                        schema: 'contabilidad'
                    },
                    key: 'id_movimiento'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                comment: 'Para asientos relacionados con movimientos de caja/banco'
            }
        );

        // Agregar índice para número de asiento
        await queryInterface.addIndex(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            ['id_periodo', 'numero_asiento'],
            { unique: true, name: 'idx_asiento_periodo_numero' }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'idx_asiento_periodo_numero'
        );
        await queryInterface.removeColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_movimiento_caja'
        );
        await queryInterface.removeColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_cuenta_pagar'
        );
        await queryInterface.removeColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_cuenta_cobrar'
        );
        await queryInterface.changeColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_factura',
            {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        );
        await queryInterface.removeColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'numero_asiento'
        );
        await queryInterface.removeColumn(
            { tableName: 'asiento_contable', schema: 'contabilidad' },
            'id_periodo'
        );
    }
};
