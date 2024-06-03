const helpController = require("../controllers/helpController");
const adminController = require("../controllers/adminController");

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
        console.log("어드민 명령어");
        adminController.help(msg);
        break;
      case "help":
        console.log("명령어 : 도움말");
        helpController.help(msg);
        break;
      case "rule":
        console.log("명령어 : 규칙");
        break;
      case "channel":
        console.log("명령어 : 채널 관련");
        break;
      case "create_channel":
        console.log("명령어 : 채널 생성");
        break;
      case "private_channel":
        console.log("명령어 : 비밀채널 관련");
        break;
      case "create_private_channel":
        console.log("명령어 : 비밀 채널 생성");
        break;
      case "study_channel":
        console.log("명령어 : 모각공");
        break;
      case "change_color":
        console.log("명령어 : 색 변경");
        break;
      case "change_role":
        console.log("명령어 : 게임 역할 변경");
        break;
    }
  }
}

module.exports = CommandRoutes;
