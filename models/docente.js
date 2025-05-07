'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Docente extends Model {
    static associate(models) {
      Docente.belongsTo(models.Persona, { foreignKey: 'personaId' });
      Docente.belongsTo(models.CategoriaEmpleado, { foreignKey: 'categoriaEmpleadoId' });
      Docente.belongsToMany(models.Asignatura, {
        through: models.Contrato,
        foreignKey: 'docenteId'
      });
    }
  }
  Docente.init({
    numEmpleado: DataTypes.INTEGER,
    personaId: DataTypes.INTEGER,
    categoriaEmpleadoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Docente',
  });
  return Docente;
};