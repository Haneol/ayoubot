const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const logger = require("../utils/logger");

exports.run = async (client) => {
  try {
    logger.info("Registering commands...");

    // 슬래시 명령어 등록
    const slashCommands = [
      new SlashCommandBuilder()
        .setName("도움말")
        .setDescription("아유봇에 대한 도움말을 확인합니다."),
      new SlashCommandBuilder()
        .setName("채널")
        .setDescription("공개 음성 채널을 생성합니다."),
      new SlashCommandBuilder()
        .setName("비밀채널")
        .setDescription("비밀 음성 채널을 생성합니다."),
      new SlashCommandBuilder()
        .setName("색확인")
        .setDescription("현재 적용된 닉네임 색상을 확인합니다."),
      new SlashCommandBuilder()
        .setName("색변경")
        .setDescription("닉네임 색상을 변경합니다."),
      new SlashCommandBuilder()
        .setName("색지우기")
        .setDescription("닉네임 색상을 초기화합니다."),
      new SlashCommandBuilder()
        .setName("게임")
        .setDescription("게임 역할을 설정합니다."),
      new SlashCommandBuilder()
        .setName("게임지우기")
        .setDescription("게임 역할을 모두 지우고 게임 채널을 나갑니다."),
      new SlashCommandBuilder()
        .setName("대화")
        .setDescription("아유봇과의 대화 횟수를 확인합니다."),
      new SlashCommandBuilder()
        .setName("돋보기")
        .setDescription("커스텀 이모지 확대기능을 토글(on/off)합니다."),
    ];

    // 컨텍스트 메뉴 명령어 등록
    const contextMenuCommand = new ContextMenuCommandBuilder()
      .setName("유저 초대")
      .setType(ApplicationCommandType.User);

    await client.application.commands.set([
      ...slashCommands.map((command) => command.toJSON()),
      contextMenuCommand.toJSON(),
    ]);

    logger.info("Commands registered successfully!");
  } catch (error) {
    logger.error("Error registering commands:", error);
  }
};
