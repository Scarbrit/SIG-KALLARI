'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('valor_iva', {
      id_iva: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      codigo_sri: {
        type: Sequelize.STRING(2),
        allowNull: false,
        comment: 'Código oficial del SRI (0=0%, 2=12%, 4=15%, etc.)'
      },
      porcentaje_iva: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }
    }, {
      schema: 'catalogo',
      timestamps: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ tableName: 'valor_iva', schema: 'catalogo' });
  }
};