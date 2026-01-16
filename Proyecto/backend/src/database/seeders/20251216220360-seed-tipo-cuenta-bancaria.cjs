'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert({ tableName: 'tipo_cuenta_bancaria', schema: 'catalogo' }, [
            {
                nombre: 'Caja',
                descripcion: 'Efectivo en caja física del negocio',
                activo: true
            },
            {
                nombre: 'Corriente',
                descripcion: 'Cuenta corriente bancaria',
                activo: true
            },
            {
                nombre: 'Ahorros',
                descripcion: 'Cuenta de ahorros bancaria',
                activo: true
            },
            {
                nombre: 'Caja Chica',
                descripcion: 'Fondo para gastos menores',
                activo: true
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete({ tableName: 'tipo_cuenta_bancaria', schema: 'catalogo' }, null, {});
    }
};
