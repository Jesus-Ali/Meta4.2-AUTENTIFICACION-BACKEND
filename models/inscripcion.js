'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inscripcion extends Model {
    static associate(models) {
      Inscripcion.belongsTo(models.Estudiante, { foreignKey: 'estudianteId' });
      Inscripcion.belongsTo(models.Asignatura, { foreignKey: 'asignaturaId' });
    }
  }
  Inscripcion.init({
    semestre: DataTypes.INTEGER,
    calificacion: DataTypes.FLOAT,
    estudianteId: DataTypes.INTEGER,
    asignaturaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Inscripcion',
    indexes: [
      {
        unique: true,
        fields: ['estudianteId', 'asignaturaId']
      }
    ]
  });
  return Inscripcion;
};