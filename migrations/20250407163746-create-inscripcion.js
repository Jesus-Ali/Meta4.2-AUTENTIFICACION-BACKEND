'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Inscripciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      estudianteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Estudiantes',
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
      semestre: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      calificacion: {
        type: Sequelize.FLOAT
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

    await queryInterface.addConstraint('Inscripciones', {
      fields: ['estudianteId', 'asignaturaId'],
      type: 'unique',
      name: 'unique_inscripcion'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Inscripciones');
  }
};