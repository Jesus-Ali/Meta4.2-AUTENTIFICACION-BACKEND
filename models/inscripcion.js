'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inscripcion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inscripcion.belongsTo(models.Estudiante, {
        foreignKey: 'estudianteMatricula', targetKey: 'matricula'
      });
      Inscripcion.belongsTo(models.Asignatura, {
        foreignKey: 'asignaturaClave', targetKey: 'clave'
      });
    }
  }
  Inscripcion.init({
    estudianteMatricula: DataTypes.INTEGER,
    asignaturaClave: DataTypes.INTEGER,
    semestre: DataTypes.INTEGER,
    calificacion: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Inscripcion',
    tableName: 'Inscripciones',
  freezeTableName: true
  });
  return Inscripcion;
};