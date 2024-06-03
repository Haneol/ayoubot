const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Role = sequelize.define("Role", {
  roleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  maxChat: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxChannel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Role;
