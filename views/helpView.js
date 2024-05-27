const { EmbedBuilder } = require("discord.js");

class HelpView {
  constructor(msg) {
    this.msg = msg;
  }

  async sendEmbededMsg() {
    const embed = new EmbedBuilder()
      .setColor(0xf14966)
      .setTitle("❓ 도움말")
      .setFooter({
        text: "그럴수 있지",
        iconURL: "https://imgur.com/ARl3roS.png",
      })
      .setDescription(
        `
        아유봇 v5.0.0
        아유서버에 여러 편의 기능을 제공해줍니다.
        `
      )
      .addFields(
        {
          name: "**일반 명령어**",
          value:
            "도움말 : 도움말을 봅니다.\n코로나 <도시이름> : 현재 코로나19의 상황을 확인합니다.\n색 <색깔> : 닉네임을 해당 색으로 변경합니다.",
        },
        {
          name: "**유틸 명령어**",
          value:
            "투표 [투표 제목] : [투표 제목]에 대한 투표를 생성합니다.\n노래 [노래 제목 or URL] : 해당 노래를 재생합니다.\n``노래 기능은 버그가 있을 수 있습니다. 버그 확인 시 제보 부탁드립니다.``",
        },
        {
          name: "**계산 기능**",
          value:
            "[수식] = : [수식]을 쓴 뒤 =(등호)를 맨 뒤에 붙이면 [수식]에 대한 결과를 보여줍니다.",
        }
      );

    await this.msg.reply({ embeds: [embed] });
  }
}

module.exports = HelpView;
