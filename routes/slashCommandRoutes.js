const colorController = require("../controllers/colorController");
const gameController = require("../controllers/gameController");
const channelController = require("../controllers/channelController");
const chatController = require("../controllers/chatController");
const helpController = require("../controllers/helpController");
const emojiController = require("../controllers/emojiController");
const CommandRoutes = require("./commandRoutes");
const {
  authenticateUserWithInteraction,
} = require("../middlewares/userMiddleware");
const logger = require("../utils/logger");

class SlashCommandRoutes extends CommandRoutes {
  //Implementation
  async routes(interaction) {
    await authenticateUserWithInteraction(interaction, async () => {
      const { commandName } = interaction;

      if (commandName === "도움말") {
        logger.info(`유저 ${interaction.member.user.username} : 도움말`);
        await helpController.help(interaction);
      } else if (commandName === "채널") {
        logger.info(`유저 ${interaction.member.user.username} : 채널 생성`);
        await channelController.createChannelRequest(interaction);
      } else if (commandName === "비밀채널") {
        logger.info(`유저 ${interaction.member.user.username} : 비밀채널 생성`);
        await channelController.createPrivateChannelRequest(interaction);
      } else if (commandName === "색확인") {
        logger.info(`유저 ${interaction.member.user.username} : 색상 확인`);
        await colorController.showCurrentColor(interaction);
      } else if (commandName === "색변경") {
        logger.info(`유저 ${interaction.member.user.username} : 색상 변경`);
        await colorController.changeColorRequest(interaction);
      } else if (commandName === "색지우기") {
        logger.info(`유저 ${interaction.member.user.username} : 색상 지우기`);
        await colorController.deleteColor(interaction);
      } else if (commandName === "게임") {
        logger.info(
          `유저 ${interaction.member.user.username} : 게임 역할 변경`
        );
        await gameController.changeGame(interaction);
      } else if (commandName === "게임지우기") {
        logger.info(
          `유저 ${interaction.member.user.username} : 게임 역할 지우기`
        );
        await gameController.deleteGame(interaction);
        logger.info(`유저 ${interaction.member.user.username} : 돋보기 토글`);
      } else if (commandName === "돋보기") {
        await emojiController.runWithInteraction(interaction);
      } else if (commandName === "대화") {
        logger.info(
          `유저 ${interaction.member.user.username} : 아유봇과 대화 횟수`
        );
        await chatController.getUsersCount(interaction);
      }
    });
  }
}

module.exports = SlashCommandRoutes;
