const { Sequelize } = require("sequelize");
const path = require("path");
const { adminId } = require("../config.json");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),
});

const Role = require("../models/role")(sequelize);
const User = require("../models/user")(sequelize);

Role.associate({ User });
User.associate({ Role });

const initializeDatabase = async (guild) => {
  await sequelize.sync({ force: true }); // force: true -> DB 초기화
  // 기본 Role 데이터 추가
  await Role.bulkCreate(
    [
      { roleName: "MEMBER", maxChat: 20, maxChannel: 2, maxColor: 5 },
      { roleName: "VIP", maxChat: 70, maxChannel: 7, maxColor: 20 },
      { roleName: "VVIP", maxChat: 500, maxChannel: 0, maxColor: 0 },
      { roleName: "ADMIN", maxChat: 0, maxChannel: 0, maxColor: 0 },
    ],
    {
      ignoreDuplicates: true,
    }
  );
  const adminRole = await Role.findOne({ where: { roleName: "ADMIN" } });
  const vipRole = await Role.findOne({ where: { roleName: "VIP" } });
  const memberRole = await Role.findOne({ where: { roleName: "MEMBER" } });

  // 기본 User 데이터 추가
  await User.bulkCreate(
    [
      { userName: adminId, roleID: adminRole.roleID },
      { userName: "383643322427637761", roleID: vipRole.roleID },
    ],
    {
      ignoreDuplicates: true,
    }
  );

  const members = await guild.members.list({ limit: 100 });
  await Promise.all(
    members
      .filter((member) => !member.user.bot)
      .map(async (member) => {
        await User.findOrCreate({
          where: { userName: member.id },
          defaults: { roleID: memberRole.roleID },
        });
        console.log("user: " + member.user.username + " 추가 중...");
      })
  );
};

module.exports = {
  User,
  Role,
  sequelize,
  initializeDatabase,
};
