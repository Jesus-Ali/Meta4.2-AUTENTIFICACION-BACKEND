module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Estudiantes', 'personaId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Personas',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Estudiantes', 'personaId');
  }
};