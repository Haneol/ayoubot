const { EmbedBuilder } = require("discord.js");
const userRoleString = require("../utils/stringUtil");

exports.sendChatFailedEmbededMsg = async (msg, user) => {
  const [fieldName, fieldValue] = infoMsg(user);

  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 대화 불가능")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
    대화 한계에 도달하였습니다.

    대화 횟수는 한달마다 초기화 됩니다.
    대화 횟수를 늘리려면, ${userRoleString.vip} 또는 ${userRoleString.vvip}로 업그레이드 하세요!
    `
    )
    .addFields({
      name: fieldName,
      value: fieldValue,
    });

  await msg.reply({ embeds: [embed] });
};

exports.sendChatFailedBecauseOfRateEmbededMsg = async (msg) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 대화 불가능")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      "현재 요청이 많아 처리에 실패하였습니다. 잠시 후 다시 시도해주세요."
    );

  await msg.reply({ embeds: [embed] });
};

exports.sendChatCountEmbededMsg = async (msg, user) => {
  const [fieldName, fieldValue] = infoMsg(user);

  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("💬 대화 가능 횟수")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `
      대화 횟수는 한달마다 초기화 됩니다.
      대화 횟수를 늘리려면, ${userRoleString.vip} 또는 ${userRoleString.vvip}로 업그레이드 하세요!
      `
    )
    .addFields({
      name: fieldName,
      value: fieldValue,
    });

  await msg.reply({ embeds: [embed], ephemeral: true });
};

function infoMsg(user) {
  switch (user.Role.roleName) {
    case "MEMBER":
      return [
        `현재 남은 횟수 : ${user.countChat}/${user.Role.maxChat}`,
        `등급 : ${userRoleString.member}`,
      ];
    case "VIP":
      return [
        `현재 남은 횟수 : ${user.countChat}/${user.Role.maxChat}`,
        `등급 : ${userRoleString.vip}`,
      ];
    case "VVIP":
      return [
        `현재 남은 횟수 : ${user.countChat}/${user.Role.maxChat}`,
        `등급 : ${userRoleString.vvip}`,
      ];
    case "ADMIN":
      return [`제한없이 즐기세요 : ${user.countChat}`, `등급 : ADMIN`];
  }
}
