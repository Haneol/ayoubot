const { EmbedBuilder } = require("discord.js");
const { adminChannelId } = require("../channelId.json");

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
