'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Docente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Docente.belongsTo(models.Persona, {
        foreignKey: 'personaId'
      });
      Docente.belongsTo(models.CategoriaEmpleado, {
        foreignKey: 'categoriaEmpleadoClave'
      });
      Docente.hasOne(models.Contrato, {
        foreignKey: 'docenteNumEmpleado'
      })
    }
  }
  Docente.init({
    numEmpleado: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Docente',
  });
  return Docente;
};