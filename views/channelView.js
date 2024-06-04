const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

exports.sendChannelEmbededMsg = async (msg) => {
  // 버튼 추가
  const button = new ButtonBuilder()
    .setCustomId("channel_create_button")
    .setLabel("채널 생성")
    .setStyle(ButtonStyle.Primary);

  const button2 = new ButtonBuilder()
    .setCustomId("private_channel_create_button")
    .setLabel("비밀 채널 관리")
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder()
    .addComponents(button)
    .addComponents(button2);

  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("음성 채널 생성")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
      임시 음성 채널을 생성하려면 아래 버튼을 눌러주세요!
      생성된 채널에 아무도 존재하지 않으면 **자동으로 삭제**됩니다.
      생성 가능한 채널은 두 종류가 있습니다.
    `
    )
    .addFields(
      {
        name: "공개 채널",
        value: "제한없이 생성할 수 있는 공개 음성채널입니다.",
      },
      {
        name: "비밀 채널",
        value:
          "전용 채널입니다. 채널을 생성한 사람이 관리자가 되며,\n원하는 사람을 초대할 수 있습니다.",
      }
    );

  await msg.reply({
    embeds: [embed],
    components: [row],
  });
};

exports.sendCreateChannelModal = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("channel_modal")
    .setTitle("공개 채널 생성");

  const input = new TextInputBuilder()
    .setCustomId("channel_create_input")
    .setLabel("생성할 채널 이름을 입력해주세요.")
    .setMaxLength(20)
    .setStyle(TextInputStyle.Short);

  const row = new ActionRowBuilder().addComponents(input);

  modal.addComponents(row);

  await interaction.showModal(modal);
};

exports.sendChannelCreatedEmbededMsg = async (interaction, channelName) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("공개채널 생성 완료")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(`공개 채널 **${channelName}**이 생성되었습니다!`);

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

exports.sendChannelCreateFailedEmbededMsg = async (
  interaction,
  channelName
) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("공개채널 생성 실패")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(`현재 공개 채널 **${channelName}**이 생성되어 있습니다.`);

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

exports.sendCreatePrivateChannelEmbededMsg = async (interaction) => {};
