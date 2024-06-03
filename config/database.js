const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),
});

const Role = require("../models/role")(sequelize);
const User = require("../models/user")(sequelize);

Role.associate({ User });
User.associate({ Role });

const initializeDatabase = async () => {
  await sequelize.sync();
  // 기본 Role 데이터 추가
  await Role.bulkCreate(
    [
      { roleName: "MEMBER", maxChat: 30, maxChannel: 2 },
      { roleName: "VIP", maxChat: 100, maxChannel: 10 },
      { roleName: "ADMIN", maxChat: 0, maxChannel: 0 },
    ],
    {
      ignoreDuplicates: true,
    }
  );
  const adminRole = await Role.findOne({ where: { roleName: "ADMIN" } });
  // 기본 User 데이터 추가
  await User.bulkCreate(
    [{ userName: "228163287685005312", roleID: adminRole.roleID }],
    {
      ignoreDuplicates: true,
    }
  );
};

module.exports = {
  User,
  Role,
  sequelize,
  initializeDatabase,
};
