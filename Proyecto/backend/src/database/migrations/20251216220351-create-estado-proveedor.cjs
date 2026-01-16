'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('estado_proveedor', {
            id_estado_proveedor: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nombre: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            descripcion: {
                type: Sequelize.STRING(255),
                allowNull: true
            }
        }, {
            schema: 'catalogo'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({ tableName: 'estado_proveedor', schema: 'catalogo' });
    }
};
