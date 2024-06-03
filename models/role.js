const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
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
    },
    {
      tableName: "Role",
    }
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: "roleID" });
  };

  return Role;
};
