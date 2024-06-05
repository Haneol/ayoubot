const voiceTime = {};

const { channels } = require("../controllers/channelController");
const userRepository = require("../repositories/userRepository");

class VoiceStateUpdateInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(oldState, newState) {
    const member = newState.member;
    const channel = newState.channel;

    if (!oldState.channel && newState.channel) {
      // 사용자가 음성 채널에 입장했을 때
      voiceTime[member.id] = Date.now();

      // 만약 임시 채널일 경우
      const channelName = channel.name;
      if (channels[channelName]) {
        channels[channelName].members[member.id] = Date.now();
        // 채널 삭제 타이머가 존재하는 경우 취소
        if (channels[channelName].deleteTimer) {
          clearTimeout(channels[channelName].deleteTimer);
          delete channels[channelName].deleteTimer;
          console.log(channelName + " 삭제 예정 취소");
        }
      }
    } else if (oldState.channel && !newState.channel) {
      // 사용자가 음성 채널에서 퇴장했을 때
      if (voiceTime[member.id]) {
        const duration = Date.now() - voiceTime[member.id];
        const seconds = Math.floor(duration / 1000);

        userRepository.updateConnectionTime(member.id, seconds);

        delete voiceTime[member.id];
      }

      // 사용자가 임시 채널에서 퇴장했을 때 삭제
      const channelName = oldState.channel.name;
      if (channels[channelName] && channels[channelName].members[member.id]) {
        delete channels[channelName].members[member.id];
      }

      if (oldState.channel.members.size === 0 && channels[channelName]) {
        // 10초 후에 채널 삭제 예약
        const deleteTimer = setTimeout(async () => {
          if (channels[channelName] && oldState.channel.members.size === 0) {
            await oldState.channel.delete();
            delete channels[channelName];
            console.log(channelName + " 삭제되었습니다.");
          }
        }, 10000);
        channels[channelName].deleteTimer = deleteTimer;
        console.log(channelName + " 삭제 예정 상태");
      }
    }
  }
}

module.exports = VoiceStateUpdateInteractionEvent;
