const { ChannelType } = require("discord.js");
const channelView = require("../views/channelView");
const { voiceChannelCategoryId } = require("../channelId.json");
const userRepository = require("../repositories/userRepository");

exports.channels = {};

exports.run = async (msg) => {
  await channelView.sendChannelEmbededMsg(msg);
};

exports.createChannelRequest = async (interaction) => {
  const channelName = isChannelCreatedBy(interaction, this.channels);
  const user = await userRepository.getUserByName(interaction.member.id);

  console.log(channelName);
  if (user.Role.roleName === "ADMIN" || channelName == null) {
    await channelView.sendCreateChannelModal(interaction);
  } else {
    await channelView.sendChannelCreateFailedEmbededMsg(
      interaction,
      channelName
    );
  }
};

exports.createChannel = async (interaction) => {
  const channelName = interaction.fields.getTextInputValue(
    "channel_create_input"
  );

  const isExist = isChannelCreated(this.channels, channelName);

  if (isExist) {
    await channelView.sendChannelCreateFailedEmbededMsg(
      interaction,
      channelName
    );
  } else {
    const isCreated = await createVoiceChannel(interaction.guild, channelName);
    if (isCreated) {
      const channel = interaction.guild.channels.cache.find(
        (channel) => channel.name === channelName
      );

      this.channels[channelName] = {
        id: channel.id,
        createdAt: Date.now(),
        createdBy: interaction.member.id,
        members: {},
        deleteTimer: setTimeout(async () => {
          if (channel.members.size === 0) {
            await channel.delete();
            delete this.channels[channelName];
          }
        }, 30000),
      };

      await channelView.sendChannelCreatedEmbededMsg(interaction, channelName);
    }
  }
};

async function createVoiceChannel(guild, channelName) {
  try {
    await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildVoice,
      parent: voiceChannelCategoryId,
    });
    return true;
  } catch (error) {
    console.error("음성 채널 생성 중 오류 발생:", error);
    return false;
  }
}

function isChannelCreatedBy(interaction, chn) {
  const userId = interaction.member.id;
  for (const channelName in chn) {
    if (chn[channelName].createdBy === userId) {
      return channelName;
    }
  }
  return null;
}

function isChannelCreated(chn, inputValue) {
  for (const channelName in chn) {
    if (inputValue === channelName) {
      return true;
    }
  }
  return false;
}
