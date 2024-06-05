const { EmbedBuilder } = require("discord.js");
const { adminChannelId } = require("../channelId.json");
const stringUtil = require("../utils/stringUtil");

exports.sendEmbededMsg = async (msg, content) => {
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("ADMIN")
    .setFooter({
      text: "administrator command",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(content);

  const r_channel = msg.client.channels.cache.get(adminChannelId);

  await r_channel.send({ embeds: [embed], ephemeral: true });
};

exports.sendDM = async (user, prevRole, curRole) => {
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("등급 변경")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `${roleName(prevRole)}에서 ${roleName(curRole)}로 변경되었습니다!`
    );

  await user.send({ embeds: [embed], ephemeral: true });
};

function roleName(role) {
  switch (role) {
    case "MEMBER":
      return stringUtil.member;
    case "VIP":
      return stringUtil.vip;
    case "VVIP":
      return stringUtil.vvip;
  }
}
