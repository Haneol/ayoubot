const { Role } = require("../config/database");

// 역할 이름으로 역할 조회
exports.getRoleByName = async (roleName) => {
  try {
    const role = await Role.findOne({ where: { roleName } });
    return role;
  } catch (error) {
    throw new Error("역할 조회에 실패했습니다.");
  }
};
