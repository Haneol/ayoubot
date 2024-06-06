const logger = require("../utils/logger");
const fs = require("fs");
const userRepository = require("../repositories/userRepository");
const { askClaude } = require("../utils/claudeUtil");
const chatView = require("../views/chatView");

exports.run = async (msg) => {
  const user = await userRepository.getUserById(msg.ayouUser);

  if (user.Role.roleName === "ADMIN" || user.countChat < user.Role.maxChat) {
    const systemPrompt = fs.readFileSync("prompts/chatPrompt.txt", "utf-8");
    const userPrompt = msg.argsPrompt.trim();

    askClaude(systemPrompt, userPrompt)
      .then(async (response) => {
        await msg.reply(response);
        await userRepository.incrementUserCountChat(user.userID);
      })
      .catch(async (error) => {
        if (error.message.includes("529")) {
          await chatView.sendChatFailedBecauseOfRateEmbededMsg(msg);
        } else {
          logger.error("Error: ", error);
        }
      });
  } else {
    await chatView.sendChatFailedEmbededMsg(msg, user);
  }
};

exports.getUsersCount = async (msg) => {
  const user = await userRepository.getUserById(msg.ayouUser);
  await chatView.sendChatCountEmbededMsg(msg, user);
};
