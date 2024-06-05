const adminView = require("../views/adminView");
const userRepository = require("../repositories/userRepository");
const roleRepository = require("../repositories/roleRepository");

exports.help = async (msg) => {
  const content = `
  ## 어드민만 볼 수 있음
  //user list : 유저 리스트 전체 보기
  //user list [vvip, vip, member] : 해당 역할 유저 보기
  //user <userID> : 해당 유저 보기
  //set <userID> <chatCount> <channelCount> <colorCount> : 해당 유저 count 조절
  //role <userID> [vvip, vip, member] : 역할 변경
  `;
  adminView.sendEmbededMsg(msg, content);
};

exports.userList = async (msg) => {
  const users = await userRepository.getAllUsers();
  const client = msg.client;

  let content = "";
  for (const user of users) {
    try {
      const discordUser = await client.users.fetch(user.userName);
      const userInfo = `${user.userID} : ${discordUser.username}(${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}\n`;
      if (content.length + userInfo.length <= 4000) {
        content += userInfo;
      } else {
        content += "...";
        break;
      }
    } catch (error) {
      console.error(`Failed to fetch user ${user.userName}:`, error);
      const userInfo = `${user.userID} : (알 수 없는 사용자)(${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}\n`;
      if (content.length + userInfo.length <= 4000) {
        content += userInfo;
      } else {
        content += "...";
        break;
      }
    }
  }

  if (!content) content = "검색 불가";

  await adminView.sendEmbededMsg(msg, content);
};

exports.userListByRole = async (msg) => {
  const role = msg.argsRole.toUpperCase();
  const users = await userRepository.getAllUsersByRole(role);
  const client = msg.client;
  let content = "";
  for (const user of users) {
    try {
      const discordUser = await client.users.fetch(user.userName);
      const userInfo = `${user.userID} : ${discordUser.username}(${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}\n`;
      if (content.length + userInfo.length <= 4000) {
        content += userInfo;
      } else {
        content += "...";
        break;
      }
    } catch (error) {
      console.error(`Failed to fetch user ${user.userName}:`, error);
      const userInfo = `${user.userID} : (알 수 없는 사용자)(${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}\n`;
      if (content.length + userInfo.length <= 4000) {
        content += userInfo;
      } else {
        content += "...";
        break;
      }
    }
  }

  if (!content) content = "검색 불가";

  await adminView.sendEmbededMsg(msg, content);
};

exports.userById = async (msg) => {
  const userId = msg.argsId;
  const user = await userRepository.getUserByName(userId);
  const client = msg.client;
  let content = "";

  if (user) {
    try {
      const discordUser = await client.users.fetch(user.userName);
      content = `${user.userID} : ${discordUser.username}(${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}\n`;
    } catch (error) {
      console.error(`Failed to fetch user ${user.userName}:`, error);
      content = `${user.userID} : (알 수 없는 사용자)(${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}\n`;
    }
  } else {
    content = `해당 사용자를 찾을 수 없습니다.`;
  }

  await adminView.sendEmbededMsg(msg, content);
};

exports.setUserCount = async (msg) => {
  const userId = msg.argsId;
  const countList = msg.argsCountList;
  const [countChat, countCreateChannel, countColor] = countList;

  try {
    const user = await userRepository.getUserByName(userId);

    if (user) {
      user.countChat = countChat;
      user.countCreateChannel = countCreateChannel;
      user.countColor = countColor;

      await user.save();

      const client = msg.client;
      const discordUser = await client.users.fetch(user.userName);

      const content = `사용자 정보가 성공적으로 업데이트되었습니다.\n${user.userID} : ${discordUser.username}(${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}`;
      await adminView.sendEmbededMsg(msg, content);
    } else {
      await adminView.sendEmbededMsg(msg, `해당 사용자를 찾을 수 없습니다.`);
    }
  } catch (error) {
    console.error(`Failed to update user counts:`, error);
    await adminView.sendEmbededMsg(msg, `사용자 정보 업데이트에 실패했습니다.`);
  }
};

exports.setUserRole = async (msg) => {
  const userId = msg.argsId;
  const roleName = msg.argsRole.toUpperCase();

  try {
    const user = await userRepository.getUserByName(userId);
    const role = await roleRepository.getRoleByName(roleName);

    if (user && role) {
      user.roleID = role.roleID;
      await user.save();

      const client = msg.client;
      const discordUser = await client.users.fetch(user.userName);
      const guild = msg.guild;
      const member = await guild.members.fetch(discordUser.id);

      // 기존 역할 제거
      const currentRole = member.roles.cache.find(
        (r) => r.name === user.Role.roleName
      );
      if (currentRole) {
        await member.roles.remove(currentRole);
      }

      // 새로운 역할 추가
      const newRole = guild.roles.cache.find((r) => r.name === role.roleName);
      if (newRole) {
        await member.roles.add(newRole);
      }

      const content = `사용자 역할이 성공적으로 업데이트되었습니다.\n${user.userID} : ${discordUser.username}(${role.roleName})`;
      await adminView.sendEmbededMsg(msg, content);
    } else {
      await adminView.sendEmbededMsg(
        msg,
        `해당 사용자 또는 역할을 찾을 수 없습니다.`
      );
    }
  } catch (error) {
    console.error(`Failed to update user role:`, error);
    await adminView.sendEmbededMsg(msg, `사용자 역할 업데이트에 실패했습니다.`);
  }
};
