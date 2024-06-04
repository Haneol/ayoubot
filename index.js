const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const cron = require("node-cron");
const MsgCommandRoutes = require("./routes/msgCommandRoutes");
const { sequelize, initializeDatabase } = require("./config/database");
const ButtonInteractionEvent = require("./events/buttonInteractionEvent");
const ModalInteractionEvent = require("./events/modalInteractionEvent");
const VoiceStateUpdateInteractionEvent = require("./events/voiceStateUpdateInteractionEvent");
const todayController = require("./controllers/todayController");
const { channels } = require("./controllers/channelController");

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

  cron.schedule(
    "0 8 * * *",
    () => {
      todayController.run(client);
    },
    {
      scheduled: true,
      timezone: "Asia/Seoul",
    }
  );
});

const msgCommandRoutes = new MsgCommandRoutes();
const buttonInteractionEvent = new ButtonInteractionEvent();
const modalInteractionEvent = new ModalInteractionEvent();
const voiceStateUpdateEvent = new VoiceStateUpdateInteractionEvent();

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

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  await voiceStateUpdateEvent.event(oldState, newState);
});

// SIGINT 이벤트 핸들러 (Ctrl+C로 봇 종료 시)
process.on("SIGINT", async () => {
  try {
    console.log("Stop! Ctrl+C");
    await cleanupChannels();
    process.exit();
  } catch (error) {
    console.error("채널 삭제 중 오류 발생:", error);
    process.exit(1);
  }
});

// uncaughtException 이벤트 핸들러 (예기치 않은 에러로 봇 종료 시)
process.on("uncaughtException", async (error) => {
  console.error("예기치 않은 에러 발생:", error);
  try {
    console.log("Stop! uncaughtException");
    await cleanupChannels();
    process.exit(1);
  } catch (error) {
    console.error("채널 삭제 중 오류 발생:", error);
    process.exit(1);
  }
});

// 채널 정리 함수
async function cleanupChannels() {
  try {
    // 모든 길드에서 channels 객체에 있는 채널 삭제
    for (const guild of client.guilds.cache.values()) {
      for (const channelName in channels) {
        const channelId = channels[channelName].id;
        const channel = guild.channels.cache.get(channelId);
        if (channel) {
          await channel.delete();
        }
      }
    }
    // channels 객체 초기화
    exports.channels = {};
  } catch (error) {
    console.error("채널 삭제 중 오류 발생:", error);
  }
}

client.login(token);
