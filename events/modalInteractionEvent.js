const colorController = require("../controllers/colorController");
const channelController = require("../controllers/channelController");

class ModalInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {
    if (interaction.customId === "color_modal") {
      await colorController.changeColor(interaction);
    } else if (interaction.customId === "channel_modal") {
      await channelController.createChannel(interaction);
    }
  }
}

module.exports = ModalInteractionEvent;
