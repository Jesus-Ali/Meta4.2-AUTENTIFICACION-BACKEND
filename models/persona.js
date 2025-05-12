'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
    static associate(models) {
      // define association here
      Persona.hasOne(models.Estudiante, {
        foreignKey: 'personaId'
      });
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