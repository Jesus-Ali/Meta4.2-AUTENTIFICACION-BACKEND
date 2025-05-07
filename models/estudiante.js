'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Estudiante extends Model {
    static associate(models) {
      Estudiante.belongsTo(models.Persona, { foreignKey: 'personaId' });
      Estudiante.hasMany(models.Inscripcion, { foreignKey: 'estudianteId' });
    }
  }
  Estudiante.init({
    matricula: DataTypes.INTEGER,
    personaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Estudiante',
  });
  return Estudiante;
};