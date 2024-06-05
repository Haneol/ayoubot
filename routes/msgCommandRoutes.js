const fs = require("fs");
const CommandRoutes = require("./commandRoutes");
const { askClaude } = require("../utils/claudeUtil");
const { authenticateUser } = require("../middlewares/userMiddleware");
const userRepository = require("../repositories/userRepository");

class MsgCommandRoutes extends CommandRoutes {
  // Implementation
  async routes(msg) {
    if (msg.author.bot) return;

    if (msg.content.startsWith("//")) {
      // userMiddleware 사용
      await authenticateUser(msg, async () => {
        const user = await userRepository.getUserById(msg.ayouUser);
        if (user.Role.roleName === "ADMIN") {
          const prompt = msg.content
            .slice(2)
            .trim()
            .replace(/\s/g, " ")
            .split(" ");
          if (prompt[0] == "help") {
            this._findRoutes(msg, "admin_help");
          } else if (prompt[0] == "user") {
            if (prompt[1] == "list") {
              if (!prompt[2]) {
                this._findRoutes(msg, "admin_all_user_get");
              } else {
                msg.argsRole = prompt[2];
                this._findRoutes(msg, "admin_user_by_role_get");
              }
            } else if (prompt[1]) {
              msg.argsId = prompt[1];
              this._findRoutes(msg, "admin_user_by_id_get");
            }
          } else if (prompt[0] == "set") {
            msg.argsId = prompt[1];
            msg.argsCountList = [prompt[2], prompt[3], prompt[4]];
            this._findRoutes(msg, "admin_set_user");
          } else if (prompt[0] == "role") {
            msg.argsId = prompt[1];
            msg.argsRole = prompt[2];
            this._findRoutes(msg, "admin_set_user_role");
          }
        }
      });
    } else if (msg.content.startsWith("믫 ") || msg.content.startsWith("!!")) {
      // userMiddleware 사용
      await authenticateUser(msg, async () => {
        const prompt = msg.content.slice(2).trim();
        const cmd = prompt.replace(/\s/g, "");

        if (
          cmd == "채널" ||
          cmd == "공개채널" ||
          cmd == "음성채널" ||
          cmd == "채널생성" ||
          cmd == "비밀채널" ||
          cmd == "방" ||
          cmd == "비밀채널생성" ||
          cmd == "공개채널생성" ||
          cmd == "방생성" ||
          cmd == "채널방" ||
          cmd == "보이스채널" ||
          cmd == "보이스채널생성"
        ) {
          this._findRoutes(msg, "create_channel");
        } else if (
          cmd == "색변경" ||
          cmd == "색" ||
          cmd == "색상" ||
          cmd == "색깔" ||
          cmd == "색깔변경" ||
          cmd == "색상변경" ||
          cmd == "색깔바꾸기" ||
          cmd == "색상바꾸기" ||
          cmd == "색바꾸기"
        ) {
          this._findRoutes(msg, "change_color");
        } else if (
          cmd == "게임역할변경" ||
          cmd == "게임역할" ||
          cmd == "게임" ||
          cmd == "게임채널" ||
          cmd == "게임채널변경" ||
          cmd == "게임변경" ||
          cmd == "겜역할변경" ||
          cmd == "겜" ||
          cmd == "겜역할" ||
          cmd == "겜채널" ||
          cmd == "겜채널변경" ||
          cmd == "겜설정" ||
          cmd == "게임설정" ||
          cmd == "게임설정변경" ||
          cmd == "겜설정변경"
        ) {
          this._findRoutes(msg, "change_role");
        } else if (/^(?=.*[가-힣]).{2,}$/.test(cmd)) {
          // 명령어가 없을 경우 클로드 이용
          // 한글 1자 이상, 전체 문장 2자 이상 포함될 경우 실행

          // chatPrompt.txt 파일 읽기
          const systemPrompt = fs.readFileSync(
            "prompts/chatPrompt.txt",
            "utf-8"
          );

          askClaude(systemPrompt, prompt.replace(/[ㄱ-ㅎㅏ-ㅣᴥ]/g, ""))
            .then((response) => {
              this.#requestClaude(msg, response);
            })
            .catch((error) => {
              console.error("Error: ", error);
            });
        }
      });
    }
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
