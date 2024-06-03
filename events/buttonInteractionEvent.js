const colorController = require("../controllers/colorController");
const gameController = require("../controllers/gameController");
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
    } else if (interaction.customId === "game_toggle_button") {
      await gameController.changeGame(interaction);
    } else if (interaction.customId === "delete_game") {
      await gameController.deleteGame(interaction);
    } else if (interaction.customId === "game_toggle_button_lostark") {
      await gameController.changeGame(interaction, 1);
    } else if (interaction.customId === "game_toggle_button_leagueoflegend") {
      await gameController.changeGame(interaction, 2);
    } else if (interaction.customId === "game_toggle_button_overwatch") {
      await gameController.changeGame(interaction, 3);
    } else if (interaction.customId === "game_toggle_button_steam") {
      await gameController.changeGame(interaction, 4);
    } else if (interaction.customId === "game_toggle_button_minecraft") {
      await gameController.changeGame(interaction, 5);
    }
  }
}

module.exports = ButtonInteractionEvent;