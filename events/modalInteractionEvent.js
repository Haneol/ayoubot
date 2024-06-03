const colorController = require("../controllers/colorController");

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
    }
  }
}

module.exports = ModalInteractionEvent;
