const voiceTime = {};

const {
  channels,
  createChannelWithNoName,
} = require("../controllers/channelController");
const userRepository = require("../repositories/userRepository");
const logger = require("../utils/logger");
const { voiceCreateChannelId } = require("../channelId.json");

class VoiceStateUpdateInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(oldState, newState) {
    const member = newState.member;
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    if (newChannel && newChannel.id === voiceCreateChannelId) {
      await createChannelWithNoName(newState);
    } else if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
      // 사용자가 채널 간에 이동했을 때
      if (voiceTime[member.id]) {
        const duration = Date.now() - voiceTime[member.id];
        const seconds = Math.floor(duration / 1000);
        userRepository.updateConnectionTime(member.id, seconds);
      }
      voiceTime[member.id] = Date.now();

      // 이전 채널이 임시 채널인 경우
      const oldChannelName = oldChannel.name;
      if (
        channels[oldChannelName] &&
        channels[oldChannelName].members[member.id]
      ) {
        delete channels[oldChannelName].members[member.id];
        if (oldChannel.members.size === 0) {
          // 10초 후에 이전 채널 삭제 예약
          const deleteTimer = setTimeout(async () => {
            if (channels[oldChannelName] && oldChannel.members.size === 0) {
              await oldChannel.delete();
              delete channels[oldChannelName];
              logger.info(oldChannelName + " 삭제되었습니다.");
            }
          }, 10000);
          channels[oldChannelName].deleteTimer = deleteTimer;
          logger.info(oldChannelName + " 삭제 예정 상태");
        }
      }

      // 새로운 채널이 임시 채널인 경우
      const newChannelName = newChannel.name;
      if (channels[newChannelName]) {
        channels[newChannelName].members[member.id] = Date.now();
        // 채널 삭제 타이머가 존재하는 경우 취소
        if (channels[newChannelName].deleteTimer) {
          clearTimeout(channels[newChannelName].deleteTimer);
          delete channels[newChannelName].deleteTimer;
          logger.info(newChannelName + " 삭제 예정 취소");
        }
      }
    } else if (!oldChannel && newChannel) {
      // 사용자가 음성 채널에 입장했을 때
      voiceTime[member.id] = Date.now();
      // 만약 임시 채널일 경우
      const channelName = newChannel.name;
      if (channels[channelName]) {
        channels[channelName].members[member.id] = Date.now();
        // 채널 삭제 타이머가 존재하는 경우 취소
        if (channels[channelName].deleteTimer) {
          clearTimeout(channels[channelName].deleteTimer);
          delete channels[channelName].deleteTimer;
          logger.info(channelName + " 삭제 예정 취소");
        }
      }
    } else if (oldChannel && !newChannel) {
      // 사용자가 음성 채널에서 퇴장했을 때
      if (voiceTime[member.id]) {
        const duration = Date.now() - voiceTime[member.id];
        const seconds = Math.floor(duration / 1000);
        userRepository.updateConnectionTime(member.id, seconds);
        delete voiceTime[member.id];
      }
      // 사용자가 임시 채널에서 퇴장했을 때 삭제
      const channelName = oldChannel.name;
      if (channels[channelName] && channels[channelName].members[member.id]) {
        delete channels[channelName].members[member.id];
      }
      if (oldChannel.members.size === 0 && channels[channelName]) {
        // 10초 후에 채널 삭제 예약
        const deleteTimer = setTimeout(async () => {
          if (channels[channelName] && oldChannel.members.size === 0) {
            await oldChannel.delete();
            delete channels[channelName];
            logger.info(channelName + " 삭제되었습니다.");
          }
        }, 10000);
        channels[channelName].deleteTimer = deleteTimer;
        logger.info(channelName + " 삭제 예정 상태");
      }
    }
  }
}

module.exports = VoiceStateUpdateInteractionEvent;
