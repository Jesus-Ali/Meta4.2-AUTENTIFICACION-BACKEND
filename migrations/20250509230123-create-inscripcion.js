'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inscripciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      estudianteMatricula: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model:'Estudiantes',
          key:'matricula'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      asignaturaClave: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model:'Asignaturas',
          key:'clave'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      semestre: {
        type: Sequelize.INTEGER
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Inscripciones');
  }
};