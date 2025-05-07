'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asignatura extends Model {
    static associate(models) {
      Asignatura.hasMany(models.Inscripcion, { foreignKey: 'asignaturaId' });
      Asignatura.hasMany(models.Contrato, { foreignKey: 'asignaturaId' });
    }
  }
  Asignatura.init({
    clave: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    creditos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Asignatura',
  });
  return Asignatura;
};