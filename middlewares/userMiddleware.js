const userRepository = require("../repositories/userRepository");
const roleRepository = require("../repositories/roleRepository");

exports.authenticateUser = async (msg, next) => {
  try {
    // 사용자 조회
    const discordUserId = msg.author.id;
    let user = await userRepository.getUserByName(discordUserId);

    if (!user) {
      // 사용자가 없으면 새로운 사용자 생성
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
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    msg.reply({ content: "사용자 인증에 실패했습니다.", ephemeral: true });
  }
};
