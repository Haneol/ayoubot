const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

exports.sendGameInfoEmbededMsg = async (msg) => {
  // 버튼 추가
  const button = new ButtonBuilder()
    .setCustomId("game_toggle_button")
    .setLabel("게임 변경")
    .setStyle(ButtonStyle.Primary);

  const button2 = new ButtonBuilder()
    .setCustomId("delete_game")
    .setLabel("게임 채널 나가기")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder()
    .addComponents(button)
    .addComponents(button2);

  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("게임 역할 변경")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
        게임 역할을 설정하거나, 또는 변경하려면 아래 버튼을 눌러주세요!
        하나 이상의 게임 역할이 설정된 경우 **게임 채널**을 볼 수 있습니다.
      `
    )
    .setThumbnail("https://i.imgur.com/Z2PqwEx.jpeg");

  await msg.reply({
    embeds: [embed],
    components: [row],
  });
};

exports.sendChangeGameEmbededMsg = async (interaction, buttons, flag) => {
  const row = new ActionRowBuilder().addComponents(buttons);

  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("게임 역할 변경")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
          아래 토글 버튼을 눌러 게임 역할을 선택하세요!
          *초록색* : 역할 부여, *회색* : 역할 없음
        `
    );

  if (!flag) {
    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  } else {
    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  }
};

exports.sendGameDeletedEmbededMsg = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("게임 역할 초기화")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription("게임 채널에서 나갔습니다.");

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};
