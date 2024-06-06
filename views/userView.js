const { EmbedBuilder } = require("discord.js");
const { adminChannelId } = require("../channelId.json");

exports.sendEmbededMsg = async (client, content) => {
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("User Count")
    .setFooter({
      text: "user command",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(content);

  const r_channel = client.channels.cache.get(adminChannelId);

  await r_channel.send({ embeds: [embed], ephemeral: true });
};
