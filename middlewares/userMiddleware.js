const userRepository = require("../repositories/userRepository");
const roleRepository = require("../repositories/roleRepository");
const logger = require("../utils/logger");

exports.authenticateUser = async (msg, next) => {
  try {
    // 사용자 조회
    const discordUserId = msg.author.id;
    let user = await userRepository.getUserByName(discordUserId);

    // 사용자가 없다면 사용자 생성
    if (!user) {
      const defaultRoleName = "MEMBER";
      const defaultRole = await roleRepository.getRoleByName(defaultRoleName);

      if (defaultRole) {
        await userRepository.createUser(discordUserId, defaultRole.roleID);
        user = await userRepository.getUserByName(discordUserId);
        logger.info(
          `New user created: ${user.userName} (${user.Role.roleName})`
        );
      } else {
        logger.error(`Default role '${defaultRoleName}' not found.`);
        return msg.reply({
          content: "사용자 인증에 실패했습니다.",
          ephemeral: true,
        });
      }
    }

    // 사용자 ID를 메시지 객체에 저장
    msg.ayouUser = user.userID;

    // 사용자 역할 조회
    const roleName = msg.author.username;
    let role = msg.guild.roles.cache.find((role) => role.name === roleName);

    // 사용자 역할이 없다면 사용자 역할 생성
    if (!role) {
      role = await msg.guild.roles.create({
        name: roleName,
        permissions: [],
      });

      // 우선순위 최상단 위치
      const position = msg.guild.roles.highest.position;
      await role.setPosition(position - 3);

      // 사용자에게 역할 부여
      await msg.member.roles.add(role);
    }

    // 사용자 역할을 메시지 객체에 저장
    msg.ayouRole = role;
    next();
  } catch (error) {
    logger.error("Error authenticating user:", error);
    msg.reply({ content: "사용자 인증에 실패했습니다.", ephemeral: true });
  }
};

exports.authenticateUserWithInteraction = async (interaction, next) => {
  try {
    // 사용자 조회
    const discordUserId = interaction.member.id;
    let user = await userRepository.getUserByName(discordUserId);

    // 사용자가 없다면 사용자 생성
    if (!user) {
      logger.info("사용자 생성 중");
      const defaultRoleName = "MEMBER";
      const defaultRole = await roleRepository.getRoleByName(defaultRoleName);

      if (defaultRole) {
        await userRepository.createUser(discordUserId, defaultRole.roleID);
        user = await userRepository.getUserByName(discordUserId);
        logger.info(
          `New user created: ${user.userName} (${user.Role.roleName})`
        );
      } else {
        logger.error(`Default role '${defaultRoleName}' not found.`);
        return interaction.reply({
          content: "사용자 인증에 실패했습니다.",
          ephemeral: true,
        });
      }
    }

    // 사용자 ID를 메시지 객체에 저장
    interaction.ayouUser = user.userID;

    // 사용자 역할 조회
    const roleName = interaction.member.user.username;
    let role = interaction.guild.roles.cache.find(
      (role) => role.name === roleName
    );

    // 사용자 역할이 없다면 사용자 역할 생성
    if (!role) {
      logger.info("사용자 역할 생성 중");
      role = await interaction.guild.roles.create({
        name: roleName,
        permissions: [],
      });

      // 우선순위 최상단 위치
      const position = interaction.guild.roles.highest.position;
      await role.setPosition(position - 3);

      // 사용자에게 역할 부여
      await interaction.member.roles.add(role);
    }

    // 사용자 역할을 메시지 객체에 저장
    interaction.ayouRole = role;
    next();
  } catch (error) {
    logger.error("Error authenticating user:", error);
    interaction.reply({
      content: "사용자 인증에 실패했습니다.",
      ephemeral: true,
    });
  }
};
