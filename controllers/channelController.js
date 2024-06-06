const logger = require("../utils/logger");
const { ChannelType, PermissionFlagsBits } = require("discord.js");
const channelView = require("../views/channelView");
const { voiceChannelCategoryId } = require("../channelId.json");
const userRepository = require("../repositories/userRepository");
const { adminId } = require("../config.json");

exports.channels = {};
exports.privateChannels = {};

exports.run = async (msg) => {
  await channelView.sendChannelEmbededMsg(msg);
};

exports.createChannelRequest = async (interaction) => {
  const channelName = isChannelCreatedBy(interaction, this.channels);

  // 해당 유저가 생성한 채널이 존재하지 않으면
  if (channelName == null) {
    await channelView.sendCreateChannelModal(interaction);
  } else {
    await channelView.sendChannelCreateFailedEmbededMsg(
      interaction,
      channelName
    );
  }
};

exports.createPrivateChannelRequest = async (interaction) => {
  const user = await userRepository.getUserByName(interaction.member.id);
  const channelName = isChannelCreatedBy(interaction, this.channels);

  // 해당 유저가 생성한 비밀 채널이 존재하지 않으면
  if (channelName == null) {
    await channelView.sendCreatePrivateChannelEmbededMsg(interaction, user);
  } else if (channelName.includes("🔐")) {
    const channel = interaction.guild.channels.cache.find(
      (channel) => channel.name === channelName
    );
    await managePrivateChannel(interaction, channelName, channel.id);
  } else {
    const channel = interaction.guild.channels.cache.find(
      (channel) => channel.name === channelName
    );
    if (this.channels[channelName]) {
      if (channel) await channel.delete();
      clearTimeout(this.channels[channelName].deleteTimer);
      delete this.channels[channelName].deleteTimer;
      delete this.channels[channelName];
      logger.info(channelName + " 삭제되었습니다.");
    }
    await channelView.sendCreatePrivateChannelEmbededMsg(interaction, user);
  }
};

exports.createChannel = async (interaction) => {
  const channelName = interaction.fields.getTextInputValue(
    "channel_create_input"
  );

  // 해당 이름의 채널이 존재한다면
  const isExist = isChannelCreated(this.channels, channelName);

  if (isExist) {
    await channelView.sendChannelCreateFailedEmbededMsg(
      interaction,
      channelName
    );
  } else if (channelName.includes("🔐")) {
    await channelView.sendChannelCreateFailedEmbededBecauseOfEmojiMsg(
      interaction
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

exports.createPrivateChannel = async (interaction) => {
  const user = await userRepository.getUserByName(interaction.member.id);
  const newChannelName = `🔐 ${interaction.member.user.globalName}`;

  const isExist = isChannelCreated(this.channels, newChannelName);
  if (!isExist) {
    if (
      user.Role.roleName === "ADMIN" ||
      user.Role.roleName === "VVIP" ||
      user.countCreateChannel < user.Role.maxChannel
    ) {
      const isCreated = await createPrivateVoiceChannel(
        interaction.guild,
        user.userName,
        newChannelName
      );
      if (isCreated) {
        const channel = interaction.guild.channels.cache.find(
          (channel) => channel.name === newChannelName
        );

        this.channels[newChannelName] = {
          id: channel.id,
          createdAt: Date.now(),
          createdBy: interaction.member.id,
          members: {},
          deleteTimer: setTimeout(async () => {
            if (channel.members.size === 0) {
              await channel.delete();
              delete this.channels[newChannelName];
            }
          }, 300000),
        };

        this.privateChannels[interaction.member.id] = {
          id: channel.id,
          members: {},
        };

        await userRepository.incrementUserCountChannel(user.userID);

        const newUser = await userRepository.getUserByName(
          interaction.member.id
        );

        await channelView.sendPrivateChannelCreatedEmbededMsg(
          interaction,
          newUser
        );
      }
    } else {
      await channelView.sendPrivateChannelCreateFailedBecauseOfCountEmbededMsg(
        interaction,
        user
      );
    }
  }
};

exports.managePrivateVoiceChannel = async (interaction) => {
  const selectedUserIds = interaction.values;
  const ownerId = interaction.member.id;
  const channelId = this.privateChannels[ownerId].id;

  // 새로 추가된 사용자에게 역할 부여 및 privateChannels에 추가
  const addedUserIds = selectedUserIds.filter(
    (userId) => !this.privateChannels[ownerId].members[userId]
  );
  const addedMembers = await Promise.all(
    addedUserIds.map((userId) => interaction.guild.members.fetch(userId))
  );

  for (const member of addedMembers) {
    await interaction.guild.channels.cache
      .get(channelId)
      .permissionOverwrites.create(member, {
        ViewChannel: true,
        Connect: true,
      });
    this.privateChannels[ownerId].members[member.id] = true;
  }

  // 리스트에서 제거된 사용자의 권한 제거 및 privateChannels에서 제거
  const removedUserIds = Object.keys(
    this.privateChannels[ownerId].members
  ).filter((userId) => !selectedUserIds.includes(userId));
  const removedMembers = await Promise.all(
    removedUserIds.map((userId) => interaction.guild.members.fetch(userId))
  );
  for (const member of removedMembers) {
    await interaction.guild.channels.cache
      .get(channelId)
      .permissionOverwrites.delete(member);
    delete this.privateChannels[ownerId].members[member.id];
  }

  // 수정 된 userOptions 구현
  const updatedUserOptions =
    interaction.message.components[0].components[0].options.map((option) => {
      const hasPermission =
        this.privateChannels[ownerId]?.members[option.value];
      return {
        ...option,
        default: hasPermission,
      };
    });

  await channelView.sendPrivateChannelManageEmbededMsgUpdate(
    interaction,
    updatedUserOptions
  );
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
    logger.error("음성 채널 생성 중 오류 발생:", error);
    return false;
  }
}

async function createPrivateVoiceChannel(guild, userId, newChannelName) {
  try {
    await guild.channels.create({
      name: newChannelName,
      type: ChannelType.GuildVoice,
      parent: voiceChannelCategoryId,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: userId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.MuteMembers,
            PermissionFlagsBits.DeafenMembers,
            PermissionFlagsBits.MoveMembers,
          ],
          deny: [
            PermissionFlagsBits.ManageRoles,
            PermissionFlagsBits.CreateInstantInvite,
            PermissionFlagsBits.ManageChannels,
          ],
        },
      ],
    });
    return true;
  } catch (error) {
    logger.error("음성 채널 생성 중 오류 발생:", error);
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

async function managePrivateChannel(interaction, channelName, channelId) {
  const guild = interaction.guild;
  const members = await guild.members.fetch();

  const userOptions = members
    .filter(
      (member) =>
        !member.user.bot &&
        member.id !== interaction.member.id &&
        member.id !== adminId
    )
    .map((member) => {
      const hasRole = member
        .permissionsIn(channelId)
        .has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]);

      return {
        label: `${member.user.globalName}(@${member.user.username})`,
        value: member.id,
        default: hasRole,
      };
    });

  await channelView.sendPrivateChannelManageEmbededMsg(
    interaction,
    channelName,
    userOptions
  );
}
