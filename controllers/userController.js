const userRepository = require("../repositories/userRepository");
const userView = require("../views/userView");

exports.run = async (client) => {
  const users = await userRepository.getAllUsers();

  for (const user of users) {
    try {
      if (user) {
        user.countChat = 0;
        user.countCreateChannel = 0;
        user.countColor = 0;

        await user.save();
      }
    } catch (error) {
      console.error(`Failed to reset user counts:`, error);
      let content = `유저 초기화 중 에러 발생\n${error}`;
      if (content.length > 4000) {
        content = content.slice(0, 3997);
        content = content + "...";
      }
      await userView.sendEmbededMsg(client, content);
    }
  }

  await userView.sendEmbededMsg(client, "유저 Count가 초기화 되었습니다.");
};
