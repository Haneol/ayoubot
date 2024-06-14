const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

// 아유봇 버전 명시
const ayouVersion = "v5.2.0";

exports.sendEmbededMsg = async (channel) => {
  // 버튼 추가
  const button = [
    new ButtonBuilder()
      .setCustomId("channel_create_button")
      .setLabel("채널 생성")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("private_channel_create_button")
      .setLabel("비밀 채널 관리")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("open_color_modal")
      .setLabel("색상 변경")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("delete_color")
      .setLabel("색상 지우기")
      .setStyle(ButtonStyle.Danger),
  ];

  const button2 = [
    new ButtonBuilder()
      .setCustomId("game_toggle_button")
      .setLabel("게임 변경")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("delete_game")
      .setLabel("게임 채널 나가기")
      .setStyle(ButtonStyle.Danger),
  ];

  const row = new ActionRowBuilder().addComponents(button);
  const row2 = new ActionRowBuilder().addComponents(button2);
  const timestamp = Math.floor(Date.now() / 1000);
  //임베딩 추가
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("❓ 도움말")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
        아유봇 ${ayouVersion} <t:${timestamp}:R>
        아유서버에 여러 편의 기능을 제공해줍니다.

        믫 또는 !!로 명령어를 실행할 수 있습니다. e.g. 믫 채널, !!채널
        전체 명령어는 아래를 참고하세요.

        또는 도움말 메시지 하단의 버튼을 눌러 기능을 실행할 수 있습니다.
        `
    )
    .addFields(
      {
        name: "**믫 채널**",
        value: "공개 또는 비밀 음성 채널을 생성할 수 있습니다.",
      },
      {
        name: "**믫 색**",
        value: "닉네임 색을 변경할 수 있습니다.",
      },
      {
        name: "**믫 게임**",
        value: "게임 역할을 설정하고, 게임 채널을 볼 수 있습니다.",
      },
      {
        name: "**믫 대화**",
        value: "아유봇과 대화를 얼마나 할 수 있는지 확인합니다.",
      },
      {
        name: "**아유야 [대화]**",
        value: "아유봇과 대화를 할 수 있습니다.",
      }
    );

  await channel.send({ embeds: [embed], components: [row, row2] });
};

exports.sendHelpEmbededMsg = async (msg) => {
  //임베딩 추가
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("❓ 도움말")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
        아유봇 ${ayouVersion}
        아유서버에 여러 편의 기능을 제공해줍니다.

        믫 또는 !!로 명령어를 실행할 수 있습니다. e.g. 믫 채널, !!채널
        전체 명령어는 아래를 참고하세요.
        `
    )
    .addFields(
      {
        name: "**믫 채널**",
        value: "공개 또는 비밀 음성 채널을 생성할 수 있습니다.",
      },
      {
        name: "**믫 색**",
        value: "닉네임 색을 변경할 수 있습니다.",
      },
      {
        name: "**믫 게임**",
        value: "게임 역할을 설정하고, 게임 채널을 볼 수 있습니다.",
      },
      {
        name: "**믫 대화**",
        value: "아유봇과 대화를 얼마나 할 수 있는지 확인합니다.",
      },
      {
        name: "**아유야 [대화]**",
        value: "아유봇과 대화를 할 수 있습니다.",
      }
    );

  await msg.reply({ embeds: [embed], ephemeral: true });
};
