const CommandRoutes = require("./commandRoutes");
const { authenticateUser } = require("../middlewares/userMiddleware");
const userRepository = require("../repositories/userRepository");
const { emojiToggle, bigEmoji } = require("../controllers/emojiController");

class MsgCommandRoutes extends CommandRoutes {
  // Implementation
  async routes(msg) {
    if (msg.author.bot) return;

    const emojiRegex = /^<:(\w+):(\d+)>$/;
    const emojiMatch = emojiRegex.exec(msg.content);

    if (emojiMatch && msg.content.trim() === emojiMatch[0]) {
      if (emojiToggle[msg.author.id]) {
        await bigEmoji(msg, emojiMatch[2]);
      }
    } else if (msg.content.startsWith("//")) {
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
          } else if (prompt[0] == "time") {
            if (prompt[1] == "list") {
              this._findRoutes(msg, "admin_time_all_user");
            } else if (prompt[1] == "reset") {
              this._findRoutes(msg, "admin_time_reset");
            } else if (prompt[1]) {
              msg.argsId = prompt[1];
              this._findRoutes(msg, "admin_time_user_by_id");
            }
          }
        }
      });
    } else if (msg.content.startsWith("믫 ") || msg.content.startsWith("!!")) {
      // userMiddleware 사용
      await authenticateUser(msg, async () => {
        const prompt = msg.content.slice(2).trim();
        const cmd = prompt.replace(/\s/g, "");

        if (
          cmd == "help" ||
          cmd == "도움말" ||
          cmd == "도움" ||
          cmd == "사용법" ||
          cmd == "기능" ||
          cmd == "헬프" ||
          cmd == "헲" ||
          cmd == "메뉴얼" ||
          cmd == "가이드" ||
          cmd == "매뉴얼"
        ) {
          this._findRoutes(msg, "help");
        } else if (
          cmd == "channel" ||
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
          cmd == "채널삭제" ||
          cmd == "음성채널삭제" ||
          cmd == "방삭제" ||
          cmd == "보이스채널삭제"
        ) {
          this._findRoutes(msg, "delete_channel");
        } else if (
          cmd == "color" ||
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
          cmd == "색확인" ||
          cmd == "색보기" ||
          cmd == "색상확인" ||
          cmd == "색깔확인" ||
          cmd == "색상보기" ||
          cmd == "색깔확인" ||
          cmd == "현재색" ||
          cmd == "현재색깔" ||
          cmd == "현재색상" ||
          cmd == "지금색" ||
          cmd == "지금색상" ||
          cmd == "지금색깔"
        ) {
          this._findRoutes(msg, "get_color");
        } else if (
          cmd == "game" ||
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
        } else if (
          cmd == "ayou" ||
          cmd == "아유" ||
          cmd == "채팅" ||
          cmd == "챗" ||
          cmd == "대화" ||
          cmd == "아유채팅" ||
          cmd == "아유챗" ||
          cmd == "아유대화" ||
          cmd == "아유야"
        ) {
          this._findRoutes(msg, "check_chat_with_ayou");
        } else if (
          cmd == "이모지" ||
          cmd == "emoji" ||
          cmd == "확대" ||
          cmd == "이모지확대" ||
          cmd == "돋보기"
        ) {
          this._findRoutes(msg, "expand_emoji");
        }
      });
    } else if (msg.content.startsWith("아유야 ")) {
      // userMiddleware 사용
      await authenticateUser(msg, async () => {
        const prompt = msg.content.slice(4).trim();
        if (prompt.length > 1) {
          msg.argsPrompt = prompt;
          this._findRoutes(msg, "chat_with_ayou");
        }
      });
    }
  }
}

module.exports = MsgCommandRoutes;
