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
      const newPosition = position - 3; // 새로운 위치 계산

      if (newPosition >= 0) {
        try {
          await role.setPosition(newPosition);
          logger.info(
            `역할 위치가 변경되었습니다. 새로운 위치: ${newPosition}`
          );
        } catch (error) {
          logger.error("역할 위치 변경 중 오류 발생:", error);
        }
      } else {
        logger.info("유효하지 않은 역할 위치입니다.");
      }

      // 사용자에게 역할 부여
      await msg.member.roles.add(role);
    } else if (!msg.member.roles.cache.has(role.id)) {
      try {
        // 사용자에게 역할 부여
        await msg.member.roles.add(role);
        logger.info(
          `역할 부여 완료: ${msg.user.tag}에게 ${role.name} 역할 부여`
        );
      } catch (error) {
        logger.error("역할 부여 중 오류 발생:", error);
      }
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
      const newPosition = position - 3; // 새로운 위치 계산

      if (newPosition >= 0) {
        try {
          await role.setPosition(newPosition);
          logger.info(
            `역할 위치가 변경되었습니다. 새로운 위치: ${newPosition}`
          );
        } catch (error) {
          logger.error("역할 위치 변경 중 오류 발생:", error);
        }
      } else {
        logger.info("유효하지 않은 역할 위치입니다.");
      }

      // 사용자에게 역할 부여
      await interaction.member.roles.add(role);
    } else if (!interaction.member.roles.cache.has(role.id)) {
      try {
        // 사용자에게 역할 부여
        await interaction.member.roles.add(role);
        logger.info(
          `역할 부여 완료: ${interaction.user.tag}에게 ${role.name} 역할 부여`
        );
      } catch (error) {
        logger.error("역할 부여 중 오류 발생:", error);
      }
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
