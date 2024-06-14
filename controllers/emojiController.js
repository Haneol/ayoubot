const logger = require("../utils/logger");
const emojiView = require("../views/emojiView");

exports.emojiToggle = {};

exports.run = async (msg) => {
  let content = "";
  if (this.emojiToggle[msg.author.id]) {
    this.emojiToggle[msg.author.id] = false;
    content = "🔴 이모지 확대 기능이 꺼졌어요.";
  } else {
    this.emojiToggle[msg.author.id] = true;
    content = "🟢 이모지 확대 기능이 켜졌어요.";
  }

  await emojiView.sendEmbededMsg(msg, content);
};

exports.runWithInteraction = async (interaction) => {
  let content = "";
  if (this.emojiToggle[interaction.member.id]) {
    this.emojiToggle[interaction.member.id] = false;
    content = "🔴 이모지 확대 기능이 꺼졌어요.";
  } else {
    this.emojiToggle[interaction.member.id] = true;
    content = "🟢 이모지 확대 기능이 켜졌어요.";
  }

  await emojiView.sendEmbededMsg(interaction, content);
};

exports.bigEmoji = async (msg, emojiId) => {
  const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`;

  await emojiView.sendEmojiEmbededMsg(msg, emojiUrl);
};
