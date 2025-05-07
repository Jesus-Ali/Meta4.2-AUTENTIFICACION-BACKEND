'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contratos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      docenteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Docentes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      asignaturaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Asignaturas',
          key: 'id'
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

    await queryInterface.addConstraint('Contratos', {
      fields: ['docenteId', 'asignaturaId'],
      type: 'unique',
      name: 'unique_contrato'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Contratos');
  }
};