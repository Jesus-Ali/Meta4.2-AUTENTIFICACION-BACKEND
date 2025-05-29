'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Usuarios.init({
    email: DataTypes.STRING,
    contraseña: DataTypes.STRING,
    googleId: {
      type: DataTypes.STRING,
      allowNull: true, // Allows both local and Google users
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Usuarios',
  });
  return Usuarios;
};