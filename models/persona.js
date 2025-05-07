'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
    static associate(models) {
      Persona.hasOne(models.Estudiante, { foreignKey: 'personaId' });
      Persona.hasOne(models.Docente, { foreignKey: 'personaId' });
    }
  }
  Persona.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Persona',
  });
  return Persona;
};