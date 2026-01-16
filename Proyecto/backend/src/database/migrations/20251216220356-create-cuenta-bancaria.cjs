'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cuenta_bancaria', {
            id_cuenta_bancaria: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_tipo_cuenta_bancaria: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'tipo_cuenta_bancaria',
                        schema: 'catalogo'
                    },
                    key: 'id_tipo_cuenta_bancaria'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            id_plan_cuenta: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'plan_cuenta',
                        schema: 'contabilidad'
                    },
                    key: 'id_cuenta'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
                comment: 'Vincula con la cuenta contable correspondiente'
            },
            nombre: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: 'Nombre descriptivo: Caja General, Banco Pichincha, etc.'
            },
            nombre_banco: {
                type: Sequelize.STRING(100),
                allowNull: true,
                comment: 'Nombre del banco (null si es caja)'
            },
            numero_cuenta: {
                type: Sequelize.STRING(30),
                allowNull: true,
                comment: 'Número de cuenta bancaria'
            },
            saldo_inicial: {
                type: Sequelize.DECIMAL(14, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            saldo_actual: {
                type: Sequelize.DECIMAL(14, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            es_caja_chica: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            limite_caja_chica: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
                comment: 'Límite máximo para caja chica'
            },
            activa: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            fecha_creacion: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            fecha_actualizacion: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        }, {
            schema: 'contabilidad'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({ tableName: 'cuenta_bancaria', schema: 'contabilidad' });
    }
};
