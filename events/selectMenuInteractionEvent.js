const channelController = require("../controllers/channelController");

class SelectMenuInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {}
}

module.exports = SelectMenuInteractionEvent;
