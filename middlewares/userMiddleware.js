const userRepository = require("../repositories/userRepository");
const roleRepository = require("../repositories/roleRepository");

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
        console.log(
          `New user created: ${user.userName} (${user.Role.roleName})`
        );
      } else {
        console.error(`Default role '${defaultRoleName}' not found.`);
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
    console.error("Error authenticating user:", error);
    msg.reply({ content: "사용자 인증에 실패했습니다.", ephemeral: true });
  }
};
