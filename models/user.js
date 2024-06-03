const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Role = require("./role");

const User = sequelize.define("User", {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  roleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Role",
      key: "roleID",
    },
  },
  countChat: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  countCreateChannel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

User.belongsTo(Role, { foreignKey: "roleID" });

module.exports = User;
