const adminController = require("../controllers/adminController");
const colorController = require("../controllers/colorController");
const gameController = require("../controllers/gameController");
const channelController = require("../controllers/channelController");
const chatController = require("../controllers/chatController");
const helpController = require("../controllers/helpController");

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
        console.log(`유저 ${msg.author.username} : 어드민 도움말`);
        adminController.help(msg);
        break;

      case "admin_all_user_get":
        console.log(`유저 ${msg.author.username} : 어드민 Get all user`);
        adminController.userList(msg);
        break;

      case "admin_user_by_role_get":
        console.log(`유저 ${msg.author.username} : 어드민 Get user by role`);
        adminController.userListByRole(msg);
        break;

      case "admin_user_by_id_get":
        console.log(`유저 ${msg.author.username} : 어드민 Get user by id`);
        adminController.userById(msg);
        break;

      case "admin_set_user":
        console.log(`유저 ${msg.author.username} : 어드민 Set user`);
        adminController.setUserCount(msg);
        break;

      case "admin_set_user_role":
        console.log(`유저 ${msg.author.username} : 어드민 Set user role`);
        adminController.setUserRole(msg);
        break;

      case "admin_time_all_user":
        console.log(`유저 ${msg.author.username} : 어드민 Get all user time`);
        adminController.getUserTimeList(msg);
        break;

      case "admin_time_user_by_id":
        console.log(`유저 ${msg.author.username} : 어드민 Get user time by id`);
        adminController.getUserTimeById(msg);
        break;

      case "help":
        console.log(`유저 ${msg.author.username} : 도움말`);
        helpController.help(msg);
        break;

      case "create_channel":
        console.log(`유저 ${msg.author.username} : 채널 생성`);
        channelController.run(msg);
        break;

      case "change_color":
        console.log(`유저 ${msg.author.username} : 색 변경`);
        colorController.run(msg);
        break;

      case "change_role":
        console.log(`유저 ${msg.author.username} : 게임 역할 변경`);
        gameController.run(msg);
        break;

      case "check_chat_with_ayou":
        console.log(`유저 ${msg.author.username} : 아유봇과 채팅 횟수`);
        chatController.getUsersCount(msg);
        break;

      case "chat_with_ayou":
        console.log(`유저 ${msg.author.username} : 아유봇과 채팅`);
        chatController.run(msg);
        break;
    }
  }
}

module.exports = CommandRoutes;
