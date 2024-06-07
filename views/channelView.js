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

exports.sendCreatePrivateChannelEmbededMsg = async (interaction, user) => {
  const [fieldName, fieldValue] = infoMsg(user);
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
      name: fieldName,
      value: fieldValue,
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
  const [fieldName, fieldValue] = infoMsg(user);
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
      name: fieldName,
      value: fieldValue,
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
  const [fieldName, fieldValue] = infoMsg(user);
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
      name: fieldName,
      value: fieldValue,
    });

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

exports.sendPrivateChannelManageFailedEmbededMsg = async (
  interaction,
  content
) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 비밀채널 관리 실패")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(content);

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

exports.sendPrivateChannelManageEmbededMsg = async (
  interaction,
  newChannelName,
  content
) => {
  if (!content) content = "초대된 유저가 없어요!";
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle(`${newChannelName} 채널 관리`)
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
      ## 해당 채널에 유저를 추가 또는 제외하기
      1. 추가하려는 유저를 찾아 우클릭한 후
      2. [앱] → [유저 초대]를 눌러주세요.
      `
    )
    .addFields({
      name: "현재 초대된 유저",
      value: content,
    })
    .setImage("https://i.imgur.com/Bw92ol6.png");

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

function infoMsg(user) {
  switch (user.Role.roleName) {
    case "MEMBER":
      return [
        `현재 남은 횟수 : ${user.countCreateChannel}/${user.Role.maxChannel}`,
        `등급 : ${userRoleString.member}`,
      ];
    case "VIP":
      return [
        `현재 남은 횟수 : ${user.countCreateChannel}/${user.Role.maxChannel}`,
        `등급 : ${userRoleString.vip}`,
      ];
    case "VVIP":
      return [
        `제한없이 즐기세요 : ${user.countCreateChannel}`,
        `등급 : ${userRoleString.vvip}`,
      ];
    case "ADMIN":
      return [`제한없이 즐기세요 : ${user.countCreateChannel}`, `등급 : ADMIN`];
      break;
  }
}
