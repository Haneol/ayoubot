const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const MsgCommandRoutes = require("./routes/msgCommandRoutes");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "그럴 수 있지..." }],
    status: "online",
  });
});

const msgCommandRoutes = new MsgCommandRoutes();
client.on(Events.MessageCreate, async (msg) => msgCommandRoutes.routes(msg));

client.login(token);
