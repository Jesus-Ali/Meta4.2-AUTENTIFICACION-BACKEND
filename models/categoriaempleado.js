'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoriaEmpleado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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