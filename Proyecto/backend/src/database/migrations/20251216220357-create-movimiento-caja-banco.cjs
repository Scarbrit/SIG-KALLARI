'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('movimiento_caja_banco', {
            id_movimiento: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_cuenta_bancaria: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'cuenta_bancaria',
                        schema: 'contabilidad'
                    },
                    key: 'id_cuenta_bancaria'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            tipo_movimiento: {
                type: Sequelize.ENUM('INGRESO', 'EGRESO', 'TRANSFERENCIA_ENTRADA', 'TRANSFERENCIA_SALIDA'),
                allowNull: false
            },
            concepto: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            monto: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
            },
            saldo_anterior: {
                type: Sequelize.DECIMAL(14, 2),
                allowNull: false
            },
            saldo_posterior: {
                type: Sequelize.DECIMAL(14, 2),
                allowNull: false
            },
            fecha_movimiento: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            id_asiento: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'asiento_contable',
                        schema: 'contabilidad'
                    },
                    key: 'id_asiento'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                comment: 'Asiento contable generado por este movimiento'
            },
            id_pago_cuenta_cobrar: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'pago_cuenta_cobrar',
                        schema: 'contabilidad'
                    },
                    key: 'id_pago'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                comment: 'Si es un cobro de CxC'
            },
            id_pago_cuenta_pagar: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'pago_cuenta_pagar',
                        schema: 'contabilidad'
                    },
                    key: 'id_pago'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                comment: 'Si es un pago de CxP'
            },
            id_cuenta_bancaria_destino: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'cuenta_bancaria',
                        schema: 'contabilidad'
                    },
                    key: 'id_cuenta_bancaria'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
                comment: 'Para transferencias entre cuentas'
            },
            id_usuario_registro: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
            referencia: {
                type: Sequelize.STRING(100),
                allowNull: true,
                comment: 'Número de documento, cheque, transferencia, etc.'
            },
            fecha_registro: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        }, {
            schema: 'contabilidad'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({ tableName: 'movimiento_caja_banco', schema: 'contabilidad' });
    }
};
