const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const userRoleString = require("../utils/stringUtil");

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
    .setTitle("📡 음성 채널 생성")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
      임시 음성 채널을 생성하려면 아래 버튼을 눌러주세요!
      생성된 채널에 아무도 존재하지 않으면 **자동으로 삭제**됩니다.

      생성 가능한 채널은 두 종류가 있으며, 어떠한 채널이든 1인 1채널만 생성 가능합니다.
    `
    )
    .addFields(
      {
        name: "공개 채널",
        value: "제한없이 생성할 수 있는 공개 음성채널입니다.",
      },
      {
        name: `비밀 채널`,
        value:
          "비공개 전용 채널입니다.\n채널을 생성한 사람이 관리자가 되며, 원하는 사람을 초대할 수 있습니다.\n비밀 채널이 **생성된 상태**에서, 비밀 채널 관리 버튼을 한번 더 누르면 다른 유저를 초대할 수 있습니다.",
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
    .setTitle("📡 공개 채널 생성");

  const input = new TextInputBuilder()
    .setCustomId("channel_create_input")
    .setLabel("생성할 채널 이름을 입력해주세요.")
    .setMaxLength(20)
    .setStyle(TextInputStyle.Short);

  const row = new ActionRowBuilder().addComponents(input);

  modal.addComponents(row);

  await interaction.showModal(modal);
};

exports.sendCreatePrivateChannelEmbededMsg = async (interaction, user) => {
  let titleInfoMsg;
  let infoMsg;
  // 초기화까지 며칠 남았는지 체크하는거 추가하기
  switch (user.Role.roleName) {
    case "MEMBER":
      titleInfoMsg = `현재 남은 횟수 : ${user.countCreateChannel}/${user.Role.maxChannel}`;
      infoMsg = `등급 : ${userRoleString.member}`;
      break;
    case "VIP":
      titleInfoMsg = `현재 남은 횟수 : ${user.countCreateChannel}/${user.Role.maxChannel}`;
      infoMsg = `등급 : ${userRoleString.vip}`;
      break;
    case "VVIP":
      titleInfoMsg = `제한없이 즐기세요 : ${user.countCreateChannel}`;
      infoMsg = `등급 : ${userRoleString.vvip}`;
      break;
    case "ADMIN":
      infoMsg = `${user.countCreateChannel}/∞\nADMIN`;
      break;
  }
  // 버튼 추가
  const button = new ButtonBuilder()
    .setCustomId("private_channel_create_confirm_button")
    .setLabel("채널 생성")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🔐 비밀 채널 생성")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
      임시 비밀 음성 채널을 생성하려면 아래 버튼을 눌러주세요!
      생성된 채널에 아무도 존재하지 않으면 **자동으로 삭제**됩니다.

      비밀 채널생성 횟수는 한달마다 초기화 됩니다.
      비밀 채널생성 횟수를 늘리려면, ${userRoleString.vip} 또는 ${userRoleString.vvip}로 업그레이드 하세요!
    `
    )
    .addFields({
      name: titleInfoMsg,
      value: infoMsg,
    });

  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true,
  });
};

exports.sendChannelCreatedEmbededMsg = async (interaction, channelName) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("✅ 공개채널 생성 완료")
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
    .setTitle("🚫 공개채널 생성 실패")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(`현재 채널 **${channelName}**이 생성되어 있습니다.`);

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

exports.sendChannelCreateFailedEmbededBecauseOfEmojiMsg = async (
  interaction
) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 공개채널 생성 실패")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription("해당 이름은 공개채널 이름으로 사용할 수 없습니다.");

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

exports.sendPrivateChannelCreatedEmbededMsg = async (interaction, user) => {
  let titleInfoMsg;
  let infoMsg;
  // 초기화까지 며칠 남았는지 체크하는거 추가하기
  switch (user.Role.roleName) {
    case "MEMBER":
      titleInfoMsg = `현재 남은 횟수 : ${user.countCreateChannel}/${user.Role.maxChannel}`;
      infoMsg = `등급 : ${userRoleString.member}`;
      break;
    case "VIP":
      titleInfoMsg = `현재 남은 횟수 : ${user.countCreateChannel}/${user.Role.maxChannel}`;
      infoMsg = `등급 : ${userRoleString.vip}`;
      break;
    case "VVIP":
      titleInfoMsg = `제한없이 즐기세요 : ${user.countCreateChannel}`;
      infoMsg = `등급 : ${userRoleString.vvip}`;
      break;
    case "ADMIN":
      infoMsg = `${user.countCreateChannel}/∞\nADMIN`;
      break;
  }
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle(`✅ ${interaction.member.user.globalName}님의 비밀채널 생성 완료`)
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      "비밀채널이 생성되었습니다.\n비밀 채널 관리 버튼을 한번 더 눌러 유저를 초대하세요!"
    )
    .addFields({
      name: titleInfoMsg,
      value: infoMsg,
    });

  await interaction.update({
    embeds: [embed],
    components: [],
    ephemeral: true,
  });
};

exports.sendPrivateChannelCreateFailedBecauseOfCountEmbededMsg = async (
  interaction,
  user
) => {
  let titleInfoMsg;
  let infoMsg;
  // 초기화까지 며칠 남았는지 체크하는거 추가하기
  switch (user.Role.roleName) {
    case "MEMBER":
      titleInfoMsg = `현재 남은 횟수 : ${user.countCreateChannel}/${user.Role.maxChannel}`;
      infoMsg = `등급 : ${userRoleString.member}`;
      break;
    case "VIP":
      titleInfoMsg = `현재 남은 횟수 : ${user.countCreateChannel}/${user.Role.maxChannel}`;
      infoMsg = `등급 : ${userRoleString.vip}`;
      break;
    case "VVIP":
      titleInfoMsg = `제한없이 즐기세요 : ${user.countCreateChannel}`;
      infoMsg = `등급 : ${userRoleString.vvip}`;
      break;
    case "ADMIN":
      infoMsg = `${user.countCreateChannel}/∞\nADMIN`;
      break;
  }
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 비밀채널 생성 실패")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription("생성 한계에 도달하였습니다.")
    .addFields({
      name: titleInfoMsg,
      value: infoMsg,
    });

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

exports.sendPrivateChannelManageEmbededMsg = async (
  interaction,
  newChannelName,
  userOptions
) => {
  // SelectMenu 생성
  const select = new StringSelectMenuBuilder()
    .setCustomId("channel_invite_user_select")
    .setPlaceholder("유저 선택")
    .addOptions(userOptions)
    .setMinValues(0)
    .setMaxValues(Math.min(userOptions.length, 5));

  const row = new ActionRowBuilder().addComponents(select);

  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle(`${newChannelName} 채널 관리`)
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `해당 채널에 유저를 추가하거나 제외하려면\n아래 선택 바에서 유저를 체크/체크해제 해주세요!`
    );

  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true,
  });
};

exports.sendPrivateChannelManageEmbededMsgUpdate = async (
  interaction,
  updatedUserOptions
) => {
  const updatedRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("channel_invite_user_select")
      .setPlaceholder("유저 선택")
      .addOptions(updatedUserOptions)
      .setMinValues(0)
      .setMaxValues(Math.min(updatedUserOptions.length, 5))
  );

  await interaction.update({ components: [updatedRow] });
};
