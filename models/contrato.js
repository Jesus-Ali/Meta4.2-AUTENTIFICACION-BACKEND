'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contrato extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Contrato.belongsTo(models.Docente, {
        foreignKey: 'numEmpleado'
      });
      Contrato.belongsTo(models.Asignatura, {
        foreignKey: 'clave'
      });
    }
  }
  Contrato.init({
    docenteNumEmpleado: DataTypes.INTEGER,
    asignaturaClave: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Contrato',
  });
  return Contrato;
};