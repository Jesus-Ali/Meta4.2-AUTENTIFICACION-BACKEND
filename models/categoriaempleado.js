'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoriaEmpleado extends Model {
    static associate(models) {
      // define association here
    }
  }
  CategoriaEmpleado.init({
    clave: DataTypes.INTEGER,
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CategoriaEmpleado',
  });
  return CategoriaEmpleado;
};