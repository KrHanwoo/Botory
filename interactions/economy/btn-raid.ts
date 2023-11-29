import { GuildMember, MessageComponentInteraction } from "discord.js";
import { Raid } from "../../features/raid";


module.exports = {
  id: 'btn-raid',
  async execute(cmd: MessageComponentInteraction) {
    if (!Raid.running || cmd.message.id != Raid.msg?.id)
      return cmd.reply({ content: '이미 끝났습니다.', ephemeral: true });
    const member = cmd.member;
    if (!(member instanceof GuildMember)) return;
    if (Raid.raiders.some(x => x.id == member.id))
      return cmd.reply({ content: '이미 누르셨습니다.', ephemeral: true });
    else {
      Raid.raiders.push(member);
      return cmd.reply({ content: '레이드 참가되었습니다.', ephemeral: true });
    }
  }
};

