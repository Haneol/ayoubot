const adminController = require("../controllers/adminController");
const colorController = require("../controllers/colorController");
const gameController = require("../controllers/gameController");
const channelController = require("../controllers/channelController");
const chatController = require("../controllers/chatController");
const helpController = require("../controllers/helpController");
const emojiController = require("../controllers/emojiController");
const logger = require("../utils/logger");

// Abstract Class
class CommandRoutes {
  constructor() {
    if (this.constructor === CommandRoutes) {
      throw new Error(
        "CommandRoutes Error: Cannot instantiate an abstract class."
      );
    }
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  // Abstract Method
  routes(msg) {
    throw new Error(
      "CommandRoutes Error: Method 'routes' must be implemented."
    );
  }

  // Controller Route
  _findRoutes(msg, name) {
    switch (name) {
      case "admin_help":
        logger.info(`유저 ${msg.author.username} : 어드민 도움말`);
        adminController.help(msg);
        break;

      case "admin_all_user_get":
        logger.info(`유저 ${msg.author.username} : 어드민 Get all user`);
        adminController.userList(msg);
        break;

      case "admin_user_by_role_get":
        logger.info(`유저 ${msg.author.username} : 어드민 Get user by role`);
        adminController.userListByRole(msg);
        break;

      case "admin_user_by_id_get":
        logger.info(`유저 ${msg.author.username} : 어드민 Get user by id`);
        adminController.userById(msg);
        break;

      case "admin_set_user":
        logger.info(`유저 ${msg.author.username} : 어드민 Set user`);
        adminController.setUserCount(msg);
        break;

      case "admin_set_user_role":
        logger.info(`유저 ${msg.author.username} : 어드민 Set user role`);
        adminController.setUserRole(msg);
        break;

      case "admin_time_all_user":
        logger.info(`유저 ${msg.author.username} : 어드민 Get all user time`);
        adminController.getUserTimeList(msg);
        break;

      case "admin_time_user_by_id":
        logger.info(`유저 ${msg.author.username} : 어드민 Get user time by id`);
        adminController.getUserTimeById(msg);
        break;

      case "admin_time_reset":
        logger.info(
          `유저 ${msg.author.username} : 어드민 Reset all user's time`
        );
        adminController.resetUserTime(msg);
        break;

      case "help":
        logger.info(`유저 ${msg.author.username} : 도움말`);
        helpController.help(msg);
        break;

      case "create_channel":
        logger.info(`유저 ${msg.author.username} : 채널 생성`);
        channelController.run(msg);
        break;

      case "delete_channel":
        logger.info(`유저 ${msg.author.username} : 채널 삭제`);
        channelController.deleteChannel(msg);
        break;

      case "get_color":
        logger.info(`유저 ${msg.author.username} : 색 확인`);
        colorController.showCurrentColor(msg);
        break;

      case "change_color":
        logger.info(`유저 ${msg.author.username} : 색 변경`);
        colorController.run(msg);
        break;

      case "change_role":
        logger.info(`유저 ${msg.author.username} : 게임 역할 변경`);
        gameController.run(msg);
        break;

      case "check_chat_with_ayou":
        logger.info(`유저 ${msg.author.username} : 아유봇과 채팅 횟수`);
        chatController.getUsersCount(msg);
        break;

      case "expand_emoji":
        logger.info(`유저 ${msg.author.username} : 이모지 확대 토글`);
        emojiController.run(msg);
        break;

      case "chat_with_ayou":
        logger.info(`유저 ${msg.author.username} : 아유봇과 채팅`);
        chatController.run(msg);
        break;
    }
  }
}

module.exports = CommandRoutes;
