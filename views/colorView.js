const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
} = require("discord.js");
const { createColorImage } = require("../utils/createColorImage");
const userRoleString = require("../utils/stringUtil");

exports.sendCurrentColorEmbededMsg = async (msg, color) => {
  // 버튼 추가
  const button = new ButtonBuilder()
    .setCustomId("open_color_modal")
    .setLabel("색상 변경")
    .setStyle(ButtonStyle.Primary);

  const button2 = new ButtonBuilder()
    .setCustomId("delete_color")
    .setLabel("색상 지우기")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder()
    .addComponents(button)
    .addComponents(button2);

  // 임베드 메시지 생성
  if (color != 0) {
    color = "#" + color.toString(16).padStart(6, "0");

    const colorImage = await createColorImage(color);

    const embed = new EmbedBuilder()
      .setColor(0xf14966)
      .setTitle("💜 색상 변경")
      .setFooter({
        text: "그럴 수 있지",
        iconURL: "https://imgur.com/ARl3roS.png",
      })
      .setDescription(
        `
        현재 색상은 **${color}**입니다.
        색상 변경을 하려면 아래 버튼을 누르고 색을 입력해주세요!
        입력 방법은 다음과 같습니다.
            `
      )
      .addFields(
        {
          name: "Hex 코드",
          value: "#FF0000과 같이 입력",
        },
        {
          name: "색 입력",
          value: "'빨간색'과 같이 입력. 또는 '여름바다'과 같이 추상적으로 입력",
        }
      )
      .setThumbnail("attachment://color.png");

    await msg.reply({
      embeds: [embed],
      files: [colorImage],
      components: [row],
    });
  } else {
    const embed = new EmbedBuilder()
      .setColor(0xf14966)
      .setTitle("💜 색상 변경")
      .setFooter({
        text: "그럴 수 있지",
        iconURL: "https://imgur.com/ARl3roS.png",
      })
      .setDescription(
        `
        현재 색상이 존재하지 않습니다.
        색상 변경을 하려면 아래 버튼을 누르고 색을 입력해주세요!
        입력 방법은 다음과 같습니다.
        `
      )
      .addFields(
        {
          name: "Hex 코드",
          value: "#FF0000과 같이 입력",
        },
        {
          name: "색 입력",
          value: "'빨간색'과 같이 입력. 또는 '여름바다'과 같이 추상적으로 입력",
        }
      );

    await msg.reply({ embeds: [embed], components: [row] });
  }
};

exports.sendColorChangedEmbededMsg = async (interaction, color, user) => {
  const [fieldName, fieldValue] = infoMsg(user);

  const colorImage = await createColorImage(color);

  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("✅ 색상 변경 완료")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
    **${color}** 색상으로 변경하였습니다.
        `
    )
    .addFields({
      name: fieldName,
      value: fieldValue,
    })
    .setThumbnail("attachment://color.png");

  await interaction.reply({
    embeds: [embed],
    files: [colorImage],
    ephemeral: true,
  });
};

exports.sendColorChangedModal = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("color_modal")
    .setTitle("색상 변경");

  const input = new TextInputBuilder()
    .setCustomId("color_modal_input")
    .setLabel("변경할 색을 입력해주세요")
    .setMaxLength(20)
    .setStyle(TextInputStyle.Short);

  const row = new ActionRowBuilder().addComponents(input);

  modal.addComponents(row);

  await interaction.showModal(modal);
};

exports.sendColorDeletedEmbededMsg = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("✅ 색상 지우기 완료")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription("색상을 지웠습니다.");

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

exports.sendColorFailedBecauseOfCountEmbededMsg = async (interaction, user) => {
  const [fieldName, fieldValue] = infoMsg(user);
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 색상 변경 실패")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription("변경 한계에 도달하였습니다.")
    .addFields({
      name: fieldName,
      value: fieldValue,
    });

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

function infoMsg(user) {
  switch (user.Role.roleName) {
    case "MEMBER":
      return [
        `현재 남은 횟수 : ${user.countColor}/${user.Role.maxColor}`,
        `등급 : ${userRoleString.member}`,
      ];
    case "VIP":
      return [
        `현재 남은 횟수 : ${user.countColor}/${user.Role.maxColor}`,
        `등급 : ${userRoleString.vip}`,
      ];
    case "VVIP":
      return [
        `제한없이 즐기세요 : ${user.countColor}`,
        `등급 : ${userRoleString.vvip}`,
      ];
    case "ADMIN":
      return [`제한없이 즐기세요 : ${user.countColor}`, `등급 : ADMIN`];
      break;
  }
}
