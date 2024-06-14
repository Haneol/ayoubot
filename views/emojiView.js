const { EmbedBuilder } = require("discord.js");

exports.sendEmbededMsg = async (msg, content) => {
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🔎 이모지 돋보기")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(content);

  await msg.reply({ embeds: [embed], ephemeral: true });
};

exports.sendEmojiEmbededMsg = async (msg, emojiUrl) => {
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setImage(emojiUrl)
    .setFooter({
      text: msg.author.displayName,
      iconURL: msg.author.displayAvatarURL(),
    });

  await msg.reply({ embeds: [embed] });
};
