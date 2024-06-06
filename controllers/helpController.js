const { ayouRemoteControllerId } = require("../channelId.json");
const helpView = require("../views/helpView");

exports.run = async (client) => {
  const r_channel = client.channels.cache.get(ayouRemoteControllerId);

  await r_channel
    .bulkDelete(5)
    .then((msg) => console.log(`Bulk deleted ${msg.size} messages`))
    .catch(console.error);

  await helpView.sendEmbededMsg(r_channel);
};

exports.help = async (msg) => {
  await helpView.sendHelpEmbededMsg(msg);
};
