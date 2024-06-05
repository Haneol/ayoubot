const fs = require("fs");
const colorView = require("../views/colorView");
const { askClaude } = require("../utils/claudeUtil");
const userRepository = require("../repositories/userRepository");

exports.run = async (msg) => {
  const roleName = msg.author.username;
  let role = msg.guild.roles.cache.find((role) => role.name === roleName);

  await colorView.sendCurrentColorEmbededMsg(msg, role.color);
};

exports.changeColorRequest = async (interaction) => {
  const user = await userRepository.getUserByName(interaction.member.id);

  if (
    user.Role.roleName === "ADMIN" ||
    user.Role.roleName === "VVIP" ||
    user.countColor < user.Role.maxColor
  ) {
    await colorView.sendColorChangedModal(interaction);
  } else {
    await colorView.sendColorFailedBecauseOfCountEmbededMsg(interaction, user);
  }
};

exports.changeColor = async (interaction) => {
  const inputValue = interaction.fields.getTextInputValue("color_modal_input");

  let hexcode;
  if (inputValue.startsWith("#")) {
    hexcode = inputValue.slice(1);

    hexcode = hexcode.replace(/[^0-9A-Fa-f]/g, "");

    if (hexcode.length === 7) {
      hexcode = hexcode.slice(0, 6);
    } else if (hexcode.length >= 8) {
      hexcode = hexcode.slice(2, 8);
    }

    hexcode = hexcode.padEnd(6, "0");
    hexcode = "#" + hexcode;
  } else {
    // colorPrompt.txt 파일 읽기
    const systemPrompt = fs.readFileSync("prompts/colorPrompt.txt", "utf-8");

    await askClaude(systemPrompt, inputValue)
      .then((response) => {
        hexcode = response;
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }

  const roleName = interaction.user.username;
  await interaction.guild.roles.cache
    .find((role) => role.name === roleName)
    .setColor(hexcode)
    .then(async () => {
      await userRepository.incrementUserCountColor(interaction.ayouUser);

      const user = await userRepository.getUserByName(interaction.member.id);
      await colorView.sendColorChangedEmbededMsg(interaction, hexcode, user);
    })
    .catch(console.error);
};

exports.deleteColor = async (interaction) => {
  const roleName = interaction.user.username;
  await interaction.guild.roles.cache
    .find((role) => role.name === roleName)
    .setColor(0)
    .then(colorView.sendColorDeletedEmbededMsg(interaction))
    .catch(console.error);
};
