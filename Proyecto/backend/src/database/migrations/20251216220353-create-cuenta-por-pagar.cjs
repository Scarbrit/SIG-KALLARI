'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cuenta_por_pagar', {
            id_cuenta_pagar: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_proveedor: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'proveedor',
                        schema: 'contabilidad'
                    },
                    key: 'id_proveedor'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            numero_factura: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            fecha_factura: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            fecha_vencimiento: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            monto_total: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
            },
            monto_pagado: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            saldo_pendiente: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
            },
            dias_vencidos: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            estado: {
                type: Sequelize.ENUM('PENDIENTE', 'PAGADA', 'VENCIDA', 'PARCIAL'),
                allowNull: false,
                defaultValue: 'PENDIENTE'
            },
            concepto: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            observaciones: {
                type: Sequelize.TEXT,
                allowNull: true
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
        await queryInterface.dropTable({ tableName: 'cuenta_por_pagar', schema: 'contabilidad' });
    }
};
