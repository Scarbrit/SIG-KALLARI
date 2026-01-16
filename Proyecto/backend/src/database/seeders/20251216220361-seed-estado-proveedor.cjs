'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert({ tableName: 'estado_proveedor', schema: 'catalogo' }, [
            {
                nombre: 'Activo',
                descripcion: 'Proveedor activo con relación comercial vigente'
            },
            {
                nombre: 'Inactivo',
                descripcion: 'Proveedor con el que ya no se trabaja'
            },
            {
                nombre: 'Suspendido',
                descripcion: 'Proveedor temporalmente suspendido'
            },
            {
                nombre: 'En Evaluación',
                descripcion: 'Proveedor nuevo en proceso de evaluación'
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete({ tableName: 'estado_proveedor', schema: 'catalogo' }, null, {});
    }
};
