const channelController = require("../controllers/channelController");

class SelectMenuInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {
    if (interaction.customId === "channel_invite_user_select") {
      await channelController.managePrivateVoiceChannel(interaction);
    }
  }
}

module.exports = SelectMenuInteractionEvent;
