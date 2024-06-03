const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const MsgCommandRoutes = require("./routes/msgCommandRoutes");
const { sequelize, initializeDatabase } = require("./config/database");
const ButtonInteractionEvent = require("./events/buttonInteractionEvent");
const ModalInteractionEvent = require("./events/modalInteractionEvent");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  client.user.setPresence({
    activities: [{ name: "그럴 수 있지..." }],
    status: "online",
  });

  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    await initializeDatabase();
    await sequelize.sync(); // Model & Database Sync
    console.log("Database synced");
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

const msgCommandRoutes = new MsgCommandRoutes();
const buttonInteractionEvent = new ButtonInteractionEvent();
const modalInteractionEvent = new ModalInteractionEvent();

client.on(Events.MessageCreate, async (msg) => {
  try {
    await msgCommandRoutes.routes(msg);
  } catch (error) {
    console.error("Error handling message:", error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isButton()) await buttonInteractionEvent.event(interaction);
    else if (interaction.isModalSubmit())
      await modalInteractionEvent.event(interaction);
  } catch (error) {
    console.error("Error handling interaction:", error);
  }
});

// 보이스채널 감지 로직 -> 수정 필요.
const voiceTime = {};

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
  const member = newState.member;

  if (!oldState.channel && newState.channel) {
    // 사용자가 음성 채널에 입장했을 때
    voiceTime[member.id] = Date.now();
  } else if (oldState.channel && !newState.channel) {
    // 사용자가 음성 채널에서 퇴장했을 때
    if (voiceTime[member.id]) {
      const duration = Date.now() - voiceTime[member.id];
      const hours = Math.floor(duration / 3600000);
      const minutes = Math.floor((duration % 3600000) / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);

      console.log(
        `${member.user.tag} 님이 음성 채널에서 ${hours}시간 ${minutes}분 ${seconds}초 동안 머물렀습니다.`
      );

      delete voiceTime[member.id];
    }
  }
});

client.login(token);
