'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asignatura extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Asignatura.hasOne(models.Inscripcion, {
        foreignKey: 'clave'
      });
      Asignatura.hasOne(models.Contrato, {
        foreignKey: 'clave'
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