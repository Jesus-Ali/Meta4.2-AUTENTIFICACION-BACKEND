'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Docentes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numEmpleado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      personaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model:'Personas',
          key:'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      categoriaEmpleadoClave: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'CategoriaEmpleados',
          key: 'clave'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Docentes');
  }
};