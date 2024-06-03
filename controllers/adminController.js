const AdminView = require("../views/adminView");
const userRepository = require("../repositories/userRepository");

exports.help = async (msg) => {
  const adminView = new AdminView(msg);

  const user = await userRepository.getUserById(msg.ayouUser);

  adminView.sendEmbededMsg(user.userName, user.Role.roleName);
};
