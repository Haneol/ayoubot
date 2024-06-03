const colorController = require("../controllers/colorController");
const colorView = require("../views/colorView");

class ButtonInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {
    if (interaction.customId === "open_color_modal") {
      await colorView.sendColorChangedModal(interaction);
    } else if (interaction.customId === "delete_color") {
      await colorController.deleteColor(interaction);
    }
  }
}

module.exports = ButtonInteractionEvent;
