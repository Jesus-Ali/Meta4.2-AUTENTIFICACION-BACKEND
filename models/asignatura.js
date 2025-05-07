'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asignatura extends Model {
    static associate(models) {
      Asignatura.belongsToMany(models.Estudiante, {
        through: models.Inscripcion,
        foreignKey: 'asignaturaId'
      });
      Asignatura.belongsToMany(models.Docente, {
        through: models.Contrato,
        foreignKey: 'asignaturaId'
      });
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