const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
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
      connectionTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      countChat: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      countCreateChannel: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      countColor: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "User",
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleID" });
  };

  return User;
};
