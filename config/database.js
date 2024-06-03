const { Sequelize } = require("sequelize");
const path = require("path");
const Role = require("../models/role");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),
});

const initializeDatabase = async () => {
  await sequelize.sync({ force: true });

  // 기본 Role 데이터 추가
  await Role.bulkCreate([
    { roleName: "MEMBER", maxChat: 30, maxChannel: 2 },
    { roleName: "VIP", maxChat: 100, maxChannel: 10 },
    { roleName: "ADMIN", maxChat: 0, maxChannel: 0 },
  ]);
};

initializeDatabase();

module.exports = sequelize;
