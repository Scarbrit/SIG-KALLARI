'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('periodo_contable', {
            id_periodo: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            anio: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            mes: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            nombre: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: 'Ejemplo: Enero 2026'
            },
            fecha_inicio: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            fecha_fin: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            estado: {
                type: Sequelize.ENUM('ABIERTO', 'CERRADO'),
                allowNull: false,
                defaultValue: 'ABIERTO'
            },
            fecha_cierre: {
                type: Sequelize.DATE,
                allowNull: true
            },
            id_usuario_cierre: {
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
                onDelete: 'RESTRICT'
            },
            fecha_creacion: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        }, {
            schema: 'contabilidad'
        });

        // Índice único para año+mes
        await queryInterface.addIndex(
            { tableName: 'periodo_contable', schema: 'contabilidad' },
            ['anio', 'mes'],
            { unique: true, name: 'idx_periodo_anio_mes' }
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({ tableName: 'periodo_contable', schema: 'contabilidad' });
    }
};
