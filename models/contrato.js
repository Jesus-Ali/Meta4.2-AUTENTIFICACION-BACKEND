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
        foreignKey: 'docenteNumEmpleado', // Este es el nombre del campo en la tabla Contratos
        targetKey: 'numEmpleado'          // Este es el campo en la tabla Docentes
      });

      Contrato.belongsTo(models.Asignatura, {
        foreignKey: 'asignaturaClave',    // Campo en Contratos
        targetKey: 'clave'                // Campo en Asignaturas
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