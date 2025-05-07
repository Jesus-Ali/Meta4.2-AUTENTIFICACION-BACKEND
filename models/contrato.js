'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contrato extends Model {
    static associate(models) {
      Contrato.belongsTo(models.Docente, { foreignKey: 'docenteId' });
      Contrato.belongsTo(models.Asignatura, { foreignKey: 'asignaturaId' });
    }
  }
  Contrato.init({
    docenteId: DataTypes.INTEGER,
    asignaturaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Contrato',
    indexes: [
      {
        unique: true,
        fields: ['docenteId', 'asignaturaId']
      }
    ]
  });
  return Contrato;
};