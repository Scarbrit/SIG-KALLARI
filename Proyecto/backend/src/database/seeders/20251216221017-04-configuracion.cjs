'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // =====================================================
    // NOTA: La configuración SRI ya NO se crea aquí.
    // Debe ser configurada desde el frontend por el usuario
    // al iniciar el sistema por primera vez.
    // =====================================================

    // 1. Configuración Token (valores por defecto seguros)
    await queryInterface.bulkInsert({ tableName: 'configuracion_token', schema: 'configuracion' }, [{
      tiempo_expiracion: '8h',
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    }], { ignoreDuplicates: true });

    // 2. Configuración Bloqueo (valores por defecto seguros)
    await queryInterface.bulkInsert({ tableName: 'configuracion_bloqueo', schema: 'configuracion' }, [{
      id_config_bloqueo: 1,
      intentos_maximos: 3,
      duracion_bloqueo_minutos: 15,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    }], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete({ tableName: 'configuracion_bloqueo', schema: 'configuracion' }, null, {});
    await queryInterface.bulkDelete({ tableName: 'configuracion_token', schema: 'configuracion' }, null, {});
    // No eliminamos configuracion_sri porque ahora será gestionada por el usuario
  }
};

