const { EmbedBuilder } = require("discord.js");

class AdminView {
  constructor(msg) {
    this.msg = msg;
  }

  async sendEmbededMsg(userName, userRole) {
    const embed = new EmbedBuilder()
      .setColor(0xf14966)
      .setTitle("ADMIN")
      .setFooter({
        text: "administrator command",
        iconURL: "https://imgur.com/ARl3roS.png",
      })
      .setDescription(
        `
        this msg only send to admin.
        `
      )
      .addFields(
        {
          name: "**User Name**",
          value: userName,
        },
        {
          name: "**User Role**",
          value: userRole,
        }
      );

    await this.msg.reply({ embeds: [embed], ephemeral: true });
  }
}

module.exports = AdminView;
