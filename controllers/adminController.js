const logger = require("../utils/logger");
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
  //time list : 유저 접속 시간 리스트 전체 보기
  //time <userID> : 특정 유저 접속 시간 보기
  //time reset : 전체 유저 초기화
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
      const userInfo = `${user.userID} : ${discordUser.globalName}(${discordUser.username}, ${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}\n`;
      if (content.length + userInfo.length <= 4000) {
        content += userInfo;
      } else {
        content += "...";
        break;
      }
    } catch (error) {
      logger.error(`Failed to fetch user ${user.userName}:`, error);
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
      const userInfo = `${user.userID} : ${discordUser.globalName}(${discordUser.username}, ${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}\n`;
      if (content.length + userInfo.length <= 4000) {
        content += userInfo;
      } else {
        content += "...";
        break;
      }
    } catch (error) {
      logger.error(`Failed to fetch user ${user.userName}:`, error);
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
      content = `${user.userID} : ${discordUser.globalName}(${discordUser.username}, ${user.Role.roleName}), chat: ${user.countChat}, chan: ${user.countCreateChannel}, col: ${user.countColor}\n`;
    } catch (error) {
      logger.error(`Failed to fetch user ${user.userName}:`, error);
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
    logger.error(`Failed to update user counts:`, error);
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
      const prevRole = user.Role.roleName;
      user.roleID = role.roleID;
      await user.save();
      const newUser = await userRepository.getUserByName(userId);

      const client = msg.client;
      const discordUser = await client.users.fetch(user.userName);
      const guild = msg.guild;
      const member = await guild.members.fetch(discordUser.id);

      const content = `사용자 역할이 성공적으로 업데이트되었습니다.\n${user.userID} : ${discordUser.username}(${role.roleName})`;
      await adminView.sendEmbededMsg(msg, content);
      await adminView.sendDM(member, prevRole, newUser.Role.roleName);
    } else {
      await adminView.sendEmbededMsg(
        msg,
        `해당 사용자 또는 역할을 찾을 수 없습니다.`
      );
    }
  } catch (error) {
    logger.error(`Failed to update user role:`, error);
    await adminView.sendEmbededMsg(msg, `사용자 역할 업데이트에 실패했습니다.`);
  }
};

exports.getUserTimeList = async (msg) => {
  const users = await userRepository.getAllUsers();
  const client = msg.client;

  let content = "";

  // connectionTime을 기준으로 내림차순 정렬
  users.sort((a, b) => b.connectionTime - a.connectionTime);

  for (const user of users) {
    try {
      const discordUser = await client.users.fetch(user.userName);

      const hours = Math.floor(user.connectionTime / 3600);
      const minutes = Math.floor((user.connectionTime % 3600) / 60);
      const seconds = Math.floor(user.connectionTime % 60);

      const userInfo = `${discordUser.globalName}(${discordUser.username}, ${user.Role.roleName}) : ${hours}h ${minutes}m ${seconds}s\n`;
      if (content.length + userInfo.length <= 4000) {
        content += userInfo;
      } else {
        content += "...";
        break;
      }
    } catch (error) {
      logger.error(`Failed to fetch user ${user.userName}:`, error);
      const userInfo = `[알 수 없는 사용자]\n`;
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

exports.getUserTimeById = async (msg) => {
  const userId = msg.argsId;
  const user = await userRepository.getUserByName(userId);
  const client = msg.client;
  let content = "";

  if (user) {
    try {
      const discordUser = await client.users.fetch(user.userName);

      const hours = Math.floor(user.connectionTime / 3600);
      const minutes = Math.floor((user.connectionTime % 3600) / 60);
      const seconds = Math.floor(user.connectionTime % 60);

      content = `${discordUser.globalName}(${discordUser.username}, ${user.Role.roleName}) : ${hours}h ${minutes}m ${seconds}s\n`;
    } catch (error) {
      logger.error(`Failed to fetch user ${user.userName}:`, error);
      content = `[알 수 없는 사용자]\n`;
    }
  } else {
    content = `해당 사용자를 찾을 수 없습니다.`;
  }

  await adminView.sendEmbededMsg(msg, content);
};

exports.resetUserTime = async (msg) => {
  const users = await userRepository.getAllUsers();

  for (const user of users) {
    try {
      if (user) {
        user.connectionTime = 0;
        await user.save();
      }
    } catch (error) {
      logger.error("Failed to reset user time:", error);
      let content = `유저 초기화 중 에러 발생\n${error}`;
      if (content.length > 4000) {
        content = content.slice(0, 3997);
        content = content + "...";
      }
      await adminView.sendEmbededMsg(msg, content);
    }
  }

  await adminView.sendEmbededMsg(msg, "유저 Time이 초기화 되었습니다.");
};
