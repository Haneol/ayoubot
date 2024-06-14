const { Client, Events, GatewayIntentBits } = require("discord.js");
const logger = require("./utils/logger");
const { token } = require("./config.json");
const cron = require("node-cron");

const {
  authenticateUserWithInteraction,
} = require("./middlewares/userMiddleware");

const MsgCommandRoutes = require("./routes/msgCommandRoutes");
const SlashCommandRoutes = require("./routes/slashCommandRoutes");

const { sequelize, initializeDatabase } = require("./config/database");
const slashCommandRegistration = require("./routes/slashCommandRegistration");

const ButtonInteractionEvent = require("./events/buttonInteractionEvent");
const ModalInteractionEvent = require("./events/modalInteractionEvent");
const UserContextMenuCommandEvent = require("./events/userContextMenuCommandEvent");
const SelectMenuInteractionEvent = require("./events/selectMenuInteractionEvent");
const VoiceStateUpdateInteractionEvent = require("./events/voiceStateUpdateInteractionEvent");

const todayController = require("./controllers/todayController");
const helpController = require("./controllers/helpController");
const userController = require("./controllers/userController");

const { channels } = require("./controllers/channelController");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
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

  await slashCommandRegistration.run(client);

  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");

    await initializeDatabase(client);
    await sequelize.sync(); // Model & Database Sync
    logger.info("Database synced");
    await helpController.run(client);
    logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }

  cron.schedule(
    "*/10 8-10 * * *",
    () => {
      todayController.run(client);
      logger.cleanupOldLogFiles();
    },
    {
      scheduled: true,
      timezone: "Asia/Seoul",
    }
  );

  cron.schedule(
    "0 8 1 * *",
    () => {
      userController.run(client);
    },
    {
      scheduled: true,
      timezone: "Asia/Seoul",
    }
  );
});

const msgCommandRoutes = new MsgCommandRoutes();
const slashCommandRoutes = new SlashCommandRoutes();
const buttonInteractionEvent = new ButtonInteractionEvent();
const userContextMenuCommandEvent = new UserContextMenuCommandEvent();
const modalInteractionEvent = new ModalInteractionEvent();
const voiceStateUpdateEvent = new VoiceStateUpdateInteractionEvent();
const selectMenuInteractionEvent = new SelectMenuInteractionEvent();

// 메시지 이벤트 처리
client.on(Events.MessageCreate, async (msg) => {
  try {
    await msgCommandRoutes.routes(msg);
  } catch (error) {
    logger.error("Error handling message:", error);
  }
});

// 상호작용 이벤트 처리
client.on(Events.InteractionCreate, async (interaction) => {
  await authenticateUserWithInteraction(interaction, async () => {
    try {
      if (interaction.isButton())
        await buttonInteractionEvent.event(interaction);
      else if (interaction.isModalSubmit())
        await modalInteractionEvent.event(interaction);
      else if (interaction.isStringSelectMenu())
        await selectMenuInteractionEvent.event(interaction);
      else if (interaction.isChatInputCommand())
        await slashCommandRoutes.routes(interaction);
      else if (interaction.isUserContextMenuCommand())
        await userContextMenuCommandEvent.event(interaction);
    } catch (error) {
      logger.error("Error handling interaction:", error);
    }
  });
});

// 보이스 채널 이벤트 처리
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  await voiceStateUpdateEvent.event(oldState, newState);
});

// SIGINT 이벤트 핸들러 (Ctrl+C로 봇 종료 시)
process.on("SIGINT", async () => {
  try {
    logger.info("Stop! Ctrl+C");
    await cleanupChannels();
    process.exit();
  } catch (error) {
    logger.error("채널 삭제 중 오류 발생:", error);
    process.exit(1);
  }
});

// uncaughtException 이벤트 핸들러 (예기치 않은 에러로 봇 종료 시)
process.on("uncaughtException", async (error) => {
  logger.error("예기치 않은 에러 발생:", error);
  try {
    logger.info("Stop! uncaughtException");
    await cleanupChannels();
    process.exit(1);
  } catch (error) {
    logger.error("채널 삭제 중 오류 발생:", error);
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
    logger.error("채널 삭제 중 오류 발생:", error);
  }
}

client.login(token);
