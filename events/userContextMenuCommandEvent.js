const channelController = require("../controllers/channelController");
const logger = require("../utils/logger");

class UserContextMenuCommandEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {
    if (interaction.commandName === "유저 초대") {
      logger.info(
        `${interaction.user.displayName}님이 비밀채널에 ${interaction.targetUser.displayName}를 초대했습니다.`
      );
      await channelController.managePrivateVoiceChannel(interaction);
    }
  }
}

module.exports = UserContextMenuCommandEvent;
