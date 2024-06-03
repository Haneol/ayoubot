const CommandRoutes = require("./commandRoutes");
const { askClaude } = require("../utils/claudeUtil");
const { authenticateUser } = require("../middlewares/userMiddleware");
const userRepository = require("../repositories/userRepository");

class MsgCommandRoutes extends CommandRoutes {
  // Implementation
  async routes(msg) {
    if (msg.author.bot) return;

    await authenticateUser(msg, async () => {
      const user = await userRepository.getUserById(msg.ayouUser);
      if (msg.content.startsWith("//") && user.Role.roleName === "ADMIN") {
        const prompt = msg.content.slice(2).trim().replace(/\s/g, "");
        if (prompt == "help") {
          this._findRoutes(msg, "admin_help");
        }
      } else if (msg.content.startsWith("믫 ")) {
        const prompt = msg.content.slice(2).trim();
        const cmd = prompt.replace(/\s/g, "");

        if (
          cmd == "?" ||
          cmd == "도움" ||
          cmd == "도움말" ||
          cmd == "명령어" ||
          cmd == "기능" ||
          cmd == "사용법" ||
          cmd == "기능" ||
          cmd == "가이드" ||
          cmd == "설명서" ||
          cmd == "헬프" ||
          cmd == "헲" ||
          cmd == "헬프미" ||
          cmd == "헲미"
        ) {
          this._findRoutes(msg, "help");
        } else if (cmd == "규칙" || cmd == "서버규칙" || cmd == "룰") {
          this._findRoutes(msg, "rule");
        } else if (cmd == "채널" || cmd == "공개채널" || cmd == "음성채널") {
          this._findRoutes(msg, "channel");
        } else if (cmd == "채널생성") {
          this._findRoutes(msg, "create_channel");
        } else if (cmd == "비밀채널") {
          this._findRoutes(msg, "private_channel");
        } else if (cmd == "비밀채널생성") {
          this._findRoutes(msg, "create_private_channel");
        } else if (cmd == "모각공") {
          this._findRoutes(msg, "study_channel");
        } else if (cmd == "색변경") {
          this._findRoutes(msg, "change_color");
        } else if (cmd == "게임역할변경") {
          this._findRoutes(msg, "change_role");
        } else if (/^(?=.*[가-힣]).{2,}$/.test(cmd)) {
          // 명령어가 없을 경우 클로드 이용
          // 한글 1자 이상, 전체 문장 2자 이상 포함될 경우 실행
          askClaude(prompt.replace(/[ㄱ-ㅎㅏ-ㅣᴥ]/g, ""))
            .then((response) => {
              this.#requestClaude(msg, response);
            })
            .catch((error) => {
              console.error("Error: ", error);
            });
        }
      }
    });
  }

  // Using Claude
  #requestClaude(msg, response) {
    if (response.includes("ayou-q:")) {
      if (response.includes("ayou-q:0")) {
        // 아유 서버의 규칙과 관련됨
        this._findRoutes(msg, "rule");
      } else if (response.includes("ayou-q:10")) {
        // 채널 생성과 관련됨
        this._findRoutes(msg, "channel");
      } else if (response.includes("ayou-q:11")) {
        // 채널 생성 요청
        this._findRoutes(msg, "create_channel");
      } else if (response.includes("ayou-q:20")) {
        // 비밀 채널 생성과 관련됨
        this._findRoutes(msg, "private_channel");
      } else if (response.includes("ayou-q:21")) {
        // 비밀 채널 생성 요청
        this._findRoutes(msg, "create_private_channel");
      } else if (response.includes("ayou-q:30")) {
        // 모각공 채널과 관련됨
        this._findRoutes(msg, "study_channel");
      } else if (response.includes("ayou-q:40")) {
        // 색상 변경
        this._findRoutes(msg, "change_color");
      } else if (response.includes("ayou-q:41")) {
        // 게임 역할 변경
        this._findRoutes(msg, "change_role");
      } else if (response.includes("ayou-q:99")) {
        // 아유 서버의 전체 기능을 요청
        this._findRoutes(msg, "help");
      } else {
        console.log(`msgCommandRoutes Error: ${response}`);
      }
    } else {
      msg.reply(response);
    }
  }
}

module.exports = MsgCommandRoutes;
