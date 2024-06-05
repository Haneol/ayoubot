const { User, Role } = require("../config/database");

// 사용자 생성
exports.createUser = async (discordUserId, roleID) => {
  try {
    await User.create({ userName: discordUserId, roleID: roleID });
  } catch (error) {
    throw new Error("사용자 생성에 실패했습니다. (" + error + ")");
  }
};

// 모든 사용자 조회
exports.getAllUsers = async () => {
  try {
    const users = await User.findAll({
      include: [{ model: Role }],
    });
    return users;
  } catch (error) {
    throw new Error("사용자 조회에 실패했습니다. (" + error + ")");
  }
};

// 특정 사용자 조회
exports.getUserById = async (userID) => {
  try {
    const user = await User.findByPk(userID, {
      include: [{ model: Role }],
    });
    return user;
  } catch (error) {
    throw new Error("사용자 조회에 실패했습니다. (" + error + ")");
  }
};

// 특정 사용자 이름으로 조회
exports.getUserByName = async (userName) => {
  try {
    const user = await User.findOne({
      where: { userName },
      include: [{ model: Role }],
    });
    return user;
  } catch (error) {
    throw new Error("사용자 조회에 실패했습니다. (" + error + ")");
  }
};

// 사용자 정보 업데이트
exports.updateUser = async (userID, userName, roleID) => {
  try {
    const [updated] = await User.update(
      { userName, roleID },
      { where: { userID } }
    );
    if (updated) {
      const updatedUser = await User.findByPk(userID);
      return updatedUser;
    }
    return null;
  } catch (error) {
    throw new Error("사용자 업데이트에 실패했습니다. (" + error + ")");
  }
};

// chat Count
exports.incrementUserCountChat = async (userId) => {
  try {
    // 사용자 정보와 역할 정보를 가져옴
    const user = await User.findOne({
      where: { userID: userId },
      include: [{ model: Role }],
    });

    if (!user) {
      return false;
    }

    const {
      countChat,
      Role: { maxChat },
    } = user;

    if (countChat >= maxChat) {
      return false;
    }

    await User.increment("countChat", { by: 1, where: { userID: userId } });
    return true;
  } catch (error) {
    console.error("Error incrementing user countChat:", error);
    return false;
  }
};

// channel Count
exports.incrementUserCountChannel = async (userId) => {
  try {
    // 사용자 정보와 역할 정보를 가져옴
    const user = await User.findOne({
      where: { userID: userId },
      include: [{ model: Role }],
    });

    if (!user) {
      return false;
    }

    const {
      countCreateChannel,
      Role: { maxChannel },
    } = user;

    if (countCreateChannel >= maxChannel) {
      return false;
    }

    await User.increment("countCreateChannel", {
      by: 1,
      where: { userID: userId },
    });
    return true;
  } catch (error) {
    console.error("Error incrementing user countCreateChannel:", error);
    return false;
  }
};

// color Count
exports.incrementUserCountColor = async (userId) => {
  try {
    // 사용자 정보와 역할 정보를 가져옴
    const user = await User.findOne({
      where: { userID: userId },
      include: [{ model: Role }],
    });

    if (!user) {
      return false;
    }

    const {
      countColor,
      Role: { maxColor },
    } = user;

    if (countColor >= maxColor) {
      return false;
    }

    await User.increment("countColor", {
      by: 1,
      where: { userID: userId },
    });
    return true;
  } catch (error) {
    console.error("Error incrementing user countColor:", error);
    return false;
  }
};

// 사용자 삭제
exports.deleteUser = async (userID) => {
  try {
    const deleted = await User.destroy({ where: { userID } });
    return deleted;
  } catch (error) {
    throw new Error("사용자 삭제에 실패했습니다. (" + error + ")");
  }
};
