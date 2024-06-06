const { ButtonBuilder, ButtonStyle } = require("discord.js");
const gameView = require("../views/gameView");

exports.run = async (msg) => {
  await gameView.sendGameInfoEmbededMsg(msg);
};

const roleNames = [
  "로스트아크",
  "리그오브레전드",
  "오버워치",
  "스팀게임",
  "마인크래프트",
];

// 버튼 추가
const buttons = [
  new ButtonBuilder()
    .setCustomId("game_toggle_button_lostark")
    .setLabel("로아"),

  new ButtonBuilder()
    .setCustomId("game_toggle_button_leagueoflegend")
    .setLabel("롤"),

  new ButtonBuilder()
    .setCustomId("game_toggle_button_overwatch")
    .setLabel("옵치"),

  new ButtonBuilder().setCustomId("game_toggle_button_steam").setLabel("스팀"),

  new ButtonBuilder()
    .setCustomId("game_toggle_button_minecraft")
    .setLabel("마크"),
];

exports.changeGame = async (interaction, selected) => {
  const user = interaction.user;

  // 현재 역할 상태 (boolean)
  let roles = roleNames.map((roleName) => {
    const isExist = interaction.guild.roles.cache
      .find((role) => role.name === roleName)
      .members.has(user.id);
    if (isExist) {
      return true;
    } else {
      return false;
    }
  });

  roles.forEach((role, inx) => {
    buttons[inx].setStyle(role ? ButtonStyle.Success : ButtonStyle.Secondary);
  });

  if (!selected) {
    await gameView.sendChangeGameEmbededMsg(interaction, buttons, false);
  } else {
    const roleName = roleNames[selected - 1];
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === roleName
    );
    if (buttons[selected - 1].data.style === ButtonStyle.Success) {
      await interaction.member.roles.remove(role);
      buttons[selected - 1].setStyle(ButtonStyle.Secondary);
    } else {
      await interaction.member.roles.add(role);
      buttons[selected - 1].setStyle(ButtonStyle.Success);
    }
    await gameView.sendChangeGameEmbededMsg(interaction, buttons, true);
  }
};

exports.deleteGame = async (interaction) => {
  roleNames.forEach(async (roleName) => {
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === roleName
    );
    await interaction.member.roles.remove(role);
  });
  await gameView.sendGameDeletedEmbededMsg(interaction);
};
