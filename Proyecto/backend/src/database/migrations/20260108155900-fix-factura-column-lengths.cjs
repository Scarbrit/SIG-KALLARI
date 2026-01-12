'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn({ tableName: 'factura', schema: 'ventas' }, 'clave_acceso_sri', {
            type: Sequelize.STRING(50),
            allowNull: true,
            unique: true
        });
        await queryInterface.changeColumn({ tableName: 'factura', schema: 'ventas' }, 'numero_autorizacion', {
            type: Sequelize.STRING(50),
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn({ tableName: 'factura', schema: 'ventas' }, 'clave_acceso_sri', {
            type: Sequelize.STRING(49),
            allowNull: true,
            unique: true
        });
        await queryInterface.changeColumn({ tableName: 'factura', schema: 'ventas' }, 'numero_autorizacion', {
            type: Sequelize.STRING(49),
            allowNull: true
        });
    }
};
