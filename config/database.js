const logger = require("../utils/logger");
const { Sequelize } = require("sequelize");
const path = require("path");
const { adminId } = require("../config.json");
const { guildId } = require("../channelId.json");

async function retryDatabaseOperation(operation, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (error.message.includes("SQLITE_BUSY") && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),
  logging: (message) => {
    logger.info(message);
  },
});

const Role = require("../models/role")(sequelize);
const User = require("../models/user")(sequelize);
Role.associate({ User });
User.associate({ Role });

const initializeDatabase = async (client) => {
  try {
    logger.info("Syncing database...");
    await retryDatabaseOperation(() => sequelize.sync({ force: false }));
    logger.info("Database synced.");

    // Adding default roles
    await retryDatabaseOperation(() =>
      Role.bulkCreate(
        [
          { roleName: "MEMBER", maxChat: 20, maxChannel: 2, maxColor: 5 },
          { roleName: "VIP", maxChat: 70, maxChannel: 7, maxColor: 20 },
          { roleName: "VVIP", maxChat: 500, maxChannel: 0, maxColor: 0 },
          { roleName: "ADMIN", maxChat: 0, maxChannel: 0, maxColor: 0 },
        ],
        { ignoreDuplicates: true }
      )
    );
    logger.info("Default roles added.");

    const adminRole = await retryDatabaseOperation(() =>
      Role.findOne({ where: { roleName: "ADMIN" } })
    );
    const vipRole = await retryDatabaseOperation(() =>
      Role.findOne({ where: { roleName: "VIP" } })
    );
    const memberRole = await retryDatabaseOperation(() =>
      Role.findOne({ where: { roleName: "MEMBER" } })
    );

    // Adding default users
    await retryDatabaseOperation(() =>
      User.bulkCreate([{ userName: adminId, roleID: adminRole.roleID }], {
        ignoreDuplicates: true,
      })
    );
    logger.info("Default users added.");

    // Fetching guild members with a timeout
    logger.info("Fetching guild members...");
    const guild = await client.guilds.fetch(guildId);
    logger.info(`Fetched ${guild.name}, ${guild.memberCount} members.`);
    const members = await guild.members.fetch();
    logger.info(`Fetched ${members.size} members.`);

    // Process members
    await Promise.all(
      members.map(async (member) => {
        if (member.user.bot) return;
        await retryDatabaseOperation(async () => {
          const [user, created] = await User.findOrCreate({
            where: { userName: member.id },
            defaults: { roleID: memberRole.roleID },
          });
          if (created) {
            logger.info(`New user added: ${member.user.username}`);
          } else {
            logger.info(`Existing user: ${member.user.username}`);
          }
        });
      })
    );
    logger.info("All members processed.");
  } catch (error) {
    logger.error(`Error during database initialization: ${error.message}`);
  }
};

module.exports = {
  User,
  Role,
  sequelize,
  initializeDatabase,
};
