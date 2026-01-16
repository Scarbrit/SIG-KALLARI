'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('proveedor', {
            id_proveedor: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_tipo_identificacion: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'tipo_identificacion',
                        schema: 'catalogo'
                    },
                    key: 'id_tipo_identificacion'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            identificacion: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true
            },
            razon_social: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            nombre_comercial: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            direccion: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            telefono: {
                type: Sequelize.STRING(15),
                allowNull: true
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            id_parroquia: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'parroquia',
                        schema: 'catalogo'
                    },
                    key: 'id_parroquia'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            dias_credito: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            id_estado_proveedor: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'estado_proveedor',
                        schema: 'catalogo'
                    },
                    key: 'id_estado_proveedor'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
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
        await queryInterface.dropTable({ tableName: 'proveedor', schema: 'contabilidad' });
    }
};
